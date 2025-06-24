import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { dateFormatting } from "../../../../../utils";
import moment from "moment";
import { getAttachmentDetailPOS, getListCategoryFile } from "../../../../../redux/slices/rating_billing_invoice/PointOfSales";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";

const PointOfSalesAttachment = ({ id = 0, dispatch = () => {} }) => {
  // Selector
  const { data_attachment } = useSelector((state) => state.pointOfSales);

  const [dataAttachment, setDataAttachment] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getAttachmentDetailPOS(id));
    }
  }, [id]);

  useEffect(() => {
    if (data_attachment) {
      setDataAttachment([
        ...(data_attachment?.result || [])?.map((item) => {
          return {
            ...item,
            createdDate: moment(item.createdDate).format(dateFormatting.date),
            // uploadBy: item.createdBy,
            // uploadDate: moment(item.createdDate).format(dateFormatting.date),
            // fileSize: bytesConverter(item.fileSize || 0),
            dataType: "exist",
          };
        }),
      ]);
    }
  }, [data_attachment]);

  // console.log(data_viewDetail)
  return (
    <AttachmentComponent
      type={"detail"}
      data={dataAttachment}
      updateData={setDataAttachment}
      dispatch={dispatch}
			typeSelector="pointOfSales"
			getAPICategory={getListCategoryFile}
			service={ratingBillingHttpService}
			configApplication={configApp.RATING_BILLING_SERVICE}
			getAPIGuard={getConfigFileRBIData}
			typeRBI={"data"}
    />
  );
};

export default PointOfSalesAttachment;
