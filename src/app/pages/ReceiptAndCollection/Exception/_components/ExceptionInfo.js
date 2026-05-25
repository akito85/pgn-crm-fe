import React, { useState } from "react";
import { useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import DetailText from "../../../../../components/DetailText";
import dayjs from "dayjs";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

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

const CollapsibleCard = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="bg-white p-4 mb-3 rounded-md" style={{ border: "1px solid #d9d9d9" }}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-primary text-xs font-semibold uppercase">{title}</span>
        {collapsed ? <DownOutlined /> : <UpOutlined />}
      </div>
      {!collapsed && <div className="mt-4">{children}</div>}
    </div>
  );
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
  const {
    data_budget, data_province, data_industrial_sector, data_account_Category,
    data_service_type, data_sor, data_cost_center, data_Gsizes,
    data_customer_segment, data_customer,
  } = useSelector((state) => state.billing_bucket);

  const criteriaLovMap = {
    sor:              (Array.isArray(data_sor) ? data_sor : []).map((i) => ({ value: i.id, label: i.name })),
    customer:         (Array.isArray(data_customer) ? data_customer : []).map((i) => ({ value: i.id, label: i.name })),
    province:         (Array.isArray(data_province) ? data_province : []).map((i) => ({ value: i.value, label: i.name })),
    costCenter:       (Array.isArray(data_cost_center) ? data_cost_center : []).map((i) => ({ value: i.id, label: i.name })),
    budget:           (Array.isArray(data_budget) ? data_budget : []).map((i) => ({ value: i.id, label: i.text })),
    industrialSector: (Array.isArray(data_industrial_sector) ? data_industrial_sector : []).map((i) => ({ value: i.id, label: i.text })),
    customerSegment:  (Array.isArray(data_customer_segment) ? data_customer_segment : []).map((i) => ({ value: i.id, label: i.text })),
    serviceType:      (Array.isArray(data_service_type) ? data_service_type : []).map((i) => ({ value: i.id, label: i.text })),
    accountCategory:  (Array.isArray(data_account_Category) ? data_account_Category : []).map((i) => ({ value: i.id, label: i.text })),
    gsizes:           (Array.isArray(data_Gsizes) ? data_Gsizes : []).map((i) => ({ value: i.id, label: i.text })),
  };

  const resolveCriteriaLabel = (fieldName, val) => {
    if (val == null || val === "") return "-";
    const opts = criteriaLovMap[fieldName];
    if (!opts) return val;
    const found = opts.find((o) => String(o.value) === String(val));
    return found ? found.label : val;
  };
  const billingCycleItem = dataBillingCycle.find(
    (item) => (item.id ?? item.billingCycleId) === kirimBody?.billingCycleId
  );
  const billingCycleLabel = billingCycleItem
    ? `${billingCycleItem.beginCycle} - ${billingCycleItem.endCycle} ${billingCycleItem.timeUnit}`
    : kirimBody?.billingCycleId ?? "-";

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

  const activityLabels =
    (kirimBody?.activityIds ?? [])
      .map((id) => {
        const found = dataActivity.find((a) => a.glbTypeValId === id);
        return found?.glbValue ?? found?.name ?? id;
      })
      .join(", ") || "-";

  const isAccount = selectedAccounts.length > 0;

  const criteriaLabel =
    (kirimBody?.criteriaIds ?? [])
      .map((id) => {
        const found = dataCriteriaOptions.find((a) => a.glbTypeValId === id);
        return found?.name ?? found?.glbValue ?? id;
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

  // --- Criteria table columns ---
  const criteriaIdToField = {
    11: "sor", 12: "customer", 13: "subDistrict", 14: "district",
    15: "province", 16: "costCenter", 17: "budget", 18: "industrialSector",
    19: "customerSegment", 20: "accountGroup", 21: "serviceType",
    22: "accountCategory", 23: "gsizes", 39: "city",
  };

  const selectedCriteriaIds = kirimBody?.criteriaIds ?? [];
  const orderedCriteria = dataCriteriaOptions.filter((item) =>
    selectedCriteriaIds.includes(item.glbTypeValId)
  );

  const criteriaColumns = [
    { title: "NO", key: "no", width: 50, render: (_, __, i) => i + 1 },
    ...orderedCriteria.map((item) => {
      const fieldName = criteriaIdToField[item.glbTypeValId] ?? `criteria_${item.glbTypeValId}`;
      return {
        title: (item.name ?? item.glbValue ?? "").toUpperCase(),
        key: fieldName,
        dataIndex: fieldName,
        render: (val) => resolveCriteriaLabel(fieldName, val),
      };
    }),
    { title: "START DATE", key: "startDate", dataIndex: "startDate", render: (v) => formatDate(v) },
    { title: "END DATE", key: "endDate", dataIndex: "endDate", render: (v) => formatDate(v) },
    { title: "DESCRIPTION", key: "description", dataIndex: "description", render: (v) => v ?? "-" },
  ];

  return (
    <div className="flex flex-col gap-3 mt-3">
      {/* Exception Information (collapsible) */}
      <CollapsibleCard title="Exception Information">
        <div className="grid grid-cols-5 gap-y-2.5 gap-x-2 py-1">
          <DetailText label="Activity">{activityLabels}</DetailText>
          <DetailText label="Billing Cycle">{billingCycleLabel}</DetailText>
          <DetailText label="Billing Period">{billingPeriodLabel}</DetailText>
          <DetailText label="Start Date">{formatDate(kirimBody?.startDate)}</DetailText>
          <DetailText label="End Date">{formatDate(kirimBody?.endDate)}</DetailText>
          {!isAccount && (
            <div className="col-span-5">
              <DetailText label="Criteria">{criteriaLabel}</DetailText>
            </div>
          )}
          <div className="col-span-5">
            <DetailText label="Description">{kirimBody?.description || "-"}</DetailText>
          </div>
        </div>
      </CollapsibleCard>

      {/* Account Information (ACCOUNT mode only) */}
      {isAccount && (
        <CollapsibleCard title="Account Information">
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
        </CollapsibleCard>
      )}

      {/* Criteria Information (CRITERIA mode only) */}
      {!isAccount && criteriaData.length > 0 && (
        <CollapsibleCard title="Criteria Information">
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
        </CollapsibleCard>
      )}
    </div>
  );
};

export default ExceptionInfo;

