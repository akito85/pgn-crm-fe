import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../../utils";

export const columnsCalculation = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "CUSTOMER NUMBER",
    dataIndex: "custNumb",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "custNumb",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "custNumb",
        hasValue(search["custNumb"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "custNumb",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "custName",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "custName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "custName",
        hasValue(search["custName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "custName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accNumb",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accNumb",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accNumb",
        hasValue(search["accNumb"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "accNumb",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accName",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accName",
        hasValue(search["accName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "accName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    title: "MESSAGE",
    dataIndex: "message",
    align: "left",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "message",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true
    // ),
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "message",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "message",
        hasValue(search["message"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
    // render: (text) => {
    //   if (searchedColumn === "message") {
    //     return (
    //       <Tooltip placement="topLeft" title={text}>
    //         <Highlighter
    //           highlightStyle={{
    //             backgroundColor: "#ffc069",
    //             padding: 0,
    //           }}
    //           searchWords={[searchText]}
    //           autoEscape
    //           textToHighlight={text ? text.toString() : ""}
    //         />
    //       </Tooltip>
    //     );
    //   } else {
    //     if (text) {
    //       return (
    //         <Tooltip placement="topLeft" title={text}>
    //           {text}
    //         </Tooltip>
    //       );
    //     }
    //     return "";
    //   }
    // },
  },
  {
    title: "Created Date",
    dataIndex: "createdDate",
    align: "left",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "message",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true
    // ),
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "createdDate",
        hasValue(search["createdDate"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "Updated Date",
    dataIndex: "updatedDate",
    align: "left",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "message",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true
    // ),
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "updatedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "updatedDate",
        hasValue(search["updatedDate"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    title: "IS TRY",
    dataIndex: "isTry",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "isTry",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "isTry",
        hasValue(search["isTry"]),
        searchText,
        text?.toString(),
        false,
        "status",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "isTry",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true
    // ),
    // render: (text) => {
    //   return (
    //     <div className={"flex justify-center"}>
    //       <StatusComponent colour={text === "Y" ? "in progress" : "inactive"}>
    //         {text === "Y" ? "True" : "False"}
    //       </StatusComponent>
    //     </div>
    //   );
    // },
  },
];
