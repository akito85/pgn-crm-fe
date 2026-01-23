import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { Spin, Alert, Tooltip } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import SVGIcon from "../../../../../assets/Icon/index";
import BaseContainer from "../../../../../components/BaseContainer";
import { INVOICE_ROUTES } from "../../../../../routes/invoice/invoice_routes";
import { WarningOutlined } from "@ant-design/icons";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";
import TableRBI from "../../../../../components/TableRBI";
import { columnsAdjustmentInvoice } from "./Table/TableAdjustmentInvoice";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import {
  getInvoiceAdjustmentPaginate,
  getApprovalHistoryInvoiceAdjustment,
  downloadInvoiceAdjustment,
  deleteInvoiceAdjustment,
} from "../../../../../redux/slices/rating_billing_invoice/adjustmentInvoice";

const AdjustmentInvoicePage = () => {
  // Selector
  const { data, pagination, loading } = useSelector(
    (state) => state.adjustmentInvoice,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20); // Load 20 data each time
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [idDelete, setIdDelete] = useState();

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["statusApproval", "action"],
  }));

  // Handle Refresh
  const handleRefresh = useCallback(() => {
    const searchArray = Object.keys(search)
      .filter((key) => search[key])
      .map((key) => `${key}~${search[key]}`);

    const sortArray = sort ? [sort] : [];

    dispatch(
      getInvoiceAdjustmentPaginate({
        page: 1,
        size: 100, // Initial load 100 data
        sort: sortArray,
        search: searchArray,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, search, sort]);

  // Use Effect - Initial fetch dengan 100 data
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Function Search Column - Reset page ke 1 saat search
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

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage <= totalPages) {
      const searchArray = Object.keys(search)
        .filter((key) => search[key])
        .map((key) => `${key}~${search[key]}`);

      const sortArray = sort ? [sort] : [];

      await dispatch(
        getInvoiceAdjustmentPaginate({
          page: nextPage,
          size: loadMoreSize, // Load 20 more
          sort: sortArray,
          search: searchArray,
          isLoadMore: true,
        }),
      );
      setPage(nextPage);
    }
  };

  // Get current data from Redux state with default empty array
  const currentData = useMemo(() => {
    return data || [];
  }, [data]);

  // Calculate if there's more data
  const hasMore = currentData.length < (pagination?.totalElements || 0);

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.ADJUSTMENT_INVOICE_VIEW,
      breadcrumbName: "Adjustment Invoice",
    },
  ];

  // Handle Download
  const handleDownload = () => {
    const searchArray = Object.keys(search)
      .filter((key) => search[key])
      .map((key) => `${key}~${search[key]}`);

    const sortArray = sort ? [sort] : [];

    dispatch(
      downloadInvoiceAdjustment({
        page: 1,
        size: pagination?.totalElements || 1000,
        sort: sortArray,
        search: searchArray,
      }),
    );
  };

  // Handle Delete
  const handleDelete = (id) => {
    setModalDelete(true);
    setIdDelete(id);
  };

  // Handle Cancel Modal Confirmation Delete
  const handleCancel = () => {
    setIdDelete();
    setModalDelete(false);
  };

  // Handle Delete OK
  const handleDeleteOk = async () => {
    try {
      await dispatch(deleteInvoiceAdjustment(idDelete)).unwrap();
      setModalDelete(false);
      handleCancel();
      // Refresh the list after successful deletion
      handleRefresh();
    } catch (error) {
      // Error is already handled by Redux slice (showModalError)
      setModalDelete(false);
    }
  };

  // Handle Approval History
  const handleApprovalHistory = async (id) => {
    const result = await dispatch(getApprovalHistoryInvoiceAdjustment(id));
    if (result.payload) {
      // Extract nested data structure
      const dataHistory = result.payload.dataHistory?.apr_inv_adjustment || [];
      const dataApprover =
        result.payload.dataApprover?.apr_inv_adjustment || [];

      setDataApprovalHistory({
        dataHistory,
        dataApprover,
      });
      setModalApprovalHistory(true);
    }
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          type="submit"
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={INVOICE_ROUTES.ADJUSTMENT_INVOICE_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
          >
            Generate Adjustment Invoice
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        const content =
          data > 3 ? (
            <Link
              to={INVOICE_ROUTES.ADJUSTMENT_INVOICE_DETAIL}
              state={{ id: record.id }}
            >
              <ButtonComponent
                icon={<SVGIcon name="IconDetail" width={20} />}
                border={false}
              >
                <span className={"text-black ml-3"}> Detail</span>
              </ButtonComponent>
            </Link>
          ) : (
            <Link
              to={INVOICE_ROUTES.ADJUSTMENT_INVOICE_DETAIL}
              state={{ id: record.id }}
            >
              <Tooltip title="Detail">
                <div className="">
                  <SVGIcon name="IconDetail" width={20} />
                </div>
              </Tooltip>
            </Link>
          );

        return content;
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";

        const content =
          data > 3 ? (
            isEditable ? (
              <Link
                to={INVOICE_ROUTES.ADJUSTMENT_INVOICE_UPDATE}
                state={{
                  id: record.invAdjustmentId,
                  invoiceNumber: record.invoiceNumber,
                }}
              >
                <ButtonComponent
                  icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
                  border={false}
                >
                  <span className="text-black ml-3"> Update</span>
                </ButtonComponent>
              </Link>
            ) : (
              <div className="flex items-center cursor-not-allowed px-3 py-1">
                <span className="pointer-events-none">
                  <SVGIcon name="IconEdit" color="#8D91A0" width={24} />
                </span>
                <span className="text-gray-400 ml-3 pointer-events-none">
                  {" "}
                  Update
                </span>
              </div>
            )
          ) : isEditable ? (
            <Tooltip title="Update">
              <Link
                to={INVOICE_ROUTES.ADJUSTMENT_INVOICE_UPDATE}
                state={{
                  id: record.invAdjustmentId,
                  invoiceNumber: record.invoiceNumber,
                }}
              >
                <SVGIcon name="IconEdit" width={24} color="#ACC424" />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Update">
              <div className="cursor-not-allowed">
                <span className="pointer-events-none">
                  <SVGIcon name="IconEdit" width={24} color="#8D91A0" />
                </span>
              </div>
            </Tooltip>
          );

        return content;
      },
    },
    {
      action: "Delete",
      type: "table",
      render: (record) => {
        const isDelete =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";

        return (
          <Tooltip title="Delete">
            <div className="">
              <SVGIcon
                name="IconDelete"
                width={20}
                color={isDelete ? "#D90000" : "#8D91A0"}
                className={isDelete ? undefined : "disabled cursor-not-allowed"}
                onClick={isDelete ? () => handleDelete(record.id) : undefined}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record.id)}
            >
              <span className={"text-black ml-3"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div className="">
                <SVGIcon
                  name="IconLogHistory"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => handleApprovalHistory(record.id)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view", "update", "delete", "history"],
    itemGrantAccess,
    "Delete",
  ).map((col) => ({
    ...col,
    width: 70,
    align: "center",
  }));

  const baseColumns = useMemo(() => {
    return columnsAdjustmentInvoice(
      0, // Tidak digunakan untuk infinite scroll
      0, // Tidak digunakan untuk infinite scroll
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
    );
  }, [searchInput, searchedColumn, searchText, search]);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  // Map data to include keys for table rendering
  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: item.invAdjustmentId || item.invoiceNumber || index,
      id: item.invAdjustmentId,
    }));
  }, [currentData]);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">
              ADJUSTMENT INVOICE LIST
            </p>

            <Toolbar items={itemGrantAccess} />
          </div>
        }
      >
        <div className="w-full">
          <TableRBI
            key={`adjustment-invoice-${page}-${currentData.length}`}
            idTable="adjustment-invoice-table"
            showExport={false}
            dataSource={dataSourceWithKeys}
            columns={processedColumns}
            totalData={pagination?.totalElements || 0}
            onSort={onSort}
            handleDownload={handleDownload}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loadMoreThreshold={20}
            tableScrolled={{ y: 525, x: 5000 }}
            onRefresh={handleRefresh}
            showRefresh={true}
          />
        </div>
      </CardContainer>

      {/* Modal Delete */}
      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDeleteOk}
        width={500}
        // useOk={true}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            {`Are you sure want to delete it?`}
          </p>
        </div>
        <Alert
          message="Warning! if you delete this data, it will be permanently."
          type={"error"}
        />
      </ModalConfirm>

      {/* Modal Approval History */}
      <ModalHistory
        isOpen={modalApprovalHistory && dataApprovalHistory}
        handleClose={() => setModalApprovalHistory(false)}
        header={"Approval History"}
        width={1000}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
      />
    </LayoutMenu>
  );
};

export default AdjustmentInvoicePage;
