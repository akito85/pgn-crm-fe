import React from "react";
import { Form } from "antd";
import SVGIcon from "../../../../../../assets/Icon/index";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";

const ModalApproveOrRejectBillingCycle = ({
  isOpen,
  header,
  approveOrReject,
  remark,
  handleCancel = () => {},
  handleConfirm = () => {},
  onChange = () => {},
}) => {
  const [form] = Form.useForm()

  return (
    <ModalApproveOrReject
      isOpen={isOpen}
      header={`${header} information`}
      message={`Are you sure you want to ${approveOrReject} Billing Cycle?`}
      width={1000}
      handleCancel={() => {
        handleCancel()
        form.resetFields();
      }}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={() => {
            handleCancel()
            form.resetFields();
          }}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            htmlType={"submit"}
            border={false}
            form={"approveOrReject"}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <Form id="approveOrReject" form={form} layout="vertical" onFinish={handleConfirm}>
        <Form.Item
          name={"remark"}
          rules={[
            {
              required: true,
              message: "Please input your Remark!",
            },
          ]}
        >
          <InputComponent
            rows={1}
            placeholder="Type your remark"
            type="textarea"
            value={remark}
            onChange={onChange}
          />
        </Form.Item>
      </Form>
    </ModalApproveOrReject>
  );
};

const ModalErrorApproveOrRejectBillingCycle = ({
  isOpen,
  handleOk = () => {},
  handleCancel = () => {},
  approveOrReject,
  message,
}) => {
  return (
    <ModalError isOpen={isOpen} handleOk={handleOk} handleCancel={handleCancel}>
      <div className="px-8 py-8 justify-center">
        <div className="w-full flex gap-[20px]">
          <SVGIcon name="IconInactive" width={48} />
          <p className="text-[18px] font-bold">Failed</p>
        </div>
        <p className="pl-[70px]">
          {`Your data was not ${
            approveOrReject === "Approve" ? "rejected" : "approved"
          } ${message}. Please try again.`}
        </p>
      </div>
    </ModalError>
  );
};

export {
  ModalApproveOrRejectBillingCycle,
  ModalErrorApproveOrRejectBillingCycle,
};
