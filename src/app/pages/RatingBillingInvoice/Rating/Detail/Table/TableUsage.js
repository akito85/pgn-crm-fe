import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

export const columnsUsage = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "billingPeriod",
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
      "datePeriod"
    ),
    render: (text) =>
      renderDateColumn(
        "billingPeriod",
        hasValue(search["billingPeriod"]),
        searchText,
        text,
        "datePeriod",
        search
      ),
  },
  {
    key: "assetSerialNumber",
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
      "input"
    ),
    render: (text) =>
      renderColumn(
        "quantity",
        hasValue(search["quantity"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "assetType",
    title: "ASSET TYPE",
    dataIndex: "assetType",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "assetType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "assetType",
        hasValue(search["assetType"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "measDate",
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
      "datetime"
    ),
    render: (text) =>
      renderDateColumn(
        "measDate",
        hasValue(search["measDate"]),
        searchText,
        text,
        "datetime",
        search
      ),
  },
  {
    key: "fdate",
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
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "fdate",
        hasValue(search["fdate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    key: "fhour",
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
      "hour"
    ),
    render: (creationDate) => renderColumn('fhour', hasValue(search['fhour']), searchText, creationDate, false, 'input', search)
  },
  {
    key: "streamId",
    title: "STREAM ID",
    dataIndex: "streamId",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "streamId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "streamId",
        hasValue(search["streamId"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "temperature",
    title: "TEMPERATURE",
    dataIndex: "temperature",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "temperature",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "temperature",
        hasValue(search["temperature"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "pressure",
    title: "PRESSURE",
    dataIndex: "pressure",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "pressure",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "pressure",
        hasValue(search["pressure"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "correctionFactor",
    title: "CORRECTION FACTOR",
    dataIndex: "correctionFactor",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "correctionFactor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input"
    ),
    render: (text) =>
      renderColumn(
        "correctionFactor",
        hasValue(search["correctionFactor"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "calorie",
    title: "CALORIE",
    dataIndex: "calorie",
    sorter: true,
    align: "right",
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
        search
      ),
  },
  {
    key: "beginStand",
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
        search
      ),
  },
  {
    key: "endStand",
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
    ),
    render: (text) =>
      renderColumn(
        "endStand",
        hasValue(search["endStand"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    key: "volMeasured27",
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
        search
      ),
  },
  {
    key: "volMeasured60",
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
        search
      ),
  },
  {
    key: "engMeasured",
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
    ),
    render: (text) => renderColumn('engMeasured', hasValue(search['engMeasured']), searchText, text, false, 'input', search)
  },
  {
    key: "ghv",
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
    ),
    render: (text) => renderColumn('ghv', hasValue(search['ghv']), searchText, text, false, 'input', search)
  },
  {
    key: "fileSource",
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
      true
    ),
    render: (text) => renderColumn('fileSource', hasValue(search['fileSource']), searchText, text, false, 'input', search)
  },
  {
    key: "taxationRowId",
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
      true
    ),
    render: (text) => renderColumn('taxationRowId', hasValue(search['taxationRowId']), searchText, text, false, 'input', search)
  },
  {
    key: "createdDate",
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
      'date'
    ),
    render: (creationDate) => renderDateColumn('createdDate', hasValue(search['createdDate']), searchText, creationDate, 'date', search)
  },
  {
    key: "approvedBy",
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
      true
    ),
    render: (text) => renderColumn('approvedBy', hasValue(search['approvedBy']), searchText, text, false, 'input', search)
  },
  {
    key: "volMscf",
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
      true
    ),
    render: (text) => renderColumn('volMscf', hasValue(search['volMscf']), searchText, text, false, 'input', search)
  },
  {
    key: "uncorrectedValue",
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
    ),
    render: (text) => renderColumn('uncorrectedValue', hasValue(search['uncorrectedValue']), searchText, text, false, 'input', search)
  },
  {
    key: "lastUpdatedDate",
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
      'date'
    ),
    render: (text) => renderDateColumn('lastUpdatedDate', hasValue(search['lastUpdatedDate']), searchText, text, 'date', search)
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "description",
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
      "input"
    ),
    render: (text) =>
      renderColumn(
        "description",
        hasValue(search["description"]),
        searchText,
        text,
        true,
        "input",
        search
      ),
  },
];