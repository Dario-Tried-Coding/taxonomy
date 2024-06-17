import { fields } from '@keystatic/core'
import { block, wrapper } from '@keystatic/core/content-components'

const Callout = () =>
  wrapper({
    label: 'Callout',
    schema: {},
  })

interface ImageParams {
  schema: {
    pattern: string
  }
}
const Image = ({ schema: { pattern } }: ImageParams) =>
  block({
    label: 'Image',
    schema: {
      src: fields.pathReference({ label: 'Image', pattern }),
      alt: fields.text({ label: 'Alt Text' }),
      width: fields.integer({ label: 'Width' }),
      height: fields.integer({ label: 'Height' }),
    },
  })

export { Callout, Image }
