import React from "react";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import BaseContainer from "../../../../../../components/BaseContainer";
import { getListCategoryFile } from "../../../../../../redux/slices/rating_billing_invoice/PointOfSales";
import { configApp } from "../../../../../../constants/configApp";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { getConfigFileRBIData } from "../../../../../../redux/slices/attachmentSlice";

const PointOfSalesPageAttachment = ({
  type,
  dispatch = () => {},
  dataAttachment = [],
  setDataAttachment = () => {},
}) => {
  return (
    <BaseContainer header={"ATTACHMENT INFORMATION"}>
      <AttachmentComponent
        type={type}
        data={dataAttachment}
        updateData={setDataAttachment}
        dispatch={dispatch}
        typeSelector="pointOfSales"
        getAPICategory={getListCategoryFile}
        service={ratingBillingHttpService}
        configApplication={configApp.RATING_BILLING_SERVICE}
        getAPIGuard={getConfigFileRBIData}
        typeRBI={"data"}
        mandatory={true}
      />
    </BaseContainer>
  );
};

export default PointOfSalesPageAttachment;
