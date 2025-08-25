import { Checkbox } from "antd";
import moment from "moment";
import { Fragment, useState } from "react";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../utils";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import FunctionalTableCriteriaPayment from "./Table/FunctionalTableCriteriaPayment";
import { useSelector } from "react-redux";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";

const ConfirmModalBankAccount = ({
  data,
  listDataCriteria,
  criteriaValues,
  listDataAttachment = [],
  columns = [],
  pageSize = [],
  listDataDetail = [],
  listDataAppHierDetail = [],
  dataOption = [],
  tabData = [],
  apiCriteria,
  dataTable = [],
  isVA,
  dataType,
  data_entity,
  data_currency,
  selectedHierarchy,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  // find data criteria
  const matchedObjectsCriteria = apiCriteria?.filter((obj) =>
    data?.criteria?.includes(obj?.Id)
  );
  const matchedNamesCriteria = matchedObjectsCriteria
    ?.map((obj) => obj.text)
    ?.reduce((current, next) => current + `, ${next}`, "");

  const { dataEntity } = useSelector((state) => state.bank);
  const type = dataType
    ?.filter((a) => a?.id === data?.type)
    ?.find((b) => b?.name)?.name;
  const currency = data_currency
    ?.filter((a) => a?.id === data?.currency)
    ?.find((b) => b?.name)?.name;
  const entity = data_entity
    ?.filter((a) => a?.id === data?.entity)
    ?.find((b) => b?.name)?.name;

  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        const valueEntity = (dataEntity || []).filter(
          (item) => item.id === data.entity
        )?.[0]?.name;
        return (
          <div className="w-full">
            <div className="grid grid-cols-3 w-full gap-5">
              <DetailText label={"Bank Account Number"}>
                {data?.accountNumber}
              </DetailText>
              <DetailText label={"Bank Account Name"}>
                {data?.accountName}
              </DetailText>
              <DetailText label={"Branch Name"}>{data?.branch}</DetailText>
              <DetailText label={"Currency"}>{currency}</DetailText>
              <DetailText label={"Entity"}>{entity}</DetailText>
              <DetailText label={"Type"}>{type}</DetailText>
              <DetailText label="Criteria">
                {matchedNamesCriteria?.slice(2)}
              </DetailText>
              <DetailText label={"Start Date"}>
                {moment(data?.startDate).format(dateFormatting.date)}
              </DetailText>
              <DetailText label={"End Date"}>
                {data?.endDate
                  ? moment(data?.endDate).format(dateFormatting.date)
                  : ""}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {data?.description}
                </DetailText>
              </div>
              {isVA === true ? (
                <>
                  <DetailText label={"IsVA"}>
                    {data?.isVA === "on" ? "True" : "False"}
                  </DetailText>
                  <DetailText label={"Total Digit"}>
                    {data?.totalDigit}
                  </DetailText>
                  <DetailText label={"First Static Code"}>
                    {data?.fsCode}
                  </DetailText>
                </>
              ) : null}
            </div>
          </div>
        );
      case tabData[1].value:
        return (
          <ApprovalComponentGeneral
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (data) => data.value === selectedHierarchy
              )?.[0].name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy
          />
        );
      case tabData[2].value:
        return (
          <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  const handlePricingInfo = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={tabData}
        onChange={handlePricingInfo}
        currentPosition={valuePage}
      />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} Information`}
        </div>
        {showSection()}
      </div>
      {valuePage === tabData[0].value ? (
        <div className="flex flex-col gap-4">
          <div className="text-primary text-xs font-bold uppercase">
            {"Criteria Information"}
          </div>
          <FunctionalTableCriteriaPayment
            type={"detail"}
            data={listDataCriteria}
            dataCriteria={criteriaValues}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ConfirmModalBankAccount;
