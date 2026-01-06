import moment from "moment";
import { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import TableRBI from "../../../../../components/TableRBI";

const ContentModalConfirmRestructure = ({
    data,
    badDebtList = [],
    totalBadDebt = 0,
    calculationList = [],
    listDataAttachment = [],
    appHierOptions = [],
    appHierDataDetail = [],
    selectedHierarchy,
}) => {
    const tabData = [
        { value: "Restructure" },
        { value: "Approval" },
        { value: "Attachment" },
    ];
    const [valuePage, setValuePage] = useState(tabData[0].value);

    const badDebtColumns = [
        { title: "NO", dataIndex: "key", width: 50 },
        { title: "INVOICE NO", dataIndex: "invoiceNo" },
        { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
        { title: "CURRENCY", dataIndex: "currency" },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            render: (val) => val?.toLocaleString("id-ID"),
            align: "right"
        },
    ];

    const calculationColumns = [
        { title: "NO", dataIndex: "key", width: 50 },
        { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            render: (val) => val?.toLocaleString("id-ID"),
            align: "right"
        },
    ];

    const showSection = () => {
        switch (valuePage) {
            case "Restructure":
                return (
                    <div className="flex flex-col gap-5 w-full">
                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3">
                                CUSTOMER INFORMATION
                            </div>
                            <div className="grid grid-cols-3 w-full gap-5">
                                <DetailText label={"Customer Number"}>
                                    {data?.customerNumber}
                                </DetailText>
                                <DetailText label={"Account Number"}>
                                    {data?.accountNumber}
                                </DetailText>
                                <DetailText label={"Customer Name"}>
                                    {data?.customerName}
                                </DetailText>
                                <DetailText label={"Area"}>
                                    {data?.area}
                                </DetailText>
                                <DetailText label={"Segment"}>
                                    {data?.segment}
                                </DetailText>
                            </div>
                        </div>

                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3 text-[12px]">
                                BAD DEBT INFORMATION
                            </div>
                            <TableRBI
                                dataSource={badDebtList}
                                columns={badDebtColumns}
                                usePagination={false}
                                showAdvanceSearch={false}
                                showSearchBar={false}
                            />
                            {badDebtList.length > 0 && (
                                <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                                    <div className="flex-[4] text-center">TOTAL</div>
                                    <div className="flex-1 text-right pr-4">
                                        {totalBadDebt.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3">
                                RESTRUCTURE INFORMATION
                            </div>
                            <div className="grid grid-cols-2 w-full gap-5">
                                <DetailText label={"Total Month"}>
                                    {data?.totalMonth?.toLocaleString("id-ID")}
                                </DetailText>
                                <DetailText label={"Start Period"}>
                                    {data?.startPeriod ? moment(data?.startPeriod).format("MMM YYYY") : "-"}
                                </DetailText>
                            </div>
                        </div>

                        <div>
                            <div className="text-primary text-xs font-bold uppercase mb-3 text-[12px]">
                                CALCULATION INFORMATION
                            </div>
                            <TableRBI
                                dataSource={calculationList}
                                columns={calculationColumns}
                                usePagination={false}
                                showAdvanceSearch={false}
                                showSearchBar={false}
                            />
                            {calculationList.length > 0 && (
                                <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                                    <div className="flex-[2] text-center ml-[-20px]">TOTAL</div>
                                    <div className="flex-1 text-right pr-4">
                                        {totalBadDebt.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case "Approval":
                return (
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
                );
            case "Attachment":
                return (
                    <div className="flex flex-col gap-3">
                        <div className="text-primary text-xs font-bold uppercase">
                            ATTACHMENT LIST
                        </div>
                        <TableRBI
                            columns={[
                                { title: "NO", dataIndex: "key", width: 50, render: (t, r, i) => i + 1 },
                                { title: "FILE NAME", dataIndex: "fileName" },
                                { title: "CATEGORY", dataIndex: "fileCategoryName" },
                            ]}
                            dataSource={listDataAttachment}
                            usePagination={false}
                        />
                    </div>
                );
            default:
                return <Fragment />;
        }
    };

    return (
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
            <RadioTabs data={tabData} onChange={(e) => setValuePage(e.target.value)} currentPosition={valuePage} />
            <div className="flex flex-col gap-4 mt-2">
                {showSection()}
            </div>
        </div>
    );
};

export default ContentModalConfirmRestructure;
