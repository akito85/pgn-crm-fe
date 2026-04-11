import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";

export const columns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
) => [
        {
            key: "no",
            title: "NO",
            width: 50,
            align: "left",
            isClassification: true,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },

        {
            key: "costCenter",
            title: "COST CENTER",
            dataIndex: "areaCode",
            width: 200,
            sorter: (a, b) => a?.areaCode?.localeCompare(b?.areaCode),
            ...getColumnSearchPropsPaging(
                "areaCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["areaCode"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (text, record) => `${record.areaCode || ""} - ${record.areaName || ""}`,
        },

        {
            key: "accountNumber",
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            width: 130,
            align: "center",
            sorter: (a, b) => a?.accountNumber?.localeCompare(b?.accountNumber),
            ...getColumnSearchPropsPaging(
                "accountNumber",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["accountNumber"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "accountName",
            title: "ACCOUNT NAME",
            dataIndex: "accountName",
            width: 220,
            sorter: (a, b) => a?.accountName?.localeCompare(b?.accountName),
            ...getColumnSearchPropsPaging(
                "accountName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["accountName"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "customerId",
            title: "CUSTOMER NUMBER",
            dataIndex: "customerId",
            width: 130,
            align: "center",
            sorter: (a, b) => a?.customerId?.localeCompare(b?.customerId),
            ...getColumnSearchPropsPaging(
                "customerId",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["customerId"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "customerName",
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            width: 200,
            sorter: (a, b) => a?.customerName?.localeCompare(b?.customerName),
        },

        {
            key: "customerSegment",
            title: "SEGMENT",
            dataIndex: "customerSegment",
            width: 100,
            align: "center",
            sorter: (a, b) => a?.customerSegment?.localeCompare(b?.customerSegment),
        },

        {
            key: "paymentWarrantyCode",
            title: "PAYMENT GUARANTEE CODE",
            dataIndex: "paymentWarrantyCode",
            width: 180,
            align: "center",
            sorter: (a, b) => a?.paymentWarrantyCode?.localeCompare(b?.paymentWarrantyCode),
        },

        {
            key: "totalAmount",
            title: "TOTAL AMOUNT",
            dataIndex: "equivalent",
            width: 130,
            sorter: (a, b) => a?.equivalent - b?.equivalent,
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
            align: "center",
        },

        {
            key: "totalCustomer",
            title: "TOTAL CUSTOMER",
            dataIndex: "totalCustomer",
            width: 120,
            align: "center",
        },
    ];


