import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Spin, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import {
  detailPositionHierarchy,
  downloadHierarchy,
  getApprovHierarchyPaginate,
  inactiveAppHierarchy,
} from "../../../../redux/slices/user_management/hierarchySlice";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import CardComponent from "../../../../components/Card/CardComponent";
import { isEmpty, renderColumn, renderDateColumn, toTitleCase } from "../../../../utils";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../utils/sorterFunction";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import IconViewList from "../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../assets/Icon/Nx/IconEdit";
import IconActive from "../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../assets/icons/nx/IconInactive";

const OPERATOR_MAP = {
  "Contains": "LIKE", "Equal to": "EQUALS", "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN", "Less than": "LESS_THAN",
  "Is empty": "IS_NULL", "Is not empty": "IS_NOT_NULL",
};

const ApprovalHierarchyPage = () => {
  const { data_detail } = useSelector((state) => state.apphierarchy);
  const dispatch = useDispatch();
  const { bodyError } = useSelector((state) => state?.general);
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

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [status, setStatus] = useState("");
  const [modalType, setModalType] = useState("");
  const [appHierId, setAppHierId] = useState("");
  const [body, setBody] = useState({});
  const [record, setRecord] = useState({});

  const [pageDetail, setPageDetail] = useState(1);
  const [pageSizeDetail, setPageSizeDetail] = useState(10);
  const searchInput2 = useRef(null);
  const [searchedColumn2, setSearchedColumn2] = useState("");
  const [searchText2, setSearchText2] = useState("");
  const [search2, setSearch2] = useState({});
  const [typeColumn, setTypeColumn] = useState("string");

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
        getApprovHierarchyPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
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
      if (!signal?.aborted) console.error("ApprovalHierarchy fetchPage error", e);
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

  const handleDetail = async (id) => {
    try {
      setBody(id);
      await dispatch(detailPositionHierarchy(id))?.unwrap();
      setOpenModal(true);
    } catch { setOpenModal(false); }
  };

  const handleDownload = useCallback(async () => {
    try {
      await dispatch(downloadHierarchy({
        page: 1, pageSize: totalElements || 1000, sort, search: buildSearch(advancedSearch),
      }))?.unwrap();
    } catch {}
  }, [dispatch, sort, totalElements, advancedSearch, buildSearch]);

  const handleCancelModal = () => {
    form.resetFields();
    setModalType("");
    setOpenModal(false);
    setRecord({});
  };

  const onFinish = async (formValue, handleCancel) => {
    try {
      const payload = { id: appHierId, body: { ...formValue, status } };
      setBody(payload);
      handleCancel();
      handleCancelModal();
      await dispatch(inactiveAppHierarchy(payload))?.unwrap();
    } catch { handleCancelModal(); }
    resetAndReload();
  };

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    const tempPage = pageSizeDetail !== pageSizeChange ? 1 : pageChange;
    setPageDetail(tempPage);
    setPageSizeDetail(pageSizeChange);
  };

  const handleSearch2 = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText2(selectedKeys[0]);
    switch (dataIndex) {
      case "createdDate": setTypeColumn("datetime"); break;
      case "operation": setTypeColumn("status"); break;
      default: setTypeColumn("string"); break;
    }
    setSearchedColumn2(dataIndex);
    setSearch2((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const colLog = [
    { title: "NO", width: 60, align: "center", render: (_, __, index) => (pageDetail - 1) * pageSizeDetail + index + 1 },
    {
      title: "ACTOR", dataIndex: "createdBy", align: "left",
      sorter: (a, b) => sorterFunction("createdBy", a, b),
      ...getColumnSearchProps("createdBy", searchInput2, searchedColumn2, searchText2, handleSearch2, true),
      render: (text) => renderColumn("createdBy", searchedColumn2, searchText2, text, false, "input", search2),
    },
    {
      title: "ACTION", dataIndex: "operation", align: "left", width: 180,
      sorter: (a, b) => sorterFunction("operation", a, b),
      ...getColumnSearchProps("operation", searchInput2, searchedColumn2, searchText2, handleSearch2, true, "status"),
      render: (text) => renderColumn("operation", searchedColumn2, searchText2, text, false, "input", search2),
    },
    {
      title: "ACTION DATE", dataIndex: "createdDate", align: "center",
      sorter: (a, b) => sorterFunction("createdDate", a, b, "date"),
      ...getColumnSearchProps("createdDate", searchInput2, searchedColumn2, searchText2, handleSearch2, false, "datetime"),
      render: (text) => renderDateColumn("createdDate", searchedColumn2, searchText2, text, "datetime", search2),
    },
    {
      title: "REMARK", dataIndex: "remark", ellipsis: { showTitle: false },
      sorter: (a, b) => a.remark?.localeCompare(b.remark),
      ...getColumnSearchProps("remark", searchInput2, searchedColumn2, searchText2, handleSearch2, false),
      render: (text) => renderColumn("remark", searchedColumn2, searchText2, text, true, "input", search2),
    },
  ];

  const columns = useMemo(() => [
    { title: "NO", key: "no", width: 60, align: "center", render: (_, __, index) => index + 1 },
    { title: "APPROVAL HIERARCHY NAME", dataIndex: "approvalName", key: "approvalName", sorter: true, width: 300, ellipsis: { showTitle: false } },
    { title: "TYPE", dataIndex: "approvalType", key: "approvalType", sorter: true, width: 300, ellipsis: { showTitle: false } },
    { title: "DESCRIPTION", dataIndex: "desc", key: "desc", sorter: true, width: 300, ellipsis: { showTitle: false } },
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
      action: "Download",
      render: (
        <ButtonComponent icon={<DownloadOutlined style={{ fontSize: "24px" }} />} type="submit" onClick={handleDownload}>
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={USER_ROUTES.CREATE_APPROVAL_HIERARCHY}>
          <ButtonComponent icon={<PlusOutlined style={{ fontSize: "24px" }} />} type="submit">
            Create Approval Hierarchy
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <span
            className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200 cursor-pointer"
            onClick={() => { handleDetail(record?.appHierId); setModalType("detail"); }}
          >
            <IconViewList width={20} />
          </span>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record) => {
        const disabled = record?.status === "INACTIVE";
        return (
          <Tooltip title="Update">
            <div className={`inline-flex items-center ${disabled ? "cursor-not-allowed text-gray-300" : ""}`}>
              <NavLink
                to={!disabled ? USER_ROUTES.UPDATE_APPROVAL_HIERARCHY : undefined}
                state={!disabled ? { id: record?.appHierId } : undefined}
                className={`inline-flex items-center transition-colors duration-200 ${disabled ? "text-gray-300 pointer-events-none" : "text-[#1976D2] hover:text-[#1976D2]"}`}
              >
                <IconEditNx width={20} />
              </NavLink>
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record) => {
        const isActive = record?.status === "ACTIVE";
        const handleToggle = () => { setOpenModal(true); setModalType("inactive"); setStatus(record?.status); setAppHierId(record?.appHierId); setRecord(record); };
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

  const actionColumns = useColumnActionPermission(["View", "Activate", "Update"], itemActions);
  const allColumns = useMemo(() => [...columns, ...actionColumns], [columns, actionColumns]);

  const handleRetry = useCallback(() => {
    handleCancelTryAgainRef.current?.();
    if (bodyError?.action === "INACTIVE_APPROVAL_HIERARCHY") dispatch(inactiveAppHierarchy(body));
    else if (bodyError?.action === "GET_APPROVAL_HIERARCHY_DETAIL") dispatch(detailPositionHierarchy(body));
    else if (bodyError?.action === "DOWNLOAD_APPROVAL") handleDownload();
    handleCancelModal();
    resetAndReload();
  }, [bodyError, body, dispatch, handleDownload, resetAndReload]);

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  handleCancelTryAgainRef.current = handleCancelTryAgain;

  const routes = [
    { path: "", breadcrumbName: "User Management" },
    { path: "", breadcrumbName: "Approval Hierarchy" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="APPROVAL HIERARCHY LIST" className="mt-4" actions={itemActions}>
        <NxTable
          idTable="approval-hierarchy-list"
          userId={userId}
          dataSource={allData}
          columns={allColumns}
          columnDefinitions={columns}
          rowKey={(r) => r.appHierId ?? r.id}
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
          tableScrolled={{ x: 1600, y: 525 }}
        />
      </NxCardContainer>

      <ModalCustom
        isOpen={openModal && modalType === "detail"}
        handleCancel={handleCancelModal}
        header="Detail Approval Hierarchy Information"
        width={1200}
        type="detail"
      >
        <Spin spinning={isLoading}>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col col-span-2 gap-4 h-fit">
              <CardComponent header="APPROVAL HIERARCHY INFORMATION" cols={3}>
                <DetailText label="Approval Hierarchy Name">{data_detail?.approvalName}</DetailText>
                <DetailText label="Type">{data_detail?.approvalType}</DetailText>
                <DetailText label="Status">{toTitleCase(data_detail?.status)}</DetailText>
                <DetailText label="Description">{data_detail?.desc}</DetailText>
              </CardComponent>
              <CardComponent header="HISTORY LOG INFORMATION" cols={5}>
                <DetailText label="Record Id">{data_detail?.appHierId}</DetailText>
                <DetailText label="Created Date">
                  {isEmpty(data_detail?.createdDate) && moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
                </DetailText>
                <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
                <DetailText label="Updated Date">
                  {isEmpty(data_detail?.updatedDate) && moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")}
                </DetailText>
                <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
              </CardComponent>
            </div>
            <div className="h-auto mb-3">
              <div className="h-full bg-detail p-4 mb-3 rounded-md">
                <div className="text-primary text-xs font-semibold uppercase pb-[30px]">APPROVAL Hierarchy</div>
                {data_detail?.detail?.map((item, idx) => (
                  <DetailText key={idx} label={item.positionName}>{item.text}</DetailText>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col my-5 gap-5">
            <span className="text-dg-blue text-sm gap-5">ACTIVE/INACTIVE LOG INFORMATION</span>
            <TablePaginationNew
              type="FE"
              dataSource={data_detail?.logActiveInactive}
              current={pageDetail}
              onChange={handleChangeDetail}
              pageSize={pageSizeDetail}
              columns={colLog}
              tableScrolled={{ y: 525, x: 900 }}
            />
          </div>
          <div className="flex justify-end mt-8">
            <ButtonComponent onClick={() => setOpenModal(false)} border={true}>Back</ButtonComponent>
          </div>
        </Spin>
      </ModalCustom>

      <ModalApproveOrReject
        isOpen={openModal && modalType === "inactive"}
        handleCloseModal={handleCancelModal}
        onFinish={onFinish}
        header={status === "INACTIVE" ? "activate" : "inactivate"}
        approveOrReject={status === "INACTIVE" ? "activate" : "inactivate"}
        menu="Approval Hierarchy"
        named={record?.approvalName}
        width={800}
      />

      {renderModal()}
    </>
  );
};

export default ApprovalHierarchyPage;
