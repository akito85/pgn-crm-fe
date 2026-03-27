// src/components/Nx/NxTable/hooks/useAutoHeight.js
import React from 'react';
import { FOOTER_HEIGHT_PX, TOOLBAR_HEIGHT_PX } from '../constants';

// Fix 3.1: single ResizeObserver handles both dynamicScrollY and containerWidth.
// Previously two separate observers on containerRef.current caused redundant
// setState calls when autoHeight toggled repeatedly.
const useAutoHeight = ({ autoHeight, tableScrollYProp, useInfiniteScroll, usePagination, useSelect, containerRef, totalDataCount }) => {
  const [dynamicScrollY, setDynamicScrollY]   = React.useState(tableScrollYProp);
  const [containerWidth, setContainerWidth]   = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Compute both values in a single callback — one observer, one disconnect.
    const compute = () => {
      // Container width (for fixed-column warning).
      const rect = el.getBoundingClientRect();
      setContainerWidth(rect.width);

      // Dynamic scroll height.
      if (!autoHeight) {
        setDynamicScrollY(tableScrollYProp);
        return;
      }

      const FOOTER_H  = (useInfiniteScroll || usePagination) ? FOOTER_HEIGHT_PX : 0;
      const TOOLBAR_H = useSelect ? TOOLBAR_HEIGHT_PX : 0;
      const viewportH = window.innerHeight;
      const BOTTOM_MARGIN = Math.round(viewportH * 0.10);
      let available = viewportH - rect.top - FOOTER_H - TOOLBAR_H - BOTTOM_MARGIN;

      // Fix: Adjust for small datasets (10-30 rows) to ensure scrollability
      if (useInfiniteScroll && totalDataCount > 0 && totalDataCount <= 30) {
        const estimatedRowHeight = 35;
        const MIN_OVERFLOW = 100;
        const contentHeight = totalDataCount * estimatedRowHeight;
        const minHeightForScroll = contentHeight + MIN_OVERFLOW;
        const minHeightWithMargins = minHeightForScroll + FOOTER_H + TOOLBAR_H + BOTTOM_MARGIN;
        const maxAvailableForSmallData = Math.max(tableScrollYProp, minHeightWithMargins - rect.top);
        available = Math.min(available, maxAvailableForSmallData);
      }

      setDynamicScrollY(Math.max(tableScrollYProp, Math.floor(available)));
    };

    compute();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(compute);
      ro.observe(el);
      window.addEventListener('resize', compute, { passive: true });
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', compute);
      };
    }

    window.addEventListener('resize', compute, { passive: true });
    return () => window.removeEventListener('resize', compute);
  }, [autoHeight, tableScrollYProp, useInfiniteScroll, usePagination, useSelect, containerRef, totalDataCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return { dynamicScrollY, containerWidth };
};

export default useAutoHeight;
