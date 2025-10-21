import React from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const DetailEquipment = ({ isOpen, setIsOpen, dataDetail }) => {
  return (
    <>
      <ModalCustom
        header={"DETAIL EQUIPMENT"}
        isOpen={isOpen}
        handleCancel={() => {
          setIsOpen(false);
        }}
        type={"detail"}
        width={900}
        footer={
          <ButtonComponent
            type={"default"}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"EQUIPMENT INFORMATION"} cols={3}>
          <DetailText label="Name">{dataDetail?.name}</DetailText>
          <DetailText label="Type">{dataDetail?.typeEquipment}</DetailText>
          <DetailText label="Merk">{dataDetail?.brand}</DetailText>
          <DetailText label="Quantity">
            {dataDetail?.qty} {dataDetail?.qtyUom}
          </DetailText>
          <DetailText label="Capacity">
            {dataDetail?.cap} {dataDetail?.capUom}
          </DetailText>
          <DetailText label="Energy Consumption">
            {dataDetail?.con} {dataDetail?.conUom}
          </DetailText>
          <DetailText label="Gas Conversion/Month">
            {dataDetail?.gasConv} {dataDetail?.gasConvUom}
          </DetailText>
          <DetailText label="Operating Hours/Day">{dataDetail?.noh}</DetailText>
          <DetailText label="Operating Days/Week">{dataDetail?.nod}</DetailText>
          <DetailText label="Dual Fuel">
            {dataDetail?.isDualFuel ? "Yes" : "No"}
          </DetailText>
          <DetailText label="Fuel Type 1">{dataDetail?.fuelType1}</DetailText>
          <DetailText label="Fuel Type 2">{dataDetail?.fuelType2}</DetailText>
          <div className="col-span-3">
            <DetailText label="Description">
              {dataDetail?.description}
            </DetailText>
          </div>
        </CardComponent>

        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataDetail?.id}</DetailText>
          <DetailText label="Created Date">
            {dataDetail?.createdDate
              ? moment(dataDetail?.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataDetail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataDetail?.updatedDate
              ? moment(dataDetail?.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataDetail?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>
    </>
  );
};

export default DetailEquipment;
