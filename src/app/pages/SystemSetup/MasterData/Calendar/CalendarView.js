import {
  Tooltip,
  Spin,
  Tabs,
  Calendar,
  Badge,
  Select,
  Radio,
} from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import Toolbar from "../../../../../components/Toolbar";
import TableRBI from "../../../../../components/TableRBI";
import SVGIcon from "../../../../../assets/Icon/index";
import IconViewList from "../../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../../assets/Icon/Nx/IconEdit";
import IconActive from "../../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../../assets/icons/nx/IconInactive";
import {
  getListCalendar,
  inactiveCalendar,
  downloadCalendar,
  getApprovalHistory,
  getAvailableApproval,
  getSelectedApproval,
  getCalendarByMonthYear,
} from "../../../../../redux/slices/system_setup/master_data/calendar";
import { renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";

dayjs.extend(weekday);
dayjs.extend(localeData);

const { TabPane } = Tabs;

const CalendarView = () => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [calendarMode, setCalendarMode] = useState("month");
  const [calendarDate, setCalendarDate] = useState(dayjs());

  // Modal States
  const [modalInactive, setModalInactive] = useState(false);
  const [chooseId, setChooseId] = useState(null);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // Fixed columns state
  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("calendarFixedColumns");
    return saved
      ? JSON.parse(saved)
      : {
          left: ["no"],
          right: ["status", "statusApproval", "action"],
        };
  });

  useEffect(() => {
    localStorage.setItem("calendarFixedColumns", JSON.stringify(fixedColumns));
  }, [fixedColumns]);

  const {
    loading,
    data,
    pagination,
    data_approval_history,
    data_by_month_year,
    loading_calendar,
  } = useSelector((state) => state.calendar);

  // Handle Refresh
  const handleRefresh = useCallback(() => {
    const searchObject = Object.keys(search)
      .filter((key) => search[key])
      .reduce((obj, key) => {
        obj[key] = search[key];
        return obj;
      }, {});

    const sortArray = sort ? [sort] : [];

    dispatch(
      getListCalendar({
        page: 1,
        size: 100,
        sort: sortArray,
        search: searchObject,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, search, sort]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Fetch calendar events when calendar tab is active or date changes
  useEffect(() => {
    if (activeTab === "calendar") {
      dispatch(
        getCalendarByMonthYear({
          month: calendarDate.month() + 1,
          year: calendarDate.year(),
        }),
      );
    }
  }, [activeTab, calendarDate, dispatch]);

  // Approval History Effect
  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.MASTER_CALLENDAR || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_MASTER_CALLENDAR ||
            [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.MASTER_CALLENDAR || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_MASTER_CALLENDAR || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [data_approval_history]);

  const handleOptions = () => {
    const historyData = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(historyData);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistory = (record) => {
    dispatch(getApprovalHistory(record.calendarId));
    setOpenModalHistory(true);
  };

  const handleCancelInactive = () => {
    setChooseId(null);
    setModalInactive(false);
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      id: chooseId.calendarId,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveCalendar(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelInactive();
        handleRefresh();
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  const handleInactive = (record) => {
    setChooseId(record);
    setModalInactive(true);
  };

  const handleRetry = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination?.totalPages || 0;

    if (nextPage <= totalPages) {
      const searchObject = Object.keys(search)
        .filter((key) => search[key])
        .reduce((obj, key) => {
          obj[key] = search[key];
          return obj;
        }, {});

      const sortArray = sort ? [sort] : [];

      await dispatch(
        getListCalendar({
          page: nextPage,
          size: loadMoreSize,
          sort: sortArray,
          search: searchObject,
          isLoadMore: true,
        }),
      );
      setPage(nextPage);
    }
  };

  const currentData = useMemo(() => data || [], [data]);
  const hasMore = currentData.length < (pagination?.totalElements || 0);

  // Handle Search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (!selectedKeys[0]) {
        const newState = { ...prevState };
        delete newState[dataIndex];
        return newState;
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Handle Sort
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Calendar helpers
  const HOLIDAY_TYPE_STATUS = {
    NATIONAL: "error", // red
    JOINT: "processing", // blue
    OTHER: "success", // green
  };

  const getEventsForDate = (date) => {
    if (!Array.isArray(data_by_month_year)) return [];
    return data_by_month_year.filter((event) => {
      const start = dayjs(event.startDate).startOf("day");
      const end = dayjs(event.endDate).endOf("day");
      return (
        (date.isAfter(start) || date.isSame(start, "day")) &&
        (date.isBefore(end) || date.isSame(end, "day"))
      );
    });
  };

  const dateCellRender = (date) => {
    const events = getEventsForDate(date);
    if (!events.length) return null;
    return (
      <ul
        className="events"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {events.slice(0, 3).map((event, i) => {
          const status = HOLIDAY_TYPE_STATUS[event.holidayType] || "default";
          return (
            <li key={i}>
              <Tooltip
                title={`${event.calendarName} (${event.startDate ? dayjs(event.startDate).format("DD MMM") : ""} - ${event.endDate ? dayjs(event.endDate).format("DD MMM YYYY") : ""})`}
              >
                <Badge status={status} text={event.calendarName} />
              </Tooltip>
            </li>
          );
        })}
        {events.length > 3 && (
          <li style={{ color: "#8c8c8c", fontSize: 11 }}>
            +{events.length - 3} more
          </li>
        )}
      </ul>
    );
  };

  const monthCellRender = (date) => {
    const monthEvents = Array.isArray(data_by_month_year)
      ? data_by_month_year.filter((event) => {
          const start = dayjs(event.startDate);
          const end = dayjs(event.endDate);
          return (
            (start.year() === date.year() && start.month() === date.month()) ||
            (end.year() === date.year() && end.month() === date.month())
          );
        })
      : [];
    if (!monthEvents.length) return null;
    return (
      <div className="notes-month">
        {monthEvents.slice(0, 3).map((event, i) => {
          const status = HOLIDAY_TYPE_STATUS[event.holidayType] || "default";
          return (
            <div key={i}>
              <Badge status={status} text={event.calendarName} />
            </div>
          );
        })}
        {monthEvents.length > 3 && (
          <span style={{ color: "#8c8c8c", fontSize: 11 }}>
            +{monthEvents.length - 3} more
          </span>
        )}
      </div>
    );
  };

  const calendarHeaderRender = ({ value, onChange }) => {
    const currentYear = value.year();
    const currentMonth = value.month();

    const yearOptions = [];
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
      yearOptions.push({ label: String(y), value: y });
    }

    const monthOptions = dayjs.months
      ? dayjs.months().map((m, i) => ({ label: m, value: i }))
      : Array.from({ length: 12 }, (_, i) => ({
          label: dayjs().month(i).format("MMM"),
          value: i,
        }));

    return (
      <div className="flex justify-end items-center gap-2 px-2 pb-2">
        <Select
          size="small"
          value={currentYear}
          options={yearOptions}
          onChange={(y) => {
            const next = value.year(y);
            onChange(next);
            setCalendarDate(next);
          }}
          style={{ width: 90 }}
        />
        <Select
          size="small"
          value={currentMonth}
          options={monthOptions}
          onChange={(m) => {
            const next = value.month(m);
            onChange(next);
            setCalendarDate(next);
          }}
          style={{ width: 90 }}
        />
        <Radio.Group
          size="small"
          value={calendarMode}
          onChange={(e) => setCalendarMode(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="year">Year</Radio.Button>
        </Radio.Group>
      </div>
    );
  };

  // Handle Download
  const handleDownload = () => {
    const searchObject = Object.keys(search)
      .filter((key) => search[key])
      .reduce((obj, key) => {
        obj[key] = search[key];
        return obj;
      }, {});

    const sortArray = sort ? [sort] : [];

    dispatch(
      downloadCalendar({
        page: 1,
        size: pagination?.totalElements || 1000,
        sort: sortArray,
        search: searchObject,
      }),
    )
      .unwrap()
      .catch((error) => {
        const message =
          error?.message || error?.response?.data?.message || "Download failed";
        setBodyError({ message });
        setModalError(true);
      });
  };

  // Breadcrumbs
  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_CALENDAR, breadcrumbName: "Calendar" },
  ];

  // Grant Access Items
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_CALENDAR}>
          <ButtonComponent
            icon={
              <SVGIcon name="IconButtonCreate" style={{ fontsSize: "20" }} />
            }
            type="submit"
          >
            Create Calendar
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column action: View (Detail)
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <Link
            to={SYSTEM_SETUP_ROUTES.DETAIL_CALENDAR}
            state={{ id: record.calendarId }}
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
          >
            <IconViewList width={20} />
          </Link>
        </Tooltip>
      ),
    },

    // Column action: Update
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";

        const content =
          data > 3 ? (
            isEditable ? (
              <Link
                to={SYSTEM_SETUP_ROUTES.UPDATE_CALENDAR}
                state={{
                  id: record.calendarId,
                  status: record.status,
                  statusApproval: record.statusApproval,
                }}
              >
                <ButtonComponent
                  icon={<SVGIcon name="IconEdit" color="#0075bf" width={20} />}
                  border={false}
                  type={"action"}
                >
                  <span className="text-black ml-0">Update</span>
                </ButtonComponent>
              </Link>
            ) : (
              <div className="flex items-center cursor-not-allowed px-2 py-1">
                <span className="pointer-events-none">
                  <SVGIcon name="IconEdit" color="#8D91A0" width={20} />
                </span>
                <span className="text-gray-400 ml-4 pointer-events-none">
                  Update
                </span>
              </div>
            )
          ) : isEditable ? (
            <Tooltip title="Update">
              <Link
                to={SYSTEM_SETUP_ROUTES.UPDATE_CALENDAR}
                state={{
                  id: record.calendarId,
                  status: record.status,
                  statusApproval: record.statusApproval,
                }}
                className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
              >
                <IconEditNx width={20} />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Update">
              <div className="inline-flex items-center cursor-not-allowed text-gray-300">
                <span className="pointer-events-none">
                  <IconEditNx width={20} />
                </span>
              </div>
            </Tooltip>
          );

        return content;
      },
    },

    // Column action: Activate / Inactivate
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        const canInactivate =
          record.statusApproval === "APPROVED" && record.status === "ACTIVE";

        const Content =
          data_length > 3 ? (
            canInactivate ? (
              <ButtonComponent
                icon={<SVGIcon name="IconInactive" width={20} />}
                type={"action"}
                border={false}
                onClick={() => handleInactive(record)}
              >
                <span className="ml-1 text-black">
                  {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
                </span>
              </ButtonComponent>
            ) : (
              <div className="flex items-center px-2 py-1">
                <span className="text-gray-400">
                  {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
                </span>
              </div>
            )
          ) : (
            <Tooltip
              title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
            >
              {canInactivate
                ? <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={() => handleInactive(record)}>
                    <IconInactive width={20} />
                  </span>
                : <span className="inline-flex items-center text-gray-300 cursor-not-allowed">
                    <IconInactive width={20} />
                  </span>
              }
            </Tooltip>
          );

        return Content;
      },
    },

    // Column action: Approval History
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
              }
              type={"action"}
              border={false}
              onClick={() => handleApprovalHistory(record)}
            >
              <span className={"text-black ml-0"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div className="pt-1">
                <SVGIcon
                  name="IconLogHistory"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => handleApprovalHistory(record)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  const actionColumns = useColumnActionPermission(
    ["view", "update", "activate", "history"],
    itemGrantAccess,
  );

  const baseColumns = useMemo(() => {
    const cols = [
      {
        title: "NO",
        key: "no",
        width: 90,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "NAME",
        dataIndex: "calendarName",
        key: "calendarName",
        sorter: true,
        filteredValue: search?.calendarName ? [search.calendarName] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "calendarName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "calendarName",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        key: "startDate",
        sorter: true,
        align: "center",
        filteredValue: search?.startDate ? [search.startDate] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "startDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "date",
        ),
        render: (v) =>
          renderDateColumn(
            "startDate",
            searchedColumn,
            searchText,
            v,
            "date",
            search,
          ),
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        key: "endDate",
        sorter: true,
        align: "center",
        filteredValue: search?.endDate ? [search.endDate] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "endDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "date",
        ),
        render: (v) =>
          renderDateColumn(
            "endDate",
            searchedColumn,
            searchText,
            v,
            "date",
            search,
          ),
      },
      {
        title: "CRITERIA",
        dataIndex: "criteria",
        key: "criteria",
        sorter: true,
        filteredValue: search?.criteria ? [search.criteria] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "criteria",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "criteria",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        width: 110,
        sorter: true,
        filteredValue: search?.status ? [search.status] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "status",
            searchedColumn,
            searchText,
            text ? text.toUpperCase() : text,
            false,
            "status",
          ),
      },
      {
        title: "APPROVAL STATUS",
        dataIndex: "statusApproval",
        key: "statusApproval",
        width: 150,
        sorter: true,
        filteredValue: search?.statusApproval ? [search.statusApproval] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "statusApproval",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          false,
          "input",
        ),
        render: (text) =>
          renderColumn(
            "statusApproval",
            searchedColumn,
            searchText,
            text ? text.toUpperCase() : text,
            false,
            "status",
          ),
      },
      ...actionColumns.map((col) =>
        col.key === "action" ? { ...col, width: 80 } : col,
      ),
    ];

    return cols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [search, searchedColumn, searchText, actionColumns]);

  const columnDefinitions = useMemo(
    () =>
      baseColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [baseColumns],
  );

  const columns = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    baseColumns.forEach((col) => {
      const colKey = col.key || col.dataIndex || col.title;
      if (fixedColumns.left.includes(colKey)) {
        leftFixed.push({ ...col, fixed: "left" });
      } else if (fixedColumns.right.includes(colKey)) {
        rightFixed.push({ ...col, fixed: "right" });
      } else {
        normal.push({ ...col, fixed: undefined });
      }
    });

    return [...leftFixed, ...normal, ...rightFixed];
  }, [baseColumns, fixedColumns]);

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px] text-primary">CALENDAR</p>
              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="w-full"
          >
            <TabPane tab="Table View" key="table">
              <div className="w-full">
                <TableRBI
                  idTable="calendarTable"
                  dataSource={currentData}
                  columns={columns}
                  current={page}
                  pageSize={loadMoreSize}
                  totalData={pagination?.totalElements || 0}
                  loading={loading}
                  onSort={onSort}
                  tableScrolled={{ y: 500, x: 1000 }}
                  handleDownload={handleDownload}
                  columnDefinitions={columnDefinitions}
                  fixedColumns={fixedColumns}
                  setFixedColumns={setFixedColumns}
                  useInfiniteScroll={true}
                  usePagination={false}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  showRefresh={true}
                  onRefresh={handleRefresh}
                  refreshLabel="Refresh"
                />
              </div>
            </TabPane>

            <TabPane tab="Calendar View" key="calendar">
              <Spin spinning={loading_calendar}>
                <Calendar
                  value={calendarDate}
                  mode={calendarMode}
                  onPanelChange={(date, mode) => {
                    setCalendarDate(date);
                    setCalendarMode(mode);
                  }}
                  dateCellRender={dateCellRender}
                  monthCellRender={monthCellRender}
                  headerRender={calendarHeaderRender}
                />
                {/* Legend */}
                <div className="flex gap-4 px-4 pb-3 pt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs">
                    <Badge status="error" />
                    <span>National Holiday</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <Badge status="processing" />
                    <span>Joint Holiday</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <Badge status="success" />
                    <span>Other</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <Badge status="default" />
                    <span>Normal Event</span>
                  </span>
                </div>
              </Spin>
            </TabPane>
          </Tabs>
        </CardContainer>

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={1000}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />

        {/* Modal Inactivate */}
        <ModalInactivateWithHierarchy
          selector={"calendar"}
          dispatch={dispatch}
          getAPIOption={getAvailableApproval}
          getAPIDetail={getSelectedApproval}
          alertMessage={`Are you sure you want to ${
            chooseId?.status === "ACTIVE" ? "inactivate" : "activate"
          } this Calendar "${chooseId?.name || ""}"?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancelInactive}
          onFinish={handleOk}
        />

        {/* Modal Error */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not updated. ${bodyError.message || ""}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default CalendarView;
