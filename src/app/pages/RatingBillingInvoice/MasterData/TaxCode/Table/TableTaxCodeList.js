import {  hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";


export const columnsTaxCodeList = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "TAX CODE",
    dataIndex: "taxCode",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('taxCode', hasValue(search['taxCode']), searchText, text, false, 'input', search)
  },
  {
    title: "NAME",
    dataIndex: "taxCodeName",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxCodeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('taxCodeName', hasValue(search['taxCodeName']), searchText, text, false, 'input', search)
  },
  {
    title: "CATEGORY",
    dataIndex: "categoryName",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "categoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('categoryName', hasValue(search['categoryName']), searchText, text, false, 'input', search)
  },
  {
    title: "TAX RATE (%)",
    dataIndex: "taxRate",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('taxRate', hasValue(search['taxRate']), searchText, text, false, 'input', search)
  },
  {
    title: "GL ACCOUNT",
    dataIndex: "glAccount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "glAccount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('glAccount', hasValue(search['glAccount']), searchText, text, false, 'input', search)
  },
  {
    title: "CRITERIA",
    dataIndex: "criterias",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "criterias",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) => renderColumn('criterias', hasValue(search['criterias']), searchText, text, true, 'input', search)
      
      // searchedColumn === "criterias" ? (
      //   <Highlighter
      //     highlightStyle={{
      //       backgroundColor: "#ffc069",
      //       padding: 0,
      //     }}
      //     searchWords={[searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ""}
      //   />
      // ) : text ? (
      //   <Tooltip placement="topLeft" title={text}>
      //     {text}
      //   </Tooltip>
      // ) : (
      //   ""
      // ),
  },
  {
    title: "START DATE",
    sorter: true,
    align: "center",
    dataIndex: "startDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "startDate",
      searchInput,
      hasValue(search['startDate']),
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, text, 'date', search)
  },
  {
    title: "END DATE",
    sorter: true,
    align: "center",
    dataIndex: "endDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
      searchInput,
      hasValue(search['endDate']),
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, text, 'date', search)
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    ellipsis: {
      showTitle: false,
    },
    sorter: true,
    render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
  },
  {
    title: "STATUS",
    dataIndex: "status",
    fixed: "right",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (index) => {
      let text;
      switch (index) {
        case "WAITING_APPROVAL":
          text = "Waiting Approval";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
    },
  },
  {
    title: "STATUS APPROVAL",
    sorter: true,
    dataIndex: "statusApproval",
    fixed: "right",
    width: 200,
    key: "statusApproval",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (index) => {
      let text;
      switch (index) {
        case "WAITING_APPROVAL":
          text = "Waiting Approval";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return renderColumn('statusApproval', hasValue(search['statusApproval']), searchText, text, false, 'status', search)
    },
  },
];
