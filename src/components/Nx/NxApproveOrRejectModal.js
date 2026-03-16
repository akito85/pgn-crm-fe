import { Alert, Button, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { requiredMessage } from "../../utils";
import InputComponent from "../InputComponent";
import NxModal from "./NxModal";

const NxApproveOrRejectModal = ({
  isOpen = false,
  handleCloseModal = () => {},
  onFinish = () => {},
  header,
  approveOrReject,
  menu,
  named,
  children,
  customMessage,
  width = 1000,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleClear = () => {
    form.resetFields();
  };

  const handleCancelModalFinal = () => {
    handleClear();
    handleCloseModal();
  };

  const handleSaveModal = (data) => {
    onFinish(data, handleClear);
  };

  return (
    <NxModal
      isOpen={isOpen}
      handleCancel={handleCancelModalFinal}
      title={`${header} INFORMATION`}
      width={width}
      type={"confirmation"}
      loading={loading}
      footer={
        <div className="w-full flex justify-end">
          <Button onClick={handleCancelModalFinal} type="menu" disabled={loading}>
            Cancel
          </Button>
          <Button
            form="formApproveReject"
            type="submit"
            htmlType="submit"
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="p-4">
        <Form
          id="formApproveReject"
          layout="vertical"
          form={form}
          onFinish={handleSaveModal}
          className="flex flex-col gap-y-4"
        >
          {/* Alert Section */}
          <Alert
            message={
              customMessage
                ? customMessage
                : `Are you sure you want to ${approveOrReject} this ${menu} named ${named}?`
            }
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "16x", color: "#65481C" }}
              />
            }
            type={"warning"}
            showIcon
            className="p-0 m-0"
          />
          {children}
          <Form.Item
            name={"remark"}
            label={"Remark"}
            rules={[{ message: requiredMessage("Remark"), required: true }]}
            className="w-full no-margin-form"
          >
            <InputComponent
              group
              rows={1}
              type="textarea"
              placeholder={"Type your remark"}
              disabled={loading}
            />
          </Form.Item>
        </Form>
      </div>
    </NxModal>
  );
};

export default NxApproveOrRejectModal;
