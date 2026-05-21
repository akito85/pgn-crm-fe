import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import { Tooltip } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  deleteMenu,
  downloadMenu,
  getAllMenuPaginate,
  getMenuDetail,
  inactiveMenu,
} from "../../../../redux/slices/system_setup/menu";
import useIsSuperUser from "../../../../components/useIsSuperUser";
import DetailMenuLayout from "./DetailMenuLayout";
import IconViewList from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconDeleteMenu from "../../../../assets/Icon/Nx/IconDeleteMenu";
import IconActive from "../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../assets/icons/nx/IconInactive";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import StatusComponent from "../../../../components/StatusComponent";

const OPERATOR_MAP = {
  "Contains": "LIKE",
  "Equal to": "EQUALS",
  "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN",
  "Less than": "LESS_THAN",
  "Is empty": "IS_NULL",
  "Is not empty": "IS_NOT_NULL",
};

const Menu = () => {
  const dispatch = useDispatch();
  const { data_detail } = useSelector((state) => state.main_Menu);
  const { bodyError } = useSelector((state) => state?.general);

  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch {
      return null;
    }
  }, [rawToken]);

  // Infinite scroll data state
  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [sort, setSort] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // Modal state
  const [modalInactive, setModalInactive] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [body, setBody] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const isSuperUser = useIsSuperUser();

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
      if (isNullOp) {
        combined[f.column] = `~${selector}`;
      } else if (f.value) {
        combined[f.column] = `${f.value}~${selector}`;
      }
    };
    if (advSearch?.filters) advSearch.filters.forEach(applyFilter);
    if (advSearch?.filterRules) advSearch.filterRules.forEach((rule) => rule.filters.forEach(applyFilter));
    return encodeURIComponent(JSON.stringify(combined));
  }, []);

  const fetchPage = useCallback(
    async (page, replace = false, signal = null) => {
      if (isFetchingRef.current) return;
      if (signal?.aborted) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const reqSearch = buildSearch(advancedSearch);
        const result = await dispatch(
          getAllMenuPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
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
        if (!signal?.aborted) console.error("Menu fetchPage error", e);
      } finally {
        isFetchingRef.current = false;
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [advancedSearch, sort, pageSize, dispatch, buildSearch]
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
  }, [advancedSearch, sort, pageSize]); // intentionally exclude fetchPage

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

  const onAdvanceSearch = useCallback((searchData) => {
    setAdvancedSearch(searchData);
  }, []);

  const handleChange = useCallback((_, pageSizeChange) => {
    setPageSize(pageSizeChange);
  }, []);

  const handleDownload = useCallback(() => {
    dispatch(
      downloadMenu({
        page: 1,
        pageSize: totalElements || 1000,
        sort,
        search: buildSearch(advancedSearch),
      })
    );
  }, [dispatch, sort, totalElements, advancedSearch, buildSearch]);

  const resetAndReload = useCallback(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const handleCancel = useCallback(() => {
    setModalInactive(false);
    setModalDelete(false);
  }, []);

  const handleOk = async () => {
    const payload = { id, status };
    setBody(payload);
    handleCancel();
    try {
      await dispatch(inactiveMenu(payload))?.unwrap();
    } catch {}
    resetAndReload();
  };

  const handleDetail = async (menuId) => {
    try {
      setBody(menuId);
      await dispatch(getMenuDetail(menuId))?.unwrap();
      setModalDetail(true);
    } catch {
      setModalDetail(false);
    }
  };

  const handleDelete = async () => {
    handleCancel();
    try {
      await dispatch(deleteMenu(deleteId))?.unwrap();
    } catch {}
    resetAndReload();
  };

  const columns = useMemo(() => [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "MENU NAME",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 240,
      ellipsis: { showTitle: false },
    },
    {
      title: "PATH",
      dataIndex: "path",
      key: "path",
      width: 240,
      sorter: true,
      align: "left",
      ellipsis: { showTitle: false },
    },
    {
      title: "MENU TYPE",
      dataIndex: "menuType",
      key: "menuType",
      align: "center",
      sorter: true,
      width: 160,
    },
    {
      title: "PARENT",
      dataIndex: "parentName",
      key: "parentName",
      sorter: true,
      ellipsis: { showTitle: false },
    },
    {
      title: "IS PAGE",
      dataIndex: "isPage",
      key: "isPage",
      align: "center",
      sorter: true,
      width: 100,
    },
    {
      title: "ORDER",
      dataIndex: "menuOrder",
      key: "menuOrder",
      width: 90,
      align: "center",
      sorter: true,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      align: "left",
      sorter: true,
      ellipsis: { showTitle: false },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      sorter: true,
      fixed: "right",
      render: (text) => {
        const label = text
          ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
          : text;
        return label ? (
          <StatusComponent colour={text} size="small">{label}</StatusComponent>
        ) : text;
      },
    },
  ], []);

  const itemActions = useMemo(() => [
    // Toolbar actions
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_MENU} state={{ x: 1 }}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Menu
          </ButtonComponent>
        </NavLink>
      ),
    },
    // Table column actions
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <span className="text-gray-400 hover:text-[#1976D2] transition-colors duration-200">
            <IconViewList width={20} onClick={() => handleDetail(record?.menuId)} />
          </span>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record) => {
        const active = record?.status?.toLowerCase() !== "inactive";
        return (
          <Tooltip title="Update">
            <Link
              to={active ? SYSTEM_SETUP_ROUTES.UPDATE_MENU : undefined}
              state={active ? { id: record?.menuId } : undefined}
              style={{ pointerEvents: active ? "auto" : "none" }}
            >
              <span className={`transition-colors duration-200 ${active ? "text-gray-400 hover:text-[#1976D2]" : "text-gray-300 cursor-not-allowed"}`}>
                <IconEditNx width={20} />
              </span>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record) => {
        const isActive = record?.status?.toUpperCase() === "ACTIVE";
        return (
          <Tooltip title={isActive ? "Inactivate" : "Activate"}>
            {isActive
              ? <span className="text-gray-400 hover:text-[#D32F2F] transition-colors duration-200">
                  <IconActive width={20} onClick={() => { setModalInactive(true); setId(record?.menuId); setStatus(record?.status); }} />
                </span>
              : <span className="text-gray-400 hover:text-[#1976D2] transition-colors duration-200">
                  <IconInactive width={20} onClick={() => { setModalInactive(true); setId(record?.menuId); setStatus(record?.status); }} />
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
          <span className="text-gray-400 hover:text-[#D32F2F] transition-colors duration-200">
            <IconDeleteMenu width={20} onClick={() => { setDeleteId(record?.menuId); setModalDelete(true); }} />
          </span>
        </Tooltip>
      ),
    }] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [isSuperUser]);

  const actionColumns = useColumnActionPermission(
    ["View", "Update", "Activate", ...(isSuperUser ? ["Delete"] : [])],
    itemActions
  );

  const allColumns = useMemo(
    () => [...columns, ...actionColumns],
    [columns, actionColumns]
  );

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_MENU, breadcrumbName: "Menu" },
  ];

  const handleRetry = useCallback(() => {
    handleCancelTryAgainRef.current?.();
    if (bodyError?.action === "INACTIVE_MENU") {
      dispatch(inactiveMenu(body));
    } else if (bodyError?.action === "GET_MENU_DETAIL") {
      dispatch(getMenuDetail(body));
    } else if (bodyError?.action === "DOWNLOAD_MENU") {
      handleDownload();
    }
    resetAndReload();
  }, [bodyError, body, dispatch, handleDownload, resetAndReload]);

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  handleCancelTryAgainRef.current = handleCancelTryAgain;

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="MENU LIST" className="mt-4" actions={itemActions}>
        <NxTable
          idTable="menu-list"
          userId={userId}
          dataSource={allData}
          columns={allColumns}
          columnDefinitions={columns}
          rowKey={(r) => r.menuId ?? r.id}
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
          tableScrolled={{ x: 1800, y: 525 }}
        />
      </NxCardContainer>

      {/* Detail modal */}
      <ModalCustom
        isOpen={modalDetail}
        header="MENU DETAIL"
        width={1000}
        type="detail"
        handleCancel={() => setModalDetail(false)}
      >
        <DetailMenuLayout data_detail={data_detail} />
        <div className="flex justify-end mt-8">
          <ButtonComponent onClick={() => setModalDetail(false)} border={true}>
            Back
          </ButtonComponent>
        </div>
      </ModalCustom>

      {/* Activate / Inactivate modal */}
      <ModalConfirm
        isOpen={modalInactive}
        handleCancel={() => setModalInactive(false)}
        handleOk={handleOk}
        width={500}
        useOk={true}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className="w-full flex flex-row items-center px-10">
            <WarningOutlined style={{ color: "red" }} className="text-4xl" />
            <span className="text-lg text-black font-bold h-auto mx-auto">
              {`Are you sure you want to ${status === "ACTIVE" ? "inactivate" : "activate"}?`}
            </span>
          </div>
        </div>
      </ModalConfirm>

      {/* Delete modal */}
      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDelete}
        header="Delete Menu"
        width={500}
        useOk={true}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className="w-full flex flex-row items-center px-10">
            <WarningOutlined style={{ color: "red" }} className="text-4xl" />
            <span className="text-lg text-black font-bold h-auto mx-auto">
              Are you sure you want to permanently delete this menu? This cannot be undone.
            </span>
          </div>
        </div>
      </ModalConfirm>

      {renderModal()}
    </>
  );
};

export default Menu;
