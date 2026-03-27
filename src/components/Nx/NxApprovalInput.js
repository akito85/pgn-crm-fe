import { Form, Input, Select } from "antd";
import { useRef, useState } from "react";
import NxDetailText from "../../components/Nx/NxDetailText";
import SelectComponent from "../../components/SelectComponent";
import TablePagination from "../../components/TablePagination";
import { requiredMessage } from "../../utils";
import { getColumnSearchProps } from "../../utils/getColumnSearchProps";

const DataExpand = ({ list = [] }) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employeeName",
      sorter: (a, b) => a?.employeeName?.localeCompare(b?.employeeName),
      ...getColumnSearchProps(
        "employeeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["employeeName"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
  ];

  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase pt-4">
        EMPLOYEE INFORMATION
      </p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={list}
        columns={columns}
        className={"mb-4"}
      />
    </div>
  );
};

const expandedRowRender = (record) => {
  const dataExpand = record.employeeDetail || [];
  return <DataExpand list={dataExpand} />;
};

const NxApprovalInput = ({
  form,
  options = [],
  hierarchyDetails = [],
  formView = true,
  handleSelectHiararchy = () => {},
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const appHierId = Form.useWatch("appHierId", { form });
  const appHierName = Form.useWatch("appHierName", { form, preserve: true });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "HIERARCHY",
      dataIndex: "approvalLevel",
      sorter: (a, b) => a?.approvalLevel?.localeCompare(b?.approvalLevel),
      ...getColumnSearchProps(
        "approvalLevel",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["approvalLevel"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "POSITION",
      dataIndex: "position",
      sorter: (a, b) => a?.position?.localeCompare(b?.position),
      ...getColumnSearchProps(
        "position",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["position"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      {formView ? (
        <>
          <Form.Item name={"appHierName"} hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name={"appHierId"}
            label="Approval Hierarchy"
            rules={[{ message: requiredMessage("Approval Hierarchy"), required: true }]}
            className="no-margin-form w-1/3"
          >
            <SelectComponent
              onChange={(value, option) => handleSelectHiararchy(value, option.children)}
            >
              {options.map((data, index) => (
                <Select.Option key={index} value={data.appHierId}>
                  {data.approvalName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </>
      ) : (
        <NxDetailText label={"Approval Hierarchy"}>{appHierName}</NxDetailText>
      )}

      {appHierId && hierarchyDetails.length > 0 && (
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={hierarchyDetails}
          columns={columns}
          expandable={{ expandedRowRender }}
        />
      )}
    </div>
  );
};

export default NxApprovalInput;