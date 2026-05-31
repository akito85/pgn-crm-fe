import React, { useEffect, useState } from "react";
import { Checkbox, Input, InputNumber, Select } from "antd";
import NxModal from "../../../../components/Nx/NxModal";
import ButtonComponent from "../../../../components/ButtonComponent";

const toLocalInput = (v) => (v ? String(v).slice(0, 16) : ""); // "YYYY-MM-DDTHH:mm"

const EditScheduleModal = ({ open, schedule, loading, onClose, onSubmit }) => {
  const [form, setForm] = useState({});
  const [cascadeCancel, setCascadeCancel] = useState(false);

  useEffect(() => {
    if (!schedule) return;
    setForm({
      scheduleName: schedule.scheduleName ?? "",
      scheduleType: schedule.scheduleType ?? "CRON",
      cronExpression: schedule.cronExpression ?? "",
      intervalSeconds: schedule.intervalSeconds ?? null,
      timezone: schedule.timezone ?? "UTC",
      startTime: toLocalInput(schedule.startTime),
      endTime: toLocalInput(schedule.endTime),
    });
    setCascadeCancel(false);
  }, [schedule]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const isCron = form.scheduleType === "CRON";

  const handleSubmit = () => {
    const payload = {
      scheduleName: form.scheduleName,
      scheduleType: form.scheduleType,
      cronExpression: isCron ? form.cronExpression : null,
      intervalSeconds: isCron ? null : form.intervalSeconds,
      timezone: form.timezone,
      startTime: form.startTime ? `${form.startTime}:00` : null,
      endTime: form.endTime ? `${form.endTime}:00` : null,
    };
    onSubmit({ scheduleId: schedule.scheduleId, payload, cancelInFlight: cascadeCancel });
  };

  return (
    <NxModal
      isOpen={open}
      title="Edit Schedule"
      loading={loading}
      handleCancel={onClose}
      width={520}
      footer={[
        <div className="flex flex-row justify-between items-center" key="f">
          <ButtonComponent size="small" key="cancel" onClick={onClose} disabled={loading}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            size="small"
            key="save"
            border={false}
            className="!bg-[#0075bf] !text-white !border-transparent"
            onClick={handleSubmit}
            loading={loading}
          >
            Save changes
          </ButtonComponent>
        </div>,
      ]}
    >
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ padding: "10px 12px", background: "#fff7e6", border: "1px solid #ffe7ba", borderRadius: 6, fontSize: 13, color: "#8c6d1f" }}>
          Editing changes only future runs. Runs already started will continue to
          completion unless you also cancel them below.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 0", fontSize: 13 }}>
          <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Job Code</span>
          <span style={{ fontWeight: 500, color: "#222" }}>{schedule?.jobCode ?? "—"}</span>
          <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Job Name</span>
          <span style={{ fontWeight: 500, color: "#222" }}>{schedule?.jobName ?? "—"}</span>
        </div>

        <label style={{ fontSize: 12, color: "#555" }}>Schedule name
          <Input value={form.scheduleName} onChange={(e) => set("scheduleName", e.target.value)} />
        </label>

        <label style={{ fontSize: 12, color: "#555" }}>Type
          <Select
            value={form.scheduleType}
            onChange={(v) => set("scheduleType", v)}
            options={[{ value: "CRON", label: "CRON" }, { value: "INTERVAL", label: "INTERVAL" }]}
            style={{ width: "100%" }}
          />
        </label>

        {isCron ? (
          <label style={{ fontSize: 12, color: "#555" }}>Cron expression
            <Input value={form.cronExpression} placeholder="0 0 * * *"
                   onChange={(e) => set("cronExpression", e.target.value)} />
          </label>
        ) : (
          <label style={{ fontSize: 12, color: "#555" }}>Interval (seconds)
            <InputNumber min={1} value={form.intervalSeconds} style={{ width: "100%" }}
                         onChange={(v) => set("intervalSeconds", v)} />
          </label>
        )}

        <label style={{ fontSize: 12, color: "#555" }}>Timezone
          <Input value={form.timezone} onChange={(e) => set("timezone", e.target.value)} />
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <label style={{ fontSize: 12, color: "#555", flex: 1 }}>Start
            <Input type="datetime-local" value={form.startTime}
                   onChange={(e) => set("startTime", e.target.value)} />
          </label>
          <label style={{ fontSize: 12, color: "#555", flex: 1 }}>End
            <Input type="datetime-local" value={form.endTime}
                   onChange={(e) => set("endTime", e.target.value)} />
          </label>
        </div>

        <div style={{ padding: "10px 12px", background: "#fff7e6", border: "1px solid #ffe7ba", borderRadius: 6 }}>
          <Checkbox checked={cascadeCancel} onChange={(e) => setCascadeCancel(e.target.checked)}>
            Also cancel in-flight runs
          </Checkbox>
          <div style={{ fontSize: 12, color: "#8c6d1f", marginTop: 4, marginLeft: 24 }}>
            Cancels any queued or running executions this schedule already started.
            Leave unchecked to let them finish.
          </div>
        </div>
      </div>
    </NxModal>
  );
};

export default EditScheduleModal;
