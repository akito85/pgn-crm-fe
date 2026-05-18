import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import moment from "moment";
import { WarningOutlined } from "@ant-design/icons";

import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import NxHistoryModal from "../../../../../../../../components/Nx/NxHistoryModal";
import ToolbarAccount from "../../../../../ComponentAccount/ToolbarAccount";
import { useColumnActionPermissionAccount } from "../../../../../ComponentAccount/ColumnActionPermissionAccount";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../utils/getColumnSearchProps";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import {
  getListWarrantyInfo,
  getListWarrantyTermPaging,
  downloadWarrantyTermList,
  getApprovalHistoryWarranty,
  inactiveWarrantyTerm,
  deleteDraftWarrantyTerm,
  getListAppHierWarrantyInactive,
  getListAppHierDetailWarrantyInactive,
} from "../../../../../../../../redux/slices/account_management/detailAccount/warrantySlice";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../../../utils";
import { nxApplyFixedColumns } from "../../../../../../../../utils/Nx/nxApplyFixedColumns";
import { ModalConfirm, ModalError } from "../../../../../../../../components/Modal/ModalPopUp";
import ModalInactivateWithHierarchy from "../../../../../../../../components/Modal/ModalInactivateWithHierarchy";
import WarrantyTermDetailContent from "../../../Warranty/DetailWarrantyTerm/WarrantyTermDetailContent";

