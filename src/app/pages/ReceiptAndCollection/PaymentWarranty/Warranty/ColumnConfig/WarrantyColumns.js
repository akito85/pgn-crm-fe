import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import moment from "moment";
import { dateFormatting, renderColumn, toTitleCase } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";

export const columnWarranty = (
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
    key: "warrantyCode",
    title: "PAYMENT GUARANTEE CODE",
    dataIndex: "warrantyCode",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "warrantyCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "customerSegment",
    title: "CUSTOMER SEGMENT",
    dataIndex: "customerSegment",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "customerSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "customerGroup",
    title: "CUSTOMER GROUP",
    dataIndex: "customerGroup",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "customerGroup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "issuerBank",
    title: "PENERBIT",
    dataIndex: "issuerBank",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "issuerBank",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "issuerBranch",
    title: "CABANG PENERBIT",
    dataIndex: "issuerBranch",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "issuerBranch",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "currencyBalance",
    title: "CURRENCY BALANCE",
    dataIndex: "currencyBalance",
    align: "right",
    sorter: true,
    render: (text) => text?.toLocaleString(),
  },
  {
    key: "rate",
    title: "RATE",
    dataIndex: "rate",
    align: "right",
    sorter: true,
    render: (text) => text?.toLocaleString(),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    dataIndex: "rateDate",
    sorter: true,
    render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
  },
  {
    key: "equivalent",
    title: "EQV. AMOUNT",
    dataIndex: "equivalent",
    // width: 150,
    align: "right",
    sorter: true,
    render: (text) => text?.toLocaleString(),
  },
  {
    key: "documentNumber",
    title: "DOCUMENT NUMBER",
    dataIndex: "documentNumber",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "documentNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "mutationDate",
    title: "MUTATION DATE",
    dataIndex: "mutationDate",
    sorter: true,
    render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
  },
  {
    key: "effectiveDate",
    title: "EFFECTIVE DATE",
    dataIndex: "effectiveDate",
    sorter: true,
    render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
  },
  {
    key: "expiringDate",
    title: "EXPIRING DATE",
    dataIndex: "expiringDate",
    sorter: true,
    render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
  },
  {
    key: "endClaimDate",
    title: "END DATE CLAIM",
    dataIndex: "endClaimDate",
    sorter: true,
    render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    // width: 250,
    sorter: true,
    ...getColumnSearchPropsPaging(
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 120,
    fixed: "right",
    align: "center",
    render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
  },
  {
    key: "approvalStatus",
    title: "STATUS APPROVAL",
    dataIndex: "approvalStatus",
    width: 190,
    align: "center",
    fixed: "right",
    render: (text) => renderColumn('approvalStatus', searchedColumn, searchText, text, false, 'status', search)
  },
];