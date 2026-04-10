import ViewInvoice from "../../app/pages/RatingBillingInvoice/Invoice/ViewInvoice";
import ViewTaxExemption from "../../app/pages/RatingBillingInvoice/TaxExemption/ViewTaxExemption";
import ProformaInvoice from "../../app/pages/RatingBillingInvoice/Invoice/ProformaInvoice";
import GenerateInvoicePage from "../../app/pages/RatingBillingInvoice/Invoice/GenerateInvoicePage";
import GenerateProformaInvoicePage from "../../app/pages/RatingBillingInvoice/Invoice/GenerateProformaInvoicePage";
import EMeteraiManagement from "../../app/pages/RatingBillingInvoice/Invoice/EMeteraiManagement";
import ManagementDeliveryInvoice from "../../app/pages/RatingBillingInvoice/Invoice/ManagementDeliveryInvoice";
import CreateDeliveryJobPage from "../../app/pages/RatingBillingInvoice/Invoice/CreateDeliveryJobPage";
import ViewFaktur from "../../app/pages/RatingBillingInvoice/Management E-Faktur/ViewFaktur";
import DetailEFaktur from "../../app/pages/RatingBillingInvoice/Management E-Faktur/DetailEFaktur";
import AdjustmentInvoicePage from "../../app/pages/RatingBillingInvoice/Invoice/AdjustmentInvoice/AdjustmentInvoicePage";
import AdjustmentInvoiceForm from "../../app/pages/RatingBillingInvoice/Invoice/AdjustmentInvoice/AdjustmentInvoiceForm";
import AdjustmentInvoiceDetail from "../../app/pages/RatingBillingInvoice/Invoice/AdjustmentInvoice/AdjustmentInvoiceDetail";
import EFakturForm from "../../app/pages/RatingBillingInvoice/Management E-Faktur/CreateEfaktur/EFakturForm";
import DetailTaxExemption from "../../app/pages/RatingBillingInvoice/TaxExemption/DetailTaxExemption";

export const INVOICE_ELEMENTS = {
  // Generate Invoice List (main page)
  GENERATE_INVOICE_VIEW_PAGE: <ViewInvoice />,
  // Generate Invoice Form (new page)
  GENERATE_INVOICE_FORM_PAGE: <GenerateInvoicePage />,
  // Proforma Invoice
  PROFORMA_INVOICE_VIEW_PAGE: <ProformaInvoice />,
  // Generate Proforma Invoice Form (new page)
  GENERATE_PROFORMA_INVOICE_FORM_PAGE: <GenerateProformaInvoicePage />,
  // E-Meterai Management
  E_METERAI_MANAGEMENT_PAGE: <EMeteraiManagement />,
  // Management Delivery Invoice
  MANAGEMENT_DELIVERY_INVOICE_PAGE: <ManagementDeliveryInvoice />,
  // Create Delivery Job (new page)
  CREATE_DELIVERY_JOB_PAGE: <CreateDeliveryJobPage />,
  //manajemen e-faktur
  EFAKTUR_VIEW_PAGE: <ViewFaktur />,
  EFAKTUR_DETAIL_PAGE: <DetailEFaktur />,
  EFAKTUR_FROM_CREATE: <EFakturForm type="create" />,
  // Adjustment Invoice
  ADJUSTMENT_INVOICE_VIEW_PAGE: <AdjustmentInvoicePage />,
  ADJUSTMENT_INVOICE_FORM_PAGE: <AdjustmentInvoiceForm type="create" />,
  ADJUSTMENT_INVOICE_FORM_PAGE_UPDATE: <AdjustmentInvoiceForm type="update" />,
  ADJUSTMENT_INVOICE_DETAIL_PAGE: <AdjustmentInvoiceDetail />,

  // Tax Exemption
  TAX_EXMPTION_VIEW_PAGE: <ViewTaxExemption />,
  TAX_EXMPTION_CREATE_PAGE: <div>Tax Exemption Create Page</div>,
  TAX_EXMPTION_DETAIL_PAGE: <DetailTaxExemption />,
};
