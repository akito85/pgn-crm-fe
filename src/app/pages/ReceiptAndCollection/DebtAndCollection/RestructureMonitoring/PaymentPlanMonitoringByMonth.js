import React, { useState, useEffect } from "react";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../components/TableRBI";
import Toolbar from "../../../../../components/Toolbar";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthList, downloadMonthList } from "../../../../../redux/slices/receipt_collection/restructureMonitoring";

const PaymentPlanMonitoringByMonth = ({ selectedPeriod }) => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const yearSuffix = selectedPeriod ? selectedPeriod.substring(2) : "26";

    const monthColumns = [
        { title: "NO", dataIndex: "key", key: "key", width: 60, align: "center" },
        { title: "COST CENTER", dataIndex: "costCenter", key: "costCenter" },
        { 
            title: "TOTAL SUBMISSION", 
            dataIndex: "totalSubmission", 
            key: "totalSubmission",
            align: "right",
            render: (val) => val ? val.toLocaleString("id-ID") : "-"
        },
        { title: "CURRENCY", dataIndex: "currency", key: "currency", align: "center" },
        { 
            title: "TOTAL OPEN ITEM", 
            dataIndex: "totalOpenItem", 
            key: "totalOpenItem",
            align: "right",
            render: (val) => val ? val.toLocaleString("id-ID") : "-"
        },
        {
            title: `JAN ${yearSuffix}`,
            children: [
                {
                    title: "TOTAL ACCOUNT",
                    dataIndex: "janTotalAccount",
                    key: "janTotalAccount",
                    align: "right",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                },
                {
                    title: "TOTAL AMOUNT",
                    dataIndex: "janTotalAmount",
                    key: "janTotalAmount",
                    align: "right",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                }
            ]
        },
        {
            title: `FEB ${yearSuffix}`,
            children: [
                {
                    title: "TOTAL ACCOUNT",
                    dataIndex: "febTotalAccount",
                    key: "febTotalAccount",
                    align: "right",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                },
                {
                    title: "TOTAL AMOUNT",
                    dataIndex: "febTotalAmount",
                    key: "febTotalAmount",
                    align: "right",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                }
            ]
        },
        {
            title: "TOTAL PAYMENT",
            children: [
                {
                    title: "TOTAL AMOUNT CUSTOMER",
                    dataIndex: "totalAmountCustomer",
                    key: "totalAmountCustomer",
                    align: "right",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                },
                {
                    title: "BALANCE",
                    dataIndex: "balance",
                    key: "balance",
                    align: "right",
                    render: (val) => typeof val === "number" ? val.toLocaleString("id-ID") : "-"
                }
            ]
        }
    ];

    const dispatch = useDispatch();
    const { monthData, loadingMonth } = useSelector((state) => state.restructureMonitoring);

    useEffect(() => {
        dispatch(fetchMonthList());
    }, [dispatch]);

    const mappedMonthData = (monthData || []).map((item, idx) => ({
        key: item.key || String(idx),
        costCenter: item.area,
        totalSubmission: item.planAmount,
        currency: "IDR",
        totalOpenItem: item.totalOpenItem,
        janTotalAccount: item.janTotalAccount,
        janTotalAmount: item.janTotalAmount,
        febTotalAccount: item.febTotalAccount,
        febTotalAmount: item.febTotalAmount,
        totalAmountCustomer: item.paymentTotalAmount || item.paymentAmount,
        balance: item.paymentAmount
    }));

    const extractColumns = (cols) => {
        let result = [];
        cols.forEach(col => {
            if (col.children) {
                result = result.concat(col.children);
            } else {
                result.push(col);
            }
        });
        return result;
    };

    const columnDefinitions = extractColumns(monthColumns).map(col => ({
        key: col.key,
        title: col.title
    }));

    const handlePageChange = (page, size) => {
        setCurrent(page);
        if (size) setPageSize(size);
    };

    const handleDownload = () => dispatch(downloadMonthList());

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

    // Calculate slice of data
    const paginatedData = mappedMonthData.slice((current - 1) * pageSize, current * pageSize);

    return (
        <CardContainerNoBorder
            header={
                <div className="flex -my-4 justify-between items-center w-full" style={{ textTransform: "none" }}>
                    <p className="mt-[15px]  uppercase text-[#0075BF]">
                        PAYMENT PLAN MONITORING BY MONTH
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
            <div className="p-4 overflow-hidden">
                <TableRBI
                    columns={monthColumns}
                    dataSource={paginatedData}
                    loading={loadingMonth}
                    current={current}
                    pageSize={pageSize}
                    totalData={mappedMonthData.length}
                    onChange={handlePageChange}
                    onSizeChanger={handlePageChange}
                    usePagination={true}
                    useSelect={true}
                    showSearchBar={true}
                    showAdvanceSearch={true}
                    showExport={false}
                    handleDownload={handleDownload}
                    columnDefinitions={columnDefinitions}
                    className="custom-nested-monitoring-table"
                    tableScrolled={{ x: "max-content" }}
                />
            </div>
        </CardContainerNoBorder>
    );
};

export default PaymentPlanMonitoringByMonth;
