import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import moment from "moment";

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
      case "invoiceDate":
      case "period":
        return obj[fieldSort] ? moment(obj[fieldSort]) : null;
      // return date.toLowerCase();
      default:
        return `${obj[fieldSort]}`.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
      case "invoiceDate":
      case "period":
        if (a === null && b === null) return 0; // Both are null, consider equal
        if (a === null) return 1; // `a` is null, place it as greater (bottom)
        if (b === null) return -1; // `b` is null, place it as greater (bottom)
        if (hasValue(a) && hasValue(b)) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      default:
        return a.localeCompare(b);
    }
  };
  return handleCompare(fa, fb);
};

export const TablePeriodInformation = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleApprovalHistory = () => {},
  handleOpenModalInactivate = () => {},
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    dataIndex: "no",
    editable: true,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "PERIOD",
    dataIndex: "period",
    sorter: (a, b) => sorter("period", a, b),
    filteredValue: search?.["period"] ? [search?.["period"]] : null,
    required: true,
    inputType: "datePeriod",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "period",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod",
    ),
    render: (text) =>
      renderDateColumn(
        "period",
        hasValue(search["period"]),
        searchText,
        text,
        "datePeriod",
        search,
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    sorter: (a, b) => sorter("startDate", a, b),
    filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
    align: "center",
    disabled: true,
    inputType: "text",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime",
    ),
    render: (text) =>
      renderDateColumn(
        "startDate",
        hasValue(search["startDate"]),
        searchText,
        text,
        "datetime",
        search,
      ),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    sorter: (a, b) => sorter("endDate", a, b),
    filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
    disabled: true,
    align: "center",
    inputType: "text",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime",
    ),
    render: (text) =>
      renderDateColumn(
        "endDate",
        hasValue(search["endDate"]),
        searchText,
        text,
        "datetime",
        search,
      ),
  },
  {
    title: "INVOICE DATE",
    dataIndex: "invoiceDate",
    sorter: (a, b) => sorter("invoiceDate", a, b),
    filteredValue: search?.["invoiceDate"] ? [search?.["invoiceDate"]] : null,
    align: "center",
    inputType: "date",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "invoiceDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "invoiceDate",
        hasValue(search["invoiceDate"]),
        searchText,
        text,
        "date",
        search,
      ),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
    sorter: (a, b) => sorter("description", a, b),
    filteredValue: search?.["description"] ? [search?.["description"]] : null,
    inputType: "description",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (index) =>
      renderColumn(
        "description",
        hasValue(search["description"]),
        searchText,
        index,
        true,
        "input",
        search,
      ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    sorter: (a, b) => sorter("status", a, b),
    filteredValue: search?.["status"] ? [search?.["status"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (index) =>
      renderColumn(
        "status",
        hasValue(search["statu"]),
        searchText,
        index,
        false,
        "status",
        search,
      ),
  },
];
