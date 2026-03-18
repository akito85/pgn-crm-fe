import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { NavLink, Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";

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

// Redux / Service
import {
    getAllTransferToCustomerListPaginate,
} from "../../../../../redux/slices/receipt_collection/transferToCustomer";

const ViewTransferToCustomer = () => {
    const { data, loading } = useSelector(
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
        // Implement download logic if needed
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
        // toolbar items
        {
            action: "Create",
            render: (
                <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_TRANSFER_TO_CUSTOMER}>
                    <ButtonComponent
                        // icon={<SVGIcon name="IconButtonCreate" width={24} />} // Suspense suspect
                        type="submit"
                    >
                        Create Transfer To Customer
                    </ButtonComponent>
                </NavLink>
            ),
        },

        // column action
        {
            action: "View",
            type: "table",
            render: (record, data_length) => {
                return (
                    <Tooltip title={"Detail"}>
                        <Link
                            to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_TRANSFER_TO_CUSTOMER}
                            state={{ id: record?.id }}
                        >
                            <EyeOutlined />
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
                        <div onClick={() => console.log('Delete', record)} style={{ cursor: 'pointer' }}>
                            <SVGIcon name="IconDelete" width={24} />
                        </div>
                    </Tooltip>
                );
            },
        }
    ];

    const actionCols = useColumnActionPermission(
        ["view", "delete"],
        itemActions
    );

    return (
        <div>
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
                        handleDownload={handleDownload}
                        tableScrolled={{
                            x: 2500,
                            y: 525,
                        }}
                    />
                </CardContainer>
            </Spin>
        </div>
    );
};

export default ViewTransferToCustomer;
