import React, { useState, useEffect } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import GoogleMapsCustom from "./GoogleMapsCustom";

const ModalDetailAccountAddress = ({
  isOpen,
  closeModal = () => {},
  dataDetail = {},
}) => {
  let selectedLocationDetail = {
    lat: parseFloat(dataDetail?.latitude),
    lng: parseFloat(dataDetail?.longitude),
  };

  const handleCloseModal = () => {
    closeModal(false);
  };

  return (
    <div>
      <ModalCustom
        header={"DETAIL ADDRESS"}
        isOpen={isOpen}
        handleCancel={() => {
          handleCloseModal();
        }}
        type={"detail"}
        width={800}
        footer={
          <ButtonComponent
            type={"default"}
            onClick={() => {
              handleCloseModal();
            }}
          >
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"ADDRESS INFORMATION"} cols={1}>
          {/* SECTION ADDRESS INFORMATION */}
          <div className="grid grid-cols-4 gap-y-2.5">
            <DetailText label="Country">{dataDetail?.country?.name}</DetailText>
            <DetailText label="Province">
              {dataDetail?.province?.name}
            </DetailText>
            <DetailText label="City">{dataDetail?.city?.name}</DetailText>
            <DetailText label="District">
              {dataDetail?.district?.name}
            </DetailText>
          </div>
          <div className="grid grid-cols-4 gap-y-2.5">
            <DetailText label="Sub District">
              {dataDetail?.subDistrict?.name}
            </DetailText>
            <DetailText label="Postal Code">
              {dataDetail?.postalCode?.name}
            </DetailText>
            <DetailText label="Building">{dataDetail?.bulding}</DetailText>
            <DetailText label="Floor">{dataDetail?.floor}</DetailText>
          </div>
          <div className="grid grid-cols-4 gap-y-2.5">
            <DetailText label="House Name">{dataDetail?.houseName}</DetailText>
            <DetailText label="Street Name">
              {dataDetail?.streetName}
            </DetailText>
            <DetailText label="Block">{dataDetail?.block}</DetailText>
            <DetailText label="House Number">
              {dataDetail?.houseNumber}
            </DetailText>
          </div>
          <div className="grid grid-cols-4 gap-y-2.5">
            <DetailText label="RT">{dataDetail?.rt}</DetailText>
            <DetailText label="RW">{dataDetail?.rw}</DetailText>
            <DetailText label="Type">{dataDetail?.type}</DetailText>
            <DetailText label="Additional Note">
              {dataDetail?.additionalNote}
            </DetailText>
          </div>
          <div className="grid grid-cols-1 gap-y-2.5">
            <DetailText label="Address">
              {dataDetail?.fullAddress?.toUpperCase()}
            </DetailText>
          </div>
          <div className="grid grid-cols-1 gap-y-2.5">
            <DetailText label="Description">
              {dataDetail?.descAddress}
            </DetailText>
          </div>

          {/* SECTION ADDRESS COORDINATE */}
          <div className="text-primary text-xs font-semibold uppercase py-[30px]">
            ADDRESS COORDINATE
          </div>
          <div className="grid grid-cols-4 gap-y-2.5">
            <DetailText label="Source">{dataDetail?.source}</DetailText>
            <DetailText label="Longitude">{dataDetail?.latitude}</DetailText>
            <DetailText label="Lattitude">{dataDetail?.longitude}</DetailText>
            <DetailText label="Altitude">-</DetailText>
          </div>

          {/* SECTION ADDRESS PURPOSE INFORMATION */}
          <div className="text-center">
            <GoogleMapsCustom
              zoom={19}
              selectedLocation={selectedLocationDetail}
            />
          </div>

          {/* SECTION ADDRESS PURPOSE INFORMATION */}
          <div className="text-primary text-xs font-semibold uppercase py-[30px]">
            ADDRESS PURPOSE INFORMATION
          </div>
          <div className="grid grid-cols-4 gap-y-2.5">
            <DetailText label="Business Purpose">
              {dataDetail?.businessPurpose}
              {/* {dataDetail?.businessPurpose?.map(item =>(
                <span key={item?.id}>{item?.name} </span>
              ))} */}
            </DetailText>
            <DetailText label="Premise">
              {dataDetail?.premiseFlag ? "Yes" : "No"}
            </DetailText>
            <DetailText label="Primary">
              {dataDetail?.primaryFlag ? "Yes" : "No"}
            </DetailText>
          </div>
          <div className="grid grid-cols-1 gap-y-2.5">
            <DetailText label="Remark">
              {dataDetail?.descAccountAddress}
            </DetailText>
          </div>
        </CardComponent>
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">
            {dataDetail?.accountAddressId}
          </DetailText>
          <DetailText label="Created Date">
            {dataDetail?.cretedDate !== null
              ? moment(dataDetail?.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataDetail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataDetail?.updatedDate !== null
              ? moment(dataDetail?.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataDetail?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>
    </div>
  );
};

export default ModalDetailAccountAddress;
