import { Octokit } from '@octokit/rest'

import { PROJECTS_INDEX_OUTPUT, ProjectStatus } from '#/lib/constants'
import { getPrimaryAuthor } from '#/lib/blog/authors'
import { getGitHubUsername } from '#/lib'

import { log, writeJson } from './utils'

import type { Project, GithubRepo } from '#/types'

enum Topics {
  INCLUDE = 'portfolio',
  FEATURED = 'featured',
  WIP = 'wip',
}

const UTILITY_TOPICS = new Set(Object.values(Topics))

function getProjectName(repo: GithubRepo): string {
  return repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function getStatus(repo: GithubRepo): ProjectStatus {
  if (repo.archived) return ProjectStatus.ARCHIVED
  if (repo.topics?.includes(Topics.WIP)) return ProjectStatus.WIP

  return ProjectStatus.ACTIVE
}

function getTags(repo: GithubRepo): string[] {
  return (repo.topics ?? []).filter((tag) => !UTILITY_TOPICS.has(tag as Topics))
}

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

  const portfolioRepos = repos.filter((repo) =>
    repo.topics?.includes(Topics.INCLUDE),
  )

  log.ok(
    'repos fetched',
    `${repos.length} total · ${portfolioRepos.length} with topic "${Topics.INCLUDE}"`,
  )

  // Count status categories
  const featured = portfolioRepos.filter((repo) =>
    repo.topics?.includes(Topics.FEATURED),
  ).length
  const wip = portfolioRepos.filter((repo) =>
    repo.topics?.includes(Topics.WIP),
  ).length
  const archived = portfolioRepos.filter((repo) => repo.archived).length

  // Log status counts
  if (featured > 0) log.detail(`${featured} featured`)
  if (wip > 0) log.detail(`${wip} wip`)
  if (archived > 0) log.skip('archived', `${archived} excluded from active`)

  return portfolioRepos.map((repo) => ({
    slug: repo.name,
    name: getProjectName(repo),
    description: repo.description ?? 'Sem descrição.',
    repository: repo.html_url,
    url: repo.homepage || null,
    tags: getTags(repo),
    status: getStatus(repo),
    featured: repo.topics?.includes(Topics.FEATURED) ?? false,
  }))
}

// # Builders

async function buildProjectsIndex(projects: Project[]): Promise<void> {
  const sorted = projects.toSorted((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1

    return a.name.localeCompare(b.name, 'pt-BR')
  })

  await writeJson(PROJECTS_INDEX_OUTPUT, sorted)
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

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  log.failure(message)
  process.exit(1)
})
