import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import throttle from 'redux-throttle';
import authReducer from "../slices/user_management/auth";
import messageReducer from "../slices/message";
import entityReducer from "../slices/system_setup/entity";
import userReducer from "../slices/user_management/user";
import employeeReducer from "../slices/user_management/employee";
import globalPropertiesReducer from "../slices/system_setup/globalProperties";
import masterPositionReducer from "../slices/system_setup/master_data/master_position";
import globalTypesReducer from "../slices/system_setup/globalTypes";
import groupAccessReducer from "../slices/system_setup/group_access";
import masterCostCenterReducer from "../slices/system_setup/master_data/master_cost_center";
import masterJobReducer from "../slices/system_setup/master_data/master_job";
import loginBackgroundReducer from "../slices/system_setup/login_background";
import announcementReducer from "../slices/system_setup/announcement";
import maintenanceModeReducer from "../slices/system_setup/maintenanceMode";
import delegationReducer from "../slices/user_management/delegation";
import userLevelReducer from "../slices/user_management/user_level_slice";
import dataReducer from "../slices/data_slice";
import profileReducer from "../slices/user_management/profile";
import actionReducer from "../slices/system_setup/action";
import monitoringSessionReducer from "../slices/monitoring_session";
import approvHierarchyReducer from "../slices/user_management/hierarchySlice";
import mainMenuReducer from "../slices/system_setup/menu";
import dataAccessReducer from "../slices/user_management/data_access";
import generalReducer from "../slices/general_slice";
import productClassReducer from "../slices/product_promo/ProductClass/ProductClassSlice";
import pricingReducer from "../slices/product_promo/pricing";
import pricingRuleReducer from "../slices/product_promo/PricingRule/PricingRuleSlice";
import productReducer from "../slices/product_promo/product";
import pricingAdjustReducer from "../slices/product_promo/pricingAdjust";
import tosReducer from "../slices/product_promo/tos";
import acccountManagerReducer from "../slices/account_management/accountManagement";
import calculationReducer from "../slices/rating_billing_invoice/calculation";
import prabillingReducer from "../slices/rating_billing_invoice/praBilling";
import monitoringReducer from "../slices/rating_billing_invoice/monitoringSlice";
import efakturReducer from "../slices/rating_billing_invoice/efakturSlice";
import receiptReducer from "../slices/receipt_collection/receipt";
import acccountAddressReducer from "../slices/account_management/detailAccount/accountAddressSlice";
import accountGasSourceReducer from "../slices/account_management/detailAccount/accountGasSource";
import receiptHistoriesReducer from "../slices/receipt_collection/receiptHistories";
import gasSourceReducer from "../slices/account_management/MasterData/gasSourceSlice";
import bankReducer from "../slices/receipt_collection/bankSlice";
import electronicReducer from "../slices/receipt_collection/electrionicBank";
import acccountContactReducer from "../slices/account_management/detailAccount/accountContactSlice";
import monitoringUsageReducer from "../slices/rating_billing_invoice/monitoring_usage";
import itemReducer from "../slices/receipt_collection/paymentItem";
import billingReducer from "../slices/rating_billing_invoice/billing";
import adjustmentBillingReducer from "../slices/rating_billing_invoice/adjustmentBilling";
import adjustmentInvoiceReducer from "../slices/rating_billing_invoice/adjustmentInvoice";
import rbiAccountingReducer from "../slices/rating_billing_invoice/accounting";
import accountReducer from "../slices/account_management/Account/accountSlice";
import cycleReducer from "../slices/receipt_collection/transactionCalender";
import financialInformationReducer from "../slices/account_management/detailAccount/FinancialInformationSlice";
import ratingReducer from "../slices/rating_billing_invoice/rating";
import servicePointReducer from "../slices/account_management/detailAccount/ServicePoint";
import premiseReducer from "../slices/account_management/detailAccount/Premise";
import distributionMediaReducer from "../slices/account_management/detailAccount/DistributionMedia";
import customerAccountReducer from "../slices/account_management/Customer/customerAccount";
import lateReducer from "../slices/receipt_collection/lateCharge";
import accountServiceAgreementReducer from "../slices/account_management/detailAccount/serviceAgreementSlice";
import postOfSalesReducer from "../slices/rating_billing_invoice/PointOfSales";
import tosSubmissionReducer from "../slices/account_management/detailAccount/tosSubmissionSlice";
import saWarrantyReducer from "../slices/account_management/detailAccount/warrantySlice";
import invoiceReducer from "../slices/rating_billing_invoice/invoice";
import proformaInvoiceReducer from "../slices/rating_billing_invoice/proformaInvoice";
import attachmentReducer from "../slices/attachmentSlice";
import locationReducer from "../slices/account_management/MasterData/location_slice";
import addressesReducer from "../slices/account_management/MasterData/addresses_slice";
import contactReducer from "../slices/account_management/MasterData/contact_slice";
import meterReadingCodeReducer from "../slices/account_management/MasterData/meter_reading_code_slice";
import accountingRulesReducer from "../slices/account_management/MasterData/accounting_rules";
import lateChargeReducer from "../slices/account_management/MasterData/late_charges";
import taxImplicationReducer from "../slices/account_management/MasterData/tax_implication";
import assetsReducer from "../slices/account_management/MasterData/assets_slice";
import generalTemplateReducer from "../slices/rating_billing_invoice/MasterData/general_template";
import billingItemReducer from "../slices/rating_billing_invoice/billingItem";
import billingBucketReducer from "../slices/rating_billing_invoice/MasterData/billingBucket";
import rateTypeReducer from "../slices/rating_billing_invoice/MasterData/rateType";
import dailyrateReducer from "../slices/rating_billing_invoice/MasterData/dailyrate";
import billingCycleReducer from "../slices/rating_billing_invoice/MasterData/billingCycle";
import invoiceTemplateReducer from "../slices/rating_billing_invoice/MasterData/invoiceTemplate";
import termsofPaymentReducer from "../slices/rating_billing_invoice/MasterData/termsofPayment";
import taxCodeReducer from "../slices/rating_billing_invoice/MasterData/taxCode";
import promoReducer from "../slices/product_promo/promoSlice";
import positionHierarchyReducer from "../slices/user_management/position_hirarchy";
import rawMaterialSourceReducer from "../slices/account_management/detailAccount/RawMaterialDistributionSlice";
import productDistributionReducer from "../slices/account_management/detailAccount/ProductDistributionSlice";
import accountGasUtilizationReducer from "../slices/account_management/detailAccount/gasUtilizationSlice";
import additionalInfoReducer from "../slices/account_management/detailAccount/additionalInformation";
import equpmentReducer from "../slices/account_management/detailAccount/equpmentSlice";
import criteriaReducer from "../slices/criteria_slice";
import { reportCustomerSlice } from "../slices/report/report_customer_slice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { reportCustomerAgreementSlice } from "../slices/report/report_customer_agreement";
import { tasklistSlice } from "../slices/tasklist/tasklistSlice";
import emeteraiReducer from "../slices/rating_billing_invoice/emeterai";
import taxExemptionReducer from "../slices/rating_billing_invoice/taxExemption";
import gracePeriodReducer from "../slices/debt_and_collection/gracePeriod";
import activityNameReducer from "../slices/debt_and_collection/activityName";
import templateRemindingReducer from "../slices/debt_and_collection/templateReminding";
import activityTypeReducer from "../slices/debt_and_collection/activityType";
import activityActionReducer from "../slices/debt_and_collection/activityAction";
import activitiesReducer from "../slices/debt_and_collection/activities";
import transactionReportReducer from "../slices/debt_and_collection/transactionReport";
import managementDeliveryInvoiceReducer from "../slices/rating_billing_invoice/managementDeliveryInvoice";
import masterEfakturCodeReducer from "../slices/rating_billing_invoice/MasterData/efakturCode";
// import masterDigitalSignatureReducer from "../slices/rating_billing_invoice/MasterData/digitalSignature";
import bridgeReducer from "../slices/receipt_collection/bridge";
import transactionLogReducer from "../slices/receipt_collection/transactionLog";
import invoiceMasterDataReducer from "../slices/receipt_collection/invoice";
import paymentMasterDataReducer from "../slices/receipt_collection/payment";
import partnerReducer from "../slices/receipt_collection/partner";
import partnerCaReducer from "../slices/receipt_collection/partnerCa";
import caPaymentChannelReducer from "../slices/receipt_collection/caPaymentChannel";
import collectingAgentReducer from "../slices/receipt_collection/collectingAgent";
import paymentChannelReducer from "../slices/receipt_collection/paymentChannel";
import digitalSignatureReducer from "../slices/rating_billing_invoice/MasterData/digitalSignature";
import settingReducer from "../slices/receipt_collection/setting";
import glAccountReducer from "../slices/rating_billing_invoice/MasterData/glAccount";
import contentManagementReducer from "../slices/rating_billing_invoice/MasterData/contentManagement";
import installmentReducer from "../slices/rating_billing_invoice/installment";
import accountPromoReducer from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Promo/store/slices/promoSlice";
import accountingReducer from "../slices/receipt_collection/accounting";
import relationshipReducer from "../slices/account_management/detailAccount/relationshipSlice";
import standaloneRelationshipReducer from "../slices/relationship/standaloneRelationshipSlice";
import warrantyReducer from "../slices/receipt_collection/warranty";
import transferToReceiptReducer from "../slices/receipt_collection/transferToReceipt";
import transferToCustomerReducer from "../slices/receipt_collection/transferToCustomer";
import restructureReducer from "../slices/receipt_collection/restructure";
import restructureMonitoringReducer from "../slices/receipt_collection/restructureMonitoring";
import notificationsReducer from "../slices/notifications";
import multiDestinationReducer from "../slices/account_management/detailAccount/MultiDestinationSlice";
import gasDepositReducer from "../slices/account_management/detailAccount/GasDepositSlice";
import deductionReducer from "../slices/receipt_collection/deduction";
import gapuraManagementReducer from "../slices/receipt_collection/gapuraManagement";
import historyWarrantyReducer from "../slices/receipt_collection/historyWarranty";
import offsetReducer from "../slices/receipt_collection/offset";
import writeOffReducer from "../slices/receipt_collection/writeOff";
import paymentRelationReducer from "../slices/account_management/detailAccount/PaymentRelationSlice";
import invoiceRelationReducer from "../slices/account_management/detailAccount/InvoiceRelationSlice";
import globalPropReducer from "../slices/globalPropSlice";
import paymentWarrantyPartnerReducer from "../slices/receipt_collection/paymentWarrantyPartner";
import liborRateReducer from "../slices/receipt_collection/liborRate";
import caCiMappingReducer from "../slices/receipt_collection/caCiMapping";
import serviceRequestReducer from "../slices/account_management/detailAccount/ServiceRequestSlice";
import paymentCycleReducer from "../slices/receipt_collection/paymentCycle";
import paymentPeriodReducer from "../slices/receipt_collection/paymentPeriod";
import billingItemCategoryReducer from "../slices/system_setup/master_data/billingItemCategory";
import calendarReducer from "../slices/system_setup/master_data/calendar";
import jobManagementReducer from "../slices/job_management/jobSlice";
import jobGroupReducer from "../slices/job_management/jobGroupSlice";
import oracleMetadataReducer from "../slices/job_management/oracleMetadataSlice";
import taskQueueReducer from "../slices/job_management/taskQueueSlice";
import handlerRegistryReducer from "../slices/job_management/handlerRegistrySlice";
import { jobApiSlice } from "../slices/job_management/jobApiSlice";
import { jobGroupApiSlice } from "../slices/job_management/jobGroupApiSlice";
import auditTrailReducer from "../slices/user_management/audit_trail";
import preRequisiteTemplateReducer from "../slices/system_setup/preRequisiteTemplate";

