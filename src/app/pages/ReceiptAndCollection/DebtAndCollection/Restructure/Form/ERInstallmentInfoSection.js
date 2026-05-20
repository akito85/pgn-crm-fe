import React from "react";
import { Form, Row, Col, Select, Input } from "antd";
import SectionCard from "../../../../../../components/SectionCard";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import { PAYMENT_PLAN_TYPE_OPTIONS } from "../../../../../../constants/restructure";

const { TextArea } = Input;

const ERInstallmentInfoSection = ({ form, onPlanInfoChange }) => {
  const [localPlan, setLocalPlan] = React.useState({ type: null, tenor: null, startPeriod: null });

  const handleChange = (field, value) => {
    const updated = { ...localPlan, [field]: value };
    setLocalPlan(updated);
    if (onPlanInfoChange) onPlanInfoChange(updated);
  };

  return (
    <SectionCard title="INSTALLMENT INFORMATION">
        <Row gutter={[16, 16]}>
          <Col style={{ width: "20%" }}>
              <Form.Item name="type" label="Type">
                  <InputComponent disabled placeholder="{value}" />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="tenor" label="Tenor">
                  <InputComponent disabled placeholder="{value}" />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="startPeriod" label="Start Period">
                  <InputComponent disabled placeholder="{value}" />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="source" label="Source">
                  <InputComponent disabled placeholder="{value}" />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="requestDate" label="Request Date">
                  <InputComponent disabled placeholder="{value}" />
              </Form.Item>
          </Col>

          <Col style={{ width: "20%" }}>
              <Form.Item name="earlyRepaymentDate" label="Early Repayment Date" rules={[{ required: true }]}>
                  <DateComponent placeholder="Select Early Repayment Date" />
              </Form.Item>
          </Col>
          
          <Col span={24}>
              <Form.Item name="remark" label="Remark">
                  <TextArea rows={2} placeholder="{value}" disabled />
              </Form.Item>
          </Col>
          <Col span={24}>
              <Form.Item name="earlyRepaymentReason" label="Early Repayment Reason" rules={[{ required: true }]}>
                  <TextArea rows={2} placeholder="Input Reason" />
              </Form.Item>
          </Col>
        </Row>
    </SectionCard>
  );
};

export default ERInstallmentInfoSection;
