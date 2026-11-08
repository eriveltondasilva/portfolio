import { CopyButton } from './copy-button';

import type { ComponentProps } from 'react';

export function CodeBlock({ children, ...props }: ComponentProps<'pre'>) {
  return (
    <div data-code-block>
      <pre {...props}>{children}</pre>

      <CopyButton />
    </div>
  );
}
