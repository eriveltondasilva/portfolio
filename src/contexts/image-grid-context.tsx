'use client'

import { createContext, useContext } from 'react'

import type { GridColumns } from '@/types'

// -------------------------------------

interface ImageGridContextProps {
  columns: GridColumns
}

const ImageGridContext = createContext<ImageGridContextProps | undefined>(undefined)

// -------------------------------------

interface Props {
  columns: GridColumns
  children: React.ReactNode
}

export function ImageGridProvider({ children, columns }: Props) {
  return <ImageGridContext value={{ columns }}>{children}</ImageGridContext>
}

// -------------------------------------

export function useImageGrid() {
  const context = useContext(ImageGridContext)
  return context ?? { columns: 3 as GridColumns }
}
