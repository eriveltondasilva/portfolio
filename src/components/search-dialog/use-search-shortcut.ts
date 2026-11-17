import { useEffect } from 'react';

export function useSearchShortcut(onToggle: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey))
        return;

      // ! preventDefault also runs on repeats, so the browser never grabs the address bar
      event.preventDefault();

      if (!event.repeat) onToggle();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);
}
