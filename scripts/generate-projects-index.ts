import { Octokit } from '@octokit/rest'

import { PROJECTS_INDEX_OUTPUT, Topics } from '@/lib/constants'
import { getPrimaryAuthor } from '@/lib/blog/authors'
import {
  getGitHubUsername,
  getProjectName,
  getProjectStatus,
  getProjectTags,
} from '@/lib'

import { log, writeJson } from './utils'

import type { Project } from '@/types'

// # Fetchers

async function fetchPortfolioProjects(): Promise<Project[]> {
  const token = process.env['GITHUB_TOKEN']
  const githubUsername = getGitHubUsername(getPrimaryAuthor())

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

  const portfolioRepos = repos.filter(
    (repo) => !repo.private && repo.topics?.includes(Topics.INCLUDE),
  )

  // Log results
  log.ok(
    'repos fetched',
    `${repos.length} total · ${portfolioRepos.length} with topic "${Topics.INCLUDE}"`,
  )

  // Count status categories
  const featuredCount = portfolioRepos.filter((repo) =>
    repo.topics?.includes(Topics.FEATURED),
  ).length
  const wipCount = portfolioRepos.filter((repo) =>
    repo.topics?.includes(Topics.WIP),
  ).length
  const archivedCount = portfolioRepos.filter((repo) => repo.archived).length

  // Log status counts
  if (featuredCount > 0) log.detail(`${featuredCount} featured`)
  if (wipCount > 0) log.detail(`${wipCount} wip`)
  if (archivedCount > 0)
    log.skip('archived', `${archivedCount} excluded from active`)

  return portfolioRepos.map((repo) => ({
    slug: repo.name,
    name: getProjectName(repo),
    description: repo.description ?? 'Sem descrição.',
    repository: repo.html_url,
    url: repo.homepage ?? undefined,
    tags: getProjectTags(repo),
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
  console.info('\n⏳ Generating projects index...')

  // -- Fetch ------------------------------------------------------------------

  log.section('Fetching from GitHub:')
  const projects = await fetchPortfolioProjects()

  // -- Write  -----------------------------------------------------------------

  log.section('Writing index:')

  await buildProjectsIndex(projects)
  log.ok(PROJECTS_INDEX_OUTPUT, `${projects.length} project(s)`)

  // -- Done  ------------------------------------------------------------------

  const elapsed = (performance.now() - startedAt).toFixed(0)
  log.success(`\n✔ Done in ${elapsed}ms`)
}

main().catch((error) => {
  log.failure(error)
  process.exit(1)
})
