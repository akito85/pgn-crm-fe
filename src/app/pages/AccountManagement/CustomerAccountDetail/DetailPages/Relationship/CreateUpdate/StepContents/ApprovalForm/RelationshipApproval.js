import { FilterOutlined } from "@ant-design/icons";
import { Form, Input, Select, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import TablePagination from "../../../../../../../../../components/TablePagination";
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";

const expandedRowRender = (record) => {
  const dataExpand = record?.employeeDetail || [];
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (
        <div style={{ padding: "8px 0" }}>{index + 1}</div>
      ),
    },
    {
      title: () => (
        <div className="flex items-center justify-between w-full">
          <span>EMPLOYEE</span>
        </div>
      ),
      dataIndex: "employeeName",
      align: "left",
      render: (text) => <div style={{ padding: "8px 16px" }}>{text}</div>,
    },
  ];

  return (
    <div className="bg-blue-50 -mx-2 pl-12 py-2">
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={dataExpand}
        columns={columns}
        className="employee-nested-table"
      />
    </div>
  );
};

const RelationshipApproval = ({
  values = {},
  dataApprovalList = [],
  dataDetailApproval = [],
  handleSelectHierarchy = () => {},
  loading = false,
  hideSelector = false, // Tambahan prop untuk hide selector di summary
  className = "", // Tambahan prop untuk tambahan class
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  // Map data from props to local state for table display
  useEffect(() => {
    if (dataDetailApproval && dataDetailApproval.length > 0) {
      // Data already has proper structure with keys from parent component
      setAppHierDataDetail(dataDetailApproval);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataDetailApproval]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder="Search"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (
        <div style={{ padding: "12px 0" }}>{index + 1}</div>
      ),
    },
    {
      title: () => (
        <div className="flex items-center justify-between w-full">
          <span>HIERARCHY</span>
        </div>
      ),
      dataIndex: "approvalLevel",
      sorter: (a, b) => a?.approvalLevel?.localeCompare(b?.approvalLevel),
      ...getColumnSearchProps("approvalLevel"),
      render: (text) => <div style={{ padding: "12px 16px" }}>{text}</div>,
    },
    {
      title: () => (
        <div className="flex items-center justify-between w-full">
          <span>POSITION</span>
        </div>
      ),
      dataIndex: "position",
      sorter: (a, b) => a?.position?.localeCompare(b?.position),
      ...getColumnSearchProps("position"),
      render: (text) => <div style={{ padding: "12px 16px" }}>{text}</div>,
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  return (
    <div className="flex flex-col gap-y-4">
      {!hideSelector ? (
        <>
          <Form.Item name={"appHierLabel"} hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Approval Hierarchy"
            name="appHierId"
            rules={[
              {
                message: "Please input your Approval Hierarchy",
                required: true,
              },
            ]}
            className="no-margin-form w-1/3"
          >
            <SelectComponent onChange={handleSelectHierarchy}>
              {dataApprovalList.map((data, index) => (
                <Select.Option key={index} value={data?.appHierId}>
                  {data?.approvalName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </>
      ) : (
        <div className="mb-4">
          <p className="text-[13px] mb-1 text-dg-grey-dark">
            Approval Hierarchy
          </p>
          <p className="text-[14px] font-medium">{values.appHierLabel}</p>
        </div>
      )}

      {/* Table */}
      <Spin spinning={loading}>
        {((hideSelector && appHierDataDetail.length > 0) || values.appHierId) && (
          <div className="mb-6">
            <TablePagination
              useSelect={false}
              usePagination={false}
              dataSource={appHierDataDetail}
              columns={columns}
              expandable={{
                expandedRowRender,
                defaultExpandAllRows: true,
                columnWidth: 50,
              }}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default RelationshipApproval;
