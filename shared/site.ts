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

/**
 * Titles for the error page. Deliberately outside `SITE_ROUTES`: the error page
 * is `noindex` and must never reach the sitemap, but its <title> still belongs
 * with the rest of the SEO copy instead of being written inside a component.
 */
export const ERROR_404_TITLE = 'Página no encontrada | Miquel Llagostera'

export const ERROR_GENERIC_TITLE = 'Error inesperado | Miquel Llagostera'

export interface SiteRoute {
  path: string
  /** Unique <title> for the route. Never repeated across pages. */
  title: string
  /** Unique meta description, kept under 155 characters. */
  description: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

/**
 * Every indexable route, with its own title and description. Consumed by the
 * pages (via `useSiteSeo`) and by the sitemap, so both can never drift.
 */
export const SITE_ROUTES: SiteRoute[] = [
  {
    path: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    path: '/experience',
    title: 'Experiencia y formación | Miquel Llagostera',
    description:
      'Trayectoria como Scrum Master y Software Development Manager en Firmaprofesional y Logalty: PKI, firma electrónica y equipos ágiles.',
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/projects',
    title: 'Proyectos y open source | Miquel Llagostera',
    description:
      'Proyectos personales y contribuciones open source: Nuxt, Vue, Symfony y las herramientas con las que trabajo cada día.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/contact',
    title: 'Contacto | Miquel Llagostera',
    description:
      'Hablemos de agilidad, PKI o desarrollo de software. Escríbeme por email o con el formulario y te respondo lo antes posible.',
    changefreq: 'yearly',
    priority: 0.6,
  },
]

/** Looks up a route's SEO metadata by path. */
export const getSiteRoute = (path: string): SiteRoute => {
  const route = SITE_ROUTES.find((r) => r.path === path)
  if (!route) throw new Error(`[site] unknown route: ${path}. Add it to SITE_ROUTES.`)
  return route
}
