import { Form } from "antd";
import BaseContainer from "../../../../../../components/BaseContainer";
import InputComponent from "../../../../../../components/InputComponent";
import SignatureComponent from "./SignatureComponent";

const DigitalSignatureSectionForm = ({ type }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Digital Signature Information */}
      <BaseContainer header="DIGITAL SIGNATURE INFORMATION">
        <div className="flex flex-col w-full gap-4">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input Name!",
              },
            ]}
          >
            <InputComponent placeholder="Input Name" maxLength={10} />
          </Form.Item>

          <div className="flex gap-3 w-full">
            <div className="w-full">
              <Form.Item
                label="Employee"
                name="employee"
                rules={[
                  {
                    required: true,
                    message: "Please input Employee!",
                  },
                ]}
              >
                <InputComponent placeholder="Input employee" />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item label="Primary Position" name="primaryPosition">
                <InputComponent disabled />
              </Form.Item>
            </div>
          </div>

          <Form.Item label="Description" name="description">
            <InputComponent type="textarea" placeholder="Input Description" />
          </Form.Item>

          {/* Signature Section */}
          <Form.Item
            label="Signature"
            name="signature"
            rules={[
              {
                required: true,
                message: "Please provide your signature!",
              },
            ]}
          >
            <SignatureComponent />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default DigitalSignatureSectionForm;
