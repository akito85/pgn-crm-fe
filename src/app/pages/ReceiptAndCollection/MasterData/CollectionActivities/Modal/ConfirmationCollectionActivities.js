import React from "react";
import { Tabs } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import CollapsibleContainer from "../../../../../../components/CollapsibleContainer";
import DetailText from "../../../../../../components/DetailText";
import TableRBI from "../../../../../../components/TableRBI";

const normalizeCollectionCriteriaIds = (criteriaIds = []) => {
  const normalizedValues = (Array.isArray(criteriaIds)
    ? criteriaIds
    : [criteriaIds]
  ).map((criteriaId) => {
    const normalizedValue = Number(criteriaId);
    return Number.isNaN(normalizedValue) ? criteriaId : normalizedValue;
  });
  const uniqueValues = normalizedValues.filter(
    (value, index) => normalizedValues.indexOf(value) === index
  );
  return uniqueValues.includes(24) ? [24] : uniqueValues;
};

const formatDisplayDate = (value) => {
  if (!value) return "-";
  if (moment.isMoment(value)) return value.format("DD MMM YYYY");
  if (value instanceof Date) return moment(value).format("DD MMM YYYY");
  const parsed = moment(value, ["DD MMM YYYY", "YYYY-MM-DD", moment.ISO_8601], true);
  return parsed.isValid() ? parsed.format("DD MMM YYYY") : value;
};

