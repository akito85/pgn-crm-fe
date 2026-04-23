import { Form } from "antd";
import InputComponent from "../../components/InputComponent";
import { requiredMessage } from "../../utils";

/**
 * Remark textarea input
 *
 * @param {{ disabled?: boolean }} props
 */
const NxRemarkInput = ({ disabled = false }) => {
  return (
    <Form.Item
      key="remark"
      name={"remark"}
      rules={[{ message: requiredMessage("Remark"), required: true }]}
      labelCol={{ span: 24 }}
      className="no-margin-form"
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

export default NxRemarkInput;
