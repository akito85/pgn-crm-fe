import React from "react";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import InputComponent from "../../../../../components/InputComponent";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { Alert, Form } from "antd";
import { formMessageRequired } from "../../../../../utils";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const CostCenterActiveOrInactive = (props) => {
  const {
    isOpen,
    header,
    ActiveOrInactive,
    handleCancel = () => {},
    handleCancelFooter = () => {},
    handleConfirmFooter = () => {},
    remark,
    onChange = () => { },
    form
  } = props;

  return (
    <ModalCustom
      isOpen={isOpen}
      header={`${header} information`}
      message={`Are you sure want to ${ActiveOrInactive} Cost Center?`}
      width={500}
      handleCancel={handleCancel}
      type={'confirmation'}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancelFooter}>
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
      <div className={"w-full justify-center gap-3 flex flex-col text-sm"}>
        <Alert
          icon={
            <ExclamationCircleOutlined
              style={{ fontSize: "24px", color: "#65481C" }}
            />
          }
          message={`Are you sure you want to ${ActiveOrInactive
            } cost center?`}
          type={"warning"}
          showIcon
          className={"alert-icon"}
        />
        <Form id="inactivateForm" form={form} onFinish={handleConfirmFooter}>
          <Form.Item name={"remark"} rules={formMessageRequired("remark")}>
            <InputComponent
              rows={1}
              type="textarea"
              value={remark}
              onChange={onChange}
            />
          </Form.Item>
        </Form>
      </div>
    </ModalCustom>
  );
};

const CostCenterErrorActiveOrInactive = (props) => {
  const {
    isOpen,
    handleOk = () => {},
    handleCancel = () => {},
    ActiveOrInactive,
    message,
  } = props;
  return (
    <ModalError isOpen={isOpen} handleOk={handleOk} handleCancel={handleCancel}>
      <div className="px-8 py-8 justify-center">
        <div className="w-full flex gap-[20px]">
          <SVGIcon name="IconInactive" width={48} />
          <p className="text-[18px] font-bold">Failed</p>
        </div>
        <p className="pl-[70px]">
          {`Your data was not ${
            ActiveOrInactive === "Activate" ? "Inactivate" : "Activate"
          } ${message}. Please try again.`}
        </p>
      </div>
    </ModalError>
  );
};

export { CostCenterActiveOrInactive, CostCenterErrorActiveOrInactive };
