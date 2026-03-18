import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Spin } from "antd";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTableNested from "../../../../components/Nx/NxTableNested";
import NxModal from "../../../../components/Nx/NxModal";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  getAllJobGroupPaginate,
  getJobsByGroupId,
} from "../../../../redux/slices/job_management/jobGroupSlice";
import { useDeleteJobGroupMutation } from "../../../../redux/slices/job_management/jobGroupApiSlice";
import {
  getJobGroupManagementColumns,
  getJobGroupChildTableColumns,
} from "../jobGroupManagementColumns";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import useGrantAccessHooks from "../../../../components/useGrantAccessHooks";
import { useGetAccessGroupsQuery } from "../../../../redux/slices/job_management/jobApiSlice";

const PAGE_SIZE = 20;

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

const JobGroupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteJobGroup, { isLoading: deleteLoading }] = useDeleteJobGroupMutation();

  // Permission check
  const { actions } = useGrantAccessHooks();
  const permissions = useMemo(
    () => (actions ?? []).filter(Boolean).map((a) => a.toLowerCase()),
    [actions]
  );
  const canCreate = permissions.includes("create");
  const canUpdate = permissions.includes("update");
  const canDelete = permissions.includes("delete");
  const canView   = permissions.includes("view");

  // Redux state
  const { data, loading, jobsByGroupId } = useSelector((state) => state.jobGroup);

  // Access group id→name map (shared with child columns)
  const { data: accessGroupsRaw } = useGetAccessGroupsQuery();
  const accessGroupsMap = useMemo(() => {
    if (!accessGroupsRaw) return {};
    return Object.fromEntries(accessGroupsRaw.map((g) => [g.groupId, g.groupName]));
  }, [accessGroupsRaw]);

  // Local state
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [accumulatedData, setAccumulatedData] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  // Fetch JobGroup paginated list
  const handleFetch = useCallback(() => {
    dispatch(
      getAllJobGroupPaginate({
        page,
        pageSize: PAGE_SIZE,
        sort,
      })
    );
  }, [dispatch, page, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Accumulate pages for infinite scroll
  useEffect(() => {
    if (!data?.result) return;
    if (page === 1) {
      setAccumulatedData(data.result);
    } else {
      setAccumulatedData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = data.result.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    }
  }, [data?.result, page]);

  // Handle row expand - lazy load jobs
  // Note: onExpandedRowsChange receives the NEW array of expanded keys
  const handleRowExpand = useCallback(
    (newExpandedKeys) => {
      // Find which keys are newly added (expanded)
      const newlyExpanded = newExpandedKeys.filter(
        (key) => !expandedRowKeys.includes(key)
      );

      setExpandedRowKeys(newExpandedKeys);

      // Fetch jobs for newly expanded groups if not already cached
      newlyExpanded.forEach((groupId) => {
        if (!jobsByGroupId[groupId]?.data) {
          dispatch(getJobsByGroupId({ groupId, page: 0, pageSize: 20 }));
        }
      });
    },
    [dispatch, expandedRowKeys, jobsByGroupId]
  );

  // Prepare data for custom table (includes jobs for each group)
  const tableDataWithJobs = useMemo(() => {
    return accumulatedData.map((group) => ({
      ...group,
      children: jobsByGroupId[group.id]?.data || [],
    }));
  }, [accumulatedData, jobsByGroupId]);

  // Set of group IDs whose child jobs are currently being fetched
  const loadingKeys = useMemo(() => {
    return new Set(
      Object.entries(jobsByGroupId)
        .filter(([, v]) => v?.loading)
        .map(([k]) => k)
    );
  }, [jobsByGroupId]);

  // Handle expand row - lazy load jobs
  const handleExpandRow = useCallback(
    (groupId) => {
      if (!jobsByGroupId[groupId]?.data) {
        dispatch(getJobsByGroupId({ groupId, page: 0, pageSize: 20 }));
      }
    },
    [dispatch, jobsByGroupId]
  );

  // Column width configuration for child table (use the 'key' property from column definitions)
  // These override the default widths from column definitions for child table only
  const tableColumnWidths = useMemo(() => ({
    parameter: 800,    // PARAMETER column (dataIndex: parameters, key: parameter)
    type: 120,         // TYPE column (matches original)
    execType: 220,     // EXEC TYPE column
    timeout: 100,      // TIMEOUT column (matches original)
    maxRetry: 100,     // MAX RETRY column (matches original)
    handlerClass: 330, // HANDLER CLASS column (increased)
  }), []);

  // Get child columns for nested table (exclude desc and audit columns)
  const childColumns = useMemo(() => {
    const allColumns = getJobGroupChildTableColumns(accessGroupsMap);
    const excludeKeys = ["desc", "accessGroup", "createdBy", "createdDate", "updatedBy", "updatedDate"];
    return allColumns
      .filter((col) => !excludeKeys.includes(col.key || col.dataIndex))
      .map((col) => ({
        ...col,
        key: col.key || col.dataIndex || col.title,
      }));
  }, [accessGroupsMap]);

  // Action column with three-dots menu and view button (permission-gated)
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
        if (!record || !record.id) return <span>—</span>;

        const menuItems = [
          canUpdate && {
            key: "update",
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <EditMenuIcon /> Update
              </span>
            ),
            onClick: () => navigate(JOB_MGMT_ROUTES.UPDATE_JOB_GROUP, { state: { id: record.id } }),
          },
          canDelete && {
            key: "delete",
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DeleteMenuIcon /> Delete
              </span>
            ),
            onClick: () => {
              setGroupToDelete({
                id: record.id,
                name: record.name || "—",
                code: record.code || "—",
              });
              setDeleteModalOpen(true);
            },
          },
        ].filter(Boolean);

        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {menuItems.length > 0 && (
              <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={(e) => e.stopPropagation()}
                  type="button"
                >
                  <ThreeDotsIcon />
                </button>
              </Dropdown>
            )}
            {canView && (
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(JOB_MGMT_ROUTES.VIEW_JOB_GROUP_DETAIL, { state: { id: record.id } });
                }}
                type="button"
              >
                <ViewListIcon />
              </button>
            )}
          </div>
        );
      },
    };
  }, [navigate, canUpdate, canDelete, canView]);

  // Column definitions (actionColumn is null when user has no permissions)
  const baseColumns = useMemo(
    () => [...getJobGroupManagementColumns(), ...(actionColumn ? [actionColumn] : [])],
    [actionColumn]
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

  // Pagination & sorting
  const handleRefresh = useCallback(() => {
    setPage(1);
    setAccumulatedData([]);
    setExpandedRowKeys([]);
  }, []);

  const handleLoadMore = async () => {
    const totalPages = data?.page?.totalPages || 0;
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const hasMore = accumulatedData.length < (data?.page?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    setSort(
      sorter.order
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : ""
    );
    setPage(1);
    setAccumulatedData([]);
    setExpandedRowKeys([]);
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    try {
      await deleteJobGroup(groupToDelete.id).unwrap();
      setDeleteModalOpen(false);
      setGroupToDelete(null);
      handleRefresh();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setGroupToDelete(null);
  };

  const downloadListHandler = () => {
    // TODO: Implement download functionality
    console.log("Download List clicked");
  };

  const createHandler = () => {
    navigate(JOB_MGMT_ROUTES.CREATE_JOB_GROUP);
  };

  const routes = [
    {
      path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT,
      breadcrumbName: "Job Scheduler Management",
    },
    {
      path: "",
      breadcrumbName: "Job Group List",
    },
  ];

  return (
    <div>
      <BreadCrumb routes={routes} />
      <NxCardContainer
        header="JOB GROUP LIST"
        actionElement={
          <div className="flex gap-2">
            <ButtonComponent
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadListHandler}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
            >
              <span className="text-xs font-medium tracking-tight">Download List</span>
            </ButtonComponent>
            <ButtonComponent
              type="primary"
              icon={<PlusOutlined />}
              onClick={createHandler}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
            >
              <span className="text-xs font-medium tracking-tight">Create</span>
            </ButtonComponent>
          </div>
        }
      >
        <div style={{ maxHeight: "600px", overflowY: "auto", width: "100%" }}>
          <NxTableNested
            parentColumns={getJobGroupManagementColumns()}
            childColumns={childColumns}
            dataSource={tableDataWithJobs}
            loading={loading}
            onExpand={handleExpandRow}
            actionColumn={actionColumn}
            loadingKeys={loadingKeys}
            columnWidths={tableColumnWidths}
          />
        </div>
      </NxCardContainer>

      {/* Delete Confirmation Modal */}
      <NxModal
        isOpen={deleteModalOpen}
        title="Delete Job Group"
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
            Are you sure you want to delete this job group? This action cannot be undone.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px 0", fontSize: 13 }}>
            <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Name</span>
            <span style={{ fontWeight: 500, color: "#222" }}>{groupToDelete?.name ?? "—"}</span>
            <span style={{ color: "#999", textTransform: "uppercase", fontSize: 11 }}>Code</span>
            <span style={{ fontWeight: 500, color: "#222" }}>{groupToDelete?.code ?? "—"}</span>
          </div>
        </div>
      </NxModal>
    </div>
  );
};

export default JobGroupPage;
