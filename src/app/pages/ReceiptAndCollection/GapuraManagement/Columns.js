import React from "react";
import { Menu, Dropdown } from "antd";
import {
    MoreOutlined,
} from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon";

export const columns = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
    search,
    onDetail,
    onStatusChange,
    onOpen,
    onClose
) => {
    return [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 70,
            align: "center",
            render: (text, record, index) => {
                return (page - 1) * pageSize + index + 1;
            },
        },
        {
            title: "PAYMENT GATEWAY",
            dataIndex: "paymentGateway",
            key: "paymentGateway",
            sorter: true,
            filterType: "text",
        },
        {
            title: "TOTAL BANK",
            dataIndex: "totalBank",
            key: "totalBank",
            sorter: true,
            filterType: "text",
            align: "center",
        },
    ];
};

export const historyJobColumns = (page, pageSize) => {
    return [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 70,
            align: "center",
            render: (text, record, index) => {
                return (page - 1) * pageSize + index + 1;
            },
        },
        {
            title: "JOB PUBLISH BILL",
            dataIndex: "jobPublishBill",
            key: "jobPublishBill",
            sorter: true,
            filterType: "text",
        },
        {
            title: "JOB CODE",
            dataIndex: "jobCode",
            key: "jobCode",
            sorter: true,
            filterType: "text",
        },
        {
            title: "CUSTOMER",
            dataIndex: "customer",
            key: "customer",
            sorter: true,
            filterType: "text",
        },
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            key: "accountNumber",
            sorter: true,
            filterType: "text",
        },
        {
            title: "VALUE",
            dataIndex: "value",
            key: "value",
            sorter: true,
            filterType: "text",
            align: "right",
            render: (value) => value?.toLocaleString(),
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
            sorter: true,
            filterType: "text",
        },
        {
            title: "CREATED AT",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            filterType: "text",
        },
        {
            title: "CREATED BY",
            dataIndex: "createdBy",
            key: "createdBy",
            sorter: true,
            filterType: "text",
        },
    ];
};
