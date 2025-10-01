// TablePagination.js
import { DownloadOutlined, DownOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Pagination,
  Select,
  Table,
  Dropdown,
  Checkbox,
  Modal,
} from "antd";
import { useState, useMemo } from "react";
const { Option } = Select;

const TablePagination = ({
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
}) => {
  const [optionSelectedCol, setOptionSelectedCol] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false); // <-- state modal

  const handleDisplayColumn = (value) => {
    setOptionSelectedCol(value);
  };
  const handleDelete = (index) => {
    onDelete(index);
  };
  const filterColumns = () => {
    return columns.filter((col) => {
      return !optionSelectedCol.includes(col.title);
    });
  };

  const filteredColumns = useMemo(() => {
    if (!searchText) return columns;
    return columns.filter((col) =>
      col.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [columns, searchText]);

  const onCheckboxChange = (e, title) => {
    const checked = e.target.checked;
    let newSelected;
    if (checked) {
      newSelected = optionSelectedCol.filter((col) => col !== title);
    } else {
      newSelected = [...optionSelectedCol, title];
    }
    setOptionSelectedCol(newSelected);
  };

  const menu = (
    <div
      style={{
        padding: 10,
        width: 250,
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 4,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>Visibility</div>
      <Input
        placeholder="Search column..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 8 }}
        allowClear
      />
      <div
        style={{
          maxHeight: 200,
          overflowY: "auto",
          borderTop: "1px solid #eee",
          paddingTop: 8,
        }}
      >
        {filteredColumns.map((col) => (
          <div key={col.title} style={{ marginBottom: 4 }}>
            <Checkbox
              checked={!optionSelectedCol.includes(col.title)}
              onChange={(e) => onCheckboxChange(e, col.title)}
            >
              {col.title}
            </Checkbox>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={"flex flex-col w-full"}>
      {useSelect ? (
        <div className={"w-full flex mb-5 justify-between items-center"}>
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            visible={dropdownVisible}
            onVisibleChange={(flag) => setDropdownVisible(flag)}
          >
            <Button>
              Show / Hide Column <DownOutlined />
            </Button>
          </Dropdown>

          <div className="w-full flex justify-end gap-2">
            <Button
              icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
              className="rounded-[5px] w-fit h-[40px] bg-gray-100"
            >
              Export (PDF)
            </Button>

            {/* button trigger modal */}
            <Button onClick={() => setIsAdvanceOpen(true)}>
              Search Advance
            </Button>
          </div>
        </div>
      ) : null}

      {/* Table */}
      <Table
        dataSource={dataSource}
        columns={[...filterColumns()]}
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
              onChange={onSizeChanger}
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
            size="small"
          />
        </div>
      ) : null}

      {/* Advance Search Modal */}
      <Modal
        visible={isAdvanceOpen}
        footer={null}
        onCancel={() => setIsAdvanceOpen(false)}
        width={700}
        bodyStyle={{ padding: "40px" }}
      >
        <div className="flex gap-4 mb-4">
          <Select
            defaultValue="Periode"
            className="w-1/3 rounded-lg border border-gray-300"
            dropdownClassName="rounded-lg"
          >
            <Option value="Periode">Periode</Option>
            <Option value="Customer">Customer</Option>
          </Select>
          <Select
            defaultValue="Contains"
            className="w-1/3 rounded-lg border border-gray-300"
            dropdownClassName="rounded-lg"
          >
            <Option value="Contains">Contains</Option>
            <Option value="Equals">Equals</Option>
          </Select>
          <Select
            defaultValue="Limit Row"
            className="w-1/3 rounded-lg border border-gray-300"
            dropdownClassName="rounded-lg"
          >
            <Option value="10">10</Option>
            <Option value="50">50</Option>
          </Select>
        </div>

        <div className="flex gap-4">
          <Input.TextArea
            rows={6}
            placeholder="Enter a formula..."
            className="flex-1 rounded-lg border border-gray-300 p-2"
          />
          <div className="flex flex-col gap-2">
            <Button className="bg-blue-100 text-blue-600 rounded-md w-20 h-10">
              + AND
            </Button>
            <Button className="bg-blue-100 text-blue-600 rounded-md w-20 h-10">
              + OR
            </Button>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-2 mb-4">
          Hint/Tips will be placed here.
        </p>

        <div className="flex justify-end gap-2">
          <Button danger className="bg-red-100 rounded-md px-4 py-2">
            Clear Filter
          </Button>
          <Button type="primary" className="rounded-md px-4 py-2">
            Search
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TablePagination;
