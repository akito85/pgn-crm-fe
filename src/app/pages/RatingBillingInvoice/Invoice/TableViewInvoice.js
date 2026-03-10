import {
  hasValue,
  renderColumn,
  renderDateColumn,
  toTitleCase,
} from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";

export const columnsInvoice = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => {
  return [
    {
      key: "no",
      title: "NO",
      isClassification: true,
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      key: "invoiceNumber",
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      isClassification: true,
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "invoiceNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      key: "invoiceName",
      title: "INVOICE NAME",
      dataIndex: "invoiceName",
      isClassification: true,
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "invoiceName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "invoiceName",
          hasValue(search["invoiceName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "title",
      title: "TITLE",
      dataIndex: "title",
      isClassification: true,
      width: 180,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "title",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "title",
          hasValue(search["title"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billHeaderId",
      title: "BILL HEADER ID",
      dataIndex: "billHeaderId",
      isClassification: true,
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billHeaderId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "billHeaderId",
          hasValue(search["billHeaderId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "templateName",
      title: "TEMPLATE",
      dataIndex: "templateName",
      isClassification: true,
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "templateName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "templateName",
          hasValue(search["templateName"]),
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
      width: 150,
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
      sorter: true,
      isClassification: true,
      width: 180,
      dataIndex: "billingPeriod",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "billingPeriod",
          hasValue(search["billingPeriod"]),
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
      width: 180,
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      key: "customerNumber",
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      isClassification: true,
      width: 180,
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
      width: 250,
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
      width: 200,
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
      width: 250,
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
      key: "accountSegment",
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      isClassification: true,
      width: 150,
      sorter: true,
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
      key: "accountGroupType",
      title: "ACCOUNT GROUP TYPE",
      width: 180,
      dataIndex: "accountGroupType",
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountGroupType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      key: "accountType",
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      isClassification: true,
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "accountType",
          hasValue(search["accountType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "accountStatus",
      title: "ACCOUNT STATUS",
      dataIndex: "accountStatus",
      isClassification: true,
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "accountStatus",
          hasValue(search["accountStatus"]),
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
      isClassification: true,
      width: 150,
      sorter: true,
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
      key: "product",
      title: "PRODUCT",
      dataIndex: "product",
      isClassification: true,
      width: 250,
      sorter: true,
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
      key: "timeUnit",
      title: "TIME UNIT",
      dataIndex: "timeUnit",
      isClassification: true,
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "timeUnit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      key: "sor",
      title: "SOR",
      width: 250,
      dataIndex: "sor",
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
      dataIndex: "costCenter",
      isClassification: true,
      width: 250,
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
      key: "meterReadingCode",
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      isClassification: true,
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "meterReadingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      key: "billingAddress",
      title: "BILLING ADDRESS",
      dataIndex: "billingAddress",
      isClassification: true,
      width: 250,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingAddress",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "billingAddress",
          hasValue(search["billingAddress"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "classificationType",
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      isClassification: true,
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "classificationType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "classificationType",
          hasValue(search["classificationType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "customerManagement",
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      isClassification: true,
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerManagement",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "customerManagement",
          hasValue(search["customerManagement"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "corporateCustomer",
      title: "CORPORATE CUSTOMER",
      dataIndex: "corporateCustomer",
      isClassification: true,
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "corporateCustomer",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "corporateCustomer",
          hasValue(search["corporateCustomer"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "entityId",
      title: "ENTITY ID",
      dataIndex: "entityId",
      isClassification: true,
      width: 120,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "entityId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "entityId",
          hasValue(search["entityId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "ccId",
      title: "CC ID",
      dataIndex: "ccId",
      isClassification: true,
      width: 120,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "ccId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "ccId",
          hasValue(search["ccId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "taxBasicEqvIdr",
      title: "TAX BASIS EQV IDR",
      sorter: true,
      isNumber: true,
      width: 200,
      dataIndex: "taxBasicEqvIdr",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxBasicEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      key: "vatEqvIdr",
      title: "VAT EQV IDR",
      sorter: true,
      isNumber: true,
      width: 200,
      dataIndex: "vatEqvIdr",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "vatEqvIdr",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
    },
    {
      key: "withHoldingTax",
      title: "WITHHOLDING TAX",
      sorter: true,
      isNumber: true,
      width: 200,
      dataIndex: "withHoldingTax",
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
    },
    {
      key: "taxRateType",
      title: "TAX RATE TYPE",
      dataIndex: "taxRateType",
      isClassification: true,
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxRateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      sorter: true,
      isNumber: true,
      width: 100,
      dataIndex: "taxRate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
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
      isClassification: true,
      width: 150,
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
    },
    {
      key: "totalAmountIdr",
      title: "TOTAL AMOUNT IDR",
      sorter: true,
      isNumber: true,
      width: 200,
      dataIndex: "totalAmountIdr",
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
      sorter: true,
      isNumber: true,
      width: 200,
      dataIndex: "totalAmountUsd",
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
      key: "termsOfPayment",
      title: "TERMS OF PAYMENT",
      dataIndex: "termsOfPayment",
      width: 180,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "termsOfPayment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "termsOfPayment",
          hasValue(search["termsOfPayment"]),
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
      width: 200,
      dataIndex: "transactionDate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "transactionDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "transactionDate",
          hasValue(search["transactionDate"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "invoiceDate",
      title: "INVOICE DATE",
      sorter: true,
      isClassification: true,
      width: 180,
      dataIndex: "invoiceDate",
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
      isClassification: true,
      width: 180,
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
    },
    {
      key: "planDate",
      title: "PLAN DATE",
      sorter: true,
      isClassification: true,
      width: 180,
      dataIndex: "planDate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "planDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "planDate",
          hasValue(search["planDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "successDate",
      title: "SUCCESS DATE",
      sorter: true,
      isClassification: true,
      width: 180,
      dataIndex: "successDate",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "successDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "successDate",
          hasValue(search["successDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "rateType",
      title: "RATE TYPE",
      sorter: true,
      isClassification: true,
      width: 150,
      dataIndex: "rateType",
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
      key: "rate",
      title: "RATE",
      sorter: true,
      isNumber: true,
      width: 180,
      dataIndex: "rate",
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
      width: 180,
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
      key: "totalAmountEqvIdr",
      title: "TOTAL AMOUNT EQV IDR",
      sorter: true,
      isNumber: true,
      width: 200,
      dataIndex: "totalAmountEqvIdr",
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
      sorter: true,
      isNumber: true,
      width: 200,
      dataIndex: "totalAmountEqvUsd",
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
      key: "remark",
      sorter: true,
      title: "REMARK",
      dataIndex: "remark",
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(search, "remark"),
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
      key: "remarkPaymentGw",
      sorter: true,
      title: "REMARK PAYMENT GW",
      dataIndex: "remarkPaymentGw",
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(search, "remarkPaymentGw"),
      render: (text) =>
        renderColumn(
          "remarkPaymentGw",
          hasValue(search["remarkPaymentGw"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "stampingMeteraiStatus",
      title: "STAMPING METERIAI STATUS",
      dataIndex: "stampingMeteraiStatus",
      width: 220,
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "stampingMeteraiStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => <StatusComponent colour={text} size="small">{text}</StatusComponent>,
    },
    {
      key: "einvoiceStatus",
      title: "E-INVOICE STATUS",
      dataIndex: "einvoiceStatus",
      width: 180,
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "einvoiceStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => <StatusComponent colour={text} size="small">{text}</StatusComponent>,
    },
    {
      key: "signStatus",
      title: "SIGN STATUS",
      dataIndex: "signStatus",
      width: 150,
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "signStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => <StatusComponent colour={text} size="small">{text}</StatusComponent>,
    },
    {
      key: "deliveryStatus",
      title: "DELIVERY STATUS",
      dataIndex: "deliveryStatus",
      width: 180,
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "deliveryStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => <StatusComponent colour={text} size="small">{text}</StatusComponent>,
    },
    {
      key: "statusPaymentGw",
      title: "STATUS PAYMENT GW",
      dataIndex: "statusPaymentGw",
      width: 200,
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusPaymentGw",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => <StatusComponent colour={text}>{text}</StatusComponent>,
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      width: 100,
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => (
        <StatusComponent
          colour={
            text?.toLowerCase() === "inprogress"
              ? "in progress"
              : text?.toLowerCase()
          }
        >
          {toTitleCase(
            text?.toLowerCase() === "inprogress"
              ? "in progress"
              : text?.toLowerCase()
          )}
        </StatusComponent>
      ),
    },
  ];
};
