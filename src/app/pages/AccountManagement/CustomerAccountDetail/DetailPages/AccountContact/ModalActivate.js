import React, { useState } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { Alert, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";

const ModalActivate = ({
  isOpen,
  header,
  activeOrInactive,
  handleCancel = () => {},
  handleCancelFooter = () => {},
  handleConfirmFooter = () => {},
  remark,
  onChange = () => {},
  form,
}) => {
  return (
    <div>
      <ModalApproveOrReject
        isOpen={isOpen}
        header={`${header} information`}
        message={`Are you sure want to ${activeOrInactive} Contact`}
        width={1000}
        handleCancel={handleCancel}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent type={"default"} onClick={handleCancelFooter}>
              Cancel
            </ButtonComponent>
            {/* <ButtonComponent
              type={"submit"}
              border={false}
              onClick={handleConfirmFooter}
            >
              Confirm
            </ButtonComponent> */}
            <ButtonComponent
              form="contactInactivateForm"
              type="submit"
              htmlType="submit"
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Form
          id="contactInactivateForm"
          form={form}
          onFinish={handleConfirmFooter}
          layout="vertical"
        >
          {/* <InputComponent
            rows={1}
            type="textarea"
            value={remark}
            onChange={onChange}
          />
           */}
          <div className="flex flex-col gap-6">
            <Form.Item
              name={"remark"}
              rules={[{ message: "This field is required", required: true }]}
              className="w-full"
              label={"Remark"}
            >
              <InputComponent
                group
                rows={1}
                type="textarea"
                placeholder={"Type your remark"}
              />
            </Form.Item>
          </div>
        </Form>
      </ModalApproveOrReject>
    </div>
  );
};

export default ModalActivate;
