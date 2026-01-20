import React, { useState } from "react";
import moment from "moment";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";

const ContentModalConfirmReverse = ({
    data,
    listDataAttachment = [],
    listDataAppHierDetail = [],
    tabData = [],
    dataOption,
    selectedHierarchy,
}) => {
    const [valuePage, setValuePage] = useState(tabData?.[0]?.value || "");

    const showSection = () => {
        switch (valuePage) {
            case tabData?.[0]?.value:
                return (
                    <div className="flex flex-col gap-6">
                        {/* ADJUSTMENT REVERSE INFORMATION */}
                        <div className="flex flex-col gap-4 text-xs font-semibold">
                            <div className="text-primary text-xs font-bold uppercase">
                                ADJUSTMENT REVERSE INFORMATION
                            </div>
                            <div className="grid grid-cols-3 w-full gap-4">
                                <DetailText label={"Area Code"}>
                                    {data?.areaCode || "-"}
                                </DetailText>
                                <DetailText label={"Area Name"}>
                                    {data?.areaName || "-"}
                                </DetailText>
                                <DetailText label={"Customer ID"}>
                                    {data?.customerNumber || "-"}
                                </DetailText>

                                <DetailText label={"Customer Name"}>
                                    {data?.customerName || "-"}
                                </DetailText>
                                <DetailText label={"Type"}>
                                    {data?.type || "-"}
                                </DetailText>
                                <DetailText label={"Period Tagihan"}>
                                    {data?.periodTagihan ? moment(data?.periodTagihan).format("MMM YYYY") : "-"}
                                </DetailText>

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
                            (dataOption || []).find(
                                (item) => item.value === selectedHierarchy
                            )?.name || ""
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
                        typeSelector="late"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <RadioTabs
                data={tabData}
                onChange={(e) => setValuePage(e.target.value)}
                currentPosition={valuePage}
            />
            <div className="flex flex-col gap-4 mt-4">
                {showSection()}
            </div>
        </div>
    );
};

export default ContentModalConfirmReverse;
