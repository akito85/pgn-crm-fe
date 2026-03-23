import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DownloadOutlined } from "@ant-design/icons";
import { Dropdown, Form, Radio, Input, InputNumber, Select, Tag, Spin } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
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
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";
import IconStart from "../../../../assets/Icon/Nx/IconStart";
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

// ─── Start Job Modal ──────────────────────────────────────────────────────────

const TRIGGER_TYPES = ["IMMEDIATE", "ONCE", "PERIODICALLY", "SPECIFIC_DAYS"];

const TIMEZONES = [
  "UTC", "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura",
  "America/New_York", "Europe/London", "Asia/Tokyo",
];

const ModalStartJob = ({ open, jobId, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [triggerType, setTriggerType] = useState("IMMEDIATE");

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ jobId, ...values, triggerType });
    });
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setTriggerType("IMMEDIATE");
    }
  }, [open, form]);

  const handleCancel = () => {
    form.resetFields();
    setTriggerType("IMMEDIATE");
    onClose();
  };

  return (
    <NxModal
      isOpen={open}
      title="Start Job Execution"
      width={520}
      loading={loading}
      closeable
      handleCancel={handleCancel}
      handleOk={handleOk}
      footer={[
        <ButtonComponent key="cancel" onClick={handleCancel} disabled={loading}>
          Cancel
        </ButtonComponent>,
        <ButtonComponent key="submit" type="primary" isPrimary onClick={handleOk} loading={loading}>
          Start
        </ButtonComponent>,
      ]}
    >
      <div style={{ padding: "16px 24px" }}>
        <Form form={form} layout="vertical">
          <Form.Item label="Trigger Type" required>
            <Radio.Group
              value={triggerType}
              onChange={(e) => { setTriggerType(e.target.value); form.resetFields(["scheduledAt","intervalSeconds","cronExpression","timezone"]); }}
            >
              {TRIGGER_TYPES.map((t) => (
                <Radio key={t} value={t} style={{ marginBottom: 4 }}>{t}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          {triggerType === "ONCE" && (
            <>
              <Form.Item name="scheduledAt" label="Scheduled At" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="2026-03-24T10:00:00" />
              </Form.Item>
              <Form.Item name="timezone" label="Timezone" initialValue="UTC">
                <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} />
              </Form.Item>
            </>
          )}

          {triggerType === "PERIODICALLY" && (
            <>
              <Form.Item name="intervalSeconds" label="Interval (seconds)" rules={[{ required: true, message: "Required" }]}>
                <InputNumber min={1} placeholder="3600" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="timezone" label="Timezone" initialValue="UTC">
                <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} />
              </Form.Item>
            </>
          )}

          {triggerType === "SPECIFIC_DAYS" && (
            <>
              <Form.Item name="cronExpression" label="Cron Expression" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="0 0 * * MON-FRI" />
              </Form.Item>
              <Form.Item name="timezone" label="Timezone" initialValue="UTC">
                <Select options={TIMEZONES.map((z) => ({ value: z, label: z }))} />
              </Form.Item>
            </>
          )}

          <Form.Item name="inputPayload" label="Input Payload (optional JSON)">
            <Input.TextArea rows={3} placeholder='{"key": "value"}' />
          </Form.Item>
        </Form>
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
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
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
          key: "start",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconStart width="16" height="16" /> Start
            </span>
          ),
          onClick: () => { setSelectedJobId(record.jobId); setStartModalOpen(true); },
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
              icon={<DownloadOutlined />}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
              onClick={() => {}}
            >
              <span className="text-xs font-medium tracking-tight">Download List</span>
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
          onRefresh={handleRefresh}
          showRefresh={true}
        />
      </NxCardContainer>

      <ModalStartJob
        open={startModalOpen}
        jobId={selectedJobId}
        loading={actionLoading}
        onClose={() => { setStartModalOpen(false); setSelectedJobId(null); }}
        onSubmit={(values) => {
          dispatch(startExecution(values)).then((res) => {
            if (!res.error) {
              setStartModalOpen(false);
              setSelectedJobId(null);
              afterAction();
            }
          });
        }}
      />
    </>
  );
};

export default JobExecutionPage;
