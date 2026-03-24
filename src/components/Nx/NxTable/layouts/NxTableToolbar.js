// src/components/Nx/NxTable/layouts/NxTableToolbar.js
import React, { useCallback } from 'react';
import { Button } from 'antd';
import { DownloadOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import ColumnSettings from '../../ColumnSettings/ColumnSettings';
import SearchBar from '../features/SearchBar';

// Fix 4.5: onHiddenColumnsChange and onFixedColumnsChange extracted to
// useCallback — ColumnSettings (React.memo) now receives stable references.
const NxTableToolbar = ({
  columnDefinitions,
  resolvedColumns,
  optionSelectedCol,
  onHiddenColumnsChange,    // stable useCallback from NxTable.js
  safeFixedColumns,
  onFixedColumnsChange,     // stable useCallback from NxTable.js
  staticFixedKeys,
  prefsStorageKey,
  columnWidths,
  handleClearPreferences,
  customHeaderLeft,
  showExport,
  showAdvanceSearch,
  showSearchBar,
  showRefresh,
  loading,
  handleRefresh,
  handleDownload,
  onSearch,                 // stable useCallback from NxTable.js
  setIsAdvanceOpen,
}) => {
  const hasRightControls = showExport || showAdvanceSearch || showSearchBar || showRefresh;

  return (
    <div className="w-full flex mb-3 justify-between items-center">
      <div className="flex items-center gap-4">
        <ColumnSettings
          columns={columnDefinitions || resolvedColumns}
          hiddenColumns={optionSelectedCol}
          onHiddenColumnsChange={onHiddenColumnsChange}
          fixedColumns={safeFixedColumns}
          onFixedColumnsChange={onFixedColumnsChange}
          staticFixedKeys={staticFixedKeys}
          buttonText="Column Settings"
          buttonStyle={{ height: '32px', fontSize: '12px' }}
        />

        {prefsStorageKey && (
          optionSelectedCol.length > 0 ||
          safeFixedColumns.left.filter((k) => !staticFixedKeys.left.includes(k)).length > 0 ||
          safeFixedColumns.right.filter((k) => !staticFixedKeys.right.includes(k)).length > 0 ||
          Object.keys(columnWidths).length > 0
        ) && (
          <Button
            size="small"
            onClick={handleClearPreferences}
            title="Reset all column settings (hidden, fixed, widths, order) to defaults"
            style={{
              border: '1px solid #BDBDBD',
              color: '#6B7280',
              borderRadius: '8px',
              height: '32px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ↺ Reset columns
          </Button>
        )}

        {customHeaderLeft && customHeaderLeft}
      </div>

      {hasRightControls && (
        <div className="flex justify-end gap-2">
          {showRefresh && (
            <Button
              icon={<ReloadOutlined style={{ fontSize: '14px' }} />}
              onClick={handleRefresh}
              loading={loading}
              style={{ border: '1px solid #BDBDBD', color: 'black', borderRadius: '8px', height: '32px', fontSize: '12px' }}
            >
              Refresh
            </Button>
          )}

          {showExport && (
            <Button
              icon={<DownloadOutlined style={{ fontSize: '14px' }} />}
              onClick={handleDownload}
              style={{ border: '1px solid #BDBDBD', color: 'black', borderRadius: '8px', height: '32px', fontSize: '12px' }}
            >
              Export
            </Button>
          )}

          {showAdvanceSearch && (
            <Button
              onClick={() => setIsAdvanceOpen(true)}
              style={{ border: '1px solid #BDBDBD', color: 'black', borderRadius: '8px', height: '32px', fontSize: '12px' }}
            >
              <FilterOutlined style={{ fontSize: '14px' }} />
              Advanced Search
            </Button>
          )}

          {showSearchBar && (
            <div style={{ width: '200px' }}>
              <SearchBar placeholder="Search content here ...." onSearch={onSearch} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NxTableToolbar;
