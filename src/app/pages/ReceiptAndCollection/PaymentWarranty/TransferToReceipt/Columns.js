import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";

export const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { }
) => [
    {
      key: "no",
      title: "NO",
      width: 60,
      isClassification: true,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },

    {
      key: "paymentWarrantyNo",
      title: "PAYMENT WARRANTY NO",
      dataIndex: "paymentWarrantyNo",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "paymentWarrantyNo",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["paymentWarrantyNo"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "typePaymentWarranty",
      title: "TYPE PAYMENT WARRANTY",
      dataIndex: "typePaymentWarranty",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "typePaymentWarranty",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["typePaymentWarranty"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "mutationDocumentationNo",
      title: "MUTATION DOCUMENTATION NO",
      dataIndex: "mutationDocumentationNo",
      width: 150,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "mutationDocumentationNo",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["mutationDocumentationNo"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "mutationDate",
      title: "MUTATION DATE",
      dataIndex: "mutationDate",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "mutationDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["mutationDate"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (text) =>
        searchedColumn === "mutationDate" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MMM-DD").format(
                  dateFormatting.dateCapital
                )
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.dateCapital) : ""
            }
          />
        ) : text === null ? (
          ""
        ) : (
          moment(text).format(dateFormatting.dateCapital)
        ),
    },

    {
      key: "fromCustomer",
      title: "FROM CUSTOMER",
      dataIndex: "fromCustomer",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "fromCustomer",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["fromCustomer"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "fromReceipt",
      title: "FROM RECEIPT",
      dataIndex: "fromReceipt",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "fromReceipt",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["fromReceipt"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "toCustomer",
      title: "TO CUSTOMER",
      dataIndex: "toCustomer",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "toCustomer",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["toCustomer"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "toReceipt",
      title: "TO RECEIPT",
      dataIndex: "toReceipt",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "toReceipt",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["toReceipt"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "currency",
      title: "CURRENCY",
      dataIndex: "currency",
      width: 100,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["currency"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "amount",
      title: "AMOUNT",
      dataIndex: "amount",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["amount"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },

    {
      key: "rateDate",
      title: "RATE DATE",
      dataIndex: "rateDate",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "rateDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["rateDate"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (text) =>
        searchedColumn === "rateDate" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MMM-DD").format(
                  dateFormatting.dateCapital
                )
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.dateCapital) : ""
            }
          />
        ) : text === null ? (
          ""
        ) : (
          moment(text).format(dateFormatting.dateCapital)
        ),
    },

    {
      key: "equivalent",
      title: "EQUIVALENT",
      dataIndex: "equivalent",
      width: 120,
      sorter: (a, b) => a?.equivalent - b?.equivalent,
      ...getColumnSearchPropsPaging(
        "equivalent",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["equivalent"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      key: "remark",
      title: "REMARK",
      dataIndex: "remark",
      width: 150,
      sorter: (a, b) => a?.remark?.localeCompare(b?.remark),
      ...getColumnSearchPropsPaging(
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["remark"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      key: "approvalStatus",
      title: "APPROVAL STATUS",
      dataIndex: "approvalStatus",
      width: 120,
      sorter: (a, b) => a?.approvalStatus?.localeCompare(b?.approvalStatus),
      ...getColumnSearchPropsPaging(
        "approvalStatus",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["approvalStatus"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (status) => {
        const displayStatus = status || "DRAFT";
        const statusLabel = displayStatus.replace(/_/g, " ");

        return (
          <div className="flex justify-center">
            <StatusComponent colour={displayStatus.toLowerCase()}>
              {statusLabel}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      sorter: (a, b) => a?.calculationCode?.localeCompare(b?.calculationCode),
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      onFilter: (value, record) =>
        record["status"]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (status) => {
        const displayStatus = status || "DRAFT";
        const statusLabel = displayStatus.replace(/_/g, " ");

        return (
          <div className="flex justify-center">
            <StatusComponent colour={displayStatus.toLowerCase()}>
              {statusLabel}
            </StatusComponent>
          </div>
        );
      },
    },
  ];
