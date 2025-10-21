import { Checkbox, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import BankCreateCheckbox from "./BankCreateCheckbox";

const BankCreate = ({
  dataBank = [],
  form,
  data_detail,
  codeBank,
  setCodeBank,
  isPage,
  setIsPage,
  type,
  // disabledDraf,
}) => {
  const handleCodeBank = (value) => {
    setCodeBank(value);
    return value;
  };

  const [npwp, setNpwp] = useState("");

  const handlePage = (e) => {
    setIsPage(e.target.checked);
  };
  // Custom validation function to check if the email has a valid domain
  const validateEmail = (_, value) => {
    if (!value || value.indexOf("@") === -1) {
      return Promise.reject("Please enter a valid email address.");
    }

    const [, domain] = value.split("@");

    if (!domain || domain.indexOf(".") === -1) {
      return Promise.reject(
        "Please enter a valid email address with a domain.",
      );
    }

    return Promise.resolve();
  };

  const validateNPWP = (_, value) => {
    if (!value || value.length <= 16) {
      return Promise.reject("Input number must be 16 digits!");
    }
    return Promise.resolve();
  };

  const validatePhoneNumber = (_, value) => {
    if (!value || value.length < 11 || value.length === 14) {
      return Promise.reject("Input number must be between 11 and 13 digits.");
    }
    return Promise.resolve();
  };

  return (
    <div className="w-full">
      <BaseContainer header={"BANK DATA INFORMATION"}>
        <div className="w-40">
          <Form.Item name={"isBranch"} valuePropName="checked">
            <BankCreateCheckbox isPage={isPage} handlePage={handlePage} />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-3 gap-5">
          {isPage === true ? (
            <Form.Item
              label={"Bank Code"}
              name={"bankCode"}
              rules={formMessageRequired("Bank Code")}
              getValueFromEvent={handleCodeBank}
            >
              <SelectComponent>
                {dataBank?.map((data) => (
                  <Select.Option key={data.bankCode} value={data.bankCode}>
                    {data.bankCodeName}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          ) : (
            <Form.Item
              label={"Bank Code"}
              name={"bankCode"}
              rules={formMessageRequired("Bank Code")}
              // getValueFromEvent={handleCodeBank}
            >
              <Input
                allowClear
                maxLength={5}
                // onInput={(e) =>
                //   (e.target.value = e.target.value.replace(/\D/g, ""))
                // }
              />
            </Form.Item>
          )}
          <Form.Item
            label={"Bank Name"}
            name={"bankName"}
            rules={formMessageRequired("Bank Name")}
            // onChange={selectedBank?.bankName}
          >
            {isPage === true ? (
              <InputComponent disabled />
            ) : (
              <Input
                allowClear
                maxLength={50}
                // onInput={(e) =>
                //   (e.target.value = e.target.value.replace(/\D/g, ""))
                // }
              />
            )}
          </Form.Item>
          <Form.Item
            label={"Short Bank Name"}
            name={"bankShortName"}
            rules={formMessageRequired("Short Bank Name")}
          >
            {isPage === true ? (
              <InputComponent disabled />
            ) : (
              <Input
                allowClear
                maxLength={50}
                // onInput={(e) =>
                //   (e.target.value = e.target.value.replace(/\D/g, ""))
                // }
              />
            )}
          </Form.Item>
        </div>
        <div
          className={`w-full grid gap-5 ${
            isPage === true ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          {isPage === true ? (
            <Form.Item
              label={"Branch Name"}
              name={"branchName"}
              rules={formMessageRequired("branchName")}
            >
              <InputComponent />
            </Form.Item>
          ) : null}
          <Form.Item
            label={"Tax Identification Number (NPWP)"}
            name={"npwp"}
            rules={[
              {
                required: true,
                message: "Please input your NPWP!",
              },
              { validator: validateNPWP },
            ]}
          >
            {/* <InputComponent /> */}
            <Input
              allowClear
              maxLength={16}
              onInput={
                (e) => {
                  const input = e.target;
                  const value = input.value.replace(/[^\d]/g, "");
                  const formattedValue = value.replace(
                    /(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{4})/,
                    "$1.$2.$3.$4-$5.$6",
                  );
                  input.value = formattedValue;
                }
                // (e.target.value = e.target.value.replace(/\D/g, ""))
              }
            />
          </Form.Item>
          <Form.Item
            label={"Phone Number"}
            name={"phoneNumber"}
            rules={[
              { required: true, message: "Please input your Phone Number" },
            ]}
          >
            {/* <InputNumber
              maxLength={11}
              addonBefore={"62"}
              controls={false}
              type={"number"}
              style={{ width: "100%" }}
            /> */}
            <Input
              allowClear
              addonBefore={"62"}
              maxLength={11}
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/\D/g, ""))
              }
            />
          </Form.Item>
          <Form.Item
            label={"Email"}
            name={"email"}
            rules={[
              ...formMessageRequired("Email"),
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <InputComponent />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-1">
          <Form.Item
            label={"Address"}
            name={"address"}
            rules={formMessageRequired("address")}
          >
            <InputComponent rows={5} type="textarea" />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default BankCreate;
