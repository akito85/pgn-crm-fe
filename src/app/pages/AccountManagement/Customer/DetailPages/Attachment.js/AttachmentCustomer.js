import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Fragment } from "react";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import { useSelector } from "react-redux";
import { getCustomerAttachment } from "../../../../../../redux/slices/account_management/Customer/customerAccount";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import moment from "moment";
import { urlLink } from "../../constant";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";

const AttachmentCustomer = ({type = "preview", id = [], dispatch = () => {} }) => {

  const { data_customerDetailAttachment} =
  useSelector((state) => state.customerAccount);

  //state
  const [dataAttachment, setDataAttachment] = useState([]);
  
  useEffect(() => {
    dispatch(getCustomerAttachment({ id }));
  },[dispatch, id])
  
  useEffect(() => {
    if(data_customerDetailAttachment){
      setDataAttachment((data_customerDetailAttachment|| []).map((item) => ({
        ...item,
        createdDate: moment(item.createdDate).format("DD MMM YYYY"),
        fileSize: bytesConverter(item.fileSize || 0),
        urlFile1: `${urlLink(item?.id)}`,
        dataType: "exist",
      })));
    }
  },[data_customerDetailAttachment])

  console.log(dataAttachment)
  return (
    <Fragment>
      <AttachmentSectionForm
        type={type}
        data={dataAttachment}
        updateData={setDataAttachment}
        dispatch={dispatch}
        service={accountManagementService}
        // getAPICategory={getListCategory}
      />
    </Fragment>
  );
};

export default AttachmentCustomer;
