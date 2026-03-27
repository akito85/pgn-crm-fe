import { Table, Empty } from 'antd';

// ── Shared visual constants (identical to NxTableInlineEdit / NxTable) ────────
const HEADER_BG   = '#2C6FAD';
const BORDER_COL  = '#C8CDD4';
const ROW_WHITE   = '#FFFFFF';
const ROW_HOVER   = '#EBF2FA';
const FONT_FAMILY = "'PlusJakartaSans', 'PublicSans', sans-serif";

// ── Shared CSS factory (scoped by idTable, mirrors NxTableInlineEdit exactly) ─
const buildTableStyles = (idTable) => `
  #${idTable} .ant-table-content {
    position: relative;
    z-index: 1;
  }

  #${idTable} .ant-table-body {
    position: relative;
    z-index: 1;
  }

  #${idTable} .ant-table-tbody > tr {
    position: relative;
    z-index: 1;
  }

  #${idTable} .ant-table-tbody > tr:hover {
    z-index: 2;
  }

  #${idTable} .ant-table-body::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  #${idTable} .ant-table-body::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  #${idTable} .ant-table-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
  }

  #${idTable} .ant-table-body::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  #${idTable} .ant-table-body {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
    padding-bottom: 0;
  }

  #${idTable} .ant-table {
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    border: none;
    border-collapse: collapse;
    border-spacing: 0;
  }

  #${idTable} .ant-table-container {
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    border: none;
  }

  #${idTable} .ant-table-container table > thead > tr:first-child > *:first-child {
    border-start-start-radius: 8px;
  }

  #${idTable} .ant-table-container table > thead > tr:first-child > *:last-child {
    border-start-end-radius: 8px;
  }

  #${idTable} .ant-table-tbody > tr:last-child > *:first-child {
    border-end-start-radius: 0;
  }

  #${idTable} .ant-table-tbody > tr:last-child > *:last-child {
    border-end-end-radius: 0;
  }

  #${idTable} .ant-table-bordered .ant-table-cell,
  #${idTable} .ant-table-bordered .ant-table-thead > tr > th,
  #${idTable} .ant-table-bordered .ant-table-tbody > tr > td,
  #${idTable} .ant-table-bordered .ant-table-container {
    border-color: ${BORDER_COL} !important;
  }

  #${idTable} .ant-table-thead > tr > th {
    padding: 4px 8px !important;
    line-height: 22px !important;
    height: 30px !important;
    max-height: 30px !important;
    min-height: 30px !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    box-sizing: border-box !important;
    border-right: 1px solid ${BORDER_COL} !important;
    border-bottom: 1px solid ${BORDER_COL} !important;
    font-family: ${FONT_FAMILY};
    background-color: ${HEADER_BG} !important;
    color: #fff !important;
  }

  #${idTable} .ant-table-thead > tr > th > span,
  #${idTable} .ant-table-thead > tr > th > div {
    max-height: 22px !important;
    line-height: 22px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  #${idTable} .ant-table-thead > tr:first-child > th {
    border-top: 1px solid ${BORDER_COL} !important;
  }

  #${idTable} .ant-table-thead > tr > th:first-child {
    border-left: 1px solid ${BORDER_COL} !important;
  }

  /* Active sorter icon — keep white on blue header */
  #${idTable} .ant-table-thead .ant-table-column-sorter-up.active .anticon,
  #${idTable} .ant-table-thead .ant-table-column-sorter-down.active .anticon {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  #${idTable} .ant-table-tbody > tr:not(.ant-table-measure-row) > td {
    padding: 4px 8px !important;
    min-height: 30px;
    font-size: 12px;
    border-right: 1px solid ${BORDER_COL} !important;
    border-bottom: 1px solid ${BORDER_COL} !important;
    font-family: ${FONT_FAMILY};
  }

  #${idTable} .ant-table-tbody > tr:not(.ant-table-measure-row) > td:first-child {
    border-left: 1px solid ${BORDER_COL} !important;
  }

  /* ── Alternating row colors — exclude placeholder & measure rows ── */
  #${idTable} .ant-table-tbody > tr:not(.ant-table-placeholder):not(.ant-table-measure-row):nth-child(odd) > td {
    background-color: ${ROW_WHITE} !important;
  }

  #${idTable} .ant-table-tbody > tr:not(.ant-table-placeholder):not(.ant-table-measure-row):nth-child(even) > td {
    background-color: ${ROW_HOVER} !important;
  }

  #${idTable} .ant-table-tbody > tr:not(.ant-table-placeholder):not(.ant-table-measure-row):hover > td {
    background-color: ${ROW_HOVER} !important;
  }

  /* ── Empty / placeholder row — always white ── */
  #${idTable} .ant-table-placeholder > td {
    background-color: ${ROW_WHITE} !important;
    border-left: 1px solid ${BORDER_COL} !important;
    border-right: 1px solid ${BORDER_COL} !important;
    border-bottom: 1px solid ${BORDER_COL} !important;
  }

  #${idTable} .ant-table-placeholder:hover > td {
    background-color: ${ROW_WHITE} !important;
  }

  /* ── Measure row (Ant internal) — fully hidden ── */
  #${idTable} .ant-table-measure-row > td {
    padding: 0 !important;
    height: 0 !important;
    line-height: 0;
    font-size: 0;
    overflow: hidden;
  }
`;

