import { useDispatch, useSelector } from "react-redux";
import NxTable from "../../../../components/Nx/NxTable";
import Toolbar from "../../../../components/Toolbar";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { getPreRequisiteTemplate } from "../../../../redux/slices/system_setup/preRequisiteTemplate";
import { useEffect, useMemo, useRef, useState } from "react";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { useNavigate } from "react-router-dom";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { getPreRequisiteTemplateColumns } from "./GetPreRequisiteTemplateColumns";

const PreRequisiteTemplateTable = ({
    refreshSignal = 0,
    handleInactivateModal = () => {},
}) => {
    const {
        loading_list_prt: loading,
        list_prt: dataSource,
        pagination_prt: pagination,
    } = useSelector((state) => state.preRequisiteTemplate);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const totalElement = pagination.totalElement;
    const hasMore = dataSource.length < (totalElement || 0);

    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(0);
    const [loadMoreSize] = useState(20);
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const [filters, setFilters] = useState([]);
    const [filterRules, setFilterRules] = useState([]);

    const onSort = (_, __, sort) => {
        const dataSort = sort.order
            ? `${sort.field},${sort.order === "ascend" ? "asc" : "desc"}`
            : "";
        setSort(dataSort);
    }

    const handleRefresh = () => {
        const body = {
            page: 0,
            size: loadMoreSize,
            sort,
            searchs: search,
            filters,
            filterRules
        }

        dispatch(getPreRequisiteTemplate({ body, isLoadMore: false }));
        setPage(0);
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearch((prevState) => {
            if (prevState[dataIndex] !== selectedKeys[0]) {
                setPage(0);
            }
            return {
                ...prevState,
                [dataIndex]: selectedKeys[0]
            };
        });
    }

    const handleLoadMore = async () => {
        const nextPage = page + 1;
        const totalPage = pagination.totalPage || 0;

        if (nextPage <= totalPage) {
            const body = {
                page: nextPage,
                size: loadMoreSize,
                sort,
                searchs: search,
                filters,
                filterRules
            };

            await dispatch(
                getPreRequisiteTemplate({ body, isLoadMore: true })
            ).unwrap();
        }
        setPage(nextPage);
    }

    const itemActions = nxGetAccountActions({
        handleView: ({ id }) =>
            navigate(
                SYSTEM_SETUP_ROUTES.DETAIL_PRE_REQUISITE_TEMPLATE,
                {
                    state: {
                        id,
                    }
                }
            ),
        handleCreate: () =>
            navigate(
                SYSTEM_SETUP_ROUTES.CREATE_PRE_REQUISITE_TEMPLATE,
            ),
        handleUpdate: ({ id }) =>
            navigate(
                SYSTEM_SETUP_ROUTES.UPDATE_PRE_REQUISITE_TEMPLATE,
                {
                    state: {
                        id,
                    }
                }
            ),
        handleInactivate: ({ id }) => handleInactivateModal(true, id)
    });

    const baseColumns = useMemo(
        () => getPreRequisiteTemplateColumns({
            search,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
        }),
        [search, searchInput, searchText, searchedColumn]
    );

    const actionCols = useColumnActionPermission(
        ["Inactivate", "View", "Update"],
        itemActions,
        "View",
        // "page"
    ).map((col) => ({
        ...col,
        width: 70,
        align: "center",
        fixed: "right",
    }));

    const columns = useMemo(
        () => [...baseColumns, ...actionCols],
        [baseColumns, actionCols]
    )

    useEffect(() => {
        const body = {
            page: 0,
            size: loadMoreSize,
            sort,
            searchs: search,
            filters,
            filterRules
         }

         setPage(0);
         dispatch(getPreRequisiteTemplate({ body, isLoadMore: false }));
    }, [sort, search, filters, filterRules]);

    useEffect(() => {
        if (refreshSignal > 0) handleRefresh();
    }, [refreshSignal]);

    return (
    <div className="flex flex-col gap-y-4">
        <Toolbar items={itemActions} type="page" />
        <NxTable
            idTable="pre-requisite-template-table"
            dataSource={dataSource}
            totalData={totalElement}
            current={page}
            tableScrolled={{ x: "max-content" }}
            onSort={onSort}
            columns={columns}
            usePagination={false}
            useInfiniteScroll={true}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            loadMoreThreshold={20}
            loading={loading}
        />
    </div>
    );
}

export default PreRequisiteTemplateTable;