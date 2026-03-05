import React from "react";
import { Form, Row, Col, Select } from "antd";
import CardContainer from "../../../../../../components/CardContainer";
import InputComponent from "../../../../../../components/InputComponent";

const AccountInfoSection = ({ dataAccNumber, handleAccountChange }) => {
  return (
    <CardContainer header="ACCOUNT INFORMATION">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name="accountId" label="Account Number" rules={[{ required: true }]}>
            <Select
              placeholder="Select Account"
              onChange={handleAccountChange}
              showSearch
              optionFilterProp="children"
              options={dataAccNumber?.data?.map((item) => ({ label: item.name, value: item.id })) || []}
            />
          </Form.Item>
        </Col>
        <Col span={6}><Form.Item name="accountName" label="Account Name"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="customerNumber" label="Customer Number"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="customerName" label="Customer Name"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        
        <Col span={6}><Form.Item name="costCenter" label="Cost Center"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="customerSegment" label="Customer Segment"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="customerGroup" label="Customer Group"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="accountType" label="Account Type"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        
        <Col span={6}><Form.Item name="classificationType" label="Classification Type"><InputComponent disabled placeholder="-" /></Form.Item></Col>
      </Row>
    </CardContainer>
  );
};

export default AccountInfoSection;
