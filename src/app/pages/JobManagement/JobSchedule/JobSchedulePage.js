import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dropdown, Select, Spin } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import BreadCrumb from "../../../../components/BreadCrumb";
import {
  getAllSchedulesPaginate,
  activateSchedule,
  pauseSchedule,
  deleteSchedule,
} from "../../../../redux/slices/job_management/jobScheduleSlice";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";

const PAGE_SIZE = 20;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const date = `${String(d.getDate()).padStart(2, "0")}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${date} ${hh}:${mm}:${ss}`;
};

const STATUS_OPTIONS = [
  { value: "",         label: "ALL" },
  { value: "DRAFT",    label: "DRAFT" },
  { value: "ACTIVE",   label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
];

const PAUSED_OPTIONS = [
  { value: "",      label: "ALL" },
  { value: "true",  label: "Yes" },
  { value: "false", label: "No" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const JobSchedulePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, actionLoading } = useSelector((state) => state.jobSchedule);

  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch { return null; }
  }, [rawToken]);

  const { loading: permissionsLoading } = useGrantAccessHooks();

  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterIsPaused, setFilterIsPaused] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });

  const fetchList = useCallback(() => {
    dispatch(getAllSchedulesPaginate({
      status: filterStatus,
      isPaused: filterIsPaused,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }));
  }, [dispatch, filterStatus, filterIsPaused, currentPage]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleStatusChange = (value) => {
    setFilterStatus(value === "" ? null : value);
    setCurrentPage(1);
  };

  const handlePausedChange = (value) => {
    if (value === "") {
      setFilterIsPaused(null);
    } else if (value === "true") {
      setFilterIsPaused(true);
    } else if (value === "false") {
      setFilterIsPaused(false);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const afterAction = useCallback(() => {
    fetchList();
  }, [fetchList]);

  const handleAction = useCallback((thunk, arg) => {
    dispatch(thunk(arg)).then((res) => {
      if (!res.error) afterAction();
    });
  }, [dispatch, afterAction]);

  // ─── Action Column ────────────────────────────────────────────────────────────

  const actionColumn = useMemo(() => ({
    title: "ACTIONS",
    key: "actions",
    width: 100,
    align: "center",
    fixed: "right",
    render: (_, record) => {
      if (permissionsLoading) {
        return <span>—</span>;
      }
      if (!record || !record.scheduleId) return <span>—</span>;

      const showActivate = record.status === "DRAFT" || record.isPaused === true;
      const showPause    = record.status === "ACTIVE" && record.isPaused === false;

      const menuItems = [
        ...(showActivate ? [{
          key: "activate",
          label: "Activate",
          onClick: () => handleAction(activateSchedule, record.scheduleId),
        }] : []),
        ...(showPause ? [{
          key: "pause",
          label: "Pause",
          onClick: () => handleAction(pauseSchedule, record.scheduleId),
        }] : []),
        {
          key: "view",
          label: "View",
          onClick: () => navigate(JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULE_DETAIL, { state: { id: record.scheduleId } }),
        },
        {
          key: "delete",
          label: "Delete",
          onClick: () => {
            if (window.confirm("Delete this schedule?")) {
              handleAction(deleteSchedule, record.scheduleId);
            }
          },
        },
      ];

      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
              onClick={(e) => e.stopPropagation()}
              type="button"
              disabled={actionLoading}
            >
              <IconThreeDots />
            </button>
          </Dropdown>
        </div>
      );
    },
  }), [permissionsLoading, handleAction, navigate, actionLoading]);

  // ─── Columns ─────────────────────────────────────────────────────────────────

  const baseColumns = useMemo(() => [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => (currentPage - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: "SCHEDULE NAME",
      dataIndex: "scheduleName",
      key: "scheduleName",
      align: "left",
    },
    {
      title: "JOB CODE",
      dataIndex: "jobCode",
      key: "jobCode",
      align: "left",
      width: 140,
    },
    {
      title: "JOB NAME",
      dataIndex: "jobName",
      key: "jobName",
      align: "left",
    },
    {
      title: "TYPE",
      dataIndex: "scheduleType",
      key: "scheduleType",
      align: "center",
      width: 100,
      render: (val) => val || "—",
    },
    {
      title: "EXPRESSION",
      key: "expression",
      align: "left",
      width: 160,
      render: (_, record) => {
        if (record.scheduleType === "CRON") return record.cronExpression || "—";
        if (record.intervalSeconds != null) return `${record.intervalSeconds}s`;
        return "—";
      },
    },
    {
      title: "TIMEZONE",
      dataIndex: "timezone",
      key: "timezone",
      align: "left",
      width: 150,
      render: (val) => val || "—",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (val) => {
        if (!val) return "—";
        const text = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
        const colourMap = {
          draft:    "draft",
          active:   "active",
          inactive: "inactive",
        };
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "22px", overflow: "hidden" }}>
            <StatusComponent colour={colourMap[val.toLowerCase()] || val.toLowerCase()} size="small">
              {text}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "PAUSED",
      dataIndex: "isPaused",
      key: "isPaused",
      align: "center",
      width: 90,
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "NEXT RUN",
      dataIndex: "nextRunTime",
      key: "nextRunTime",
      align: "left",
      width: 175,
      render: (val) => formatDate(val),
    },
    {
      title: "LAST RUN",
      dataIndex: "lastRunTime",
      key: "lastRunTime",
      align: "left",
      width: 175,
      render: (val) => formatDate(val),
    },
    actionColumn,
  ], [actionColumn, currentPage]);

  const allColumns = useMemo(() =>
    baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    })), [baseColumns]);

  const processedColumns = useMemo(
    () => nxApplyFixedColumns(allColumns, fixedColumns),
    [allColumns, fixedColumns]
  );

  const columnDefinitions = useMemo(
    () => allColumns.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [allColumns]
  );

  const routes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: "", breadcrumbName: "Schedule List" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxCardContainer header="SCHEDULE LIST">
        {actionLoading && (
          <div style={{ textAlign: "center", padding: 8 }}>
            <Spin size="small" /> Processing...
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Select
            style={{ width: 160 }}
            value={filterStatus ?? ""}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
            placeholder="Status"
          />
          <Select
            style={{ width: 140 }}
            value={filterIsPaused === null ? "" : String(filterIsPaused)}
            onChange={handlePausedChange}
            options={PAUSED_OPTIONS}
            placeholder="Paused"
          />
        </div>

        <NxTable
          idTable="job-schedule-list-table"
          userId={userId}
          dataSource={data?.content || []}
          totalData={data?.totalElements || 0}
          current={currentPage}
          pageSize={PAGE_SIZE}
          loading={loading}
          columns={processedColumns}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          tableScrolled={{ y: 500, x: "max-content" }}
          usePagination={true}
          useInfiniteScroll={false}
          onChange={handlePageChange}
          showExport={false}
        />
      </NxCardContainer>
    </>
  );
};

export default JobSchedulePage;
