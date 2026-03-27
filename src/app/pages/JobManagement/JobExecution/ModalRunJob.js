import React, { useCallback, useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Typography } from "antd";
import {
  SettingOutlined, ThunderboltOutlined, ClockCircleOutlined,
  SyncOutlined, CalendarOutlined, CheckOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import NxModal from "../../../../components/Nx/NxModal";
import NxTable from "../../../../components/Nx/NxTable";
import NxDate from "../../../../components/Nx/NxDatePicker";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useSearchJobsQuery } from "../../../../redux/slices/job_management/jobApiSlice";

// ─── Constants ────────────────────────────────────────────────────────────────

const MODAL_PAGE_SIZE = 20;

const TIMEZONES = [
  "UTC","Asia/Jakarta","Asia/Makassar","Asia/Jayapura",
  "America/New_York","Europe/London","Asia/Tokyo",
];

const TRIGGER_TYPES = ["IMMEDIATE","ONCE","PERIODICALLY","SPECIFIC_DAYS"];

const TRIGGER_META = {
  IMMEDIATE:    { icon: <ThunderboltOutlined />, label:"Immediate",    desc:"Run the job right now",                   color:"#f97316" },
  ONCE:         { icon: <ClockCircleOutlined />,  label:"Once",         desc:"Schedule for a specific date & time",    color:"#3b82f6" },
  PERIODICALLY: { icon: <SyncOutlined />,         label:"Periodically", desc:"Repeat at a fixed interval",             color:"#8b5cf6" },
  SPECIFIC_DAYS:{ icon: <CalendarOutlined />,     label:"Specific Days",desc:"Use a cron expression for scheduling",   color:"#10b981" },
};

// ─── AddJobIcon — same SVG as CreateJobGroupPage ───────────────────────────────

const AddJobIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 10.0007H12.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99992 7.5V12.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── WizardStepBar ────────────────────────────────────────────────────────────

const WizardStepBar = ({ current }) => {
  const done = current === "schedule";

  const stepCircle = (num, active, isDone) => (
    <div style={{
      width:30, height:30, borderRadius:"50%",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:13, fontWeight:700,
      background: isDone ? "#1976D2" : active ? "#e3f0fb" : "#f5f5f5",
      color:       isDone ? "#fff"    : active ? "#1976D2" : "#bbb",
      border: `2px solid ${isDone || active ? "#1976D2" : "#e0e0e0"}`,
      transition:"all 0.3s ease",
    }}>
      {isDone ? <CheckOutlined style={{ fontSize:13 }} /> : num}
    </div>
  );

  const stepLabel = (text, active) => (
    <span style={{ fontSize:13, fontWeight: active ? 600 : 500, color: active ? "#1976D2" : "#aaa", letterSpacing:"0.01em" }}>
      {text}
    </span>
  );

  return (
    <div style={{ display:"flex", alignItems:"center", padding:"16px 28px 0", borderBottom:"1px solid #f0f0f0", marginBottom:0 }}>
      {/* Step 1 */}
      <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:14, borderBottom:`2px solid #1976D2`, marginBottom:-1 }}>
        {stepCircle(1, !done, done)}
        {stepLabel("Select Job", !done || done)}
      </div>

      {/* Animated connector */}
      <div style={{ flex:1, height:2, margin:"0 14px", marginBottom:14, background:"#e0e0e0", position:"relative", overflow:"hidden", borderRadius:1 }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width: done ? "100%" : "0%", background:"#1976D2", transition:"width 0.4s ease" }} />
      </div>

      {/* Step 2 */}
      <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:14, borderBottom:`2px solid ${current === "schedule" ? "#1976D2" : "transparent"}`, marginBottom:-1 }}>
        {stepCircle(2, current === "schedule", false)}
        {stepLabel("Configure", current === "schedule")}
      </div>
    </div>
  );
};

// ─── TriggerCard ──────────────────────────────────────────────────────────────

