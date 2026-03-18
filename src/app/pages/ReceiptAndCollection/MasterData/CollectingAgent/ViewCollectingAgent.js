import React, { useEffect, useRef, useState, useMemo } from "react";
import { Tooltip, Checkbox } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import { EyeOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import {
    hasValue,
    renderColumn,
    renderDateColumn,
    disabledActionByStatus,
} from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import {
    getApprovalHistoryCollectingAgent,
    getDownloadCollectingAgent,
    getPaginateCollectingAgent,
    getAllApprovalListCollectingAgent,
    getListApprovalByIdCollectingAgent,
    inactiveCollectingAgent,
} from "../../../../../redux/slices/receipt_collection/collectingAgent";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";

const ViewCollectingAgent = () => {
    // Selector
    const { loading, data, dataApprovalHistory } = useSelector(
        (state) => state.collectingAgent
    );
    const { bodyError } = useSelector((state) => state?.general);

    // Declaration
    const dispatch = useDispatch();
    const searchInput = useRef(null);

    // State
    const [page, setPage] = useState(1);
    const [loadMoreSize] = useState(20);
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [openModalHistory, setOpenModalHistory] = useState(false);
    const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
    const [body, setBody] = useState({});
    const [status, setStatus] = useState("");
    const [id, setId] = useState("");
    const [nameModalActiveOrInactivate, setNameModalActiveOrInactivate] = useState("");
    const [openModalInactivate, setOpenModalInactivate] = useState(false);
    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ["no"],
        right: ["status", "statusApproval", "action"],
    }));

    const initialPageSize = 100;

    useEffect(() => {
        dispatch(
            getPaginateCollectingAgent({
                search: encodeURIComponent(JSON.stringify(search)),
                page: 1,
                pageSize: initialPageSize,
                sort,
                isLoadMore: false,
            })
        );
        setPage(1);
    }, [dispatch, search, sort]);

    const hasMore =
        (data?.result?.length || 0) < (data?.page?.totalElements || 0);

    const handleLoadMore = async () => {
        if (!hasMore) return;
        const currentDataLength = data?.result?.length || 0;
        const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;
        await dispatch(
            getPaginateCollectingAgent({
                search: encodeURIComponent(JSON.stringify(search)),
                page: nextPage,
                pageSize: loadMoreSize,
                sort,
                isLoadMore: true,
            })
        );
        setPage(nextPage);
    };

    const handleRefresh = () => {
        dispatch(
            getPaginateCollectingAgent({
                search: encodeURIComponent(JSON.stringify(search)),
                page: 1,
                pageSize: initialPageSize,
                sort,
                isLoadMore: false,
            })
        );
        setPage(1);
    };

    // Breadcrumbs
    const routes = [
        { path: "", breadcrumbName: "System Setup" },
        { path: "", breadcrumbName: "Master Data" },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_COLLECTING_AGENT,
            breadcrumbName: "Collecting Agent",
        },
    ];

    const handleOptions = () => {
        const d = dataApprovalHistoryFix?.dataApprover || {};
        return Object.keys(d).map((item) => ({
            value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
        }));
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearch((prev) => ({
            ...prev,
            [dataIndex]: selectedKeys[0],
        }));
    };

    useEffect(() => {
        if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
            const temp = {
                dataApprover: {
                    create: dataApprovalHistory?.dataApprover?.COLLECTING_AGENT || [],
                    inactive: dataApprovalHistory?.dataApprover?.INACTIVE_COLLECTING_AGENT || [],
                },
                dataHistory: {
                    create: dataApprovalHistory?.dataHistory?.COLLECTING_AGENT || [],
                    inactive: dataApprovalHistory?.dataHistory?.INACTIVE_COLLECTING_AGENT || [],
                },
            };
            setDataApprovalHistoryFix(temp);
        } else {
            setDataApprovalHistoryFix({});
        }
    }, [dataApprovalHistory]);

    const handleApprovalHistory = async (recordId) => {
        try {
            setBody(recordId);
            await dispatch(getApprovalHistoryCollectingAgent(recordId))?.unwrap();
            setOpenModalHistory(true);
        } catch {
            setOpenModalHistory(false);
        }
    };

    const handleInactive = (r) => {
        setOpenModalInactivate(true);
        setId(r?.id);
        setNameModalActiveOrInactivate(r?.code + " - " + r?.name);
        setStatus(r?.status);
    };

    const handleCancelModalInactivate = () => {
        setOpenModalInactivate(false);
    };

    const handleSubmitModalInactivate = (res, handleClear) => {
        const reqBody = {
            id,
            appHierId: res.approvalHierarchy,
            status: status === "Inactive" ? "Active" : "Inactive",
            remark: res.remark,
        };
        setBody({ body: reqBody });
        dispatch(inactiveCollectingAgent({ body: reqBody }))
            .unwrap()
            .then(() => {
                handleClear();
                handleCancelModalInactivate();
                dispatch(
                    getPaginateCollectingAgent({
                        search: encodeURIComponent(JSON.stringify(search)),
                        page: 1,
                        pageSize: initialPageSize,
                        sort,
                        isLoadMore: false,
                    })
                );
                setPage(1);
            });
    };

    const onSort = (_, __, sorter) => {
        const dataSort =
            sorter.order !== undefined
                ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    const handleDownload = () => {
        dispatch(
            getDownloadCollectingAgent({
                search: encodeURIComponent(JSON.stringify(search)),
                page,
                pageSize: loadMoreSize,
                sort,
            })
        );
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearch((prev) => {
            const next = { ...prev };
            delete next[dataIndex];
            return next;
        });
        setSearchText("");
    };

    const handleAdvanceSearch = (searchData) => {
        const simpleSearch = {};

        if (searchData?.filters && Array.isArray(searchData.filters)) {
            searchData.filters.forEach((rule) => {
                if (
                    rule.column &&
                    rule.value !== undefined &&
                    rule.value !== null &&
                    rule.value !== ""
                ) {
                    simpleSearch[rule.column] = rule.value;
                }
            });
        }

        if (searchData?.filterRules && Array.isArray(searchData.filterRules)) {
            searchData.filterRules.forEach((ruleGroup) => {
                if (ruleGroup?.filters && Array.isArray(ruleGroup.filters)) {
                    ruleGroup.filters.forEach((rule) => {
                        const hasVal =
                            rule.value !== undefined &&
                            rule.value !== null &&
                            rule.value !== "";
                        if (rule.column && hasVal) {
                            simpleSearch[rule.column] = rule.value;
                        }
                    });
                }
            });
        }

        setSearch(simpleSearch);
        setPage(1);
    };

    const baseColumns = useMemo(
        () => [
            {
                key: "no",
                title: "NO",
                width: 60,
                align: "center",
                isClassification: true,
                render: (text, object, index) => index + 1,
            },
            {
                key: "code",
                title: "CA CODE",
                dataIndex: "code",
                width: 130,
                sorter: true,
                isClassification: true,
                filteredValue: [search?.code] || null,
                ...getColumnSearchPropsUseFilteredValue(
                    search, "code", searchInput, searchedColumn, searchText, handleSearch, true
                ),
                render: (text) =>
                    renderColumn("code", hasValue(search["code"]), searchText, text, true, "input", search),
            },
            {
                key: "name",
                title: "CA NAME",
                dataIndex: "name",
                width: 180,
                sorter: true,
                isClassification: true,
                filteredValue: [search?.name] || null,
                ...getColumnSearchPropsUseFilteredValue(
                    search, "name", searchInput, searchedColumn, searchText, handleSearch, true
                ),
                render: (text) =>
                    renderColumn("name", hasValue(search["name"]), searchText, text, true, "input", search),
            },
            {
                key: "startDate",
                title: "START DATE",
                dataIndex: "startDate",
                width: 130,
                sorter: true,
                isClassification: true,
                filteredValue: [search?.startDate] || null,
                ...getColumnSearchPropsUseFilteredValue(
                    search, "startDate", searchInput, searchedColumn, searchText, handleSearch, false, "date"
                ),
                render: (text) =>
                    renderDateColumn("startDate", hasValue(search["startDate"]), searchText, text, "date", search),
            },
            {
                key: "endDate",
                title: "END DATE",
                dataIndex: "endDate",
                width: 130,
                sorter: true,
                isClassification: true,
                filteredValue: [search?.endDate] || null,
                ...getColumnSearchPropsUseFilteredValue(
                    search, "endDate", searchInput, searchedColumn, searchText, handleSearch, false, "date"
                ),
                render: (text) =>
                    renderDateColumn("endDate", hasValue(search["endDate"]), searchText, text, "date", search),
            },
            {
                key: "status",
                title: "STATUS",
                dataIndex: "status",
                width: 110,
                sorter: true,
                isClassification: true,
                fixed: "right",
                filteredValue: [search?.status] || null,
                ...getColumnSearchPropsUseFilteredValue(
                    search, "status", searchInput, searchedColumn, searchText, handleSearch, false
                ),
                render: (text) =>
                    renderColumn("status", hasValue(search["status"]), searchText, text, false, "status", search),
            },
            {
                key: "statusApproval",
                title: "STATUS APPROVAL",
                dataIndex: "statusApproval",
                width: 160,
                sorter: true,
                isClassification: true,
                fixed: "right",
                filteredValue: [search?.statusApproval] || null,
                ...getColumnSearchPropsUseFilteredValue(
                    search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch, false
                ),
                render: (text) =>
                    renderColumn("status", hasValue(search["statusApproval"]), searchText, text, false, "status", search),
            },
        ],
        [search, searchText, searchedColumn]
    );

    const itemActions = [
        {
            action: "Download",
            render: (
                <ButtonComponent
                    onClick={handleDownload}
                    type="submit"
                    border={false}
                    icon={<SVGIcon name="IconButtonDownload" width={20} />}
                >
                    Download List
                </ButtonComponent>
            ),
        },
        {
            action: "Create",
            render: (
                <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_COLLECTING_AGENT}>
                    <ButtonComponent
                        icon={<SVGIcon name="IconButtonCreate" width={20} />}
                        type="submit"
                        border={false}
                    >
                        Create Collecting Agent
                    </ButtonComponent>
                </NavLink>
            ),
        },
        {
            action: "View",
            type: "table",
            render: (record) => (
                <Link
                    to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_COLLECTING_AGENT}
                    state={{ id: record?.id }}
                    style={{ lineHeight: 0 }}
                >
                    <Tooltip title="Detail">
                        <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
                    </Tooltip>
                </Link>
            ),
        },
        {
            action: "Update",
            type: "table",
            render: (record) => {
                const isEditable =
                    record.statusApproval === "Draft" || record.statusApproval === "Rejected";
                return (
                    <Tooltip title="Update">
                        <div
                            onClick={(e) => { if (!isEditable) e.preventDefault(); }}
                            className={!isEditable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                        >
                            {isEditable ? (
                                <Link
                                    to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_COLLECTING_AGENT}
                                    state={{ id: record?.id }}
                                >
                                    <SVGIcon name="IconEdit" color="#ACC424" width={20} />
                                </Link>
                            ) : (
                                <SVGIcon name="IconEdit" color="#8D91A0" width={20} />
                            )}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            action: "Activate",
            type: "table",
            render: (record) => {
                const statusLowerCase = record?.status?.toLowerCase();
                return (
                    <Tooltip
                        title={
                            statusLowerCase === "active" || statusLowerCase === "draft"
                                ? "Inactivate"
                                : "Activate"
                        }
                    >
                        <div>
                            <Checkbox
                                onClick={() => handleInactive(record)}
                                checked={record?.status !== "Active"}
                                disabled={disabledActionByStatus(
                                    "activate",
                                    record?.status,
                                    record?.statusApproval
                                )}
                            />
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            action: "history",
            type: "table",
            render: (record) => (
                <Tooltip title="Approval History">
                    <div
                        style={{ lineHeight: 0 }}
                        onClick={() => handleApprovalHistory(record?.id)}
                    >
                        <SVGIcon name="IconLogHistory" color="#0075bf" width={20} />
                    </div>
                </Tooltip>
            ),
        },
    ];

    const actionCols = useColumnActionPermission(
        ["view", "update", "activate", "history"],
        itemActions
    ).map((col) => ({
        ...col,
        width: 60,
        align: "center",
    }));

    const allColumns = useMemo(() => {
        const cols = [...baseColumns, ...actionCols].map((col) => ({
            ...col,
            key: col.key || col.dataIndex || col.title,
        }));
        return cols;
    }, [baseColumns, actionCols]);

    const processedColumns = useMemo(
        () => applyFixedColumns(allColumns, fixedColumns),
        [allColumns, fixedColumns]
    );

    const columnDefinitions = useMemo(
        () =>
            allColumns.map((col) => ({
                key: col.key || col.dataIndex || col.title,
                title: col.title,
            })),
        [allColumns]
    );

    // handle retry modal error
    const handleRetry = () => {
        try {
            handleCancelTryAgain();
            if (bodyError?.action === "INACTIVE_COLLECTING_AGENT") {
                dispatch(inactiveCollectingAgent(body));
            } else if (bodyError?.action === "GET_APPROVAL_HISTORY_COLLECTING_AGENT") {
                dispatch(getApprovalHistoryCollectingAgent(body));
            } else if (bodyError?.action === "DOWNLOAD_COLLECTING_AGENT") {
                handleDownload();
            }
            handleRefresh();
        } catch {
            handleRefresh();
        }
    };

    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

    return (
        <div>
            <BreadCrumb routes={routes} />
            <CardContainer
                header={
                    <div className="flex -my-4 justify-between items-center">
                        <p className="w-full mt-[15px] font-bold">COLLECTING AGENT LIST</p>
                        <Toolbar items={itemActions} />
                    </div>
                }
            >
                <TableRBI
                    idTable="collecting-agent-table"
                    size="small"
                    dataSource={data?.result}
                    columns={processedColumns}
                    totalData={data?.page?.totalElements || 0}
                    tableScrolled={{ x: "max-content", y: 525 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    handleDownload={handleDownload}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading}
                    showExport={false}
                    usePagination={false}
                    useInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    showRefresh={true}
                    onRefresh={handleRefresh}
                    loadMoreThreshold={20}
                    onAdvanceSearch={handleAdvanceSearch}
                />
            </CardContainer>

            <ModalActiveInactive
                dispatch={dispatch}
                getAPIOption={getAllApprovalListCollectingAgent}
                getAPIDetail={getListApprovalByIdCollectingAgent}
                selector="collectingAgent"
                alertMessage={`Are you sure you want to inactivate this Collecting Agent with CA Code ${nameModalActiveOrInactivate}?`}
                openModalInactivate={openModalInactivate}
                handleCloseModalInactivate={handleCancelModalInactivate}
                onFinish={handleSubmitModalInactivate}
            />

            <ModalHistory
                isOpen={openModalHistory && dataApprovalHistoryFix}
                handleClose={() => setOpenModalHistory(false)}
                header="Approval History"
                width={850}
                tabOptions={handleOptions()}
                dataApprover={dataApprovalHistoryFix?.dataApprover}
                dataHistory={dataApprovalHistoryFix?.dataHistory}
            />

            {/* modal try again */}
            {renderModal()}
        </div>
    );
};

export default ViewCollectingAgent;
