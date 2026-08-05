import type { RouteLocationRaw } from '#vue-router'

export interface AwesomeLayoutPageNavbarMenu {
  type?: 'link'
  title?: string
  to?: RouteLocationRaw
  icon?: string
}
