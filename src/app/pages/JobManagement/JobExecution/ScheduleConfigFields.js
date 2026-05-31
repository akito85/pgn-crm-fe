import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import NxDate from "../../../../components/Nx/NxDatePicker";
import { TIMEZONES, TRIGGER_TYPES, TRIGGER_META, CRON_PRESETS } from "./scheduleConstants";

const inputStyle = { borderRadius: 6, fontSize: 13 };

const FieldLabel = ({ children, required }) => (
  <span style={{ fontWeight: 500, fontSize: 12.5, color: "#555" }}>
    {children}
    {required && <span style={{ color: "#ff4d4f", marginLeft: 3 }}>*</span>}
  </span>
);

const TriggerCard = ({ type, selected, onClick, disabled }) => {
  const meta = TRIGGER_META[type];
  const isSel = selected === type;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(type)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px", borderRadius: 8,
        border: isSel ? `1px solid ${meta.color}30` : "1px solid #e8e8e8",
        borderLeft: isSel ? `3px solid ${meta.color}` : "1px solid #e8e8e8",
        background: isSel ? `${meta.color}0d` : "#fafafa",
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left", width: "100%",
        transition: "all 0.18s ease", opacity: disabled ? 0.6 : 1,
        boxShadow: isSel ? `0 2px 8px ${meta.color}18` : "none",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, background: isSel ? meta.color : "#ebebeb",
        color: isSel ? "#fff" : "#999", transition: "all 0.18s ease",
      }}>
        {meta.icon}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: isSel ? meta.color : "#333", lineHeight: "1.3" }}>
          {meta.label}
        </div>
        <div style={{ fontSize: 11.5, color: "#888", marginTop: 1.5, lineHeight: "1.4" }}>
          {meta.desc}
        </div>
      </div>
    </button>
  );
};

/**
 * Shared trigger-type + schedule configuration fields.
 * Used by ModalRunJob (run a job) and EditScheduleModal (edit a schedule).
 * The parent owns `form`, `triggerType` and `setTriggerType`; this component
 * renders the cards and the field block for the current trigger type and
 * resets dependent fields when the trigger type changes.
 *
 * `initialCronPreset` seeds the cron preset selection — used by the edit modal
 * to pre-select the preset (or "__custom__") that matches an existing schedule.
 * The run modal leaves it null (always starts fresh).
 */
const ScheduleConfigFields = ({ form, triggerType, setTriggerType, loading = false, initialCronPreset = null, allowedTriggers = TRIGGER_TYPES }) => {
  const [cronPreset, setCronPreset] = useState(initialCronPreset);

  // Re-seed when the parent supplies a new preset (e.g. opening edit on a
  // different schedule). Manual dropdown changes don't change initialCronPreset.
  useEffect(() => {
    setCronPreset(initialCronPreset);
  }, [initialCronPreset]);

  const handleTriggerChange = (val) => {
    setTriggerType(val);
    setCronPreset(null);
    form.resetFields(["scheduledAt", "intervalSeconds", "cronExpression", "cronSchedulePreset", "timezone"]);
  };

  return (
    <>
      <div style={{ fontWeight: 600, fontSize: 11.5, color: "#666", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
        Trigger Type
      </div>
      <Form.Item style={{ marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {allowedTriggers.map((t) => (
            <TriggerCard key={t} type={t} selected={triggerType} disabled={loading} onClick={handleTriggerChange} />
          ))}
        </div>
      </Form.Item>

      {triggerType === "IMMEDIATE" && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16 }}>
          <CheckCircleOutlined style={{ color: "#16a34a", fontSize: 15 }} />
          <span style={{ fontSize: 13, color: "#15803d", fontWeight: 500 }}>Will run immediately — no schedule required</span>
        </div>
      )}

      {triggerType === "ONCE" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Form.Item name="scheduledAt" label={<FieldLabel required>Scheduled At</FieldLabel>} rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
            <NxDate showTime={true} placeholder="Select date & time" disabled={loading} style={inputStyle} />
          </Form.Item>
          <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC" style={{ marginBottom: 0 }}>
            <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} style={inputStyle} />
          </Form.Item>
        </div>
      )}

      {triggerType === "PERIODICALLY" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Form.Item name="intervalSeconds" label={<FieldLabel required>Interval (seconds)</FieldLabel>} rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
            <InputNumber min={1} placeholder="3600" style={{ width: "100%", ...inputStyle }} disabled={loading} />
          </Form.Item>
          <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC" style={{ marginBottom: 0 }}>
            <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} style={inputStyle} />
          </Form.Item>
        </div>
      )}

      {triggerType === "SPECIFIC_DAYS" && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: cronPreset ? 10 : 0 }}>
            <Form.Item name="cronSchedulePreset" label={<FieldLabel required>Schedule</FieldLabel>} rules={[{ required: true, message: "Please select a schedule" }]} style={{ marginBottom: 0 }}>
              <Select
                optionLabelProp="label"
                placeholder="Select a schedule..."
                disabled={loading}
                style={{ width: "100%", ...inputStyle }}
                onChange={(val) => {
                  setCronPreset(val);
                  form.setFieldValue("cronExpression", val !== "__custom__" ? val : "");
                }}
              >
                {CRON_PRESETS.map((p) => (
                  <Select.Option key={p.value} value={p.value} label={p.label}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{p.label}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{p.hint}</div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="timezone" label={<FieldLabel>Timezone</FieldLabel>} initialValue="UTC" style={{ marginBottom: 0 }}>
              <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} style={inputStyle} />
            </Form.Item>
          </div>

          {cronPreset && cronPreset !== "__custom__" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f0f7ff", border: "1px solid #c8e0fa", borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: "#5a7a99" }}>Cron:</span>
              <code style={{ fontSize: 12, fontFamily: "monospace", color: "#1565C0", fontWeight: 600 }}>{cronPreset}</code>
              <span style={{ fontSize: 11, color: "#888" }}>— {CRON_PRESETS.find((p) => p.value === cronPreset)?.hint}</span>
            </div>
          )}

          {cronPreset === "__custom__" && (
            <Form.Item name="cronExpression" label={<FieldLabel required>Cron Expression</FieldLabel>} rules={[{ required: true, message: "Required" }]} style={{ marginBottom: 0 }}>
              <Input placeholder="e.g. 0 0 * * MON-FRI" disabled={loading} style={inputStyle} />
            </Form.Item>
          )}
        </div>
      )}
    </>
  );
};

export { FieldLabel, inputStyle };
export default ScheduleConfigFields;
