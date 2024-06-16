import createNextIntlPlugin from 'next-intl/plugin'
import createJiti from 'jiti'
import { fileURLToPath } from 'node:url'

// build-time env schema validation
const jiti = createJiti(fileURLToPath(import.meta.url))
jiti('./src/lib/env')

const withNextIntl = createNextIntlPlugin('./src/lib/next-intl')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextIntl(nextConfig)