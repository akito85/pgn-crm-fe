import React, { useEffect, useRef, useState } from "react";
import DetailText from "../../../../../../../components/DetailText";
import DateComponent from "../../../../../../../components/DateComponent";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputComponent from "../../../../../../../components/InputComponent";
import { Form, Select } from "antd";
import { requiredMessage } from "../../../../../../../utils";
import SelectComponent from "../../../../../../../components/SelectComponent";

const PaymentChannelUpdate = ({ btnType = {}, paymentType = {}, options = [] }) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mb-5">
        PAYMENT CHANNEL INFORMATION
      </div>
      <div className="w-2/4">
        {btnType ? (
          <DetailText label={"PaymentChannel"}>{paymentType?.text}</DetailText>
        ) : (
          <Form.Item
            name={"paymentChannel"}
            rules={[
              { message: requiredMessage("Payment Channel"), required: true },
            ]}
          >
            <SelectComponent mandatory label={"Payment Channel"}>
              {options?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.text}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        )}
      </div>
    </Fragment>
  );
};

export default PaymentChannelUpdate;
