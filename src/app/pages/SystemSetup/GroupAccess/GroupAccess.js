import { Tree, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import { DownloadOutlined, PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { useDispatch, useSelector } from "react-redux";
import {
  activeAndInactiveGroupAccess,
  deleteGroupAccess,
  detailGroupAccess,
  downloadGroupAccess,
  getAllGroupAccessPaginate,
} from "../../../../redux/slices/system_setup/group_access";
import useIsSuperUser from "../../../../components/useIsSuperUser";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import moment from "moment";
import { ModalConfirm, ModalSuccess } from "../../../../components/Modal/ModalPopUp";
import { transformGaMenuDetail } from "./util";
import CardComponent from "../../../../components/Card/CardComponent";
import { hasValue } from "../../../../utils";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import IconViewList from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconDeleteMenu from "../../../../assets/Icon/Nx/IconDeleteMenu";
import IconActive from "../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../assets/icons/nx/IconInactive";

const OPERATOR_MAP = {
  "Contains": "LIKE", "Equal to": "EQUALS", "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN", "Less than": "LESS_THAN",
  "Is empty": "IS_NULL", "Is not empty": "IS_NOT_NULL",
};

const GroupAccess = () => {
  const { data_detail } = useSelector((state) => state.groupAccess);
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();
  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try { const t = JSON.parse(rawToken || "{}"); return t?.userId || t?.id || t?.username || null; }
    catch { return null; }
  }, [rawToken]);
  const isSuperUser = useIsSuperUser();

  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  const [modalInactive, setModalInactive] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [gaId, setGaId] = useState("");
  const [status, setStatus] = useState("");
  const [body, setBody] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
        getAllGroupAccessPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
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
      if (!signal?.aborted) console.error("GroupAccess fetchPage error", e);
    } finally {
      isFetchingRef.current = false;
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [advancedSearch, sort, pageSize, dispatch, buildSearch]);

  useEffect(() => {
    const signal = { aborted: false };
    pageRef.current = 0; setAllData([]); setHasMore(false); setIsLoading(true);
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
    dispatch(downloadGroupAccess({
      page: 1, pageSize: totalElements || 1000, sort, search: buildSearch(advancedSearch),
    }));
  }, [dispatch, sort, totalElements, advancedSearch, buildSearch]);

  const handleDetail = async (id) => {
    try {
      setBody(id);
      await dispatch(detailGroupAccess(id))?.unwrap();
      setModalDetail(true);
    } catch { setModalDetail(false); }
  };

  const handleOk = async () => {
    const payload = { id: gaId, status };
    setBody(payload);
    setModalInactive(false);
    try {
      await dispatch(activeAndInactiveGroupAccess(payload)).unwrap();
    } catch {}
    resetAndReload();
  };

  const handleDelete = async () => {
    setModalDelete(false);
    try { await dispatch(deleteGroupAccess(deleteId))?.unwrap(); } catch {}
    resetAndReload();
  };

  const columns = useMemo(() => [
    { title: "NO", key: "no", width: 90, align: "center", render: (_, __, index) => index + 1 },
    { title: "GROUP ACCESS NAME", dataIndex: "name", key: "name", sorter: true, ellipsis: { showTitle: false } },
    { title: "USER LEVEL", dataIndex: "userLevel", key: "userLevel", sorter: true, align: "center", width: 200 },
    { title: "DESCRIPTION", dataIndex: "description", key: "description", sorter: true, width: 300, ellipsis: { showTitle: false } },
    {
      title: "STATUS", dataIndex: "status", key: "status", align: "center", width: 120, sorter: true, fixed: "right",
      render: (text) => {
        const label = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;
        return label ? <div className="flex justify-center"><StatusComponent colour={text} size="small">{label}</StatusComponent></div> : text;
      },
    },
  ], []);

  const itemActions = useMemo(() => [
    {
      action: "Download",
      render: (
        <ButtonComponent type="submit" icon={<DownloadOutlined style={{ fontSize: "24px" }} />} onClick={handleDownload}>
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_GROUP_ACCESS} state={{ x: 1 }}>
          <ButtonComponent icon={<PlusOutlined style={{ fontSize: "24px" }} />} type="submit">
            Create Group Access
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <span className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200 cursor-pointer" onClick={() => handleDetail(record?.gaId)}>
            <IconViewList width={20} />
          </span>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record) => {
        const disabled = record?.status?.toLowerCase() === "inactive";
        return (
          <Tooltip title="Update">
            <div className={`inline-flex items-center ${disabled ? "cursor-not-allowed text-gray-300" : ""}`}>
              <Link
                to={!disabled ? SYSTEM_SETUP_ROUTES.UPDATE_GROUP_ACCESS : undefined}
                state={!disabled ? { id: record?.gaId } : undefined}
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
      action: "Activate",
      type: "table",
      render: (record) => {
        const isActive = record?.status?.toUpperCase() === "ACTIVE";
        const handleToggle = () => { setModalInactive(true); setGaId(record?.gaId); setStatus(record?.status); };
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
      action: "Delete",
      type: "table",
      render: (record) => (
        <Tooltip title="Delete">
          <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={() => { setDeleteId(record?.gaId); setModalDelete(true); }}>
            <IconDeleteMenu width={20} />
          </span>
        </Tooltip>
      ),
    }] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [isSuperUser, handleDownload]);

  const actionColumns = useColumnActionPermission(
    ["View", "Update", "Activate", ...(isSuperUser ? ["Delete"] : [])],
    itemActions
  );
  const allColumns = useMemo(() => [...columns, ...actionColumns], [columns, actionColumns]);

  const handleRetry = useCallback(() => {
    handleCancelTryAgainRef.current?.();
    if (bodyError?.action === "ACTIVE_GROUP_ACCESS") dispatch(activeAndInactiveGroupAccess(body));
    else if (bodyError?.action === "GET_GROUP_ACCESS_DETAIL") dispatch(detailGroupAccess(body));
    else if (bodyError?.action === "DOWNLOAD_ACTION") handleDownload();
    resetAndReload();
  }, [bodyError, body, dispatch, handleDownload, resetAndReload]);

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  handleCancelTryAgainRef.current = handleCancelTryAgain;

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_GROUP_ACCESS, breadcrumbName: "Group Access" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="GROUP ACCESS LIST" className="mt-4" actions={itemActions}>
        <NxTable
          idTable="group-access-list"
          userId={userId}
          dataSource={allData}
          columns={allColumns}
          columnDefinitions={columns}
          rowKey={(r) => r.gaId ?? r.id}
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
          tableScrolled={{ x: 1400, y: 525 }}
        />
      </NxCardContainer>

      <ModalCustom
        isOpen={modalDetail}
        width={1000}
        handleCancel={() => setModalDetail(false)}
        header="DETAIL GROUP ACCESS"
        footer={
          <div className="w-full flex justify-end gap-5">
            <ButtonComponent onClick={() => setModalDetail(false)} border={true}>Back</ButtonComponent>
          </div>
        }
      >
        <CardComponent header="GROUP ACCESS INFORMATION" cols={4}>
          <DetailText label="Group Access Name">{data_detail?.name}</DetailText>
          <DetailText label="User Level">{data_detail?.userLevelName}</DetailText>
          <DetailText label="Description">{data_detail?.description}</DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
        </CardComponent>
        <CardComponent header="HISTORY LOG INFORMATION" cols={5}>
          <DetailText label="Record Id">{data_detail?.gaId}</DetailText>
          <DetailText label="Created Date">
            {hasValue(data_detail?.createdDate) && moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {hasValue(data_detail?.updatedDate) && moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
        </CardComponent>
        <CardComponent header="MENU ACCESS">
          {transformGaMenuDetail(data_detail).map((res) => (
            <div key={res.title}>
              <Tree treeData={[res]} rootStyle={{ backgroundColor: "#e6f1f9" }} />
            </div>
          ))}
        </CardComponent>
      </ModalCustom>

      <ModalConfirm isOpen={modalInactive} handleCancel={() => setModalInactive(false)} handleOk={handleOk} width={500} useOk={true}>
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className="w-full flex flex-row items-center px-10">
            <WarningOutlined style={{ color: "red" }} className="text-4xl" />
            <span className="text-lg text-black font-bold h-auto mx-auto">
              {`Are you sure want to ${status === "ACTIVE" ? "inactivate" : "activate"}?`}
            </span>
          </div>
        </div>
      </ModalConfirm>

      <ModalConfirm isOpen={modalDelete} handleCancel={() => setModalDelete(false)} handleOk={handleDelete} header="Delete Group Access" width={500} useOk={true}>
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className="w-full flex flex-row items-center px-10">
            <WarningOutlined style={{ color: "red" }} className="text-4xl" />
            <span className="text-lg text-black font-bold h-auto mx-auto">
              Are you sure you want to permanently delete this group access? All menu and action assignments will also be removed. This cannot be undone.
            </span>
          </div>
        </div>
      </ModalConfirm>

      <ModalSuccess isOpen={modalSuccess} handleOk={() => setModalSuccess(false)} handleCancel={() => setModalSuccess(false)}>
        <div className="px-8 py-8 justify-center">
          <p className="text-[18px] font-bold">Successful</p>
          <p className="pl-11">Your data has been Updated.</p>
        </div>
      </ModalSuccess>

      <ModalSuccess isOpen={modalError} handleOk={() => setModalError(false)} handleCancel={() => setModalError(false)}>
        <div className="px-8 py-8 justify-center">
          <p className="text-[18px] font-bold">Failed</p>
          <p className="pl-11">Your data was not created. Please try again.</p>
        </div>
      </ModalSuccess>

      {renderModal()}
    </>
  );
};

export default GroupAccess;
