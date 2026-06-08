import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import {
  downloadExcel,
  getAllEntityPaginate,
  inactiveEntity,
} from "../../../../redux/slices/system_setup/entity";
import { Alert, Form, Tooltip } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { DownloadOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import InputComponent from "../../../../components/InputComponent";
import { intToNPWP } from "../../../../utils/npwp";
import { formMessageRequired } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import IconViewList from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconActive from "../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../assets/icons/nx/IconInactive";

const OPERATOR_MAP = {
  "Contains": "LIKE", "Equal to": "EQUALS", "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN", "Less than": "LESS_THAN",
  "Is empty": "IS_NULL", "Is not empty": "IS_NOT_NULL",
};

const EntityPage = () => {
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

  const [status, setStatus] = useState("");
  const [entityId, setEntityId] = useState("");
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [remark, setRemark] = useState("");
  const [record, setRecord] = useState({});

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
        getAllEntityPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
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
      if (!signal?.aborted) console.error("Entity fetchPage error", e);
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
    dispatch(downloadExcel({
      page: 1, pageSize: totalElements || 1000, sort, search: buildSearch(advancedSearch),
    }));
  }, [dispatch, sort, totalElements, advancedSearch, buildSearch]);

  const handleClear = () => {
    setRemark("");
    form.resetFields();
    setOpenModalConfirm(false);
  };

  const handleSaveModalInactivateFinal = async (formValue) => {
    const body = { ...formValue, id: entityId, status };
    await dispatch(inactiveEntity(body)).unwrap().then(() => {
      resetAndReload();
      handleClear();
    });
  };

  const columns = useMemo(() => [
    { title: "NO", key: "no", width: 90, align: "center", render: (_, __, index) => index + 1 },
    { title: "NAME", dataIndex: "entityName", key: "entityName", sorter: true, width: 300 },
    { title: "ENTITY CODE", dataIndex: "entityCode", key: "entityCode", sorter: true, align: "left" },
    { title: "EMAIL", dataIndex: "email", key: "email", sorter: true, align: "left" },
    { title: "ADDRESS", dataIndex: "address", key: "address", sorter: true, align: "left", ellipsis: { showTitle: false } },
    {
      title: "TAX IDENTIFIER", dataIndex: "taxIdentifier", key: "taxIdentifier", sorter: true, align: "left",
      render: (text) => intToNPWP(text),
    },
    { title: "PHONE NUMBER", dataIndex: "phone", key: "phone", sorter: true, align: "left", width: 200 },
    { title: "FAX NUMBER", dataIndex: "fax", key: "fax", sorter: true, align: "left", width: 200 },
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
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_ENTITY}>
          <ButtonComponent icon={<PlusOutlined style={{ fontSize: "24px" }} />} type="submit">
            Create Entity
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "view",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <Link
            to={SYSTEM_SETUP_ROUTES.DETAIL_ENTITY}
            state={{ id: record?.entityId }}
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200"
          >
            <IconViewList width={20} />
          </Link>
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
                to={!disabled ? SYSTEM_SETUP_ROUTES.UPDATE_ENTITY : undefined}
                state={!disabled ? { id: record?.entityId } : undefined}
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
          setEntityId(record?.entityId); setStatus(record?.status);
          setOpenModalConfirm(true); setRecord(record);
          setTypeModal(record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [handleDownload]);

  const columnActions = useColumnActionPermission(["view", "activate", "update"], itemActions);
  const allColumns = useMemo(() => [...columns, ...columnActions], [columns, columnActions]);

  const handleRetry = useCallback(() => {
    handleCancelTryAgainRef.current?.();
    resetAndReload();
  }, [resetAndReload]);

  const { handleCancelTryAgain, renderModal } = useTryAgainHooks(handleRetry);
  handleCancelTryAgainRef.current = handleCancelTryAgain;

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_ENTITY, breadcrumbName: "Entity" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="ENTITY LIST" className="mt-4" actions={itemActions}>
        <NxTable
          idTable="entity-list"
          userId={userId}
          dataSource={allData}
          columns={allColumns}
          columnDefinitions={columns}
          rowKey={(r) => r.entityId ?? r.id}
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
          tableScrolled={{ x: 2300, y: 525 }}
        />
      </NxCardContainer>

      <ModalCustom
        isOpen={openModalConfirm}
        header={`${typeModal === "ACTIVE" ? "ACTIVATE" : "INACTIVATE"} INFORMATION`}
        width={1000}
        type="confirmation"
        handleCancel={handleClear}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={handleClear} type="default">Cancel</ButtonComponent>
            <ButtonComponent form="inactivateForm" type="submit" htmlType="submit">Confirm</ButtonComponent>
          </div>
        }
      >
        <Form id="inactivateForm" form={form} onFinish={handleSaveModalInactivateFinal}>
          <div className="flex flex-col gap-6">
            <Alert
              message={`Are you sure want to ${typeModal === "ACTIVE" ? "activate" : "inactivate"} entity named ${record?.entityName}?`}
              icon={<InfoCircleOutlined />}
              type="warning"
              showIcon
              className="inactivate-alert"
            />
            <Form.Item name="remark" rules={formMessageRequired("remark")} className="w-full">
              <InputComponent
                group rows={1} type="textarea" value={remark} placeholder="Type your remark"
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </div>
        </Form>
      </ModalCustom>

      {renderModal()}
    </>
  );
};

export default EntityPage;
