import React from "react";
import { getListCategory } from "../../../../../../redux/slices/account_management/MasterData/late_charges";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import BaseContainer from "../../../../../../components/BaseContainer";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import { configApp } from "../../../../../../constants/configApp";

export const AttachmentDetail = ({ type, listDataAttachment, dispatch }) => {
  return (
    <BaseContainer header={"Attachment Information"}>
      <AttachmentSectionForm
        type={type}
        configApplication={configApp.ACCOUNT_SERVICE}
        data={listDataAttachment}
        // updateData={setListDataAttachment}
        dispatch={dispatch}
        getAPICategory={getListCategory}
        service={accountManagementService}
        typeSelector={"late_charge"}
      />
    </BaseContainer>
  );
};
