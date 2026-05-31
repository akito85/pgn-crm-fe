import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeOutlined, UnorderedListOutlined, DownloadOutlined, UndoOutlined, CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Spin, Tooltip, Alert, message, Input, Popover, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";

// Routes
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";

// Constants
import { STATUS_TYPES, STATUS_APPROVAL, SORT_ORDER } from "../../../../../constants/restructure";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import TableRBI from "../../../../../components/TableRBI";
import CardContainer from "../../../../../components/CardContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import useGrantAccessHooks from "../../../../../components/useGrantAccessHooks";

// Column Configuration
import { columns as columnRestructure } from "./Columns";

// Redux / Service
import {
    getAllRestructureListPaginate,
    deleteRestructure,
    cancelRestructure,
    getApprovalHistory,
    downloadListRestructure
} from "../../../../../redux/slices/receipt_collection/restructure";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalApprovalRestructure from "./Modal/ModalApprovalRestructure";
import ModalCancelRestructure from "./Modal/ModalCancelRestructure";
import ListDetailRestructure from "./ListDetailRestructure";

const ViewRestructure = () => {
    const navigate = useNavigate();
    const { data, loading, loadingHistory, dataApprovalHistory } = useSelector(
        (state) => state.restructure
    );
    const isApprover = data?.isApprover || false;

    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const initialPageSize = 100;
    const loadMoreSize = 20;

    const [page, setPage] = useState(1);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [modalHistory, setModalHistory] = useState(false);
    const [modalApproval, setModalApproval] = useState(false);
    const [modalCancel, setModalCancel] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [search, setSearch] = useState({});
    const [allData, setAllData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const shouldResetRef = useRef(true);

    const hasMore = allData.length < (data?.page?.totalElements || 0);

    useEffect(() => {
        dispatch(
            getAllRestructureListPaginate({
                search: encodeURIComponent(JSON.stringify(search)),
                page: 1,
                pageSize: initialPageSize,
                sort,
            })
        );
    }, [search, sort, dispatch, refreshKey]);

    useEffect(() => {
        if (data?.result) {
            if (shouldResetRef.current || page === 1) {
                setAllData(data.result);
                shouldResetRef.current = false;
            } else {
                setAllData((prev) => {
                    const ids = new Set(prev.map((item) => item.id));
                    const newItems = data.result.filter((item) => !ids.has(item.id));
                    return [...prev, ...newItems];
                });
            }
        }
    }, [data, page]);

    const handleRefresh = useCallback(() => {
        shouldResetRef.current = true;
        if (page === 1) {
            setRefreshKey((prev) => prev + 1);
        } else {
            setPage(1);
        }
    }, [page]);

    const handleLoadMore = useCallback(async () => {
        if (allData.length >= (data?.page?.totalElements || 0)) return;
        const nextPage = Math.floor(allData.length / loadMoreSize) + 1;
        setPage(nextPage);
        await dispatch(
            getAllRestructureListPaginate({
                search: encodeURIComponent(JSON.stringify(search)),
                page: nextPage,
                pageSize: loadMoreSize,
                sort,
            })
        );
    }, [allData.length, data?.page?.totalElements, search, sort, dispatch]);

    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: "",
            breadcrumbName: "Bad Debt and Collection",
        },
        {
            path: DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE,
            breadcrumbName: "Payment Plan",
        },
    ];

    const handleApproval = () => {
        setModalApproval(true);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        shouldResetRef.current = true;
        setSearchText(selectedKeys[0]);
        setSearchedColumn(selectedKeys[0] ? dataIndex : "");
        setSearch((prevState) => {
            if (prevState[dataIndex] !== selectedKeys[0]) {
                setPage(1);
            }
            return {
                ...prevState,
                [dataIndex]: selectedKeys[0],
            };
        });
    };

    const onSort = (_, __, sorter) => {
        const dataSort =
            sorter.order !== undefined
                ? `${sorter.field}~${sorter.order === SORT_ORDER.ASCEND ? SORT_ORDER.ASC : SORT_ORDER.DESC}`
                : "";
        shouldResetRef.current = true;
        setPage(1);
        setSort(dataSort);
    };

    const handleGlobalSearch = useCallback(
        debounce((value) => {
            shouldResetRef.current = true;
            setSearchText(value);
            setSearchedColumn(value ? "all" : "");
            setSearch((prevState) => {
                const nextState = { ...prevState };
                if (value) {
                    nextState.all = value;
                } else {
                    delete nextState.all;
                }
                return nextState;
            });
            setPage(1);
        }, 500),
        []
    );

    useEffect(() => {
        return () => {
            handleGlobalSearch.cancel();
        };
    }, [handleGlobalSearch]);

    const handleAdvanceSearch = (searchData) => {
        const simpleSearch = {};
        if (searchData?.filters && Array.isArray(searchData.filters)) {
            searchData.filters.forEach((rule) => {
                if (rule.column && rule.value !== undefined && rule.value !== null && rule.value !== "") {
                    simpleSearch[rule.column] = rule.value;
                }
            });
        }
        if (searchData?.filterRules && Array.isArray(searchData.filterRules)) {
            searchData.filterRules.forEach((ruleGroup) => {
                if (Array.isArray(ruleGroup)) {
                    ruleGroup.forEach((rule) => {
                        if (rule?.column && rule?.value !== undefined && rule?.value !== null && rule?.value !== "" && rule?.condition) {
                            const conditionKey = rule.condition === "Equal to" ? "" : rule.condition;
                            simpleSearch[`${rule.column}${conditionKey}`] = rule.value;
                        }
                    });
                }
            });
        }
        shouldResetRef.current = true;
        setSearch(simpleSearch);
        setPage(1);
    };

    const handleDownload = () => {
        dispatch(
            downloadListRestructure({
                search: encodeURIComponent(JSON.stringify(search)),
                sort,
            })
        );
    };

    const handleCancel = (record) => {
        setSelectedRecord(record);
        setModalCancel(true);
    };

    const handleRePlan = (record) => {
        navigate(DEBT_AND_COLLECTION_ROUTES.CREATE_RE_PLAN, { state: { id: record?.id } });
    };


    const baseColumns = useMemo(() => {
        return columnRestructure(
            1,
            initialPageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            search
        );
    }, [
        searchInput,
        searchedColumn,
        searchText,
        search,
    ]);

    const itemActions = [

        // column action
        {
            action: "View",
            type: "table",
            render: (record) => {
                return (
                    <Tooltip title={"Detail"}>
                        <div
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(record?.id);
                                setTimeout(() => {
                                    const element = document.getElementById("detail-section-container");
                                    if (element) {
                                        element.scrollIntoView({ behavior: "smooth" });
                                    }
                                }, 150);
                            }}
                        >
                            <SVGIcon name="IconDetail" width={24} color={"#0075bf"} />
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            action: "Update",
            type: "table",
            render: (record) => {
                const status = record?.status?.toUpperCase();
                const disabled = (status !== STATUS_TYPES.SUBMITTED && status !== STATUS_TYPES.REJECTED);
                
                return (
                    <ButtonComponent
                        border={false}
                        className="gap-2 !justify-start hover:bg-gray-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled) {
                                navigate(DEBT_AND_COLLECTION_ROUTES.UPDATE_RESTRUCTURE, { state: { id: record?.id } });
                            }
                        }}
                        type="text"
                        disabled={disabled}
                        icon={<SVGIcon name="IconEdit" width={16} color={disabled ? "#D3D3D3" : "#000"} />}
                    >
                        <span className={disabled ? "text-gray-400" : "text-black"}>Update</span>
                    </ButtonComponent>
                );
            },
        },
        {
            action: "early-repayment",
            type: "table",
            render: (record) => {
                const disabled = !record?.activeEarlyPayoffButton;
                return (
                    <ButtonComponent
                        border={false}
                        className="gap-2 !justify-start hover:bg-gray-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled) {
                                navigate(DEBT_AND_COLLECTION_ROUTES.CREATE_EARLY_REPAYMENT, { state: { id: record?.id } });
                            }
                        }}
                        type="text"
                        disabled={disabled}
                        icon={<SVGIcon name="IconEarlyRepayment" width={16} color={disabled ? "#D3D3D3" : "#000"} />}
                    >
                        <span className={disabled ? "text-gray-400" : "text-black"}>Early Payoff</span>
                    </ButtonComponent>
                );
            },
        },
        {
            action: "re-plan",
            type: "table",
            render: (record) => {
                const disabled = !record?.activeRePlanButton;
                return (
                    <ButtonComponent
                        border={false}
                        className="gap-2 !justify-start hover:bg-gray-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled) {
                                handleRePlan(record);
                            }
                        }}
                        type="text"
                        disabled={disabled}
                        icon={<SVGIcon name="IconRePlan" width={16} color={disabled ? "#D3D3D3" : "#000"} />}
                    >
                        <span className={disabled ? "text-gray-400" : "text-black"}>Re-Plan</span>
                    </ButtonComponent>
                );
            },
        },
        {
            action: "History",
            type: "table",
            render: (record) => {
                return (
                    <ButtonComponent
                        border={false}
                        className="gap-2 !justify-start hover:bg-gray-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(getApprovalHistory({ id: record.id }));
                            setModalHistory(true);
                        }}
                        type="text"
                        icon={<SVGIcon name="IconLogHistory" width={16} color={"#000"} />}
                    >
                        <span className="text-black">Approval History</span>
                    </ButtonComponent>
                );
            },
        },
        {
            action: "Cancel",
            type: "table",
            render: (record) => {
                const disabled = !record?.activeCancelButton;
                return (
                    <ButtonComponent
                        border={false}
                        className="gap-2 !justify-start hover:bg-gray-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled) {
                                handleCancel(record);
                            }
                        }}
                        type="text"
                        disabled={disabled}
                        icon={<CloseOutlined style={{ fontSize: "16px", color: disabled ? "#D3D3D3" : "#BE3036" }} />}
                    >
                        <span className={disabled ? "text-gray-400" : "text-red-500"}>Cancel</span>
                    </ButtonComponent>
                );
            },
        },
        {
            action: "Download",
            render: (
                <ButtonComponent
                    icon={<DownloadOutlined style={{ fontSize: "16px" }} />}
                    type="primary"
                    onClick={handleDownload}
                >
                    Download List
                </ButtonComponent>
            )
        },
        isApprover && {
            action: "Approval",
            render: (
                <ButtonComponent
                    icon={<SVGIcon name="IconRequestApproval" width={24} />}
                    type="primary"
                    onClick={handleApproval}
                >
                    Approval
                </ButtonComponent>
            )
        },
        {
            action: "Upload",
            render: (
                <Link to={DEBT_AND_COLLECTION_ROUTES.UPLOAD_RESTRUCTURE}>
                    <ButtonComponent
                        icon={<SVGIcon name="IconUpload" width={17} color={"#FFFFFF"} />}
                        type="primary"
                    >
                        Upload
                    </ButtonComponent>
                </Link>
            )
        },
        {
            action: "Create",
            render: (
                <Link to={DEBT_AND_COLLECTION_ROUTES.CREATE_RESTRUCTURE}>
                    <ButtonComponent
                        icon={<SVGIcon name="IconButtonCreate" width={24} />}
                        type="primary"
                    >
                        Create Payment Plan
                    </ButtonComponent>
                </Link>
            )
        }
    ];

    const { actions: accessList } = useGrantAccessHooks("page");
    const permissions = accessList?.map(a => a.toLowerCase()) || [];

    const actionCols = useMemo(() => {
        const tableActions = itemActions.filter(item => item.type === "table" && (
            permissions.includes(item.action.toLowerCase()) ||
            item.action.toLowerCase() === "re-plan" ||
            item.action.toLowerCase() === "cancel"
        ));

        if (tableActions.length === 0) return [];

        return [
            {
                key: "action",
                title: "ACTION",
                fixed: "right",
                width: 150,
                align: "center",
                render: (_, record) => {
                    const viewAction = tableActions.find(a => a.action.toLowerCase() === "view");
                    const otherActions = tableActions.filter(a => a.action.toLowerCase() !== "view");

                    return (
                        <div className="flex justify-center items-center gap-4">
                            {otherActions.length > 0 && (
                                <Popover
                                    trigger="click"
                                    placement="bottomRight"
                                    showArrow={false}
                                    content={
                                        <div className="flex flex-col">
                                            {otherActions.map(action => (
                                                <div key={action.action} onClick={(e) => e.stopPropagation()} className="w-full">
                                                    {action.render(record)}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                >
                                    <div className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                        <SVGIcon name="IconActionDropdown" width={20} color={"#0075bf"} />
                                    </div>
                                </Popover>
                            )}
                            {viewAction && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    {viewAction.render(record)}
                                </div>
                            )}
                        </div>
                    );
                }
            }
        ];
    }, [accessList, itemActions, permissions]);

    const allColumns = useMemo(() => {
        return [...baseColumns, ...actionCols];
    }, [baseColumns, actionCols]);

    const columnDefinitions = useMemo(() => {
        return allColumns.map((col) => ({
            key: col.key || col.dataIndex || col.title,
            title: col.title,
        }));
    }, [allColumns]);

    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer header={
                    <div className="flex -my-4 justify-between items-center w-full">
                        <p className="mt-[15px] font-bold uppercase text-[#0075BF]">
                            Payment Plan List
                        </p>
                        <div className="flex gap-2">
                            <Toolbar items={itemActions} />
                        </div>
                    </div>
                }>
                    <TableRBI
                        dataSource={allData}
                        showExport={true}
                        handleDownload={handleDownload}
                        columns={allColumns}
                        columnDefinitions={columnDefinitions}
                        showSearchBar={true}
                        onAdvanceSearch={handleAdvanceSearch}
                        onSearch={(e) => handleGlobalSearch(e.target.value)}
                        current={page}
                        pageSize={initialPageSize}
                        totalData={data?.page?.totalElements || 0}
                        onSort={onSort}
                        useInfiniteScroll={true}
                        usePagination={false}
                        onLoadMore={handleLoadMore}
                        hasMore={hasMore}
                        showRefresh={true}
                        onRefresh={handleRefresh}
                        refreshLabel="Refresh"
                        tableScrolled={{
                            x: 6500,
                            y: 525,
                        }}
                    />
                </CardContainer>

                {selectedId && (
                    <div id="detail-section-container" className="mt-8">
                        <ListDetailRestructure 
                            selectedId={selectedId} 
                            approvalType={allData.find(item => item.id === selectedId)?.approvalType}
                            isApprover={isApprover}
                            isEmbedded={true}
                            onClose={() => setSelectedId(null)} 
                            onRefresh={handleRefresh}
                        />
                    </div>
                )}

                <ModalCancelRestructure
                    isOpen={modalCancel}
                    handleCancel={() => setModalCancel(false)}
                    record={selectedRecord}
                    onSuccess={handleRefresh}
                />

                <ModalHistory
                    isOpen={modalHistory}
                    handleClose={() => setModalHistory(false)}
                    header={
                        <div className="flex items-center gap-2">
                            <span>APPROVAL HISTORY</span>
                            {loadingHistory && <Spin size="small" />}
                        </div>
                    }
                    tabOptions={[
                        { label: "Payment Plan", value: "payment_plan" },
                        { label: "Early Payoff", value: "early_repayment" },
                        { label: "Re-Plan", value: "re_plan" },
                        { label: "Cancel", value: "cancel" },
                    ]}
                    dataApprover={{
                        payment_plan: Array.isArray(dataApprovalHistory?.payment_plan?.dataApprover) 
                            ? dataApprovalHistory.payment_plan.dataApprover 
                            : (dataApprovalHistory?.payment_plan?.dataApprover?.RESTRUCTURE || []),
                        early_repayment: Array.isArray(dataApprovalHistory?.early_repayment?.dataApprover)
                            ? dataApprovalHistory.early_repayment.dataApprover
                            : (dataApprovalHistory?.early_repayment?.dataApprover?.EARLY_REPAYMENT || []),
                        re_plan: Array.isArray(dataApprovalHistory?.re_plan?.dataApprover)
                            ? dataApprovalHistory.re_plan.dataApprover
                            : (dataApprovalHistory?.re_plan?.dataApprover?.REPLAN || []),
                        cancel: Array.isArray(dataApprovalHistory?.cancel?.dataApprover)
                            ? dataApprovalHistory.cancel.dataApprover
                            : (dataApprovalHistory?.cancel?.dataApprover?.CANCEL || [])
                    }}
                    dataHistory={{
                        payment_plan: Array.isArray(dataApprovalHistory?.payment_plan?.dataHistory)
                            ? dataApprovalHistory.payment_plan.dataHistory
                            : (dataApprovalHistory?.payment_plan?.dataHistory?.RESTRUCTURE || []),
                        early_repayment: Array.isArray(dataApprovalHistory?.early_repayment?.dataHistory)
                            ? dataApprovalHistory.early_repayment.dataHistory
                            : (dataApprovalHistory?.early_repayment?.dataHistory?.EARLY_REPAYMENT || []),
                        re_plan: Array.isArray(dataApprovalHistory?.re_plan?.dataHistory)
                            ? dataApprovalHistory.re_plan.dataHistory
                            : (dataApprovalHistory?.re_plan?.dataHistory?.REPLAN || []),
                        cancel: Array.isArray(dataApprovalHistory?.cancel?.dataHistory)
                            ? dataApprovalHistory.cancel.dataHistory
                            : (dataApprovalHistory?.cancel?.dataHistory?.CANCEL || [])
                    }}
                />

                <ModalApprovalRestructure
                    isOpen={modalApproval}
                    handleCancel={() => setModalApproval(false)}
                    handleListRefresh={handleRefresh}
                />
            </Spin>
        </>
    );
};

export default ViewRestructure;
