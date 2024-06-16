import { getSession } from '@/lib/next-auth/cache'

export default async function Home() {
  const session = await getSession()
  return <main>{JSON.stringify(session?.user)}</main>
}
