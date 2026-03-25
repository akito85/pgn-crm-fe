import React from "react";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../components/Nx/NxModal";
import NxDetailText from "../../../../../../components/Nx/NxDetailText";

const DetailEquipment = ({ isOpen, setIsOpen, dataDetail }) => {
  return (
    <>
      <NxModal
        isOpen={isOpen}
        title={"DETAIL EQUIPMENT"}
        handleCancel={() => {
          setIsOpen(false);
        }}
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
        <div className="flex flex-col gap-y-4 p-4">
          <NxBaseContainer border header={"EQUIPMENT INFORMATION"}>
            <div className="w-full grid grid-cols-3 gap-4">
              <NxDetailText label="Name">{dataDetail?.name}</NxDetailText>
              <NxDetailText label="Type">{dataDetail?.typeEquipment}</NxDetailText>
              <NxDetailText label="Merk">{dataDetail?.brand}</NxDetailText>
              <NxDetailText label="Quantity">{dataDetail?.qty} {dataDetail?.qtyUom}</NxDetailText>
              <NxDetailText label="Capacity">{dataDetail?.cap} {dataDetail?.capUom}</NxDetailText>
              <NxDetailText label="Energy Consumption">
                {dataDetail?.con} {dataDetail?.conUom}
              </NxDetailText>
              <NxDetailText label="Gas Conversion/Month">
                {dataDetail?.gasConv} {dataDetail?.gasConvUom}
              </NxDetailText>
              <NxDetailText label="Operating Hours/Day">{dataDetail?.noh}</NxDetailText>
              <NxDetailText label="Operating Days/Week">{dataDetail?.nod}</NxDetailText>
              <NxDetailText label="Dual Fuel">
                {dataDetail?.isDualFuel ? "Yes" : "No"}
              </NxDetailText>
              <NxDetailText label="Fuel Type 1">{dataDetail?.fuelType1}</NxDetailText>
              <NxDetailText label="Fuel Type 2">{dataDetail?.fuelType2}</NxDetailText>
              <div className="col-span-3">
                <NxDetailText label="Description">
                  {dataDetail?.description}
                </NxDetailText>
              </div>
            </div>
          </NxBaseContainer>

          <NxBaseContainer border header={"HISTORY LOG INFORMATION"}>
            <div className="w-full grid grid-cols-5 gap-4">
              <NxDetailText label="Record ID">{dataDetail?.id}</NxDetailText>
              <NxDetailText label="Created Date">
                {dataDetail?.createdDate
                  ? moment(dataDetail?.createdDate).format(dateFormatting.dateTime)
                  : ""}
              </NxDetailText>
              <NxDetailText label="Created By">{dataDetail?.createdBy}</NxDetailText>
              <NxDetailText label="Updated Date">
                {dataDetail?.updatedDate
                  ? moment(dataDetail?.createdDate).format(dateFormatting.dateTime)
                  : ""}
              </NxDetailText>
              <NxDetailText label="Updated By">{dataDetail?.updatedBy}</NxDetailText>
            </div>
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  );
};

export default DetailEquipment;
