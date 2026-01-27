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
            width: 60,
            isClassification: true,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },

        {
            key: "paymentWarrantyCode",
            title: "PAYMENT WARRANTY CODE",
            dataIndex: "paymentWarrantyCode",
            width: 180,
            sorter: (a, b) => a?.paymentWarrantyCode?.localeCompare(b?.paymentWarrantyCode),
            ...getColumnSearchPropsPaging(
                "paymentWarrantyCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["paymentWarrantyCode"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "areaCode",
            title: "AREA CODE",
            dataIndex: "areaCode",
            width: 100,
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
        },

        {
            key: "areaName",
            title: "AREA NAME",
            dataIndex: "areaName",
            width: 150,
            sorter: (a, b) => a?.areaName?.localeCompare(b?.areaName),
            ...getColumnSearchPropsPaging(
                "areaName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["areaName"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "customerId",
            title: "CUSTOMER ID",
            dataIndex: "customerId",
            width: 150,
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
            ...getColumnSearchPropsPaging(
                "customerName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["customerName"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "customerSegment",
            title: "CUSTOMER SEGMENT",
            dataIndex: "customerSegment",
            width: 150,
            sorter: (a, b) => a?.customerSegment?.localeCompare(b?.customerSegment),
            ...getColumnSearchPropsPaging(
                "customerSegment",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["customerSegment"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "customerGroup",
            title: "CUSTOMER GROUP",
            dataIndex: "customerGroup",
            width: 150,
            sorter: (a, b) => a?.customerGroup?.localeCompare(b?.customerGroup),
            ...getColumnSearchPropsPaging(
                "customerGroup",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["customerGroup"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "type",
            title: "TYPE",
            dataIndex: "type",
            width: 100,
            sorter: (a, b) => a?.type?.localeCompare(b?.type),
            ...getColumnSearchPropsPaging(
                "type",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["type"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            key: "payment",
            title: "PAYMENT",
            dataIndex: "payment",
            width: 100,
            sorter: (a, b) => a?.payment?.localeCompare(b?.payment),
            ...getColumnSearchPropsPaging(
                "payment",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["payment"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            key: "currency",
            title: "CURRENCY",
            dataIndex: "currency",
            width: 100,
            sorter: (a, b) => a?.currency?.localeCompare(b?.currency),
            ...getColumnSearchPropsPaging(
                "currency",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["currency"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },

        {
            key: "currentBalance",
            title: "CURRENT BALANCE",
            dataIndex: "currentBalance",
            width: 150,
            sorter: (a, b) => a?.currentBalance - b?.currentBalance,
            ...getColumnSearchPropsPaging(
                "currentBalance",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["currentBalance"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
            align: "right",
        },

        {
            key: "rate",
            title: "RATE",
            dataIndex: "rate",
            width: 100,
            sorter: (a, b) => a?.rate - b?.rate,
            ...getColumnSearchPropsPaging(
                "rate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["rate"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
            align: "right",
        },

        {
            key: "baseRate",
            title: "BASE RATE",
            dataIndex: "baseRate",
            width: 100,
            sorter: (a, b) => a?.baseRate - b?.baseRate,
            ...getColumnSearchPropsPaging(
                "baseRate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["baseRate"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
            align: "right",
        },

        {
            key: "equivalent",
            title: "EQUIVALENT",
            dataIndex: "equivalent",
            width: 150,
            sorter: (a, b) => a?.equivalent - b?.equivalent,
            ...getColumnSearchPropsPaging(
                "equivalent",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["equivalent"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
            align: "right",
        },
        {
            key: "documentNumber",
            title: "DOCUMENT NUMBER",
            dataIndex: "documentNumber",
            width: 150,
            sorter: (a, b) => a?.documentNumber?.localeCompare(b?.documentNumber),
            ...getColumnSearchPropsPaging(
                "documentNumber",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["documentNumber"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            key: "documentDate",
            title: "DOCUMENT DATE",
            dataIndex: "documentDate",
            width: 120,
            sorter: (a, b) => a?.documentDate?.localeCompare(b?.documentDate),
            ...getColumnSearchPropsPaging(
                "documentDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["documentDate"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (text) =>
                searchedColumn === "documentDate" ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                        searchWords={[
                            searchText
                                ? moment(searchText, "YYYY-MMM-DD").format(
                                    dateFormatting.dateCapital
                                )
                                : "",
                        ]}
                        autoEscape
                        textToHighlight={
                            text ? moment(text).format(dateFormatting.dateCapital) : ""
                        }
                    />
                ) : text === null ? (
                    ""
                ) : (
                    moment(text).format(dateFormatting.dateCapital)
                ),
        },

        {
            key: "effectiveDate",
            title: "EFFECTIVE DATE",
            dataIndex: "effectiveDate",
            width: 120,
            render: (text) => text ? moment(text).format(dateFormatting.dateCapital) : "",
        },
        {
            key: "systemDate",
            title: "SYSTEM DATE",
            dataIndex: "systemDate",
            width: 120,
            render: (text) => text ? moment(text).format(dateFormatting.dateCapital) : "",
        },
        {
            key: "dueDateClaim",
            title: "DUE DATE CLAIM",
            dataIndex: "dueDateClaim",
            width: 120,
            render: (text) => text ? moment(text).format(dateFormatting.dateCapital) : "",
        },

        {
            key: "approvalStatus",
            title: "APPROVAL STATUS",
            dataIndex: "approvalStatus",
            width: 120,
            sorter: (a, b) => a?.approvalStatus?.localeCompare(b?.approvalStatus),
            ...getColumnSearchPropsPaging(
                "approvalStatus",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["approvalStatus"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (status) => {
                const displayStatus = status || "DRAFT";
                const statusLabel = displayStatus.replace(/_/g, " ");

                return (
                    <div className="flex justify-center">
                        <StatusComponent colour={displayStatus.toLowerCase()}>
                            {statusLabel}
                        </StatusComponent>
                    </div>
                );
            },
        },
        {
            key: "status",
            title: "STATUS",
            dataIndex: "status",
            width: 120,
            sorter: (a, b) => a?.status?.localeCompare(b?.status),
            ...getColumnSearchPropsPaging(
                "status",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["status"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (status) => {
                const displayStatus = status || "DRAFT";
                const statusLabel = displayStatus.replace(/_/g, " ");

                return (
                    <div className="flex justify-center">
                        <StatusComponent colour={displayStatus.toLowerCase()}>
                            {statusLabel}
                        </StatusComponent>
                    </div>
                );
            },
        },
        {
            key: "description",
            title: "DESCRIPTION",
            dataIndex: "description",
            width: 200,
        },
    ];
