import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../components/DetailText";
import { handleDate, renderDateTime } from "../Utils/Utils";
import BaseContainer from "../../../../../../components/BaseContainer";
import UploadTemplate from "../Component/UploadTemplate";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../../constants/configApp";

const GeneralTemplateDetailForm = ({
  data = {},
  type,
  dispatch,
  data_templateType,
}) => {
  //true = detail , false = confirm
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

  return (
    <Fragment>
      {type ? (
        <>
          <BaseContainer header={"GENERAL TEMPLATE INFORMATION"}>
            <div className="w-full grid grid-cols-4 gap-3">
              <DetailText label="Name">{data?.templateName || ""}</DetailText>
              <DetailText label="Template Type">{data?.type || ""}</DetailText>
              <DetailText label="Start Date">
                {handleDate(data?.startDate)}
              </DetailText>
              <DetailText label="End Date">
                {handleDate(data?.endDate)}
              </DetailText>
              <DetailText label="Status">
                {handleStatusCase(data?.status)}
              </DetailText>
              <DetailText label="Status Approval">
                {handleStatusCase(data?.statusApproval)}
              </DetailText>
              <div className="col-span-4">
                <DetailText label="Description">
                  {data?.description || ""}
                </DetailText>
              </div>
              <div className="col-span-4">
                <DetailText label="Template"></DetailText>
                <UploadTemplate
                  dispatch={dispatch}
                  fileList={data_templateType}
                  // setFileList={setDataTemplate}
                  service={ratingBillingHttpService}
                  configApplication={configApp.RATING_BILLING_SERVICE}
                  type={true}
                  // setValidateFile={setValidateFile}
                />
              </div>
            </div>
          </BaseContainer>

          <BaseContainer header={"History Log Information"}>
            <div className="w-full grid grid-cols-5 gap-5">
              <DetailText label="Record ID">{data?.templateId}</DetailText>
              <DetailText label="Created Date">
                {renderDateTime(data?.createdDate)}
              </DetailText>
              <DetailText label="Created By">{data?.createdBy}</DetailText>
              <DetailText label="Update Date">
                {renderDateTime(data?.updatedDate)}
              </DetailText>
              <DetailText label="Updated By">{data?.updatedBy}</DetailText>
            </div>
          </BaseContainer>
        </>
      ) : (
        <>
          <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
            {"GENERAL TEMPLATE INFORMATION"}
          </div>

          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label="Name">{data?.name || ""}</DetailText>
            <DetailText label="Template Type">{data?.type || ""}</DetailText>
            <DetailText label="Start Date">
              {handleDate(data?.startDate)}
            </DetailText>
            <DetailText label="End Date">
              {handleDate(data?.endDate)}
            </DetailText>
            <div className="col-span-4">
              <DetailText label="Description">
                {data?.description || ""}
              </DetailText>
            </div>
            <div className="col-span-4">
              <DetailText label="Template"></DetailText>
              <UploadTemplate
                dispatch={dispatch}
                fileList={data_templateType}
                // setFileList={setDataTemplate}
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                type={true}
                // setValidateFile={setValidateFile}
              />
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};

export default GeneralTemplateDetailForm;
