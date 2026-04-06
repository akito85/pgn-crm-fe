import CustomerAccountList from "../../app/pages/AccountManagement/CustomerAccount/CustomerAccountList";
import CustomerAccountDetail from "../../app/pages/AccountManagement/CustomerAccountDetail/CustomerAccountDetail";
import ServiceAgreementDetail from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServiceAgreement/DetailServiceAgreement";
import CreateServiceAgreement from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServiceAgreement/CreateServiceAgreement";
import FormAccountAddress from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/AccountAddress/FormAccountAddress";
import DetailGasSource from "../../app/pages/SystemSetup/MasterData/GasSource/DetailGasSource";
import GasSourceForm from "../../app/pages/SystemSetup/MasterData/GasSource/GasSourceForm";
import ViewGasSource from "../../app/pages/SystemSetup/MasterData/GasSource/ViewGasSource";
import UploadGasSource from "../../app/pages/SystemSetup/MasterData/GasSource/UploadGasSource";
import FormAccountContact from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/AccountContact/FormAccountContact";
import AccountStandard from "../../app/pages/AccountManagement/Account/AccountStandard/AccountStandard";
import AccountOnetime from "../../app/pages/AccountManagement/Account/AccountOneTIme/AccountOnetime";
import OneTimeForm from "../../app/pages/AccountManagement/CreateCustomerAccount/OneTime/OneTimeForm";
import StandardForm from "../../app/pages/AccountManagement/CreateCustomerAccount/Standard/StandardForm";
import PremiseDetail from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Premise/PremiseDetail";
import ServicePoint from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServicePoint/ServicePoint";
import ServicePointAssetAssign from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServicePoint/ServicePointAssetAssign";
import UpdateAccountInformation from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/AccountInformation/UpdateAccountInformation";
import RelationshipDetail from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Relationship/Details/RelationshipDetail";
import ApproveOrRejectTOS from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServiceAgreement/DetailServiceAgreement/TosSubmission/ApproveOrRejectTos/ApproveOrRejectTOS";
import CustomerDetail from "../../app/pages/AccountManagement/Customer/CustomerDetail";
import UpdateCustomer from "../../app/pages/AccountManagement/Customer/Update/UpdateCustomer";
import CreateTosSubmission from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/TosSubmission/CreateTosSubmission";
import CreateWarrantyTerm from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Warranty/CreateWarrantyTerm";
import DetailWarrantyTerm from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Warranty/DetailWarrantyTerm";
import UpdateServiceAgreement from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServiceAgreement/UpdateServiceAgreement";
import ViewMeterReadingCode from "../../app/pages/SystemSetup/MasterData/MeterReadingCode/ViewMeterReadingCode";
import FormMeterReadingCode from "../../app/pages/SystemSetup/MasterData/MeterReadingCode/FormMeterReadingCode";
import ViewContact from "../../app/pages/SystemSetup/MasterData/MasterContact/ViewContact";
import FormContact from "../../app/pages/SystemSetup/MasterData/MasterContact/FormContact";
import ViewLocations from "../../app/pages/SystemSetup/MasterData/Locations/ViewLocations";
import FormLocations from "../../app/pages/SystemSetup/MasterData/Locations/FormLocations";
import FormAddresses from "../../app/pages/SystemSetup/MasterData/MasterAddress/FormAddresses";
import FormAccountingRules from "../../app/pages/SystemSetup/MasterData/AccountingRules/FormAccountingRules";
import ViewAccountingRules from "../../app/pages/SystemSetup/MasterData/AccountingRules/ViewAccountingRules";
import FormLateCharges from "../../app/pages/SystemSetup/MasterData/LateCharges/FormLateCharges";
import ViewLateCharges from "../../app/pages/SystemSetup/MasterData/LateCharges/ViewLateCharges";
import FormTaxImplication from "../../app/pages/SystemSetup/MasterData/TaxImplication/FormTaxImplication";
import ViewTaxImplication from "../../app/pages/SystemSetup/MasterData/TaxImplication/ViewTaxImplication";
import DetailTaxImplication from "../../app/pages/SystemSetup/MasterData/TaxImplication/DetailTaxImplication";
import ViewAddresses from "../../app/pages/SystemSetup/MasterData/MasterAddress/ViewAddresses";
import DetailAddresses from "../../app/pages/SystemSetup/MasterData/MasterAddress/DetailAddresses";
import DetailLateCharges from "../../app/pages/SystemSetup/MasterData/LateCharges/DetailLateCharges";
import FormLateChargesRule from "../../app/pages/SystemSetup/MasterData/LateCharges/LateChargesRule/FormLateChargesRule";
import DetailLateChargesRule from "../../app/pages/SystemSetup/MasterData/LateCharges/LateChargesRule/DetailLateChargesRule";
import FormTaxImplicationRule from "../../app/pages/SystemSetup/MasterData/TaxImplication/TaxImplicationRule/FormTaxImplicationRule";
import DetailTaxImplicationRule from "../../app/pages/SystemSetup/MasterData/TaxImplication/TaxImplicationRule/DetailTaxImplicationRule";
import GasUtilizationForm from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/GasUtilization/Form";
import EquipmentForm from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Equipment/Form/EquipmentForm";
import RawMaterialSourceForm from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/RawMaterialSource/RawMaterialSourceHistory/RawMaterialSourceForm";
import ProductDistributionForm from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ProductDistribution/ProductDistributionHistory/ProductDistributionForm";
import PaymentRelationDetail from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/FinancialInformation/PaymentRelation/Details/PaymentRelationDetail"; 
import CreateUpdatePaymentRelation from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/FinancialInformation/PaymentRelation/CreateUpdate/CreateUpdatePaymentRelation"

