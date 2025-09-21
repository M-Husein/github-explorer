import { request } from 'q-js-utils/request';

const GITHUB_BASE = 'https://api.github.com';

export type GitHubUser = {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string
  followers?: number
  bio?: string
  location: string
  blog: string
}

export type GitHubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string
  owner: {
    login: string
    html_url: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  pushed_at: string
  homepage: string
  clone_url: string
  ssh_url: string
  full_name: string
  default_branch: string
  watchers_count: number
  topics?: string[]
  private?: boolean
}

type GitHubReadme = {
  content: string
  download_url: string
}

export const searchUsers = async (q: string, limit = 5): Promise<GitHubUser[]> => {
  if (!q) return [];
  const res = await request(GITHUB_BASE + '/search/users', { query: { q, per_page: limit } });
  return (res.items || []) as GitHubUser[];
}

export const getUserRepo = async (username: string, repo: string): Promise<GitHubRepo> => {
  return await request(`${GITHUB_BASE}/repos/${username}/${repo}`);
}

export const getReadme = async (username: string, repo: string): Promise<GitHubReadme> => {
  return await request(`${GITHUB_BASE}/repos/${username}/${repo}/readme`);
}

export const fetchUserRepos = async (username: string, perPage = 100): Promise<GitHubRepo[]> => {
  let page = 1;
  const all: GitHubRepo[] = [];

  while (true) {
    const items = (await request(`${GITHUB_BASE}/users/${username}/repos`, { query: { per_page: perPage, page } })) as GitHubRepo[];
    if (!items || items.length === 0) break;
    all.push(...items);
    if (items.length < perPage) break;
    page += 1;
  }

  return all;
}
