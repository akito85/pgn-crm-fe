import { Button, Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import NxDate from "../../../../components/Nx/NxDatePicker";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import SVGIcon from "../../../../assets/Icon/index";

/**
 * Returns the column definitions for the Mutation Detail table.
 *
 * @param {Object}          params
 * @param {Object}          params.search
 * @param {React.RefObject} params.searchInput
 * @param {string}          params.searchedColumn
 * @param {string}          params.searchText
 * @param {Function}        params.handleSearch
 * @param {Function}        [params.onViewDetail]
 * @returns {Array<Object>}
 */
const getMutationDetailColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
}) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    dataIndex: "no",
    width: 50,
    render: (_, __, index) => index + 1,
  },
  {
    key: "documentNumber",
    title: "DOCUMENT NUMBER",
    dataIndex: "documentNumber",
    width: 180,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "documentNumber", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    width: 150,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "source", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "billingPeriod",
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    width: 150,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "billingPeriod", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "mutationDate",
    title: "MUTATION DATE",
    dataIndex: "mutationDate",
    width: 150,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "mutationDate", searchInput, searchedColumn, searchText, handleSearch, true, "dateFormal"
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY"),
  },
  {
    key: "mutationType",
    title: "MUTATION TYPE",
    dataIndex: "mutationType",
    width: 150,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "mutationType", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    width: 150,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "category", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    width: 100,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "uom", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    width: 120,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "quantity", searchInput, searchedColumn, searchText, handleSearch, true
    ),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    width: 120,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "price", searchInput, searchedColumn, searchText, handleSearch, true
    ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    width: 120,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "amount", searchInput, searchedColumn, searchText, handleSearch, true
    ),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 130,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "type", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    width: 180,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "description", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 130,
    align: "center",
    fixed: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "status", searchInput, searchedColumn, searchText, handleSearch
    ),
    render: (status) => (
      <NxStatusComponent colour={status} margin={false}>{status}</NxStatusComponent>
    ),
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 170,
    align: "center",
    fixed: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch
    ),
    render: (status) => (
      <NxStatusComponent colour={status} margin={false}>{status}</NxStatusComponent>
    ),
  },
];

export default getMutationDetailColumns;
