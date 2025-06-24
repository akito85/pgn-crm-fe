import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils"
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps"
import { sorterFunction } from "../../../../../utils/sorterFunction"

export const columnChangeAuthHistory = (
    search,
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
) => {
    return [
        {
            title: "NO",
            align: "center",
            width: 60,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,

        },
        {
            title: "FROM",
            dataIndex: "from",
            // width: 350,
            sorter: (a, b) => sorterFunction('from', a, b),
            ...getColumnSearchProps(
                'from',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (v) => renderColumn('from', searchedColumn, searchText, v, false, 'input', search)
        },
        {
            title: "TO",
            dataIndex: "to",
            // width: 350,
            sorter: (a, b) => sorterFunction('to', a, b),
            ...getColumnSearchProps(
                'to',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (v) => renderColumn('to', searchedColumn, searchText, v, false, 'input', search)
        },
        {
            title: "GENERATE DATE",
            dataIndex: "createdDate",
            width: 170,
            align: "center",
            sorter: (a, b) => sorterFunction('createdDate', a, b, 'date'),
            ...getColumnSearchProps(
                'createdDate',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
                'date'
            ),
            render: (v) => renderDateColumn('createdDate', hasValue(search['createdDate']), searchText, v, 'date', search),
        },
        {
            title: "GENERATE BY",
            dataIndex: "createdBy",
            // width: 350,
            sorter: (a, b) => sorterFunction('createdBy', a, b),
            ...getColumnSearchProps(
                'createdBy',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (v) => renderColumn('createdBy', searchedColumn, searchText, v, false, 'input', search)

        },
        {
            title: "REMARK",
            dataIndex: "remark",
            // width: 350,
            align: "left",
            ellipsis: {
                showTitle: false,
            },
            sorter: (a, b) => sorterFunction('remark', a, b),
            ...getColumnSearchProps(
                'remark',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (v) => renderColumn('remark', searchedColumn, searchText, v, true, 'input', search)
        },
    ]
}