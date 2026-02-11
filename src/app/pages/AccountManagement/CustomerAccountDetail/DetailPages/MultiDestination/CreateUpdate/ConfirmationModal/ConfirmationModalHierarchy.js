import { useRef, useState } from "react";
import TablePagination from "../../../../../../../../components/TablePagination";
import { getColumnSearchProps } from "../../../../../../../../utils/getColumnSearchProps";

const columnInactivateData = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
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

const ConfirmationModalHierarchy = ({
  dataTable = [],
  selectedAppHierId,
  selectedApprovalName,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <span className="font-bold">Approval Hieararchy</span>
        <span>{selectedApprovalName}</span>
      </div>
      {selectedAppHierId && dataTable.length > 0 ? (
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={dataTable}
          columns={columnInactivateData(
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          )}
          expandable={{
            expandedRowRender,
          }}
        />
      ) : null}
    </div>
  );
};

export default ConfirmationModalHierarchy;
