import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Tag, Tabs, Alert } from "antd";
import { DownloadOutlined, WarningOutlined, InfoCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTableBase from "../../../../components/Nx/NxTableBase";
import ButtonComponent from "../../../../components/ButtonComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { useGetJobByIdQuery } from "../../../../redux/slices/job_management/jobApiSlice";
import {
  getJobExecutionById,
  getJobExecutionLogs,
} from "../../../../redux/slices/job_management/jobExecutionSlice";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

const STATUS_COLORS = {
  PENDING:    "blue",
  SCHEDULED:  "geekblue",
  PROCESSING: "orange",
  SUCCEEDED:  "green",
  FAILED:     "red",
  CANCELLED:  "default",
  DELETED:    "default",
  ON_HOLD:    "purple",
  SUSPENDED:  "gold",
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

// ─── Error Display ────────────────────────────────────────────────────────────

const ERROR_DISPLAY_MAP = {
  HANDLER_NOT_FOUND:           { message: "Job handler not registered on worker. Contact admin.", severity: "error" },
  INPUT_PARSE_ERROR:           { message: "Invalid input payload format. Check JSON syntax.", severity: "error" },
  MISSING_REQUIRED_PARAMETER:  { message: (d) => `Missing required parameter: ${d?.parameter ?? "unknown"}`, severity: "error" },
  INVALID_PARAMETER_VALUE:     { message: (d) => `Invalid value for parameter: ${d?.parameter ?? "unknown"}`, severity: "error" },
  SCRIPT_NOT_FOUND:            { message: (d) => `Script file not found on worker: ${d?.scriptPath ?? "unknown"}`, severity: "error" },
  PROCEDURE_NOT_FOUND:         { message: (d) => `Stored procedure not found: ${d?.schema ?? ""}.${d?.procedure ?? ""}`, severity: "error" },
  PROCEDURE_INVALID:           { message: "Stored procedure is invalid or uncompiled.", severity: "error" },
  DATABASE_ERROR:              { message: "Database error during execution.", severity: "error" },
  PROCESS_EXECUTION_FAILED:    { message: (d) => `Process failed with exit code: ${d?.exitCode ?? "unknown"}`, severity: "error" },
  TIMEOUT:                     { message: (d) => `Execution timed out after ${d?.timeoutSeconds ?? "?"}s`, severity: "warning" },
  EXECUTION_CONTEXT_NOT_FOUND: { message: "Execution record not found.", severity: "error" },
  EXECUTION_CANCELLED:         { message: "Execution was cancelled.", severity: "info" },
  UNKNOWN_ERROR:               { message: "Unexpected error occurred.", severity: "error" },
};

const SEVERITY_ICON = {
  error:   <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
  warning: <WarningOutlined style={{ color: "#faad14" }} />,
  info:    <InfoCircleOutlined style={{ color: "#1890ff" }} />,
};

const parseErrorMessage = (errorMessage) => {
  if (!errorMessage) return null;
  if (errorMessage.startsWith("{")) {
    try {
      return { structured: true, ...JSON.parse(errorMessage) };
    } catch {
      // fall through to plain text
    }
  }
  return { structured: false, raw: errorMessage };
};

const ExecutionErrorDisplay = ({ errorMessage }) => {
  const parsed = parseErrorMessage(errorMessage);
  if (!parsed) return null;

  if (!parsed.structured) {
    return (
      <Alert
        type="error"
        showIcon
        message="Execution Error"
        description={
          <pre style={{ fontSize: 12, whiteSpace: "pre-wrap", margin: 0 }}>{parsed.raw}</pre>
        }
        style={{ marginTop: 8 }}
      />
    );
  }

  const mapping = ERROR_DISPLAY_MAP[parsed.code] ?? { message: parsed.message, severity: "error" };
  const displayMessage = typeof mapping.message === "function"
    ? mapping.message(parsed.details)
    : mapping.message;
  const severity = mapping.severity ?? "error";

  return (
    <div style={{ marginTop: 8 }}>
      <Alert
        type={severity}
        showIcon
        icon={SEVERITY_ICON[severity]}
        message={
          <span style={{ fontWeight: 600 }}>
            {parsed.code} &nbsp;
            <span style={{ fontSize: 11, fontWeight: 400, color: "#888" }}>
              {parsed.timestamp ? `at ${parsed.timestamp}` : ""}
            </span>
          </span>
        }
        description={
          <div>
            <div style={{ marginBottom: 4 }}>{displayMessage}</div>
            {parsed.details && Object.keys(parsed.details).length > 0 && (
              <pre style={{
                fontSize: 11, background: "#f5f5f5", padding: "6px 10px",
                borderRadius: 4, marginTop: 6, whiteSpace: "pre-wrap", wordBreak: "break-all"
              }}>
                {JSON.stringify(parsed.details, null, 2)}
              </pre>
            )}
          </div>
        }
      />
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ViewJobExecutionPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const executionId = location.state?.id;

  const { detail, detailLoading, logs, logsLoading } = useSelector((s) => s.jobExecution);
  const [activeTab, setActiveTab]     = useState("info");
  const [logsFetched, setLogsFetched] = useState(false);

  useEffect(() => {
    if (executionId) dispatch(getJobExecutionById(executionId));
  }, [dispatch, executionId]);

  // Fetch job definition only once we have jobId from the execution detail
  const jobId = detail?.jobId;
  const { data: job, isLoading: jobLoading } = useGetJobByIdQuery(jobId, { skip: !jobId });

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "log" && !logsFetched) {
      dispatch(getJobExecutionLogs(executionId));
      setLogsFetched(true);
    }
  };

  const breadcrumbRoutes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: JOB_MGMT_ROUTES.VIEW_JOB_EXECUTION,            breadcrumbName: "Job Execution List" },
    { path: "",                                             breadcrumbName: "View" },
  ];

  // Show spinner while detail fetch is in progress or not yet available
  if (detailLoading || !detail) {
    return (
      <>
        <BreadCrumb routes={breadcrumbRoutes} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          <Spin size="large" />
        </div>
      </>
    );
  }

  // Parse inputPayload: {"CODE": "value", ...}
  let payloadEntries = [];
  if (detail.inputPayload) {
    try {
      const parsed = typeof detail.inputPayload === "string"
        ? JSON.parse(detail.inputPayload)
        : detail.inputPayload;
      payloadEntries = Object.entries(parsed);
    } catch {
      payloadEntries = [];
    }
  }

  const parameters = job?.parameters ?? [];

  // Map payload code key → parameter display name
  const getParamLabel = (code) => {
    const p = parameters.find(
      (param) => param.code === code || param.code?.toLowerCase() === code?.toLowerCase()
    );
    return p?.name ?? code;
  };

  // ─── Log tab content ───────────────────────────────────────────────────────

  const renderLogs = () => {
    if (logsLoading) {
      return <div style={{ textAlign: "center", padding: 24 }}><Spin /></div>;
    }
    if (!logs || (Array.isArray(logs) && logs.length === 0)) {
      return <p style={{ color: "#999", fontSize: 13, padding: "8px 0" }}>No logs available.</p>;
    }
    if (typeof logs === "string") {
      return (
        <pre style={{ fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-all", background: "#f5f5f5", padding: 12, borderRadius: 6 }}>
          {logs}
        </pre>
      );
    }
    if (Array.isArray(logs)) {
      return (
        <NxTableBase
          idTable="jobExecutionLogsTable"
          dataSource={logs}
          columns={[
            { title: "TIMESTAMP", dataIndex: "timestamp", key: "timestamp", width: 180, render: (v) => formatDate(v) },
            { title: "LEVEL",     dataIndex: "level",     key: "level",     width: 80 },
            { title: "MESSAGE",   dataIndex: "message",   key: "message" },
          ]}
          loading={false}
          scroll={{ y: 400 }}
        />
      );
    }
    return null;
  };

  // ─── Tab items ──────────────────────────────────────────────────────────────

  const tabItems = [
    {
      key: "info",
      label: "Job Execution Information",
      children: (
        <div style={{ padding: "12px 0" }}>
          {payloadEntries.length === 0 ? (
            <p style={{ color: "#999", fontSize: 13 }}>No execution parameters.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 24px" }}>
              {payloadEntries.map(([code, value]) => (
                <KvItem key={code} label={getParamLabel(code)} value={String(value ?? "—")} />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "log",
      label: "Log",
      children: <div style={{ padding: "12px 0" }}>{renderLogs()}</div>,
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <BreadCrumb routes={breadcrumbRoutes} />

      {/* JOB CONFIGURATION ─────────────────────────────────────────────────── */}
      <NxCardContainer header="JOB CONFIGURATION">

        <NxBaseContainer border header="JOB INFORMATION">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px 24px", padding: "12px 0" }}>
            <KvItem label="Name"           value={detail.jobName} />
            <KvItem label="Parent"         value={detail.parentJobName ?? "—"} />
            <KvItem label="Code"           value={detail.jobCode} />
            <KvItem label="Type"           value={detail.jobType      ?? job?.type} />
            <KvItem label="Execute Type"   value={detail.execType     ?? job?.executeType} />
            <KvItem label="Handler"        value={detail.handlerClass ?? job?.handler} />
            <KvItem label="Timeout"        value={detail.timeoutSeconds ?? job?.timeout ?? "—"} />
            <KvItem label="Max Retry"      value={detail.maxRetry    ?? job?.maxRetry} />
            <KvItem label="Module"         value={detail.moduleName  ?? job?.module} />
            <KvItem label="Access Group"   value={detail.accessGroupName ?? job?.accessGroup ?? "—"} />
            <KvItem label="Submitted By"   value={detail.submittedBy ?? detail.createdBy} />
            <KvItem label="Submitted Date" value={formatDate(detail.submittedAt ?? detail.createdAt)} />
            <KvItem label="Start Date"     value={formatDate(detail.startedAt)} />
            <KvItem label="Completed Date" value={formatDate(detail.completedAt)} />
            <KvItem
              label="Status"
              value={
                detail.status
                  ? <Tag color={STATUS_COLORS[detail.status] || "default"}>{detail.status}</Tag>
                  : "—"
              }
            />
            <div style={{ gridColumn: "1 / -1" }}>
              <KvItem label="Description" value={detail.description ?? job?.description} />
            </div>
          </div>
        </NxBaseContainer>

        <NxBaseContainer border header="PARAMETERS" className="mt-4" minHeight="200px">
          {jobLoading ? (
            <div style={{ textAlign: "center", padding: 16 }}><Spin size="small" /></div>
          ) : !parameters.length ? (
            <p style={{ color: "#999", fontSize: 13, padding: "8px 0" }}>No parameters defined.</p>
          ) : (
            <NxTableBase
              idTable="jobExecParamsTable"
              dataSource={parameters}
              columns={[
                { title: "NO",          key: "no",          width: 60,  align: "center", render: (_, __, i) => i + 1 },
                { title: "NAME",        dataIndex: "name",        key: "name" },
                { title: "CODE",        dataIndex: "code",        key: "code" },
                { title: "TYPE",        dataIndex: "type",        key: "type" },
                { title: "LENGTH",      dataIndex: "length",      key: "length", width: 100 },
                { title: "DESCRIPTION", dataIndex: "description", key: "description" },
              ]}
              loading={false}
              scroll={parameters.length > 10 ? { y: 380 } : {}}
            />
          )}
        </NxBaseContainer>

      </NxCardContainer>

      {/* JOB EXECUTION ──────────────────────────────────────────────────────── */}
      <NxCardContainer
        header="JOB EXECUTION"
        className="mt-4"
        actionElement={
          <ButtonComponent
            isPrimary
            icon={<DownloadOutlined />}
            className="px-3 py-1 rounded-lg min-h-[32px]"
            onClick={() => {}}
          >
            <span className="text-xs font-medium tracking-tight">Download Output</span>
          </ButtonComponent>
        }
      >
        {detail.errorMessage && (
          <ExecutionErrorDisplay errorMessage={detail.errorMessage} />
        )}
        <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
      </NxCardContainer>

      {/* HISTORY LOG INFORMATION ────────────────────────────────────────────── */}
      <NxCardContainer header="HISTORY LOG INFORMATION" className="mt-4">
        <div className="w-full p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "16px 24px" }}>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-Semantic-Text-light-text-primary">Record ID</div>
              <div className="text-xs font-medium text-Semantic-Text-light-text-primary">{detail.executionId ?? "—"}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-Semantic-Text-light-text-primary">Created Date</div>
              <div className="text-xs font-medium text-Semantic-Text-light-text-primary">{formatDate(detail.createdAt)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-Semantic-Text-light-text-primary">Created By</div>
              <div className="text-xs font-medium text-Semantic-Text-light-text-primary">{detail.createdBy ?? "—"}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-Semantic-Text-light-text-primary">Updated Date</div>
              <div className="text-xs font-medium text-Semantic-Text-light-text-primary">{formatDate(detail.updatedAt)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-Semantic-Text-light-text-primary">Updated By</div>
              <div className="text-xs font-medium text-Semantic-Text-light-text-primary">{detail.updatedBy ?? "—"}</div>
            </div>
          </div>
        </div>
      </NxCardContainer>

      {/* Footer */}
      <footer className="mt-4 flex items-center px-4 py-3 bg-white rounded-lg border border-solid border-[#C8CDD4]">
        <ButtonComponent onClick={() => navigate(-1)}>Back</ButtonComponent>
      </footer>
    </>
  );
};

export default ViewJobExecutionPage;
