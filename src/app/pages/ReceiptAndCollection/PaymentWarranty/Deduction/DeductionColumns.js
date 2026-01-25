import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../components/StatusComponent";

export const getDeductionColumns = ({
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { },
}) => {
    const columns = [
        {
            title: "NO",
            isClassification: true,
            align: "center",
            key: "no",
            width: 60,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "DEDUCTION NO",
            dataIndex: "deductionNo",
            key: "deductionNo",
            width: 150,
            sorter: (a, b) => a?.deductionNo?.localeCompare(b?.deductionNo),
            ...getColumnSearchPropsPaging(
                "deductionNo",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["deductionNo"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "DEDUCTION DATE",
            dataIndex: "deductionDate",
            key: "deductionDate",
            width: 150,
            sorter: (a, b) => new Date(a?.deductionDate) - new Date(b?.deductionDate),
            ...getColumnSearchPropsPaging(
                "deductionDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["deductionDate"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "DEDUCTION PERIOD",
            dataIndex: "deductionPeriod",
            key: "deductionPeriod",
            width: 150,
            sorter: (a, b) => a?.deductionPeriod?.localeCompare(b?.deductionPeriod),
            ...getColumnSearchPropsPaging(
                "deductionPeriod",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["deductionPeriod"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "TOTAL DEDUCTION",
            dataIndex: "totalDeduction",
            key: "totalDeduction",
            width: 150,
            align: "center",
            sorter: (a, b) => a?.totalDeduction - b?.totalDeduction,
            ...getColumnSearchPropsPaging(
                "totalDeduction",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["totalDeduction"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "TOTAL ACCOUNT",
            dataIndex: "totalAccount",
            key: "totalAccount",
            width: 150,
            align: "center",
            sorter: (a, b) => a?.totalAccount - b?.totalAccount,
            ...getColumnSearchPropsPaging(
                "totalAccount",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["totalAccount"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 150,
            align: "right",
            sorter: (a, b) => a?.totalAmount - b?.totalAmount,
            ...getColumnSearchPropsPaging(
                "totalAmount",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["totalAmount"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
        },
        {
            title: "TOTAL SUCCESS",
            dataIndex: "totalSuccess",
            key: "totalSuccess",
            width: 150,
            align: "center",
            sorter: (a, b) => a?.totalSuccess - b?.totalSuccess,
            ...getColumnSearchPropsPaging(
                "totalSuccess",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["totalSuccess"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "TOTAL FAILED",
            dataIndex: "totalFailed",
            key: "totalFailed",
            width: 150,
            align: "center",
            sorter: (a, b) => a?.totalFailed - b?.totalFailed,
            ...getColumnSearchPropsPaging(
                "totalFailed",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["totalFailed"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "TOTAL CANCEL",
            dataIndex: "totalCancel",
            key: "totalCancel",
            width: 150,
            align: "center",
            sorter: (a, b) => a?.totalCancel - b?.totalCancel,
            ...getColumnSearchPropsPaging(
                "totalCancel",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["totalCancel"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
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
            title: "APPROVAL STATUS",
            dataIndex: "approvalStatus",
            key: "approvalStatus",
            width: 150,
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
            }
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            width: 100,
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
            }
        },

    ];

    return columns;
};