const TriggerCard = ({ type, selected, onClick, disabled }) => {
  const meta = TRIGGER_META[type];
  const isSel = selected === type;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(type)}
      style={{
        display:"flex", alignItems:"center", gap:12,
        padding:"12px 14px", borderRadius:8,
        border: isSel ? `1px solid ${meta.color}30` : "1px solid #e8e8e8",
        borderLeft: isSel ? `3px solid ${meta.color}` : "1px solid #e8e8e8",
        background: isSel ? `${meta.color}0d` : "#fafafa",
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign:"left", width:"100%",
        transition:"all 0.18s ease", opacity: disabled ? 0.6 : 1,
        boxShadow: isSel ? `0 2px 8px ${meta.color}18` : "none",
      }}
    >
      <div style={{
        width:36, height:36, borderRadius:8, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:16, background: isSel ? meta.color : "#ebebeb",
        color: isSel ? "#fff" : "#999", transition:"all 0.18s ease",
      }}>
        {meta.icon}
      </div>
      <div>
        <div style={{ fontWeight:600, fontSize:13, color: isSel ? meta.color : "#333", lineHeight:"1.3", transition:"color 0.18s" }}>
          {meta.label}
        </div>
        <div style={{ fontSize:11.5, color:"#888", marginTop:1.5, lineHeight:"1.4" }}>
          {meta.desc}
        </div>
      </div>
    </button>
  );
};

// ─── Small helpers ────────────────────────────────────────────────────────────

const FieldLabel = ({ children, required }) => (
  <span style={{ fontWeight:500, fontSize:12.5, color:"#555" }}>
    {children}
    {required && <span style={{ color:"#ff4d4f", marginLeft:3 }}>*</span>}
  </span>
);

const inputStyle = { borderRadius:6, fontSize:13 };

const buildInputPayload = (paramValues, parameters) => {
  if (!parameters || parameters.length === 0) return undefined;
  const payload = {};
  parameters.forEach((p) => {
    const val = paramValues?.[p.code];
    if (val !== undefined && val !== null && val !== "") payload[p.code] = val;
  });
  return Object.keys(payload).length > 0 ? JSON.stringify(payload) : undefined;
};

// ─── Job selection columns ────────────────────────────────────────────────────

const JOB_COLS_BASE = [
  { title:"NO",   width:60,  align:"center", render:(_, __, i) => i + 1 },
  { title:"NAME", dataIndex:"name", key:"name",  align:"left" },
  { title:"CODE", dataIndex:"code", key:"code",  align:"left", width:140 },
  { title:"TYPE", dataIndex:"type", key:"type",  align:"left", width:120 },
  { title:"DESC", dataIndex:"desc", key:"desc",  align:"left", ellipsis:true },
];

// ─── ModalRunJob ──────────────────────────────────────────────────────────────

