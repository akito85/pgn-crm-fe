// src/components/Nx/NxTable/hooks/useModalInfiniteData.js
//
// Encapsulates the infinite-scroll data accumulation pattern for NxTable
// inside a modal. Handles RTK Query cache-busting, page management,
// and open/close lifecycle so consumers don't duplicate fragile state logic.
import { useState, useCallback, useRef, useEffect } from 'react';

const useModalInfiniteData = ({ queryHook, pageSize = 10, enabled = false }) => {
  const [page, setPage]       = useState(0);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [gen, setGen]         = useState(0);
  const pendingRef            = useRef(null);

  // _gen is never sent to the server (queryFn destructures only known fields)
  // but RTK Query includes it in the cache key, forcing a fresh fetch per open().
  const { data, isLoading, isFetching } = queryHook(
    { page, size: pageSize, _gen: gen },
    { skip: !enabled || gen === 0 },
  );

  // Accumulate pages. page 0 always replaces; subsequent pages append.
  // Because _gen changes on every open(), the data reference always changes,
  // guaranteeing this effect fires (unlike the old pattern where RTK cache
  // could serve the same reference and silently skip this effect).
  useEffect(() => {
    if (!data?.result) return;
    if (data.currentPage === 0) {
      setAllData(data.result);
    } else {
      setAllData(prev => [...prev, ...data.result]);
    }
    setHasMore(data.currentPage < data.totalPages - 1);
    if (pendingRef.current) { pendingRef.current(); pendingRef.current = null; }
  }, [data]);

  // Promise-gated loadMore — keeps useInfiniteScroll's gate locked until data
  // actually arrives, preventing rapid-fire page increments.
  const loadMore = useCallback(() => {
    if (!hasMore || isFetching) return Promise.resolve();
    return new Promise(resolve => {
      pendingRef.current = resolve;
      setPage(prev => prev + 1);
    });
  }, [hasMore, isFetching]);

  // Call when modal opens. Resets page and increments gen to bust RTK cache.
  const open = useCallback(() => {
    setPage(0);
    setAllData([]);
    setHasMore(true);
    setGen(prev => prev + 1);
  }, []);

  // Call when modal closes. Releases any pending loadMore promise.
  const close = useCallback(() => {
    if (pendingRef.current) { pendingRef.current(); pendingRef.current = null; }
  }, []);

  return { data: allData, loading: isLoading, hasMore, loadMore, open, close };
};

export default useModalInfiniteData;
