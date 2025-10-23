import React, { useState } from "react";
import ModalCustom from "./ModalCustom";
import { Alert, Form } from "antd";
import InputComponent from "../InputComponent";
import ButtonComponent from "../ButtonComponent";
import { InfoCircleOutlined } from "@ant-design/icons";
import { requiredMessage } from "../../utils";

const ModalWarningConfirmation = ({
  header = "",
  alertMessage = "",
  openModal = false,
  handleClose = () => {},
  onFinish = () => {},
}) => {
  const [form] = Form.useForm();
  const [remark, setRemark] = useState("");
  const handleClear = () => {
    setRemark("");
    form.resetFields();
  };
  const handleCancelModalInactivateFinal = () => {
    handleClear();
    handleClose();
  };
  const handleSaveModalInactivateFinal = (result) => {
    onFinish(result, handleClear);
  };
  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={handleCancelModalInactivateFinal}
      header={header}
      width={850}
      type={"confirmation"}
      footer={
        <div className="w-full flex justify-end gap-5 p-4">
          <ButtonComponent
            onClick={handleCancelModalInactivateFinal}
            type="default"
          >
            Cancel
          </ButtonComponent>
          <ButtonComponent
            form="inactivateForm"
            type="submit"
            htmlType="submit"
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <Form
        id="inactivateForm"
        form={form}
        onFinish={handleSaveModalInactivateFinal}
      >
        <div className="flex flex-col gap-6">
          <Alert
            message={alertMessage}
            icon={<InfoCircleOutlined />}
            type={"warning"}
            showIcon
            className="inactivate-alert"
          />
          <Form.Item
            name={"remark"}
            rules={[{ message: requiredMessage("remark"), required: true }]}
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

export default ModalWarningConfirmation;
