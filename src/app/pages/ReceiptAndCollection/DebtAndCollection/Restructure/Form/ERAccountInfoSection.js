import React from "react";
import { Row, Col } from "antd";
import SectionCard from "../../../../../../components/SectionCard";

const ERAccountInfoSection = ({ data_detail }) => {
  // Use data_detail restructure or fallback to default mock values
  const detail = data_detail?.restructure || data_detail || {};

  return (
    <SectionCard title="ACCOUNT INFORMATION">
        <Row gutter={[16, 16]}>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Customer Number</div>
            <div className="text-[14px]">{detail.customerNumber || "CUS001"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Customer Name</div>
            <div className="text-[14px]">{detail.customerName || "PLN (PERSERO), PT"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Account Number</div>
            <div className="text-[14px]">{detail.accountNumber || "130252597"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Account Name</div>
            <div className="text-[14px]">{detail.accountName || "PLN (PERSERO), PT"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Account Group Type</div>
            <div className="text-[14px]">{detail.accountGroupType || "{value}"}</div>
          </Col>

          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">SOR</div>
            <div className="text-[14px]">{detail.sor || "{value}"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Cost Center</div>
            <div className="text-[14px]">{detail.costCenter || "{value}"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Account Segment</div>
            <div className="text-[14px]">{detail.accountSegment || "{value}"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Meter Reading Code</div>
            <div className="text-[14px]">{detail.meterReadingCode || "{value}"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Account Type</div>
            <div className="text-[14px]">{detail.accountType || "{value}"}</div>
          </Col>

          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Classification Type</div>
            <div className="text-[14px]">{detail.classificationType || "{value}"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">SAP CUST ID</div>
            <div className="text-[14px]">{detail.sapCustId || "{value}"}</div>
          </Col>
          <Col style={{ width: "20%" }}>
            <div className="text-[12px] font-semibold text-gray-500">Account Status</div>
            <div className="text-[14px]">{detail.accountStatus || "{value}"}</div>
          </Col>
        </Row>
    </SectionCard>
  );
};

export default ERAccountInfoSection;
