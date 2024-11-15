## Portfolio - Projeto em Next.js

Este é um projeto de portfólio pessoal desenvolvido com **Next.js**, incorporando seções de blog e projetos. A aplicação foi projetada para ser rápida, responsiva e fácil de manter, utilizando as melhores práticas e ferramentas do ecossistema React e Next.js.

### 📋 Funcionalidades

- **Portfólio Pessoal**: Exibição de projetos.
- **Blog**: Integração com **MDX** para publicação de posts personalizados.
- **Tema Dinâmico**: Implementação de temas claros e escuros com `next-themes`.
- **SEO Otimizado**: Configurações para melhorar a visibilidade em mecanismos de busca.
- **Analytics**: Integrado com Vercel Analytics para monitoramento de performance.

---

### 🚀 Tecnologias Utilizadas

- **Framework**: [Next.js](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **UI/Styling**: [TailwindCSS](https://tailwindcss.com/), Sass
- **Componentes de UI**: [Headless UI](https://headlessui.dev/), [Lucide React](https://lucide.dev/)
- **Blog**: MDX, Remark, Rehype
- **Análise de Dados**: [Vercel Analytics](https://vercel.com/docs/analytics)
- **Data/Utils**: Day.js, clsx

---

### 📦 Scripts Disponíveis

| Comando          | Descrição                                  |
|------------------|------------------------------------------|
| `npm run dev`    | Inicia o ambiente de desenvolvimento.     |
| `npm run build`  | Gera a build de produção.                 |
| `npm start`      | Inicia o servidor em modo de produção.     |
| `npm run lint`   | Executa o linter para verificar erros.    |
| `npm run format` | Formata o código com Prettier.            |

---

### 📖 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [npm](https://www.npmjs.com/)

### 🛠️ Como Configurar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/eriveltondasilva/portfolio.git
   cd portfolio
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação no navegador em: `http://localhost:3000`

---

### 📁 Estrutura do Projeto

```plaintext
/
├── content/              # Conteúdo do blog em MDX
├── docs/                 # Documentação do projeto
├── public/               # Assets públicos (imagens, fontes, etc.)
├── src/                  # Código-fonte principal
│   ├── app/              # Rotas e estrutura de páginas do Next.js
│   ├── components/       # Componentes reutilizáveis
│   ├── hooks/            # Hooks personalizados
│   ├── styles/           # Estilos globais e temas
│   ├── services/         # Serviços e integrações externas
│   ├── utils/            # Funções e helpers utilitários
│   ├── config.ts         # Configurações globais do projeto
│   ├── plugin.ts         # Configurações de plugins e extensões
│   ├── types.d.ts        # Declarações de tipos TypeScript
│   ├── mdx-components.tsx # Componentes personalizados para renderizar MDX
├── .env                  # Variáveis de ambiente
├── prettierrc.yml        # Configuração do Prettier
├── tailwind.config.js    # Configuração do TailwindCSS
├── next.config.js        # Configuração do Next.js
```

---

### ✍️ Como Contribuir

1. Faça um fork do projeto.
2. Crie uma branch para sua feature ou correção de bug: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'Minha nova feature'`
4. Envie para o repositório remoto: `git push origin minha-feature`
5. Abra um Pull Request.

---

### 📝 Licença

Este projeto está licenciado sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

### 🔗 Links Úteis

- **Repositório**: [GitHub](https://github.com/eriveltondasilva/portfolio)
- **Documentação do Next.js**: [nextjs.org](https://nextjs.org/)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com/)

---

**Desenvolvido com 💙 por Erivelton Silva**