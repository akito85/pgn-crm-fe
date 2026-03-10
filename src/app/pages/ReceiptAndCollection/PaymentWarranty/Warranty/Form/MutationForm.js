import React from "react";
import PropTypes from 'prop-types';
import { Form, Row, Col, Select } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import DateComponent from "../../../../../../components/DateComponent";
import { useSelector } from "react-redux";
import { MUTATION_TYPES, MUTATION_SOURCES, WARRANTY_TYPES } from "../../../../../../constants/warranty";


const { Option } = Select;
const MutationForm = ({ disabled, currencyDDL, warrantyType, headerCurrency }) => {
  const { dataMutationCategoryOptions, loadingMutation } = useSelector((state) => state.warranty);

  return (
    <Row gutter={[16, 16]}>
      {/* Row 1: 5 items */}
      <Col style={{ width: '20%' }}>
        <Form.Item 
          name="source" 
          label="Source" 
          rules={[{ required: true }]}
          // API: source (manual mapping)
        >
          <SelectComponent 
            placeholder="Select Source" 
            disabled={disabled} 
            options={MUTATION_SOURCES} 
          />
        </Form.Item>
      </Col>
      <Col style={{ width: '20%' }}>
        <Form.Item 
          name="mutationNumber" 
          label="Mutation Number" 
          rules={[{ required: true }]}
          // API: mutationNumber
        >
          <InputComponent placeholder="Mutation Number" disabled={disabled} />
        </Form.Item>
      </Col>
      <Col style={{ width: '20%' }}>
        <Form.Item 
          name="type" 
          label="Type" 
          rules={[{ required: true }]}
          // API: transTypeId (e.g., 'IN' maps to 10)
        >
          <SelectComponent 
            placeholder="Select Type" 
            disabled={disabled} 
            options={MUTATION_TYPES} 
          />
        </Form.Item>
      </Col>
      <Col style={{ width: '20%' }}>
        <Form.Item 
          name="category" 
          label="Category" 
          rules={[{ required: true }]}
          // API: category
        >
          <SelectComponent 
            placeholder="Select Category" 
            disabled={disabled} 
            loading={loadingMutation}
            options={dataMutationCategoryOptions?.map(item => ({
              name: item.name,
              value: item.name 
            })) || []} 
          />
        </Form.Item>
      </Col>
      <Col style={{ width: '20%' }}>
        <Form.Item 
          name="date" 
          label="Date" 
          rules={[{ required: true }]}
          // API: transactionDate (formatted to ISO string)
        >
          <DateComponent placeholder="Select Date" disabled={disabled} className="w-full" style={{ borderRadius: '8px' }} />
        </Form.Item>
      </Col>

      {/* Row 2: 4 items */}
      <Col span={6}>
        <Form.Item 
          name="amount" 
          label="Amount" 
          rules={[
            { required: true, message: 'Amount is required' },
            { 
              pattern: /^\d+(\.\d{1,2})?$/,
              message: 'Amount must be a positive number with max 2 decimal places'
            },
            { 
              validator: (_, value) => {
                const floatValue = typeof value === 'object' ? value?.floatValue : value;
                if (floatValue === undefined || floatValue === null || floatValue <= 0) {
                  return Promise.reject(new Error('Amount must be greater than 0'));
                }
                if (floatValue > 999999999999) {
                  return Promise.reject(new Error('Amount exceeds maximum allowed value'));
                }
                return Promise.resolve();
              }
            }
          ]}
          // API: amount
          getValueFromEvent={(val) => val.floatValue}
        >
          <InputComponent 
            placeholder="Amount" 
            disabled={disabled} 
            type="numeric"
            thousandSeparator=","
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item 
          name="convertedCurrency" 
          label="Converted Currency" 
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const selectedCurrency = value;
                if (!value || selectedCurrency !== headerCurrency) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Converted currency must be different from warranty currency"));
              },
            }),
          ]}
          // API: convertedCurrency (maps to currency name)
        >
          <Select placeholder="Select Currency" disabled={disabled}>
            {currencyDDL?.data
              ?.filter(item => item.name !== headerCurrency)
              ?.map((item) => (
                <Option key={item.id} value={item.name}>{item.name}</Option>
              ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item 
          name="rate" 
          label="Rate" 
          rules={[{ required: warrantyType === WARRANTY_TYPES.CASH }]}
          // API: rate
          getValueFromEvent={(val) => val.floatValue}
        >
          <InputComponent 
            placeholder="Rate" 
            disabled={disabled || warrantyType !== WARRANTY_TYPES.CASH} 
            type="numeric"
            thousandSeparator=","
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item 
          name="eqvAmount" 
          label="EQV Amount" 
          rules={[{ required: true }]}
          // API: eqvAmount
          getValueFromEvent={(val) => val.floatValue}
        >
          <InputComponent 
            placeholder="EQV Amount" 
            disabled={disabled} 
            type="numeric"
            thousandSeparator=","
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </Form.Item>
      </Col>
      
      {/* Row 3: Full width */}
      <Col span={24}>
        <Form.Item 
          name="description" 
          label="Description" 
          rules={[{ required: true }]}
          // API: description
        >
          <InputComponent type="textarea" rows={3} placeholder="Description" disabled={disabled} />
        </Form.Item>
      </Col>
    </Row>
  );
};

MutationForm.propTypes = {
  disabled: PropTypes.bool,
  currencyDDL: PropTypes.shape({
    data: PropTypes.array
  }),
  warrantyType: PropTypes.string,
  headerCurrency: PropTypes.string
};

export default MutationForm;
