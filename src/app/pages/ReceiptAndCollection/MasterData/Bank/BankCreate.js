import React, { useState } from "react";
import { Select, Form } from "antd";
import CardContainer from "../../../../../components/CardContainer";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { formMessageRequired } from "../../../../../utils";

const BankCreate = ({
  dataBank = [],
  form,
  setCodeBank,
}) => {
  const [officeType, setOfficeType] = useState(form.getFieldValue("officeType"));
  const isBranch = officeType === "branch" || officeType === "BRANCH" || officeType === "Cabang";

  const handleOfficeTypeChange = (value) => {
    setOfficeType(value);
    form.setFieldsValue({
      bankCode: undefined,
      bankName: undefined,
      bankShortName: undefined,
      branchName: undefined,
    });
    setCodeBank("");
  };

  const handleCodeBankInput = (e) => {
    setCodeBank(e.target.value);
  };

  const handleCodeBankSelect = (value) => {
    setCodeBank(value);
    const selectedBank = dataBank.find((item) => item.bankCode === value);
    if (selectedBank) {
      form.setFieldsValue({
        bankName: selectedBank.bankName,
        bankShortName: selectedBank.bankShortName || "",
      });
    }
  };

  const validateNPWP = (_, value) => {
    if (!value || value.length <= 16) {
      return Promise.reject("Input number must be 16 digits!");
    }
    return Promise.resolve();
  };

  const renderHeader = (title) => (
    <div className="flex -my-4 justify-between items-center">
      <p className="w-full mt-[15px] text-primary font-bold">
        {title.toUpperCase()}
      </p>
    </div>
  );

  return (
    <div className="w-full mb-5">
      <CardContainer header={renderHeader("BANK DATA INFORMATION")}>
        <div className="w-full grid grid-cols-4 gap-4">
          <Form.Item
            label="Office Type"
            name="officeType"
            rules={formMessageRequired("Office Type")}
          >
            <SelectComponent
              placeholder="Select Office Type"
              onChange={handleOfficeTypeChange}
            >
              <Select.Option value="head_office">Head Office</Select.Option>
              <Select.Option value="branch">Branch</Select.Option>
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label="Bank Code"
            name="bankCode"
            rules={formMessageRequired("Bank Code")}
          >
            {isBranch ? (
              <SelectComponent
                placeholder="Select Bank Code"
                optionLabelProp="value"
                onChange={handleCodeBankSelect}
              >
                {dataBank?.map((data) => (
                  <Select.Option
                    key={data.bankCode}
                    value={data.bankCode}
                    label={data.bankCode}
                  >
                    {data.bankCode} - {data.bankName}
                  </Select.Option>
                ))}
              </SelectComponent>
            ) : (
              <InputComponent
                allowClear
                maxLength={50}
                placeholder="Input Bank Code"
                onChange={handleCodeBankInput}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={!isBranch ? formMessageRequired("Bank Name"): []}
          >
            <InputComponent
              disabled={isBranch}
              allowClear
              maxLength={50}
              placeholder="Input Bank Name"
            />
          </Form.Item>

          <Form.Item
            label="Short Bank Name"
            name="bankShortName"
            rules={!isBranch ? formMessageRequired("Short Bank Name"): []}
          >
            <InputComponent
              disabled={isBranch}
              allowClear
              maxLength={50}
              placeholder="Input Short Bank Name"
            />
          </Form.Item>

          <Form.Item
            label="Branch Name"
            name="branchName"
            rules={isBranch ? formMessageRequired("Branch Name") : []}
          >
            <InputComponent
              disabled={!isBranch}
              placeholder="Input Branch Name"
            />
          </Form.Item>

          <Form.Item
            label="Tax Identification Number (NPWP)"
            name="npwp"
            rules={[
              { required: true, message: "Please input your NPWP!" },
              { validator: validateNPWP },
            ]}
          >
            <InputComponent
              allowClear
              maxLength={16}
              placeholder="Input NPWP"
              onInput={(e) => {
                const input = e.target;
                const value = input.value.replace(/[^\d]/g, "");
                input.value = value.replace(
                  /(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{4})/,
                  "$1.$2.$3.$4-$5.$6"
                );
              }}
            />
          </Form.Item>

          <Form.Item
            label="Telephone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Phone number is required!" },
              { pattern: /^[0-9]{5,13}$/, message: "Phone number must be 5-13 digits!" },
            ]}
          >
            <InputComponent
              allowClear
              maxLength={13}
              placeholder="Input Telephone Number"
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required!" },
              { type: "email", message: "Invalid email format! Example: name@domain.com" },
            ]}
          >
            <InputComponent placeholder="Input Email" />
          </Form.Item>

          <div className="col-span-4">
            <Form.Item
              label="Address"
              name="address"
              rules={formMessageRequired("Address")}
            >
              <InputComponent rows={3} type="textarea" placeholder="Input Address" />
            </Form.Item>
          </div>
        </div>
      </CardContainer>
    </div>
  );
};

export default BankCreate;