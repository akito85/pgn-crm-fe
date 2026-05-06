// ─── Payment Plan ─────────────────────────────────────────────────────────────

export const PAYMENT_PLAN_TYPES = {
  AUTOMATIC: "Automatic",
  MANUAL: "Manual",
  AUTOMATIC_KEY: "AUTOMATIC",
  MANUAL_KEY: "MANUAL",
};

export const PAYMENT_PLAN_TYPE_OPTIONS = [
  { label: "Automatic", value: PAYMENT_PLAN_TYPES.AUTOMATIC },
  { label: "Manual", value: PAYMENT_PLAN_TYPES.MANUAL },
];

// ─── Contact Criteria ─────────────────────────────────────────────────────────
export const CONTACT_INPUT_TYPES = {
  PHONE: "Phone",
  EMAIL: "Email",
  MOBILE_PHONE: "Mobile Phone",
};

export const CONTACT_INPUT_TYPE_OPTIONS = [
  { label: "Phone", value: CONTACT_INPUT_TYPES.PHONE },
  { label: "Email", value: CONTACT_INPUT_TYPES.EMAIL },
  { label: "Mobile Phone", value: CONTACT_INPUT_TYPES.MOBILE_PHONE },
];

export const CONTACT_PHONE_INPUT_TYPES = [
  CONTACT_INPUT_TYPES.PHONE,
  CONTACT_INPUT_TYPES.MOBILE_PHONE,
];

// ─── Country Code Options ──────────────────────────────────────────────────────

export const COUNTRY_CODE_OPTIONS = [
  { label: "IDN (+62)", value: "IDN (+62)" },
  { label: "SGP (+65)", value: "SGP (+65)" },
  { label: "MYS (+60)", value: "MYS (+60)" },
];

// ─── Contact Master Data (Dummy) ───────────────────────────────────────────────

export const JOB_OPTIONS = [
  { label: "Finance", value: "Finance" },
  { label: "Operations", value: "Operations" },
  { label: "Staff Engineer", value: "Staff Engineer" },
  { label: "Manager", value: "Manager" },
  { label: "Supervisor", value: "Supervisor" },
];

export const POSITION_OPTIONS = [
  { label: "Manager", value: "Manager" },
  { label: "Staff", value: "Staff" },
  { label: "Finance", value: "Finance" },
  { label: "Director", value: "Director" },
  { label: "Supervisor", value: "Supervisor" },
];

export const CONTACT_ADDRESS_OPTIONS = [
  { label: "Office", value: "Office" },
  { label: "Home", value: "Home" },
  { label: "Branch", value: "Branch" },
  { label: "Warehouse", value: "Warehouse" },
];

// ─── Customer / Account Status ────────────────────────────────────────────────

export const CUSTOMER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

// ─── Mandatory Attachments ───────────────────────────────────────────────────
export const RESTRUCTURE_MANDATORY_ATTACHMENTS = [
  "KTP",
  "Surat Permohonan",
  "Kartu Profil Pelanggan",
];
