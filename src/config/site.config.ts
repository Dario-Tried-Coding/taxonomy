export const siteConfig = {
  name: {
    full: 'Taxonomy | Dario Tried Coding',
    short: 'Taxonomy',
  },
  author: {
    name: 'Dario Tried Coding',
    url: 'https://dariotriedcoding.com',
  },
  twitter: {
    url: 'https://twitter.com/dariotriedx',
    username: '@dariotriedx',
  },
  github: {
    url: 'https://github.com/dariocorbinelli/taxonomy',
  },
  url: 'https://tx.dariotriedcoding.com',
  ogImage: 'https://tx.dariotriedcoding.com/og.jpg',
} as const

export type siteConfig = typeof siteConfig
