import { describe, expect, it } from 'vitest';

import { ProjectStatus } from '@/lib/constants';

import { filterProjectTags, formatProjectName, getProjectStatus, toProjectSlug } from './github';

describe('toProjectSlug', () => {
  it('should lowercase the name and turn separators into hyphens', () => {
    expect(toProjectSlug('My_Repo.js')).toBe('my-repo-js');
  });

  it('should collapse consecutive non alphanumeric characters into one hyphen', () => {
    expect(toProjectSlug('a__b..c')).toBe('a-b-c');
  });

  it('should trim hyphens from both ends', () => {
    expect(toProjectSlug('_repo--')).toBe('repo');
  });

  it('should return an empty string when the name has no alphanumeric characters', () => {
    expect(toProjectSlug('___')).toBe('');
  });
});

describe('formatProjectName', () => {
  it('should split on hyphens, underscores and dots and capitalize each word', () => {
    expect(formatProjectName('my-portfolio_site.v2')).toBe('My Portfolio Site V2');
  });

  it('should ignore repeated separators', () => {
    expect(formatProjectName('a--b__c')).toBe('A B C');
  });

  it('should keep the casing of the remaining letters', () => {
    expect(formatProjectName('myRepo')).toBe('MyRepo');
  });
});

describe('getProjectStatus', () => {
  it('should prefer archived over the wip topic', () => {
    expect(getProjectStatus({ archived: true, topics: ['wip'] })).toBe(ProjectStatus.ARCHIVED);
  });

  it('should return wip when the repo has the wip topic', () => {
    expect(getProjectStatus({ archived: false, topics: ['wip'] })).toBe(ProjectStatus.WIP);
  });

  it('should return active when there is no special topic', () => {
    expect(getProjectStatus({ archived: false, topics: ['react'] })).toBe(ProjectStatus.ACTIVE);
  });

  it('should return active when the topics are missing', () => {
    expect(getProjectStatus({ archived: false })).toBe(ProjectStatus.ACTIVE);
  });
});

describe('filterProjectTags', () => {
  it('should remove utility topics and keep the order of the others', () => {
    const topics = ['portfolio', 'react', 'featured', 'nextjs', 'wip'];

    expect(filterProjectTags(topics)).toEqual(['react', 'nextjs']);
  });

  it('should return an empty list when no topics are given', () => {
    expect(filterProjectTags()).toEqual([]);
  });
});
