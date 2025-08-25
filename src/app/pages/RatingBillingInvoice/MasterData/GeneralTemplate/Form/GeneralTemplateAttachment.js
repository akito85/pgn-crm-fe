import React from "react";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../../constants/configApp";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { getConfigFileRBIData } from "../../../../../../redux/slices/attachmentSlice";
import { getListCategoryFile } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/general_template";

const GeneralTempalteAttachment = ({
  type,
  dispatch = () => {},
  dataAttachment = [],
  setDataAttachment = () => {},
}) => {
  return (
    // <BaseContainer header={"ATTACHMENT INFORMATION"}>
    <AttachmentComponent
      type={type}
      data={dataAttachment}
      updateData={setDataAttachment}
      dispatch={dispatch}
      typeSelector="general_template"
      getAPICategory={getListCategoryFile}
      service={ratingBillingHttpService}
      configApplication={configApp.RATING_BILLING_SERVICE}
      getAPIGuard={getConfigFileRBIData}
      typeRBI={"general_template"}
      mandatory={true}
    />
    // </BaseContainer>
  );
};

export default GeneralTempalteAttachment;
