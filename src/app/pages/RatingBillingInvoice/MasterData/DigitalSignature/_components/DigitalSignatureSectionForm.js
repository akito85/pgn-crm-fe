import { Form, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import InputComponent from "../../../../../../components/InputComponent";
import SignatureComponent from "./SignatureComponent";
import {
  getListEmployee,
  getPositionEmployee,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/digitalSignature";

const DigitalSignatureSectionForm = ({ type, form }) => {
  const dispatch = useDispatch();
  const { data_list_employee, data_position_employee, loading } = useSelector(
    (state) => state.digitalSignature
  );

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  // Fetch employee list on component mount or search change
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      dispatch(getListEmployee({ search: searchEmployee }));
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [dispatch, searchEmployee]);

  // Transform employee data to options
  useEffect(() => {
    if (data_list_employee && Array.isArray(data_list_employee)) {
      const options = data_list_employee.map((employee) => ({
        label: `${employee.fullName} (${employee.employeeCode})`,
        value: employee.employeeCode,
        name: employee.fullName,
      }));
      setEmployeeOptions(options);
    }
  }, [data_list_employee]);

  // Handle employee position data
  useEffect(() => {
    if (data_position_employee) {
      form.setFieldsValue({
        primaryPosition: data_position_employee.position || "",
      });
    }
  }, [data_position_employee, form]);

  // Handle employee selection
  const handleEmployeeChange = async (value, option) => {
    if (value) {
      setLoadingEmployee(true);
      try {
        await dispatch(getPositionEmployee({ employeeCode: value })).unwrap();
      } catch (error) {
        console.error("Failed to fetch employee position:", error);
      } finally {
        setLoadingEmployee(false);
      }
    } else {
      form.setFieldsValue({
        primaryPosition: "",
      });
    }
  };

  // Handle search employee
  const handleSearchEmployee = (value) => {
    setSearchEmployee(value);
  };

  // Handle signature method change
  const handleSignatureMethodChange = (method) => {
    form.setFieldsValue({
      signatureMethod: method,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Digital Signature Information */}
      <BaseContainer header="DIGITAL SIGNATURE INFORMATION">
        <Spin spinning={loadingEmployee}>
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
              <InputComponent placeholder="Input Name" maxLength={255} />
            </Form.Item>

            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Form.Item
                  label="Employee"
                  name="employeeCode"
                  rules={[
                    {
                      required: true,
                      message: "Please select Employee!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Employee"
                    optionFilterProp="children"
                    onChange={handleEmployeeChange}
                    onSearch={handleSearchEmployee}
                    filterOption={false}
                    options={employeeOptions}
                    loading={loading}
                    allowClear
                    notFoundContent={
                      loading ? <Spin size="small" /> : "No data found"
                    }
                  />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item label="Primary Position" name="primaryPosition">
                  <InputComponent disabled placeholder="Auto-filled" />
                </Form.Item>
              </div>
            </div>

            <Form.Item label="Description" name="description">
              <InputComponent
                type="textarea"
                placeholder="Input Description"
                maxLength={255}
              />
            </Form.Item>

            {/* Hidden field for signature method */}
            <Form.Item name="signatureMethod" hidden>
              <input type="hidden" />
            </Form.Item>

            {/* Signature Section */}
            <Form.Item
              label="Signature"
              name="signatureBase64"
              rules={[
                {
                  required: true,
                  message: "Please provide your signature!",
                },
              ]}
            >
              <SignatureComponent
                onMethodChange={handleSignatureMethodChange}
              />
            </Form.Item>
          </div>
        </Spin>
      </BaseContainer>
    </div>
  );
};

export default DigitalSignatureSectionForm;
