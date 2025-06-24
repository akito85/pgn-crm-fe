import { WarningOutlined } from "@ant-design/icons";
import { Alert, Form, Input } from "antd";
import React from "react";
import ButtonComponent from "../ButtonComponent";
import { formMessageRequired } from "../../utils";

const ModalRemarkConfirmation = (props) => {
  const { onFinish = () => { }, handleOpen = () => { }, handleCancel = () => { }, message } = props;
  const [form] = Form.useForm();
  return (
    <div className={"w-full justify-center my-4 flex flex-col text-sm"}>
      <Alert
        message={message}
        icon={<WarningOutlined />}
        type={"warning"}
        showIcon
        className={"py-4"}
      />
      <div className={"mt-4"}>
        <Form
          form={form}
          layout="vertical"
          className="mt-3"
          onFinish={onFinish}
        >
          <Form.Item name={"remark"} rules={formMessageRequired('Remark')}>
            <Input placeholder="Type your remark" />
          </Form.Item>
          <div className={"w-full flex justify-end gap-2"}>
            <Form.Item>
              <ButtonComponent
                type={"default"}
                onClick={handleCancel}
                border={true}
              >
                Cancel
              </ButtonComponent>
            </Form.Item>
            <Form.Item>
              <ButtonComponent
                type={"submit"}
                htmlType={"submit"}
                border={false}
              >
                Submit
              </ButtonComponent>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ModalRemarkConfirmation;
