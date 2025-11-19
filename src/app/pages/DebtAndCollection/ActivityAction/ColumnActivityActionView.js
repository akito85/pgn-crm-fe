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
      width: 10,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Activity",
      width: 50,
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
      title: "Result Code",
      width: 50,
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
      title: "Description",
      width: 50,
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