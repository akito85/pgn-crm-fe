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
  handleDetail = () => {}
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "SA TYPE",
    dataIndex: "saType",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SA CLASS",
    dataIndex: "saServiceType",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "saServiceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SA NUMBER",
    dataIndex: "saNumber",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SA REFERENCE",
    dataIndex: "saReferenceNumber",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "saReferenceNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SA DATE",
    sorter: true,
    align: "center",
    dataIndex: "saDate",
    ...getColumnSearchPropsPaging(
      "saDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
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
    title: "PJBG TYPE",
    dataIndex: "pjbgType",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "pjbgType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "START DATE",
    sorter: true,
    align: "center",
    dataIndex: "startDate",
    ...getColumnSearchPropsPaging(
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
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
    title: "END DATE",
    sorter: true,
    align: "center",
    dataIndex: "endDate",
    ...getColumnSearchPropsPaging(
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "endDate"
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
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "TERM OF PAYMENT",
    dataIndex: "termOfPayment",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "termOfPayment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PAYMENT CHANNEL",
    dataIndex: "paymentChannel",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "paymentChannel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "MEDIA DISTRIBUTION",
    dataIndex: "distributionMedia",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "distributionMedia",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACTION",
    fixed: "right",
    width: 150,
    align: "center",
    render: (id, record) => {
      return (
        <div className="flex w-full justify-center gap-6">
          <Tooltip title="Detail">
            <div className="pt-1">
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
