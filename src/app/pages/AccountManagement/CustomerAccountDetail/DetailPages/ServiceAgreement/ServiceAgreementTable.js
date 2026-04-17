import { useMemo, useState } from "react";

import NxTable from "../../../../../../components/Nx/NxTable";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import { getServiceAgreementColumns } from "./getServiceAgreementColumns";
import { RenderContentActions } from "../../../../../../components/ColumnActionPermission";
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

    const actionCols = useMemo(() => {
        const lowerCasePermissionList = SERVICE_AGREEMENT_PERMISSION_LIST.map((permission) =>
            permission.toLowerCase()
        );
        const lowerCasePermissionMapping = Object.entries(
            SERVICE_AGREEMENT_PERMISSION_MAPPING
        ).reduce((acc, [action, permission]) => {
            acc[action.toLowerCase()] = permission.toLowerCase();

            return acc;
        }, {});
        const grantedPermissions = (filteredArray?.actionList || [])
            .map((action) => action?.name?.toLowerCase())
            .filter((action) => lowerCasePermissionList.includes(action));

        const availableActions = (itemActions || [])
            .map((item) => ({
                ...item,
                action: item?.action?.toLowerCase(),
            }))
            .filter((item) => item?.type === "table")
            .filter((item) => {
                const requiredPermission = lowerCasePermissionMapping[item.action] || item.action;

                return grantedPermissions.includes(requiredPermission);
            });

        const permittedActions = availableActions.map((item) => item.action);

        if (permittedActions.length === 0) {
            return [];
        }

        return [{
            key: "action",
            title: "ACTION",
            dataIndex: "action",
            fixed: "right",
            width: 150,
            align: "center",
            render: (text, record, index) => (
                <RenderContentActions
                    text={text}
                    record={record}
                    index={index}
                    itemRender={availableActions}
                    totalLength={permittedActions.length}
                    permissions={permittedActions}
                    sliceColumn="View"
                />
            ),
        }];
    }, [filteredArray, itemActions]);

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
