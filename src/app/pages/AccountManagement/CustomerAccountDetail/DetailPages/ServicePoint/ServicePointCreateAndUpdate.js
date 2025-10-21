import { Form, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Fragment } from "react";
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";

const ServicePointCreateAndUpdate = ({
  type = {},
  optionAddress = [],
  optionServicePoint = [],
  handleOptionServicePoint = () => {},
}) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mb-5">
        SERVICE POINT INFORMATION
      </div>
      <div className="w-full flex flex-col gap-2">
        <Form.Item
          name={"premiseAddress"}
          rules={[{ message: "This field is required", required: true }]}
          className="no-margin-form"
          label={"Premise Address"}
        >
          <SelectComponent
            mandatory
            disabled={type === "update" ? true : false}
            onChange={(e) => handleOptionServicePoint(e)}
          >
            {optionAddress?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.value}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"servicePointName"}
          rules={[{ message: "This field is required", required: true }]}
          className="no-margin-form"
          label={"Service Point Name"}
        >
          <SelectComponent
            mandatory
            disabled={type === "update" ? true : false}
          >
            {optionServicePoint?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
      </div>

      <div className="w-full mt-2">
        <Form.Item name={"description"} label={"Description"}>
          <InputComponent
            type="textarea"
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>
    </Fragment>
  );
};

export default ServicePointCreateAndUpdate;
