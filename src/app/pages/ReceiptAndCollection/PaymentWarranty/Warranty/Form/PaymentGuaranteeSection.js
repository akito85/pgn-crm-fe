import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Form, Row, Col, Select, DatePicker, Input } from "antd";
import CardContainer from "../../../../../../components/CardContainer";
import InputComponent from "../../../../../../components/InputComponent";
import { WARRANTY_TYPES } from "../../../../../../constants/warranty";

const { Option } = Select;

const PaymentGuaranteeSection = ({
  form,
  dispatch,
  dataPaymentWarrantyPartner,
  dataPaymentWarrantyPartnerBranch,
  currencyDDL,
  rateTypeDDL,
  getPaymentWarrantyPartnerBranchList,
  isPartialEdit
}) => {
  const { dataWarrantyTypeOptions } = useSelector((state) => state.warranty);

  return (
    <CardContainer header="PAYMENT GUARANTEE INFORMATION">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item 
            name="warrantyType" 
            label="Type" 
            rules={[{ required: true }]}
            // API: warrantyType
          >
            <Select 
              placeholder="Select Type"
              disabled={isPartialEdit}
              onChange={(val) => {
                if (val !== WARRANTY_TYPES.CASH) {
                  form.setFieldsValue({ rateType: null, rateDate: null, rateAmount: null });
                }
              }}
            >
              {(dataWarrantyTypeOptions || []).map((item) => (
                <Option key={item.id} value={item.name}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item 
            name="documentNumber" 
            label="Document Number" 
            rules={[{ required: true }]}
            // API: documentNumber
          >
            <InputComponent disabled={isPartialEdit} placeholder="Document Number" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item 
            name="documentDate" 
            label="Document Date" 
            rules={[{ required: true }]}
            // API: documentDate
          >
            <DatePicker disabled={isPartialEdit} placeholder="Select Document Date" className="w-full" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="issuerBank" label="Issuer" rules={[{ required: true }]}>
            <Select disabled={isPartialEdit} placeholder="Select Issuer" onChange={(value) => { dispatch(getPaymentWarrantyPartnerBranchList(value)); form.setFieldsValue({ issuerBranch: null }); }}>
              {(dataPaymentWarrantyPartner?.data || dataPaymentWarrantyPartner || []).map((item) => (<Option key={item.id} value={item.id}>{item.partnerGuaranteeIssuer}</Option>))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="issuerBranch" label="Issuer Branch" rules={[{ required: true }]}>
            <Select disabled={isPartialEdit} placeholder="Select Issuer Branch">
              {(dataPaymentWarrantyPartnerBranch?.data || dataPaymentWarrantyPartnerBranch || []).map((item) => (<Option key={item.id} value={item.id}>{item.branchName}</Option>))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item 
            name="currency" 
            label="Currency" 
            rules={[{ required: true }]}
            // API: currency
          >
            <Select disabled={isPartialEdit} placeholder="Select Currency">
              {currencyDDL?.data?.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>))}
            </Select>
          </Form.Item>
        </Col>
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.warrantyType !== currentValues.warrantyType}>
          {({ getFieldValue }) => {
            const isCash = getFieldValue('warrantyType') === WARRANTY_TYPES.CASH;
            return isCash ? (
              <>
                <Col span={6}>
                  <Form.Item 
                    name="rateType" 
                    label="Rate Type" 
                    rules={[{ required: true }]}
                    // API: rateType
                  >
                    <Select disabled={isPartialEdit} placeholder="Select Rate Type">
                      {rateTypeDDL?.data?.map((item) => (<Option key={item.id} value={item.id}>{`${item.name} - ${item.description}`}</Option>))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item 
                    name="rateDate" 
                    label="Rate Date" 
                    rules={[{ required: true }]}
                    // API: rateDate
                  >
                    <DatePicker disabled={isPartialEdit} placeholder="Select Rate Date" className="w-full" style={{ borderRadius: '8px' }} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item 
                    name="rateAmount" 
                    label="Rate"
                    getValueFromEvent={(val) => val.floatValue}
                  >
                    <InputComponent 
                      disabled={isPartialEdit}
                      placeholder="Rate Amount" 
                      type="numeric"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : null;
          }}
        </Form.Item>
        <Col span={6}>
          <Form.Item 
            name="effStartDate" 
            label="Eff Start Date" 
            rules={[{ required: true }]}
            // API: effectiveStartDate
          >
            <DatePicker disabled={isPartialEdit} placeholder="Select Eff Start Date" className="w-full" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.warrantyType !== currentValues.warrantyType || prevValues.effStartDate !== currentValues.effStartDate}>
            {({ getFieldValue }) => {
              const type = getFieldValue('warrantyType');
              const effStartDate = getFieldValue('effStartDate');
              const isCash = type === WARRANTY_TYPES.CASH;
              return (
                <Form.Item 
                  name="effEndDate" 
                  label="Eff End Date" 
                  rules={[{ required: !isCash }]}
                  // API: effectiveEndDate
                >
                  <DatePicker 
                    placeholder="Select Eff End Date" 
                    className="w-full" 
                    style={{ borderRadius: '8px' }} 
                    disabledDate={(current) => {
                      return current && effStartDate && current.isBefore(moment(effStartDate).startOf('day'));
                    }}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Term Of Claim Period" style={{ marginBottom: 0 }}>
            <Input.Group compact className="flex gap-2">
              <Form.Item 
                name="claimPeriodTermType" 
                style={{ width: '40%', marginBottom: 0 }}
                // API: claimPeriodTermType
              >
                <Select disabled={isPartialEdit} placeholder="Type" defaultValue="Date">
                  <Option value="Date">Date</Option>
                  <Option value="Days">Days</Option>
                </Select>
              </Form.Item>
              <Form.Item 
                name="claimPeriodTermValue" 
                style={{ width: '60%', marginBottom: 0 }}
                // API: claimPeriodTermValue
              >
                <Input 
                  disabled={isPartialEdit} 
                  maxLength={2} 
                  placeholder="Value" 
                  onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} 
                  className="w-full" 
                  style={{ borderRadius: '8px', padding: '8px 12px' }} 
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true }]}
            // API: description
          >
            <InputComponent type="textarea" rows={4} placeholder="Description" />
          </Form.Item>
        </Col>
      </Row>
    </CardContainer>
  );
};

export default PaymentGuaranteeSection;
