import { useState } from "react";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../components/Nx/NxTabs";
import PricingTable from "./PricingTable";
import PricingAdjustTable from "../PricingAdjustment/PricingAdjustTable";

const TAB_PRICING = "pricing";
const TAB_ADJUST = "pricingAdjust";

const tabLabels = {
  [TAB_PRICING]: "Pricing",
  [TAB_ADJUST]: "Pricing Adjustment",
};

const routes = (activeKey) => [
  { path: "", breadcrumbName: "Product & Promo" },
  { path: PRODUCT_PROMO_ROUTES.VIEW_PRICING, breadcrumbName: tabLabels[activeKey] || "Pricing" },
];

const tabOptions = [
  { key: TAB_PRICING, label: "Pricing", children: <PricingTable /> },
  { key: TAB_ADJUST, label: "Pricing Adjustment", children: <PricingAdjustTable /> },
];

const Pricing = () => {
  const [activeKey, setActiveKey] = useState(TAB_PRICING);

  return (
    <>
      <BreadCrumb routes={routes(activeKey)} />
      <NxCardContainer
        header="Pricing"
        type="tabs"
        element={
          <NxTabs
            items={tabOptions}
            onChange={setActiveKey}
            activeKey={activeKey}
          />
        }
        withoutPadding
        hideChildren
      />
    </>
  );
};

export default Pricing;
