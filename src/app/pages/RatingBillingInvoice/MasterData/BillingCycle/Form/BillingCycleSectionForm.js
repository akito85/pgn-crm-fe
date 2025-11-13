import { Form, Select } from "antd";
import BaseContainer from "../../../../../../components/BaseContainer";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import DateComponent from "../../../../../../components/DateComponent";
import moment from "moment";
import { useState } from "react";

const BillingCycleSectionForm = ({
  type,
  dataTimeUnit,
  startDate,
  status,
  handleStartDate = () => {},
}) => {
  const [description, setDescription] = useState("");

  const disabledDate = (current) => {
    return false;
  };

  // Validation Handle End Date
  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  return (
    <BaseContainer header={"Billing Cycle Information"}>
      <div className="w-full grid grid-cols-3 gap-3">
        <Form.Item
          label={"Begin Cycle"}
          name={"beginCycle"}
          rules={[
            {
              required: true,
              message: "Please input your Begin Cycle!",
            },
          ]}
        >
          <InputComponent
            type={"number"}
            disabled={type !== "create" && status !== "DRAFT" ? true : false}
          />
        </Form.Item>
        <Form.Item
          label={"End Cycle"}
          name={"endCycle"}
          rules={[
            {
              required: true,
              message: "Please input your End Cycle!",
            },
          ]}
        >
          <InputComponent
            type={"number"}
            disabled={type !== "create" && status !== "DRAFT" ? true : false}
          />
        </Form.Item>
        <Form.Item
          label={"Time Unit"}
          name={"timeUnit"}
          rules={[
            {
              required: true,
              message: "Please input your Time Unit!",
            },
          ]}
        >
          <SelectComponent
            disabled={type !== "create" && status !== "DRAFT" ? true : false}
          >
            {dataTimeUnit &&
              dataTimeUnit?.map((data, index) => (
                <Select.Option key={index} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Invoice Date"}
          name={"invoiceDate"}
          rules={[
            {
              required: true,
              message: "Please input your Invoice Date!",
            },
          ]}
        >
          <InputComponent type="number" />
        </Form.Item>
        <Form.Item
          label={"Start Date"}
          name={"startDate"}
          rules={[
            {
              required: true,
              message: "Please input your Start Date!",
            },
          ]}
          // getValueFromEvent={handleStartDate}
        >
          <DateComponent
            dateDisable={disabledDate}
            onChange={(e) => handleStartDate(e)}
            disabled={status !== "DRAFT" && type !== "create" ? true : false}
          />
        </Form.Item>
        <Form.Item
          label={"End Date"}
          name={"endDate"}
          rules={[
            {
              validator: (_, value) =>
                (value && moment(startDate) <= moment(value)) || !value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("End date must before Start date")
                    ),
            },
          ]}
        >
          <DateComponent
            // disabled={startDate === null}
            dateDisable={handleDisableEndDate}
          />
        </Form.Item>
      </div>

      <div className="w-full grid-cols-1">
        <Form.Item
          label={"Description"}
          name={"description"}
          className={"w-full"}
        >
          <InputComponent
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>
    </BaseContainer>
  );
};

export default BillingCycleSectionForm;
