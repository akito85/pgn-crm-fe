import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Dropdown, Skeleton, Spin, message } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import ModalRunJob from "./ModalRunJob";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  useExecutionsList,
  useStartExecution,
  useStopExecution,
  useSuspendExecution,
  useHoldExecution,
  useCancelExecution,
  useRestartExecution,
} from "../../../../hooks/jobManagement/useJobExecutions";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";
import IconStop from "../../../../assets/Icon/Nx/IconStop";
import IconRestart from "../../../../assets/Icon/Nx/IconRestart";
import IconOnHold from "../../../../assets/Icon/Nx/IconOnHold";
import IconSuspend from "../../../../assets/Icon/Nx/IconSuspend";
import IconCancel from "../../../../assets/Icon/Nx/IconCancel";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";

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

// A stalled run is surfaced by the backend as FAILED with an EXECUTION_STALLED
// error code in the structured errorMessage envelope (not a distinct status).
const parseErrorCode = (errorMessage) => {
  if (!errorMessage || typeof errorMessage !== "string" || !errorMessage.startsWith("{")) return null;
  try { return JSON.parse(errorMessage)?.code ?? null; } catch { return null; }
};
const isStalled = (record) =>
  record?.status === "FAILED" && parseErrorCode(record?.errorMessage) === "EXECUTION_STALLED";

// ─── Page ─────────────────────────────────────────────────────────────────────

const JobExecutionPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");

  // TanStack Query data layer (replaces jobExecutionSlice thunks).
  // refetchInterval inside the hook handles live polling while runs are active.
  const { data, isLoading: loading, refetch } = useExecutionsList({
    search: "",
    page,
    pageSize: PAGE_SIZE,
    sort,
  });

  const startMutation   = useStartExecution();
  const stopMutation    = useStopExecution();
  const suspendMutation = useSuspendExecution();
  const holdMutation    = useHoldExecution();
  const cancelMutation  = useCancelExecution();
  const restartMutation = useRestartExecution();
  const actionLoading =
    startMutation.isPending || stopMutation.isPending || suspendMutation.isPending ||
    holdMutation.isPending || cancelMutation.isPending || restartMutation.isPending;

  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch { return null; }
  }, [rawToken]);

  const { loading: permissionsLoading } = useGrantAccessHooks();

  const [accumulatedData, setAccumulatedData] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });
  const [selectJobModalOpen, setSelectJobModalOpen] = useState(false);

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
    refetch();
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
    refetch();
  }, [refetch]);

  // Run a mutation hook against an execution id, reset the list on success, and
  // optionally show a confirmation toast.
  const runAction = useCallback((mutation, executionId, successMsg) => {
    mutation.mutate(executionId, {
      onSuccess: () => {
        afterAction();
        if (successMsg) message.success(successMsg);
      },
    });
  }, [afterAction]);

  // Run-level stop/kill toasts clarify that the schedule is untouched.
  const stopMsg = (record) =>
    `Stop requested for run #${record.executionId}.` +
    (record.scheduleId ? " Schedule still active — next run will fire as scheduled." : "");
  const killMsg = (record) =>
    `Run #${record.executionId} killed.` +
    (record.scheduleId ? " Schedule still active — next run will fire as scheduled." : "");

  // ─── Columns ────────────────────────────────────────────────────────────────

  const actionColumn = useMemo(() => ({
    title: "ACTIONS",
    key: "actions",
    width: 120,
    align: "center",
    fixed: "right",
    render: (_, record) => {
      if (permissionsLoading) {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", transform: "scaleY(0.55)", transformOrigin: "center" }}>
              <Skeleton.Button active size="small" shape="round" block />
            </div>
          </div>
        );
      }
      if (!record || !record.executionId) return <span>—</span>;

      const status = record.status;
      const triggerType = record.triggerType;
      const isRecurring = triggerType === "PERIODICALLY" || triggerType === "SPECIFIC_DAYS";

      const menuItems = [
        {
          key: "cancel",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0", opacity: ["PENDING","SCHEDULED","PROCESSING","ON_HOLD","SUSPENDED"].includes(status) ? 1 : 0.4 }}>
              <IconCancel width="18" height="18" /> Kill this run
            </span>
          ),
          disabled: !["PENDING","SCHEDULED","PROCESSING","ON_HOLD","SUSPENDED"].includes(status),
          onClick: () => runAction(cancelMutation, record.executionId, killMsg(record)),
        },
        {
          key: "hold",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0", opacity: status === "PENDING" ? 1 : 0.4 }}>
              <IconOnHold width="18" height="18" /> On-Hold
            </span>
          ),
          disabled: status !== "PENDING",
          onClick: () => runAction(holdMutation, record.executionId),
        },
        {
          key: "restart",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0", opacity: ["FAILED","CANCELLED","SUCCEEDED"].includes(status) ? 1 : 0.4 }}>
              <IconRestart width="18" height="18" /> Restart
            </span>
          ),
          disabled: !["FAILED","CANCELLED","SUCCEEDED"].includes(status),
          onClick: () => runAction(restartMutation, record.executionId),
        },
        {
          key: "stop",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0", opacity: status === "PROCESSING" ? 1 : 0.4 }}>
              <IconStop width="18" height="18" /> Stop this run
            </span>
          ),
          disabled: status !== "PROCESSING",
          onClick: () => runAction(stopMutation, record.executionId, stopMsg(record)),
        },
        {
          key: "suspend",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "2px 0", opacity: (status === "SCHEDULED" && isRecurring) ? 1 : 0.4 }}>
              <IconSuspend width="18" height="18" /> Suspend
            </span>
          ),
          disabled: !(status === "SCHEDULED" && isRecurring),
          onClick: () => runAction(suspendMutation, record.executionId),
        },
      ];

      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
              onClick={(e) => e.stopPropagation()}
              type="button"
            >
              <IconThreeDots />
            </button>
          </Dropdown>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "#1976D2" }}
            onClick={() => navigate(JOB_MGMT_ROUTES.VIEW_JOB_EXECUTION_DETAIL, { state: { id: record.executionId } })}
            type="button"
          >
            <ViewListIcon />
          </button>
        </div>
      );
    },
  }), [permissionsLoading, runAction, cancelMutation, holdMutation, restartMutation, stopMutation, suspendMutation, navigate]);

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
      render: (val, record) => {
        if (!val) return "—";
        // A FAILED run carrying the EXECUTION_STALLED code shows as "Stalled".
        const stalled = isStalled(record);
        const label = stalled ? "Stalled" : (val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
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
        const colour = stalled ? "stalled" : (colourMap[val.toLowerCase()] || val.toLowerCase());
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "22px", overflow: "hidden" }}>
            <StatusComponent colour={colour} size="small">{label.replace("_", " ")}</StatusComponent>
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
          emptyText={
            !loading && accumulatedData.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔒</div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                  No executions available
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280" }}>
                  Your account has not been assigned to any job group yet.<br />
                  Please contact your administrator to request access.
                </div>
              </div>
            ) : undefined
          }
        />
      </NxCardContainer>

      <ModalRunJob
        open={selectJobModalOpen}
        loading={actionLoading}
        onClose={() => setSelectJobModalOpen(false)}
        onSubmit={(values) => {
          startMutation.mutate(values, {
            onSuccess: () => {
              setSelectJobModalOpen(false);
              afterAction();
            },
          });
        }}
      />
    </>
  );
};

export default JobExecutionPage;
