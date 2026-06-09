import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";

const getDataRequirementColumns = ({
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
    width: 50,
    render: (_, __, index) => index + 1,
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 190,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "type", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "value",
    title: "VALUE",
    dataIndex: "value",
    width: 850,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "value", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
];

export { getDataRequirementColumns };
