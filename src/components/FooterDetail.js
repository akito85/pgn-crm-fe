import {
    CheckSquareOutlined,
    CloseSquareOutlined
} from "@ant-design/icons";
import React from "react";
import ButtonComponent from "./ButtonComponent";

const FooterDetail = ({ onCancel, onApprove, onReject, showApproval = false }) => {
    return (
        <div className="bg-white border border-[#dbdade] rounded-lg p-5 mt-5 flex justify-between shadow-sm">
            <ButtonComponent
                onClick={onCancel}
                className="!border-[#0075BF] !text-[#0075BF]"
            >
                Cancel
            </ButtonComponent>

            {showApproval && (
                <div className="flex align-middle gap-5">
                    <ButtonComponent
                        className="!bg-[#D13B3B] !border-[#D13B3B] hover:!bg-[#b52d2d] !text-white"
                        icon={<CloseSquareOutlined />}
                        onClick={onReject}
                    >
                        Reject
                    </ButtonComponent>
                    <ButtonComponent
                        className="!bg-[#358E49] !border-[#358E49] hover:!bg-[#2d7a3e] !text-white"
                        icon={<CheckSquareOutlined />}
                        onClick={onApprove}
                    >
                        Approve
                    </ButtonComponent>
                </div>
            )}
        </div>
    );
};

export default FooterDetail;
