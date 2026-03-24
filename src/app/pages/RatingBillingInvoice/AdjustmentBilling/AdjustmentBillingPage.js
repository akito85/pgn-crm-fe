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
import ButtonComponent from "../../../../components/ButtonComponent";
import BreadCrumb from "../../../../components/BreadCrumb";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  deleteAdjustmentBilling,
  downloadAdjustmentBilling,
  getAdjustmentBillingPaginate,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import { columnsAdjustmentBilling } from "./Table/TableAdjustmentBilling";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import { WarningOutlined } from "@ant-design/icons";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const AdjustmentBillingPage = () => {
  // Selector
  const { data, loading, data_approval_history, message } = useSelector(
    (state) => state.adjustmentBilling,
  );

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
    right: ["status", "statusApproval", "action"],
  }));

  const handleRefresh = useCallback(() => {
    dispatch(
      getAdjustmentBillingPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: 100,
        sort,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, search, sort]);
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover:
          data_approval_history?.dataApprover?.ADJUSTMENT_BILLING || [],
        dataHistory:
          data_approval_history?.dataHistory?.ADJUSTMENT_BILLING || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

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

  const handleLoadMore = async () => {
    const totalElements = data?.page?.totalElements || 0;
    const currentDataLength = dataSource?.length || 0;

    if (currentDataLength >= totalElements) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    await dispatch(
      getAdjustmentBillingPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );
    setPage(nextPage);
  };

  const hasMore = (dataSource?.length || 0) < (data?.page?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
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
      path: RBI_ROUTES.ADJUSTMENT_BILLING_VIEW,
      breadcrumbName: "Adjustment Billing",
    },
  ];

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadAdjustmentBilling({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
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
  const handleDeleteOk = (res, handleClear) => {
    setModalDelete(false);
    dispatch(deleteAdjustmentBilling(idDelete))
      .unwrap()
      .then(() => {
        dispatch(
          getAdjustmentBillingPaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: 100,
            sort,
            isLoadMore: false,
          }),
        );
        setPage(1);
        handleCancel();
        handleClear();
      })
      .catch((error) => {
        if (Math.floor((error.response.status || 0) / 100) === 5) {
          setBodyError({ body: { ...res }, handleClear });
          setModalError(true);
        }
      });
  };

  // Handle Approval History
  const handleApprovalHistory = (id) => {
    dispatch(getApprovalHistory(id));
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
    // {
    //   action: "Upload",
    //   render: (
    //     <ButtonComponent
    //       icon={<SVGIcon name="IconUpload" color={"#FFFFFF"} width={18} />}
    //       type={"submit"}
    //       border={false}
    //       disabled={true}
    //     >
    //       Upload
    //     </ButtonComponent>
    //   ),
    // },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.ADJUSTMENT_BILLING_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
          >
            Create Adjustment BIlling
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.ADJUSTMENT_BILLING_DETAIL}
            state={{ id: record.id }}
          >
            <Tooltip title="Detail">
              <div className="pt-0">
                <SVGIcon name="IconDetail" width={20} />
              </div>
            </Tooltip>
          </Link>
        );
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
              icon={
                <SVGIcon
                  name="IconEdit"
                  color={isEditable ? "#0075bf" : "#8D91A0"}
                  width={20}
                />
              }
              border={false}
              disabled={!isEditable}
            >
              <span
                className={
                  isEditable ? "text-black ml-3" : "text-gray-400 ml-3"
                }
              >
                Update
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div
                className="pt-0"
                style={{ pointerEvents: !isEditable ? "none" : "auto" }}
              >
                <SVGIcon
                  name="IconEdit"
                  width={20}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={
                    !isEditable ? "cursor-not-allowed" : "cursor-pointer"
                  }
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={RBI_ROUTES.ADJUSTMENT_BILLING_UPDATE}
            state={{
              id: record.id,
              adjustmentNumber: record.adjustmentNumber,
            }}
          >
            {content}
          </Link>
        ) : (
          <div style={{ opacity: 0.5, cursor: "not-allowed" }}>{content}</div>
        );
      },
    },
    {
      action: "Delete",
      type: "table",
      render: (record, data) => {
        const isDelete =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon
                  name="IconDelete"
                  color={isDelete ? "#D90000" : "#8D91A0"}
                  width={20}
                />
              }
              border={false}
              disabled={!isDelete}
              onClick={isDelete ? () => handleDelete(record.id) : undefined}
            >
              <span
                className={isDelete ? "text-black ml-3" : "text-gray-400 ml-3"}
              >
                Delete
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Delete">
              <div
                className="pt-0"
                style={{
                  pointerEvents: !isDelete ? "none" : "auto",
                  opacity: !isDelete ? 0.5 : 1,
                  cursor: !isDelete ? "not-allowed" : "pointer",
                }}
              >
                <SVGIcon
                  name="IconDelete"
                  width={20}
                  color={isDelete ? "#D90000" : "#8D91A0"}
                  className={isDelete ? "cursor-pointer" : "cursor-not-allowed"}
                  onClick={isDelete ? () => handleDelete(record.id) : undefined}
                />
              </div>
            </Tooltip>
          );
        return Content;
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
              <div className="pt-0">
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
  ).map((col) => ({
    ...col,
    width: 100,
    align: "center",
  }));

  const baseColumns = useMemo(() => {
    return columnsAdjustmentBilling(
      0,
      0,
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

  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item) => ({
      ...item,
      key: item.id || item.adjustmentNumber,
    }));
  }, [dataSource]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">
              Adjustment Billing List
            </p>

            <Toolbar items={itemGrantAccess} />
          </div>
        }
      >
        <div className="w-full">
          <TableRBI
            idTable="adjustment-billing-table"
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
            tableScrolled={{ y: 525, x: 3000 }}
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
            {`Your data was not deleted, ${message?.data?.message}. Please try again.`}
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
    </>
  );
};

export default AdjustmentBillingPage;
