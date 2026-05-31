import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Spin } from "antd";
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
} from "../../../../hooks/jobManagement/useJobExecutions";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";

const PAGE_SIZE = 30;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  const date = `${String(d.getDate()).padStart(2,"0")}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  const ss = String(d.getSeconds()).padStart(2,"0");
  return `${date} ${hh}:${mm}:${ss}`;
};

const UserJobExecutionPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  // TanStack Query data layer (replaces jobExecutionSlice thunks). The hook's
  // refetchInterval handles live polling while a run is non-terminal.
  const { data, isLoading: loading, refetch } = useExecutionsList({
    search: "",
    page,
    pageSize: PAGE_SIZE,
    sort: "",
  });
  const startMutation = useStartExecution();
  const actionLoading = startMutation.isPending;

  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try { const t = JSON.parse(rawToken || "{}"); return t?.userId || t?.id || t?.username || null; }
    catch { return null; }
  }, [rawToken]);

  const [accumulatedData, setAccumulatedData] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });
  const [selectJobModalOpen, setSelectJobModalOpen] = useState(false);

  useEffect(() => {
    if (!data?.content) return;
    if (page === 1) {
      setAccumulatedData(data.content);
    } else {
      setAccumulatedData((prev) => {
        const ids = new Set(prev.map((i) => i.executionId));
        return [...prev, ...data.content.filter((i) => !ids.has(i.executionId))];
      });
    }
  }, [data?.content, page]);

  const handleRefresh = () => {
    setPage(1);
    setAccumulatedData([]);
    refetch();
  };

  const afterAction = useCallback(() => {
    setPage(1);
    setAccumulatedData([]);
    refetch();
  }, [refetch]);

  const actionColumn = useMemo(() => ({
    title: "ACTIONS",
    key: "actions",
    width: 80,
    align: "center",
    fixed: "right",
    render: (_, record) => {
      if (!record?.executionId) return <span>—</span>;
      return (
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4,
                   display: "flex", alignItems: "center", color: "#1976D2" }}
          onClick={() => navigate(JOB_MGMT_ROUTES.VIEW_JOB_EXECUTION_DETAIL,
                                  { state: { id: record.executionId } })}
          type="button"
        >
          <ViewListIcon />
        </button>
      );
    },
  }), [navigate]);

  const baseColumns = useMemo(() => [
    { title: "NO",        key: "no",            width: 60,  align: "center", render: (_, __, i) => i + 1 },
    { title: "NAME",      dataIndex: "jobName",  key: "jobName",   align: "left" },
    { title: "CODE",      dataIndex: "jobCode",  key: "jobCode",   align: "left", width: 140 },
    { title: "PARAMETER", dataIndex: "inputPayload", key: "inputPayload", align: "left", width: 300, ellipsis: true, render: (v) => v || "—" },
    {
      title: "STATUS", dataIndex: "status", key: "status", align: "center", width: 160,
      render: (val) => {
        if (!val) return "—";
        const text = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
        const map = { succeeded:"completed", failed:"failed", cancelled:"cancelled",
                      deleted:"inactive", pending:"pending", scheduled:"scheduled",
                      processing:"processing", on_hold:"hold", suspended:"suspended",
                      stalled:"failed" };
        return (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"22px", overflow:"hidden" }}>
            <StatusComponent colour={map[val.toLowerCase()] || val.toLowerCase()} size="small">
              {text.replace("_"," ")}
            </StatusComponent>
          </div>
        );
      },
    },
    { title: "STARTED",  dataIndex: "startedAt",   key: "startedAt",   align: "left", width: 175, render: formatDate },
    { title: "FINISHED", dataIndex: "completedAt", key: "completedAt", align: "left", width: 175, render: formatDate },
    actionColumn,
  ], [actionColumn]);

  const allColumns = useMemo(() => baseColumns.map((c) => ({ ...c, key: c.key || c.dataIndex || c.title })), [baseColumns]);
  const processedColumns = useMemo(() => nxApplyFixedColumns(allColumns, fixedColumns), [allColumns, fixedColumns]);
  const columnDefinitions = useMemo(() => allColumns.map((c) => ({ key: c.key, title: c.title })), [allColumns]);

  const hasMore = accumulatedData.length < (data?.totalElements || 0);

  const routes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: "", breadcrumbName: "My Executions" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxCardContainer
        header="MY JOB EXECUTIONS"
        actionElement={
          <ButtonComponent type="primary" icon={<PlusCircleOutlined />} isPrimary
            className="px-2 py-2 rounded-lg min-h-[32px]"
            onClick={() => setSelectJobModalOpen(true)}>
            <span className="text-xs font-medium tracking-tight">Run Job</span>
          </ButtonComponent>
        }
      >
        {actionLoading && (
          <div style={{ textAlign:"center", padding: 8 }}><Spin size="small" /> Processing...</div>
        )}
        <NxTable
          idTable="user-execution-list"
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
          usePagination={false}
          useInfiniteScroll
          hasMore={hasMore}
          onLoadMore={() => { if (page < (data?.totalPages || 0)) setPage((p) => p + 1); }}
          loadMoreThreshold={20}
          showRefresh
          onRefresh={handleRefresh}
        />
      </NxCardContainer>

      <ModalRunJob
        open={selectJobModalOpen}
        loading={actionLoading}
        onClose={() => setSelectJobModalOpen(false)}
        onSubmit={(values) => {
          startMutation.mutate(values, {
            onSuccess: () => { setSelectJobModalOpen(false); afterAction(); },
          });
        }}
      />
    </>
  );
};

export default UserJobExecutionPage;
