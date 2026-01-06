import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { renderColumn } from "../../../../../utils/index";
import moment from "moment";

export const columns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { },
    search = {}
) => {
    return [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 60,
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "COST CENTER",
            dataIndex: "costCenter",
            key: "costCenter",
            sorter: true,
            width: 200,
            ...getColumnSearchPropsPaging(
                "costCenter",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("costCenter", searchedColumn, searchText, text, false, "input", search),
        },
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            key: "accountNumber",
            sorter: true,
            width: 150,
            ...getColumnSearchPropsPaging(
                "accountNumber",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("accountNumber", searchedColumn, searchText, text, false, "input", search),
        },
        {
            title: "ACCOUNT NAME",
            dataIndex: "accountName",
            key: "accountName",
            sorter: true,
            width: 250,
            ...getColumnSearchPropsPaging(
                "accountName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("accountName", searchedColumn, searchText, text, false, "input", search),
        },
        {
            title: "CUSTOMER NUMBER",
            dataIndex: "customerNumber",
            key: "customerNumber",
            sorter: true,
            width: 150,
            ...getColumnSearchPropsPaging(
                "customerNumber",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("customerNumber", searchedColumn, searchText, text, false, "input", search),
        },
        {
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            key: "customerName",
            sorter: true,
            width: 200,
            ...getColumnSearchPropsPaging(
                "customerName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("customerName", searchedColumn, searchText, text, false, "input", search),
        },
        {
            title: "REFERENCE",
            dataIndex: "reference",
            key: "reference",
            sorter: true,
            width: 150,
            ...getColumnSearchPropsPaging(
                "reference",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("reference", searchedColumn, searchText, text, false, "input", search),
        },
        {
            title: "REFERENCE CURRENCY",
            dataIndex: "referenceCurrency",
            key: "referenceCurrency",
            sorter: true,
            width: 180,
            ...getColumnSearchPropsPaging(
                "referenceCurrency",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("referenceCurrency", searchedColumn, searchText, text, false, "input", search),
        },
        {
            title: "OFFSET DATE",
            dataIndex: "offsetDate",
            key: "offsetDate",
            sorter: true,
            width: 150,
            render: (val) => val ? moment(val).format("DD MMM YYYY") : "-",
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            sorter: true,
            align: "right",
            width: 150,
            ...getColumnSearchPropsPaging(
                "amount",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (val) => {
                const formatted = val?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return renderColumn("amount", searchedColumn, searchText, formatted, false, "input", search);
            },
        },
        {
            title: "RATE",
            dataIndex: "rate",
            key: "rate",
            sorter: true,
            width: 120,
            ...getColumnSearchPropsPaging(
                "rate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("rate", searchedColumn, searchText, text, false, "input", search),
        },
        {
            title: "RATE DATE",
            dataIndex: "rateDate",
            key: "rateDate",
            sorter: true,
            width: 150,
            render: (val) => val ? moment(val).format("DD MMM YYYY") : "-",
        },
        {
            title: "AMOUNT EQUIVALENT",
            dataIndex: "equivalentAmount",
            key: "equivalentAmount",
            sorter: true,
            align: "right",
            width: 180,
            ...getColumnSearchPropsPaging(
                "equivalentAmount",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (val) => {
                const formatted = val?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return renderColumn("equivalentAmount", searchedColumn, searchText, formatted, false, "input", search);
            },
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            sorter: true,
            width: 150,
            fixed: "right",
            ...getColumnSearchPropsPaging(
                "status",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false
            ),
            render: (text) =>
                renderColumn("status", searchedColumn, searchText, text, false, "status"),
        },
        {
            title: "DESCRIPTION",
            dataIndex: "description",
            key: "description",
            sorter: true,
            width: 200,
            ...getColumnSearchPropsPaging(
                "description",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) =>
                renderColumn("description", searchedColumn, searchText, text, false, "input", search),
        },
    ];
};
