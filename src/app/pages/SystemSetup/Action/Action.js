import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import {
  downloadAction,
  getAllActionPaginate,
  getDetailAction,
  inactiveAction,
  deleteAction,
} from "../../../../redux/slices/system_setup/action";
import { Tooltip } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { DownloadOutlined, PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { hasValue, toTitleCase } from "../../../../utils";
import moment from "moment";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import IconViewList from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconDeleteMenu from "../../../../assets/Icon/Nx/IconDeleteMenu";
import IconActive from "../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../assets/icons/nx/IconInactive";
import DetailText from "../../../../components/DetailText";
import CardComponent from "../../../../components/Card/CardComponent";
import useIsSuperUser from "../../../../components/useIsSuperUser";

const OPERATOR_MAP = {
  "Contains": "LIKE", "Equal to": "EQUALS", "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN", "Less than": "LESS_THAN",
  "Is empty": "IS_NULL", "Is not empty": "IS_NOT_NULL",
};

const Action = () => {
  const dispatch = useDispatch();
  const rawToken = useSelector((state) => state.auth?.token);
  const { data_detail } = useSelector((state) => state.action);
  const isSuperUser = useIsSuperUser();

  const userId = useMemo(() => {
    try { const t = JSON.parse(rawToken || "{}"); return t?.userId || t?.id || t?.username || null; }
    catch { return null; }
  }, [rawToken]);

  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  const [modalDetail, setModalDetail] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [actId, setActId] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [status, setStatus] = useState("");

  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);
  const handleCancelTryAgainRef = useRef(null);

  const buildSearch = useCallback((advSearch) => {
    const combined = {};
    const applyFilter = (f) => {
      if (!f.column) return;
      const selector = OPERATOR_MAP[f.operator] || "LIKE";
      const isNullOp = selector === "IS_NULL" || selector === "IS_NOT_NULL";
      if (isNullOp) { combined[f.column] = `~${selector}`; }
      else if (f.value) { combined[f.column] = `${f.value}~${selector}`; }
    };
    if (advSearch?.filters) advSearch.filters.forEach(applyFilter);
    if (advSearch?.filterRules) advSearch.filterRules.forEach((r) => r.filters.forEach(applyFilter));
    return encodeURIComponent(JSON.stringify(combined));
  }, []);

  const fetchPage = useCallback(async (page, replace = false, signal = null) => {
    if (isFetchingRef.current) return;
    if (signal?.aborted) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const reqSearch = buildSearch(advancedSearch);
      const result = await dispatch(
        getAllActionPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
      ).unwrap();
      if (signal?.aborted) return;
      const rows = result?.result ?? [];
      const pageInfo = result?.page ?? {};
      const nextHasMore = page < (pageInfo.totalPages ?? 0) - 1;
      setAllData((prev) => (replace ? rows : [...prev, ...rows]));
      setTotalElements(pageInfo.totalElements ?? 0);
      setHasMore(nextHasMore);
      hasMoreRef.current = nextHasMore;
      pageRef.current = page;
    } catch (e) {
      if (!signal?.aborted) console.error("Action fetchPage error", e);
    } finally {
      isFetchingRef.current = false;
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [advancedSearch, sort, pageSize, dispatch, buildSearch]);

  useEffect(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
    return () => { signal.aborted = true; isFetchingRef.current = false; };
  }, [advancedSearch, sort, pageSize]);

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;
    return fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  const onSort = useCallback((_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  }, []);

  const onAdvanceSearch = useCallback((searchData) => setAdvancedSearch(searchData), []);
  const handleChange = useCallback((_, pageSizeChange) => setPageSize(pageSizeChange), []);

  const resetAndReload = useCallback(() => {
    const signal = { aborted: false };
    pageRef.current = 0; setAllData([]); setHasMore(false); setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const handleDownload = useCallback(() => {
    dispatch(downloadAction({
      page: 1, pageSize: totalElements || 1000, sort, search: buildSearch(advancedSearch),
    }));
  }, [dispatch, sort, totalElements, advancedSearch, buildSearch]);

  const handleDetail = async (id) => {
    try {
      await dispatch(getDetailAction(id)).unwrap();
      setModalDetail(true);
    } catch {
      setModalDetail(false);
    }
  };

  const handleOk = async () => {
    try {
      await dispatch(inactiveAction({ id: actId, status })).unwrap();
    } finally {
      setModalActive(false);
      resetAndReload();
    }
  };

  const handleDelete = async () => {
    setModalDelete(false);
    try {
      await dispatch(deleteAction(deleteId)).unwrap();
    } finally {
      resetAndReload();
    }
  };

  const columns = useMemo(() => [
    { title: "NO", key: "no", width: 90, align: "center", render: (_, __, index) => index + 1 },
    { title: "ACTION NAME", dataIndex: "name", key: "name", sorter: true, width: 300 },
    { title: "DESCRIPTION", dataIndex: "description", key: "description", sorter: true, ellipsis: { showTitle: false } },
    {
      title: "STATUS", dataIndex: "status", key: "status", align: "center", width: 120, sorter: true, fixed: "right",
      render: (text) => {
        const label = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;
        return label
          ? <div className="flex justify-center"><StatusComponent colour={text} size="small">{label}</StatusComponent></div>
          : text;
      },
    },
  ], []);

  const itemActions = useMemo(() => [
    {
      action: "download",
      render: (
        <ButtonComponent type="submit" icon={<DownloadOutlined style={{ fontSize: "24px" }} />} onClick={handleDownload}>Download List</ButtonComponent>
      ),
    },
    {
      action: "create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_ACTION}>
          <ButtonComponent icon={<PlusOutlined style={{ fontSize: "24px" }} />} type="submit">
            Create Action
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "view",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <span
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200 cursor-pointer"
            onClick={() => handleDetail(record?.actionId)}
          >
            <IconViewList width={20} />
          </span>
        </Tooltip>
      ),
    },
    {
      action: "update",
      type: "table",
      render: (record) => {
        const disabled = record?.status?.toLowerCase() === "inactive";
        return (
          <Tooltip title="Update">
            <div className={`inline-flex items-center ${disabled ? "cursor-not-allowed text-gray-300" : ""}`}>
              <Link
                to={!disabled ? SYSTEM_SETUP_ROUTES.UPDATE_ACTION : undefined}
                state={!disabled ? { id: record?.actionId } : undefined}
                className={`inline-flex items-center transition-colors duration-200 ${disabled ? "text-gray-300 pointer-events-none" : "text-[#1976D2] hover:text-[#1976D2]"}`}
              >
                <IconEditNx width={20} />
              </Link>
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "activate",
      type: "table",
      render: (record) => {
        const isActive = record?.status?.toUpperCase() === "ACTIVE";
        const handleToggle = () => {
          setActId(record?.actionId);
          setStatus(record.status);
          setModalActive(true);
        };
        return (
          <Tooltip title={isActive ? "Inactivate" : "Activate"}>
            {isActive
              ? <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={handleToggle}>
                  <IconInactive width={20} />
                </span>
              : <span className="inline-flex items-center text-green-600 hover:text-green-600 transition-colors duration-200 cursor-pointer" onClick={handleToggle}>
                  <IconActive width={20} />
                </span>
            }
          </Tooltip>
        );
      },
    },
    ...(isSuperUser ? [{
      action: "delete",
      type: "table",
      render: (record) => (
        <Tooltip title="Delete">
          <span
            className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer"
            onClick={() => { setDeleteId(record?.actionId); setModalDelete(true); }}
          >
            <IconDeleteMenu width={20} />
          </span>
        </Tooltip>
      ),
    }] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [handleDownload, isSuperUser]);

  const columnActions = useColumnActionPermission(
    ["view", "activate", "update", ...(isSuperUser ? ["delete"] : [])],
    itemActions
  );
  const allColumns = useMemo(() => [...columns, ...columnActions], [columns, columnActions]);

  const handleRetry = useCallback(() => {
    handleCancelTryAgainRef.current?.();
    resetAndReload();
  }, [resetAndReload]);

  const { handleCancelTryAgain, renderModal } = useTryAgainHooks(handleRetry);
  handleCancelTryAgainRef.current = handleCancelTryAgain;

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_ACTION, breadcrumbName: "Action" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="ACTION LIST" className="mt-4" actions={itemActions}>
        <NxTable
          idTable="action-list"
          userId={userId}
          dataSource={allData}
          columns={allColumns}
          columnDefinitions={columns}
          rowKey={(r) => r.actionId ?? r.id}
          loading={isLoading}
          totalData={totalElements}
          current={pageRef.current + 1}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          onSort={onSort}
          onAdvanceSearch={onAdvanceSearch}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          useInfiniteScroll={true}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          handleDownload={handleDownload}
          showExport={true}
          showAdvanceSearch={true}
          showSearchBar={true}
          tableScrolled={{ x: 1200, y: 525 }}
        />
      </NxCardContainer>

      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDelete}
        header="Delete Action"
        width={500}
        useOk={true}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className="w-full flex flex-row items-center px-10">
            <WarningOutlined style={{ color: "red" }} className="text-4xl" />
            <span className="text-lg text-black font-bold h-auto mx-auto">
              Are you sure you want to permanently delete this action? This cannot be undone.
            </span>
          </div>
        </div>
      </ModalConfirm>

      <ModalConfirm
        isOpen={modalActive}
        handleCancel={() => setModalActive(false)}
        handleOk={handleOk}
        header={status === "ACTIVE" ? "Inactivate" : "Activate"}
        width={500}
        useOk={true}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className="w-full flex flex-row items-center px-10">
            <WarningOutlined style={{ color: "red" }} className="text-4xl" />
            <span className="text-lg text-black font-bold h-auto mx-auto">
              {`Are you sure want to ${status === "ACTIVE" ? "inactivate" : "activate"}?`}
            </span>
          </div>
        </div>
      </ModalConfirm>

      <ModalCustom
        isOpen={modalDetail}
        handleCancel={() => setModalDetail(false)}
        header="DETAIL ACTION"
        width={1000}
      >
        <div className="flex w-full flex-col gap-2">
          <div className="grid grid-cols-1 gap-3">
            <CardComponent header="ACTION INFORMATION" cols={4}>
              <DetailText label="Action Name">{data_detail?.name}</DetailText>
              <DetailText label="Description">{data_detail?.description}</DetailText>
              <DetailText label="Status">{toTitleCase(data_detail?.status)}</DetailText>
            </CardComponent>
          </div>
        </div>
        <CardComponent header="HISTORY LOG INFORMATION" cols={5}>
          <DetailText label="Record Id">{data_detail?.actionId}</DetailText>
          <DetailText label="Created Date">
            {hasValue(data_detail?.createdDate) && moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {hasValue(data_detail?.updatedDate) && moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
        </CardComponent>
        <div className="flex justify-end mt-8">
          <ButtonComponent onClick={() => setModalDetail(false)} border={true}>Back</ButtonComponent>
        </div>
      </ModalCustom>

      {renderModal()}
    </>
  );
};

export default Action;
