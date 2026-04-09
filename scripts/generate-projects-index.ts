import { Octokit } from '@octokit/rest'

import { PROJECTS_INDEX_OUTPUT, Topics } from '@/lib/constants'
import { getPrimaryAuthor } from '@/lib/blog/authors'
import { getUrlPathname, formatProjectName, getProjectStatus, filterProjectTags } from '@/lib'

import { Logger, writeJson } from './utils'

import type { Project } from '@/types'

const log = new Logger()

// # Fetchers

async function fetchPortfolioProjects(): Promise<Project[]> {
  const token = process.env['GITHUB_TOKEN']
  const author = getPrimaryAuthor()
  const githubUsername = getUrlPathname(author.socials.github)

  if (!token) {
    throw new Error(
      'GITHUB_TOKEN is not set. Create a token at https://github.com/settings/tokens and add it to your .env.local',
    )
  }

  const octokit = new Octokit({ auth: token })
  log.detail(`Fetching repos for @${githubUsername}...`)

  const { data: repos } = await octokit.repos.listForUser({
    username: githubUsername as string,
    type: 'owner',
    per_page: 100,
    sort: 'full_name',
  })

  const privateCount = repos.filter((repo) => repo.private).length
  const portfolioRepos = repos.filter(
    (repo) => !repo.private && repo.topics?.includes(Topics.INCLUDE),
  )

  log.ok('repos fetched:', `${repos.length} total - ${portfolioRepos.length} included`)
  if (privateCount > 0) log.skip('private:', `${privateCount} excluded`)

  const withoutTopic = repos.length - privateCount - portfolioRepos.length
  if (withoutTopic > 0)
    log.skip('no topic:', `${withoutTopic} excluded (missing "${Topics.INCLUDE}")`)

  const featuredCount = portfolioRepos.filter((repo) =>
    repo.topics?.includes(Topics.FEATURED),
  ).length
  const wipCount = portfolioRepos.filter((repo) => repo.topics?.includes(Topics.WIP)).length
  const archivedCount = portfolioRepos.filter((repo) => repo.archived).length

  if (featuredCount > 0) log.detail(`${featuredCount} featured`)
  if (wipCount > 0) log.detail(`${wipCount} wip`)
  if (archivedCount > 0) log.skip('archived', `${archivedCount} excluded from active`)

  return portfolioRepos.map((repo) => ({
    slug: repo.name,
    name: formatProjectName(repo),
    description: repo.description ?? 'Sem descrição.',
    repository: repo.html_url,
    url: repo.homepage ?? undefined,
    tags: filterProjectTags(repo),
    status: getProjectStatus(repo),
    featured: repo.topics?.includes(Topics.FEATURED) ?? false,
  }))
}

// # Builders

async function buildProjectsIndex(projects: Project[]): Promise<void> {
  await writeJson(PROJECTS_INDEX_OUTPUT, projects)
}

// # Main

async function main(): Promise<void> {
  const startedAt = performance.now()

  log.divider()
  console.info('⏳ Generating projects index...')

  // -- Fetch ------------------------------------------------------------------

  log.section('Fetching from GitHub')
  const projects = await fetchPortfolioProjects()

  // -- Write  -----------------------------------------------------------------

  log.section('Writing index')

  await buildProjectsIndex(projects)
  log.ok('projects index:', PROJECTS_INDEX_OUTPUT)

  // -- Done  ------------------------------------------------------------------

  log.success(`✅ Done in ${(performance.now() - startedAt).toFixed(0)}ms`)
  log.divider()
}

main().catch((error) => {
  log.failure(error)
  process.exit(1)
})
