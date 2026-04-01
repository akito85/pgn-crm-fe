import React, { useEffect } from "react";
import { Form, Row, Col, Select } from "antd";
import moment from "moment";
import CardContainer from "../../../../../../components/CardContainer";
import InputComponent from "../../../../../../components/InputComponent";

const { Option } = Select;

const ServiceAgreementSection = ({ form, dataServiceAgreement, disabled }) => {
  const saNumber = Form.useWatch("saNumber", form);

  const handleUpdateSAFields = (val) => {
    if (dataServiceAgreement?.result) {
      const selectedSA = dataServiceAgreement.result.find(sa => sa.saNumber === val);
      if (selectedSA) {
        form.setFieldsValue({
          saReference: selectedSA.saReference || "-",
          saType: selectedSA.serviceType?.value || selectedSA.serviceType || "-",
          type: selectedSA.saType?.value || selectedSA.saType || "-",
          pbgType: selectedSA.pjbgType?.value || selectedSA.pjbgType || "-",
          saDate: selectedSA.saDate ? moment(selectedSA.saDate).format("DD/MM/YYYY") : "-",
          saStartDate: selectedSA.startDate ? moment(selectedSA.startDate).format("DD/MM/YYYY") : "-",
          saEndDate: selectedSA.endDate ? moment(selectedSA.endDate).format("DD/MM/YYYY") : "-",
          commitmentDate: selectedSA.commitmentDate ? moment(selectedSA.commitmentDate).format("DD/MM/YYYY") : "-",
          saStatusApproval: selectedSA.approvalStatus || "-",
          saStatus: selectedSA.status || "-",
          saDescription: selectedSA.description || "-",
        });
      } else if (!val) {
        form.setFieldsValue({
          saReference: "-", saType: "-", type: "-", pbgType: "-",
          saDate: "-", saStartDate: "-", saEndDate: "-", commitmentDate: "-",
          saStatusApproval: "-", saStatus: "-", saDescription: "-"
        });
      }
    }
  };

  useEffect(() => {
    handleUpdateSAFields(saNumber);
  }, [saNumber, dataServiceAgreement]);

  return (
    <CardContainer header="SERVICE AGREEMENT">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name="saNumber" label="Service Agreement Number" rules={[{ required: true }]}>
            <Select 
              disabled={disabled} 
              placeholder="Select SA Number"
              onChange={handleUpdateSAFields}
            >
              {dataServiceAgreement?.result?.map((item) => (
                <Option key={item.id} value={item.saNumber}>{item.saNumber}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
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
