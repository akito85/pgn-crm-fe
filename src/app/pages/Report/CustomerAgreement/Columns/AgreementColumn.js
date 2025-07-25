import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

const AgreementColumn = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    search,
    handleSearch = () => { },
) => [
        {
            title: "NO",
            dataIndex: "",
            align: "center",
            width: 60,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "ACCOUNT ID",
            dataIndex: "accountId",
            align: "",
            sorter: true,
            width: 150,
            ...getColumnSearchPropsPaging(
                'accountId',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("accountId", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "SOR",
            dataIndex: "sor",
            align: "",
            sorter: true,
            width: 350,
            ...getColumnSearchPropsPaging(
                'sor',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("sor", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "AREA",
            dataIndex: "area",
            align: "center",
            sorter: true,
            width: 250,
            ...getColumnSearchPropsPaging(
                'area',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("area", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "noRef",
            align: "left",
            sorter: true,
            width: 320,
            ...getColumnSearchPropsPaging(
                'noRef',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("noRef", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "ACCOUNT NAME",
            dataIndex: "accountName",
            align: "left",
            sorter: true,
            width: 300,
            ...getColumnSearchPropsPaging(
                'accountName',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("accountName", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "SA NUMBER",
            dataIndex: "saNumber",
            sorter: true,
            width: 250,
            ...getColumnSearchPropsPaging(
                'saNumber',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("saNumber", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "SA NAME",
            dataIndex: "saName",
            align: "left",
            sorter: true,
            width: 220,
            ...getColumnSearchPropsPaging(
                'saName',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("saName", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "SA REFERENCE NUMBER",
            dataIndex: "saReferenceNum",
            sorter: true,
            width: 250,
            ...getColumnSearchPropsPaging(
                search,
                "saReferenceNum",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) => renderColumn('saReferenceNum', hasValue(search['saReferenceNum']), searchText, text, false, 'input', search)
        },
        {
            title: "SA TYPE",
            dataIndex: "saType",
            align: "center",
            sorter: true,
            width: 160,
            ...getColumnSearchPropsPaging(
                'saType',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("saType", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "PJBG TYPE",
            dataIndex: "pjbgType",
            align: "center",
            sorter: true,
            width: 160,
            ...getColumnSearchPropsPaging(
                'pjbgType',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("pjbgType", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "SA DATE",
            dataIndex: "saDate",
            align: "center",
            sorter: true,
            width: 160,
            ...getColumnSearchPropsPaging(
                'saDate',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'date'
            ),
            render: (text) => renderDateColumn("saDate", searchedColumn, searchText, text, 'date', search)
        },
        {
            title: "START DATE",
            dataIndex: "startDate",
            align: "center",
            sorter: true,
            width: 160,
            ...getColumnSearchPropsPaging(
                'startDate',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'date'
            ),
            render: (text) => renderDateColumn("startDate", searchedColumn, searchText, text, 'date', search)
        },
        {
            title: "END DATE",
            dataIndex: "endDate",
            align: "center",
            sorter: true,
            width: 160,
            ...getColumnSearchPropsPaging(
                'endDate',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'date'
            ),
            render: (text) => renderDateColumn("endDate", searchedColumn, searchText, text, 'date', search)
        },
        // {
        //     title: "ACTIVE FLAG",
        //     dataIndex: "activeFlag",
        //     align: "center",
        //     sorter: true,
        //     width: 180,
        //     ...getColumnSearchPropsPaging(
        //         'activeFlag',
        //         searchInput,
        //         searchedColumn,
        //         searchText,
        //         handleSearch,
        //         true
        //     ),
        //     render: (text) => renderColumn("activeFlag", searchedColumn, searchText, text, false, 'input', search)
        // },
        // {
        //     title: "UNIT UKUR",
        //     dataIndex: "unitUkur",
        //     align: "",
        //     sorter: true,
        //     width: 180,
        //     ...getColumnSearchPropsPaging(
        //         'unitUkur',
        //         searchInput,
        //         searchedColumn,
        //         searchText,
        //         handleSearch,
        //         true
        //     ),
        //     render: (text) => renderColumn("unitUkur", searchedColumn, searchText, text, false, 'input', search)
        // },
        {
            title: "TEKANAN",
            dataIndex: "tekanan",
            align: "",
            sorter: true,
            width: 190,
            ...getColumnSearchPropsPaging(
                'tekanan',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("tekanan", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "TEKANAN KONTRAK",
            dataIndex: "tekananKontrak",
            align: "",
            sorter: true,
            width: 220,
            ...getColumnSearchPropsPaging(
                'tekananKontrak',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("tekananKontrak", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "TYPE",
            dataIndex: "type",
            align: "center",
            sorter: true,
            width: 150,
            ...getColumnSearchPropsPaging(
                'type',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("type", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "UOM",
            dataIndex: "uom",
            align: "center",
            sorter: true,
            width: 150,
            ...getColumnSearchPropsPaging(
                'uom',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("uom", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "MIN USAGE",
            dataIndex: "minUsage",
            align: "",
            sorter: true,
            width: 190,
            ...getColumnSearchPropsPaging(
                'minUsage',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("minUsage", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "MAX USAGE",
            dataIndex: "masUsage",
            align: "",
            sorter: true,
            width: 190,
            ...getColumnSearchPropsPaging(
                'masUsage',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("masUsage", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "PRODUCT NAME",
            sorter: true,
            dataIndex: "productName",
            width: 380,
            ...getColumnSearchPropsPaging(
                'productName',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'input',
                search
            ),
            render: (text) => renderColumn("productName", searchedColumn, searchText, text, true, 'input', search)
        },
        {
            title: "PRICE CODE",
            sorter: true,
            dataIndex: "priceCode",
            width: 200,
            ...getColumnSearchPropsPaging(
                'priceCode',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("priceCode", searchedColumn, searchText, text, false, 'input', search)
        },
       {
			title: "BILLING CYCLE",
			dataIndex: "billingCycle",
            align:"",
            sorter: true,
            width: 250,
            ...getColumnSearchPropsPaging(
                'billingCycle',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn("billingCycle", searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "STATUS",
            dataIndex: "status",
            fixed:"right",
            sorter: true,
            width: 160,
            ...getColumnSearchPropsPaging(
                'status',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "status"
            ),
            render: (text) => renderColumn("status", searchedColumn, searchText, text, false, 'status', search)
        },
    ];

export default AgreementColumn;