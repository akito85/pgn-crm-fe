// TableRBI.js (updated)
import React, { useMemo, useState } from "react";
import { DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Pagination, Select, Table } from "antd";
import ColumnSettings from "./ColumnSettings/ColumnSettings";
import SearchBar from "./SearchBar";
import AdvanceSearch from "./AdvanceSearch";

const { Option } = Select;

const TableRBI = ({
  idTable,
  dataSource,
  columns = [],
  pageSize,
  current,
  loading,
  onChange = () => {},
  onSizeChanger = () => {},
  totalData,
  onDelete,
  rowSelection,
  onRowClicked = () => {},
  tableScrolled,
  expandable,
  className,
  useSelect = true,
  usePagination = true,
  onSort = () => {},
  handleDownload = () => {},
  columnDefinitions,
  fixedColumns = { left: [], right: [] },
  setFixedColumns = () => {},
  onAdvanceSearch = () => {},
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]); // hidden columns keys
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);

  // ---------- Helper: build visible + fixed-applied columns ----------
  const displayedColumns = useMemo(() => {
    // Normalize keys for safety
    const cols = (columns || []).map((c) => ({
      ...c,
      key: c.key || c.dataIndex || c.title,
    }));

    // 1) Filter out hidden columns
    const visible = cols.filter((col) => !optionSelectedCol.includes(col.key));

    // 2) Separate into left, normal, right based on fixedColumns lists, preserving original order
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    visible.forEach((col) => {
      if (
        Array.isArray(fixedColumns.left) &&
        fixedColumns.left.includes(col.key)
      ) {
        leftFixed.push(col);
      } else if (
        Array.isArray(fixedColumns.right) &&
        fixedColumns.right.includes(col.key)
      ) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    // 3) Apply `fixed` property to copies of columns
    const applyFixedProp = (col, fixedPos) => {
      const newCol = { ...col };
      if (fixedPos) newCol.fixed = fixedPos;
      else delete newCol.fixed;
      return newCol;
    };

    // 4) Reorder: leftFixed -> normal -> rightFixed
    const finalCols = [
      ...leftFixed.map((c) => applyFixedProp(c, "left")),
      ...normal.map((c) => applyFixedProp(c, undefined)),
      ...rightFixed.map((c) => applyFixedProp(c, "right")),
    ];

    return finalCols;
  }, [columns, optionSelectedCol, fixedColumns]);

  // ---------- Handlers ----------
  const handleAdvanceSearch = (searchData) => {
    onAdvanceSearch(searchData);
    setIsAdvanceOpen(false);
  };

  const handleClearFilter = () => {
    onAdvanceSearch(null);
  };

  // ---------- UI ----------
  return (
    <div className={"flex flex-col w-full"}>
      {useSelect ? (
        <div className={"w-full flex mb-5 justify-between items-center"}>
          {/* Column Settings Component */}
          <ColumnSettings
            columns={columnDefinitions || columns}
            hiddenColumns={optionSelectedCol}
            onHiddenColumnsChange={setOptionSelectedCol}
            fixedColumns={fixedColumns}
            onFixedColumnsChange={setFixedColumns}
            buttonText="Column Settings"
            buttonStyle={{ height: "40px" }}
          />

          <div className="w-full flex justify-end gap-2">
            <Button
              icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
              onClick={handleDownload}
              style={{
                border: "1px solid #BDBDBD",
                color: "black",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              Export
            </Button>

            <Button
              onClick={() => setIsAdvanceOpen(true)}
              style={{
                border: "1px solid #BDBDBD",
                color: "black",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              <FilterOutlined style={{ fontSize: "20px" }} />
              Advance Search
            </Button>

            {/* SearchBar - jangan di hilangkan */}
            <SearchBar />
          </div>
        </div>
      ) : null}

      {/* Table */}
      <Table
        dataSource={dataSource}
        columns={displayedColumns}
        scroll={tableScrolled}
        bordered
        pagination={false}
        className={`w-full ${className}`}
        loading={loading}
        tableLayout="fixed"
        expandable={expandable}
        id={idTable}
        onChange={onSort}
        rowSelection={rowSelection}
      />

      {/* Pagination */}
      {usePagination ? (
        <div className={"w-full flex justify-between mt-5 items-center"}>
          <div className="flex items-center gap-3">
            <Select
              value={pageSize}
              onChange={(value) => onSizeChanger(current, value)}
              className="w-20"
              size="small"
            >
              {[10, 20, 50, 100].map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
            <span>
              Showing {(current - 1) * pageSize + 1} to{" "}
              {Math.min(current * pageSize, totalData)} of {totalData} entries
            </span>
          </div>
          <Pagination
            total={totalData}
            current={current}
            pageSize={pageSize}
            onChange={onChange}
            showSizeChanger={false}
            showTotal={false}
            style={{ display: "flex", gap: "3px" }}
            size="small"
          />
        </div>
      ) : null}

      {/* Advance Search Modal */}
      <AdvanceSearch
        visible={isAdvanceOpen}
        onClose={() => setIsAdvanceOpen(false)}
        onSearch={handleAdvanceSearch}
        onClear={handleClearFilter}
        columns={columnDefinitions || columns}
        modalWidth={600}
      />
    </div>
  );
};

export default TableRBI;
