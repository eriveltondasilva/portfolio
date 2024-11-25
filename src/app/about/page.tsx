import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Mim',
  description: 'About page',
}

export default function AboutPage() {
  return (
    <>
      <header className='mb-8'>
        <h1 className='title'>Sobre Mim</h1>
      </header>

      <div className='prose prose-slate dark:prose-invert'>
        <p>
          Tenho sólida experiência com <strong>JavaScript</strong>,
          <strong>TypeScript</strong> e <strong>PHP</strong>, o que me permite
          desenvolver aplicações robustas, escaláveis e de alta qualidade.
          Utilizo ferramentas e frameworks modernos, como{' '}
          <strong>Node.js</strong> para o backend e <strong>ReactJS</strong> e{' '}
          <strong>Next.js</strong> para o frontend, garantindo experiências
          dinâmicas e responsivas para os usuários.
        </p>
        <p>
          Para uma estética atraente e uma interface intuitiva, faço uso de{' '}
          <strong>TailwindCSS</strong> e <strong>Sass</strong>, recursos que
          facilitam a criação de designs elegantes e otimizados. Além disso,
          desenvolvo aplicações em <strong>Laravel</strong>, criando{' '}
          <strong>APIs</strong> e sistemas complexos que atendem a altos padrões
          de performance e segurança.
        </p>
        <p>
          Minha abordagem de trabalho é focada na eficiência e na inovação.
          Emprego as melhores práticas e tecnologias para entregar resultados
          que superam as expectativas. Se você busca um desenvolvedor
          comprometido, atento aos detalhes e pronto para agregar valor ao seu
          projeto, vamos conversar sobre como posso contribuir com suas ideias!
        </p>

        <h2>Contato</h2>
        <ul className='list-disc'>
          {/* <li>
            <a href='tel:+1234567890'>+1 234 567 890</a>
          </li> */}
          <li>
            <a href='mailto:eriveltondasilva13@gmail.com'>
              eriveltondasilva13@gmail.com
            </a>
          </li>
          <li>
            <a
              href='https://github.com/eriveltondasilva'
              target='_blank'
              rel='noopener noreferrer'
            >
              github.com/eriveltondasilva
            </a>
          </li>
          <li>
            <a
              href='https://www.linkedin.com/in/eriveltondasilva'
              target='_blank'
              rel='noopener noreferrer'
            >
              linkedin.com/in/eriveltondasilva
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
