import React from "react";
import { Checkbox, DatePicker, Form, Select } from "antd";

import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";

const InformationInputForm = ({ updateBody = () => {} }) => {
  return (
    <div>
      {/* SECTION CUSTOMER TYPPE */}
      <div className="pb-4">
        <h1 className="text-primary text-xs font-bold uppercase">
          CUSTOMER TYPE
        </h1>
      </div>
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name={"customerType"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
          getValueFromEvent={(e) => updateBody(e, "customerType")}
        >
          <SelectComponent mandatory label={"Customer Type"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
      </div>

      {/* SECTION CUSTOMER INFORMATION */}
      <div className="pt-8 pb-4">
        <h1 className="text-primary text-xs font-bold uppercase">
          CUSTOMER INFORMATION
        </h1>
      </div>
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name={"firstName"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
          getValueFromEvent={(e) => updateBody(e, "firstName")}
        >
          <InputComponent mandatory label={"First Name"} type="text" />
        </Form.Item>
        <Form.Item
          name={"middleName"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
          getValueFromEvent={(e) => updateBody(e, "middleName")}
        >
          <InputComponent mandatory label={"Middle Name"} type="text" />
        </Form.Item>
        <Form.Item
          name={"lastName"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
          getValueFromEvent={(e) => updateBody(e, "lastName")}
        >
          <InputComponent mandatory label={"Last Name"} type="text" />
        </Form.Item>
        <Form.Item
          name={"customerName"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
          getValueFromEvent={(e) => updateBody(e, "customerName")}
        >
          <InputComponent mandatory label={"Customer Name"} type="text" />
        </Form.Item>
        <Form.Item
          name={"birthDate"}
          label={"Birth Date"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <DatePicker className={"w-full"} />
        </Form.Item>
        <Form.Item
          name={"birthPlace"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent mandatory label={"Birth Place"} type="text" />
        </Form.Item>
        <Form.Item
          name={"idenificationType"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Identification Type"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"ktp"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent
            mandatory
            label={"Personal Identification Number(NIK)"}
            type="text"
          />
        </Form.Item>
        <Form.Item
          name={"npwp"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent
            mandatory
            label={"Tax Identification Number(NPWP)"}
            type="text"
          />
        </Form.Item>
        <Form.Item
          name={"sex"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Sex"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"maritalStatus"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent mandatory label={"Marital Status"} type="text" />
        </Form.Item>
      </div>
      <div className="grid w-full gap-x-6">
        <Form.Item name={"descCustomerInformation"}>
          <InputComponent
            label={"Description"}
            type="textarea"
            value={"description"}
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>

      {/* SECTION CUSTOMER SEARCH KEY */}
      <div className="pt-8 pb-4">
        <h1 className="text-primary text-xs font-bold uppercase">
          CUSTOMER SEARCH KEY
        </h1>
      </div>
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name={"searchKey"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent mandatory label={"Search Key"} type="text" />
        </Form.Item>
      </div>

      {/* SECTION ACCOUNT LOCATION INFORMATION */}
      <div className="pt-8 pb-4">
        <h1 className="text-primary text-xs font-bold uppercase">
          ACCOUNT LOCATION INFORMATION
        </h1>
      </div>
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name={"sor"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"SOR"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"costCenter"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Cost Center"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"meterReadingCode"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Meter Reading Code"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
      </div>

      {/* SECTION ACCOUNT INFORMATION */}
      <div className="pt-8 pb-4">
        <h1 className="text-primary text-xs font-bold uppercase">
          ACCOUNT INFORMATION
        </h1>
      </div>
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name={"accountRegistrationNumber"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent
            mandatory
            label={"Account Registration Number"}
            type="text"
          />
        </Form.Item>
        <Form.Item
          name={"accountName"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent mandatory label={"Account Name"} type="text" />
        </Form.Item>
        <Form.Item
          name={"category"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Category"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
      </div>
      <div className="grid w-full gap-x-6">
        <Form.Item name={"descAccountInformation"}>
          <InputComponent
            label={"Description"}
            type="textarea"
            value={"description"}
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>

      {/* SECTION ACCOUNT TAX IDENTIFICATION INFORMATION */}
      <div className="pt-8 pb-4">
        <h1 className="text-primary text-xs font-bold uppercase">
          ACCOUNT TAX IDENTIFICATION INFORMATION
        </h1>
      </div>
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name="differentNpwp"
          label={"Use Account Tax Identification Number"}
          valuePropName="checked"
          noStyle
        >
          <Checkbox>
            Check if account has different tax identification number with
            customer
          </Checkbox>
        </Form.Item>
        <Form.Item
          name={"npwp"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent
            mandatory
            label={"Tax Identification Number(NPWP)"}
            type="text"
          />
        </Form.Item>
      </div>

      {/* SECTION ACCOUNT SEGMENT INFORMATION */}
      <div className="pt-8 pb-4">
        <h1 className="text-primary text-xs font-bold uppercase">
          ACCOUNT SEGMENT INFORMATION
        </h1>
      </div>
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name={"accountSegment"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Account Segment"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"accountGroupType"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Account Group Type"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"accountType"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Account Type"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"classificationType"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Classification Type"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name="coorporateCustomer"
          label={"Coorporate Customer"}
          valuePropName="checked"
          noStyle
        >
          <div className="flex flex-col">
            <h3 className="text-[14px]">Coorporate Customer</h3>
            <Checkbox label={"Coorporate Customer"}>
              Check if coorporate customer
            </Checkbox>
          </div>
        </Form.Item>
      </div>

      {/* SECTION ACCOUNT BUDGET INFORMATION */}
      <div className="pt-8 pb-4">
        <h1 className="text-primary text-xs font-bold uppercase">
          ACCOUNT BUDGET INFORMATION
        </h1>
      </div>
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name={"budgetYear"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Budget Year"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"budget"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Budget"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"teritory"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent mandatory label={"Teritory"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
      </div>
    </div>
  );
};

export default InformationInputForm;
