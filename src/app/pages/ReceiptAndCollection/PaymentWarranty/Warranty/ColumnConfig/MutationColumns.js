import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";

export const columnMutation = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search = {}
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "paymentWarrantyCode",
    title: "PAYMENT WARRANTY CODE",
    dataIndex: "paymentWarrantyCode",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "paymentWarrantyCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "typePaymentWarranty",
    title: "TYPE PAYMENT WARRANTY",
    dataIndex: "typePaymentWarranty",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "typePaymentWarranty",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "noDocumentMutation",
    title: "NO DOCUMENT MUTATION",
    dataIndex: "noDocumentMutation",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "noDocumentMutation",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "mutationType",
    title: "MUTATION TYPE",
    dataIndex: "mutationType",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "mutationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "categoryMutation",
    title: "CATEGORY MUTATION",
    dataIndex: "categoryMutation",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "categoryMutation",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    align: "right",
    sorter: true,
    render: (text) => text?.toLocaleString(),
  },
  {
    key: "createdDate",
    title: "CREATED DATE",
    dataIndex: "createdDate",
    sorter: true,
    render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
  },
];
