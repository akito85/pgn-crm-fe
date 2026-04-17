import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import { currencyFormatting } from "../../../../../utils/formatCurrency";
import CardContainer from "../../../../../components/CardContainer";
import StatusComponent from "../../../../../components/StatusComponent";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import TableRBI from "../../../../../components/TableRBI";
import { getTransactionMappingInformation } from "../../../../../redux/slices/rating_billing_invoice/adjustmentBilling";

const formatDateValue = (value, format = dateFormatting.date) => {
  if (!value) {
    return "-";
  }

  const parsedDate = moment(value);
  return parsedDate.isValid() ? parsedDate.format(format) : value;
};

const formatAmount = (value, currencyType) => {
  if (value === null || typeof value === "undefined" || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return currencyFormatting(value, currencyType);
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue)
    ? value
    : currencyFormatting(parsedValue, currencyType);
};

const formatNumber = (value, minimumFractionDigits = 0) => {
  if (value === null || typeof value === "undefined" || value === "") {
    return "-";
  }

  const parsedValue = Number(value);
  if (Number.isNaN(parsedValue)) {
    return value;
  }

  return parsedValue.toLocaleString("en-US", {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  });
};

const normalizeText = (value) => {
  if (value === null || typeof value === "undefined" || value === "") {
    return "-";
  }

  return `${value}`;
};

const getValueByKeys = (record = {}, keys = []) => {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== null && typeof value !== "undefined" && value !== "") {
      return value;
    }
  }

  return undefined;
};

const buildInvoiceInfoItems = (data = {}) => [
  { label: "Invoice Number", value: normalizeText(data?.invoiceNumber) },
  { label: "Billing Code", value: normalizeText(data?.billingCode) },
  { label: "Invoice Date", value: formatDateValue(data?.invoiceDate) },
  { label: "Term of Payment", value: normalizeText(data?.termOfPayment) },
  { label: "Billing Cycle", value: normalizeText(data?.billingCycle) },
  { label: "Billing Period", value: normalizeText(data?.billingPeriod) },
  { label: "Amount", value: formatAmount(data?.amount) },
  { label: "Total Amount", value: formatAmount(data?.totalAmount) },
  { label: "Total Amount EQV", value: formatAmount(data?.totalAmountEqv) },
  { label: "Currency", value: normalizeText(data?.currency) },
  { label: "VAT Basis", value: formatAmount(data?.vatBasis) },
  { label: "VAT Basis EQV", value: formatAmount(data?.vatBasisEqv) },
  { label: "Rate", value: formatNumber(data?.rate, 2) },
  { label: "Rate Type", value: normalizeText(data?.rateType) },
  { label: "Rate Date", value: formatDateValue(data?.rateDate) },
  {
    label: "Status",
    value: data?.status ? (
      <StatusComponent colour={data?.status} type="status" size="small">
        {data?.status}
      </StatusComponent>
    ) : (
      "-"
    ),
  },
];

