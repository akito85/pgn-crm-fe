import moment from "moment";
import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import DetailText from "../../../../../../components/DetailText";
import RadioTabs from "../../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../../utils";
import FunctionalTableCriteriaTOP from "../TableCriteria/FunctionalTableCriteriaTOP";

const ModalConfirmationTOPS = ({
  tabData,
  data,
  selectedHierarchy,
  apiCriteria,
  criteriaValues = [],
  listDataAppHierDetail = [],
  listDataAttachment = [],
  listDataCriteria = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  setListDataCriteria = () => {},
  dataOption = [],
  datatype,
}) => {
  // Declaration
  const dispatch = useDispatch();

  // State
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const mapingCriteriaData = data?.criterias?.map((item) => item?.criteria);
  // find data criteria
  const matchedObjectsCriteria = apiCriteria?.filter((obj) =>
    mapingCriteriaData?.includes(obj?.id),
  );

  const matchedNamesCriteria = matchedObjectsCriteria
    ?.map((obj) => obj.name)
    ?.reduce((current, next) => current + `, ${next}`, "");

  const types = datatype
    ?.filter((a) => a.id === data?.type)
    ?.find((a) => a.name)?.name;

  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <div className="grid grid-cols-3 w-full gap-5">
            <DetailText label={"Name"}>{data?.name}</DetailText>
            <DetailText label={"Start Date"}>
              {moment(data?.startDate).format(dateFormatting.dateCapital) !==
              null
                ? moment(data?.startDate).format(dateFormatting.dateCapital)
                : ""}
            </DetailText>
            <DetailText label={"End Date"}>
              {data?.endDate
                ? moment(data?.endDate).format(dateFormatting.date)
                : ""}
            </DetailText>
            <DetailText label={"Type"}>{types}</DetailText>
            <DetailText label={"Terms"}>{data?.term}</DetailText>
            <DetailText label={"Calendar"}>
              {data?.isCalendar === true ? "True" : "False"}
            </DetailText>
            <DetailText label={"Saturday"}>
              {data?.isSaturday === true ? "True" : "false"}
            </DetailText>
            <DetailText label={"Sunday"}>
              {data?.isSunday === true ? "True" : "False"}
            </DetailText>
            <div className="col-span-3">
              <DetailText label="Criteria">
                {matchedNamesCriteria?.slice(2)}
              </DetailText>
            </div>
            <div className="col-span-3">
              <DetailText label={"Description"}>{data?.description}</DetailText>
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
                (data) => data.value === selectedHierarchy,
              )?.[0].name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy
          />
        );
      case tabData[2].value:
        return (
          <AttachmentComponent
            type={"preview"}
            data={listDataAttachment}
            typeSelector="top"
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  const handleTop = (e) => {
    setValuePage(e.target.value);
  };
  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={tabData}
        onChange={handleTop}
        currentPosition={valuePage}
      />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} INFORMATION`}
        </div>
        {showSection()}
      </div>
      {valuePage === tabData[0].value ? (
        <div className="flex flex-col gap-4">
          <div className="text-primary text-xs font-bold uppercase">
            {"CRITERIA INFORMATION"}
          </div>
          <FunctionalTableCriteriaTOP
            type={"detail"}
            data={listDataCriteria}
            dataCriteria={criteriaValues}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ModalConfirmationTOPS;
