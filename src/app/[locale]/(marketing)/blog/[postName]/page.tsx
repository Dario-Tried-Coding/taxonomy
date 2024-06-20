import { BlogMDX } from '@/components/markdown/blog/BlogMDX'
import { buttonVariants } from '@/components/ui/Button'
import { siteConfig } from '@/config/site.config'
import { getBlogPostName } from '@/lib/helpers/keystatic'
import { setRequestLocale } from '@/lib/next-intl'
import { Locale } from '@/lib/next-intl/config'
import { cn } from '@/lib/utils'
import { Blog } from '@/routes'
import { allPosts } from 'content-collections'
import { ChevronLeft } from 'lucide-react'
import { Metadata } from 'next'
import { getFormatter, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import '@/styles/mdx.css'

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
  const format = await getFormatter({ locale: params.locale })
  const t = await getTranslations({ locale: params.locale, namespace: 'Pages.BlogPost.UI' })

  if (!post) notFound()

  return (
    <article className='container relative max-w-3xl py-6 lg:py-10'>
      <Blog.Link className={cn(buttonVariants({ variant: 'ghost' }), 'absolute left-[-200px] top-14 hidden xl:inline-flex')}>
        <ChevronLeft className='mr-2 h-4 w-4' />
        {t('back')}
      </Blog.Link>
      <div>
        {post.date && (
          <time dateTime={post.date} className='block text-sm text-muted-foreground'>
            {t('published-on', { date: format.dateTime(new Date(post.date)) })}
          </time>
        )}
        <h1 className='mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl'>{post.title}</h1>
        {post.author && post.author.avatar && post.author.name && (
          <div className='mt-4 flex space-x-4'>
            <Link href={`https://twitter.com/${post.author.twitter}`} className='flex items-center space-x-2 text-sm'>
              <Image src={post.author.avatar} alt={post.author.name} width={42} height={42} className='rounded-full bg-neutral' />
              <div className='flex-1 text-left leading-tight'>
                <p className='font-medium'>{post.author.name}</p>
                {post.author.twitter && <p className='text-[12px] text-muted-foreground'>{t('author-twitter', { author: post.author.twitter })}</p>}
              </div>
            </Link>
          </div>
        )}
        {post.image && (
          <Image src={post.image} alt={post.title} width={720} height={405} className='my-8 rounded-md border bg-muted transition-colors' priority />
        )}
        <BlogMDX code={post.mdx} />
        <hr className='mt-12' />
        <div className='flex justify-center py-6 lg:py-10'>
          <Blog.Link className={cn(buttonVariants({ variant: 'ghost' }))}>
            <ChevronLeft className='mr-2 h-4 w-4' />
            {t('back')}
          </Blog.Link>
        </div>
      </div>
    </article>
  )
}

export default Page
