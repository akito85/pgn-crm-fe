import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Select, Typography } from "antd";
import {
  SettingOutlined, CheckOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import NxModal from "../../../../components/Nx/NxModal";
import NxTable from "../../../../components/Nx/NxTable";
import useModalInfiniteData from "../../../../components/Nx/NxTable/hooks/useModalInfiniteData";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import { useSearchJobsQuery } from "../../../../redux/slices/job_management/jobApiSlice";
import ScheduleConfigFields, { FieldLabel, inputStyle } from "./ScheduleConfigFields";

// ─── Constants ────────────────────────────────────────────────────────────────

const MODAL_PAGE_SIZE = 10;

// ─── AddJobIcon ────────────────────────────────────────────────────────────────────

const AddJobIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 10.0007H12.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99992 7.5V12.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── WizardStepBar ────────────────────────────────────────────────────────────────────

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
        {stepLabel("Select Job", !done)}
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

// ─── Small helpers ────────────────────────────────────────────────────────────

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
  { title:"NO",   width:60,  align:"center", fixed:"left", render:(_, __, i) => i + 1 },
  { title:"NAME", dataIndex:"name", key:"name",  align:"left", fixed:"left" },
  { title:"CODE", dataIndex:"code", key:"code",  align:"left", width:140 },
  { title:"TYPE", dataIndex:"type", key:"type",  align:"left", width:120 },
  { title:"DESC", dataIndex:"desc", key:"desc",  align:"left", ellipsis:true },
];

// ─── ModalRunJob ──────────────────────────────────────────────────────────────

const ModalRunJob = ({ open, loading, onClose, onSubmit }) => {
  const [step,        setStep]        = useState("select");
  const [selectedJob, setSelectedJob] = useState(null);
  const [triggerType, setTriggerType] = useState("IMMEDIATE");
  const [ready,       setReady]       = useState(false);
  const [form] = Form.useForm();

  // Encapsulated infinite-scroll data management with RTK Query cache-busting.
  // Replaces manual modalPage/allJobs/hasMore/isResetRef/pendingResolveRef state.
  const jobs = useModalInfiniteData({
    queryHook: useSearchJobsQuery,
    pageSize: MODAL_PAGE_SIZE,
    enabled: open,
  });

  // Open/close lifecycle.
  // Deferred mount via setTimeout: NxTable only renders after the AntD 4.x
  // modal animation settles (~300ms), preventing dimension measurement during
  // the CSS transform transition that causes the visible "glitch".
  useEffect(() => {
    if (open) {
      jobs.open();
      const timer = setTimeout(() => setReady(true), 300);
      return () => clearTimeout(timer);
    } else {
      jobs.close();
      setStep("select"); setSelectedJob(null); setTriggerType("IMMEDIATE");
      setReady(false);
      form.resetFields();
    }
  }, [open, form, jobs.open, jobs.close]); // jobs.open/close are stable (useCallback)

  const handleBack = () => {
    setStep("select"); setSelectedJob(null);
    form.resetFields(); setTriggerType("IMMEDIATE");
  };

  const handleStart = () => {
    form.validateFields().then((values) => {
      if (!selectedJob) return;
      const { params: _params, cronSchedulePreset: _preset, ...scheduleValues } = values;
      const inputPayload = buildInputPayload(_params, selectedJob.parameters);
      onSubmit({ jobId: selectedJob.id, triggerType, ...scheduleValues, inputPayload });
    });
  };

  // Action column — AddJobIcon navigates to step 2
  const actionColumn = {
    title: "ACTION", key: "select-action", width: 70, align: "center", fixed:"right",
    render: (_, record) => (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
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
      </div>
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

        <ScheduleConfigFields
          form={form}
          triggerType={triggerType}
          setTriggerType={setTriggerType}
          loading={loading}
        />

        {/* Parameters */}
        {selectedJob?.parameters?.length > 0 ? (
          <NxBaseContainer header="Parameters" border={true} padding={true}>
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
          </NxBaseContainer>
        ) : (
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"12px 16px", borderRadius:8,
            background:"#f9fafb", border:"1px dashed #e0e3e7", marginTop:4,
          }}>
            <CheckCircleOutlined style={{ color:"#10b981", fontSize:15 }} />
            <Typography.Text type="secondary" style={{ fontSize:13 }}>
              No parameters required
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
    <>
      <Button onClick={onClose} disabled={loading}
        style={{ minWidth:88, height:38, borderRadius:7, border:"1px solid #d9d9d9", background:"#fff", color:"#555", fontWeight:500, fontSize:13 }}>
        Cancel
      </Button>
      <div style={{ display:"flex", gap:8 }}>
        {step === "schedule" && (
          <Button onClick={handleBack} disabled={loading}
            style={{ minWidth:80, height:38, borderRadius:7, border:"1px solid #d9d9d9", background:"#fff", color:"#555", fontWeight:500, fontSize:13 }}>
            ← Back
          </Button>
        )}
        {step === "schedule" && (
          <Button type="primary" onClick={handleStart} loading={loading}
            style={{
              minWidth:110, height:38, borderRadius:7,
              background:"linear-gradient(135deg, #1565C0, #1976D2)",
              border:"none", color:"#fff", fontWeight:600, fontSize:13,
              boxShadow:"0 2px 10px rgba(25,118,210,0.35)",
            }}>
            Start Job
          </Button>
        )}
      </div>
    </>
  );

  return (
    <NxModal isOpen={open} title={modalTitle} width={900} loading={loading} handleCancel={onClose} footer={footer}
      className="[&_.ant-modal-footer]:flex [&_.ant-modal-footer]:justify-between [&_.ant-modal-footer]:items-center">
      <WizardStepBar current={step} />
      <div style={{ paddingBottom:4 }}>
        {step === "select" && ready && (
          <div style={{ padding:"16px 16px 0" }}>
            <NxTable
              idTable="modal-run-job-table"
              dataSource={jobs.data}
              loading={jobs.loading}
              columns={jobColumns}
              columnDefinitions={jobColumns.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title }))}
              useInfiniteScroll={true}
              usePagination={false}
              useSelect={true}
              showSearchBar={true}
              showAdvanceSearch={true}
              showExport={false}
              autoHeight={false}
              tableScrolled={{ y:320, x:"max-content" }}
              rowKey="id"
              onLoadMore={jobs.loadMore}
              hasMore={jobs.hasMore}
            />
          </div>
        )}
        {step === "schedule" && renderStep2()}
      </div>
    </NxModal>
  );
};

export default ModalRunJob;
