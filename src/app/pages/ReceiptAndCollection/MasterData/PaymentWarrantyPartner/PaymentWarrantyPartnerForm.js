import { Select, Input, InputNumber } from "antd";
import { Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { getListParent, getListPartnerType } from "../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";

const PaymentWarrantyPartnerForm = (props) => {
  const {
    dataType,
    form,
  } = props;

  const dispatch = useDispatch();
  const { dataListParent, dataListPartnerType, loading } = useSelector((state) => state.paymentWarrantyPartner);

  useEffect(() => {
    dispatch(getListParent());
    dispatch(getListPartnerType());
  }, [dispatch]);

  const alignStyle = `
    .align-left-input-number .ant-input-number-input::placeholder {
      text-align: left !important;
    }
  `;

  const formatNPWP = (value) => {
    if (!value) return "";
    const cleanValue = value.replace(/\D/g, "");
    let formattedValue = "";

    if (cleanValue.length > 0) formattedValue = cleanValue.substring(0, 2);
    if (cleanValue.length > 2) formattedValue += "." + cleanValue.substring(2, 5);
    if (cleanValue.length > 5) formattedValue += "." + cleanValue.substring(5, 8);
    if (cleanValue.length > 8) formattedValue += "." + cleanValue.substring(8, 9);
    if (cleanValue.length > 9) formattedValue += "-" + cleanValue.substring(9, 12);
    if (cleanValue.length > 12) formattedValue += "." + cleanValue.substring(12, 15);

    return formattedValue;
  };

  return (
    <div>
      <style>{alignStyle}</style>
      <BaseContainer header={"WARRANTY PARTNER INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label={"Partner Name"}
            name={"partnerName"}
            rules={formMessageRequired("Partner Name")}
          >
            <InputComponent placeholder="Input Partner Name" />
          </Form.Item>

          <Form.Item
            label={"Partner Type"}
            name={"partnerType"}
            rules={formMessageRequired("Partner Type")}
          >
            <SelectComponent 
                placeholder="Select Partner Type"
                allowClear
                loading={loading}
            >
              {dataListPartnerType?.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Swift Code"}
            name={"swiftCode"}
            rules={formMessageRequired("Swift Code")}
            normalize={(value) => (value || "").toUpperCase()}
          >
            <InputComponent placeholder="Input Swift Code" />
          </Form.Item>

          <Form.Item
            label={"NPWP"}
            name={"npwp"}
            rules={[
                ...formMessageRequired("NPWP"),
                {
                    pattern: /^\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3}$/,
                    message: "Invalid NPWP format (e.g., 99.999.999.9-999.999)",
                }
            ]}
            normalize={formatNPWP}
          >
            <InputComponent placeholder="Input NPWP" maxLength={20} />
          </Form.Item>

          <Form.Item
            label={"License Number"}
            name={"licenseNum"}
            rules={[
                ...formMessageRequired("License Number"),
                {
                    pattern: /^[A-Z0-9.\-/]+$/,
                    message: "Invalid License Number format (Alphanumeric, dot, dash, slash only)",
                }
            ]}
            normalize={(value) => (value || "").toUpperCase()}
          >
            <InputComponent placeholder="Input License Number" />
          </Form.Item>
        </div>

        <div className="w-full grid grid-cols-5 gap-5">
           <Form.Item
            label={"Parent Partner"}
            name={"parentId"}
          >
            <SelectComponent 
                placeholder="Select Parent"
                allowClear
                loading={loading}
            >
              {dataListParent?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.partnerName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </div>
      </BaseContainer>

      <BaseContainer header={"ADDRESS INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-5">
          <Form.Item label={"Street"} name={["address", "street"]}>
            <InputComponent placeholder="Input Street" />
          </Form.Item>
          <Form.Item label={"Building"} name={["address", "building"]}>
            <InputComponent placeholder="Input Building" />
          </Form.Item>
          <Form.Item label={"Address Number"} name={["address", "addressNum"]}>
            <InputComponent placeholder="Input Address Number" />
          </Form.Item>
          <Form.Item label={"District"} name={["address", "district"]}>
            <InputComponent placeholder="Input District" />
          </Form.Item>
          <Form.Item label={"City"} name={["address", "city"]}>
            <InputComponent placeholder="Input City" />
          </Form.Item>
          <Form.Item label={"Province"} name={["address", "province"]}>
            <InputComponent placeholder="Input Province" />
          </Form.Item>
          <Form.Item label={"Country"} name={["address", "country"]}>
            <InputComponent placeholder="Input Country" />
          </Form.Item>
          <Form.Item label={"Zip Code"} name={["address", "zipCode"]}>
            <InputComponent placeholder="Input Zip Code" />
          </Form.Item>
        </div>
      </BaseContainer>

      <BaseContainer header={"CONTACT INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-5">
          <Form.Item label={"Contact Person"} name={["contact", "contactPerson"]}>
            <InputComponent placeholder="Input Contact Person" />
          </Form.Item>
          <Form.Item label={"Phone Number"} name={["contact", "phoneNum"]}>
            <InputComponent placeholder="Input Phone Number" />
          </Form.Item>
          <Form.Item 
            label={"Email"} 
            name={["contact", "email"]}
            rules={[
              {
                type: "email",
                message: "Please input a valid email address",
              },
            ]}
          >
            <InputComponent placeholder="Input Email" />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default PaymentWarrantyPartnerForm;
