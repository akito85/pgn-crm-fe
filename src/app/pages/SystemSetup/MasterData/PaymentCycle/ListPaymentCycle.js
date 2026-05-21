import {
    Tooltip,
    Spin,
    Checkbox,
} from "antd";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import Toolbar from "../../../../../components/Toolbar";
import TableRBI from "../../../../../components/TableRBI";
import SVGIcon from "../../../../../assets/Icon/index";
import IconViewList from "../../../../../assets/Icon/Nx/IconViewList";
import StatusComponent from "../../../../../components/StatusComponent";
import {
    getListPaymentCycle,
    inactivePaymentCycle,
    openClosePaymentCycle,
    getApprovalHistory,
    getAllApprovalList,
    getListApprovalById,
    getDownloadPaymentCycle
} from "../../../../../redux/slices/receipt_collection/paymentCycle";
import {
    renderColumn,
    renderDateColumn,
    disabledActionByStatus,
} from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";

const escapeHtml = (text) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text ? String(text).replace(/[&<>"']/g, (s) => map[s]) : text;
};

const getSafeErrorMessage = (error) => {
    const message = error?.response?.data?.message || error?.message || 'An error occurred';
    const safeMessages = ['Validation failed', 'Invalid input', 'Unauthorized'];
    return safeMessages.some((m) => message.includes(m)) ? message : 'An unexpected error occurred';
};

const ListPaymentCycle = () => {
    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ["no"],
        right: ["status", "statusApproval", "action"],
    }));

    const COLUMN_WIDTH = {
        PERIOD: 150,
        TIME_UNIT: 120,
        BEGIN_CYCLE: 120,
        END_CYCLE: 120,
        DATE: 150,
        STATUS_OPEN: 120,
        STATUS: 110,
        STATUS_APPROVAL: 160,
        ACTION: 60,
        NO: 90,
    };

    const initialPageSize = 100;
    const [loadMoreSize] = useState(20);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [search, setSearch] = useState({});
    const [sort, setSort] = useState("");

    // Modal States
    const [modalActiveInactive, setModalActiveInactive] = useState(false);
    const [status, setStatus] = useState("");
    const [dataInactivate, setDataInactivate] = useState(null);
    const [modalOpenClose, setModalOpenClose] = useState(false);
    const [statusOpen, setStatusOpen] = useState("");
    const [dataOpenClose, setDataOpenClose] = useState(null);
    const [openOrClose, setOpenOrClose] = useState("");
    const [openModalHistory, setOpenModalHistory] = useState(false);
    const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

    const {
        loading,
        data,
        dataApprovalHistory,
    } = useSelector((state) => state.paymentCycle);

    const handleFetch = useCallback(() => {
        const params = {
            page: 1,
            pageSize: initialPageSize,
            search: encodeURIComponent(JSON.stringify(search)),
            sort: sort,
            isLoadMore: false,
        };

        dispatch(getListPaymentCycle(params));
    }, [dispatch, initialPageSize, JSON.stringify(search), sort]);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    const hasMore = (data?.result?.length || 0) < (data?.page?.totalElements || 0);

    const handleLoadMore = async () => {
        if (!hasMore) return;
        const currentDataLength = data?.result?.length || 0;
        const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;
        await dispatch(
            getListPaymentCycle({
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
        setPage(1);
        handleFetch();
    };

    // Approval History Logic
    useEffect(() => {
        if (dataApprovalHistory?.dataApprover) {
            const temp = {
                dataApprover: {
                    create: dataApprovalHistory?.dataApprover?.PAYMENT_CYCLE || [],
                    inactive: dataApprovalHistory?.dataApprover?.INACTIVE_PAYMENT_CYCLE || [],
                },
                dataHistory: {
                    create: dataApprovalHistory?.dataHistory?.PAYMENT_CYCLE || [],
                    inactive: dataApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_CYCLE || [],
                },
            };
            setDataApprovalHistoryFix(temp);
        } else {
            setDataApprovalHistoryFix({});
        }
    }, [dataApprovalHistory]);

    const handleOptions = () => {
        const data = dataApprovalHistoryFix?.dataApprover || {};
        const keyData = Object.keys(data);
        return keyData.map((item) => ({
            value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
        }));
    };

    const handleApprovalHistory = async (record) => {
        try {
            await dispatch(getApprovalHistory(record.idPaymentCycle)).unwrap();
            setOpenModalHistory(true);
        } catch (error) {
            console.error('Failed to fetch approval history:', error);
            setOpenModalHistory(false);
        }
    };

    const handleCancelModalInactivate = () => {
        setDataInactivate(null);
        setModalActiveInactive(false);
    };

    const handleSubmitModalInactivate = (res, handleClear) => {
        const data = {
            idPaymentCycle: dataInactivate,
            remark: res.remark,
            status: status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
            appHierId: res.approvalHierarchy,
        };
        dispatch(inactivePaymentCycle(data))
            .unwrap()
            .then(() => {
                handleClear();
                handleCancelModalInactivate();
                handleFetch();
            });
    };

    const handleCancelModalOpenClose = () => {
        setDataOpenClose(null);
        setModalOpenClose(false);
    };

    const handleSubmitModalOpenClose = (res, handleClear) => {
        const data = {
            id: dataOpenClose,
            statusOpen: statusOpen === "OPEN" ? "CLOSE" : "OPEN",
            remark: res.remark,
        };
        dispatch(openClosePaymentCycle(data))
            .unwrap()
            .then(() => {
                handleClear();
                handleCancelModalOpenClose();
                handleFetch();
            });
    };

    // Function Search Column
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        const sanitizedValue = escapeHtml(selectedKeys[0]);
        setSearchText(sanitizedValue);
        setSearchedColumn(sanitizedValue ? dataIndex : "");
        setSearch((prevState) => {
            const nextSearch = {
                ...prevState,
                [dataIndex]: sanitizedValue,
            };
            return nextSearch;
        });
        setPage(1);
    };

    const onSort = (_, __, sort) => {
        let dataSort = "";
        if (sort?.order) {
            const sortOrder = sort.order === "ascend" ? "asc" : "desc";
            dataSort = `${sort.field}~${sortOrder}`;
        }
        setSort(dataSort);
    };

    const handleDownload = () => {
        const params = {
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: initialPageSize,
            sort: sort,
        };
        dispatch(getDownloadPaymentCycle(params));
    };

    const handleAdvanceSearch = (searchData) => {

        const simpleSearch = {};

        if (searchData?.filters && Array.isArray(searchData.filters)) {
            searchData.filters.forEach(rule => {
                if (rule.column && rule.value !== undefined && rule.value !== null && rule.value !== '') {
                    simpleSearch[rule.column] = rule.value;
                }
            });
        }

        if (searchData?.filterRules && Array.isArray(searchData.filterRules)) {
            searchData.filterRules.forEach(ruleGroup => {
                if (ruleGroup?.filters && Array.isArray(ruleGroup.filters)) {
                    ruleGroup.filters.forEach(rule => {
                        const hasValue = rule.value !== undefined && rule.value !== null && rule.value !== '';
                        if (rule.column && hasValue) {
                            simpleSearch[rule.column] = rule.value;
                        }
                    });
                }
            });
        }


        setSearch(simpleSearch);
        setPage(1);
        dispatch(
            getListPaymentCycle({
                search: encodeURIComponent(JSON.stringify(simpleSearch)),
                page: 1,
                pageSize: initialPageSize,
                sort,
                isLoadMore: false,
            })
        );
    };

    const itemActions = [
        // toolbar items
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
                <Link to="/system-setup/payment-cycle/create">
                    <ButtonComponent
                        icon={<SVGIcon name="IconButtonCreate" width={20} />}
                        type="submit"
                        border={false}
                    >
                        Create
                    </ButtonComponent>
                </Link>
            ),
        },

        // column action
        {
            action: "View",
            type: "table",
            render: (record) => {
                return (
                    <Tooltip title={"Detail"}>
                        <Link
                            to="/system-setup/payment-cycle/view"
                            state={{ id: record.idPaymentCycle, statusApproval: record.statusApproval }}
                            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
                        >
                            <IconViewList width={20} />
                        </Link>
                    </Tooltip>
                );
            },
        },

        {
            action: "Update",
            type: "table",
            render: (record, data_length) => {
                const isEditable = record.statusApproval?.toUpperCase() === "DRAFT" || record.statusApproval?.toUpperCase() === "REJECTED";
                return (
                    data_length > 3 ? (
                        <Link
                            to="/system-setup/payment-cycle/update"
                            state={{ id: record.idPaymentCycle }}
                            className={!isEditable ? "pointer-events-none" : ""}
                        >
                            <ButtonComponent
                                className="gap-5"
                                icon={
                                    <SVGIcon name="IconEdit" width={24} color={isEditable ? "#0075bf" : "#8D91A0"} />
                                }
                                border={false}
                                disabled={!isEditable}
                                type="action"
                            >
                                <span className={"text-black gap-2 text-center"}>
                                    Update
                                </span>
                            </ButtonComponent>
                        </Link>
                    ) : (
                        <Tooltip title="Update">
                            <div
                                onClick={(e) => { if (!isEditable) e.preventDefault(); }}
                                className={!isEditable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                            >
                                <Link
                                    to="/system-setup/payment-cycle/update"
                                    state={{ id: record.idPaymentCycle }}
                                    className={!isEditable ? "pointer-events-none" : ""}
                                >
                                    <SVGIcon
                                        name="IconEdit"
                                        color={isEditable ? "#ACC424" : "#8D91A0"}
                                        width={20}
                                    />
                                </Link>
                            </div>
                        </Tooltip>
                    )
                );
            },
        },
        {
            action: "Activate",
            type: "table",
            render: (record, data_length) => {
                const statusLowerCase = record?.status?.toLowerCase();
                return (
                    data_length > 3 ? (
                        <div className="w-full">
                            <ButtonComponent
                                border={false}
                                className={"gap-5"}
                                onClick={() => {
                                    setDataInactivate(record?.idPaymentCycle);
                                    setModalActiveInactive(true);
                                    setStatus(record?.status);
                                }}
                                disabled={disabledActionByStatus("activate", record?.status, record?.statusApproval)}
                                type="action"
                            >
                                <Checkbox
                                    onClick={() => {
                                        setDataInactivate(record?.idPaymentCycle);
                                        setModalActiveInactive(true);
                                        setStatus(record?.status);
                                    }}
                                    checked={record?.status?.toUpperCase() !== "ACTIVE"}
                                    disabled={disabledActionByStatus("activate", record?.status, record?.statusApproval)}
                                />
                                <span className={"text-black ml-6 gap-2 text-center"}>
                                    {record?.status?.toUpperCase() === "ACTIVE" ? "Inactivate" : "Activate"}
                                </span>
                            </ButtonComponent>
                        </div>
                    ) : (
                        <Tooltip title={statusLowerCase === "active" ? "Inactivate" : "Activate"}>
                            <div>
                                <Checkbox
                                    checked={record?.status?.toUpperCase() !== "ACTIVE"}
                                    onClick={() => {
                                        setDataInactivate(record?.idPaymentCycle);
                                        setModalActiveInactive(true);
                                        setStatus(record?.status);
                                    }}
                                    disabled={disabledActionByStatus("activate", record?.status, record?.statusApproval)}
                                />
                            </div>
                        </Tooltip>
                    )
                );
            },
        },
        {
            // action open-close
            action: "update",
            type: "table",
            render: (record, data_length) => {
                const canOpenClose = record?.statusApproval?.toUpperCase() === "APPROVED" && record?.status?.toUpperCase() === "ACTIVE";
                const statusOpenLowerCase = record?.statusOpen?.toLowerCase();
                const label = statusOpenLowerCase === "open" ? "Close Cycle" : "Open Cycle";
                const iconName = statusOpenLowerCase === "open" ? "IconPaymentClose" : "IconPaymentOpen";
                const iconColor = !canOpenClose ? "#8D91A0" : (statusOpenLowerCase === "open" ? "#D90000" : "#0075bf");
                
                return (
                    data_length > 3 ? (
                        <ButtonComponent
                            className="gap-5"
                            icon={<SVGIcon name={iconName} color={iconColor} width={24} />}
                            border={false}
                            disabled={!canOpenClose}
                            onClick={() => {
                                if (canOpenClose) {
                                    setDataOpenClose(record?.idPaymentCycle);
                                    setModalOpenClose(true);
                                    setStatusOpen(record?.statusOpen?.toUpperCase());
                                    setOpenOrClose(statusOpenLowerCase === "open" ? "close" : "open");
                                }
                            }}
                            type="action"
                        >
                            <span className="text-black gap-2 text-center">
                                {label}
                            </span>
                        </ButtonComponent>
                    ) : (
                        <Tooltip title={label}>
                            <div
                                onClick={(e) => {
                                    if (!canOpenClose) {
                                        e.preventDefault();
                                        return;
                                    }
                                    setDataOpenClose(record?.idPaymentCycle);
                                    setModalOpenClose(true);
                                    setStatusOpen(record?.statusOpen?.toUpperCase());
                                    setOpenOrClose(statusOpenLowerCase === "open" ? "close" : "open");
                                }}
                                className={!canOpenClose ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                            >
                                <SVGIcon
                                    name={iconName}
                                    color={iconColor}
                                    width={24}
                                />
                            </div>
                        </Tooltip>
                    )
                );
            },
        },
        {
            action: "history",
            type: "table",
            render: (record, data_length) => {
                return (
                    data_length > 3 ? (
                        <ButtonComponent
                            className="gap-5"
                            icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />}
                            border={false}
                            onClick={() => handleApprovalHistory(record)}
                            type="action"
                        >
                            <span className={"text-black gap-2 text-center"}>
                                Approval History
                            </span>
                        </ButtonComponent>
                    ) : (
                        <Tooltip title={'Approval History'}>
                            <div onClick={() => handleApprovalHistory(record)} className="cursor-pointer">
                                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
                            </div>
                        </Tooltip>
                    )
                );
            },
        },
    ];

    const baseColumns = useMemo(
        () => [
            {
                title: "NO",
                key: "no",
                width: COLUMN_WIDTH.NO,
                align: "center",
                isClassification: true,
                render: (text, object, index) => index + 1,
            },
            {
                title: "PERIOD",
                dataIndex: "periodName",
                key: "periodName",
                align: "left",
                sorter: true,
                ...getColumnSearchPropsPaging(
                    "periodName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true
                ),
                render: (text) =>
                    renderColumn(
                        "periodName",
                        searchedColumn,
                        searchText,
                        text,
                        true,
                        "input",
                        search
                    ),
            },

            {
                title: "BEGIN CYCLE",
                dataIndex: "beginCycle",
                key: "beginCycle",
                align: "right",
                sorter: true,
                ...getColumnSearchPropsPaging(
                    "beginCycle",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true
                ),
                render: (text) =>
                    renderColumn(
                        "beginCycle",
                        searchedColumn,
                        searchText,
                        text,
                        true,
                        "input",
                        search
                    ),
            },
            {
                title: "END CYCLE",
                dataIndex: "endCycle",
                key: "endCycle",
                align: "right",
                sorter: true,
                ...getColumnSearchPropsPaging(
                    "endCycle",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true
                ),
                render: (text) =>
                    renderColumn(
                        "endCycle",
                        searchedColumn,
                        searchText,
                        text,
                        true,
                        "input",
                        search
                    ),
            },
            {
                title: "TIME UNIT",
                dataIndex: "timeUnit",
                key: "timeUnit",
                sorter: true,
                ...getColumnSearchPropsPaging(
                    "timeUnit",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true
                ),
                render: (text) =>
                    renderColumn(
                        "timeUnit",
                        searchedColumn,
                        searchText,
                        text,
                        true,
                        "input",
                        search
                    ),
            },
            {
                title: "START DATE",
                dataIndex: "startDate",
                key: "startDate",
                sorter: true,
                align: "center",
                ...getColumnSearchPropsPaging(
                    "startDate",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    false,
                    "date"
                ),
                render: (v) =>
                    renderDateColumn(
                        "startDate",
                        searchedColumn,
                        searchText,
                        v,
                        "date",
                        search
                    ),
            },
            {
                title: "END DATE",
                dataIndex: "endDate",
                key: "endDate",
                sorter: true,
                align: "center",
                ...getColumnSearchPropsPaging(
                    "endDate",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    false,
                    "date"
                ),
                render: (v) =>
                    renderDateColumn(
                        "endDate",
                        searchedColumn,
                        searchText,
                        v,
                        "date",
                        search
                    ),
            },
            {
                title: "APPHIER_ID",
                dataIndex: "appHierId",
                key: "appHierId",
                sorter: true,
                ...getColumnSearchPropsPaging(
                    "appHierId",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true
                ),
                render: (text) =>
                    renderColumn(
                        "appHierId",
                        searchedColumn,
                        searchText,
                        text,
                        true,
                        "input",
                        search
                    ),
            },
            {
                title: "DESCRIPTION",
                key: "description",
                dataIndex: "description",
                sorter: true,
                ellipsis: {
                    showTitle: false,
                },
                ...getColumnSearchPropsPaging(
                    "description",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    false
                ),
                render: (text) =>
                    renderColumn(
                        "description",
                        searchedColumn,
                        searchText,
                        text,
                        true,
                        "input",
                        search
                    ),
            },
            {
                title: "STATUS OPEN",
                dataIndex: "statusOpen",
                key: "statusOpen",
                width: COLUMN_WIDTH.STATUS_OPEN,
                sorter: true,
                fixed: "right",
                ...getColumnSearchPropsPaging(
                    "statusOpen",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    false
                ),
                render: (text) => (
                    <div className="flex justify-center">
                        <StatusComponent colour={text}>{text}</StatusComponent>
                    </div>
                ),
            },
            {
                title: "STATUS",
                dataIndex: "status",
                key: "status",
                width: COLUMN_WIDTH.STATUS,
                sorter: true,
                fixed: "right",
                ...getColumnSearchPropsPaging(
                    "status",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    false
                ),
                render: (text) =>
                    renderColumn(
                        "status",
                        searchedColumn,
                        searchText,
                        text ? text.toUpperCase() : text,
                        false,
                        "status"
                    ),
            },
            {
                title: "APPROVAL STATUS",
                dataIndex: "statusApproval",
                key: "statusApproval",
                width: COLUMN_WIDTH.STATUS_APPROVAL,
                sorter: true,
                fixed: "right",
                ...getColumnSearchPropsPaging(
                    "statusApproval",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    false
                ),
                render: (text) =>
                    renderColumn(
                        "status",
                        searchedColumn,
                        searchText,
                        text,
                        false,
                        "status",
                        search
                    ),
            },
        ],
        [search, searchText, searchedColumn, handleSearch, COLUMN_WIDTH]
    );

    const actionColsRaw = useColumnActionPermission(
        ["view", "update", "history", "activate"],
        itemActions
    );

    const actionCols = useMemo(
        () =>
            actionColsRaw.map((col) => ({
                ...col,
                key: col.action,
                width: COLUMN_WIDTH.ACTION,
                align: "center",
            })),
        [actionColsRaw, COLUMN_WIDTH]
    );

    const columns = useMemo(() => {
        const base = [
            ...baseColumns,
            ...actionCols
        ];
        return applyFixedColumns(base, fixedColumns);
    }, [baseColumns, actionCols, fixedColumns, COLUMN_WIDTH]);

    const columnDefinitions = useMemo(
        () =>
            columns.map((col) => ({
                key: col.key || col.dataIndex || col.title,
                title: col.title,
            })),
        [columns]
    );

    const routes = [
        { path: "", breadcrumbName: "System Setup" },
        { path: "", breadcrumbName: "Master Data" },
        {
            path: "/system-setup/payment-cycle",
            breadcrumbName: "Payment Cycle",
        },
    ];

    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer
                    header={
                        <div className="flex -my-4 justify-between items-center">
                            <p className="mt-[15px] font-bold">PAYMENT CYCLE LIST</p>
                            <div className="flex gap-2">
                                <Toolbar items={itemActions} />
                            </div>
                        </div>
                    }
                >
                    <TableRBI
                        idTable="payment-cycle-table"
                        size="small"
                        dataSource={data?.result}
                        loading={loading}
                        columns={columns}
                        onSort={onSort}
                        useInfiniteScroll={true}
                        hasMore={hasMore}
                        onLoadMore={handleLoadMore}
                        totalData={data?.page?.totalElements}
                        tableScrolled={{ x: "max-content", y: 525 }}
                        fixedColumns={fixedColumns}
                        setFixedColumns={setFixedColumns}
                        columnDefinitions={columnDefinitions}
                        handleDownload={handleDownload}
                        showExport={false}
                        showPaginationInfo={true}
                        paginationInfoRenderer={(total, loaded) => `Showing ${loaded} of ${total} records`}
                        usePagination={false}
                        showRefresh={true}
                        onRefresh={handleRefresh}
                        loadMoreThreshold={20}
                        onAdvanceSearch={handleAdvanceSearch}
                    />
                </CardContainer>
                <ModalActiveInactive
                    selector={"paymentCycle"}
                    dispatch={dispatch}
                    getAPIOption={getAllApprovalList}
                    getAPIDetail={getListApprovalById}
                    alertMessage={`Are you sure you want to inactivate this Payment Cycle?`}
                    openModalInactivate={modalActiveInactive}
                    handleCloseModalInactivate={handleCancelModalInactivate}
                    onFinish={handleSubmitModalInactivate}
                />
                <ModalApproveOrReject
                    handleCloseModal={handleCancelModalOpenClose}
                    onFinish={handleSubmitModalOpenClose}
                    header={openOrClose}
                    approveOrReject={openOrClose}
                    menu={"Payment Cycle"}
                    named={""}
                    isOpen={modalOpenClose}
                    customMessage={`Are you sure you want to ${statusOpen === "OPEN" ? "close" : "open"} this Payment Cycle?`}
                    width={850}
                />
                <ModalHistory
                    isOpen={openModalHistory}
                    handleClose={() => setOpenModalHistory(false)}
                    header={"Approval History"}
                    width={850}
                    tabOptions={handleOptions()}
                    dataApprover={dataApprovalHistoryFix?.dataApprover}
                    dataHistory={dataApprovalHistoryFix?.dataHistory}
                />
            </Spin>
        </>
    );
};

export default ListPaymentCycle;