const transactionMappingColumns = [
  {
    key: "no",
    title: "NO",
    width: 60,
    render: (_, __, index) => index + 1,
  },
  {
    key: "lineNumber",
    title: "LINE NUMBER",
    dataIndex: "lineNumber",
    width: 120,
    sorter: (a, b) =>
      Number(getValueByKeys(a, ["lineNumber", "lineNo"]) || 0) -
      Number(getValueByKeys(b, ["lineNumber", "lineNo"]) || 0),
    render: (_, record) =>
      formatNumber(getValueByKeys(record, ["lineNumber", "lineNo"])),
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    width: 140,
    sorter: (a, b) =>
      normalizeText(getValueByKeys(a, ["source"])).localeCompare(
        normalizeText(getValueByKeys(b, ["source"])),
      ),
    render: (_, record) => normalizeText(getValueByKeys(record, ["source"])),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 110,
    sorter: (a, b) =>
      normalizeText(getValueByKeys(a, ["type"])).localeCompare(
        normalizeText(getValueByKeys(b, ["type"])),
      ),
    render: (_, record) => normalizeText(getValueByKeys(record, ["type"])),
  },
  {
    key: "groupId",
    title: "GROUP ID",
    dataIndex: "groupId",
    width: 120,
    render: (_, record) =>
      normalizeText(getValueByKeys(record, ["groupId", "groupID"])),
  },
  {
    key: "referenceGroupId",
    title: "REFERENCE GROUP ID",
    dataIndex: "referenceGroupId",
    width: 180,
    render: (_, record) =>
      normalizeText(
        getValueByKeys(record, ["referenceGroupId", "referenceGroupID"]),
      ),
  },
  {
    key: "itemCode",
    title: "ITEM CODE",
    dataIndex: "itemCode",
    width: 140,
    render: (_, record) => normalizeText(getValueByKeys(record, ["itemCode"])),
  },
  {
    key: "item",
    title: "ITEM",
    dataIndex: "item",
    width: 180,
    render: (_, record) =>
      normalizeText(getValueByKeys(record, ["item", "billingItem"])),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    width: 120,
    render: (_, record) =>
      formatNumber(getValueByKeys(record, ["quantity"]), 2),
  },
  {
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    width: 100,
    render: (_, record) => normalizeText(getValueByKeys(record, ["uom"])),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    width: 110,
    render: (_, record) => normalizeText(getValueByKeys(record, ["currency"])),
  },
  {
    key: "priceCode",
    title: "PRICE CODE",
    dataIndex: "priceCode",
    width: 130,
    render: (_, record) => normalizeText(getValueByKeys(record, ["priceCode"])),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    width: 120,
    render: (_, record) => formatNumber(getValueByKeys(record, ["price"]), 2),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    width: 120,
    render: (_, record) => formatNumber(getValueByKeys(record, ["amount"]), 2),
  },
  {
    key: "discountAmount",
    title: "DISCOUNT AMOUNT",
    dataIndex: "discountAmount",
    width: 170,
    render: (_, record) =>
      formatNumber(getValueByKeys(record, ["discountAmount"]), 2),
  },
  {
    key: "totalAmount",
    title: "TOTAL AMOUNT",
    dataIndex: "totalAmount",
    width: 150,
    render: (_, record) =>
      formatNumber(getValueByKeys(record, ["totalAmount"]), 2),
  },
  {
    key: "vatBasis",
    title: "VAT BASIS",
    dataIndex: "vatBasis",
    width: 130,
    render: (_, record) =>
      formatNumber(getValueByKeys(record, ["vatBasis"]), 2),
  },
  {
    key: "vatBasisEqv",
    title: "VAT BASIS EQV",
    dataIndex: "vatBasisEqv",
    width: 150,
    render: (_, record) =>
      formatNumber(getValueByKeys(record, ["vatBasisEqv"]), 2),
  },
  {
    key: "vatRate",
    title: "VAT RATE",
    dataIndex: "vatRate",
    width: 120,
    render: (_, record) => formatNumber(getValueByKeys(record, ["vatRate"]), 2),
  },
  {
    key: "vatCode",
    title: "VAT CODE",
    dataIndex: "vatCode",
    width: 120,
    render: (_, record) => normalizeText(getValueByKeys(record, ["vatCode"])),
  },
  {
    key: "vat",
    title: "VAT",
    dataIndex: "vat",
    width: 120,
    render: (_, record) => formatNumber(getValueByKeys(record, ["vat"]), 2),
  },
  {
    key: "vatEqv",
    title: "VAT EQV",
    dataIndex: "vatEqv",
    width: 120,
    render: (_, record) => formatNumber(getValueByKeys(record, ["vatEqv"]), 2),
  },
  {
    key: "withholdingTaxCode",
    title: "WITH HOLDING TAX CODE",
    dataIndex: "withholdingTaxCode",
    width: 190,
    render: (_, record) =>
      normalizeText(
        getValueByKeys(record, ["withholdingTaxCode", "withHoldingTaxCode"]),
      ),
  },
  {
    key: "withholdingTaxRate",
    title: "WITH HOLDING TAX RATE",
    dataIndex: "withholdingTaxRate",
    width: 190,
    render: (_, record) =>
      formatNumber(
        getValueByKeys(record, ["withholdingTaxRate", "withHoldingTaxRate"]),
        2,
      ),
  },
  {
    key: "withholdingTax",
    title: "WITH HOLDING TAX",
    dataIndex: "withholdingTax",
    width: 170,
    render: (_, record) =>
      formatNumber(
        getValueByKeys(record, ["withholdingTax", "withHoldingTax"]),
        2,
      ),
  },
  {
    key: "vatExchRateType",
    title: "VAT EXCH RATE TYPE",
    dataIndex: "vatExchRateType",
    width: 190,
    render: (_, record) =>
      normalizeText(getValueByKeys(record, ["vatExchRateType"])),
  },
  {
    key: "vatExchRateDate",
    title: "VAT EXCH RATE DATE",
    dataIndex: "vatExchRateDate",
    width: 190,
    render: (_, record) =>
      formatDateValue(getValueByKeys(record, ["vatExchRateDate"])),
  },
  {
    key: "vatExchRate",
    title: "VAT EXCH RATE",
    dataIndex: "vatExchRate",
    width: 160,
    render: (_, record) =>
      formatNumber(getValueByKeys(record, ["vatExchRate"]), 2),
  },
  {
    key: "convertedCurrency",
    title: "CONVERTED CURRENCY",
    dataIndex: "convertedCurrency",
    width: 180,
    render: (_, record) =>
      normalizeText(getValueByKeys(record, ["convertedCurrency"])),
  },
  {
    key: "totalAmountEqv",
    title: "TOTAL AMOUNT EQV",
    dataIndex: "totalAmountEqv",
    width: 170,
    render: (_, record) =>
      formatNumber(getValueByKeys(record, ["totalAmountEqv"]), 2),
  },
  {
    key: "rateType",
    title: "RATE TYPE",
    dataIndex: "rateType",
    width: 130,
    render: (_, record) => normalizeText(getValueByKeys(record, ["rateType"])),
  },
  {
    key: "rateDate",
    title: "RATE DATE",
    dataIndex: "rateDate",
    width: 130,
    render: (_, record) =>
      formatDateValue(getValueByKeys(record, ["rateDate"])),
  },
  {
    key: "rate",
    title: "RATE",
    dataIndex: "rate",
    width: 120,
    render: (_, record) => formatNumber(getValueByKeys(record, ["rate"]), 2),
  },
  {
    key: "printSwitch",
    title: "PRINT SWITCH",
    dataIndex: "printSwitch",
    width: 130,
    render: (_, record) =>
      normalizeText(getValueByKeys(record, ["printSwitch"])),
  },
  {
    key: "applyChargeSwitch",
    title: "APPLY CHARGE SWITCH",
    dataIndex: "applyChargeSwitch",
    width: 190,
    render: (_, record) =>
      normalizeText(getValueByKeys(record, ["applyChargeSwitch"])),
  },
  {
    key: "balance",
    title: "BALANCE",
    dataIndex: "balance",
    width: 130,
    render: (_, record) => formatNumber(getValueByKeys(record, ["balance"]), 2),
  },
  {
    key: "paymentStatus",
    title: "PAYMENT STATUS",
    dataIndex: "paymentStatus",
    width: 150,
    render: (_, record) => {
      const paymentStatus = getValueByKeys(record, ["paymentStatus"]);

      if (!paymentStatus) {
        return "-";
      }

      return (
        <StatusComponent colour={paymentStatus} type="status" size="small">
          {paymentStatus}
        </StatusComponent>
      );
    },
  },
  {
    key: "transferedFrom",
    title: "TRANSFERED FROM",
    dataIndex: "transferedFrom",
    width: 170,
    render: (_, record) =>
      normalizeText(
        getValueByKeys(record, ["transferedFrom", "transferredFrom"]),
      ),
  },
  {
    key: "transferedTo",
    title: "TRANSFERED TO",
    dataIndex: "transferedTo",
    width: 170,
    render: (_, record) =>
      normalizeText(getValueByKeys(record, ["transferedTo", "transferredTo"])),
  },
];

