import React from "react";
import CardComponent from "../../../../components/Card/CardComponent";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import moment from "moment";
import { dateFormatting } from "../../../../utils";
import ButtonComponent from "../../../../components/ButtonComponent";

const ProductClassDetail = ({
  data_detail,
  openModal,
  closeModal = () => {},
}) => {
  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={closeModal}
      type="detail"
      header="Detail Product Class"
      width={800}
      footer={
        <ButtonComponent type={"default"} onClick={closeModal}>
          Back
        </ButtonComponent>
      }
    >
      <CardComponent header={"PRODUCT CLASS INFORMATION"} cols={3}>
        <DetailText label="Name">{data_detail?.name}</DetailText>
        <DetailText label="Description">{data_detail?.description}</DetailText>
        <DetailText label="Status">{data_detail?.status}</DetailText>
      </CardComponent>

      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record ID">{data_detail?.productClassId}</DetailText>
        <DetailText label="Created Date">
          {data_detail?.createdDate
            ? moment(data_detail.createdDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
        <DetailText label="Updated Date">
          {data_detail?.updatedDate
            ? moment(data_detail.updatedDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
      </CardComponent>
    </ModalCustom>
  );
};

export default ProductClassDetail;
