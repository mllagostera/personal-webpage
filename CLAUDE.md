# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

**Everything written into the repository is in English**: commit messages, PR titles and bodies, code, identifiers, and comments. Chat replies to the repository owner are in Spanish.

The exception is site content, which is user-facing copy and lives in the locale files (`es-ES`, `es-CA`, `en-US`). SEO copy in `shared/site.ts` (titles, descriptions) is deliberately Spanish-only: it is not localised per request.

## Commands

```sh
npm run dev        # dev server
npm run build      # production build -> .amplify-hosting/
npm run preview    # serve the build
npm run lint       # eslint (also runs in CI on PRs to main and development)
npm run lint:fix
```

There is **no test suite**. Verify changes by building and exercising the built server:

```sh
npm run build && node .amplify-hosting/compute/default/server.js   # listens on :3000
```

`npm run build` currently emits **29 warnings** — `@apply` from lightningcss and Tailwind sourcemap notices. That is the expected baseline; only warnings beyond those are new. `PLUGIN_TIMINGS` warnings are timing-based and appear nondeterministically.

Amplify installs with `npm ci --legacy-peer-deps` (see `amplify.yml`); CI uses plain `npm ci`.

## Architecture

**Nuxt 4, SSR.** `srcDir` is `app/`, and the nitro preset is `aws-amplify`, so this is server-rendered on Amplify compute — not a static export. Anything that must reach a crawler has to be rendered on the server.

### Content lives in the locale files, not in components

All CV data — personal info, work experience, education, skills, projects — is in `i18n/locales/{es-ES,es-CA,en-US}.ts` under the `cv` key. Components read it with `tm()` and unwrap each value with `rt()`; they hold no content of their own.

Consequences worth remembering:

- A content fix must be applied to **all three locales**, which have to stay structurally identical.
- Adding or removing a field means touching the three locales, the interface in `app/utils/curriculumVitae.ts`, and the component that renders it.

`app/app.config.ts` holds identity that is not translated: name, email, social links, and the navbar menu definitions.

### SEO has a single source of truth

`shared/site.ts` is imported by both the Vue app and Nitro, and owns the canonical domain, the social image, the X handle, and `SITE_ROUTES` — every indexable route with its own title and description.

- **Adding a page means adding it to `SITE_ROUTES`.** The sitemap and the page metadata both read from there, so they cannot drift.
- Pages call `useSiteSeo('/path')`, which derives title, description, canonical and the whole Open Graph / Twitter block. **Never hand-write meta tags in a component** — that is what this replaced.
- `useProfileJsonLd()` builds the schema.org `ProfilePage` from the same i18n messages and `app.config.ts` links. It belongs on `/` only.

### Server routes

| Path | Purpose |
|---|---|
| `server/routes/sitemap.xml.ts` | Sitemap generated from `SITE_ROUTES` |
| `server/api/github/repos.get.ts` | Public repos, cached 1 h; returns `[]` on failure so the section hides |
| `server/api/contact.post.ts` | Contact form → Telegram, with honeypot, timing check and rate limiting |
| `server/middleware/noindex-non-production.ts` | `X-Robots-Tag: noindex` on preview and local hosts |

The noindex middleware matches non-production hosts **explicitly** rather than negating production. Keep it that way: a detection slip should leave a preview indexable, never de-index the live site.

`public/` shadows Nitro routes, so a file there wins over a route of the same name — `sitemap.xml` must not exist in both.

### Legacy anchors

The site used to be one page with `#anchor` navigation. Two mechanisms keep those links alive:

- `routeRules` in `nuxt.config.ts` — real 301s for the old ids in path form (`/workExperience` → `/experience`).
- `app/plugins/legacy-hash.client.ts` — a client-side hop for the hash form.

A URL fragment never reaches the server, so `/#workExperience` **cannot** be answered with a 301. The client plugin is the only option, and it runs on `app:mounted`: redirecting earlier, while plugins are still initialising, happens before the router is ready and is silently dropped.

## Constraints

- **No new dependencies** unless they are official Nuxt modules, and justify them first.
- SEO and content work must not change the visual design.
- `.env` is committed and `.gitignore` has its entry commented out. The Search Console token in it is public by design, but do not add real secrets to that file.
