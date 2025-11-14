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
  handleSearch = () => { }
) => [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CALCULATION CODE",
      dataIndex: "calculationCode",
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
      title: "RATING CODE",
      dataIndex: "ratingCode",
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
      title: "BILLING CODE",
      dataIndex: "billingCode",
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
      title: "SA NUMBER",
      dataIndex: "saNumber",
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
      title: "BILLING CYCLE",
      dataIndex: "billingCycle",
      sorter: (a, b) => a?.billingCycle?.localeCompare(b?.billingCycle),
      align: "center",
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
      title: "BILLING PERIOD",
      align: "center",
      dataIndex: "billingPeriod",
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
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
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
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
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
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: (a, b) => a?.acccountNumber?.localeCompare(b?.acccountNumber),
      ...getColumnSearchPropsPaging(
        "acccountNumber",
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
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      sorter: (a, b) => a?.acccountName?.localeCompare(b?.acccountName),
      ...getColumnSearchPropsPaging(
        "acccountName",
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
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      align:'center',
      sorter: (a, b) => a?.acccountGroupType?.localeCompare(b?.acccountGroupType),
      ...getColumnSearchPropsPaging(
        "acccountGroupType",
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
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      align:'center',
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
      title: "SOR",
      dataIndex: "sor",
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
      title: "COST CENTER",
      dataIndex: "costCenter",
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
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      align: 'center',
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
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
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
      title: "PRODUCT",
      dataIndex: "product",
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
      title: "CONTRACT PERIOD UNIT",
      dataIndex: "timeUnitContract",
      align: 'center',
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
      title: "UOM",
      dataIndex: "uom",
      align: 'center',
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
      title: "MIN CONTRACT",
      dataIndex: "minContract",
      align: "right",
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
      title: "MAX CONTRACT",
      dataIndex: "maxContract",
      align: "right",
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
      title: "TOTAL USAGE",
      dataIndex: "totalUsage",
      align: "right",
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
      title: "TOTAL USAGE EQV M3",
      dataIndex: "totalUsageConvM3",
      align: "right",
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
      title: "TOTAL USAGE EQV MMBTU",
      dataIndex: "totalUsageConvMmbtu",
      align: "right",
      sorter: (a, b) => a?.totalUsageConvMmbtu?.localeCompare(b?.totalUsageConvMmbtu),
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
      title: "BASIC BILL IDR",
      dataIndex: "basicBillingIdr",
      align: "right",
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
      title: "BASIC BILL USD",
      dataIndex: "basicBillingUsd",
      // sorter: true,
      align: "right",
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
      title: "TOTAL BASIC BILL EQV IDR",
      dataIndex: "totalBasicBillEqvIdr",
      // sorter: true,
      align: "right",
      sorter: (a, b) => a?.totalBasicBillEqvIdr?.localeCompare(b?.totalBasicBillEqvIdr),
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
      title: "TOTAL BASIC BILL EQV USD",
      dataIndex: "totalBasicBillEqvUsd",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.totalBasicBillEqvUsd?.localeCompare(b?.totalBasicBillEqvUsd),
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
      title: "OTHER BILL IDR",
      dataIndex: "otherBillIdr",
      sorter: true,
      align: "right",
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
      title: "OTHER BILL USD",
      dataIndex: "otherBillUsd",
      sorter: true,
      align: "right",
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
      title: "TOTAL OTHER BILL EQV IDR",
      dataIndex: "totalOtherBillEqvIdr",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.totalOtherBillEqvIdr?.localeCompare(b?.totalOtherBillEqvIdr),
      ...getColumnSearchPropsPaging(
        "totalOtherBillEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["totalOtherBillEqvIdr"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "TOTAL OTHER BILL EQV USD",
      dataIndex: "totalOtherBillEqvUsd",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.totalOtherBillEqvUsd?.localeCompare(b?.totalOtherBillEqvUsd),
      ...getColumnSearchPropsPaging(
        "totalOtherBillEqvUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["totalOtherBillEqvUsd"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "DISCOUNT IDR",
      dataIndex: "discountAmountIdr",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.discountAmountIdr?.localeCompare(b?.discountAmountIdr),
      ...getColumnSearchPropsPaging(
        "discountAmountIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["discountAmountIdr"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "DISCOUNT USD",
      dataIndex: "discountAmountUsd",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.discountAmountUsd?.localeCompare(b?.discountAmountUsd),
      ...getColumnSearchPropsPaging(
        "discountAmountUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["discountAmountUsd"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "TAX BASIS IDR",
      dataIndex: "taxBasicIdr",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.taxBasicIdr?.localeCompare(b?.taxBasicIdr),
      ...getColumnSearchPropsPaging(
        "taxBasicIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["taxBasicIdr"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "TAX BASIS USD",
      dataIndex: "taxBasicUsd",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.taxBasicUsd?.localeCompare(b?.taxBasicUsd),
      ...getColumnSearchPropsPaging(
        "taxBasicUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["taxBasicUsd"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "TAX BASIS EQV IDR",
      dataIndex: "taxBasicEqvIdr",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.taxBasicEqvIdr?.localeCompare(b?.taxBasicEqvIdr),
      ...getColumnSearchPropsPaging(
        "taxBasicEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["taxBasicEqvIdr"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "VAT IDR",
      dataIndex: "vatIdr",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.vatIdr?.localeCompare(b?.vatIdr),
      ...getColumnSearchPropsPaging(
        "vatIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["vatIdr"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "VAT USD",
      dataIndex: "vatUsd",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.vatUsd?.localeCompare(b?.vatUsd),
      ...getColumnSearchPropsPaging(
        "vatUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["vatUsd"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "VAT EQV IDR",
      dataIndex: "vatEqvIdr",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.vatEqvIdr?.localeCompare(b?.vatEqvIdr),
      ...getColumnSearchPropsPaging(
        "vatEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["vatEqvIdr"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "WITHHOLDING TAX",
      dataIndex: "withHoldingTax",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.withHoldingTax?.localeCompare(b?.withHoldingTax),
      ...getColumnSearchPropsPaging(
        "withHoldingTax",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["withHoldingTax"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "PREV WITHHOLDING TAX",
      dataIndex: "prevWithHoldingTax",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.prevWithHoldingTax?.localeCompare(b?.prevWithHoldingTax),
      ...getColumnSearchPropsPaging(
        "prevWithHoldingTax",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["prevWithHoldingTax"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "TAX RATE TYPE",
      dataIndex: "taxRateType",
      sorter: true,
      align: "center",
      sorter: (a, b) => a?.taxRateType?.localeCompare(b?.taxRateType),
      ...getColumnSearchPropsPaging(
        "taxRateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["taxRateType"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "TAX RATE",
      dataIndex: "taxRate",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.taxRate?.localeCompare(b?.taxRate),
      ...getColumnSearchPropsPaging(
        "taxRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["taxRate"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "TAX RATE DATE",
      dataIndex: "taxRateDate",
      align: "center",
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
      title: "TOTAL AMOUNT IDR",
      dataIndex: "totalAmountIdr",
      sorter: (a, b) => a?.totalAmountIdr?.localeCompare(b?.totalAmountIdr),
      align: "right",
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
      title: "TOTAL AMOUNT USD",
      dataIndex: "totalAmountUsd",
      sorter: (a, b) => a?.totalAmountUsd?.localeCompare(b?.totalAmountUsd),
      align: "right",
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
      title: "TOTAL AMOUNT EQV IDR",
      dataIndex: "totalAmountEqvIdr",
      sorter: (a, b) => a?.totalAmountEqvIdr?.localeCompare(b?.totalAmountEqvIdr),
      align: "right",
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
      title: "TOTAL AMOUNT EQV USD",
      dataIndex: "totalAmountEqvUsd",
      sorter: true,
      align: "right",
      sorter: (a, b) => a?.totalAmountEqvUsd?.localeCompare(b?.totalAmountEqvUsd),
      ...getColumnSearchPropsPaging(
        "totalAmountEqvUsd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["totalAmountEqvUsd"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "RATE TYPE",
      dataIndex: "rateType",
      sorter: true,
      align: "center",
      sorter: (a, b) => a?.rateType?.localeCompare(b?.rateType),
      ...getColumnSearchPropsPaging(
        "rateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["rateType"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "RATE",
      align: "right",
      dataIndex: "rate",
      sorter: true,
      // align: "center",
      sorter: (a, b) => a?.rate?.localeCompare(b?.rate),
      ...getColumnSearchPropsPaging(
        "rate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["rate"]?.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      align: "center",
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
      title: "TRANSACTION DATE",
      dataIndex: "transactionDate",
      align: "center",
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
      title: "ACCOUNTING DATE",
      dataIndex: "accountDate",
      align: "center",
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
      title: "INVOICE DATE",
      dataIndex: "invoiceDate",
      align: "center",
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
      title: "DUE DATE",
      dataIndex: "dueDate",
      align: "center",
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

    // {
    //   title: "CALCULATED USAGE",
    //   dataIndex: "calculatedUsage",
    //   sorter: (a, b) => a?.calculatedUsage?.localeCompare(b?.calculatedUsage),
    //   align: "right",
    //   ...getColumnSearchPropsPaging(
    //     "calculatedUsage",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["calculatedUsage"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    // },
    // {
    //   title: "CONVERTED UOM",
    //   dataIndex: "convertedUom",
    //   sorter: (a, b) => a?.convertedUom?.localeCompare(b?.convertedUom),
    //   align: "center",
    //   ...getColumnSearchPropsPaging(
    //     "convertedUom",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["convertedUom"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    // },
    // {
    //   title: "CONVERTED CALCULATED USAGE",
    //   dataIndex: "convertedCalculatedUsage",
    //   sorter: (a, b) =>
    //     a?.convertedCalculatedUsage?.localeCompare(b?.convertedCalculatedUsage),
    //   align: "right",
    //   ...getColumnSearchPropsPaging(
    //     "convertedCalculatedUsage",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   onFilter: (value, record) =>
    //     record["convertedCalculatedUsage"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    // },
    // {
    //   title: "STATUS APPROVAL",
    //   dataIndex: "statusApproval",
    //   sorter: (a, b) => a?.statusApproval?.localeCompare(b?.statusApproval),
    //   ...getColumnSearchPropsPaging(
    //     "statusApproval",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch
    //   ),
    //   render: (index) => {
    //     let text;
    //     switch (index) {
    //       case "WAITING APPROVAL":
    //         text = "Waiting Approval";
    //         break;
    //       case "NEED REVIEW":
    //         text = "Need Review";
    //         break;
    //       default:
    //         text = index
    //           ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
    //           : index;
    //         break;
    //     }
    //     return text ? (
    //       <div className={"flex justify-center"}>
    //         <StatusComponent colour={text}>{text}</StatusComponent>
    //       </div>
    //     ) : (
    //       text
    //     );
    //   },
    //   onFilter: (value, record) =>
    //     record["statusApproval"]
    //       ?.toString()
    //       .toLowerCase()
    //       .includes(value.toLowerCase()),
    // },
    {
      sorter: (a, b) => a?.remark?.localeCompare(b?.remark),
      title: "REMARK",
      dataIndex: "remark",
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
