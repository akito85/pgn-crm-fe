import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { Spin, Tooltip, Alert, message, Input } from "antd";
import { Link } from "react-router-dom";

// Routes
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import TableRBI from "../../../../../components/TableRBI";
import CardContainer from "../../../../../components/CardContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

// Column Configuration
import { columns as columnRestructure } from "./Columns";

// Redux / Service
import {
    getAllRestructureListPaginate,
    deleteRestructure
} from "../../../../../redux/slices/receipt_collection/restructure";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

const ViewRestructure = () => {
    const { data, loading } = useSelector(
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
    const [search, setSearch] = useState({});
    const [modalDelete, setModalDelete] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [remark, setRemark] = useState("");

    useEffect(() => {
        dispatch(
            getAllRestructureListPaginate({
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
            breadcrumbName: "Bad Debt and Collection",
        },
        {
            path: DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE,
            breadcrumbName: "Restructure",
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

    const handleDownload = () => {
        // Implement download logic
    };

    const handleDeleteOk = () => {
        if (recordToDelete) {
            dispatch(deleteRestructure(recordToDelete.id)).then((res) => {
                if (!res.error) {
                    message.success("Successfully deleted!");
                    setModalDelete(false);
                    setRemark("");
                    dispatch(
                        getAllRestructureListPaginate({
                            search: encodeURIComponent(JSON.stringify(search)),
                            page,
                            pageSize,
                            sort,
                        })
                    );
                }
            });
        }
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
        // toolbar items
        {
            action: "Create",
            render: (
                <Link to={DEBT_AND_COLLECTION_ROUTES.CREATE_RESTRUCTURE}>
                    <ButtonComponent
                        icon={<SVGIcon name="IconButtonCreate" width={24} />}
                        type="submit"
                    >
                        Create Restructure
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
                            to={DEBT_AND_COLLECTION_ROUTES.DETAIL_RESTRUCTURE}
                            state={{ id: record?.id }}
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
            render: (record) => {
                return (
                    <Tooltip title={"Update"}>
                        <Link
                            to={DEBT_AND_COLLECTION_ROUTES.UPDATE_RESTRUCTURE}
                            state={{ id: record?.id }}
                        >
                            <SVGIcon name="IconEdit" width={24} color={"#ACC424"} />
                        </Link>
                    </Tooltip>
                );
            },
        },

        {
            action: "Delete",
            type: "table",
            render: (record) => {
                return (
                    <Tooltip title={"Delete"}>
                        <div onClick={() => {
                            setRecordToDelete(record);
                            setModalDelete(true);
                        }} style={{ cursor: 'pointer' }}>
                            <SVGIcon name="IconDelete" width={24} />
                        </div>
                    </Tooltip>
                );
            },
        }
    ];

    const actionCols = useColumnActionPermission(
        ["view", "update", "delete"],
        itemActions
    );

    return (
        <LayoutMenu>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer header={
                    <div className="flex -my-4 justify-between items-center w-full">
                        <p className="mt-[15px] font-bold">RESTRUCTURE LIST</p>
                        <div className="flex gap-2">
                            <Link to={DEBT_AND_COLLECTION_ROUTES.CREATE_RESTRUCTURE}>
                                <ButtonComponent
                                    icon={<SVGIcon name="IconButtonCreate" width={24} />}
                                    type="primary"
                                >
                                    Create Restructure
                                </ButtonComponent>
                            </Link>
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
                        tableScrolled={{
                            x: 2000,
                            y: 525,
                        }}
                    />
                </CardContainer>
            </Spin>

            <ModalCustom
                isOpen={modalDelete}
                handleCancel={() => {
                    setModalDelete(false);
                    setRemark("");
                }}
                header={"Delete Information"}
                width={1000}
                type={"confirmation"}
                footer={
                    <div className="w-full flex justify-end gap-3 p-4">
                        <ButtonComponent
                            onClick={() => {
                                setModalDelete(false);
                                setRemark("");
                            }}
                            type="default"
                            className="border-primary text-primary"
                        >
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            type="primary"
                            onClick={handleDeleteOk}
                        >
                            Confirm
                        </ButtonComponent>
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <Alert
                        message="Warning! if you delete this data, it will be permanently."
                        type={"error"}
                        showIcon={false}
                        className="bg-red-50 border-red-200 text-red-600 text-center"
                    />
                    <div className="flex flex-col gap-1">
                        <Input.TextArea
                            placeholder="Type your remark"
                            rows={4}
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            maxLength={255}
                        />
                        <div className="text-gray-400 text-[12px]">
                            You have {remark.length} of 255 characters remaining
                        </div>
                    </div>
                </div>
            </ModalCustom>
        </LayoutMenu>
    );
};

export default ViewRestructure;
