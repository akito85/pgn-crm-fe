import { Input, Select, InputNumber, DatePicker } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../../utils";
import InputComponent from "../../../../../../components/InputComponent";
import React from "react";

const { Option } = Select;

const RateIndexForm = (props) => {
  const {
    form,
  } = props;

  return (
    <div>
      <BaseContainer header={"RATE INDEX INFORMATION"}>
        <div className="w-full grid grid-cols-2 gap-5">
          <Form.Item
            label={"Index Code"}
            name={"indexCode"}
            rules={formMessageRequired("Index Code")}
          >
            <InputComponent placeholder="Input Index Code" maxLength={50} />
          </Form.Item>

          <Form.Item
            label={"Index Name"}
            name={"indexName"}
            rules={formMessageRequired("Index Name")}
          >
            <InputComponent placeholder="Input Index Name" maxLength={100} />
          </Form.Item>

          <Form.Item
            label={"Currency"}
            name={"currencyCode"}
            rules={formMessageRequired("Currency")}
          >
            <InputComponent placeholder="Input Currency Code (e.g. USD, IDR)" maxLength={3} />
          </Form.Item>

          <div className="flex gap-2">
            <Form.Item
              label={"Tenor Value"}
              name={"tenorValue"}
              className="flex-1"
              rules={formMessageRequired("Tenor Value")}
            >
              <InputNumber placeholder="0" className="w-full" min={1} />
            </Form.Item>
            <Form.Item
              label={"Tenor Unit"}
              name={"tenorUnit"}
              className="w-1/3"
              rules={formMessageRequired("Tenor Unit")}
            >
              <Select placeholder="Unit">
                <Option value="Day">Day</Option>
                <Option value="Month">Month</Option>
                <Option value="Year">Year</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label={"Rate Percentage (%)"}
            name={"ratePercentage"}
            rules={formMessageRequired("Rate Percentage")}
          >
            <InputNumber
              placeholder="0.00"
              className="w-full"
              min={0}
              step={0.01}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
            />
          </Form.Item>

          <div className="flex gap-2">
             <Form.Item
                label={"Start Date"}
                name={"startDate"}
                className="flex-1"
                rules={formMessageRequired("Start Date")}
             >
                <DatePicker className="w-full" format="YYYY-MM-DD" />
             </Form.Item>
             <Form.Item
                label={"End Date"}
                name={"endDate"}
                className="flex-1"
                rules={formMessageRequired("End Date")}
             >
                <DatePicker className="w-full" format="YYYY-MM-DD" />
             </Form.Item>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 gap-5">
          <Form.Item
            label={"Description"}
            name={"remarks"}
          >
            <Input.TextArea placeholder="Input Description" maxLength={255} rows={4} />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default RateIndexForm;
