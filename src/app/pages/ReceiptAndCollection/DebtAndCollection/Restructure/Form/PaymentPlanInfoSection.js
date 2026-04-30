import React from "react";
import { Form, Row, Col, Select, Input } from "antd";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import { PAYMENT_PLAN_TYPE_OPTIONS } from "../../../../../../constants/restructure";

const { TextArea } = Input;

const PaymentPlanInfoSection = ({ form, onPlanInfoChange }) => {
  const [localPlan, setLocalPlan] = React.useState({ type: null, tenor: null, startPeriod: null });

  const handleChange = (field, value) => {
    const updated = { ...localPlan, [field]: value };
    setLocalPlan(updated);
    if (onPlanInfoChange) onPlanInfoChange(updated);
  };

  return (
    <CardContainerNoBorder header="PAYMENT PLAN INFORMATION" collapsible={true}>
      <SubSectionCard>
        <Row gutter={[16, 16]}>
          <Col style={{ width: "20%" }}>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Type"
                    options={PAYMENT_PLAN_TYPE_OPTIONS}
                    onChange={(val) => handleChange("type", val)}
                  />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="tenor" label="Tenor" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Tenor"
                    options={[{ label: "3 Months", value: 3 }, { label: "6 Months", value: 6 }, { label: "12 Months", value: 12 }, { label: "24 Months", value: 24 }]}
                    onChange={(val) => handleChange("tenor", val)}
                  />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="startPeriod" label="Start Period" rules={[{ required: true }]}>
                  <DateComponent
                    picker="month"
                    placeholder="Select Month"
                    format="MMM YYYY"
                    onChange={(val) => handleChange("startPeriod", val)}
                  />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="source" label="Source">
                  <InputComponent disabled placeholder="SAP FSCD" />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}>
              <Form.Item name="requestDate" label="Request Date">
                  <DateComponent placeholder="Select Date" />
              </Form.Item>
          </Col>

          <Col span={24}>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                  <TextArea rows={4} placeholder="Description" />
              </Form.Item>
          </Col>
        </Row>
      </SubSectionCard>
    </CardContainerNoBorder>
  );
};

export default PaymentPlanInfoSection;
