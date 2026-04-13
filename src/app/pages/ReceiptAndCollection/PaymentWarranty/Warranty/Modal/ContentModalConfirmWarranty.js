import React, { useState } from "react";
import { Tabs, Table } from "antd";
import DOMPurify from "dompurify";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import SectionCard from "../../../../../../components/SectionCard";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import TableRBI from "../../../../../../components/TableRBI";

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
  dataPaymentWarrantyPartnerBranch = [],
  rateTypeDDL = {},
  currencyDDL = {}
}) => {
  const [valuePage, setValuePage] = useState("Guarantee");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const getRateTypeName = (id) => {
    return rateTypeDDL?.data?.find(r => r.id === id)?.name || id || "-";
  };

  const getCurrencyName = (idOrName) => {
    const found = currencyDDL?.data?.find(c => c.id === idOrName || c.name === idOrName);
    return found ? found.name : idOrName || "-";
  };

  const accDetail = dataAccountNumber?.data || {};
  const saList = dataServiceAgreement?.result || [];
  const selectedSA = saList.find(sa => sa.saNumber === data?.saNumber) || {};
  const isCash = data?.warrantyType === 'CASH';

  const mutationColumns = [
    { title: "No", dataIndex: "key", width: 50, render: (t, r, i) => i + 1 },
    { title: "REFF. DOCUMENT NUMBER", dataIndex: "mutationNumber", width: 180, render: (text, record) => text || record.documentNumber || "-" },
    { title: "SOURCE", dataIndex: "source", width: 120, render: (text, record) => text || record.sourceNumber || "-" },
    { title: "TYPE", dataIndex: "type", width: 80, render: (text) => text || "-" },
    { title: "CATEGORY", dataIndex: "category", width: 150, render: (text) => text || "-" },
    { title: "DATE", dataIndex: "date", width: 120, render: (text, record) => {
      const dateVal = text || record.transactionDate;
      return dateVal ? moment(dateVal).format("DD MMM YYYY") : "-";
    }},
    { title: "AMOUNT", dataIndex: "amount", width: 130, align: "right", render: (val, record) => (val?.toLocaleString() || "0") },
    { title: "CONVERTED CURRENCY", dataIndex: "convertedCurrencyName", width: 150, render: (text, record) => text || record.convertedCurrency || "-" },
    { title: "RATE", dataIndex: "rate", width: 100, align: "right", render: (val) => val?.toLocaleString() || "0" },
    { title: "EQV AMOUNT", dataIndex: "eqvAmount", width: 130, align: "right", render: (val, record) => {
      const eqv = val ?? record.equivalentAmount;
      return (eqv?.toLocaleString() || "0");
    }},
    { title: "DESCRIPTION", dataIndex: "description", width: 200, render: (text) => text || "-" },
  ];

  const items = [
    {
      key: "Guarantee",
      label: "Guarantee",
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[400px] flex flex-col gap-4">
          <SectionCard title="ACCOUNT INFORMATION">
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
          </SectionCard>

          <SectionCard title="SERVICE AGREEMENT INFORMATION">
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
          </SectionCard>

          <SectionCard title="PAYMENT GUARANTEE INFORMATION">
            <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
              <DetailText label="Type">{DOMPurify.sanitize(data?.warrantyType) || "-"}</DetailText>
              <DetailText label="Document Number">{DOMPurify.sanitize(data?.documentNumber) || "-"}</DetailText>
              <DetailText label="Document Date">{data?.documentDate ? moment(data.documentDate).format("DD MMM YYYY") : "-"}</DetailText>
              <DetailText label="Issuer Bank">{getPartnerName(data?.issuerBank)}</DetailText>
              <DetailText label="Issuer Branch">{getBranchName(data?.issuerBranch)}</DetailText>
              
              <DetailText label="Currency">{getCurrencyName(data?.currency)}</DetailText>
              <DetailText label="Rate">{data?.rateAmount?.toLocaleString() || "-"}</DetailText>
              {isCash && (
                <>
                  <DetailText label="Rate Type">{getRateTypeName(data?.rateType)}</DetailText>
                  <DetailText label="Rate Date">{data?.rateDate ? moment(data.rateDate).format("DD MMM YYYY") : "-"}</DetailText>
                </>
              )}

              <DetailText label="Eff Start Date">{(data?.effStartDate || data?.effectiveStartDate) ? moment(data?.effStartDate || data?.effectiveStartDate).format("DD MMM YYYY") : "-"}</DetailText>
              <DetailText label="Eff End Date">{(data?.effEndDate || data?.effectiveEndDate) ? moment(data?.effEndDate || data?.effectiveEndDate).format("DD MMM YYYY") : "-"}</DetailText>
              <DetailText label="Term Of Claim Period">
                {data?.claimPeriodTermValue 
                  ? `${data?.claimPeriodTermType || "DATE"}: ${moment(data.claimPeriodTermValue).format("DD MMM YYYY")}` 
                  : "-"}
              </DetailText>

              <div className="col-span-5">
                <DetailText label="Description">{DOMPurify.sanitize(data?.description) || "-"}</DetailText>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="MUTATION LIST">
            <TableRBI 
              idTable="table-mutation-confirm"
              dataSource={mutationDataInfo} 
              columns={mutationColumns} 
              current={currentPage}
              pageSize={pageSize}
              totalData={mutationDataInfo?.length || 0}
              onChange={(p, s) => { setCurrentPage(p); setPageSize(s); }}
              showExport={false}
              showAdvanceSearch={false}
              showSearchBar={false}
              tableScrolled={{ x: 1200 }}
            />
          </SectionCard>
        </div>
      ),
    },
    {
      key: "Approval",
      label: "Approval",
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[400px]">
          <SectionCard title="APPROVAL INFORMATION">
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={appHierOptions.find(o => o.value === selectedHierarchy)?.name || ""}
              dataTable={appHierDataDetail}
              selectedHierarchy={selectedHierarchy}
            />
          </SectionCard>
        </div>
      ),
    },
    {
      key: "Attachment",
      label: "Attachment",
      children: (
        <div className="p-5 bg-[#f8f7fa] min-h-[400px]">
          <SectionCard title="ATTACHMENT INFORMATION">
            <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
          </SectionCard>
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
