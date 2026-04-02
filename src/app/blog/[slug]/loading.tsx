import { Separator } from '@/components/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function PostLoading() {
  return (
    <div>
      {/* Back link */}
      <Skeleton className='mb-6 h-4 w-28' />

      {/* Header */}
      <header>
        {/* Title + share button */}
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-8 w-3/4' />
          </div>
          <Skeleton className='size-9 shrink-0 rounded-md' />
        </div>

        {/* Cover */}
        <Skeleton className='mt-6 aspect-2/1 w-full rounded-lg' />

        {/* Meta info */}
        <div className='mt-6 space-y-2'>
          <div className='flex flex-wrap items-center gap-4'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-24' />
          </div>

          {/* Authors */}
          <Skeleton className='h-4 w-36' />

          {/* Tags */}
          <div className='flex gap-1.5'>
            <Skeleton className='h-5 w-16 rounded-full' />
            <Skeleton className='h-5 w-20 rounded-full' />
            <Skeleton className='h-5 w-14 rounded-full' />
          </div>
        </div>
      </header>

      <Separator />

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
        <Skeleton className='h-4 w-2/3' />
      </div>

      {/* Footer actions */}
      <div className='mt-4 flex justify-end'>
        <Skeleton className='h-4 w-32' />
      </div>

      <Separator />

      {/* Related posts */}
      <div className='space-y-3'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-12 w-full rounded-md' />
        <Skeleton className='h-12 w-full rounded-md' />
        <Skeleton className='h-12 w-full rounded-md' />
      </div>

      <Separator />

      {/* Prev / Next navigation */}
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Skeleton className='h-16 flex-1 rounded-md' />
        <Skeleton className='h-16 flex-1 rounded-md' />
      </div>
    </div>
  )
}
