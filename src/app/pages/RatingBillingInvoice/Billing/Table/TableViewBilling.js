import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { currencyFormatting, numberFormatting } from "../../../../../utils/formatCurrency";

export const columnsBilling = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
  // handleDetail = () => {},
  // handleApprovalHistory = () => {}
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "calculationCode",
    title: "CALCULATION CODE",
    dataIndex: "calculationCode",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "calculationCode",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "ratingCode",
    title: "RATING CODE",
    dataIndex: "ratingCode",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "ratingCode",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "ratingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "ratingCode",
        hasValue(search["ratingCode"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "billingCode",
    title: "BILLING CODE",
    dataIndex: "billingCode",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "billingCode",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "saNumber",
    title: "SA NUMBER",
    dataIndex: "saNumber",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "saNumber",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "saNumber",
        hasValue(search["saNumber"]),
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
    sorter: true,
    align: "center",
    // ...getColumnSearchPropsPaging(
    //   "billingCycle",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
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
    key: "billingPeriod",
    title: "BILLING PERIOD",
    sorter: true,
    align: "center",
    dataIndex: "billingPeriod",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      renderDateColumn(
        "billingPeriod",
        hasValue(search["billingPeriod"]),
        searchText,
        text,
        "datePeriod",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "billingPeriod",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "datePeriod"
    // ),
    // render: (text) =>
    //   searchedColumn === "billingPeriod" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={
    //         text ? moment(text).format(dateFormatting.datePeriod) : ""
    //       }
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.datePeriod)
    //   ),
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "customerNumber",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
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
    // ...getColumnSearchPropsPaging(
    //   "customerName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
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
        false,
        "input",
        search
      ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "accountNumber",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
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
    // ...getColumnSearchPropsPaging(
    //   "accountName",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    sorter: true,
    align: "center",
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
    // ...getColumnSearchPropsPaging(
    //   "accountGroupType",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "serviceType",
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    sorter: true,
    align: "center",
    // ...getColumnSearchPropsPaging(
    //   "serviceType",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "sor",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
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
        false,
        "input",
        search
      ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "costCenter",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
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
        false,
        "input",
        search
      ),
  },
  {
    key: "accountSegment",
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    sorter: true,
    align: "center",
    // ...getColumnSearchPropsPaging(
    //   "accountSegment",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
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
    key: "meterReadingCode",
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "meterReadingCode",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
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
        false,
        "input",
        search
      ),
  },
  {
    key: "product",
    title: "PRODUCT",
    dataIndex: "product",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "product",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "product",
        hasValue(search["product"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "product",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "timeUnitContract",
    title: "CONTRACT PERIOD UNIT",
    dataIndex: "timeUnitContract",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "timeUnitContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "timeUnitContract",
        hasValue(search["timeUnitContract"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "timeUnitContract",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    sorter: true,
    align: "center",
    // ...getColumnSearchPropsPaging(
    //   "uom",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "minContract",
    title: "MIN CONTRACT",
    dataIndex: "minContract",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "minContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (hasValue(search["minContract"])) {
        return renderColumn(
          "minContract",
          true,
          searchText,
          text,
          false,
          "input",
          search
        );
      }
      return numberFormatting(text);
    },
  },
  {
    key: "maxContract",
    title: "MAX CONTRACT",
    dataIndex: "maxContract",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "maxContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (hasValue(search["maxContract"])) {
        return renderColumn(
          "maxContract",
          true,
          searchText,
          text,
          false,
          "input",
          search
        );
      }
      return numberFormatting(text);
    },
  },
  {
    key: "totalUsage",
    title: "TOTAL USAGE",
    dataIndex: "totalUsage",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (hasValue(search["totalUsage"])) {
        return renderColumn(
          "totalUsage",
          true,
          searchText,
          text,
          false,
          "input",
          search
        );
      }
      return numberFormatting(text);
    },
  },
  {
    key: "totalUsageConvM3",
    title: "TOTAL USAGE EQV M3",
    dataIndex: "totalUsageConvM3",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalUsageConvM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (hasValue(search["totalUsageConvM3"])) {
        return renderColumn(
          "totalUsageConvM3",
          true,
          searchText,
          text,
          false,
          "input",
          search
        );
      }
      return numberFormatting(text);
    },
  },
  {
    key: "totalUsageConvMmbtu",
    title: "TOTAL USAGE EQV MMBTU",
    dataIndex: "totalUsageConvMmbtu",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalUsageConvMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (hasValue(search["totalUsageConvMmbtu"])) {
        return renderColumn(
          "totalUsageConvMmbtu",
          true,
          searchText,
          text,
          false,
          "input",
          search
        );
      }
      return numberFormatting(text);
    },
  },

  // KOLOM CURRENCY IDR
  {
    key: "basicBillingIdr",
    title: "BASIC BILL IDR",
    dataIndex: "basicBillingIdr",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "basicBillingIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (hasValue(search["basicBillingIdr"])) {
        return renderColumn(
          "basicBillingIdr",
          true,
          searchText,
          text,
          false,
          "input",
          search
        );
      }
      return currencyFormatting(text, "idr");
    },
  },

  // KOLOM CURRENCY USD
  {
    key: "basicBillingUsd",
    title: "BASIC BILL USD",
    dataIndex: "basicBillingUsd",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "basicBillingUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (hasValue(search["basicBillingUsd"])) {
        return renderColumn(
          "basicBillingUsd",
          true,
          searchText,
          text,
          false,
          "input",
          search
        );
      }
      return currencyFormatting(text, "usd");
    },
  },
  {
    key: "totalBasicBillEqvIdr",
    title: "TOTAL BASIC BILL EQV IDR",
    dataIndex: "totalBasicBillEqvIdr",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "totalBasicBillEqvIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalBasicBillEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalBasicBillEqvIdr",
        hasValue(search["totalBasicBillEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalBasicBillEqvUsd",
    title: "TOTAL BASIC BILL EQV USD",
    dataIndex: "totalBasicBillEqvUsd",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "totalBasicBillEqvUsd",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalBasicBillEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalBasicBillEqvUsd",
        hasValue(search["totalBasicBillEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "otherBillIdr",
    title: "OTHER BILL IDR",
    dataIndex: "otherBillIdr",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "otherBillIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "otherBillIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "otherBillIdr",
        hasValue(search["otherBillIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "otherBillUsd",
    title: "OTHER BILL USD",
    dataIndex: "otherBillUsd",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "otherBillUsd",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "otherBillUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "otherBillUsd",
        hasValue(search["otherBillUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalOtherBillEqvIdr",
    title: "TOTAL OTHER BILL EQV IDR",
    dataIndex: "totalOtherBillEqvIdr",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "totalOtherBillEqvIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalOtherBillEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalOtherBillEqvIdr",
        hasValue(search["totalOtherBillEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalOtherBillEqvUsd",
    title: "TOTAL OTHER BILL EQV USD",
    dataIndex: "totalOtherBillEqvUsd",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "totalOtherBillEqvUsd",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalOtherBillEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalOtherBillEqvUsd",
        hasValue(search["totalOtherBillEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "discountAmountIdr",
    title: "DISCOUNT IDR",
    dataIndex: "discountAmountIdr",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "discountAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "discountAmountIdr",
        hasValue(search["discountAmountIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "discountAmountIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "discountAmountUsd",
    title: "DISCOUNT USD",
    dataIndex: "discountAmountUsd",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "discountAmountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "discountAmountUsd",
        hasValue(search["discountAmountUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "discountAmountUsd",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "taxBasicIdr",
    title: "TAX BASIS IDR",
    dataIndex: "taxBasicIdr",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxBasicIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "taxBasicIdr",
        hasValue(search["taxBasicIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "taxBasicUsd",
    title: "TAX BASIS USD",
    dataIndex: "taxBasicUsd",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxBasicUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "taxBasicUsd",
        hasValue(search["taxBasicUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "taxBasicUsd",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "taxBasicEqvIdr",
    title: "TAX BASIS EQV IDR",
    dataIndex: "taxBasicEqvIdr",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "taxBasicEqvIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxBasicEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "taxBasicEqvIdr",
        hasValue(search["taxBasicEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "vatIdr",
    title: "VAT IDR",
    dataIndex: "vatIdr",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatIdr",
        hasValue(search["vatIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "vatIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "vatUsd",
    title: "VAT USD",
    dataIndex: "vatUsd",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "vatUsd",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatUsd",
        hasValue(search["vatUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "vatEqvIdr",
    title: "VAT EQV IDR",
    dataIndex: "vatEqvIdr",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "vatEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "vatEqvIdr",
        hasValue(search["vatEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "vatEqvIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "withHoldingTax",
    title: "WITHHOLDING TAX",
    dataIndex: "withHoldingTax",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "withHoldingTax",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "withHoldingTax",
        hasValue(search["withHoldingTax"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "withHoldingTax",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "prevWithHoldingTax",
    title: "PREV WITHHOLDING TAX",
    dataIndex: "prevWithHoldingTax",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "prevWithHoldingTax",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    // render:(text) => console.log(text?.toString(), ' text')
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "prevWithHoldingTax",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "prevWithHoldingTax",
        hasValue(search["prevWithHoldingTax"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "taxRateType",
    title: "TAX RATE TYPE",
    dataIndex: "taxRateType",
    sorter: true,
    align: "center",
    // ...getColumnSearchPropsPaging(
    //   "taxRateType",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxRateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "taxRateType",
        hasValue(search["taxRateType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "taxRate",
    title: "TAX RATE",
    dataIndex: "taxRate",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "taxRate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "taxRate",
        hasValue(search["taxRate"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "taxRateDate",
    title: "TAX RATE DATE",
    sorter: true,
    align: "center",
    dataIndex: "taxRateDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxRateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "taxRateDate",
        hasValue(search["taxRateDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "taxRateDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "date"
    // ),
    // render: (text) =>
    //   searchedColumn === "taxRateDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    key: "totalAmountIdr",
    title: "TOTAL AMOUNT IDR",
    dataIndex: "totalAmountIdr",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "totalAmountIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "totalAmountUsd",
    title: "TOTAL AMOUNT USD",
    dataIndex: "totalAmountUsd",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "totalAmountUsd",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
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
    key: "totalAmountEqvIdr",
    title: "TOTAL AMOUNT EQV IDR",
    dataIndex: "totalAmountEqvIdr",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "totalAmountEqvIdr",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvIdr",
        hasValue(search["totalAmountEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountEqvUsd",
    title: "TOTAL AMOUNT EQV USD",
    dataIndex: "totalAmountEqvUsd",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsPaging(
    //   "totalAmountEqvUsd",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "totalAmountEqvUsd",
        hasValue(search["totalAmountEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "rateType",
    title: "RATE TYPE",
    dataIndex: "rateType",
    sorter: true,
    // ...getColumnSearchPropsPaging(
    //   "rateType",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "rateType",
        hasValue(search["rateType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "rate",
    title: "RATE",
    align: "right",
    dataIndex: "rate",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      renderColumn(
        "rate",
        hasValue(search["rate"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "rate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    sorter: true,
    align: "center",
    dataIndex: "rateDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "rateDate",
        hasValue(search["rateDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "rateDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "date"
    // ),
    // render: (text) =>
    //   searchedColumn === "rateDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    key: "transactionDate",
    title: "TRANSACTION DATE",
    sorter: true,
    align: "center",
    dataIndex: "transactionDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "transactionDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "transactionDate",
        hasValue(search["transactionDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "transactionDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "date"
    // ),
    // render: (text) =>
    //   searchedColumn === "transactionDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    key: "accountDate",
    title: "ACCOUNTING DATE",
    sorter: true,
    align: "center",
    dataIndex: "accountDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "accountDate",
        hasValue(search["accountDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "accountDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "date"
    // ),
    // render: (text) =>
    //   searchedColumn === "accountDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    key: "invoiceDate",
    title: "INVOICE DATE",
    sorter: true,
    align: "center",
    dataIndex: "invoiceDate",
    // ...getColumnSearchPropsPaging(
    //   "invoiceDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "date"
    // ),
    // render: (text) =>
    //   searchedColumn === "invoiceDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "invoiceDate",
        hasValue(search["invoiceDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "dueDate",
    title: "DUE DATE",
    sorter: true,
    align: "center",
    dataIndex: "dueDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "dueDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "dueDate",
        hasValue(search["dueDate"]),
        searchText,
        text,
        "date",
        search
      ),
    // ...getColumnSearchPropsPaging(
    //   "dueDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "date"
    // ),
    // render: (text) =>
    //   searchedColumn === "dueDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     ""
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    key: "remark",
    sorter: true,
    title: "REMARK",
    dataIndex: "remark",
    ellipsis: {
      showTitle: false,
    },
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
    // ...getColumnSearchPropsPaging(
    //   "remark",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    // render: (text) =>
    //   searchedColumn === "remark" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : text ? (
    //     <Tooltip placement="topLeft" title={text}>
    //       {text}
    //     </Tooltip>
    //   ) : (
    //     ""
    //   ),
  },
  {
    key: "paymentStatus",
    title: "PAYMENT STATUS",
    dataIndex: "paymentStatus",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "paymentStatus",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    // ...getColumnSearchPropsPaging(
    //   "paymentStatus",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    render: (index) => {
      let text;
      switch (index) {
        case "NOT PAID":
          text = "Not Paid";
          break;
        case "PARTIALLY PAID":
          text = "Partially Paid";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return text
        ? renderColumn(
            "paymentStatus",
            hasValue(search["paymentStatus"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    fixed: "right",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "select",
      [
        // tambahkan options
        { value: "APPROVED", label: "Approved" },
        { value: "NEED REVIEW", label: "Need Review" },
        { value: "WAITING APPROVAL", label: "Waiting Approval" },
      ]
    ),
    render: (index) => {
      let text;
      switch (index) {
        case "WAITING APPROVAL":
          text = "Waiting Approval";
          break;
        case "NEED REVIEW":
          text = "Need Review";
          break;
        default:
          text = index
            ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
            : index;
          break;
      }
      return text
        ? renderColumn(
            "statusApproval",
            hasValue(search["statusApproval"]),
            searchText,
            text,
            false,
            "status",
            search
          )
        : text;
    },
  },
  // {
  //   title: "ACTION",
  //   fixed: "right",
  //   width: 150,
  //   align: "center",
  //   render: (id, record) => {
  //     return (
  //       <div className="flex w-full justify-center gap-6">
  //         <Tooltip title="Detail">
  //           <div className="pt-1">
  //             <SVGIcon
  //               name="IconDetail"
  //               width={24}
  //               onClick={() => handleDetail(record)}
  //             />
  //           </div>
  //         </Tooltip>

  //         <Tooltip title="Approval Hierarchy">
  //           <div className="pt-1">
  //             <SVGIcon
  //               name="IconLogHistory"
  //               color={"#0075bf"}
  //               width={24}
  //               onClick={() => handleApprovalHistory(record)}
  //             />
  //           </div>
  //         </Tooltip>
  //       </div>
  //     );
  //   },
  // },
];
