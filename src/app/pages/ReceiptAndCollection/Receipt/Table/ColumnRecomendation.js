import moment from "moment";
import StatusComponent from "../../../../../components/StatusComponent";
import { dateFormatting, hasValue, toTitleCase } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../utils/sorterFunction";
import { InputNumber } from "antd";

export const columnRecommendation = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  handleInactive = () => { },
  handleEditAmount,
  isReadOnly = false
) => {
  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      dataIndex: "no",
      key: "no",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ITEM",
      width: 120,
      dataIndex: "billingItem",
      key: "billingItem",
      // sorter:true,
      sorter: (a, b) => sorterFunction("billingItem", a, b),
      ...getColumnSearchPropsPaging(
        "billingItem",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },

    {
      title: "INVOICE NO",
      width: 150,
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      // sorter:true,
      sorter: (a, b) => sorterFunction("invoiceNumber", a, b),
      ...getColumnSearchPropsPaging(
        "invoiceNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "INVOICE CURRENCY",
      width: 120,
      dataIndex: "invoiceCurrency",
      key: "invoiceCurrency",
      // sorter:true,
      sorter: (a, b) => sorterFunction("invoiceCurrency", a, b),
      align: "center",
      ...getColumnSearchPropsPaging(
        "invoiceCurrency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "BILLING PERIOD",
      width: 130,
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      // sorter:true,
      sorter: (a, b) => sorterFunction("billingPeriod", a, b, "date"),
      align: "center",
      ...getColumnSearchPropsPaging(
        "billingPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "datePeriod"
      ),
      render: (billingPeriod) =>
        hasValue(billingPeriod) &&
        moment(billingPeriod).format(dateFormatting.datePeriod),
    },
    {
      title: "BILLING ITEM AMOUNT",
      width: 150,
      dataIndex: "billingItemAmount",
      key: "billingItemAmount",
      // sorter:true,
      sorter: (a, b) => sorterFunction("billingItemAmount", a, b, "number"),
      align: "right",
      ...getColumnSearchPropsPaging(
        "billingItemAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        text.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: "TYPE",
      width: 100,
      dataIndex: "type",
      key: "type",
      // sorter:true,
      sorter: (a, b) => sorterFunction("type", a, b),
      ...getColumnSearchPropsPaging(
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "BILLING ITEM BALANCE",
      width: 160,
      dataIndex: "billingItemBalance",
      key: "billingItemBalance",
      // sorter:true,
      sorter: (a, b) => sorterFunction("billingItemBalance", a, b, "number"),
      align: "right",
      ...getColumnSearchPropsPaging(
        "billingItemBalance",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        text.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: "CONVERTED CURRENCY",
      width: 150,
      dataIndex: "convertedCurrency",
      key: "convertedCurrency",
      // sorter:true,
      sorter: (a, b) => sorterFunction("convertedCurrency", a, b),
      align: "center",
      ...getColumnSearchPropsPaging(
        "convertedCurrency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "EQUIVALENT AMOUNT",
      width: 160,
      dataIndex: "equivalentAmount",
      key: "equivalentAmount",
      // sorter:true,
      sorter: (a, b) => sorterFunction("equivalentAmount", a, b, "number"),
      align: "right",
      ...getColumnSearchPropsPaging(
        "equivalentAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        text.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: "BILLING METHOD",
      width: 140,
      dataIndex: "billingMethod",
      key: "billingMethod",
      sorter: (a, b) => sorterFunction("billingMethod", a, b),
      ...getColumnSearchPropsPaging(
        "billingMethod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ALLOCATION AMOUNT",
      width: 150,
      dataIndex: "allocationAmount",
      key: "allocationAmount",
      sorter: (a, b) => sorterFunction("allocationAmount", a, b, "number"),
      align: "right",
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "allocationAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text, record) => (
        isReadOnly ? (
          text.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        ) : (
          <InputNumber
            value={text}
            onChange={(val) => handleEditAmount(record.key, val)}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            style={{ width: "100%" }}
          />
        )
      ),
    },
    {
      title: "ALLOCATION STATUS",
      width: 140,
      dataIndex: "allocationStatus",
      key: "allocationStatus",
      // sorter:true,
      sorter: (a, b) => sorterFunction("allocationStatus", a, b),
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "allocationStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (index) => {
        return index ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={index}>
              {toTitleCase(index)}
            </StatusComponent>
          </div>
        ) : (
          index
        );
      },
    },
  ];

  return columns;
};
