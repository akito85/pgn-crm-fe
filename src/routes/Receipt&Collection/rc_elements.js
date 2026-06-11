import ViewReceipt from "../../app/pages/ReceiptAndCollection/Receipt/ViewReceipt";
import ListDetailReceipt from "../../app/pages/ReceiptAndCollection/Receipt/ListDetailReceipt";
import CreateAccounting from "../../app/pages/ReceiptAndCollection/Receipt/CreateAccounting";
import ViewSynchronizeReceipt from "../../app/pages/ReceiptAndCollection/ReceiptReconciliation/SynchronizeReceipt/ViewSynchronizeReceipt";
import DetailSynchronizeReceipt from "../../app/pages/ReceiptAndCollection/ReceiptReconciliation/SynchronizeReceipt/DetailSynchronizeReceipt";
import ViewReconcileReceiptHistories from "../../app/pages/ReceiptAndCollection/ReceiptReconciliation/ReconcileReceiptHistories/ViewReconcileReceiptHistories";
import ViewMaintainElectronicBankStatement from "../../app/pages/ReceiptAndCollection/ReceiptReconciliation/MaintainElectronicBankStatement/ViewMaintainElectronicBankStatement";
import DetailMaintainElectronicBankStatement from "../../app/pages/ReceiptAndCollection/ReceiptReconciliation/MaintainElectronicBankStatement/DetailMaintainElectronicBankStatement";
import UploadMaintainElectronicBankStatement from "../../app/pages/ReceiptAndCollection/ReceiptReconciliation/MaintainElectronicBankStatement/UploadMaintainElectronicBankStatement";
import ViewBank from "../../app/pages/ReceiptAndCollection/MasterData/Bank/ViewBank";
import ViewReceiptHistories from "../../app/pages/ReceiptAndCollection/ReceiptHistories/ViewReceiptHistories";
import ViewPaymentItem from "../../app/pages/ReceiptAndCollection/MasterData/PaymentItem/ViewPaymentItem";
import ListDetailBank from "../../app/pages/ReceiptAndCollection/MasterData/Bank/ListDetailBank";
import BankForm from "../../app/pages/ReceiptAndCollection/MasterData/Bank/BankForm";
import ListDetailPaymentItem from "../../app/pages/ReceiptAndCollection/MasterData/PaymentItem/ListDetailPaymentItem";
import ListFormPaymentItem from "../../app/pages/ReceiptAndCollection/MasterData/PaymentItem/ListFormPaymentItem";
import ViewTransactionCalender from "../../app/pages/ReceiptAndCollection/MasterData/TransactionCalender/ViewTransactionCalender";
import ListDetailTransactionCalender from "../../app/pages/ReceiptAndCollection/MasterData/TransactionCalender/ListDetailTransactionCalender";
import TransactionCalenderForm from "../../app/pages/ReceiptAndCollection/MasterData/TransactionCalender/TransactionCalenderForm";
import AccountInformation from "../../app/pages/ReceiptAndCollection/MasterData/Bank/AccountInformation";
import ViewLateCharge from "../../app/pages/ReceiptAndCollection/LateChargeManagement/ViewLateCharge";
import ListRececiptForm from "../../app/pages/ReceiptAndCollection/Receipt/CreateReceipt/ListRececiptForm";
import ListDetailLateCharge from "../../app/pages/ReceiptAndCollection/LateChargeManagement/DetailLateCharge/ListDetailLateCharge";
import ListFormLateCharge from "../../app/pages/ReceiptAndCollection/LateChargeManagement/ListFormLateCharge";
import ViewBridge from "../../app/pages/ReceiptAndCollection/MasterData/Bridge/ViewBridge";
import ViewInvoice from "../../app/pages/ReceiptAndCollection/MasterData/Invoice/ViewInvoice";
import ViewPayment from "../../app/pages/ReceiptAndCollection/MasterData/Payment/ViewPayment";
import ViewTransactionLog from "../../app/pages/ReceiptAndCollection/MasterData/TransactionLog/ViewTransactionLog";
import ListFormRecalculate from "../../app/pages/ReceiptAndCollection/LateChargeManagement/Recalculate/ListFormRecalculate";
import ListFormReplace from "../../app/pages/ReceiptAndCollection/LateChargeManagement/Replace/ListFormReplace";
import ListFormReverse from "../../app/pages/ReceiptAndCollection/LateChargeManagement/Reverse/ListFormReverse";


