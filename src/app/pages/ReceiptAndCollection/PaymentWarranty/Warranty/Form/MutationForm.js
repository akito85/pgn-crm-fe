import React from "react";
import { Form, Row, Col, Select } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../components/SelectComponent";
import DateComponent from "../../../../../../components/DateComponent";

const MutationForm = ({ disabled }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Form.Item name="source" label="Source" rules={[{ required: true }]}>
          <SelectComponent placeholder="Select Source" disabled={disabled} options={[]} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="mutationNumber" label="Mutation Number" rules={[{ required: true }]}>
          <InputComponent placeholder="Mutation Number" disabled={disabled} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <SelectComponent placeholder="Select Type" disabled={disabled} options={[]} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <SelectComponent placeholder="Select Category" disabled={disabled} options={[]} />
        </Form.Item>
      </Col>
      
      <Col span={6}>
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DateComponent placeholder="Select Date" disabled={disabled} className="w-full" style={{ borderRadius: '8px' }} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
          <InputComponent placeholder="Amount" disabled={disabled} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="convertedCurrency" label="Converted Currency" rules={[{ required: true }]}>
          <SelectComponent placeholder="Select Currency" disabled={disabled} options={[]} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="rate" label="Rate" rules={[{ required: true }]}>
          <InputComponent placeholder="Rate" disabled={disabled} />
        </Form.Item>
      </Col>

      <Col span={6}>
        <Form.Item name="eqvAmount" label="EQV Amount" rules={[{ required: true }]}>
          <InputComponent placeholder="EQV Amount" disabled={disabled} />
        </Form.Item>
      </Col>
      
      <Col span={24}>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <InputComponent type="textarea" rows={3} placeholder="Description" disabled={disabled} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default MutationForm;
