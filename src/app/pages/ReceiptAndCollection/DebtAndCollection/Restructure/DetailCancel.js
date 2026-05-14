import moment from "moment";
import { Tabs } from "antd";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import DetailText from "../../../../../components/DetailText";
import SectionCard from "../../../../../components/SectionCard";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import InputLabel from "../../../../../components/InputLabel";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import DOMPurify from "dompurify";

const DetailCancel = ({
    isEmbedded,
    segmentedPage,
    setSegmentedPage,
    dataHeader,
    data_detail,
    appHierDataDetail,
    appHierOptions,
    selectedHierarchy,
    setSelectedHierarchy,
    approvalName,
    listDataAttachment,
    setListDataAttachment,
    dispatch,
    renderPaymentPlanDetail,
    getListCategory,
    receiptCollectionHttpService,
    configApp
}) => {
    const cancelItems = [
        {
            key: "Payment Plan",
            label: "Cancel Plan",
            children: (
                <div className="p-5 min-h-[400px] flex flex-col gap-4">
                    <SectionCard title="ACCOUNT INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Account Number">{dataHeader?.accountNumber || "-"}</DetailText>
                            <DetailText label="Account Name">{dataHeader?.accountName || "-"}</DetailText>
                            <DetailText label="Customer Number">{dataHeader?.customerNumber || "-"}</DetailText>
                            <DetailText label="Customer Name">{dataHeader?.customerName || "-"}</DetailText>
                            <DetailText label="Account Group Type">{dataHeader?.accountGroupType || "-"}</DetailText>
                            <DetailText label="SOR">{dataHeader?.sor || "-"}</DetailText>
                            <DetailText label="Cost Center">{dataHeader?.costCenter || "-"}</DetailText>
                            <DetailText label="Account Segment">{dataHeader?.accountSegment || "-"}</DetailText>
                            <DetailText label="Meter Reading Code">{dataHeader?.meterReadingCode || "-"}</DetailText>
                            <DetailText label="Account Type">{dataHeader?.accountType || "-"}</DetailText>
                            <DetailText label="Classification Type">{dataHeader?.classificationType || "-"}</DetailText>
                            <DetailText label="SAP Cust ID">{dataHeader?.sapCustId || "-"}</DetailText>
                            <DetailText label="Account Status">{dataHeader?.accountStatus || "-"}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="CANCEL INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <InputComponent
                                label="Payment Plan Code"
                                mandatory={true}
                                disabled={true}
                                value={dataHeader?.restructureNumber || "-"}
                            />
                            <InputComponent
                                label="Cancel Reason"
                                mandatory={true}
                                disabled={true}
                                value={dataHeader?.cancelReason || "-"}
                            />
                            <DateComponent
                                label="Cancel Date"
                                mandatory={true}
                                disabled={true}
                                format="DD MMM YYYY"
                                value={dataHeader?.cancelDate ? moment(dataHeader.cancelDate) : null}
                            />
                            <DateComponent
                                label="Request Date"
                                mandatory={true}
                                disabled={true}
                                format="DD MMM YYYY"
                                value={dataHeader?.updatedDate ? moment(dataHeader.updatedDate) : moment()}
                            />
                            <div className="col-span-5 flex flex-col w-auto">
                                <InputLabel text="Remark" mandatory={true} />
                                <div 
                                    className="p-2 border rounded-md bg-[#F5F5F5] mt-2 min-h-[60px]"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dataHeader?.remark || "-") }}
                                />
                            </div>
                        </div>
                    </SectionCard>
                </div>
            )
        },
        {
            key: "Approval",
            label: "Approval",
            children: (
                <div className="p-5 min-h-[400px]">
                    <SectionCard title="CANCEL APPROVAL INFORMATION">
                        <ApprovalComponentGeneral
                            dataTable={appHierDataDetail}
                            dataOption={appHierOptions}
                            selectedHierarchy={selectedHierarchy}
                            updateSelectedHierarchy={setSelectedHierarchy}
                            showSelect={false}
                            disableSelect={true}
                            approvalName={approvalName}
                        />
                    </SectionCard>
                </div>
            )
        },
        {
            key: "Attachment",
            label: "Attachment",
            children: (
                <div className="p-5 min-h-[400px]">
                    <SectionCard title="ATTACHMENT INFORMATION">
                        <AttachmentComponent
                            type={"detail"}
                            data={listDataAttachment}
                            updateData={setListDataAttachment}
                            typeSelector="restructure"
                            dispatch={dispatch}
                            getAPICategory={getListCategory}
                            service={receiptCollectionHttpService}
                            configApplication={configApp.PAYMENT_SERVICE}
                        />
                    </SectionCard>
                </div>
            )
        }
    ];

    return (
        <>
            <div className={isEmbedded ? "" : "mt-5"}>
                <CardContainerNoBorder 
                    header="CANCEL PAYMENT PLAN DETAIL"
                    className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                    noPadding
                    collapsible={true}
                >
                    <div className="full-width-tabs">
                        <Tabs
                            activeKey={segmentedPage}
                            onChange={(key) => setSegmentedPage(key)}
                            items={cancelItems}
                            className="custom-confirm-tabs"
                            tabBarStyle={{
                                paddingLeft: "16px",
                                paddingRight: "16px",
                                marginBottom: 0,
                            }}
                        />
                    </div>
                </CardContainerNoBorder>
            </div>

            {segmentedPage === "Payment Plan" && (
                <div className="flex flex-col gap-4 mt-4">
                    <CardContainerNoBorder 
                        header="PAYMENT PLAN DETAIL (ORIGINAL)"
                        className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                        collapsible={true}
                    >
                        <div className="p-4">
                            {renderPaymentPlanDetail()}
                        </div>
                    </CardContainerNoBorder>
                </div>
            )}

            {segmentedPage === "Payment Plan" && (
                <div className="mt-5">
                    <LogHistoryInfo
                        data={{
                            recordId: dataHeader?.id || "-",
                            createdDate: dataHeader?.createdDate ? moment(dataHeader?.createdDate).format("DD MMM YYYY HH:mm:ss") : "-",
                            createdBy: dataHeader?.createdBy || "-",
                            updatedDate: dataHeader?.updatedDate ? moment(dataHeader?.updatedDate).format("DD MMM YYYY HH:mm:ss") : "-",
                            updatedBy: dataHeader?.updatedBy || "-"
                        }} 
                    />
                </div>
            )}
        </>
    );
};

export default DetailCancel;
