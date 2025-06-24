import React from "react";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import { toTitleCase } from "../../../../../../utils";

const ActiveAndInactiveGasSource = ({
  isOpen,
  header,
  activeOrInactive,
  handleCancel = () => {},
  handleCancelFooter = () => {},
  handleConfirmFooter = () => {},
  remark,
  onChange = () => { },
  calorieName
}) => {
  return (
    <ModalApproveOrReject
      isOpen={isOpen}
      header={`${header} information`}
      message={`Are you sure want to ${activeOrInactive} Gas Source named ${toTitleCase(calorieName)}`}
      width={1000}
      handleCancel={handleCancel}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancelFooter}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirmFooter}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <InputComponent
        rows={1}
        label = {"Remark"}
        type="textarea"
        value={remark}
        onChange={onChange}
      />
    </ModalApproveOrReject>
  );
};

export default ActiveAndInactiveGasSource;
