// Static vocabularies for the notification field-catalogue register form.
// No Global Types dependency. dataType/resolverType/channel mirror the backend
// whitelist; submodules are the approval-flow categories (ApprovalCategory enum)
// each backend module triggers via addApprovalFlowR.

export const MODULES = [
  { value: "ACC", label: "Account Management" },
  { value: "UM", label: "User Management" },
  { value: "MST", label: "Product Promo Management" },
  { value: "RBI", label: "RBI Management" },
];

// Submodule = the approval category the field belongs to. Create-only categories
// per module; INACTIVE_* variants are omitted (combobox still allows typing one).
export const MODULE_SUBMODULES = {
  ACC: [
    "ACCOUNT_RELATIONSHIP", "INVOICE_RELATION", "PAYMENT_RELATION",
    "SERVICE_AGREEMENT", "LATE_CHARGE_RULE", "TAX_IMPLICATION_RULE",
    "TOS_SUBMISSION",
  ],
  MST: [
    "PRICING", "PRICING_ADJUSTMENT", "PRICING_RULE", "PRODUCT",
    "PRODUCT_PROMO", "PRODUCT_VERSION", "EXTEND_PRODUCT_VERSION",
    "TERMINATE_PRODUCT_VERSION",
  ],
  UM: ["USER_DELEGATION"],
  RBI: [
    "BILLING", "BILLING_BUCKET", "BILLING_CYCLE", "BILLING_ITEM",
    "ADJUSTMENT_BILLING", "CREATE_USAGE", "DAILY_RATES", "GENERAL_TEMPLATE",
    "INSTALLMENT", "INSTALLMENT_EARLY_REPAYMENT", "INVOICE_TEMPLATE", "POS",
    "TAX_CODE", "TERMS_OF_PAYMENT",
  ],
};

export const DATA_TYPES = ["STRING", "NUMBER", "DATE", "BOOLEAN", "CURRENCY"];
export const RESOLVER_TYPES = ["PAYLOAD", "JOIN", "STATIC", "EXPRESSION"];
export const CHANNELS = ["TASKLIST", "EMAIL", "WHATSAPP", "SMS", "INAPP"];

// string[] -> [{ value, label }] for NxSelect.
export const toOptions = (arr) => arr.map((v) => ({ value: v, label: v }));

// Per-field tooltip copy: plain definition + example.
export const FIELD_HELP = {
  fieldKey:
    "The ${token} name used inside templates. Lowercase with underscores. Example: object_account_number",
  displayLabel:
    "Human-friendly label shown in the field picker. Example: Account Number",
  dataType:
    "How the value is formatted when rendered. Example: CURRENCY formats 1000000 as Rp 1.000.000",
  module: "Which management module owns this field. Drives grouping in the picker.",
  submodule:
    "The approval category the field belongs to. Example: PAYMENT_RELATION",
  resolverType:
    "Where the value comes from at send time. PAYLOAD = straight from the event payload; JOIN = pulled from another module's table; STATIC = a constant; EXPRESSION = computed.",
  resolverRef:
    "The exact source reference. PAYLOAD: the payload key (payload.objectAccountNumber). JOIN: the named query/relation.",
  isJoined: "Turn on when the value reaches another module through a curated join.",
  sourceRelation: "Label of the joined table/relation. Example: M_ACCOUNT",
};

// resolverRef placeholder driven by the chosen resolver type.
export const RESOLVER_REF_PLACEHOLDER = {
  PAYLOAD: "e.g. payload.objectAccountNumber",
  JOIN: "e.g. accountByObjectId",
  STATIC: "e.g. PGN",
  EXPRESSION: "e.g. ${amount} * 1.11",
};
