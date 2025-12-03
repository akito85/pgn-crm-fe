import moment from "moment";
import StatusComponent from "../../../../../components/StatusComponent";
import { dateFormatting, hasValue, toTitleCase } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../utils/sorterFunction";

export const columnAllocation = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleInactive = () => {},
) => {
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      dataIndex: "no",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ALLOCATION CODE",
      dataIndex: "allocationCode",
      sorter: (a, b) => sorterFunction("allocationCode", a, b),
      ...getColumnSearchPropsPaging(
        "allocationCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ALLOCATION NUMBER",
      dataIndex: "allocationNumber",
      sorter: (a, b) => sorterFunction("allocationNumber", a, b),
      ...getColumnSearchPropsPaging(
        "allocationNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ITEM",
      dataIndex: "billingItem",
      sorter: (a, b) => sorterFunction("billingItem", a, b),
      ...getColumnSearchPropsPaging(
        "billingItem",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ALLOCATION DATE",
      dataIndex: "allocationDate",
      sorter: (a, b) => sorterFunction("allocationDate", a, b, "date"),
      ...getColumnSearchPropsPaging(
        "allocationDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "INVOICE NO",
      dataIndex: "invoiceNumber",
      sorter: (a, b) => sorterFunction("invoiceNumber", a, b),
      ...getColumnSearchPropsPaging(
        "invoiceNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "INVOICE CURRENCY",
      dataIndex: "invoiceCurrency",
      sorter: (a, b) => sorterFunction("invoiceCurrency", a, b),
      align: "center",
      ...getColumnSearchPropsPaging(
        "invoiceCurrency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "BILLING CYCLE",
      dataIndex: "billingCycle",
      sorter: (a, b) => sorterFunction("billingCycle", a, b),
      align: "center",
      ...getColumnSearchPropsPaging(
        "billingCycle",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
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
        "datePeriod",
      ),
      render: (billingPeriod) =>
        hasValue(billingPeriod) &&
        moment(billingPeriod).format(dateFormatting.datePeriod),
    },
    {
      title: "BILLING ITEM AMOUNT",
      dataIndex: "billingItemAmount",
      sorter: (a, b) => sorterFunction("billingItemAmount", a, b, "number"),
      align: "right",
      ...getColumnSearchPropsPaging(
        "billingItemAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        text.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      sorter: (a, b) => sorterFunction("type", a, b),
      ...getColumnSearchPropsPaging(
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ALLOCATION AMOUNT",
      dataIndex: "allocationAmount",
      sorter: (a, b) => sorterFunction("allocationAmount", a, b, "number"),
      align: "right",
      inputType: "number",
      onInput: (e) => (e.target.value = e.target.value.replace(/\D/g, "")),
      ...getColumnSearchPropsPaging(
        "allocationAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        text.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: "BILLING ITEM BALANCE",
      dataIndex: "billingItemBalance",
      sorter: (a, b) => sorterFunction("billingItemBalance", a, b, "number"),
      align: "right",
      ...getColumnSearchPropsPaging(
        "billingItemBalance",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        text.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: "ALLOCATION STATUS",
      dataIndex: "allocationStatus",
      sorter: (a, b) => sorterFunction("allocationStatus", a, b),
      ...getColumnSearchPropsPaging(
        "allocationStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      // width: 120,
      render: (index) =>
        // (
        //     <div className={" flex justify-center"}>
        //         <StatusComponent colour={index}>{toTitleCase(index)}</StatusComponent>
        //     </div>
        // ),
        {
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
    {
      title: "CONVERTED CURRENCY",
      dataIndex: "convertedCurrency",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsPaging(
        "convertedCurrency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "EQUIVALENT AMOUNT",
      dataIndex: "equivalentAmount",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "equivalentAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        text.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    // {
    //     title: 'CREATED DATE',
    //     dataIndex: 'createdDate',
    //     // sorter:true,
    //     sorter: (a, b) => sorterFunction('createdDate', a, b, 'date'),
    //     ...getColumnSearchPropsPaging(
    //         'createdDate',
    //         searchInput,
    //         searchedColumn,
    //         searchText,
    //         handleSearch,
    //         false,
    //         "datetime"
    //     )

    // },
    // {
    //     title: 'CREATED BY',
    //     dataIndex: 'createdBy',
    //     sorter: true,
    //     ...getColumnSearchPropsPaging(
    //         'createdBy',
    //         searchInput,
    //         searchedColumn,
    //         searchText,
    //         handleSearch
    //     )

    // },
  ];

  return columns;
};
