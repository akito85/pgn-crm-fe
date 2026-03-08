import React, { useState } from "react";
import { Tabs, Table } from "antd";
import DOMPurify from "dompurify";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

const ContentModalConfirmWarranty = ({
  data,
  mutationDataInfo = [],
  listDataAttachment = [],
  appHierDataDetail = [],
  appHierOptions = [],
  selectedHierarchy,
  dataAccountNumber = {},
  dataAccNumber = {},
  dataServiceAgreement = {},
  dataPaymentWarrantyPartner = [],
  dataPaymentWarrantyPartnerBranch = []
}) => {
  const [valuePage, setValuePage] = useState("Guarantee");
  const [expandedAccount, setExpandedAccount] = useState(true);
  const [expandedSA, setExpandedSA] = useState(true);
  const [expandedGuarantee, setExpandedGuarantee] = useState(true);
  const [expandedMutation, setExpandedMutation] = useState(true);

  const getPartnerName = (id) => {
    const list = dataPaymentWarrantyPartner?.data || dataPaymentWarrantyPartner || [];
    return Array.isArray(list) ? list.find(p => p.partnerId === id || p.id === id)?.partnerGuaranteeIssuer || id || "-" : id || "-";
  };

  const getBranchName = (id) => {
    const list = dataPaymentWarrantyPartnerBranch?.data || dataPaymentWarrantyPartnerBranch || [];
    return Array.isArray(list) ? list.find(b => b.partnerBranchId === id || b.id === id)?.branchName || id || "-" : id || "-";
  };

  const getAccountLabel = (id) => {
    return dataAccNumber?.data?.find(a => a.id === id)?.name || id || "-";
  };

  const accDetail = dataAccountNumber?.data || {};
  const saList = dataServiceAgreement?.result || [];
  const selectedSA = saList.find(sa => sa.saNumber === data?.saNumber) || {};

  const mutationColumns = [
    { title: "No", dataIndex: "key", width: 50, render: (t, r, i) => i + 1 },
    { title: "REFF. DOCUMENT NUMBER", dataIndex: "mutationNumber", render: (text) => text || "-" },
    { title: "SOURCE", dataIndex: "source", render: (text, record) => text || record.sourceNumber || "-" },
    { title: "TYPE", dataIndex: "type", render: (text) => text || "-" },
    { title: "CATEGORY", dataIndex: "category", render: (text) => text || "-" },
    { title: "DATE", dataIndex: "date", render: (text) => text ? moment(text).format("DD MMM YYYY") : "-" },
    { title: "AMOUNT", dataIndex: "amount", align: "right", render: (val, record) => (record.currencyName || record.currency || "") + " " + (val?.toLocaleString() || "0") },
    { title: "CONVERTED CURRENCY", dataIndex: "convertedCurrencyName", render: (text) => text || "-" },
    { title: "RATE", dataIndex: "rate", align: "right", render: (val) => val?.toLocaleString() || "0" },
    { title: "EQV AMOUNT", dataIndex: "eqvAmount", align: "right", render: (val, record) => (record.currencyName || record.currency || "") + " " + (val?.toLocaleString() || "0") },
    { title: "DESCRIPTION", dataIndex: "description", render: (text) => text || "-" },
  ];

  const items = [
    {
      key: "Guarantee",
      label: "Guarantee",
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[400px] flex flex-col gap-4">
          {/* Account Information */}
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setExpandedAccount(!expandedAccount)}>
              <div className="text-[#0075bf] text-sm font-semibold uppercase">ACCOUNT INFORMATION</div>
              <div>{expandedAccount ? <UpOutlined /> : <DownOutlined />}</div>
            </div>
            {expandedAccount && (
              <div className="grid grid-cols-4 gap-y-4 gap-x-4 w-full">
                <DetailText label="Account Number">{getAccountLabel(data?.accountId)}</DetailText>
                <DetailText label="Account Name">{data?.accountName || accDetail.accountName || "-"}</DetailText>
                <DetailText label="Customer Number">{data?.customerNumber || accDetail.customerNumber || "-"}</DetailText>
                <DetailText label="Customer Name">{data?.customerName || accDetail.customerName || "-"}</DetailText>
                <DetailText label="Cost Center">{data?.costCenter || accDetail.area || "-"}</DetailText>
                <DetailText label="Customer Segment">{data?.customerSegment || accDetail.segment || "-"}</DetailText>
                <DetailText label="Customer Group">{data?.customerGroup || accDetail.accountType || "-"}</DetailText>
                <DetailText label="Account Type">{data?.accountType || accDetail.accountType || "-"}</DetailText>
                <DetailText label="Classification Type">{data?.classificationType || accDetail.accountType || "-"}</DetailText>
              </div>
            )}
          </div>

          {/* Service Agreement Information */}
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setExpandedSA(!expandedSA)}>
              <div className="text-[#0075bf] text-sm font-semibold uppercase">SERVICE AGREEMENT INFORMATION</div>
              <div>{expandedSA ? <UpOutlined /> : <DownOutlined />}</div>
            </div>
            {expandedSA && (
              <div className="grid grid-cols-4 gap-y-4 gap-x-4 w-full">
                <DetailText label="SA Number">{data?.saNumber || "-"}</DetailText>
                <DetailText label="SA Reference">{data?.saReference || selectedSA.saReference || "-"}</DetailText>
                <DetailText label="SA Type">{data?.saType || selectedSA.serviceType?.value || "-"}</DetailText>
                <DetailText label="Type">{data?.type || selectedSA.saType?.value || "-"}</DetailText>
                <DetailText label="PBG Type">{data?.pbgType || selectedSA.pjbgType?.value || "-"}</DetailText>
                <DetailText label="SA Date">{data?.saDate || (selectedSA.saDate ? moment(selectedSA.saDate).format("DD/MM/YYYY") : "-")}</DetailText>
                <DetailText label="SA Start Date">{data?.saStartDate || (selectedSA.startDate ? moment(selectedSA.startDate).format("DD/MM/YYYY") : "-")}</DetailText>
                <DetailText label="SA End Date">{data?.saEndDate || (selectedSA.endDate ? moment(selectedSA.endDate).format("DD/MM/YYYY") : "-")}</DetailText>
                <DetailText label="Commitment Date">{data?.commitmentDate || (selectedSA.commitmentDate ? moment(selectedSA.commitmentDate).format("DD/MM/YYYY") : "-")}</DetailText>
                <DetailText label="Status Approval">{data?.saStatusApproval || selectedSA.approvalStatus || "-"}</DetailText>
                <DetailText label="Status">{data?.saStatus || selectedSA.status || "-"}</DetailText>
                <div className="col-span-4">
                  <DetailText label="Description">{DOMPurify.sanitize(data?.saDescription || selectedSA.description) || "-"}</DetailText>
                </div>
              </div>
            )}
          </div>

          {/* Payment Guarantee Information */}
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setExpandedGuarantee(!expandedGuarantee)}>
              <div className="text-[#0075bf] text-sm font-semibold uppercase">PAYMENT GUARANTEE INFORMATION</div>
              <div>{expandedGuarantee ? <UpOutlined /> : <DownOutlined />}</div>
            </div>
            {expandedGuarantee && (
              <div className="grid grid-cols-4 gap-y-4 gap-x-4 w-full">
                <DetailText label="Warranty Type">{DOMPurify.sanitize(data?.warrantyType) || "-"}</DetailText>
                <DetailText label="Document Number">{DOMPurify.sanitize(data?.documentNumber) || "-"}</DetailText>
                <DetailText label="Document Date">{data?.documentDate ? moment(data.documentDate).format("DD MMM YYYY") : "-"}</DetailText>
                <DetailText label="Issuer Bank">{getPartnerName(data?.issuerBank)}</DetailText>
                <DetailText label="Issuer Branch">{getPartnerName(data?.issuerBranch) || getBranchName(data?.issuerBranch)}</DetailText>
                <DetailText label="Currency">{data?.currency || "-"}</DetailText>
                <DetailText label="Rate Amount">{data?.rateAmount?.toLocaleString() || "-"}</DetailText>
                <DetailText label="Eff Start Date">{data?.effStartDate ? moment(data.effStartDate).format("DD MMM YYYY") : "-"}</DetailText>
                <DetailText label="Eff End Date">{data?.effEndDate ? moment(data.effEndDate).format("DD MMM YYYY") : "-"}</DetailText>
                <div className="col-span-4">
                  <DetailText label="Description">{DOMPurify.sanitize(data?.description) || "-"}</DetailText>
                </div>
              </div>
            )}
          </div>

          {/* Mutation Table */}
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white shadow-sm overflow-x-auto">
            <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setExpandedMutation(!expandedMutation)}>
              <div className="text-[#0075bf] text-sm font-semibold uppercase">MUTATION LIST</div>
              <div>{expandedMutation ? <UpOutlined /> : <DownOutlined />}</div>
            </div>
            {expandedMutation && (
              <Table 
                dataSource={mutationDataInfo} 
                columns={mutationColumns} 
                pagination={false} 
                size="small"
                className="mt-2 custom-table-confirm"
                scroll={{ x: 1500 }}
              />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "Approval",
      label: "Approval",
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[400px]">
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white shadow-sm">
            <div className="text-[#0075bf] text-sm font-semibold uppercase mb-4">APPROVAL INFORMATION</div>
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={appHierOptions.find(o => o.value === selectedHierarchy)?.name || ""}
              dataTable={appHierDataDetail}
              selectedHierarchy={selectedHierarchy}
            />
          </div>
        </div>
      ),
    },
    {
      key: "Attachment",
      label: "Attachment",
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[400px]">
          <div className="border border-[#dbdade] rounded-lg p-4 bg-white shadow-sm">
            <div className="text-[#0075bf] text-sm font-semibold uppercase mb-4">ATTACHMENT INFORMATION</div>
            <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-0 -mt-4 -mx-4 -mb-4 bg-white">
      <Tabs
        activeKey={valuePage}
        onChange={(key) => setValuePage(key)}
        items={items}
        className="custom-confirm-tabs"
        tabBarStyle={{
          paddingLeft: "16px",
          paddingRight: "16px",
          marginBottom: 0,
          borderBottom: "1px solid #dbdade"
        }}
      />
    </div>
  );
};

export default ContentModalConfirmWarranty;
