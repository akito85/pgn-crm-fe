import { Fragment, useEffect, useState } from "react";
import { Form } from "antd";
import InputComponent from "../../../../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../../../../utils";

const ConfirmationModalRemark = () => {
  return (
    <Fragment>
      <div className="flex">
        <div className="text-primary text-xs font-bold uppercase">
          REMARK
        </div>
        <span className={"pl-1"} style={{ color: "red" }}>
          *
        </span>
      </div>
      <Form.Item
        key="remark"
        name={"remark"}
        label={"Remark"}
        rules={[{ message: requiredMessage("Remark"), required: true }]}
        labelCol={{ span: 24 }}
      >
        <InputComponent
          group
          type="textarea"
          placeholder={"Type your remark"}
        />
      </Form.Item>
    </Fragment>
  );
};

export default ConfirmationModalRemark;
