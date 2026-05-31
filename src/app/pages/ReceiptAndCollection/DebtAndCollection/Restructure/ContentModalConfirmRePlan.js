import React, { useState } from "react";
import { Tabs, Table } from "antd";
import { PlusOutlined, MinusOutlined, InfoCircleFilled } from "@ant-design/icons";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import TableRBI from "../../../../../components/TableRBI";
import SectionCard from "../../../../../components/SectionCard";
import StatusComponent from "../../../../../components/StatusComponent";
import DOMPurify from "dompurify";

const getMandatoryAttachments = (segment) => {
    if (segment === "KL") {
        return [
            "KTP",
            "Surat Permohonan",
            "Akta Penunjukan",
            "Surat Kuasa (Optional)",
            "Surat Tugas (Optional)",
            "Kartu Profil Pelanggan"
        ];
    }
    return [
        "KTP",
        "Surat Permohonan",
        "Kartu Profil Pelanggan"
    ];
};

const ContentModalConfirmRePlan = ({
    formValues = {},
    contacts = [],
    openItems = [],
    installmentsByCurrency = {},
    listDataAttachment = [],
    appHierOptions = [],
    appHierDataDetail = [],
    selectedHierarchy,
}) => {
    const [valuePage, setValuePage] = useState("Payment Plan");

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
                    showAdvanceSearch={true}
                    showSearchBar={true}
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
        const grouped = openItems.reduce((acc, item) => {
            const cur = item.currency || "IDR";
            if (!acc[cur]) acc[cur] = [];
            acc[cur].push(item);
            return acc;
        }, {});

        const columns = [
            { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
            { title: "INVOICE NO", dataIndex: "invoiceNo", width: 200 },
            { title: "INVOICE PERIOD", dataIndex: "invoicePeriod", width: 150 },
            { title: "BILLING ITEM", dataIndex: "billingItem", width: 150 },
            { title: "AMOUNT", dataIndex: "amount", align: "right", render: (val) => val?.toLocaleString() || "0" },
        ];

        return Object.entries(grouped).map(([currency, items]) => {
            const isIdr = currency === "IDR";
            const total = items.reduce((sum, r) => sum + (parseFloat(String(r.amount).replace(/,/g, "")) || 0), 0);
            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
                            idTable={`confirm-open-items-${currency}`}
                            columns={columns}
                            dataSource={items.map((it, idx) => ({ ...it, key: idx }))}
                            usePagination={false}
                            showAdvanceSearch={true}
                            showSearchBar={true}
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

    const renderPaymentPlanDetail = () => {
        const openItemTotals = openItems.reduce((acc, item) => {
            const cur = item.currency || "IDR";
            const amount = parseFloat(String(item.amount).replace(/,/g, "")) || 0;
            acc[cur] = (acc[cur] || 0) + amount;
            return acc;
        }, {});

        return Object.entries(installmentsByCurrency).map(([currency, items]) => {
            const targetTotal = openItemTotals[currency] || 0;
            const isIdr = currency === "IDR";
            const columns = [
                { title: "PERIOD", dataIndex: "periode", width: "20%" },
                {
                    title: "TOTAL AMOUNT",
                    dataIndex: "amount",
                    width: "30%",
                    align: "right",
                    render: (val) => {
                        const numeric = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : val;
                        return numeric?.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 }) || "0";
                    }
                },
                { title: "DUE DATE", dataIndex: "dueDate", width: "20%", render: (val) => val || "-" },
                {
                    title: "BALANCE",
                    dataIndex: "balance",
                    width: "30%",
                    align: "right",
                    render: () => {
                        const balance = 0;
                        return balance.toLocaleString(currency === "IDR" ? "id-ID" : "en-US", {
                            maximumFractionDigits: 2,
                        });
                    }
                }
            ];

            const currentSum = items.reduce((sum, r) => sum + (parseFloat(String(r.amount).replace(/,/g, "")) || 0), 0);

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
                            idTable={`confirm-payment-plan-${currency}`}
                            columns={columns}
                            dataSource={items.map((it, idx) => ({ ...it, key: idx }))}
                            usePagination={false}
                            showAdvanceSearch={true}
                            showSearchBar={true}
                            style={{ width: "100%" }}
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                                        <Table.Summary.Cell index={0} className="text-center font-bold">
                                            TOTAL
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                                            {currentSum.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2} />
                                        <Table.Summary.Cell index={3} className="text-right font-bold pr-4 text-gray-500">
                                            {(0).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
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

    const items = [
        {
            key: "Payment Plan",
            label: "Payment Plan",
            children: (
                <div className="p-5 bg-[#f8f7fa] min-h-[400px] flex flex-col gap-6">
                    <SectionCard title="ACCOUNT INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-6 text-[14px]">
                            <DetailText label="Account Number">{formValues?.accountNumber || ""}</DetailText>
                            <DetailText label="Account Name">{formValues?.accountName || ""}</DetailText>
                            <DetailText label="Customer Number">{formValues?.customerNumber || ""}</DetailText>
                            <DetailText label="Customer Name">{formValues?.customerName || ""}</DetailText>
                            <DetailText label="Account Group Type">{formValues?.accountGroupType || ""}</DetailText>
                            <DetailText label="SOR">{formValues?.sor || ""}</DetailText>
                            <DetailText label="Cost Center">{formValues?.costCenter || ""}</DetailText>
                            <DetailText label="Account Segment">{formValues?.accountSegment || ""}</DetailText>
                            <DetailText label="Meter Reading Code">{formValues?.meterReadingCode || ""}</DetailText>
                            <DetailText label="Account Type">{formValues?.accountType || ""}</DetailText>
                            <DetailText label="Classification Type">{formValues?.classificationType || ""}</DetailText>
                            <DetailText label="SAP Cust ID">{formValues?.sapCustId || ""}</DetailText>
                            <DetailText label="Account Status">{formValues?.accountStatus || ""}</DetailText>
                            <DetailText label="Reference Payment Plan Code">{formValues?.saNumber || ""}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="SERVICE AGREEMENT INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-6 text-[14px]">
                            <DetailText label="Service Agreement Number">{formValues?.saNumber || ""}</DetailText>
                            <DetailText label="Service Agreement Name">{formValues?.saName || ""}</DetailText>
                            <DetailText label="Service Agreement Date">{formValues?.saDate ? moment(formValues?.saDate).format("DD/MM/YYYY") : "-"}</DetailText>
                            <DetailText label="Start Date">{formValues?.saStartDate ? moment(formValues?.saStartDate).format("DD/MM/YYYY") : "-"}</DetailText>
                            <DetailText label="End Date">{formValues?.saEndDate ? moment(formValues?.saEndDate).format("DD/MM/YYYY") : "-"}</DetailText>
                            <DetailText label="Minimum Contract">{formValues?.minContract || ""}</DetailText>
                            <DetailText label="Maximum Contract">{formValues?.maxContract || ""}</DetailText>
                            <DetailText label="UOM">{formValues?.uom || ""}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="CONTACT INFORMATION">
                        <TableRBI
                            idTable="confirm-contact-table"
                            columns={contactColumns}
                            dataSource={contacts.map((c, i) => ({ ...c, key: i + 1 }))}
                            expandable={expandable}
                            usePagination={false}
                            showAdvanceSearch={true}
                            showSearchBar={true}
                        />
                    </SectionCard>

                    <SectionCard title="RE-PLAN INFORMATION">
                        <div className="grid grid-cols-5 gap-y-4 gap-x-6 text-[14px]">
                            <DetailText label="Payment Plan Code">{formValues?.restructureCode || ""}</DetailText>
                            <DetailText label="Type">{formValues?.type || ""}</DetailText>
                            <DetailText label="Tenor">{formValues?.tenor ? `${formValues.tenor} Months` : "-"}</DetailText>
                            <DetailText label="Start Period">{formValues?.startPeriod ? moment(formValues?.startPeriod).format("MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Source">{formValues?.source || ""}</DetailText>
                            <DetailText label="Request Date">{formValues?.requestDate ? moment(formValues?.requestDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <div className="col-span-4">
                                <DetailText label="Description">{DOMPurify.sanitize(formValues?.description) || ""}</DetailText>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="OPEN ITEM INFORMATION">
                        {renderOpenItems()}
                    </SectionCard>

                    <SectionCard title="RE-PLAN DETAIL">
                        {renderPaymentPlanDetail()}
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
            children: (() => {
                const uploadedCategories = (listDataAttachment || []).map(a => a.fileCategoryName);
                const mandatory = getMandatoryAttachments(formValues?.accountSegment);
                const missingCategories = mandatory.filter(cat => !uploadedCategories.includes(cat));
                const mandatoryMissing = missingCategories.filter(cat => !cat.toLowerCase().includes("optional"));

                return (
                    <div className="p-5 bg-[#f8f7fa] min-h-[400px] flex flex-col gap-4">
                        {mandatoryMissing.length > 0 && (
                            <div
                                className="flex items-start gap-3 p-4 border"
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
                                        Please upload the required documents below to continue the process.
                                    </span>
                                    <span style={{ color: "#B36214", fontWeight: "500" }}>
                                        {missingCategories.join(", ")}
                                    </span>
                                </div>
                            </div>
                        )}
                        <SectionCard title="ATTACHMENT INFORMATION">
                            <TableRBI
                                columns={attachmentColumns}
                                dataSource={listDataAttachment}
                                usePagination={false}
                                showAdvanceSearch={true}
                                showSearchBar={true}
                            />
                        </SectionCard>
                    </div>
                );
            })()
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

export default ContentModalConfirmRePlan;
