import { hasValue, renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsPromo = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "name",
    title: "PROMO NAME",
    dataIndex: "promoName",
    width: 200,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "promoName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "promoName",
        hasValue(search["promoName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "type",
    title: "PROMO TYPE",
    dataIndex: "promoType",
    width: 150,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "promoType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "promoType",
        hasValue(search["promoType"]),
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
    width: 250,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "description",
        hasValue(search["description"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "promotionType",
    title: "PROMOTION TYPE",
    dataIndex: "promotionType",
    width: 180,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "promotionType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "promotionType",
        hasValue(search["promotionType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "promoCategory",
    title: "PROMO CATEGORY",
    dataIndex: "promoCategory",
    width: 180,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "promoCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "promoCategory",
        hasValue(search["promoCategory"]),
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
    width: 180,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
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
    key: "adjustmentValue",
    title: "ADJUSTMENT VALUE",
    dataIndex: "adjustmentValue",
    width: 180,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "adjustmentValue",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "adjustmentValue",
        hasValue(search["adjustmentValue"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
];