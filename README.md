# 🌐 **Portfolio - Projeto em Next.js**

Este é um projeto de **portfólio pessoal** desenvolvido com **Next.js**, que também inclui um blog para compartilhar conhecimentos e projetos. O objetivo é ser rápido, responsivo e fácil de manter, incorporando as melhores práticas do ecossistema React e Next.js.

<br />

## 📋 **Funcionalidades**

### Geral

- **Portfólio Pessoal**: Apresente seus trabalhos e projetos de forma clara e visualmente atraente.
- **Blog Interativo**: Utilize **MDX** para criar posts que combinam Markdown e componentes React.
- **Tema Dinâmico**: Suporte para temas claro e escuro, alternáveis com `next-themes`.
- **YouTube Player**: Integração com vídeos do YouTube, permitindo incorporar mídia nos posts ou páginas.
- **SEO Avançado**: Configurações otimizadas para melhorar a visibilidade em mecanismos de busca.
- **Análise de Dados**: Monitore visitas e desempenho com **Vercel Analytics**.

### Blog: Plugins Remark e Rehype

**Remark Plugins:**

- **remark-frontmatter**: Suporte a frontmatter YAML para metadados em posts.
- **remark-mdx-frontmatter**: Permite usar variáveis do frontmatter diretamente nos componentes MDX.
- **remark-parse-frontmatter**: Parsing avançado de metadados YAML.
- **remark-reading-time**: Estima o tempo de leitura dos posts para uma melhor experiência do leitor.
- **remark-toc**: Gera automaticamente uma Tabela de Conteúdo (TOC) com base nos cabeçalhos do post.
- **remark-gfm**: Adiciona funcionalidades como tabelas, listas de tarefas e links automáticos no Markdown.

**Rehype Plugins:**

- **rehype-slug**: Adiciona IDs únicos aos cabeçalhos para links internos.
- **rehype-autolink-headings**: Insere links automáticos nos títulos, facilitando a navegação.
- **rehype-highlight**: Realça sintaxe de código, suportando diversas linguagens.
- **rehype-highlight-code-lines**: Permite destacar linhas específicas em blocos de código.

<br />

## 💻 **Tecnologias Utilizadas**

- **Framework**: [Next.js](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [TailwindCSS](https://tailwindcss.com/), [Sass](https://sass-lang.com/)
- **Bibliotecas de UI**: [Headless UI](https://headlessui.dev/), [Lucide React](https://lucide.dev/)
- **Blog**: [MDX](https://mdxjs.com/), Remark, Rehype
- **Análise de Dados**: [Vercel Analytics](https://vercel.com/docs/analytics/)
- **Outras ferramentas**: Day.js, clsx, Prettier

<br />

## 🚀 **Scripts Disponíveis**

| Comando          | Descrição                             |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Inicia o ambiente de desenvolvimento. |
| `npm run build`  | Gera a build de produção.             |
| `npm start`      | Inicia o servidor no modo produção.   |
| `npm run lint`   | Verifica erros de lint no código.     |
| `npm run format` | Formata o código com Prettier.        |

<br />

## 📖 **Pré-requisitos**

Antes de começar, certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão 20 ou superior)
- **[npm](https://www.npmjs.com/)**

<br />

## 🛠️ **Como Executar o Projeto**

1. Clone o repositório:

   ```bash
   git clone https://github.com/eriveltondasilva/portfolio.git
   cd portfolio
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure variáveis de ambiente:

   - Renomeie o arquivo `.env.example` para `.env`.
   - Preencha as variáveis necessárias (URLs de APIs, chaves de análise etc.).

4. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse no navegador: [http://localhost:3000](http://localhost:3000)

<br />

## 📁 **Estrutura do Projeto**

```plaintext
/
├── content/               # Posts do blog em formato MDX
├── public/                # Assets públicos (imagens, fontes, etc.)
├── src/                   # Código-fonte principal
│   ├── app/               # Rotas e páginas (estrutura do Next.js)
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Hooks personalizados
│   ├── services/          # Serviços externos e APIs
│   ├── styles/            # Estilos globais e temas
│   ├── utils/             # Funções utilitárias
│   ├── config.ts          # Configurações gerais
│   ├── types.d.ts         # Tipos TypeScript
│   ├── mdx-components.tsx # Componentes para renderização MDX
├── .env                   # Variáveis de ambiente
├── tailwind.config.js     # Configuração do TailwindCSS
├── next.config.js         # Configuração do Next.js
```

<br />

## ✍️ **Como Criar um Novo Post no Blog**

1. **Crie um arquivo MDX em `content/`:**

   - O nome do arquivo será o slug do post (exemplo: `content/my-first-post.mdx`).

2. **Adicione o frontmatter YAML:**

   ```yaml
   ---
   title: 'Meu Primeiro Post'
   description: 'Este é o meu primeiro post utilizando MDX.'
   author: 'Erivelton Silva'
   tags:
     - nextjs
     - blog
     - portfolio
   published: true
   createdAt: '2024-11-15'
   updatedAt: '2024-11-20'
   ---

   # Conteúdo da postagem
   ```

   ```ts
   type Frontmatter = {
     title: string // Título do post
     description: string // Descrição curta do post
     author?: string // (Opcional) Nome do autor
     tags: string[] // Tags associadas ao post
     published: boolean // Indica se o post está publicado
     createdAt: string // Data de criação (ISO 8601)
     updatedAt?: string // (Opcional) Data de atualização (ISO 8601)
   }
   ```

3. **Escreva conteúdo Markdown ou use componentes React:**

   ```mdx
   ---
   # metadata
   ---

   # Conteúdo da postagem

   Este é um parágrafo em Markdown.

   <MyCustomComponent prop='valor' />
   ```

<br />

## 🤝 **Como Contribuir**

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:

   ```bash
   git checkout -b minha-feature
   ```

3. Commit suas alterações:

   ```bash
   git commit -m "Minha nova feature"
   ```

4. Envie para o repositório remoto:

   ```bash
   git push origin minha-feature
   ```

5. Abra um Pull Request no repositório original.

<br />

## 📜 **Licença**

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

<br />

## 🔗 **Links Úteis**

- **Repositório do Projeto**: [GitHub](https://github.com/eriveltondasilva/portfolio)
- **Documentação do Next.js**: [nextjs.org](https://nextjs.org/)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com/)

<br />

**💙 Desenvolvido por [Erivelton Silva](https://github.com/eriveltondasilva/)**
