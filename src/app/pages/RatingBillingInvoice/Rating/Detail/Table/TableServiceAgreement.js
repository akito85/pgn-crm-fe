import Highlighter from "react-highlight-words";
import moment from "moment";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../../assets/Icon/index";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";

export const columnsServiceAgreement = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDetail = () => {},
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "saType",
    title: "SA TYPE",
    dataIndex: "saType",
    sorter: true,
    align: "center",
    width: 120,
    ...getColumnSearchPropsPaging(
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "saServiceType",
    title: "SA CLASS",
    dataIndex: "saServiceType",
    sorter: true,
    align: "center",
    width: 120,
    ...getColumnSearchPropsPaging(
      "saServiceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "saNumber",
    title: "SA NUMBER",
    dataIndex: "saNumber",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsPaging(
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "saReferenceNumber",
    title: "SA REFERENCE",
    dataIndex: "saReferenceNumber",
    sorter: true,
    width: 180,
    ...getColumnSearchPropsPaging(
      "saReferenceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "saDate",
    title: "SA DATE",
    sorter: true,
    align: "center",
    dataIndex: "saDate",
    width: 120,
    ...getColumnSearchPropsPaging(
      "saDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      searchedColumn === "saDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
              : "",
          ]}
          autoEscape
          textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
        />
      ) : text === null ? (
        "-"
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    key: "pjbgType",
    title: "PJBG TYPE",
    dataIndex: "pjbgType",
    sorter: true,
    align: "center",
    width: 120,
    ...getColumnSearchPropsPaging(
      "pjbgType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "startDate",
    title: "START DATE",
    sorter: true,
    align: "center",
    dataIndex: "startDate",
    width: 120,
    ...getColumnSearchPropsPaging(
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      searchedColumn === "startDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
              : "",
          ]}
          autoEscape
          textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
        />
      ) : text === null ? (
        "-"
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    key: "endDate",
    title: "END DATE",
    sorter: true,
    align: "center",
    dataIndex: "endDate",
    width: 120,
    ...getColumnSearchPropsPaging(
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      searchedColumn === "endDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
              : "",
          ]}
          autoEscape
          textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
        />
      ) : text === null ? (
        "-"
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    key: "billingCycle",
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    sorter: true,
    align: "center",
    width: 120,
    ...getColumnSearchPropsPaging(
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "termOfPayment",
    title: "TERM OF PAYMENT",
    dataIndex: "termOfPayment",
    sorter: true,
    align: "center",
    width: 150,
    ...getColumnSearchPropsPaging(
      "termOfPayment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "paymentChannel",
    title: "PAYMENT CHANNEL",
    dataIndex: "paymentChannel",
    sorter: true,
    align: "center",
    width: 150,
    ...getColumnSearchPropsPaging(
      "paymentChannel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "distributionMedia",
    title: "MEDIA DISTRIBUTION",
    dataIndex: "distributionMedia",
    sorter: true,
    width: 180,
    ...getColumnSearchPropsPaging(
      "distributionMedia",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "action",
    title: "ACTION",
    width: 100,
    align: "center",
    render: (id, record) => {
      return (
        <div className="flex w-full justify-center gap-6">
          <Tooltip title="Detail">
            <div className="pt-1 cursor-pointer">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => handleDetail(record)}
              />
            </div>
          </Tooltip>
        </div>
      );
    },
  },
];
