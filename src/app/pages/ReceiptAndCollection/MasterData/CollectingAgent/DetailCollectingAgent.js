import moment from "moment";
import CardContainer from "../../../../../components/CardContainer";
import { dateFormatting } from "../../../../../utils";

const DetailCollectingAgent = ({ data_detail, data_req }) => {
    return (
        <div>
            {/* Inactive Request Information (only shown for approver of inactive) */}
            {data_req?.isApprover &&
                data_req?.approvalType === "INACTIVE_COLLECTING_AGENT" && (
                    <CardContainer
                        header={
                            <div className="flex -my-4 justify-between items-center">
                                <p className="mt-[15px] text-primary">
                                    INACTIVE REQUEST INFORMATION
                                </p>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-5 w-full gap-4">
                            <div>
                                <p className="font-semibold text-sm">Requested Date</p>
                                <p className="text-sm">
                                    {data_req?.requestedDate
                                        ? moment(data_req?.requestedDate).format("DD MMM YYYY HH:mm:ss")
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Requested By</p>
                                <p className="text-sm">{data_req?.requestedBy || "-"}</p>
                            </div>
                            <div className="col-span-3">
                                <p className="font-semibold text-sm">Remark</p>
                                <p className="text-sm">{data_req?.remarks || "-"}</p>
                            </div>
                        </div>
                    </CardContainer>
                )}

            <CardContainer
                header={
                    <div className="flex -my-4 justify-between items-center">
                        <p className="mt-[15px] text-primary">
                            COLLECTING AGENT INFORMATION
                        </p>
                    </div>
                }
            >
                <div className="w-full grid grid-cols-4 gap-4">
                    <div>
                        <p className="font-semibold text-sm">Collection Agent Code</p>
                        <p className="text-sm">{data_detail?.code ?? data_detail?.caCode ?? "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Name</p>
                        <p className="text-sm">{data_detail?.name || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Start Date</p>
                        <p className="text-sm">
                            {(data_detail?.startDate ?? data_detail?.effStartDate)
                                ? moment(data_detail?.startDate ?? data_detail?.effStartDate).format(
                                    dateFormatting.date
                                )
                                : "-"}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">End Date</p>
                        <p className="text-sm">
                            {(data_detail?.endDate ?? data_detail?.effEndDate)
                                ? moment(data_detail?.endDate ?? data_detail?.effEndDate).format(
                                    dateFormatting.date
                                )
                                : "-"}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Status</p>
                        <p className="text-sm">{data_detail?.status || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Status Approval</p>
                        <p className="text-sm">{data_detail?.statusApproval || "-"}</p>
                    </div>
                </div>
            </CardContainer>

            <CardContainer
                header={
                    <div className="flex -my-4 justify-between items-center">
                        <p className="mt-[15px] text-primary">
                            HISTORY LOG INFORMATION
                        </p>
                    </div>
                }
            >
                <div className="w-full grid grid-cols-5 gap-4">
                    <div>
                        <p className="font-semibold text-sm">Record ID</p>
                        <p className="text-sm">{data_detail?.id || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Created Date</p>
                        <p className="text-sm">
                            {data_detail?.createdDate
                                ? moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")
                                : "-"}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Created By</p>
                        <p className="text-sm">{data_detail?.createdBy || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Updated Date</p>
                        <p className="text-sm">
                            {data_detail?.updatedDate
                                ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")
                                : "-"}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Updated By</p>
                        <p className="text-sm">{data_detail?.updatedBy || "-"}</p>
                    </div>
                </div>
            </CardContainer>
        </div>
    );
};

export default DetailCollectingAgent;