const ModalRunJob = ({ open, loading, onClose, onSubmit }) => {
  const [step,        setStep]        = useState("select");
  const [selectedJob, setSelectedJob] = useState(null);
  const [triggerType, setTriggerType] = useState("IMMEDIATE");
  const [modalPage,   setModalPage]   = useState(0);
  const [allJobs,     setAllJobs]     = useState([]);
  const [hasMore,     setHasMore]     = useState(true);
  const isResetRef = React.useRef(false);
  const [form] = Form.useForm();

  // Reset all state when modal closes
  useEffect(() => {
    if (!open) {
      setStep("select"); setSelectedJob(null); setTriggerType("IMMEDIATE");
      setModalPage(0); setAllJobs([]); setHasMore(true);
      isResetRef.current = false; form.resetFields();
    }
  }, [open, form]);

  const { data: allJobsData, isLoading: allJobsLoading } = useSearchJobsQuery(
    { page: modalPage, size: MODAL_PAGE_SIZE },
    { skip: !open }
  );

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

  const loadMoreData = useCallback(() => new Promise((resolve) => {
    if (!hasMore || allJobsLoading) { resolve(); return; }
    setModalPage(prev => prev + 1);
    setTimeout(resolve, 0);
  }), [hasMore, allJobsLoading]);

  const handleBack = () => {
    setStep("select"); setSelectedJob(null);
    form.resetFields(); setTriggerType("IMMEDIATE");
  };

  const handleStart = () => {
    form.validateFields().then((values) => {
      const { params: _params, ...scheduleValues } = values;
      const inputPayload = buildInputPayload(_params, selectedJob.parameters);
      onSubmit({ jobId: selectedJob.id, triggerType, ...scheduleValues, inputPayload });
    });
  };

  // Action column — AddJobIcon navigates to step 2
  const actionColumn = {
    title: "", key: "select-action", width: 70, align: "center",
    render: (_, record) => (
      <button
        type="button"
        style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", alignItems:"center" }}
        onClick={() => {
          setSelectedJob({ id: record.id, name: record.name, code: record.code, parameters: record.parameters ?? [] });
          setStep("schedule");
        }}
      >
        <AddJobIcon />
      </button>
    ),
  };

  const jobColumns = [...JOB_COLS_BASE, actionColumn];

  // ── Step 2 ────────────────────────────────────────────────────────────────

  const renderStep2 = () => (
    <div style={{ padding:"0 24px 8px" }}>

      {/* Job info banner */}
      <div style={{
        background:"linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)",
        border:"1px solid #c8e0fa", borderRadius:10,
        padding:"14px 18px", marginBottom:20, marginTop:16,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{
            width:42, height:42, borderRadius:9, flexShrink:0,
            background:"linear-gradient(135deg, #1565C0, #1976D2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 2px 8px rgba(25,118,210,0.3)",
          }}>
            <SettingOutlined style={{ color:"#fff", fontSize:18 }} />
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:14.5, color:"#1a2a3a", lineHeight:1.3 }}>
              {selectedJob?.name ?? "—"}
            </div>
            <div style={{ fontSize:12, color:"#5a7a99", marginTop:3, fontFamily:"monospace", letterSpacing:"0.04em" }}>
              {selectedJob?.code ?? "—"}
            </div>
          </div>
        </div>
        <div style={{
          padding:"3px 10px", borderRadius:12,
          background:"#1976D2", color:"#fff",
          fontSize:11, fontWeight:600, letterSpacing:"0.04em", flexShrink:0,
        }}>
          STEP 2 OF 2
        </div>
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>

        {/* Trigger type */}
        <div style={{ fontWeight:600, fontSize:11.5, color:"#666", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>
          Trigger Type
        </div>
        <Form.Item style={{ marginBottom:18 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {TRIGGER_TYPES.map((t) => (
              <TriggerCard key={t} type={t} selected={triggerType} disabled={loading}
                onClick={(val) => {
                  setTriggerType(val);
                  form.resetFields(["scheduledAt","intervalSeconds","cronExpression","timezone"]);
                }}
              />
            ))}
          </div>
        </Form.Item>

        {/* IMMEDIATE — confirmation chip */}
        {triggerType === "IMMEDIATE" && (
          <div style={{
            display:"flex", alignItems:"center", gap:9,
            padding:"10px 14px", borderRadius:8,
            background:"#f0fdf4", border:"1px solid #bbf7d0", marginBottom:16,
          }}>
            <CheckCircleOutlined style={{ color:"#16a34a", fontSize:15 }} />
            <span style={{ fontSize:13, color:"#15803d", fontWeight:500 }}>
              Will run immediately — no schedule required
            </span>
          </div>
        )}

        {/* ONCE — NxDate with showTime */}
        {triggerType === "ONCE" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <Form.Item name="scheduledAt" label={<FieldLabel required>Scheduled At</FieldLabel>}
              rules={[{ required:true, message:"Required" }]} style={{ marginBottom:0 }}>
              <NxDate showTime={true} placeholder="Select date & time" disabled={loading} style={inputStyle} />
            </Form.Item>
            <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC" style={{ marginBottom:0 }}>
              <Select options={TIMEZONES.map(z => ({ value:z, label:z }))} disabled={loading} style={inputStyle} />
            </Form.Item>
          </div>
        )}

        {/* PERIODICALLY */}
        {triggerType === "PERIODICALLY" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <Form.Item name="intervalSeconds" label={<FieldLabel required>Interval (seconds)</FieldLabel>}
              rules={[{ required:true, message:"Required" }]} style={{ marginBottom:0 }}>
              <InputNumber min={1} placeholder="3600" style={{ width:"100%", ...inputStyle }} disabled={loading} />
            </Form.Item>
            <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC" style={{ marginBottom:0 }}>
              <Select options={TIMEZONES.map(z => ({ value:z, label:z }))} disabled={loading} style={inputStyle} />
            </Form.Item>
          </div>
        )}

        {/* SPECIFIC_DAYS */}
        {triggerType === "SPECIFIC_DAYS" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <Form.Item name="cronExpression" label={<FieldLabel required>Cron Expression</FieldLabel>}
              rules={[{ required:true, message:"Required" }]} style={{ marginBottom:0 }}>
              <Input placeholder="0 0 * * MON-FRI" disabled={loading} style={inputStyle} />
            </Form.Item>
            <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC" style={{ marginBottom:0 }}>
              <Select options={TIMEZONES.map(z => ({ value:z, label:z }))} disabled={loading} style={inputStyle} />
            </Form.Item>
          </div>
        )}

        {/* Parameters */}
        {selectedJob?.parameters?.length > 0 ? (
          <div style={{ background:"#fafbfc", border:"1px solid #eef0f3", borderRadius:8, padding:16, marginTop:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <div style={{ flex:1, height:1, background:"#e8eaed" }} />
              <span style={{ fontWeight:600, fontSize:10.5, color:"#888", textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>
                Parameters
              </span>
              <div style={{ flex:1, height:1, background:"#e8eaed" }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {selectedJob.parameters.map((param) => (
                <Form.Item key={param.code} name={["params", param.code]}
                  label={<FieldLabel required={param.required}>{param.name}</FieldLabel>}
                  rules={(param.required ?? false) ? [{ required:true, message:`${param.name} is required` }] : []}
                  style={{ marginBottom:0 }}>
                  {param.type === "Number"  && <InputNumber style={{ width:"100%", ...inputStyle }} disabled={loading} />}
                  {param.type === "Boolean" && (
                    <Select disabled={loading} style={inputStyle}>
                      <Select.Option value={true}>True</Select.Option>
                      <Select.Option value={false}>False</Select.Option>
                    </Select>
                  )}
                  {(param.type === "Date" || param.type === "String" || !param.type) && (
                    <Input placeholder={param.type === "Date" ? "YYYY-MM-DD" : ""} disabled={loading} style={inputStyle} />
                  )}
                </Form.Item>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"12px 16px", borderRadius:8,
            background:"#f9fafb", border:"1px dashed #e0e3e7", marginTop:4,
          }}>
            <CheckCircleOutlined style={{ color:"#10b981", fontSize:15 }} />
            <Typography.Text type="secondary" style={{ fontSize:13 }}>
              This job requires no additional parameters.
            </Typography.Text>
          </div>
        )}
      </Form>
    </div>
  );

  // ── Modal assembly ────────────────────────────────────────────────────────

  const modalTitle = (
    <div>
      <div style={{ fontWeight:700, fontSize:16, color:"#1a2a3a" }}>
        {step === "select" ? "Run Job" : "Configure Schedule"}
      </div>
      <div style={{ fontSize:12.5, color:"#888", marginTop:2, fontWeight:400 }}>
        {step === "select" ? "Select a job to queue for execution" : "Set trigger type and parameters"}
      </div>
    </div>
  );

  const footer = (
    <div style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"12px 24px", borderTop:"1px solid #f0f0f0",
      background:"#fafafa", borderRadius:"0 0 12px 12px",
    }}>
      <ButtonComponent onClick={onClose} disabled={loading}
        style={{ minWidth:88, height:38, borderRadius:7, border:"1px solid #d9d9d9", background:"#fff", color:"#555", fontWeight:500, fontSize:13 }}>
        Cancel
      </ButtonComponent>
      <div style={{ display:"flex", gap:8 }}>
        {step === "schedule" && (
          <ButtonComponent onClick={handleBack} disabled={loading}
            style={{ minWidth:80, height:38, borderRadius:7, border:"1px solid #d9d9d9", background:"#fff", color:"#555", fontWeight:500, fontSize:13 }}>
            ← Back
          </ButtonComponent>
        )}
        {step === "schedule" && (
          <ButtonComponent type="primary" isPrimary onClick={handleStart} loading={loading}
            style={{
              minWidth:110, height:38, borderRadius:7,
              background:"linear-gradient(135deg, #1565C0, #1976D2)",
              border:"none", color:"#fff", fontWeight:600, fontSize:13,
              boxShadow:"0 2px 10px rgba(25,118,210,0.35)",
            }}>
            {loading ? "Starting…" : "Start Job"}
          </ButtonComponent>
        )}
      </div>
    </div>
  );

  return (
    <NxModal isOpen={open} title={modalTitle} width={900} loading={loading} closeable handleCancel={onClose} footer={footer}>
      <WizardStepBar current={step} />
      <div style={{ paddingBottom:4 }}>
        {step === "select" && (
          <div style={{ padding:"16px 16px 0" }}>
            <NxTable
              idTable="modal-run-job-table"
              dataSource={allJobs}
              loading={allJobsLoading}
              columns={jobColumns}
              useInfiniteScroll={true}
              useSearch={true}
              useAdvanceSearch={true}
              useColumnSettings={true}
              tableScrolled={{ y:400, x:"max-content" }}
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

export default ModalRunJob;
