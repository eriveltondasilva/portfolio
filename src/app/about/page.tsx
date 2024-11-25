import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About page',
}

export default function AboutPage() {
  return (
    <div className='prose prose-neutral dark:prose-invert'>
      <header className='mb-8'>
        <h1 className='title'>About</h1>
      </header>
      <p>
        Tenho sólida experiência com JavaScript, TypeScript e PHP, o que me
        permite desenvolver aplicações robustas, escaláveis e de alta qualidade.
        Utilizo ferramentas e frameworks modernos, como Node.js para o backend e
        ReactJS e Next.js para o frontend, garantindo experiências dinâmicas e
        responsivas para os usuários.
      </p>
      <p>
        Para uma estética atraente e uma interface intuitiva, faço uso de
        TailwindCSS e Sass, recursos que facilitam a criação de designs
        elegantes e otimizados. Além disso, desenvolvo aplicações em Laravel,
        criando APIs e sistemas complexos que atendem a altos padrões de
        performance e segurança.
      </p>
      <p>
        Minha abordagem de trabalho é focada na eficiência e na inovação.
        Emprego as melhores práticas e tecnologias para entregar resultados que
        superam as expectativas. Se você busca um desenvolvedor comprometido,
        atento aos detalhes e pronto para agregar valor ao seu projeto, vamos
        conversar sobre como posso contribuir com suas ideias!
      </p>
    </div>
  )
}
