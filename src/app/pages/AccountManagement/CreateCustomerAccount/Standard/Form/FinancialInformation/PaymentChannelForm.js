import { Form, Checkbox, Select } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import SelectComponent from "../../../../../../../components/SelectComponent";
import { getPaymentChannel } from "../../../../../../../redux/slices/account_management/Account/accountSlice";

const PaymentChannelForm = ({
  dispatch = () => {},
  handleFIObj = () => {},
  fiObj = {},
}) => {
  // Selector
  const { loading, data_paymentChannel = [] } = useSelector(
    (state) => state.account
  );

  // Use Effect
  useEffect(() => {
    dispatch(getPaymentChannel());
  }, [dispatch]);
  return (
    <div>
      <span className="text-primary uppercase font-bold">
        PAYMENT CHANNEL INFORMATION
      </span>

      <div className="w-full grid grid-cols-2 gap-2 pt-[15px]">
        <Form.Item
          label={"Payment Channel"}
          name={"paymentChannelType"}
          rules={[
            {
              required: true,
              message: "Please input your Payment Channel!",
            },
          ]}
          getValueFromEvent={(e) => handleFIObj(e, "paymentChannelType")}
        >
          <SelectComponent>
            {(
              // data_paymentChannel &&
              data_paymentChannel || []
              )?.map((ta, index) => (
                <Select.Option value={ta?.id} key={index}>
                  {ta?.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        {fiObj.paymentChannelType === 783 ? (
          <Form.Item
            name={"generateVA"}
            getValueFromEvent={(e) => handleFIObj(e, "generateVA")}
          >
            <div className="pt-[33px]">
              <Checkbox>Generate Virtual Account</Checkbox>
            </div>
          </Form.Item>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentChannelForm;
