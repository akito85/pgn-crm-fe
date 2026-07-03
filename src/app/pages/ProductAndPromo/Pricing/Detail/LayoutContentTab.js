import React from "react";
import PricingDetailTableDetail from "../Form/PricingDetailTableDetail";
import PricingDetailAdjustmentTable from "./PricingDetailAdjustmentTable";
import PricingLogInformationDetail from "./PricingLogInformationDetail";
import { columnsTableCriteriaAll } from "../../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../components/Nx/NxTabs";

const LayoutContentTab = ({
  listSectionPricingDetail = [],
  handlePricingDetail = () => {},
  typePricingDetail = "",
  type = "detail",
  listDataDetail = [],
  dataPricingSection = {},
  handleSelectedPriceDetail = () => {},
  handleOpenModalSelectedEndDate = () => {},
  setListDataDetail = () => {},
  dispatch = () => {},
  listDataCriteria = [],
  criteriaValues = [],
  setListDataCriteria = () => {},
  listPricingDetailAdjustment = [],
  dataLogInformation = {},
  dataDetailSelected = {},
  countryCriteriaId,
}) => {
  return (
    <>
      <NxCardContainer
        header={"PRICING DETAIL INFORMATION"}
        type="tabs"
        element={
          <NxTabs
            items={[
              {
                key: listSectionPricingDetail[0].value,
                label: listSectionPricingDetail[0].value,
                children: (
                  <PricingDetailTableDetail
                    type={type}
                    data={listDataDetail}
                    priceCode={dataPricingSection.priceCode}
                    updateSelectedData={handleSelectedPriceDetail}
                    updateHistoryEndDate={handleOpenModalSelectedEndDate}
                    updateData={setListDataDetail}
                    dispatch={dispatch}
                  />
                ),
              },
              {
                key: listSectionPricingDetail[1].value,
                label: listSectionPricingDetail[1].value,
                children: (
                  <FunctionalCriteriaProduct
                    data={listDataCriteria} //data
                    dataCriteria={criteriaValues} //ddl
                    type={type}
                    selector="pricing"
                    columnsTable={columnsTableCriteriaAll}
                    countryCriteriaId={countryCriteriaId}
                  />
                ),
              },
            ]}
            activeKey={typePricingDetail}
            onChange={handlePricingDetail}
          />
        }
        withoutPadding
        hideChildren
      />
      {dataDetailSelected.id ? (
        <NxCardContainer header={"PRICE ADJUSMENT INFORMATION"}>
          <PricingDetailAdjustmentTable
            dataDetail={dataDetailSelected}
            data={listPricingDetailAdjustment}
          />
        </NxCardContainer>
      ) : null}
      <NxCardContainer header={"HISTORY LOG INFORMATION"}>
        <PricingLogInformationDetail data={dataLogInformation} />
      </NxCardContainer>
    </>
  );
};

export default LayoutContentTab;
