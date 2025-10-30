import moment from "moment";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../utils";
import {
  getColumnSearchProps,
  getColumnSearchPropsUseFilteredValueFE,
} from "../../../../utils/getColumnSearchProps";

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "billingPeriod":
      case "taxRateDate":
      case "transactionDate":
      case "invoiceDate":
      case "dueDate":
      case "rateDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : "";
      case "totalAmountIdr":
      case "totalAmountUsd":
      case "totalUsage":
      case "calculatedUsage":
      case "convertedCalculatedUsage":
      case "convertedTotalUsage":
      case "maxContract":
      case "minContract":
        return obj[fieldSort]
          ? (obj[fieldSort] || 0)?.toString()?.toLowerCase()
          : "0";

      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "billingPeriod":
      case "taxRateDate":
      case "transactionDate":
      case "invoiceDate":
      case "dueDate":
      case "rateDate":
        if (a && b) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0;
      case "totalAmountIdr":
      case "totalAmountUsd":
      case "totalUsage":
      case "calculatedUsage":
      case "convertedCalculatedUsage":
      case "convertedTotalUsage":
      case "maxContract":
      case "minContract":
        return Math.sign(
          parseFloat(a.replace(/,/g, "")) - parseFloat(b.replace(/,/g, ""))
        );
      default:
        return a.localeCompare(b);
    }
  };

  return handleCompare(fa, fb);
};