const InvoiceSectionForm = ({ data, type, useInformationLayout = false }) => {
  const dispatch = useDispatch();
  const { dataTransactionMappingInformation } = useSelector(
    (state) => state.adjustmentBilling,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [fixedColumns, setFixedColumns] = useState({
    left: ["no", "lineNumber", "source"],
    right: ["paymentStatus"],
  });

  const billingCode = data?.billingCode;
  const selectedInvoiceNumber = data?.invoiceNumber;

  useEffect(() => {
    if (selectedInvoiceNumber && billingCode) {
      dispatch(getTransactionMappingInformation(billingCode));
    }
  }, [billingCode, dispatch, selectedInvoiceNumber]);

  const invoiceInfoItems = useMemo(() => buildInvoiceInfoItems(data), [data]);

  const transactionMappingRows = useMemo(() => {
    return (
      Array.isArray(dataTransactionMappingInformation)
        ? dataTransactionMappingInformation
        : []
    ).map((item, index) => ({
      key:
        item?.id ||
        item?.detailId ||
        item?.transactionMappingId ||
        `${billingCode || "transaction"}-${index + 1}`,
      ...item,
    }));
  }, [billingCode, dataTransactionMappingInformation]);

  const filteredTransactionMappingRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return transactionMappingRows;
    }

    return transactionMappingRows.filter((row) =>
      Object.values(row).some((value) => {
        if (value === null || typeof value === "undefined") {
          return false;
        }

        return `${value}`.toLowerCase().includes(normalizedSearch);
      }),
    );
  }, [searchValue, transactionMappingRows]);

  const pagedTransactionMappingRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactionMappingRows.slice(
      startIndex,
      startIndex + pageSize,
    );
  }, [currentPage, filteredTransactionMappingRows, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (_, value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearchValue(event?.target?.value || "");
    setCurrentPage(1);
  };

  if (!useInformationLayout) {
    return (
      <div className="w-full grid grid-cols-5 gap-4">
        {invoiceInfoItems.map((item) => (
          <DetailText key={item.label} label={item.label}>
            {item.value}
          </DetailText>
        ))}
      </div>
    );
  }

  return (
    <CardContainer header={"INFORMATION"} type={"tabs"}>
      <div className="flex flex-col gap-4">
        <CollapsibleContainer header={"INVOICE INFORMATION"} border>
          <div className="grid grid-cols-5 gap-x-6 gap-y-4 pt-3 pb-2">
            {invoiceInfoItems.map((item) => (
              <DetailText key={item.label} label={item.label}>
                {item.value}
              </DetailText>
            ))}
          </div>
        </CollapsibleContainer>

        <CollapsibleContainer header={"TRANSACTION MAPPING INFORMATION"} border>
          <div className="pt-3 pb-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-6">
              <DetailText label={"Calculation Code"}>
                {normalizeText(
                  data?.calculationCode ||
                    data?.calculationCodeId ||
                    getValueByKeys(transactionMappingRows?.[0], [
                      "calculationCode",
                    ]),
                )}
              </DetailText>
              <DetailText label={"Billing Code"}>
                {normalizeText(data?.billingCode)}
              </DetailText>
            </div>

            <TableRBI
              idTable="adjustment-billing-transaction-mapping"
              dataSource={pagedTransactionMappingRows}
              columns={transactionMappingColumns}
              totalData={filteredTransactionMappingRows.length}
              current={currentPage}
              pageSize={pageSize}
              onChange={handlePageChange}
              onSizeChanger={handlePageSizeChange}
              onSearch={handleSearch}
              tableScrolled={{ x: 6500, y: 320 }}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              showAdvanceSearch={true}
              showSearchBar={true}
            />
          </div>
        </CollapsibleContainer>
      </div>
    </CardContainer>
  );
};

export default InvoiceSectionForm;
