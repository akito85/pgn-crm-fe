import React, { useState, useEffect } from "react";
import moment from "moment";
import { Tabs, Checkbox, Input, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { InfoCircleFilled } from "@ant-design/icons";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import DetailText from "../../../../../components/DetailText";
import SectionCard from "../../../../../components/SectionCard";
import TableRBI from "../../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import InputLabel from "../../../../../components/InputLabel";
import SelectComponent from "../../../../../components/SelectComponent";
import { getRestructureTypes } from "../../../../../redux/slices/receipt_collection/restructure";
import { CUSTOMER_STATUS } from "../../../../../constants/restructure";
import StatusComponent from "../../../../../components/StatusComponent";

const DetailPaymentPlan = ({
    isEmbedded,
    segmentedPage,
    setSegmentedPage,
    dataHeader,
    data_detail,
    onRefreshOpenItem,
    isUpdateActive,
    onUpdateOpenItem,
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
    configApp,
    openItems
}) => {
    const dispatchRedux = useDispatch();
    const { restructureTypes } = useSelector((state) => state.restructure);

    const [isRequestEvaluation, setIsRequestEvaluation] = useState(false);
    const [evalType, setEvalType] = useState("");
    const [evalTenor, setEvalTenor] = useState("");
    const [evalStartPeriod, setEvalStartPeriod] = useState(null);
    const [evalRequestDate, setEvalRequestDate] = useState(null);
    const [evalDescription, setEvalDescription] = useState("");

    const [evalInstallments, setEvalInstallments] = useState({});

    useEffect(() => {
        if (!isRequestEvaluation || !evalTenor || !evalStartPeriod || !openItems || openItems.length === 0) {
            setEvalInstallments({});
            return;
        }

        const openItemTotals = (openItems || []).reduce((acc, item) => {
            const cur = item.currency || "IDR";
            const amount = parseFloat(String(item.totalAmount || item.amount).replace(/,/g, "")) || 0;
            acc[cur] = (acc[cur] || 0) + amount;
            return acc;
        }, {});

        const evalCurrencies = [...new Set((openItems || []).map((i) => i.currency || "IDR"))];

        const generated = {};
        evalCurrencies.forEach((currency) => {
            const totalForCurrency = openItemTotals[currency] || 0;
            const isIdr = currency === "IDR";
            const tenorNum = parseInt(evalTenor, 10) || 0;

            if (tenorNum <= 0) return;

            // Calculate exact division
            const exactBase = totalForCurrency / tenorNum;

            // Helper to round down to the highest magnitude (e.g., 333,333 -> 300,000, 1,200,000 -> 1,000,000)
            const getCleanBaseAmount = (amount) => {
                if (amount <= 0) return 0;
                const intPart = Math.floor(amount);
                if (intPart === 0) return 0;
                const mag = Math.pow(10, intPart.toString().length - 1);
                return Math.floor(amount / mag) * mag;
            };

            const baseAmount = getCleanBaseAmount(exactBase);

            const rows = Array.from({ length: tenorNum }, (_, i) => {
                let amount = baseAmount;

                // Put all the remainder/difference in the FIRST row
                if (i === 0) {
                    const distributedLater = baseAmount * (tenorNum - 1);
                    amount = totalForCurrency - distributedLater;
                }

                return {
                    key: i + 1,
                    periode: moment(evalStartPeriod).clone().add(i, "months").format("MMM YYYY"),
                    amount: isIdr ? amount.toString() : amount.toFixed(2),
                    dueDate: moment(evalStartPeriod).clone().add(i, "months").endOf("month").format("YYYY-MM-DD"),
                    currency,
                    detailCode: "-",
                    status: "Draft"
                };
            });

            // Compute running balance for each row
            let runningSum = 0;
            const rowsWithBalance = rows.map((row) => {
                runningSum += parseFloat(row.amount) || 0;
                const balance = Math.max(0, totalForCurrency - runningSum);
                return {
                    ...row,
                    balance: balance.toString()
                };
            });

            generated[currency] = rowsWithBalance;
        });

        setEvalInstallments(generated);
    }, [isRequestEvaluation, evalTenor, evalStartPeriod, openItems]);

    const renderEvalPaymentPlanDetail = () => {
        const currencies = Object.keys(evalInstallments);
        if (currencies.length === 0) {
            return (
                <div className="text-gray-400 text-sm text-center py-6 italic">
                    Silakan isi Type, Tenor, dan Start Period pada Request Evaluation.
                </div>
            );
        }

        return currencies.map(currency => {
            const rows = evalInstallments[currency] || [];
            const isIdr = currency === "IDR";
            const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
                { title: "PERIODE", dataIndex: "periode" },
                {
                    title: "TOTAL AMOUNT",
                    dataIndex: "amount",
                    align: "right",
                    render: (val) => (parseFloat(val) || 0).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })
                },
                { title: "DUE DATE", dataIndex: "dueDate", render: (val) => val ? moment(val).format("DD MMM YYYY") : "-" },
                { 
                    title: "BALANCE", 
                    dataIndex: "balance", 
                    align: "right",
                    render: (val) => (parseFloat(val) || 0).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })
                },
                { title: "DETAIL CODE", dataIndex: "detailCode", render: () => "-" },
                { 
                    title: "STATUS", 
                    dataIndex: "status",
                    render: (status) => <StatusComponent colour={status || "Draft"}>{status || "Draft"}</StatusComponent>
                }
            ];

            const totalBalance = rows.reduce((sum, r) => sum + (parseFloat(r.balance) || 0), 0);

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
                            idTable={`plan-detail-eval-${currency}`}
                            dataSource={rows}
                            columns={columns}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                                        <Table.Summary.Cell index={0} colSpan={2} className="text-center font-bold">
                                            TOTAL
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                                            {currentSum.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2} />
                                        <Table.Summary.Cell index={3} className="text-right font-bold pr-4 text-gray-500">
                                            {totalBalance.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={4} colSpan={2} />
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </SectionCard>
                </div>
            );
        });
    };

    useEffect(() => {
        dispatchRedux(getRestructureTypes());
    }, [dispatchRedux]);

    useEffect(() => {
        if (dataHeader) {
            setEvalType("");
            setEvalTenor("");
            setEvalStartPeriod(null);
            setEvalRequestDate(null);
            setEvalDescription("");
            setIsRequestEvaluation(!!dataHeader.isRequestEvaluation);
        }
    }, [dataHeader]);

    const paymentPlanItems = [
        {
            key: "Payment Plan",
            label: "Payment Plan",
            children: (
                <div className="p-5 min-h-[400px] flex flex-col gap-4">
                    {data_detail?.tApprovalDto?.isApprover && (
                        <div
                            className="flex items-start gap-3 p-4 border mb-4"
                            style={{
                                backgroundColor: "#FFF3E6",
                                borderColor: "#FFE0B2",
                                borderRadius: "8px",
                                color: "#B36214"
                            }}
                        >
                            <InfoCircleFilled style={{ fontSize: "18px", marginTop: "2px", color: "#D97706" }} />
                            <div className="flex flex-col gap-1 text-[14px]">
                                <span style={{ color: "#B36214", fontWeight: "600" }}>
                                    This Approval for Payment Plan
                                </span>
                            </div>
                        </div>
                    )}
                    <SectionCard title="ACCOUNT INFORMATION" defaultActiveKey={[]}>
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Account Number">{dataHeader?.accountNumber || ""}</DetailText>
                            <DetailText label="Account Name">{dataHeader?.accountName || ""}</DetailText>
                            <DetailText label="Customer Number">{dataHeader?.customerNumber || ""}</DetailText>
                            <DetailText label="Customer Name">{dataHeader?.customerName || ""}</DetailText>
                            <DetailText label="Account Group Type">{dataHeader?.accountGroupType || ""}</DetailText>
                            <DetailText label="SOR">{dataHeader?.sor || ""}</DetailText>
                            <DetailText label="Cost Center">{dataHeader?.costCenter || ""}</DetailText>
                            <DetailText label="Account Segment">{dataHeader?.accountSegment || ""}</DetailText>
                            <DetailText label="Meter Reading Code">{dataHeader?.meterReadingCode || ""}</DetailText>
                            <DetailText label="Account Type">{dataHeader?.accountType || ""}</DetailText>
                            <DetailText label="Classification Type">{dataHeader?.classificationType || ""}</DetailText>
                            <DetailText label="SAP Cust ID">{dataHeader?.sapCustId || ""}</DetailText>
                            <DetailText label="Account Status">{dataHeader?.accountStatus || ""}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="SERVICE AGREEMENT INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Service Agreement Number">{dataHeader?.saNumber || ""}</DetailText>
                            <DetailText label="Service Agreement Name">{dataHeader?.saName || ""}</DetailText>
                            <DetailText label="Service Agreement Date">{dataHeader?.saDate ? moment(dataHeader.saDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Start Date">{dataHeader?.startDate ? moment(dataHeader.startDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="End Date">{dataHeader?.endDate ? moment(dataHeader.endDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Minimum Contract">{dataHeader?.minContract || ""}</DetailText>
                            <DetailText label="Maximum Contract">{dataHeader?.maxContract || ""}</DetailText>
                            <DetailText label="UOM">{dataHeader?.uom || ""}</DetailText>
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
                            {data_detail?.tApprovalDto?.isApprover ? (
                                <>
                                    <InputComponent
                                        label="Payment Plan Code"
                                        mandatory={true}
                                        disabled={true}
                                        value={dataHeader?.restructureNumber || dataHeader?.id || ""}
                                    />
                                    <InputComponent
                                        label="Type"
                                        mandatory={true}
                                        disabled={true}
                                        value={dataHeader?.type || ""}
                                    />
                                    <InputComponent
                                        label="Tenor"
                                        mandatory={true}
                                        disabled={true}
                                        value={dataHeader?.tenor || ""}
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
                                        value={dataHeader?.source || ""}
                                    />
                                    <DateComponent
                                        label="Request Date"
                                        mandatory={true}
                                        disabled={true}
                                        format="DD MMM YYYY"
                                        value={dataHeader?.requestDate ? moment(dataHeader.requestDate) : null}
                                    />
                                    <div className="col-span-5 flex flex-col w-auto mt-2">
                                        <InputLabel text="Description" mandatory={true} />
                                        <Input.TextArea
                                            rows={2}
                                            style={{
                                                borderRadius: "6px",
                                                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                                marginTop: "8px"
                                            }}
                                            value={dataHeader?.description || ""}
                                            disabled={true}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <DetailText label="Type">{dataHeader?.type || ""}</DetailText>
                                    <DetailText label="Tenor">{dataHeader?.tenor ? `${dataHeader.tenor} Months` : "-"}</DetailText>
                                    <DetailText label="Start Period">{dataHeader?.startPeriod ? moment(dataHeader.startPeriod).format("MMM YYYY") : "-"}</DetailText>
                                    <DetailText label="Source">{dataHeader?.source}</DetailText>
                                    <DetailText label="Request Date">{dataHeader?.requestDate ? moment(dataHeader.requestDate).format("DD MMM YYYY") : "-"}</DetailText>
                                    <div className="col-span-5">
                                        <DetailText label="Description">{dataHeader?.description || ""}</DetailText>
                                    </div>
                                </>
                            )}

                            {data_detail?.tApprovalDto?.isApprover && (
                                <div className="col-span-5 mt-2">
                                    <Checkbox
                                        checked={isRequestEvaluation}
                                        onChange={(e) => setIsRequestEvaluation(e.target.checked)}
                                    >
                                        <div className="flex flex-col gap-1 text-[14px]">
                                            <span style={{ color: "#333333", fontWeight: "600" }}>Request Evaluation</span>
                                            <span style={{ color: "#9E9E9E", fontWeight: "400", fontSize: "12px" }}>
                                                Click or tap this checkbox to apply Request Evaluation terms to this item
                                            </span>
                                        </div>
                                    </Checkbox>
                                </div>
                            )}

                            {data_detail?.tApprovalDto?.isApprover && isRequestEvaluation && (
                                <>
                                    <div className="col-span-5 border-t my-2" />
                                    <InputComponent
                                        label="Payment Plan Code"
                                        mandatory={true}
                                        disabled={true}
                                        value={dataHeader?.restructureNumber || dataHeader?.id || ""}
                                    />
                                    <SelectComponent
                                        label="Type"
                                        mandatory={true}
                                        disabled={false}
                                        placeholder="Select Type"
                                        options={restructureTypes?.map(t => ({ label: t.value, value: t.key })) || []}
                                        value={evalType}
                                        onChange={(val) => setEvalType(val)}
                                    />
                                    {(() => {
                                        const isInactive = dataHeader?.accountStatus && dataHeader.accountStatus.toUpperCase() === CUSTOMER_STATUS.INACTIVE;
                                        return isInactive ? (
                                            <InputComponent
                                                label="Tenor"
                                                mandatory={true}
                                                disabled={false}
                                                type="number"
                                                placeholder="Enter Tenor (Max 60)"
                                                value={evalTenor}
                                                onChange={(e) => setEvalTenor(e.target.value ? Number(e.target.value) : "")}
                                            />
                                        ) : (
                                            <SelectComponent
                                                label="Tenor"
                                                mandatory={true}
                                                disabled={false}
                                                placeholder="Select Tenor"
                                                options={Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1} Month${i > 0 ? "s" : ""}`, value: i + 1 }))}
                                                value={evalTenor}
                                                onChange={(val) => setEvalTenor(val)}
                                            />
                                        );
                                    })()}
                                    <DateComponent
                                        label="Start Period"
                                        mandatory={true}
                                        disabled={false}
                                        picker="month"
                                        format="MMM YYYY"
                                        value={evalStartPeriod}
                                        onChange={(date) => setEvalStartPeriod(date)}
                                    />
                                    <InputComponent
                                        label="Source"
                                        mandatory={true}
                                        disabled={true}
                                        value={dataHeader?.source || ""}
                                    />
                                    <DateComponent
                                        label="Request Date"
                                        mandatory={true}
                                        disabled={false}
                                        format="DD MMM YYYY"
                                        value={evalRequestDate}
                                        onChange={(date) => setEvalRequestDate(date)}
                                    />
                                    <div className="col-span-5 flex flex-col w-auto mt-2">
                                        <InputLabel text="Description" mandatory={true} />
                                        <Input.TextArea
                                            rows={2}
                                            style={{
                                                borderRadius: "6px",
                                                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                                marginTop: "8px"
                                            }}
                                            value={evalDescription}
                                            onChange={(e) => setEvalDescription(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
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
                        {data_detail?.tApprovalDto?.isApprover && (
                            <div className="flex justify-end gap-3 px-4 pt-4">
                                <ButtonComponent
                                    onClick={onRefreshOpenItem}
                                    isPrimary={true}
                                >
                                    Refresh Open Item
                                </ButtonComponent>
                                <ButtonComponent
                                    disabled={!isUpdateActive}
                                    onClick={onUpdateOpenItem}
                                    isPrimary={isUpdateActive}
                                >
                                    Update Open Item
                                </ButtonComponent>
                            </div>
                        )}
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
                            {isRequestEvaluation ? renderEvalPaymentPlanDetail() : renderPaymentPlanDetail()}
                        </div>
                    </CardContainerNoBorder>
                </div>
            )}

            {segmentedPage === "Payment Plan" && (
                <div className="mt-5">
                    <LogHistoryInfo
                        data={{
                            recordId: dataHeader?.id || "",
                            createdDate: dataHeader?.createdDate ? moment(dataHeader?.createdDate).format("DD MMM YYYY HH:mm:ss") : "-",
                            createdBy: dataHeader?.createdBy || "",
                            updatedDate: dataHeader?.updatedDate ? moment(dataHeader?.updatedDate).format("DD MMM YYYY HH:mm:ss") : "-",
                            updatedBy: dataHeader?.updatedBy || ""
                        }} 
                    />
                </div>
            )}
        </>
    );
};

export default DetailPaymentPlan;
