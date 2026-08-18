/**
 * Single source of truth for site-wide SEO constants.
 * Imported from both the Vue app (`~~/shared/site`) and Nitro server routes,
 * so the canonical domain is never written by hand twice.
 */

export const SITE_URL = 'https://mllagostera.com'

export const SITE_TITLE = 'Miquel Llagostera | Scrum Master y Agile Coach — PKI y firma electrónica'

export const SITE_DESCRIPTION =
  'Scrum Master con raíces técnicas: PKI y firma electrónica en Barcelona. Del código al equipo ágil, esta es mi trayectoria.'

/** Social preview image, relative to `public/`. Must be ~1200x630. */
export const SITE_OG_IMAGE = '/thumbnail.png'

/** X/Twitter handle, used for both `twitter:site` and `twitter:creator`. */
export const TWITTER_HANDLE = '@vansid'

/** Turns a site-relative path into an absolute URL on the canonical domain. */
export const absoluteUrl = (path: string = '/'): string => new URL(path, SITE_URL).href

export interface SiteRoute {
  path: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

/** Every indexable route, consumed by the sitemap. Keep in sync when adding pages. */
export const SITE_ROUTES: SiteRoute[] = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
]
