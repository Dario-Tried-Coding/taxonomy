import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '@/lib/keystatic/config'

export const { POST, GET } = makeRouteHandler({
  config,
})
