import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoicePagging, downloadInvoice
} from "../../../../../redux/slices/receipt_collection/invoice";
import BaseContainer from "../../../../../components/BaseContainer";
import CardContainer from "../../../../../components/CardContainer";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import TableRBI from "../../../../../components/TableRBI";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { columns } from "./Column";
import {
  DownloadOutlined,
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
    path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_INVOICE,
    breadcrumbName: "Invoice",
  },
];


const ViewInvoice = () => {
  const dispatch = useDispatch();
  const {
    dataInvoice,
    loading = false
  } = useSelector((state) => state.invoiceMasterData);
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
  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: ["action"],
  });

  const handleChangePage = (paginationPage) => {
    setPage(paginationPage);
  };

  const handleSizeChange = (current, size) => {
    setPage(1); // Reset ke hal 1 jika size berubah
    setPageSize(size);
  };

  const handleDownload = () => {
    dispatch(
      downloadInvoice({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      })
    );
  };


  const itemsActionView = () => [
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    }
  ];

  useEffect(() => {
    dispatch(
      getInvoicePagging({
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    if (dataInvoice) {
      let result = dataInvoice?.result || [];
      const totalData = dataInvoice?.page?.totalElements || 0;
      setDataTable(result);
      setTotalElement(totalData);
    }
  }, [dataInvoice]);

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
          <Toolbar
            items={itemsActionView(
              dataUser,
            )}
          />
          <CardContainer header={"Invoice List"}>
            <TableRBI
              idTable="invoice-table"
              dataSource={dataTable}
              totalData={totalElements}
              current={page}
              pageSize={pageSize}
              loading={loading}
              tableScrolled={{ y: 525, x: "max-content" }}

              onChange={handleChangePage}
              onSizeChanger={handleSizeChange}
              onSort={onSort}

              handleDownload={handleDownload}
              showExport={true}

              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}

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

              // Tambahan: Jika ingin menggunakan Advance Search
              onAdvanceSearch={(searchData) => setSearch(searchData)}
            />
          </CardContainer>
        </div>

      </Spin>
    </>
  );
};

export default ViewInvoice;
