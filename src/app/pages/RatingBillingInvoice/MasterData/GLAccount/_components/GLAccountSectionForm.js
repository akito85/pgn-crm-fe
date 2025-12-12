import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import InputComponent from "../../../../../../components/InputComponent";
import { getSpecialGLList } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/glAccount";

const GLAccountSectionForm = ({ type, form }) => {
  const dispatch = useDispatch();
  const { data_special_gl_list, loading } = useSelector(
    (state) => state.glAccount
  );

  const [specialGLOptions, setSpecialGLOptions] = useState([]);

  // Fetch special GL list on component mount
  useEffect(() => {
    dispatch(getSpecialGLList());
  }, [dispatch]);

  // Transform special GL data to options
  useEffect(() => {
    if (data_special_gl_list && Array.isArray(data_special_gl_list)) {
      const options = data_special_gl_list.map((item) => ({
        label: item.name,
        value: item.glbTypeValId,
      }));
      setSpecialGLOptions(options);
    }
  }, [data_special_gl_list]);

  return (
    <div className="flex flex-col gap-3">
      {/* GL Account Information */}
      <BaseContainer header="GL ACCOUNT INFORMATION">
        <div className="flex flex-col w-full gap-4">
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
              placeholder="Input GL Account Number"
              maxLength={255}
            />
          </Form.Item>

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
              type="textarea"
              placeholder="Input GL Account Description"
              maxLength={255}
            />
          </Form.Item>

          <Form.Item
            label="Special GL"
            name="specialGlValue"
            rules={[
              {
                required: true,
                message: "Please select Special GL!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select Special GL"
              optionFilterProp="children"
              options={specialGLOptions}
              loading={loading}
              allowClear
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label="Reference"
            name="reference"
            rules={[
              {
                required: true,
                message: "Please input Reference!",
              },
            ]}
          >
            <InputComponent placeholder="Input Reference" maxLength={255} />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default GLAccountSectionForm;
