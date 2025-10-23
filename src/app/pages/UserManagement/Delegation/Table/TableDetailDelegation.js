import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

const columnsDetail = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    dataIndex: "no",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "FILE NAME",
    dataIndex: "fileName",
    key: "fileName",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "fileName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "FILE SIZE",
    dataIndex: "fileSize",
    key: "fileSize",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "fileSize",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACTION",
    align: "center",
    width: 198,
    fixed: "right",
    render: (v, r, i) => {
      return (
        <div className="flex w-full justify-center gap-6">
        </div>
      );
    },
  },
];

export default columnsDetail;
