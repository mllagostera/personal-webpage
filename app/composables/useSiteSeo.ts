import {
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
  SITE_TITLE,
  TWITTER_HANDLE,
  absoluteUrl,
} from '~~/shared/site'

export interface SiteSeoOptions {
  /** Full <title> for this route. Defaults to the site title. */
  title?: string
  /** Meta description for this route. Defaults to the site description. */
  description?: string
  /** Site-relative path, used to build the canonical and og:url. */
  path?: string
}

/**
 * Sets title, description, canonical and the whole Open Graph / Twitter block
 * for a route. Every social tag is derived from `title`/`description`, so there
 * is exactly one place to change per-route copy.
 */
export const useSiteSeo = (options: SiteSeoOptions = {}) => {
  const { awesome } = useAppConfig()

  const title = options.title || SITE_TITLE
  const description = options.description || SITE_DESCRIPTION
  const canonical = absoluteUrl(options.path ?? '/')
  const image = absoluteUrl(SITE_OG_IMAGE)
  const author = awesome?.author?.name || ''

  useHead({
    link: [
      { rel: 'canonical', href: canonical },
      { rel: 'image_src', href: image },
    ],
  })

  useSeoMeta({
    title,
    description,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage: image,
    ogImageAlt: author,
    ogSiteName: author,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: author,
    twitterSite: TWITTER_HANDLE,
    twitterCreator: TWITTER_HANDLE,
  })
}
