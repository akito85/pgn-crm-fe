import React, { useState, useEffect, useRef } from "react";
import { Tabs, Select, Button, Tooltip, message, Spin } from "antd";
import { SettingOutlined, DownloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPeriods,
    fetchKpi,
    fetchChart,
    fetchStatusDistribution,
    fetchDetailList,
    downloadDetailList
} from "../../../../../redux/slices/receipt_collection/restructureMonitoring";
import { Chart, registerables } from "chart.js";

// Custom components
import BreadCrumb from "../../../../../components/BreadCrumb";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import SVGIcon from "../../../../../assets/Icon/index";
import TableRBI from "../../../../../components/TableRBI";
import SubSectionCard from "../../../../../components/SubSectionCard";
import StatusComponent from "../../../../../components/StatusComponent";
import Toolbar from "../../../../../components/Toolbar";
import ButtonComponent from "../../../../../components/ButtonComponent";

// Sub-components
import PaymentPlanMonitoringByYear from "./PaymentPlanMonitoringByYear";
import PaymentPlanMonitoringByMonth from "./PaymentPlanMonitoringByMonth";

// Register Chart.js components
Chart.register(...registerables);

const { Option } = Select;

const RestructureMonitoring = () => {
    const [activeTab, setActiveTab] = useState("Summary");
    const [selectedPeriod, setSelectedPeriod] = useState("2026");
    const [currentDetail, setCurrentDetail] = useState(1);
    const [pageSizeDetail, setPageSizeDetail] = useState(10);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [hiddenDatasets, setHiddenDatasets] = useState({});

    const dispatch = useDispatch();
    const {
        periods,
        kpiData,
        chartData,
        statusDistribution,
        detailData,
        loadingPeriods,
        loadingKpi,
        loadingChart,
        loadingStatus,
        loadingDetail
    } = useSelector((state) => state.restructureMonitoring);

    useEffect(() => {
        dispatch(fetchPeriods());
        dispatch(fetchKpi());
        dispatch(fetchChart());
        dispatch(fetchStatusDistribution());
        fetchDetail();
    }, [dispatch]);

    const fetchDetail = (page = 1, pageSize = 10, searchs = "", sort = null) => {
        const payload = { page, pageSize, searchs };
        if (sort && sort !== "") {
            payload.sort = Array.isArray(sort) ? sort : [sort];
        }
        dispatch(fetchDetailList(payload));
    };

    const toggleDataset = (index) => {
        if (!chartInstanceRef.current) return;
        const chart = chartInstanceRef.current;
        const meta = chart.getDatasetMeta(index);
        const isHidden = meta.hidden === null ? !chart.data.datasets[index].hidden : meta.hidden;
        meta.hidden = !isHidden;
        chart.update();
        setHiddenDatasets(prev => ({
            ...prev,
            [index]: !isHidden
        }));
    };

    // Helper to render beautiful Figma-style icons with light-blue badge background
    const renderKpiIcon = (iconName) => {
        const iconClass = "w-9 h-9 flex items-center justify-center rounded-lg bg-[#E6F4FA]";
        return (
            <div className={iconClass}>
                <SVGIcon name={iconName} color="#1976D2" width="18" height="18" />
            </div>
        );
    };

    const yearSuffix = selectedPeriod ? selectedPeriod.substring(2) : "26";

    // Detail Tab Table Columns Setup
    const detailColumns = [
        { title: "NO", dataIndex: "key", key: "key", width: 60, align: "center", fixed: "left" },
        { title: "SOR", dataIndex: "sor", key: "sor", width: 100, align: "center" },
        { title: "COST CENTER", dataIndex: "costCenter", key: "costCenter", width: 180, align: "center" },
        { title: "ACCOUNT NUMBER", dataIndex: "accountNumber", key: "accountNumber", width: 150, align: "center" },
        { title: "ACCOUNT NAME", dataIndex: "accountName", key: "accountName", width: 200, align: "center" },
        { title: "ACCOUNT STATUS", dataIndex: "accountStatus", key: "accountStatus", width: 130, align: "center" },
        { title: "ACCOUNT SEGMENT", dataIndex: "accountSegment", key: "accountSegment", width: 150, align: "center" },
        { title: "ACCOUNT GROUP TYPE", dataIndex: "accountGroupType", key: "accountGroupType", width: 160, align: "center" },
        { title: "METER READING CODE", dataIndex: "meterReadingCode", key: "meterReadingCode", width: 160, align: "center" },
        { title: "ACCOUNT CLASSIFICATION", dataIndex: "accountClassification", key: "accountClassification", width: 180, align: "center" },
        { title: "ACCOUNT TYPE", dataIndex: "accountType", key: "accountType", width: 130, align: "center" },
        { title: "MOBILE PHONE", dataIndex: "mobilePhone", key: "mobilePhone", width: 130, align: "center" },
        { title: "CURRENCY", dataIndex: "currency", key: "currency", width: 100, align: "center" },
        { 
            title: "TOTAL OPEN ITEM", 
            dataIndex: "totalOpenItem", 
            key: "totalOpenItem", 
            width: 150, 
            align: "center",
            render: (val) => val ? val.toLocaleString("id-ID") : "-"
        },
        { title: "START PERIOD", dataIndex: "startPeriod", key: "startPeriod", width: 120, align: "center" },
        { title: "END PERIOD", dataIndex: "endPeriod", key: "endPeriod", width: 120, align: "center" },
        { title: "TENOR", dataIndex: "tenor", key: "tenor", width: 80, align: "center" },
        { 
            title: "PLAN AMOUNT", 
            dataIndex: "planAmount", 
            key: "planAmount", 
            width: 150, 
            align: "center",
            render: (val) => val ? val.toLocaleString("id-ID") : "-"
        },
        { 
            title: "PREVIOUS YEAR", 
            dataIndex: "previousYear", 
            key: "previousYear", 
            width: 150, 
            align: "center",
            render: (val) => val ? val.toLocaleString("id-ID") : "-"
        },
        {
            title: "PAYMENT",
            children: [
                {
                    title: `JAN ${yearSuffix}`,
                    dataIndex: "jan",
                    key: "jan",
                    width: 120,
                    align: "center",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                },
                {
                    title: `FEB ${yearSuffix}`,
                    dataIndex: "feb",
                    key: "feb",
                    width: 120,
                    align: "center",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                },
                {
                    title: `MAR ${yearSuffix}`,
                    dataIndex: "mar",
                    key: "mar",
                    width: 120,
                    align: "center",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                },
                {
                    title: `APR ${yearSuffix}`,
                    dataIndex: "apr",
                    key: "apr",
                    width: 120,
                    align: "center",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                },
                {
                    title: `MAY ${yearSuffix}`,
                    dataIndex: "may",
                    key: "may",
                    width: 120,
                    align: "center",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                },
                {
                    title: `JUN ${yearSuffix}`,
                    dataIndex: "jun",
                    key: "jun",
                    width: 120,
                    align: "center",
                    render: (val) => val ? val.toLocaleString("id-ID") : "-"
                }
            ]
        },
        { 
            title: "TOTAL PAYMENT", 
            dataIndex: "totalPayment", 
            key: "totalPayment", 
            width: 150, 
            align: "center",
            render: (val) => val ? val.toLocaleString("id-ID") : "-"
        },
        { 
            title: "BALANCE", 
            dataIndex: "balance", 
            key: "balance", 
            width: 150, 
            align: "center",
            render: (val) => typeof val === "number" ? val.toLocaleString("id-ID") : "-"
        },
        { 
            title: "STATUS", 
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 120,
            fixed: "right",
            render: (status) => (
                <div className="flex justify-center">
                    <StatusComponent colour={status} size="small">{status}</StatusComponent>
                </div>
            )
        },
    ];

    // detailData comes from Redux state

    const extractDetailColumns = (cols) => {
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

    const columnDefinitionsDetail = extractDetailColumns(detailColumns).map(col => ({
        key: col.key,
        title: col.title
    }));

    const handleDetailPageChange = (page, size) => {
        setCurrentDetail(page);
        if (size) setPageSizeDetail(size);
        fetchDetail(page, size);
    };

    const handleDownloadDetail = () => {
        dispatch(downloadDetailList({ page: currentDetail, pageSize: pageSizeDetail }));
    };

    const handleSearchDetail = (value) => {
        fetchDetail(1, pageSizeDetail, value);
    };

    const handleTableChange = (pagination, filters, sorter, extra) => {
        if (extra.action === 'sort') {
            const sortStr = sorter.order ? `${sorter.field}~${sorter.order === 'ascend' ? 'asc' : 'desc'}` : "";
            fetchDetail(currentDetail, pageSizeDetail, "", sortStr);
        }
    };

    const paginatedDetailData = detailData?.result || [];

    // Chart combination setup
    useEffect(() => {
        if (!chartRef.current || activeTab !== "Summary") return;

        // Destroy existing chart
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");

        const months = chartData?.labels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let hoveredLineIndex = null;

        // Snap all line dots to Payment Total (bar index 2) x-position per month
        const alignLinePlugin = {
            id: "alignLine",
            beforeDatasetsDraw(chart) {
                const barMeta = chart.getDatasetMeta(2);
                if (!barMeta || !barMeta.data || barMeta.data.length === 0) return;
                [3, 4, 5, 6].forEach((lineIndex) => {
                    const lineMeta = chart.getDatasetMeta(lineIndex);
                    if (lineMeta && lineMeta.data) {
                        lineMeta.data.forEach((point, index) => {
                            if (barMeta.data[index]) {
                                point.x = barMeta.data[index].x;
                            }
                        });
                    }
                });
            }
        };

        chartInstanceRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: months,
                datasets: [
                    {
                        type: "bar",
                        label: "Account Total",
                        data: chartData?.datasets?.[0]?.data || [],
                        backgroundColor: "#0075BF",
                        borderRadius: 4,
                        barPercentage: 0.9,
                        categoryPercentage: 0.85,
                        order: 2,
                    },
                    {
                        type: "bar",
                        label: "Plan Total",
                        data: chartData?.datasets?.[1]?.data || [],
                        backgroundColor: "#81D4FA",
                        borderRadius: 4,
                        barPercentage: 0.9,
                        categoryPercentage: 0.85,
                        order: 2,
                    },
                    {
                        type: "bar",
                        label: "Payment Total",
                        data: chartData?.datasets?.[2]?.data || [],
                        backgroundColor: "#29B6F6",
                        borderRadius: 4,
                        barPercentage: 0.9,
                        categoryPercentage: 0.85,
                        order: 2,
                    },
                    {
                        type: "line",
                        label: "Plan Total IDR",
                        data: chartData?.datasets?.[3]?.data || [],
                        borderColor: "#4CAF50",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        tension: 0,
                        pointRadius: 4,
                        pointBackgroundColor: "#4CAF50",
                        order: 1,
                    },
                    {
                        type: "line",
                        label: "Payment Total IDR",
                        data: chartData?.datasets?.[4]?.data || [],
                        borderColor: "#FF9800",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        tension: 0,
                        pointRadius: 4,
                        pointBackgroundColor: "#FF9800",
                        order: 1,
                    },
                    {
                        type: "line",
                        label: "Plan Total USD",
                        data: chartData?.datasets?.[5]?.data || [],
                        borderColor: "#F44336",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        tension: 0,
                        pointRadius: 4,
                        pointBackgroundColor: "#F44336",
                        order: 1,
                    },
                    {
                        type: "line",
                        label: "Payment Total USD",
                        data: chartData?.datasets?.[6]?.data || [],
                        borderColor: "#9CA3AF",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        tension: 0,
                        pointRadius: 4,
                        pointBackgroundColor: "#9CA3AF",
                        order: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onHover: (event, activeElements, chart) => {
                    const intersected = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, false);
                    if (intersected.length > 0) {
                        const ds = chart.data.datasets[intersected[0].datasetIndex];
                        hoveredLineIndex = ds.type === "line" ? intersected[0].datasetIndex : null;
                    } else {
                        hoveredLineIndex = null;
                    }
                },
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        filter: (item) => {
                            if (hoveredLineIndex !== null) {
                                return item.datasetIndex === hoveredLineIndex;
                            }
                            return item.dataset.type === "bar";
                        },
                        callbacks: {
                            label: (context) => {
                                return ` ${context.dataset.label}: ${context.parsed.y}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                size: 10,
                            },
                        },
                    },
                    y: {
                        type: "linear",
                        display: true,
                        position: "left",
                        min: 0,
                        title: {
                            display: true,
                            text: "Plan Amount (Millions IDR)",
                            font: {
                                size: 10,
                                weight: "bold",
                            },
                        },
                        grid: {
                            color: "#F0F0F0",
                        },
                    },
                },
            },
            plugins: [alignLinePlugin],
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [activeTab, chartData]);

    const breadcrumbRoutes = [
        { path: "", breadcrumbName: "Payment" },
        { path: "", breadcrumbName: "Bad Debt" },
        { path: "", breadcrumbName: "Payment Plan Monitoring" },
    ];

    const tabItems = [
        {
            key: "Summary",
            label: "Summary",
            children: (
                <div className="flex flex-col gap-6 p-4">
                    {/* Period selection */}
                    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <span className="font-semibold text-gray-700 text-sm">Period</span>
                        <Select
                            value={selectedPeriod}
                            onChange={(val) => setSelectedPeriod(val)}
                            className="w-32"
                            size="middle"
                            loading={loadingPeriods}
                        >
                            {(periods || []).map((p) => (
                                <Option key={p} value={p}>{p}</Option>
                            ))}
                        </Select>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {(() => {
                            const kpiTemplates = [
                                { title: "ACTIVE RECEIVABLES", icon: "IconActiveReceivable", isDouble: false },
                                { title: "TOTAL PAYMENT", icon: "IconEarlyRepayment", isDouble: true },
                                { title: "TOTAL SUBMISSIONS", icon: "IconReport", isDouble: false },
                                { title: "OUTSTANDING BALANCE", icon: "IconOutstandingBalance", isDouble: true },
                                { title: "PAID ACCOUNTS", icon: "IconSubmitApprover", isDouble: false },
                                { title: "RESTRUCTURE ACTIVE", icon: "IconRestructureActive", isDouble: false }
                            ];

                            const resolvedKpis = kpiTemplates.map(tpl => {
                                const match = (kpiData || []).find(d => d.title === tpl.title);
                                return {
                                    ...tpl,
                                    value: match ? match.value : "-",
                                    idrValue: match ? match.idrValue : "-",
                                    usdValue: match ? match.usdValue : "-"
                                };
                            });

                            return resolvedKpis.map((kpi, idx) => (
                                <SubSectionCard 
                                    key={idx} 
                                    className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[145px] bg-white !p-4"
                                >
                                    <div className="flex flex-col gap-2">
                                        {renderKpiIcon(kpi.icon)}
                                        <span className="text-[11px] font-bold text-gray-600 tracking-wide uppercase mt-1">
                                            {kpi.title}
                                        </span>
                                    </div>
                                    
                                    {kpi.isDouble ? (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", width: "100%", marginTop: "8px", borderTop: "1px solid #F3F4F6", paddingTop: "8px" }}>
                                            <div style={{ textAlign: "left", paddingRight: "12px" }}>
                                                <span style={{ display: "block", fontSize: "10px", color: "#9CA3AF", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>IDR</span>
                                                <span style={{ fontSize: "18px", fontWeight: "700",  color: "#111827", lineHeight: "1.55" }}>{kpi.idrValue}</span>
                                            </div>
                                            <div style={{ width: "1px", backgroundColor: "#C8CDD4", alignSelf: "stretch" }}></div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingLeft: "12px" }}>
                                                <div style={{ display: "inline-block", textAlign: "left" }}>
                                                    <span style={{ display: "block", fontSize: "10px", color: "#9CA3AF", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>USD</span>
                                                    <span style={{ fontSize: "18px", fontWeight: "700",  color: "#111827", lineHeight: "1.55" }}>{kpi.usdValue}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ marginTop: "12px" }}>
                                            <span style={{ fontSize: "18px", fontWeight: "700",  color: "#111827", lineHeight: "1.55" }}>
                                                {kpi.value}
                                            </span>
                                        </div>
                                    )}
                                </SubSectionCard>
                            ));
                        })()}
                    </div>

                    {/* Performance Chart */}
                    <SubSectionCard className="bg-white">
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                            <div style={{ fontSize: "16px", color: "#0075bf", fontWeight: "500" }}>
                                Payment Plan Performance
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", fontSize: "10px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                <div 
                                    onClick={() => toggleDataset(0)}
                                    style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", opacity: hiddenDatasets[0] ? 0.4 : 1, textDecoration: hiddenDatasets[0] ? "line-through" : "none", transition: "opacity 0.2s" }}
                                >
                                    <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#0075BF", borderRadius: "1.5px" }}></span>
                                    <span style={{ color: "#4A5568", fontWeight: "500" }}>Account Total</span>
                                </div>
                                <div 
                                    onClick={() => toggleDataset(1)}
                                    style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", opacity: hiddenDatasets[1] ? 0.4 : 1, textDecoration: hiddenDatasets[1] ? "line-through" : "none", transition: "opacity 0.2s" }}
                                >
                                    <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#81D4FA", borderRadius: "1.5px" }}></span>
                                    <span style={{ color: "#4A5568", fontWeight: "500" }}>Plan Total</span>
                                </div>
                                <div 
                                    onClick={() => toggleDataset(2)}
                                    style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", opacity: hiddenDatasets[2] ? 0.4 : 1, textDecoration: hiddenDatasets[2] ? "line-through" : "none", transition: "opacity 0.2s" }}
                                >
                                    <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#29B6F6", borderRadius: "1.5px" }}></span>
                                    <span style={{ color: "#4A5568", fontWeight: "500" }}>Payment Total</span>
                                </div>
                                <div 
                                    onClick={() => toggleDataset(3)}
                                    style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", opacity: hiddenDatasets[3] ? 0.4 : 1, textDecoration: hiddenDatasets[3] ? "line-through" : "none", transition: "opacity 0.2s" }}
                                >
                                    <span style={{ display: "inline-block", width: "12px", height: "2.5px", backgroundColor: "#4CAF50", borderRadius: "1px" }}></span>
                                    <span style={{ color: "#4A5568", fontWeight: "500" }}>Plan Total IDR</span>
                                </div>
                                <div 
                                    onClick={() => toggleDataset(4)}
                                    style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", opacity: hiddenDatasets[4] ? 0.4 : 1, textDecoration: hiddenDatasets[4] ? "line-through" : "none", transition: "opacity 0.2s" }}
                                >
                                    <span style={{ display: "inline-block", width: "12px", height: "2.5px", backgroundColor: "#FF9800", borderRadius: "1px" }}></span>
                                    <span style={{ color: "#4A5568", fontWeight: "500" }}>Payment Total IDR</span>
                                </div>
                                <div 
                                    onClick={() => toggleDataset(5)}
                                    style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", opacity: hiddenDatasets[5] ? 0.4 : 1, textDecoration: hiddenDatasets[5] ? "line-through" : "none", transition: "opacity 0.2s" }}
                                >
                                    <span style={{ display: "inline-block", width: "12px", height: "2.5px", backgroundColor: "#F44336", borderRadius: "1px" }}></span>
                                    <span style={{ color: "#4A5568", fontWeight: "500" }}>Plan Total USD</span>
                                </div>
                                <div 
                                    onClick={() => toggleDataset(6)}
                                    style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", opacity: hiddenDatasets[6] ? 0.4 : 1, textDecoration: hiddenDatasets[6] ? "line-through" : "none", transition: "opacity 0.2s" }}
                                >
                                    <span style={{ display: "inline-block", width: "12px", height: "2.5px", backgroundColor: "#9CA3AF", borderRadius: "1px" }}></span>
                                    <span style={{ color: "#4A5568", fontWeight: "500" }}>Payment Total USD</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px]">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </SubSectionCard>

                    {/* Status Distribution - Figma Broken Segmented Bar */}
                    <SubSectionCard title="Status Distribution" className="bg-white">
                        {(() => {
                            const safeStatusData = statusDistribution || [];
                            const total = safeStatusData.reduce((s, d) => s + (d.count || 0), 0);
                            const colWidth = 8;   // px: width of each small column
                            const colGap   = 2;   // px: gap between columns
                            const barHeight = 60; // px: height of each column

                            return (
                                <>
                                    {/* Broken bars — flex:1 so they always fill 100% width */}
                                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: "2px", width: "100%" }}>
                                        {safeStatusData.map((item, idx) => {
                                            const cols = total > 0 ? Math.max(1, Math.round(((item.count || 0) / total) * 100)) : 1;
                                            return Array.from({ length: cols }, (_, i) => (
                                                <Tooltip key={`${item.label}-${i}`} title={i === 0 ? `${item.label}: ${item.count}` : undefined}>
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            minWidth: 0,
                                                            height: "60px",
                                                            backgroundColor: item.hex,
                                                            borderRadius: "3px",
                                                            cursor: "pointer",
                                                            transition: "opacity 0.15s",
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
                                                        onMouseLeave={e => e.currentTarget.style.opacity = 1}
                                                    />
                                                </Tooltip>
                                            ));
                                        })}
                                    </div>

                                    {/* Legend row */}
                                    <div style={{ display: "flex", flexWrap: "nowrap", gap: "8px", marginTop: "16px", justifyContent: "space-between", width: "100%" }}>
                                        {statusDistribution?.map((item) => (
                                            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: item.hex, flexShrink: 0 }} />
                                                <span style={{ fontSize: "11px", color: "#4A5568", fontWeight: 500, whiteSpace: "nowrap" }}>
                                                    <span style={{ fontWeight: 700, marginRight: "3px" }}>{item.count}</span>{item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                    </SubSectionCard>
                </div>
            )
        },
        {
            key: "Detail",
            label: "Detail",
            children: (
                <div className="p-4">
                    <TableRBI
                        columns={detailColumns}
                        dataSource={paginatedDetailData}
                        loading={loadingDetail}
                        tableScrolled={{ x: 'max-content' }}
                        searchPlaceholder="Search here..."
                        current={currentDetail}
                        pageSize={pageSizeDetail}
                        totalData={detailData?.page?.totalElements || 0}
                        onChange={handleDetailPageChange}
                        onSizeChanger={handleDetailPageChange}
                        onSort={handleTableChange}
                        onSearch={handleSearchDetail}
                        usePagination={true}
                        useSelect={true}
                        showSearchBar={true}
                        showAdvanceSearch={true}
                        showExport={false}
                        handleDownload={handleDownloadDetail}
                        columnDefinitions={columnDefinitionsDetail}
                        className="custom-nested-monitoring-table"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="p-5 flex flex-col gap-5">
            <BreadCrumb routes={breadcrumbRoutes} />
            <CardContainerNoBorder
                header={
                    <div className="flex justify-between items-center w-full pr-4" style={{ textTransform: "none" }}>
                        <span className="uppercase text-[#0075BF]">
                            PAYMENT PLAN MONITORING
                        </span>
                        {activeTab === "Detail" && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <ButtonComponent
                                    onClick={handleDownloadDetail}
                                    type="submit"
                                    border={false}
                                    icon={<DownloadOutlined style={{ fontSize: "16px" }} />}
                                    style={{ textTransform: "none" }}
                                >
                                    Download List
                                </ButtonComponent>
                            </div>
                        )}
                    </div>
                }
                className="!border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                noPadding
                collapsible={true}
            >
                <div className="full-width-tabs">
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                        items={tabItems}
                        className="custom-confirm-tabs"
                        tabBarStyle={{
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            marginBottom: 0,
                        }}
                    />
                </div>
            </CardContainerNoBorder>
            
            {/* Table 1: Plan Monitoring by Year Component */}
            {activeTab === "Summary" && <PaymentPlanMonitoringByYear />}

            {/* Table 2: Plan Monitoring by Month Component */}
            {activeTab === "Summary" && <PaymentPlanMonitoringByMonth selectedPeriod={selectedPeriod} />}
        </div>
    );
};

export default RestructureMonitoring;
