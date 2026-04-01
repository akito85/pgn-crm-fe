import { hasValue, renderColumn } from '../../../../../../../../../utils';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../../utils/getColumnSearchProps';

export const getLateChargeColumns = ({
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
            sorter: true,
            title: "LATE CHARGE NAME",
            key: "lateChargeName",
            dataIndex: "lateChargeName",
            width: 200,
            filteredValue: search?.lateChargeName ? [search.lateChargeName] : null,
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "lateChargeName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "lateChargeName",
                    hasValue(search?.lateChargeName),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            sorter: true,
            title: "CURRENCY",
            key: "currency",
            dataIndex: "currency",
            width: 120,
            filteredValue: search?.currency ? [search.currency] : null,
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "currency",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "currency",
                    hasValue(search?.currency),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            sorter: true,
            title: "LATE CHARGE MAXIMUM AMOUNT",
            key: "maxAmount",
            dataIndex: "maxAmount",
            align: "right",
            width: 250,
            filteredValue: search?.maxAmount ? [search.maxAmount] : null,
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "maxAmount",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "maxAmount",
                    hasValue(search?.maxAmount),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            sorter: true,
            title: "LATE CHARGE RULE FORMULA",
            key: "formula",
            dataIndex: "formula",
            width: 300,
            filteredValue: search?.formula ? [search.formula] : null,
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                "formula",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                "input"
            ),
            render: (text) =>
                renderColumn(
                    "formula",
                    hasValue(search?.formula),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
        {
            sorter: true,
            title: "DESCRIPTION",
            key: "description",
            dataIndex: "description",
            width: 200,
            filteredValue: search?.description ? [search.description] : null,
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
                    hasValue(search?.description),
                    searchText,
                    text,
                    false,
                    "input",
                    search
                ),
        },
    ];
};
