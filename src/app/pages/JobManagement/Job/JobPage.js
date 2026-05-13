import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Dropdown, Skeleton } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { getJobManagementColumns } from "../jobManagementColumns";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { useSearchJobsQuery, useDeleteJobMutation, useGetAccessGroupsQuery, useCreateJobMutation } from "../../../../redux/slices/job_management/jobApiSlice";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import IconThreeDots from "../../../../assets/Icon/Nx/IconThreeDots";
import IconCopy from "../../../../assets/Icon/Nx/IconCopy";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";
import IconEditMenu from "../../../../assets/Icon/Nx/IconEditMenu";
import IconDeleteMenu from "../../../../assets/Icon/Nx/IconDeleteMenu";

const PAGE_SIZE = 30;

// ─── Component ────────────────────────────────────────────────────────────────

const JobPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch { return null; }
  }, [rawToken]);

  // Permission check
  const { actions, loading: permissionsLoading } = useGrantAccessHooks();
  const permissions = useMemo(
    () => (actions ?? []).map((a) => a.toLowerCase()),
    [actions]
  );
  const canCreate = permissions.includes("create");
  const canUpdate = permissions.includes("update");
  const canDelete = permissions.includes("delete");
  const canView   = permissions.includes("view");

  const [page, setPage]                   = useState(0); // 0-indexed for backend
  const [sort, setSort]                   = useState({ sortBy: "createdAt", sortDir: "DESC" });
  const [accumulatedData, setAccumulatedData] = useState([]);
  const [fixedColumns, setFixedColumns]   = useState({ left: [], right: ["actions"] });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete]         = useState(null); // { id, name, code }

  // Copy state
  const [copyingId, setCopyingId] = useState(null);

  // RTK Query hooks
  const { data, isFetching } = useSearchJobsQuery({
    page,
    size: PAGE_SIZE,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
  });

  const { data: accessGroupsRaw } = useGetAccessGroupsQuery();
  const accessGroupsMap = useMemo(() => {
    if (!accessGroupsRaw) return {};
    return Object.fromEntries(accessGroupsRaw.map((g) => [g.groupId, g.groupName]));
  }, [accessGroupsRaw]);

  const [deleteJobMutation, { isLoading: deleteLoading }] = useDeleteJobMutation();
  const [createJobMutation] = useCreateJobMutation();

  // Accumulate pages for infinite scroll
  useEffect(() => {
    if (!data?.result) return;
    if (page === 0) {
      setAccumulatedData(data.result);
    } else {
      setAccumulatedData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = data.result.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    }
  }, [data?.result, page]);

  const handleRefresh = useCallback(() => {
    setPage(0);
    setAccumulatedData([]);
  }, []);

  const handleLoadMore = () => {
    const totalPages = data?.totalPages || 0;
    if (page + 1 < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const hasMore = accumulatedData.length < (data?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    if (sorter.order) {
      setSort({
        sortBy:  sorter.field,
        sortDir: sorter.order === "ascend" ? "ASC" : "DESC",
      });
    } else {
      setSort({ sortBy: "createdAt", sortDir: "DESC" });
    }
    setPage(0);
    setAccumulatedData([]);
  };

  // Navigation helpers (state-based — ID passed via location.state, not URL param)
  const toView   = useCallback((id) => navigate(JOB_MGMT_ROUTES.VIEW_JOB_DETAIL, { state: { id } }), [navigate]);
  const toUpdate = useCallback((id) => navigate(JOB_MGMT_ROUTES.UPDATE_JOB,      { state: { id } }), [navigate]);

  // Delete handlers
  const handleDeleteConfirm = async () => {
    try {
      await deleteJobMutation(jobToDelete.id).unwrap();
      setDeleteModalOpen(false);
      setJobToDelete(null);
      handleRefresh(); // reset to page 0 — RTK Query cache invalidation re-fetches automatically
    } catch {
      // intentionally empty: deleteJob queryFn dispatches showModalError on failure
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const handleCopy = useCallback(async (record) => {
    setCopyingId(record.id);
    try {
      await createJobMutation({
        name:                 `${record.name} (Copy)`,
        code:                 `${record.code}_COPY`,
        description:          record.description,
        type:                 record.type,
        executeType:          record.executeType,
        handler:              record.handler,
        taskQueueId:          record.taskQueueId    ?? null,
        timeout:              record.timeout        ?? null,
        maxRetry:             record.maxRetry       ?? 0,
        retryPolicy:          record.retryPolicy    ?? null,
        module:               record.module         ?? null,
        defaultInput:         record.defaultInput   ?? null,
        parameters:           record.parameters     ?? [],
        accessGroupId:        record.accessGroupId  ?? null,
        notificationSettings: record.notificationSettings ?? null,
      }).unwrap();
      handleRefresh();
    } catch {
      // intentionally empty: createJob queryFn dispatches showModalError on failure
    } finally {
      setCopyingId(null);
    }
  }, [createJobMutation]);

  // Action column — always present in baseColumns so the fixed-right column
  // never appears/disappears (no layout shift). Skeleton and permission checks
  // live inside render so only cell content changes during loading.
  const actionColumn = useMemo(() => ({
    title: "ACTIONS",
    key: "actions",
    width: 120,
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

      const hasAnyAction = canCreate || canUpdate || canDelete || canView;
      if (!hasAnyAction) return null;

      const menuItems = [
        canCreate && {
          key: "copy",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: copyingId === record.id ? 0.5 : 1 }}>
              <IconCopy width="16" height="16" /> Copy
            </span>
          ),
          onClick: () => handleCopy(record),
          disabled: copyingId === record.id,
        },
        canUpdate && {
          key: "update",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconEditMenu width="16" height="16" /> Update
            </span>
          ),
          onClick: () => toUpdate(record.id),
        },
        canDelete && {
          key: "delete",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconDeleteMenu width="16" height="16" /> Delete
            </span>
          ),
          onClick: () => {
            setJobToDelete({ id: record.id, name: record.name, code: record.code });
            setDeleteModalOpen(true);
          },
        },
      ].filter(Boolean);

      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {menuItems.length > 0 && (
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
                onClick={(e) => e.stopPropagation()}
                type="button"
              >
                <IconThreeDots />
              </button>
            </Dropdown>
          )}
          {canView && (
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 4, color: "#1976D2" }}
              onClick={() => toView(record.id)}
              type="button"
            >
              <ViewListIcon />
              <span style={{ fontSize: 12 }}>View</span>
            </button>
          )}
        </div>
      );
    },
  }), [permissionsLoading, toView, toUpdate, canCreate, canUpdate, canDelete, canView, copyingId, handleCopy]);

  const baseColumns = useMemo(
    () => [...getJobManagementColumns(accessGroupsMap), actionColumn],
    [actionColumn, accessGroupsMap]
  );

  const allColumns = useMemo(
    () => baseColumns.map((col) => ({ ...col, key: col.key || col.dataIndex || col.title })),
    [baseColumns]
  );

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
    { path: "", breadcrumbName: "Job List" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxCardContainer
        header="JOB LIST"
        actionElement={
          <div className="flex gap-2">
            <ButtonComponent
              type="primary"
              icon={<DownloadOutlined />}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
            >
              <span className="text-xs font-medium tracking-tight">Download List</span>
            </ButtonComponent>
            <ButtonComponent
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(JOB_MGMT_ROUTES.CREATE_JOB)}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
            >
              <span className="text-xs font-medium tracking-tight">Create</span>
            </ButtonComponent>
          </div>
        }
      >
        <NxTable
          idTable="job-list-table"
          userId={userId}
          dataSource={accumulatedData}
          totalData={data?.totalElements}
          current={page + 1}
          loading={isFetching}
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

      {/* Delete Confirmation Modal */}
      <NxModal
        isOpen={deleteModalOpen}
        title="Delete Job"
        loading={deleteLoading}
        handleCancel={handleDeleteCancel}
        width={480}
        footer={[
          <div className="flex flex-row justify-between items-center">
            <ButtonComponent size={"small"} key="cancel" onClick={handleDeleteCancel} disabled={deleteLoading}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              size={"small"}
              key="delete"
              border={false}
              className="!bg-[#d32f2f] !text-white !border-transparent"
              onClick={handleDeleteConfirm}
              loading={deleteLoading}
            >
              Delete
            </ButtonComponent>
          </div>
        ]}
      >
        <div style={{ padding: "20px 24px" }}>
          <p style={{ margin: 0, marginBottom: 16, color: "#333" }}>
            Are you sure you want to delete this job? This action cannot be undone.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px 0", fontSize: 13 }}>
            <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Name</span>
            <span style={{ fontWeight: 500, color: "#222" }}>{jobToDelete?.name ?? "—"}</span>
            <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Code</span>
            <span style={{ fontWeight: 500, color: "#222" }}>{jobToDelete?.code ?? "—"}</span>
          </div>
        </div>
      </NxModal>
    </>
  );
};

export default JobPage;
