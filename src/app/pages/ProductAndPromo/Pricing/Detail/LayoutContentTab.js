import React from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import RadioTabs from "../../../../../components/RadioTabs";
import PricingDetailTableDetail from "../Form/PricingDetailTableDetail";
import PricingDetailTableCriteria from "../Form/PricingDetailTableCriteria";
import PricingDetailAdjustmentTable from "./PricingDetailAdjustmentTable";
import PricingLogInformationDetail from "./PricingLogInformationDetail";
import { columnsTableCriteriaAll } from "../../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";

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
}) => {
  return (
    <>
      <BaseContainer
        header={"PRICING DETAIL INFORMATION"}
        type="tabs"
        element={
          <RadioTabs
            data={listSectionPricingDetail}
            onChange={handlePricingDetail}
            currentPosition={typePricingDetail}
          />
        }
      >
        {typePricingDetail === listSectionPricingDetail[0].value ? (
          <PricingDetailTableDetail
            type={type}
            data={listDataDetail}
            priceCode={dataPricingSection.priceCode}
            updateSelectedData={handleSelectedPriceDetail}
            updateHistoryEndDate={handleOpenModalSelectedEndDate}
            updateData={setListDataDetail}
            dispatch={dispatch}
          />
        ) : (
          <FunctionalCriteriaProduct
            data={listDataCriteria} //data
            dataCriteria={criteriaValues} //ddl
            type={type}
            selector="pricing"
            columnsTable={columnsTableCriteriaAll}
            // fixedColumn={[
            //   "ADJUSTMENT TYPE",
            //   "ADJUSTMENT VALUE",
            //   "UOM",
            //   "DESCRIPTION",
            //   "MAX VALUE UOM",
            //   "FROM ITEM",
            //   "TIERING",
            // ]}
          />
          // <PricingDetailTableCriteria
          //   type={type}
          //   data={listDataCriteria}
          //   dataCriteria={criteriaValues}
          //   updateData={setListDataCriteria}
          //   dispatch={dispatch}
          // />
        )}
      </BaseContainer>
      {dataDetailSelected.id ? (
        <BaseContainer header={"PRICE ADJUSMENT INFORMATION"}>
          <PricingDetailAdjustmentTable
            dataDetail={dataDetailSelected}
            data={listPricingDetailAdjustment}
          />
        </BaseContainer>
      ) : null}
      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <PricingLogInformationDetail data={dataLogInformation} />
      </BaseContainer>
    </>
  );
};

export default LayoutContentTab;
