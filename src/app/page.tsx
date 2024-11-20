import Link from 'next/link'

import { Avatar } from '@/components/avatar'
import { Badge } from '@/components/badge'

const skills: string[][] = [
  ['JavaScript', '#'],
  ['TypeScript', '#'],
  ['Nodejs', '#'],
  ['Express', '#'],
  ['Reactjs', '#'],
  ['Nextjs', '#'],
  ['TailwindCSS', '#'],
]

export default function HomePage() {
  return (
    <section>
      <header>
        <Avatar />
        <h1 className='title text-center sm:text-left'>Hello,there 👋</h1>
      </header>

      <div className='prose prose-neutral text-justify dark:prose-invert sm:text-left'>
        <p>
          Sou desenvolvedor web fullstack, apaixonado por criar soluções
          digitais personalizadas que fazem a diferença.
        </p>

        <p>
          Minha jornada na tecnologia começou com uma curiosidade insaciável
          pelo mundo da programação, e hoje transformo essa paixão em projetos
          de impacto.
        </p>

        <h2>Habilidades</h2>

        <div className='mt-4 flex flex-wrap gap-2'>
          {skills.map(([label, href]) => (
            <Badge key={label} size='md'>
              <Link href={href} className='no-underline'>
                {label}
              </Link>
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
