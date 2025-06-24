import React from "react";
import DetailText from "../../../../../../components/DetailText";
import CardComponent from "../../../../../../components/Card/CardComponent";
import GasSourceTable from "./GasSourceTable";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";

const GasSourceDetail = ({ data, isOpen, handleCancel = () => {} }) => {
  return (
    <ModalCustom
      header="Detail Gas Source"
      isOpen={isOpen}
      handleCancel={handleCancel}
      type="detail"
      width={1000}
      footer={
        <ButtonComponent type={"default"} onClick={handleCancel}>
          Back
        </ButtonComponent>
      }
    >
      <CardComponent header={"GAS SOURCE ASSIGNMENT INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-4">
          <DetailText label="Calorie Type">{data?.calorieType}</DetailText>
          <DetailText label="Start Date">
            {data?.startDate
              ? moment(data.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="End Date">
            {data?.endDate
              ? moment(data.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Status">{data?.status}</DetailText>

          <div className="col-span-4">
            <DetailText label="Remark">{data?.remark}</DetailText>
          </div>
        </div>
      </CardComponent>
      <CardComponent header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{data?.id}</DetailText>
          <DetailText label="Created Date">
            {data?.createdDate
              ? moment(data.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{data?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {data?.updatedDate
              ? moment(data.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{data?.updatedBy}</DetailText>
        </div>
      </CardComponent>

      <CardComponent header={"GAS QUALITY INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-5">
          <DetailText label="Calorie Code">{data?.calorieCode}</DetailText>
          <DetailText label="Name">{data?.name}</DetailText>
          <DetailText label="UOM">{data?.uom}</DetailText>
          <DetailText label="Description">{data?.description}</DetailText>
        </div>
      </CardComponent>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"GAS QUALITY DETAIL"}
      </div>

      <div className={"w-full"}>
        <GasSourceTable type={"detail"} dataNoApi={data?.detail} />
      </div>
    </ModalCustom>
  );
};
export default GasSourceDetail;
