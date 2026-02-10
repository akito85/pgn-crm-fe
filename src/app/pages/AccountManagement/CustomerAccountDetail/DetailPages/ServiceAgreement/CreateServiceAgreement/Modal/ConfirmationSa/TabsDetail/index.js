import React, { useState } from 'react'
import NxTabs from '../../../../../../../../../../components/Nx/NxTabs';
import NxBaseContainer from '../../../../../../../../../../components/Nx/NxBaseContainer';
import TableLateCharge from "./TableLateCharge"
import TableCalcRule from "./TableCalcRule"
import TableTos from "./TableTos"
import TablePricing from '../../../SaDetail/TablePricing';
import TableTaxImplication from './TableTaxImplication';
import DetailText from '../../../../../../../../../../components/DetailText';

const TabsDetail = ({
  appHierDataDetail,
  dataTableProduct,
  dataPricing,
  dataTableCalcRule,
  dataTermOfService,
  dataTableLateCharge,
  dataTaxImplication,
  saDetailObj
}) => {
  const [valuePage, setValuePage] = useState("pricing");

  return (
    <div>
      <NxTabs
        activeKey={valuePage}
        onChange={(key) => setValuePage(key)}
        items={[
          {
            key: "pricing",
            label: "Pricing",
            children: (
              <>
                <div className="grid grid-cols-4 gap-5">
                  <DetailText label="Price Code">{saDetailObj?.priceCodeText}</DetailText>
                  <DetailText label="Price Adjustment">{saDetailObj?.priceAdjustmentText}</DetailText>
                  <DetailText label="Pricing Rule">{saDetailObj?.pricingRule == -1 ? "Custom Tiering" : saDetailObj?.pricingRuleText || null}</DetailText>
                </div>
                <TablePricing data={dataPricing} />
              </>

            ),
          },
          {
            key: "calculationRule",
            label: "Calculation Rule",
            children: (
              <TableCalcRule dataTableCalcRule={dataTableCalcRule} saDetailObj={saDetailObj} />
            ),
          },
          {
            key: "termOfService",
            label: "Term of Service",
            children: (
              <TableTos dataTermOfService={dataTermOfService} />
            ),
          },
          {
            key: "lateCharge",
            label: "Late Charge",
            children: (
              <TableLateCharge dataTableLateCharge={dataTableLateCharge} />
            ),
          },
          {
            key: "taxImplication",
            label: "Tax Implication",
            children: (
              <TableTaxImplication dataTaxImplication={dataTaxImplication} />
            ),
          },
        ]}
      />
    </div>
  )
}

export default TabsDetail