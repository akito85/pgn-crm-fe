import { Form, Select } from "antd";
import React, { useEffect } from "react";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import {
  getListProductClass,
  getListProductType,
  getListServiceType,
} from "../../../../../redux/slices/product_promo/product";
import { useSelector } from "react-redux";
import moment from "moment";
import DateComponent from "../../../../../components/DateComponent";
import { requiredMessage } from "../../../../../utils";

const ProductSectionForm = ({
  type,
  dispatch = () => {},
  productObj = {},
  handleProductObj = (e, type) => {
    return e;
  },
  status = "",
}) => {
  const { dataListProductType, dataListProductClass, dataListServiceType } =
    useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getListProductType());
    dispatch(getListProductClass());
    dispatch(getListServiceType());
  }, [dispatch]);

  const handleDisableEndDate = (current) => {
    if (productObj.startDate !== null) {
      return type === "create"
        ? moment(productObj.startDate) >= current
        : moment(productObj.startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const disabledDate = (current) => {
    return false;
  };
  
  return (
    <div className="grid grid-cols-3 w-full gap-3">
      <Form.Item
        name={"productName"}
        rules={[{ message: requiredMessage("Product Name"), required: true }]}
        className={"w-full no-margin-form"}
        getValueFromEvent={(e) => handleProductObj(e, "productName")}
        label={"Product Name"}
        required
      >
        <InputComponent
          type="text"
          maxLength={100}
          disabled={type === "update" && status === "ACTIVE"}
        />
      </Form.Item>
      <Form.Item
        name={"productType"}
        rules={[{ message: requiredMessage("Product Type"), required: true }]}
        className="no-margin-form w-full"
        getValueFromEvent={(e) => handleProductObj(e, "productType")}
        label={"Product Type"}
        required
      >
        <SelectComponent disabled={type === "update" && status === "ACTIVE"}>
          {(dataListProductType || []).map((data, index) => (
            <Select.Option key={index} value={data.value}>
              {data.label}
            </Select.Option>
          ))}
        </SelectComponent>
      </Form.Item>
      <Form.Item
        name={"productClass"}
        rules={[{ message: requiredMessage("Product Class"), required: true }]}
        className="no-margin-form w-full"
        getValueFromEvent={(e) => handleProductObj(e, "productClass")}
        label={"Product Class"}
        required
      >
        <SelectComponent disabled={type === "update" && status === "ACTIVE"}>
          {(dataListProductClass || []).map((data, index) => (
            <Select.Option key={index} value={data.value}>
              {data.label}
            </Select.Option>
          ))}
        </SelectComponent>
      </Form.Item>
      <Form.Item
        name={"serviceType"}
        className="no-margin-form w-full"
        getValueFromEvent={(e) => handleProductObj(e, "serviceType")}
        label={"Service Type"}
        required
      >
        <SelectComponent disabled={type === "update" && status === "ACTIVE"}>
          {(dataListServiceType || []).map((data, index) => (
            <Select.Option key={index} value={data.value}>
              {data.label}
            </Select.Option>
          ))}
        </SelectComponent>
      </Form.Item>
      <Form.Item
        name={"startDate"}
        rules={[{ message: requiredMessage("Start Date"), required: true }]}
        className="no-margin-form"
        getValueFromEvent={(e) => handleProductObj(e, "startDate")}
        label={"Start Date"}
        required
      >
        <DateComponent dateDisable={disabledDate} />
      </Form.Item>
      <Form.Item
        name={"endDate"}
        className="no-margin-form"
        rules={[
          {
            validator: (_, value) =>
              (value &&
                ((type === "create" &&
                  moment(productObj.startDate) < moment(value)) ||
                  (type === "update" &&
                    moment(productObj.startDate) <= moment(value)))) ||
              !value
                ? Promise.resolve()
                : Promise.reject(new Error("End date must before Start date")),
          },
        ]}
        getValueFromEvent={(e) => handleProductObj(e, "endDate")}
        label={"End Date"}
      >
        <DateComponent
          dateDisable={handleDisableEndDate}
          disabled={productObj.startDate === null}
        />
      </Form.Item>
      <div className="col-span-3">
        <Form.Item
          name={"productDescription"}
          className="w-full"
          getValueFromEvent={(e) => handleProductObj(e, "productDescription")}
          label={"Description"}
        >
          <InputComponent type="textarea" value={productObj.description} />
        </Form.Item>
      </div>
    </div>
  );
};

export default ProductSectionForm;
