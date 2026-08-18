/**
 * Keeps preview and local hosts out of search results.
 *
 * Amplify branch previews serve the whole site on a public *.amplifyapp.com
 * host, which Google can crawl and treat as duplicate content. The canonical
 * tags point at production, but a `noindex` header settles it.
 *
 * Non-production hosts are matched explicitly, rather than treating "anything
 * that is not production" as a preview: if host detection ever misbehaves, the
 * worst case here is a preview that stays indexable — never a production site
 * that de-indexes itself.
 */
const NON_PRODUCTION_HOST = /(\.amplifyapp\.com|^localhost|^127\.0\.0\.1)(:\d+)?$/i

export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true })

  if (NON_PRODUCTION_HOST.test(host)) {
    setHeader(event, 'x-robots-tag', 'noindex, nofollow')
  }
})
