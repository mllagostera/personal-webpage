/**
 * Anchor compatibility for links shared before the move to real routes.
 *
 * A URL fragment never reaches the server, so `/#workExperience` cannot be
 * answered with a 301 — the browser asks for `/` and resolves the hash locally.
 * This client-side hop is the only way to keep those shared links working.
 *
 * Anchors whose content stayed on the landing page are absent on purpose: they
 * still work as plain scroll targets.
 */
const LEGACY_ANCHORS: Record<string, string> = {
  '#workExperience': '/experience',
  '#education': '/experience#education',
  '#projects': '/projects',
  '#github-collaborations': '/projects#github-collaborations',
}

export default defineNuxtPlugin((nuxtApp) => {
  // Waits for mount: navigating while plugins are still initialising happens
  // before the router is ready and the redirect is silently dropped.
  nuxtApp.hook('app:mounted', () => {
    if (window.location.pathname !== '/') return

    const target = LEGACY_ANCHORS[window.location.hash]
    if (target) navigateTo(target, { replace: true })
  })
})
