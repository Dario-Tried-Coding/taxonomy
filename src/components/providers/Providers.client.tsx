'use client'

import { absoluteUrl } from '@/helpers/routing'
import { trpc } from '@/lib/trpc/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { FC, PropsWithChildren, useState } from 'react'
import superjson from 'superjson'

interface Providers extends PropsWithChildren {}

const ClientProviders: FC<Providers> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: absoluteUrl('/api/trpc'),
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

export default ClientProviders
