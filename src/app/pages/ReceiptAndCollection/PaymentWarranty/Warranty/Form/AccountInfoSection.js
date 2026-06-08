import React from "react";
import { Form, Row, Col, Select } from "antd";
import CardContainer from "../../../../../../components/CardContainer";
import InputComponent from "../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";

const AccountInfoSection = ({ form, dataAccNumber, handleAccountChange, disabled }) => {
  const navigate = useNavigate();
  const accountId = Form.useWatch("accountId", form);

  const handleViewAccount = () => {
    if (accountId) {
      navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD, { 
        state: { id: accountId, activeKey: "warranty-list" } 
      }); 
    }
  };
  return (
    <CardContainer header="ACCOUNT INFORMATION">
      <Row gutter={[16, 16]}>
        <Col span={6}>
            <Form.Item name="accountId" label="Account Number" rules={[{ required: true }]} className="flex-1 mb-0">
              <Select
                placeholder="Select Account"
                onChange={handleAccountChange}
                showSearch
                optionFilterProp="label"
                options={dataAccNumber?.data?.map((item) => ({ label: item.name, value: item.id })) || []}
                disabled={disabled}
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
