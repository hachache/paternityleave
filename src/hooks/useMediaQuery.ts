import { useEffect, useState } from 'react';

/**
 * Hook pour détecter les media queries de manière propre
 * Utilise matchMedia pour éviter l'appel direct à window
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Fonction de callback pour les changements
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Écouter les changements
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// Helpers pré-configurés pour les breakpoints courants
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
