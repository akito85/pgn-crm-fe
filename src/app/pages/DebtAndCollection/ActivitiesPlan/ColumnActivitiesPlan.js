import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../utils";

export const columnmActivitiesPlan = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleOpenDelete = () => {},
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
      key: "picCustomer",
      title: "PIC Customer",
      sorter: true,
      align: "left",
      dataIndex: "picCustomer",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "picCustomer",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "picCustomer",
          hasValue(search["picCustomer"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },

    {
      key: "internalPicName",
      title: "Internal PIC",
      sorter: true,
      align: "left",
      dataIndex: "internalPicName",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "internalPicName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "internalPicName",
          hasValue(search["internalPicName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },

    {
      key: "period",
      title: "Period",
      sorter: true,
      align: "left",
      dataIndex: "period",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "period",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "period",
          hasValue(search["period"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
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
      key: "result",
      title: "Result",
      sorter: true,
      align: "left",
      dataIndex: "result",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "result",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "result",
          hasValue(search["result"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },

    {
      key: "resultDate",
      title: "Result Date",
      sorter: true,
      align: "center",
      dataIndex: "resultDate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "resultDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "resultDate",
          hasValue(search["resultDate"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
  ];
};
