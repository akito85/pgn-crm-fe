import { useState } from "react";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaPromo } from "../Table/TableCriteriaPromo";
import ConditionPromo from "../Form/ConditionsPromo";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../components/Nx/NxDetailText";
import StatusComponent from "../../../../../components/StatusComponent";
import NxDate from "../../../../../components/Nx/NxDatePicker";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../../components/Nx/NxTabs";

const PromoDiscountDetailPages = ({ dataPromo }) => {
  const [activeKey, setActiveKey] = useState(0);

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

  const tabOptions = [
    {
      key: 0,
      label: "Criteria",
      children: (
        <FunctionalCriteriaProduct
          data={dataPromo?.dataCriteria} //data
          dataCriteria={dataPromo?.criteriaValues} //ddl
          type={"detail"}
          selector="promo"
          columnsTable={(listOption, searchInput, searchedColumn, searchText, handleSearch, search, storedData) =>
            columnsTableCriteriaPromo(
              listOption,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              search,
              storedData
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
          data={dataPromo?.dataCondition}
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
  } = dataPromo;

  return (
    <>
      <NxCardContainer header={"Detail Information"}>
        <div className="flex flex-col gap-y-4">
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
                  {handleStatusCase(dataPromo.statusApproval)}
                </NxDetailText>
              </div>
              <NxDetailText label="Criteria">
                {dataPromo?.criteria || ""}
              </NxDetailText>
              <NxDetailText label="Description">
                {dataPromo?.description || ""}
              </NxDetailText>
            </div>
          </NxBaseContainer>
          <NxBaseContainer
            header={"Criteria Information"}
            border
            padding={false}
          >
            <NxTabs
              items={tabOptions}
              activeKey={activeKey}
              onChange={setActiveKey}
            />
          </NxBaseContainer>
        </div>
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
