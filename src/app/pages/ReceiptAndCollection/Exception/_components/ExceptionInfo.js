import React from "react";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
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

const ExceptionInfo = ({
  kirimBody,
  dataBillingCycle = [],
  dataBillingPeriod = [],
  dataActivity = [],
  dataCriteriaOptions = [],
  selectedAccounts = [],
  criteriaData = [],
  appHierOptions = [],
}) => {
  // Resolve labels from IDs
  const billingCycleLabel =
    dataBillingCycle.find(
      (item) => (item.id ?? item.billingCycleId) === kirimBody?.billingCycleId
    )?.description ??
    dataBillingCycle.find(
      (item) => (item.id ?? item.billingCycleId) === kirimBody?.billingCycleId
    )?.name ??
    kirimBody?.billingCycleId ??
    "-";

  const billingPeriodLabel =
    dataBillingPeriod.find(
      (item) => (item.id ?? item.periodId) === kirimBody?.billingPeriodId
    )?.description ??
    dataBillingPeriod.find(
      (item) => (item.id ?? item.periodId) === kirimBody?.billingPeriodId
    )?.period ??
    dataBillingPeriod.find(
      (item) => (item.id ?? item.periodId) === kirimBody?.billingPeriodId
    )?.name ??
    kirimBody?.billingPeriodId ??
    "-";

  const activityLabels = (kirimBody?.activityIds ?? [])
    .map((id) => {
      const found = dataActivity.find((a) => a.glbTypeValId === id);
      return found?.glbValue ?? found?.name ?? id;
    })
    .join(", ") || "-";

  // --- Account table columns ---
  const accountColumns = [
    { title: "NO", key: "no", width: 50, render: (_, __, i) => i + 1 },
    { title: "ACCOUNT NUMBER", dataIndex: "accountNumber", key: "accountNumber" },
    { title: "ACCOUNT NAME", dataIndex: "accountName", key: "accountName" },
    { title: "CUSTOMER NUMBER", dataIndex: "customerNumber", key: "customerNumber" },
    { title: "CUSTOMER NAME", dataIndex: "customerName", key: "customerName" },
    { title: "SOR", dataIndex: "sor", key: "sor" },
    { title: "COST CENTER", dataIndex: "costCenter", key: "costCenter" },
  ];

  // --- Criteria label resolution ---
  // criteriaFieldConfig mirrors the one in ExceptionCreate
  const criteriaIdToField = {
    11: "sor", 12: "customer", 13: "subDistrict", 14: "district",
    15: "province", 16: "costCenter", 17: "budget", 18: "industrialSector",
    19: "customerSegment", 20: "accountGroup", 21: "serviceType",
    22: "accountCategory", 23: "gsizes", 39: "city",
  };

  // Build criteria columns from selected criteria IDs in kirimBody
  const selectedCriteriaIds = kirimBody?.criteriaIds ?? [];
  const orderedCriteria = dataCriteriaOptions.filter((item) =>
    selectedCriteriaIds.includes(item.glbTypeValId)
  );

  const criteriaColumns = [
    { title: "NO", key: "no", width: 50, render: (_, __, i) => i + 1 },
    ...orderedCriteria.map((item) => ({
      title: (item.name ?? item.glbValue ?? "").toUpperCase(),
      key: criteriaIdToField[item.glbTypeValId] ?? `criteria_${item.glbTypeValId}`,
      dataIndex: criteriaIdToField[item.glbTypeValId] ?? `criteria_${item.glbTypeValId}`,
      render: (val) => val ?? "-",
    })),
    { title: "START DATE", key: "startDate", dataIndex: "startDate", render: (v) => formatDate(v) },
    { title: "END DATE", key: "endDate", dataIndex: "endDate", render: (v) => formatDate(v) },
  ];

  const isAccount = kirimBody?.exceptionMode === "ACCOUNT" || (!kirimBody?.exceptionMode && selectedAccounts.length > 0);

  return (
    <div className="flex flex-col gap-3 mt-3">
      {/* Basic Info */}
      <CardComponent header="Exception Information" cols={2}>
        <DetailText label="Activity">{activityLabels}</DetailText>
        <DetailText label="Billing Cycle">{billingCycleLabel}</DetailText>
        <DetailText label="Billing Period">{billingPeriodLabel}</DetailText>
        <DetailText label="Start Date">{formatDate(kirimBody?.startDate)}</DetailText>
        <DetailText label="End Date">{formatDate(kirimBody?.endDate)}</DetailText>
        <DetailText label="Description">{kirimBody?.description || "-"}</DetailText>
        <DetailText label="Exception Mode">
          {isAccount ? "Specific Accounts" : "Criteria-Based Accounts"}
        </DetailText>
        <DetailText label="Action">
          {kirimBody?.isSubmit ? "Submit" : "Save as Draft"}
        </DetailText>
      </CardComponent>

      {/* Account table (ACCOUNT mode) */}
      {isAccount && (
        <div>
          <p className="text-primary text-xs font-bold uppercase pb-2">Account Information</p>
          <TableRBI
            dataSource={selectedAccounts.map((a, i) => ({ ...a, key: a.accountNumber ?? i }))}
            columns={accountColumns}
            pageSize={selectedAccounts.length || 10}
            current={1}
            totalData={selectedAccounts.length}
            tableScrolled={{ x: "max-content" }}
            showExport={false}
            usePagination={false}
          />
        </div>
      )}

      {/* Criteria table (CRITERIA mode) */}
      {!isAccount && criteriaData.length > 0 && (
        <div>
          <p className="text-primary text-xs font-bold uppercase pb-2">Criteria Information</p>
          <TableRBI
            dataSource={criteriaData.map((c, i) => ({ ...c, key: c.key ?? i }))}
            columns={criteriaColumns}
            pageSize={criteriaData.length || 10}
            current={1}
            totalData={criteriaData.length}
            tableScrolled={{ x: "max-content" }}
            showExport={false}
            usePagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default ExceptionInfo;
