import { Form, Select } from "antd";
import React from "react";
import { Fragment } from "react";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../utils";

const QueryParams = ({
  // query,
  // handleDeleteQuery = () => {},
  index = 0,
  // handleQueryChange = () => {},
  optionsConditions = [],
  optionColumns = [],
  optionOperator = [],
  name,
  restField,
}) => {
  // const [optionsConditions, setOptionsConditions] = useState([
  //   { id: 1, value: "AND" },
  //   { id: 2, value: "OR" },
  // ]);
  // const [optionColumns, setOptionColumns] = useState([
  //   { id: 1, value: "Customer Name" },
  //   { id: 2, value: "Customer ID" },
  // ]);
  // const [optionOperator, setOptionOperator] = useState([
  //   { id: 1, value: "Equal" },
  //   { id: 2, value: "Not Equal" },
  // ]);

  // const handleInputChange = (field, value) => {
  //   const updatedQuery = { ...query, [field]: value };
  //   console.log(updatedQuery);
  //   handleQueryChange(index, updatedQuery);
  // };

  return (
    <Fragment>
      {/* <Form> */}
      <div className="w-full grid grid-cols-4 gap-2">
        <Form.Item
          {...restField}
          label={"Condition"}
          name={[name, "condition"]}
          rules={[{ message: requiredMessage("condition"), required: true }]}
        >
          <SelectComponent
            // value={index === 0 ? 1311 : null}
            // onChange={(value) => handleInputChange("condition", value)}
            disabled={index === 0}
          >
            {optionsConditions?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.value}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          {...restField}
          label={"Column"}
          name={[name, "column"]}
          rules={[{ message: requiredMessage("column"), required: true }]}
        >
          <SelectComponent
          // value={query.column}
          // onChange={(value) => handleInputChange("column", value)}
          >
            {optionColumns?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.value}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          {...restField}
          label={"Operator"}
          name={[name, "operator"]}
          // name={"operator"}
          rules={[{ message: requiredMessage("operator"), required: true }]}
        >
          <SelectComponent
          // value={query.operator}
          // onChange={(value) => handleInputChange("operator", value)}
          >
            {optionOperator?.map((data) => (
              <Select.Option key={data.id} value={data.id}>
                {data.value}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          {...restField}
          label={"Value"}
          // name={"value"}
          name={[name, "value"]}
          rules={[{ message: requiredMessage("value"), required: true }]}
        >
          <InputComponent
          // value={query.value}
          // onChange={(event) => handleInputChange("value", event.target.value)}
          />
        </Form.Item>
      </div>
      {/* <div className="pt-7 pl-5">
            <Tooltip title="Delete">
              <SVGIcon
                name="IconDelete"
                color={"#D90000"}
                width={24}
                onClick={() => {
                  handleDeleteQuery(query);
                }}
              />
            </Tooltip>
          </div> */}
      {/* </Form> */}
    </Fragment>
  );
};

export default QueryParams;