/**
 * NxTableBase
 *
 * A fast, sort-only base table that shares the exact visual style of
 * NxTableInlineEdit and NxTable. No selection, no inline editing —
 * just clean data display with column sorting and a footer entry count.
 *
 * Props:
 *   idTable     {string}    — unique DOM id for CSS scoping (required)
 *   dataSource  {Array}     — row data
 *   columns     {Array}     — Ant Design column definitions
 *                             Extra per-column flags:
 *                               isNumber        {boolean} — right-align
 *                               isClassification{boolean} — center-align
 *   rowKey      {string}    — key field name (default: 'key')
 *   loading     {boolean}
 *   scroll      {object}    — Ant Design scroll prop, e.g. { y: 380 }
 *   emptyText   {string}    — empty state message
 *   onChange    {Function}  — table onChange (sorter, filters, pagination)
 *   onRow       {Function}  — Ant Design onRow handler
 */
const NxTableBase = ({
  idTable = 'nx-table-base',
  dataSource = [],
  columns = [],
  rowKey = 'key',
  loading = false,
  scroll = { y: 380 },
  emptyText = 'No data available.',
  onChange,
  onRow,
}) => {
  // ── Column processing ───────────────────────────────────────────────────────
  const processedColumns = columns.map((col) => {
    let textAlign = 'left';
    if (col.isNumber || col.align === 'right') textAlign = 'right';
    else if (col.isClassification || col.align === 'center') textAlign = 'center';

    return {
      ...col,
      key: col.key || col.dataIndex,
      onHeaderCell: () => ({
        style: {
          textTransform: 'uppercase',
          fontSize: '10px',
          cursor: col.sorter ? 'pointer' : 'default',
        },
      }),
      onCell: () => ({
        style: {
          textAlign,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '12px',
        },
      }),
    };
  });

  // ── Footer bar (same pattern as NxTableInlineEdit) ──────────────────────────
  const footerBar = (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        marginTop: '-1px',
        borderLeft: `1px solid ${BORDER_COL}`,
        borderRight: `1px solid ${BORDER_COL}`,
        borderBottom: `1px solid ${BORDER_COL}`,
        borderTop: `1px solid ${BORDER_COL}`,
        borderRadius: '0 0 8px 8px',
        background: '#fff',
        padding: '6px 12px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '12px', color: '#6B7280' }}>
        Showing {dataSource.length} of {dataSource.length} entries
      </span>
      {!loading && dataSource.length > 0 && (
        <>
          <span
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#D1D5DB',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '500' }}>
            All data showed
          </span>
        </>
      )}
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div id={idTable}>
      <style>{buildTableStyles(idTable)}</style>

      <div style={{ position: 'relative' }}>
        <Table
          dataSource={dataSource}
          columns={processedColumns}
          rowKey={rowKey}
          loading={loading}
          scroll={scroll}
          bordered
          pagination={false}
          size="small"
          tableLayout="fixed"
          onChange={onChange}
          onRow={onRow}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ fontFamily: FONT_FAMILY, fontSize: '12px', color: '#999' }}>
                    {emptyText}
                  </span>
                }
              />
            ),
          }}
          style={{ margin: 0 }}
        />
      </div>

      {footerBar}
    </div>
  );
};

export default NxTableBase;
