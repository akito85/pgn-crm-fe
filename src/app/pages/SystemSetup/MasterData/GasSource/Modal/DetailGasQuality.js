import React from "react";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { dateFormatting, toTitleCase } from "../../../../../../utils";
import moment from "moment";

const DetailGasQuality = ({ data, isOpen, handleCancel = () => {} }) => {
  return (
    <ModalCustom
      header="Detail Gas Quality"
      isOpen={isOpen}
      handleCancel={handleCancel}
      type="detail"
      width={800}
      footer={
        <ButtonComponent type={"default"} onClick={handleCancel}>
          Cancel
        </ButtonComponent>
      }
    >
      <CardComponent header={"Gas Quality Detail Information"} cols={3}>
        <DetailText label={"Document Number"}>{data?.documentNumber}</DetailText>
        <DetailText label={"Start Date"}>
          {data?.startDate
            ? moment(data.startDate).format(dateFormatting.date)
            : "-"}
            </DetailText>
        <DetailText label={"End Date"}>
        {data?.endDate
            ? moment(data.endDate).format(dateFormatting.date)
            : "-"}
        </DetailText>
        <DetailText label={"Status"}>{toTitleCase(data?.status)}</DetailText>
        <DetailText label={"Value (M3/MMBTU)"}>{data?.m3}</DetailText>
        <DetailText label={"Value (BTU/SCF (GHV))"}>{data?.btu}</DetailText>
        <DetailText label={"SG"}>{data?.sg}</DetailText>
        <DetailText label={"N2"}>{data?.n2}</DetailText>
        <DetailText label={"CO2"}>{data?.co2}</DetailText>
        <DetailText className="col-span-3" label={"Description"}>{data?.description}</DetailText>
      </CardComponent>

      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record ID">
          {data?.gasSourceDetailId}
        </DetailText>
        <DetailText label="Created Date">
          {data?.createdDate
            ? moment(data.createdDate).format(dateFormatting.dateTime)
            : "-"}
        </DetailText>
        <DetailText label="Created By">
          {data?.createdBy}
        </DetailText>
        <DetailText label="Updated Date">
          {data?.updatedDate
            ? moment(data.updatedDate).format(dateFormatting.dateTime)
            : "-"}
        </DetailText>
        <DetailText label="Updated By">
          {data?.updatedBy}
        </DetailText>
      </CardComponent>
    </ModalCustom>
  );
};

export default DetailGasQuality;
