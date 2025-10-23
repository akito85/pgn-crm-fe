import React from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../components/DetailText";
import GasSourceTable from "./GasSourceTable";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const ModalConfirmationLayout = ({
  isOpen,
  handleCancel = () => {},
  handleConfirm = () => {},
  data = {},
  dataGSD = [],
  apiAGS = [],
  apiCalorieType = [],
}) => {
  const labelCalorieType = apiCalorieType
    .filter((a) => a.calorieId === data.calorieType)
    ?.find((b) => b.calorieName)?.calorieName;

  const labelCalorieCode = apiAGS
    .filter((a) => a.gasSourceId === data.calorieCode)
    ?.find((b) => b.calorieCode)?.calorieCode;

  const labelName = apiAGS
    .filter((a) => a.gasSourceId === data.calorieCode)
    ?.find((b) => b.name)?.name;

  const labelUOM = apiAGS
    .filter((a) => a.gasSourceId === data.calorieCode)
    ?.find((b) => b.uom)?.uom;

  const labelDescription = apiAGS
    .filter((a) => a.gasSourceId === data.calorieCode)
    ?.find((b) => b.description)?.description;

  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"CONFIRMATION"}
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
        <p className="text-primary uppercase font-bold">
          GAS SOURCE ASSIGNMENT INFORMATION
        </p>

        <div className="w-full grid grid-cols-2 gap-5">
          <DetailText label="Calorie Type">{labelCalorieType}</DetailText>
          <DetailText label="Start Date">
            {moment(data.startDate).format(dateFormatting.date)}
          </DetailText>
          <div className="w-full col-span-2">
            <DetailText label="Remark">{data.remark}</DetailText>
          </div>
        </div>

        <p className="text-primary uppercase font-bold">
          GAS QUALITY INFORMATION
        </p>

        <div className="w-full grid grid-cols-3 gap-5">
          <DetailText label="Calorie Code">{labelCalorieCode}</DetailText>
          <DetailText label="Name">{labelName}</DetailText>
          <DetailText label="UOM">{labelUOM}</DetailText>
          <div className="w-full col-span-3">
            <DetailText label="Description">{labelDescription}</DetailText>
          </div>
        </div>

        <p className="text-primary uppercase font-bold">GAS QUALITY DETAIL</p>

        <div className="w-full grid grid-cols-1 gap-5">
          <GasSourceTable type={"detail"} dataNoApi={dataGSD} />
        </div>
      </div>
    </ModalCustom>
  );
};

export default ModalConfirmationLayout;
