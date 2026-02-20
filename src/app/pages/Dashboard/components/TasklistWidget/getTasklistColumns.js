import moment from "moment";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";
import { toTitleCase } from "../../../../../utils";
import { Badge, Popover } from "antd";

const MAX_PREVIEW = 4;
const DATE_FORMAT  = "DD MMM YYYY HH:mm:ss";
const ISO_RE = /^\d{4}-\d{2}-\d{2}T/;

const fmtValue = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || s === "null") return null;
  if (ISO_RE.test(s)) return moment(s).format(DATE_FORMAT);
  return s;
};

const parseJson = (raw) => {
  if (!raw) return null;
  try { return typeof raw === "string" ? JSON.parse(raw) : raw; }
  catch { return null; }
};

// ─── SOURCE A: TRIGGER_JSON (camelCase) ──────────────────────────────────────
// M_NOTIFICATIONS.ADDITIONAL_DATA via V_TASK_WITH_NOTIFICATION join
const TRIGGER_LABELS = {
  accountNumber:     "Account No",
  accountName:       "Account",
  accountCategory:   "Account Type",
  accountSegment:    "Segment",
  customerId:        "Customer ID",
  customerName:      "Customer",
  customerNumber:    "Customer No",
  subjectId:         "Subject ID",
  objectId:          "Object ID",
  startDate:         "Start Date",
  endDate:           "End Date",
  validationType:    "Validation Type",
  submitterUsername: "Submitted By",
  hierarchyName:     "Approval Hierarchy",
  remarks:           "Remarks",
  description:       "Description",
  statusApproval:    "Approval Status",
};
const TRIGGER_SKIP = new Set([
  "id", "entityId", "category", "status", "updatedBy", "updatedDate",
  "createdBy", "createdDate", "approvalHierarchy", "appHierId",
  "submitterId", "action", "priority",
]);
const TRIGGER_PRIORITY = {
  PAYMENT_RELATION:          ["accountNumber", "accountName", "customerName", "customerNumber"],
  INACTIVE_PAYMENT_RELATION: ["accountNumber", "accountName", "customerName", "customerNumber"],
  SERVICE_AGREEMENT:         ["accountNumber", "customerName", "startDate", "endDate"],
  UPDATE_SERVICE_AGREEMENT:  ["accountNumber", "customerName", "startDate", "endDate"],
  BILLING:                   ["accountNumber", "customerName", "startDate", "endDate"],
  PRICING:                   ["accountNumber", "customerName", "validationType", "startDate"],
};

// ─── SOURCE B: TASK_BODY (snake_case) ────────────────────────────────────────
// Extracted subset by TaskBodyBuilderService — used as fallback when TRIGGER_JSON is null
const BODY_LABELS = {
  account_number:     "Account No",
  account_name:       "Account",
  account_category:   "Account Type",
  account_segment:    "Segment",
  customer_id:        "Customer ID",
  customer_name:      "Customer",
  customer_number:    "Customer No",
  subject_id:         "Subject ID",
  object_id:          "Object ID",
  effective_date:     "Start Date",
  expiry_date:        "End Date",
  payment_number:     "Payment Ref",
  amount:             "Amount",
  currency:           "Currency",
  vendor_name:        "Vendor",
  payment_method:     "Payment Method",
  payment_date:       "Payment Date",
  approval_reason:    "Reason",
  submitter_username: "Submitted By",
  validation_type:    "Validation Type",
  sa_number:          "SA Number",
  description:        "Description",
  remarks:            "Remarks",
};
const BODY_SKIP = new Set(["category", "entity_id", "message", "status"]);
const BODY_PRIORITY = {
  PAYMENT_RELATION:          ["account_number", "account_name", "customer_name", "customer_number"],
  INACTIVE_PAYMENT_RELATION: ["account_number", "account_name", "customer_name", "customer_number"],
  SERVICE_AGREEMENT:         ["sa_number", "customer_name", "effective_date", "expiry_date"],
  UPDATE_SERVICE_AGREEMENT:  ["sa_number", "customer_name", "effective_date", "expiry_date"],
  BILLING:                   ["account_number", "customer_name", "effective_date", "expiry_date"],
  PRICING:                   ["account_number", "customer_name", "validation_type", "effective_date"],
};

