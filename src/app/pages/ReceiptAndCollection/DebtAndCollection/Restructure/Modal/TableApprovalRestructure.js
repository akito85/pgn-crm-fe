import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { renderColumn } from "../../../../../../utils";

export const tableApprovalRestructure = (
    search,
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
) => [
    {
        key: "no",
        title: "NO",
        width: 60,
        align: "left",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
        key: "customerNumber",
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
        width: 180,
        align: "right",
        ...getColumnSearchPropsUseFilteredValue(search, "customerNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
        key: "customerName",
        title: "CUSTOMER NAME",
        dataIndex: "customerName",
        width: 250,
        ...getColumnSearchPropsUseFilteredValue(search, "customerName", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 180,
        align: "right",
        ...getColumnSearchPropsUseFilteredValue(search, "accountNumber", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
        key: "accountName",
        title: "ACCOUNT NAME",
        dataIndex: "accountName",
        width: 250,
        ...getColumnSearchPropsUseFilteredValue(search, "accountName", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
        key: "costCenter",
        title: "COST CENTER",
        dataIndex: "costCenter",
        width: 200,
        align: "center",
        ...getColumnSearchPropsUseFilteredValue(search, "costCenter", searchInput, searchedColumn, searchText, handleSearch),
    },
    {
        key: "statusApproval",
        title: "STATUS APPROVAL",
        dataIndex: "statusApproval",
        width: 180,
        align: "center",
        fixed: "right",
        render: (text) => renderColumn('statusApproval', searchedColumn, searchText, text, false, 'status', search)
    },
];
