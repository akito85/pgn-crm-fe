import React, { useEffect } from "react";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../components/TableRBI";
import Toolbar from "../../../../../components/Toolbar";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { Table, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchYearList, downloadYearList } from "../../../../../redux/slices/receipt_collection/restructureMonitoring";

const INNER_TABLE_ID = "inner-year-table";

const PaymentPlanMonitoringByYear = () => {
    // ─── Outer Table Columns ──────────────────────────────────────────────────
    const yearColumns = [
        { title: "NO",  dataIndex: "no",  key: "no",  width: 60, align: "center" },
        { title: "SOR", dataIndex: "sor", key: "sor" },
        {
            title: "JUMLAH PENGAJUAN PELANGGAN",
            dataIndex: "submissions", key: "submissions", align: "right",
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "TOTAL PENGAJUAN",
            dataIndex: "totalAmount", key: "totalAmount", align: "right",
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "PAYMENT",
            dataIndex: "payment", key: "payment", align: "right",
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "TOTAL PAYMENT",
            dataIndex: "totalPayment", key: "totalPayment", align: "right",
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "UNPAID",
            dataIndex: "unpaid", key: "unpaid", align: "right",
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "SISA TUNGGAKAN",
            dataIndex: "sisaTunggakan", key: "sisaTunggakan", align: "right",
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
    ];

    // ─── Inner (Expanded) Table Columns ──────────────────────────────────────
    const innerColumns = [
        {
            title: "NO", dataIndex: "no", key: "inner-no",
            width: 60, align: "center",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (val, record) => {
                if (record.isGrandTotal) {
                    if (record.isFirstGrandTotal) {
                        return {
                            children: <strong style={{ color: "#111827", textTransform: "uppercase", display: "block", textAlign: "center" }}>GRAND TOTAL</strong>,
                            props: { colSpan: 2, rowSpan: record.grandTotalCount || 1 }
                        };
                    }
                    return { children: null, props: { colSpan: 0, rowSpan: 0 } };
                }
                return val;
            }
        },
        {
            title: "AREA", dataIndex: "area", key: "inner-area",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (val, record) =>
                record.isGrandTotal
                    ? { children: null, props: { colSpan: 0, rowSpan: 0 } }
                    : val,
        },
        {
            title: "CURRENCY", dataIndex: "currency", key: "inner-currency",
            align: "center",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (val, record) => val,
        },
        {
            title: "JUMLAH PENGAJUAN PELANGGAN",
            dataIndex: "submissions", key: "inner-submissions", align: "right",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "TOTAL PENGAJUAN",
            dataIndex: "totalAmount", key: "inner-totalAmount", align: "right",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "PAYMENT",
            dataIndex: "payment", key: "inner-payment", align: "right",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "TOTAL PAYMENT",
            dataIndex: "totalPayment", key: "inner-totalPayment", align: "right",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "UNPAID",
            dataIndex: "unpaid", key: "inner-unpaid", align: "right",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
        {
            title: "SISA TUNGGAKAN",
            dataIndex: "sisaTunggakan", key: "inner-sisaTunggakan", align: "right",
            onHeaderCell: () => ({ style: { backgroundColor: "#0075BF", color: "white", textTransform: "uppercase", fontSize: "10px" } }),
            render: (v) => typeof v === "number" ? v.toLocaleString("id-ID") : v,
        },
    ];

    const dispatch = useDispatch();
    const { yearData, loadingYear } = useSelector((state) => state.restructureMonitoring);

    useEffect(() => {
        dispatch(fetchYearList());
    }, [dispatch]);

    const mappedYearData = (yearData || []).map((item, idx) => ({
        key: item.key || String(idx),
        no: idx + 1,
        sor: item.area,
        submissions: item.accountTotal,
        totalAmount: item.planAmount,
        payment: item.paymentTotalAccount,
        totalPayment: item.paymentTotalAmount,
        unpaid: item.openItemTotalAccount,
        sisaTunggakan: item.openItemTotalAmount,
        details: (() => {
            const children = item.children || [];
            const grandTotalCount = children.filter(c => c.area === "GRAND TOTAL").length;
            const firstGrandTotalIdx = children.findIndex(c => c.area === "GRAND TOTAL");
            return children.map((child, cIdx) => {
                const isGrandTotal = child.area === "GRAND TOTAL";
                const isFirstGrandTotal = isGrandTotal && cIdx === firstGrandTotalIdx;
                return {
                    key: child.key || `${idx}-${cIdx}`,
                    no: cIdx + 1,
                    area: child.area,
                    currency: child.currency || "IDR",
                    submissions: child.accountTotal,
                    totalAmount: child.planAmount,
                    payment: child.paymentTotalAccount,
                    totalPayment: child.paymentTotalAmount,
                    unpaid: child.openItemTotalAccount,
                    sisaTunggakan: child.openItemTotalAmount,
                    isGrandTotal: isGrandTotal,
                    isFirstGrandTotal: isFirstGrandTotal,
                    grandTotalCount: isFirstGrandTotal ? grandTotalCount : 0,
                };
            });
        })()
    }));

    const columnDefinitions = yearColumns.map((col) => ({ key: col.key, title: col.title }));

    const handleDownload = () => dispatch(downloadYearList());

    const itemActions = [
        {
            action: "Download",
            render: (
                <div onClick={(e) => e.stopPropagation()}>
                    <ButtonComponent
                        onClick={handleDownload}
                        type="submit"
                        border={false}
                        icon={<DownloadOutlined style={{ fontSize: "16px" }} />}
                        style={{ textTransform: "none" }}
                    >
                        Download List
                    </ButtonComponent>
                </div>
            ),
        }
    ];

    return (
        <CardContainerNoBorder
            header={
                <div className="flex -my-4 justify-between items-center w-full" style={{ textTransform: "none" }}>
                    <p className="mt-[15px]  uppercase text-[#0075BF]">
                        PAYMENT PLAN MONITORING BY YEAR
                    </p>
                    <div className="flex gap-2">
                        <Toolbar items={itemActions} />
                    </div>
                </div>
            }
            className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
            noPadding={true}
            collapsible={true}
        >
            {/* Inject styles for inner table header colour */}
            <style>{`
                .inner-year-table .ant-table-thead > tr > th {
                    background-color: #0075BF !important;
                    color: white !important;
                    font-size: 10px !important;
                    text-transform: uppercase;
                }
                .inner-year-table .ant-table-thead > tr > th .ant-table-column-sorter,
                .inner-year-table .ant-table-thead > tr > th .ant-table-filter-trigger {
                    color: white !important;
                }
                .inner-year-grand-total td {
                    background-color: #EFF6FF !important;
                    font-weight: 700;
                }
            `}</style>
 
            <div className="p-4">
                <TableRBI
                    columns={yearColumns}
                    dataSource={mappedYearData}
                    loading={loadingYear}
                    usePagination={false}
                    useSelect={true}
                    showSearchBar={true}
                    showAdvanceSearch={true}
                    showExport={false}
                    handleDownload={handleDownload}
                    columnDefinitions={columnDefinitions}
                    className="custom-nested-monitoring-table"
                    expandable={{
                        expandedRowRender: (record) => {
                            if (!record.details || record.details.length === 0) return null;
                            return (
                                <div style={{ padding: "8px 0", paddingLeft: "48px", backgroundColor: "#f0f4f8" }}>
                                    <Table
                                        className="inner-year-table"
                                        columns={innerColumns}
                                        dataSource={record.details}
                                        rowKey="key"
                                        pagination={false}
                                        bordered
                                        size="small"
                                        rowClassName={(r) =>
                                            r.isGrandTotal ? "inner-year-grand-total" : ""
                                        }
                                    />
                                </div>
                            );
                        },
                        rowExpandable: (record) => record.details && record.details.length > 0,
                    }}
                />
            </div>
        </CardContainerNoBorder>
    );
};

export default PaymentPlanMonitoringByYear;

