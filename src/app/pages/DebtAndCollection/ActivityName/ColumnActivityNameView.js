import { getColumnSearchPropsUseFilteredValue} from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../utils";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleOpenDelete= () => {},
  dataUser = {}
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      width: 100,
      sorter: true,
      align: "left",
      dataIndex: "name",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "name",
          hasValue(search["name"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "Exception",
      width: 50,
      sorter: true,
      dataIndex: "exception",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "exception",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "exception",
          hasValue(search["exception"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "Urutan",
      width: 100,
      sorter: true,
      dataIndex: "urutan",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "urutan",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "urutan",
          hasValue(search["urutan"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "DUE DATE RULE",
      width: 150,
      sorter: true,
      dataIndex: "dueDateRule",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "dueDateRule",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "dueDateRule",
          hasValue(search["dueDateRule"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
  ];
};