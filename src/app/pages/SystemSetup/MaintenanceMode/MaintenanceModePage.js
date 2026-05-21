import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Switch, Tooltip } from "antd";
import { getMaintenanceMode } from "../../../../redux/slices/system_setup/maintenanceMode";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import BreadCrumb from "../../../../components/BreadCrumb";
import ModalDetailMaintenanceMode from "./Modal/ModalDetailMaintenanceMode";
import ModalConfirmationTurnOnOff from "./Modal/ModalConfirmationTurnOnOff";
import IconViewList from "../../../../assets/Icon/Nx/IconViewList";
import moment from "moment";

const OPERATOR_MAP = {
  "Contains": "LIKE", "Equal to": "EQUALS", "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN", "Less than": "LESS_THAN",
  "Is empty": "IS_NULL", "Is not empty": "IS_NOT_NULL",
};

const MaintenanceModePage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const rawToken = useSelector((state) => state.auth?.token);
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

  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalTurnOnOff, setModalTurnOnOff] = useState(false);
  const [bodyData, setBodyData] = useState({});
  const [switchValue, setSwitchValue] = useState(false);

  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

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
        getMaintenanceMode({ page: page + 1, pageSize, sort, search: reqSearch })
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
      setSwitchValue(rows.some((item) => item?.status === "ACTIVE"));
    } catch (e) {
      if (!signal?.aborted) console.error("MaintenanceMode fetchPage error", e);
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

  const handleReset = useCallback(() => {
    const signal = { aborted: false };
    pageRef.current = 0; setAllData([]); setHasMore(false); setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const handleSwitchChange = (value) => {
    if (value === false) {
      setBodyData(allData?.filter((item) => item?.status === "ACTIVE")?.map((item) => ({ ...item, value }))[0]);
    } else {
      setBodyData({ value });
    }
    setModalTurnOnOff(true);
  };

  const handleOpenDetail = (val) => {
    setModalConfirm(true);
    setBodyData(val);
  };

  const columns = useMemo(() => [
    { title: "NO", key: "no", width: 60, align: "center", render: (_, __, index) => index + 1 },
    {
      title: "START DATE", dataIndex: "startDate", key: "startDate", sorter: true, align: "center", width: 140,
      render: (v) => v ? moment(v).format("DD MMM YYYY") : "",
    },
    {
      title: "END DATE", dataIndex: "endDate", key: "endDate", sorter: true, align: "center", width: 140,
      render: (v) => v ? moment(v).format("DD MMM YYYY") : "",
    },
    { title: "TURN ON REMARK", dataIndex: "remarkOn", key: "remarkOn", sorter: true, ellipsis: { showTitle: false } },
    { title: "TURN OFF REMARK", dataIndex: "remarkOff", key: "remarkOff", sorter: true, ellipsis: { showTitle: false } },
    {
      title: "STATUS", dataIndex: "status", key: "status", align: "center", width: 120, sorter: true, fixed: "right",
      render: (text) => {
        const label = text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;
        return label ? <StatusComponent colour={text} size="small">{label}</StatusComponent> : text;
      },
    },
  ], []);

  const itemActions = useMemo(() => [
    {
      action: "Create",
      render: (
        <div className="w-full flex justify-end" style={{ marginBottom: "20px" }}>
          <Switch
            checked={switchValue}
            onChange={handleSwitchChange}
            checkedChildren="Turn on"
            unCheckedChildren="Turn off"
          />
        </div>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <span
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200 cursor-pointer"
            onClick={() => handleOpenDetail(record)}
          >
            <IconViewList width={20} />
          </span>
        </Tooltip>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [switchValue]);

  const actionColumns = useColumnActionPermission(["view"], itemActions);
  const allColumns = useMemo(() => [...columns, ...actionColumns], [columns, actionColumns]);

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Maintenance Mode" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="MAINTENANCE MODE" className="mt-4" actions={itemActions}>
        <NxTable
          idTable="maintenance-mode-list"
          userId={userId}
          dataSource={allData}
          columns={allColumns}
          columnDefinitions={columns}
          rowKey={(r) => r.id ?? r.maintenanceId}
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
          showExport={false}
          showAdvanceSearch={true}
          showSearchBar={true}
          tableScrolled={{ x: 1300, y: 525 }}
        />
      </NxCardContainer>

      <ModalDetailMaintenanceMode
        isOpen={modalConfirm}
        data={bodyData}
        handleCancel={() => setModalConfirm(false)}
      />

      <ModalConfirmationTurnOnOff
        isOpen={modalTurnOnOff}
        handleCancel={() => setModalTurnOnOff(false)}
        handleReset={handleReset}
        switchValue={switchValue}
        bodyData={bodyData}
        setBodyData={setBodyData}
        setSwitchValue={setSwitchValue}
      />
    </>
  );
};

export default MaintenanceModePage;
