const CustomerWarrantyColumn = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { },
) => {
    return [
        {
            title: "NO",
            align: "center",
            width: 60,
            render: (text, object, index) => index + 1,
        },
    ]
};


export default CustomerWarrantyColumn