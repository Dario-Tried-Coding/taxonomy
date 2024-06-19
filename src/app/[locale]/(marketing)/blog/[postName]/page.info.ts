import { z } from 'zod'

export const Route = {
  name: 'Blog',
  params: z.object({
    postName: z.string(),
  }),
}

export const PATH = '/blog/[postName]'
