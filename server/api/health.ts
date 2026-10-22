/**
 * Liveness plus the identity of the build that is serving: after a merge,
 * `commit` changing to the merged sha is what says the deploy went out.
 */
export default defineEventHandler((event) => {
  // Not `health.get.ts`: that rejects HEAD with a 404, and HEAD is what many
  // uptime monitors send by default. Anything else gets a 405.
  assertMethod(event, ['GET', 'HEAD'])

  const { buildCommit, buildTime } = useRuntimeConfig(event)

  // Never cached, by CloudFront or anyone else: a stale answer here would
  // report the previous deploy as the live one.
  setResponseHeader(event, 'cache-control', 'no-store')

  return {
    status: 'ok',
    commit: buildCommit,
    builtAt: buildTime,
  }
})
