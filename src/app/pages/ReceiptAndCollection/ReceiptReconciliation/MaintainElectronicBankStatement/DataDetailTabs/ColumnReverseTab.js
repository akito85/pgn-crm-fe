import { Checkbox, Popover, Space, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index";
import moment from "moment";
import { MoreOutlined } from "@ant-design/icons";

export const columnsReverseTab = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleApprovalHistory = () => {}
) => [
  {
    key: "no",
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "receiptCode",
    title: "RECEIPT CODE",
    dataIndex: "receiptCode",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "receiptCode" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    align: "left",
    sorter: true,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsPaging(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) =>
      searchedColumn === "sor" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    ellipsis: { showTitle: false },
    render: (text) =>
      searchedColumn === "costCenter" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
  },
  {
    key: "customerName",
    title: "CUSTOMER",
    dataIndex: "customerName",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    ellipsis: { showTitle: false },
    render: (text) =>
      searchedColumn === "customerName" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
  },
  {
    key: "accountNumber",
    title: "ACCOUNT",
    dataIndex: "accountNumber",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    ellipsis: { showTitle: false },
    render: (text) =>
      searchedColumn === "accountNumber" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
  },
  {
    key: "receiptNumber",
    title: "RECEIPT NUMBER",
    dataIndex: "receiptNumber",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    ellipsis: { showTitle: false },
    render: (text) =>
      searchedColumn === "receiptNumber" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
  },
  {
    key: "receiptDate",
    title: "RECEIPT DATE",
    dataIndex: "receiptDate",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      searchedColumn === "receiptDate" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.dateCapital) : ""
          }
        />
      ) : (
        moment(text).format(dateFormatting.dateCapital) || ""
      ),
  },
  {
    key: "amount",
    title: "RECEIPT AMOUNT",
    dataIndex: "amount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    ellipsis: { showTitle: false },
    render: (text) =>
      searchedColumn === "amount" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
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
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    align: "center",
    fixed: "right",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsPaging(
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (approvalStatus) => {
      let text;
      switch (approvalStatus) {
        case "WAITING APPROVAL":
          text = "Waiting Approval";
          break;
        case "APPROVED":
          text = "Approved";
          break;
        default:
          text = approvalStatus
            ? approvalStatus.charAt(0).toUpperCase() +
              approvalStatus.slice(1).toLowerCase()
            : approvalStatus;
          break;
      }

      if (searchedColumn === "statusApproval") {
        return (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      }

      return text ? (
        <div className="flex justify-center">
          <StatusComponent colour={text}>{text}</StatusComponent>
        </div>
      ) : (
        text
      );
    },
  },
];

