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
import { EyeOutlined } from "@ant-design/icons";
import {
    getListPaymentPeriod,
    inactivePaymentPeriod,
    getApprovalHistoryPaymentPeriod,
    getAllApprovalListPeriod,
    getListApprovalByIdPeriod,
    getDownloadPaymentPeriod,
    openClosePaymentPeriod
} from "../../../../../redux/slices/receipt_collection/paymentPeriod";
import {
    renderColumn,
    renderDateColumn,
    disabledActionByStatus,
} from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";

const ListPaymentPeriod = () => {
    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ["no"],
        right: ["status", "statusApproval", "action"],
    }));

    const COLUMN_WIDTH = {
        PERIOD_NAME: 180,
        DATE: 150,
        STATUS: 110,
        STATUS_APPROVAL: 160,
        ACTION: 60,
        NO: 60,
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
    const [statusOpen, setStatusOpen] = useState("");
    const [dataInactivate, setDataInactivate] = useState(null);
    const [modalOpenClose, setModalOpenClose] = useState(false);
    const [openOrClose, setOpenOrClose] = useState("");
    const [openModalHistory, setOpenModalHistory] = useState(false);
    const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

    const {
        loading,
        data,
        dataApprovalHistory,
    } = useSelector((state) => state.paymentPeriod);

    const searchKey = JSON.stringify(search);

    const handleFetch = useCallback(() => {
        const params = {
            page: 1,
            pageSize: initialPageSize,
            search: encodeURIComponent(searchKey),
            sort: sort,
            isLoadMore: false,
        };

        dispatch(getListPaymentPeriod(params));
    }, [dispatch, initialPageSize, searchKey, sort]);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    const hasMore = (data?.result?.length || 0) < (data?.page?.totalElements || 0);

    const handleLoadMore = async () => {
        if (!hasMore) return;
        const currentDataLength = data?.result?.length || 0;
        const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;
        await dispatch(
            getListPaymentPeriod({
                search: encodeURIComponent(searchKey),
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
                    create: dataApprovalHistory?.dataApprover?.PAYMENT_PERIOD || [],
                    inactive: dataApprovalHistory?.dataApprover?.INACTIVE_PAYMENT_PERIOD || [],
                },
                dataHistory: {
                    create: dataApprovalHistory?.dataHistory?.PAYMENT_PERIOD || [],
                    inactive: dataApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_PERIOD || [],
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
            await dispatch(getApprovalHistoryPaymentPeriod(record.idPaymentPeriod)).unwrap();
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
            idPaymentPeriod: dataInactivate,
            appHierId: res.approvalHierarchy,
            remark: res.remark,
            status: status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
        };
        dispatch(inactivePaymentPeriod(data))
            .unwrap()
            .then(() => {
                handleClear();
                handleCancelModalInactivate();
                handleFetch();
            });
    };

    const handleCancelModalOpenClose = () => {
        setDataInactivate(null);
        setModalOpenClose(false);
    };

    const handleSubmitModalOpenClose = (res, handleClear) => {
        const data = {
            id: dataInactivate,
            statusOpen: statusOpen === "OPEN" ? "CLOSE" : "OPEN",
            remark: res.remark,
        };
        dispatch(openClosePaymentPeriod(data))
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
        setSearchText(selectedKeys[0]);
        setSearchedColumn(selectedKeys[0] ? dataIndex : "");
        setSearch((prevState) => {
            const nextSearch = {
                ...prevState,
                [dataIndex]: selectedKeys[0],
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
        dispatch(getDownloadPaymentPeriod(params));
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
            getListPaymentPeriod({
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
                <Link to="/system-setup/payment-period/create">
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
                            to="/system-setup/payment-period/view"
                            state={{ id: record.idPaymentPeriod, statusApproval: record.statusApproval }}
                        >
                            <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
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
                            to="/system-setup/payment-period/update"
                            state={{ id: record.idPaymentPeriod }}
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
                                    to="/system-setup/payment-period/update"
                                    state={{ id: record.idPaymentPeriod }}
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
                                    setDataInactivate(record?.idPaymentPeriod);
                                    setModalActiveInactive(true);
                                    setStatus(record?.status);
                                }}
                                disabled={disabledActionByStatus("activate", record?.status, record?.statusApproval)}
                                type="action"
                            >
                                <Checkbox
                                    onClick={() => {
                                        setDataInactivate(record?.idPaymentPeriod);
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
                                        setDataInactivate(record?.idPaymentPeriod);
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

        {
            // action open-close
            action: "update",
            type: "table",
            render: (record, data_length) => {
                const canOpenClose = record?.statusApproval?.toUpperCase() === "APPROVED" && record?.status?.toUpperCase() === "ACTIVE";
                const statusOpenLowerCase = record?.statusOpen?.toLowerCase();
                const label = statusOpenLowerCase === "open" ? "Close Period" : "Open Period";
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
                                    setDataInactivate(record?.idPaymentPeriod);
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
                                    setDataInactivate(record?.idPaymentPeriod);
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
    ];

    const baseColumns = useMemo(
        () => [
            {
                title: "PERIOD NAME",
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
                title: "STATUS OPEN",
                dataIndex: "statusOpen",
                key: "statusOpen",
                width: 150,
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
            {
                title: "STATUS",
                dataIndex: "status",
                key: "status",
                width: 150,
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
                        text,
                        false,
                        "status",
                        search
                    ),
            },
            {
                title: "STATUS APPROVAL",
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
            {
                key: "no",
                title: "NO",
                width: COLUMN_WIDTH.NO,
                align: "center",
                isClassification: true,
                render: (text, object, index) => index + 1,
            },
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
            path: "/system-setup/payment-period",
            breadcrumbName: "Payment Period",
        },
    ];

    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer
                    header={
                        <div className="flex -my-4 justify-between items-center">
                            <p className="mt-[15px] font-bold">PAYMENT PERIOD LIST</p>
                            <div className="flex gap-2">
                                <Toolbar items={itemActions} />
                            </div>
                        </div>
                    }
                >
                    <TableRBI
                        idTable="payment-period-table"
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
                    selector={"paymentPeriod"}
                    dispatch={dispatch}
                    getAPIOption={getAllApprovalListPeriod}
                    getAPIDetail={getListApprovalByIdPeriod}
                    alertMessage={`Are you sure you want to inactivate this Payment Period?`}
                    openModalInactivate={modalActiveInactive}
                    handleCloseModalInactivate={handleCancelModalInactivate}
                    onFinish={handleSubmitModalInactivate}
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
                <ModalApproveOrReject
                    handleCloseModal={handleCancelModalOpenClose}
                    onFinish={handleSubmitModalOpenClose}
                    header={openOrClose}
                    approveOrReject={openOrClose}
                    menu={"Payment Period"}
                    named={""}
                    isOpen={modalOpenClose}
                    customMessage={`Are you sure you want to ${statusOpen === "OPEN" ? "close" : "open"} this Payment Period?`}
                    width={850}
                />
            </Spin>
        </>
    );
};

export default ListPaymentPeriod;
