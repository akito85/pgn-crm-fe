// src/components/Nx/NxTable/hooks/useInfiniteScroll.js
import React, { useState, useEffect } from 'react';
import { SCROLL_THRESHOLD_PX } from '../constants';

const useInfiniteScroll = ({
  useInfiniteScroll: enabled,
  safeId,
  containerRef,
  hasMore,
  onLoadMore,
  filteredDataLength,  // data count — used by Phase A when virtual=true
  tableScrollY,
  virtual,
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMoreRef      = React.useRef(hasMore);
  const onLoadMoreRef   = React.useRef(onLoadMore);
  const isLoadingMoreRef = React.useRef(false);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { onLoadMoreRef.current = onLoadMore; }, [onLoadMore]);

  const infiniteObserverRef   = React.useRef(null);
  const infiniteScrollRootRef = React.useRef(null);
  const infinitePhaseRef      = React.useRef('fill');

  // Fix 2.1: loadGenRef is per-instance (useRef, not module-level) so two
  // simultaneously mounted NxTable instances have independent counters.
  const loadGenRef = React.useRef(0);

  // ── Shared trigger ──────────────────────────────────────────────────────
  const triggerLoad = React.useCallback(() => {
    if (!hasMoreRef.current || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    const gen = ++loadGenRef.current;
    setIsLoadingMore(true);
    Promise.resolve(onLoadMoreRef.current())
      .catch(() => {})
      .finally(() => {
        // Fix 2.1: only clear the gate if generation still matches.
        if (loadGenRef.current === gen) {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        }
      });
  }, []);

  // ── Full teardown when enabled/safeId/tableScrollY changes ─────────────
  // Cleanup runs unconditionally so the scroll listener is removed when
  // enabled becomes false (e.g. fuzzy search active). Without this the
  // Phase B listener stays live on the DOM and fires on horizontal scroll.
  useEffect(() => {
    if (infiniteObserverRef.current) {
      infiniteObserverRef.current.disconnect();
      infiniteObserverRef.current = null;
    }
    infiniteScrollRootRef.current = null;
    infinitePhaseRef.current = 'fill';
    if (!enabled) return;
  }, [enabled, safeId, tableScrollY]);


  // ── Phase A + Phase B effect ────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    let attachRafId = null;
    let destroyed   = false;

    // ── Phase B: scroll listener ──────────────────────────────────────────
    const startScrollPhase = (scrollRoot) => {
      if (destroyed || infiniteObserverRef.current) return;
      infinitePhaseRef.current = 'scroll';

      const onScroll = () => {
        if (!hasMoreRef.current || isLoadingMoreRef.current) return;
        const { scrollTop, clientHeight, scrollHeight } = scrollRoot;
        if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD_PX) {
          triggerLoad();
        }
      };

      scrollRoot.addEventListener('scroll', onScroll, { passive: true });
      infiniteObserverRef.current = {
        disconnect: () => scrollRoot.removeEventListener('scroll', onScroll),
      };
    };

    // ── Phase A: fill the container ───────────────────────────────────────
    const checkFill = (scrollRoot) => {
      if (destroyed) return;
      if (infinitePhaseRef.current === 'scroll') return;

      if (scrollRoot.scrollHeight > scrollRoot.clientHeight) {
        startScrollPhase(scrollRoot);
        return;
      }

      if (!hasMoreRef.current || isLoadingMoreRef.current) return;

      const firstRow = scrollRoot.querySelector(
        'tr.ant-table-row, tr:not(.ant-table-placeholder):not(.ant-table-measure-row)'
      );
      if (!firstRow || firstRow.getBoundingClientRect().height <= 0) {
        attachRafId = requestAnimationFrame(() => checkFill(scrollRoot));
        return;
      }

      const rowH       = firstRow.getBoundingClientRect().height;
      const containerH = scrollRoot.clientHeight;
      const rowsNeeded = Math.ceil(containerH / rowH);

      // Fix 4.3 / virtual compat: when virtual=true the DOM row count reflects
      // only the visible window (~20-40 rows), not total loaded data. Use the
      // data source length instead so Phase A correctly measures loaded records.
      const currentRows = virtual
        ? filteredDataLength
        : scrollRoot.querySelectorAll(
            'tr.ant-table-row, tr:not(.ant-table-placeholder):not(.ant-table-measure-row)'
          ).length;

      if (currentRows < rowsNeeded) {
        triggerLoad();
      } else {
        startScrollPhase(scrollRoot);
      }
    };

    // ── Bootstrap ─────────────────────────────────────────────────────────
    // Fix 6.2: prefer containerRef downward query over full-document scan.
    const resolveScrollRoot = () => {
      if (infiniteScrollRootRef.current) return infiniteScrollRootRef.current;
      const container = containerRef.current;
      const root = container
        ? container.querySelector('.ant-table-body')
        : document.querySelector(`#${safeId} .ant-table-body`);
      if (root) infiniteScrollRootRef.current = root;
      return root;
    };

    const boot = () => {
      const scrollRoot = resolveScrollRoot();
      if (!scrollRoot) return false;
      attachRafId = requestAnimationFrame(() => checkFill(scrollRoot));
      return true;
    };

    if (!boot()) {
      const retry = () => {
        if (boot()) return;
        attachRafId = requestAnimationFrame(retry);
      };
      attachRafId = requestAnimationFrame(retry);
    }

    return () => {
      destroyed = true;
      if (attachRafId) cancelAnimationFrame(attachRafId);
      // Do NOT disconnect the observer here — it survives data appends.
      // Observer teardown is in the sibling effect watching [safeId, tableScrollY].
    };
  }, [enabled, safeId, filteredDataLength, tableScrollY, triggerLoad, containerRef, virtual]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isLoadingMore };
};

export default useInfiniteScroll;