import DetailAccounting from "../../app/pages/ReceiptAndCollection/Receipt/DetailAccounting";
import ViewPartner from "../../app/pages/ReceiptAndCollection/MasterData/Partner/ViewPartner";
import ListDetailPartner from "../../app/pages/ReceiptAndCollection/MasterData/Partner/ListDetailPartner";
import ListFormPartner from "../../app/pages/ReceiptAndCollection/MasterData/Partner/ListFormPartner";

import ViewPartnerCa from "../../app/pages/ReceiptAndCollection/MasterData/PartnerCa/ViewPartnerCa";
import ListDetailPartnerCa from "../../app/pages/ReceiptAndCollection/MasterData/PartnerCa/ListDetailPartnerCa";
import ListFormPartnerCa from "../../app/pages/ReceiptAndCollection/MasterData/PartnerCa/ListFormPartnerCa";

import ViewCaPaymentChannel from "../../app/pages/ReceiptAndCollection/MasterData/CaPaymentChannel/ViewCaPaymentChannel";
import ListDetailCaPaymentChannel from "../../app/pages/ReceiptAndCollection/MasterData/CaPaymentChannel/ListDetailCaPaymentChannel";
import ListFormCaPaymentChannel from "../../app/pages/ReceiptAndCollection/MasterData/CaPaymentChannel/ListFormCaPaymentChannel";

import ViewSettings from "../../app/pages/ReceiptAndCollection/MasterData/Settings/ViewSettings";
import ListDetailSettings from "../../app/pages/ReceiptAndCollection/MasterData/Settings/ListDetailSettings";
import ListFormSettings from "../../app/pages/ReceiptAndCollection/MasterData/Settings/ListFormSettings";
// import ViewCollectingAgent from "../../app/pages/ReceiptAndCollection/MasterData/CaPaymentChannel/ViewCaPaymentChannel";
// import ListDetailCollectingAgent from "../../app/pages/ReceiptAndCollection/MasterData/CaPaymentChannel/ListDetailCaPaymentChannel";
// import ListFormCollectingAgent from "../../app/pages/ReceiptAndCollection/MasterData/CaPaymentChannel/ListFormCaPaymentChannel";

import ViewCollectingAgent from "../../app/pages/ReceiptAndCollection/MasterData/CollectingAgent/ViewCollectingAgent";
import ListDetailCollectingAgent from "../../app/pages/ReceiptAndCollection/MasterData/CollectingAgent/ListDetailCollectingAgent";
import ListFormCollectingAgent from "../../app/pages/ReceiptAndCollection/MasterData/CollectingAgent/ListFormCollectingAgent";

import ViewPaymentChannel from "../../app/pages/ReceiptAndCollection/MasterData/PaymentChannel/ViewPaymentChannel";
import ListDetailPaymentChannel from "../../app/pages/ReceiptAndCollection/MasterData/PaymentChannel/ListDetailPaymentChannel";
import ListFormPaymentChannel from "../../app/pages/ReceiptAndCollection/MasterData/PaymentChannel/ListFormPaymentChannel";

import ViewAccounting from "../../app/pages/ReceiptAndCollection/Accounting/ViewAccounting";
import ViewDeduction from "../../app/pages/ReceiptAndCollection/PaymentWarranty/Deduction/ViewDeduction";
import ListDetailDeduction from "../../app/pages/ReceiptAndCollection/PaymentWarranty/Deduction/ListDetailDeduction";
import ListFormDeduction from "../../app/pages/ReceiptAndCollection/PaymentWarranty/Deduction/ListFormDeduction";

import ViewTransferToReceipt from "../../app/pages/ReceiptAndCollection/PaymentWarranty/TransferToReceipt/ViewTransferToReceipt";
import ListDetailTransferToReceipt from "../../app/pages/ReceiptAndCollection/PaymentWarranty/TransferToReceipt/ListDetailTransferToReceipt";
import ListFormTransferToReceipt from "../../app/pages/ReceiptAndCollection/PaymentWarranty/TransferToReceipt/ListFormTransferToReceipt";

import ViewTransferToCustomer from "../../app/pages/ReceiptAndCollection/PaymentWarranty/TransferToCustomer/ViewTransferToCustomer";
import ListDetailTransferToCustomer from "../../app/pages/ReceiptAndCollection/PaymentWarranty/TransferToCustomer/ListDetailTransferToCustomer";
import ListFormTransferToCustomer from "../../app/pages/ReceiptAndCollection/PaymentWarranty/TransferToCustomer/ListFormTransferToCustomer";

