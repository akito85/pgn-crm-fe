import React, { useState } from "react";
import { Spin } from "antd";
import RadioTabs from "../../../../../components/RadioTabs";
import CardComponent from "../../../../../components/Card/CardComponent";
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

const ExceptionDetailPanel = ({
  data_detail,
  dataListAppHierDetail = [],
  appHierOptions = [],
  loading = false,
}) => {
  const [valuePage, setValuePage] = useState("Exception Information");

  const tabPages = [
    { value: "Exception Information" },
    { value: "Approval" },
    { value: "Attachment" },
  ];

  // ── Account table columns ──────────────────────────────────────────────────
  const accountColumns = [
    { title: "NO", key: "no", width: 50, render: (_, __, i) => i + 1 },
    { title: "ACCOUNT NUMBER", dataIndex: "accountNumber", key: "accountNumber" },
    { title: "ACCOUNT NAME", dataIndex: "accountName", key: "accountName" },
    { title: "CUSTOMER NUMBER", dataIndex: "customerNumber", key: "customerNumber" },
    { title: "CUSTOMER NAME", dataIndex: "customerName", key: "customerName" },
    { title: "SOR", dataIndex: "sor", key: "sor" },
    { title: "COST CENTER", dataIndex: "costCenter", key: "costCenter" },
    { title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", key: "accountSegment" },
    { title: "ACCOUNT STATUS", dataIndex: "accountStatus", key: "accountStatus" },
  ];

  // ── Criteria table — one row per criteriaGroupId ───────────────────────────
  // criteriaList shape: [{criteriaGroupId, startDate, endDate, criteriaValues:[{id, criteriaType, criteriaValueId}]}]
  const criteriaColumns = [
    { title: "NO", key: "no", width: 50, render: (_, __, i) => i + 1 },
    {
      title: "CRITERIA",
      key: "criteria",
      render: (_, record) =>
        (record.criteriaValues || [])
          .map((cv) => `${cv.criteriaType}: ${cv.criteriaValueId}`)
          .join(" | ") || "-",
    },
    { title: "START DATE", key: "startDate", render: (_, r) => formatDate(r.startDate) },
    { title: "END DATE", key: "endDate", render: (_, r) => formatDate(r.endDate) },
  ];

  // ── Attachment table ────────────────────────────────────────────────────────
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

  const hasAccounts = (data_detail?.accounts?.length ?? 0) > 0;
  const hasCriteria = (data_detail?.criteriaList?.length ?? 0) > 0;

  const approvalName =
    (appHierOptions || []).find((opt) => opt.value === data_detail?.appHierId)?.name || "";

  const renderSection = () => {
    switch (valuePage) {
      case "Exception Information":
        return (
          <div className="flex flex-col gap-3 mt-3">
            <CardComponent header="Exception Information" cols={2}>
              <DetailText label="Exception Number">{data_detail?.exceptionNumber || "-"}</DetailText>
              <DetailText label="Status">{data_detail?.status || "-"}</DetailText>
              <DetailText label="Status Approval">{data_detail?.statusApproval || "-"}</DetailText>
              <DetailText label="Billing Cycle">{data_detail?.billingCycle || "-"}</DetailText>
              <DetailText label="Billing Period">{data_detail?.billingPeriod || "-"}</DetailText>
              <DetailText label="Start Date">{formatDate(data_detail?.startDate)}</DetailText>
              <DetailText label="End Date">{formatDate(data_detail?.endDate)}</DetailText>
              <DetailText label="Description" className="col-span-2">{data_detail?.description || "-"}</DetailText>
            </CardComponent>

            {hasAccounts && (
              <div>
                <p className="text-primary text-xs font-bold uppercase pb-2">Account Information</p>
                <TableRBI
                  dataSource={(data_detail.accounts).map((a, i) => ({ ...a, key: a.excAccountId ?? i }))}
                  columns={accountColumns}
                  pageSize={data_detail.accounts.length || 10}
                  current={1}
                  totalData={data_detail.accounts.length}
                  tableScrolled={{ x: "max-content" }}
                  showExport={false}
                  usePagination={false}
                />
              </div>
            )}

            {hasCriteria && (
              <div>
                <p className="text-primary text-xs font-bold uppercase pb-2">Criteria Information</p>
                <TableRBI
                  dataSource={(data_detail.criteriaList).map((c, i) => ({
                    ...c,
                    key: c.criteriaGroupId ?? i,
                  }))}
                  columns={criteriaColumns}
                  pageSize={data_detail.criteriaList.length || 10}
                  current={1}
                  totalData={data_detail.criteriaList.length}
                  tableScrolled={{ x: "max-content" }}
                  showExport={false}
                  usePagination={false}
                />
              </div>
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
