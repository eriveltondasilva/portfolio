import { Octokit } from '@octokit/rest';

import { GithubTopic } from '@/lib/constants';
import { getUrlPathname } from '@/lib/format';
import { PROJECTS_INDEX_OUTPUT } from '@/lib/paths';
import { projectSchema } from '@/lib/schemas';

import { runScript } from './utils';
import { readPrimaryAuthor } from './utils/content';
import {
  filterProjectTags,
  formatProjectName,
  getProjectStatus,
  toProjectSlug,
} from './utils/github';
import { checkUniqueSlugs } from './utils/validations';

import type { GithubRepo, Project } from '@/types';
import { formatZodError, throwIfErrors } from './utils/errors';
import { writeJson } from './utils/files';
import { log } from './utils/logger';

// # Fetchers

async function fetchPublicRepos(username: string): Promise<GithubRepo[]> {
  const token = process.env['GITHUB_TOKEN'];

  // The token only raises the rate limit, so a missing one must not break local builds.
  if (!token)
    log.skip(
      'token:',
      'GITHUB_TOKEN not set, using the unauthenticated rate limit',
    );

  const octokit = new Octokit(token ? { auth: token } : {});
  log.detail(`Fetching repos for @${username}...`);

  // listForUser only returns public repos; paginate avoids silently stopping at 100.
  return octokit.paginate(octokit.repos.listForUser, {
    username,
    per_page: 100,
  });
}

// # Mappers

function selectPortfolioRepos(repos: readonly GithubRepo[]): GithubRepo[] {
  return repos.filter((repo) => repo.topics?.includes(GithubTopic.INCLUDE));
}

function toProject(repo: GithubRepo): Project {
  return {
    slug: toProjectSlug(repo.name),
    name: formatProjectName(repo.name),
    description: repo.description ?? 'Sem descrição.',
    repository: repo.html_url,
    // GitHub may return an empty string when the homepage was cleared.
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

  // Slugs are derived from repo names, so "My_App" and "my-app" would collide.
  errors.push(
    ...checkUniqueSlugs(
      projects.map(({ slug, repository }) => ({ slug, source: repository })),
    ),
  );

  throwIfErrors('projects', errors);

  return projects;
}

// # Logging

function logSelection(
  repos: readonly GithubRepo[],
  portfolioRepos: readonly GithubRepo[],
): void {
  log.ok(
    'repos fetched:',
    `${repos.length} public - ${portfolioRepos.length} included`,
  );

  const withoutTopic = repos.length - portfolioRepos.length;
  if (withoutTopic > 0) {
    log.skip(
      'no topic:',
      `${withoutTopic} excluded (missing "${GithubTopic.INCLUDE}")`,
    );
  }

  const featuredCount = portfolioRepos.filter((repo) =>
    repo.topics?.includes(GithubTopic.FEATURED),
  ).length;
  const wipCount = portfolioRepos.filter((repo) =>
    repo.topics?.includes(GithubTopic.WIP),
  ).length;
  const archivedCount = portfolioRepos.filter((repo) => repo.archived).length;

  if (featuredCount > 0) log.detail(`${featuredCount} featured`);
  if (wipCount > 0) log.detail(`${wipCount} wip`);
  if (archivedCount > 0)
    log.detail(`${archivedCount} archived (kept with archived status)`);
}

// # Main

async function main(): Promise<void> {
  // Read from the YAML source: the generated authors index may not exist yet at this point.
  const author = await readPrimaryAuthor();
  const username = getUrlPathname(author.socials.github);

  log.section('Fetching from GitHub');

  const repos = await fetchPublicRepos(username);
  const portfolioRepos = selectPortfolioRepos(repos);
  logSelection(repos, portfolioRepos);

  log.section('Validating');

  const projects = validateProjects(portfolioRepos.map(toProject));
  log.ok('projects:', `${projects.length} valid`);

  log.section('Writing index');

  await writeJson(PROJECTS_INDEX_OUTPUT, projects);
  log.ok('projects index:', PROJECTS_INDEX_OUTPUT);
}

await runScript('Generating projects index', main);
