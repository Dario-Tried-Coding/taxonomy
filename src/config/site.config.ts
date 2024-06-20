import { absoluteUrl } from "@/helpers/routing"

export const siteConfig = {
  name: {
    full: 'Taxonomy | Dario Tried Coding',
    short: 'Taxonomy',
  },
  author: {
    name: 'Dario Tried Coding',
    website: 'https://dariotriedcoding.com',
  },
  twitter: {
    url: 'https://twitter.com/dariotriedx',
    username: '@dariotriedx',
  },
  github: {
    url: 'https://github.com/dariocorbinelli/taxonomy',
    urlShort: 'github.com/dariocorbinelli/taxonomy',
  },
  url: absoluteUrl(''),
} as const

export type siteConfig = typeof siteConfig
