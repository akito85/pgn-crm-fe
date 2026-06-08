import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import { toTitleCase } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

const getPreRequisiteTemplateColumns = ({
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
            search,
            "name",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
        ),
    },
    {
        key: "sourceTypeName",
        title: "SOURCE TYPE",
        dataIndex: "sourceTypeName",
        width: 200,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "sourceTypeName",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
        ),
    },
    {
        key: "criterias",
        title: "CRITERIA",
        dataIndex: "criterias",
        width: 200,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "criterias",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
        ),
    },
    {
        key: "description",
        title: "DESCRIPTION",
        dataIndex: "description",
        width: 300,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
            search,
            "description",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
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
                <div className={" flex justify-center"}>
                    <NxStatusComponent colour={status}>
                        {displayText[status] || toTitleCase(String(status || "")) || "-"}
                    </NxStatusComponent>
                </div>
            )
        }
    }
].filter(Boolean);

export { getPreRequisiteTemplateColumns };