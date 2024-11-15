import { Avatar } from '@/components/avatar'

export default function HomePage() {
  return (
    <section>
      <header>
        <Avatar />
        <h1 className='title text-center sm:text-left'>Hello,there 👋</h1>
      </header>

      <div className='prose prose-neutral dark:prose-invert'>
        <p>
          Sou desenvolvedor web fullstack, apaixonado por criar soluções
          digitais personalizadas que fazem a diferença.
        </p>

        <p>
          Minha jornada na tecnologia começou com uma curiosidade insaciável
          pelo mundo da programação, e hoje transformo essa paixão em projetos
          de impacto.
        </p>
      </div>
    </section>
  )
}