/** Build preview from a parsed JSON object using provided label/skip/priority maps. */
const buildPreview = (data, category, labelMap, skipSet, priorityMap) => {
  if (!data || typeof data !== "object") return [];
  const priority = priorityMap[category] || [];
  const result   = [];

  for (const key of priority) {
    if (result.length >= MAX_PREVIEW) break;
    const val = fmtValue(data[key]);
    if (val) result.push({ label: labelMap[key] || key, value: val });
  }

  if (result.length < MAX_PREVIEW) {
    const seen = new Set(priority);
    for (const [key, raw] of Object.entries(data)) {
      if (result.length >= MAX_PREVIEW) break;
      if (seen.has(key) || skipSet.has(key)) continue;
      const val = fmtValue(raw);
      if (val) result.push({ label: labelMap[key] || key.replace(/_/g, " "), value: val });
    }
  }

  return result;
};

/** Build full detail rows for the popover using provided label/skip maps. */
const buildDetail = (data, labelMap, skipSet) => {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data)
    .filter(([k, v]) => !skipSet.has(k) && fmtValue(v) !== null)
    .map(([k, v]) => ({ label: labelMap[k] || k.replace(/_/g, " "), value: fmtValue(v) }));
};

/** Resolve approval status label + colour from COMPLETION_ACTION + TASK_STATUS */
const resolveApprovalStatus = (completionAction, taskStatus) => {
  if (completionAction === "APPROVE")  return { label: "Approved",         colour: "approved" };
  if (completionAction === "REJECT")   return { label: "Rejected",          colour: "rejected" };
  if (completionAction === "DELEGATE") return { label: "Delegated",         colour: "pending"  };
  const s = (taskStatus || "").toUpperCase();
  if (s === "CANCELLED") return { label: "Cancelled",         colour: "cancelled" };
  if (s === "EXPIRED")   return { label: "Expired",           colour: "inactive"  };
  if (s === "COMPLETED") return { label: "Completed",         colour: "completed" };
  return { label: "Awaiting Approval", colour: "pending" };
};

