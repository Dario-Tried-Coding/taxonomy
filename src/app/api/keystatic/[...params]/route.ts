import config, { showAdminUI } from '@/lib/keystatic/config'
import { makeRouteHandler } from '@keystatic/next/route-handler'

export const { POST, GET } = (() => {
  const notFoundRouteHandler = () => {
    return new Response(null, {
      status: 404,
    })
  }

  if (showAdminUI === false) return { GET: notFoundRouteHandler, POST: notFoundRouteHandler }

  return makeRouteHandler({
    config,
  })
})()
