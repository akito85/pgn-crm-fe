import React, { useState } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { Alert, Form } from "antd";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { InfoCircleOutlined } from "@ant-design/icons";
import InputComponent from "../../../../../../components/InputComponent";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";

const ModalActivateAddress = ({
  form,
  isOpen,
  header,
  activeOrInactive,
  handleCancel = () => {},
  handleCancelFooter = () => {},
  handleConfirmFooter = () => {},
}) => {
  return (
    <div>
      <ModalApproveOrReject
        isOpen={isOpen}
        header={`${header} information`}
        message={`Are you sure want to ${activeOrInactive} Address ?`}
        width={1000}
        handleCancel={handleCancel}
        footer={
          <div className="w-full flex justify-end gap-5">
            <ButtonComponent onClick={handleCancelFooter} type="default">
              Cancel
            </ButtonComponent>
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

      {/* <ModalCustom
        header={`${
          typeModal === "ACTIVE" ? "ACTIVATE" : "INACTIVATE"
        } INFORMATION`}
        isOpen={isOpen}
        type={"confirmation"}
        handleCancel={() => {
          handleCloseModal()
        }}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent
              onClick={handleCloseModal}
              type="default"
            >
              Cancel
            </ButtonComponent>
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
          onFinish={handleSaveModalInactivateFinal}
        >
          <div className="flex flex-col gap-6">
            <Alert
              message={`Are you sure you want to ${
                typeModal === "ACTIVE" ? "activate" : "inactivate"
              } contact?`}
              icon={<InfoCircleOutlined />}
              type={"warning"}
              showIcon
              className="inactivate-alert"
            />
            <Form.Item
              name={"remark"}
              rules={[{ message: "This field is required", required: true }]}
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
      </ModalCustom> */}
    </div>
  );
};

export default ModalActivateAddress;
