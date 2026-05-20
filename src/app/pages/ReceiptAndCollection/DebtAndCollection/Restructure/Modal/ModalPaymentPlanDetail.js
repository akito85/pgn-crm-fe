import React from "react";
import { Row, Col, Spin } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SectionCard from "../../../../../../components/SectionCard";
import DetailText from "../../../../../../components/DetailText";

const ModalPaymentPlanDetail = ({ isOpen, handleCancel, data: rawData, loading }) => {
    const data = rawData?.data || rawData;
    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="PAYMENT PLAN DETAIL"
            width={1200}
            footer={
                <div className="flex justify-start p-4 bg-white border-t rounded-b-[5px]">
                    <ButtonComponent onClick={handleCancel} type="default">
                        Back
                    </ButtonComponent>
                </div>
            }
        >
            <Spin spinning={loading}>
                <div className="flex flex-col gap-4">
                    <SectionCard title={`CURRENCY ${data?.currency || ""}`}>
                        <div className="grid grid-cols-5 gap-y-6 gap-x-4">
                            <DetailText label="Period">{data?.periode || ""}</DetailText>
                            <DetailText label="Total Amount">{data?.amount?.toLocaleString() || "0"}</DetailText>
                            <DetailText label="Due Date">{data?.dueDate || ""}</DetailText>
                            <DetailText label="Balance">{data?.balance?.toLocaleString() || "0"}</DetailText>
                            <DetailText label="Detail Code">{data?.detailCode || ""}</DetailText>
                            <DetailText label="Status">{data?.status || ""}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="HISTORY LOG INFORMATION">
                        <div className="grid grid-cols-5 gap-y-6 gap-x-4">
                            <DetailText label="Record ID">{data?.recordId || ""}</DetailText>
                            <DetailText label="Created Date">{data?.createdDate || ""}</DetailText>
                            <DetailText label="Created By">{data?.createdBy || ""}</DetailText>
                            <DetailText label="Updated Date">{data?.updatedDate || ""}</DetailText>
                            <DetailText label="Updated By">{data?.updatedBy || ""}</DetailText>
                        </div>
                    </SectionCard>
                </div>
            </Spin>
        </ModalCustom>
    );
};

export default ModalPaymentPlanDetail;
