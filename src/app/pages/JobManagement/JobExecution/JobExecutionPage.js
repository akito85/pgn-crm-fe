import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Dropdown, Skeleton, Spin } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import ModalRunJob from "./ModalRunJob";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  getAllJobExecutionPaginate,
  startExecution,
  stopExecution,
  suspendExecution,
  holdExecution,
  cancelExecution,
  restartExecution,
} from "../../../../redux/slices/job_management/jobExecutionSlice";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";
import IconStop from "../../../../assets/Icon/Nx/IconStop";
import IconRestart from "../../../../assets/Icon/Nx/IconRestart";
import IconOnHold from "../../../../assets/Icon/Nx/IconOnHold";
import IconSuspend from "../../../../assets/Icon/Nx/IconSuspend";
import IconCancel from "../../../../assets/Icon/Nx/IconCancel";

const PAGE_SIZE = 30;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const date = `${String(d.getDate()).padStart(2, "0")}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const cs = String(Math.floor(d.getMilliseconds() / 10)).padStart(2, "0");
  return `${date} ${hh}:${mm}:${ss}.${cs}`;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const JobExecutionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, actionLoading } = useSelector((state) => state.jobExecution);

  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch { return null; }
  }, [rawToken]);

  const { loading: permissionsLoading } = useGrantAccessHooks();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [accumulatedData, setAccumulatedData] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });
  const [selectJobModalOpen, setSelectJobModalOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleFetch = useCallback(() => {
    dispatch(getAllJobExecutionPaginate({ search: "", page, pageSize: PAGE_SIZE, sort }));
  }, [dispatch, page, sort, refreshToken]);

  useEffect(() => { handleFetch(); }, [handleFetch]);

  useEffect(() => {
    if (!data?.content) return;
    if (page === 1) {
      setAccumulatedData(data.content);
    } else {
      setAccumulatedData((prev) => {
        const existingIds = new Set(prev.map((item) => item.executionId));
        const newItems = data.content.filter((item) => !existingIds.has(item.executionId));
        return [...prev, ...newItems];
      });
    }
  }, [data?.content, page]);

  const handleRefresh = () => {
    setPage(1);
    setAccumulatedData([]);
    setRefreshToken((n) => n + 1);
  };

  const handleLoadMore = () => {
    const totalPages = data?.totalPages || 0;
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const hasMore = accumulatedData.length < (data?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    setSort(sorter.order ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}` : "");
    setPage(1);
    setAccumulatedData([]);
  };

  const afterAction = useCallback(() => {
    setPage(1);
    setAccumulatedData([]);
    setRefreshToken((n) => n + 1);
  }, []);

  const handleAction = useCallback((thunk, arg) => {
    dispatch(thunk(arg)).then((res) => {
      if (!res.error) afterAction();
    });
  }, [dispatch, afterAction]);

  // ─── Columns ────────────────────────────────────────────────────────────────

  const actionColumn = useMemo(() => ({
    title: "ACTIONS",
    key: "actions",
    width: 100,
    align: "center",
    fixed: "right",
    render: (_, record) => {
      if (permissionsLoading) {
        return (
          <div style={{ width: "100%", height: 14, overflow: "hidden", borderRadius: 20 }}>
            <Skeleton.Button active size="small" shape="round" block />
          </div>
        );
      }
      if (!record || !record.executionId) return <span>—</span>;

      const status = record.status;
      const triggerType = record.triggerType;
      const isRecurring = triggerType === "PERIODICALLY" || triggerType === "SPECIFIC_DAYS";

      const menuItems = [
        {
          key: "view",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <EyeOutlined /> View Details
            </span>
          ),
          onClick: () => navigate(JOB_MGMT_ROUTES.VIEW_JOB_EXECUTION_DETAIL, { state: { id: record.executionId } }),
        },
        {
          key: "stop",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: status === "PROCESSING" ? 1 : 0.4 }}>
              <IconStop width="16" height="16" /> Stop
            </span>
          ),
          disabled: status !== "PROCESSING",
          onClick: () => handleAction(stopExecution, record.executionId),
        },
        {
          key: "suspend",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: (status === "SCHEDULED" && isRecurring) ? 1 : 0.4 }}>
              <IconSuspend width="16" height="16" /> Suspend
            </span>
          ),
          disabled: !(status === "SCHEDULED" && isRecurring),
          onClick: () => handleAction(suspendExecution, record.executionId),
        },
        {
          key: "hold",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: status === "PENDING" ? 1 : 0.4 }}>
              <IconOnHold width="16" height="16" /> On-Hold
            </span>
          ),
          disabled: status !== "PENDING",
          onClick: () => handleAction(holdExecution, record.executionId),
        },
        {
          key: "cancel",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: ["PENDING","SCHEDULED","PROCESSING","ON_HOLD","SUSPENDED"].includes(status) ? 1 : 0.4 }}>
              <IconCancel width="16" height="16" /> Cancel
            </span>
          ),
          disabled: !["PENDING","SCHEDULED","PROCESSING","ON_HOLD","SUSPENDED"].includes(status),
          onClick: () => handleAction(cancelExecution, record.executionId),
        },
        {
          key: "restart",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: ["FAILED","CANCELLED","SUCCEEDED"].includes(status) ? 1 : 0.4 }}>
              <IconRestart width="16" height="16" /> Restart
            </span>
          ),
          disabled: !["FAILED","CANCELLED","SUCCEEDED"].includes(status),
          onClick: () => handleAction(restartExecution, record.executionId),
        },
      ];

      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
              onClick={(e) => e.stopPropagation()}
              type="button"
            >
              <IconThreeDots />
            </button>
          </Dropdown>
        </div>
      );
    },
  }), [permissionsLoading, handleAction, navigate]);

  const baseColumns = useMemo(() => [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "NAME",
      dataIndex: "jobName",
      key: "jobName",
      align: "left",
    },
    {
      title: "CODE",
      dataIndex: "jobCode",
      key: "jobCode",
      align: "left",
      width: 140,
    },
    {
      title: "PARAMETER",
      dataIndex: "inputPayload",
      key: "inputPayload",
      align: "left",
      width: 300,
      ellipsis: true,
      render: (val) => val || "—",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 160,
      render: (val) => {
        if (!val) return "—";
        const text = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
        const colourMap = {
          succeeded: "completed",
          failed: "failed",
          cancelled: "cancelled",
          deleted: "inactive",
          pending: "pending",
          scheduled: "scheduled",
          processing: "processing",
          on_hold: "hold",
          suspended: "suspended",
        };
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "22px", overflow: "hidden" }}>
            <StatusComponent colour={colourMap[val.toLowerCase()] || val.toLowerCase()} size="small">{text.replace("_", " ")}</StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STARTED",
      dataIndex: "startedAt",
      key: "startedAt",
      align: "left",
      width: 175,
      render: (val) => formatDate(val),
    },
    {
      title: "FINISHED",
      dataIndex: "completedAt",
      key: "completedAt",
      align: "left",
      width: 175,
      render: (val) => formatDate(val),
    },
    actionColumn,
  ], [actionColumn]);

  const allColumns = useMemo(() =>
    baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    })), [baseColumns]);

  const processedColumns = useMemo(
    () => nxApplyFixedColumns(allColumns, fixedColumns),
    [allColumns, fixedColumns]
  );

  const columnDefinitions = useMemo(
    () => allColumns.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [allColumns]
  );

  const routes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: "", breadcrumbName: "Job Execution List" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxCardContainer
        header="JOB EXECUTION LIST"
        actionElement={
          <div className="flex gap-2">
            <ButtonComponent
              type="primary"
              icon={<PlusCircleOutlined />}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
              onClick={() => {
                setSelectJobModalOpen(true);
              }}
            >
              <span className="text-xs font-medium tracking-tight">Run Job</span>
            </ButtonComponent>
          </div>
        }
      >
        {actionLoading && (
          <div style={{ textAlign: "center", padding: 8 }}>
            <Spin size="small" /> Processing...
          </div>
        )}
        <NxTable
          idTable="job-execution-list-table"
          userId={userId}
          dataSource={accumulatedData}
          totalData={data?.totalElements}
          current={page}
          loading={loading}
          columns={processedColumns}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          tableScrolled={{ y: 500, x: "max-content" }}
          onSort={onSort}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          showRefresh={true}
          onRefresh={handleRefresh}
          showExport={true}
          handleDownload={() => {}}
        />
      </NxCardContainer>

      <ModalRunJob
        open={selectJobModalOpen}
        loading={actionLoading}
        onClose={() => setSelectJobModalOpen(false)}
        onSubmit={(values) => {
          dispatch(startExecution(values)).then((res) => {
            if (!res.error) {
              setSelectJobModalOpen(false);
              afterAction();
            }
          });
        }}
      />
    </>
  );
};

export default JobExecutionPage;
