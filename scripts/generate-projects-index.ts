import { Octokit } from '@octokit/rest'

import { PROJECTS_INDEX_OUTPUT, ProjectStatus } from '@/lib/constants'

import { logSuccess, writeJson } from './utils'

import type { Project, GithubRepo } from '@/types'

const GITHUB_USERNAME = 'eriveltondasilva'

enum Topics {
  INCLUDE = 'portfolio',
  FEATURED = 'featured',
  WIP = 'wip',
}

const UTILITY_TOPICS = new Set(Object.values(Topics))

function getStatus(repo: GithubRepo): ProjectStatus {
  if (repo.archived) return ProjectStatus.ARCHIVED
  if (repo.topics?.includes(Topics.WIP)) return ProjectStatus.WIP
  return ProjectStatus.ACTIVE
}

function toProject(repo: GithubRepo): Project {
  return {
    slug: repo.name,
    name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description ?? 'Sem descrição.',
    repository: repo.html_url,
    url: repo.homepage || undefined,
    tags: (repo.topics ?? []).filter(
      (tag) => !UTILITY_TOPICS.has(tag as Topics),
    ),
    status: getStatus(repo),
    featured: repo.topics?.includes(Topics.FEATURED) ?? false,
  }
}

async function fetchPortfolioProjects(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    throw new Error(
      'GITHUB_TOKEN is not set. Create a token at https://github.com/settings/tokens and add it to your .env.local',
    )
  }

  const octokit = new Octokit({ auth: token })

  console.info(`> Fetching repos for @${GITHUB_USERNAME}...`)

  const { data: repos } = await octokit.repos.listForUser({
    username: GITHUB_USERNAME,
    type: 'owner',
    per_page: 100,
  })

  const portfolioRepos = repos.filter((repo) =>
    repo.topics?.includes(Topics.INCLUDE),
  )

  console.info(
    `> Found ${portfolioRepos.length} repo(s) with topic "${Topics.INCLUDE}".`,
  )

  return portfolioRepos.map(toProject)
}

// ###

async function buildProjectsIndex(projects: Project[]): Promise<void> {
  const sorted = projects.toSorted((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return a.name.localeCompare(b.name, 'pt-BR')
  })

  await writeJson(PROJECTS_INDEX_OUTPUT, sorted)
  console.info(`> content/indexes/projects.json → ${sorted.length} project(s)`)
}

// ###

async function main(): Promise<void> {
  console.info('\n⏳ Generating projects index...\n')

  const projects = await fetchPortfolioProjects()
  await buildProjectsIndex(projects)

  logSuccess('\n✔ Projects index generated successfully.')
}

main().catch((error: unknown) => {
  console.error('❌ Error generating projects index:')
  console.error(error instanceof Error ? error.message : error)
  console.error('> Fix the errors above and try again.\n')
  process.exit(1)
})
