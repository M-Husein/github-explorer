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

```bash
# clone
git clone <repo-url>
cd github-explorer
```

# install
```bash
npm install
```

# dev server
```bash
npm run dev
```

# run tests
```bash
npm run test
```

# build
```bash
npm run build
```

## Notes
This project uses the unauthenticated GitHub API which is rate-limited (60 requests/hour). For production, add a Personal Access Token and set Authorization header in `src/api/github.ts`.
