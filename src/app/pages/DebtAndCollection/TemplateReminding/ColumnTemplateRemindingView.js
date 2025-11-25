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
      key: "remindingType",
      title: "TYPE",
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
      key: "content",
      title: "CONTENT",
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
      key: "emailBody",
      title: "EMAIL SUBJECT",
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
      key: "emailBody",
      title: "EMAIL BODY",
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
      key: "templateCode",
      title: "TEMPLATE CODE",
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