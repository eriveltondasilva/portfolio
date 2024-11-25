'use client'
import { useEffect } from 'react'
import { BanIcon } from 'lucide-react'

import { Alert } from '@/components/alert'

type ErrorProps = {
  error: Error
  reset: () => void
}
export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Alert
      type='danger'
      icon={BanIcon}
    >
      <p>Oops! Something went wrong... maybe try refreshing?</p>
    </Alert>
  )
}
