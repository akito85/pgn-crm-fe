import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

const getActionLogColumns = ({
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
    key: "createdDate",
    title: "DATE",
    dataIndex: "createdDate",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "createdDate", searchInput, searchedColumn, searchText, handleSearch, false, "dateFormal"
    ),
    render: (v) => NxDate.formatDate(v, "DD MMM YYYY HH:mm:ss"),
  },
  {
    key: "createdBy",
    title: "USERNAME",
    dataIndex: "createdBy",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "createdBy", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "remark",
    title: "ACTION",
    dataIndex: "remark",
    width: 250,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "remark", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    key: "newValue",
    title: "REMARK",
    dataIndex: "newValue",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "newValue", searchInput, searchedColumn, searchText, handleSearch
    ),
    render: (v) => v || "-",
  },
];

export { getActionLogColumns };
