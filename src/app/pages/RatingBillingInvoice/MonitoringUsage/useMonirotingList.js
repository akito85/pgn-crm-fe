import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getColumnSearchPropsUseFilteredValue,
  getColumnSearchPropsUseFilteredValueFE,
} from "../../../../utils/getColumnSearchProps";
import {
  getListApproval,
  getListBatchPaginate,
  getListUsagePaginate,
  getDetailBatch,
  getDownloadList,
} from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
  toTitleCase,
} from "../../../../utils";
import moment from "moment";
import StatusComponent from "../../../../components/StatusComponent";

const separatorCurrency = (text, decimal) => {
  const tempValue = text ? (text + "").split(".") : [];
  const thousandSeparator = ",";
  const decimalSeparator = ".";
  const descimal = tempValue[1]
    ? `${decimalSeparator}${tempValue[1]}${"0"?.repeat(
        decimal - tempValue[1].length > 0 ? decimal - tempValue[1].length : 0
      )}`
    : `${decimalSeparator}${"0"?.repeat(decimal)}`;

  return tempValue.length > 0
    ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        descimal
    : "";
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "beginStand":
      case "endStand":
      case "volMeasured27":
      case "volMeasured60":
      case "volMscf":
      case "ghv":
      case "calorie":
      case "engMeasured":
      case "uncorrectedValue":
        return separatorCurrency(obj[fieldSort])?.replace(/,/g, "");
      case "adjustmentType":
        return obj[fieldSort]?.label.toLowerCase();
      case "billingPeriod":
      case "measDate":
      case "fdate":
      case "createdDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : "";
      // return date.toLowerCase();
      default:
        return obj[fieldSort]?.toString()?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "billingPeriod":
      case "measDate":
      case "fdate":
      case "createdDate":
        if (a && b) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      case "beginStand":
      case "endStand":
      case "volMeasured27":
      case "volMeasured60":
      case "volMscf":
      case "ghv":
      case "calorie":
      case "engMeasured":
      case "uncorrectedValue":
        return Math.sign(parseFloat(a) - parseFloat(b));
      default:
        return a?.localeCompare(b);
    }
  };
  return handleCompare(fa, fb);
};

