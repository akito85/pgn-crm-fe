import { Alert, DatePicker, Form } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import Toolbar from "../../../../components/Toolbar";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import {
  activationPositionHierarchy,
  downloadPositionHierarchy,
  duplicatePositionHierarchy,
  getPositionHierarchyPaginate,
} from "../../../../redux/slices/user_management/position_hirarchy";
import InputComponent from "../../../../components/InputComponent";
import { dateFormatting } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { TablePositionHierarchy, columnsPositionHierarchy } from "./TablePositionHierarchy";
import {
  buildPositionHierarchyToolbarActions,
  buildPositionHierarchyTableActions,
} from "./positionHierarchyActions";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const OPERATOR_SELECTOR_MAP = {
  Contains: "LIKE",
  "Equal to": "EQUALS",
  "Not equal to": "NOT_EQUALS",
  "Greater than": "GREATER_THAN",
  "Less than": "LESS_THAN",
  "Is empty": "IS_NULL",
  "Is not empty": "IS_NOT_NULL",
};

const PositionHierarchyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // Pagination & filter state
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: [] });

  // Column-level filter state
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [columnSearchText, setColumnSearchText] = useState("");

  // Download button loading
  const [downloading, setDownloading] = useState(false);

  // Activate/Duplicate modal submit loading
  const [submitting, setSubmitting] = useState(false);

  // Local infinite-scroll data state
  const [allData, setAllData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [recordSelected, setRecordSelected] = useState({});
  const [body, setBody] = useState({});
  const [form] = Form.useForm();

  // Refs for safe access inside async callbacks
  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  const buildSearch = useCallback((basicSearch, advSearch) => {
    let combined = {};
    // Per-column filters. status needs EQUALS (LIKE would match INACTIVE for "ACTIVE");
    // startDate/endDate are auto-routed to BETWEEN by the backend selector resolver.
    Object.entries(basicSearch || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      combined[key] = key === "status" ? `${value}~EQUALS` : value;
    });
    const applyFilter = (f) => {
      if (!f.column) return;
      const selector = OPERATOR_SELECTOR_MAP[f.operator] || "LIKE";
      const isNullOp = selector === "IS_NULL" || selector === "IS_NOT_NULL";
      if (isNullOp) {
        combined[f.column] = `~${selector}`;
      } else if (f.value) {
        combined[f.column] = `${f.value}~${selector}`;
      }
    };
    if (advSearch?.filters) advSearch.filters.forEach(applyFilter);
    if (advSearch?.filterRules) {
      advSearch.filterRules.forEach((rule) => rule.filters.forEach(applyFilter));
    }
    return encodeURIComponent(JSON.stringify(combined));
  }, []);

  const fetchPage = useCallback(
    async (page, replace = false, signal = null) => {
      if (isFetchingRef.current) return;
      if (signal?.aborted) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const reqSearch = buildSearch(search, advancedSearch);
        const result = await dispatch(
          getPositionHierarchyPaginate({ page: page + 1, pageSize, sort, search: reqSearch })
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
        if (!signal?.aborted) console.error("fetchPage error", e);
      } finally {
        isFetchingRef.current = false;
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [search, advancedSearch, sort, pageSize, dispatch, buildSearch]
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
  }, [search, advancedSearch, sort, pageSize]); // intentionally excludes fetchPage

  const reload = useCallback(() => {
    const signal = { aborted: false };
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    setIsLoading(true);
    fetchPage(0, true, signal);
  }, [fetchPage]);

  const handleChange = (_, pageSizeChange) => {
    setPageSize(pageSizeChange);
  };

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;
    return fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onAdvanceSearch = (searchData) => {
    setAdvancedSearch(searchData);
  };

  const handleColumnSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setColumnSearchText(selectedKeys[0] || "");
    setSearchedColumn(dataIndex);
    setSearch((prev) => {
      const next = { ...prev };
      if (selectedKeys[0]) {
        next[dataIndex] = selectedKeys[0];
      } else {
        delete next[dataIndex];
      }
      return next;
    });
  }, []);

  // Modal handlers
  const handleCancel = () => {
    setOpenModal(false);
    setModalType("");
    setRecordSelected({});
    form.resetFields();
  };

  const handleOpenModal = (record, type) => {
    setModalType(type);
    setRecordSelected(record);
    if (type === "activation") {
      form.setFieldsValue({
        startDate:
          record?.startDate === null
            ? moment()
            : moment(record?.startDate).clone(dateFormatting?.dateTime),
        endDate:
          record?.endDate === null ? null : moment(record?.endDate).clone(dateFormatting?.dateTime),
      });
    } else {
      form.setFieldsValue({ name: record.name + " Copy" });
    }
    setOpenModal(true);
  };

  const handleActivation = async (formValue) => {
    const payload = { ...formValue, hierId: recordSelected?.hierId, saveAs: "ACTIVE" };
    setBody(payload);
    setSubmitting(true);
    try {
      await dispatch(activationPositionHierarchy(payload)).unwrap();
    } catch {
      // error surfaced via validateError in the thunk
    } finally {
      setSubmitting(false);
      handleCancel();
      reload();
    }
  };

  const handleDuplicate = async (formValue) => {
    const payload = { ...formValue, hierId: recordSelected?.hierId };
    setBody(payload);
    setSubmitting(true);
    try {
      await dispatch(duplicatePositionHierarchy(payload)).unwrap();
    } catch {
      // error surfaced via validateError in the thunk
    } finally {
      setSubmitting(false);
      handleCancel();
      reload();
    }
  };

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      await dispatch(
        downloadPositionHierarchy({
          search: buildSearch(search, advancedSearch),
          page: pageRef.current + 1,
          pageSize,
          sort,
        })
      ).unwrap();
    } catch {
      // error surfaced via validateError in the thunk
    } finally {
      setDownloading(false);
    }
  }, [dispatch, search, advancedSearch, pageSize, sort, buildSearch]);

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "ACTIVATION_POSITION_HIERARCHY") {
      dispatch(activationPositionHierarchy(body));
    } else if (bodyError?.action === "DUPLICATE_POSITION_HIERARCHY") {
      dispatch(duplicatePositionHierarchy(body));
    } else if (bodyError?.action === "DOWNLOAD_POSITION_HIERARCHY") {
      handleDownload();
    }
    reload();
  };

  const { handleCancelTryAgain, renderModal } = useTryAgainHooks(handleRetry);

  const routes = [
    { path: "", breadcrumbName: "User Management" },
    { path: USER_ROUTES.VIEW_POSITION, breadcrumbName: "Position Hierarchy List" },
  ];

  const toolbarActions = useMemo(
    () => buildPositionHierarchyToolbarActions({ handleDownload, downloading }),
    [handleDownload, downloading]
  );

  const tableActions = useMemo(
    () =>
      buildPositionHierarchyTableActions({
        handleView: (record) =>
          navigate(USER_ROUTES.DETAIL_POSITION, { state: { id: record?.hierId } }),
        handleUpdate: (record) =>
          navigate(USER_ROUTES.UPDATE_POSITION, { state: { id: record?.hierId } }),
        handleActivate: (record) => handleOpenModal(record, "activation"),
        handleDuplicate: (record) => handleOpenModal(record, "duplicate"),
      }),
    [navigate] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const renderContentModal = (type) => {
    if (type === "activation") {
      return (
        <>
          <div className="w-full modalTerminate">
            <Alert
              icon={
                <ExclamationCircleOutlined style={{ fontSize: "24px", color: "#65481C" }} />
              }
              message="Are you sure you want to activate Position Hierarchy?"
              description="Warning! If you activate this hierarchy, the current active hierarchy will be inactivated."
              type="warning"
              showIcon
            />
          </div>
          <Form form={form} layout="vertical" onFinish={handleActivation}>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker className="w-full" format={dateFormatting?.dateTime} disabled />
            </Form.Item>
            <Form.Item name="endDate" label="End Date">
              <DatePicker
                className="w-full"
                format={dateFormatting?.dateTime}
                disabledDate={(current) =>
                  current && current < moment(form.getFieldValue("startDate"))
                }
              />
            </Form.Item>
            <div className="w-full flex justify-end gap-2">
              <Form.Item>
                <ButtonComponent type="default" onClick={handleCancel} border={true}>
                  Cancel
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent type="submit" htmlType="submit" border={false} loading={submitting}>
                  Confirm
                </ButtonComponent>
              </Form.Item>
            </div>
          </Form>
        </>
      );
    }
    return (
      <Form form={form} layout="vertical" className="mt-3" onFinish={handleDuplicate}>
        <Form.Item name="name" label="Hierarchy Name">
          <InputComponent placeholder="Type hierarchy name" />
        </Form.Item>
        <div className="w-full flex justify-end gap-3">
          <Form.Item>
            <ButtonComponent type="default" onClick={handleCancel} border={true}>
              Back
            </ButtonComponent>
          </Form.Item>
          <Form.Item>
            <ButtonComponent type="submit" htmlType="submit" border={false} loading={submitting}>
              Save
            </ButtonComponent>
          </Form.Item>
        </div>
      </Form>
    );
  };

  return (
    <>
      <BreadCrumb routes={routes} />

      <NxCardContainer header="POSITION HIERARCHY LIST" className="mt-4">
        <div className="flex flex-col gap-y-4">
          <Toolbar items={toolbarActions} type="page" />
          <TablePositionHierarchy
            dataSource={allData}
            loading={isLoading}
            totalData={totalElements}
            current={pageRef.current + 1}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
            onAdvanceSearch={onAdvanceSearch}
            onRefresh={reload}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            useInfiniteScroll={true}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            itemActions={tableActions}
            columnDefinitions={columnsPositionHierarchy}
            userId={userId}
            search={search}
            searchInput={searchInput}
            searchedColumn={searchedColumn}
            columnSearchText={columnSearchText}
            handleColumnSearch={handleColumnSearch}
          />
        </div>
      </NxCardContainer>

      <ModalCustom
        header={modalType === "activation" ? "Activation Confirmation" : "Duplicate Position Hierarchy"}
        isOpen={openModal}
        handleCancel={handleCancel}
        type="confirmation"
        width={750}
      >
        {renderContentModal(modalType)}
      </ModalCustom>

      {renderModal()}
    </>
  );
};

export default PositionHierarchyPage;
