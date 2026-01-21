import React from "react";
import { Form, Checkbox } from "antd";
import DateComponent from "../../../../../../../components/DateComponent";
import InputComponent from "../../../../../../../components/InputComponent";

const WithholdingTaxForm = ({
  dispatch = () => {},
  handleWTObj = () => {},
  wtObj = {},
}) => {

  return (
    <div>
      <span className="text-primary uppercase font-bold">
        WITHHOLDING TAX INFORMATION
      </span>

      <div className="w-full flex flex-row gap-2 pt-[15px]">
      <Form.Item
          name={"wapuFlag"}
          getValueFromEvent={(e) => handleWTObj(e, "wapuFlag")}
        >
          <div className="pt-[33px]">
            <Checkbox>WAPU</Checkbox>
          </div>
        </Form.Item>
        <Form.Item
          label={"Start Date"}
          name={"startDateWT"}
          rules={[
            {
              required: wtObj?.wapuFlag,
              message: "Please input your Start Date!",
            },
          ]}
        >
          <DateComponent disabled={wtObj?.wapuFlag ? false : true} isPassingId />
        </Form.Item>

        <Form.Item
          label={"Description"}
          name={"descriptionWT"}
          // rules={[
          //   {
          //     required: true,
          //     message: "Please input your Tax Identifier Description!",
          //   },
          // ]}
        >
          <InputComponent isPassingId />
        </Form.Item>
      </div>
    </div>
  );
};

export default WithholdingTaxForm;
