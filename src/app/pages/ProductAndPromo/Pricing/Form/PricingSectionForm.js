import { Form, Select } from "antd";
import React from "react";
import InputComponent from "../../../../../components/InputComponent";
import { useState } from "react";
import SelectComponent from "../../../../../components/SelectComponent";
import { requiredMessage } from "../../../../../utils";

const dummyOptions = [
  { name: "Customer", value: 12 },
  { name: "Sub-District", value: 13 },
  { name: "District", value: 14 },
  { name: "City", value: 39 },
  { name: "Province", value: 15 },
  { name: "Country", value: 3023, code: "COUNTRY" },
  { name: "Customer Segment", value: 19 },
  { name: "Account Group", value: 20 },
  { name: "All", value: 24 },
];
const PricingSectionForm = ({
  criteriaOptions = [],
  handleSelectCriteria = () => {},
  handleDeselectCriteria = () => {},
  handleClearCriteria = () => {},
  handlePriceCode = () => {},
  type,
  status = "",
}) => {
  const [description, setDescription] = useState("");
  const criteriaOptionsFix =
    criteriaOptions.length > 0 ? criteriaOptions : dummyOptions;
  return (
    <div className="flex flex-col w-full gap-3">
      <div className={"flex w-full gap-3"}>
        <div className={"flex flex-col w-full"}>
          <div className={"flex flex-col w-full"}>
            <Form.Item
              name={"priceCode"}
              rules={[
                { message: requiredMessage("Price Code"), required: true },
              ]}
              className={"w-full no-margin-form"}
              required
              label={"Price Code"}
            >
              <InputComponent
                onChange={handlePriceCode}
                type="text"
                disabled={type === "update" && status === "ACTIVE"}
                maxLength={100}
              />
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
                {criteriaOptionsFix.map((data, index) => (
                  <Select.Option key={index} value={data.value}>
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
          name={"priceDescription"}
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

export default PricingSectionForm;
