import { map } from '../../../.map'
import { createMDXSource } from 'fumadocs-mdx'
import { loader } from 'fumadocs-core/source'
import { I18N_CONFIG } from '@/lib/next-intl/config'

const { locales } = I18N_CONFIG

export const { getPage, getPages, pageTree } = loader({
  languages: locales as unknown as string[],
  baseUrl: '/docs',
  rootDir: 'docs',
  source: createMDXSource(map),
})
