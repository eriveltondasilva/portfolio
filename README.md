# Erivelton's Portfolio

Personal portfolio and blog built with Next.js and MDX.

**Live:** [erivelton.vercel.app](https://erivelton.vercel.app) · [Português (BR)](./README.pt.md)

## About

A personal site with a blog written in MDX, post series, and a project list pulled straight from GitHub. All content lives in the repository as files and is validated at build time, so invalid content never reaches production.

## Features

- **MDX blog:** post metadata in `meta.yml` validated with Zod, plus tags, authors, series and archived posts.
- **Projects from GitHub:** repositories with the `portfolio` topic become projects; other topics control highlights and status.
- **Reactions and comments:** reactions backed by Upstash Redis with rate limiting, comments via Giscus.
- **Automatic extras:** RSS feed, sitemap, Open Graph images, JSON-LD, table of contents and reading time.
- **Build-time validation:** broken metadata, images or references fail the build.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · MDX · Zod · Upstash Redis · Giscus · Bun · Vercel

## Getting started

Requires [Bun](https://bun.sh).

```bash
bun install
cp .env.example .env.local
bun run build:indexes
bun dev
```

The dev server does not regenerate the content indexes: run `bun run build:blog` after changing a `meta.yml`, `authors.yml` or `series.yml`. To create a new post, run `bun run new-post`.

## Documentation

The complete documentation is the **Manual do Blog** series (in Portuguese), published on the site: [erivelton.vercel.app/series/manual-do-blog](https://erivelton.vercel.app/series/manual-do-blog). It covers content structure, MDX components, GitHub projects, environment variables and deploy, reactions with Redis, and the automatic features.

## License

[MIT](./LICENSE)
