import React from "react";
import PropTypes from 'prop-types';
import { Form, Row, Col, Select } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import DateComponent from "../../../../../../components/DateComponent";
import { useSelector, useDispatch } from "react-redux";
import { MUTATION_TYPES, MUTATION_SOURCES, WARRANTY_TYPES } from "../../../../../../constants/warranty";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import { getMutationCategoryOptions } from "../../../../../../redux/slices/receipt_collection/warranty";

const { Option } = Select;

const MutationForm = ({ disabled, currencyDDL, warrantyType, headerCurrency }) => {
  const dispatch = useDispatch();
  const form = Form.useFormInstance();
  const mutationType = Form.useWatch("type", form);
  const { dataMutationCategoryOptions, loadingMutationCategory } = useSelector((state) => state.warranty);

  React.useEffect(() => {
    if (mutationType) {
      dispatch(getMutationCategoryOptions(mutationType));
    }
  }, [mutationType, dispatch]);

  return (
    <SubSectionCard>
      <Row gutter={[16, 16]}>
        {/* Row 1: 5 items */}
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="source" 
            label="Source" 
            rules={[{ required: true }]}
          >
            <SelectComponent 
              placeholder="Select Source" 
              disabled={disabled} 
              options={MUTATION_SOURCES} 
            />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="mutationNumber" 
            label="Mutation Number" 
            rules={[{ required: true }]}
          >
            <InputComponent placeholder="Input" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="type" 
            label="Type" 
            rules={[{ required: true }]}
          >
            <SelectComponent 
              placeholder="Select type" 
              disabled={disabled} 
              options={MUTATION_TYPES} 
              onChange={() => form.setFieldsValue({ category: undefined })}
            />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="category" 
            label="Category" 
            rules={[{ required: true }]}
          >
            <SelectComponent 
              placeholder="Select Category" 
              disabled={disabled || !mutationType} 
              loading={loadingMutationCategory}
              options={dataMutationCategoryOptions
                ?.filter(item => {
                  if (!mutationType) return true;
                  const searchText = mutationType.toUpperCase();
                  const nameMatch = item.name?.toUpperCase().includes(searchText);
                  const descMatch = item.desc?.toUpperCase().includes(searchText);
                  return nameMatch || descMatch;
                })
                .map(item => ({
                  name: item.name,
                  value: item.name 
                })) || []} 
            />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="date" 
            label="Date" 
            rules={[{ required: true }]}
          >
            <DateComponent placeholder="Select Type" disabled={disabled} className="w-full" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>

        {/* Row 2: 4 items (using 20% each to align with Row 1) */}
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
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
            getValueFromEvent={(val) => val.floatValue}
          >
            <InputComponent 
              placeholder="Input.." 
              disabled={disabled} 
              type="numeric"
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
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
          >
            <Select placeholder="Select Converted Currency" disabled={disabled}>
              {currencyDDL?.data
                ?.filter(item => item.name !== headerCurrency)
                ?.map((item) => (
                  <Option key={item.id} value={item.name}>{item.name}</Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="rate" 
            label="Rate" 
            rules={[{ required: warrantyType === WARRANTY_TYPES.CASH }]}
            getValueFromEvent={(val) => val.floatValue}
          >
            <InputComponent 
              placeholder="Input.." 
              disabled={disabled || warrantyType !== WARRANTY_TYPES.CASH} 
              type="numeric"
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="eqvAmount" 
            label="EQV Amount" 
            rules={[{ required: true }]}
            getValueFromEvent={(val) => val.floatValue}
          >
            <InputComponent 
              placeholder="Input.." 
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
          >
            <InputComponent type="textarea" rows={3} placeholder="Input.." disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>
    </SubSectionCard>
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
