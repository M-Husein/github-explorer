### Deploy to GitHub Pages (simple)
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add homepage in package.json: "homepage": "https://<username>.github.io/<repo>"
3. Add scripts:
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
4. `npm run deploy`
