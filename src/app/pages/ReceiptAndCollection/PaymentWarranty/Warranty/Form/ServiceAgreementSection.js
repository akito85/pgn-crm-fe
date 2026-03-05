import React from "react";
import { Form, Row, Col, Select } from "antd";
import CardContainer from "../../../../../../components/CardContainer";
import InputComponent from "../../../../../../components/InputComponent";

const ServiceAgreementSection = () => {
  return (
    <CardContainer header="SERVICE AGREEMENT">
      <Row gutter={[16, 16]}>
        <Col span={6}><Form.Item name="saNumber" label="Service Agreement Number" rules={[{ required: true }]}><Select placeholder="Select SA Number" /></Form.Item></Col>
        <Col span={6}><Form.Item name="saReference" label="Service Agreement Reference"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="saType" label="Service Type"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="type" label="Type"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        
        <Col span={6}><Form.Item name="pbgType" label="PBG Type"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="saDate" label="Service Agreement Date"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="saStartDate" label="Start Date"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="saEndDate" label="End Date"><InputComponent disabled placeholder="-" /></Form.Item></Col>

        <Col span={6}><Form.Item name="commitmentDate" label="Commitment Date"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="saStatusApproval" label="Status Approval"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        <Col span={6}><Form.Item name="saStatus" label="Status"><InputComponent disabled placeholder="-" /></Form.Item></Col>

        <Col span={24}><Form.Item name="saDescription" label="Description"><InputComponent type="textarea" rows={3} disabled placeholder="-" /></Form.Item></Col>
      </Row>
    </CardContainer>
  );
};

export default ServiceAgreementSection;
