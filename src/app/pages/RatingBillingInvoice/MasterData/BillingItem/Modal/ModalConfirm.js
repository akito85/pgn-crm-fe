import React from "react";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Alert, Form } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import BillingItemDetail from "../BillingItemDetail";

const ModalConfirm = () => {
  return (
    <div>
      <ModalCustom
        header={`Billing Item List`}
        isOpen={openModal}
        handleCancel={() => {
          setOpenModal(false);
          form.resetFields();
        }}
        width={800}
        type={typeModal}
      >
        {typeModal === "confirmation" ? (
          <div className={"w-full justify-center my-4 flex flex-col text-sm"}>
            <Alert
              icon={
                <ExclamationCircleOutlined
                  style={{ fontSize: "24px", color: "#65481C" }}
                />
              }
              // message={`Are you sure you want to ${
              //   statusData === "ACTIVE" ? "inactivate" : "activate"
              // } billingitem?`}
              type={"warning"}
              showIcon
              className={"alert-icon"}
            />
            <div className={"mt-4"}>
              <Form
                form={form}
                layout="vertical"
                className="mt-3"
                onFinish={onFinish}
              >
                <Form.Item
                  name={"remark"}
                  rules={formMessageRequired("remark")}
                >
                  <InputComponent rows={1} type="textarea" />
                </Form.Item>
                <div className={"w-full flex justify-end gap-2"}>
                  <Form.Item>
                    <ButtonComponent
                      type={"default"}
                      onClick={() => {
                        setOpenModal(false);
                        form.resetFields();
                      }}
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
                      Confirm
                    </ButtonComponent>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        ) : (
          <BillingItemDetail data={data_detail} onClick={handleCancel} />
        )}
      </ModalCustom>

      <div>
        <ModalConfirm
          isOpen={openDelete}
          handleCancel={handleCancel}
          handleOk={handleInactive}
        >
          <div className={"flex flex-col px-8 py-6"}>
            <div className="w-full justify-center items-center flex my-2">
              <div className={"mr-4 text-[#3C6DB2] text-2xl"}>
                <ExclamationCircleOutlined />
              </div>
              <span className={"text-[1.3rem] text-black text-bold"}>
                {`Are you sure want to inactive billing item?`}
              </span>
            </div>
            <div className={"w-full justify-center my-4 flex text-sm"}>
              <Alert
                message={
                  "If you inactive this data, it will be activate again."
                }
                icon={<WarningOutlined />}
                type={"error"}
                showIcon
              />
            </div>
          </div>
        </ModalConfirm>

        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />
      </div>
    </div>
  );
};

export default ModalConfirm;
