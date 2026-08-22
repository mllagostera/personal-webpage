# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## The project

Miquel Llagostera's personal site, live at **https://mllagostera.com**: a digital CV and portfolio that doubles as a sandbox for trying out current web tooling. It is one small site with four pages — profile, experience and education, projects, contact — in three languages.

**Nuxt 4 with SSR, deployed to AWS Amplify compute.** The nitro preset is `aws-amplify` and `srcDir` is `app/`, so this is server-rendered, not a static export: anything that must reach a crawler has to be rendered on the server. Styling is Tailwind 4 (utilities, plus a few SCSS files for what utilities cannot express), UI comes from Headless UI and `@nuxt/icon`, i18n from `@nuxtjs/i18n`, and reactivity helpers from VueUse.

Two external integrations, both behind server routes: the GitHub REST API feeds the open source section, and the Telegram Bot API receives contact form submissions.

The site owner reads Spanish; the repository is written in English (see [Language](#language)).

## Repository layout

```
app/                      srcDir — everything Vue
  app.vue                 root component: global head, font preloads, contact modal
  error.vue               error page for every status; 404 gets its own treatment
  app.config.ts           untranslated identity: name, email, social links, navbar menus
  pages/                  one file per route (index, experience, projects, contact)
  layouts/page.vue        the only layout: skip link, navbar, <main>, footer
  components/             navbar, language selector, back-to-top
    curriculumVitae/      one component per CV section
    contact/              modal, form, contact details
  composables/            useSiteSeo, useProfileJsonLd, useUi (contact modal state)
  utils/                  TypeScript interfaces for the CV data and layout config
  plugins/                legacy-hash.client.ts — client-side hop for old #anchors
  assets/css|scss/        Tailwind theme tokens, global styles, CV-specific styles
i18n/locales/             es-ES.ts, es-CA.ts, en-US.ts — UI strings *and* all CV content
shared/site.ts            SEO single source of truth, imported by both Vue and Nitro
server/
  routes/                 sitemap.xml
  api/                    contact form, GitHub repos
  middleware/             noindex on non-production hosts
public/                   favicon, robots.txt, social thumbnail
icon-collections.config.ts  trims icon collections down to what the app uses
nuxt.config.ts            modules, routeRules (legacy 301s), i18n, runtimeConfig
amplify.yml               Amplify build settings
.github/workflows/        ESLint on pull requests
```

Generated and never committed: `.nuxt/`, `.amplify-hosting/`, `node_modules/`.

## Language

**Everything written into the repository is in English**: documentation and Markdown files, commit messages, PR titles and bodies, branch names, code, identifiers, and comments. Chat replies to the repository owner are in Spanish.

The exception is site content, which is user-facing copy and lives in the locale files (`es-ES`, `es-CA`, `en-US`). SEO copy in `shared/site.ts` (titles, descriptions) is deliberately Spanish-only: it is not localised per request.

`SEO-PASOS-MANUALES.md` predates this rule and is still in Spanish. Leave it be unless asked; write anything new in English.

## Branches and commits

Branch from `main`, and name the branch for the kind of work it carries:

| Prefix | For |
|---|---|
| `feature/` | New or changed behaviour a visitor can see — a page, a section, a redesign, a bug fix to any of it |
| `chore/` | Maintenance with no visible change — dependency updates, CI, tooling, refactors, documentation |
| `hotfix/` | An urgent repair of something broken in production, kept as small as the fix requires |

Use a short kebab-case description after the prefix: `feature/custom-404-page`, `chore/update-eslint-and-sass`, `hotfix/contact-form-rate-limit`.

Everything goes from `main` back to `main`: branch off it, and open the pull request against it. CI runs ESLint on every pull request.

Commit messages explain **why** the change exists, not just what changed — the diff already says what. One concern per commit: a dependency bump and a feature belong in separate commits.

## Commands

```sh
npm run dev        # dev server
npm run build      # production build -> .amplify-hosting/
npm run preview    # serve the build
npm run lint       # eslint (also runs in CI on every pull request)
npm run lint:fix
```

There is **no test suite**. Verify changes by building and exercising the built server:

```sh
npm run build && node .amplify-hosting/compute/default/server.js   # listens on :3000
```

`npm run build` currently emits **29 warnings** — `@apply` from lightningcss and Tailwind sourcemap notices. That is the expected baseline; only warnings beyond those are new. `PLUGIN_TIMINGS` warnings are timing-based and appear nondeterministically.

Amplify installs with `npm ci --legacy-peer-deps` (see `amplify.yml`); CI uses plain `npm ci`. Both need `package-lock.json` to be in sync with `package.json` — when it is not, `npm ci` falls back to a resolving install, `vite` stops being hoisted, and the `postinstall` (`nuxt prepare`) fails to resolve it from `@tailwindcss/vite`.

## Architecture

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

The error page is the deliberate exception: it is `noindex`, so it stays out of `SITE_ROUTES` and takes its titles from the `ERROR_*` constants in the same file.

### The error page

`app/error.vue` replaces `app.vue` for every unhandled error, on the server and on the client. Anything `app.vue` provides has to be repeated there — which is why the contact modal is mounted in both: the navbar button opens it, and `app.vue` does not render on an error.

Only 404 carries the Star Wars line; every other status renders the same layout with neutral copy. The real HTTP status is preserved in both cases.

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
- Dependency updates stay inside the ranges in `package.json`. A major — or a transitive major that moves the build toolchain, like vite or TypeScript — is its own change, proposed before it is applied.
- `.env` is committed and `.gitignore` has its entry commented out. The Search Console token in it is public by design, but do not add real secrets to that file.
