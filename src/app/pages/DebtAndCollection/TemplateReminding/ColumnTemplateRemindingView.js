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
      width: 5,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      width: 30,
      sorter: true,
      align: "left",
      dataIndex: "remindingType",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remindingType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "remindingType",
          hasValue(search["remindingType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CONTENT",
      width: 30,
      sorter: true,
      dataIndex: "content",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "content",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "content",
          hasValue(search["content"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "EMAIL SUBJECT",
      width: 50,
      sorter: true,
      dataIndex: "emailSubject",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "emailSubject",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "emailSubject",
          hasValue(search["emailSubject"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "EMAIL BODY",
      width: 100,
      sorter: true,
      dataIndex: "emailBody",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "emailBody",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "emailBody",
          hasValue(search["emailBody"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "TEMPLATE CODE",
      width: 50,
      sorter: true,
      dataIndex: "templateCode",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "templateCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "templateCode",
          hasValue(search["templateCode"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    }
  ];
};