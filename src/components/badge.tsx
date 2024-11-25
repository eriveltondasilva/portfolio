import { clsx } from 'clsx'
import React from 'react'

const sizeClasses = {
  sm: 'text-xs px-2.5 py-0.5',
  md: 'text-sm px-3.5 py-1',
}

const COLORS = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
}

const BORDERED = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-blue-400 border border-blue-400',
}

type BadgeProps = {
  size?: keyof typeof sizeClasses
  variant?: keyof typeof COLORS
  bordered?: boolean
  pill?: boolean
  className?: string
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}
export function Badge({
  size = 'sm',
  variant = 'blue',
  bordered = false,
  pill = false,
  disabled = false,
  className,
  onClick,
  children,
}: BadgeProps) {
  const variantClasses = {
    blue: bordered ? BORDERED.blue : COLORS.blue,
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium tracking-wider',
        variantClasses[variant],
        sizeClasses[size],
        pill ? 'rounded-full' : 'rounded',
        disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
        className,
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </span>
  )
}
