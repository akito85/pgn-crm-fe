import Highlighter from "react-highlight-words";
import moment from "moment";
import { Tooltip } from "antd";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import {
  getColumnSearchPropsPaging,
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../../utils/getColumnSearchProps";

export const columnsUsage = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "PERIOD",
    sorter: true,
    align: "center",
    dataIndex: "billingPeriod",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datePeriod",
    ),
    render: (text) =>
      renderDateColumn(
        "billingPeriod",
        hasValue(search["billingPeriod"]),
        searchText,
        text,
        "datePeriod",
        search,
      ),
    // searchedColumn === "period" ? (
    //   <Highlighter
    //     highlightStyle={{
    //       backgroundColor: "#ffc069",
    //       padding: 0,
    //     }}
    //     searchWords={[
    //       searchText
    //         ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
    //         : "",
    //     ]}
    //     autoEscape
    //     textToHighlight={
    //       text ? moment(text).format(dateFormatting.datePeriod) : ""
    //     }
    //   />
    // ) : text === null ? (
    //   "-"
    // ) : (
    //   moment(text).format(dateFormatting.datePeriod)
    // ),
  },
  {
    title: "ASSET SERIAL NUMBER",
    dataIndex: "assetSerialNumber",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "assetSerialNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
    render: (text) =>
      renderColumn(
        "quantity",
        hasValue(search["quantity"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "ASSET TYPE",
    dataIndex: "assetType",
    sorter: true,
    align: "center",
    // ...getColumnSearchPropsUseFilteredValue(
    //   "assetType",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "assetType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
    render: (text) =>
      renderColumn(
        "assetType",
        hasValue(search["assetType"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "READING DATE",
    sorter: true,
    align: "center",
    dataIndex: "measDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "measDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime",
    ),
    render: (text) =>
      renderDateColumn(
        "measDate",
        hasValue(search["measDate"]),
        searchText,
        text,
        "datetime",
        search,
      ),
    // ...getColumnSearchPropsUseFilteredValue(
    //   "measDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "date"
    // ),
    // render: (text) =>
    //   searchedColumn === "measDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     "-"
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    title: "DATE",
    sorter: true,
    align: "center",
    dataIndex: "fdate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fdate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "fdate",
        hasValue(search["fdate"]),
        searchText,
        text,
        "date",
        search,
      ),
    // render: (text) =>
    //   searchedColumn === "fdate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     "-"
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    title: "HOUR",
    dataIndex: "fhour",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fhour",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "hour",
    ),
    render: (creationDate) =>
      renderColumn(
        "fhour",
        hasValue(search["fhour"]),
        searchText,
        creationDate,
        false,
        "input",
        search,
      ),
  },
  {
    title: "STREAM ID",
    dataIndex: "streamId",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsUseFilteredValue(
    //   "streamId",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "streamId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
    render: (text) =>
      renderColumn(
        "streamId",
        hasValue(search["streamId"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "TEMPERATURE",
    dataIndex: "temperature",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsUseFilteredValue(
    //   "temperature",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "temperature",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
    render: (text) =>
      renderColumn(
        "temperature",
        hasValue(search["temperature"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "PRESSURE",
    dataIndex: "pressure",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsUseFilteredValue(
    //   "pressure",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "pressure",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
    render: (text) =>
      renderColumn(
        "pressure",
        hasValue(search["pressure"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "CORRECTION FACTOR",
    dataIndex: "correctionFactor",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsUseFilteredValue(
    //   "correctionFactor",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "correctionFactor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
    render: (text) =>
      renderColumn(
        "correctionFactor",
        hasValue(search["correctionFactor"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "CALORIE",
    dataIndex: "calorie",
    sorter: true,
    align: "right",
    // ...getColumnSearchPropsUseFilteredValue(
    //   "calorie",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch
    // ),
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "calorie",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      // "decimal,4"
    ),
    render: (text) =>
      renderColumn(
        "calorie",
        hasValue(search["calorie"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "BEGIN STAND",
    dataIndex: "beginStand",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "beginStand",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      // "decimal,4"
    ),
    render: (text) =>
      renderColumn(
        "beginStand",
        hasValue(search["beginStand"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "END STAND",
    dataIndex: "endStand",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endStand",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      // "decimal,4"
    ),
    render: (text) =>
      renderColumn(
        "endStand",
        hasValue(search["endStand"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "VOLUME 27",
    dataIndex: "volMeasured27",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "volMeasured27",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      // "decimal,4"
    ),
    render: (text) =>
      renderColumn(
        "volMeasured27",
        hasValue(search["volMeasured27"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "VOLUME 60",
    dataIndex: "volMeasured60",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "volMeasured60",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      // "decimal,4"
    ),
    render: (text) =>
      renderColumn(
        "volMeasured60",
        hasValue(search["volMeasured60"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "MMBTU",
    dataIndex: "engMeasured",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "engMeasured",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      // "decimal,4"
    ),
    render: (text) =>
      renderColumn(
        "engMeasured",
        hasValue(search["engMeasured"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "GHV",
    dataIndex: "ghv",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "ghv",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      // "decimal,7"
    ),
    render: (text) =>
      renderColumn(
        "ghv",
        hasValue(search["ghv"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    sorter: true,
    title: "SOURCE",
    dataIndex: "fileSource",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileSource",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "fileSource",
        hasValue(search["fileSource"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
    // ...getColumnSearchPropsUseFilteredValue("fileSource"),
    // render: (text) =>
    //   searchedColumn === "fileSource" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : text ? (
    //     <Tooltip placement="topLeft" title={text}>
    //       {text}
    //     </Tooltip>
    //   ) : (
    //     "-"
    //   ),
  },
  {
    title: "TAXATION ROW ID",
    dataIndex: "taxationRowId",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "taxationRowId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "taxationRowId",
        hasValue(search["taxationRowId"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "CREATION DATE",
    sorter: true,
    align: "center",
    dataIndex: "createdDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (creationDate) =>
      renderDateColumn(
        "createdDate",
        hasValue(search["createdDate"]),
        searchText,
        creationDate,
        "date",
        search,
      ),
  },
  {
    title: "APPROVED BY",
    dataIndex: "approvedBy",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "approvedBy",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "approvedBy",
        hasValue(search["approvedBy"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "VOLUME MSCF",
    dataIndex: "volMscf",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "volMscf",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      renderColumn(
        "volMscf",
        hasValue(search["volMscf"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "UNCORRECTED VOL",
    dataIndex: "uncorrectedValue",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "uncorrectedValue",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      // "currency"
    ),
    render: (text) =>
      renderColumn(
        "uncorrectedValue",
        hasValue(search["uncorrectedValue"]),
        searchText,
        text,
        false,
        "input",
        search,
      ),
  },
  {
    title: "LAST UPDATE DATE",
    sorter: true,
    align: "center",
    dataIndex: "lastUpdatedDate",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "lastUpdatedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      renderDateColumn(
        "lastUpdatedDate",
        hasValue(search["lastUpdatedDate"]),
        searchText,
        text,
        "date",
        search,
      ),

    // ...getColumnSearchPropsUseFilteredValue(
    //   "lastUpdatedDate",
    //   searchInput,
    //   searchedColumn,
    //   searchText,
    //   handleSearch,
    //   true,
    //   "date"
    // ),
    // render: (text) =>
    //   searchedColumn === "lastUpdatedDate" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[
    //         searchText
    //           ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
    //           : "",
    //       ]}
    //       autoEscape
    //       textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
    //     />
    //   ) : text === null ? (
    //     "-"
    //   ) : (
    //     moment(text).format(dateFormatting.date)
    //   ),
  },
  {
    title: "SOURCE",
    dataIndex: "source",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "DESCRIPTION",
    dataIndex: "description",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
    ),
    render: (text) =>
      renderColumn(
        "description",
        hasValue(search["description"]),
        searchText,
        text,
        true,
        "input",
        search,
      ),
    // ...getColumnSearchPropsUseFilteredValue("description"),
    // render: (text) =>
    //   searchedColumn === "description" ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : text ? (
    //     <Tooltip placement="topLeft" title={text}>
    //       {text}
    //     </Tooltip>
    //   ) : (
    //     "-"
    //   ),
  },
];
