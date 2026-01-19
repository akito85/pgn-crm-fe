import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, message, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";

// Global Custom Components
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TableRBI from "../../../../components/TableRBI";
import CardContainer from "../../../../components/CardContainer";
import SVGIcon from "../../../../assets/Icon/index";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

// Column Configuration
import { columns as columnGapuraManagement } from "./Columns";

// Redux / Service
import {
    getAllGapuraManagementListPaginate,
    inactivateGapuraManagement,
    activateGapuraManagement,
    openGapuraManagement,
    closeGapuraManagement,
    downloadGapuraManagementList,
} from "../../../../redux/slices/receipt_collection/gapuraManagement";

// Routes
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";

const ViewGapuraManagement = () => {
    const { data, loading } = useSelector(
        (state) => state.gapuraManagement
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchInput = useRef(null);
    const dataSource = data?.result || [];

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        header: "",
        message: "",
        action: "",
        id: null,
        name: "",
    });

    useEffect(() => {
        dispatch(
            getAllGapuraManagementListPaginate({
                search: encodeURIComponent(JSON.stringify(search)),
                page,
                pageSize,
                sort,
            })
        );
    }, [search, page, pageSize, sort, dispatch]);

    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: "",
            breadcrumbName: "Gapura Management",
        },
    ];

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

    const handleChangePage = (pageChange, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    const onSort = (_, __, sorter) => {
        const dataSort =
            sorter.order !== undefined
                ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    const handleDetail = (record) => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.DETAIL_GAPURA_MANAGEMENT, { state: { id: record.id } });
    };

    const handleStatusChange = (record) => {
        if (record.status === "ACTIVE") {
            dispatch(inactivateGapuraManagement(record.id)).then(() => {
                message.success(`${record.paymentGateway} inactivated`);
                // Reload list to simulate change
                dispatch(getAllGapuraManagementListPaginate({ page, pageSize, search, sort }));
            });
        } else {
            dispatch(activateGapuraManagement(record.id)).then(() => {
                message.success(`${record.paymentGateway} activated`);
                dispatch(getAllGapuraManagementListPaginate({ page, pageSize, search, sort }));
            });
        }
    };

    const handleOpen = (record) => {
        dispatch(openGapuraManagement(record.id)).then(() => {
            message.success(`${record.paymentGateway} opened`);
        });
    };

    const handleClose = (record) => {
        dispatch(closeGapuraManagement(record.id)).then(() => {
            message.success(`${record.paymentGateway} closed`);
        });
    };

    const baseColumns = useMemo(() => {
        return columnGapuraManagement(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            search,
            handleDetail,
            handleStatusChange,
            handleOpen,
            handleClose
        );
    }, [
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        search,
    ]);

    const handleDownload = () => {
        dispatch(downloadGapuraManagementList({ page, pageSize, search, sort }));
    }

    const handleActionModal = (action, show, record = null) => {
        if (show && record) {
            let header = "";
            let message = "";
            let actionName = action;

            if (action === "inactivate") {
                const isActive = record.status === "ACTIVE" || record.status === "Active";
                header = isActive ? "INACTIVATE INFORMATION" : "ACTIVATE INFORMATION";
                message = isActive
                    ? `Are you sure you want to inactivate payment relation - ${record.paymentGateway}?`
                    : `Are you sure you want to activate payment relation - ${record.paymentGateway}?`;
                actionName = isActive ? "inactivate" : "activate";
            } else if (action === "open") {
                header = "OPEN INFORMATION";
                message = `Are you sure you want to open payment relation - ${record.paymentGateway}?`;
            } else if (action === "close") {
                header = "CLOSE INFORMATION";
                message = `Are you sure you want to close payment relation - ${record.paymentGateway}?`;
            }

            setModalConfig({
                isOpen: true,
                header,
                message,
                action: actionName,
                id: record.id,
                name: record.paymentGateway,
            });
        } else {
            setModalConfig({
                ...modalConfig,
                isOpen: false,
            });
        }
    };

    const itemActions = [
        // column action
        {
            action: "View",
            type: "table",
            render: (record, data_length) => {
                return data_length > 3 ? (
                    <div onClick={() => handleDetail(record)} style={{ cursor: 'pointer' }} className="flex items-center gap-2">
                        <SVGIcon name="IconDetail" width={24} />
                        <span>Detail</span>
                    </div>
                ) : (
                    <Tooltip title={"Detail"}>
                        <Link
                            // Ensure this route exists or use a placeholder if DETAIL_DEDUCTION is not yet defined
                            to={`${RECEIPT_AND_COLLECTION_ROUTES.VIEW_DEDUCTION}/detail/${record.id}`}
                            state={{ id: record?.id }}
                        >
                            <EyeOutlined />
                        </Link>
                    </Tooltip>
                );
            },
        },
        {
            action: "Inactivate",
            type: "table",
            render: (record, data_length) => {
                const isActive = record?.status === "ACTIVE" || record?.status === "Active";
                const isChecked = !isActive;

                const handleClick = () => {
                    handleActionModal("inactivate", true, record);
                };

                return data_length > 3 ? (
                    <div onClick={handleClick} style={{ cursor: 'pointer' }} className="flex items-center gap-2">
                        <Checkbox className="inactive-check" checked={isChecked} readOnly />
                        <span>Inactivate</span>
                    </div>
                ) : (
                    <Tooltip title={isActive ? "Inactivate" : "Activate"}>
                        <div className="pt-1">
                            <Checkbox
                                className="inactive-check"
                                checked={isChecked}
                                onClick={handleClick}
                            />
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            action: "Open",
            type: "table",
            render: (record, data_length) => {
                return data_length > 3 ? (
                    <div onClick={() => handleActionModal("open", true, record)} style={{ cursor: 'pointer' }} className="flex items-center gap-2">
                        <SVGIcon name="IconPaymentOpen" width={24} />
                        <span>Open</span>
                    </div>
                ) : (
                    <Tooltip title={"Open"}>
                        <div onClick={() => handleActionModal("open", true, record)} style={{ cursor: 'pointer' }}>
                            <SVGIcon name="IconPaymentOpen" width={24} />
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            action: "Close",
            type: "table",
            render: (record, data_length) => {
                return data_length > 3 ? (
                    <div onClick={() => handleActionModal("close", true, record)} style={{ cursor: 'pointer' }} className="flex items-center gap-2">
                        <SVGIcon name="IconPaymentClose" width={24} />
                        <span>Close</span>
                    </div>
                ) : (
                    <Tooltip title={"Close"}>
                        <div onClick={() => handleActionModal("close", true, record)} style={{ cursor: 'pointer' }}>
                            <SVGIcon name="IconPaymentClose" width={24} />
                        </div>
                    </Tooltip>
                );
            },
        }
    ];

    const actionCols = useColumnActionPermission(
        ["view", "open", "close", "inactivate"],
        itemActions,
        ""
    );

    const handleActionFinish = (remark, handleClear) => {
        const { action, id, name } = modalConfig;
        let thunk = null;

        if (action === "inactivate") thunk = inactivateGapuraManagement;
        else if (action === "activate") thunk = activateGapuraManagement;
        else if (action === "open") thunk = openGapuraManagement;
        else if (action === "close") thunk = closeGapuraManagement;

        if (thunk) {
            dispatch(thunk(id)).then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                    message.success(`${name} ${action}d successfully`);
                    handleActionModal(null, false);
                    handleClear();
                    dispatch(getAllGapuraManagementListPaginate({ page, pageSize, search, sort }));
                }
            });
        }
    }


    return (
        <LayoutMenu>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer header={
                    <div className="flex -my-4 justify-between items-center">
                        <p className="mt-[15px] font-bold">GAPURA MANAGEMENT LIST</p>
                    </div>
                }>
                    <TableRBI
                        dataSource={dataSource}
                        columns={[...baseColumns, ...actionCols]}
                        current={page}
                        pageSize={pageSize}
                        onChange={handleChangePage}
                        onSizeChanger={handleChangePage}
                        totalData={data?.page?.totalElements || 0}
                        onSort={onSort}
                        showExport={true}
                        handleDownload={handleDownload}
                        tableScrolled={{
                            x: 1000,
                            y: 525,
                        }}
                    />
                </CardContainer>

                <ModalApproveOrReject
                    isOpen={modalConfig.isOpen}
                    header={modalConfig.header}
                    handleCloseModal={() => handleActionModal(null, false)}
                    customMessage={modalConfig.message}
                    onFinish={({ remark }, handleClear) => handleActionFinish(remark, handleClear)}
                />


            </Spin>
        </LayoutMenu>
    );
};

export default ViewGapuraManagement;
