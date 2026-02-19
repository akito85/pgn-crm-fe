import moment from "moment";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";
import { toTitleCase } from "../../../../../utils";
import { Badge } from "antd";

// Human-readable labels for TASK_BODY field keys (no underscores)
const FIELD_LABELS = {
  payment_number:     "Payment Ref",
  amount:             "Amount",
  currency:           "Currency",
  vendor_name:        "Vendor",
  payment_method:     "Payment Method",
  payment_date:       "Payment Date",
  approval_reason:    "Reason",
  customer_id:        "Customer ID",
  customer_name:      "Customer",
  customer_number:    "Customer No",
  account_number:     "Account No",
  account_name:       "Account",
  account_category:   "Account Type",
  account_segment:    "Segment",
  effective_date:     "Effective",
  expiry_date:        "Expiry",
  submitter_username: "Submitted By",
  validation_type:    "Validation",
  sa_number:          "SA Number",
  contract_value:     "Contract Value",
  contract_period:    "Period",
  service_type:       "Service Type",
  start_date:         "Start Date",
  end_date:           "End Date",
  billing_number:     "Billing No",
  billing_period:     "Billing Period",
  total_amount:       "Total Amount",
  pricing_name:       "Pricing",
  base_price:         "Base Price",
  product_name:       "Product",
  name:               "Name",
  code:               "Code",
  type:               "Type",
};

// Keys that are redundant or not useful in a compact preview
const SKIP_KEYS = new Set([
  "category", "entity_id", "message", "status", "description",
  "subject_id", "object_id",
]);

// Priority field order per category — most meaningful fields shown first
const PREVIEW_PRIORITY = {
  PAYMENT_RELATION:         ["account_number", "account_name", "customer_name", "amount", "currency"],
  INACTIVE_PAYMENT_RELATION:["account_number", "account_name", "customer_name", "amount", "currency"],
  SERVICE_AGREEMENT:        ["sa_number", "customer_name", "contract_value", "service_type"],
  UPDATE_SERVICE_AGREEMENT: ["sa_number", "customer_name", "contract_value", "service_type"],
  BILLING:                  ["billing_number", "customer_name", "total_amount", "billing_period"],
  PRICING:                  ["pricing_name", "base_price", "currency", "product_name"],
  PRICING_ADJUSTMENT:       ["adjustment_type", "adjustment_value", "product_name", "effective_date"],
};

const MAX_PREVIEW_FIELDS = 4;

/**
 * Builds a concise, human-readable preview from TASK_BODY JSON.
 * Returns an array of { label, value } pairs capped at MAX_PREVIEW_FIELDS.
 */
function buildTaskBodyPreview(taskBody, category) {
  if (!taskBody) return [];

  let parsed;
  try {
    parsed = typeof taskBody === "string" ? JSON.parse(taskBody) : taskBody;
  } catch {
    return [];
  }

  if (typeof parsed !== "object" || parsed === null) return [];

  const priorityKeys = PREVIEW_PRIORITY[category] || [];
  const selected = [];

  // Add priority keys first (in order), if present and non-null
  for (const key of priorityKeys) {
    if (selected.length >= MAX_PREVIEW_FIELDS) break;
    const val = parsed[key];
    if (val !== undefined && val !== null && String(val).trim() !== "" && !SKIP_KEYS.has(key)) {
      selected.push({ label: FIELD_LABELS[key] || key, value: String(val) });
    }
  }

  // Fill remaining slots with any other non-skipped, non-priority fields
  if (selected.length < MAX_PREVIEW_FIELDS) {
    const prioritySet = new Set(priorityKeys);
    for (const [key, val] of Object.entries(parsed)) {
      if (selected.length >= MAX_PREVIEW_FIELDS) break;
      if (prioritySet.has(key) || SKIP_KEYS.has(key)) continue;
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        selected.push({ label: FIELD_LABELS[key] || key.replace(/_/g, " "), value: String(val) });
      }
    }
  }

  return selected;
}

/**
 * Resolves approval status label and colour from COMPLETION_ACTION + TASK_STATUS.
 */
function resolveApprovalStatus(completionAction, taskStatus) {
  if (completionAction === "APPROVE") return { label: "Approved",          colour: "approved" };
  if (completionAction === "REJECT")  return { label: "Rejected",          colour: "rejected" };
  if (completionAction === "DELEGATE") return { label: "Delegated",        colour: "pending"  };

  const s = (taskStatus || "").toUpperCase();
  if (s === "CANCELLED") return { label: "Cancelled",          colour: "cancelled" };
  if (s === "EXPIRED")   return { label: "Expired",            colour: "inactive"  };
  if (s === "COMPLETED") return { label: "Completed",          colour: "completed" };

  return { label: "Awaiting Approval", colour: "pending" };
}

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
    dataIndex: "TASK_BODY",
    width: 340,
    render: (text, record) => {
      const body     = text || record.TASK_BODY || record.taskBody;
      const category = record.CATEGORY || record.category || "";
      const fields   = buildTaskBodyPreview(body, category);

      if (fields.length === 0) return <span style={{ color: "#bfbfbf" }}>—</span>;

      return (
        <span
          style={{
            fontSize: 12,
            color: "#595959",
            lineHeight: "1.6",
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 320,
          }}
          title={fields.map((f) => `${f.label}: ${f.value}`).join("  ·  ")}
        >
          {fields.map((f, i) => (
            <span key={f.label}>
              <span style={{ color: "#8c8c8c" }}>{f.label}:</span>{" "}
              <span style={{ color: "#262626" }}>{f.value}</span>
              {i < fields.length - 1 && (
                <span style={{ color: "#d9d9d9", margin: "0 6px" }}>·</span>
              )}
            </span>
          ))}
        </span>
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
      const completionAction = text || record.COMPLETION_ACTION || record.completionAction;
      const taskStatus       = record.TASK_STATUS || record.taskStatus;
      const { label, colour } = resolveApprovalStatus(completionAction, taskStatus);
      return (
        <div className="flex justify-center">
          <StatusComponent colour={colour} size="small">
            {label}
          </StatusComponent>
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
    width: 150,
    sorter: true,
    align: "center",
    filteredValue: [search?.createdAt] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "createdAt", searchInput, searchedColumn, searchText, handleSearch, true, "datetime"
    ),
    render: (text, record) => {
      const date = text || record.createdAt;
      return date ? moment(date).format("DD MMM YYYY HH:mm") : "-";
    },
  },
];
