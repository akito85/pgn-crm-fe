import { Form, Input, Select } from "antd";
import { useRef, useState } from "react";
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import { requiredMessage } from "../../../../../../../../../utils";
import { getColumnSearchProps } from "../../../../../../../../../utils/getColumnSearchProps";

const DataExpand = ({ list = [], tableId = "approval-employee-table" }) => {
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
        record.employeeName
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
      <NxTable
        idTable={tableId}
        useSelect={false}
        usePagination={false}
        useInfiniteScroll
        hasMore={false}
        dataSource={list}
        totalData={list.length}
        columns={columns}
        tableScrolled={{ x: 400 }}
        className="mb-4"
      />
    </div>
  );
};

const expandedRowRender = (record) => {
  const dataExpand = record.employeeDetail || [];
  return (
    <DataExpand
      list={dataExpand}
      tableId={`approval-employee-table-${record.key}`}
    />
  );
};

const normalizeApprovalTable = (dataTable = []) =>
  dataTable.map((detail, index) => ({
    ...detail,
    key: detail.key || `service-request-approval-${index}`,
    employeeDetail: (detail.employeeDetail || []).map((employee, employeeIndex) => ({
      ...employee,
      key:
        employee.key ||
        `service-request-approval-${index}-employee-${employeeIndex}`,
    })),
  }));

export default function ApprovalForm({
  form,
  dataOption = [],
  dataTable = [],
  formView = true,
  handleSelectHiararchy = () => {},
}) {
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
        record.approvalLevel
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
        record.position
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
  ];

  const approvalTableData = normalizeApprovalTable(dataTable);

  return (
    <NxCardContainer header="APPROVAL INFORMATION">
      <NxBaseContainer border>
        <div className="flex flex-col gap-y-4 w-full">
          {formView ? (
            <>
              <Form.Item name="appHierName" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="appHierId"
                label="Approval Hierarchy"
                rules={[
                  {
                    message: requiredMessage("Approval Hierarchy"),
                    required: true,
                  },
                ]}
                className="no-margin-form w-1/3"
              >
                <SelectComponent
                  onChange={(value, option) =>
                    handleSelectHiararchy(value, option?.children)
                  }
                >
                  {dataOption.map((data, index) => (
                    <Select.Option key={index} value={data.appHierId}>
                      {data.approvalName}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </>
          ) : (
            <NxDetailText label="Approval Hierarchy">
              {appHierName || "-"}
            </NxDetailText>
          )}

          {(appHierId || (!formView && approvalTableData.length > 0)) && (
            <NxTable
              idTable="service-request-approval-table"
              useSelect={false}
              usePagination={false}
              useInfiniteScroll
              hasMore={false}
              dataSource={approvalTableData}
              totalData={approvalTableData.length}
              columns={columns}
              expandable={{ expandedRowRender }}
              tableScrolled={{ x: 600 }}
            />
          )}
        </div>
      </NxBaseContainer>
    </NxCardContainer>
  );
}