export const getTasklistColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    dataIndex: "no",
    width: 40,
    render: (_, __, index) => index + 1,
  },
  {
    key: "taskSubject",
    title: "TASK SUBJECT",
    dataIndex: "TASK_SUBJECT",
    width: 240,
    sorter: true,
    filteredValue: [search?.taskSubject] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "taskSubject", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text, record) => (
      <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
        {text || record.taskSubject || "-"}
      </span>
    ),
  },
  {
    key: "taskBody",
    title: "TASK BODY",
    dataIndex: "TRIGGER_JSON",
    width: 340,
    render: (triggerRaw, record) => {
      // Prefer ADDITIONAL_INFO (explicit enriched field from M_NOTIFICATIONS join),
      // then TRIGGER_JSON (same source, legacy name), then TASK_BODY (snake_case fallback)
      const category    = record.CATEGORY || record.category || "";
      const triggerData = parseJson(
        record.ADDITIONAL_INFO || record.additionalInfo ||
        triggerRaw || record.TRIGGER_JSON || record.triggerJson
      );
      const bodyData    = parseJson(record.TASK_BODY || record.taskBody);
      const [data, labelMap, skipSet, priorityMap] = triggerData
        ? [triggerData, TRIGGER_LABELS, TRIGGER_SKIP, TRIGGER_PRIORITY]
        : [bodyData,    BODY_LABELS,    BODY_SKIP,    BODY_PRIORITY];
      const preview  = buildPreview(data, category, labelMap, skipSet, priorityMap);
      const detail   = buildDetail(data, labelMap, skipSet);

      if (preview.length === 0) return <span style={{ color: "#bfbfbf" }}>—</span>;

      const popoverContent = (
        <div style={{ width: 380, maxHeight: 420, overflowY: "auto" }}>
          {detail.length === 0 ? (
            <span style={{ color: "#bfbfbf" }}>No details available.</span>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <tbody>
                {detail.map((f) => (
                  <tr key={f.label} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td style={{ padding: "5px 12px 5px 0", color: "#8c8c8c", whiteSpace: "nowrap", verticalAlign: "top", fontWeight: 500, width: 130 }}>
                      {f.label}
                    </td>
                    <td style={{ padding: "5px 0", color: "#262626", wordBreak: "break-word" }}>
                      {f.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );

      return (
        <Popover
          content={popoverContent}
          title={<span style={{ fontSize: 13, fontWeight: 600 }}>Task Details</span>}
          trigger="click"
          placement="bottomLeft"
          overlayStyle={{ zIndex: 1050 }}
        >
          <span
            style={{
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 320,
              cursor: "pointer",
              borderBottom: "1px dashed #d9d9d9",
            }}
            title="Click to expand"
          >
            {preview.map((f, i) => (
              <span key={f.label} style={{ fontSize: 12 }}>
                <span style={{ color: "#8c8c8c" }}>{f.label}:</span>{" "}
                <span style={{ color: "#262626" }}>{f.value}</span>
                {i < preview.length - 1 && (
                  <span style={{ color: "#d9d9d9", margin: "0 6px" }}>·</span>
                )}
              </span>
            ))}
          </span>
        </Popover>
      );
    },
  },
  {
    key: "approvalStatus",
    title: "APPROVAL STATUS",
    dataIndex: "COMPLETION_ACTION",
    width: 150,
    align: "center",
    render: (text, record) => {
      const action     = text || record.COMPLETION_ACTION || record.completionAction;
      const taskStatus = record.TASK_STATUS || record.taskStatus;
      const { label, colour } = resolveApprovalStatus(action, taskStatus);
      return (
        <div className="flex justify-center">
          <StatusComponent colour={colour} size="small">{label}</StatusComponent>
        </div>
      );
    },
  },
  {
    key: "taskStatus",
    title: "STATUS",
    dataIndex: "TASK_STATUS",
    width: 120,
    sorter: true,
    align: "center",
    filteredValue: [search?.taskStatus] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "taskStatus", searchInput, searchedColumn, searchText, handleSearch, true,
      "select",
      [
        { value: "PENDING",     label: "Pending"     },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED",   label: "Completed"   },
        { value: "REJECTED",    label: "Rejected"    },
        { value: "CANCELLED",   label: "Cancelled"   },
      ]
    ),
    render: (text, record) => {
      const status = text || record.taskStatus || "-";
      return (
        <div className="flex justify-center">
          <StatusComponent colour={status}>{toTitleCase(status)}</StatusComponent>
        </div>
      );
    },
  },
  {
    key: "priority",
    title: "PRIORITY",
    dataIndex: "PRIORITY",
    width: 100,
    sorter: true,
    align: "center",
    filteredValue: [search?.priority] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "priority", searchInput, searchedColumn, searchText, handleSearch, true,
      "select",
      [
        { value: "1", label: "Low"      },
        { value: "2", label: "Normal"   },
        { value: "3", label: "High"     },
        { value: "4", label: "Urgent"   },
        { value: "5", label: "Critical" },
      ]
    ),
    render: (text, record) => {
      const priority = text || record.priority;
      const colorMap = { 1: "green", 2: "blue", 3: "orange", 4: "red", 5: "red" };
      const labelMap = { 1: "Low", 2: "Normal", 3: "High", 4: "Urgent", 5: "Critical" };
      return <Badge color={colorMap[priority] || "default"} text={labelMap[priority] || "-"} />;
    },
  },
  {
    key: "taskSender",
    title: "SENDER",
    dataIndex: "TASK_SENDER",
    width: 180,
    filteredValue: [search?.taskSender] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "taskSender", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text, record) => text || record.taskSender || "-",
  },
  {
    key: "createdAt",
    title: "RECEIVED",
    dataIndex: "CREATED_AT",
    width: 170,
    sorter: true,
    align: "center",
    filteredValue: [search?.createdAt] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "createdAt", searchInput, searchedColumn, searchText, handleSearch, true, "datetime"
    ),
    render: (text, record) => {
      const date = text || record.createdAt;
      return date ? moment(date).format(DATE_FORMAT) : "-";
    },
  },
];
