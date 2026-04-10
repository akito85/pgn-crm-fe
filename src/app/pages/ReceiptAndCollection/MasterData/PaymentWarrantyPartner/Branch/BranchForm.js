import React from "react";
import { Form } from "antd";
import InputComponent from "../../../../../../components/InputComponent";

const BranchForm = ({ disabled = false }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Form.Item name="branchCode" label="Branch Code" rules={!disabled ? [{ required: true, message: "Required" }] : []}>
        <InputComponent placeholder="Input.." disabled={disabled} />
      </Form.Item>
      <Form.Item name="branchName" label="Branch Name" rules={!disabled ? [{ required: true, message: "Required" }] : []}>
        <InputComponent placeholder="Input.." disabled={disabled} />
      </Form.Item>
    </div>
  );
};

export default BranchForm;
