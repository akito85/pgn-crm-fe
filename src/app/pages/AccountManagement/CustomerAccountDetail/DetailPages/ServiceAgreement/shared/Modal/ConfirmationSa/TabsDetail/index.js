import React, { useState } from 'react'
import NxTabs from '../../../../../../../../../../components/Nx/NxTabs';
import NxBaseContainer from '../../../../../../../../../../components/Nx/NxBaseContainer';
import TableLateCharge from "./TableLateCharge"
import TableCalcRule from "./TableCalcRule"
import TableTos from "./TableTos"
import TablePricing from './TablePricing';
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

  const getPriceCode = (val) => {
    // console.log(dataPricing)
    // val is the Price Code Master ID (idMPricing / priceCodeId)
    // dataPricing objects mapped from saPricing store this in item.priceCode (item.id is the row PK)
    const priceCode = dataPricing && dataPricing?.filter((item) => item?.priceCode === val || item?.id === val)
    // console.log(priceCode)
    if (!priceCode || priceCode.length === 0) {
      // Fallback if not found in dataPricing list
      return saDetailObj?.priceCodeText || ''
    }
    // The property containing the text name is priceCodeName, not text
    return priceCode[0]?.priceCodeName || saDetailObj?.priceCodeText || ''
  }

  console.log(saDetailObj)

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
                  <DetailText label="Price Code">{getPriceCode(saDetailObj?.priceCode)}</DetailText>
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