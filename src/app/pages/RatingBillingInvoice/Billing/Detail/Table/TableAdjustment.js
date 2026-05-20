import {
  hasValue,
  renderColumn,
  renderDateColumn,
  separatorNumber,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsAdjustment = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "lineNumber",
    title: "LINE NUMBER",
    dataIndex: "lineNumber",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "lineNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "lineNumber",
        hasValue(search["lineNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "referenceLineNumber",
    title: "REFERENCE LINE NUMBER",
    dataIndex: "referenceLineNumber",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "referenceLineNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "referenceLineNumber",
        hasValue(search["referenceLineNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "groupId",
    title: "GROUP ID",
    dataIndex: "groupId",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "groupId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "groupId",
        hasValue(search["groupId"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "referenceGroupId",
    title: "REFERENCE GROUP ID",
    dataIndex: "referenceGroupId",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "referenceGroupId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "referenceGroupId",
        hasValue(search["referenceGroupId"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "adjustmentType",
    title: "ADJUSTMENT TYPE",
    dataIndex: "adjustmentType",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "adjustmentType",
        hasValue(search["adjustmentType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "type",
        hasValue(search["type"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "adjustmentCode",
    title: "ADJUSTMENT CODE",
    dataIndex: "adjustmentCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "adjustmentCode",
        hasValue(search["adjustmentCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "itemCode",
    title: "ITEM CODE",
    dataIndex: "itemCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "itemCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "itemCode",
        hasValue(search["itemCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "item",
    title: "ITEM",
    dataIndex: "item",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "item",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "item",
        hasValue(search["item"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "quantity",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "quantity",
        hasValue(search["quantity"]),
        searchText,
        separatorNumber(text),
        false,
        "input",
        search
      ),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "uom",
        hasValue(search["uom"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "currency",
        hasValue(search["currency"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "priceCode",
    title: "PRICE CODE",
    dataIndex: "priceCode",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priceCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "priceCode",
        hasValue(search["priceCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "price",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "price",
        hasValue(search["price"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "adjustmentAmount",
    title: "ADJUSTMENT AMOUNT",
    dataIndex: "adjustmentAmount",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "adjustmentAmount",
        hasValue(search["adjustmentAmount"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAdjustmentAmount",
    title: "TOTAL ADJUSTMENT AMOUNT",
    dataIndex: "totalAdjustmentAmount",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAdjustmentAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAdjustmentAmount",
        hasValue(search["totalAdjustmentAmount"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "adjustmentDate",
    title: "ADJUSTMENT DATE",
    dataIndex: "adjustmentDate",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "adjustmentDate",
        hasValue(search["adjustmentDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "baseAdjustmentItem",
    title: "BASE ADJUSTMENT ITEM",
    dataIndex: "baseAdjustmentItem",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "baseAdjustmentItem",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "baseAdjustmentItem",
        hasValue(search["baseAdjustmentItem"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "baseAdjustmentPeriod",
    title: "BASE ADJUSTMENT PERIOD",
    dataIndex: "baseAdjustmentPeriod",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "baseAdjustmentPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      renderDateColumn(
        "baseAdjustmentPeriod",
        hasValue(search["baseAdjustmentPeriod"]),
        searchText,
        text,
        "datePeriod",
        search
      ),
  },
  {
    key: "baseAdjustmentInvNum",
    title: "BASE ADJUSTMENT INV NUM",
    dataIndex: "baseAdjustmentInvNum",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "baseAdjustmentInvNum",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "baseAdjustmentInvNum",
        hasValue(search["baseAdjustmentInvNum"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "description",
        hasValue(search["description"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
];