import moment from "moment";
import { Tabs, Input } from "antd";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import DetailText from "../../../../../components/DetailText";
import SectionCard from "../../../../../components/SectionCard";
import TableRBI from "../../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import StatusComponent from "../../../../../components/StatusComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import InputLabel from "../../../../../components/InputLabel";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import SubSectionCard from "../../../../../components/SubSectionCard";

const DetailEarlyRepayment = ({
    isEmbedded,
    segmentedPage,
    setSegmentedPage,
    dataHeader,
    data_detail,
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
    dispatch,
    renderOpenItems,
    getListCategory,
    receiptCollectionHttpService,
    configApp
}) => {
    const renderEarlyPayoffDetail = () => {
        const list = data_detail?.selectedInstallmentDetails || data_detail?.calculationList || [];
        const grouped = list.reduce((acc, item) => {
            const cur = item.currency || "IDR";
            if (!acc[cur]) acc[cur] = [];
            acc[cur].push(item);
            return acc;
        }, {});

        const currencies = Object.keys(grouped);
        if (currencies.length === 0) return <DetailText label="">No data available</DetailText>;

        return currencies.map(currency => {
            const rows = grouped[currency] || [];
            const isIdr = currency === "IDR";
            const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
                { title: "PERIODE", dataIndex: "periode" },
                {
                    title: "AMOUNT",
                    dataIndex: "amount",
                    align: "right",
                    render: (val) => (parseFloat(val) || 0).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })
                },
                {
                    title: "BALANCE",
                    dataIndex: "balance",
                    align: "right",
                    render: (val) => (parseFloat(val) || 0).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })
                },
                { 
                    title: "STATUS", 
                    dataIndex: "status", 
                    render: (text) => <div className="flex justify-center w-full"><StatusComponent colour={text}>{text}</StatusComponent></div> 
                }
            ];

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
                            idTable={`er-detail-view-${currency}`}
                            dataSource={rows}
                            columns={columns}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                        />
                        <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                            <div className="flex-[2] text-center">TOTAL</div>
                            <div className="flex-1 text-right pr-4">
                                {currentSum.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                            </div>
                            <div className="flex-1"></div>
                        </div>
                    </SectionCard>
                </div>
            );
        });
    };

    const earlyRepaymentItems = [
        {
            key: "Payment Plan",
            label: "Early Repayment",
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

                    <SectionCard title="INSTALMENT INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <InputComponent
                                label="Type"
                                mandatory={true}
                                disabled={true}
                                value={dataHeader?.type || "-"}
                            />
                            <InputComponent
                                label="Tenor"
                                mandatory={true}
                                disabled={true}
                                value={dataHeader?.tenor ? `${dataHeader.tenor} Months` : "-"}
                            />
                            <DateComponent
                                label="Start Period"
                                mandatory={true}
                                disabled={true}
                                picker="month"
                                format="MMM YYYY"
                                value={dataHeader?.startPeriod ? moment(dataHeader.startPeriod) : null}
                            />
                            <InputComponent
                                label="Source"
                                mandatory={true}
                                disabled={true}
                                value={data_detail?.earlyRepayment?.source || dataHeader?.source || "-"}
                            />
                            <DateComponent
                                label="Request Date"
                                mandatory={true}
                                disabled={true}
                                format="DD MMM YYYY"
                                value={data_detail?.earlyRepayment?.createdDate ? moment(data_detail.earlyRepayment.createdDate) : (dataHeader?.requestDate ? moment(dataHeader.requestDate) : null)}
                            />
                            <DateComponent
                                label="Early Repayment Date"
                                mandatory={true}
                                disabled={true}
                                format="DD MMM YYYY"
                                value={data_detail?.earlyRepayment?.repaymentDate ? moment(data_detail.earlyRepayment.repaymentDate) : (data_detail?.tApprovalDto?.requestedDate ? moment(data_detail.tApprovalDto.requestedDate) : null)}
                            />
                            <div className="col-span-5 flex flex-col w-auto">
                                <InputLabel text="Remark" mandatory={true} />
                                <Input.TextArea
                                    rows={2}
                                    style={{
                                        borderRadius: "6px",
                                        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                        marginTop: "8px"
                                    }}
                                    value={dataHeader?.description || "-"}
                                    disabled={true}
                                />
                            </div>
                            <div className="col-span-5 flex flex-col w-auto">
                                <InputLabel text="Early Repayment Reason" mandatory={true} />
                                <Input.TextArea
                                    rows={2}
                                    style={{
                                        borderRadius: "6px",
                                        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                        marginTop: "8px"
                                    }}
                                    value={data_detail?.earlyRepayment?.reason || data_detail?.tApprovalDto?.remarks || "-"}
                                    disabled={true}
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
                    <SectionCard title="EARLY REPAYMENT APPROVAL INFORMATION">
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
                    header="EARLY REPAYMENT DETAIL"
                    className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                    noPadding
                    collapsible={true}
                >
                    <div className="full-width-tabs">
                        <Tabs
                            activeKey={segmentedPage}
                            onChange={(key) => setSegmentedPage(key)}
                            items={earlyRepaymentItems}
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
                        header="CONTACT INFORMATION"
                        className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                        collapsible={true}
                    >
                        <div className="p-4">
                            <Tabs
                                defaultActiveKey="Payment Plan"
                                items={[
                                    {
                                        key: "Payment Plan",
                                        label: "Payment Plan",
                                        children: (
                                            <SubSectionCard>
                                                <TableRBI
                                                    idTable="table-contact-detail-pp"
                                                    dataSource={contacts}
                                                    columns={contactColumns}
                                                    expandable={expandable}
                                                    usePagination={false}
                                                    showAdvanceSearch={false}
                                                    showSearchBar={false}
                                                />
                                            </SubSectionCard>
                                        )
                                    },
                                    {
                                        key: "Early Payoff",
                                        label: "Early Payoff",
                                        children: (
                                            <SubSectionCard>
                                                <TableRBI
                                                    idTable="table-contact-detail-er"
                                                    dataSource={data_detail?.earlyRepayment?.contactList || []}
                                                    columns={contactColumns}
                                                    expandable={expandable}
                                                    usePagination={false}
                                                    showAdvanceSearch={false}
                                                    showSearchBar={false}
                                                />
                                            </SubSectionCard>
                                        )
                                    }
                                ]}
                            />
                        </div>
                    </CardContainerNoBorder>

                    <CardContainerNoBorder 
                        header="EARLY PAY OFF DETAIL"
                        className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                        collapsible={true}
                    >
                        <div className="p-4">
                            {renderEarlyPayoffDetail()}
                        </div>
                    </CardContainerNoBorder>

                    <CardContainerNoBorder 
                        header="OPEN ITEM INFORMATION"
                        className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                        collapsible={true}
                    >
                        <div className="p-4">
                            {renderOpenItems ? renderOpenItems() : "No open items available"}
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

export default DetailEarlyRepayment;
