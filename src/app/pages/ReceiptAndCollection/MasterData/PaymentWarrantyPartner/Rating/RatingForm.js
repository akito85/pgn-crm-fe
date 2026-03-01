import React from "react";
import { Form, Select } from "antd";
import DateComponent from "../../../../../../components/DateComponent";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import { MIN_EQUITY, MIN_RBC } from "../../../../../../constants/warrantyPartner";

const RatingForm = ({ form, dataListRating = [], dataListCriteria = [], disabled = false }) => {
  const disabledEndDate = (current) => {
    const startDate = form?.getFieldValue("startDate");
    if (!startDate) {
      return false;
    }
    return current && current < startDate.startOf("day");
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      <Form.Item name="rating" label="Rating" rules={!disabled ? [{ required: true, message: "Required" }] : []}>
        <SelectComponent placeholder="Select" disabled={disabled}>
          {(dataListRating || []).map((item, index) => {
            const valId = item.name;
            const valName = item.name;
            return (
              <Select.Option key={valId} value={valId}>
                {valName}
              </Select.Option>
            );
          })}
        </SelectComponent>
      </Form.Item>
      
      <Form.Item name="criteria" label="Criteria" rules={!disabled ? [{ required: true, message: "Required" }] : []}>
        <SelectComponent placeholder="Select" disabled={disabled}>
          {(dataListCriteria || []).map((item, index) => {
            const valId = item.name;
            const valName = item.name;
            return (
              <Select.Option key={valId} value={valId}>
                {valName}
              </Select.Option>
            );
          })}
        </SelectComponent>
      </Form.Item>

      <Form.Item name="ratingDate" label="Rating date" rules={!disabled ? [{ required: true, message: "Required" }] : []}>
        <DateComponent placeholder="Select Date" disabled={disabled} />
      </Form.Item>

      <Form.Item name="startDate" label="Start date" rules={!disabled ? [{ required: true, message: "Required" }] : []}>
        <DateComponent placeholder="Select Date" disabled={disabled} />
      </Form.Item>

      <Form.Item name="endDate" label="End date">
        <DateComponent placeholder="Select Date" disabled={disabled} dateDisable={disabledEndDate} />
      </Form.Item>

      <Form.Item name="ratingIssuer" label="Rating Issuer" rules={!disabled ? [{ required: true, message: "Required" }] : []}>
        <InputComponent placeholder="Input.." disabled={disabled} />
      </Form.Item>

      <Form.Item 
        name="rbc" 
        label="RBC min 120%" 
        rules={!disabled ? [
          { required: true, message: "Required" },
          { validator: (_, value) => {
              if (value !== undefined && value !== null && value < MIN_RBC) {
                return Promise.reject(new Error(`Minimum ${MIN_RBC}`));
              }
              return Promise.resolve();
            }
          }
        ] : []}
        getValueFromEvent={(values) => values ? values.floatValue : null}
      >
        <InputComponent type="numeric" thousandSeparator="." decimalSeparator="," suffix=" %" allowNegative={false} placeholder="Input.." disabled={disabled} />
      </Form.Item>

      <Form.Item 
        name="equity" 
        label="Equity At Least Rp200M" 
        rules={!disabled ? [
          { required: true, message: "Required" },
          { validator: (_, value) => {
              if (value !== undefined && value !== null && value < MIN_EQUITY) {
                return Promise.reject(new Error(`At least Rp ${MIN_EQUITY.toLocaleString('id-ID')}`));
              }
              return Promise.resolve();
            }
          }
        ] : []}
        getValueFromEvent={(values) => values ? values.floatValue : null}
      >
        <InputComponent type="numeric" thousandSeparator="." decimalSeparator="," prefix="Rp " allowNegative={false} placeholder="Input.." disabled={disabled} />
      </Form.Item>

      <Form.Item 
        name="collateralValueAsset" 
        label="10X Collateral Value Asset" 
        rules={!disabled ? [{ required: true, message: "Required" }] : []}
        getValueFromEvent={(values) => values ? values.floatValue : null}
      >
        <InputComponent type="numeric" thousandSeparator="." decimalSeparator="," prefix="Rp " allowNegative={false} placeholder="Input.." disabled={disabled} />
      </Form.Item>

      {/* Spacer to align Description correctly */}
      <div className="col-span-1"></div>

      <div className="col-span-5">
        <Form.Item name="description" label="Description" rules={!disabled ? [{ required: true, message: "Required" }] : []}>
          <InputComponent type="textarea" placeholder="Input.." disabled={disabled} />
        </Form.Item>
      </div>
    </div>
  );
};

export default RatingForm;
