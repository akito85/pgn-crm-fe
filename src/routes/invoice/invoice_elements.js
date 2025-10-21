import ViewInvoice from "../../app/pages/RatingBillingInvoice/Invoice/ViewInvoice";
import ProformaInvoice from "../../app/pages/RatingBillingInvoice/Invoice/ProformaInvoice";
import GenerateInvoicePage from "../../app/pages/RatingBillingInvoice/Invoice/GenerateInvoicePage";
import GenerateProformaInvoicePage from "../../app/pages/RatingBillingInvoice/Invoice/GenerateProformaInvoicePage";
import EMeteraiManagement from "../../app/pages/RatingBillingInvoice/Invoice/EMeteraiManagement";
import ManagementDeliveryInvoice from "../../app/pages/RatingBillingInvoice/Invoice/ManagementDeliveryInvoice";
import ViewFaktur from "../../app/pages/RatingBillingInvoice/Management E-Faktur/ViewFaktur";
import DetailEFaktur from "../../app/pages/RatingBillingInvoice/Management E-Faktur/DetailEFaktur";

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
  //manajemen e-faktur
  EFAKTUR_VIEW_PAGE: <ViewFaktur />,
  EFAKTUR_DETAIL_PAGE: <DetailEFaktur />,
};
