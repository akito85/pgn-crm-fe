import React, { useEffect, useRef } from "react";
import { Checkbox, Form, Select, TreeSelect } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import { Fragment } from "react";
import CheckBoxComponent from "../../../../../../components/CheckBoxComponent";
import { requiredMessage } from "../../../../../../utils";
import UtilsTreeSelect from "./UtilsTreeSelect";
import { onInputUpperCase } from "../../../Utils";

const AccountUpdateInformation = ({
  data_header = [],
  optionsCategory = [],
  optionsAccountSegment = [],
  optionsAccountGroupType = [],
  optionsAccountType = [],
  optionsClassificationType = [],
  optionsPriority = [],
  optionsIndustrialSector = [],
  optionsBudgetYear = [],
  optionsBudget = [],
  optionsTeritory = [],
  checkedRating,
  onChangeRating = () => {},
  checkedCorporate,
  onChangeCorporate = () => {},
  onChangeSegment = () => {},
}) => {
  const filterData = (data) => {
    return (data || []).map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: filterData(item.children),
          disabled: true, // Disable parent nodes with children
        };
      } else {
        return item;
      }
    });
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {data_header[0]}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item
          name={"accountGroup"}
          label={"Account Group"}
          className="no-margin-form"
        >
          <InputComponent
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name={"customerManagement"}
          label={"Customer Management"}
          className="no-margin-form"
        >
          <InputComponent
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {data_header[1]}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item
          name={"sor"}
          label={"SOR"}
          rules={[{ message: requiredMessage("SOR"), required: true }]}
          className="no-margin-form"
        >
          <InputComponent
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name={"costCenter"}
          label={"Cost Center"}
          rules={[{ message: requiredMessage("Cost Center"), required: true }]}
          className="no-margin-form"
        >
          <InputComponent
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name={"meterReadingCodes"}
          label={"Meter Reading Codes"}
          rules={[
            { message: requiredMessage("Meter Reading Codes"), required: true },
          ]}
          className="no-margin-form"
        >
          <InputComponent
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {data_header[2]}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item
          name="accountName"
          label={"Account Name"}
          rules={[{ message: requiredMessage("Account Name"), required: true }]}
          className="no-margin-form"
        >
          <InputComponent
            mandatory
            onInput={onInputUpperCase}
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"accountRegistrationNumber"}
          label={"Account Registration Number"}
        >
          <InputComponent
            disabled
            // onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"category"}
          label={"Category"}
          rules={[{ message: "This field is required", required: true }]}
        >
          <SelectComponent mandatory>
            {optionsCategory?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
      </div>
      <div className="w-full">
        <Form.Item name={"description"} label={"Description"}>
          <InputComponent type="textarea" />
        </Form.Item>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {data_header[3]}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item
          name="segment"
          label={"Account Segment"}
          rules={[
            { message: requiredMessage("Account Segment"), required: true },
          ]}
        >
          <SelectComponent mandatory onChange={onChangeSegment}>
            {optionsAccountSegment?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name="accountGroupType"
          label={"Account Group Type"}
          rules={[
            { message: requiredMessage("Account Group Type"), required: true },
          ]}
        >
          <SelectComponent mandatory>
            {optionsAccountGroupType?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name="accountType"
          label={"Account Type"}
          rules={[{ message: requiredMessage("Account Type"), required: true }]}
        >
          <SelectComponent mandatory>
            {optionsAccountType?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name="classificationType"
          label={"Classification Type"}
          rules={[
            { message: requiredMessage("Classification Type"), required: true },
          ]}
        >
          <SelectComponent mandatory>
            {optionsClassificationType?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item name="priority" label={"Priority"}>
          <SelectComponent>
            {optionsPriority?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"corporateCustomer"}
          label={"Corporate Customer"}
          valuePropName="checked"
        >
          <div className="w-full pt-1">
            <CheckBoxComponent
              checked={checkedCorporate}
              onChange={onChangeCorporate}
            >
              <p className="text-xs mt-1 text-[#92979D]">
                Check if corporate customer
              </p>
            </CheckBoxComponent>
          </div>
        </Form.Item>

        <Form.Item
          name="ratingAndBillingException"
          label={"Rating & Billing Exception"}
          valuePropName="checked"
        >
          <CheckBoxComponent checked={checkedRating} onChange={onChangeRating}>
            <p className="text-xs mt-1 text-[#92979D]">
              Check if this account have calculation exception
            </p>
          </CheckBoxComponent>
        </Form.Item>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {data_header[4]}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item name="industrialSector" label={"Industrial Sector"}>
          {/* <SelectComponent>
            {optionsIndustrialSector?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent> */}
          <UtilsTreeSelect
            treeData={filterData(optionsIndustrialSector)}
            // treeCheckable={true} // Enable checkboxes for tree nodes
            // treeCheckStrictly={true} // Make checkboxes work independently, so you can check items with children
            // onChange={handleTreeSelect}
          />
        </Form.Item>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {data_header[5]}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item name="budgetYear" label={"Budget Year"}>
          <SelectComponent>
            {optionsBudgetYear?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item name="budget" label={"Budget"}>
          <SelectComponent>
            {optionsBudget?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item name="teritory" label={"Teritory"}>
          <SelectComponent>
            {optionsTeritory?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
      </div>
    </Fragment>
  );
};

export default AccountUpdateInformation;
