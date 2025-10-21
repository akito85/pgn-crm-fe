// TableRBI.js
import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  FilterOutlined,
} from "@ant-design/icons";
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
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                border: "1px solid #BDBDBD",
                height: "40px",
                color: "black",
              }}
            >
              Show / Hide Column <DownOutlined style={{ fontSize: "15px" }} />
            </Button>
          </Dropdown>

          <div className="w-full flex justify-end gap-2 hidden">
            <Button
              icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
              style={{
                border: "1px solid #BDBDBD",
                color: "black",
                height: "40px",
              }}
            >
              Export List
            </Button>

            {/* button trigger modal */}
            <Button
              onClick={() => setIsAdvanceOpen(true)}
              style={{
                border: "1px solid #BDBDBD",
                color: "black",
                height: "40px",
              }}
            >
              <FilterOutlined style={{ fontSize: "20px" }} />
              Advance Filter
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
            <Button
              style={{
                backgroundColor: "#E6F4FA",
                color: "#0175BF",
                border: "none",
                height: "40px",
              }}
            >
              + AND
            </Button>
            <Button
              style={{
                backgroundColor: "#E6F4FA",
                color: "#0175BF",
                border: "none",
                height: "40px",
              }}
            >
              + OR
            </Button>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-2 mb-4">
          Hint/Tips will be placed here.
        </p>

        <div className="flex justify-between bg-[#F5F5F5] -mx-[40px] -mb-[40px] px-[40px] py-[10px] gap-2">
          <Button
            style={{
              border: "none",
              color: "#D32F2F",
              backgroundColor: "#FFEBEE",
            }}
          >
            <DeleteOutlined
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
                height: "40px",
              }}
            />
            Clear Filter
          </Button>
          <Button type="primary" style={{ height: "42px", fontSize: "16px" }}>
            Search
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TableRBI;
