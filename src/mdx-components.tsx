import { Link } from './components/mdx/link'
import { Youtube } from './components/mdx/youtube'
import { Image } from './components/mdx/image'
import { RatioImage } from './components/mdx/ratio-image'
import { ImageGrid } from './components/mdx/image-grid'
import { Callout } from './components/mdx/callout'
import { CodeBlock } from './components/mdx/code-block'
import { Tweet } from './components/mdx/tweet'
import { Steps, Step } from './components/mdx/steps'
import { Tabs, Tab } from './components/mdx/tabs'
import { Accordion, AccordionItem } from './components/mdx/accordion'
import { Kbd } from './components/mdx/kbd'
import { Badge } from './components/mdx/badge'

import type { MDXComponents } from 'mdx/types'

const components = {
  a: Link,
  img: Image,
  pre: CodeBlock,
  Accordion,
  AccordionItem,
  Image,
  ImageGrid,
  RatioImage,
  Callout,
  Badge,
  Kbd,
  Tabs,
  Tab,
  Steps,
  Step,
  Youtube,
  Tweet,
} satisfies MDXComponents

export function useMDXComponents(inherited?: MDXComponents): MDXComponents {
  return { ...inherited, ...components }
}
