import { Checkbox, Input } from "antd";
import React from "react";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DateComponent from "../../../../../components/DateComponent";

const PaymentItemForm = (props) => {
  const {
    type,
    tableData,
    onDataChange,
    handleCheck,
    checked,
    formValue,
    form,
  } = props;

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;

  const disabledDate = (current) => {
    if (
      form.getFieldValue("startDate") === undefined ||
      form.getFieldValue("startDate") === null
    ) {
      return current && current < moment().add(-1, "days");
    } else {
      return current && current < moment(form.getFieldValue("startDate"));
    }
  };

  const handleStartDate = (date) => {
    if (!date) {
      form.setFieldsValue({
        endDate: null,
      });
    }
  };

  // const disableStartDate = (current) => {
  //   return moment().add(-2, "days") >= current;
  //   //  current && current < moment().startOf("month");
  // };
  const disabledStartDate = (current) => {
    // const today = moment();
    // const startDate = today.clone().startOf("month");
    // const endDate = today.clone().endOf("month");
    // return current < startDate || current > endDate;
    return false
  };

  return (
    <div>
      <BaseContainer header={"PAYMENT METHOD INFORMATION"}>
        <div className="w-full grid grid-cols-2 gap-5">
          <Form.Item
            label={"Payment Method Code"}
            name={"paymentMethodCode"}
            rules={formMessageRequired("Payment Method Code")}
          >
            <Input allowClear maxLength={15} />
          </Form.Item>
          <Form.Item
            label={"Payment Method Name"}
            name={"name"}
            rules={formMessageRequired("Payment Method Name")}
          >
            <InputComponent />
          </Form.Item>
          <Form.Item
            label={"Start Date"}
            name={"startDate"}
            rules={[
              {
                required: true,
                message: "Please input your Start Date!",
              },
            ]}
          >
            <DateComponent
              dateDisable={disabledStartDate}
              onChange={handleStartDate}
            />
          </Form.Item>
          <Form.Item label={"End Date"} name={"endDate"}>
            <DateComponent dateDisable={disabledDate} />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-1">
          <Form.Item label={"Description"} name={"description"}>
            <InputComponent rows={5} type="textarea" />
          </Form.Item>
        </div>
        <div>
          <Form.Item>
            <div className="flex flex-col pt-[12px]">
              <Checkbox
                onChange={handleCheck}
                checked={checked}
                name={"isBankMethod"}
                // value={checked}
              >
                Is Bank Method
              </Checkbox>
              <span className="text-[10px]">
                Click or tap this checkbox if data is bank Methode.
              </span>
            </div>
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default PaymentItemForm;