const Warranty = ({ idSA, idAccount, idCustomer, type }) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // ─── WARRANTY INFO state ─────────────────────────────────────────────
  const [dataTableInfo, setDataTableInfo] = useState([]);

  // ─── WARRANTY TERM state ─────────────────────────────────────────────
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalElements, setTotalElement] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [fixedColumns, setFixedColumns] = useState({
    right: ["statusApproval", "status", "action"],
    left: [],
  });
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [dataDeleteSelected, setDataDeleteSelected] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [openWarrantyTermDetailModal, setOpenWarrantyTermDetailModal] = useState(false);
  const [selectedWarrantyTermId, setSelectedWarrantyTermId] = useState(null);

  // ─── Redux ───────────────────────────────────────────────────────────
  const { dataWarrantyInfo, dataWarrantyTerm, loadingDownload, dataApprovalHistory, loading } =
    useSelector((state) => state.saWarranty);
  const { access_account } = useSelector((state) => state.accountManagement);

  const filteredArray = {
    actionList: access_account?.actionList?.filter((action) =>
      action.path.includes("/account-management/account-standard/service-agreement/warranty/")
    ),
  };

  // ─── Effects ─────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getGrantedAccessAccount("/account-management/account-standard/service-agreement/warranty/"));
  }, [dispatch]);

  useEffect(() => {
    if (dataApprovalHistory?.dataApprover && dataApprovalHistory?.dataHistory) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.WARRANTY_TERM || [],
          inactive: dataApprovalHistory?.dataApprover?.INACTIVE_WARRANTY_TERM || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.WARRANTY_TERM || [],
          inactive: dataApprovalHistory?.dataHistory?.INACTIVE_WARRANTY_TERM || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  // Fetch WARRANTY INFORMATION (no pagination)
  useEffect(() => {
    if (idSA) dispatch(getListWarrantyInfo(idSA));
  }, [dispatch, idSA]);

  // Update WARRANTY INFORMATION rows
  useEffect(() => {
    if (dataWarrantyInfo?.result) {
      setDataTableInfo(dataWarrantyInfo.result || []);
    }
  }, [dataWarrantyInfo]);

  const warrantyTermInputFields = useMemo(
    () =>
      Object.entries(search)
        .filter(([, value]) => value !== null && value !== undefined && value !== "")
        .map(([column, value]) => ({
          condition: "AND",
          column,
          operator: "EQUALS",
          value,
        })),
    [search]
  );

  const refreshCurrentList = useCallback(
    (targetPage = 1) => {
      dispatch(
        getListWarrantyTermPaging({
          id: idSA,
          page: targetPage,
          size: pageSize,
          sort: sort || "createdDate~desc",
          body: {
            listType: "all",
            inputFields: warrantyTermInputFields,
            searchs: [],
          },
        })
      );
    },
    [dispatch, idSA, sort, warrantyTermInputFields]
  );

  useEffect(() => {
    refreshCurrentList(page);
  }, [page, refreshCurrentList]);

  useEffect(() => {
    if (!dataWarrantyTerm?.result) return;

    const incomingData = dataWarrantyTerm.result || [];
    const totalData = dataWarrantyTerm?.page?.totalElements || 0;
    setTotalElement(totalData);

    setDataTable((prevData) => {
      const mergedData =
        page === 1
          ? incomingData
          : [
              ...prevData,
              ...incomingData.filter(
                (item) => !prevData.some((prevItem) => prevItem.id === item.id)
              ),
            ];
      setHasMore(mergedData.length < totalData);
      return mergedData;
    });
  }, [dataWarrantyTerm, page]);

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return Promise.resolve();
    setPage((prev) => prev + 1);
    return Promise.resolve();
  }, [hasMore, loading]);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  }, []);

  const onSort = (_, __, sort) => {
    const dataOrder = sort.order === "ascend" ? "asc" : "desc";
    const dataSort = sort.order ? `${sort.field}~${dataOrder}` : "";
    setSort(dataSort);
    setPage(1);
  };

  const handleApprovalHistoryModal = (show, warrantyTermId = 0) => {
    if (show) {
      dispatch(getApprovalHistoryWarranty(warrantyTermId));
      setShowApprovalHistoryModal(true);
      return;
    }

    setShowApprovalHistoryModal(false);
  };
  const handleOpenWarrantyTermDetailModal = useCallback((warrantyTermId) => {
    setSelectedWarrantyTermId(warrantyTermId);
    setOpenWarrantyTermDetailModal(true);
  }, []);
  const handleCloseWarrantyTermDetailModal = useCallback(() => {
    setOpenWarrantyTermDetailModal(false);
    setSelectedWarrantyTermId(null);
  }, []);
  const handleOpenModalInactivate = (record) => {
    setDataInactivate(record);
    setOpenModalInactivate(true);
  };
  const handleCancelModalInactivate = () => {
    setDataInactivate({});
    setOpenModalInactivate(false);
  };
  const handleDelete = (record) => {
    setDataDeleteSelected(record);
    setOpenModalDelete(true);
  };
  const handleCloseModalDelete = () => {
    setDataDeleteSelected({});
    setOpenModalDelete(false);
  };
  const handleConfirmModalDelete = () => {
    dispatch(deleteDraftWarrantyTerm({ id: dataDeleteSelected.id }))
      .unwrap()
      .then(() => {
        handleCloseModalDelete();
        setPage(1);
        setDataTable([]);
        refreshCurrentList(1);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message || error.message || error.toString();
          setBodyError({ type: "delete", message });
          setModalError(true);
        }
      });
  };
  const handleSubmitModalInactivate = (res, handleClear) => {
    const data = {
      warrantyTermId: dataInactivate.id,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveWarrantyTerm({ data }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        setPage(1);
        setDataTable([]);
        refreshCurrentList(1);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message || error.message || error.toString();
          setBodyError({ body: { ...res }, type: "inactive", handleClear, message });
          setModalError(true);
        }
      });
  };
  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    if (bodyError.type === "inactive") {
      handleSubmitModalInactivate(bodyError.body, bodyError.handleClear);
    }
    if (bodyError.type === "delete") {
      handleConfirmModalDelete();
    }
    setModalError(false);
    setBodyError({});
  };

  const statusSize = "small";

  // ─── WARRANTY INFORMATION columns (display-only, ACTION = detail icon) ─
  const warrantyInfoColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (_, __, i) => i + 1,
      },
      { title: "DOC NUMBER", dataIndex: "docNumber", width: 200, sorter: true },
      {
        title: "DOC DATE",
        dataIndex: "docDate",
        width: 160,
        sorter: true,
        align: "center",
        render: (text) => (text ? moment(text).format("DD MMM YYYY") : "-"),
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        width: 160,
        sorter: true,
        align: "center",
        render: (text) => (text ? moment(text).format("DD MMM YYYY") : "-"),
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        width: 160,
        sorter: true,
        align: "center",
        render: (text) => (text ? moment(text).format("DD MMM YYYY") : "-"),
      },
      { title: "CURRENCY", dataIndex: "currency", width: 120, sorter: true },
      { title: "WARRANTY TERM", dataIndex: "warrantyTerm", width: 160, sorter: true },
      {
        title: "TOTAL BALANCE",
        dataIndex: "totalBalance",
        width: 160,
        sorter: true,
        align: "right",
      },
      {
        title: "CASH BALANCE",
        dataIndex: "cashBalance",
        width: 160,
        sorter: true,
        align: "right",
      },
      {
        title: "NON CASH BALANCE",
        dataIndex: "nonCashBalance",
        width: 180,
        sorter: true,
        align: "right",
      },
      { title: "GAP", dataIndex: "gap", width: 120, sorter: true, align: "right" },
      {
        title: "ACTION",
        width: 80,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <Tooltip title="Detail">
            <button
              type="button"
              className="flex justify-center cursor-pointer bg-transparent border-0 p-0"
              onClick={() => handleOpenWarrantyTermDetailModal(record?.id)}
            >
              <SVGIcon name="IconDetail" width={24} />
            </button>
          </Tooltip>
        ),
      },
    ],
    [handleOpenWarrantyTermDetailModal]
  );

  // ─── WARRANTY TERM columns ────────────────────────────────────────────
  const warrantyTermColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (_, __, i) => i + 1,
      },
      {
        title: "DOC NUMBER",
        dataIndex: "docNumber",
        width: 200,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
          search, "docNumber", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("docNumber", hasValue(search["docNumber"]), searchText, text, false, "input", search),
      },
      {
        title: "DOC DATE",
        dataIndex: "docDate",
        width: 160,
        sorter: true,
        align: "center",
        ...getColumnSearchPropsUseFilteredValue(
          search, "docDate", searchInput, searchedColumn, searchText, handleSearch, true, "date"
        ),
        render: (text) =>
          renderDateColumn("docDate", hasValue(search["docDate"]), searchText, text, "date", search),
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        width: 160,
        sorter: true,
        align: "center",
        ...getColumnSearchPropsUseFilteredValue(
          search, "startDate", searchInput, searchedColumn, searchText, handleSearch, true, "date"
        ),
        render: (text) =>
          renderDateColumn("startDate", hasValue(search["startDate"]), searchText, text, "date", search),
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        width: 160,
        sorter: true,
        align: "center",
        ...getColumnSearchPropsUseFilteredValue(
          search, "endDate", searchInput, searchedColumn, searchText, handleSearch, true, "date"
        ),
        render: (text) =>
          renderDateColumn("endDate", hasValue(search["endDate"]), searchText, text, "date", search),
      },
      {
        title: "CURRENCY",
        dataIndex: "currency",
        width: 120,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
          search, "currency", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("currency", hasValue(search["currency"]), searchText, text, false, "input", search),
      },
      {
        title: "AMOUNT",
        dataIndex: "amount",
        width: 160,
        sorter: true,
        align: "right",
        ...getColumnSearchPropsUseFilteredValue(
          search, "amount", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn(
            "amount", 
            hasValue(search["amount"]), 
            searchText, 
            text, 
            false,
            "input", 
            search,
            "currency-idr"),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        key: "status",
        width: 120,
        sorter: true,
        fixed: "right",
        ...getColumnSearchPropsUseFilteredValue(
          search, "status", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn(
            "status", 
            hasValue(search["status"]), 
            searchText, 
            text, 
            false, 
            "status",
            search, 
            null,
            statusSize),
      },
      {
        title: "STATUS APPROVAL",
        dataIndex: "statusApproval",
        key: "statusApproval",
        width: 180,
        sorter: true,
        fixed: "right",
        ...getColumnSearchPropsUseFilteredValue(
          search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn(
            "statusApproval", 
            hasValue(search["statusApproval"]), 
            searchText, 
            text, 
            false, 
            "status", 
            search, 
            null,
            statusSize),
      },
    ],
    [handleSearch, search, searchText, searchedColumn]
  );

  // ─── itemActions ──────────────────────────────────────────────────────
  const itemActions = [
    // ── TOOLBAR BUTTONS ──
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconDownload" width={20} />}
          type="submit"
          loading={loadingDownload}
          onClick={() => dispatch(downloadWarrantyTermList({ id: idSA }))}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Approval",
      render: (
        // TODO: implement Approval button behavior when team decides
        <ButtonComponent type="submit" disabled>
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink
          to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_WARRANTY_TERM}
          state={{ idAccount, idCustomer, type, idSA }}
        >
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },

    // ── TABLE ACTIONS ──
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        const handleView = () => handleOpenWarrantyTermDetailModal(record?.id);
        const renderAction =
          data > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconDetail" color={"#0075bf"} width={20} />}
              border={false}
              onClick={handleView}
            >
              <span className={"text-black"}>Detail</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Detail">
              <button
                type="button"
                className="cursor-pointer bg-transparent border-0 p-0"
                onClick={handleView}
              >
                <SVGIcon name="IconDetail" width={20} />
              </button>
            </Tooltip>
          );
        return renderAction;
      },
    },

    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isUpdate =
          record.status === "DRAFT" && record.statusApproval !== "WAITING APPROVAL";
        const renderAction =
          data > 3 ? (
            isUpdate ? (
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_WARRANTY_TERM}
                state={{ id: record?.id, idAccount, idCustomer, type, idSA }}
              >
                <ButtonComponent
                  icon={<SVGIcon name="IconEdit" color={"#0075bf"} width={20} />}
                  border={false}
                >
                  <span className={"text-black"}>Update</span>
                </ButtonComponent>
              </Link>
            ) : (
              <ButtonComponent
                icon={<SVGIcon name="IconEdit" color={"#8D91A0"} width={20} />}
                border={false}
                disabled
              >
                <span className={"text-black"}>Update</span>
              </ButtonComponent>
            )
          ) : (
            <Tooltip title="Update">
              {isUpdate ? (
                <Link
                  to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_WARRANTY_TERM}
                  state={{ id: record?.id, idAccount, idCustomer, type, idSA }}
                >
                  <div>
                    <SVGIcon name="IconEdit" width={20} />
                  </div>
                </Link>
              ) : (
                <div className={"cursor-not-allowed"}>
                  <SVGIcon name="IconEdit" width={20} color={"#C0BEC6"} />
                </div>
              )}
            </Tooltip>
          );
        return renderAction;
      },
    },

    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const canInactivate =
          record.status === "ACTIVE" && record.approvalStatus !== "WAITING APPROVAL";
        const renderAction =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  checked={!(record.status === "ACTIVE")}
                  disabled={!canInactivate}
                />
              }
              border={false}
              disabled={!canInactivate}
              onClick={canInactivate ? () => handleOpenModalInactivate(record) : undefined}
            >
              <span className={"text-black"}>
                {record.status === "ACTIVE" ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}>
              <div>
                <Checkbox
                  onClick={canInactivate ? () => handleOpenModalInactivate(record) : undefined}
                  checked={record?.status === "INACTIVE"}
                  disabled={!canInactivate}
                />
              </div>
            </Tooltip>
          );
        return renderAction;
      },
    },

    {
      action: "Delete",
      type: "table",
      render: (record) => {
        const canDelete =
          record.status === "DRAFT" && record.statusApproval !== "WAITING APPROVAL";
        return (
          <Tooltip title="Delete">
            <span className={`flex justify-center${canDelete ? " cursor-pointer" : " cursor-not-allowed"}`}>
              <SVGIcon
                name="IconDelete"
                color={canDelete ? "#D90000" : "#8D91A0"}
                className={`flex justify-center${canDelete ? " cursor-pointer" : " cursor-not-allowed"}`}
                width={24}
                onClick={canDelete ? () => handleDelete(record) : undefined}
              />
            </span>
          </Tooltip>
        );
      },
    },

    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const renderAction =
          data > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />}
              border={false}
              onClick={() => handleApprovalHistoryModal(true, record?.id)}
            >
              <span className={"text-black"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <span>
                <ButtonComponent
                  icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />}
                  border={false}
                  onClick={() => handleApprovalHistoryModal(true, record?.id)}
                />
              </span>
            </Tooltip>
          );
        return renderAction;
      },
    },
  ];

  const actionColumns = useColumnActionPermissionAccount(
    ["Delete", "Activate", "View", "Update", "History"],
    itemActions,
    filteredArray,
    "Delete"
  );

  const allColumns = useMemo(() => {
    const mergedColumns = [...warrantyTermColumns, ...actionColumns].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return nxApplyFixedColumns(mergedColumns, fixedColumns);
  }, [actionColumns, warrantyTermColumns, fixedColumns]);

  const columnDefinitions = useMemo(
    () => allColumns.map((col) => ({ key: col.key, title: col.title })),
    [allColumns]
  );

  const warrantyInfoColumnDefinitions = warrantyInfoColumns.map((c) => ({
    key: c.dataIndex || c.title,
    title: c.title,
  }));

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* ── Container 1: WARRANTY INFORMATION ── */}
      <NxBaseContainer border={true} header="WARRANTY INFORMATION">
        <NxTable
          idTable="warranty-info-table"
          dataSource={dataTableInfo}
          totalData={dataTableInfo.length}
          loading={loading}
          tableScrolled={{ x: "max-content" }}
          columns={warrantyInfoColumns}
          columnDefinitions={warrantyInfoColumnDefinitions}
          fixedColumns={{ right: ["action"], left: [] }}
          setFixedColumns={() => {}}
          usePagination={false}
          useInfiniteScroll={false}
        />
      </NxBaseContainer>

      {/* ── Container 2: WARRANTY TERM INFORMATION ── */}
      <NxBaseContainer border={true} header="WARRANTY TERM INFORMATION">
        <Spin spinning={loading}>
          <div className="flex flex-col w-full gap-4">
            <div className="flex w-full justify-end">
              <ToolbarAccount items={itemActions} advancedAccess={filteredArray} />
            </div>
            <NxTable
              idTable="warranty-term-table"
              dataSource={dataTable}
              totalData={totalElements}
              current={page}
              loading={loading}
              tableScrolled={{ y: 300, x: "max-content" }}
              onSort={onSort}
              columns={allColumns}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              usePagination={false}
              useInfiniteScroll={true}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              loadMoreThreshold={2}
            />
          </div>
        </Spin>
      </NxBaseContainer>

      {/* ── Modals ── */}
      <NxModal
        isOpen={openWarrantyTermDetailModal}
        handleCancel={handleCloseWarrantyTermDetailModal}
        title="DETAIL WARRANTY TERM"
        width={1212}
        footer={
          <div className="flex justify-end">
            <ButtonComponent type="default" onClick={handleCloseWarrantyTermDetailModal}>
              back
            </ButtonComponent>
          </div>
        }
      >
        <div className="max-h-[900px] overflow-y-auto p-4">
          <WarrantyTermDetailContent
            id={selectedWarrantyTermId}
            idSA={idSA}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
            false
          />
        </div>
      </NxModal>

      <NxHistoryModal
        isOpen={showApprovalHistoryModal}
        handleClose={() => handleApprovalHistoryModal(false)}
        header={"Approval History"}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      <ModalInactivateWithHierarchy
        dispatch={dispatch}
        getAPIOption={getListAppHierWarrantyInactive}
        getAPIDetail={getListAppHierDetailWarrantyInactive}
        selector="saWarranty"
        alertMessage={`Are you sure you want to inactivate Warranty Term?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSubmitModalInactivate}
      />

      {/* Modal Delete */}
      <ModalConfirm
        isOpen={openModalDelete}
        handleCancel={handleCloseModalDelete}
        handleOk={handleConfirmModalDelete}
        width={400}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>Are you sure want to delete draft?</p>
        </div>
      </ModalConfirm>

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${
            bodyError.type === "inactive" ? "inactivated" : "deleted"
          }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default Warranty;
