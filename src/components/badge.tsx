import { Badge as BadgeBase } from './ui/badge'

export default function Badge() {}

const SoftBadgeDemo = () => {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <BadgeBase className='gap-1.5 bg-amber-600/10 text-amber-500 shadow-none hover:bg-amber-600/10 dark:bg-amber-600/20'>
        <div className='h-1.5 w-1.5 rounded-full bg-amber-500' /> In Progress
      </BadgeBase>
      <BadgeBase className='gap-1.5' variant='destructive'>
        <div className='h-1.5 w-1.5 rounded-full bg-red-400' /> Blocked
      </BadgeBase>
      <BadgeBase className='gap-1.5 bg-emerald-600/10 text-emerald-500 shadow-none hover:bg-emerald-600/10 dark:bg-emerald-600/20'>
        <div className='h-1.5 w-1.5 rounded-full bg-emerald-500' /> Done
      </BadgeBase>
    </div>
  )
}

const StatusBadgeBaseDemo = () => {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <BadgeBase className='gap-1.5 border-amber-600/40 bg-amber-600/10 text-amber-500 shadow-none hover:bg-amber-600/10 dark:bg-amber-600/20'>
        <div className='size-1.5 rounded-full bg-amber-500' /> In Progress
      </BadgeBase>
      <BadgeBase
        className='gap-1.5 border-destructive/30'
        variant='destructive'
      >
        <div className='size-1.5 rounded-full bg-red-400' /> Blocked
      </BadgeBase>
      <BadgeBase className='gap-1.5 border-emerald-600/40 bg-emerald-600/10 text-emerald-500 shadow-none hover:bg-emerald-600/10 dark:bg-emerald-600/20'>
        <div className='size-1.5 rounded-full bg-emerald-500' /> Done
      </BadgeBase>
    </div>
  )
}
