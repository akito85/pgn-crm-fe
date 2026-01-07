import React, { useState, useEffect, useRef, useMemo } from "react";
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
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const AdjustmentInvoicePage = () => {
  // Selector - Placeholder for Redux state
  const loading = false;
  const data = { result: [], page: { totalElements: 0 } };

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20); // Load 20 data each time
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [idDelete, setIdDelete] = useState();

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["statusApproval", "action"],
  }));

  // Use Effect - Initial fetch dengan 100 data
  useEffect(() => {
    // TODO: dispatch(getAdjustmentInvoicePaginate({
    //   search: encodeURIComponent(JSON.stringify(search)),
    //   page: 1,
    //   pageSize: 100, // Initial load 100 data
    //   sort,
    //   isLoadMore: false,
    // }))
    setPage(1);
  }, [dispatch, search, sort]);

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
    const totalPages = data?.page?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage <= totalPages) {
      // TODO: await dispatch(getAdjustmentInvoicePaginate({
      //   search: encodeURIComponent(JSON.stringify(search)),
      //   page: nextPage,
      //   pageSize: loadMoreSize, // Load 20 more
      //   sort,
      //   isLoadMore: true,
      // }))
      setPage(nextPage);
    }
  };

  // Calculate if there's more data
  const hasMore = (dataSource?.length || 0) < (data?.page?.totalElements || 0);

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
      breadcrumbName: "Rating & Billing",
    },
    {
      path: INVOICE_ROUTES.ADJUSTMENT_INVOICE_VIEW,
      breadcrumbName: "Adjustment Invoice",
    },
  ];

  // Handle Download
  const handleDownload = () => {
    // TODO: dispatch(downloadAdjustmentInvoice(...))
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
  const handleDeleteOk = (res, handleClear) => {
    setModalDelete(false);
    // TODO: dispatch(deleteAdjustmentInvoice(idDelete))
    handleCancel();
    handleClear();
  };

  // Handle Approval History
  const handleApprovalHistory = (id) => {
    // TODO: dispatch(getApprovalHistory(id))
    setModalApprovalHistory(true);
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
                <div className="pt-1">
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
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color={"#0075bf"} width={20} />}
              border={false}
              disabled={!isEditable}
            >
              <span className={"text-black ml-3"}> Update</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={INVOICE_ROUTES.ADJUSTMENT_INVOICE_CREATE}
            state={{
              id: record.id,
              invoiceNumber: record.invoiceNumber,
            }}
          >
            {content}
          </Link>
        ) : (
          <div>{content}</div>
        );
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
            <div className="pt-1">
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
              <div className="pt-1">
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
    "Delete"
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
      search
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

  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item) => ({
      ...item,
      key: item.id || item.invoiceNumber,
    }));
  }, [dataSource]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
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
              idTable="adjustment-invoice-table"
              showExport={false}
              dataSource={dataSourceWithKeys}
              columns={processedColumns}
              totalData={data?.page?.totalElements || 0}
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
            />
          </div>
        </CardContainer>

        {/* Modal Delete */}
        <ModalConfirm
          isOpen={modalDelete}
          handleCancel={() => setModalDelete(false)}
          handleOk={handleDeleteOk}
          width={500}
          useOk={true}
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

        {/* Modal Error Delete */}
        <ModalError
          isOpen={modalError}
          handleOk={() => {
            handleDeleteOk(bodyError.body, bodyError.handleClear);
            setModalError(false);
            setBodyError({});
          }}
          handleCancel={() => setModalError(false)}
        >
          <div className="px-8 py-8 justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconDelete" width={48} />
              <p className="text-[18px] font-bold">Failed</p>
            </div>
            <p className="pl-[70px]">
              {`Your data was not deleted. Please try again.`}
            </p>
          </div>
        </ModalError>

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default AdjustmentInvoicePage;
