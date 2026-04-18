import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, Popover } from "antd";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { debounce } from "lodash";


// Routes
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import TableRBI from "../../../../../components/TableRBI";
import CardContainer from "../../../../../components/CardContainer";
import Toolbar from "../../../../../components/Toolbar";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

// Column Configuration
import { columns as columnTransferToCustomer } from "./Columns";

// Modals
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";


// Redux / Service
import {
    getAllTransferToCustomerListPaginate,
    getApprovalHistoryTransferToCustomer,
    deleteTransferToCustomer,
    exportTransferToCustomerToExcel,
    clearApprovalHistory,
} from "../../../../../redux/slices/receipt_collection/transferToCustomer";


const ViewTransferToCustomer = () => {
    const { data, loading, loadingApproval, dataApprovalHistory } = useSelector(
        (state) => state.transferToCustomer
    );

    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const dataSource = data?.result || []; // Ensure array

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});

    const [openModalHistory, setOpenModalHistory] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        dispatch(
            getAllTransferToCustomerListPaginate({
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
            breadcrumbName: "Payment Warranty",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_CUSTOMER,
            breadcrumbName: "Transfer To Customer",
        },
    ];

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(selectedKeys[0] ? dataIndex : "");
        const shouldResetPage = search[dataIndex] !== selectedKeys[0];
        setSearch((prevState) => {
            const nextState = { ...prevState };
            nextState[dataIndex] = selectedKeys[0];
            return nextState;
        });
        if (shouldResetPage) {
            setPage(1);
        }
    };

    const handleGlobalSearch = useCallback(
        debounce((value) => {
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
        setSearch(simpleSearch);
        setPage(1);
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

    const handleDownload = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            await dispatch(
                exportTransferToCustomerToExcel({
                    search: encodeURIComponent(JSON.stringify(search)),
                    page,
                    pageSize,
                    sort,
                })
            ).unwrap();
        } catch (error) {
            // Error sudah di-handle di thunk
        } finally {
            setIsExporting(false);
        }
    };

    const handleHistory = (record) => {
        setSelectedRecord(record);
        setOpenModalHistory(true);
        dispatch(getApprovalHistoryTransferToCustomer(record.id));
    };

    const handleDelete = (record) => {
        setSelectedRecord(record);
        setOpenModalDelete(true);
    };

    const handleConfirmDelete = () => {
        setOpenModalDelete(false);
        setSelectedRecord(null);
        dispatch(deleteTransferToCustomer(selectedRecord.id)).unwrap()
            .then(() => {
                dispatch(
                    getAllTransferToCustomerListPaginate({
                        search: encodeURIComponent(JSON.stringify(search)),
                        page,
                        pageSize,
                        sort,
                    })
                );
            });
    };


    const handleDetail = (record) => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.DETAIL_TRANSFER_TO_CUSTOMER, { state: { id: record?.id } });
    };


    const baseColumns = useMemo(() => {
        return columnTransferToCustomer(
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
        {
            action: "Download",
            render: (
                <ButtonComponent
                    type="submit"
                    onClick={handleDownload}
                    loading={isExporting}
                    disabled={isExporting}
                    icon={<SVGIcon name="IconButtonDownload" width={24} />}
                >
                    Download List
                </ButtonComponent>
            ),
        },
        {
            action: "Create",
            render: (
                <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_TRANSFER_TO_CUSTOMER}>
                    <ButtonComponent
                        type="submit"
                        icon={<SVGIcon name="IconButtonCreate" width={24} />}
                    >
                        Create Transfer to Customer
                    </ButtonComponent>
                </NavLink>
            ),
        },


        // column action
        {
            action: "View",
            type: "table",
            render: (record) => (
                <Tooltip title="Detail">
                    <div 
                        className="cursor-pointer" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDetail(record);
                        }}
                    >
                        <SVGIcon name="IconDetail" width={24} color={"#0075bf"} />
                    </div>
                </Tooltip>
            ),
        },
        {
            action: "Delete",
            type: "table",
            label: "Delete",
            icon: "IconDelete",
            color: "#BE3036",
            onClick: handleDelete
        },
        {
            action: "History",
            type: "table",
            label: "Approval History",
            icon: "IconLogHistory",
            color: "#000",
            onClick: handleHistory
        }
    ];

    const actionCols = useMemo(() => {
        const tableActions = itemActions.filter(item => item.type === "table");
        const detailAction = tableActions.find(a => a.action === "View");
        const otherActions = tableActions.filter(a => a.action !== "View");

        return [
            {
                key: "action",
                title: "ACTION",
                width: 150,
                fixed: "right",
                align: "center",
                render: (_, record) => (
                    <div className="flex justify-center items-center gap-4">
                        {otherActions.length > 0 && (
                            <Popover
                                trigger="click"
                                placement="bottomRight"
                                showArrow={false}
                                content={
                                    <div className="flex flex-col gap-2">
                                        {otherActions.map(action => (
                                            <div 
                                                key={action.action}
                                                className="cursor-pointer flex items-center gap-2" 
                                                style={{ color: action.color }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    action.onClick(record);
                                                }}
                                            >
                                                <SVGIcon name={action.icon} width={18} color={action.color} />
                                                <span>{action.label}</span>
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
                        {detailAction && detailAction.render(record)}
                    </div>
                ),
            }
        ];
    }, [itemActions]);



    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer header={
                    <div className="flex -my-4 justify-between items-center">
                        <p className="mt-[15px] font-bold">TRANSFER TO CUSTOMER</p>
                        <div className="flex gap-2">
                            <Toolbar items={itemActions} />
                        </div>



                    </div>
                }>
                    <TableRBI
                        dataSource={dataSource} // Safe array
                        columns={[...baseColumns, ...actionCols]}
                        current={page}
                        pageSize={pageSize}
                        onChange={handleChangePage}
                        onSizeChanger={handleChangePage}
                        totalData={data?.page?.totalElements || 0}
                        onSort={onSort}
                        showExport={true}
                        showSearchBar={true}
                        showAdvanceSearch={true}
                        onSearch={(e) => handleGlobalSearch(e.target.value)}
                        onAdvanceSearch={handleAdvanceSearch}
                        handleDownload={handleDownload}
                        tableScrolled={{
                            x: 'max-content',
                            y: 525,
                        }}

                    />
                </CardContainer>

                <ModalHistory
                    isOpen={openModalHistory}
                    handleClose={() => {
                        setOpenModalHistory(false);
                        dispatch(clearApprovalHistory());
                    }}
                    header={
                        <div className="flex items-center gap-2">
                            <span>Approval History</span>
                        </div>
                    }
                    dataApprover={dataApprovalHistory?.dataApprover ? (Object.values(dataApprovalHistory.dataApprover)[0] || []) : []}
                    dataHistory={dataApprovalHistory?.dataHistory ? (Object.values(dataApprovalHistory.dataHistory)[0] || []) : []}
                    loading={loadingApproval}
                />

                <ModalConfirm
                    isOpen={openModalDelete}
                    handleCancel={() => setOpenModalDelete(false)}
                    handleOk={handleConfirmDelete}
                >
                    <div className="flex flex-col items-center gap-4">
                        <SVGIcon name="IconFailed" width={64} />
                        <p className="text-center font-bold text-lg">Are you sure want to delete this data?</p>
                    </div>
                </ModalConfirm>
            </Spin>
        </>
    );
};


export default ViewTransferToCustomer;
