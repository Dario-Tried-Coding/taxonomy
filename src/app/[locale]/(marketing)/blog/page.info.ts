import { z } from 'zod'

export const Route = {
  name: 'Blog',
  params: z.object({}),
}

export const PATH = '/blog'