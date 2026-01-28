import React from "react";
import { Tooltip, Dropdown, Menu } from "antd";
import { MoreOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";

export const getLateChargeColumns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
) => [
        {
            title: "NO",
            key: "no",
            width: 60,
            align: "center",
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "AREA CODE",
            dataIndex: "areaCode",
            key: "areaCode",
            width: 120,
            sorter: (a, b) => a?.areaCode?.localeCompare(b?.areaCode),
            ...getColumnSearchPropsPaging(
                "areaCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "AREA NAME",
            dataIndex: "areaName",
            key: "areaName",
            width: 150,
            sorter: (a, b) => a?.areaName?.localeCompare(b?.areaName),
            ...getColumnSearchPropsPaging(
                "areaName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "CUSTOMER ID",
            dataIndex: "customerId",
            key: "customerId",
            width: 150,
            sorter: (a, b) => a?.customerId?.localeCompare(b?.customerId),
            ...getColumnSearchPropsPaging(
                "customerId",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            key: "customerName",
            width: 250,
            sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
            ...getColumnSearchPropsPaging(
                "customerName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "CUSTOMER SEGMENT",
            dataIndex: "customerSegment",
            key: "customerSegment",
            width: 180,
            align: "center",
            sorter: (a, b) => a?.customerSegment?.localeCompare(b?.customerSegment),
            ...getColumnSearchPropsPaging(
                "customerSegment",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "CUSTOMER GROUP",
            dataIndex: "customerGroup",
            key: "customerGroup",
            width: 180,
            align: "center",
            sorter: (a, b) => a?.customerGroup?.localeCompare(b?.customerGroup),
            ...getColumnSearchPropsPaging(
                "customerGroup",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "METER READING ROUTE",
            dataIndex: "meterReadingRoute",
            key: "meterReadingRoute",
            width: 180,
            sorter: (a, b) => a?.meterReadingRoute?.localeCompare(b?.meterReadingRoute),
            ...getColumnSearchPropsPaging(
                "meterReadingRoute",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "CURRENCY",
            dataIndex: "currency",
            key: "currency",
            width: 120,
            align: "center",
            sorter: (a, b) => a?.currency?.localeCompare(b?.currency),
            ...getColumnSearchPropsPaging(
                "currency",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "TOTAL BILL",
            dataIndex: "totalBill",
            key: "totalBill",
            width: 150,
            align: "right",
            sorter: (a, b) => a?.totalBill - b?.totalBill,
            ...getColumnSearchPropsPaging(
                "totalBill",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "TOTAL PERIODE BILL",
            dataIndex: "totalPeriodBill",
            key: "totalPeriodBill",
            width: 180,
            align: "right",
            sorter: (a, b) => a?.totalPeriodBill - b?.totalPeriodBill,
            ...getColumnSearchPropsPaging(
                "totalPeriodBill",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "GAP PAYMENT WARRANTY",
            dataIndex: "gapPaymentWarranty",
            key: "gapPaymentWarranty",
            width: 200,
            align: "right",
            sorter: (a, b) => a?.gapPaymentWarranty - b?.gapPaymentWarranty,
            ...getColumnSearchPropsPaging(
                "gapPaymentWarranty",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "EXPIRED DATE",
            dataIndex: "expiredDate",
            key: "expiredDate",
            width: 150,
            align: "center",
            sorter: (a, b) => a?.expiredDate?.localeCompare(b?.expiredDate),
            ...getColumnSearchPropsPaging(
                "expiredDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
    ];
