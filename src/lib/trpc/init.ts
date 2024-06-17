import { auth } from '@/lib/next-auth'
import { Context } from '@/lib/trpc/context'
import { TRPCError, initTRPC } from '@trpc/server'
import { getTranslations } from 'next-intl/server'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
  const session = await auth()
  const t = await getTranslations({ locale: opts.ctx.locale })

  if (!session || !session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: t('Auth.Errors.unauthenticated') })
  }

  return opts.next({
    ctx: {
      userId: session.user.id!,
      user: session.user,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
