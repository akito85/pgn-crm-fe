import moment from "moment";
import { dateFormatting, renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";

export const getHoldDetailColumns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search = {}
) => {
  return [
    {
      title: "NO",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    { 
      title: "PAYMENT GUARANTEE CODE", 
      dataIndex: "warrantyCode", 
      width: 220,
      sorter: true,
      ...getColumnSearchPropsPaging("warrantyCode", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "REG NUMBER", 
      dataIndex: "regNumber",
      sorter: true,
      ...getColumnSearchPropsPaging("regNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "COST CENTER", 
      dataIndex: "costCenter",
      sorter: true,
      ...getColumnSearchPropsPaging("costCenter", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "ACCOUNT NUMBER", 
      dataIndex: "accountNumber",
      sorter: true,
      ...getColumnSearchPropsPaging("accountNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "ACCOUNT NAME", 
      dataIndex: "accountName",
      sorter: true,
      ...getColumnSearchPropsPaging("accountName", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "SA NUMBER", 
      dataIndex: "saNumber",
      sorter: true,
      ...getColumnSearchPropsPaging("saNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "CUSTOMER NUMBER", 
      dataIndex: "customerNumber",
      sorter: true,
      ...getColumnSearchPropsPaging("customerNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "CUSTOMER NAME", 
      dataIndex: "customerName",
      sorter: true,
      ...getColumnSearchPropsPaging("customerName", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "CUSTOMER SEGMENT", 
      dataIndex: "customerSegment",
      sorter: true,
      ...getColumnSearchPropsPaging("customerSegment", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "CUSTOMER GROUP", 
      dataIndex: "customerGroup",
      sorter: true,
      ...getColumnSearchPropsPaging("customerGroup", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "TYPE", 
      dataIndex: "type",
      sorter: true,
      ...getColumnSearchPropsPaging("type", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "WARRANTY TYPE", 
      dataIndex: "warrantyType",
      sorter: true,
      ...getColumnSearchPropsPaging("warrantyType", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "ISSUER BANK", 
      dataIndex: "issuerBank",
      sorter: true,
      ...getColumnSearchPropsPaging("issuerBank", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "ISSUER BRANCH", 
      dataIndex: "issuerBranch",
      sorter: true,
      ...getColumnSearchPropsPaging("issuerBranch", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "DOCUMENT NUMBER", 
      dataIndex: "documentNumber",
      sorter: true,
      ...getColumnSearchPropsPaging("documentNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "CURRENCY", 
      dataIndex: "currency",
      sorter: true,
      ...getColumnSearchPropsPaging("currency", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      title: "CURRENCY BALANCE",
      dataIndex: "currencyBalance",
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString(),
    },
    { 
      title: "RATE TYPE", 
      dataIndex: "rateType",
      sorter: true,
      ...getColumnSearchPropsPaging("rateType", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      sorter: true,
      render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
    },
    {
      title: "RATE",
      dataIndex: "rate",
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "EQV. AMOUNT",
      dataIndex: "equivalent",
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "MUTATION DATE",
      dataIndex: "mutationDate",
      sorter: true,
      render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
    },
    {
      title: "EFFECTIVE DATE",
      dataIndex: "effectiveDate",
      sorter: true,
      render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
    },
    {
      title: "EXPIRING DATE",
      dataIndex: "expiringDate",
      sorter: true,
      render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
    },
    {
      title: "END DATE CLAIM",
      dataIndex: "endClaimDate",
      sorter: true,
      render: (text) => (text ? moment(text).format(dateFormatting.dateCapital) : ""),
    },
    { 
      title: "CLAIM TERM TYPE", 
      dataIndex: "claimPeriodTermType",
      sorter: true,
      ...getColumnSearchPropsPaging("claimPeriodTermType", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      title: "CLAIM TERM VALUE",
      dataIndex: "claimPeriodTermValue",
      align: "right",
      sorter: true,
    },
    { 
      title: "DESCRIPTION", 
      dataIndex: "description",
      sorter: true,
      ...getColumnSearchPropsPaging("description", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      title: "HOLD AMOUNT",
      dataIndex: "holdAmount",
      align: "right",
      sorter: true,
      render: (text) => (text || 0).toLocaleString(),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (text) => renderColumn('status', null, null, text, false, 'status', null)
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "approvalStatus",
      width: 190,
      align: "center",
      render: (text) => renderColumn('approvalStatus', null, null, text, false, 'status', null)
    },
  ];
};
