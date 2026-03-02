import {
    Tooltip,
    Spin,
    Checkbox,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
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
} from "../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalHistory from "../../../../../components/Modal/ModalHistory";

const ListPaymentPeriod = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchInput = useRef(null);

    // State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [search, setSearch] = useState({});
    const [sort, setSort] = useState("");

    // Modal States
    const [modalActiveInactive, setModalActiveInactive] = useState(false);
    const [modalOpenClose, setModalOpenClose] = useState(false);
    const [status, setStatus] = useState("");
    const [statusOpen, setStatusOpen] = useState("");
    const [dataInactivate, setDataInactivate] = useState(null);
    const [openModalHistory, setOpenModalHistory] = useState(false);
    const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

    const {
        loading,
        data,
        dataApprovalHistory,
    } = useSelector((state) => state.paymentPeriod);

    const handleFetch = useCallback(() => {
        const params = {
            page: page,
            pageSize: pageSize,
            search: encodeURIComponent(JSON.stringify(search)),
            sort: sort,
        };

        dispatch(getListPaymentPeriod(params));
    }, [dispatch, page, pageSize, JSON.stringify(search), sort]);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

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
            if (prevState[dataIndex] !== selectedKeys[0]) {
                setPage(1);
            }
            return {
                ...prevState,
                [dataIndex]: selectedKeys[0],
            };
        });
    };

    const handleChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
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
            page: page,
            pageSize: pageSize,
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
    };

    const itemActions = [
        // toolbar items
        {
            action: "Create",
            render: (
                <div className="flex gap-3">
                    <ButtonComponent
                        type="primary"
                        icon={<SVGIcon name="IconDownload" width={18} height={20} color="white" />}
                        onClick={handleDownload}
                        label="Download List"
                    >
                        Download List
                    </ButtonComponent>
                    <ButtonComponent
                        icon={<SVGIcon name="IconButtonCreate" width={24} />}
                        type="submit"
                        onClick={() => navigate("/system-setup/payment-period/create")}
                    >
                        Create
                    </ButtonComponent>
                </div>
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
                            <EyeOutlined style={{ fontSize: "24px" }} />
                        </Link>
                    </Tooltip>
                );
            },
        },

        {
            action: "Update",
            type: "table",
            render: (record, data_length) => {
                const isEditable = record.status?.toUpperCase() === "DRAFT" || record.statusApproval?.toUpperCase() === "REJECTED";
                return (
                    data_length > 3 ? (
                        <Link
                            to={isEditable ? "/system-setup/payment-period/update" : "#"}
                            state={{ id: record.idPaymentPeriod }}
                        >
                            <ButtonComponent
                                className="gap-5 w-full"
                                icon={
                                    <SVGIcon name="IconEdit" width={24} color={isEditable ? "#0075bf" : "#8D91A0"} />
                                }
                                border={false}
                                disabled={!isEditable}
                            >
                                <span className={"text-black gap-2 text-xl text-center w-full"}>
                                    Update
                                </span>
                            </ButtonComponent>
                        </Link>
                    ) : (
                        <Tooltip title={isEditable ? "Update" : "Update Disabled"}>
                            <Link
                                to={isEditable ? "/system-setup/payment-period/update" : "#"}
                                state={{ id: record.idPaymentPeriod }}
                            >
                                <div border={false}>
                                    <SVGIcon
                                        name="IconEdit"
                                        color={isEditable ? "#ACC424" : "#8D91A0"}
                                        width={24}
                                        className={isEditable ? undefined : "cursor-not-allowed"}
                                    />
                                </div>
                            </Link>
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
                const isActivateOrInactivate =
                    (record.statusApproval === "APPROVED" && record.status === "ACTIVE") ||
                    (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
                    (record.statusApproval === "REJECTED" && record.status === "ACTIVE") ||
                    (record.statusApproval === "WAITING_APPROVAL" && record.status === "ACTIVE");

                return (
                    data_length > 3 ? (
                        <ButtonComponent
                            border={false}
                            onClick={() => {
                                setDataInactivate(record?.idPaymentPeriod);
                                setModalActiveInactive(true);
                                setStatus(record?.status);
                            }}
                            disabled={!isActivateOrInactivate}
                        >
                            <Checkbox
                                border={false}
                                disabled={record?.status !== "ACTIVE"}
                                checked={record?.status !== "ACTIVE"}
                            />
                            <span className={"text-black ml-6 gap-2 text-xl text-center w-full"}>
                                {record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
                            </span>
                        </ButtonComponent>
                    ) : (
                        <Tooltip title={statusLowerCase === "active" ? "Inactivate" : "Activate"}>
                            <div>
                                <Checkbox
                                    border={false}
                                    onClick={() => {
                                        setDataInactivate(record?.idPaymentPeriod);
                                        setModalActiveInactive(true);
                                        setStatus(record?.status);
                                    }}
                                    checked={record?.status !== "ACTIVE"}
                                    disabled={record?.status !== "ACTIVE"}
                                />
                            </div>
                        </Tooltip>
                    )
                );
            },
        },
        {
            action: "Open/Close",
            type: "table",
            render: (record, data_length) => {
                const isActivateOrInactivate = record.statusApproval === "APPROVED" && record.status === "ACTIVE";
                const statusOpenLowerCase = record?.statusOpen?.toLowerCase();

                return (
                    data_length > 3 ? (
                        <ButtonComponent
                            className="gap-5 w-full"
                            icon={<SVGIcon name="IconEdit" color={isActivateOrInactivate ? "#0075bf" : "#8D91A0"} width={24} />}
                            disabled={!isActivateOrInactivate}
                            border={false}
                            onClick={() => {
                                setDataInactivate(record?.idPaymentPeriod);
                                setModalOpenClose(true);
                                setStatusOpen(record?.statusOpen?.toUpperCase());
                            }}
                        >
                            <span className={"text-black gap-2 text-xl text-center w-full"}>
                                {statusOpenLowerCase === "open" ? "Close Period" : "Open Period"}
                            </span>
                        </ButtonComponent>
                    ) : (
                        <Tooltip title={statusOpenLowerCase === "open" ? "Close Period" : "Open Period"}>
                            <button
                                type="button"
                                style={{ outline: 'none', cursor: isActivateOrInactivate ? 'pointer' : 'not-allowed', background: 'none', border: 'none', padding: 0 }}
                                disabled={!isActivateOrInactivate}
                                onClick={() => {
                                    setDataInactivate(record?.idPaymentPeriod);
                                    setModalOpenClose(true);
                                    setStatusOpen(record?.statusOpen?.toUpperCase());
                                }}
                            >
                                <SVGIcon name="IconEdit" color={isActivateOrInactivate ? "#0075bf" : "#8D91A0"} width={24} />
                            </button>
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
                        >
                            <span className={"text-black gap-2 text-xl text-center"}>
                                Approval History
                            </span>
                        </ButtonComponent>
                    ) : (
                        <Tooltip title={'Approval History'}>
                            <button
                                type="button"
                                style={{ outline: 'none', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleApprovalHistory(record);
                                    }
                                }}
                                onClick={() => handleApprovalHistory(record)}
                            >
                                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
                            </button>
                        </Tooltip>
                    )
                );
            },
        },
    ];

    const columns = [
        {
            title: "NO",
            key: "no",
            width: 60,
            dataIndex: "key",
            align: "center",
            isClassification: true,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
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
                    "statusOpen",
                    searchedColumn,
                    searchText,
                    text ? text.toUpperCase() : text,
                    false,
                    "status"
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
                    text ? text.toUpperCase() : text,
                    false,
                    "status"
                ),
        },
        {
            title: "APPROVAL STATUS",
            dataIndex: "statusApproval",
            key: "statusApproval",
            width: 200,
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
                    "statusApproval",
                    searchedColumn,
                    searchText,
                    text ? text.toUpperCase() : text,
                    false,
                    "status"
                ),
        },
    ];

    const routes = [
        {
            path: "",
            breadcrumbName: "System Setup",
        },
        {
            path: "",
            breadcrumbName: "Master Data",
        },
        {
            path: "",
            breadcrumbName: "Payment Period",
        },
    ];

    return (
        <LayoutMenu>
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
                        dataSource={data?.result}
                        pageSize={pageSize}
                        showExport={false}
                        columns={[
                            ...columns,
                            ...useColumnActionPermission(
                                ["view", "update", "history", "activate", "Open/Close"],
                                itemActions
                            ),
                        ]}
                        current={page}
                        onChange={handleChange}
                        onSizeChanger={handleChange}
                        totalData={data?.page?.totalElements}
                        onSort={onSort}
                        tableScrolled={{
                            x: "max-content",
                            y: 525,
                        }}
                        onAdvanceSearch={handleAdvanceSearch}
                    />
                </CardContainer>
                <ModalInactivateWithHierarchy
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
                <ModalInactivateWithHierarchy
                    selector={"paymentPeriod"}
                    dispatch={dispatch}
                    getAPIOption={getAllApprovalListPeriod}
                    getAPIDetail={getListApprovalByIdPeriod}
                    alertMessage={`Are you sure you want to ${statusOpen === "OPEN" ? "CLOSE" : "OPEN"} this Payment Period?`}
                    openModalInactivate={modalOpenClose}
                    handleCloseModalInactivate={handleCancelModalOpenClose}
                    onFinish={handleSubmitModalOpenClose}
                />
            </Spin>
        </LayoutMenu>
    );
};

export default ListPaymentPeriod;
