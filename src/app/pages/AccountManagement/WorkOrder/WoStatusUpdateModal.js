import { useEffect } from "react";
import { Form, Select, Button, Input } from "antd";
import NxModal from "../../../components/Nx/NxModal";
import NxBaseContainer from "../../../components/Nx/NxBaseContainer";
import { requiredMessage } from "../../../utils";

const { TextArea } = Input;

const STATUS_LABELS = {
  IN_PROGRESS: "Mark as In Progress",
  ON_HOLD:     "Mark as On Hold",
  OPEN:        "Mark as Open",
  RESOLVED:    "Mark as Resolved",
  CLOSED:      "Mark as Closed",
  CANCELLED:   "Cancel Work Order",
};

/**
 * @param {{
 *   isOpen: boolean,
 *   toStatus: string | null,
 *   accountId: string | number,
 *   approvalHierarchies: Array,
 *   loading: boolean,
 *   onCancel: () => void,
 *   onSubmit: ({ toStatus, remark, cancelApphierId }) => void,
 * }} props
 */
const WoStatusUpdateModal = ({
  isOpen,
  toStatus,
  approvalHierarchies = [],
  loading,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const isCancel = toStatus === "CANCELLED";

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        toStatus,
        remark: values.remark,
        cancelApphierId: isCancel ? (values.cancelApphierId || null) : null,
      });
    } catch (_) {}
  };

  const title = STATUS_LABELS[toStatus] || "Update Status";

  const hierarchyOptions = (Array.isArray(approvalHierarchies) ? approvalHierarchies : []).map((item) => ({
    value: item.apphierId || item.id,
    label: item.apphierName || item.name || `Hierarchy #${item.apphierId || item.id}`,
  }));

  return (
    <NxModal
      isOpen={isOpen}
      title={title.toUpperCase()}
      handleCancel={onCancel}
      width={500}
      footer={
        <div className="flex justify-between">
          <Button type="menu" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} loading={loading}>
            Confirm
          </Button>
        </div>
      }
    >
      <div className="p-4">
        <NxBaseContainer border>
          <Form form={form} layout="vertical">
            {/* Cancel: must select approval hierarchy */}
            {isCancel && (
              <Form.Item
                name="cancelApphierId"
                label="Cancel Approval Hierarchy"
                rules={[{ required: true, message: requiredMessage("Cancel Approval Hierarchy") }]}
                className="no-margin-form mb-4"
              >
                <Select
                  placeholder="Select approval hierarchy for cancellation"
                  options={hierarchyOptions}
                  loading={!hierarchyOptions.length}
                />
              </Form.Item>
            )}

            {/* Remark — required for all transitions */}
            <Form.Item
              name="remark"
              label="Remark"
              rules={[{ required: true, message: requiredMessage("Remark") }]}
              className="no-margin-form"
            >
              <TextArea
                rows={3}
                maxLength={4000}
                showCount
                placeholder={
                  toStatus === "CLOSED"
                    ? "Remark is required when closing work order"
                    : "Enter remark"
                }
              />
            </Form.Item>
          </Form>
        </NxBaseContainer>
      </div>
    </NxModal>
  );
};

export default WoStatusUpdateModal;
