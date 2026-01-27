import { Fragment } from "react";
import { Form } from "antd";
import InputComponent from "../../../../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../../../../utils";
import CardContainer from "../../../../../../../../../components/CardContainer";

const ConfirmationModalRemark = () => {
  return (
    <CardContainer header={
      <div className="flex items-center gap-x-1">
        <span>
          REMARK
        </span>
        <span style={{ color: "red" }}>
          *
        </span>
      </div>
    }>
      <Form.Item
        key="remark"
        name={"remark"}
        rules={[{ message: requiredMessage("Remark"), required: true }]}
        labelCol={{ span: 24 }}
      >
        <InputComponent
          group
          type="textarea"
          placeholder={"Type your remark"}
        />
      </Form.Item>
    </CardContainer>
  );
};

export default ConfirmationModalRemark;
