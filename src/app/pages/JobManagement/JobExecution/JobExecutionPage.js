import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircleOutlined, CheckOutlined, ClockCircleOutlined, ThunderboltOutlined, CalendarOutlined, SyncOutlined, SettingOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Dropdown, Form, Radio, Input, InputNumber, Select, Tag, Spin, Typography } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useSearchJobsQuery } from "../../../../redux/slices/job_management/jobApiSlice";
import {
  getAllJobExecutionPaginate,
  startExecution,
  stopExecution,
  suspendExecution,
  holdExecution,
  cancelExecution,
  restartExecution,
} from "../../../../redux/slices/job_management/jobExecutionSlice";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";
import IconStop from "../../../../assets/Icon/Nx/IconStop";
import IconRestart from "../../../../assets/Icon/Nx/IconRestart";
import IconOnHold from "../../../../assets/Icon/Nx/IconOnHold";
import IconSuspend from "../../../../assets/Icon/Nx/IconSuspend";
import IconCancel from "../../../../assets/Icon/Nx/IconCancel";

const PAGE_SIZE = 30;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const date = `${String(d.getDate()).padStart(2, "0")}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const cs = String(Math.floor(d.getMilliseconds() / 10)).padStart(2, "0");
  return `${date} ${hh}:${mm}:${ss}.${cs}`;
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

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIGGER_TYPES = ["IMMEDIATE", "ONCE", "PERIODICALLY", "SPECIFIC_DAYS"];

const TIMEZONES = [
  "UTC", "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura",
  "America/New_York", "Europe/London", "Asia/Tokyo",
];

// ─── Trigger type metadata for beautiful cards ────────────────────────────────

const TRIGGER_META = {
  IMMEDIATE: {
    icon: <ThunderboltOutlined />,
    label: "Immediate",
    desc: "Run the job right now",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
  ONCE: {
    icon: <ClockCircleOutlined />,
    label: "Once",
    desc: "Schedule for a specific date & time",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  PERIODICALLY: {
    icon: <SyncOutlined />,
    label: "Periodically",
    desc: "Repeat at a fixed interval",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  SPECIFIC_DAYS: {
    icon: <CalendarOutlined />,
    label: "Specific Days",
    desc: "Use a cron expression for complex schedules",
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
};

// ─── Wizard Step Indicator ────────────────────────────────────────────────────

const WizardSteps = ({ current }) => {
  const steps = [
    { key: "select", label: "Select Job", icon: <SettingOutlined /> },
    { key: "schedule", label: "Configure", icon: <CalendarOutlined /> },
  ];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 0,
      padding: "16px 24px 0",
      borderBottom: "1px solid #f0f0f0",
      marginBottom: 0,
    }}>
      {steps.map((step, idx) => {
        const isActive = step.key === current;
        const isDone = (current === "schedule" && step.key === "select");

        return (
          <React.Fragment key={step.key}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 14,
              borderBottom: isActive ? "2px solid #1976D2" : "2px solid transparent",
              marginBottom: -1,
              transition: "all 0.2s ease",
            }}>
              {/* Circle */}
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.2s ease",
                background: isDone ? "#1976D2" : isActive ? "#e3f0fb" : "#f5f5f5",
                color: isDone ? "#fff" : isActive ? "#1976D2" : "#bbb",
                border: isActive ? "2px solid #1976D2" : isDone ? "2px solid #1976D2" : "2px solid #e0e0e0",
              }}>
                {isDone ? <CheckOutlined style={{ fontSize: 12 }} /> : idx + 1}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1976D2" : isDone ? "#555" : "#aaa",
                letterSpacing: "0.01em",
              }}>
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: 1,
                background: isDone ? "#1976D2" : "#e0e0e0",
                margin: "0 12px",
                marginBottom: 14,
                transition: "background 0.3s ease",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Trigger Type Card ────────────────────────────────────────────────────────

const TriggerCard = ({ type, selected, onClick, disabled }) => {
  const meta = TRIGGER_META[type];
  const isSelected = selected === type;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(type)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 8,
        border: isSelected ? `1.5px solid ${meta.color}` : "1.5px solid #e8e8e8",
        background: isSelected ? meta.bg : "#fafafa",
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
        transition: "all 0.18s ease",
        opacity: disabled ? 0.6 : 1,
        boxShadow: isSelected ? `0 0 0 3px ${meta.color}18` : "none",
        width: "100%",
      }}
    >
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        flexShrink: 0,
        background: isSelected ? meta.color : "#ebebeb",
        color: isSelected ? "#fff" : "#999",
        transition: "all 0.18s ease",
      }}>
        {meta.icon}
      </div>
      <div>
        <div style={{
          fontWeight: 600,
          fontSize: 12.5,
          color: isSelected ? meta.color : "#333",
          letterSpacing: "0.01em",
          lineHeight: "1.3",
          transition: "color 0.18s",
        }}>
          {meta.label}
        </div>
        <div style={{ fontSize: 11.5, color: "#888", marginTop: 1, lineHeight: "1.4" }}>
          {meta.desc}
        </div>
      </div>
    </button>
  );
};

// ─── Select Job Modal ─────────────────────────────────────────────────────────

const MODAL_PAGE_SIZE = 20;

const JOB_SELECT_COLUMNS = [
  { title: "NO", width: 60, align: "center", render: (_, __, index) => index + 1 },
  { title: "NAME", dataIndex: "name", key: "name", align: "left" },
  { title: "CODE", dataIndex: "code", key: "code", align: "left", width: 140 },
  { title: "TYPE", dataIndex: "type", key: "type", align: "left", width: 120 },
  { title: "DESC", dataIndex: "desc", key: "desc", align: "left", ellipsis: true },
];

const buildInputPayload = (paramValues, parameters) => {
  if (!parameters || parameters.length === 0) return undefined;
  const payload = {};
  parameters.forEach((p) => {
    const val = paramValues?.[p.code];
    if (val !== undefined && val !== null && val !== '') {
      payload[p.code] = val;
    }
  });
  return Object.keys(payload).length > 0 ? JSON.stringify(payload) : undefined;
};

const ModalSelectJob = ({ open, loading, onClose, onSubmit }) => {
  const [step, setStep] = useState("select");
  const [selectedJob, setSelectedJob] = useState(null);
  const [triggerType, setTriggerType] = useState("IMMEDIATE");
  const [modalPage, setModalPage] = useState(0);
  const [allJobs, setAllJobs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const isResetRef = React.useRef(false);
  const [form] = Form.useForm();

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep("select");
      setSelectedJob(null);
      setTriggerType("IMMEDIATE");
      setModalPage(0);
      setAllJobs([]);
      setHasMore(true);
      isResetRef.current = false;
      form.resetFields();
    }
  }, [open, form]);

  const { data: allJobsData, isLoading: allJobsLoading } = useSearchJobsQuery({
    page: modalPage,
    size: MODAL_PAGE_SIZE,
  }, { skip: !open });

  useEffect(() => {
    if (!allJobsData) return;
    if (isResetRef.current) {
      isResetRef.current = false;
      setAllJobs(allJobsData.result);
    } else {
      setAllJobs(prev => [...prev, ...allJobsData.result]);
    }
    setHasMore(allJobsData.currentPage < allJobsData.totalPages - 1);
  }, [allJobsData]);

  const loadMoreData = useCallback(() => {
    return new Promise((resolve) => {
      if (!hasMore || allJobsLoading) { resolve(); return; }
      setModalPage(prev => prev + 1);
      setTimeout(resolve, 0);
    });
  }, [hasMore, allJobsLoading]);

  const handleBack = () => {
    setStep("select");
    setSelectedJob(null);
    form.resetFields();
    setTriggerType("IMMEDIATE");
  };

  const handleStart = () => {
    form.validateFields().then((values) => {
      const { params: _params, ...scheduleValues } = values;
      const inputPayload = buildInputPayload(_params, selectedJob.parameters);
      onSubmit({ jobId: selectedJob.id, triggerType, ...scheduleValues, inputPayload });
    });
  };

  const actionColumn = {
    title: "",
    key: "select-action",
    width: 80,
    align: "center",
    render: (_, record) => (
      <button
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 10px",
          borderRadius: 6,
          background: "#1976D2",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 500,
          transition: "background 0.15s",
        }}
        onClick={() => {
          setSelectedJob({ id: record.id, name: record.name, code: record.code, parameters: record.parameters ?? [] });
          setStep("schedule");
        }}
      >
        Select <ArrowRightOutlined style={{ fontSize: 10 }} />
      </button>
    ),
  };

  const jobColumns = [...JOB_SELECT_COLUMNS, actionColumn];

  // ── Step 2: Schedule & Params ─────────────────────────────────────────────

  const renderStep2 = () => (
    <div style={{ padding: "20px 24px 4px" }}>

      {/* Selected Job Info Card */}
      <div style={{
        background: "linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)",
        border: "1px solid #c8e0fa",
        borderRadius: 10,
        padding: "12px 16px",
        marginBottom: 22,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: "#1976D2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <SettingOutlined style={{ color: "#fff", fontSize: 18 }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2a3a", lineHeight: 1.3 }}>
            {selectedJob?.name ?? "—"}
          </div>
          <div style={{ fontSize: 12, color: "#5a7a99", marginTop: 2, fontFamily: "monospace", letterSpacing: "0.03em" }}>
            {selectedJob?.code ?? "—"}
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>

        {/* Trigger Type — card grid */}
        <Form.Item
          label={
            <span style={{ fontWeight: 600, fontSize: 12.5, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Trigger Type
            </span>
          }
          style={{ marginBottom: 20 }}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}>
            {TRIGGER_TYPES.map((t) => (
              <TriggerCard
                key={t}
                type={t}
                selected={triggerType}
                disabled={loading}
                onClick={(val) => {
                  setTriggerType(val);
                  form.resetFields(["scheduledAt", "intervalSeconds", "cronExpression", "timezone"]);
                }}
              />
            ))}
          </div>
        </Form.Item>

        {/* Conditional fields */}
        {triggerType === "ONCE" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item
              name="scheduledAt"
              label={<FieldLabel>Scheduled At</FieldLabel>}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="2026-03-24T10:00:00" disabled={loading} style={inputStyle} />
            </Form.Item>
            <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC">
              <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} style={inputStyle} />
            </Form.Item>
          </div>
        )}

        {triggerType === "PERIODICALLY" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item
              name="intervalSeconds"
              label={<FieldLabel>Interval (seconds)</FieldLabel>}
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={1} placeholder="3600" style={{ width: "100%", ...inputStyle }} disabled={loading} />
            </Form.Item>
            <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC">
              <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} style={inputStyle} />
            </Form.Item>
          </div>
        )}

        {triggerType === "SPECIFIC_DAYS" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item
              name="cronExpression"
              label={<FieldLabel>Cron Expression</FieldLabel>}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="0 0 * * MON-FRI" disabled={loading} style={inputStyle} />
            </Form.Item>
            <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC">
              <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} style={inputStyle} />
            </Form.Item>
          </div>
        )}

        {/* Parameters */}
        {selectedJob?.parameters?.length > 0 ? (
          <>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
              marginTop: 4,
            }}>
              <div style={{ flex: 1, height: 1, background: "#eee" }} />
              <span style={{
                fontWeight: 600,
                fontSize: 11,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                whiteSpace: "nowrap",
              }}>
                Parameters
              </span>
              <div style={{ flex: 1, height: 1, background: "#eee" }} />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}>
              {selectedJob.parameters.map((param) => (
                <Form.Item
                  key={param.code}
                  name={['params', param.code]}
                  label={<FieldLabel required={param.required}>{param.name}</FieldLabel>}
                  rules={
                    (param.required ?? false)
                      ? [{ required: true, message: `${param.name} is required` }]
                      : []
                  }
                  style={{ marginBottom: 14 }}
                >
                  {param.type === 'Number' && (
                    <InputNumber style={{ width: '100%', ...inputStyle }} disabled={loading} />
                  )}
                  {param.type === 'Boolean' && (
                    <Select disabled={loading} style={inputStyle}>
                      <Select.Option value={true}>True</Select.Option>
                      <Select.Option value={false}>False</Select.Option>
                    </Select>
                  )}
                  {(param.type === 'Date' || param.type === 'String' || !param.type) && (
                    <Input
                      placeholder={param.type === 'Date' ? 'YYYY-MM-DD' : ''}
                      disabled={loading}
                      style={inputStyle}
                    />
                  )}
                </Form.Item>
              ))}
            </div>
          </>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 8,
            background: "#f9f9f9",
            border: "1px dashed #e0e0e0",
            marginTop: 4,
          }}>
            <CheckOutlined style={{ color: "#10b981", fontSize: 13 }} />
            <Typography.Text type="secondary" style={{ fontSize: 12.5 }}>
              This job requires no additional parameters.
            </Typography.Text>
          </div>
        )}
      </Form>
    </div>
  );

  // ── Modal title ───────────────────────────────────────────────────────────

  const modalTitle = (
    <div style={{ paddingBottom: 0 }}>
      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a2a3a" }}>
        {step === "select" ? "Run Job" : "Configure Schedule"}
      </div>
      <div style={{ fontSize: 12.5, color: "#888", marginTop: 2, fontWeight: 400 }}>
        {step === "select"
          ? "Select a job from the list to queue for execution"
          : "Set trigger type and parameters for your job"}
      </div>
    </div>
  );

  const modalWidth = step === "select" ? 1100 : 600;

  // ── Footer ────────────────────────────────────────────────────────────────

  const footer = (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 24px",
      borderTop: "1px solid #f0f0f0",
      background: "#fafafa",
      borderRadius: "0 0 12px 12px",
    }}>
      {/* Left: Cancel */}
      <ButtonComponent
        key="cancel"
        onClick={onClose}
        disabled={loading}
        style={{
          minWidth: 88,
          height: 36,
          borderRadius: 7,
          border: "1px solid #d9d9d9",
          background: "#fff",
          color: "#555",
          fontWeight: 500,
          fontSize: 13,
        }}
      >
        Cancel
      </ButtonComponent>

      {/* Right: Back + Start (step 2 only) */}
      <div style={{ display: "flex", gap: 8 }}>
        {step === "schedule" && (
          <ButtonComponent
            key="back"
            onClick={handleBack}
            disabled={loading}
            style={{
              minWidth: 80,
              height: 36,
              borderRadius: 7,
              border: "1px solid #d9d9d9",
              background: "#fff",
              color: "#555",
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            ← Back
          </ButtonComponent>
        )}
        {step === "schedule" && (
          <ButtonComponent
            key="start"
            type="primary"
            isPrimary
            onClick={handleStart}
            loading={loading}
            style={{
              minWidth: 100,
              height: 36,
              borderRadius: 7,
              background: "#1976D2",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
            }}
          >
            {loading ? "Starting…" : "Start Job"}
          </ButtonComponent>
        )}
      </div>
    </div>
  );

  return (
    <NxModal
      isOpen={open}
      title={modalTitle}
      width={modalWidth}
      loading={loading}
      closeable
      handleCancel={onClose}
      footer={footer}
    >
      {/* Step indicator */}
      <WizardSteps current={step} />

      <div style={{ paddingBottom: 4 }}>
        {step === "select" && (
          <div style={{ padding: "16px 16px 0" }}>
            <NxTable
              idTable="modal-job-select-table"
              dataSource={allJobs}
              loading={allJobsLoading}
              columns={jobColumns}
              useInfiniteScroll={true}
              useSearch={true}
              useAdvanceSearch={true}
              useColumnSettings={true}
              tableScrolled={{ y: 400, x: "max-content" }}
              rowKey="id"
              onLoadMore={loadMoreData}
              hasMore={hasMore}
            />
          </div>
        )}
        {step === "schedule" && renderStep2()}
      </div>
    </NxModal>
  );
};

// ─── Small helpers ─────────────────────────────────────────────────────────────

const FieldLabel = ({ children, required }) => (
  <span style={{ fontWeight: 500, fontSize: 12.5, color: "#555" }}>
    {children}
    {required && <span style={{ color: "#ff4d4f", marginLeft: 3 }}>*</span>}
  </span>
);

const inputStyle = {
  borderRadius: 6,
  fontSize: 13,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const JobExecutionPage = () => {
  const dispatch = useDispatch();
  const { data, loading, actionLoading } = useSelector((state) => state.jobExecution);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [accumulatedData, setAccumulatedData] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });
  const [selectJobModalOpen, setSelectJobModalOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleFetch = useCallback(() => {
    dispatch(getAllJobExecutionPaginate({ search: "", page, pageSize: PAGE_SIZE, sort }));
  }, [dispatch, page, sort, refreshToken]);

  useEffect(() => { handleFetch(); }, [handleFetch]);

  useEffect(() => {
    if (!data?.content) return;
    if (page === 1) {
      setAccumulatedData(data.content);
    } else {
      setAccumulatedData((prev) => {
        const existingIds = new Set(prev.map((item) => item.executionId));
        const newItems = data.content.filter((item) => !existingIds.has(item.executionId));
        return [...prev, ...newItems];
      });
    }
  }, [data?.content, page]);

  const handleRefresh = () => {
    setPage(1);
    setAccumulatedData([]);
    setRefreshToken((n) => n + 1);
  };

  const handleLoadMore = () => {
    const totalPages = data?.totalPages || 0;
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const hasMore = accumulatedData.length < (data?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    setSort(sorter.order ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}` : "");
    setPage(1);
    setAccumulatedData([]);
  };

  const afterAction = useCallback(() => {
    setPage(1);
    setAccumulatedData([]);
    setRefreshToken((n) => n + 1);
  }, []);

  const handleAction = useCallback((thunk, arg) => {
    dispatch(thunk(arg)).then((res) => {
      if (!res.error) afterAction();
    });
  }, [dispatch, afterAction]);

  // ─── Columns ────────────────────────────────────────────────────────────────

  const actionColumn = useMemo(() => ({
    title: "ACTIONS",
    key: "actions",
    width: 100,
    align: "center",
    fixed: "right",
    render: (_, record) => {
      if (!record || !record.executionId) return <span>—</span>;

      const status = record.status;
      const triggerType = record.triggerType;
      const isRecurring = triggerType === "PERIODICALLY" || triggerType === "SPECIFIC_DAYS";

      const menuItems = [
        {
          key: "stop",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: status === "PROCESSING" ? 1 : 0.4 }}>
              <IconStop width="16" height="16" /> Stop
            </span>
          ),
          disabled: status !== "PROCESSING",
          onClick: () => handleAction(stopExecution, record.executionId),
        },
        {
          key: "suspend",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: (status === "SCHEDULED" && isRecurring) ? 1 : 0.4 }}>
              <IconSuspend width="14" height="14" /> Suspend
            </span>
          ),
          disabled: !(status === "SCHEDULED" && isRecurring),
          onClick: () => handleAction(suspendExecution, record.executionId),
        },
        {
          key: "hold",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: status === "PENDING" ? 1 : 0.4 }}>
              <IconOnHold width="16" height="16" /> On-Hold
            </span>
          ),
          disabled: status !== "PENDING",
          onClick: () => handleAction(holdExecution, record.executionId),
        },
        {
          key: "cancel",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: ["PENDING","SCHEDULED","PROCESSING","ON_HOLD","SUSPENDED"].includes(status) ? 1 : 0.4 }}>
              <IconCancel width="12" height="12" /> Cancel
            </span>
          ),
          disabled: !["PENDING","SCHEDULED","PROCESSING","ON_HOLD","SUSPENDED"].includes(status),
          onClick: () => handleAction(cancelExecution, record.executionId),
        },
        {
          key: "restart",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: ["FAILED","CANCELLED","SUCCEEDED"].includes(status) ? 1 : 0.4 }}>
              <IconRestart width="16" height="16" /> Restart
            </span>
          ),
          disabled: !["FAILED","CANCELLED","SUCCEEDED"].includes(status),
          onClick: () => handleAction(restartExecution, record.executionId),
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
  }), [handleAction]);

  const baseColumns = useMemo(() => [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "NAME",
      dataIndex: "jobName",
      key: "jobName",
      align: "left",
    },
    {
      title: "CODE",
      dataIndex: "jobCode",
      key: "jobCode",
      align: "left",
      width: 140,
    },
    {
      title: "PARAMETER",
      dataIndex: "inputPayload",
      key: "inputPayload",
      align: "left",
      width: 300,
      ellipsis: true,
      render: (val) => val || "—",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (val) => val
        ? <Tag color={STATUS_COLORS[val] || "default"}>{val}</Tag>
        : "—",
    },
    {
      title: "STARTED",
      dataIndex: "startedAt",
      key: "startedAt",
      align: "left",
      width: 175,
      render: (val) => formatDate(val),
    },
    {
      title: "FINISHED",
      dataIndex: "completedAt",
      key: "completedAt",
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
    { path: "", breadcrumbName: "Job Execution List" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxCardContainer
        header="JOB EXECUTION LIST"
        actionElement={
          <div className="flex gap-2">
            <ButtonComponent
              type="primary"
              icon={<PlusCircleOutlined />}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
              onClick={() => {
                setSelectJobModalOpen(false);
                setTimeout(() => setSelectJobModalOpen(true), 0);
              }}
            >
              <span className="text-xs font-medium tracking-tight">Run Job</span>
            </ButtonComponent>
          </div>
        }
      >
        {actionLoading && (
          <div style={{ textAlign: "center", padding: 8 }}>
            <Spin size="small" /> Processing...
          </div>
        )}
        <NxTable
          idTable="job-execution-list-table"
          dataSource={accumulatedData}
          totalData={data?.totalElements}
          current={page}
          loading={loading}
          columns={processedColumns}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          tableScrolled={{ y: 500, x: "max-content" }}
          onSort={onSort}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          showExport={true}
          handleDownload={() => {}}
        />
      </NxCardContainer>

      <ModalSelectJob
        open={selectJobModalOpen}
        loading={actionLoading}
        onClose={() => setSelectJobModalOpen(false)}
        onSubmit={(values) => {
          dispatch(startExecution(values)).then((res) => {
            if (!res.error) {
              setSelectJobModalOpen(false);
              afterAction();
            }
          });
        }}
      />
    </>
  );
};

export default JobExecutionPage;
