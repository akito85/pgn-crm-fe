import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../../../../../../components/CardContainer";
import InputComponent from "../../../../../../components/InputComponent";

const GLAccountSectionForm = ({ type, form }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.glAccount);

  return (
    <div className="flex flex-col gap-3">
      <CardContainer header="GL ACCOUNT INFORMATION">
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
                  {
                    pattern: /^[0-9]+$/,
                    message: "GL Account Number must be numeric!",
                  },
                ]}
              >
                <InputComponent
                  placeholder="GL Account Number.."
                  maxLength={255}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
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
            label="Description"
            name="remark"
            rules={[
              {
                required: true,
                message: "Please input Description!",
              },
            ]}
          >
            <InputComponent
              type="textarea"
              placeholder="Description.."
              maxLength={255}
            />
          </Form.Item>
        </div>
      </CardContainer>
    </div>
  );
};

export default GLAccountSectionForm;