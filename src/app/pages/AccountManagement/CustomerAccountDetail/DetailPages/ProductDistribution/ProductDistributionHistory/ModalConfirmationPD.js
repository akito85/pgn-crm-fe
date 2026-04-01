import React from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import FunctionalPDDetail from "./FunctionalPDDetail";
import NxModal from "../../../../../../../components/Nx/NxModal";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";

const ModalConfirmationPD = ({
  isOpen,
  data,
  dataDetail,
  handleCancel = () => {},
  handleConfirm = () => {},
}) => {
  return (
    <NxModal
      isOpen={isOpen}
      type={"confirmation"}
      title={"CONFIRMATION"}
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
      <div className="flex flex-col gap-4 p-4">
        <NxBaseContainer border>
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label={"Effective Date"}>
              {data?.effectiveDate
                ? moment(data?.effectiveDate).format(dateFormatting.date)
                : ""}
            </NxDetailText>
            <NxDetailText label={"Local (%)"}>{data?.value1}</NxDetailText>
            <NxDetailText label={"Export (%)"}>{data?.value2}</NxDetailText>

            <div className="col-span-3">
              <NxDetailText label={"Description"}>{data?.description}</NxDetailText>
            </div>
          </div>
          </NxBaseContainer>

        <NxBaseContainer border header={"PRODUCT DISTRIBUTION EXPORT DETAIL"}>
          <FunctionalPDDetail type={"preview"} data={dataDetail} />
        </NxBaseContainer>
      </div>
    </NxModal>
  );
};

export default ModalConfirmationPD;
