import { Form, Select } from "antd";
import React, { useState } from "react";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import { requiredMessage } from "../../../../utils";

const dummyOptions = [
  { name: "Customer", value: 12 },
  { name: "Sub-District", value: 13 },
  { name: "District", value: 14 },
  { name: "City", value: 39 },
  { name: "Province", value: 15 },
  { name: "Customer Segment", value: 19 },
  { name: "Account Group", value: 20 },
  { name: "All", value: 24 },
];
const PricingAdjustSectionForm = ({
  type = "create",
  criteriaOptions = [],
  handleSelectCriteria = () => {},
  handleDeselectCriteria = () => {},
  handleClearCriteria = () => {},
  priceCode = "",
  status = ""
}) => {
  const [description, setDescription] = useState("");
  const criteriaOptionsFix = criteriaOptions;
    // criteriaOptions.length > 0 ? criteriaOptions : dummyOptions;
    // criteriaOptions.length > 0 ? criteriaOptions : dummyOptions;
  return (
    <div className="flex flex-col w-full gap-3">
      {priceCode ? (
        <div className={"flex w-full align-middle gap-3"}>
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Price Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">{priceCode}</p>
        </div>
      ) : null}
      <div className={"flex w-full gap-3"}>
        <div className={"flex flex-col w-full"}>
          <div className={"flex flex-col w-full"}>
            <Form.Item
              name={"adjustName"}
              rules={[
                { message: requiredMessage("Adjustment Name"), required: true },
              ]}
              className={"w-full no-margin-form"}
              label={"Adjustment Name"}
            >
              <InputComponent type="text" disabled={(type === "update" && status === "ACTIVE")} />
            </Form.Item>
          </div>
        </div>
        <div className={"flex flex-col w-full"}>
          <div className={"flex flex-col w-full"}>
            <Form.Item
              name={"criteria"}
              rules={[{ message: requiredMessage("Criteria"), required: true }]}
              className={"w-full no-margin-form"}
              label={"Criteria"}
            >
              <SelectComponent
                mode="multiple"
                onSelect={handleSelectCriteria}
                onDeselect={handleDeselectCriteria}
                onClear={handleClearCriteria}
              >
                {criteriaOptionsFix.map((data) => (
                  <Select.Option key={data.value} value={data.value}>
                    {data.name}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <Form.Item
          name={"priceAdjustDescription"}
          // rules={[{ message: requiredMessage("Description"), required: true }]}
          className="w-full"
          label={"Description"}
        >
          <InputComponent
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default PricingAdjustSectionForm;
