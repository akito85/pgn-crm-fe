import React, { useRef } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Form, Row, Col, Select, DatePicker, Input, message } from "antd";
import CardContainer from "../../../../../../components/CardContainer";
import InputComponent from "../../../../../../components/InputComponent";
import { WARRANTY_TYPES, CLAIM_PERIOD_TERM_TYPES, CLAIM_PERIOD_TERM_OPTIONS } from "../../../../../../constants/warranty";

const { Option } = Select;

const PaymentGuaranteeSection = ({
  form,
  dispatch,
  dataPaymentWarrantyPartner,
  dataPaymentWarrantyPartnerBranch,
  currencyDDL,
  rateTypeDDL,
  getPaymentWarrantyPartnerBranchList,
  isPartialEdit,
  hasMutations,
}) => {
  const { dataWarrantyTypeOptions, loadingPaymentWarrantyPartnerBranch } = useSelector((state) => state.warranty);
  const prevCurrencyRef = useRef(null);
  const prevRateTypeRef = useRef(null);
  const prevRateDateRef = useRef(null);

  const guardChange = (fieldName, prevRef) => {
    if (hasMutations) {
      message.warning("Please clear mutation first");
      form.setFieldsValue({ [fieldName]: prevRef.current });
      return true;
    }
    return false;
  };

  return (
    <CardContainer header="PAYMENT GUARANTEE INFORMATION">
      <Row gutter={[16, 16]}>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
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

        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="documentNumber" 
            label="Document Number" 
            rules={[{ required: true }]}
            // API: documentNumber
          >
            <InputComponent disabled={isPartialEdit} placeholder="Document Number" />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="documentDate" 
            label="Document Date" 
            rules={[{ required: true }]}
            // API: documentDate
          >
            <DatePicker disabled={isPartialEdit} placeholder="Select Document Date" className="w-full" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item name="issuerBank" label="Issuer" rules={[{ required: true }]}>
            <Select disabled={isPartialEdit} placeholder="Select Issuer" onChange={(value) => { dispatch(getPaymentWarrantyPartnerBranchList(value)); form.setFieldsValue({ issuerBranch: null }); }}>
              {(Array.isArray(dataPaymentWarrantyPartner) ? dataPaymentWarrantyPartner : (dataPaymentWarrantyPartner?.data || [])).map((item) => (
                <Option key={item.id} value={item.id}>{item.partnerGuaranteeIssuer}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item name="issuerBranch" label="Issuer Branch" rules={[{ required: true }]}>
            <Select 
              disabled={isPartialEdit} 
              placeholder="Select Issuer Branch"
              loading={loadingPaymentWarrantyPartnerBranch}
            >
              {(Array.isArray(dataPaymentWarrantyPartnerBranch) ? dataPaymentWarrantyPartnerBranch : (dataPaymentWarrantyPartnerBranch?.data || [])).map((item) => (
                <Option key={item.id} value={item.id}>{item.branchName}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
          <Form.Item 
            name="currency" 
            label="Currency" 
            rules={[{ required: true }]}
            // API: currency
          >
            <Select
              disabled={isPartialEdit}
              placeholder="Select Currency"
              onFocus={() => { prevCurrencyRef.current = form.getFieldValue('currency'); }}
              onChange={() => {
                prevCurrencyRef.current = prevCurrencyRef.current ?? form.getFieldValue('currency');
                guardChange('currency', prevCurrencyRef);
                prevCurrencyRef.current = null;
              }}
            >
              {currencyDDL?.data?.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>))}
            </Select>
          </Form.Item>
        </Col>
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.warrantyType !== currentValues.warrantyType}>
          {({ getFieldValue }) => {
            const isCash = getFieldValue('warrantyType') === WARRANTY_TYPES.CASH;
            return isCash ? (
              <>
                <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
                  <Form.Item 
                    name="rateType" 
                    label="Rate Type" 
                    rules={[{ required: true }]}
                    // API: rateType
                  >
                    <Select
                      placeholder="Select Rate Type"
                      allowClear
                      disabled={isPartialEdit}
                      onFocus={() => { prevRateTypeRef.current = form.getFieldValue('rateType'); }}
                      onChange={() => {
                        prevRateTypeRef.current = prevRateTypeRef.current ?? form.getFieldValue('rateType');
                        guardChange('rateType', prevRateTypeRef);
                        prevRateTypeRef.current = null;
                      }}
                    >
                      {rateTypeDDL?.data?.filter(item => item.name || item.description).map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name ? `${item.name}${item.description ? ` - ${item.description}` : ''}` : item.description}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col flex="0 0 20%" style={{ maxWidth: '20%' }}>
                  <Form.Item 
                    name="rateDate" 
                    label="Rate Date" 
                    rules={[{ required: true }]}
                    // API: rateDate
                  >
                    <DatePicker
                      placeholder="Select Rate Date"
                      className="w-full"
                      style={{ borderRadius: '8px' }}
                      disabled={isPartialEdit}
                      onFocus={() => { prevRateDateRef.current = form.getFieldValue('rateDate'); }}
                      onChange={(_val, _str) => {
                        prevRateDateRef.current = prevRateDateRef.current ?? form.getFieldValue('rateDate');
                        guardChange('rateDate', prevRateDateRef);
                        prevRateDateRef.current = null;
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col flex="0 0 20%" style={{ maxWidth: "20%" }}>
                  <Form.Item 
                    name="rateAmount" 
                    label="Rate"
                    getValueFromEvent={(val) => val.floatValue}
                    rules={[{ required: false }]}
                  >
                    <InputComponent 
                      disabled={true}
                      placeholder="Rate Amount" 
                      type="numeric"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={8}
                      fixedDecimalScale={false}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : null;
          }}
        </Form.Item>
        <Col flex="0 0 20%" style={{ maxWidth: "20%" }}>
          <Form.Item 
            name="effStartDate" 
            label="Eff Start Date" 
            rules={[{ required: true }]}
            // API: effectiveStartDate
          >
            <DatePicker disabled={isPartialEdit} placeholder="Select Eff Start Date" className="w-full" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col flex="0 0 20%" style={{ maxWidth: "20%" }}>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.effStartDate !== currentValues.effStartDate}>
            {({ getFieldValue }) => {
              const effStartDate = getFieldValue('effStartDate');
              return (
                <Form.Item 
                  name="effEndDate" 
                  label="Eff End Date" 
                  rules={[
                    { required: true, message: 'End Date is required' },
                    {
                      validator: (_, value) => {
                        if (value && value.isAfter(moment().add(10, 'years'))) {
                          return Promise.reject(new Error('End Date cannot exceed 10 years from today'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                  // API: effectiveEndDate
                >
                  <DatePicker 
                    placeholder="Select Eff End Date" 
                    className="w-full" 
                    style={{ borderRadius: '8px' }} 
                    disabled={false}
                    disabledDate={(current) => {
                      const today = moment().startOf('day');
                      const maxDate = moment().add(10, 'years').endOf('year');
                      return (
                        current && (
                          (effStartDate && current.isBefore(moment(effStartDate).startOf('day'))) ||
                          current.isBefore(today) ||
                          current.isAfter(maxDate)
                        )
                      );
                    }}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Col>
        
        <Col flex="0 0 30%" style={{ maxWidth: '30%' }}>
          <Form.Item label="Term Of Claim Period" required>
            <div className="flex gap-2 w-full">
              <Form.Item 
                name="claimPeriodTermType" 
                style={{ flex: '0 0 75px', marginBottom: 0 }}
                rules={[{ required: true, message: 'Required' }]}
                // API: claimPeriodTermType
              >
                <Select disabled={isPartialEdit} placeholder="Type">
                  {CLAIM_PERIOD_TERM_OPTIONS.map((opt) => (
                    <Option key={opt.value} value={opt.value}>{opt.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.claimPeriodTermType !== currentValues.claimPeriodTermType}>
                {({ getFieldValue }) => {
                  const termType = getFieldValue('claimPeriodTermType') || CLAIM_PERIOD_TERM_TYPES.DATE;
                  return (
                    <Form.Item name="claimPeriodTermValue" style={{ flex: 1, marginBottom: 0 }} rules={[{ required: true }]}>
                      <DatePicker 
                        disabled={isPartialEdit} 
                        placeholder="Select Date" 
                        className="w-full" 
                        style={{ borderRadius: '8px', minWidth: 0 }} 
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </div>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true }]}
            // API: description
          >
            <InputComponent type="textarea" rows={4} placeholder="Description" disabled={false} />
          </Form.Item>
        </Col>
      </Row>
    </CardContainer>
  );
};

export default PaymentGuaranteeSection;
