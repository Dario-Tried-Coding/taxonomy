import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { constructBlogPostImagePath } from '@/lib/helpers/keystatic'

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.mdx',
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    date: z.string(),
    author: z.string(),
  }),
  async transform(post, context) {
    const image = constructBlogPostImagePath(post.image)
    const author = context.documents(authors).find((a) => a._meta.path === post.author)
    const mdx = await compileMDX(context, post, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            onVisitLine(node: any) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children.length === 0) node.children = [{ type: 'text', value: ' ' }]
            },
            onVisitHighlightedLine(node: any) {
              node.properties.className.push('line--highlighted')
            },
            onVisitHighlightedWord(node: any) {
              node.properties.className = ['word--highlighted']
            },
          },
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
            },
          },
        ],
      ],
    })
    return { ...post, image, author: { name: author?.name, avatar: author?.avatar, twitter: author?.twitter }, mdx }
  },
})

const authors = defineCollection({
  name: 'authors',
  directory: 'content/authors',
  include: '**/*.mdx',
  schema: (z) => ({
    name: z.string(),
    avatar: z.string(),
    twitter: z.string(),
  }),
})

export default defineConfig({
  collections: [posts, authors],
})
