import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Dropdown, Form, Radio, Input, InputNumber, Select, Tag, Spin } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useSearchJobsQuery } from "../../../../redux/slices/job_management/jobApiSlice";
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
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";
import IconStop from "../../../../assets/Icon/Nx/IconStop";
import IconRestart from "../../../../assets/Icon/Nx/IconRestart";
import IconOnHold from "../../../../assets/Icon/Nx/IconOnHold";
import IconSuspend from "../../../../assets/Icon/Nx/IconSuspend";
import IconCancel from "../../../../assets/Icon/Nx/IconCancel";

const PAGE_SIZE = 20;

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

const STATUS_COLORS = {
  PENDING:    "blue",
  SCHEDULED:  "geekblue",
  PROCESSING: "orange",
  SUCCEEDED:  "green",
  FAILED:     "red",
  CANCELLED:  "default",
  DELETED:    "default",
  ON_HOLD:    "purple",
  SUSPENDED:  "gold",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIGGER_TYPES = ["IMMEDIATE", "ONCE", "PERIODICALLY", "SPECIFIC_DAYS"];

const TIMEZONES = [
  "UTC", "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura",
  "America/New_York", "Europe/London", "Asia/Tokyo",
];

// ─── Select Job Modal ─────────────────────────────────────────────────────────

const MODAL_PAGE_SIZE = 20;

const JOB_SELECT_COLUMNS = [
  { title: "NO", width: 60, align: "center", render: (_, __, index) => index + 1 },
  { title: "NAME", dataIndex: "name", key: "name", align: "left" },
  { title: "CODE", dataIndex: "code", key: "code", align: "left", width: 140 },
  { title: "TYPE", dataIndex: "type", key: "type", align: "left", width: 120 },
  { title: "DESC", dataIndex: "desc", key: "desc", align: "left", ellipsis: true },
];

const ModalSelectJob = ({ open, loading, onClose, onSubmit }) => {
  const [step, setStep] = useState("select");
  const [selectedJob, setSelectedJob] = useState(null);
  const [triggerType, setTriggerType] = useState("IMMEDIATE");
  const [modalPage, setModalPage] = useState(0);
  const [allJobs, setAllJobs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const isResetRef = React.useRef(false);
  const [form] = Form.useForm();

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep("select");
      setSelectedJob(null);
      setTriggerType("IMMEDIATE");
      setModalPage(0);
      setAllJobs([]);
      setHasMore(true);
      isResetRef.current = false;
      form.resetFields();
    }
  }, [open, form]);

  // Fetch jobs for modal
  const { data: allJobsData, isLoading: allJobsLoading } = useSearchJobsQuery({
    page: modalPage,
    size: MODAL_PAGE_SIZE,
  }, { skip: !open });

  // Accumulate pages; replace when modal opens
  useEffect(() => {
    if (!allJobsData) return;
    if (isResetRef.current) {
      isResetRef.current = false;
      setAllJobs(allJobsData.result);
    } else {
      setAllJobs(prev => [...prev, ...allJobsData.result]);
    }
    setHasMore(allJobsData.currentPage < allJobsData.totalPages - 1);
  }, [allJobsData]);

  // Returns a Promise for NxTable's IntersectionObserver
  const loadMoreData = useCallback(() => {
    return new Promise((resolve) => {
      if (!hasMore || allJobsLoading) { resolve(); return; }
      setModalPage(prev => prev + 1);
      setTimeout(resolve, 0);
    });
  }, [hasMore, allJobsLoading]);

  // Function to open the modal (called from parent)
  const handleOpenModal = useCallback(() => {
    isResetRef.current = true;
    setModalPage(0);
    setHasMore(true);
  }, []);

  // Function to add selected job to the form
  const handleAddJobToTable = useCallback((job) => {
    setSelectedJob({ id: job.id, name: job.name, code: job.code });
    setStep("schedule");
  }, []);

  // Function to close the modal
  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const actionColumn = {
    title: "",
    key: "select-action",
    width: 60,
    align: "center",
    render: (_, record) => (
      <button
        type="button"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "#1976D2" }}
        onClick={() => {
          setSelectedJob({ id: record.id, name: record.name, code: record.code });
          setStep("schedule");
        }}
      >
        <PlusCircleOutlined style={{ fontSize: 20 }} />
      </button>
    ),
  };

  const jobColumns = [...JOB_SELECT_COLUMNS, actionColumn];
  const jobColumnDefs = JOB_SELECT_COLUMNS.map((c) => ({ key: c.key, title: c.title }));

  const handleBack = () => {
    setStep("select");
    setSelectedJob(null);
    form.resetFields();
    setTriggerType("IMMEDIATE");
  };

  const handleStart = () => {
    form.validateFields().then((values) => {
      onSubmit({ jobId: selectedJob.id, triggerType, ...values });
    });
  };

  const renderStep2 = () => (
    <div style={{ padding: "16px 24px" }}>
      <div style={{
        background: "#f5f5f5", border: "1px solid #e0e0e0",
        borderRadius: 8, padding: "12px 16px", marginBottom: 20,
        display: "grid", gridTemplateColumns: "80px 1fr", gap: "4px 0", fontSize: 13,
      }}>
        <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Name</span>
        <span style={{ fontWeight: 600, color: "#222" }}>{selectedJob?.name ?? "—"}</span>
        <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Code</span>
        <span style={{ fontWeight: 500, color: "#555" }}>{selectedJob?.code ?? "—"}</span>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item label="Trigger Type" required>
          <Radio.Group
            value={triggerType}
            disabled={loading}
            onChange={(e) => {
              setTriggerType(e.target.value);
              form.resetFields(["scheduledAt", "intervalSeconds", "cronExpression", "timezone"]);
            }}
          >
            {TRIGGER_TYPES.map((t) => (
              <Radio key={t} value={t} style={{ marginBottom: 4 }}>{t}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {triggerType === "ONCE" && (
          <>
            <Form.Item name="scheduledAt" label="Scheduled At" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="2026-03-24T10:00:00" disabled={loading} />
            </Form.Item>
            <Form.Item name="timezone" label="Timezone" initialValue="UTC">
              <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} />
            </Form.Item>
          </>
        )}

        {triggerType === "PERIODICALLY" && (
          <>
            <Form.Item name="intervalSeconds" label="Interval (seconds)" rules={[{ required: true, message: "Required" }]}>
              <InputNumber min={1} placeholder="3600" style={{ width: "100%" }} disabled={loading} />
            </Form.Item>
            <Form.Item name="timezone" label="Timezone" initialValue="UTC">
              <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} />
            </Form.Item>
          </>
        )}

        {triggerType === "SPECIFIC_DAYS" && (
          <>
            <Form.Item name="cronExpression" label="Cron Expression" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="0 0 * * MON-FRI" disabled={loading} />
            </Form.Item>
            <Form.Item name="timezone" label="Timezone" initialValue="UTC">
              <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} disabled={loading} />
            </Form.Item>
          </>
        )}

        <Form.Item name="inputPayload" label="Input Payload (optional JSON)">
          <Input.TextArea rows={3} placeholder='{"key": "value"}' disabled={loading} />
        </Form.Item>
      </Form>
    </div>
  );

  const modalTitle = step === "select" ? "Select Job" : "Schedule Job";
  const modalWidth = step === "select" ? 1100 : 520;

  const footer = [
    <ButtonComponent key="cancel" onClick={onClose} disabled={loading}>
      Cancel
    </ButtonComponent>,
    ...(step === "select"
      ? []
      : [
          <ButtonComponent key="back" onClick={handleBack} disabled={loading}>
            Back
          </ButtonComponent>,
          <ButtonComponent key="start" type="primary" isPrimary onClick={handleStart} loading={loading}>
            Start
          </ButtonComponent>,
        ]),
  ];

  return (
    <NxModal
      isOpen={open}
      title={modalTitle}
      width={modalWidth}
      loading={loading}
      closeable
      handleCancel={onClose}
      footer={footer}
    >
      <div className="p-4">
        {step === "select" && (
          <div>
            <NxTable
              idTable="modal-job-select-table"
              dataSource={allJobs}
              loading={allJobsLoading}
              columns={jobColumns}
              useInfiniteScroll={true}
              useSearch={true}
              useAdvanceSearch={true}
              useColumnSettings={true}
              tableScrolled={{ y: 400, x: "max-content" }}
              rowKey="id"
              onLoadMore={loadMoreData}
              hasMore={hasMore}
            />
          </div>
        )}
        {step === "schedule" && renderStep2()}
      </div>
    </NxModal>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const JobExecutionPage = () => {
  const dispatch = useDispatch();
  const { data, loading, actionLoading } = useSelector((state) => state.jobExecution);

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
      if (!record || !record.executionId) return <span>—</span>;

      const status = record.status;
      const triggerType = record.triggerType;
      const isRecurring = triggerType === "PERIODICALLY" || triggerType === "SPECIFIC_DAYS";

      const menuItems = [
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
              <IconSuspend width="14" height="14" /> Suspend
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
              <IconCancel width="12" height="12" /> Cancel
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
  }), [handleAction]);

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
      width: 120,
      render: (val) => val
        ? <Tag color={STATUS_COLORS[val] || "default"}>{val}</Tag>
        : "—",
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
                // Reset modal state before opening
                setSelectJobModalOpen(false);
                setTimeout(() => setSelectJobModalOpen(true), 0);
              }}
            >
              <span className="text-xs font-medium tracking-tight">Select Job</span>
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
          // onRefresh={handleRefresh}
          // showRefresh={true}
          showExport={true}
          handleDownload={() => {}}
        />
      </NxCardContainer>

      <ModalSelectJob
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
