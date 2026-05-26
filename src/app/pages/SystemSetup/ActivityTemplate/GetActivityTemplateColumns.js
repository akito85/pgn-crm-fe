import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import { toTitleCase } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

const getActivityTemplateColumns = ({
    search,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
}) => [
    {
        key: "no",
        title: "NO",
        align: "center",
        dataIndex: "no",
        width: 50,
        fixed: "left",
        render: (_, __, index) => index + 1,
    },
    {
        key: "name",
        title: "TEMPLATE NAME",
        dataIndex: "name",
        width: 300,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
            search, "name", searchInput, searchedColumn, searchText, handleSearch,
        ),
    },
    {
        key: "workOrderCategoryName",
        title: "WORK ORDER CATEGORY",
        dataIndex: "workOrderCategoryName",
        width: 200,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
            search, "workOrderCategoryName", searchInput, searchedColumn, searchText, handleSearch,
        ),
    },
    {
        key: "workOrderTypeName",
        title: "WORK ORDER TYPE",
        dataIndex: "workOrderTypeName",
        width: 200,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
            search, "workOrderTypeName", searchInput, searchedColumn, searchText, handleSearch,
        ),
    },
    {
        key: "srSubCategoryName",
        title: "SR SUB-CATEGORY",
        dataIndex: "srSubCategoryName",
        width: 200,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
            search, "srSubCategoryName", searchInput, searchedColumn, searchText, handleSearch,
        ),
    },
    {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 120,
        fixed: "right",
        render: (status) => {
            const displayText = {
                "active": "Active",
                "inactive": "Inactive",
            };
            return (
                <div className="flex justify-center">
                    <NxStatusComponent colour={status}>
                        {displayText[status] || toTitleCase(String(status || "")) || "-"}
                    </NxStatusComponent>
                </div>
            );
        }
    }
].filter(Boolean);

export { getActivityTemplateColumns };
