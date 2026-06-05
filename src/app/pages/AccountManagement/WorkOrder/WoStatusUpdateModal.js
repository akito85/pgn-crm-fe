import { useEffect } from "react";
import { Form, Select, Button, Input, Alert } from "antd";
import NxModal from "../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import { requiredMessage } from "../../../../utils";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import InputComponent from "../../../../components/InputComponent";

const { TextArea } = Input;

const STATUS_LABELS = {
  IN_PROGRESS: "In Progress",
  ON_HOLD:     "On Hold",
  OPEN:        "Open",
  RESOLVED:    "Resolved",
  CLOSED:      "Closed",
  CANCELLED:   "Cancelled",
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
  woData,
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

  const descriptionMessage = toStatus === "CLOSED" || toStatus === "CANCELLED" ? `You cannot change the status of this data again once it has been changed to ${toStatus}.` : "";

  const hierarchyOptions = (Array.isArray(approvalHierarchies) ? approvalHierarchies : []).map((item) => ({
    value: item.apphierId || item.id,
    label: item.apphierName || item.name || `Hierarchy #${item.apphierId || item.id}`,
  }));

  return (
    <NxModal
      isOpen={isOpen}
      title="UPDATE STATUS CONFIRMATION"
      handleCancel={onCancel}
      width={850}
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
      <div className="p-4 flex flex-col gap-y-4">
        <Alert
            message={`Are you sure you want to update ${woData?.woNumber} - ${woData?.woCategoryName} to ${title}?`
            }
            description = {descriptionMessage}
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            type={"warning"}
            showIcon
            className="p-0 m-0 break-all"
          />
          <Form form={form} layout="vertical">
            {/* Cancel: must select approval hierarchy */}
            <div className="flex flex-col gap-y-4">
              {isCancel && (
                <Form.Item
                  name="cancelApphierId"
                  label="Cancel Approval Hierarchy"
                  rules={[{ required: true, message: requiredMessage("Cancel Approval Hierarchy") }]}
                  className="no-margin-form"
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
                <InputComponent type="textarea" 
                  placeholder={
                    toStatus === "CLOSED"
                      ? "Remark is required when closing work order"
                      : "Enter remark"} 
                      
                />
              </Form.Item>
            </div>
          </Form>
      </div>
    </NxModal>
  );
};

export default WoStatusUpdateModal;
