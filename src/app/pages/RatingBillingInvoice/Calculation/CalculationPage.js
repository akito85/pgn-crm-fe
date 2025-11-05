import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import {
  donwloadedExcel,
  donwloadedHistoryExcel,
  getCalculationPaginate,
  getHistoryCalculationPaginate,
} from "../../../../redux/slices/rating_billing_invoice/calculation";
import { hasValue, renderColumn, renderDateColumn, toTitleCase } from "../../../../utils";
import RadioTabs from "../../../../components/RadioTabs";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const CalculationPage = () => {
  // Selector
  const { data: data_calculation, loading } = useSelector(
    (state) => state.rbi_calculation
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [tabHeader, setTabHeader] = useState("Calculation List");

  // use effect
  useEffect(() => {
    if (tabHeader === "Calculation List") {
      dispatch(
        getCalculationPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    } else {
      dispatch(
        getHistoryCalculationPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, search, page, pageSize, sort, tabHeader]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
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

  const column = useMemo(() => [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "calculationCode",
      title: "CALCULATION CODE",
      dataIndex: "calculationCode",
      sorter: true,
      align: "left",
      filteredValue: [search?.calculationCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calculationCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "calculationCode",
          hasValue(search["calculationCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "customer",
      title: "Σ CUSTOMER",
      dataIndex: "customer",
      align: "right",
      sorter: true,
      filteredValue: [search?.customer] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customer",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customer",
          hasValue(search["customer"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "succeed",
      title: "Σ SUCCEED",
      dataIndex: "succeed",
      align: "right",
      sorter: true,
      filteredValue: [search?.succeed] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "succeed",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "succeed",
          hasValue(search["succeed"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "progress",
      title: "Σ PROGRESS",
      dataIndex: "progress",
      align: "right",
      sorter: true,
      filteredValue: [search?.progress] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "progress",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "progress",
          hasValue(search["progress"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "failed",
      title: "Σ FAILED",
      dataIndex: "failed",
      align: "right",
      sorter: true,
      filteredValue: [search?.failed] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "failed",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "failed",
          hasValue(search["failed"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billingCycleVal",
      title: "BILLING CYCLE",
      dataIndex: "billingCycleVal",
      align: "center",
      sorter: true,
      filteredValue: [search?.billingCycleVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCycleVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billingCycleVal",
          hasValue(search["billingCycleVal"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billingPeriodVal",
      title: "BILLING PERIOD",
      dataIndex: "billingPeriodVal",
      align: "center",
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
        "datePeriod"
      ),
      render: (text) =>
        renderDateColumn(
          "billingPeriodVal",
          hasValue(search["billingPeriodVal"]),
          searchText,
          text,
          "datePeriod",
          search
        ),
    },
    {
      key: "serviceTypeVal",
      title: "SERVICE TYPE",
      dataIndex: "serviceTypeVal",
      align: "center",
      sorter: true,
      filteredValue: [search?.serviceTypeVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serviceTypeVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "serviceTypeVal",
          hasValue(search["serviceTypeVal"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "sorVal",
      title: "SOR",
      dataIndex: "sorVal",
      align: "left",
      sorter: true,
      filteredValue: [search?.sorVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "sorVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "sorVal",
          hasValue(search["sorVal"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "costCenter",
      title: "COST CENTER",
      dataIndex: "costCenter",
      align: "left",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "costCenter",
          hasValue(search["costCenter"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "meterReadingCode",
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      align: "left",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "meterReadingCode",
          hasValue(search["meterReadingCode"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "customerSegment",
      title: "ACCOUNT SEGMENT",
      dataIndex: "customerSegment",
      align: "center",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "customerSegment",
          hasValue(search["customerSegment"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "accGroupType",
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accGroupType",
      align: "center",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "accGroupType",
          hasValue(search["accGroupType"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "custNumb",
      title: "SPECIFIC CUSTOMER ACCOUNT",
      dataIndex: "custNumb",
      align: "left",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "custNumb",
          hasValue(search["custNumb"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "scheduleTypeVal",
      title: "SCHEDULE TYPE",
      dataIndex: "scheduleTypeVal",
      align: "center",
      sorter: true,
      filteredValue: [search?.scheduleTypeVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "scheduleTypeVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "scheduleTypeVal",
          hasValue(search["scheduleTypeVal"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "generateDate",
      title: "GENERATE DATE",
      dataIndex: "generateDate",
      align: "center",
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
        "date"
      ),
      render: (text) =>
        renderDateColumn(
          "generateDate",
          hasValue(search["generateDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      key: "remark",
      title: "REMARK",
      dataIndex: "remark",
      align: "left",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "remark",
          hasValue(search["remark"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "typeVal",
      title: "TYPE",
      dataIndex: "typeVal",
      align: "center",
      sorter: true,
      filteredValue: [search?.typeVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "typeVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "typeVal",
          hasValue(search["typeVal"]),
          searchText,
          text,
          false,
          "status",
          search
        ),
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      align: "center",
      sorter: true,
      width: 150,
      filteredValue: [search?.status] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
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
            search
          )
          : text;
      },
    },
  ], [page, pageSize, search, searchText, searchedColumn]);

  // column history
  const columnHistory = useMemo(() => [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "calCode",
      title: "CALCULATION CODE",
      dataIndex: "calCode",
      sorter: true,
      filteredValue: [search?.calCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "calCode",
          hasValue(search["calCode"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "custNumb",
      title: "CUSTOMER NUMBER",
      dataIndex: "custNumb",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "custNumb",
          hasValue(search["custNumb"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "custName",
      title: "CUSTOMER NAME",
      dataIndex: "custName",
      sorter: true,
      filteredValue: [search?.custName] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "custName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "custName",
          hasValue(search["custName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "accNumb",
      title: "ACCOUNT NUMBER",
      dataIndex: "accNumb",
      sorter: true,
      filteredValue: [search?.accNumb] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accNumb",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accNumb",
          hasValue(search["accNumb"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "accName",
      title: "ACCOUNT NAME",
      dataIndex: "accName",
      sorter: true,
      filteredValue: [search?.accName] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accName",
          hasValue(search["accName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "accGroupTypeVal",
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accGroupTypeVal",
      sorter: true,
      align: "center",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "accGroupTypeVal",
          hasValue(search["accGroupTypeVal"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "serviceTypeVal",
      title: "SERVICE TYPE",
      dataIndex: "serviceTypeVal",
      sorter: true,
      align: "center",
      filteredValue: [search?.serviceTypeVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serviceTypeVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "serviceTypeVal",
          hasValue(search["serviceTypeVal"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "saNumb",
      title: "SA NUMBER",
      dataIndex: "saNumb",
      sorter: true,
      align: "center",
      filteredValue: [search?.saNumb] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "saNumb",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "saNumb",
          hasValue(search["saNumb"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "sorVal",
      title: "SOR",
      dataIndex: "sorVal",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "sorVal",
          hasValue(search["sorVal"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "costCenterVal",
      title: "COST CENTER",
      dataIndex: "costCenterVal",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "costCenterVal",
          hasValue(search["costCenterVal"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "accSegmentVal",
      title: "ACCOUNT SEGMENT",
      dataIndex: "accSegmentVal",
      sorter: true,
      align: "center",
      filteredValue: [search?.accSegmentVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accSegmentVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accSegmentVal",
          hasValue(search["accSegmentVal"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "meterReadingCodeVal",
      title: "METER READING CODE",
      dataIndex: "meterReadingCodeVal",
      sorter: true,
      align: "center",
      filteredValue: [search?.meterReadingCodeVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "meterReadingCodeVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "meterReadingCodeVal",
          hasValue(search["meterReadingCodeVal"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billingCycVal",
      title: "BILLING CYCLE",
      dataIndex: "billingCycVal",
      sorter: true,
      align: "center",
      filteredValue: [search?.billingCycVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCycVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billingCycVal",
          hasValue(search["billingCycVal"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billingPeriodVal",
      title: "BILLING PERIODE",
      dataIndex: "billingPeriodVal",
      sorter: true,
      align: "center",
      filteredValue: [search?.billingPeriodVal] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingPeriodVal",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datePeriod"
      ),
      render: (text) =>
        renderDateColumn(
          "billingPeriodVal",
          hasValue(search["billingPeriodVal"]),
          searchText,
          text,
          "datePeriod",
          search
        ),
    },
    {
      key: "message",
      title: "MESSAGE",
      dataIndex: "message",
      sorter: true,
      align: "left",
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
        true
      ),
      render: (text) =>
        renderColumn(
          "message",
          hasValue(search["message"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      key: "calculateAt",
      title: "CALCULATE AT",
      dataIndex: "calculateAt",
      sorter: true,
      align: "center",
      filteredValue: [search?.calculateAt] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calculateAt",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datetime"
      ),
      render: (text) =>
        renderDateColumn(
          "calculateAt",
          hasValue(search["calculateAt"]),
          searchText,
          text,
          "datetime",
          search
        ),
    },
    {
      key: "isTry",
      title: "IS TRY",
      dataIndex: "isTry",
      sorter: true,
      align: "center",
      filteredValue: [search?.isTry] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "isTry",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        return renderColumn('isTry', hasValue(search['isTry']), searchText, text?.toString(), false, 'status', search)
      }
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      align: "center",
      width: 150,
      sorter: true,
      filteredValue: [search?.status] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (index) => {
        return renderColumn('status', hasValue(search['status']), searchText, toTitleCase(index), false, 'status', search)
      },
    },
  ], [page, pageSize, search, searchText, searchedColumn]);

  // onSort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
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
          pageSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
        })
      );
    } else {
      dispatch(
        donwloadedHistoryExcel({
          page,
          pageSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
        })
      );
    }
  };

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // data tabs
  const tabs = [
    { value: "Calculation List" },
    { value: "Calculation History" },
  ];

  // onchange tabs
  const changeTab = (e) => {
    setTabHeader((prevState) => {
      const tempTab = e.target.value;
      if (prevState !== tempTab) {
        setPage(1);
        setPageSize(10);
        setSearch({});
        setSort("");
        setSearchText("");
        setSearchedColumn("");
      }
      return tempTab;
    });
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          onClick={handleDownload}
        >
          Download
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.CALCULATION_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type={"submit"}
            border={false}
          >
            Create Calculation
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.CALCULATION_DETAIL}
            state={{ id: record?.calJobId }}
          >
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  const columnActionPermission = useColumnActionPermission(
    ["view"],
    itemGrantAccess
  );

  const columns = useMemo(() => {
    if (tabHeader === "Calculation List") {
      return [...column, ...columnActionPermission]
    } else {
      return columnHistory;
    }
  }, [column, columnActionPermission, columnHistory, tabHeader]);

  console.log(data_calculation, ' data calculation');

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <div className="w-full justify-end flex gap-2">
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"CALCULATION JOB LIST"}>
          <RadioTabs
            data={tabs}
            onChange={changeTab}
            currentPosition={tabHeader}
          />
          <div className="my-5">
            <TablePaginationNew
              columns={columns}
              dataSource={data_calculation.result}
              totalData={data_calculation?.page?.totalElements || 0}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              tableScrolled={{ x: 6000, y: 525 }}
              onSort={onSort}
              useFixColumn={true}
              defaultFixedColumns={{
                no: "left",
                status: "right",
                action: "right",
              }}
            />
          </div>
        </BaseContainer>
      </LayoutMenu>
    </Spin>
  );
};

export default CalculationPage;