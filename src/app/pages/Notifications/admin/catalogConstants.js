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
export const CHANNELS = ["TASKLIST", "EMAIL", "WHATSAPP", "SMS", "INAPP"];

// Friendly "source" model. Each source maps to a real backend ResolverType
// (SPEL_ON_PAYLOAD | NAMED_QUERY | JPA_PROJECTION | CONSTANT) and declares how
// its ref is entered. "From event data" and "Computed formula" are two modes of
// the same backend type; "Cross-module lookup" covers the two DB-backed types.
export const FIELD_SOURCES = [
  { key: "EVENT",    label: "From event data",     resolverType: "SPEL_ON_PAYLOAD", refKind: "text",
    refLabel: "Event field",  refHint: "e.g. objectAccountNumber" },
  { key: "FORMULA",  label: "Computed formula",    resolverType: "SPEL_ON_PAYLOAD", refKind: "text",
    refLabel: "Formula",      refHint: "e.g. ${amount} * 1.11" },
  { key: "CONSTANT", label: "Fixed value",         resolverType: "CONSTANT",        refKind: "text",
    refLabel: "Value",        refHint: "e.g. PGN" },
  { key: "LOOKUP",   label: "Cross-module lookup", resolverType: "NAMED_QUERY",     refKind: "lookup",
    refLabel: "Lookup",       refHint: "Pick a prepared lookup" },
];

// resolverType -> the source key used to drive the form when editing/displaying.
// Both SPEL modes collapse to EVENT for display (formula vs field is a UI-only
// distinction). JPA_PROJECTION shows as a lookup, same as NAMED_QUERY.
export const SOURCE_BY_RESOLVER_TYPE = {
  SPEL_ON_PAYLOAD: "EVENT",
  CONSTANT: "CONSTANT",
  NAMED_QUERY: "LOOKUP",
  JPA_PROJECTION: "LOOKUP",
};

// Friendly label for a stored field, for read-only display in tables/pickers.
export const sourceLabel = (resolverType) => {
  const key = SOURCE_BY_RESOLVER_TYPE[resolverType];
  const src = FIELD_SOURCES.find((s) => s.key === key);
  return src ? src.label : (resolverType || "-");
};

// The lookup resolver types whose refs come from /catalog/resolvers.
export const LOOKUP_RESOLVER_TYPES = ["NAMED_QUERY", "JPA_PROJECTION"];

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
  source:
    "Where this value comes from. Fixed value = a constant; From event data = a field already on the event; Computed formula = a calculation; Cross-module lookup = fetched from another module (pick from the list).",
  sourceRef:
    "The detail for the chosen source: the constant text, the event field name, the formula, or the selected lookup.",
};
