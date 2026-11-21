import { Octokit } from '@octokit/rest';

import { projectSchema } from '@/lib/schemas';
import { getUrlPathname } from '@/lib/format';
import { GithubTopic } from '@/lib/constants';

import { PROJECTS_INDEX_OUTPUT } from './utils/paths';
import { runScript } from './utils/run-script';
import { readPrimaryAuthor } from './utils/content';
import {
  filterProjectTags,
  formatProjectName,
  getProjectStatus,
  toProjectSlug,
} from './utils/github';
import { checkUniqueSlugs } from './utils/validations';
import { BuildError, formatZodError, getErrorMessage, throwIfErrors } from './utils/errors';
import { writeJson } from './utils/files';
import * as logger from './utils/logger';

import type { Project } from '@/types';
import type { GithubRepo } from './utils/github';

// # Fetchers

const REPOS_PER_PAGE = 100;

async function fetchPublicRepos(username: string): Promise<GithubRepo[]> {
  const token = process.env['GITHUB_TOKEN'];

  if (!token) logger.warn('token:', 'GITHUB_TOKEN not set, using the unauthenticated rate limit');

  const octokit = new Octokit(token ? { auth: token } : {});
  logger.detail(`Fetching repos for @${username}...`);

  try {
    return await octokit.paginate(octokit.repos.listForUser, {
      username,
      per_page: REPOS_PER_PAGE,
    });
  } catch (cause) {
    throw new BuildError('projects', [
      `Failed to fetch repos for @${username}: ${getErrorMessage(cause)}`,
    ]);
  }
}

// # Mappers

function selectPortfolioRepos(repos: readonly GithubRepo[]): GithubRepo[] {
  return repos.filter((repo) => repo.topics?.includes(GithubTopic.INCLUDE));
}

function toProject(repo: GithubRepo): Project {
  return {
    slug: toProjectSlug(repo.name),
    name: formatProjectName(repo.name),
    description: repo.description || 'Sem descrição.',
    repository: repo.html_url,
    url: repo.homepage || undefined,
    tags: filterProjectTags(repo.topics),
    status: getProjectStatus(repo),
    featured: repo.topics?.includes(GithubTopic.FEATURED) ?? false,
  };
}

function validateProjects(candidates: readonly Project[]): Project[] {
  const errors: string[] = [];

  const projects = candidates.flatMap((candidate) => {
    const result = projectSchema.safeParse(candidate);

    if (result.success) return [result.data];

    errors.push(formatZodError(candidate.repository, result.error));
    return [];
  });

  errors.push(
    ...checkUniqueSlugs(projects.map(({ slug, repository }) => ({ slug, source: repository }))),
  );

  throwIfErrors('projects', errors);

  return projects;
}

// # Logging

function logSelection(repos: readonly GithubRepo[], portfolioRepos: readonly GithubRepo[]): void {
  logger.ok('repos fetched:', `${repos.length} public - ${portfolioRepos.length} included`);

  const withoutTopic = repos.length - portfolioRepos.length;
  if (withoutTopic > 0) {
    logger.skip('no topic:', `${withoutTopic} excluded (missing "${GithubTopic.INCLUDE}")`);
  }

  const featuredCount = portfolioRepos.filter((repo) =>
    repo.topics?.includes(GithubTopic.FEATURED),
  ).length;
  const wipCount = portfolioRepos.filter((repo) => repo.topics?.includes(GithubTopic.WIP)).length;
  const archivedCount = portfolioRepos.filter((repo) => repo.archived).length;

  if (featuredCount > 0) logger.detail(`${featuredCount} featured`);
  if (wipCount > 0) logger.detail(`${wipCount} wip`);
  if (archivedCount > 0) logger.detail(`${archivedCount} archived (kept with archived status)`);
}

// # Main

async function main(): Promise<void> {
  const author = await readPrimaryAuthor();
  const username = getUrlPathname(author.socials.github);

  logger.section('Fetching from GitHub');

  const repos = await fetchPublicRepos(username);
  const portfolioRepos = selectPortfolioRepos(repos);
  logSelection(repos, portfolioRepos);

  logger.section('Validating');

  const projects = validateProjects(portfolioRepos.map(toProject));
  logger.ok('projects:', `${projects.length} valid`);

  logger.section('Writing index');

  await writeJson(
    PROJECTS_INDEX_OUTPUT,
    projects.toSorted((a, b) => a.slug.localeCompare(b.slug)),
  );
  logger.ok('projects index:', PROJECTS_INDEX_OUTPUT);
}

await runScript('Generating projects index', main);
