import React from "react";
import InputComponent from "../../../../../../components/InputComponent";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DateComponent from "../../../../../../components/DateComponent";
import { Form } from "antd";
import moment from "moment";

const GasSourceActiveOrInactive = ({
  isOpen,
  handleCancel = () => {},
  handleCancelFooter = () => {},
  handleConfirmFooter = () => {},
  remark,
  form,
  onChange = () => {},
  startDate,
}) => {
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) >= current;
    }
    return moment().add(-1, "days") >= current;
  };

  return (
    <ModalApproveOrReject
      isOpen={isOpen}
      header={`Inactivate information`}
      message={`Are you sure want to inactivate Gas Source Assignment`}
      width={1000}
      handleCancel={handleCancel}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancelFooter}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            form="inactiveGasSource"
            type={"submit"}
            htmlType={"submit"}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <Form
        id="inactiveGasSource"
        layout="vertical"
        form={form}
        onFinish={handleConfirmFooter}
      >
        <div className="flex flex-col gap-4">
          <Form.Item
            label={"End Date"}
            name={"endDate"}
            rules={[
              {
                validator: (_, value) =>
                  (value && moment(startDate) < moment(value)) || !value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("End date must After Start date"),
                      ),
              },
              {
                required: true,
                message: "Please input your End Date!",
              },
            ]}
          >
            <DateComponent dateDisable={handleDisableEndDate} />
          </Form.Item>

          <Form.Item
            name={"remark"}
            label={"Remark"}
            rules={[
              {
                required: true,
                message: "Please input your Remark",
              },
            ]}
          >
            <InputComponent
              rows={1}
              type="textarea"
              value={remark}
              onChange={onChange}
              placeholder={"Type your remark"}
            />
          </Form.Item>
        </div>
      </Form>
    </ModalApproveOrReject>
  );
};

export default GasSourceActiveOrInactive;
