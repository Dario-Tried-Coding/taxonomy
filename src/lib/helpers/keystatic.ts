// transforms keystatic generated path to Next.js compatible path
// example: public/images/blog/posts/post-1.jpg -> /images/blog/posts/post-1.jpg
export const constructBlogPostImagePath = (path: string) => {
  let newPath = path

  if (newPath.startsWith('public')) newPath = newPath.replace('public', '')
  if (!newPath.startsWith('/')) newPath = `/${newPath}`

  return newPath
}