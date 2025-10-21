import React, { useState } from "react";
import RadioTabs from "../../../../../../../../../../components/RadioTabs";
import TableDetail from "./TableDetail";
// import TablePricing from "./TablePricing"
import TableLateCharge from "./TableLateCharge";
import TableCalcRule from "./TableCalcRule";
import TableTos from "./TableTos";
import TablePricing from "../../../SaDetail/TablePricing";
import TableTaxImplication from "./TableTaxImplication";
import DetailText from "../../../../../../../../../../components/DetailText";

const TabsDetail = ({
  appHierDataDetail,
  dataTableProduct,
  dataPricing,
  dataTableCalcRule,
  dataTermOfService,
  dataTableLateCharge,
  dataTaxImplication,
  saDetailObj,
}) => {
  const [valuePage, setValuePage] = useState("Pricing");
  const [tabPagesSa, setTabPagesSa] = useState([
    // {value: "Detail",},
    { value: "Pricing" },
    { value: "Calculation Rule" },
    { value: "Term of Service" },
    { value: "Late Charge" },
    { value: "Tax Implication" },
  ]);
  return (
    <div>
      <div className="pb-6">
        <RadioTabs
          data={tabPagesSa}
          onChange={(e) => setValuePage(e.target.value)}
        />
      </div>

      <div className={`${valuePage !== "Detail" ? "hidden" : ""}`}>
        <TableDetail
          dataTableProduct={dataTableProduct}
          saDetailObj={saDetailObj}
        />
      </div>

      <div className={`${valuePage !== "Pricing" ? "hidden" : ""}`}>
        <div className="grid grid-cols-4 gap-5 py-[10px]">
          <DetailText label="Price Code">
            {saDetailObj?.priceCodeText}
          </DetailText>
          <DetailText label="Price Adjustment">
            {saDetailObj?.priceAdjustmentText}
          </DetailText>
          <DetailText label="Pricing Rule">
            {saDetailObj?.pricingRule == -1
              ? "Custom Tiering"
              : saDetailObj?.pricingRuleText || null}
          </DetailText>
        </div>
        <TablePricing data={dataPricing} />
      </div>

      <div className={`${valuePage !== "Calculation Rule" ? "hidden" : ""}`}>
        <TableCalcRule
          dataTableCalcRule={dataTableCalcRule}
          saDetailObj={saDetailObj}
        />
      </div>

      <div className={`${valuePage !== "Term of Service" ? "hidden" : ""}`}>
        <TableTos dataTermOfService={dataTermOfService} />
      </div>

      <div className={`${valuePage !== "Late Charge" ? "hidden" : ""}`}>
        <TableLateCharge dataTableLateCharge={dataTableLateCharge} />
      </div>

      <div className={`${valuePage !== "Tax Implication" ? "hidden" : ""}`}>
        <TableTaxImplication dataTaxImplication={dataTaxImplication} />
      </div>
    </div>
  );
};

export default TabsDetail;
