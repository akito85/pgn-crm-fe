import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import throttle from 'redux-throttle';
import authReducer from "../slices/user_management/auth";
import messageReducer from "../slices/message";
import entityReducer from "../slices/system_setup/entity";
import userReducer from "../slices/user_management/user";
import employeeReducer from "../slices/user_management/employee";
import generatePasswordReducer from "../slices/user_management/generate_password";
import globalPropertiesReducer from "../slices/system_setup/globalProperties";
import masterPositionReducer from "../slices/system_setup/master_data/master_position";
import globalTypesReducer from "../slices/system_setup/globalTypes";
import groupAccessReducer from "../slices/system_setup/group_access";
import masterCostCenterReducer from "../slices/system_setup/master_data/master_cost_center";
import masterJobReducer from "../slices/system_setup/master_data/master_job";
import loginBackgroundReducer from "../slices/system_setup/login_background";
import announcementReducer from "../slices/system_setup/announcement";
import maintenanceModeReducer from "../slices/system_setup/maintenanceMode";
import delegationReducer from "../slices/user_management/delegation"
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
import invoiceReducer from "../slices/rating_billing_invoice/invoice";
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
import positionHierarchyReducer from '../slices/user_management/position_hirarchy';
import rawMaterialSourceReducer from "../slices/account_management/detailAccount/RawMaterialDistributionSlice"
import productDistributionReducer from "../slices/account_management/detailAccount/ProductDistributionSlice"
import accountGasUtilizationReducer from '../slices/account_management/detailAccount/gasUtilizationSlice';
import additionalInfoReducer from "../slices/account_management/detailAccount/additionalInformation";
import equpmentReducer from "../slices/account_management/detailAccount/equpmentSlice";
import criteriaReducer from '../slices/criteria_slice';
const reducer = combineReducers({
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
  premise: premiseReducer,
  servicePoint: servicePointReducer,
  distributionMedia: distributionMediaReducer,
  accountServiceAgreement: accountServiceAgreementReducer,
  tosSubmission: tosSubmissionReducer,
  rawMaterialSource: rawMaterialSourceReducer,
  productDistribution: productDistributionReducer,
  accountGasUtilization: accountGasUtilizationReducer,
  additionalInformation: additionalInfoReducer,
  accountEquipment: equpmentReducer,

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

  // RBI reducer
  rbi_calculation: calculationReducer,
  monitoring_usage: monitoringUsageReducer,
  billing: billingReducer,
  adjustmentBilling: adjustmentBillingReducer,
  rating: ratingReducer,
  pointOfSales: postOfSalesReducer,
  invoice: invoiceReducer,
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

  //receipt and collection
  receipt: receiptReducer,
  receiptHistories: receiptHistoriesReducer,
  electronic: electronicReducer,
  bank: bankReducer,
  item: itemReducer,
  cycle: cycleReducer,
  late: lateReducer,

  // Attachment
  attachment: attachmentReducer,

  // criteria
  criteria_slice : criteriaReducer
});


const defaultWait = 1000;
const defaultThrottleOptions = {
  leading: true,
  trailing: false,
};

// add throttle middlewares
// const throttleMiddleware = throttle(defaultWait, defaultThrottleOptions)

const store = configureStore({
  reducer: reducer,
  devTools: true,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(throttleMiddleware)
});

export default store;
