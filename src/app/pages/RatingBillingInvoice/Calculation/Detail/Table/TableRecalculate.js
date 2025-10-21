import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../../utils/sorterFunction";
import { hasValue, renderColumn } from "../../../../../../utils";

export const columnsRecalculate = (
  pageCal = 1,
  pageSizeCal = 10,
  searchInputCal,
  searchedColumnCal,
  searchTextCal,
  handleSearchRecalculate = () => {},
  searchRecalculate,
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (pageCal - 1) * pageSizeCal + index + 1,
  },
  {
    title: "CUSTOMER NUMBER",
    dataIndex: "custNumb",
    sorter: (a, b) => sorterFunction("custNumb", a, b),
    filteredValue: searchRecalculate?.["custNumb"]
      ? [searchRecalculate?.["custNumb"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      searchRecalculate,
      "custNumb",
      searchInputCal,
      searchedColumnCal,
      searchTextCal,
      handleSearchRecalculate,
      true,
    ),
    render: (text) =>
      renderColumn(
        "custNumb",
        hasValue(searchRecalculate["custNumb"]),
        searchTextCal,
        text,
        false,
        "input",
        searchRecalculate,
      ),
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "custName",
    sorter: (a, b) => sorterFunction("custName", a, b),
    filteredValue: searchRecalculate?.["custName"]
      ? [searchRecalculate?.["custName"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      searchRecalculate,
      "custName",
      searchInputCal,
      searchedColumnCal,
      searchTextCal,
      handleSearchRecalculate,
      true,
    ),
    render: (text) =>
      renderColumn(
        "custName",
        hasValue(searchRecalculate["custName"]),
        searchTextCal,
        text,
        false,
        "input",
        searchRecalculate,
      ),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accNumb",
    sorter: (a, b) => sorterFunction("accNumb", a, b),
    filteredValue: searchRecalculate?.["accNumb"]
      ? [searchRecalculate?.["accNumb"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      searchRecalculate,
      "accNumb",
      searchInputCal,
      searchedColumnCal,
      searchTextCal,
      handleSearchRecalculate,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accNumb",
        hasValue(searchRecalculate["accNumb"]),
        searchTextCal,
        text,
        false,
        "input",
        searchRecalculate,
      ),
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accName",
    sorter: (a, b) => sorterFunction("accName", a, b),
    filteredValue: searchRecalculate?.["accName"]
      ? [searchRecalculate?.["accName"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      searchRecalculate,
      "accName",
      searchInputCal,
      searchedColumnCal,
      searchTextCal,
      handleSearchRecalculate,
      true,
    ),
    render: (text) =>
      renderColumn(
        "accName",
        hasValue(searchRecalculate["accName"]),
        searchTextCal,
        text,
        false,
        "input",
        searchRecalculate,
      ),
  },
  {
    title: "MESSAGE",
    dataIndex: "message",
    sorter: (a, b) => sorterFunction("message", a, b),
    filteredValue: searchRecalculate?.["message"]
      ? [searchRecalculate?.["message"]]
      : null,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValueFE(
      searchRecalculate,
      "message",
      searchInputCal,
      searchedColumnCal,
      searchTextCal,
      handleSearchRecalculate,
      true,
    ),
    render: (text) =>
      renderColumn(
        "message",
        hasValue(searchRecalculate["message"]),
        searchTextCal,
        text,
        true,
        "input",
        searchRecalculate,
      ),
  },
  {
    title: "IS TRY",
    dataIndex: "isTry",
    align: "center",
    sorter: (a, b) => sorterFunction("istry", a, b),
    filteredValue: searchRecalculate?.["isTry"]
      ? [searchRecalculate?.["isTry"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      searchRecalculate,
      "isTry",
      searchInputCal,
      searchedColumnCal,
      searchTextCal,
      handleSearchRecalculate,
      true,
    ),
    render: (text) =>
      renderColumn(
        "isTry",
        hasValue(searchRecalculate["isTry"]),
        searchTextCal,
        text?.toString(),
        false,
        "status",
        searchRecalculate,
      ),
  },
];
