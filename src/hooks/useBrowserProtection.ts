import { useEffect } from 'react';

export const useBrowserProtection = () => {
  const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;

  useEffect(() => {
    if (ENVIRONMENT === 'DEVELOPMENT') return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleDragStart = (e: DragEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey &&
          e.shiftKey &&
          ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
