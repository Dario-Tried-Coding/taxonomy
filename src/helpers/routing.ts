export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}