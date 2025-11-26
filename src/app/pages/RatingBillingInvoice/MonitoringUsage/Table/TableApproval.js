import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";

export const tableApproval = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { }
) => {
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "RECORD ID",
      dataIndex: "recordId",
      sorter: (a, b) => a.recordId - b.recordId,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "recordId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('recordId', hasValue(search['recordId']), searchText,text, false, 'input', search)
    },
    {
      title: "BATCH ID",
      dataIndex: "batchId",
      sorter: (a, b) => a?.batchId - b?.batchId,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "batchId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('batchId', hasValue(search['batchId']), searchText, text, false, 'input', search)
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      sorter: (a, b) => a?.customerNumber?.localeCompare(b?.customerNumber),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "customerNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('customerNumber', hasValue(search['customerNumber']), searchText, text, false, 'input', search)
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('customerName', hasValue(search['customerName']), searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: (a, b) => a?.accountNumber?.localeCompare(b?.accountNumber),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('accountNumber', hasValue(search['accountNumber']), searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      sorter: (a, b) => a?.accountName?.localeCompare(b?.accountName),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('accountName', hasValue(search['accountName']), searchText, text, false, 'input', search)

    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      align: "center",
      sorter: (a, b) => a?.accountSegment?.localeCompare(b?.accountSegment),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('accountSegment', hasValue(search['accountSegment']), searchText, text, false, 'input', search)
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      align: "center",
      sorter: (a, b) => a?.accountGroupType?.localeCompare(b?.accountGroupType),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountGroupType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('accountGroupType', hasValue(search['accountGroupType']), searchText, text, false, 'input', search)
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      align: "center",
      sorter: (a, b) => a?.serviceType?.localeCompare(b?.serviceType),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "serviceType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('serviceType', hasValue(search['serviceType']), searchText, text, false, 'input', search)
    },
    {
      title: "BILLING CYCLE",
      dataIndex: "billingCycleVal",
      align: "center",
      sorter: (a, b) => a?.billingCycle?.localeCompare(b?.billingCycle),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "billingCycleVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('billingCycleVal', hasValue(search['billingCycleVal']), searchText, text, false, 'input', search)
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriodVal",
      sorter: (a, b) => a?.billingPeriod?.localeCompare(b?.billingPeriod),
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "billingPeriodVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'datePeriod'
      ),
      render: (text) => renderDateColumn('billingPeriodVal', hasValue(search['billingPeriodVal']), searchText, text, 'datePeriod', search)
    },
    {
      title: "SOR",
      dataIndex: "sor",
      sorter: (a, b) => a?.sor?.localeCompare(b?.sor),
      align: "left",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('sor', hasValue(search['sor']), searchText, text, false, 'input', search)
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      sorter: (a, b) => a?.costCenter?.localeCompare(b?.costCenter),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('costCenter', hasValue(search['costCenter']), searchText, text, false, 'input', search)
    },
    {
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      sorter: (a, b) => a?.meterReadingCode?.localeCompare(b?.meterReadingCode),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "meterReadingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('meterReadingCode', hasValue(search['meterReadingCode']), searchText, text, false, 'input', search)
    },
    {
      title: "ASSET SERIAL NUMBER",
      dataIndex: "assetSerialNumber",
      sorter: (a, b) => a?.assetSerialNum?.localeCompare(b?.assetSerialNumber),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "assetSerialNum",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('assetSerialNum', hasValue(search['assetSerialNum']), searchText, text, false, 'input', search)
    },
    {
      title: "ASSET TYPE",
      dataIndex: "assetType",
      align: "center",
      sorter: (a, b) => a?.assetSerialNum?.localeCompare(b?.assetSerialNum),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "assetType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('assetType', hasValue(search['assetType']), searchText, text, false, 'input', search)
    },
    {
      title: "MEASUREMENT DATE",
      dataIndex: "measDate",
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "measDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'datetime'
      ),
      render: (text) => renderDateColumn('measDate', hasValue(search['measDate']), searchText, text, 'datetime', search)
    },
    {
      title: "DATE",
      dataIndex: "fdate",
      sorter: (a, b) => a?.fdate?.localeCompare(b?.fdate),
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fdate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'date'
      ),
      render: (text) => renderDateColumn('fdate', hasValue(search['fdate']), searchText, text, 'date', search)
    },
    {
      title: "HOUR",
      dataIndex: "fhour",
      align: "center",
      sorter: (a, b) => a?.fhour?.localeCompare(b?.fhour),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "hour",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'hour'
      ),
      render: (text) => renderDateColumn('fdate', hasValue(search['fdate']), searchText, text, 'hour', search)
    },
    {
      title: "STREAM ID",
      dataIndex: "streamId",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "streamId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('streamId', hasValue(search['streamId']), searchText, text, false, 'input', search)
    },
    {
      title: "BEGIN STAND",
      dataIndex: "beginStand",
      sorter: (a, b) => a?.beginStand - b?.beginStand,
      align: "right",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "beginStand",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('beginStand', hasValue(search['beginStand']), searchText, text, false, 'input', search)
    },
    {
      title: "END STAND",
      dataIndex: "endStand",
      align: "right",
      sorter: (a, b) => a?.endStand - b?.endStand,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "endStand",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('endStand', hasValue(search['endStand']), searchText, text, false, 'input', search)
    },
    {
      title: "UNCORRECTED VOL",
      dataIndex: "uncorrectedValue",
      sorter: (a, b) => a?.uncorrectedValue?.localeCompare(b?.uncorrectedValue),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "uncorrectedValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('uncorrectedValue', hasValue(search['uncorrectedValue']), searchText, text, false, 'input', search)
    },
    {
      title: "TEMPERATURE",
      dataIndex: "temperature",
      sorter: (a, b) => a?.temperature?.localeCompare(b?.temperature),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "temperatur",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('temperature', hasValue(search['temperature']), searchText, text, false, 'input', search)
    },
    {
      title: "PRESSURE",
      dataIndex: "pressure",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "pressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('pressure', hasValue(search['pressure']), searchText, text, false, 'input', search)
    },
    {
      title: "CORRECTION FACTOR",
      dataIndex: "correctionFactor",
      sorter: (a, b) => a?.correctionFactor?.localeCompare(b?.correctionFactor),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "correctionFactor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('correctionFactor', hasValue(search['correctionFactor']), searchText, text, false, 'input', search)
    },
   
    {
      title: "VOLUME 27",
      dataIndex: "volMeasured27",
      sorter: (a, b) => a?.volMeasured27 - b?.volMeasured27,
      align: "right",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "volMeasured27",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('volMeasured27', hasValue(search['volMeasured27']), searchText, text, false, 'input', search)
    },
    {
      title: "VOLUME 60",
      dataIndex: "volMeasured60",
      sorter: (a, b) => a?.volMeasured60 - b?.volMeasured60,
      align: "right",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "volMeasured60",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('volMeasured60', hasValue(search['volMeasured60']), searchText, text, false, 'input', search)
    },

    {
      title: "VOLUME MSCF",
      dataIndex: "volMscf",
      sorter: (a, b) => a?.volMscf - b?.volMscf,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "volMscf",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('volMscf', hasValue(search['volMscf']), searchText, text, false, 'input', search)
    },
    {
      title: "GHV",
      dataIndex: "ghv",
      sorter: (a, b) => a?.ghv?.localeCompare(b?.ghv),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "ghv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('ghv', hasValue(search['ghv']), searchText, text, false, 'input', search)
    },
    {
      title: 'CALORIE',
      dataIndex: "calorie",
      sorter: (a, b) => a?.calorie - b?.calorie,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "calorie",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('calorie', hasValue(search['calorie']), searchText, text, false, 'input', search)
    },
    {
      title: "ENG MEASURED",
      dataIndex: "engMeasured",
      sorter: (a, b) => a?.engMeasured - b?.engMeasured,
      align: "right",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "engMeasured",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('engMeasured', hasValue(search['engMeasured']), searchText, text, false, 'input', search)
    },
    {
      title: "DATA SOURCE",
      dataIndex: "fileSource",
      sorter: (a, b) => a?.fileSource?.localeCompare(b?.fileSource),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fileSource",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('fileSource', hasValue(search['fileSource']), searchText, text, false, 'input', search)
    },
    {
      title: "TAXATION ROW ID",
      dataIndex: "taxationRowId",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "taxationRowId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('taxationRowId', hasValue(search['taxationRowId']), searchText, text, false, 'input', search)
    },
    {
      title: "CREATION DATE",
      dataIndex: "createdDate",
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'datetime'
      ),
      render: (text) => renderDateColumn('createdDate', hasValue(search['createdDate']), searchText, text, 'datetime', search)
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      align: "center",
      sorter: (a, b) => a?.source?.localeCompare(b?.source),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "source",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('source', hasValue(search['source']), searchText, text, false, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: (a, b) => a?.description?.localeCompare(b?.description),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
    },
  ];

  return columns;
};
