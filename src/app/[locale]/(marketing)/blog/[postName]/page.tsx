import { siteConfig } from '@/config/site.config'
import { getBlogPostName } from '@/lib/helpers/keystatic'
import { setRequestLocale } from '@/lib/next-intl'
import { Locale } from '@/lib/next-intl/config'
import { allPosts } from 'content-collections'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface PageProps {
  params: {
    locale: Locale
    postName: string
  }
}

async function getPostFromParams({ locale, postName }: PageProps['params']) {
  const postPath = `${postName}.${locale}` as const
  const post = allPosts.find((p) => p._meta.path === postPath)
  return post
}

export async function generateStaticParams() {
  const uniquePosts = new Set()
  allPosts.forEach((post) => {
    const postName = getBlogPostName(post._meta.path)
    uniquePosts.add(postName)
  })
  return Array.from(uniquePosts).map((p) => ({ postName: p }))
}

export async function generateMetadata({ params }: PageProps):Promise<Metadata> {
  const post = await getPostFromParams(params)

  if (!post) return {}

  const ogUrl = new URL(`${siteConfig.url}/meta/poster`)
  ogUrl.searchParams.set('heading', post.title)
  ogUrl.searchParams.set('type', 'Blog Post')
  ogUrl.searchParams.set('mode', 'dark')

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name }],
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${siteConfig.url}/blog/${getBlogPostName(post._meta.path)}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  }
}

const Page: FC<PageProps> = async ({ params }) => {
  const post = await getPostFromParams(params)

  setRequestLocale(params.locale)
  
  if (!post) notFound()

  return <div>{post.title}</div>
}

export default Page
