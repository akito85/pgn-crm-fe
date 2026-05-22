import React, { useState } from "react";
import { Tabs } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import TableRBI from "../../../../../components/TableRBI";
import SectionCard from "../../../../../components/SectionCard";
import StatusComponent from "../../../../../components/StatusComponent";

const ContentModalConfirmEarlyRepayment = ({
    formValues = {},
    contacts = [],
    openItems = [],
    installmentsByCurrency = {},
    listDataAttachment = [],
    appHierOptions = [],
    appHierDataDetail = [],
    selectedHierarchy,
    data_detail,
}) => {
    const [valuePage, setValuePage] = useState("Early Repayment");
    const detail = data_detail?.restructure || {};

    const contactColumns = [
        { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
        { 
          title: "PRIMARY", 
          dataIndex: "isPrimary", 
          width: 120,
          render: (val) => val ? <StatusComponent colour="primary">Primary</StatusComponent> : "-" 
        },
        { title: "CONTACT NAME", dataIndex: "cpName", width: 250 },
        { title: "JOB", dataIndex: "job", width: 150 },
        { title: "POSITION", dataIndex: "position", width: 150 },
        { title: "ADDRESS", dataIndex: "address" },
    ];

    const subColumns = [
        { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
        { title: "TYPE", dataIndex: "type", width: 150 },
        { title: "VALUE", dataIndex: "value", width: 150 },
    ];

    const expandable = {
        expandedRowRender: (record) => (
            <div style={{ paddingLeft: "2.5em" }}>
                <TableRBI
                    idTable={`expanded-contact-confirm-${record.key}`}
                    columns={subColumns}
                    dataSource={record.details || []}
                    useSelect={false}
                    usePagination={false}
                    showAdvanceSearch={false}
                    showSearchBar={false}
                />
            </div>
        ),
        rowExpandable: (record) => !!record.details,
        expandIcon: ({ expanded, onExpand, record }) =>
            record.details ? (
                expanded ? (
                    <MinusOutlined className="cursor-pointer" onClick={(e) => onExpand(record, e)} />
                ) : (
                    <PlusOutlined className="cursor-pointer" onClick={(e) => onExpand(record, e)} />
                )
            ) : (
                <span className="ml-4" />
            ),
    };

    const attachmentColumns = [
        { title: "NO", dataIndex: "key", width: 50, render: (t, r, i) => i + 1 },
        { title: "FILE NAME", dataIndex: "fileName" },
        { title: "CATEGORY", dataIndex: "fileCategoryName" },
    ];

    const renderOpenItems = () => {
        // Group items by currency
        const grouped = openItems.reduce((acc, item) => {
            const cur = item.currency || "IDR";
            if (!acc[cur]) acc[cur] = [];
            acc[cur].push(item);
            return acc;
        }, {});

        const currencies = Object.keys(grouped);

        if (currencies.length === 0) return <DetailText label="">No data available</DetailText>;

        return currencies.map(currency => {
            const rows = grouped[currency];
            const isIdr = currency === "IDR";
            const total = rows.reduce((sum, r) => {
                const num = parseFloat(String(r.amount).replace(/,/g, "")) || 0;
                return sum + num;
            }, 0);

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, render: (_, __, i) => i + 1 },
                { title: "INVOICE NO", dataIndex: "invoiceNo" },
                { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
                { title: "ALLOCATION", dataIndex: "allocation" },
                { 
                    title: "AMOUNT", 
                    dataIndex: "amount", 
                    align: "right",
                    render: (amount) => {
                        const num = parseFloat(String(amount).replace(/,/g, "")) || 0;
                        return num.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 });
                    }
                },
            ];

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
                            idTable={`open-item-confirm-${currency}`}
                            dataSource={rows}
                            columns={columns}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                        />
                        <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                            <div className="flex-[4] text-center">TOTAL</div>
                            <div className="flex-1 text-right pr-4">
                                {total.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </SectionCard>
                </div>
            );
        });
    };

    const renderEarlyPaymentCalculation = () => {
        const openItemTotals = openItems.reduce((acc, item) => {
            const cur = item.currency || "IDR";
            const amount = parseFloat(String(item.amount).replace(/,/g, "")) || 0;
            acc[cur] = (acc[cur] || 0) + amount;
            return acc;
        }, {});

        const currencies = Object.keys(installmentsByCurrency);
        if (currencies.length === 0) return <DetailText label="">No data available</DetailText>;

        return currencies.map(currency => {
            const rows = installmentsByCurrency[currency] || [];
            const isIdr = currency === "IDR";
            const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
            const targetTotal = openItemTotals[currency] || 0;

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
                { title: "PERIODE", dataIndex: "periode" },
                {
                    title: "TOTAL AMOUNT",
                    dataIndex: "amount",
                    align: "right",
                    render: (val) => parseFloat(val).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })
                },
                {
                    title: "BALANCE",
                    dataIndex: "balance",
                    align: "right",
                    render: (_, __, index) => {
                        const sumPaidUpToThisRow = rows
                            .slice(0, index + 1)
                            .reduce((sum, r) => sum + (parseFloat(String(r.amount).replace(/,/g, "")) || 0), 0);
                        const balance = Math.max(0, targetTotal - sumPaidUpToThisRow);
                        return balance.toLocaleString(isIdr ? "id-ID" : "en-US", {
                            maximumFractionDigits: 2,
                        });
                    }
                },
                {
                    title: "STATUS",
                    dataIndex: "status",
                    align: "center",
                    render: () => (
                        <div className="flex justify-center">
                            <StatusComponent colour="success">Open</StatusComponent>
                        </div>
                    )
                }
            ];

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
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
                            <div className="flex-[4]"></div>
                        </div>
                    </SectionCard>
                </div>
            );
        });
    };

    const items = [
        {
            key: "Early Repayment",
            label: "Early Repayment",
            children: (
                <div className="p-5 bg-[#f8f7fa] min-h-[400px] flex flex-col gap-4">
                    <SectionCard title="ACCOUNT INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Customer Number">{detail?.customerNumber || formValues?.customerNumber || ""}</DetailText>
                            <DetailText label="Customer Name">{detail?.customerName || formValues?.customerName || ""}</DetailText>
                            <DetailText label="Account Number">{detail?.accountNumber || formValues?.accountNumber || ""}</DetailText>
                            <DetailText label="Account Name">{detail?.accountName || formValues?.accountName || ""}</DetailText>
                            <DetailText label="Account Group Type">{detail?.accountGroupType || formValues?.accountGroupType || ""}</DetailText>
                            <DetailText label="SOR">{detail?.sor || formValues?.sor || ""}</DetailText>
                            <DetailText label="Cost Center">{detail?.costCenter || formValues?.costCenter || ""}</DetailText>
                            <DetailText label="Account Segment">{detail?.accountSegment || formValues?.accountSegment || ""}</DetailText>
                            <DetailText label="Meter Reading Code">{detail?.meterReadingCode || formValues?.meterReadingCode || ""}</DetailText>
                            <DetailText label="Account Type">{detail?.accountType || formValues?.accountType || ""}</DetailText>
                            <DetailText label="Classification Type">{detail?.classificationType || formValues?.classificationType || ""}</DetailText>
                            <DetailText label="SAP Cust ID">{detail?.sapCustId || formValues?.sapCustId || ""}</DetailText>
                            <DetailText label="Account Status">{detail?.accountStatus || formValues?.accountStatus || ""}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="INSTALMENT INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Type">{formValues?.type || ""}</DetailText>
                            <DetailText label="Tenor">{formValues?.tenor ? `${formValues.tenor} Months` : "-"}</DetailText>
                            <DetailText label="Start Period">{formValues?.startPeriod ? moment(formValues.startPeriod).format("MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Source">{formValues?.source || ""}</DetailText>
                            <DetailText label="Request Date">{formValues?.requestDate ? moment(formValues.requestDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <div className="col-span-5">
                                <DetailText label="Remark">{formValues?.remark || ""}</DetailText>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="OPEN ITEM INFORMATION">
                        {renderOpenItems()}
                    </SectionCard>

                    <SectionCard title="EARLY PAYMENT CALCULATION">
                        {renderEarlyPaymentCalculation()}
                    </SectionCard>
                </div>
            )
        },
        {
            key: "Approval",
            label: "Approval",
            children: (
                <div className="p-5 bg-[#f8f7fa] min-h-[400px]">
                    <SectionCard title="APPROVAL INFORMATION">
                        <ApprovalComponentGeneral
                            showSelect={false}
                            disableSelect={true}
                            approvalName={
                                (appHierOptions || []).find(
                                    (opt) => opt.value === selectedHierarchy
                                )?.name || ""
                            }
                            dataTable={appHierDataDetail}
                            selectedHierarchy={selectedHierarchy}
                        />
                    </SectionCard>
                </div>
            )
        },
        {
            key: "Attachment",
            label: "Attachment",
            children: (
                <div className="p-5 bg-[#f8f7fa] min-h-[400px]">
                    <SectionCard title="ATTACHMENT INFORMATION">
                        <TableRBI
                            columns={attachmentColumns}
                            dataSource={listDataAttachment}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                        />
                    </SectionCard>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-0 -mt-4 -mx-4 -mb-4 bg-white">
            <Tabs
                activeKey={valuePage}
                onChange={(key) => setValuePage(key)}
                items={items}
                className="custom-confirm-tabs"
                tabBarStyle={{
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    marginBottom: 0,
                    borderBottom: "1px solid #dbdade"
                }}
            />
        </div>
    );
};

export default ContentModalConfirmEarlyRepayment;
