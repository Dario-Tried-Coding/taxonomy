import { z } from 'zod'

export const Route = {
  name: 'Pricing',
  params: z.object({}),
}

export const PATH = '/pricing'