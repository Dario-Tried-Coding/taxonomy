import { I18N_CONFIG } from "@/lib/next-intl/config"

// transforms keystatic generated path to Next.js compatible static-asset path
// example: public/images/blog/posts/post-1.jpg -> /images/blog/posts/post-1.jpg
export const constructStaticAssetPath = (path: string) => {
  let newPath = path

  if (newPath.startsWith('public')) newPath = newPath.replace('public', '')
  if (newPath.startsWith('/public')) newPath = newPath.replace('/public', '')
  if (!newPath.startsWith('/')) newPath = `/${newPath}`

  return newPath
}

// transforms keystatic generated fileName (with .locale.extention) to only fileName
// example: post-1.en.mdx -> post-1
export function getBlogPostName(fileName: string) {
  let postName = fileName
  

  const extentionRegex = new RegExp(/\.(mdx|md)$/)
  postName = postName.replace(extentionRegex, '')

  const localeRegex = new RegExp(`\\.(${I18N_CONFIG.locales.join('|')})$`)
  postName = postName.replace(localeRegex, '')

  return postName
}