import ViewWarranty from "../../app/pages/ReceiptAndCollection/PaymentWarranty/Warranty/ViewWarranty";
import ListDetailWarranty from "../../app/pages/ReceiptAndCollection/PaymentWarranty/Warranty/ListDetailWarranty";
import ListFormWarranty from "../../app/pages/ReceiptAndCollection/PaymentWarranty/Warranty/ListFormWarranty";

import ListHistoryPaymentWarranty from "../../app/pages/ReceiptAndCollection/PaymentWarranty/History/ListHistoryPaymentWarranty";
import UploadWarrantyPage from "../../app/pages/ReceiptAndCollection/PaymentWarranty/Warranty/Upload/UploadWarrantyPage";

import ViewGapuraManagement from "../../app/pages/ReceiptAndCollection/GapuraManagement/ViewGapuraManagement";
import ListDetailGapuraManagement from "../../app/pages/ReceiptAndCollection/GapuraManagement/ListDetailGapuraManagement";

import ViewPaymentWarrantyPartner from "../../app/pages/ReceiptAndCollection/MasterData/PaymentWarrantyPartner/ViewPaymentWarrantyPartner";
import ListDetailPaymentWarrantyPartner from "../../app/pages/ReceiptAndCollection/MasterData/PaymentWarrantyPartner/ListDetailPaymentWarrantyPartner";
import ListFormPaymentWarrantyPartner from "../../app/pages/ReceiptAndCollection/MasterData/PaymentWarrantyPartner/ListFormPaymentWarrantyPartner";
import ViewLiborRate from "../../app/pages/ReceiptAndCollection/MasterData/LiborRate/ViewLiborRate";
import ListDetailLiborRate from "../../app/pages/ReceiptAndCollection/MasterData/LiborRate/ListDetailLiborRate";
import ListFormLiborRate from "../../app/pages/ReceiptAndCollection/MasterData/LiborRate/ListFormLiborRate";

import ViewCaCiMapping from "../../app/pages/ReceiptAndCollection/MasterData/CaCiMapping/ViewCaCiMapping";
import ListDetailCaCiMapping from "../../app/pages/ReceiptAndCollection/MasterData/CaCiMapping/ListDetailCaCiMapping";
import ListFormCaCiMapping from "../../app/pages/ReceiptAndCollection/MasterData/CaCiMapping/ListFormCaCiMapping";
import ViewException from "../../app/pages/ReceiptAndCollection/Exception/ViewException";
import ExceptionForm from "../../app/pages/ReceiptAndCollection/Exception/ExceptionForm";

import CollectionActivitiesView from "../../app/pages/ReceiptAndCollection/MasterData/CollectionActivities/CollectionActivitiesView";
import CollectionActivitiesForm from "../../app/pages/ReceiptAndCollection/MasterData/CollectionActivities/CollectionActivitiesForm";
import PayGasDepositePage from "../../app/pages/ReceiptAndCollection/GasDeposite/PayGasDepositePage";
import PayGasDepositeCreatePage from "../../app/pages/ReceiptAndCollection/GasDeposite/PayGasDepositeCreatePage";
import PayGasDepositeExpiredApprovalPage from "../../app/pages/ReceiptAndCollection/GasDeposite/PayGasDepositeExpiredApprovalPage";
import PayGasDepositeExpiredCreatePage from "../../app/pages/ReceiptAndCollection/GasDeposite/PayGasDepositeExpiredCreatePage";



