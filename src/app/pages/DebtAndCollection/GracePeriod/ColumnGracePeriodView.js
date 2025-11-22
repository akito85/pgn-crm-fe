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
      key: "customerSegment",
      title: "CUSTOMER SEGMENT",
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
      key: "gracePeriod",
      title: "GRACE PERIOD",
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
      key: "gracePeriodUnit",
      title: "GRACE PERIOD UNIT",
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
      key: "description",
      title: "DESCRIPTION",
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