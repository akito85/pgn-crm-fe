import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dropdown, Skeleton, Spin } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import StatusComponent from "../../../../components/StatusComponent";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  getAllSchedulesPaginate,
  activateSchedule,
  pauseSchedule,
  deleteSchedule,
} from "../../../../redux/slices/job_management/jobScheduleSlice";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";
import IconPower from "../../../../assets/Icon/Nx/IconPower";
import IconSuspend from "../../../../assets/Icon/Nx/IconSuspend";
import IconDeleteMenu from "../../../../assets/Icon/Nx/IconDeleteMenu";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";

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

  const [page, setPage] = useState(1);
  const [accumulatedData, setAccumulatedData] = useState([]);
  const [refreshToken, setRefreshToken] = useState(0);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const fetchList = useCallback(() => {
    dispatch(getAllSchedulesPaginate({ page, pageSize: PAGE_SIZE }));
  }, [dispatch, page, refreshToken]);

  useEffect(() => { fetchList(); }, [fetchList]);

  useEffect(() => {
    if (!data?.content) return;
    if (page === 1) {
      setAccumulatedData(data.content);
    } else {
      setAccumulatedData((prev) => {
        const existingIds = new Set(prev.map((item) => item.scheduleId));
        const newItems = data.content.filter((item) => !existingIds.has(item.scheduleId));
        return [...prev, ...newItems];
      });
    }
  }, [data?.content, page]);

  const handleLoadMore = () => {
    const totalPages = data?.totalPages || 0;
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const hasMore = accumulatedData.length < (data?.totalElements || 0);

  const afterAction = useCallback(() => {
    setPage(1);
    setAccumulatedData([]);
    setRefreshToken((n) => n + 1);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete) return;
    setDeleteModalOpen(false);
    const res = await dispatch(deleteSchedule(scheduleToDelete.scheduleId));
    if (!res.error) afterAction();
    setScheduleToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setScheduleToDelete(null);
  };

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
        return (
          <div style={{ width: "100%", height: 14, overflow: "hidden", borderRadius: 20 }}>
            <Skeleton.Button active size="small" shape="round" block />
          </div>
        );
      }
      if (!record || !record.scheduleId) return <span>—</span>;

      const showActivate = record.status === "DRAFT" || record.isPaused === true;
      const showPause    = record.status === "ACTIVE" && record.isPaused === false;

      const menuItems = [
        ...(showActivate ? [{
          key: "activate",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconPower width="16" height="16" /> Activate
            </span>
          ),
          onClick: () => handleAction(activateSchedule, record.scheduleId),
        }] : []),
        ...(showPause ? [{
          key: "pause",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconSuspend width="16" height="16" /> Pause
            </span>
          ),
          onClick: () => handleAction(pauseSchedule, record.scheduleId),
        }] : []),
        {
          key: "view",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ViewListIcon width="16" height="16" /> View
            </span>
          ),
          onClick: () => navigate(JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULE_DETAIL, { state: { id: record.scheduleId } }),
        },
        {
          key: "delete",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconDeleteMenu width="16" height="16" /> Delete
            </span>
          ),
          onClick: () => {
            setScheduleToDelete(record);
            setDeleteModalOpen(true);
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
            >
              <IconThreeDots />
            </button>
          </Dropdown>
        </div>
      );
    },
  }), [permissionsLoading, handleAction, navigate]);

  // ─── Columns ─────────────────────────────────────────────────────────────────

  const baseColumns = useMemo(() => [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
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
  ], [actionColumn]);

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

        <NxTable
          idTable="job-schedule-list-table"
          userId={userId}
          dataSource={accumulatedData}
          totalData={data?.totalElements}
          current={page}
          loading={loading}
          columns={processedColumns}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          tableScrolled={{ y: 500, x: "max-content" }}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          showExport={false}
        />
      </NxCardContainer>

      {/* Delete Confirmation Modal */}
      <NxModal
        isOpen={deleteModalOpen}
        title="Delete Schedule"
        loading={actionLoading}
        handleCancel={handleDeleteCancel}
        width={480}
        footer={[
          <div className="flex flex-row justify-between items-center">
            <ButtonComponent size={"small"} key="cancel" onClick={handleDeleteCancel} disabled={actionLoading}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              size={"small"}
              key="delete"
              border={false}
              className="!bg-[#d32f2f] !text-white !border-transparent"
              onClick={handleDeleteConfirm}
              loading={actionLoading}
            >
              Delete
            </ButtonComponent>
          </div>
        ]}
      >
        <div style={{ padding: "20px 24px" }}>
          <p style={{ margin: 0, marginBottom: 16, color: "#333" }}>
            Are you sure you want to delete this schedule? This action cannot be undone.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "8px 0", fontSize: 13 }}>
            <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Name</span>
            <span style={{ fontWeight: 500, color: "#222" }}>{scheduleToDelete?.scheduleName ?? "—"}</span>
            <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Job Code</span>
            <span style={{ fontWeight: 500, color: "#222" }}>{scheduleToDelete?.jobCode ?? "—"}</span>
          </div>
        </div>
      </NxModal>
    </>
  );
};

export default JobSchedulePage;
