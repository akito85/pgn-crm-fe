// src/components/Nx/NxTable/index.js
// Entry point — preserves all existing import paths across 111 consumers.
// Node/webpack resolves `import X from '.../Nx/NxTable'` to this file
// when the path is a directory, with zero changes to existing importers.

import NxTable from './NxTable';
export { clearPreferences } from './hooks/useColumnPreferences';
import { clearPreferences } from './hooks/useColumnPreferences';

// Fix 9.2: also attach as a static method for backward compat with
// NxTable.clearPreferences({ userId, idTable }) call sites.
NxTable.clearPreferences = clearPreferences;

export default NxTable;
