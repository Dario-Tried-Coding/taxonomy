import KeystaticApp from '@/lib/keystatic'
import { showAdminUI } from '@/lib/keystatic/config'
import { notFound } from 'next/navigation'

export default function Layout() {
  if (!showAdminUI) return notFound()

  return <KeystaticApp />
}