import CreateCustomerServiceRequest from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServiceRequest/Create/CreateCustomerServiceRequest";
import CustomerServiceRequestDetails from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServiceRequest/Details/CustomerServiceRequestDetails";
import PreRequisiteCreateForm from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/ServiceRequest/Create/StepContents/PreRequisiteForm/Create";

import InvoiceRelationDetail from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/FinancialInformation/InvoiceRelation/Details/InvoiceRelationDetail";
import CreateUpdateInvoiceRelation from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/FinancialInformation/InvoiceRelation/CreateUpdate/CreateUpdateInvoiceRelation";
import MultiDestinationDetail from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/MultiDestination/Details/MultiDestinationDetail";
import CreateUpdateMultiDestination from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/MultiDestination/CreateUpdate/CreateUpdateMultiDestination";
import CreateUpdateRelationship from "../../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Relationship/CreateUpdate/CreateUpdateRelationship";
import GasDeposit from "../../app/pages/AccountManagement/GasDeposit/GasDeposit";
import GasDepositDetail from "../../app/pages/AccountManagement/GasDeposit/Detail/GasDepositDetail";
import RecalculateExpireGasDeposit from "../../app/pages/AccountManagement/GasDeposit/RecalculateExpire/RecalculateExpireGasDeposit";

