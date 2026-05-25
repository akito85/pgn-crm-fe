import React, { useState } from "react";
import { Spin } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import RadioTabs from "../../../../../components/RadioTabs";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import dayjs from "dayjs";

const formatDate = (val) => {
  if (!val) return "-";
  if (val && typeof val === "object" && val.format) return val.format("YYYY-MM-DD");
  try {
    const d = dayjs(val);
    return d.isValid() ? d.format("YYYY-MM-DD") : "-";
  } catch {
    return "-";
  }
};

const CollapsibleCard = ({ title, children, defaultCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <div className="bg-white p-4 mb-3 rounded-lg" style={{ border: "1px solid #d1d5db", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setCollapsed((c) => !c)}
      >
        <span className="text-primary text-xs font-semibold uppercase">{title}</span>
        {collapsed ? <DownOutlined /> : <UpOutlined />}
      </div>
      {!collapsed && <div className="mt-4">{children}</div>}
    </div>
  );
};

const ExceptionDetailPanel = ({
  data_detail,
  selectedRecord = {},
  dataListAppHierDetail = [],
  appHierOptions = [],
  loading = false,
}) => {
  const [valuePage, setValuePage] = useState("Exception");

  const tabPages = [
    { value: "Exception" },
    { value: "Approval" },
    { value: "Attachment" },
  ];

  const account = data_detail?.accounts?.[0] ?? {};
  const hasAccounts = (data_detail?.accounts?.length ?? 0) > 0;
  const hasCriteria = (data_detail?.criteriaList?.length ?? 0) > 0;

  // ── Dynamic criteria columns ────────────────────────────────────────────────
  const criteriaTypeToLabel = {
    sor: "SOR",
    customer: "CUSTOMER",
    subDistrict: "SUB DISTRICT",
    district: "DISTRICT",
    province: "PROVINCE",
    costCenter: "COST CENTER",
    budget: "BUDGET",
    industrialSector: "INDUSTRIAL SECTOR",
    customerSegment: "CUSTOMER SEGMENT",
    accountGroup: "ACCOUNT GROUP",
    serviceType: "SERVICE TYPE",
    accountCategory: "ACCOUNT CATEGORY",
    gsizes: "G SIZES",
    city: "CITY",
    accountGroupType: "ACCOUNT GROUP TYPE",
  };

  const uniqueCriteriaTypes = hasCriteria
    ? [...new Set(
        data_detail.criteriaList.flatMap((row) =>
          (row.criteriaValues ?? []).map((cv) => cv.criteriaType)
        )
      )]
    : [];

  const criteriaColumns = [
    { title: "NO", key: "no", width: 50, render: (_, __, i) => i + 1 },
    ...uniqueCriteriaTypes.map((type) => ({
      title: criteriaTypeToLabel[type] ?? type.toUpperCase(),
      key: type,
      dataIndex: type,
      render: (val) => val ?? "-",
    })),
    { title: "START DATE", key: "startDate", dataIndex: "startDate", render: (v) => formatDate(v) },
    { title: "END DATE", key: "endDate", dataIndex: "endDate", render: (v) => formatDate(v) },
    { title: "DESCRIPTION", key: "description", dataIndex: "description", render: (v) => v ?? "-" },
  ];

  const criteriaDataSource = hasCriteria
    ? data_detail.criteriaList.map((row, i) => {
        const flat = { key: row.criteriaGroupId ?? i, startDate: row.startDate, endDate: row.endDate, description: row.description };
        (row.criteriaValues ?? []).forEach((cv) => {
          flat[cv.criteriaType] = cv.criteriaValueName ?? cv.criteriaValueId;
        });
        return flat;
      })
    : [];

  // ── Attachment columns ────────────────────────────────────────────────────
  const attachmentColumns = [
    { title: "NO", key: "no", width: 50, render: (_, __, i) => i + 1 },
    { title: "FILE NAME", dataIndex: "fileName", key: "fileName" },
    { title: "FILE TYPE", dataIndex: "fileType", key: "fileType" },
    {
      title: "DOWNLOAD",
      key: "download",
      render: (_, record) =>
        record.urlFile1 ? (
          <a href={record.urlFile1} target="_blank" rel="noreferrer" className="text-primary underline">
            Download
          </a>
        ) : "-",
    },
    { title: "UPLOADED AT", key: "createdDate", render: (_, r) => formatDate(r.createdDate) },
  ];

  const approvalName =
    (appHierOptions || []).find((opt) => opt.value === data_detail?.appHierId)?.name || "";

  const renderSection = () => {
    switch (valuePage) {
      case "Exception":
        return (
          <div className="flex flex-col gap-3 mt-3">
            {/* Account Information — default collapsed */}
            {hasAccounts && (
              <CollapsibleCard title="Account Information" defaultCollapsed={true}>
                <div className="grid grid-cols-5 gap-y-2.5 gap-x-2 py-1">
                  <DetailText label="Account Number">{account.accountNumber || "-"}</DetailText>
                  <DetailText label="Account Name">{account.accountName || "-"}</DetailText>
                  <DetailText label="Customer Number">{account.customerNumber || "-"}</DetailText>
                  <DetailText label="Customer Name">{account.customerName || "-"}</DetailText>
                  <DetailText label="Cost Center">{selectedRecord.costCenter || account.costCenter || "-"}</DetailText>
                  <DetailText label="Customer Segment">{selectedRecord.customerSegment || account.customerSegment || "-"}</DetailText>
                  <DetailText label="Customer Group">{selectedRecord.accountGroupType || account.accountGroupType || "-"}</DetailText>
                </div>
              </CollapsibleCard>
            )}

            {/* Exception Information — default expanded */}
            <CollapsibleCard title="Exception Information" defaultCollapsed={false}>
              <div className="grid grid-cols-5 gap-y-2.5 gap-x-2 py-1">
                <DetailText label="Activity">{selectedRecord.activity || data_detail?.activity || "-"}</DetailText>
                <DetailText label="Billing Cycle">{data_detail?.billingCycle || "-"}</DetailText>
                <DetailText label="Billing Period">{data_detail?.billingPeriod || "-"}</DetailText>
                <DetailText label="Start Date">{formatDate(data_detail?.startDate)}</DetailText>
                <DetailText label="End Date">{formatDate(data_detail?.endDate)}</DetailText>
                <div className="col-span-5">
                  <DetailText label="Description">{data_detail?.description || "-"}</DetailText>
                </div>
              </div>
            </CollapsibleCard>

            {/* Criteria Information — only if hasCriteria */}
            {hasCriteria && (
              <CollapsibleCard title="Criteria Information" defaultCollapsed={false}>
                <TableRBI
                  dataSource={criteriaDataSource}
                  columns={criteriaColumns}
                  pageSize={criteriaDataSource.length || 10}
                  current={1}
                  totalData={criteriaDataSource.length}
                  tableScrolled={{ x: "max-content" }}
                  showExport={false}
                  usePagination={false}
                />
              </CollapsibleCard>
            )}
          </div>
        );

      case "Approval":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              APPROVAL INFORMATION
            </p>
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={approvalName}
              dataTable={dataListAppHierDetail}
              selectedHierarchy={data_detail?.appHierId}
            />
          </>
        );

      case "Attachment":
        return (
          <div className="mt-3">
            <p className="text-primary text-xs font-bold uppercase pb-2">ATTACHMENT INFORMATION</p>
            <TableRBI
              dataSource={(data_detail?.attachmentList ?? []).map((a, i) => ({ ...a, key: a.id ?? i }))}
              columns={attachmentColumns}
              pageSize={(data_detail?.attachmentList?.length) || 10}
              current={1}
              totalData={data_detail?.attachmentList?.length ?? 0}
              tableScrolled={{ x: "max-content" }}
              showExport={false}
              usePagination={false}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Spin spinning={loading}>
      <RadioTabs
        data={tabPages}
        onChange={(e) => setValuePage(e.target.value)}
        currentPosition={valuePage}
      />
      {renderSection()}
    </Spin>
  );
};

export default ExceptionDetailPanel;

