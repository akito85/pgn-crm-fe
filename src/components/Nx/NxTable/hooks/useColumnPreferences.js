// src/components/Nx/NxTable/hooks/useColumnPreferences.js
import React, { useCallback } from 'react';
import { PREFS_DEBOUNCE_MS, PREFS_VERSION } from '../constants';

export const buildStorageKey = (userId, idTable) =>
  userId && idTable ? `nxtable__${userId}__${idTable}` : null;

const readPrefs = (storageKey) => {
  if (!storageKey) return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== PREFS_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

const makePrefsWriter = (storageKey) => {
  if (!storageKey) {
    const noop = () => {};
    noop.cancel = () => {};
    return noop;
  }
  let timer = null;
  const write = (prefs) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      try {
        localStorage.setItem(storageKey, JSON.stringify({ version: PREFS_VERSION, ...prefs }));
      } catch {
        // Quota exceeded or private-browsing — fail silently.
      }
    }, PREFS_DEBOUNCE_MS);
  };
  write.cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
  return write;
};

// Fix 9.4: use two separate refs instead of ref._key (non-standard pattern).
const useColumnPreferences = ({ userId, idTable, fixedColumnsProp }) => {
  const storageKey = buildStorageKey(userId, idTable);

  const savedPrefsRef    = React.useRef(undefined);
  const savedPrefsKeyRef = React.useRef(null);       // Fix 9.4: was ref._key

  if (savedPrefsRef.current === undefined || savedPrefsKeyRef.current !== storageKey) {
    savedPrefsRef.current    = readPrefs(storageKey);
    savedPrefsKeyRef.current = storageKey;
  }
  const savedPrefs = savedPrefsRef.current;

  const writerRef = React.useRef(null);
  if (!writerRef.current) writerRef.current = makePrefsWriter(storageKey);
  React.useEffect(() => {
    writerRef.current?.cancel?.();
    writerRef.current = makePrefsWriter(storageKey);
    savedPrefsRef.current    = readPrefs(storageKey);
    savedPrefsKeyRef.current = storageKey;
  }, [storageKey]);

  const write = useCallback((patch) => {
    writerRef.current(patch);
  }, []);

  const initHiddenColumns = savedPrefs?.hiddenColumns ?? [];
  const initFixedColumns  = savedPrefs?.fixedColumns ?? {
    left:  Array.isArray(fixedColumnsProp?.left)  ? [...fixedColumnsProp.left]  : [],
    right: Array.isArray(fixedColumnsProp?.right) ? [...fixedColumnsProp.right] : [],
  };
  const initColumnWidths = savedPrefs?.columnWidths ?? {};
  const initColumnOrder  = savedPrefs?.columnOrder  ?? [];

  return { write, initHiddenColumns, initFixedColumns, initColumnWidths, initColumnOrder, storageKey };
};

// ── Static utility — clear saved preferences ─────────────────────────────
export const clearPreferences = ({ userId, idTable: tableId } = {}) => {
  if (!userId) return;
  try {
    if (tableId) {
      const key = buildStorageKey(userId, tableId);
      if (key) localStorage.removeItem(key);
    } else {
      const prefix = `nxtable__${userId}__`;
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) toRemove.push(k);
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    // Private browsing or quota error — fail silently.
  }
};

export default useColumnPreferences;
