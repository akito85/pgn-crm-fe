import React, { useEffect, useRef } from "react";
import { Fragment } from "react";
import InputComponent from "../../../../../../components/InputComponent";
import { Checkbox, Form, Select } from "antd";
import { requiredMessage } from "../../../../../../utils";
import DateComponent from "../../../../../../components/DateComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import PDIProductDetail from "../../../../ProductAndPromo/Product/ProductDetail/SectionProductDetail/PDIProductDetail";

const DistributionMediaCreate = ({
  data = [],
  optionsProduct = [],
  handleProduct = () => {},
}) => {

  const handleBackDate = (current) => {
    return false;
  }

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"PRODUCT INFORMATION"}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Form.Item
          name={"productName"}
          label={"Product Name"}
          rules={[{ message: requiredMessage("Product Name"), required: true }]}
        >
          <SelectComponent
            mandatory
            onChange={(e) => handleProduct(e)}
          >
            {optionsProduct?.map((data) => (
              <Select.Option
                key={data.productId}
                value={data.productId}
              >
                {data.productName}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"priceCode"}
          label={"Price Code"}
          className="no-margin-form"
        >
          <InputComponent
            disabled
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <div className="col-span-3">
          <Form.Item
            name={"productDescription"}
            label={"Product Description"}
            className="no-margin-form"
          >
            <InputComponent
              disabled
              type="textarea"
              // onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </div>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"PRODUCT DETAIL"}
      </div>

      <PDIProductDetail data={data} />

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"DISTRIBUTION MEDIA INFORMATION"}
      </div>

      <div className="w-full flex flex-col gap-3">
        {/* last line */}
        <Form.Item
          name={"startDate"}
          label="Start Date"
          rules={[{ message: requiredMessage("Start Date"), required: true }]}
          className="no-margin-form"
        >
          <DateComponent
            mandatory
            dateDisable={handleBackDate}
            // disabled={startDate === null}
          />
        </Form.Item>

        <Form.Item
          name={"remark"}
          label={"Remark"}
        >
          <InputComponent
            type="textarea"
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>
    </Fragment>
  );
};

export default DistributionMediaCreate;
