import { getColumnSearchPropsUseFilteredValue} from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../utils";
import { key } from "localforage";

export const columnsAccount = (
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
      key: "accountNum",
      title: "Account Number",
      sorter: true,
      align: "left",
      dataIndex: "accountNum",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNum",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountNum",
          hasValue(search["accountNum"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "accountName",
      title: "Account Name",
      sorter: true,
      align: "left",
      dataIndex: "accountName",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountName",
          hasValue(search["accountName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "accReceivable",
      title: "Account Receivable",
      sorter: true,
      dataIndex: "accReceivable",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accReceivable",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accReceivable",
          hasValue(search["accReceivable"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "accPayable",
      title: "Account Payable",
      sorter: true,
      dataIndex: "accPayable",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accPayable",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accPayable",
          hasValue(search["accPayable"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    }
  ];
};