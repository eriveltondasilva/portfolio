import { Accordion, AccordionItem } from './components/mdx/accordion';
import { Badge } from './components/mdx/badge';
import { Callout } from './components/mdx/callout';
import { CodeBlock } from './components/mdx/code-block';
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from './components/mdx/file-tree';
import { Image, RatioImage } from './components/mdx/image';
import { GridImage, ImageGrid } from './components/mdx/image-grid';
import { Kbd } from './components/mdx/kbd';
import { Link } from './components/mdx/link';
import { Step, Steps } from './components/mdx/steps';
import { Table } from './components/mdx/table';
import { Tab, Tabs } from './components/mdx/tabs';
import { Tweet } from './components/mdx/tweet';
import { Youtube } from './components/mdx/youtube';

import type { MDXComponents } from 'mdx/types';

// prettier-ignore
const components: MDXComponents = {
  a: Link,
  img: Image,
  pre: CodeBlock,
  table: Table,
  //
  Accordion,
  AccordionItem,
  Image,
  RatioImage,
  ImageGrid,
  GridImage,
  Tabs,
  Tab,
  Steps,
  Step,
  FileTree,
  FileTreeFolder,
  FileTreeFile,
  //
  Callout,
  Badge,
  Kbd,
  Youtube,
  Tweet,
};

export function useMDXComponents(inherited?: MDXComponents): MDXComponents {
  return { ...inherited, ...components };
}
