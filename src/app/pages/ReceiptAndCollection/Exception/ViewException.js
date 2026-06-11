import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import CardContainer from "../../../../components/CardContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { Checkbox, Spin, Tooltip } from "antd";
import { debounce } from "lodash";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { DownloadOutlined } from "@ant-design/icons";
import TableRBI from "../../../../components/TableRBI";
import {
  getPaginateException,
  getExceptionDetail,
  inactiveException,
  getApprovalHistoryException,
  getDownloadException,
  getAllApprovalListException,
  getListApprovalByIdException,
  resetDetail
} from "../../../../redux/slices/receipt_collection/exceptionSlice";
import ExceptionDetailPanel from "./_components/ExceptionDetailPanel";
import ModalBulkApproveException from "./_components/ModalBulkApproveException";
import ModalInactivateWithHierarchy from "../../../../components/Modal/ModalInactivateWithHierarchy";
import {
  getColumnSearchPropsUseFilteredValue,
} from "../../../../utils/getColumnSearchProps";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { disabledActionByStatus, hasValue, renderColumn } from "../../../../utils";
import StatusComponent from "../../../../components/StatusComponent";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

export const columnsException = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleInactive = () => {},
  handleApprovalHistory = () => {},
  search = {}
) => [
  {
    title: "NO",
    key: "no",
    width: 60,
    align: "left",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    key: "customerNumber",
    sorter: true,
    align: "left",
    filteredValue: [search?.customerNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "customerNumber", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("customerNumber", hasValue(search["customerNumber"]), searchText, text, false, "input", search),
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    key: "customerName",
    sorter: true,
    align: "left",
    filteredValue: [search?.customerName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "customerName", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("customerName", hasValue(search["customerName"]), searchText, text, false, "input", search),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    key: "accountNumber",
    sorter: true,
    align: "left",
    filteredValue: [search?.accountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "accountNumber", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("accountNumber", hasValue(search["accountNumber"]), searchText, text, false, "input", search),
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    key: "accountName",
    sorter: true,
    align: "left",
    filteredValue: [search?.accountName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "accountName", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("accountName", hasValue(search["accountName"]), searchText, text, false, "input", search),
  },
  {
    title: "SOR",
    dataIndex: "sor",
    key: "sor",
    sorter: true,
    align: "center",
    filteredValue: [search?.sor] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "sor", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("sor", hasValue(search["sor"]), searchText, text, false, "input", search),
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    key: "costCenter",
    sorter: true,
    align: "center",
    filteredValue: [search?.costCenter] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "costCenter", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("costCenter", hasValue(search["costCenter"]), searchText, text, false, "input", search),
  },
  {
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    key: "accountSegment",
    sorter: true,
    align: "center",
    filteredValue: [search?.accountSegment] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "accountSegment", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("accountSegment", hasValue(search["accountSegment"]), searchText, text, false, "input", search),
  },
  {
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    key: "accountGroupType",
    sorter: true,
    align: "center",
    filteredValue: [search?.accountGroupType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "accountGroupType", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("accountGroupType", hasValue(search["accountGroupType"]), searchText, text, false, "input", search),
  },
  {
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    key: "meterReadingCode",
    sorter: true,
    align: "center",
    filteredValue: [search?.meterReadingCode] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "meterReadingCode", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("meterReadingCode", hasValue(search["meterReadingCode"]), searchText, text, false, "input", search),
  },
  {
    title: "ACCOUNT TYPE",
    dataIndex: "accountType",
    key: "accountType",
    sorter: true,
    align: "center",
    filteredValue: [search?.accountType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "accountType", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("accountType", hasValue(search["accountType"]), searchText, text, false, "input", search),
  },
  {
    title: "ACCOUNT STATUS",
    dataIndex: "accountStatus",
    key: "accountStatus",
    sorter: true,
    align: "center",
    filteredValue: [search?.accountStatus] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "accountStatus", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("accountStatus", hasValue(search["accountStatus"]), searchText, text, false, "input", search),
  },
  {
    title: "CUSTOMER SEGMENT",
    dataIndex: "customerSegment",
    key: "customerSegment",
    sorter: true,
    align: "center",
    filteredValue: [search?.customerSegment] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "customerSegment", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("customerSegment", hasValue(search["customerSegment"]), searchText, text, false, "input", search),
  },
  {
    title: "CORPORATE CUSTOMER",
    dataIndex: "corporateCustomer",
    key: "corporateCustomer",
    sorter: true,
    align: "center",
    filteredValue: [search?.corporateCustomer] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "corporateCustomer", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("corporateCustomer", hasValue(search["corporateCustomer"]), searchText, text, false, "input", search),
  },
  {
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    key: "classificationType",
    sorter: true,
    align: "center",
    filteredValue: [search?.classificationType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "classificationType", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("classificationType", hasValue(search["classificationType"]), searchText, text, false, "input", search),
  },
  {
    title: "ACTIVITY",
    dataIndex: "activity",
    key: "activity",
    sorter: true,
    align: "center",
    filteredValue: [search?.activity] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "activity", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("activity", hasValue(search["activity"]), searchText, text, false, "input", search),
  },
  {
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    key: "billingCycle",
    sorter: true,
    align: "center",
    filteredValue: [search?.billingCycle] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "billingCycle", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("billingCycle", hasValue(search["billingCycle"]), searchText, text, false, "input", search),
  },
  {
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    key: "billingPeriod",
    sorter: true,
    align: "center",
    filteredValue: [search?.billingPeriod] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "billingPeriod", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("billingPeriod", hasValue(search["billingPeriod"]), searchText, text, false, "input", search),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    sorter: true,
    align: "left",
    filteredValue: [search?.startDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "startDate", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("startDate", hasValue(search["startDate"]), searchText, text, false, "input", search),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    sorter: true,
    align: "left",
    filteredValue: [search?.endDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "endDate", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("endDate", hasValue(search["endDate"]), searchText, text, false, "input", search),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
    sorter: true,
    align: "left",
    filteredValue: [search?.description] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "description", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) =>
      renderColumn("description", hasValue(search["description"]), searchText, text, false, "input", search),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    fixed: "right",
    width: 150,
    align: "center",
    filteredValue: [search?.status] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "status", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) => (
      <div className="flex justify-center">
        <StatusComponent colour={text}>{text?.toUpperCase()}</StatusComponent>
      </div>
    ),
  },
  {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    sorter: true,
    fixed: "right",
    width: 150,
    align: "center",
    filteredValue: [search?.statusApproval] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch, true
    ),
    render: (text) => (
      <div className="flex justify-center">
        <StatusComponent colour={text}>{text?.toUpperCase()}</StatusComponent>
      </div>
    ),
  },
];

// ── Main Component ────────────────────────────────────────────────────────────

const ViewException = () => {
  const { data, dataApprovalHistory, loading, data_detail, dataListAppHierDetail, dataListAppHierId } = useSelector(
    (state) => state.exception
  );

  const appHierOptions = useMemo(
    () => (dataListAppHierId || []).map((h) => ({ value: h.id, name: h.name })),
    [dataListAppHierId]
  );
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();

  const [pageSize] = useState(20);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [status, setStatus] = useState("");
  const [exceptionId, setExceptionId] = useState("");
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [body, setBody] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailCollapsed, setDetailCollapsed] = useState(false);
  const [openBulkApprove, setOpenBulkApprove] = useState(false);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "action"],
  }));

  // Infinite scroll state
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  const fetchPage = useCallback(
    async (page, replace = false, signal = null) => {
      if (isFetchingRef.current) return;
      if (signal?.aborted) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const result = await dispatch(
          getPaginateException({
            search: encodeURIComponent(JSON.stringify(search)),
            page: page + 1,
            pageSize,
            sort,
          })
        ).unwrap();
        if (signal?.aborted) return;
        const rows = result?.result ?? [];
        const pageInfo = result?.page ?? {};
        const nextHasMore = page < (pageInfo.totalPages ?? 0) - 1;
        setAllData((prev) => (replace ? rows : [...prev, ...rows]));
        setHasMore(nextHasMore);
        hasMoreRef.current = nextHasMore;
        pageRef.current = page;
      } catch (e) {
        if (!signal?.aborted) console.error("fetchPage error", e);
      } finally {
        isFetchingRef.current = false;
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [dispatch, search, pageSize, sort]
  );

  useEffect(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
    return () => {
      signal.aborted = true;
      isFetchingRef.current = false;
    };
  }, [search, sort]); // intentionally excludes fetchPage

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return Promise.resolve();
    return fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  // Auto-load next page if the table body has no scrollable overflow after data loads
  useEffect(() => {
    if (!hasMore || allData.length === 0) return;
    const timer = setTimeout(() => {
      const tableBody = document.querySelector("#exception-list .ant-table-body");
      if (tableBody && tableBody.scrollHeight <= tableBody.clientHeight + 5) {
        onLoadMore();
      }
    }, 150);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData, hasMore]);

  const handleFetch = useCallback(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGlobalSearch = useCallback(
    debounce((value) => {
      setSearch((prev) => {
        const next = { ...prev };
        if (value) {
          next.all = value;
        } else {
          delete next.all;
        }
        return next;
      });
    }, 500),
    []
  );

  useEffect(() => () => handleGlobalSearch.cancel(), [handleGlobalSearch]);

  const handleChange = () => {};

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setExceptionId(r?.exceptionId);
    setStatus(r?.status);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const bodyPayload = {
      exceptionId,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
      status: status === "Inactive" ? "Active" : "Inactive",
    };
    setBody({ body: bodyPayload });
    dispatch(inactiveException({ body: bodyPayload }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        handleFetch();
      });
  };

  const handleCancelModalInactivate = () => {
    setOpenModalInactivate(false);
  };

  useEffect(() => {
    if (dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: dataApprovalHistory?.dataApprover?.EXCEPTION || [],
        dataHistory: dataApprovalHistory?.dataHistory?.EXCEPTION || [],
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleApprovalHistory = async (recordData) => {
    try {
      setBody(recordData);
      await dispatch(getApprovalHistoryException(recordData.exceptionId))?.unwrap();
      setOpenModalHistory(true);
    } catch {
      setOpenModalHistory(false);
    }
  };

  const handleViewDetail = (record) => {
    if (selectedRecord?.excAccountId === record.excAccountId) {
      setDetailCollapsed((c) => !c);
    } else {
      setSelectedRecord(record);
      setDetailCollapsed(false);
      dispatch(getExceptionDetail(record.excAccountId));
    }
  };

  useEffect(() => {
    if (data_detail?.appHierId) {
      dispatch(getListApprovalByIdException({ id: data_detail.appHierId }));
    }
  }, [data_detail?.appHierId, dispatch]);

  const handleCloseDetail = () => {
    setSelectedRecord(null);
    dispatch(resetDetail());
  };

  const handleDownload = () => {
    dispatch(
      getDownloadException({
        search: encodeURIComponent(JSON.stringify(search)),
        page: pageRef.current + 1,
        pageSize,
        sort,
      })
    );
  };

  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_EXCEPTION, breadcrumbName: "Exception" },
  ];

  const itemActions = [
    {
      action: "approve",
      render: (
        <ButtonComponent
          onClick={() => setOpenBulkApprove(true)}
          type="submit"
          icon={<SVGIcon name="IconApprove" width={24} color={"#ffffff"} />}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type="submit"
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_EXCEPTION}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isDisabled = disabledActionByStatus(
          "update",
          record?.status,
          record?.statusApproval
        );
        const linkContent =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon
                  name="IconEdit"
                  color={isDisabled ? "#8D91A0" : "#0075bf"}
                  width={24}
                />
              }
              type={"action"}
              border={false}
              disabled={isDisabled}
            >
              <span className={`ml-0 ${isDisabled ? "text-[#8D91A0]" : "text-black"}`}>
                Update
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-0">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={isDisabled ? "#8D91A0" : "#ACC424"}
                  className={isDisabled ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );
        return isDisabled ? (
          <div>{linkContent}</div>
        ) : (
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_EXCEPTION}
            state={{ id: record?.exceptionId }}
          >
            {linkContent}
          </Link>
        );
      },
    },
    {
      action: "history",
      type: "table",
      render: (record, data) =>
        data > 3 ? (
          <ButtonComponent
            icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />}
            type={"action"}
            border={false}
            onClick={() => handleApprovalHistory(record)}
          >
            <span className={"text-black ml-0"}>Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Approval History">
            <div className="pt-1">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={24}
                onClick={() => handleApprovalHistory(record)}
              />
            </div>
          </Tooltip>
        ),
    },
  ];

  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "INACTIVE_EXCEPTION") {
        dispatch(inactiveException(body));
      } else if (bodyError?.action === "GET_APPROVAL_HISTORY_EXCEPTION") {
        dispatch(getApprovalHistoryException(body));
      } else if (bodyError?.action === "DOWNLOAD_EXCEPTION") {
        handleDownload();
      }
      handleFetch();
    } catch {
      handleFetch();
    }
  };

  const actionCols = useColumnActionPermission(
    ["update", "history"],
    itemActions
  );

  const allColumns = useMemo(() => {
    return [
      ...columnsException(
        1,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        handleInactive,
        handleApprovalHistory,
        search
      ),
      ...actionCols,
    ].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [actionCols, pageSize, search, searchText, searchedColumn]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold text-nowrap">EXCEPTION LIST</p>
              <Toolbar items={itemActions} />
            </div>
          }
        >
          <TableRBI
            dataSource={allData}
            pageSize={pageSize}
            showExport={true}
            handleDownload={handleDownload}
            columns={processedColumns}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
            onSearch={(e) => handleGlobalSearch(e.target.value)}
            tableScrolled={{ x: "max-content", y: 525 }}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            idTable="exception-list"
            onRow={(record) => ({
              onClick: () => handleViewDetail(record),
              style: { cursor: "pointer" },
            })}
            rowClassName={(record) =>
              record.excAccountId === selectedRecord?.excAccountId ? "bg-blue-50" : ""
            }
          />
        </CardContainer>

        {/* ── Inline Detail Panel ── */}
        {selectedRecord && (
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] font-bold text-primary">DETAIL EXCEPTION</p>
                <div className="flex items-center gap-3 mt-[10px]">
                  <span
                    className="cursor-pointer text-gray-500"
                    onClick={() => setDetailCollapsed((c) => !c)}
                  >
                    {detailCollapsed ? <DownOutlined /> : <UpOutlined />}
                  </span>
                </div>
              </div>
            }
          >
            {!detailCollapsed && (
              <ExceptionDetailPanel
                data_detail={data_detail}
                selectedRecord={selectedRecord ?? {}}
                dataListAppHierDetail={dataListAppHierDetail}
                appHierOptions={appHierOptions}
                loading={loading}
              />
            )}
          </CardContainer>
        )}

        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getAllApprovalListException}
          getAPIDetail={getListApprovalByIdException}
          selector="exception"
          alertMessage={`Are you sure you want to change the status of this Exception?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header="Approval History"
          width={850}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />

        {renderModal()}
      </Spin>

      <ModalBulkApproveException
        isOpen={openBulkApprove}
        handleClose={() => setOpenBulkApprove(false)}
        onSuccess={handleFetch}
      />
    </>
  );
};

export default ViewException;
