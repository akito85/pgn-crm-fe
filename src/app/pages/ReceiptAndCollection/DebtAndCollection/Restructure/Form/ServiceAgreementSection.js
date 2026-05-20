import React from "react";
import { Form, Row, Col } from "antd";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import SubSectionCard from "../../../../../../components/SubSectionCard";

const ServiceAgreementSection = ({ form, disabled }) => {
  return (
    <CardContainerNoBorder header="SERVICE AGREEMENT INFORMATION" collapsible={true}>
      <SubSectionCard>
        <Row gutter={[16, 16]}>
          <Col style={{ width: "20%" }}><Form.Item name="saNumber" label="Service Agreement Number"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="saName" label="Service Agreement Name"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="saDate" label="Service Agreement Date"><DateComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="startDate" label="Start Date"><DateComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="endDate" label="End Date"><DateComponent disabled placeholder="-" /></Form.Item></Col>

          <Col style={{ width: "20%" }}><Form.Item name="minContract" label="Minimum Contract"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="maxContract" label="Maximum Contract"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="uom" label="UOM"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        </Row>
      </SubSectionCard>
    </CardContainerNoBorder>
  );
};

export default ServiceAgreementSection;
