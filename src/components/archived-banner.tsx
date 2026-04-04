import { ArchiveIcon } from 'lucide-react'

import { Icon } from '@/components/icon'

export function ArchivedBanner() {
  return (
    <div
      role='note'
      aria-label='Post arquivado'
      className='mb-6 flex items-start gap-3 rounded-md border border-amber-200/80 bg-amber-50/60 px-4 py-3 dark:border-amber-400/20 dark:bg-amber-400/5'
    >
      <Icon
        iconNode={ArchiveIcon}
        className='mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400'
      />
      <div className='text-sm'>
        <p className='font-semibold text-amber-800 dark:text-amber-400'>Post arquivado</p>
        <p className='mt-0.5 text-amber-700 dark:text-amber-500'>
          Este post não é mais mantido ativamente e pode conter informações desatualizadas.
        </p>
      </div>
    </div>
  )
}
