import { useEffect, useState } from 'react';

const RESET_DELAY_MS = 3_000;

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), RESET_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error('[useCopyToClipboard] Failed to copy to clipboard:', error);
    }
  }

  return { copied, copy };
}
