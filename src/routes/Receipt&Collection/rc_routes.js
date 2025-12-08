export const RECEIPT_AND_COLLECTION_ROUTES = {
  // Receipt
  VIEW_RECEIPT: "/receipt-and-collection/receipt-list",
  CREATE_RECEIPT: "/receipt-and-collection/receipt-list/create",
  DETAIL_RECEIPT: "/receipt-and-collection/receipt-list/view",
  UPDATE_RECEIPT: "/receipt-and-collection/receipt-list/update",
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

  //bridge
  VIEW_BRIDGE: "/receipt-and-collection/bridge",
  
  //invoice
  VIEW_INVOICE: "/receipt-and-collection/invoice",

  VIEW_PARTNER: "/receipt-and-collection/partner",
  DETAIL_PARTNER: "/receipt-and-collection/partner/view",
  CREATE_PARTNER: "/receipt-and-collection/partner/create",
  UPDATE_PARTNER: "/receipt-and-collection/partner/update",
};
