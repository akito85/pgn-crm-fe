import React from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";

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
        <div className="flex flex-col gap-y-4">

          <NxBaseContainer border header={"EQUIPMENT INFORMATION"}>
            <div className="w-full grid grid-cols-3">
              <DetailText label="Name">{dataDetail?.name}</DetailText>
              <DetailText label="Type">{dataDetail?.typeEquipment}</DetailText>
              <DetailText label="Merk">{dataDetail?.brand}</DetailText>
              <DetailText label="Quantity">{dataDetail?.qty} {dataDetail?.qtyUom}</DetailText>
              <DetailText label="Capacity">{dataDetail?.cap} {dataDetail?.capUom}</DetailText>
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
            </div>
          </NxBaseContainer>

          <NxBaseContainer border header={"HISTORY LOG INFORMATION"}>
            <div className="w-full grid grid-cols-5">
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
            </div>
          </NxBaseContainer>
        </div>
      </ModalCustom>
    </>
  );
};

export default DetailEquipment;
