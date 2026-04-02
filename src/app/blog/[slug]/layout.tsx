export default function PostLayout({ children }: LayoutProps<'/blog/[slug]'>) {
  return <div className='mx-auto max-w-3xl px-4 py-8 md:px-8'>{children}</div>
}
