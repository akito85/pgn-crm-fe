import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

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
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            key: "restructureCode",
            title: "RESTRUCTURE CODE",
            dataIndex: "restructureCode",
            width: 180,
            sorter: (a, b) => a?.restructureCode?.localeCompare(b?.restructureCode),
            ...getColumnSearchPropsPaging(
                "restructureCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            key: "costCenter",
            title: "COST CENTER",
            dataIndex: "costCenter",
            width: 200,
            sorter: (a, b) => a?.costCenter?.localeCompare(b?.costCenter),
            ...getColumnSearchPropsPaging(
                "costCenter",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            key: "customerNumber",
            title: "CUSTOMER NUMBER",
            dataIndex: "customerNumber",
            width: 150,
            sorter: (a, b) => a?.customerNumber?.localeCompare(b?.customerNumber),
            ...getColumnSearchPropsPaging(
                "customerNumber",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            key: "customerName",
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
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
            key: "customerSegment",
            title: "CUSTOMER SEGMENT",
            dataIndex: "customerSegment",
            width: 150,
            sorter: (a, b) => a?.customerSegment?.localeCompare(b?.customerSegment),
        },
        {
            key: "customerGroup",
            title: "CUSTOMER GROUP",
            dataIndex: "customerGroup",
            width: 150,
            sorter: (a, b) => a?.customerGroup?.localeCompare(b?.customerGroup),
        },
        {
            key: "startPeriod",
            title: "START PERIOD",
            dataIndex: "startPeriod",
            width: 120,
        },
        {
            key: "endPeriod",
            title: "END PERIOD",
            dataIndex: "endPeriod",
            width: 120,
        },
        {
            key: "meterReadingCode",
            title: "METER READING CODE",
            dataIndex: "meterReadingCode",
            width: 150,
        },
        {
            key: "currency",
            title: "CURRENCY",
            dataIndex: "currency",
            width: 100,
        },
        {
            key: "totalTagihan",
            title: "TOTAL TAGIHAN",
            dataIndex: "totalTagihan",
            width: 150,
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
            align: "right",
        },
        {
            key: "totalPeriod",
            title: "TOTAL PERIOD",
            dataIndex: "totalPeriod",
            width: 150,
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
            align: "right",
        },
    ];
