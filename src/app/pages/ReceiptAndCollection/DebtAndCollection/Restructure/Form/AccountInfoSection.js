import React from "react";
import { Form, Row, Col, Select } from "antd";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import InputComponent from "../../../../../../components/InputComponent";
import SubSectionCard from "../../../../../../components/SubSectionCard";

const AccountInfoSection = ({ form, dataAccNumber, handleAccountChange, disabled }) => {
  return (
    <CardContainerNoBorder header="ACCOUNT INFORMATION" collapsible={true}>
      <SubSectionCard>
        <Row gutter={[16, 16]}>
          <Col style={{ width: "20%" }}>
              <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]} className="flex-1 mb-0">
                <Select
                  placeholder="Select Account Number"
                  onChange={handleAccountChange}
                  showSearch
                  optionFilterProp="children"
                  options={dataAccNumber?.data?.map((item) => ({ label: item.name, value: item.id })) || []}
                  disabled={disabled}
                />
              </Form.Item>
          </Col>
          <Col style={{ width: "20%" }}><Form.Item name="accountName" label="Account Name"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="customerNumber" label="Customer Number"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="customerName" label="Customer Name"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="accountGroupType" label="Account Group Type"><InputComponent disabled placeholder="-" /></Form.Item></Col>

          <Col style={{ width: "20%" }}><Form.Item name="sor" label="SOR"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="costCenter" label="Cost Center"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="accountSegment" label="Account Segment"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="meterReadingCode" label="Meter Reading Code"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="accountType" label="Account Type"><InputComponent disabled placeholder="-" /></Form.Item></Col>

          <Col style={{ width: "20%" }}><Form.Item name="classificationType" label="Classification Type"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="sapCustId" label="SAP CUST ID"><InputComponent disabled placeholder="-" /></Form.Item></Col>
          <Col style={{ width: "20%" }}><Form.Item name="accountStatus" label="Account Status"><InputComponent disabled placeholder="-" /></Form.Item></Col>
        </Row>
      </SubSectionCard>
    </CardContainerNoBorder>
  );
};

export default AccountInfoSection;
