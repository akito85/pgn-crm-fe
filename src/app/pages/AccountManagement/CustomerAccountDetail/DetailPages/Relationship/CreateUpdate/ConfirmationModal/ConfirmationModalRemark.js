import { Form } from "antd";
import InputComponent from "../../../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../../../utils";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";

const ConfirmationModalRemark = ({ disabled = false }) => {
  return (
    <NxBaseContainer border header="REMARK" required>
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
    </NxBaseContainer>
  );
};

export default ConfirmationModalRemark;
