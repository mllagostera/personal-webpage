// Server-side icon bundle config for @nuxt/icon.
//
// devicon / devicon-plain / heroicons are used broadly across the CV data
// (tech stack logos, section icons) and are bundled in full, same as before.
//
// mdi / pixelarticons / flag / simple-icons / tabler are each used for a
// handful of fixed icons (nav logo, social links, language flags, a couple
// of decorative marks). Bundling those collections in full would add tens
// of MB of unused icon data to the server bundle, so instead we trim each
// one down to just the icons this app actually references. Without a local
// bundle at all, @nuxt/icon falls back to fetching unknown icons from the
// public api.iconify.design at request time — an external origin sitting in
// the render path of every page (the navbar uses several of these icons).
import type { IconifyJSON } from '@iconify/types'
import mdi from '@iconify-json/mdi/icons.json' with { type: 'json' }
import pixelarticons from '@iconify-json/pixelarticons/icons.json' with { type: 'json' }
import flag from '@iconify-json/flag/icons.json' with { type: 'json' }
import simpleIcons from '@iconify-json/simple-icons/icons.json' with { type: 'json' }
import tabler from '@iconify-json/tabler/icons.json' with { type: 'json' }

function pick(collection: IconifyJSON, names: string[]): IconifyJSON {
  const icons: IconifyJSON['icons'] = {}
  for (const name of names) {
    const icon = collection.icons[name]
    if (icon) icons[name] = icon
  }
  return {
    prefix: collection.prefix,
    width: collection.width,
    height: collection.height,
    icons,
  }
}

export const trimmedIconCollections = [
  pick(mdi as IconifyJSON, ['github', 'github-face', 'linkedin', 'stack-exchange', 'twitter']),
  pick(pixelarticons as IconifyJSON, ['users']),
  pick(flag as IconifyJSON, ['es-4x3', 'es-ct-4x3', 'gb-4x3']),
  pick(simpleIcons as IconifyJSON, ['github']),
  pick(tabler as IconifyJSON, ['quote']),
]