const reducer = combineReducers({
  jobManagement: jobManagementReducer,
  jobGroup: jobGroupReducer,
  oracleMetadata: oracleMetadataReducer,
  taskQueue: taskQueueReducer,
  handlerRegistry: handlerRegistryReducer,
  auth: authReducer,
  message: messageReducer,
  entity: entityReducer,
  user: userReducer,
  employee: employeeReducer,
  globalProperties: globalPropertiesReducer,
  master_position: masterPositionReducer,
  globalTypes: globalTypesReducer,
  groupAccess: groupAccessReducer,
  master_cost_center: masterCostCenterReducer,
  master_job: masterJobReducer,
  login_background: loginBackgroundReducer,
  announcement: announcementReducer,
  maintenanceMode: maintenanceModeReducer,
  delegation: delegationReducer,
  user_level: userLevelReducer,
  data_slice: dataReducer,
  profile: profileReducer,
  action: actionReducer,
  monitoring_session: monitoringSessionReducer,
  data_access: dataAccessReducer,
  apphierarchy: approvHierarchyReducer,
  main_Menu: mainMenuReducer,
  general: generalReducer,
  position_hierarchy: positionHierarchyReducer,
  // menu: menuReducer
  // generate_password : generatePasswordReducer,
  // hierarchy_slice : hirarchyReducer

  // Product Reducer
  productClass: productClassReducer,
  pricing: pricingReducer,
  pricingRule: pricingRuleReducer,
  product: productReducer,
  pricingAdjust: pricingAdjustReducer,
  promo: promoReducer,

  //TOS
  tos: tosReducer,

  //Account Management
  accountManagement: acccountManagerReducer,
  accountAddress: acccountAddressReducer,
  accountContact: acccountContactReducer,
  accountGasSource: accountGasSourceReducer,
  account: accountReducer,
  financialInformation: financialInformationReducer,
  paymentRelation: paymentRelationReducer,
  invoiceRelation: invoiceRelationReducer,
  serviceRequest: serviceRequestReducer,
  premise: premiseReducer,
  servicePoint: servicePointReducer,
  distributionMedia: distributionMediaReducer,
  accountServiceAgreement: accountServiceAgreementReducer,
  tosSubmission: tosSubmissionReducer,
  saWarranty: saWarrantyReducer,
  rawMaterialSource: rawMaterialSourceReducer,
  productDistribution: productDistributionReducer,
  accountGasUtilization: accountGasUtilizationReducer,
  additionalInformation: additionalInfoReducer,
  accountEquipment: equpmentReducer,
  accountPromo: accountPromoReducer,
  relationship: relationshipReducer,
  standaloneRelationship: standaloneRelationshipReducer,
  multiDestination: multiDestinationReducer,
  gasDeposit: gasDepositReducer,

  //Account Management ( Customer )
  customerAccount: customerAccountReducer,

  // Account Management (Master Data)
  gasSource: gasSourceReducer,
  location: locationReducer,
  address: addressesReducer,
  contact: contactReducer,
  meter_reading_code: meterReadingCodeReducer,
  accounting_rules: accountingRulesReducer,
  tax_implication: taxImplicationReducer,
  assets: assetsReducer,

  // Global reducer
  globalProp: globalPropReducer,

  // RBI reducer
  rbi_calculation: calculationReducer,
  rbi_prabilling: prabillingReducer,
  monitoring: monitoringReducer,
  efaktur: efakturReducer,
  monitoring_usage: monitoringUsageReducer,
  billing: billingReducer,
  adjustmentBilling: adjustmentBillingReducer,
  adjustmentInvoice: adjustmentInvoiceReducer,
  rbiAccounting: rbiAccountingReducer,
  rating: ratingReducer,
  pointOfSales: postOfSalesReducer,
  invoice: invoiceReducer,
  proformaInvoice: proformaInvoiceReducer,
  late_charge: lateChargeReducer,
  general_template: generalTemplateReducer,
  billing_item: billingItemReducer,
  billing_bucket: billingBucketReducer,
  billingCycle: billingCycleReducer,
  rate_type: rateTypeReducer,
  daily_rate: dailyrateReducer,
  invoice_template: invoiceTemplateReducer,
  top: termsofPaymentReducer,
  tax_code: taxCodeReducer,
  emeterai: emeteraiReducer,
  taxExemption: taxExemptionReducer,
  managementDeliveryInvoice: managementDeliveryInvoiceReducer,
  masterEfakturCode: masterEfakturCodeReducer,
  digitalSignature: digitalSignatureReducer,
  glAccount: glAccountReducer,
  contentManagement: contentManagementReducer,
  installment: installmentReducer,

  //receipt and collection
  receipt: receiptReducer,
  receiptHistories: receiptHistoriesReducer,
  electronic: electronicReducer,
  bank: bankReducer,
  item: itemReducer,
  cycle: cycleReducer,
  late: lateReducer,
  bridge: bridgeReducer,
  transactionLog: transactionLogReducer,
  invoiceMasterData: invoiceMasterDataReducer,
  paymentMasterData: paymentMasterDataReducer,
  partner: partnerReducer,
  partnerCa: partnerCaReducer,
  caPaymentChannel: caPaymentChannelReducer,
  receiptSetting: settingReducer,
  collectingAgent: collectingAgentReducer,
  paymentChannel: paymentChannelReducer,
  accounting: accountingReducer,
  warranty: warrantyReducer,
  transferToReceipt: transferToReceiptReducer,
  transferToCustomer: transferToCustomerReducer,
  restructure: restructureReducer,
  restructureMonitoring: restructureMonitoringReducer,
  deduction: deductionReducer,
  gapuraManagement: gapuraManagementReducer,
  historyWarranty: historyWarrantyReducer,
  offset: offsetReducer,
  paymentWarrantyPartner: paymentWarrantyPartnerReducer,
  liborRate: liborRateReducer,
  paymentCycle: paymentCycleReducer,
  paymentPeriod: paymentPeriodReducer,
  billingItemCategory: billingItemCategoryReducer,
  calendar: calendarReducer,
  caCiMapping: caCiMappingReducer,

  // Attachment
  attachment: attachmentReducer,

  // criteria
  criteria_slice: criteriaReducer,

  // report
  [reportCustomerSlice.reducerPath]: reportCustomerSlice.reducer,
  [reportCustomerAgreementSlice.reducerPath]:
    reportCustomerAgreementSlice.reducer,

  // tasklist
  [tasklistSlice.reducerPath]: tasklistSlice.reducer,

  // job management API (RTK Query)
  [jobApiSlice.reducerPath]: jobApiSlice.reducer,
  [jobGroupApiSlice.reducerPath]: jobGroupApiSlice.reducer,

  // debt and collection
  gracePeriod: gracePeriodReducer,
  activityName: activityNameReducer,
  templateReminding: templateRemindingReducer,
  activityType: activityTypeReducer,
  activityAction: activityActionReducer,
  activities: activitiesReducer,
  transactionReport: transactionReportReducer,
  writeOff: writeOffReducer,

  // notifications
  notifications: notificationsReducer,

  // audit trail
  audit_trail: auditTrailReducer,
  // system setup
  preRequisiteTemplate: preRequisiteTemplateReducer,
});

// add throttle middlewares
// const throttleMiddleware = throttle(defaultWait, defaultThrottleOptions)

const store = configureStore({
  reducer: reducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(reportCustomerSlice.middleware)
      .concat(reportCustomerAgreementSlice.middleware)
      .concat(tasklistSlice.middleware)
      .concat(jobApiSlice.middleware)
      .concat(jobGroupApiSlice.middleware),
});

setupListeners(store.dispatch);
export default store;
