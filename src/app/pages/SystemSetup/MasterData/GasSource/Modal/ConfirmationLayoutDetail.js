import React from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";

const ConfirmationLayoutDetail = ({
  data,
  modalConfirm,
  handleCancel = () => {},
  handleConfirm,
}) => {
  return (
    <ModalCustom
      isOpen={modalConfirm}
      type={"confirmation"}
      header={"confirmation"}
      width={1000}
      handleCancel={handleCancel}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <div className="w-full p-5">
        <span className="text-primary uppercase font-bold">
          gas source information
        </span>

        <div className="w-full grid grid-cols-3 gap-5 pt-[30px]">
          <DetailText label="Document Number">{data?.documentNumber}</DetailText>
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
          <DetailText label="Value (M3/MMBTU)">{data?.m3}</DetailText>
          <DetailText label="Value (BTU/SCV (GHV))">{data?.btu}</DetailText>
          <DetailText label="SG">{data?.sg}</DetailText>
          <DetailText label="N2">{data?.n2}</DetailText>
          <DetailText label="CO 2">{data?.co2}</DetailText>
          <div className="col-span-3">
            <DetailText label="Description">{data?.description}</DetailText>
          </div>
        </div>
      </div>
    </ModalCustom>
  );
};

export default ConfirmationLayoutDetail;
