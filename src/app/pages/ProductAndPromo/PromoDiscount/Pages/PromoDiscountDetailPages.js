import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaPromo } from "../Table/TableCriteriaPromo";
import ConditionPromo from "../Form/ConditionsPromo";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../components/Nx/NxDetailText";
import StatusComponent from "../../../../../components/StatusComponent";
import NxDate from "../../../../../components/Nx/NxDatePicker";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../components/Nx/NxTabs";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import productPromoHttpService from "../../../../../redux/services/productPromoHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getListCriteriaPromo } from "../../../../../redux/slices/product_promo/promoSlice";
import { getCriteriaIdByCode } from "../../UtilsProduct/UtilsAllProduct";

const PromoDiscountDetailPages = ({ detail, attachments = [] }) => {
  const [activeKey, setActiveKey] = useState(0);
  const [childActiveKey, setChildActiveKey] = useState(0);

  const dispatch = useDispatch();
  const { dataListCriteria } = useSelector((state) => state.promo);

  useEffect(() => {
    dispatch(getListCriteriaPromo());
  }, [dispatch]);

  const countryCriteriaId = getCriteriaIdByCode(
    (dataListCriteria || []).map((criteria) => ({
      name: criteria.text,
      value: criteria.id,
      code: criteria.code,
    })),
    "COUNTRY"
  );

  const handleStatusCase = (index) => {
    let text;
    switch (index) {
      case "WAITING APPROVAL":
      case "WAITING_APPROVAL":
        text = "Waiting Approval";
        break;
      default:
        text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        break;
    }
    return text;
  };

  const childTabOptions = [
    {
      key: 0,
      label: "Criteria",
      children: (
        <FunctionalCriteriaProduct
          data={detail?.dataCriteria} //data
          dataCriteria={detail?.criteriaValues} //ddl
          type={"detail"}
          selector="promo"
          idTable="promo-detail-criteria-table"
          columnsTable={(listOption, searchInput, searchedColumn, searchText, handleSearch, search, storedData) =>
            columnsTableCriteriaPromo(
              listOption,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              search,
              storedData,
              countryCriteriaId
            )
          }
          fixedColumn={[
            "ADJUSTMENT TYPE",
            "ADJUSTMENT VALUE",
            "UOM",
            "DESCRIPTION",
            "MAX VALUE UOM",
            "FROM ITEM",
            "TIERING",
            "STATUS",
          ]}
        />
      )
    },
    {
      key: 1,
      label: "Condition",
      children: (
        <ConditionPromo
          type={"detail"}
          data={detail?.dataCondition}
          setStoredData={() => {}}
          storedData={false}
        />
      )
    }
  ];

  const {
    id,
    name,
    categoryName,
    typeName,
    promotionTypeName,
    startDate,
    endDate,
    status,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
    statusApproval,
    criteria,
    description,
  } = detail;

  const tabObtions = [
    {
      key: 0,
      label: "Promo Information",
      children: (
        <>
          <NxBaseContainer header={"PROMO DETAIL"} border>
            <div className="flex flex-col gap-y-4">
              <div className="w-full grid grid-cols-3 gap-4">
                <NxDetailText label="Name">{name || ""}</NxDetailText>
                <NxDetailText label="Category">{categoryName}</NxDetailText>
                <NxDetailText label="Type">{typeName}</NxDetailText>
                <NxDetailText label="Promotion Type">{promotionTypeName}</NxDetailText>
                <NxDetailText label="Start Date">
                  {NxDate.formatDate(startDate, "DD MMM YYYY")}
                </NxDetailText>
                <NxDetailText label="End Date">
                  {NxDate.formatDate(endDate, "DD MMM YYYY")}
                </NxDetailText>
                <NxDetailText label="Status">
                  <StatusComponent colour={status}>
                    {status}
                  </StatusComponent>
                </NxDetailText>
                <NxDetailText label="Status Approval">
                  {handleStatusCase(statusApproval)}
                </NxDetailText>
              </div>
              <NxDetailText label="Criteria">
                {criteria}
              </NxDetailText>
              <NxDetailText label="Description">
                {description}
              </NxDetailText>
            </div>
          </NxBaseContainer>
          <NxBaseContainer
            header={"Criteria Information"}
            border
            padding={false}
          >
            <NxTabs
              items={childTabOptions}
              activeKey={childActiveKey}
              onChange={setChildActiveKey}
            />
          </NxBaseContainer>
        </>
      )
    },
    {
      key: 1,
      label: "Attachment",
      children: (
        <>
          <AttachmentComponent 
            typeSelector={"promo"}
            data={attachments}
            type={"detail"}
            service={productPromoHttpService}
            configApplication={configApp.PRODUCT_SERVICE}
          />
        </>
      )
    }
  ]

  return (
    <>
      <NxCardContainer header={"Detail Information"} withoutPadding>
        <NxTabs
          items={tabObtions}
          activeKey={activeKey}
          onChange={setActiveKey}
        />
      </NxCardContainer>

      <NxCardContainer header={"HISTORY LOG INFORMATION"}>
        <NxBaseContainer border>
          <div className="w-full grid grid-cols-5 gap-4">
            {/* History Log Information */}
            <NxDetailText label="Record Id">{id}</NxDetailText>
            <NxDetailText label="Created Date">{NxDate.formatDate(createdDate)}</NxDetailText>
            <NxDetailText label="Created By">{createdBy}</NxDetailText>
            <NxDetailText label="Updated Date">{NxDate.formatDate(updatedDate)}</NxDetailText>
            <NxDetailText label="Updated By">{updatedBy}</NxDetailText>
          </div>
        </NxBaseContainer>
      </NxCardContainer>
    </>
  );
};

export default PromoDiscountDetailPages;
