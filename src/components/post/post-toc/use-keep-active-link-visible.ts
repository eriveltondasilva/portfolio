import { useEffect, useRef } from 'react';

/**
 * The nav has its own scroll (`overflow-y-auto`), so on long lists the active
 * link can end up out of sight. `scrollIntoView` is avoided on purpose: it would
 * also scroll the page when the sticky nav is partially off-screen.
 */
export function useKeepActiveLinkVisible(activeId: string | null) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const activeLink = nav?.querySelector('[aria-current="location"]');

    if (!nav || !activeLink) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    if (linkRect.top < navRect.top) {
      nav.scrollTop -= navRect.top - linkRect.top;
    } else if (linkRect.bottom > navRect.bottom) {
      nav.scrollTop += linkRect.bottom - navRect.bottom;
    }
  }, [activeId]);

  return navRef;
}
