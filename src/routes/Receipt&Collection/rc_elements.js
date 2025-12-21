import ViewReceipt from "../../app/pages/ReceiptAndCollection/Receipt/ViewReceipt";
import ListDetailReceipt from "../../app/pages/ReceiptAndCollection/Receipt/ListDetailReceipt";
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
import ViewBridge from "../../app/pages/ReceiptAndCollection/MasterData/Bridge/ViewBridge";
import ViewInvoice from "../../app/pages/ReceiptAndCollection/MasterData/Invoice/ViewInvoice";
import ViewPayment from "../../app/pages/ReceiptAndCollection/MasterData/Payment/ViewPayment";
import ViewTransactionLog from "../../app/pages/ReceiptAndCollection/MasterData/TransactionLog/ViewTransactionLog";


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

export const RECEIPT_AND_COLLECTION_ELEMENTS = {
  // Receipt
  VIEW_RECEIPT_PAGE: <ViewReceipt />,
  DETAIL_RECEIPT_PAGE: <ListDetailReceipt />,
  CREATE_RECEIPT: <ListRececiptForm type="create" />,
  UPDATE_RECEIPT: <ListRececiptForm type="update" />,

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
  UPDATE_TRANSFER_TO_RECEIPT: <ListFormTransferToReceipt type={"update"} />,
};
