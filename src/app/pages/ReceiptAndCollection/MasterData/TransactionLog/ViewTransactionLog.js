import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
    getTransactionLogPaging,
    downloadTransactionLog,
} from "../../../../../redux/slices/receipt_collection/transactionLog";
import CardContainer from "../../../../../components/CardContainer";
import TableRBI from "../../../../../components/TableRBI";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { columns } from "./Column";
import {
  EyeOutlined,
} from "@ant-design/icons";

// Breadcrumbs
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
    path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSACTION_LOG,
    breadcrumbName: "Transaction Log",
  },
];

const ViewTransactionLog = () => {
    const dispatch = useDispatch();
    const { dataTransactionLog, loading = false } = useSelector(
        (state) => state.transactionLog
    );
    const searchInput = useRef(null);
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElement] = useState(0);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState({});
    const [sort, setSort] = useState("");
    const { data: dataUser = {} } = useSelector((state) => state.profile);

    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ["no"],
        right: ["statusApproval", "action"],
      }));

    const handleDownload = () => {
        dispatch(
            downloadTransactionLog({
                page,
                pageSize,
                search: encodeURIComponent(JSON.stringify(search)),
                sort,
            })
        );
    };

    const itemsActionView = () => [
        
    ];

    useEffect(() => {
        dispatch(
            getTransactionLogPaging({
                page,
                pageSize,
                search: encodeURIComponent(JSON.stringify(search)),
                sort,
            })
        );
    }, [dispatch, page, pageSize, search, sort]);

    useEffect(() => {
        if (dataTransactionLog) {
            let result = dataTransactionLog?.result || [];
            const totalData = dataTransactionLog?.page?.totalElements || 0;
            setDataTable(result);
            setTotalElement(totalData);
        }
    }, [dataTransactionLog]);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
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

    const handleChangeSize = (pageChange, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    const onSort = (_, __, sort) => {
        const dataSort = sort.order
            ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
            : "";
        setSort(dataSort);
    };

    return (
        <>
            <Spin
                spinning={loading || false}
                className={"w-full top-20"}
                tip={"Loading..."}
            >
                <BreadCrumb routes={routes} />
                <div className="flex flex-col w-full">
                    <Toolbar items={itemsActionView(dataUser)} />
                    <CardContainer header={"Transaction Log List"}>
                        <TableRBI
                            dataSource={dataTable}
                            totalData={totalElements}
                            current={page}
                            pageSize={pageSize}
                            tableScrolled={{ y: 525, x: "max-content" }}
                            onChange={handleChangeSize}
                            onSort={onSort}
                            columns={[
                                ...columns(
                                    search,
                                    page,
                                    pageSize,
                                    searchInput,
                                    searchedColumn,
                                    searchText,
                                    handleSearch,
                                    dataUser
                                ),
                                ...useColumnActionPermission(
                                    ["view"],
                                    itemsActionView(dataUser)
                                ),
                            ]}
                            showExport={true}
                            handleDownload={handleDownload}
                            fixedColumns={fixedColumns}
                            setFixedColumns={setFixedColumns}
                        />
                    </CardContainer>
                </div>
            </Spin>
        </>
    );
};

export default ViewTransactionLog;