export const ACCOUNT_MANAGEMENT_ELEMENTS = {
  // Customer/Account List
  VIEW_CUSTOMER_PAGE: <CustomerAccountList />,

  // Account Standard
  VIEW_ACCOUNT_STANDARD_PAGE: <AccountStandard />,
  CREATE_ACCOUNT_STANDARD_PAGE: <StandardForm />,
  VIEW_DETAIL_ACCOUNT_STANDARD_PAGE: (
    <CustomerAccountDetail type={"standard"} />
  ),

  // Account One Time
  VIEW_ACCOUNT_ONETIME_PAGE: <AccountOnetime />,
  CREATE_ACCOUNT_ONETIME_PAGE: <OneTimeForm />,
  VIEW_DETAIL_ACCOUNT_ONETIME_PAGE: <CustomerAccountDetail type={"oneTime"} />,

  // Detail Service Agreement
  VIEW_DETAIL_SERVICE_AGREEMENT_PAGE: <ServiceAgreementDetail />,

  // Create Service Agreement
  CREATE_SERVICE_AGREEMENT_MAIN_PAGE: <CreateServiceAgreement saType="main" />,
  CREATE_SERVICE_AGREEMENT_ADDON_PAGE: (
    <CreateServiceAgreement saType="addOn" />
  ),
  CREATE_SERVICE_AGREEMENT_AMANDEMEN_PAGE: (
    <CreateServiceAgreement saType="amandemen" />
  ),

  // Update Service Agreement
  UPDATE_SERVICE_AGREEMENT_PAGE: <UpdateServiceAgreement />,
  // UPDATE_SERVICE_AGREEMENT_ADDON_PAGE: <UpdateServiceAgreement saType="addOn"/>,
  // UPDATE_SERVICE_AGREEMENT_AMANDEMEN_PAGE: <UpdateServiceAgreement saType="amandemen"/>,

  // Create ACCOUNT ADDRESS
  CREATE_ACCOUNT_ADDRESS_PAGE: <FormAccountAddress type={"create"} />,
  // UPDATE ACCOUNT ADDRESS
  UPDATE_ACCOUNT_ADDRESS_PAGE: <FormAccountAddress type={"update"} />,

  // Create Account Contact
  CREATE_ACCOUNT_CONTACT_PAGE: <FormAccountContact type={"create"} />,

  // Update Account Contact
  UPDATE_ACCOUNT_CONTACT_PAGE: <FormAccountContact type={"update"} />,

  // Service Request Detail
  VIEW_DETAIL_SERVICE_REQUEST_PAGE: <CustomerServiceRequestDetails />,
  CREATE_SERVICE_REQUEST_PAGE: <CreateCustomerServiceRequest />,
  // UPDATE_SERVICE_REQUEST_PAGE: <UpdateCustomerServiceRequest />,
  CREATE_SERVICE_REQUEST_PREREQUISITE_PAGE: <PreRequisiteCreateForm />,

  // Payment Relation Detail
  VIEW_DETAIL_PAYMENT_RELATION_PAGE: <PaymentRelationDetail accountType="standard" />,
  CREATE_PAYMENT_RELATION_PAGE: <CreateUpdatePaymentRelation formType={"create"} accountType={"standard"} />,
  UPDATE_PAYMENT_RELATION_PAGE: <CreateUpdatePaymentRelation formType={"update"} accountType={"standard"} />,

  // Payment Relation Account One Time
  VIEW_DETAIL_PAYMENT_RELATION_ONETIME_PAGE: <PaymentRelationDetail accountType="oneTime" />,
  CREATE_PAYMENT_RELATION_ONETIME_PAGE: <CreateUpdatePaymentRelation formType={"create"} accountType={"oneTime"} />,
  UPDATE_PAYMENT_RELATION_ONETIME_PAGE: <CreateUpdatePaymentRelation formType={"update"} accountType={"oneTime"} />,

  // Invoice Relation Account Standard
  VIEW_DETAIL_INVOICE_RELATION_PAGE: <InvoiceRelationDetail accountType="standard" />,
  CREATE_INVOICE_RELATION_PAGE: <CreateUpdateInvoiceRelation formType={"create"} accountType={"standard"} />,
  UPDATE_INVOICE_RELATION_PAGE: <CreateUpdateInvoiceRelation formType={"update"} accountType={"standard"} />,

  // Invoice Relation Account One Time
  VIEW_DETAIL_INVOICE_RELATION_ONETIME_PAGE: <InvoiceRelationDetail accountType="oneTime" />,
  CREATE_INVOICE_RELATION_ONETIME_PAGE: <CreateUpdateInvoiceRelation formType={"create"} accountType={"oneTime"} />,
  UPDATE_INVOICE_RELATION_ONETIME_PAGE: <CreateUpdateInvoiceRelation formType={"update"} accountType={"oneTime"} />,

  // Gas Source
  DETAIL_GAS_SOURCE: <DetailGasSource />,
  CREATE_GAS_SOURCE: <GasSourceForm type={"create"} />,
  UPDATE_GAS_SOURCE: <GasSourceForm type={"update"} />,
  VIEW_GAS_SOURCE: <ViewGasSource />,
  UPLOAD_GAS_SOURCE: <UploadGasSource />,

  // Gas Deposit Stand Alone
  VIEW_GAS_DEPOSIT_SA_PAGE: <GasDeposit moduleType="sa" />,
  VIEW_DETAIL_GAS_DEPOSIT_SA_PAGE: <GasDepositDetail moduleType="sa" />,
  RECALCULATE_GAS_DEPOSIT_SA_PAGE: "/account-management/gas-deposit/recalculate",
  EXPIRE_GAS_DEPOSIT_SA_PAGE: "/account-management/gas-deposit/expire",
  
  // Gas Deposit Account Standard
  VIEW_DETAIL_GAS_DEPOSIT_PAGE: <GasDepositDetail moduleType="ua" accountType="standard" />,
  RECALCULATE_GAS_DEPOSIT_PAGE: <RecalculateExpireGasDeposit formType="recalculate" accountType="standard" />,
  EXPIRE_GAS_DEPOSIT_PAGE: <RecalculateExpireGasDeposit formType="expire" accountType="standard" />,

  // Gas Deposit Account One Time
  VIEW_DETAIL_GAS_DEPOSIT_ONETIME_PAGE: <GasDepositDetail moduleType="ua" accountType="oneTime" />,
  RECALCULATE_GAS_DEPOSIT_ONETIME_PAGE: <RecalculateExpireGasDeposit formType="recalculate" accountType="oneTime" />,
  EXPIRE_GAS_DEPOSIT_ONETIME_PAGE: <RecalculateExpireGasDeposit formType="expire" accountType="oneTime" />,

  // Multi Destination Account Standard
  VIEW_DETAIL_MULTI_DESTINATION_PAGE: <MultiDestinationDetail accountType="standard" />,
  CREATE_MULTI_DESTINATION_PAGE: <CreateUpdateMultiDestination accountType="standard" formType="create" />,
  UPDATE_MULTI_DESTINATION_PAGE: <CreateUpdateMultiDestination accountType="standard" formType="update" />,

  // Multi Destination Account One Time
  VIEW_DETAIL_MULTI_DESTINATION_ONETIME_PAGE: <MultiDestinationDetail accountType="oneTime" />,
  CREATE_MULTI_DESTINATION_ONETIME_PAGE: <CreateUpdateMultiDestination accountType="oneTime" formType="create" />,
  UPDATE_MULTI_DESTINATION_ONETIME_PAGE: <CreateUpdateMultiDestination accountType="oneTime" formType="update" />,

  // Premise
  VIEW_DETAIL_PREMISE_PAGE: <PremiseDetail />,

  //Service Point
  VIEW_DETAIL_SERVICE_POINT_PAGE: <ServicePoint />,
  CREATE_ASSET_SERVICE_POINT_PAGE: <ServicePointAssetAssign />,

  //ACCOUNT
  UPDATE_ACCOUNT_STANDARD_PAGE: <UpdateAccountInformation />,

  //RELATIONSHIP ACCOUNT STANDARD
  CREATE_RELATIONSHIP_PAGE: <CreateUpdateRelationship accountType="standard" formType="create" />,
  UPDATE_RELATIONSHIP_PAGE: <CreateUpdateRelationship accountType="standard" formType="update" />,
  DETAIL_RELATIONSHIP_PAGE: <RelationshipDetail accountType="standard" />,

  //RELATIONSHIP ACCOUNT ONE TIME
  CREATE_RELATIONSHIP_ONETIME_PAGE: <CreateUpdateRelationship accountType="oneTime" formType="create" />,
  UPDATE_RELATIONSHIP_ONETIME_PAGE: <CreateUpdateRelationship accountType="oneTime" formType="update" />,
  DETAIL_RELATIONSHIP_ONETIME_PAGE: <RelationshipDetail accountType="oneTime" />,

  //SA-APPROVE-REJECT-TOS
  APPROVE_OR_REJECT_TOS_PAGE: <ApproveOrRejectTOS />,

  //CUSTOMER DETAIL
  VIEW_DETAIL_CUSTOMER_PAGE: <CustomerDetail />,
  UPDATE_CUSTOMER_PAGE: <UpdateCustomer />,

  //TOS SUBMISSION
  CREATE_TOS_SUBMISSION_PAGE: <CreateTosSubmission typeForm={"create"} />,
  UPDATE_TOS_SUBMISSION_PAGE: <CreateTosSubmission typeForm={"update"} />,
  DETAIL_TOS_SUBMISSION_PAGE: <ApproveOrRejectTOS />,

  // WARRANTY TERM
  CREATE_WARRANTY_TERM_PAGE: <CreateWarrantyTerm typeForm={'create'} />,
  UPDATE_WARRANTY_TERM_PAGE: <CreateWarrantyTerm typeForm={'update'} />,
  DETAIL_WARRANTY_TERM_PAGE: <DetailWarrantyTerm />,

  // RAW MATERIAL SOURCE
  CREATE_RAW_MATERIAL_SOURCE_PAGE: <RawMaterialSourceForm type={"create"}/>,
  UPDATE_RAW_MATERIAL_SOURCE_PAGE: <RawMaterialSourceForm type={"update"}/>,
  
  // RAW MATERIAL SOURCE
  CREATE_PRODUCT_DISTRIBUTION_PAGE: <ProductDistributionForm type={"create"}/>,
  UPDATE_PRODUCT_DISTRIBUTION_PAGE: <ProductDistributionForm type={"update"}/>,
  
  // MASTER DATA

  // METER READING CODES
  VIEW_METER_READING_CODE_PAGE: <ViewMeterReadingCode />,
  CREATE_METER_READING_CODE_PAGE: <FormMeterReadingCode type={"create"} />,
  UPDATE_METER_READING_CODE_PAGE: <FormMeterReadingCode type={"update"} />,
  DETAIL_METER_READING_CODE_PAGE: <FormMeterReadingCode type={""} />,
  UPLOAD_METER_READING_CODE_PAGE: <ViewMeterReadingCode />,

  // CONTACT
  VIEW_CONTACT_PAGE: <ViewContact />,
  CREATE_CONTACT_PAGE: <FormContact type={"create"} />,
  UPDATE_CONTACT_PAGE: <FormContact type={"update"} />,
  DETAIL_CONTACT_PAGE: <ViewContact />,

  // LOCATIONS
  VIEW_LOCATIONS_PAGE: <ViewLocations />,
  CREATE_LOCATIONS_PAGE: <FormLocations type={"create"} />,
  UPDATE_LOCATIONS_PAGE: <FormLocations type={"update"} />,
  DETAIL_LOCATIONS_PAGE: <ViewLocations />,
  UPLOAD_LOCATIONS_PAGE: <ViewLocations />,

  // ADDRESSES
  VIEW_ADDRESSES_PAGE: <ViewAddresses />,
  CREATE_ADDRESSES_PAGE: <FormAddresses type={"create"} />,
  UPDATE_ADDRESSES_PAGE: <FormAddresses type={"update"} />,
  DETAIL_ADDRESSES_PAGE: <DetailAddresses />,
  UPLOAD_ADDRESSES_PAGE: <ViewAddresses />,

  // ACCOUNTING RULES
  VIEW_ACCOUNTING_RULES_PAGE: <ViewAccountingRules />,
  CREATE_ACCOUNTING_RULES_PAGE: <FormAccountingRules type={"create"} />,
  UPDATE_ACCOUNTING_RULES_PAGE: <FormAccountingRules type={"update"} />,
  DETAIL_ACCOUNTING_RULES_PAGE: <ViewAccountingRules />,
  UPLOAD_ACCOUNTING_RULES_PAGE: <ViewAccountingRules />,

  // LATE CHARGES
  VIEW_LATE_CHARGES_PAGE: <ViewLateCharges />,
  CREATE_LATE_CHARGES_PAGE: <FormLateCharges type={"create"} />,
  UPDATE_LATE_CHARGES_PAGE: <FormLateCharges type={"update"} />,
  DETAIL_LATE_CHARGES_PAGE: <DetailLateCharges />,

  // LATE CHARGES RULE
  CREATE_LATE_CHARGES_RULE_PAGE: <FormLateChargesRule type={"create"} />,
  UPDATE_LATE_CHARGES_RULE_PAGE: <FormLateChargesRule type={"update"} />,
  DETAIL_LATE_CHARGES_RULE_PAGE: <DetailLateChargesRule />,

  //TAX IMPLICATION
  VIEW_TAX_IMPLICATION_PAGE: <ViewTaxImplication />,
  CREATE_TAX_IMPLICATION_PAGE: <FormTaxImplication type={"create"} />,
  UPDATE_TAX_IMPLICATION_PAGE: <FormTaxImplication type={"update"} />,
  DETAIL_TAX_IMPLICATION_PAGE: <DetailTaxImplication />,

  // TAX IMPLICATION RULE
  CREATE_TAX_IMPLICATION_RULE_PAGE: <FormTaxImplicationRule type={"create"}/>,
  UPDATE_TAX_IMPLICATION_RULE_PAGE: <FormTaxImplicationRule type={"update"} />,
  DETAIL_TAX_IMPLICATION_RULE_PAGE: <DetailTaxImplicationRule />,
  
  // GAS UTILIZATION
  CREATE_GAS_UTILIZATION_PAGE: <GasUtilizationForm type={"create"}/>,
  UPDATE_GAS_UTILIZATION_PAGE: <GasUtilizationForm type={"update"} />,
  
  // EQUIPMENT
  CREATE_EQUIPMENT_PAGE: <EquipmentForm type={"create"}/>,
  UPDATE_EQUIPMENT_PAGE: <EquipmentForm type={"update"} />,
};
