import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";

const columnsDataRequirementTemplate = ({
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
    width: 60,
    render: (_, __, index) => index + 1,
  },
  {
    key: "name",
    title: "NAME",
    dataIndex: "name",
    sorter: true,
    filteredValue: search?.name ? [search.name] : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "name",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "sourceType",
    title: "SOURCE TYPE",
    dataIndex: "sourceType",
    align: "center",
    sorter: true,
    filteredValue: search?.sourceType ? [search.sourceType] : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sourceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "typeName",
    title: "TYPE",
    dataIndex: "typeName",
    align: "center",
    sorter: true,
    filteredValue: search?.typeName ? [search.typeName] : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "typeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "categoryName",
    title: "CATEGORY",
    dataIndex: "categoryName",
    align: "center",
    sorter: true,
    filteredValue: search?.categoryName ? [search.categoryName] : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "categoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "subCategoryName",
    title: "SUB CATEGORY",
    dataIndex: "subCategoryName",
    align: "center",
    sorter: true,
    filteredValue: search?.subCategoryName ? [search.subCategoryName] : null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subCategoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => text || "-",
  },
];

export { columnsDataRequirementTemplate };
