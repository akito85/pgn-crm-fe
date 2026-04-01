import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { Link } from "react-router-dom";

// Routes
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import TableRBI from "../../../../../components/TableRBI";
import CardContainer from "../../../../../components/CardContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

// Column Configuration
import { columns as columnOffset } from "./Columns";

// Redux / Service
import {
    getAllOffsetListPaginate
} from "../../../../../redux/slices/receipt_collection/offset";

const ViewOffset = () => {
    const { data, loading } = useSelector(
        (state) => state.offset
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
            getAllOffsetListPaginate({
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
            path: DEBT_AND_COLLECTION_ROUTES.VIEW_OFFSET,
            breadcrumbName: "Offset",
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

    const baseColumns = useMemo(() => {
        return columnOffset(
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
                <Link to={DEBT_AND_COLLECTION_ROUTES.CREATE_OFFSET}>
                    <ButtonComponent
                        icon={<SVGIcon name="IconButtonCreate" width={24} />}
                        type="submit"
                    >
                        Create Offset
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
                            to={DEBT_AND_COLLECTION_ROUTES.DETAIL_OFFSET}
                            state={{ id: record?.id }}
                        >
                            <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
                        </Link>
                    </Tooltip>
                );
            },
        }
    ];

    const actionCols = useColumnActionPermission(
        ["view"],
        itemActions
    );

    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer header={
                    <div className="flex -my-4 justify-between items-center w-full">
                        <p className="mt-[15px] font-bold uppercase">Offset LIST</p>
                        <div className="flex gap-2">
                            <Link to={DEBT_AND_COLLECTION_ROUTES.CREATE_OFFSET}>
                                <ButtonComponent
                                    icon={<SVGIcon name="IconButtonCreate" width={24} />}
                                    type="primary"
                                >
                                    Create Offset
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
                            x: 2500,
                            y: 525,
                        }}
                    />
                </CardContainer>
            </Spin>
        </>
    );
};

export default ViewOffset;
