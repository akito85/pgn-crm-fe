import { Form, Input, Select } from "antd";
import { useRef, useState } from "react";
import NxDetailText from "../../components/Nx/NxDetailText";
import SelectComponent from "../../components/SelectComponent";
import { requiredMessage } from "../../utils";
import { getColumnSearchProps } from "../../utils/getColumnSearchProps";
import NxTable from "./NxTable";

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
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "employee",
      title: "EMPLOYEE",
      width: 300,
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
      <NxTable
        idTable={"employee-table"}
        useSelect={false}
        usePagination={false}
        useInfiniteScroll={false}
        dataSource={list}
        columns={columns}
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
  loading = false,
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
          <Form.Item
            name={"appHierId"}
            label="Approval Hierarchy"
            rules={[{ message: requiredMessage("Approval Hierarchy"), required: true }]}
            className="no-margin-form w-1/3"
          >
            <SelectComponent
              onChange={(value, option) => handleSelectHiararchy(value, option.children)}
              disabled={loading}
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

      {(appHierId || (!formView && hierarchyDetails.length > 0)) && (
        <NxTable
          idTable={"hierarchy-table"}
          useSelect={false}
          usePagination={false}
          useInfiniteScroll={false}
          dataSource={hierarchyDetails}
          columns={columns}
          expandable={{ expandedRowRender }}
        />
      )}
    </div>
  );
};

export default NxApprovalInput;