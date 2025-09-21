# GitHub User Search (Vite + React + TypeScript)

Search for GitHub users and view repositories. Built with Vite, TypeScript, @tanstack/react-query, ky, and Tailwind CSS.

## Features
- Search GitHub users (shows up to 5 matches)
- Click a user to list their repositories (no limit)
- Responsive and accessible
- React Query for caching
- ky as fetch wrapper
- Vitest

## Setup

Requirements: Node 18+, npm or pnpm

```bash
# clone
git clone <repo-url>
cd github-user-search-vite-ts

# install
npm install

# dev server
npm run dev

# run tests
npm run test

# build
npm run build
```

## Notes
This project uses the unauthenticated GitHub API which is rate-limited (60 requests/hour). For production, add a Personal Access Token and set Authorization header in `src/api/github.ts`.
