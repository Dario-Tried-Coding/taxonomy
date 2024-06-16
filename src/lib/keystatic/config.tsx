import { collection, config, fields } from '@keystatic/core'

export default config({
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
        summary: fields.text({ label: 'Summary' }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
})
