import { useDispatch, useSelector } from "react-redux";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../../../constants/configApp";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { getAttachmentDetail } from "../../../../../../redux/slices/rating_billing_invoice/billingItem";
import { useState } from "react";

const BillingItemAttachment = ({ type }) => {
  const { data_AttachmentDetail } = useSelector((state) => state.billing_item);
  const dispatch = useDispatch();
  const [dataAttachment, setDataAttachment] = useState([]);
  return (
    <AttachmentComponent
      type={type}
      data={data_AttachmentDetail?.result}
      updateData={setDataAttachment}
      dispatch={dispatch}
      typeSelector="billing_item"
      getAPICategory={getAttachmentDetail}
      service={ratingBillingHttpService}
      configApplication={configApp.RATING_BILLING_SERVICE}
      // getAPIGuard={getConfigFileRBIData}
      typeRBI={"data"}
    />
  );
};
export default BillingItemAttachment;
