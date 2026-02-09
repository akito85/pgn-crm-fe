import { Input } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import React from "react";

const LiborRateForm = (props) => {
  const {
    dataType,
    form,
  } = props;

  return (
    <div>
      <BaseContainer header={"LIBOR RATE INFORMATION"}>
        <div className="w-full grid grid-cols-2 gap-5">
          <Form.Item
            label={"Source Code"}
            name={"sourceCode"}
            rules={formMessageRequired("Source Code")}
          >
            <InputComponent placeholder="Input Source Code" maxLength={50} />
          </Form.Item>

          <Form.Item
            label={"Source Name"}
            name={"sourceName"}
            rules={formMessageRequired("Source Name")}
          >
            <InputComponent placeholder="Input Source Name" maxLength={100} />
          </Form.Item>
        </div>

        <div className="w-full grid grid-cols-1 gap-5">
          <Form.Item
            label={"Description"}
            name={"description"}
          >
            <Input.TextArea placeholder="Input Description" maxLength={255} rows={4} />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default LiborRateForm;
