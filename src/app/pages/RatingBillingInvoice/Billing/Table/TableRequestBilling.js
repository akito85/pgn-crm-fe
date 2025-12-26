import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

export const columnsRequestBilling = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
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
    isClassification:true,
    width: 180,
    sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
    ...getColumnSearchPropsPaging(
      "calculationCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["calculationCode"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "ratingCode",
    title: "RATING CODE",
    dataIndex: "ratingCode",
    isClassification:true,
    width: 150,
    sorter: (a, b) => a?.ratingCode?.localeCompare(b?.ratingCode),
    ...getColumnSearchPropsPaging(
      "ratingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["ratingCode"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "billingCode",
    title: "BILLING CODE",
    dataIndex: "billingCode",
    isClassification:true,
    width: 180,
    sorter: (a, b) => a?.billingCode?.localeCompare(b?.billingCode),
    ...getColumnSearchPropsPaging(
      "billingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["billingCode"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "saNumber",
    title: "SA NUMBER",
    dataIndex: "saNumber",
    isClassification:true,
    width: 150,
    sorter: (a, b) => a?.saNumber?.localeCompare(b?.saNumber),
    ...getColumnSearchPropsPaging(
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["saNumber"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "billingCycle",
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    isClassification:true,
    width: 120,
    sorter: (a, b) => a?.billingCycle?.localeCompare(b?.billingCycle),
    ...getColumnSearchPropsPaging(
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["billingCycle"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "billingPeriod",
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    isClassification:true,
    width: 120,
    sorter: (a, b) => a?.billingPeriod?.localeCompare(b?.billingPeriod),
    ...getColumnSearchPropsPaging(
      "billingPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      searchedColumn === "billingPeriod" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.datePeriod) : ""
          }
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.datePeriod)
      ),
    onFilter: (value, record) =>
      record["billingPeriod"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    isClassification:true,
    width: 150,
    sorter: (a, b) => a?.customerNumber?.localeCompare(b?.customerNumber),
    ...getColumnSearchPropsPaging(
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["customerNumber"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    isClassification:true,
    width: 200,
    sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
    ...getColumnSearchPropsPaging(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["customerName"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    isClassification:true,
    width: 150,
    sorter: (a, b) => a?.accountNumber?.localeCompare(b?.accountNumber),
    ...getColumnSearchPropsPaging(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["accountNumber"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    isClassification:true,
    width: 200,
    sorter: (a, b) => a?.accountName?.localeCompare(b?.accountName),
    ...getColumnSearchPropsPaging(
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["accountName"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    isClassification:true,
    width: 180,
    sorter: (a, b) => a?.accountGroupType?.localeCompare(b?.accountGroupType),
    ...getColumnSearchPropsPaging(
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["accountGroupType"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "serviceType",
    title: "SERVICE TYPE",
    dataIndex: "serviceType",
    isClassification:true,
    width: 120,
    sorter: (a, b) => a?.serviceType?.localeCompare(b?.serviceType),
    ...getColumnSearchPropsPaging(
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["serviceType"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    isClassification:true,
    width: 200,
    sorter: (a, b) => a?.sor?.localeCompare(b?.sor),
    ...getColumnSearchPropsPaging(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["sor"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    isClassification:true,
    width: 200,
    sorter: (a, b) => a?.costCenter?.localeCompare(b?.costCenter),
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["costCenter"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "accountSegment",
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    isClassification:true,
    width: 150,
    sorter: (a, b) => a?.accountSegment?.localeCompare(b?.accountSegment),
    ...getColumnSearchPropsPaging(
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["accountSegment"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    isClassification:true,
    width: 180,
    sorter: (a, b) => a?.meterReadingCode?.localeCompare(b?.meterReadingCode),
    ...getColumnSearchPropsPaging(
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["meterReadingCode"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "product",
    title: "PRODUCT",
    dataIndex: "product",
    isClassification:true,
    width: 150,
    sorter: (a, b) => a?.product?.localeCompare(b?.product),
    ...getColumnSearchPropsPaging(
      "product",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["product"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "timeUnitContract",
    title: "CONTRACT PERIOD UNIT",
    dataIndex: "timeUnitContract",
    isClassification:true,
    width: 180,
    sorter: (a, b) => a?.timeUnitContract?.localeCompare(b?.timeUnitContract),
    ...getColumnSearchPropsPaging(
      "timeUnitContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["timeUnitContract"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    isClassification:true,
    width: 100,
    sorter: (a, b) => a?.uom?.localeCompare(b?.uom),
    ...getColumnSearchPropsPaging(
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["uom"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "minContract",
    title: "MIN CONTRACT",
    dataIndex: "minContract",
    isNumber:true,
    width: 150,
    sorter: (a, b) => a?.minContract?.localeCompare(b?.minContract),
    ...getColumnSearchPropsPaging(
      "minContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["minContract"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "maxContract",
    title: "MAX CONTRACT",
    dataIndex: "maxContract",
    isNumber:true,
    width: 150,
    sorter: (a, b) => a?.maxContract?.localeCompare(b?.maxContract),
    ...getColumnSearchPropsPaging(
      "maxContract",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["maxContract"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalUsage",
    title: "TOTAL USAGE",
    dataIndex: "totalUsage",
    isNumber:true,
    width: 150,
    sorter: (a, b) => a?.totalUsage?.localeCompare(b?.totalUsage),
    ...getColumnSearchPropsPaging(
      "totalUsage",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalUsage"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalUsageConvM3",
    title: "TOTAL USAGE EQV M3",
    dataIndex: "totalUsageConvM3",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.totalUsageConvM3?.localeCompare(b?.totalUsageConvM3),
    ...getColumnSearchPropsPaging(
      "totalUsageConvM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalUsageConvM3"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalUsageConvMmbtu",
    title: "TOTAL USAGE EQV MMBTU",
    dataIndex: "totalUsageConvMmbtu",
    isNumber:true,
    width: 200,
    sorter: (a, b) =>
      a?.totalUsageConvMmbtu?.localeCompare(b?.totalUsageConvMmbtu),
    ...getColumnSearchPropsPaging(
      "totalUsageConvMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalUsageConvMmbtu"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "basicBillingIdr",
    title: "BASIC BILL IDR",
    isNumber:true,
    dataIndex: "basicBillingIdr",
    width: 180,
    sorter: (a, b) => a?.basicBillingIdr?.localeCompare(b?.basicBillingIdr),
    ...getColumnSearchPropsPaging(
      "basicBillingIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["basicBillingIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "basicBillingUsd",
    title: "BASIC BILL USD",
    isNumber:true,
    dataIndex: "basicBillingUsd",
    width: 180,
    sorter: (a, b) => a?.basicBillingUsd?.localeCompare(b?.basicBillingUsd),
    ...getColumnSearchPropsPaging(
      "basicBillingUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["basicBillingUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalBasicBillEqvIdr",
    title: "TOTAL BASIC BILL EQV IDR",
    dataIndex: "totalBasicBillEqvIdr",
    isNumber:true,
    width: 220,
    sorter: (a, b) =>
      a?.totalBasicBillEqvIdr?.localeCompare(b?.totalBasicBillEqvIdr),
    ...getColumnSearchPropsPaging(
      "totalBasicBillEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalBasicBillEqvIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalBasicBillEqvUsd",
    title: "TOTAL BASIC BILL EQV USD",
    dataIndex: "totalBasicBillEqvUsd",
    isNumber:true,
    width: 220,
    sorter: (a, b) =>
      a?.totalBasicBillEqvUsd?.localeCompare(b?.totalBasicBillEqvUsd),
    ...getColumnSearchPropsPaging(
      "totalBasicBillEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalBasicBillEqvUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "otherBillIdr",
    title: "OTHER BILL IDR",
    dataIndex: "otherBillIdr",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.otherBillIdr?.localeCompare(b?.otherBillIdr),
    ...getColumnSearchPropsPaging(
      "otherBillIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["otherBillIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "otherBillUsd",
    title: "OTHER BILL USD",
    dataIndex: "otherBillUsd",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.otherBillUsd?.localeCompare(b?.otherBillUsd),
    ...getColumnSearchPropsPaging(
      "otherBillUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["otherBillUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalOtherBillEqvIdr",
    title: "TOTAL OTHER BILL EQV IDR",
    dataIndex: "totalOtherBillEqvIdr",
    isNumber:true,
    width: 220,
    sorter: (a, b) =>
      a?.totalOtherBillEqvIdr?.localeCompare(b?.totalOtherBillEqvIdr),
    ...getColumnSearchPropsPaging(
      "totalOtherBillEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalOtherBillEqvIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalOtherBillEqvUsd",
    title: "TOTAL OTHER BILL EQV USD",
    dataIndex: "totalOtherBillEqvUsd",
    isNumber:true,
    width: 220,
    sorter: (a, b) =>
      a?.totalOtherBillEqvUsd?.localeCompare(b?.totalOtherBillEqvUsd),
    ...getColumnSearchPropsPaging(
      "totalOtherBillEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalOtherBillEqvUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "discountAmountIdr",
    title: "DISCOUNT IDR",
    dataIndex: "discountAmountIdr",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.discountAmountIdr?.localeCompare(b?.discountAmountIdr),
    ...getColumnSearchPropsPaging(
      "discountAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["discountAmountIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "discountAmountUsd",
    title: "DISCOUNT USD",
    dataIndex: "discountAmountUsd",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.discountAmountUsd?.localeCompare(b?.discountAmountUsd),
    ...getColumnSearchPropsPaging(
      "discountAmountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["discountAmountUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "taxBasicIdr",
    title: "TAX BASIS IDR",
    dataIndex: "taxBasicIdr",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.taxBasicIdr?.localeCompare(b?.taxBasicIdr),
    ...getColumnSearchPropsPaging(
      "taxBasicIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["taxBasicIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "taxBasicUsd",
    title: "TAX BASIS USD",
    dataIndex: "taxBasicUsd",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.taxBasicUsd?.localeCompare(b?.taxBasicUsd),
    ...getColumnSearchPropsPaging(
      "taxBasicUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["taxBasicUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "taxBasicEqvIdr",
    title: "TAX BASIS EQV IDR",
    dataIndex: "taxBasicEqvIdr",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.taxBasicEqvIdr?.localeCompare(b?.taxBasicEqvIdr),
    ...getColumnSearchPropsPaging(
      "taxBasicEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["taxBasicEqvIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "vatIdr",
    title: "VAT IDR",
    dataIndex: "vatIdr",
    isNumber:true,
    width: 150,
    sorter: (a, b) => a?.vatIdr?.localeCompare(b?.vatIdr),
    ...getColumnSearchPropsPaging(
      "vatIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["vatIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "vatUsd",
    title: "VAT USD",
    dataIndex: "vatUsd",
    isNumber:true,
    width: 150,
    sorter: (a, b) => a?.vatUsd?.localeCompare(b?.vatUsd),
    ...getColumnSearchPropsPaging(
      "vatUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["vatUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "vatEqvIdr",
    title: "VAT EQV IDR",
    dataIndex: "vatEqvIdr",
    isNumber:true,
    width: 150,
    sorter: (a, b) => a?.vatEqvIdr?.localeCompare(b?.vatEqvIdr),
    ...getColumnSearchPropsPaging(
      "vatEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["vatEqvIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "withHoldingTax",
    title: "WITHHOLDING TAX",
    dataIndex: "withHoldingTax",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.withHoldingTax?.localeCompare(b?.withHoldingTax),
    ...getColumnSearchPropsPaging(
      "withHoldingTax",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["withHoldingTax"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "prevWithHoldingTax",
    title: "PREV WITHHOLDING TAX",
    dataIndex: "prevWithHoldingTax",
    isNumber:true,
    width: 200,
    sorter: (a, b) => a?.prevWithHoldingTax?.localeCompare(b?.prevWithHoldingTax),
    ...getColumnSearchPropsPaging(
      "prevWithHoldingTax",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["prevWithHoldingTax"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "taxRateType",
    title: "TAX RATE TYPE",
    dataIndex: "taxRateType",
    isNumber:true,
    width: 150,
    sorter: (a, b) => a?.taxRateType?.localeCompare(b?.taxRateType),
    ...getColumnSearchPropsPaging(
      "taxRateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["taxRateType"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "taxRate",
    title: "TAX RATE",
    dataIndex: "taxRate",
    isNumber:true,
    width: 120,
    sorter: (a, b) => a?.taxRate?.localeCompare(b?.taxRate),
    ...getColumnSearchPropsPaging(
      "taxRate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["taxRate"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "taxRateDate",
    title: "TAX RATE DATE",
    dataIndex: "taxRateDate",
    isNumber:true,
    width: 150,
    sorter: (a, b) => a?.taxRateDate?.localeCompare(b?.taxRateDate),
    ...getColumnSearchPropsPaging(
      "taxRateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      searchedColumn === "taxRateDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.datePeriod) : ""
          }
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.datePeriod)
      ),
    onFilter: (value, record) =>
      record["taxRateDate"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalAmountIdr",
    title: "TOTAL AMOUNT IDR",
    dataIndex: "totalAmountIdr",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.totalAmountIdr?.localeCompare(b?.totalAmountIdr),
    ...getColumnSearchPropsPaging(
      "totalAmountIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalAmountIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalAmountUsd",
    title: "TOTAL AMOUNT USD",
    dataIndex: "totalAmountUsd",
    isNumber:true,
    width: 180,
    sorter: (a, b) => a?.totalAmountUsd?.localeCompare(b?.totalAmountUsd),
    ...getColumnSearchPropsPaging(
      "totalAmountUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalAmountUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalAmountEqvIdr",
    title: "TOTAL AMOUNT EQV IDR",
    dataIndex: "totalAmountEqvIdr",
    isNumber:true,
    width: 200,
    sorter: (a, b) => a?.totalAmountEqvIdr?.localeCompare(b?.totalAmountEqvIdr),
    ...getColumnSearchPropsPaging(
      "totalAmountEqvIdr",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalAmountEqvIdr"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "totalAmountEqvUsd",
    title: "TOTAL AMOUNT EQV USD",
    dataIndex: "totalAmountEqvUsd",
    isNumber:true,
    width: 200,
    sorter: (a, b) => a?.totalAmountEqvUsd?.localeCompare(b?.totalAmountEqvUsd),
    ...getColumnSearchPropsPaging(
      "totalAmountEqvUsd",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["totalAmountEqvUsd"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "rateType",
    title: "RATE TYPE",
    dataIndex: "rateType",
    isNumber:true,
    width: 120,
    sorter: (a, b) => a?.rateType?.localeCompare(b?.rateType),
    ...getColumnSearchPropsPaging(
      "rateType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["rateType"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "rate",
    title: "RATE",
    dataIndex: "rate",
    isNumber:true,
    width: 120,
    sorter: (a, b) => a?.rate?.localeCompare(b?.rate),
    ...getColumnSearchPropsPaging(
      "rate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["rate"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    dataIndex: "rateDate",
    isClassification:true,
    width: 120,
    sorter: (a, b) => a?.rateDate?.localeCompare(b?.rateDate),
    ...getColumnSearchPropsPaging(
      "rateDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      searchedColumn === "rateDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.datePeriod) : ""
          }
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.datePeriod)
      ),
    onFilter: (value, record) =>
      record["rateDate"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "transactionDate",
    title: "TRANSACTION DATE",
    dataIndex: "transactionDate",
    isClassification:true,
    width: 150,
    sorter: (a, b) => a?.transactionDate?.localeCompare(b?.transactionDate),
    ...getColumnSearchPropsPaging(
      "transactionDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      searchedColumn === "transactionDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.datePeriod) : ""
          }
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.datePeriod)
      ),
    onFilter: (value, record) =>
      record["transactionDate"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "accountDate",
    title: "ACCOUNTING DATE",
    dataIndex: "accountDate",
    isClassification:true,
    width: 150,
    sorter: (a, b) => a?.accountDate?.localeCompare(b?.accountDate),
    ...getColumnSearchPropsPaging(
      "accountDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      searchedColumn === "accountDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.datePeriod) : ""
          }
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.datePeriod)
      ),
    onFilter: (value, record) =>
      record["accountDate"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "invoiceDate",
    title: "INVOICE DATE",
    dataIndex: "invoiceDate",
    isClassification:true,
    width: 120,
    sorter: (a, b) => a?.invoiceDate?.localeCompare(b?.invoiceDate),
    ...getColumnSearchPropsPaging(
      "invoiceDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      searchedColumn === "invoiceDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.datePeriod) : ""
          }
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.datePeriod)
      ),
    onFilter: (value, record) =>
      record["invoiceDate"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "dueDate",
    title: "DUE DATE",
    dataIndex: "dueDate",
    isClassification:true,
    width: 120,
    sorter: (a, b) => a?.dueDate?.localeCompare(b?.dueDate),
    ...getColumnSearchPropsPaging(
      "dueDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod"
    ),
    render: (text) =>
      searchedColumn === "dueDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.datePeriod) : ""
          }
        />
      ) : text === null ? (
        ""
      ) : (
        moment(text).format(dateFormatting.datePeriod)
      ),
    onFilter: (value, record) =>
      record["dueDate"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "remark",
    sorter: (a, b) => a?.remark?.localeCompare(b?.remark),
    title: "REMARK",
    dataIndex: "remark",
    isClassification:true,
    width: 200,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsPaging(
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      searchedColumn === "remark" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
    onFilter: (value, record) =>
      record["remark"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
];