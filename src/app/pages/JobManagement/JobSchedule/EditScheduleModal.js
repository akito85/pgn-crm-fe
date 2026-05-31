import React, { useEffect, useState } from "react";
import { Checkbox, Form } from "antd";
import NxModal from "../../../../components/Nx/NxModal";
import ButtonComponent from "../../../../components/ButtonComponent";
import NxDate from "../../../../components/Nx/NxDatePicker";
import ScheduleConfigFields, { FieldLabel, inputStyle } from "../JobExecution/ScheduleConfigFields";
import { CRON_PRESETS } from "../JobExecution/scheduleConstants";
import buildScheduleEditSubmit from "../JobExecution/buildScheduleEditSubmit";

// CRON schedules edit as Specific Days; INTERVAL schedules edit as Periodically.
const triggerForScheduleType = (t) => (t === "INTERVAL" ? "PERIODICALLY" : "SPECIFIC_DAYS");

// Pick the preset matching an existing cron, else "__custom__" so the raw cron
// shows in the custom input. Undefined when there is no cron (INTERVAL schedule).
const presetForCron = (cron) => {
  if (!cron) return undefined;
  return CRON_PRESETS.some((p) => p.value === cron) ? cron : "__custom__";
};

const EditScheduleModal = ({ open, schedule, loading, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [triggerType, setTriggerType] = useState("SPECIFIC_DAYS");
  const [cronPresetSeed, setCronPresetSeed] = useState(null);
  const [cascadeCancel, setCascadeCancel] = useState(false);

  useEffect(() => {
    if (!schedule) return;
    const tt = triggerForScheduleType(schedule.scheduleType);
    const seed = tt === "SPECIFIC_DAYS" ? presetForCron(schedule.cronExpression) : null;
    setTriggerType(tt);
    setCronPresetSeed(seed ?? null);
    setCascadeCancel(false);
    form.setFieldsValue({
      timezone: schedule.timezone ?? "UTC",
      cronExpression: schedule.cronExpression ?? "",
      cronSchedulePreset: seed,
      intervalSeconds: schedule.intervalSeconds ?? null,
      startTime: schedule.startTime ?? null,
      endTime: schedule.endTime ?? null,
      scheduledAt: undefined,
    });
  }, [schedule, form]);

  // Schedules carry an active window; only meaningful for the recurring types.
  const showWindow = triggerType === "SPECIFIC_DAYS" || triggerType === "PERIODICALLY";

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(buildScheduleEditSubmit({ triggerType, values, schedule, cancelInFlight: cascadeCancel }));
    });
  };

  return (
    <NxModal
      isOpen={open}
      title="Edit Schedule"
      loading={loading}
      handleCancel={onClose}
      width={620}
      footer={[
        <div className="flex flex-row justify-between items-center" key="f">
          <ButtonComponent size="small" key="cancel" onClick={onClose} disabled={loading}>Cancel</ButtonComponent>
          <ButtonComponent size="small" key="save" border={false}
            className="!bg-[#0075bf] !text-white !border-transparent" onClick={handleSubmit} loading={loading}>
            Save changes
          </ButtonComponent>
        </div>,
      ]}
    >
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ padding: "10px 12px", background: "#fff7e6", border: "1px solid #ffe7ba", borderRadius: 6, fontSize: 13, color: "#8c6d1f" }}>
          Editing changes only future runs. Runs already started will continue to completion unless you also cancel them below.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 0", fontSize: 13 }}>
          <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Job Code</span>
          <span style={{ fontWeight: 500, color: "#222" }}>{schedule?.jobCode ?? "—"}</span>
          <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Job Name</span>
          <span style={{ fontWeight: 500, color: "#222" }}>{schedule?.jobName ?? "—"}</span>
          <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Schedule</span>
          <span style={{ fontWeight: 500, color: "#222" }}>{schedule?.scheduleName ?? "—"}</span>
        </div>

        <Form form={form} layout="vertical" requiredMark={false}>
          <ScheduleConfigFields
            form={form}
            triggerType={triggerType}
            setTriggerType={setTriggerType}
            loading={loading}
            initialCronPreset={cronPresetSeed}
          />

          {showWindow && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
              <Form.Item name="startTime" label={<FieldLabel>Start</FieldLabel>} style={{ marginBottom: 0 }}>
                <NxDate showTime={true} placeholder="Optional start" disabled={loading} style={inputStyle} />
              </Form.Item>
              <Form.Item name="endTime" label={<FieldLabel>End</FieldLabel>} style={{ marginBottom: 0 }}>
                <NxDate showTime={true} placeholder="Optional end" disabled={loading} style={inputStyle} />
              </Form.Item>
            </div>
          )}
        </Form>

        <div style={{ padding: "10px 12px", background: "#fff7e6", border: "1px solid #ffe7ba", borderRadius: 6 }}>
          <Checkbox checked={cascadeCancel} onChange={(e) => setCascadeCancel(e.target.checked)}>
            Also cancel in-flight runs
          </Checkbox>
          <div style={{ fontSize: 12, color: "#8c6d1f", marginTop: 4, marginLeft: 24 }}>
            Cancels any queued or running executions this schedule already started. Leave unchecked to let them finish.
          </div>
        </div>
      </div>
    </NxModal>
  );
};

export default EditScheduleModal;
