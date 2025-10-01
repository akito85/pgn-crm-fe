import ViewInvoice from "../../app/pages/RatingBillingInvoice/Invoice/ViewInvoice";
import ProformaInvoice from "../../app/pages/RatingBillingInvoice/Invoice/ProformaInvoice";
import GenerateInvoicePage from "../../app/pages/RatingBillingInvoice/Invoice/GenerateInvoicePage";

export const INVOICE_ELEMENTS = {
  // Generate Invoice List (main page)
  GENERATE_INVOICE_VIEW_PAGE: <ViewInvoice />,
  // Generate Invoice Form (new page)
  GENERATE_INVOICE_FORM_PAGE: <GenerateInvoicePage />,
  // Proforma Invoice
  PROFORMA_INVOICE_VIEW_PAGE: <ProformaInvoice />,
};
