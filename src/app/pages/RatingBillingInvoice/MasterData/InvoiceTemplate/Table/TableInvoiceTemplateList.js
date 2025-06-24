import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import {  getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsInvoiceTemplate = (
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
    title: "INVOICE NAME",
    dataIndex: "invoiceName",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('invoiceName', hasValue(search['invoiceName']), searchText, text, false, 'input', search)
  },
  {
    title: "INVOICE TYPE",
    dataIndex: "invoiceType",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('invoiceType', hasValue(search['invoiceType']), searchText, text, false, 'input', search)
  },
  {
    title: "METERAI",
    dataIndex: "meterai",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterai",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('meterai', hasValue(search['meterai']), searchText, text, false, 'input', search)
  },
  {
    title: "SIGNATURE",
    dataIndex: "signature",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "signature",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('signature', hasValue(search['signature']), searchText, text, false, 'input', search)
  },
  {
    title: "TEMPLATE",
    dataIndex: "templateName",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "templateName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('templateName', hasValue(search['templateName']), searchText, text, false, 'input', search)
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
      searchedColumn,
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
      searchedColumn,
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
    render: (text) => renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
  },
  {
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    fixed: "right",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (index) => {
      let text;
      switch (index) {
        case "WAITING APPROVAL":
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
