import REPORT_ELEMENTS from "./report_elements";
import REPORT_ROUTES from "./report_routes";

const report_setup = [
  // summary section
  {
    path: REPORT_ROUTES.VIEW_CUSTOMER_REPORT,
    element: REPORT_ELEMENTS.VIEW_CUSTOMER_REPORT_ELEMENT,
  },
  {
    path: REPORT_ROUTES.VIEW_CUSTOMER_AGREEMENT_REPORT,
    element: REPORT_ELEMENTS.VIEW_CUSTOMER_AGREEMENT_ELEMENT,
  },
  {
    path: REPORT_ROUTES.VIEW_CUSTOMER_ASSET_REPORT,
    element: REPORT_ELEMENTS.VIEW_CUSTOMER_ASSET_ELEMENT,
  },
  {
    path: REPORT_ROUTES.VIEW_CUSTOMER_WARRANTY_REPORT,
    element: REPORT_ELEMENTS.VIEW_CUSTOMER_WARRANTY_ELEMENT,
  },

  // repoort section
];

export default report_setup;
