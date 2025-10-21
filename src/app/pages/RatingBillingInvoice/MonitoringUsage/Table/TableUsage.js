import moment from "moment";
import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  toTitleCase,
} from "../../../../../utils";
import {
  getColumnSearchProps,
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";

export const tableUsage = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => {
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
      // render: (text, object, index) => index + 1,
    },
    {
      title: "RECORD ID",
      dataIndex: "recordId",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "recordId",
        searchInput,
        hasValue(search["recordId"]),
        searchText,
        handleSearch,
      ),
      // render: (text) => renderColumn('recordId', hasValue(search['recordId']), searchText, text, false, "input", search)
    },
    {
      title: "BATCH ID",
      dataIndex: "batchId",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "batchId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      // render: (text) => renderColumn('batchId', hasValue(search['batchId']), searchText, text, false, 'input', search)
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "customerNumber",
          hasValue(search["customerNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      // render: (text) => renderColumn("customerName", hasValue(search['customerName']), searchText, text, true, 'input', search)
      // searchedColumn === "customerName" ? (
      //   <Highlighter
      //     highlightStyle={{
      //       backgroundColor: "#ffc069",
      //       padding: 0,
      //     }}
      //     searchWords={[searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ""}
      //   />
      // ) : text ? (
      //   <Tooltip placement="topLeft" title={text}>
      //     {text}
      //   </Tooltip>
      // ) : (
      //   ""
      // ),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "accountNumber",
          hasValue(search["accountNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "accountName",
          hasValue(search["accountName"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),

      // searchedColumn === "accountName" ? (
      //   <Highlighter
      //     highlightStyle={{
      //       backgroundColor: "#ffc069",
      //       padding: 0,
      //     }}
      //     searchWords={[searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ""}
      //   />
      // ) : text ? (
      //   <Tooltip placement="topLeft" title={text}>
      //     {text}
      //   </Tooltip>
      // ) : (
      //   ""
      // ),
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "accountSegment",
          hasValue(search["accountSegment"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountGroupType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "accountGroupType",
          hasValue(search["accountGroupType"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serviceType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "serviceType",
          hasValue(search["serviceType"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "BILLING CYCLE",
      dataIndex: "billingCycleValue",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCycleValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "billingCycleValue",
          hasValue(search["billingCycleValue"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      sorter: true,
      align: "center",
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
      render: (billingPeriod) =>
        hasValue(billingPeriod) && moment(billingPeriod).format("MMM YYYY"),
    },
    {
      title: "SOR",
      dataIndex: "sor",
      sorter: true,
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "sor",
          hasValue(search["sor"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
      // searchedColumn === "sor" ? (
      //   <Highlighter
      //     highlightStyle={{
      //       backgroundColor: "#ffc069",
      //       padding: 0,
      //     }}
      //     searchWords={[searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ""}
      //   />
      // ) : text ? (
      //   <Tooltip placement="topLeft" title={text}>
      //     {text}
      //   </Tooltip>
      // ) : (
      //   ""
      // ),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "costCenter",
          hasValue(search["costCenter"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "meterReadingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "meterReadingCode",
          hasValue(search["meterReadingCode"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ASSET SERIAL NUMBER",
      dataIndex: "assetSerialNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "assetSerialNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "assetSerialNumber",
          hasValue(search["assetSerialNumber"]),
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
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "assetType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      title: "RATING CODE",
      dataIndex: "ratingCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "ratingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "ratingCode",
          hasValue(search["ratingCode"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },

    {
      title: "MEASUREMENT DATE",
      dataIndex: "measDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "measDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "measDate",
          hasValue(search["measDate"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: " DATE",
      dataIndex: "fdate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "fdate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "fdate",
          hasValue(search["fdate"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "HOUR",
      dataIndex: "fhour",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "hour",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "fhour",
          hasValue(search["fhour"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "STREAM ID",
      dataIndex: "streamId",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "streamId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      title: "UNCORRECTED VOL",
      dataIndex: "uncorrectedValue",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "uncorrectedValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      title: "TEMPERATURE",
      dataIndex: "temperature",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "temperatur",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "pressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "correctionFactor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endStand",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      title: "VOLUME MSCF",
      dataIndex: "volMscf",
      align: "right",
      sorter: true,
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
      title: "GHV",
      dataIndex: "ghv",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "ghv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      title: "CALORIE",
      dataIndex: "calorie",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calorie",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
      title: "ENG MEASURED",
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
      title: "DATA SOURCE",
      dataIndex: "fileSource",
      sorter: true,
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
          true,
          "input",
          search,
        ),
      // searchedColumn === "fileSource" ? (
      //   <Highlighter
      //     highlightStyle={{
      //       backgroundColor: "#ffc069",
      //       padding: 0,
      //     }}
      //     searchWords={[searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ""}
      //   />
      // ) : text ? (
      //   <Tooltip placement="topLeft" title={text}>
      //     {text}
      //   </Tooltip>
      // ) : (
      //   ""
      // ),
    },
    {
      title: "TAXATION ROW ID",
      dataIndex: "taxationRowId",
      sorter: true,
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
      dataIndex: "creationDate",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "creationDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (creationDate) =>
        hasValue(creationDate) && moment(creationDate, dateFormatting.dateTime),
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "source",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "source",
          hasValue(search["source"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
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
      // searchedColumn === "description" ? (
      //   <Highlighter
      //     highlightStyle={{
      //       backgroundColor: "#ffc069",
      //       padding: 0,
      //     }}
      //     searchWords={[searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ""}
      //   />
      // ) : text ? (
      //   <Tooltip placement="topLeft" title={text}>
      //     {text}
      //   </Tooltip>
      // ) : (
      //   ""
      // ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          text,
          false,
          "status",
          search,
        ),
      // render: (text) => (
      //   <div className={" flex justify-center"}>
      //     <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
      //   </div>
      // ),
    },
  ];

  return columns;
};
