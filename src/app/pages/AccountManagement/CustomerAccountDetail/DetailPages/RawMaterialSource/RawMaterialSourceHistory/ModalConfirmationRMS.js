import React from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import FunctionalRMSDetail from "./FunctionalRMSDetail";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";

const ModalConfirmationRMS = ({
  isOpen,
  data,
  dataDetail,
  handleCancel = () => {},
  handleConfirm = () => {},
}) => {
  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={700}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
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
      <div className="w-full grid grid-cols-3 gap-4">
        <NxDetailText label={"Effective Date"}>
          {data?.effectiveDate
            ? moment(data?.effectiveDate).format(dateFormatting.date)
            : ""}
        </NxDetailText>
        <NxDetailText label={"Local (%)"}>{data?.value1}</NxDetailText>
        <NxDetailText label={"Import (%)"}>{data?.value2}</NxDetailText>

        <div className="col-span-3">
          <NxDetailText label={"Description"}>{data?.description}</NxDetailText>
        </div>
      </div>

      <p className="text-primary text-xs font-bold uppercase pt-[30px]">
        {"Raw Material Source Import Detail"}
      </p>

      <FunctionalRMSDetail type={"preview"} data={dataDetail} />
    </ModalCustom>
  );
};

export default ModalConfirmationRMS;