export const columnsGenerateInvoice = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "INVOICE NUMBER",
    dataIndex: "invoiceNumber",
    sorter: (a, b) => sorter("invoiceNumber", a, b),
    filteredValue: search?.["invoiceNumber"]
      ? [search?.["invoiceNumber"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "invoiceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "invoiceNumber",
        hasValue(search["invoiceNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    sorter: (a, b) => sorter("billingCycle", a, b),
    filteredValue: search?.["billingCycle"] ? [search?.["billingCycle"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billingCycle",
        hasValue(search["billingCycle"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    align: "center",
    sorter: (a, b) => sorter("billingPeriod", a, b),
    filteredValue: search?.["billingPeriod"]
      ? [search?.["billingPeriod"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "billingPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "billingPeriod",
        hasValue(search["billingPeriod"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "BILLING CODE",
    dataIndex: "billingCode",
    sorter: (a, b) => sorter("billingCode", a, b),
    filteredValue: search?.["billingCode"] ? [search?.["billingCode"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "billingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billingCode",
        hasValue(search["billingCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: (a, b) => sorter("customerNumber", a, b),
    filteredValue: search?.["customerNumber"]
      ? [search?.["customerNumber"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "customerNumber",
        hasValue(search["customerNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    sorter: (a, b) => sorter("customerName", a, b),
    filteredValue: search?.["customerName"] ? [search?.["customerName"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "customerName",
        hasValue(search["customerName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    sorter: (a, b) => sorter("accountNumber", a, b),
    filteredValue: search?.["accountNumber"]
      ? [search?.["accountNumber"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountNumber",
        hasValue(search["accountNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    align: "center",
    sorter: (a, b) => sorter("accountGroupType", a, b),
    filteredValue: search?.["accountGroupType"]
      ? [search?.["accountGroupType"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountGroupType",
        hasValue(search["accountGroupType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    align: "center",
    sorter: (a, b) => sorter("serviceType", a, b),
    filteredValue: search?.["serviceType"] ? [search?.["serviceType"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "serviceType",
        hasValue(search["serviceType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "AREA CODE",
    dataIndex: "areaCode",
    align: "center",
    sorter: (a, b) => sorter("areaCode", a, b),
    filteredValue: search?.["areaCode"] ? [search?.["areaCode"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "areaCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "areaCode",
        hasValue(search["areaCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CALCULATION CODE",
    dataIndex: "calculationCode",
    sorter: (a, b) => sorter("calculationCode", a, b),
    filteredValue: search?.["calculationCode"]
      ? [search?.["calculationCode"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "calculationCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "calculationCode",
        hasValue(search["calculationCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TIME UNIT",
    dataIndex: "timeUnit",
    align: "center",
    sorter: (a, b) => sorter("timeUnit", a, b),
    filteredValue: search?.["timeUnit"] ? [search?.["timeUnit"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "timeUnit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "timeUnit",
        hasValue(search["timeUnit"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "UOM",
    dataIndex: "uom",
    align: "center",
    sorter: (a, b) => sorter("uom", a, b),
    filteredValue: search?.["uom"] ? [search?.["uom"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "uom",
        hasValue(search["uom"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TOTAL USAGE",
    dataIndex: "totalUsage",
    align: "right",
    sorter: (a, b) => sorter("totalUsage", a, b),
    filteredValue: search?.["totalUsage"] ? [search?.["totalUsage"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "totalUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalUsage",
        hasValue(search["totalUsage"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CALCULATED USAGE",
    dataIndex: "calculatedUsage",
    align: "right",
    sorter: (a, b) => sorter("calculatedUsage", a, b),
    filteredValue: search?.["calculatedUsage"]
      ? [search?.["calculatedUsage"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "calculatedUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "calculatedUsage",
        hasValue(search["calculatedUsage"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CONVERTED UOM",
    dataIndex: "convertedUom",
    align: "center",
    sorter: (a, b) => sorter("convertedUom", a, b),
    filteredValue: search?.["convertedUom"] ? [search?.["convertedUom"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "convertedUom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "convertedUom",
        hasValue(search["convertedUom"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CONVERTED TOTAL USAGE",
    dataIndex: "convertedTotalUsage",
    align: "right",
    sorter: (a, b) => sorter("convertedTotalUsage", a, b),
    filteredValue: search?.["convertedTotalUsage"]
      ? [search?.["convertedTotalUsage"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "convertedTotalUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "convertedTotalUsage",
        hasValue(search["convertedTotalUsage"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "CONVERTED CALCULATED USAGE",
    dataIndex: "convertedCalculatedUsage",
    align: "right",
    sorter: (a, b) => sorter("convertedCalculatedUsage", a, b),
    filteredValue: search?.["convertedCalculatedUsage"]
      ? [search?.["convertedCalculatedUsage"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "convertedCalculatedUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "convertedCalculatedUsage",
        hasValue(search["convertedCalculatedUsage"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "MIN CONTRACT",
    dataIndex: "minContract",
    align: "right",
    sorter: (a, b) => sorter("minContract", a, b),
    filteredValue: search?.["minContract"] ? [search?.["minContract"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "minContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "minContract",
        hasValue(search["minContract"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "MAX CONTRACT",
    dataIndex: "maxContract",
    align: "right",
    sorter: (a, b) => sorter("maxContract", a, b),
    filteredValue: search?.["maxContract"] ? [search?.["maxContract"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "maxContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "maxContract",
        hasValue(search["maxContract"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TOTAL AMOUNT IDR",
    dataIndex: "totalAmountIdr",
    align: "right",
    sorter: (a, b) => sorter("totalAmountIdr", a, b),
    filteredValue: search?.["totalAmountIdr"]
      ? [search?.["totalAmountIdr"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "totalAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmountIdr",
        hasValue(search["totalAmountIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TOTAL AMOUNT USD",
    dataIndex: "totalAmountUsd",
    align: "right",
    sorter: (a, b) => sorter("totalAmountUsd", a, b),
    filteredValue: search?.["totalAmountUsd"]
      ? [search?.["totalAmountUsd"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "totalAmountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmountUsd",
        hasValue(search["totalAmountUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    align: "center",
    sorter: (a, b) => sorter("statusApproval", a, b),
    filteredValue: search?.["statusApproval"]
      ? [search?.["statusApproval"]]
      : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "statusApproval",
        hasValue(search["statusApproval"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "TEMPLATE",
    dataIndex: "template",
    align: "center",
    sorter: (a, b) => sorter("template", a, b),
    filteredValue: search?.["template"] ? [search?.["template"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "template",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "template",
        hasValue(search["template"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    sorter: (a, b) => sorter("description", a, b),
    filteredValue: search?.["description"] ? [search?.["description"]] : null,
    ...getColumnSearchPropsUseFilteredValueFE(
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
        false,
        "input",
        search
      ),
  },
];
