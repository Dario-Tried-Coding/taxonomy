import { siteConfig } from '@/config/site.config'
import { Callout, Image } from '@/lib/keystatic/components'
import { collection, config, fields } from '@keystatic/core'
import NextImage from 'next/image'

export default config({
  ui: {
    brand: { name: siteConfig.name.short, mark: () => <NextImage src='/favicon-16x16.png' alt={siteConfig.name.short} width={16} height={16} /> },
  },
  storage: {
    kind: 'local',
  },
  collections: {
    docs: collection({
      label: 'Docs',
      slugField: 'title',
      path: 'content/docs/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        type: fields.select({ label: 'Type', options: [{ label: 'Documentation', value: 'Docs' }], defaultValue: 'Docs' }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'content/posts/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        image: fields.pathReference({ label: 'Image', pattern: 'public/images/blog/posts/**/*' }),
        date: fields.date({ label: 'Date' }),
        author: fields.relationship({ label: 'Author', collection: 'authors' }),
        content: fields.mdx({
          label: 'Content',
          components: {
            Callout: Callout(),
            Image: Image({ schema: { pattern: 'public/images/blog/posts/**/*' } }),
          },
        }),
      },
    }),
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        avatar: fields.pathReference({ label: 'Avatar', pattern: 'public/imges/avatars/**/*' }),
        twitter: fields.text({ label: 'Twitter' }),
        emptyContent: fields.emptyContent({ extension: 'mdx' }),
      },
      format: { contentField: 'emptyContent' },
    }),
  },
})
