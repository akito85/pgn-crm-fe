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
      key: "activityName",
      title: "Activity",
      sorter: true,
      align: "left",
      dataIndex: "activityName",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "activityName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "activityName",
          hasValue(search["activityName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "resultCode",
      title: "Result Code",
      sorter: true,
      align: "left",
      dataIndex: "resultCode",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "resultCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "resultCode",
          hasValue(search["resultCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "description",
      title: "Description",
      sorter: true,
      dataIndex: "description",
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
};