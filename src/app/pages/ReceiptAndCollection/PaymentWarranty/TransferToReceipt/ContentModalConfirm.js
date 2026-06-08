import React, { useState } from "react";
import { Tabs } from "antd";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import TableRBI from "../../../../../components/TableRBI";
import SubSectionCard from "../../../../../components/SubSectionCard";
import { getReceiptListColumns } from "./ReceiptListColumns";

const { TabPane } = Tabs;

const ContentModalConfirm = ({
    data,
    listDataAttachment = [],
    listDataAppHierDetail = [],
    dataOption,
    selectedHierarchy,
    receiptList = [],
    category = "",
}) => {
    const [activeTab, setActiveTab] = useState("Transfer");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleSizeChange = (current, size) => {
        setPage(1);
        setPageSize(size);
    };

    const columnsReceipt = getReceiptListColumns({
        page,
        pageSize,
        actionType: "none",
        category,
        isModal: false,
    });

    return (
        <div className="flex flex-col gap-0 bg-white overflow-hidden">
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                className="custom-confirm-tabs"
                tabBarStyle={{
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    marginBottom: 0,
                    borderBottom: "1px solid #dbdade"
                }}
            >
                <TabPane tab="Transfer to Receipt" key="Transfer">
                    <div className="py-6 bg-white max-h-[60vh] overflow-y-auto">
                        {/* TRANSFER INFORMATION */}
                        <SubSectionCard title="TRANSFER TO RECEIPT INFORMATION" className="mx-6 mb-4">
                            <div className="grid grid-cols-4 gap-y-4 gap-x-4 w-full">
                                <DetailText label="From Customer Number">{data?.fromCustomerId || ""}</DetailText>
                                <DetailText label="From Customer Name">{data?.fromCustomerName || ""}</DetailText>
                                <DetailText label="Area Code">{data?.areaCode || ""}</DetailText>
                                <DetailText label="Category">{data?.category || ""}</DetailText>
                                <div className="col-span-4">
                                    <DetailText label="Description">{data?.description || ""}</DetailText>
                                </div>
                            </div>
                        </SubSectionCard>

                        {/* GUARANTEE INFORMATION */}
                        <SubSectionCard title="GUARANTEE INFORMATION" className="mx-6 mb-4">
                            <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                                <DetailText label="Payment Guarantee Code">{data?.paymentWarrantyCode || ""}</DetailText>
                                <DetailText label="Cost Center">{data?.warrantyAreaCode || ""}</DetailText>
                                <DetailText label="Account Number">{data?.accountNumber || ""}</DetailText>
                                <DetailText label="Account Name">{data?.accountName || ""}</DetailText>
                                <DetailText label="Customer Number">{data?.customerId || ""}</DetailText>
                                <DetailText label="Customer Name">{data?.customerName || ""}</DetailText>
                                <DetailText label="Customer Segment">{data?.customerSegment || ""}</DetailText>
                                <DetailText label="Customer Group">{data?.customerGroup || ""}</DetailText>
                                <DetailText label="Type">{data?.type || ""}</DetailText>
                                <DetailText label="Document Number">{data?.documentNumber || ""}</DetailText>
                                <DetailText label="Document Date">{data?.mutationDate ? moment(data.mutationDate).format("DD MMM YYYY") : (data?.receiptDate ? moment(data.receiptDate).format("DD MMM YYYY") : "-")}</DetailText>
                                <DetailText label="Issuer">{data?.publisher || ""}</DetailText>
                                <DetailText label="Issuer Branch">{data?.issuerBranch || ""}</DetailText>
                                <DetailText label="Currency">{data?.currency || ""}</DetailText>
                                <DetailText label="Balance Amount">{data?.balance?.toLocaleString("id-ID") || ""}</DetailText>
                                <DetailText label="Rate Type">{data?.rateType || ""}</DetailText>
                                <DetailText label="Rate Date">{data?.rateDate ? moment(data.rateDate).format("DD MMM YYYY") : "-"}</DetailText>
                                <DetailText label="Rate">{data?.rate?.toLocaleString("id-ID") || ""}</DetailText>
                                <DetailText label="EQV Balance Amount">{data?.equivalent?.toLocaleString("id-ID") || ""}</DetailText>
                                <DetailText label="Reff. Start Date">{data?.effectiveDate ? moment(data.effectiveDate).format("DD MMM YYYY") : "-"}</DetailText>
                                <DetailText label="Reff. End Date">{data?.expiringDate ? moment(data.expiringDate).format("DD MMM YYYY") : "-"}</DetailText>
                                <DetailText label="Claim Period">{data?.endDateClaim ? moment(data.endDateClaim).format("DD MMM YYYY") : "-"}</DetailText>
                                <DetailText label="Account Type">{data?.accountType || ""}</DetailText>
                                <DetailText label="Classification Type">{data?.classificationType || ""}</DetailText>
                            </div>
                        </SubSectionCard>

                        {/* RECEIPT INFORMATION TABLE */}
                        <SubSectionCard title="RECEIPT INFORMATION" className="mx-6 mb-4">
                            <TableRBI
                                columns={columnsReceipt}
                                dataSource={receiptList}
                                pagination={false}
                                tableScrolled={{ x: 3500 }}
                                totalData={receiptList?.length || 0}
                                current={page}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                onSizeChanger={handleSizeChange}
                                className="custom-table-confirm"
                            />
                        </SubSectionCard>
                    </div>
                </TabPane>
                <TabPane tab="Approval" key="Approval">
                    <div className="py-6 bg-white max-h-[60vh] overflow-y-auto">
                        <SubSectionCard title="APPROVAL INFORMATION" className="mx-6 mb-4">
                            <ApprovalComponentGeneral
                                showSelect={false}
                                disableSelect={true}
                                approvalName={
                                    (dataOption || []).find((item) => item.value === selectedHierarchy)?.name || ""
                                }
                                dataTable={listDataAppHierDetail}
                                selectedHierarchy={selectedHierarchy}
                            />
                        </SubSectionCard>
                    </div>
                </TabPane>
                <TabPane tab="Attachment" key="Attachment">
                    <div className="py-6 bg-white max-h-[60vh] overflow-y-auto">
                        <SubSectionCard title="ATTACHMENT INFORMATION" className="mx-6 mb-4">
                            <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
                        </SubSectionCard>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ContentModalConfirm;
