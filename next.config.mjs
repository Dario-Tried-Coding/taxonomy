import createNextIntlPlugin from 'next-intl/plugin'
import createJiti from 'jiti'
import { fileURLToPath } from 'node:url'
import { withContentCollections } from '@content-collections/next'
import createMDX from 'fumadocs-mdx/config'

// build-time env schema validation
const jiti = createJiti(fileURLToPath(import.meta.url))
jiti('./src/lib/env')

const withNextIntl = createNextIntlPlugin('./src/lib/next-intl')
const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true }

export default withContentCollections(withMDX(withNextIntl(nextConfig)))
