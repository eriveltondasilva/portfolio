import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import rehypePrettyCode from 'rehype-pretty-code';

import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code';

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: 'one-dark-pro',
  defaultLang: 'plaintext',
  bypassInlineCode: true,
  transformers: [
    transformerNotationDiff({ matchAlgorithm: 'v3' }),
    transformerNotationFocus({ matchAlgorithm: 'v3' }),
    transformerNotationHighlight({ matchAlgorithm: 'v3' }),
  ],
};

/**
 * Lives in its own file because Turbopack takes plugins by name with serializable options,
 * and `transformers` are functions.
 **/
export default function rehypeCode() {
  return rehypePrettyCode(rehypePrettyCodeOptions);
}
