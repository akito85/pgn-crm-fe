// src/components/Nx/NxTable/hooks/useKeyboardNav.js
import React from 'react';

// Fix 6.1: tableBodyRef caches the DOM element on first successful lookup.
// Previously two full-document querySelector calls fired on EVERY keydown.
const useKeyboardNav = ({ safeId, containerRef }) => {
  const tableBodyRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable;
      if (isTyping) return;

      // Resolve once; reuse on subsequent events.
      if (!tableBodyRef.current) {
        const container = containerRef.current;
        if (!container) return;
        tableBodyRef.current = container.querySelector('.ant-table-body');
      }
      const tableBody = tableBodyRef.current;
      if (!tableBody) return;

      const scrollAmount = 100;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        tableBody.scrollTo({ left: tableBody.scrollLeft - scrollAmount, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        tableBody.scrollTo({ left: tableBody.scrollLeft + scrollAmount, behavior: 'smooth' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      tableBodyRef.current = null; // reset cache on unmount
    };
  }, [safeId, containerRef]);
};

export default useKeyboardNav;
