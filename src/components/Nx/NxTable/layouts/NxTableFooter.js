// src/components/Nx/NxTable/layouts/NxTableFooter.js
import React from 'react';
import { Pagination, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { BORDER_COL } from '../constants';

const { Option } = Select;

const footerBase = {
  position: 'relative',
  zIndex: 1,
  marginTop: '-1px',
  borderTop: `1px solid ${BORDER_COL}`,
  borderLeft: `1px solid ${BORDER_COL}`,
  borderRight: `1px solid ${BORDER_COL}`,
  borderBottom: `1px solid ${BORDER_COL}`,
  borderRadius: '0 0 8px 8px',
  background: '#fff',
  padding: '6px 12px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
};

const NxTableFooter = ({
  useInfiniteScroll,
  usePagination,
  loading,
  isLoadingMore,
  hasMore,
  resolvedDataSource,
  resolvedTotalData,
  current,
  pageSize,
  onChange,
  onSizeChanger,
  handleRefresh,
  onRefresh,
}) => {
  if (useInfiniteScroll) {
    return (
      <div style={{ ...footerBase, justifyContent: 'flex-end', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>
          Showing {resolvedDataSource?.length || 0} of {Math.max(resolvedTotalData, resolvedDataSource?.length || 0)} entries
          {isLoadingMore && hasMore && ' · Loading...'}
        </span>
        {!hasMore && resolvedDataSource?.length > 0 && (
          <>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#D1D5DB', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '500' }}>All data showed</span>
          </>
        )}
      </div>
    );
  }

  if (usePagination) {
    return (
      <div style={{ ...footerBase, marginTop: '-2px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Select
            value={pageSize}
            onChange={(value) => onSizeChanger(current, value)}
            className="w-15"
            style={{ fontSize: '12px' }}
            size="small"
          >
            {[10, 20, 50, 100].map((size) => (
              <Option key={size} value={size}>{size}</Option>
            ))}
          </Select>
          <span style={{ fontSize: '12px' }}>
            {resolvedTotalData === 0
              ? 'Showing 0 entries'
              : `Showing ${(current - 1) * pageSize + 1} to ${Math.min(current * pageSize, resolvedTotalData)} of ${resolvedTotalData} entries`}
          </span>
        </div>
        <Pagination
          total={resolvedTotalData}
          current={current}
          pageSize={pageSize}
          onChange={onChange}
          showSizeChanger={false}
          showTotal={false}
          style={{ display: 'flex', gap: '3px' }}
          size="small"
        />
      </div>
    );
  }

  return (
    <div style={{ ...footerBase, borderBottom: '1px solid transparent', justifyContent: 'flex-end', gap: '8px' }}>
      <span style={{ fontSize: '12px', color: '#6B7280' }}>
        Showing {resolvedDataSource?.length || 0} of {resolvedTotalData} entries
      </span>
      {!loading && resolvedDataSource?.length > 0 && (
        <>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#D1D5DB', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '500' }}>All data showed</span>
        </>
      )}
    </div>
  );
};

export default NxTableFooter;
