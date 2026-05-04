import { useState, useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';

function getInitialIsMobile(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(MOBILE_QUERY).matches;
}

export interface WindowSize {
  isMobile: boolean;
}

// matchMedia fires only when the breakpoint is crossed, so this is cheaper
// than a resize listener and avoids needing a debounce.
export function useWindowSize(): WindowSize {
  const [isMobile, setIsMobile] = useState<boolean>(getInitialIsMobile);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return { isMobile };
}
