import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";

export const getAllTabColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    key: "no",
    title: "NO",
    width:45,
    isClassification: true,
    render: (text, object, index) => index + 1,
  },
  {
    key: "initCode",
    title: "INIT CODE",
    dataIndex: "initCode",
    sorter: true,
    isClassification: true,
    width: 110,
    filteredValue: [search?.initCode] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "initCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "initCode",
        hasValue(search["initCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingCycle",
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    isClassification: true,
    sorter: true,
    width: 108,
    filteredValue: [search?.billingCycle] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "billPeriod",
    title: "BILLING PERIOD",
    dataIndex: "billPeriod",
    isClassification: true,
    sorter: true,
    width: 105,
    filteredValue: [search?.billPeriod] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      renderDateColumn(
        "billPeriod",
        hasValue(search["billPeriod"]),
        searchText,
        text,
        "datePeriod",
        search
      ),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    isClassification: true,
    sorter: true,
    width: 140,
    filteredValue: [search?.sor] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "sor",
        hasValue(search["sor"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    isClassification: true,
    sorter: true,
    width: 130,
    filteredValue: [search?.costCenter] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        hasValue(search["costCenter"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    isClassification: true,
    sorter: true,
    width: 105,
    filteredValue: [search?.meterReadingCode] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "meterReadingCode",
        hasValue(search["meterReadingCode"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "customerSegment",
    title: "CUSTOMER SEGMENT",
    dataIndex: "customerSegment",
    isClassification: true,
    sorter: true,
    width: 90,
    filteredValue: [search?.customerSegment] || null,
    ellipsis: { showTitle: false },
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
        true,
        "input",
        search
      ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    isClassification: true,
    sorter: true,
    width: 80,
    filteredValue: [search?.accountGroupType] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
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
        true,
        "input",
        search
      ),
  },
  {
    key: "specificAccount",
    title: "SPECIFIC ACCOUNT",
    dataIndex: "specificAccount",
    isClassification: true,
    sorter: true,
    width: 90,
    filteredValue: [search?.specificAccount] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "specificAccount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "specificAccount",
        hasValue(search["specificAccount"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "message",
    title: "MESSAGE",
    dataIndex: "message",
    align: "left",
    sorter: true,
    width: 100,
    filteredValue: [search?.message] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "message",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "message",
        hasValue(search["message"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "totalCustomer",
    title: "TOTAL CUSTOMER",
    dataIndex: "totalCustomer",
    isNumber: true,
    sorter: true,
    width: 90,
    filteredValue: [search?.totalCustomer] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalCustomer",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      const displayText = text?.toLocaleString() || "";
      return renderColumn(
        "totalCustomer",
        hasValue(search["totalCustomer"]),
        searchText,
        displayText,
        false,
        "input",
        search
      );
    },
  },
  {
    key: "remark",
    title: "REMARK",
    dataIndex: "remark",
    align: "left",
    sorter: true,
    width: 90,
    filteredValue: [search?.remark] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "remark",
        hasValue(search["remark"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "createdDtm",
    title: "CREATED DATE",
    dataIndex: "createdDtm",
    isClassification: true,
    sorter: true,
    width: 80,
    filteredValue: [search?.createdDtm] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "createdDtm",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => {
      const formattedDate = text
        ? moment(text).format("DD MMM YYYY HH:mm:ss")
        : "";
      return renderDateColumn(
        "createdDtm",
        hasValue(search["createdDtm"]),
        searchText,
        formattedDate,
        "datetime",
        search
      );
    },
  },
  {
    key: "updatedDtm",
    title: "COMPLETION DATE",
    dataIndex: "updatedDtm",
    isClassification: true,
    sorter: true,
    width: 90,
    filteredValue: [search?.updatedDtm] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "updatedDtm",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => {
      const formattedDate = text
        ? moment(text).format("DD MMM YYYY HH:mm:ss")
        : "";
      return renderDateColumn(
        "updatedDtm",
        hasValue(search["updatedDtm"]),
        searchText,
        formattedDate,
        "datetime",
        search
      );
    },
  },
  {
    key: "createdBy",
    title: "CREATED BY",
    dataIndex: "createdBy",
    isClassification: true,
    width: 80,
    sorter: true,
    filteredValue: [search?.createdBy] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "createdBy",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "createdBy",
        hasValue(search["createdBy"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    align: "center",
    sorter: true,
    width: 60,
    filteredValue: [search?.status] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (status) => {
      const statusConfig = {
        0: { text: "Open" },
        1: { text: "In Progress" },
        2: { text: "Success" },
        3: { text: "Failed" },
        4: { text: "Scheduled" },
        5: { text: "Open" },
      };
      const config = statusConfig[status] || {
        text: "Unknown",
        color: "#d9d9d9",
      };
      const displayText = config.text;
      return renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        displayText,
        false,
        "status",
        search
      );
    },
  },
];

export const getSummaryTabColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    key: "no",
    title: "NO",
    width: 20,
    isClassification: true,
    render: (text, object, index) => index + 1,
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: true,
    width: 70,
    filteredValue: [search?.customerNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    sorter: true,
    width: 80,
    filteredValue: [search?.customerName] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
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
        true,
        "input",
        search
      ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    sorter: true,
    width: 70,
    filteredValue: [search?.accountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    sorter: true,
    width: 80,
    filteredValue: [search?.accountName] || null,
    ellipsis: { showTitle: false },
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
        true,
        "input",
        search
      ),
  },
  {
    key: "billingCycle",
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    sorter: true,
    isClassification: true,
    width: 70,
    filteredValue: [search?.billingCycle] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "billPeriod",
    title: "BILLING PERIOD",
    dataIndex: "billPeriod",
    isClassification: true,
    sorter: true,
    width: 60,
    filteredValue: [search?.billPeriod] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "billPeriod",
        hasValue(search["billPeriod"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    isClassification: true,
    sorter: true,
    width: 70,
    filteredValue: [search?.sor] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "sor",
        hasValue(search["sor"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    isClassification: true,
    sorter: true,
    width: 70,
    filteredValue: [search?.costCenter] || null,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "costCenter",
        hasValue(search["costCenter"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
  {
    key: "accountSegment",
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    isClassification: true,
    sorter: true,
    width: 70,
    filteredValue: [search?.accountSegment] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "accountSegment",
        hasValue(search["accountSegment"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    isClassification: true,
    sorter: true,
    width: 70,
    filteredValue: [search?.accountGroupType] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
];

/**
 * Generate action columns
 */
export const getActionColumns = (valueTab) => {
  // Jika Summary tab, return empty array (tidak ada action column)
  if (valueTab === "Summary") {
    return [];
  }

  // Untuk tab lain (All), tampilkan action View
  return [
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Link
          to={RBI_ROUTES.PRABILLING_DETAIL}
          state={{
            id: record?.initCode,
          }}
          style={{ padding: 0, margin: 0 }}
        >
          <Tooltip title="Detail">
            <SVGIcon name="IconDetail" width={15} />
          </Tooltip>
        </Link>
      ),
    },
  ];
};
