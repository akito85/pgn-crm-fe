import moment from "moment";
import { Tabs } from "antd";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import DetailText from "../../../../../components/DetailText";
import SectionCard from "../../../../../components/SectionCard";
import TableRBI from "../../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import DOMPurify from "dompurify";

const DetailPaymentPlan = ({
    isEmbedded,
    segmentedPage,
    setSegmentedPage,
    dataHeader,
    contacts,
    contactColumns,
    expandable,
    appHierDataDetail,
    appHierOptions,
    selectedHierarchy,
    setSelectedHierarchy,
    approvalName,
    listDataAttachment,
    setListDataAttachment,
    renderOpenItems,
    renderPaymentPlanDetail,
    dispatch,
    getListCategory,
    receiptCollectionHttpService,
    configApp
}) => {
    const paymentPlanItems = [
        {
            key: "Payment Plan",
            label: "Payment Plan",
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

                    <SectionCard title="SERVICE AGREEMENT INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Service Agreement Number">{dataHeader?.saNumber || "-"}</DetailText>
                            <DetailText label="Service Agreement Name">{dataHeader?.saName || "-"}</DetailText>
                            <DetailText label="Service Agreement Date">{dataHeader?.saDate ? moment(dataHeader.saDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Start Date">{dataHeader?.startDate ? moment(dataHeader.startDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="End Date">{dataHeader?.endDate ? moment(dataHeader.endDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Minimum Contract">{dataHeader?.minContract || "-"}</DetailText>
                            <DetailText label="Maximum Contract">{dataHeader?.maxContract || "-"}</DetailText>
                            <DetailText label="UOM">{dataHeader?.uom || "-"}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="CONTACT INFORMATION">
                        <TableRBI
                            idTable="table-contact-detail"
                            dataSource={contacts}
                            columns={contactColumns}
                            expandable={expandable}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                        />
                    </SectionCard>

                    <SectionCard title="PAYMENT PLAN INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Type">{dataHeader?.type || "-"}</DetailText>
                            <DetailText label="Tenor">{dataHeader?.tenor ? `${dataHeader.tenor} Months` : "-"}</DetailText>
                            <DetailText label="Start Period">{dataHeader?.startPeriod ? moment(dataHeader.startPeriod).format("MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Source">{dataHeader?.source}</DetailText>
                            <DetailText label="Request Date">{dataHeader?.requestDate ? moment(dataHeader.requestDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <div className="col-span-5">
                                <DetailText label="Description">{DOMPurify.sanitize(dataHeader?.description) || "-"}</DetailText>
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
                    <SectionCard title="PAYMENT PLAN APPROVAL INFORMATION">
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
                    header="PAYMENT PLAN LIST"
                    className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                    noPadding
                    collapsible={true}
                >
                    <div className="full-width-tabs">
                        <Tabs
                            activeKey={segmentedPage}
                            onChange={(key) => setSegmentedPage(key)}
                            items={paymentPlanItems}
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
                        header="OPEN ITEM INFORMATION"
                        className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                        collapsible={true}
                    >
                        <div className="p-4">
                            {renderOpenItems()}
                        </div>
                    </CardContainerNoBorder>

                    <CardContainerNoBorder 
                        header="PAYMENT PLAN DETAIL"
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

export default DetailPaymentPlan;
