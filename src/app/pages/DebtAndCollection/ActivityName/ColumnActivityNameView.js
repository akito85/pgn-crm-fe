import { getColumnSearchPropsUseFilteredValue} from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../utils";
import { key } from "localforage";

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
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "name",
      title: "Name",
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
      key: "exception",
      title: "Exception",
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
      key: "urutan",
      title: "Urutan",
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
      key: "dueDateRule",
      title: "DUE DATE RULE",
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