const ConfirmationCollectionActivities = ({
  bodyData,
  appHierDataDetail,
  appHierOptions,
  listDataAttachment,
  listDataCriteria,
  criteriaValues,
  data_media,
  data_category,
}) => {
  const normalizedCriteriaValues = normalizeCollectionCriteriaIds(criteriaValues);

  const getLabel = (dataArray, value) => {
    const normalizedValue = normalizeCollectionCriteriaIds([value])[0];
    const item = dataArray?.find(
      (opt) =>
        normalizeCollectionCriteriaIds([opt.value || opt.id])[0] === normalizedValue
    );
    return item ? (item.label || item.text || item.name) : (value || "-");
  };

  const hierarchyName =
    (appHierOptions || []).find((o) => o.value === bodyData?.apphierId)?.name ||
    bodyData?.apphierId ||
    "-";

  // ─── Criteria columns ───────────────────────────────────────────────────────
  const columnsCriteria = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...(normalizedCriteriaValues.includes(19)
      ? [{ title: "CUSTOMER SEGMENT", dataIndex: "customerSegment", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(20)
      ? [{ title: "ACCOUNT GROUP", dataIndex: "accountGroup", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(22)
      ? [{ title: "ACCOUNT CATEGORY", dataIndex: "accountCategory", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(21)
      ? [{ title: "SERVICE TYPE", dataIndex: "serviceType", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(18)
      ? [{ title: "INDUSTRIAL SECTOR", dataIndex: "industrialSector", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(17)
      ? [{ title: "BUDGET", dataIndex: "budget", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(11)
      ? [{ title: "SOR", dataIndex: "sor", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(16)
      ? [{ title: "COST CENTER", dataIndex: "area", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(15)
      ? [{ title: "PROVINCE", dataIndex: "province", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(39)
      ? [{ title: "CITY", dataIndex: "city", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(14)
      ? [{ title: "DISTRICT", dataIndex: "district", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(13)
      ? [{ title: "SUB-DISTRICT", dataIndex: "subDistrict", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(12)
      ? [{ title: "ACCOUNT", dataIndex: "customer", render: (v) => v?.label || v?.text || v || "-" }] : []),
    ...(normalizedCriteriaValues.includes(23)
      ? [{ title: "G-SIZES", dataIndex: "gsizes", render: (v) => v?.label || v?.text || v || "-" }] : []),
    { title: "START DATE", dataIndex: "startDate", render: (v) => formatDisplayDate(v) },
  ];

  // ─── Approval columns ────────────────────────────────────────────────────────
  const columnsApproval = [
    { title: "NO", align: "center", width: 60, render: (_, __, i) => i + 1 },
    { title: "HIERARCHY", dataIndex: "hierarchyRole" },
    { title: "POSITION", dataIndex: "hierarchyPosition" },
  ];

  // ─── Attachment columns ──────────────────────────────────────────────────────
  const columnsAttachment = [
    { title: "NO", align: "center", width: 60, render: (_, __, i) => i + 1 },
    { title: "CATEGORY", dataIndex: "fileCategoryName" },
    { title: "FILE NAME", dataIndex: "fileName" },
  ];

  // ─── Tab items ───────────────────────────────────────────────────────────────
  const tabItems = [
    {
      key: "activities",
      label: "Activities",
      children: (
        <div className="flex flex-col gap-y-3">
          <CollapsibleContainer header="Activities Information" border defaultOpen>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 pt-2">
              <DetailText label="Activities Name">{bodyData?.activitiesName || "-"}</DetailText>
              <DetailText label="Media">{getLabel(data_media, bodyData?.media)}</DetailText>
              <DetailText label="Category">{getLabel(data_category, bodyData?.category)}</DetailText>
              <DetailText label="Start Date">{formatDisplayDate(bodyData?.startDate)}</DetailText>
              <DetailText label="End Date">{formatDisplayDate(bodyData?.endDate)}</DetailText>
              <DetailText label="Description">{bodyData?.description || "-"}</DetailText>
            </div>
          </CollapsibleContainer>

          <CollapsibleContainer header="Criteria Information" border defaultOpen>
            <div className="pt-2">
              <TableRBI
                idTable="confirmation-criteria-table"
                dataSource={listDataCriteria}
                columns={columnsCriteria}
                totalData={listDataCriteria?.length || 0}
                usePagination={false}
                loading={false}
                tableScrolled={{ x: "max-content" }}
              />
            </div>
          </CollapsibleContainer>
        </div>
      ),
    },
    {
      key: "approval",
      label: "Approval",
      children: (
        <div
          className="rounded-lg p-4"
          style={{ border: "1px solid #C8CDD4" }}
        >
          <div className="mb-4">
            <p className="text-sm font-semibold mb-1">
              Approval Hierarchy <span className="text-red-500">*</span>
            </p>
            <div
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ border: "1px solid #D9D9D9", background: "#FAFAFA" }}
            >
              {hierarchyName}
            </div>
          </div>
          <TableRBI
            idTable="confirmation-approval-table"
            dataSource={appHierDataDetail}
            columns={columnsApproval}
            totalData={appHierDataDetail?.length || 0}
            usePagination={false}
            loading={false}
            expandable={{
              expandedRowRender: (record) => (
                <div>
                  <div
                    className="text-xs font-bold text-white px-3 py-1 mb-1"
                    style={{ background: "#0075BF" }}
                  >
                    EMPLOYEE
                  </div>
                  {(record.employeeDetail || []).map((emp, idx) => (
                    <div key={emp.key ?? idx} className="px-3 py-1 text-sm">
                      {emp.employeeName || emp.name || "-"}
                    </div>
                  ))}
                </div>
              ),
              rowExpandable: (record) =>
                (record.employeeDetail || []).length > 0,
              expandIcon: ({ expanded, onExpand, record }) =>
                (record.employeeDetail || []).length > 0 ? (
                  <button
                    className="flex items-center justify-center border rounded"
                    style={{
                      width: 18,
                      height: 18,
                      borderColor: "#0075BF",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={(e) => onExpand(record, e)}
                  >
                    {expanded ? (
                      <MinusOutlined style={{ fontSize: 10, color: "#0075BF" }} />
                    ) : (
                      <PlusOutlined style={{ fontSize: 10, color: "#0075BF" }} />
                    )}
                  </button>
                ) : null,
            }}
          />
        </div>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <div
          className="rounded-lg p-4"
          style={{ border: "1px solid #C8CDD4" }}
        >
          <p className="text-sm font-semibold mb-3">
            Attach File: <span className="text-red-500">*</span>
          </p>
          <TableRBI
            idTable="confirmation-attachment-table"
            dataSource={listDataAttachment}
            columns={columnsAttachment}
            totalData={listDataAttachment?.length || 0}
            usePagination={false}
            loading={false}
          />
        </div>
      ),
    },
  ];

  return (
    <Tabs
      defaultActiveKey="activities"
      items={tabItems}
      style={{ minHeight: 300 }}
    />
  );
};

export default ConfirmationCollectionActivities;
