import Pricing from "../../app/pages/ProductAndPromo/Pricing/Pricing";
import PricingDetail from "../../app/pages/ProductAndPromo/Pricing/PricingDetail";
import PricingForm from "../../app/pages/ProductAndPromo/Pricing/PricingForm";
import Product from "../../app/pages/ProductAndPromo/Product/Product";
import ProductClassView from "../../app/pages/ProductAndPromo/ProductClass/ProductClassView";
import ProductClassCreate from "../../app/pages/ProductAndPromo/ProductClass/ProductClassCreate";
import ProductClassUpdate from "../../app/pages/ProductAndPromo/ProductClass/ProductClassUpdate";
import PricingRuleView from "../../app/pages/ProductAndPromo/PricingRule/PricingRuleView";
import PricingRuleUpdate from "../../app/pages/ProductAndPromo/PricingRule/PricingRuleUpdate";
import PricingRuleCreate from "../../app/pages/ProductAndPromo/PricingRule/PricingRuleCreate";
import PricingRuleDetail from "../../app/pages/ProductAndPromo/PricingRule/PricingRuleDetail";
import ProductForm from "../../app/pages/ProductAndPromo/Product/ProductForm";
import ProductDetail from "../../app/pages/ProductAndPromo/Product/ProductDetail";
import PricingAdjustForm from "../../app/pages/ProductAndPromo/PricingAdjustment/PricingAdjustForm";
import PricingAdjustDetail from "../../app/pages/ProductAndPromo/PricingAdjustment/PricingAdjustDetail";
import TermOfServiceView from "../../app/pages/ProductAndPromo/TOS/TermOfServiceView";
import TermOfServiceUpdate from "../../app/pages/ProductAndPromo/TOS/TermOfServiceUpdate";
import TermOfServiceCreate from "../../app/pages/ProductAndPromo/TOS/TermOfServiceCreate";
import PromoDiscountView from "../../app/pages/ProductAndPromo/PromoDiscount/PromoDiscountView";
import PromoDiscountDetail from "../../app/pages/ProductAndPromo/PromoDiscount/PromoDiscountDetail";
import PromoDiscountCreateAndUpdate from "../../app/pages/ProductAndPromo/PromoDiscount/PromoDiscountCreateAndUpdate";

export const PRODUCT_PROMO_ELEMENTS = {
  // Product
  VIEW_PRODUCT_PAGE: <Product />,
  CREATE_PRODUCT_PAGE: <ProductForm type="create" />,
  UPDATE_PRODUCT_PAGE: <ProductForm type="update" />,
  DETAIL_PRODUCT_PAGE: <ProductDetail />,

  // Pricing
  VIEW_PRICING_PAGE: <Pricing />,
  CREATE_PRICING_PAGE: <PricingForm type="create" />,
  UPDATE_PRICING_PAGE: <PricingForm type="update" />,
  DETAIL_PRICING_PAGE: <PricingDetail />,

  // Pricing Adjustment
  CREATE_PRICING_ADJUSTMENT_PAGE: <PricingAdjustForm type="create" />,
  UPDATE_PRICING_ADJUSTMENT_PAGE: <PricingAdjustForm type="update" />,
  DETAIL_PRICING_ADJUSTMENT_PAGE: <PricingAdjustDetail />,

  // Product Class
  VIEW_PRODUCT_CLASS: <ProductClassView />,
  CREATE_PRODUCT_CLASS: <ProductClassCreate />,
  UPDATE_PRODUCT_CLASS: <ProductClassUpdate />,

  // Pricing Rule
  VIEW_PRICING_RULE: <PricingRuleView />,
  CREATE_PRICING_RULE: <PricingRuleCreate />,
  UPDATE_PRICING_RULE: <PricingRuleUpdate />,
  DETAIL_PRICING_RULE: <PricingRuleDetail />,

  // Term Of Service
	VIEW_TERM_OF_SERVICE: <TermOfServiceView />,
	CREATE_TERM_OF_SERVICE: <TermOfServiceCreate />,
	UPDATE_TERM_OF_SERVICE: <TermOfServiceUpdate />,

  // Promo Discount
  VIEW_PROMO_DISCOUNT: <PromoDiscountView />,
  CREATE_PROMO_DISCOUNT: <PromoDiscountCreateAndUpdate type={"create"} />,
  UPDATE_PROMO_DISCOUNT: <PromoDiscountCreateAndUpdate type={"update"}/>,
  DETAIL_PROMO_DISCOUNT: <PromoDiscountDetail />,
};
