import React, { useState } from "react";
import { Button, Form, message } from "antd";
import NxModal from "../../../../components/Nx/NxModal";
import ScheduleConfigFields from "../JobExecution/ScheduleConfigFields";
import { useRunJobGroupMutation } from "../../../../redux/slices/job_management/jobGroupApiSlice";

// Chained groups schedule the workflow START — Periodically excluded (overlap risk).
const CHAINED_TRIGGERS = ["IMMEDIATE", "ONCE", "SPECIFIC_DAYS"];
const ALL_TRIGGERS = ["IMMEDIATE", "ONCE", "PERIODICALLY", "SPECIFIC_DAYS"];

const ModalRunGroup = ({ open, group, onClose }) => {
  const [form] = Form.useForm();
  const [triggerType, setTriggerType] = useState("IMMEDIATE");
  const [runJobGroup, { isLoading }] = useRunJobGroupMutation();

  const isChained = group?.groupType === "CHAINED";
  const allowed = isChained ? CHAINED_TRIGGERS : ALL_TRIGGERS;

  const handleRun = () => {
    form.validateFields().then((values) => {
      const { cronSchedulePreset, ...rest } = values;
      runJobGroup({ id: group.id, body: { triggerType, ...rest } })
        .unwrap()
        .then(() => { message.success("Group run dispatched"); onClose(); })
        .catch((e) => message.error(e?.data?.message || "Failed to run group"));
    });
  };

  return (
    <NxModal
      isOpen={open}
      title={`Run Group — ${group?.name ?? ""}`}
      width={620}
      loading={isLoading}
      handleCancel={onClose}
      footer={[
        <div className="flex justify-between items-center" key="f">
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="primary" onClick={handleRun} loading={isLoading}>Run</Button>
        </div>,
      ]}
    >
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 0", fontSize: 13, marginBottom: 16 }}>
          <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Code</span>
          <span style={{ fontWeight: 500 }}>{group?.code ?? "—"}</span>
          <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Type</span>
          <span style={{ fontWeight: 500 }}>{isChained ? "Chained" : "Unrelated"}</span>
        </div>
        <Form form={form} layout="vertical" requiredMark={false}>
          <ScheduleConfigFields
            form={form}
            triggerType={triggerType}
            setTriggerType={setTriggerType}
            loading={isLoading}
            allowedTriggers={allowed}
          />
        </Form>
      </div>
    </NxModal>
  );
};

export default ModalRunGroup;
