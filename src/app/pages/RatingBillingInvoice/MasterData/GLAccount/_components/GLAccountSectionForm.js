import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import InputComponent from "../../../../../../components/InputComponent";

const GLAccountSectionForm = ({ type, form }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.glAccount);

  return (
    <div className="flex flex-col gap-3">
      <BaseContainer header="GL ACCOUNT INFORMATION">
        <div className="flex flex-col w-full gap-3">

          <div className="flex gap-3">
            <div className="flex-1">
              <Form.Item
                label="GL Account Number"
                name="glAccount"
                rules={[
                  {
                    required: true,
                    message: "Please input GL Account Number!",
                  },
                ]}
              >
                <InputComponent
                  placeholder="GL Account Number.."
                  maxLength={255}
                />
              </Form.Item>
            </div>

            <div className="flex-1">
              <Form.Item
                label="GL Account Description"
                name="glAccountDesc"
                rules={[
                  {
                    required: true,
                    message: "Please input GL Account Description!",
                  },
                ]}
              >
                <InputComponent
                  placeholder="GL Account Description.."
                  maxLength={255}
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            label="Reference"
            name="remark"
            rules={[
              {
                required: true,
                message: "Please input Reference!",
              },
            ]}
          >
            <InputComponent
              type="textarea"
              placeholder="Reference.."
              maxLength={255}
            />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default GLAccountSectionForm;