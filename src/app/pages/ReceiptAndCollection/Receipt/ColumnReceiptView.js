import { NumericFormat } from "react-number-format";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";

export const columnsReceipt = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  handleModalApprovalHistory = (id) => { },
  handleDeleteReceipt = (record) => { }
) => [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      fixed: "left",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "RECEIPT CODE",
      dataIndex: "receiptCode",
      key: "receiptCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "receiptCode", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('receiptCode', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "RECEIPT NUMBER",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "receiptNumber", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('receiptNumber', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "RECEIPT TYPE",
      dataIndex: "receiptType",
      key: "receiptType",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "receiptType", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('receiptType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNT",
      dataIndex: "account",
      key: "account",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "account", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('account', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "RECEIPT METHOD",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "paymentMethod", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('paymentMethod', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "IS RECONCILED",
      dataIndex: "isReconciled",
      key: "isReconciled",
      sorter: true,
      width: 160,
      isClassification: true,
      ...getColumnSearchPropsUseFilteredValue(search, "isReconciled", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (index) => {
        let text;
        switch (index) {
          case true: text = "TRUE"; break;
          case false: text = "FALSE"; break;
          default: text = index ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase() : index; break;
        }
        return renderColumn('isReconciled', searchedColumn, searchText, text, false, 'input', search);
      },
    },
    {
      title: "RECEIPT DATE",
      dataIndex: "receiptDate",
      key: "receiptDate",
      sorter: true,
      isClassification: true,
      width: 220,
      ...getColumnSearchPropsUseFilteredValue(search, "receiptDate", searchInput, searchedColumn, searchText, handleSearch, true, "datetime"),
      render: (text) => renderDateColumn('receiptDate', hasValue(search['receiptDate']), searchText, text, 'datetime', search)
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      key: "currency",
      isClassification: true,
      sorter: true,
      width: 150,
      ...getColumnSearchPropsUseFilteredValue(search, "currency", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('currency', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "amount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('amount', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "RATE",
      dataIndex: "rateAmount",
      key: "rateAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "rateAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('rateAmount', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "RATE TYPE",
      dataIndex: "rateType",
      key: "rateType",
      sorter: true,
      width: 130,
      isClassification: true,
      ...getColumnSearchPropsUseFilteredValue(search, "rateType", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('rateType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      isClassification: true,
      key: "rateDate",
      sorter: true,
      width: 150,
      ...getColumnSearchPropsUseFilteredValue(search, "rateDate", searchInput, searchedColumn, searchText, handleSearch, true, "date"),
      render: (text) => renderDateColumn('rateDate', hasValue(search['rateDate']), searchText, text, 'date', search)
    },
    {
      title: "CONVERTED CURRENCY",
      dataIndex: "convertedCurrency",
      key: "convertedCurrency",
      isClassification: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "convertedCurrency", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('convertedCurrency', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "EQUIVALENT AMOUNT",
      dataIndex: "equivalentAmount",
      key: "equivalentAmount",
      sorter: true,
      isNumber: true,
      ...getColumnSearchPropsUseFilteredValue(search, "equivalentAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('equivalentAmount', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "APPLIED AMOUNT",
      dataIndex: "appliedAmount",
      key: "appliedAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "appliedAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (appliedAmount) => (
        <NumericFormat displayType="text" value={appliedAmount} className="text-right" thousandSeparator={true} decimalScale={2} fixedDecimalScale />
      ),
    },
    {
      title: "APPLIED EQUIVALENT AMOUNT",
      dataIndex: "equivalentAppliedAmount",
      key: "equivalentAppliedAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "equivalentAppliedAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (val) => (
        <NumericFormat displayType="text" value={val} className="text-right" thousandSeparator={true} decimalScale={2} fixedDecimalScale />
      ),
    },
    {
      title: "UNAPPLIED AMOUNT",
      dataIndex: "unAppliedAmount",
      key: "unAppliedAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "unAppliedAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (val) => (
        <NumericFormat displayType="text" value={val} className="text-right" thousandSeparator={true} decimalScale={2} fixedDecimalScale />
      ),
    },
    {
      title: "UNAPPLIED EQUIVALENT AMOUNT",
      dataIndex: "equivalentUnAppliedAmount",
      key: "equivalentUnAppliedAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "equivalentUnAppliedAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (val) => (
        <NumericFormat displayType="text" value={val} className="text-right" thousandSeparator={true} decimalScale={2} fixedDecimalScale />
      ),
    },
    {
      title: "UNIDENTIFIED AMOUNT",
      dataIndex: "unidentifiedAmount",
      key: "unidentifiedAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "unidentifiedAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (val) => (
        <NumericFormat displayType="text" value={val} className="text-right" thousandSeparator={true} decimalScale={2} fixedDecimalScale />
      ),
    },
    {
      title: "HOLD AMOUNT",
      dataIndex: "holdAmount",
      key: "holdAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "holdAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (val) => (
        <NumericFormat displayType="text" value={val} className="text-right" thousandSeparator={true} decimalScale={2} fixedDecimalScale />
      ),
    },
    {
      title: "REFUND AMOUNT",
      dataIndex: "refundAmount",
      key: "refundAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "refundAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (val) => (
        <NumericFormat displayType="text" value={val} className="text-right" thousandSeparator={true} decimalScale={2} fixedDecimalScale />
      ),
    },
    {
      title: "TRANSFER AMOUNT",
      dataIndex: "transferAmount",
      key: "transferAmount",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "transferAmount", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (val) => (
        <NumericFormat displayType="text" value={val} className="text-right" thousandSeparator={true} decimalScale={2} fixedDecimalScale />
      ),
    },
    {
      title: "CHANNEL",
      dataIndex: "receiptChannel",
      key: "receiptChannel",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "receiptChannel", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('receiptChannel', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "PAYMENT TYPE",
      dataIndex: "paymentType",
      key: "paymentType",
      sorter: true,
      width: 180,
      isClassification: true,
      ...getColumnSearchPropsUseFilteredValue(search, "paymentType", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('paymentType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "BANK",
      dataIndex: "bank",
      key: "bank",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "bank", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('bank', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "PARTNER",
      dataIndex: "paymentGateway",
      key: "paymentGateway",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "paymentGateway", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('paymentGateway', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "COLLECTING AGENT",
      dataIndex: "collectingAgent",
      key: "collectingAgent",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "collectingAgent", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('collectingAgent', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "DELIVERY CHANNEL",
      dataIndex: "deliveryChannel",
      key: "deliveryChannel",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "deliveryChannel", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('deliveryChannel', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "SOR",
      dataIndex: "sor",
      key: "sor",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "sor", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('sor', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      key: "costCenter",
      sorter: true,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(search, "costCenter", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('costCenter', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "CUSTOMER",
      dataIndex: "customer",
      key: "customer",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "customer", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('customer', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      key: "accountSegment",
      isClassification: true,
      width: 200,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "accountSegment", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('accountSegment', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroup",
      key: "accountGroup",
      isClassification: true,
      sorter: true,
      width: 180,
      ...getColumnSearchPropsUseFilteredValue(search, "accountGroup", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('accountGroup', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      key: "accountType",
      isClassification: true,
      sorter: true,
      width: 180,
      ...getColumnSearchPropsUseFilteredValue(search, "accountType", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('accountType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "PAYMENT PERIOD",
      dataIndex: "paymentPeriod",
      key: "paymentPeriod",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "paymentPeriod", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('paymentPeriod', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "REFERENCE",
      dataIndex: "refNumber",
      key: "refNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(search, "refNumber", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('refNumber', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNTING DATE",
      dataIndex: "accountingDate",
      key: "accountingDate",
      sorter: true,
      isClassification: true,
      ...getColumnSearchPropsUseFilteredValue(search, "accountingDate", searchInput, searchedColumn, searchText, handleSearch, true, "date"),
      render: (text) => renderDateColumn('accountingDate', hasValue(search['accountingDate']), searchText, text, 'date', search)
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      key: "source",
      sorter: true,
      width: 180,
      isClassification: true,
      ...getColumnSearchPropsUseFilteredValue(search, "source", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('source', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "CREATED DATE",
      dataIndex: "createdDate",
      key: "createdDate",
      isClassification: true,
      sorter: true,
      width: 220,
      ...getColumnSearchPropsUseFilteredValue(search, "createdDate", searchInput, searchedColumn, searchText, handleSearch, true, "datetime"),
      render: (text) => renderDateColumn('createdDate', hasValue(search['createdDate']), searchText, text, 'datetime', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "remark",
      align: "left",
      sorter: true,
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsUseFilteredValue(search, "description", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: 120,
      fixed: "right",
      ...getColumnSearchPropsUseFilteredValue(search, "status", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      key: "statusApproval",
      sorter: true,
      width: 190,
      fixed: "right",
      ...getColumnSearchPropsUseFilteredValue(search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch, true),
      render: (text) => renderColumn('statusApproval', searchedColumn, searchText, text, false, 'status', search)
    }
  ];
