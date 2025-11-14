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
      title: "CUSTOMER SEGMENT",
      width: 100,
      sorter: true,
      align: "left",
      dataIndex: "customerSegment",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerSegment",
          hasValue(search["customerSegment"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "GRACE PERIOD",
      width: 50,
      sorter: true,
      dataIndex: "gracePeriod",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "gracePeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "gracePeriod",
          hasValue(search["gracePeriod"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "GRACE PERIOD UNIT",
      width: 100,
      sorter: true,
      dataIndex: "gracePeriodUnit",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "gracePeriodUnit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "gracePeriodUnit",
          hasValue(search["gracePeriodUnit"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      width: 150,
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