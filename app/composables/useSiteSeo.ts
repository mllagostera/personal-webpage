import {
  SITE_OG_IMAGE,
  TWITTER_HANDLE,
  absoluteUrl,
  getSiteRoute,
} from '~~/shared/site'

/**
 * Sets title, description, canonical and the whole Open Graph / Twitter block
 * for a route. Copy comes from `SITE_ROUTES`, so every page has unique metadata
 * and there is exactly one place to edit it.
 */
export const useSiteSeo = (path: string) => {
  const { awesome } = useAppConfig()

  const { title, description } = getSiteRoute(path)
  const canonical = absoluteUrl(path)
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
