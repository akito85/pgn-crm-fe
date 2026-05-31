import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Checkbox, Dropdown, Skeleton, Spin } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import StatusComponent from "../../../../components/StatusComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  useSchedulesList,
  useActivateSchedule,
  usePauseSchedule,
  useDeleteSchedule,
  useUpdateSchedule,
  useScheduleStats,
} from "../../../../hooks/jobManagement/useJobSchedules";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";
import IconPower from "../../../../assets/Icon/Nx/IconPower";
import IconSuspend from "../../../../assets/Icon/Nx/IconSuspend";
import IconDeleteMenu from "../../../../assets/Icon/Nx/IconDeleteMenu";
import IconEditMenu from "../../../../assets/Icon/Nx/IconEditMenu";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";
import JobStatsBar from "../components/JobStatsBar";
import EditScheduleModal from "./EditScheduleModal";

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

// ─── Panel ─────────────────────────────────────────────────────────────────────

const ScheduledJobsPanel = () => {
  const navigate = useNavigate();

  // TanStack Query data layer (replaces jobScheduleSlice thunks)
  const [page, setPage] = useState(1);
  const { data, isLoading: loading, refetch } = useSchedulesList({ page, pageSize: PAGE_SIZE });
  const activateMutation = useActivateSchedule();
  const pauseMutation = usePauseSchedule();
  const deleteMutation = useDeleteSchedule();
  const updateMutation = useUpdateSchedule();
  const actionLoading =
    activateMutation.isPending || pauseMutation.isPending || deleteMutation.isPending ||
    updateMutation.isPending;

  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch { return null; }
  }, [rawToken]);

  const { loading: permissionsLoading } = useGrantAccessHooks();

  const [accumulatedData, setAccumulatedData] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });

  // Pause / Delete confirmation state (shared cascade choice: also stop in-flight runs)
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [scheduleToPause, setScheduleToPause] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [cascadeCancel, setCascadeCancel] = useState(false);

  // Edit state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);

  // Per-schedule statistics for the schedule currently in edit context.
  const { data: scheduleStats, isLoading: scheduleStatsLoading } =
    useScheduleStats(scheduleToEdit?.scheduleId);

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

  // After any mutation: reset to page 1 and refresh. Mutation onSuccess already
  // invalidates the schedules cache; this resets accumulation/pagination state.
  const afterAction = useCallback(() => {
    setPage(1);
    setAccumulatedData([]);
    refetch();
  }, [refetch]);

  // ─── Activate (no cascade) ─────────────────────────────────────────────────

  const handleActivate = useCallback((scheduleId) => {
    activateMutation.mutate(scheduleId, { onSuccess: afterAction });
  }, [activateMutation, afterAction]);

  // ─── Pause (with cascade choice) ───────────────────────────────────────────

  const openPause = (record) => {
    setScheduleToPause(record);
    setCascadeCancel(false);
    setPauseModalOpen(true);
  };

  const handlePauseConfirm = () => {
    if (!scheduleToPause) return;
    setPauseModalOpen(false);
    pauseMutation.mutate(
      { scheduleId: scheduleToPause.scheduleId, cancelInFlight: cascadeCancel },
      { onSuccess: afterAction, onSettled: () => setScheduleToPause(null) }
    );
  };

  const handlePauseCancel = () => {
    setPauseModalOpen(false);
    setScheduleToPause(null);
  };

  // ─── Delete (with cascade choice) ──────────────────────────────────────────

  const openDelete = (record) => {
    setScheduleToDelete(record);
    setCascadeCancel(false);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!scheduleToDelete) return;
    setDeleteModalOpen(false);
    deleteMutation.mutate(
      { scheduleId: scheduleToDelete.scheduleId, cancelInFlight: cascadeCancel },
      { onSuccess: afterAction, onSettled: () => setScheduleToDelete(null) }
    );
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setScheduleToDelete(null);
  };

  // ─── Edit (timing-only, with cascade choice in the modal) ──────────────────

  const openEdit = (record) => { setScheduleToEdit(record); setEditModalOpen(true); };

  const handleEditSubmit = ({ scheduleId, payload, cancelInFlight }) => {
    updateMutation.mutate(
      { scheduleId, payload, cancelInFlight },
      { onSuccess: () => { setEditModalOpen(false); afterAction(); },
        onSettled: () => setScheduleToEdit(null) }
    );
  };

  // ─── Action Column ────────────────────────────────────────────────────────────

  const actionColumn = useMemo(() => ({
    title: "ACTIONS",
    key: "actions",
    width: 120,
    align: "center",
    fixed: "right",
    render: (_, record) => {
      if (permissionsLoading) {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", transform: "scaleY(0.55)", transformOrigin: "center" }}>
              <Skeleton.Button active size="small" shape="round" block />
            </div>
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
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0" }}>
              <IconPower width="18" height="18" /> Activate
            </span>
          ),
          onClick: () => handleActivate(record.scheduleId),
        }] : []),
        ...(showPause ? [{
          key: "pause",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0" }}>
              <IconSuspend width="18" height="18" /> Pause
            </span>
          ),
          onClick: () => openPause(record),
        }] : []),
        {
          key: "edit",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0" }}>
              <IconEditMenu width="18" height="18" /> Edit
            </span>
          ),
          onClick: () => openEdit(record),
        },
        {
          key: "delete",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0" }}>
              <IconDeleteMenu width="18" height="18" /> Delete
            </span>
          ),
          onClick: () => openDelete(record),
        },
      ].sort((a, b) => a.key.localeCompare(b.key));

      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
              onClick={(e) => e.stopPropagation()}
              type="button"
            >
              <IconThreeDots />
            </button>
          </Dropdown>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "#1976D2" }}
            onClick={() => navigate(JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULE_DETAIL, { state: { id: record.scheduleId } })}
            type="button"
          >
            <ViewListIcon />
          </button>
        </div>
      );
    },
  }), [permissionsLoading, handleActivate, navigate]);

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

  // Reusable cascade checkbox shown in both pause and delete confirmations.
  const cascadeOption = (
    <div style={{ marginTop: 16, padding: "10px 12px", background: "#fff7e6", border: "1px solid #ffe7ba", borderRadius: 6 }}>
      <Checkbox checked={cascadeCancel} onChange={(e) => setCascadeCancel(e.target.checked)}>
        Also stop in-flight runs
      </Checkbox>
      <div style={{ fontSize: 12, color: "#8c6d1f", marginTop: 4, marginLeft: 24 }}>
        Cancels any queued or running executions this schedule already started.
        Leave unchecked to let them finish.
      </div>
    </div>
  );

  return (
    <>
      <NxCardContainer header="SCHEDULE LIST">
        {actionLoading && (
          <div style={{ textAlign: "center", padding: 8 }}>
            <Spin size="small" /> Processing...
          </div>
        )}

        {scheduleToEdit?.scheduleId != null && (
          <JobStatsBar stats={scheduleStats} loading={scheduleStatsLoading} />
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

      {/* Pause Confirmation Modal */}
      <NxModal
        isOpen={pauseModalOpen}
        title="Pause Schedule"
        loading={actionLoading}
        handleCancel={handlePauseCancel}
        width={480}
        footer={[
          <div className="flex flex-row justify-between items-center">
            <ButtonComponent size={"small"} key="cancel" onClick={handlePauseCancel} disabled={actionLoading}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              size={"small"}
              key="pause"
              border={false}
              className="!bg-[#d48806] !text-white !border-transparent"
              onClick={handlePauseConfirm}
              loading={actionLoading}
            >
              Pause
            </ButtonComponent>
          </div>
        ]}
      >
        <div style={{ padding: "20px 24px" }}>
          <p style={{ margin: 0, marginBottom: 8, color: "#333" }}>
            Pause this schedule? It will stop firing new runs. The schedule itself
            is kept and can be re-activated later.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "8px 0", fontSize: 13 }}>
            <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Name</span>
            <span style={{ fontWeight: 500, color: "#222" }}>{scheduleToPause?.scheduleName ?? "—"}</span>
            <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Job Code</span>
            <span style={{ fontWeight: 500, color: "#222" }}>{scheduleToPause?.jobCode ?? "—"}</span>
          </div>
          {cascadeOption}
        </div>
      </NxModal>

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
          {cascadeOption}
        </div>
      </NxModal>

      {/* Edit Schedule Modal */}
      <EditScheduleModal
        open={editModalOpen}
        schedule={scheduleToEdit}
        loading={actionLoading}
        onClose={() => { setEditModalOpen(false); setScheduleToEdit(null); }}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default ScheduledJobsPanel;
