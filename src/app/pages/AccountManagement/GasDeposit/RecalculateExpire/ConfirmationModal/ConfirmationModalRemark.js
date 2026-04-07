import { Form } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../utils";

/**
 * Required remark textarea rendered on the Remark tab of the confirmation
 * modal. Only shown for "submit" type actions.
 *
 * @param {{ disabled?: boolean }} props
 */
const ConfirmationModalRemark = ({ disabled = false }) => {
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

export default ConfirmationModalRemark;
