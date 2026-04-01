import { Separator } from '#/components/ui/separator'
import { Skeleton } from '#/components/ui/skeleton'

export default function PostLoading() {
  return (
    <div>
      {/* Back link */}
      <Skeleton className='mb-6 h-4 w-28' />

      {/* Header */}
      <header className='mb-8 space-y-4'>
        {/* Title */}
        <div className='space-y-2'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-8 w-3/4' />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-5/6' />
        </div>

        {/* Meta info: date + reading time + author */}
        <div className='flex flex-wrap gap-4'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-36' />
        </div>

        {/* Tags */}
        <div className='flex gap-1.5'>
          <Skeleton className='h-5 w-16 rounded-full' />
          <Skeleton className='h-5 w-20 rounded-full' />
          <Skeleton className='h-5 w-14 rounded-full' />
        </div>
      </header>

      {/* Cover */}
      <Skeleton className='mb-8 aspect-2/1 w-full rounded-lg' />

      <Separator className='mb-8 dark:bg-zinc-700/60' />

      {/* Article body */}
      <div className='space-y-3'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-11/12' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-4/5' />

        <Skeleton className='my-6 h-40 w-full rounded-md' />

        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </div>
    </div>
  )
}
