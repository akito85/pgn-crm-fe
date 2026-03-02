import { Select, Form } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import { formMessageRequired } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getListPartnerType, getListRating, getListCriteria, getPartnerCode } from "../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";

const PaymentWarrantyPartnerForm = (props) => {
  const { dataType, form, isApprover } = props;
  const dispatch = useDispatch();
  const { dataListPartnerType, dataListRating, dataListCriteria, partnerCode, loading } = useSelector((state) => state.paymentWarrantyPartner);

  const isDisable = isApprover || dataType === "view";

  useEffect(() => {
    dispatch(getListPartnerType());
    dispatch(getListRating());
    dispatch(getListCriteria());
    if (dataType !== "view" && !form.getFieldValue("id")) {
      dispatch(getPartnerCode());
    }
  }, [dispatch, dataType, form]);

  useEffect(() => {
    if (partnerCode && !form.getFieldValue("partnerCode")) {
      form.setFieldsValue({ partnerCode });
    }
  }, [partnerCode, form]);

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue("startDate");
    if (!startDate) {
      return false;
    }
    return current && current < startDate.startOf("day");
  };

  return (
    <div>
      <BaseContainer header={"CREATE PAYMENT GUARANTEE PARTNER"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <Form.Item
            label={"Partner Code *"}
            name={"partnerCode"}
          >
            <InputComponent disabled placeholder="Partner Code" />
          </Form.Item>

          <Form.Item
            label={"Partner Guarantee Issuer *"}
            name={"partnerGuaranteeIssuer"}
            rules={formMessageRequired("Partner Guarantee Issuer")}
          >
            <InputComponent disabled={isDisable} placeholder="Input.." />
          </Form.Item>

          <Form.Item
            label={"Partner Type *"}
            name={"partnerType"}
            rules={formMessageRequired("Partner Type")}
          >
            <SelectComponent 
                placeholder="Select"
                allowClear
                loading={loading}
                disabled={isDisable}
            >
              {dataListPartnerType?.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Rating *"}
            name={"rating"}
            rules={formMessageRequired("Rating")}
          >
            <SelectComponent 
                placeholder="Select"
                allowClear
                loading={loading}
                disabled={isDisable}
            >
              {dataListRating?.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Criteria *"}
            name={"criteria"}
            rules={formMessageRequired("Criteria")}
          >
            <SelectComponent 
                placeholder="Select"
                allowClear
                loading={loading}
                disabled={isDisable}
            >
              {dataListCriteria?.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Rating date *"}
            name={"ratingDate"}
            rules={formMessageRequired("Rating date")}
          >
            <DateComponent disabled={isDisable} placeholder="Select Date" format="DD-MMM-YYYY" />
          </Form.Item>

          <Form.Item
            label={"Start date *"}
            name={"startDate"}
            rules={formMessageRequired("Start date")}
          >
            <DateComponent disabled={isDisable} placeholder="Select Date" format="DD-MMM-YYYY" />
          </Form.Item>

          <Form.Item
            label={"End date"}
            name={"endDate"}
          >
            <DateComponent 
                placeholder="Select Date" 
                format="DD-MMM-YYYY" 
                dateDisable={disabledEndDate}
                disabled={isDisable}
            />
          </Form.Item>
        </div>
      </BaseContainer>
    </div>
  );
};

export default PaymentWarrantyPartnerForm;
