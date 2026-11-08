# Erivelton's Portfolio

Portfólio pessoal com blog, feito com Next.js e MDX.

**No ar:** [erivelton.vercel.app](https://erivelton.vercel.app) · [English](./README.md)

## Sobre

Um site pessoal com blog escrito em MDX, séries de posts e uma lista de projetos buscada direto no GitHub. Todo o conteúdo vive no repositório como arquivos e é validado no build, então conteúdo inválido nunca chega à produção.

## Recursos

- **Blog em MDX:** metadados do post em `meta.yml` validados com Zod, além de tags, autores, séries e posts arquivados.
- **Projetos do GitHub:** repositórios com o topic `portfolio` viram projetos; os demais topics controlam destaque e status.
- **Reações e comentários:** reações com Upstash Redis e limite de requisições, comentários via Giscus.
- **Extras automáticos:** feed RSS, sitemap, imagens Open Graph, JSON-LD, índice do post e tempo de leitura.
- **Validação no build:** metadados, imagens ou referências quebradas fazem o build falhar.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · MDX · Zod · Upstash Redis · Giscus · Bun · Vercel

## Como rodar

Requer o [Bun](https://bun.sh).

```bash
bun install
cp .env.example .env.local
bun run build:indexes
bun dev
```

O servidor de desenvolvimento não regenera os índices de conteúdo: rode `bun run build:blog` depois de alterar um `meta.yml`, `authors.yml` ou `series.yml`. Para criar um post novo, use `bun run new-post`.

## Documentação

A documentação completa é a série **Manual do Blog**, publicada no site: [erivelton.vercel.app/series/manual-do-blog](https://erivelton.vercel.app/series/manual-do-blog). Ela cobre a estrutura de conteúdo, os componentes MDX, os projetos do GitHub, as variáveis de ambiente e o deploy, as reações com Redis e os recursos automáticos.

## Licença

[MIT](./LICENSE)
