import React from "react";
import DateComponent from "../../../../../../../components/DateComponent";
import { Fragment } from "react";
import InputComponent from "../../../../../../../components/InputComponent";
import { Form } from "antd";

const WitholdingTaxSet = () => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mb-5">
        WAPU INFORMATION
      </div>
      <div className="w-full">
        <Form.Item
          name={"startDate"}
          label="Start Date"
          rules={[{ message: "This field is required", required: true }]}
          className="no-margin-form"
        >
          <DateComponent mandatory />
        </Form.Item>
        {/* <Form.Item
          name={"endDate"}
          rules={[{ message: "This field is required", required: true }]}
          className="no-margin-form"
        >
          <DateComponent label="End Date" mandatory />
        </Form.Item> */}
      </div>

      <div className="w-full mt-5">
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

export default WitholdingTaxSet;
