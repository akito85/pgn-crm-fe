import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

export const columnsRating = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
  // handleDetail = () => {}
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "calculationCode",
    title: "CALCULATION CODE",
    dataIndex: "calculationCode",
    isClassification: true,
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "calculationCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    isClassification: true,
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "ratingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "rateTyoe",
    title: "RATE TYPE",
    dataIndex: "rateType",
    isClassification: true,
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    isClassification: true,
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    isClassification: true,
    width: 130,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    isClassification: true,
    width: 120,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "serviceType",
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    width: 110,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    width: 170,
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    width: 110,
    dataIndex: "costCenter",
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "mreadingCode",
    title: "METER READING CODE",
    dataIndex: "mreadingCode",
    width: 130,
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "mreadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "mreadingCode",
        hasValue(search["mreadingCode"]),
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
    width: 120,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "accGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accGroupType",
    width: 130,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "accGroupType",
        hasValue(search["accGroupType"]),
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
    width: 100,
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    width: 100,
    sorter: true,
    isClassification: true,
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
  },
  {
    key: "saNumber",
    title: "SA NUMBER",
    dataIndex: "saNumber",
    isClassification: true,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "product",
    title: "PRODUCT",
    dataIndex: "product",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "product",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
  },
  {
    key: "minContract",
    title: "MIN CONTRACT",
    width: 100,
    dataIndex: "minContract",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "minContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "maxContract",
    title: "MAX CONTRACT",
    width: 100,
    dataIndex: "maxContract",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "maxContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    width: 60,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "timeUnitContract",
    title: "CONTRACT TIME UNIT",
    dataIndex: "timeUnitContract",
    width: 120,
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "timeUnitContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
  },
  {
    key: "usage",
    title: "USAGE",
    width: 70,
    dataIndex: "usage",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "usage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "usage",
        hasValue(search["usage"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convUsageM3",
    title: "CONVERTED USAGE M3",
    width: 130,
    dataIndex: "convUsageM3",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convUsageM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convUsageM3",
        hasValue(search["convUsageM3"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convUsageMmbtu",
    title: "CONVERTED USAGE MMBTU",
    dataIndex: "convUsageMmbtu",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convUsageMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convUsageMmbtu",
        hasValue(search["convUsageMmbtu"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "discountUsage",
    title: "DISCOUNT USAGE",
    dataIndex: "discountUsage",
    width: 120,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "discountUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "discountUsage",
        hasValue(search["discountUsage"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalUsage",
    title: "TOTAL USAGE",
    width: 100,
    dataIndex: "totalUsage",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "convTotalUsageM3",
    title: "CONVERTED TOTAL USAGE M3",
    dataIndex: "convTotalUsageM3",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convTotalUsageM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convTotalUsageM3",
        hasValue(search["convTotalUsageM3"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convTotalUsageMmbtu",
    title: "CONVERTED TOTAL USAGE MMBTU",
    width: 170,
    dataIndex: "convTotalUsageMmbtu",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convTotalUsageMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convTotalUsageMmbtu",
        hasValue(search["convTotalUsageMmbtu"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "minimumUsage",
    title: "MINIMUM USAGE",
    width: 170,
    dataIndex: "minimumUsage",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "minimumUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "minimumUsage",
        hasValue(search["minimumUsage"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convMinimumUsageM3",
    title: "CONVERTED MINIMUM USAGE M3",
    width: 170,
    dataIndex: "convMinimumUsageM3",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convMinimumUsageM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convMinimumUsageM3",
        hasValue(search["convMinimumUsageM3"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convMinimumUsageMmbtu",
    title: "CONVERTED MINIMUM USAGE MMBTU",
    dataIndex: "convMinimumUsageMmbtu",
    width: 180,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convMinimumUsageMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convMinimumUsageMmbtu",
        hasValue(search["convMinimumUsageMmbtu"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "normalUsage",
    title: "NORMAL USAGE",
    width: 100,
    dataIndex: "normalUsage",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "normalUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "normalUsage",
        hasValue(search["normalUsage"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convNormalUsageM3",
    title: "CONVERTED NORMAL USAGE M3",
    width: 170,
    dataIndex: "convNormalUsageM3",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convNormalUsageM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convNormalUsageM3",
        hasValue(search["convNormalUsageM3"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convNormalUsageMmbtu",
    title: "CONVERTED NORMAL USAGE MMBTU",
    width: 180,
    dataIndex: "convNormalUsageMmbtu",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convNormalUsageMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convNormalUsageMmbtu",
        hasValue(search["convNormalUsageMmbtu"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "oup",
    title: "OUP",
    dataIndex: "oup",
    width: 60,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "oup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "oup",
        hasValue(search["oup"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convOupM3",
    title: "CONVERTED OUP M3",
    dataIndex: "convOupM3",
    width: 120,
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convOupM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convOupM3",
        hasValue(search["convOupM3"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convOupMmbtu",
    title: "CONVERTED OUP MMBTU",
    width: 130,
    dataIndex: "convOupMmbtu",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convOupMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convOupMmbtu",
        hasValue(search["convOupMmbtu"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "calculatedUsage",
    title: "CALCULATED USAGE",
    width: 110,
    dataIndex: "calculatedUsage",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "calculatedUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "convCalculatedUsageM3",
    title: "CONVERTED CALCULATED USAGE M3",
    dataIndex: "convCalculatedUsageM3",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convCalculatedUsageM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convCalculatedUsageM3",
        hasValue(search["convCalculatedUsageM3"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "convCalculatedUsageMmbtu",
    title: "CONVERTED CALCULATED USAGE MMBTU",
    dataIndex: "convCalculatedUsageMmbtu",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "convCalculatedUsageMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "convCalculatedUsageMmbtu",
        hasValue(search["convCalculatedUsageMmbtu"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    sorter: true,
    isClassification: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "currency",
        hasValue(search["currency"]),
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
    dataIndex: "rate",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "rate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    sorter: true,
    isClassification: true,
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
  },
  {
    key: "totalAmountMinIdr",
    title: "TOTAL AMOUNT MINIMUM IDR",
    dataIndex: "totalAmountMinIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountMinIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountMinIdr",
        hasValue(search["totalAmountMinIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountMinUsd",
    title: "TOTAL AMOUNT MINIMUM USD",
    dataIndex: "totalAmountMinUsd",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountMinUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountMinUsd",
        hasValue(search["totalAmountMinUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountMinEqvIdr",
    title: "TOTAL AMOUNT MINIMUM EQV IDR",
    dataIndex: "totalAmountMinEqvIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountMinEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountMinEqvIdr",
        hasValue(search["totalAmountMinEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountMinEqvUsd",
    title: "TOTAL AMOUNT MINIMUM EQV USD",
    dataIndex: "totalAmountMinEqvUsd",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountMinEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountMinEqvUsd",
        hasValue(search["totalAmountMinEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountNormalIdr",
    title: "TOTAL AMOUNT NORMAL IDR",
    dataIndex: "totalAmountNormalIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountNormalIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountNormalIdr",
        hasValue(search["totalAmountNormalIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountNormalUsd",
    title: "TOTAL AMOUNT NORMAL USD",
    dataIndex: "totalAmountNormalUsd",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountNormalUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountNormalUsd",
        hasValue(search["totalAmountNormalUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountNormalEqvIdr",
    title: "TOTAL AMOUNT NORMAL EQV IDR",
    dataIndex: "totalAmountNormalEqvIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountNormalEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountNormalEqvIdr",
        hasValue(search["totalAmountNormalEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountNormalEqvUsd",
    title: "TOTAL AMOUNT NORMAL EQV USD",
    dataIndex: "totalAmountNormalEqvUsd",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountNormalEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountNormalEqvUsd",
        hasValue(search["totalAmountNormalEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountOupIdr",
    title: "TOTAL AMOUNT OUP IDR",
    dataIndex: "totalAmountOupIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountOupIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountOupIdr",
        hasValue(search["totalAmountOupIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountOupUsd",
    title: "TOTAL AMOUNT OUP USD",
    dataIndex: "totalAmountOupUsd",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountOupUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountOupUsd",
        hasValue(search["totalAmountOupUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountOupEqvIdr",
    title: "TOTAL AMOUNT OUP EQV IDR",
    dataIndex: "totalAmountOupEqvIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountOupEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountOupEqvIdr",
        hasValue(search["totalAmountOupEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountOupEqvUsd",
    title: "TOTAL AMOUNT OUP EQV USD",
    dataIndex: "totalAmountOupEqvUsd",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountOupEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "totalAmountOupEqvUsd",
        hasValue(search["totalAmountOupEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "amountIdr",
    title: "AMOUNT IDR",
    dataIndex: "amountIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "amountIdr",
        hasValue(search["amountIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "amountUsd",
    title: "AMOUNT USD",
    dataIndex: "amountUsd",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "amountUsd",
        hasValue(search["amountUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "amountEqvIdr",
    title: "AMOUNT EQV IDR",
    dataIndex: "amountEqvIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "amountEqvIdr",
        hasValue(search["amountEqvIdr"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "amountEqvUsd",
    title: "AMOUNT EQV USD",
    dataIndex: "amountEqvUsd",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "amountEqvUsd",
        hasValue(search["amountEqvUsd"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "discountAmount",
    title: "DISCOUNT AMOUNT",
    dataIndex: "discountAmount",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "discountAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "discountAmount",
        hasValue(search["discountAmount"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "totalAmountIdr",
    title: "TOTAL AMOUNT IDR",
    dataIndex: "totalAmountIdr",
    sorter: true,
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    isNumber: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "totalAmountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    key: "transactionDate",
    title: "TRANSACTION DATE",
    sorter: true,
    isClassification: true,
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
  },
  // {
  //   key: "accountingDate",
  //   title: "ACCOUNTING DATE",
  //   sorter: true,
  //   align: "center",
  //   dataIndex: "accountingDate",
  //   ...getColumnSearchPropsUseFilteredValue(
  //     search,
  //     "accountingDate",
  //     searchInput,
  //     searchedColumn,
  //     searchText,
  //     handleSearch,
  //     true,
  //     "date"
  //   ),
  //   render: (text) => renderDateColumn('accountingDate', hasValue(search['accountingDate']), searchText, text, 'date', search)
  // },
];
