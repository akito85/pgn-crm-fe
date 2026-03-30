import { Form } from "antd";
import InputComponent from "../../../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../../../utils";

const ConfirmationModalRemark = ({ disabled = false }) => {
  return (
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
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default ConfirmationModalRemark;
