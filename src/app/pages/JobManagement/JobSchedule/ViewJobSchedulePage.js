import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import StatusComponent from "../../../../components/StatusComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import {
  useScheduleDetail,
  useActivateSchedule,
  usePauseSchedule,
} from "../../../../hooks/jobManagement/useJobSchedules";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const KvItem = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>
      {label}
    </div>
    <div style={{ fontSize: 13, color: "#222", fontWeight: 500 }}>
      {value ?? "—"}
    </div>
  </div>
);

const KvGrid = ({ children, columns = "1fr 1fr" }) => (
  <div style={{ display: "grid", gridTemplateColumns: columns, gap: "16px 24px", padding: "12px 0" }}>
    {children}
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const ScheduleStatus = ({ status }) => {
  if (!status) return <span>—</span>;
  const colourMap = {
    DRAFT:    "draft",
    ACTIVE:   "active",
    INACTIVE: "inactive",
    ARCHIVED: "closed",
  };
  const text = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      <StatusComponent colour={colourMap[status] || status.toLowerCase()} size="small">
        {text}
      </StatusComponent>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ViewJobSchedulePage = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const scheduleId = location.state?.id;

  const { data: schedule, isLoading: detailLoading, refetch } = useScheduleDetail(scheduleId);
  const activateMutation = useActivateSchedule();
  const pauseMutation = usePauseSchedule();
  const actionLoading = activateMutation.isPending || pauseMutation.isPending;

  const breadcrumbRoutes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULE,              breadcrumbName: "Schedule List" },
    { path: "",                                             breadcrumbName: "View" },
  ];

  if (!scheduleId) {
    return (
      <>
        <BreadCrumb routes={breadcrumbRoutes} />
        <div style={{ textAlign: "center", padding: 40 }}>No schedule selected.</div>
      </>
    );
  }

  if (detailLoading || !schedule) {
    return (
      <>
        <BreadCrumb routes={breadcrumbRoutes} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          <Spin size="large" />
        </div>
      </>
    );
  }

  // ─── Expression display ───────────────────────────────────────────────────

  const expressionLabel = schedule.scheduleType === "CRON" ? "CRON Expression" : "Interval";
  const expressionValue =
    schedule.scheduleType === "CRON"
      ? (schedule.cronExpression || "—")
      : schedule.intervalSeconds != null
        ? `${schedule.intervalSeconds}s`
        : "—";

  // ─── Footer button visibility ─────────────────────────────────────────────

  const showActivate = schedule.status === "DRAFT" || schedule.isPaused === true;
  const showPause    = schedule.status === "ACTIVE" && schedule.isPaused === false;

  const handleActivate = () => {
    activateMutation.mutate(scheduleId, { onSuccess: () => refetch() });
  };

  const handlePause = () => {
    // View page keeps the simple pause (no cascade); the list page offers the
    // cancelInFlight choice. Default cancelInFlight=false here.
    pauseMutation.mutate({ scheduleId, cancelInFlight: false }, { onSuccess: () => refetch() });
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <BreadCrumb routes={breadcrumbRoutes} />

      {/* SCHEDULE INFORMATION */}
      <NxCardContainer header="SCHEDULE DETAIL">

        <NxBaseContainer border header="SCHEDULE INFORMATION">
          <KvGrid columns="1fr 1fr 1fr">
            <KvItem label="Schedule Name"  value={schedule.scheduleName} />
            <KvItem label="Type"           value={schedule.scheduleType} />
            <KvItem label={expressionLabel} value={expressionValue} />
            <KvItem label="Timezone"       value={schedule.timezone} />
            <KvItem
              label="Status"
              value={<ScheduleStatus status={schedule.status} />}
            />
            <KvItem label="Paused"         value={schedule.isPaused ? "Yes" : "No"} />
          </KvGrid>
        </NxBaseContainer>

        {/* JOB INFORMATION */}
        <NxBaseContainer border header="JOB INFORMATION" className="mt-4">
          <KvGrid columns="1fr 1fr 1fr">
            <KvItem label="Job ID"   value={schedule.jobId} />
            <KvItem label="Job Code" value={schedule.jobCode} />
            <KvItem label="Job Name" value={schedule.jobName} />
          </KvGrid>
        </NxBaseContainer>

        {/* EXECUTION STATISTICS */}
        <NxBaseContainer border header="EXECUTION STATISTICS" className="mt-4">
          <KvGrid columns="1fr 1fr 1fr 1fr 1fr">
            <KvItem label="Total Runs"      value={schedule.totalRuns ?? 0} />
            <KvItem label="Successful Runs" value={schedule.successfulRuns ?? 0} />
            <KvItem label="Failed Runs"     value={schedule.failedRuns ?? 0} />
            <KvItem label="Next Run Time"   value={formatDate(schedule.nextRunTime)} />
            <KvItem label="Last Run Time"   value={formatDate(schedule.lastRunTime)} />
          </KvGrid>
        </NxBaseContainer>

      </NxCardContainer>

      {/* HISTORY LOG INFORMATION */}
      <NxCardContainer header="HISTORY LOG INFORMATION" className="mt-4">
        <div className="w-full p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px 24px" }}>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-Semantic-Text-light-text-primary">Record ID</div>
              <div className="text-xs font-medium text-Semantic-Text-light-text-primary">{schedule.scheduleId ?? "—"}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-Semantic-Text-light-text-primary">Created Date</div>
              <div className="text-xs font-medium text-Semantic-Text-light-text-primary">{formatDate(schedule.createdAt)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-Semantic-Text-light-text-primary">Created By</div>
              <div className="text-xs font-medium text-Semantic-Text-light-text-primary">{schedule.createdBy ?? "—"}</div>
            </div>
          </div>
        </div>
      </NxCardContainer>

      {/* Footer */}
      <footer className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-lg border border-solid border-[#C8CDD4]">
        <ButtonComponent onClick={() => navigate(-1)}>Back</ButtonComponent>
        <div>
          {showActivate && (
            <ButtonComponent
              border={false}
              className="!bg-[#1976d2] !text-white !border-transparent"
              onClick={handleActivate}
              disabled={actionLoading}
            >
              Activate
            </ButtonComponent>
          )}
          {showPause && (
            <ButtonComponent
              border={false}
              className="!bg-[#f57c00] !text-white !border-transparent"
              onClick={handlePause}
              disabled={actionLoading}
            >
              Pause
            </ButtonComponent>
          )}
        </div>
      </footer>
    </>
  );
};

export default ViewJobSchedulePage;
