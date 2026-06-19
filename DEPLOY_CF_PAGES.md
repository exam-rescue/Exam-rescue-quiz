# Exam Rescue - Deploy to Cloudflare Pages

This guide walks you through deploying the Exam Rescue quiz platform to Cloudflare Pages with a D1 database.

## Prerequisites

- A [Cloudflare](https://dash.cloudflare.com/) account
- [Node.js](https://nodejs.org/) v20+ installed locally
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed: `npm install -g wrangler`

---

## 1. Create a D1 Database

```bash
wrangler d1 create exam-rescue-db
```

This will output a `database_id`. Copy it and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "exam-rescue-db"
database_id = "<YOUR_DATABASE_ID_HERE>"
```

## 2. Run Database Migrations

Apply schema and seed data:

```bash
# Apply all migrations to remote D1
wrangler d1 migrations apply exam-rescue-db --remote

# To apply locally for local dev:
wrangler d1 migrations apply exam-rescue-db --local
```

## 3. Connect GitHub Repo to Cloudflare Pages

1. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **"Create a project"**
3. Connect to your GitHub repository: `exam-rescue/Exam-rescue-quiz`
4. Configure build settings:

| Setting | Value |
|---------|-------|
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output directory** | `.vercel/output/static` |
| **Node.js version** | `20` |

## 4. Add D1 Binding

In the Cloudflare Pages project settings:

1. Go to **Settings → Functions → D1 database bindings**
2. Add a binding:
   - **Variable name:** `DB`
   - **D1 database:** select `exam-rescue-db`

## 5. Environment Variables

Add the following environment variable in **Settings → Environment variables**:

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `20` |

## 6. Deploy

### Option A: Automatic (via Git push)

Every push to the `main` branch will trigger an automatic deployment.

### Option B: Manual deploy via CLI

```bash
# Build
npx @cloudflare/next-on-pages

# Deploy
npx wrangler pages deploy .vercel/output/static
```

## 7. Local Development (with D1)

```bash
# Start local dev server with D1 binding
npx wrangler pages dev .vercel/output/static --compatibility-flags=nodejs_compat --binding DB=local
```

Or use the npm script:

```bash
npm run pages:dev
```

## Project Scripts

```bash
# Build for Cloudflare Pages
npm run pages:build

# Local dev with Cloudflare D1
npm run pages:dev

# Deploy to Cloudflare Pages
npm run pages:deploy

# Run D1 migrations (remote)
wrangler d1 migrations apply exam-rescue-db --remote
```

## Architecture Overview

```
Next.js 16 (App Router)
  ↓ @cloudflare/next-on-pages
Cloudflare Pages (Edge Runtime)
  ↓ D1 binding
Cloudflare D1 (SQLite-compatible database)
```

- **API Routes** use `export const runtime = 'edge'` for edge compatibility
- **D1 queries** use parameterized queries (`?` placeholders) for SQL injection prevention
- **Fallback data** is served from embedded question bank when D1 is unavailable
- All 40 quiz questions are seeded in the D1 database via migration `0002_seed_data.sql`

## Troubleshooting

### Build fails
- Ensure `NODE_VERSION` is set to `20` in Cloudflare Pages settings
- Check that all imports use relative paths (not absolute URLs)

### D1 not working
- Verify the binding name is exactly `DB` (case-sensitive)
- Make sure migrations have been applied: `wrangler d1 migrations apply exam-rescue-db --remote`

### API returns fallback data
- This is expected behavior when D1 binding is not available
- Check D1 binding configuration in Cloudflare Pages settings
