import React, { useState } from "react";
import { Tabs, Table } from "antd";
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
    const [valuePage, setValuePage] = useState("Early Payoff");
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
                { title: "BILLING ITEM", dataIndex: "billingItem" },
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
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                                        <Table.Summary.Cell index={0} colSpan={4} className="text-center font-bold">
                                            TOTAL
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                                            {total.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </SectionCard>
                </div>
            );
        });
    };

    const renderEarlyPaymentCalculation = () => {
        const currencies = Object.keys(installmentsByCurrency);
        if (currencies.length === 0) return <DetailText label="">No data available</DetailText>;

        const getStatusColour = (status) => {
            const s = (status || "Open").toLowerCase();
            if (s === "partially paid") return "warning";
            if (s === "broken") return "danger";
            if (s === "release") return "info";
            return "success";
        };

        return currencies.map(currency => {
            const rows = installmentsByCurrency[currency] || [];
            const isIdr = currency === "IDR";
            const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(String(r.amount).replace(/,/g, "")) || 0), 0);
            const lastBalance = rows.length > 0 && rows[rows.length - 1].balance != null
                ? parseFloat(rows[rows.length - 1].balance)
                : 0;

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
                { title: "PERIOD", dataIndex: "periode" },
                {
                    title: "TOTAL AMOUNT",
                    dataIndex: "amount",
                    align: "right",
                    render: (val) => {
                        const num = parseFloat(String(val).replace(/,/g, "")) || 0;
                        return num.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 });
                    }
                },
                {
                    title: "DUE DATE",
                    dataIndex: "dueDate",
                    render: (val) => val || "-",
                },
                {
                    title: "BALANCE",
                    dataIndex: "balance",
                    align: "right",
                    render: (balance) => {
                        const num = balance != null ? parseFloat(balance) : 0;
                        return (
                            <span className="font-medium text-gray-500">
                                {num.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                            </span>
                        );
                    }
                },
                {
                    title: "STATUS",
                    dataIndex: "status",
                    align: "center",
                    render: (status) => {
                        const finalStatus = status || "Open";
                        return (
                            <div className="flex justify-center">
                                <StatusComponent colour={getStatusColour(finalStatus)}>{finalStatus}</StatusComponent>
                            </div>
                        );
                    }
                }
            ];

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
                            idTable={`er-calc-confirm-${currency}`}
                            dataSource={rows}
                            columns={columns}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                                        <Table.Summary.Cell index={0} colSpan={2} className="text-center font-bold">
                                            Total
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                                            {totalAmount.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2} />
                                        <Table.Summary.Cell index={3} className="text-right font-bold pr-4 text-gray-500">
                                            {lastBalance.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={4} />
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </SectionCard>
                </div>
            );
        });
    };

    const items = [
        {
            key: "Early Payoff",
            label: "Early Payoff",
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

                    <SectionCard title="PAYMENT PLAN INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Payment Plan Code">{formValues?.restructureNumber || ""}</DetailText>
                            <DetailText label="Type">{formValues?.type || ""}</DetailText>
                            <DetailText label="Tenor">{formValues?.tenor ? `${formValues.tenor} Months` : "-"}</DetailText>
                            <DetailText label="Start Period">{formValues?.startPeriod ? moment(formValues.startPeriod).format("MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Source">{formValues?.source || ""}</DetailText>
                            <DetailText label="Request Date">{formValues?.requestDate ? moment(formValues.requestDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Early Payoff Date">{formValues?.earlyRepaymentDate ? moment(formValues.earlyRepaymentDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Reason">{formValues?.reason || ""}</DetailText>
                            <DetailText label="Term of Payment">
                                {formValues?.termOfPaymentType && formValues?.termOfPaymentValue
                                    ? `${formValues.termOfPaymentType} - ${moment(formValues.termOfPaymentValue).format("DD MMM YYYY")}`
                                    : "-"}
                            </DetailText>
                            <div className="col-span-5">
                                <DetailText label="Remark">{formValues?.remark || ""}</DetailText>
                            </div>
                            <div className="col-span-5">
                                <DetailText label="Early Payoff Reason">{formValues?.earlyRepaymentReason || ""}</DetailText>
                            </div>
                        </div>
                    </SectionCard>

                    {/* <SectionCard title="OPEN ITEM INFORMATION">
                        {renderOpenItems()}
                    </SectionCard> */}

                    <SectionCard title="EARLY PAYOFF CALCULATION">
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
