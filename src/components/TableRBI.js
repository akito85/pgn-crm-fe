// TableRBI.js
import { DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Pagination, Select, Table } from "antd";
import { useState } from "react";
import ColumnSettings from "./ColumnSettings/ColumnSettings";
import SearchBar from "./SearchBar";
import AdvanceSearch from "./AdvanceSearch";

const { Option } = Select;

const TableRBI = ({
  idTable,
  dataSource,
  columns,
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
  fixedColumns,
  setFixedColumns,
  onAdvanceSearch = () => {},
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);

  // Filter columns based on visibility (hide/show)
  const filterColumns = () => {
    return columns.filter((col) => {
      return !optionSelectedCol.includes(col.key);
    });
  };

  // Handle advance search
  const handleAdvanceSearch = (searchData) => {
    console.log("Advance Search Data:", searchData);
    onAdvanceSearch(searchData);
    setIsAdvanceOpen(false);
  };

  // Handle clear filter
  const handleClearFilter = () => {
    console.log("Clear filter");
    onAdvanceSearch(null);
  };

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
        columns={filterColumns()}
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
