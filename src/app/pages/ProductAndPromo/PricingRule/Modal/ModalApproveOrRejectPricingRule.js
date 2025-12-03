import React from "react";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import { Form } from "antd";

const ModalApproveOrRejectPricingRule = ({
  isOpen,
  header,
  approveOrReject,
  handleCancel = () => {},
  handleConfirmFooter = () => {},
  name,
  remark,
  onChange = () => {},
}) => {
  const [form] = Form.useForm();
  const adjustHandleCancle = () => {
    form.resetFields();
    handleCancel();
  };
  return (
    <ModalApproveOrReject
      // isOpen={isOpen}
      // header={`${header} information`}
      // message={`Are you sure you want to ${approveOrReject} Pricing Rule`}
      // width={1000}
      // handleCancel={adjustHandleCancle}
      isOpen={isOpen}
      handleCloseModal={adjustHandleCancle}
      onFinish={handleConfirmFooter}
      header={`${header}`}
      approveOrReject={approveOrReject}
      menu={`Pricing Rule`}
      named={name}
      // footer={
      //   <div className={"w-full flex justify-end gap-5"}>
      //     <ButtonComponent type={"default"} onClick={adjustHandleCancle}>
      //       Cancel
      //     </ButtonComponent>
      //     <ButtonComponent
      //       form={"formApproveRejcet"}
      //       type={"submit"}
      //       htmlType={"submit"}
      //       border={false}
      //     >
      //       Confirm
      //     </ButtonComponent>
      //   </div>
      // }
    />
    /*{ <Form form={form} name="formApproveRejcet" onFinish={handleConfirmFooter}>
        <Form.Item
          name={"remark"}
          rules={[{ message: requiredMessage("Remark"), required: true }]}
        >
          <InputComponent
            rows={1}
            placeholder="Type your remark"
            type="textarea"
            value={remark}
            onChange={onChange}
          />
        </Form.Item>
      </Form> }*/
    // </ModalApproveOrReject>
  );
};

const ModalErrorApproveOrRejectPricingRule = ({
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
  ModalApproveOrRejectPricingRule,
  ModalErrorApproveOrRejectPricingRule,
};
