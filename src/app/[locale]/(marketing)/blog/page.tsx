import { Locale } from '@/lib/next-intl/config'
import { Link } from '@/lib/next-intl/navigation'
import { allPosts } from 'content-collections'
import { compareDesc } from 'date-fns'
import { useFormatter } from 'next-intl'
import Image from 'next/image'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
  }
}

// TODO: Implement i18n

const page: FC<pageProps> = ({ params: { locale } }) => {
  const format = useFormatter()

  const posts = allPosts.filter((p) => p._meta.filePath.endsWith(`.${locale}.mdx`)).sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <div className='container max-w-4xl py-6 lg:py-10'>
      <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8'>
        <div className='flex-1 space-y-4'>
          <h1 className='inline-block font-heading text-4xl tracking-tight lg:text-5xl'>Blog</h1>
          <p className='text-xl text-muted-foreground'>A blog built using Contentlayer. Posts are written in MDX.</p>
        </div>
      </div>
      <hr className='my-8' />
      {posts.length ? (
        <div className='grid gap-10 sm:grid-cols-2'>
          {posts.map((post, index) => {
            const publishDate = new Date(post.date)

            return (
              <article key={post._meta.path} className='group relative flex flex-col space-y-2'>
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={804}
                    height={452}
                    className='rounded-md border bg-muted transition-colors'
                    priority={index <= 1}
                  />
                )}
                <h2 className='text-2xl font-extrabold'>{post.title}</h2>
                {post.description && <p className='text-muted-foreground'>{post.description}</p>}
                {post.date && (
                  <p className='text-sm text-muted-foreground'>{format.dateTime(publishDate, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                )}
                <Link href={post._meta.path.replace(`.${locale}`, '')} className='absolute inset-0'>
                  <span className='sr-only'>View Article</span>
                </Link>
              </article>
            )
          })}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  )
}

export default page
