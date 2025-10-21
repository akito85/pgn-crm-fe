import React, { useEffect } from "react";
import { Form, Spin, Select, InputNumber } from "antd";
import { useSelector } from "react-redux";
import InputComponent from "../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
import {
  getCustomerType,
  getIdentificationType,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";

const CustomerIdentificationForm = ({
  CIObj = {},
  dispatch = () => {},
  handleCIObj = () => {},
  form,
}) => {
  // Selector
  const { data_customerType, data_identificationType, loading } = useSelector(
    (state) => state.account,
  );

  // Use Effect
  useEffect(() => {
    dispatch(getCustomerType());
    dispatch(getIdentificationType());
  }, []);

  const validateInputNumber = (rule, value, callback) => {
    if (CIObj.identificationType === 61 || CIObj.identificationType === 60) {
      if (value && value.toString().length !== 16) {
        callback("Input number must be 16 digits!");
      } else {
        callback();
      }
    }
    if (CIObj.identificationType === 893) {
      if (value && value.toString().length !== 9) {
        callback("Input number must be 9 digits!");
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  const layoutInput = () => {
    switch (CIObj.identificationType) {
      case 61:
        return (
          <InputComponent
            disabled={!CIObj?.identificationType ? true : false}
            maxLength={16}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
          />
        );
      case 60:
        return (
          <InputComponent
            disabled={!CIObj?.identificationType ? true : false}
            maxLength={16}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
          />
        );
      default:
        return (
          <InputComponent
            disabled={!CIObj?.identificationType ? true : false}
            maxLength={9}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
          />
        );
    }
  };

  return (
    <div>
      <span className="text-primary uppercase font-bold mt-[60px]">
        CUSTOMER IDENTIFICATION
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Customer Type"}
          name={"customerType"}
          getValueFromEvent={(e) => handleCIObj(e, "customerType")}
          rules={[
            {
              required: true,
              message: "Please input your Customer Type!",
            },
          ]}
        >
          <SelectComponent>
            {data_customerType &&
              data_customerType?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Identification Type"}
          name={"identificationType"}
          getValueFromEvent={(e) =>
            handleCIObj(
              e,
              "identificationType",
              form.resetFields(["customerIdentificationNumber"]),
            )
          }
          rules={[
            {
              required: true,
              message: "Please input your Identification Type!",
            },
          ]}
        >
          <SelectComponent>
            {data_identificationType &&
              data_identificationType?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Customer Identification Number"}
          name={"customerIdentificationNumber"}
          getValueFromEvent={(e) =>
            handleCIObj(e, "customerIdentificationNumber")
          }
          rules={[
            {
              required: true,
              message: "Please input your Customer Identification Number!",
            },
            { validator: validateInputNumber },
          ]}
        >
          {layoutInput()}
        </Form.Item>
      </div>
    </div>
  );
};

export default CustomerIdentificationForm;
