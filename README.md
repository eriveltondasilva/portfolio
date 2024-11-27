# 🌐 **Portfolio - Projeto em Next.js**

Este é um projeto de **portfólio pessoal** desenvolvido com **Next.js**, que também inclui um blog para compartilhar conhecimentos e projetos. O objetivo é ser rápido, responsivo e fácil de manter, incorporando as melhores práticas do ecossistema React e Next.js.

## 📋 **Funcionalidades**

### Geral

- **Portfólio Pessoal**: Apresente seus trabalhos e projetos de forma clara e visualmente atraente.
- **Blog Interativo**: Utilize **MDX** para criar posts que combinam Markdown e componentes React.
- **Tema Dinâmico**: Suporte para temas claro e escuro, alternáveis com `next-themes`.
- **YouTube Player**: Integração com vídeos do YouTube, permitindo incorporar mídia nos posts ou páginas.
- **SEO Avançado**: Configurações otimizadas para melhorar a visibilidade em mecanismos de busca.
- **Análise de Dados**: Monitore visitas e desempenho com **Vercel Analytics**.

### Blog: Plugins

**Remark Plugins:**

- **remark-frontmatter**: Suporte a frontmatter **YAML** para metadados em posts.
- **remark-mdx-frontmatter**: Permite usar variáveis do frontmatter diretamente nos componentes MDX.
- **remark-parse-frontmatter**: Parsing avançado de metadados YAML.
- **remark-reading-time**: Estima o tempo de leitura dos posts para uma melhor experiência do leitor.
- **remark-toc**: Gera automaticamente uma Tabela de Conteúdo (TOC) com base nos títulos do post.
- **remark-gfm**: Adiciona funcionalidades como tabelas, listas de tarefas e links automáticos no Markdown.

**Rehype Plugins:**

- **rehype-slug**: Adiciona IDs únicos aos títulos para links internos.
- **rehype-autolink-headings**: Insere links automáticos nos títulos, facilitando a navegação.
- **rehype-highlight**: Realça sintaxe de código, suportando diversas linguagens.
- **rehype-highlight-code-lines**: Permite destacar linhas específicas em blocos de código.

## 💻 **Tecnologias Utilizadas**

- **Framework**: [Next.js](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [TailwindCSS](https://tailwindcss.com/)
- **Bibliotecas de UI**: [Headless UI](https://headlessui.dev/), [Lucide React](https://lucide.dev/)
- **Blog**: [MDX](https://mdxjs.com/), Remark, Rehype
- **Análise de Dados**: [Vercel Analytics](https://vercel.com/docs/analytics/)
- **Outras ferramentas**: Day.js, clsx, Prettier

## 🚀 **Scripts Disponíveis**

| Comando          | Descrição                             |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Inicia o ambiente de desenvolvimento. |
| `npm run build`  | Gera a build de produção.             |
| `npm start`      | Inicia o servidor no modo produção.   |
| `npm run lint`   | Verifica erros de lint no código.     |
| `npm run format` | Formata o código com Prettier.        |

## 📖 **Pré-requisitos**

Antes de começar, certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão 20+)
- **[npm](https://www.npmjs.com/)** (versão 10+)

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

## 📁 **Estrutura do Projeto**

```plaintext
/
├── content/                # Posts do blog em formato MDX
│   ├── 2024/               # Posts organizados por ano
├── doc/                    # Documentos do blog em formato MD
├── public/                 # Assets públicos (imagens, fontes, etc.)
├── src/                    # Código-fonte principal
│   ├── app/                # Rotas e páginas (estrutura do Next.js)
│   ├── components/         # Componentes reutilizáveis
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Serviços externos e APIs
│   ├── styles/             # Estilos globais e temas
│   ├── utils/              # Funções utilitárias
│   ├── config.ts           # Configurações gerais
│   ├── plugin.ts           # Configurações dos plugins de remark e rehype
│   ├── types.d.ts          # Tipos TypeScript
│   ├── mdx-components.tsx  # Componentes para renderização MDX
├── .env                    # Variáveis de ambiente
├── tailwind.config.js      # Configuração do TailwindCSS
├── next.config.js          # Configuração do Next.js
```

## ✍️ **Como Criar um Novo Post no Blog**

1. **Crie um arquivo MDX na pasta do ano correspondente:**

   - Exemplo: `content/2024/my-first-post.mdx`.

2. **Adicione o frontmatter YAML:**

   ```yaml
   ---
   title: Meu Primeiro Post
   description: Este é o meu primeiro post utilizando MDX.
   createdAt: 2024-11-15
   updatedAt: 2024-11-20
   isPublished: true
   tags: [nextjs, blog, portfolio]
   author: Erivelton Silva
   ---
   # Conteúdo da postagem
   ```

   ```ts
   // tipos dos frontmatter retornado pelos posts
   type Frontmatter = {
     title: string // Título do post
     description: string // Descrição curta do post
     createdAt: string // Data de criação (ISO 8601)
     updatedAt?: string // (Opcional) Data de atualização (ISO 8601)
     isPublished: boolean // Indica se o post está publicado
     tags: string[] // Tags associadas ao post
     author?: string // (Opcional) Nome do autor
   }
   ```

3. **Escreva conteúdo Markdown ou/e use componentes React:**

   ```mdx
   ---
   # metadata
   ---

   # Título da postagem

   Este é um parágrafo em Markdown.

   <MyCustomComponent prop='valor' />
   ```

   > Posts que tiverem o campo `isPublished` como `false` ou que estiverem fora das pastas do ano correspondente não serão exibidos.

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

## 📜 **Licença**

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 **Links Úteis**

- **Repositório do Projeto**: [GitHub](https://github.com/eriveltondasilva/portfolio)
- **Documentação do Next.js**: [nextjs.org](https://nextjs.org/)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com/)

**Desenvolvido com 💙 por [Erivelton Silva](https://github.com/eriveltondasilva/)**
