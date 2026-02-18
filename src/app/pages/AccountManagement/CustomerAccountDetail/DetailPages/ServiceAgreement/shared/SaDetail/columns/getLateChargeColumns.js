export const getLateChargeColumns = ({
    page = 1,
    pageSize = 10,
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
        },
        {
            sorter: true,
            title: "CURRENCY",
            key: "currency",
            dataIndex: "currency",
            width: 120,
        },
        {
            sorter: true,
            title: "LATE CHARGE MAXIMUM AMOUNT",
            key: "maxAmount",
            dataIndex: "maxAmount",
            align: "right",
            width: 250,
        },
        {
            sorter: true,
            title: "LATE CHARGE RULE FORMULA",
            key: "formula",
            dataIndex: "formula",
            width: 300,
        },
        {
            sorter: true,
            title: "DESCRIPTION",
            key: "description",
            dataIndex: "description",
            width: 200,
        },
    ];
};
