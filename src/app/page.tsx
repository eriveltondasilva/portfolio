import Link from 'next/link'

import { Avatar } from '@/components/avatar'
import { Badge } from '@/components/badge'

import { skills } from '@/config'

export default async function HomePage() {
  return (
    <>
      <header>
        <Avatar />
        <h1 className='title text-center sm:text-left'>
          Hello,there <div className='inline-block animate-wiggle'>👋</div>
        </h1>
      </header>

      <div className='prose prose-slate text-center dark:prose-invert sm:text-left'>
        <p>
          Sou desenvolvedor web <strong>fullstack</strong>, apaixonado por criar
          soluções digitais personalizadas que fazem a diferença.
        </p>

        <p>
          Minha jornada na tecnologia começou com uma curiosidade insaciável
          pelo mundo da programação, e hoje transformo essa paixão em projetos
          de impacto.
        </p>

        <h2>Habilidades</h2>

        <div className='mt-4 flex flex-wrap gap-2'>
          {skills.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className='no-underline'
            >
              <Badge size='md'>{label}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
