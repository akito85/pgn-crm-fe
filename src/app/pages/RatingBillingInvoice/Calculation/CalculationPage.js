import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, Tabs } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import {
  donwloadedExcel,
  donwloadedHistoryExcel,
  getCalculationPaginate,
  getHistoryCalculationPaginate,
  setFilters,
  clearFilters,
  resetCalculationData,
} from "../../../../redux/slices/rating_billing_invoice/calculation";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
  toTitleCase,
} from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import CardContainer from "../../../../components/CardContainer";

const CalculationPage = () => {
  const {
    data: data_calculation,
    loading,
    filters,
  } = useSelector((state) => state.rbi_calculation);

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [tabHeader, setTabHeader] = useState("Calculation List");

  // Tentukan current tab key
  const currentTabKey =
    tabHeader === "Calculation List"
      ? "calculation_list"
      : "calculation_history";

  // UBAH: Initialize state dari Redux filters
  const [page, setPage] = useState(filters[currentTabKey]?.page || 1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState(filters[currentTabKey]?.sort || "");
  const [search, setSearch] = useState(filters[currentTabKey]?.search || {});
  const [searchedColumn, setSearchedColumn] = useState(
    filters[currentTabKey]?.searchedColumn || "",
  );
  const [searchText, setSearchText] = useState(
    filters[currentTabKey]?.searchText || "",
  );
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("calculationFixedColumns");
      return saved
        ? JSON.parse(saved)
        : { left: ["no"], right: ["typeVal", "status", "action"] };
    } catch (e) {
      return { left: ["no"], right: ["typeVal", "status", "action"] };
    }
  });

  // Save fixedColumns to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(
        "calculationFixedColumns",
        JSON.stringify(fixedColumns),
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  useEffect(() => {
    dispatch(
      setFilters({
        tab: currentTabKey,
        filters: {
          search,
          sort,
          searchText,
          searchedColumn,
          page,
        },
      }),
    );
  }, [search, sort, searchText, searchedColumn, page, currentTabKey, dispatch]);

  useEffect(() => {
    const savedFilters = filters[currentTabKey];
    if (savedFilters) {
      setPage(savedFilters.page || 1);
      setSort(savedFilters.sort || "");
      setSearch(savedFilters.search || {});
      setSearchedColumn(savedFilters.searchedColumn || "");
      setSearchText(savedFilters.searchText || "");
    }
  }, [tabHeader, filters, currentTabKey]);

  useEffect(() => {
    if (selectedBillingPeriod) {
      if (tabHeader === "Calculation List") {
        dispatch(
          getCalculationPaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: 100, // Initial load 100 data
            sort,
            billPeriodId: selectedBillingPeriod,
            isLoadMore: false, // Flag untuk initial load
          }),
        );
      } else {
        const finalSearch = { ...search, billingPeriod: selectedBillingPeriod };
        dispatch(
          getHistoryCalculationPaginate({
            search: encodeURIComponent(JSON.stringify(finalSearch)),
            page: 1,
            pageSize: 100, // Initial load 100 data
            sort,
            isLoadMore: false, // Flag untuk initial load
          }),
        );
      }
      setPage(1);
    }
  }, [dispatch, search, sort, tabHeader, selectedBillingPeriod]);

  // PERUBAHAN: Reset page ke 1 saat search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1); // Reset to 1
      }
      let result = selectedKeys[0];
      if (dataIndex === "isTry") {
        if (selectedKeys[0] !== undefined && selectedKeys[0] !== null) {
          const temp = selectedKeys[0].toString().toLowerCase();
          if (temp === "true") {
            result = "Y";
          } else if (temp === "false") {
            result = "N";
          } else {
            result = temp;
          }
        } else {
          result = selectedKeys[0];
        }
      }
      return {
        ...prevState,
        [dataIndex]: result,
      };
    });
  };

  const handleLoadMore = async () => {
    const totalElements = data_calculation?.page?.totalElements || 0;
    const currentDataLength = data_calculation.result?.length || 0;

    if (currentDataLength >= totalElements) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    if (tabHeader === "Calculation List") {
      await dispatch(
        getCalculationPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          billPeriodId: selectedBillingPeriod,
          isLoadMore: true,
        }),
      );
    } else {
      const finalSearch = { ...search, billingPeriod: selectedBillingPeriod };
      await dispatch(
        getHistoryCalculationPaginate({
          search: encodeURIComponent(JSON.stringify(finalSearch)),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          isLoadMore: true,
        }),
      );
    }
    setPage(nextPage);
  };

  const initialPageSize = 100;

  const hasMore =
    (data_calculation.result?.length || 0) <
    (data_calculation?.page?.totalElements || 0);

  const handleRefresh = () => {
    if (tabHeader === "Calculation List") {
      dispatch(
        getCalculationPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          billPeriodId: selectedBillingPeriod,
          isLoadMore: false,
        }),
      );
    } else {
      const finalSearch = { ...search, billingPeriod: selectedBillingPeriod };
      dispatch(
        getHistoryCalculationPaginate({
          search: encodeURIComponent(JSON.stringify(finalSearch)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          isLoadMore: false,
        }),
      );
    }
    setPage(1);
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        isClassification: true,
        render: (text, object, index) => index + 1,
      },
      {
        key: "calculationCode",
        title: "CALCULATION CODE",
        dataIndex: "calculationCode",
        width: 180,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.calculationCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "calculationCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "calculationCode",
            hasValue(search["calculationCode"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "billingPeriodVal",
        title: "BILLING PERIOD",
        dataIndex: "billingPeriodVal",
        width: 160,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.billingPeriodVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billingPeriodVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datePeriod",
        ),
        render: (text) =>
          renderDateColumn(
            "billingPeriodVal",
            hasValue(search["billingPeriodVal"]),
            searchText,
            text,
            "datePeriod",
            search,
          ),
      },
      {
        key: "billingCycleVal",
        title: "BILLING CYCLE",
        dataIndex: "billingCycleVal",
        width: 160,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.billingCycleVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billingCycleVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "billingCycleVal",
            hasValue(search["billingCycleVal"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "serviceTypeVal",
        title: "SERVICE TYPE",
        dataIndex: "serviceTypeVal",
        width: 160,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.serviceTypeVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "serviceTypeVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "serviceTypeVal",
            hasValue(search["serviceTypeVal"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "sorVal",
        title: "SOR",
        dataIndex: "sorVal",
        width: 180,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.sorVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "sorVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "sorVal",
            hasValue(search["sorVal"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "costCenter",
        title: "COST CENTER",
        dataIndex: "costCenter",
        width: 150,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.costCenter] || null,
        ellipsis: {
          showTitle: false,
        },
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
            true,
            "input",
            search,
          ),
      },
      {
        key: "meterReadingCode",
        title: "METER READING CODE",
        dataIndex: "meterReadingCode",
        width: 200,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.meterReadingCode] || null,
        ellipsis: {
          showTitle: false,
        },
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
            true,
            "input",
            search,
          ),
      },
      {
        key: "customerSegment",
        title: "ACCOUNT SEGMENT",
        dataIndex: "customerSegment",
        width: 190,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.customerSegment] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "customerSegment",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "customerSegment",
            hasValue(search["customerSegment"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "accGroupType",
        title: "ACCOUNT GROUP TYPE",
        dataIndex: "accGroupType",
        width: 200,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.accGroupType] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "accGroupType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "accGroupType",
            hasValue(search["accGroupType"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "custNumb",
        title: "SPECIFIC CUSTOMER ACCOUNT",
        dataIndex: "custNumb",
        width: 250,
        sorter: true,
        filteredValue: [search?.custNumb] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "custNumb",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "custNumb",
            hasValue(search["custNumb"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "scheduleTypeVal",
        title: "SCHEDULE TYPE",
        dataIndex: "scheduleTypeVal",
        width: 170,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.scheduleTypeVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "scheduleTypeVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "scheduleTypeVal",
            hasValue(search["scheduleTypeVal"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
       {
        key: "customer",
        title: "Σ CUSTOMER",
        dataIndex: "customer",
        width: 140,
        isNumber: true,
        sorter: true,
        filteredValue: [search?.customer] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "customer",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "customer",
            hasValue(search["customer"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "succeed",
        title: "Σ SUCCEED",
        dataIndex: "succeed",
        width: 130,
        isNumber: true,
        sorter: true,
        filteredValue: [search?.succeed] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "succeed",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "succeed",
            hasValue(search["succeed"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "progress",
        title: "Σ PROGRESS",
        dataIndex: "progress",
        width: 140,
        isNumber: true,
        sorter: true,
        filteredValue: [search?.progress] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "progress",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "progress",
            hasValue(search["progress"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "failed",
        title: "Σ FAILED",
        dataIndex: "failed",
        width: 130,
        isNumber: true,
        sorter: true,
        filteredValue: [search?.failed] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "failed",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "failed",
            hasValue(search["failed"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "generateDate",
        title: "GENERATE DATE",
        dataIndex: "generateDate",
        width: 160,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.generateDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "generateDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime",
        ),
        render: (text) =>
          renderDateColumn(
            "generateDate",
            hasValue(search["generateDate"]),
            searchText,
            text,
            "datetime",
            search,
          ),
      },
      {
        key: "remark",
        title: "REMARK",
        dataIndex: "remark",
        width: 200,
        sorter: true,
        filteredValue: [search?.remark] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "remark",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "remark",
            hasValue(search["remark"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "completionDate",
        title: "COMPLETION DATE",
        dataIndex: "completionDate",
        width: 160,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.completionDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "completionDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime",
        ),
        render: (text) =>
          renderDateColumn(
            "completionDate",
            hasValue(search["completionDate"]),
            searchText,
            text,
            "datetime",
            search,
          ),
      },
      {
        key: "createdBy",
        title: "CREATE BY",
        dataIndex: "createdBy",
        width: 200,
        sorter: true,
        filteredValue: [search?.createdBy] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdBy",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "createdBy",
            hasValue(search["createdBy"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "typeVal",
        title: "TYPE",
        dataIndex: "typeVal",
        width: 135,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.typeVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "typeVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "typeVal",
            hasValue(search["typeVal"]),
            searchText,
            text,
            false,
            "status",
            search,
          ),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        isClassification: true,
        sorter: true,
        width: 120,
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (index) => {
          let text;
          switch (index) {
            case "INPROGRESS":
              text = "In Progress";
              break;
            case "COMPLETE BILLING":
              text = "Complete Billing";
              break;
            default:
              text = index
                ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
                : index;
              break;
          }
          return text
            ? renderColumn(
                "status",
                hasValue(search["status"]),
                searchText,
                text,
                false,
                "status",
                search,
              )
            : text;
        },
      },
    ],
    [search, searchText, searchedColumn],
  );

  const baseColumnHistory = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 30,
        isClassification: true,
        render: (text, object, index) => index + 1,
      },
      {
        key: "calCode",
        title: "CALCULATION CODE",
        dataIndex: "calCode",
        width: 115,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.calCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "calCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "calCode",
            hasValue(search["calCode"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "custNumb",
        title: "CUSTOMER NUMBER",
        dataIndex: "custNumb",
        width: 120,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.custNumb] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "custNumb",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "custNumb",
            hasValue(search["custNumb"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "custName",
        title: "CUSTOMER NAME",
        dataIndex: "custName",
        width: 120,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.custName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "custName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "custName",
            hasValue(search["custName"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "accNumb",
        title: "ACCOUNT NUMBER",
        dataIndex: "accNumb",
        width: 120,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.accNumb] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "accNumb",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "accNumb",
            hasValue(search["accNumb"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "accName",
        title: "ACCOUNT NAME",
        dataIndex: "accName",
        width: 130,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.accName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "accName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "accName",
            hasValue(search["accName"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "accGroupTypeVal",
        title: "ACCOUNT GROUP TYPE",
        dataIndex: "accGroupTypeVal",
        width: 130,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.accGroupTypeVal] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "accGroupTypeVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "accGroupTypeVal",
            hasValue(search["accGroupTypeVal"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "serviceTypeVal",
        title: "SERVICE TYPE",
        dataIndex: "serviceTypeVal",
        width: 110,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.serviceTypeVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "serviceTypeVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "serviceTypeVal",
            hasValue(search["serviceTypeVal"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "saNumb",
        title: "SA NUMBER",
        dataIndex: "saNumb",
        width: 100,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.saNumb] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "saNumb",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "saNumb",
            hasValue(search["saNumb"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "sorVal",
        title: "SOR",
        dataIndex: "sorVal",
        width: 100,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.sorVal] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "sorVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "sorVal",
            hasValue(search["sorVal"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "costCenterVal",
        title: "COST CENTER",
        dataIndex: "costCenterVal",
        width: 120,
        isClassification: true,
        sorter: true,
        filteredValue: [search?.costCenterVal] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "costCenterVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "costCenterVal",
            hasValue(search["costCenterVal"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "accSegmentVal",
        title: "ACCOUNT SEGMENT",
        dataIndex: "accSegmentVal",
        width: 120,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.accSegmentVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "accSegmentVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "accSegmentVal",
            hasValue(search["accSegmentVal"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "meterReadingCodeVal",
        title: "METER READING CODE",
        dataIndex: "meterReadingCodeVal",
        width: 130,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.meterReadingCodeVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "meterReadingCodeVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "meterReadingCodeVal",
            hasValue(search["meterReadingCodeVal"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "billingCycVal",
        title: "BILLING CYCLE",
        dataIndex: "billingCycVal",
        width: 100,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.billingCycVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billingCycVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "billingCycVal",
            hasValue(search["billingCycVal"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "billingPeriodVal",
        title: "BILLING PERIODE",
        dataIndex: "billingPeriodVal",
        width: 110,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.billingPeriodVal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billingPeriodVal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datePeriod",
        ),
        render: (text) =>
          renderDateColumn(
            "billingPeriodVal",
            hasValue(search["billingPeriodVal"]),
            searchText,
            text,
            "datePeriod",
            search,
          ),
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        width: 100,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.message] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "message",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "message",
            hasValue(search["message"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "calculateAt",
        title: "CALCULATE AT",
        dataIndex: "calculateAt",
        width: 120,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.calculateAt] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "calculateAt",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime",
        ),
        render: (text) =>
          renderDateColumn(
            "calculateAt",
            hasValue(search["calculateAt"]),
            searchText,
            text,
            "datetime",
            search,
          ),
      },
      {
        key: "isTry",
        title: "IS TRY",
        dataIndex: "isTry",
        width: 80,
        sorter: true,
        isClassification: true,
        filteredValue: [search?.isTry] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "isTry",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) => {
          return renderColumn(
            "isTry",
            hasValue(search["isTry"]),
            searchText,
            text?.toString(),
            false,
            "status",
            search,
          );
        },
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        isClassification: true,
        width: 70,
        sorter: true,
        filteredValue: [search?.status] || null,
        // ...getColumnSearchPropsUseFilteredValue(
        //   search,
        //   "status",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch,
        //   true
        // ),
        render: (index) => {
          return renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            toTitleCase(index),
            false,
            "status",
            search,
          );
        },
      },
    ],
    [search, searchText, searchedColumn],
  );

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: "",
      breadcrumbName: "Calculation",
    },
  ];

  const handleDownload = () => {
    if (tabHeader === "Calculation List") {
      dispatch(
        donwloadedExcel({
          page,
          pageSize: loadMoreSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
        }),
      );
    } else {
      dispatch(
        donwloadedHistoryExcel({
          page,
          pageSize: loadMoreSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
        }),
      );
    }
  };

  const tabs = [
    { key: "Calculation List", label: "Calculation List" },
    { key: "Calculation History", label: "Calculation History" },
  ];

  const changeTab = (key) => {
    // Reset data untuk tab yang ditinggalkan
    dispatch(resetCalculationData());

    setTabHeader(key);

    // Restore filters untuk tab yang dipilih
    const newTabKey =
      key === "Calculation List" ? "calculation_list" : "calculation_history";
    const savedFilters = filters[newTabKey];

    if (savedFilters) {
      setSearch(savedFilters.search || {});
      setSearchText(savedFilters.searchText || "");
      setSearchedColumn(savedFilters.searchedColumn || "");
      setSort(savedFilters.sort || "");
      setPage(savedFilters.page || 1);
    } else {
      // Reset ke default jika belum ada saved filters
      setSearch({});
      setSearchText("");
      setSearchedColumn("");
      setSort("");
      setPage(1);
    }
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          onClick={() => {
            handleDownload();
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.CALCULATION_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type={"submit"}
            border={false}
          >
            Create Calculation
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.CALCULATION_DETAIL}
            state={{ id: record?.calJobId }}
            style={{ lineHeight: 0 }}
          >
            <Tooltip title="Detail">
              <SVGIcon name="IconDetail" width={20} />
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(["view"], itemGrantAccess).map(
    (col) => ({
      ...col,
      width: 80,
      align: "center",
    }),
  );

  const allColumns = useMemo(() => {
    const currentBaseColumns =
      tabHeader === "Calculation List" ? baseColumns : baseColumnHistory;
    const currentActionCols =
      tabHeader === "Calculation List" ? actionCols : [];

    const columnsWithKeys = [...currentBaseColumns, ...currentActionCols].map(
      (col) => ({
        ...col,
        key: col.key || col.dataIndex || col.title,
      }),
    );
    return columnsWithKeys;
  }, [baseColumns, baseColumnHistory, actionCols, tabHeader]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px]">CALCULATION JOB LIST</p>
            <Toolbar items={itemGrantAccess} />
          </div>
        }
      >
        <Tabs
          activeKey={tabHeader}
          onChange={changeTab}
          type="line"
          size="small"
          className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-4"
        >
          <Tabs.TabPane tab="Calculation List" key="Calculation List">
            <div className="my-0">
              <TableRBI
                idTable="calculation-table"
                size="small"
                dataSource={data_calculation.result}
                columns={processedColumns}
                totalData={data_calculation?.page?.totalElements || 0}
                tableScrolled={{ x: 2000, y: 525 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                handleDownload={handleDownload}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                showRefresh={true}
                onRefresh={handleRefresh}
                loadMoreThreshold={20}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Calculation History" key="Calculation History">
            <div className="my-0">
              <TableRBI
                idTable="calculation-history-table"
                size="small"
                dataSource={data_calculation.result}
                columns={processedColumns}
                totalData={data_calculation?.page?.totalElements || 0}
                tableScrolled={{ x: 3000, y: 525 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                handleDownload={handleDownload}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                showRefresh={true}
                onRefresh={handleRefresh}
                loadMoreThreshold={20}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </CardContainer>
    </>
  );
};

export default CalculationPage;
