import { Form, Select } from "antd";
import React, { useCallback, useMemo, useRef, useState } from "react";

import DetailText from "../../../../../components/DetailText";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../../components/Nx/NxTable";
import SelectComponent from "../../../../../components/SelectComponent";
import { requiredMessage } from "../../../../../utils";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";

const ApprovalSectionForm = ({
  dataTable = [],
  dataOption = [],
  selectedHierarchy = "",
  updateSelectedHierarchy = () => {},
  showSelect = true,
  disableSelect = false,
  approvalName = "",
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }, []);

  const employeeColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        key: "no",
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "EMPLOYEE",
        dataIndex: "employeeName",
        key: "employeeName",
        sorter: (a, b) => a?.employeeName?.localeCompare(b?.employeeName),
        ...getColumnSearchProps(
          "employeeName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        onFilter: (value, record) =>
          record?.employeeName
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
      },
    ],
    [handleSearch, searchText, searchedColumn]
  );

  const columns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        key: "no",
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "HIERARCHY",
        dataIndex: "approvalLevel",
        key: "approvalLevel",
        sorter: (a, b) => a?.approvalLevel?.localeCompare(b?.approvalLevel),
        ...getColumnSearchProps(
          "approvalLevel",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        onFilter: (value, record) =>
          record?.approvalLevel
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
      },
      {
        title: "POSITION",
        dataIndex: "position",
        key: "position",
        sorter: (a, b) => a?.position?.localeCompare(b?.position),
        ...getColumnSearchProps(
          "position",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        onFilter: (value, record) =>
          record?.position?.toString().toLowerCase().includes(value.toLowerCase()),
      },
    ],
    [handleSearch, searchText, searchedColumn]
  );

  const handleSelectHierarchy = (value) => {
    updateSelectedHierarchy(value);
    return value;
  };

  return (
    <NxCardContainer header="APPROVAL">
      <NxBaseContainer border>
        {showSelect ? (
          <Form.Item
            name="approvalHierarchy"
            rules={[{ message: requiredMessage("Approval Hierarchy"), required: true }]}
            className="no-margin-form w-1/3"
            getValueFromEvent={handleSelectHierarchy}
            label="Approval Hierarchy"
            required
          >
            <SelectComponent onChange={updateSelectedHierarchy} disabled={disableSelect}>
              {dataOption.map((data) => (
                <Select.Option key={data.value} value={data.value}>
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
          <NxTable
            idTable="approval-hierarchy-table"
            useSelect={false}
            usePagination={false}
            showAdvanceSearch={false}
            showSearchBar={false}
            tableScrolled={{ x: "max-content", y: 300 }}
            dataSource={dataTable}
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <div>
                  <p className="text-primary text-xs font-bold uppercase pt-4">
                    EMPLOYEE INFORMATION
                  </p>
                  <NxTable
                    idTable={`approval-employee-table-${record?.key || record?.id || "row"}`}
                    useSelect={false}
                    usePagination={false}
                    showAdvanceSearch={false}
                    showSearchBar={false}
                    tableScrolled={{ x: "max-content", y: 240 }}
                    dataSource={record?.employeeDetail || []}
                    columns={employeeColumns}
                  />
                </div>
              ),
            }}
          />
        ) : null}
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default ApprovalSectionForm;
