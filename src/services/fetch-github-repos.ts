import { url } from '@/config'

export async function fetchGithubRepos() {
  const query = new URLSearchParams({ sort: 'created', direction: 'desc' })
  const res = await fetch(`${url.githubRepos}?${query}`, {
    cache: 'force-cache',
  })
  return await res.json()
}
