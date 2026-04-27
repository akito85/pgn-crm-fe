import React from "react";
import { Form, Select } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import { formMessageRequired } from "../../../../../../utils";
import DateComponent from "../../../../../../components/DateComponent";
import CardContainer from "../../../../../../components/CardContainer";

const DailyRateCreate = ({ dataCurrency, dataRateType }) => {
  return (
    <CardContainer header={"DAILY RATES INFORMATION"}>
      <div className="w-full grid grid-cols-3 gap-2">
        <Form.Item
          label={"Rate Type"}
          name={"rateType"}
          rules={formMessageRequired("Rate Type")}
        >
          <SelectComponent>
            {dataRateType?.map((data) => (
              <Select.Option key={data.Id} value={data.code}>
                {data.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          label={"From Currency"}
          name={"fCurrency"}
          rules={formMessageRequired("From Curency")}
        >
          <SelectComponent>
            {dataCurrency?.map((data) => (
              <Select.Option key={data.Id} value={data.Id}>
                {data.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"To Currency"}
          name={"tCurrency"}
          rules={formMessageRequired("To Currency")}
        >
          <SelectComponent>
            {dataCurrency?.map((data) => (
              <Select.Option key={data.Id} value={data.Id}>
                {data.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          label={"Rate Date"}
          name={"rateDate"}
          rules={formMessageRequired("Rate Date")}
        >
          <DateComponent />
        </Form.Item>

        <Form.Item
          label={"Converted Rate"}
          name={"convertedRate"}
          getValueFromEvent={(e) => {
            return e.floatValue;
          }}
          rules={formMessageRequired("Converted Rate")}
          required
        >
          <InputComponent
            decimalScale={2}
            thousandSeparator={","}
            decimalSeparator={"."}
            type="numeric"
            fixedDecimalScale={true}
          />
        </Form.Item>
      </div>
      <div className="w-full grid grid-cols-1 gap-5">
        <Form.Item label={"Description"} name={"description"}>
          <InputComponent rows={5} type="textarea" />
        </Form.Item>
      </div>
    </CardContainer>
  );
};

export default DailyRateCreate;
