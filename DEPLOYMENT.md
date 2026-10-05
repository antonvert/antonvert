# Deployment: antonvert-preview.pages.dev

This repository deploys the Anton Vert preview site to the existing Cloudflare Pages project `antonvert-preview`.

## Automatic deployment

Workflow:

`.github/workflows/deploy-anton-preview.yml`

A deployment is triggered on pushes to `main` when any of these paths change:

- `index.html`
- `robots.txt`
- `assets/**`

The workflow prepares a clean `dist/` directory and deploys only the public site files with Cloudflare Wrangler.

## Required GitHub Actions secrets

Repository Settings → Secrets and variables → Actions:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The Cloudflare API token should be restricted to the relevant account and have:

- Account → Cloudflare Pages → Edit

## Cloudflare project

Project name: `antonvert-preview`

Target URL: https://antonvert-preview.pages.dev/

For Direct Upload projects, make sure the Cloudflare Pages production branch is `main`. If it is not, update the Pages project production branch to `main` before the first CI deployment.

## Smoke test

After the two GitHub secrets are configured:

1. Open GitHub Actions.
2. Run the `Deploy antonvert-preview` workflow manually once.
3. Confirm the workflow succeeds.
4. Confirm https://antonvert-preview.pages.dev/ serves the current `main` version.

After that, ordinary edits committed to `main` deploy automatically.
