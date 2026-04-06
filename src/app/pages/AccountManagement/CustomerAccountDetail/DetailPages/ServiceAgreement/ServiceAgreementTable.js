import { useMemo, useState } from "react";

import NxTable from "../../../../../../components/Nx/NxTable";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import { getServiceAgreementColumns } from "./getServiceAgreementColumns";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";
import {
    SERVICE_AGREEMENT_PERMISSION_LIST,
    SERVICE_AGREEMENT_PERMISSION_MAPPING,
} from "./serviceAgreementActionBuilders";

const ServiceAgreementTable = ({
    data = [],
    totalElement = 0,
    page = 0,
    onSort = () => { },
    handleLoadMore = () => { },
    hasMore = false,
    searchText = "",
    search = {},
    searchedColumn = "",
    searchInput = null,
    handleSearch = () => { },
    itemActions = [],
    loading = false,
    filteredArray = {},
}) => {
    const [fixedColumns, setFixedColumns] = useState(() => ({
        right: ["approvalStatus", "status", "action"],
        left: [],
    }));

    const actionCols = useColumnActionPermissionAccount(
        SERVICE_AGREEMENT_PERMISSION_LIST,
        itemActions,
        filteredArray,
        "View",
        SERVICE_AGREEMENT_PERMISSION_MAPPING
    ).map((col) => ({
        ...col,
        width: 70,
        align: "center",
    }));

    const baseColumns = useMemo(
        () =>
            getServiceAgreementColumns(
                search,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        [handleSearch, search, searchInput, searchText, searchedColumn]
    );

    const allColumns = useMemo(() => {
        const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
            ...col,
            key: col.key || col.dataIndex || col.title,
        }));
        return columnsWithKeys;
    }, [baseColumns, actionCols]);

    const processedColumns = useMemo(() => {
        return nxApplyFixedColumns(allColumns, fixedColumns);
    }, [allColumns, fixedColumns]);

    const columnDefinitions = useMemo(() => {
        return allColumns.map((col) => ({
            key: col.key || col.dataIndex || col.title,
            title: col.title,
        }));
    }, [allColumns]);

    return (
        <NxTable
            idTable="service-agreement-table"
            dataSource={data}
            totalData={totalElement}
            current={page}
            tableScrolled={{ y: 400, x: "max-content" }}
            onSort={onSort}
            columns={processedColumns}
            usePagination={false}
            useInfiniteScroll={true}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            loadMoreThreshold={2}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            columnDefinitions={columnDefinitions}
            loading={loading}
        />
    );
};

export default ServiceAgreementTable;
