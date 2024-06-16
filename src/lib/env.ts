import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    GITHUB_ACCESS_TOKEN: z.string(),
    STRIPE_SECRET_KEY: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
})
