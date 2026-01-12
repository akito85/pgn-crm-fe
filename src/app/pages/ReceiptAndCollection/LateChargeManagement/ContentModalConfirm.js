import React, { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../components/DetailText";
import RadioTabs from "../../../../components/RadioTabs";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import moment from "moment";

const ContentModalConfirm = ({
    data,
    listDataAttachment = [],
    listDataAppHierDetail = [],
    tabData = [],
    dataOption,
    selectedHierarchy,
    typeSelector = "late",
}) => {
    const [valuePage, setValuePage] = useState(tabData[0].value);

    const showSection = () => {
        switch (valuePage) {
            case tabData[0].value:
                return (
                    <div className="flex flex-col gap-6">
                        {/* CUSTOMER INFORMATION */}
                        <div className="flex flex-col gap-4">
                            <div className="text-primary text-xs font-bold uppercase">
                                CUSTOMER INFORMATION
                            </div>
                            <div className="grid grid-cols-3 w-full gap-4 text-xs font-semibold">
                                <DetailText label={"Cost Center"}>
                                    {data?.costCenter || "-"}
                                </DetailText>
                                <DetailText label={"Customer ID"}>
                                    {data?.customerNumber || "-"}
                                </DetailText>
                                <DetailText label={"Customer Name"}>
                                    {data?.customerName || "-"}
                                </DetailText>
                            </div>
                        </div>

                        {/* LATE CHARGE INFORMATION */}
                        <div className="flex flex-col gap-4 text-xs font-semibold">
                            <div className="text-primary text-xs font-bold uppercase">
                                LATE CHARGE INFORMATION
                            </div>
                            <div className="grid grid-cols-3 w-full gap-4">
                                <DetailText label={"Period Tagihan"}>
                                    {data?.periodTagihan ? moment(data?.periodTagihan).format("MMM YYYY") : "-"}
                                </DetailText>
                                <DetailText label={"Payment Amount"}>
                                    {data?.paymentAmount ? data.paymentAmount.toLocaleString() : "0"}
                                </DetailText>
                                <DetailText label={"Type"}>
                                    {data?.type || "-"}
                                </DetailText>

                                <DetailText label={"Invoice No"}>
                                    {data?.invoiceNo || "-"}
                                </DetailText>
                                <DetailText label={"Total Days Late"}>
                                    {data?.totalDaysLate || "0"}
                                </DetailText>
                                <DetailText label={"Total Late Charge"}>
                                    {data?.totalLateCharge ? data.totalLateCharge.toLocaleString() : "0"}
                                </DetailText>

                                <DetailText label={"Due Date"}>
                                    {data?.dueDate ? moment(data?.dueDate).format("DD MMM YYYY") : "-"}
                                </DetailText>
                                <DetailText label={"Late Charge Rate"}>
                                    {data?.lateChargeRate ? data.lateChargeRate.toLocaleString() : "0"}
                                </DetailText>
                                <DetailText label={"Payment Date"}>
                                    {data?.paymentDate ? moment(data?.paymentDate).format("DD MMM YYYY") : "-"}
                                </DetailText>

                                <DetailText label={"Late Charge Time Unit"}>
                                    {data?.lateChargeTimeUnit || "-"}
                                </DetailText>
                            </div>
                            <div className="grid grid-cols-1 w-full gap-4 mt-2">
                                <DetailText label={"Remark"}>
                                    {data?.remark || "-"}
                                </DetailText>
                            </div>
                        </div>
                    </div>
                );
            case tabData[1].value:
                return (
                    <ApprovalComponentGeneral
                        showSelect={false}
                        disableSelect={true}
                        approvalName={
                            (dataOption || []).filter(
                                (item) => item.value === selectedHierarchy
                            )?.[0]?.name || ""
                        }
                        dataTable={listDataAppHierDetail}
                        selectedHierarchy={selectedHierarchy}
                    />
                );
            case tabData[2].value:
                return (
                    <AttachmentComponent
                        type={"preview"}
                        data={listDataAttachment}
                        typeRBI={"data"}
                        typeSelector={typeSelector}
                    />
                );
            default:
                return <Fragment></Fragment>;
        }
    };

    const handleMethod = (e) => {
        setValuePage(e.target.value);
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <RadioTabs
                data={tabData}
                onChange={handleMethod}
                currentPosition={valuePage}
            />
            <div className="flex flex-col gap-4 mt-4">
                {showSection()}
            </div>
        </div>
    );
};

export default ContentModalConfirm;
