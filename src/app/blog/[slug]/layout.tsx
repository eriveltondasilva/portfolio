export default function PostLayout({ children }: LayoutProps<'/blog/[slug]'>) {
  // const { slug } = await params
  // const post = getPostBySlug(slug)
  // const headings = post ? getPostHeadings(post.filePath) : []
  // console.log(headings)

  return <div className='mx-auto max-w-3xl px-4 py-8 md:px-8'>{children}</div>
  // return (

  //   <div className='mx-auto max-w-3xl px-4 py-8 md:px-8 xl:max-w-6xl'>
  //       <div className='xl:flex xl:gap-12'>
  //         <div className='min-w-0 w-full max-w-3xl'>
  //           {children}
  //         </div>

  //         <aside className='hidden xl:block w-52 shrink-0'>
  //           <div className='sticky top-8'>
  //             <TableOfContents headings={headings} />
  //           </div>
  //         </aside>
  //       </div>
  //     </div>
  //   )
}
