import { useState } from "react";
import { Alert, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ModalCustom from "./ModalCustom";
import { requiredMessage } from "../../utils";
import ButtonComponent from "../ButtonComponent";
import InputComponent from "../InputComponent";

const ModalApproveOrReject = ({
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
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClear = () => {
    setRemark("");
    form.resetFields();
  };

  const handleCancelModalFinal = () => {
    handleClear();
    handleCloseModal();
  };

  const handleSaveModal = async (data) => {
    setIsSubmitting(true);
    try {
      await Promise.resolve(onFinish(data, handleClear));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleCancelModalFinal}
      header={`${header} information`}
      width={width}
      type={"confirmation"}
      loading={isSubmitting || loading}
      footer={
        <div className="w-full flex justify-end gap-2 p-4">
          <ButtonComponent onClick={handleCancelModalFinal} type="default" disabled={isSubmitting || loading}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            form="formApproveReject"
            type="submit"
            htmlType="submit"
            disabled={isSubmitting || loading}
            loading={isSubmitting || loading}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <Form
        id="formApproveReject"
        layout="vertical"
        form={form}
        onFinish={handleSaveModal}
      >
        {/* Alert Section */}
        <div className="flex flex-col justify-center gap-6">
          <Alert
            message={
              customMessage
                ? customMessage
                : `Are you sure you want to ${approveOrReject} this ${menu} named ${named}?`
            }
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            type={"warning"}
            showIcon
            className="p-0 m-0 break-all"
          />

          {children}

          <Form.Item
            name={"remark"}
            label={"Remark"}
            rules={[{ message: requiredMessage("Remark"), required: true }]}
            className="w-full"
          >
            <InputComponent
              group
              rows={1}
              type="textarea"
              value={remark}
              placeholder={"Type your remark"}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Item>
        </div>
      </Form>
    </ModalCustom>
  );
};

export default ModalApproveOrReject;
