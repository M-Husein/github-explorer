# GitHub Explorer (Vite + React + TypeScript)

Search for GitHub users and view repositories. Built with Vite, TypeScript, @tanstack/react-query, q-js-utils/request, and Tailwind CSS.

### Demo App:

**[GitHub Explorer](https://github-explorer-q.netlify.app)**

## Features
- Search GitHub users by username (shows up to 5 matches).
- Click a user to list their repositories (no limit).
- Repository details.
- Responsive and accessible.
- `@tanstack/react-query` for caching.
- `q-js-utils/request` as fetch wrapper.
- Search by voice using **[SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)**, the interface of the **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**.
- Speech content in repository detail page using **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**.
- Vitest.

## Setup
Requirements: Node 18+, npm or pnpm

### clone
```bash
git clone https://github.com/M-Husein/github-explorer.git
cd github-explorer
```

or download this repo.

First is important copy or rename file `.env.example` to `.env` and configuration your **[GitHub access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)**.

Then install dependencies:

### install
```bash
npm install
```

### dev server
```bash
npm run dev
```

### run tests
```bash
npm run test
```

### build
```bash
npm run build
```

## About This Project

This project was built using **React (with Vite)** instead of a full-stack React framework like **Next.js** or **Remix**.  
The main reason is that the focus of this test/project is on the **frontend implementation**, including:

- Component design (UI/UX with shadcn/ui and Tailwind CSS).
- State management (with `@tanstack/react-query`).
- API consumption (with GitHub REST API using `q-js-utils/request`).
- User interaction (search, speech input, Accordion-based user/repo display).

Using Vite keeps the setup lightweight and straightforward, ensuring all effort goes into the **frontend problem-solving** rather than configuring routing, server rendering, or API routes that aren’t required in this scope.

---

## API Requests and GitHub Authorization

All data comes directly from the **GitHub REST API** (`https://api.github.com`).  

In this project, I am **sending the `Authorization` header directly from the frontend** for simplicity:

```ts
import { request } from 'q-js-utils/request';

const GITHUB_BASE = 'https://api.github.com';

const headers = {
  Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN
};

export const searchUsers = async (q: string, limit = 5): Promise<GitHubUser[]> => {
  if (!q) return [];
  const res = await request(GITHUB_BASE + '/search/users', { headers, query: { q, per_page: limit } });
  return (res.items || []) as GitHubUser[];
}
```

## Recommended Production Approach

In production, to handle higher rate limits and keep tokens safe:
1. Move API requests to a backend service (Node.js, Laravel, etc.).
2. Store the GitHub token securely on the server (not exposed to clients).
3. Forward requests from the frontend to the backend, which attaches the token.

## Why Not Next.js or Remix?

- Next.js and Remix are great for full-stack React apps with SSR/SSG, routing, and server APIs.
- In this test/project, the focus is frontend-only, so features like SSR or backend routing are unnecessary.
- Using Vite + React allows:
  - Fast local development with minimal boilerplate.
  - Clean focus on components, UI, and frontend data fetching.
  - Easy future migration: this frontend can later be integrated into Next.js or Remix if backend features are required.
