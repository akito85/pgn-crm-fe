import React, { useState } from "react";
import { Tabs } from "antd";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import TableRBI from "../../../../../components/TableRBI";
import SectionCard from "../../../../../components/SectionCard";
import StatusComponent from "../../../../../components/StatusComponent";
import DOMPurify from "dompurify";

const ContentModalConfirmRestructure = ({
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

    const openItemColumns = [
        { title: "NO", dataIndex: "key", width: 50, render: (_, __, i) => i + 1 },
        { title: "INVOICE NO", dataIndex: "invoiceNo" },
        { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
        { title: "ALLOCATION", dataIndex: "allocation" },
        { title: "CURRENCY", dataIndex: "currency" },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "amount",
            align: "right"
        },
    ];

    const attachmentColumns = [
        { title: "NO", dataIndex: "key", width: 50, render: (t, r, i) => i + 1 },
        { title: "FILE NAME", dataIndex: "fileName" },
        { title: "CATEGORY", dataIndex: "fileCategoryName" },
    ];

    const renderPaymentPlanDetail = () => {
        const currencies = Object.keys(installmentsByCurrency);
        if (currencies.length === 0) return <DetailText label="">No data available</DetailText>;

        return currencies.map(currency => {
            const rows = installmentsByCurrency[currency] || [];
            const isIdr = currency === "IDR";
            const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
                { title: "PERIODE", dataIndex: "periode" },
                {
                    title: "TOTAL AMOUNT",
                    dataIndex: "amount",
                    align: "right",
                    render: (val) => parseFloat(val).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })
                },
            ];

            return (
                <div key={currency} className="mb-4">
                    <div className="text-[12px] font-bold mb-2">CURRENCY {currency}</div>
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
                    </div>
                </div>
            );
        });
    };

    const items = [
        {
            key: "Payment Plan",
            label: "Payment Plan",
            children: (
                <div className="p-5 bg-[#f8f7fa] min-h-[400px] flex flex-col gap-4">
                    <SectionCard title="ACCOUNT INFORMATION">
                        <div className="grid grid-cols-4 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Account Number">{formValues?.accountNumber || "-"}</DetailText>
                            <DetailText label="Account Name">{formValues?.accountName || "-"}</DetailText>
                            <DetailText label="Customer Number">{formValues?.customerNumber || "-"}</DetailText>
                            <DetailText label="Customer Name">{formValues?.customerName || "-"}</DetailText>
                            <DetailText label="Account Group Type">{formValues?.accountGroupType || "-"}</DetailText>
                            <DetailText label="SOR">{formValues?.sor || "-"}</DetailText>
                            <DetailText label="Cost Center">{formValues?.costCenter || "-"}</DetailText>
                            <DetailText label="Account Segment">{formValues?.accountSegment || "-"}</DetailText>
                            <DetailText label="Meter Reading Code">{formValues?.meterReadingCode || "-"}</DetailText>
                            <DetailText label="Account Type">{formValues?.accountType || "-"}</DetailText>
                            <DetailText label="Classification Type">{formValues?.classificationType || "-"}</DetailText>
                            <DetailText label="SAP Cust ID">{formValues?.sapCustId || "-"}</DetailText>
                            <DetailText label="Account Status">{formValues?.accountStatus || "-"}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="SERVICE AGREEMENT INFORMATION">
                        <div className="grid grid-cols-4 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Service Agreement Number">{formValues?.saNumber || "-"}</DetailText>
                            <DetailText label="Service Agreement Name">{formValues?.saName || "-"}</DetailText>
                            <DetailText label="Service Agreement Date">{formValues?.saDate ? moment(formValues.saDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Start Date">{formValues?.startDate ? moment(formValues.startDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="End Date">{formValues?.endDate ? moment(formValues.endDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Minimum Contract">{formValues?.minContract || "-"}</DetailText>
                            <DetailText label="Maximum Contract">{formValues?.maxContract || "-"}</DetailText>
                            <DetailText label="UOM">{formValues?.uom || "-"}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="CONTACT INFORMATION">
                        <TableRBI
                            idTable="table-contact-confirm"
                            dataSource={contacts}
                            columns={contactColumns}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                        />
                    </SectionCard>

                    <SectionCard title="PAYMENT PLAN INFORMATION">
                        <div className="grid grid-cols-4 gap-y-4 gap-x-4 w-full">
                            <DetailText label="Type">{formValues?.type || "-"}</DetailText>
                            <DetailText label="Tenor">{formValues?.tenor ? `${formValues.tenor} Months` : "-"}</DetailText>
                            <DetailText label="Start Period">{formValues?.startPeriod ? moment(formValues.startPeriod).format("MMM YYYY") : "-"}</DetailText>
                            <DetailText label="Source">{formValues?.source || "SAP FSCD"}</DetailText>
                            <DetailText label="Request Date">{formValues?.requestDate ? moment(formValues.requestDate).format("DD MMM YYYY") : "-"}</DetailText>
                            <div className="col-span-4">
                                <DetailText label="Description">{DOMPurify.sanitize(formValues?.description) || "-"}</DetailText>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="OPEN ITEM INFORMATION">
                        <TableRBI
                            idTable="table-openitem-confirm"
                            dataSource={openItems}
                            columns={openItemColumns}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                        />
                    </SectionCard>

                    <SectionCard title="PAYMENT PLAN DETAIL">
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

export default ContentModalConfirmRestructure;
