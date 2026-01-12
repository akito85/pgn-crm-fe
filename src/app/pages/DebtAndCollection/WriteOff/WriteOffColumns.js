import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";

export const getWriteOffColumns = ({
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
            key: "no",
            width: 60,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "WRITE OFF NO",
            dataIndex: "writeOffNo",
            key: "writeOffNo",
            width: 150,
            sorter: (a, b) => a?.writeOffNo?.localeCompare(b?.writeOffNo),
            ...getColumnSearchPropsPaging(
                "writeOffNo",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["writeOffNo"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "WRITE OFF DATE",
            dataIndex: "writeOffDate",
            key: "writeOffDate",
            width: 150,
            sorter: (a, b) => new Date(a?.writeOffDate) - new Date(b?.writeOffDate),
            ...getColumnSearchPropsPaging(
                "writeOffDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["writeOffDate"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "WRITE OFF PERIOD",
            dataIndex: "writeOffPeriod",
            key: "writeOffPeriod",
            width: 150,
            sorter: (a, b) => a?.writeOffPeriod?.localeCompare(b?.writeOffPeriod),
            ...getColumnSearchPropsPaging(
                "writeOffPeriod",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["writeOffPeriod"]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        },
        {
            title: "TOTAL WRITE OFF",
            dataIndex: "totalWriteOff",
            key: "totalWriteOff",
            width: 150,
            align: "center",
            sorter: (a, b) => a?.totalWriteOff - b?.totalWriteOff,
            ...getColumnSearchPropsPaging(
                "totalWriteOff",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            onFilter: (value, record) =>
                record["totalWriteOff"]
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
