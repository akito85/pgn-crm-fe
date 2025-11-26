import { Fragment, useRef, useState } from "react";
import TablePagination from "../../../../../../../../../components/TablePagination";
import { getColumnSearchProps } from "../../../../../../../../../utils/getColumnSearchProps";

const dummyOptions = [
  {
    name: "Data 1",
    value: 1,
  },
  {
    name: "Data 2",
    value: 2,
  },
  {
    name: "Data 3",
    value: 3,
  },
];
const dummyHierarchy = [
  {
    key: 1,
    approvalLevel: "Data 1 Hierarchy",
    position: "Data 1 Position",
    dataExpand: [
      {
        employeeName: "Abimana",
      },
      {
        employeeName: "Arya",
      },
    ],
  },
  {
    key: 2,
    approvalLevel: "Data 2 Hierarchy",
    position: "Data 2 Position",
    dataExpand: [
      {
        employeeName: "Juno",
      },
      {
        employeeName: "Mamat",
      },
    ],
  },
  {
    key: 3,
    approvalLevel: "Data 3 Hierarchy",
    position: "Data 3 Position",
    dataExpand: [
      {
        employeeName: "Agus",
      },
    ],
  },
];

// const getColumnSearchProps = (
//   dataIndex,
//   searchInput,
//   searchedColumn,
//   searchText,
//   handleSearch
// ) => ({
//   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
//     <div
//       style={{
//         padding: 8,
//       }}
//       onKeyDown={(e) => e.stopPropagation()}
//     >
//       <Input
//         ref={searchInput}
//         placeholder={`Search`}
//         value={selectedKeys[0]}
//         onChange={(e) =>
//           setSelectedKeys(e.target.value ? [e.target.value] : [])
//         }
//         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//         style={{
//           marginBottom: 8,
//           display: "block",
//         }}
//       />
//     </div>
//   ),
//   filterIcon: (filtered) => (
//     <FilterOutlined
//       style={{
//         color: filtered ? "#1890ff" : undefined,
//       }}
//     />
//   ),
//   onFilter: (value, record) =>
//     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//   onFilterDropdownOpenChange: (visible) => {
//     if (visible) {
//       setTimeout(() => searchInput.current?.select(), 100);
//     }
//   },
//   render: (text) =>
//     searchedColumn === dataIndex ? (
//       <Highlighter
//         highlightStyle={{
//           backgroundColor: "#ffc069",
//           padding: 0,
//         }}
//         searchWords={[searchText]}
//         autoEscape
//         textToHighlight={text ? text.toString() : ""}
//       />
//     ) : (
//       text
//     ),
// });
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

const ModalConfirmationCreateUpdateApprovalPaymentRelationHierarchy = ({
  dataTable = [],
  dataOption = [],
  selectedHierarchy,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
}) => {
  return (
    <Fragment>
      <div className="flex flex-col gap-y-1">
        <span className="font-bold">Approval Hieararchy</span>
        <span>{dataOption[selectedHierarchy]?.name}</span>
      </div>
      {selectedHierarchy && dataTable.length > 0 ? (
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
    </Fragment>
  );
};

export default ModalConfirmationCreateUpdateApprovalPaymentRelationHierarchy;
