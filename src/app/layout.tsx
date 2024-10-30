import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Erivelton's portfolio",
  description: 'lorem ipsum dolor sit amet consectetur adipiscing elit.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='antialiased vsc-initialized'>{children}</body>
    </html>
  )
}
