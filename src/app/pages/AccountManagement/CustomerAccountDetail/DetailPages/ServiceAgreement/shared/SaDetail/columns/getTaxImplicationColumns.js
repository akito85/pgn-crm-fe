import { hasValue, renderColumn } from '../../../../../../../../../utils';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../../utils/getColumnSearchProps';
import moment from 'moment';

// Custom sorter function for complex field types
const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
        switch (fieldSort) {
            case "transactionCode":
                return obj[fieldSort];
            case "startDate":
            case "endDate":
                return obj[fieldSort] ? moment(obj[fieldSort]) : "";
            case "status":
                const endDate = obj?.endDate;
                const value = endDate
                    ? moment(endDate).diff(moment()) >= 0
                        ? "Active"
                        : "Inactive"
                    : "Active";
                return value.toLowerCase();
            default:
                return obj[fieldSort]?.toLowerCase();
        }
    };

    let fa = handleDataSort(a);
    let fb = handleDataSort(b);

    const handleCompare = (a, b) => {
        switch (fieldSort) {
            case "startDate":
            case "endDate":
                if (a && b) {
                    if (a.isBefore(b)) return -1;
                    if (a.isAfter(b)) return 1;
                    return 0;
                }
                return 0;
            case "transactionCode":
                return Math.sign(parseFloat(a) - parseFloat(b));
            default:
                return a.localeCompare(b);
        }
    };

    return handleCompare(fa, fb);
};

export const getTaxImplicationColumns = ({
    search,
    searchInput,
    searchedColumn = "",
    searchText = "",
    handleSearch = () => { },
}) => {
    return [
        {
            title: "NO",
            key: "no",
            dataIndex: "no",
            align: "center",
            width: 60,
            render: (text, object, index) => index + 1,
        },
        {
            title: "CATEGORY",
            key: "category",
            dataIndex: "category",
            width: 150,
            filteredValue: search?.["category"] ? [search?.["category"]] : null,
            sorter: (a, b) => sorter("category", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "category",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
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
            title: "TAX IMPLICATION NAME",
            key: "taxImplicationName",
            dataIndex: "taxImplicationName",
            width: 200,
            filteredValue: search?.["taxImplicationName"]
                ? [search?.["taxImplicationName"]]
                : null,
            sorter: (a, b) => sorter("taxImplicationName", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "taxImplicationName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "taxImplicationName",
                    hasValue(search["taxImplicationName"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            title: "SERVICE TYPE",
            key: "serviceType",
            dataIndex: "serviceType",
            width: 150,
            filteredValue: search?.["serviceType"]
                ? [search?.["serviceType"]]
                : null,
            sorter: (a, b) => sorter("serviceType", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "serviceType",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "serviceType",
                    hasValue(search["serviceType"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            title: "IMPLICATION TYPE",
            key: "implicationType",
            dataIndex: "implicationType",
            width: 150,
            filteredValue: search?.["implicationType"]
                ? [search?.["implicationType"]]
                : null,
            sorter: (a, b) => sorter("implicationType", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "implicationType",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "implicationType",
                    hasValue(search["implicationType"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            title: "GUNGGUNG",
            key: "gunggung",
            dataIndex: "gunggung",
            width: 120,
            filteredValue: search?.["gunggung"] ? [search?.["gunggung"]] : null,
            sorter: (a, b) => sorter("gunggung", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "gunggung",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "yes_or_no"
            ),
            render: (text) =>
                renderColumn(
                    "gunggung",
                    hasValue(search["gunggung"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            title: "VAT INVOICE",
            key: "vatInvoiceIssuance",
            dataIndex: "vatInvoiceIssuance",
            width: 120,
            filteredValue: search?.["vatInvoiceIssuance"]
                ? [search?.["vatInvoiceIssuance"]]
                : null,
            sorter: (a, b) => sorter("vatInvoiceIssuance", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "vatInvoiceIssuance",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "yes_or_no"
            ),
            render: (text) =>
                renderColumn(
                    "vatInvoiceIssuance",
                    hasValue(search["vatInvoiceIssuance"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            title: "TRANSACTION CODE",
            key: "transactionCode",
            dataIndex: "transactionCode",
            align: "right",
            width: 150,
            filteredValue: search?.["transactionCode"]
                ? [search?.["transactionCode"]]
                : null,
            sorter: (a, b) => sorter("transactionCode", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "transactionCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "transactionCode",
                    hasValue(search["transactionCode"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            title: "DESCRIPTION",
            key: "description",
            dataIndex: "description",
            width: 200,
            filteredValue: search?.["description"]
                ? [search?.["description"]]
                : null,
            sorter: (a, b) => sorter("description", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "description",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "description",
                    hasValue(search["description"]),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
    ];
};
