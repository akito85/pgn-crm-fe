import React from 'react'
import { ModalError } from '../../../../../../../../components/Modal/ModalPopUp';
import SVGIcon from "../../../../../../../../assets/Icon/index";

const ModalErrorApproveOrRejectServiceAgreement = ({
  isOpen,
  handleOk = () => {},
  handleCancel = () => {},
  approveOrReject,
  message,
}) => {
  return (
    <ModalError isOpen={isOpen} handleOk={handleOk} handleCancel={handleCancel}>
      <div className="px-8 py-8 justify-center">
        <div className="w-full flex gap-[20px]">
          <SVGIcon name="IconInactive" width={48} />
          <p className="text-[18px] font-bold">Failed</p>
        </div>
        <p className="pl-[70px]">
          {`Your data was not ${
            approveOrReject === "Approve" ? "rejected" : "approved"
          } ${message}. Please try again.`}
        </p>
      </div>
    </ModalError>
  );
};

export default ModalErrorApproveOrRejectServiceAgreement