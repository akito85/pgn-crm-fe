export const ACCOUNT_MANAGEMENT_ROUTES = {
  // Customer/Account
  VIEW_CUSTOMER: "/account-management/customers",

  //View Account Standard
  VIEW_ACCOUNT_STANDARD: "/account-management/account-standard",
  CREATE_ACCOUNT_STANDARD: "/account-management/account-standard/create",
  VIEW_DETAIL_ACCOUNT_STANDARD: "/account-management/account-standard/view",

  // Account One Time
  VIEW_ACCOUNT_ONETIME: "/account-management/account-onetime",
  CREATE_ACCOUNT_ONETIME: "/account-management/account-onetime/create",
  VIEW_DETAIL_ACCOUNT_ONETIME: "/account-management/account-onetime/view",

  // Service Request Detail
  VIEW_DETAIL_SERVICE_REQUEST: "/account-management/account-standard/service-requests/details",
  CREATE_SERVICE_REQUEST: "/account-management/account-standard/service-requests/create",
  UPDATE_SERVICE_REQUEST: "/account-management/account-standard/service-requests/update",
  DELETE_SERVICE_REQUEST: "/account-management/account-standard/service-requests/delete",

  CREATE_SERVICE_REQUEST_PREREQUISITE: "/account-management/account-standard/service-requests/pre-requisites/create",

  // Payment Relation Detail
  VIEW_DETAIL_PAYMENT_RELATION: "/account-management/account-standard/financial-information/payment-relation/view",
  CREATE_PAYMENT_RELATION: "/account-management/account-standard/financial-information/payment-relation/create",
  UPDATE_PAYMENT_RELATION: "/account-management/account-standard/financial-information/payment-relation/update",

  // Invoice Relation Detail
  VIEW_DETAIL_INVOICE_RELATION: "/account-management/account-standard/financial-information/invoice-relation/view",
  CREATE_INVOICE_RELATION: "/account-management/account-standard/financial-information/invoice-relation/create",
  UPDATE_INVOICE_RELATION: "/account-management/account-standard/financial-information/invoice-relation/update",

  //Detail Service Agreement
  VIEW_DETAIL_SERVICE_AGREEMENT:
    "/account-management/account-standard/service-agreement/view",

  //Create Service Agreement
  CREATE_SERVICE_AGREEMENT_MAIN:
    "/account-management/account-standard/service-agreement-main/create",
  CREATE_SERVICE_AGREEMENT_ADDON:
    "/account-management/account-standard/service-agreement-addon/create",
  CREATE_SERVICE_AGREEMENT_AMANDEMEN:
    "/account-management/account-standard/service-agreement-amandemen/create",

  //Update Service Agreement
  UPDATE_SERVICE_AGREEMENT:
    "/account-management/account-standard/service-agreement/update",

  //Create Detail Address Standard
  CREATE_ACCOUNT_ADDRESS: "/account-management/account-standard/address/create",

  //Update Detail Address Standard
  UPDATE_ACCOUNT_ADDRESS: "/account-management/account-standard/address/update",

  //Create Detail Address One Time
  CREATE_ACCOUNT_ADDRESS_ONETIME:
    "/account-management/account-onetime/address/create",

  //Update Detail Address One Time
  UPDATE_ACCOUNT_ADDRESS_ONETIME:
    "/account-management/account-onetime/address/update",

  //Create Detail Account Contact Standard
  CREATE_ACCOUNT_CONTACT: "/account-management/account-standard/contact/create",

  //Update Detail Account Contact Standard
  UPDATE_ACCOUNT_CONTACT: "/account-management/account-standard/contact/update",

  //Create Detail Account Contact Onetime
  CREATE_ACCOUNT_CONTACT_ONETIME:
    "/account-management/account-onetime/contact/create",

  //Update Detail Account Contact Onetime
  UPDATE_ACCOUNT_CONTACT_ONETIME:
    "/account-management/account-onetime/contact/update",

  // Gas Source
  DETAIL_GAS_SOURCE: "/system-setup/gas-sources/view",
  CREATE_GAS_SOURCE: "/system-setup/gas-sources/create",
  UPDATE_GAS_SOURCE: "/system-setup/gas-sources/update",
  VIEW_GAS_SOURCE: "/system-setup/gas-sources",
  UPLOAD_GAS_SOURCE: "/system-setup/gas-sources/upload",

  // Multi Destination
  VIEW_DETAIL_MULTI_DESTINATION: "/account-management/account-standard/multi-destination/view",
  CREATE_MULTI_DESTINATION: "/account-management/account-standard/multi-destination/create",
  UPDATE_MULTI_DESTINATION: "/account-management/account-standard/multi-destination/update",

  //Premise
  DETAIL_PREMISE: "/account-management/account-standard/premise/view",

  //Service Point
  DETAIL_SERVICE_POINT:
    "/account-management/account-standard/service-point/view",
  CREATE_ASSET_POINT:
    "/account-management/account-standard/service-point/asset/create",

  //Account standard
  UPDATE_ACCOUNT_STANDARD:
    "/account-management/account-standard/account-information/update",

  //Account OneTime
  UPDATE_ACCOUNT_ONETIME:
    "/account-management/account-onetime/account-information/update",

  //Relationship Account Standard
  CREATE_RELATIONSHIP:
    "/account-management/account-standard/relationship/create",
  UPDATE_RELATIONSHIP:
    "/account-management/account-standard/relationship/update",
  DETAIL_RELATIONSHIP:
    "/account-management/account-standard/relationship/view",

  //Relationship Account Standard
  CREATE_RELATIONSHIP_ONETIME:
    "/account-management/account-onetime/relationship/create",
  UPDATE_RELATIONSHIP_ONETIME:
    "/account-management/account-onetime/relationship/update",
  DETAIL_RELATIONSHIP_ONETIME:
    "/account-management/account-onetime/relationship/view",

  //SA-Approve-Reject-TOS
  APPROVE_REJECT_TOS:
    "/account-management/account-standard/service-agreement/tos/view",

  //Customer
  DETAIL_CUSTOMER: "/account-management/customers/view",
  UPDATE_CUSTOMER: "/account-management/customers/update",

  //TOS SUBMISSION
  CREATE_TOS_SUBMISSION:
    "/account-management/account-standard/service-agreement/tos/create",
  UPDATE_TOS_SUBMISSION:
    "/account-management/account-standard/service-agreement/tos/update",
  DETAIL_TOS_SUBMISSION:
    "/account-management/account-standard/service-agreement/tos/view",

  // Raw Material Source
  CREATE_RAW_MATERIAL_SOURCE:
    "/account-management/account-standard/raw-material-source/create",
  UPDATE_RAW_MATERIAL_SOURCE:
    "/account-management/account-standard/raw-material-source/update",
    
    // Product Distribution
    CREATE_PRODUCT_DISTRIBUTION:
      "/account-management/account-standard/product-distribution/create",
    UPDATE_PRODUCT_DISTRIBUTION:
      "/account-management/account-standard/product-distribution/update",

  // MASTER DATA
  // METER READING CODE
  VIEW_METER_READING_CODES: "/system-setup/meter-reading-codes",
  CREATE_METER_READING_CODES: "/system-setup/meter-reading-codes/create",
  UPDATE_METER_READING_CODES: "/system-setup/meter-reading-codes/update",
  DETAIL_METER_READING_CODES: "/system-setup/meter-reading-codes/view",
  UPLOAD_METER_READING_CODES: "/system-setup/meter-reading-codes/upload",

  // CONTACT
  VIEW_CONTACT: "/system-setup/master-contact",
  CREATE_CONTACT: "/system-setup/master-contact/create",
  UPDATE_CONTACT: "/system-setup/master-contact/update",
  DETAIL_CONTACT: "/system-setup/master-contact/view",

  // LOCATIONS
  VIEW_LOCATIONS: "/system-setup/locations",
  CREATE_LOCATIONS: "/system-setup/locations/create",
  UPDATE_LOCATIONS: "/system-setup/locations/update",
  DETAIL_LOCATIONS: "/system-setup/locations/view",
  UPLOAD_LOCATIONS: "/system-setup/locations/upload",

  // ADDRESSES
  VIEW_ADDRESSES: "/system-setup/addresses",
  CREATE_ADDRESSES: "/system-setup/addresses/create",
  UPDATE_ADDRESSES: "/system-setup/addresses/update",
  DETAIL_ADDRESSES: "/system-setup/addresses/view",
  UPLOAD_ADDRESSES: "/system-setup/addresses/upload",

  // ACCOUNTING RULES
  VIEW_ACCOUNTING_RULES: "/system-setup/accounting-rules",
  CREATE_ACCOUNTING_RULES: "/system-setup/accounting-rules/create",
  UPDATE_ACCOUNTING_RULES: "/system-setup/accounting-rules/update",
  DETAIL_ACCOUNTING_RULES: "/system-setup/accounting-rules/view",
  UPLOAD_ACCOUNTING_RULES: "/system-setup/accounting-rules/upload",

  // LATE CHARGES
  VIEW_LATE_CHARGES: "/system-setup/late-charges",
  CREATE_LATE_CHARGES: "/system-setup/late-charges/create",
  UPDATE_LATE_CHARGES: "/system-setup/late-charges/update",
  DETAIL_LATE_CHARGES: "/system-setup/late-charges/view",

  // LATE CHARGES RULE
  CREATE_LATE_CHARGES_RULE: "/system-setup/late-charges-rule/create",
  UPDATE_LATE_CHARGES_RULE: "/system-setup/late-charges-rule/update",
  DETAIL_LATE_CHARGES_RULE: "/system-setup/late-charges-rule/view",

  //TAX IMPLICATION
  VIEW_TAX_IMPLICATION: "/system-setup/tax-implication",
  CREATE_TAX_IMPLICATION: "/system-setup/tax-implication/create",
  UPDATE_TAX_IMPLICATION: "/system-setup/tax-implication/update",
  DETAIL_TAX_IMPLICATION: "/system-setup/tax-implication/view",

  // TAX IMPLICATION RULE
  CREATE_TAX_IMPLICATION_RULE: "/system-setup/tax-implication-rule/create",
  UPDATE_TAX_IMPLICATION_RULE: "/system-setup/tax-implication-rule/update",
  DETAIL_TAX_IMPLICATION_RULE: "/system-setup/tax-implication-rule/view",

  // GS UTILIZATION
  CREATE_GAS_UTILIZATION: "/account-management/account-standard/gas-utilization/create",
  UPDATE_GAS_UTILIZATION: "/account-management/account-standard/gas-utilization/update",
  
};
