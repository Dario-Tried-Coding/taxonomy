import { z } from 'zod'

export const Route = {
  name: 'SignIn',
  params: z.object({}),
}

export const PATH = '/auth/sign-in'