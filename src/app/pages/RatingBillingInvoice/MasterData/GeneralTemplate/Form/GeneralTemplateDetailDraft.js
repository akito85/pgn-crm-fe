import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../components/DetailText";
import { handleDate, renderDateTime } from "../Utils/Utils";
import CardContainer from "../../../../../../components/CardContainer";
import CollapsibleContainer from "../../../../../../components/CollapsibleContainer";
import UploadTemplate from "../Component/UploadTemplate";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../../constants/configApp";

const GeneralTemplateDetailDraft = ({
  data = {},
  status = "",
  type,
  dispatch,
  data_templateType,
}) => {
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
      return text
  }
  return (
    <Fragment>
      <CollapsibleContainer header={"GENERAL TEMPLATE INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label="Name">{data?.templateName || ""}</DetailText>
          <DetailText label="Template Type">
            {data?.templateType?.name || ""}
          </DetailText>
          <DetailText label="Start Date">
            {handleDate(data?.startDate)}
          </DetailText>
          <DetailText label="End Date">{handleDate(data?.endDate)}</DetailText>
          <DetailText label="Default Format">
            {data?.defaultFormat || ""}
          </DetailText>
          <DetailText label="Status">
            {handleStatusCase(data?.status)}
          </DetailText>
          <DetailText label="Status Approval">
            {handleStatusCase(data?.statusApproval)}
          </DetailText>
          <DetailText label="Template">
            <UploadTemplate
              dispatch={dispatch}
              fileList={data_templateType}
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
              type={true}
            />
          </DetailText>
          <div className="col-span-4">
            <DetailText label="Description">
              {data?.description || ""}
            </DetailText>
          </div>
        </div>
      </CollapsibleContainer>
    </Fragment>
  );
};

export default GeneralTemplateDetailDraft;
