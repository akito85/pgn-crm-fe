import React from "react";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";

const ActiveAndInactiveGasQuality = ({
  isOpen,
  header,
  activeOrInactive,
  handleCancel = () => {},
  handleCancelFooter = () => {},
  handleConfirmFooter = () => {},
  remark,
  onChange = () => { },
  documentNumber
}) => {
  return (
    <ModalApproveOrReject
      isOpen={isOpen}
      header={`${header} information`}
      message={`Are you sure want to ${activeOrInactive} Gas Quality named ${documentNumber}`}
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
        type="textarea"
        value={remark}
        onChange={onChange}
      />
    </ModalApproveOrReject>
  );
};

export default ActiveAndInactiveGasQuality;
