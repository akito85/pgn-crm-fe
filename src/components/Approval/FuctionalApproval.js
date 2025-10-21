import React, { Fragment, useRef, useState } from "react";
import { Form, Select } from "antd";
import SelectComponent from "../../components/SelectComponent";
import TablePagination from "../../components/TablePagination";
import { getColumnSearchPropsPaging } from "../../utils/getColumnSearchProps";
import TablePaginationNew from "../TablePaginationNew";
import DetailText from "../DetailText";

const columnInactivateData = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => {
  return [
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
      ...getColumnSearchPropsPaging(
        "approvalLevel",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
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
      ...getColumnSearchPropsPaging(
        "position",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      onFilter: (value, record) =>
        record["position"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
  ];
};

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
      ...getColumnSearchPropsPaging(
        "employeeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
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

const FunctionalApproval = ({
  dataTable = [],
  dataOption = [],
  updateSelectHierarchy = () => {},
  selectedHierarchy,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  showSelect = true,
  disableSelect = false,
  approvalName,
}) => {
  const handleSelectHiararchy = (value) => {
    updateSelectHierarchy(value);
    return value;
  };

  return (
    <Fragment>
      {showSelect ? (
        <Form.Item
          name={"apphierId"}
          rules={[
            {
              required: true,
              message: "Please input your Approval Hierarchy!",
            },
          ]}
          className="no-margin-form w-1/3"
          getValueFromEvent={handleSelectHiararchy}
          label={"Approval Hierarchy"}
          required
        >
          <SelectComponent onChange={updateSelectHierarchy}>
            {dataOption &&
              dataOption?.map((data, index) => (
                <Select.Option key={index} value={data.value}>
                  {data.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
      ) : null}

      {!showSelect && disableSelect ? (
        <DetailText label={"Approval Hierarchy:"}>{approvalName}</DetailText>
      ) : null}

      {selectedHierarchy && dataTable.length > 0 ? (
        <div className="w-full">
          <TablePaginationNew
            type="FE"
            useSelect={false}
            usePagination={false}
            dataSource={dataTable}
            columns={columnInactivateData(
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
            )}
            expandable={{
              expandedRowRender,
            }}
          />
        </div>
      ) : null}
    </Fragment>
  );
};

export default FunctionalApproval;
