import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: '404',
  description: 'Error 404',
}

export default function NotFound() {
  return (
    <>
      <header className='mb-8'>
        <h1 className='title'>404 - Página não encontrada</h1>
      </header>
      <p className='mb-4'>
        Oops! A página que você tentou acessar não foi encontrada.
      </p>
    </>
  )
}
