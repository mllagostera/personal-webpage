/**
 * Single source of truth for site-wide SEO constants.
 * Imported from both the Vue app (`~~/shared/site`) and Nitro server routes,
 * so the canonical domain is never written by hand twice.
 */

export const SITE_URL = 'https://mllagostera.com'

export const SITE_TITLE = 'Miquel Llagostera | DevOps — PKI y firma electrónica'

export const SITE_DESCRIPTION =
  'DevOps en Barcelona: CI/CD, AWS y Kubernetes. 18 años en PKI y firma electrónica, del código al equipo y a la plataforma.'

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
      'Trayectoria en Firmaprofesional y Logalty: de desarrollador PKI a Software Development Manager, Scrum Master y DevOps.',
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/projects',
    title: 'Casos de estudio y open source | Miquel Llagostera',
    description:
      'Casos de estudio de CI/CD y DevOps con el problema, la decisión y el resultado medido, y mis repositorios open source en GitHub.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  // Case studies. The slug must match `cv.caseStudies` in every locale: the
  // page validates its path against this list and 404s on anything else.
  {
    path: '/projects/cicd-firmaprofesional',
    title: 'De 2 horas a 5 minutos por despliegue | Miquel Llagostera',
    description:
      'Caso de estudio: un nuevo proceso de CI/CD con Docker y Ansible redujo los despliegues de 2 horas a 5 minutos, con Scrum en 7 equipos.',
    changefreq: 'yearly',
    priority: 0.7,
  },
  {
    path: '/projects/pipelines-coverage',
    title: '300 repositorios con pipeline de CI/CD | Miquel Llagostera',
    description:
      'Caso de estudio: cobertura de Bitbucket Pipelines del 6 % al 75 % de los repositorios y limpieza de 700 a 400, sobre AWS y Kubernetes.',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/projects/personal-webpage',
    title: 'Esta web como banco de pruebas | Miquel Llagostera',
    description:
      'Caso de estudio: CV en tres idiomas con Nuxt 4 y SSR en AWS Amplify, con la API de GitHub y un bot de Telegram para el contacto.',
    changefreq: 'monthly',
    priority: 0.6,
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