export const useMonitoringList = (tabs, batchId) => {
  // Selector
  const {
    data: data_usage,
    data_list_usage: dataUsage,
    data_list_batch: dataBatch,
    loading,
    data: data_approval,
  } = useSelector((state) => state.monitoring_usage);

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // Use State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20); // Load more 20 data each time
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // use effect - Initial fetch only
  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    const searchRequest = encodeURIComponent(JSON.stringify(search));
    if (hasValue(batchId) && tabs === "Upload") {
      dispatch(
        getDetailBatch({
          batchId,
          page: 1,
          pageSize: 100,
          search: tempSearch,
          sort,
        })
      );
    } else if (tabs === "Usage List") {
      dispatch(
        getListUsagePaginate({
          search: searchRequest,
          page: 1,
          pageSize: 100,
          sort,
          isLoadMore: false,
        })
      );
    } else if (tabs === "Batch List") {
      dispatch(
        getListBatchPaginate({
          search: searchRequest,
          page: 1,
          pageSize: 100,
          sort,
          isLoadMore: false,
        })
      );
    }
    setPage(1);
  }, [dispatch, search, sort, tabs, batchId]);

  // handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const searchRequest = encodeURIComponent(JSON.stringify(search));

    let totalPages = 0;
    if (tabs === "Usage List") {
      totalPages = dataUsage?.page?.totalPages || 0;
      if (nextPage <= totalPages) {
        await dispatch(
          getListUsagePaginate({
            search: searchRequest,
            page: nextPage,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: true,
          })
        );
        setPage(nextPage);
      }
    } else if (tabs === "Batch List") {
      totalPages = dataBatch?.page?.totalPages || 0;
      if (nextPage <= totalPages) {
        await dispatch(
          getListBatchPaginate({
            search: searchRequest,
            page: nextPage,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: true,
          })
        );
        setPage(nextPage);
      }
    }
  };

  // Calculate if there's more data
  const hasMoreUsage =
    (dataUsage?.result?.length || 0) < (dataUsage?.page?.totalElements || 0);
  const hasMoreBatch =
    (dataBatch?.result?.length || 0) < (dataBatch?.page?.totalElements || 0);

  // onSort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    try {
      const searchRequest = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getDownloadList({
          search: searchRequest,
          sort,
          page: 1,
          pageSize: 1000,
        })
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

  // onclick approval
  const onClickApproval = async () =>
    await dispatch(getListApproval({ page: 1, pageSize: 1000 })).unwrap();

  // columns
  const columns = [
    {
      title: "NO",
      width: 40,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "RECORD ID",
      dataIndex: "recordId",
      isNumber: true,
      width: 120,
      // sorter: true,
      sorter: (a, b) => sorter("recordId", a, b),
      filteredValue: search?.["recordId"] ? [search?.["recordId"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "recordId",
        searchInput,
        hasValue(search["recordId"]),
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "recordId",
          hasValue(search["recordId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "BATCH ID",
      dataIndex: "batchId",
      isNumber: true,
      width: 110,
      // sorter: true,
      sorter: (a, b) => sorter("batchId", a, b),
      filteredValue: search?.["batchId"] ? [search?.["batchId"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "batchId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "batchId",
          hasValue(search["batchId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      isClassification: true,
      width: 180,
      // sorter: true,
      sorter: (a, b) => sorter("customerNumber", a, b),
      filteredValue: search?.["customerNumber"]
        ? [search?.["customerNumber"]]
        : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "customerNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerNumber",
          hasValue(search["customerNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      isClassification: true,
      width: 180,
      // sorter: true
      sorter: (a, b) => sorter("customerName", a, b),
      filteredValue: search?.["customerName"]
        ? [search?.["customerName"]]
        : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      isClassification: true,
      width: 180,
      // sorter: true,
      sorter: (a, b) => sorter("accountNumber", a, b),
      filteredValue: search?.["accountNumber"]
        ? [search?.["accountNumber"]]
        : null,
      // filteredValue: [search?.accountNumber] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountNumber",
          hasValue(search["accountNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      isClassification: true,
      width: 160,
      // sorter: true,
      sorter: (a, b) => sorter("accountName", a, b),
      filteredValue: search?.["accountName"] ? [search?.["accountName"]] : null,
      // filteredValue: [search?.accountName] || null,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountName",
          hasValue(search["accountName"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    // {
    //   title: "SERVICE TYPE",
    //   dataIndex: "serviceType",
    //   align: "center",
    //   // sorter: true,
    //   sorter: (a, b) => sorter("serviceType", a, b),
    //   filteredValue: search?.["serviceType"] ? [search?.["serviceType"]] : null,
    //   // filteredValue: [search?.serviceType] || null,
    //   ...getColumnSearchPropsUseFilteredValueFE(
    //     search,
    //     "serviceType",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch,
    //     true
    //   ),
    //   render: (text) =>
    //     renderColumn(
    //       "serviceType",
    //       hasValue(search["serviceType"]),
    //       searchText,
    //       text,
    //       false,
    //       "input",
    //       search
    //     ),
    // },
    // {
    //   title: "BILLING CYCLE",
    //   dataIndex: "billingCycleValue",
    //   // sorter: true,
    //   sorter: (a, b) => sorter("billingCycleValue", a, b),
    //   filteredValue: search?.["billingCycleValue"]
    //     ? [search?.["billingCycleValue"]]
    //     : null,
    //   // filteredValue: [search?.billingCycleValue] || null,
    //   align: "center",
    //   ...getColumnSearchPropsUseFilteredValueFE(
    //     search,
    //     "billingCycleValue",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch,
    //     true
    //   ),
    //   render: (text) =>
    //     renderColumn(
    //       "billingCycleValue",
    //       hasValue(search["billingCycleValue"]),
    //       searchText,
    //       text,
    //       false,
    //       "input",
    //       search
    //     ),
    // },
    // {
    //   title: "BILLING PERIOD",
    //   dataIndex: "billingPeriod",
    //   // sorter: true,
    //   sorter: (a, b) => sorter("billingPeriod", a, b),
    //   filteredValue: search?.["billingPeriod"]
    //     ? [search?.["billingPeriod"]]
    //     : null,
    //   // filteredValue: [search?.billingPeriod] || null,
    //   align: "center",
    //   ...getColumnSearchPropsUseFilteredValueFE(
    //     search,
    //     "billingPeriod",
    //     searchInput,
    //     searchedColumn,
    //     searchText,
    //     handleSearch,
    //     true,
    //     "datePeriod"
    //   ),
    //   render: (billingPeriod) =>
    //     renderDateColumn(
    //       "billingPeriod",
    //       hasValue(search["billingPeriod"]),
    //       searchText,
    //       billingPeriod,
    //       "datePeriod",
    //       search
    //     ),
    // },
    {
      title: "SOR",
      dataIndex: "sor",
      width: 150,
      isClassification: true,
      // sorter: true,
      sorter: (a, b) => sorter("sor", a, b),
      filteredValue: search?.["sor"] ? [search?.["sor"]] : null,
      // filteredValue: [search?.sor] || null,
      align: "left",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "sor",
          hasValue(search["sor"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      isClassification: true,
      // sorter: true,
      sorter: (a, b) => sorter("costCenter", a, b),
      filteredValue: search?.["costCenter"] ? [search?.["costCenter"]] : null,
      // filteredValue: [search?.costCenter] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "costCenter",
          hasValue(search["costCenter"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      isClassification: true,
      width: 180,
      // sorter: true,
      sorter: (a, b) => sorter("meterReadingCode", a, b),
      filteredValue: search?.["meterReadingCode"]
        ? [search?.["meterReadingCode"]]
        : null,
      // filteredValue: [search?.meterReadingCode] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "meterReadingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "meterReadingCode",
          hasValue(search["meterReadingCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      isClassification: true,
      width: 180,
      // sorter: true,
      sorter: (a, b) => sorter("accountSegment", a, b),
      filteredValue: search?.["accountSegment"]
        ? [search?.["accountSegment"]]
        : null,
      // filteredValue: [search?.accountSegment] || null,
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountSegment",
          hasValue(search["accountSegment"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      isClassification: true,
      width: 190,
      // sorter: true,
      sorter: (a, b) => sorter("accountGroupType", a, b),
      filteredValue: search?.["accountGroupType"]
        ? [search?.["accountGroupType"]]
        : null,
      // filteredValue: [search?.accountGroupType] || null,
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "accountGroupType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountGroupType",
          hasValue(search["accountGroupType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ASSET SERIAL NUMBER",
      dataIndex: "assetSerialNumber",
      isClassification: true,
      width: 200,
      // sorter: true,
      sorter: (a, b) => sorter("assetSerialNumber", a, b),
      filteredValue: search?.["assetSerialNumber"]
        ? [search?.["assetSerialNumber"]]
        : null,
      // filteredValue: [search?.assetSerialNumberber] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "assetSerialNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "assetSerialNumber",
          hasValue(search["assetSerialNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ASSET TYPE",
      dataIndex: "assetType",
      isClassification: true,
      align: "center",
      // sorter: true,
      sorter: (a, b) => sorter("assetType", a, b),
      filteredValue: search?.["assetType"] ? [search?.["assetType"]] : null,
      // filteredValue: [search?.assetType] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "assetType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      title: "RATING CODE",
      dataIndex: "ratingCode",
      isClassification: true,
      // sorter: true,
      sorter: (a, b) => sorter("ratingCode", a, b),
      filteredValue: search?.["ratingCode"] ? [search?.["ratingCode"]] : null,
      // filteredValue: [search?.ratingCode] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "ratingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "ratingCode",
          hasValue(search["ratingCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },

    {
      title: "MEASUREMENT DATE",
      dataIndex: "measDate",
      width: 200,
      isClassification: true,
      // sorter: true,
      sorter: (a, b) => sorter("measDate", a, b),
      filteredValue: search?.["measDate"] ? [search?.["measDate"]] : null,
      //filteredValue: [search?.measDate] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
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
      title: " DATE",
      dataIndex: "fdate",
      isClassification: true,
      // sorter: true,
      sorter: (a, b) => sorter("fdate", a, b),
      filteredValue: search?.["fdate"] ? [search?.["fdate"]] : null,
      //filteredValue: [search?.fdate] || null,
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
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
      title: "HOUR",
      dataIndex: "fhour",
      isNumber: true,
      // sorter: true,
      sorter: (a, b) => sorter("fhour", a, b),
      filteredValue: search?.["fhour"] ? [search?.["fhour"]] : null,
      //filteredValue: [search?.district] || null,
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fhour",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "hour"
      ),
      render: (text) =>
        renderColumn(
          "fhour",
          hasValue(search["fhour"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "STREAM ID",
      dataIndex: "streamId",
      isNumber: true,
      sorter: (a, b) => sorter("streamId", a, b),
      filteredValue: search?.["streamId"] ? [search?.["streamId"]] : null,
      //filteredValue: [search?.streamId] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "streamId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      title: "BEGIN STAND",
      dataIndex: "beginStand",
      // sorter: true,
      isNumber: true,
      sorter: (a, b) => sorter("beginStand", a, b),
      filteredValue: search?.["beginStand"] ? [search?.["beginStand"]] : null,
      //filteredValue: [search?.beginStand] || null,
      align: "right",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "beginStand",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "decimal,4"
      ),
      render: (text) =>
        renderColumn(
          "beginStand",
          hasValue(search["beginStand"]),
          searchText,
          separatorCurrency(text, 4),
          false,
          "input",
          search
        ),
    },
    {
      title: "END STAND",
      dataIndex: "endStand",
      isNumber: true,
      filteredValue: search?.["endStand"] ? [search?.["endStand"]] : null,
      // sorter: true,
      sorter: (a, b) => sorter("endStand", a, b),
      //filteredValue: [search?.endStand] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "endStand",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "decimal,4"
      ),
      render: (text) =>
        renderColumn(
          "endStand",
          hasValue(search["endStand"]),
          searchText,
          separatorCurrency(text, 4),
          false,
          "input",
          search
        ),
    },
    {
      title: "UNCORRECTED VOL",
      dataIndex: "uncorrectedValue",
      align: "right",
      width: 170,
      sorter: (a, b) => sorter("uncorrectedValue", a, b),
      filteredValue: search?.["unsorrectedValue"]
        ? [search?.["unsorrectedValue"]]
        : null,
      //filteredValue: [search?.uncorrectedValue] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "uncorrectedValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "uncorrectedValue",
          hasValue(search["uncorrectedValue"]),
          searchText,
          separatorCurrency(text, 2),
          false,
          "input",
          search
        ),
    },
    {
      title: "TEMPERATURE",
      dataIndex: "temperature",
      align: "right",
      sorter: (a, b) => sorter("temperature", a, b),
      filteredValue: search?.["temperature"] ? [search?.["temperature"]] : null,
      //filteredValue: [search?.temperature] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "temperature",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      title: "PRESSURE",
      dataIndex: "pressure",
      align: "right",
      sorter: (a, b) => sorter("pressure", a, b),
      filteredValue: search?.["pressure"] ? [search?.["pressure"]] : null,
      //filteredValue: [search?.pressure] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "pressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      title: "CORRECTION FACTOR",
      dataIndex: "correctionFactor",
      align: "right",
      width: 180,
      sorter: (a, b) => sorter("correctionFactor", a, b),
      filteredValue: search?.["correctionFactor"]
        ? [search?.["correctionFactor"]]
        : null,
      //filteredValue: [search?.correctionFactor] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "correctionFactor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
      title: "VOLUME 27",
      dataIndex: "volMeasured27",
      // sorter: true,
      sorter: (a, b) => sorter("volMeasured27", a, b),
      filteredValue: search?.["volMeasured27"]
        ? [search?.["volMeasured27"]]
        : null,
      //filteredValue: [search?.volMeasured27] || null,
      isNumber: true,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "volMeasured27",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "decimal,4"
      ),
      render: (text) =>
        renderColumn(
          "volMeasured27",
          hasValue(search["volMeasured27"]),
          searchText,
          separatorCurrency(text, 4),
          false,
          "input",
          search
        ),
    },
    {
      title: "VOLUME 60",
      dataIndex: "volMeasured60",
      // sorter: true,
      sorter: (a, b) => sorter("volMeasured60", a, b),
      filteredValue: search?.["volMeasured60"]
        ? [search?.["volMeasured60"]]
        : null,
      //filteredValue: [search?.volMeasured60] || null,
      isNumber: true,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "volMeasured60",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "decimal,4"
      ),
      render: (text) =>
        renderColumn(
          "volMeasured60",
          hasValue(search["volMeasured60"]),
          searchText,
          separatorCurrency(text, 4),
          false,
          "input",
          search
        ),
    },

    {
      title: "VOLUME MSCF",
      dataIndex: "volMscf",
      isNumber: true,
      // sorter: true,
      sorter: (a, b) => sorter("volMscf", a, b),
      filteredValue: search?.["volMscf"] ? [search?.["volMscf"]] : null,
      //filteredValue: [search?.volMscf] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "volMscf",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "volMscf",
          hasValue(search["volMscf"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "GHV",
      dataIndex: "ghv",
      align: "right",
      // sorter: true,
      sorter: (a, b) => sorter("ghv", a, b),
      filteredValue: search?.["ghv"] ? [search?.["ghv"]] : null,
      //filteredValue: [search?.ghv] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "ghv",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "decimal,7"
      ),
      render: (text) =>
        renderColumn(
          "ghv",
          hasValue(search["ghv"]),
          searchText,
          separatorCurrency(text, 7),
          false,
          "input",
          search
        ),
    },
    {
      title: "CALORIE",
      dataIndex: "calorie",
      isNumber: true,
      // sorter: true,
      sorter: (a, b) => sorter("calorie", a, b),
      filteredValue: search?.["calorie"] ? [search?.["calorie"]] : null,
      //filteredValue: [search?.calorie] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "calorie",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "decimal,4"
      ),
      render: (text) =>
        renderColumn(
          "calorie",
          hasValue(search["calorie"]),
          searchText,
          separatorCurrency(text, 4),
          false,
          "input",
          search
        ),
    },
    {
      title: "ENG MEASURED",
      dataIndex: "engMeasured",
      // sorter: true,
      sorter: (a, b) => sorter("engMeasured", a, b),
      filteredValue: search?.["engMeasured"] ? [search?.["engMeasured"]] : null,
      //filteredValue: [search?.engMeasured] || null,
      align: "right",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "engMeasured",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "decimal,4"
      ),
      render: (text) =>
        renderColumn(
          "engMeasured",
          hasValue(search["engMeasured"]),
          searchText,
          separatorCurrency(text, 4),
          false,
          "input",
          search
        ),
    },
    {
      title: "DATA SOURCE",
      dataIndex: "fileSource",
      width: 200,
      // sorter: true,
      sorter: (a, b) => sorter("fileSource", a, b),
      filteredValue: search?.["fileSource"] ? [search?.["fileSource"]] : null,
      //filteredValue: [search?.fileSource] || null,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fileSource",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "fileSource",
          hasValue(search["fileSource"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "TAXATION ROW ID",
      dataIndex: "taxationRowId",
      align: "right",
      width: 170,
      sorter: (a, b) => sorter("taxationRowId", a, b),
      filteredValue: search?.["taxationRowId"]
        ? [search?.["taxationRowId"]]
        : null,
      //filteredValue: [search?.taxationRowId] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "taxationRowId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "taxationRowId",
          hasValue(search["taxationRowId"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "CREATION DATE",
      dataIndex: "createdDate",
      // sorter: true,
      sorter: (a, b) => sorter("createdDate", a, b),
      align: "center",
      filteredValue: search?.["createdDate"] ? [search?.["createdDate"]] : null,
      //filteredValue: [search?.createdDate] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datetime"
      ),
      render: (creationDate) =>
        renderDateColumn(
          "createdDate",
          hasValue(search["createdDate"]),
          searchText,
          creationDate,
          "datetime",
          search
        ),
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      isClassification: true,
      // sorter: true,
      sorter: (a, b) => sorter("source", a, b),
      filteredValue: search?.["source"] ? [search?.["source"]] : null,
      //filteredValue: [search?.source] || null,
      align: "center",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "source",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "source",
          hasValue(search["source"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      // sorter: true,
      sorter: (a, b) => sorter("description", a, b),
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      //filteredValue: [search?.description] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      // sorter: true,
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
     {
      title: "Message",
      dataIndex: "logError",
      align: "left",
      // sorter: true,
      sorter: (a, b) => sorter("logError", a, b),
      filteredValue: search?.["logError"] ? [search?.["logError"]] : null,
      //filteredValue: [search?.description] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "logError",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      // sorter: true,
      render: (text) =>
        renderColumn(
          "logError",
          hasValue(search["logError"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      fixed: "right",
      width: 150,
      // sorter: true,
      sorter: (a, b) => sorter("status", a, b),
      filteredValue: search?.["status"] ? [search?.["status"]] : null,
      //filteredValue: [search?.status] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          text,
          false,
          "status",
          search
        ),
    },
  ];

  const batchColumns = [
    {
      title: "NO",
      width: 30,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "FileName",
      dataIndex: "fileSource",
      width: 130,
      sorter: true,
      isClassification: true,
      filteredValue: [search?.fileSource] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "fileSource",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "fileSource",
          hasValue(search["fileSource"]),
          searchText,
          text,
          false,
          search
        ),
    },
    {
      title: "BATCHID",
      dataIndex: "batchId",
      width: 80,
      isNumber: true,
      sorter: true,
      filteredValue: [search?.batchId] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "batchId",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "batchId",
          hasValue(search["batchId"]),
          searchText,
          text,
          false,
          search
        ),
    },
    {
      title: "Σ USAGE",
      dataIndex: "totalUsage",
      width: 80,
      sorter: true,
      filteredValue: [search?.totalUsage] || null,
      isNumber: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalUsage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "totalUsage",
          hasValue(search["totalUsage"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "Σ SUCCEED",
      dataIndex: "totalSucceed",
      width: 90,
      sorter: true,
      filteredValue: [search?.totalSucceed] || null,
      isNumber: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalSucceed",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "totalSucceed",
          hasValue(search["totalSucceed"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "Σ PROGRESS",
      dataIndex: "totalProgress",
      width: 100,
      sorter: true,
      filteredValue: [search?.totalProgress] || null,
      isNumber: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalProgress",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "totalProgress",
          hasValue(search["totalProgress"]),
          searchText,
          text?.toString(),
          false,
          "input",
          search
        ),
    },
    {
      title: "Σ FAILED",
      dataIndex: "totalFailed",
      width: 80,
      sorter: true,
      filteredValue: [search?.totalFailed] || null,
      isNumber: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalFailed",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "totalFailed",
          hasValue(search["totalFailed"]),
          searchText,
          text?.toString(),
          false,
          "input",
          search
        ),
    },
    {
      title: "UPLOAD TYPE",
      dataIndex: "uploadType",
      width: 110,
      sorter: true,
      filteredValue: [search?.uploadType] || null,
      isClassification: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "uploadType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "uploadType",
          hasValue(search["uploadType"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      filteredValue: [search?.status] || null,
      isClassification: true,
      fixed: "right",
      width: 90,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>
        renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          text,
          false,
          "status",
          search
        ),
    },
  ];

  const detailUsageColumns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      isClassification: true,
      sorter: true,
      filteredValue: [search?.district] || null,
      ...getColumnSearchPropsUseFilteredValue(
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      isClassification: true,
      ...getColumnSearchPropsUseFilteredValue(
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      isClassification: true,
      ...getColumnSearchPropsUseFilteredValue(
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PERIOD",
      dataIndex: "period",
      sorter: true,
      filteredValue: [search?.district] || null,
      ...getColumnSearchPropsUseFilteredValue(
        "billingPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (billingPeriod) => moment(billingPeriod).format("MMM YYYY"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      isClassification: true,
      width: 150,
      ...getColumnSearchPropsUseFilteredValue(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => (
        <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
      ),
    },
  ];
  return {
    dataUsage,
    dataBatch,
    columns,
    batchColumns,
    detailUsageColumns,
    data_usage,
    loading,
    page,
    setPage,
    onSort,
    onClickApproval,
    data_approval,
    handleDownload,
    setSearch,
    handleSearch,
    searchInput,
    searchText,
    searchedColumn,
    search,
    setSort,
    setSearchText,
    setSearchedColumn,
    handleLoadMore,
    hasMoreUsage,
    hasMoreBatch,
    sort,
  };
};
