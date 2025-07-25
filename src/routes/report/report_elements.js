import { lazy } from "react";

const CustomerReport = lazy(() =>
  import("../../app/pages/Report/Customer/CustomerReportList")
);
const CustomerAggrementReport = lazy(() =>
  import("../../app/pages/Report/CustomerAgreement/CustomerAgreementReport")
);
const CustomerAssetReport = lazy(() =>
  import("../../app/pages/Report/CustomerAsset/CustomerAssetReport")
);
const CustomerWarrantyReport = lazy(() =>
  import("../../app/pages/Report/CustomerWarranty/CustomerWarrantyReport")
);

const REPORT_ELEMENTS = {
  VIEW_CUSTOMER_REPORT_ELEMENT: <CustomerReport />,
  VIEW_CUSTOMER_AGREEMENT_ELEMENT: <CustomerAggrementReport />,
  VIEW_CUSTOMER_ASSET_ELEMENT: <CustomerAssetReport />,
  VIEW_CUSTOMER_WARRANTY_ELEMENT: <CustomerWarrantyReport />,
};

export default REPORT_ELEMENTS;
