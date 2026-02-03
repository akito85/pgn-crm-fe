export const RECEIPT_AND_COLLECTION_ROUTES = {
  // Receipt
  VIEW_RECEIPT: "/receipt-and-collection/receipt-list",
  CREATE_RECEIPT: "/receipt-and-collection/receipt-list/create",
  DETAIL_RECEIPT: "/receipt-and-collection/receipt-list/view",
  UPDATE_RECEIPT: "/receipt-and-collection/receipt-list/update",
  CREATE_ACCOUNTING: "/receipt-and-collection/receipt-list/create-accounting",
  // Receipt Reconciliation

  // Synchronize Receipt
  VIEW_SYNCHRONIZE_RECEIPT: "/receipt-and-collection/synchronize-receipt",
  DETAIL_SYNCHRONIZE_RECEIPT:
    "/receipt-and-collection/synchronize-receipt/view",

  // Reconcile Receipt Histories
  VIEW_RECONCILE_RECEIPT_HISTORIES:
    "/receipt-and-collection/reconcile-receipt-histories",

  // Maintain Electronic Bank Statement
  VIEW_MAINTAIN_ELECTRONIC_BANK_STATEMENT:
    "/receipt-and-collection/maintain-electronic-bank-statement",
  DETAIL_MAINTAIN_ELECTRONIC_BANK_STATEMENT:
    "/receipt-and-collection/maintain-electronic-bank-statement/view",
  UPLOAD_MAINTAIN_ELECTRONIC_BANK_STATEMENT:
    "/receipt-and-collection/maintain-electronic-bank-statement/upload",

  // Master data BANK
  VIEW_MASTER_BANK: "/receipt-and-collection/bank",
  DETAIL_MASTER_BANK: "/receipt-and-collection/bank/view",
  CREATE_MASTER_BANK: "/receipt-and-collection/bank/create",
  UPDATE_MASTER_BANK: "/receipt-and-collection/bank/update",
  CREATE_ACCOUNT_INFORMATION:
    "/receipt-and-collection/bank/account-information/create",
  UPDATE_ACCOUNT_INFORMATION:
    "/receipt-and-collection/bank/account-information/update",

  // receipt histories
  VIEW_RECEIPT_HISTORIES: "/receipt-and-collection/receipt-histories",
  DETAIL_RECEIPT_HISTORIES: "/receipt-and-collection/receipt-histories/view",

  // masterData payment item
  VIEW_PAYMENT_ITEM: "/receipt-and-collection/payment-method",
  DETAIL_PAYMENT_ITEM: "/receipt-and-collection/payment-method/view",
  CREATE_PAYMENT_ITEM: "/receipt-and-collection/payment-method/create",
  UPDATE_PAYMENT_ITEM: "/receipt-and-collection/payment-method/update",

  //master data trams calender
  VIEW_TRANSACTION_CALENDER: "/receipt-and-collection/transaction-calendar",
  DETAIL_TRANSACTION_CALENDER:
    "/receipt-and-collection/transaction-calendar/view",
  CREATE_TRANSACTION_CALENDER:
    "/receipt-and-collection/transaction-calendar/create",
  UPDATE_TRANSACTION_CALENDER:
    "/receipt-and-collection/transaction-calendar/update",

  //late charge
  VIEW_LATE_CHARGE: "/receipt-and-collection/late-charge-management",
  DETAIL_LATE_CHARGE: "/receipt-and-collection/late-charge-management/view",
  CREATE_LATE_CHARGE: "/receipt-and-collection/late-charge-management/create",
  RECALCULATE_LATE_CHARGE: "/receipt-and-collection/late-charge-management/recalculate",
  REPLACE_LATE_CHARGE: "/receipt-and-collection/late-charge-management/replace",
  REVERSE_LATE_CHARGE: "/receipt-and-collection/late-charge-management/reverse",

  //bridge
  VIEW_BRIDGE: "/receipt-and-collection/bridge",

  //transaction log
  VIEW_TRANSACTION_LOG: "/receipt-and-collection/transaction-log",

  //invoice
  VIEW_INVOICE: "/receipt-and-collection/invoice",

  VIEW_PARTNER: "/receipt-and-collection/partner",
  DETAIL_PARTNER: "/receipt-and-collection/partner/view",
  CREATE_PARTNER: "/receipt-and-collection/partner/create",
  UPDATE_PARTNER: "/receipt-and-collection/partner/update",

  //Payment
  VIEW_PAYMENT: "/receipt-and-collection/payment",
  VIEW_PARTNER_CA: "/receipt-and-collection/partner-ca",
  DETAIL_PARTNER_CA: "/receipt-and-collection/partner-ca/view",
  CREATE_PARTNER_CA: "/receipt-and-collection/partner-ca/create",
  UPDATE_PARTNER_CA: "/receipt-and-collection/partner-ca/update",

  // Ca Payment Channel
  VIEW_CA_PAYMENT_CHANNEL: "/receipt-and-collection/ca-payment-channel",
  DETAIL_CA_PAYMENT_CHANNEL: "/receipt-and-collection/ca-payment-channel/view",
  CREATE_CA_PAYMENT_CHANNEL: "/receipt-and-collection/ca-payment-channel/create",
  UPDATE_CA_PAYMENT_CHANNEL: "/receipt-and-collection/ca-payment-channel/update",

  // Settings
  VIEW_SETTINGS: "/receipt-and-collection/settings",
  DETAIL_SETTINGS: "/receipt-and-collection/settings/view",
  CREATE_SETTINGS: "/receipt-and-collection/settings/create",
  UPDATE_SETTINGS: "/receipt-and-collection/settings/update",

  // Collection Agent
  VIEW_COLLECTING_AGENT: "/receipt-and-collection/collecting-agent",
  DETAIL_COLLECTING_AGENT: "/receipt-and-collection/collecting-agent/view",
  CREATE_COLLECTING_AGENT: "/receipt-and-collection/collecting-agent/create",
  UPDATE_COLLECTING_AGENT: "/receipt-and-collection/collecting-agent/update",

  // Payment Channel
  VIEW_PAYMENT_CHANNEL: "/receipt-and-collection/payment-channel",
  DETAIL_PAYMENT_CHANNEL: "/receipt-and-collection/payment-channel/view",
  CREATE_PAYMENT_CHANNEL: "/receipt-and-collection/payment-channel/create",
  UPDATE_PAYMENT_CHANNEL: "/receipt-and-collection/payment-channel/update",

  // Accounting
  VIEW_ACCOUNTING: "/receipt-and-collection/accounting",

  // Deduction
  VIEW_DEDUCTION: "/receipt-and-collection/payment-warranty/deduction-list",
  DETAIL_DEDUCTION: "/receipt-and-collection/payment-warranty/deduction-list/view",
  CREATE_DEDUCTION: "/receipt-and-collection/payment-warranty/deduction-list/create",
  UPDATE_DEDUCTION: "/receipt-and-collection/payment-warranty/deduction-list/update",

  // Transfer to Receipt
  VIEW_TRANSFER_TO_RECEIPT: "/receipt-and-collection/payment-warranty/transfer-to-receipt",
  DETAIL_TRANSFER_TO_RECEIPT: "/receipt-and-collection/payment-warranty/transfer-to-receipt/view",
  CREATE_TRANSFER_TO_RECEIPT: "/receipt-and-collection/payment-warranty/transfer-to-receipt/create",

  // Transfer to Customer
  VIEW_TRANSFER_TO_CUSTOMER: "/receipt-and-collection/payment-warranty/transfer-to-customer",
  DETAIL_TRANSFER_TO_CUSTOMER: "/receipt-and-collection/payment-warranty/transfer-to-customer/view",
  CREATE_TRANSFER_TO_CUSTOMER: "/receipt-and-collection/payment-warranty/transfer-to-customer/create",

  // Warranty List
  VIEW_WARRANTY: "/receipt-and-collection/payment-warranty/warranty",
  DETAIL_WARRANTY: "/receipt-and-collection/payment-warranty/warranty/view",
  CREATE_WARRANTY: "/receipt-and-collection/payment-warranty/warranty/create",
  UPDATE_WARRANTY: "/receipt-and-collection/payment-warranty/warranty/update",

  // History Payment Warranty
  VIEW_HISTORY_PAYMENT_WARRANTY: "/receipt-and-collection/payment-warranty/history",

  // Gapura Management
  VIEW_GAPURA_MANAGEMENT: "/receipt-and-collection/gapura-management",
  DETAIL_GAPURA_MANAGEMENT: "/receipt-and-collection/gapura-management/view",

  // Payment Warranty Partner
  VIEW_PAYMENT_WARRANTY_PARTNER: "/receipt-and-collection/payment-warranty-partner",
  DETAIL_PAYMENT_WARRANTY_PARTNER: "/receipt-and-collection/payment-warranty-partner/view",
  CREATE_PAYMENT_WARRANTY_PARTNER: "/receipt-and-collection/payment-warranty-partner/create",
  UPDATE_PAYMENT_WARRANTY_PARTNER: "/receipt-and-collection/payment-warranty-partner/update",
};
