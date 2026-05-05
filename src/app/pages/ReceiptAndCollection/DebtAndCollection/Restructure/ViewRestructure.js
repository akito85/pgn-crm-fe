import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeOutlined, UnorderedListOutlined, DownloadOutlined } from "@ant-design/icons";
import { Spin, Tooltip, Alert, message, Input, Popover } from "antd";
import { Link, useNavigate } from "react-router-dom";

// Routes
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";

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
    getApprovalHistory
} from "../../../../../redux/slices/receipt_collection/restructure";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalApprovalRestructure from "./Modal/ModalApprovalRestructure";
import ListDetailRestructure from "./ListDetailRestructure";

const ViewRestructure = () => {
    const navigate = useNavigate();
    const { data, loading, dataApprovalHistory } = useSelector(
        (state) => state.restructure
    );

    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const dataSource = data?.result || []; // Ensure array

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [modalHistory, setModalHistory] = useState(false);
    const [modalApproval, setModalApproval] = useState(false);
    const [search, setSearch] = useState({});

    const handleRefresh = () => {
        dispatch(
            getAllRestructureListPaginate({
                search: encodeURIComponent(JSON.stringify(search)),
                page,
                pageSize,
                sort,
            })
        );
    };

    useEffect(() => {
        handleRefresh();
    }, [search, page, pageSize, sort, dispatch]);

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

    const handleDownload = () => {
        // Implement download logic
    };


    const baseColumns = useMemo(() => {
        return columnRestructure(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            search
        );
    }, [
        page,
        pageSize,
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
                                setSelectedId(record?.id === selectedId ? null : record?.id);
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
                const disabled = (status !== "DRAFT" && status !== "REJECTED");
                
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
                return (
                    <ButtonComponent
                        border={false}
                        className="gap-2 !justify-start hover:bg-gray-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(DEBT_AND_COLLECTION_ROUTES.CREATE_EARLY_REPAYMENT, { state: { id: record?.id } });
                        }}
                        type="text"
                        icon={<SVGIcon name="IconEarlyRepayment" width={16} color={"#000"} />}
                    >
                        <span className="text-black">Early Repayment</span>
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
        {
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
        const tableActions = itemActions.filter(item => item.type === "table" && permissions.includes(item.action.toLowerCase()));

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
                                    <div className="cursor-pointer p-2 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
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
                        dataSource={dataSource}
                        showExport={true}
                        handleDownload={handleDownload}
                        columns={[...baseColumns, ...actionCols]}
                        current={page}
                        pageSize={pageSize}
                        onChange={handleChangePage}
                        onSizeChanger={handleChangePage}
                        totalData={data?.page?.totalElements || 0}
                        onSort={onSort}
                        onRow={(record) => ({
                            onClick: () => setSelectedId(record?.id === selectedId ? null : record?.id),
                        })}
                        tableScrolled={{
                            x: 6500,
                            y: 525,
                        }}
                    />
                </CardContainer>

                {selectedId && (
                    <div className="mt-8">
                        <ListDetailRestructure 
                            selectedId={selectedId} 
                            onClose={() => setSelectedId(null)} 
                        />
                    </div>
                )}

                <ModalHistory
                    isOpen={modalHistory}
                    handleClose={() => setModalHistory(false)}
                    header="APPROVAL HISTORY"
                    tabOptions={[
                        { label: "Payment Plan", value: "payment_plan" },
                        { label: "Early Repayment", value: "early_repayment" },
                    ]}
                    dataApprover={{
                        payment_plan: dataApprovalHistory?.payment_plan?.dataApprover || [],
                        early_repayment: dataApprovalHistory?.early_repayment?.dataApprover || []
                    }}
                    dataHistory={{
                        payment_plan: dataApprovalHistory?.payment_plan?.dataHistory || [],
                        early_repayment: dataApprovalHistory?.early_repayment?.dataHistory || []
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