export const RECEIPT_AND_COLLECTION_ELEMENTS = {
  // Receipt
  VIEW_RECEIPT_PAGE: <ViewReceipt />,
  DETAIL_RECEIPT_PAGE: <ListDetailReceipt />,
  APPROVAL_RECEIPT_HOLD: <ListDetailReceipt type="hold" />,
  APPROVAL_RECEIPT_RELEASE: <ListDetailReceipt type="release" />,
  APPROVAL_RECEIPT_REFUND: <ListDetailReceipt type="refund" />,
  APPROVAL_RECEIPT_REVERSE: <ListDetailReceipt type="reverse" />,
  CREATE_RECEIPT: <ListRececiptForm type="create" />,
  UPDATE_RECEIPT: <ListRececiptForm type="update" />,
  CREATE_ACCOUNTING: <CreateAccounting />,
  DETAIL_ACCOUNTING: <DetailAccounting />,

  // Receipt Reconciliation

  // Synchronize Receipt
  VIEW_SYNCHRONIZE_RECEIPT: <ViewSynchronizeReceipt />,
  DETAIL_SYNCHRONIZE_RECEIPT: <DetailSynchronizeReceipt />,

  // Reconcile Receipt Histories
  VIEW_RECONCILE_RECEIPT_HISTORIES: <ViewReconcileReceiptHistories />,

  // Maintain Electronic Bank Statement
  VIEW_MAINTAIN_ELECTRONIC_BANK_STATEMENT: (
    <ViewMaintainElectronicBankStatement />
  ),
  DETAIL_MAINTAIN_ELECTRONIC_BANK_STATEMENT: (
    <DetailMaintainElectronicBankStatement />
  ),
  UPLOAD_MAINTAIN_ELECTRONIC_BANK_STATEMENT: (
    <UploadMaintainElectronicBankStatement />
  ),

  // master data bank
  VIEW_MASTER_BANK: <ViewBank />,
  DETAIL_MASTER_BANK: <ListDetailBank />,
  CREATE_MASTER_BANK: <BankForm type={"create"} />,
  UPDATE_MASTER_BANK: <BankForm type={"update"} />,
  CREATE_ACCOUNT_INFORMATION: <AccountInformation type={"create"} />,
  UPDATE_ACCOUNT_INFORMATTION: <AccountInformation type={"update"} />,

  // receipt histories
  VIEW_RECEIPT_HISTORIES: <ViewReceiptHistories />,

  //payment item
  VIEW_PAYMENT_ITEM: <ViewPaymentItem />,
  DETAIL_PAYMENT_ITEM: <ListDetailPaymentItem />,
  CREATE_PAYMENT_ITEM: <ListFormPaymentItem type={"create"} />,
  UPDATE_PAYMENT_ITEM: <ListFormPaymentItem type={"update"} />,

  //Transaction Calender
  VIEW_TRANSACTION_CALENDER: <ViewTransactionCalender />,
  DETAIL_TRANSACTION_CALENDER: <ListDetailTransactionCalender />,
  CREATE_TRANSACTION_CALENDER: <TransactionCalenderForm type={"create"} />,
  UPDATE_TRANSACTION_CALENDER: <TransactionCalenderForm type={"update"} />,

  //late Charge
  VIEW_LATE_CHARGE: <ViewLateCharge />,
  DETAIL_LATE_CHARGE: <ListDetailLateCharge />,
  CREATE_LATE_CHARGE: <ListFormLateCharge type="create" />,
  UPDATE_LATE_CHARGE: <ListFormLateCharge type="update" />,
  RECALCULATE_LATE_CHARGE: <ListFormRecalculate />,
  REPLACE_LATE_CHARGE: <ListFormReplace />,
  REVERSE_LATE_CHARGE: <ListFormReverse />,

  // bridge
  VIEW_BRIDGE: <ViewBridge />,

  // invoice
  VIEW_INVOICE: <ViewInvoice />,

  // transaction log
  VIEW_TRANSACTION_LOG: <ViewTransactionLog />,

  // partner
  VIEW_PARTNER: <ViewPartner />,
  DETAIL_PARTNER: <ListDetailPartner />,
  CREATE_PARTNER: <ListFormPartner type={"create"} />,
  UPDATE_PARTNER: <ListFormPartner type={"update"} />,

  // payment
  VIEW_PAYMENT: <ViewPayment />,

  // partner ca
  VIEW_PARTNER_CA: <ViewPartnerCa />,
  DETAIL_PARTNER_CA: <ListDetailPartnerCa />,
  CREATE_PARTNER_CA: <ListFormPartnerCa type={"create"} />,
  UPDATE_PARTNER_CA: <ListFormPartnerCa type={"update"} />,

  // ca payment channel
  VIEW_CA_PAYMENT_CHANNEL: <ViewCaPaymentChannel />,
  DETAIL_CA_PAYMENT_CHANNEL: <ListDetailCaPaymentChannel />,
  CREATE_CA_PAYMENT_CHANNEL: <ListFormCaPaymentChannel type={"create"} />,
  UPDATE_CA_PAYMENT_CHANNEL: <ListFormCaPaymentChannel type={"update"} />,

  // settings
  VIEW_SETTINGS: <ViewSettings />,
  DETAIL_SETTINGS: <ListDetailSettings />,
  CREATE_SETTINGS: <ListFormSettings type={"create"} />,
  UPDATE_SETTINGS: <ListFormSettings type={"update"} />,

  // Collection Agent
  VIEW_COLLECTING_AGENT: <ViewCollectingAgent />,
  DETAIL_COLLECTING_AGENT: <ListDetailCollectingAgent />,
  CREATE_COLLECTING_AGENT: <ListFormCollectingAgent type={"create"} />,
  UPDATE_COLLECTING_AGENT: <ListFormCollectingAgent type={"update"} />,

  // Payment Channel
  VIEW_PAYMENT_CHANNEL: <ViewPaymentChannel />,
  DETAIL_PAYMENT_CHANNEL: <ListDetailPaymentChannel />,
  CREATE_PAYMENT_CHANNEL: <ListFormPaymentChannel type={"create"} />,
  UPDATE_PAYMENT_CHANNEL: <ListFormPaymentChannel type={"update"} />,

  // Accounting
  VIEW_ACCOUNTING: <ViewAccounting />,

  // Deduction
  VIEW_DEDUCTION: <ViewDeduction />,
  DETAIL_DEDUCTION: <ListDetailDeduction />,
  CREATE_DEDUCTION: <ListFormDeduction type={"create"} />,
  UPDATE_DEDUCTION: <ListFormDeduction type={"update"} />,

  // Transfer to Receipt
  VIEW_TRANSFER_TO_RECEIPT: <ViewTransferToReceipt />,
  DETAIL_TRANSFER_TO_RECEIPT: <ListDetailTransferToReceipt />,
  CREATE_TRANSFER_TO_RECEIPT: <ListFormTransferToReceipt type={"create"} />,

  // Transfer to Customer
  VIEW_TRANSFER_TO_CUSTOMER: <ViewTransferToCustomer />,
  DETAIL_TRANSFER_TO_CUSTOMER: <ListDetailTransferToCustomer />,
  CREATE_TRANSFER_TO_CUSTOMER: <ListFormTransferToCustomer type={"create"} />,

  // Transfer to Receipt
  VIEW_WARRANTY: <ViewWarranty />,
  DETAIL_WARRANTY: <ListDetailWarranty />,
  CREATE_WARRANTY: <ListFormWarranty type={"create"} />,
  UPDATE_WARRANTY: <ListFormWarranty type={"update"} />,
  UPLOAD_WARRANTY: <UploadWarrantyPage />,

  // History Payment Warranty
  VIEW_HISTORY_PAYMENT_WARRANTY: <ListHistoryPaymentWarranty />,

  // Gapura Management
  VIEW_GAPURA_MANAGEMENT_PAGE: <ViewGapuraManagement />,
  DETAIL_GAPURA_MANAGEMENT_PAGE: <ListDetailGapuraManagement />,

  // Payment Warranty Partner
  VIEW_PAYMENT_WARRANTY_PARTNER: <ViewPaymentWarrantyPartner />,
  DETAIL_PAYMENT_WARRANTY_PARTNER: <ListDetailPaymentWarrantyPartner />,
  CREATE_PAYMENT_WARRANTY_PARTNER: <ListFormPaymentWarrantyPartner type={"create"} />,
  UPDATE_PAYMENT_WARRANTY_PARTNER: <ListFormPaymentWarrantyPartner type={"update"} />,

  // Libor Rate
  VIEW_LIBOR_RATE: <ViewLiborRate />,
  DETAIL_LIBOR_RATE: <ListDetailLiborRate />,
  CREATE_LIBOR_RATE: <ListFormLiborRate type={"create"} />,
  UPDATE_LIBOR_RATE: <ListFormLiborRate type={"update"} />,

  // CA CI Mapping
  VIEW_CA_CI_MAPPING: <ViewCaCiMapping />,
  DETAIL_CA_CI_MAPPING: <ListDetailCaCiMapping />,
  CREATE_CA_CI_MAPPING: <ListFormCaCiMapping type={"create"} />,
  UPDATE_CA_CI_MAPPING: <ListFormCaCiMapping type={"update"} />,

  // Collection Activities
  VIEW_COLLECTION_ACTIVITIES: <CollectionActivitiesView />,
  CREATE_COLLECTION_ACTIVITIES: <CollectionActivitiesForm type="create" />,
  UPDATE_COLLECTION_ACTIVITIES: <CollectionActivitiesForm type="update" />,
  // Exception
  VIEW_EXCEPTION: <ViewException />,
  CREATE_EXCEPTION: <ExceptionForm type={"create"} />,
  UPDATE_EXCEPTION: <ExceptionForm type={"update"} />,

  // Gas Deposite
  GAS_DEPOSITE_VIEW: <PayGasDepositePage />,
  GAS_DEPOSITE_CREATE: <PayGasDepositeCreatePage />,
  GAS_DEPOSITE_UPDATE: <PayGasDepositeCreatePage />,
  GAS_DEPOSITE_EXPIRED_CREATE: <PayGasDepositeExpiredCreatePage />,
  GAS_DEPOSITE_EXPIRED_APPROVAL: <PayGasDepositeExpiredApprovalPage />
};
