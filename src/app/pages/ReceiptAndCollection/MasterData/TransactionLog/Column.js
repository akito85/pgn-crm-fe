import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";

export const columns = (
    search,
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { },
    dataUser = {}
) => {
    return [
        {
            key: "no",
            title: "NO",
            dataIndex: "no",
            width: 60,
            align: "center",
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            key: "id",
            title: "ID",
            sorter: true,
            align: "left",
            dataIndex: "id",
            width: 100,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "id",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "id",
                    hasValue(search["id"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            key: "createdDate",
            title: "CREATED DATE",
            sorter: true,
            dataIndex: "createdDate",
            width: 180,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "createdDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "createdDate",
                    hasValue(search["createdDate"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            key: "createdBy",
            title: "CREATED BY",
            sorter: true,
            dataIndex: "createdBy",
            width: 120,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "createdBy",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "createdBy",
                    hasValue(search["createdBy"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            key: "category",
            title: "CATEGORY",
            sorter: true,
            dataIndex: "category",
            width: 180,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "category",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "category",
                    hasValue(search["category"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            key: "message",
            title: "MESSAGE",
            sorter: true,
            dataIndex: "message",
            width: 400,
            ellipsis: {
                showTitle: false,
            },
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "message",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "message",
                    hasValue(search["message"]),
                    searchText,
                    text,
                    true,
                    "input",
                    search
                ),
        },
        {
            key: "sessionId",
            title: "SESSION ID",
            sorter: true,
            dataIndex: "sessionId",
            width: 300,
            ellipsis: {
                showTitle: false,
            },
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "sessionId",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "sessionId",
                    hasValue(search["sessionId"]),
                    searchText,
                    text,
                    true,
                    "input",
                    search
                ),
        },
        {
            key: "type",
            title: "TYPE",
            sorter: true,
            dataIndex: "type",
            width: 120,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "type",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "type",
                    hasValue(search["type"]),
                    searchText,
                    text ?? "-",
                    false,
                    "input",
                    search
                ),
        },
    ];
};
