import React from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import FunctionalPDDetail from "./FunctionalPDDetail";

const ModalConfirmationPD = ({
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
      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label={"Effective Date"}>
          {data?.effectiveDate
            ? moment(data?.effectiveDate).format(dateFormatting.date)
            : ""}
        </DetailText>
        <DetailText label={"Local (%)"}>{data?.value1}</DetailText>
        <DetailText label={"Export (%)"}>{data?.value2}</DetailText>

        <div className="col-span-3">
          <DetailText label={"Description"}>{data?.description}</DetailText>
        </div>
      </div>

      <p className="text-primary text-xs font-bold uppercase pt-[30px]">
        {"Product Distribution Export Detail"}
      </p>

      <FunctionalPDDetail type={"preview"} data={dataDetail} />
    </ModalCustom>
  );
};

export default ModalConfirmationPD;
