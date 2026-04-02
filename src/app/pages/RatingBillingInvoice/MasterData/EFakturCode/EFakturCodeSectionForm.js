import React from "react";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import InputComponent from "../../../../../components/InputComponent";
import FunctionalAdditionalCode from "./FunctionalConditionalCode";
import CardContainer from "../../../../../components/CardContainer";

const EFakturCodeSectionForm = ({
  type,
  form,
  listAdditionalCode = [],
  setListAdditionalCode = () => {},
  storedDataInline = false,
  setStoredDataInline = () => {},
  status,
  statusApproval,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* E-Faktur Code Information */}
      <CardContainer header="EFAKTUR CODE INFORMATION">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Efaktur Code"
            name="efakturCode"
            rules={[
              {
                required: true,
                message: "Please input efaktur code!",
              },
            ]}
          >
            <InputComponent
              placeholder="Input efaktur code"
              disabled={type === "update"}
              maxLength={10}
            />
          </Form.Item>

          <div></div>

          <Form.Item
            label="Description"
            name="description"
            className="col-span-2"
          >
            <InputComponent
              placeholder="Input description"
              type="textarea"
              disabled={type === "detail"}
            />
          </Form.Item>
        </div>
      </CardContainer>

      {/* Additional Code Information */}
      <CardContainer header="ADDITIONAL CODE INFORMATION">
        <FunctionalAdditionalCode
          type={type}
          data={listAdditionalCode}
          updateData={setListAdditionalCode}
          storedData={storedDataInline}
          setStoredData={setStoredDataInline}
          status={status}
          statusApproval={statusApproval}
        />
      </CardContainer>
    </div>
  );
};

export default EFakturCodeSectionForm;
