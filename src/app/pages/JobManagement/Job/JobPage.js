import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { getJobManagementColumns } from "../jobManagementColumns";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { useSearchJobsQuery, useDeleteJobMutation, useGetAccessGroupsQuery } from "../../../../redux/slices/job_management/jobApiSlice";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";

const PAGE_SIZE = 30;

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const ThreeDotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.75 4.16663C8.75 3.83511 8.8817 3.51716 9.11612 3.28274C9.35054 3.04832 9.66848 2.91663 10 2.91663H10.0083C10.3399 2.91663 10.6578 3.04832 10.8922 3.28274C11.1266 3.51716 11.2583 3.83511 11.2583 4.16663V4.17496C11.2583 4.50648 11.1266 4.82442 10.8922 5.05884C10.6578 5.29326 10.3399 5.42496 10.0083 5.42496H10C9.66848 5.42496 9.35054 5.29326 9.11612 5.05884C8.8817 4.82442 8.75 4.50648 8.75 4.17496V4.16663ZM8.75 9.99996C8.75 9.66844 8.8817 9.3505 9.11612 9.11608C9.35054 8.88166 9.66848 8.74996 10 8.74996H10.0083C10.3399 8.74996 10.6578 8.88166 10.8922 9.11608C11.1266 9.3505 11.2583 9.66844 11.2583 9.99996V10.0083C11.2583 10.3398 11.1266 10.6578 10.8922 10.8922C10.6578 11.1266 10.3399 11.2583 10.0083 11.2583H10C9.66848 11.2583 9.35054 11.1266 9.11612 10.8922C8.8817 10.6578 8.75 10.3398 8.75 10.0083V9.99996ZM10 14.5833C9.66848 14.5833 9.35054 14.715 9.11612 14.9494C8.8817 15.1838 8.75 15.5018 8.75 15.8333V15.8416C8.75 16.1731 8.8817 16.4911 9.11612 16.7255C9.35054 16.9599 9.66848 17.0916 10 17.0916H10.0083C10.3399 17.0916 10.6578 16.9599 10.8922 16.7255C11.1266 16.4911 11.2583 16.1731 11.2583 15.8416V15.8333C11.2583 15.5018 11.1266 15.1838 10.8922 14.9494C10.6578 14.715 10.3399 14.5833 10.0083 14.5833H10Z" fill="#1976D2"/>
  </svg>
);

const ViewListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.625 5.625H18.125M5.625 10H18.125M5.625 14.375H18.125" stroke="#1976D2" strokeWidth="1.875" strokeLinejoin="round"/>
    <path d="M2.5 5H3.75V6.25H2.5V5ZM2.5 9.375H3.75V10.625H2.5V9.375ZM2.5 13.75H3.75V15H2.5V13.75Z" stroke="#1976D2" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="round"/>
  </svg>
);

const EditMenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H15C16.1046 20 17 19.1046 17 18V15" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15H12L20.5 6.49998C21.3284 5.67156 21.3284 4.32841 20.5 3.49998C19.6716 2.67156 18.3284 2.67156 17.5 3.49998L9 12V15" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 5L19 8" stroke="black" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteMenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 11V17M14 11V17M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M3 6H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="#D32F2F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const JobPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Permission check
  const { actions } = useGrantAccessHooks();
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
      // error shown via showModalError in the slice
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setJobToDelete(null);
  };

  // Action column (permission-gated)
  const actionColumn = useMemo(() => {
    const hasAnyAction = canUpdate || canDelete || canView;
    if (!hasAnyAction) return null;

    return {
      title: "ACTIONS",
      key: "actions",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const menuItems = [
          canUpdate && {
            key: "update",
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <EditMenuIcon /> Update
              </span>
            ),
            onClick: () => toUpdate(record.id),
          },
          canDelete && {
            key: "delete",
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DeleteMenuIcon /> Delete
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
                >
                  <ThreeDotsIcon />
                </button>
              </Dropdown>
            )}
            {canView && (
              <button
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
                onClick={() => toView(record.id)}
              >
                <ViewListIcon />
              </button>
            )}
          </div>
        );
      },
    };
  }, [toView, toUpdate, canUpdate, canDelete, canView]);

  const baseColumns = useMemo(
    () => [...getJobManagementColumns(accessGroupsMap), ...(actionColumn ? [actionColumn] : [])],
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
          <ButtonComponent key="cancel" onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </ButtonComponent>,
          <ButtonComponent
            key="delete"
            border={false}
            className="!bg-[#d32f2f] !text-white !border-transparent"
            onClick={handleDeleteConfirm}
            loading={deleteLoading}
          >
            Delete
          </ButtonComponent>,
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
