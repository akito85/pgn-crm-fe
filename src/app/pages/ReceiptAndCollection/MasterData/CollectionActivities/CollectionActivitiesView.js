import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Checkbox, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../../assets/Icon/index";
import TableRBI from "../../../../../components/TableRBI";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import debtAndCollectionHttpService from "../../../../../redux/services/debtAndCollectionHttpService";
import ModalApprovalCollectionActivities from "./Modal/ModalApprovalCollectionActivities";
import CollectionActivitiesInlineDetail from "./CollectionActivitiesInlineDetail";
import { columnsCollectionActivities } from "./Table/TableCollectionActivities";
import {
  getAllCollectionActivitiesPaginate,
  downloadCollectionActivities,
  getDetailCollectionActivity,
  getApprovalHistoryCA,
  getListApprovalHierarchyCA,
  getListApprovalHierarchyDetailCA,
  inactiveCollectionActivity,
  requestActivateCollectionActivity,
} from "../../../../../redux/slices/debt_and_collection/collectionActivities";

const CollectionActivitiesView = () => {
  // ─── Selector ──────────────────────────────────────────────────────────────
  const { data, loading, data_approval_history } = useSelector(
    (state) => state.collectionActivities
  );

  // ─── Declaration ───────────────────────────────────────────────────────────
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // ─── State ─────────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const initialPageSize = 100;
  const loadMoreSize = 20;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [allData, setAllData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const shouldResetRef = useRef(true);
  const detailContainerRef = useRef(null);

  const hasMore = allData.length < (data?.page?.totalElements || 0);

  const [modalInactive, setModalInactive] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [chooseId, setChooseId] = useState();
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [inlineDetail, setInlineDetail] = useState(null);
  const [inlineAttachments, setInlineAttachments] = useState([]);
  const [inlineDetailRefreshKey, setInlineDetailRefreshKey] = useState(0);
  const [approvalHierarchyOptions, setApprovalHierarchyOptions] = useState([]);
  const [approvalHierarchyDetail, setApprovalHierarchyDetail] = useState([]);
  const [loadingInlineApproval, setLoadingInlineApproval] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("collectionActivitiesFixedColumns_v2");
      return saved
        ? JSON.parse(saved)
        : { left: ["no"], right: ["status", "statusApproval", "action"] };
    } catch (e) {
      return { left: ["no"], right: ["status", "statusApproval", "action"] };
    }
  });

  const normalizeStatus = (value) =>
    (value || "").toString().trim().toUpperCase();

  const resetInlineDetail = useCallback(() => {
    setSelectedRowKey(null);
    setSelectedActivityId(null);
    setInlineDetail(null);
    setInlineAttachments([]);
    setApprovalHierarchyDetail([]);
    setLoadingInlineApproval(false);
  }, []);

  // ─── Persist fixedColumns ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(
        "collectionActivitiesFixedColumns_v2",
        JSON.stringify(fixedColumns)
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  // ─── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(
      getAllCollectionActivitiesPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: initialPageSize,
        sort,
      })
    );
  }, [search, sort, dispatch, refreshKey]);

  // ─── Accumulate for infinite scroll ───────────────────────────────────────
  useEffect(() => {
    if (data?.result) {
      if (shouldResetRef.current || page === 1) {
        setAllData(data.result);
        shouldResetRef.current = false;
      } else {
        setAllData((prev) => {
          const ids = new Set(prev.map((item) => item.id));
          const newItems = data.result.filter((item) => !ids.has(item.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  useEffect(() => {
    if (!selectedRowKey) {
      return;
    }

    const selectedStillExists = allData.some(
      (item) => (item.key || item.recordId || item.id) === selectedRowKey
    );

    if (!selectedStillExists) {
      resetInlineDetail();
    }
  }, [allData, selectedRowKey, resetInlineDetail]);

  useEffect(() => {
    if (!selectedActivityId) {
      return;
    }

    let isActive = true;

    setInlineDetail(null);
    setInlineAttachments([]);
    setApprovalHierarchyDetail([]);

    const loadInlineDetail = async () => {
      try {
        const detailResponse = await dispatch(
          getDetailCollectionActivity(selectedActivityId)
        ).unwrap();

        if (!isActive) {
          return;
        }

        setInlineDetail(detailResponse || null);
        setInlineAttachments(detailResponse?.mattachmentLists || []);

        if (detailContainerRef.current) {
          detailContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        try {
          const attachmentResponse = await debtAndCollectionHttpService.getPagination(
            `/v1/dbs/api/collection-activities/list-attachment/${selectedActivityId}`
          );

          if (!isActive) {
            return;
          }

          const attachmentResult =
            attachmentResponse?.data?.result || attachmentResponse?.result || [];

          if (attachmentResult.length > 0) {
            setInlineAttachments(attachmentResult);
          }
        } catch {
          if (isActive) {
            setInlineAttachments(detailResponse?.mattachmentLists || []);
          }
        }

        const activeHierarchyId =
          detailResponse?.criteriaApprovalInfo?.appHierId ||
          detailResponse?.apphierId;

        if (!activeHierarchyId) {
          setApprovalHierarchyDetail([]);
          return;
        }

        setLoadingInlineApproval(true);

        try {
          if (approvalHierarchyOptions.length === 0) {
            const hierarchyOptionResponse = await dispatch(
              getListApprovalHierarchyCA()
            ).unwrap();

            if (!isActive) {
              return;
            }

            setApprovalHierarchyOptions(
              (hierarchyOptionResponse || []).map((appHier) => ({
                label: appHier.approvalName || appHier.name,
                value: appHier.appHierId || appHier.id,
              }))
            );
          }

          const hierarchyDetailResponse = await dispatch(
            getListApprovalHierarchyDetailCA({ id: activeHierarchyId })
          ).unwrap();

          if (!isActive) {
            return;
          }

          setApprovalHierarchyDetail(
            (hierarchyDetailResponse || []).map((item, index) => ({
              ...item,
              key: item.approvalLevel || item.id || `approval-${index + 1}`,
              employeeDetail: (item.employeeDetail || []).map(
                (employee, employeeIndex) => ({
                  ...employee,
                  key:
                    employee.id ||
                    employee.employeeNumber ||
                    employeeIndex + 1,
                })
              ),
            }))
          );
        } catch {
          if (isActive) {
            setApprovalHierarchyDetail([]);
          }
        } finally {
          if (isActive) {
            setLoadingInlineApproval(false);
          }
        }
      } catch {
        if (!isActive) {
          return;
        }

        setInlineDetail(null);
        setInlineAttachments([]);
        setApprovalHierarchyDetail([]);
        setLoadingInlineApproval(false);
      }
    };

    loadInlineDetail();

    return () => {
      isActive = false;
    };
  }, [
    approvalHierarchyOptions.length,
    dispatch,
    inlineDetailRefreshKey,
    selectedActivityId,
  ]);

  // ─── Approval History ──────────────────────────────────────────────────────
  useEffect(() => {
    if (data_approval_history) {
      const temp = {
        dataApprover: {
          create:
            data_approval_history?.dataApprover?.COLLECTION_ACTIVITY || [],
          inactive:
            data_approval_history?.dataApprover
              ?.INACTIVE_COLLECTION_ACTIVITY || [],
          activate:
            data_approval_history?.dataApprover
              ?.ACTIVE_COLLECTION_ACTIVITY ||
            data_approval_history?.dataApprover
              ?.ACTIVATED_COLLECTION_ACTIVITY || [],
        },
        dataHistory: {
          create:
            data_approval_history?.dataHistory?.COLLECTION_ACTIVITY || [],
          inactive:
            data_approval_history?.dataHistory
              ?.INACTIVE_COLLECTION_ACTIVITY || [],
          activate:
            data_approval_history?.dataHistory
              ?.ACTIVE_COLLECTION_ACTIVITY ||
            data_approval_history?.dataHistory
              ?.ACTIVATED_COLLECTION_ACTIVITY || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // ─── Breadcrumbs ───────────────────────────────────────────────────────────
  const routes = [
    { path: "", breadcrumbName: "Payment & Collection" },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_COLLECTION_ACTIVITIES,
      breadcrumbName: "Activities",
    },
  ];

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    shouldResetRef.current = true;
    resetInlineDetail();
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  }, [resetInlineDetail]);

  const handleChange = (pageChange) => setPage(pageChange);

  const handleRetry = () => {
    handleOk();
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    shouldResetRef.current = true;
    resetInlineDetail();
    setPage(1);
    setSort(dataSort);
  };

  const handleRowClick = useCallback(
    (record, rowKey) => {
      if (selectedRowKey === rowKey) {
        resetInlineDetail();
        return;
      }

      setSelectedRowKey(rowKey);
      setSelectedActivityId(record.id);
    },
    [resetInlineDetail, selectedRowKey]
  );

  const handleLoadMore = useCallback(async () => {
    if (allData.length >= (data?.page?.totalElements || 0)) return;
    const nextPage = Math.floor(allData.length / loadMoreSize) + 1;
    setPage(nextPage);
    await dispatch(
      getAllCollectionActivitiesPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
      })
    );
  }, [allData.length, data?.page?.totalElements, search, sort, dispatch]);

  const handleRefresh = useCallback(() => {
    shouldResetRef.current = true;
    resetInlineDetail();
    if (page === 1) {
      setRefreshKey((prev) => prev + 1);
    } else {
      setPage(1);
    }
  }, [page, resetInlineDetail]);

  const handleInlineCriteriaSubmitted = useCallback(() => {
    setInlineDetailRefreshKey((prev) => prev + 1);
  }, []);

  const handleOptions = () => {
    const d = dataApprovalHistory?.dataApprover || {};
    return Object.keys(d).map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const buildSearchString = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const val = search[dataIndex];
        if (val) tempSearch += `${dataIndex}~${val},`;
      }
    }
    return tempSearch ? tempSearch.slice(0, -1) : "";
  };

  const handleOk = (res, handleClear) => {
    const selectedStatus = normalizeStatus(chooseId?.status);
    const selectedStatusApproval = normalizeStatus(chooseId?.statusApproval);
    const isApprovedStatus = ["APPROVED", "APPROVE"].includes(
      selectedStatusApproval
    );
    const isActivateRequest = selectedStatus === "INACTIVE" && isApprovedStatus;

    const dataValue = {
      id: chooseId.id,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
    };

    dispatch(
      (isActivateRequest
        ? requestActivateCollectionActivity
        : inactiveCollectionActivity)(dataValue)
    )
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        resetInlineDetail();
        dispatch(
          getAllCollectionActivitiesPaginate({
            search: buildSearchString(),
            page: 1,
            pageSize: initialPageSize,
            sort,
          })
        );
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({
            body: { ...res },
            handleClear,
            message,
            actionType: isActivateRequest ? "activate" : "inactivate",
          });
          setModalError(true);
        }
      });
  };

  const handleApprovalHistory = (id) => {
    dispatch(getApprovalHistoryCA(id));
    setModalApprovalHistory(true);
  };

  const handleInactive = (record) => {
    setChooseId(record);
    setModalInactive(true);
  };

  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  const handleDownload = () => {
    dispatch(
      downloadCollectionActivities({
        page,
        pageSize: initialPageSize,
        sort,
        search: buildSearchString(),
      })
    );
  };

  // ─── Grant Access Items ────────────────────────────────────────────────────
  const itemGrantAccess = [
    {
      action: "Approve",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRequestApproval" width={20} color="#FFF" />}
          type="submit"
          onClick={() => setModalApproval(true)}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          icon={
            <SVGIcon name="IconButtonDownload" style={{ fontSize: "20" }} />
          }
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_COLLECTION_ACTIVITIES}>
          <ButtonComponent
            icon={
              <SVGIcon name="IconButtonCreate" style={{ fontSize: "20" }} />
            }
            type="submit"
          >
            Create Activities
          </ButtonComponent>
        </NavLink>
      ),
    },

    // ─── Table actions ──────────────────────────────────────────────────────
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <button
            type="button"
            className="border-0 bg-transparent p-0"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleRowClick(record, record.key || record.recordId || record.id);
            }}
          >
            <SVGIcon name="IconDetail" width={20} />
          </button>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const rowStatusApproval = normalizeStatus(record.statusApproval);
        const isEditable =
          rowStatusApproval === "DRAFT" || rowStatusApproval === "REJECTED";

        const linkContent =
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
              type={"action"}
            >
              <span
                className={`ml-3 ${
                  isEditable ? "text-black" : "text-[#8D91A0]"
                }`}
              >
                Update
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={20}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_COLLECTION_ACTIVITIES}
            state={{
              id: record.id,
              status: record.status,
              statusApproval: record.statusApproval,
            }}
          >
            {linkContent}
          </Link>
        ) : (
          <div>{linkContent}</div>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const rowStatus = normalizeStatus(record.status);
        const rowStatusApproval = normalizeStatus(record.statusApproval);
        const isActive = rowStatus === "ACTIVE";
        const canInactivate =
          isActive &&
          ["APPROVED", "DRAFT", "REJECTED", "WAITING APPROVAL"].includes(
            rowStatusApproval
          );
        const canActivate =
          rowStatus === "INACTIVE" &&
          rowStatusApproval !== "WAITING APPROVAL";
        const isActivateOrInactivate = canInactivate || canActivate;
        const actionLabel = isActive ? "Inactivate" : "Activate";

        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  disabled={!isActivateOrInactivate}
                  checked={!isActive}
                  style={{ pointerEvents: "none" }}
                />
              }
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={
                isActivateOrInactivate ? () => handleInactive(record) : undefined
              }
              type={"action"}
            >
              <span
                className={`ml-1 ${
                  isActivateOrInactivate ? "text-black" : "text-[#8D91A0]"
                }`}
              >
                {actionLabel}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title={actionLabel}>
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={
                    isActivateOrInactivate ? () => handleInactive(record) : undefined
                  }
                  disabled={!isActivateOrInactivate}
                  checked={!isActive}
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
              type={"action"}
              border={false}
              onClick={() => handleApprovalHistory(record.id)}
            >
              <span className={"text-black ml-0"}>Approval History</span>
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

  // ─── Column Action Permission ──────────────────────────────────────────────
  const actionColumns = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess,
    "View",
    "page",
    true
  );

  // ─── Base Columns ──────────────────────────────────────────────────────────
  const baseColumns = useMemo(() => {
    const cols = [
      ...columnsCollectionActivities(
        search,
        page,
        initialPageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ...actionColumns,
    ];
    return cols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [search, page, searchedColumn, searchText, handleSearch, actionColumns]);

  const columnDefinitions = useMemo(
    () =>
      baseColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [baseColumns]
  );

  const columns = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    baseColumns.forEach((col) => {
      const colKey = col.key || col.dataIndex || col.title;
      if (fixedColumns.left.includes(colKey)) leftFixed.push(col);
      else if (fixedColumns.right.includes(colKey)) rightFixed.push(col);
      else normal.push(col);
    });

    const reordered = [...leftFixed, ...normal, ...rightFixed];

    return reordered.map((col) => {
      const newCol = { ...col };
      const colKey = col.key || col.dataIndex || col.title;
      if (fixedColumns.left.includes(colKey)) newCol.fixed = "left";
      else if (fixedColumns.right.includes(colKey)) newCol.fixed = "right";
      else delete newCol.fixed;
      return newCol;
    });
  }, [baseColumns, fixedColumns]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px] text-primary">ACTIVITIES LIST</p>
              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div className={"w-full"}>
            <TableRBI
              idTable="collectionActivitiesTable"
              dataSource={allData}
              columns={columns}
              current={page}
              pageSize={initialPageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements || 0}
              loading={loading}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 1200 }}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              useInfiniteScroll={true}
              usePagination={false}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              showRefresh={true}
              onRefresh={handleRefresh}
              refreshLabel="Refresh"
              enableRowClick={true}
              selectedRowKey={selectedRowKey}
              onRowClick={handleRowClick}
            />
          </div>
        </CardContainer>

        {inlineDetail ? (
          <div ref={detailContainerRef}>
            <CollectionActivitiesInlineDetail
              detailData={inlineDetail}
              attachmentData={inlineAttachments}
              approvalOptions={approvalHierarchyOptions}
              approvalDetails={approvalHierarchyDetail}
              loadingApproval={loadingInlineApproval}
              dispatch={dispatch}
              onCriteriaSubmitted={handleInlineCriteriaSubmitted}
            />
          </div>
        ) : null}

        {/* Modal Approval History */}
        <ModalApprovalCollectionActivities
          isOpen={modalApproval}
          handleCancel={() => setModalApproval(false)}
          handleRefresh={handleRefresh}
        />

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={1000}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        {/* Modal Inactive / Activate */}
        <ModalInactivateWithHierarchy
          selector={"collectionActivities"}
          dispatch={dispatch}
          getAPIOption={getListApprovalHierarchyCA}
          getAPIDetail={getListApprovalHierarchyDetailCA}
          header={
            normalizeStatus(chooseId?.status) === "INACTIVE"
              ? "Activate Information"
              : "Inactive Information"
          }
          alertMessage={`Are you sure you want to ${
            normalizeStatus(chooseId?.status) === "INACTIVE"
              ? "activate"
              : "inactivate"
          } this Activity with code ${chooseId?.activitiesCode || ""}?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

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
              bodyError.actionType || "inactivate"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
    </>
  );
};

export default CollectionActivitiesView;
