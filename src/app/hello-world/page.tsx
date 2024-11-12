import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hello World',
  description: 'Hello World',
}

export default function HelloWorldPage() {
  return <h1 className='text-6xl font-bold'>Hello World</h1>
}
