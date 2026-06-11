import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTableNested from "../../../../components/Nx/NxTableNested";
import BreadCrumb from "../../../../components/BreadCrumb";
import {
  getAllJobGroupPaginate,
  getJobsByGroupId,
} from "../../../../redux/slices/job_management/jobGroupSlice";
import {
  getJobGroupManagementColumns,
  getJobGroupChildTableColumns,
} from "../jobGroupManagementColumns";
import { useGetAccessGroupsQuery } from "../../../../redux/slices/job_management/jobApiSlice";
import ViewListIcon from "../../../../assets/Icon/Nx/IconViewList";

const PAGE_SIZE = 20;

const UserJobGroupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, loading, jobsByGroupId } = useSelector((state) => state.jobGroup);
  const rawToken = useSelector((state) => state.auth?.token);
  const userId = useMemo(() => {
    try { const t = JSON.parse(rawToken || "{}"); return t?.userId || t?.id || t?.username || null; }
    catch { return null; }
  }, [rawToken]);

  const { data: accessGroupsRaw } = useGetAccessGroupsQuery();
  const accessGroupsMap = useMemo(() => {
    if (!accessGroupsRaw) return {};
    return Object.fromEntries(accessGroupsRaw.map((g) => [g.groupId, g.groupName]));
  }, [accessGroupsRaw]);

  const [page, setPage] = useState(1);
  const [accumulatedData, setAccumulatedData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleFetch = useCallback(() => {
    dispatch(getAllJobGroupPaginate({ page, pageSize: PAGE_SIZE, sort: "" }));
  }, [dispatch, page]);

  useEffect(() => { handleFetch(); }, [handleFetch]);

  useEffect(() => {
    if (!data?.result) return;
    if (page === 1) {
      setAccumulatedData(data.result);
    } else {
      setAccumulatedData((prev) => {
        const existing = new Set(prev.map((i) => i.id));
        return [...prev, ...data.result.filter((i) => !existing.has(i.id))];
      });
    }
  }, [data?.result, page]);

  const handleRowExpand = useCallback((newExpandedKeys) => {
    const newlyExpanded = newExpandedKeys.filter((k) => !expandedRowKeys.includes(k));
    setExpandedRowKeys(newExpandedKeys);
    newlyExpanded.forEach((groupId) => {
      if (!jobsByGroupId[groupId]?.data) {
        dispatch(getJobsByGroupId({ groupId, page: 0, pageSize: 20 }));
      }
    });
  }, [dispatch, expandedRowKeys, jobsByGroupId]);

  const handleExpandRow = useCallback((groupId) => {
    if (!jobsByGroupId[groupId]?.data) {
      dispatch(getJobsByGroupId({ groupId, page: 0, pageSize: 20 }));
    }
  }, [dispatch, jobsByGroupId]);

  const tableDataWithJobs = useMemo(() =>
    accumulatedData.map((group) => ({
      ...group,
      children: jobsByGroupId[group.id]?.data || [],
    })), [accumulatedData, jobsByGroupId]);

  const loadingKeys = useMemo(() =>
    new Set(Object.entries(jobsByGroupId).filter(([, v]) => v?.loading).map(([k]) => k)),
    [jobsByGroupId]);

  const childColumns = useMemo(() => {
    const all = getJobGroupChildTableColumns(accessGroupsMap);
    const exclude = ["desc", "accessGroup", "createdBy", "createdDate", "updatedBy", "updatedDate"];
    return all.filter((c) => !exclude.includes(c.key || c.dataIndex))
              .map((c) => ({ ...c, key: c.key || c.dataIndex || c.title }));
  }, [accessGroupsMap]);

  const actionColumn = useMemo(() => ({
    title: "ACTIONS",
    key: "actions",
    width: 80,
    align: "center",
    fixed: "right",
    render: (_, record) => {
      if (!record || !record.id) return <span>—</span>;
      return (
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4,
                   display: "flex", alignItems: "center", color: "#1976D2" }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(JOB_MGMT_ROUTES.VIEW_JOB_GROUP_DETAIL, { state: { id: record.id } });
          }}
          type="button"
        >
          <ViewListIcon />
        </button>
      );
    },
  }), [navigate]);

  const parentColumns = useMemo(() =>
    getJobGroupManagementColumns(accessGroupsMap).map((c) => ({
      ...c, key: c.key || c.dataIndex || c.title,
    })), [accessGroupsMap]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    setAccumulatedData([]);
    setExpandedRowKeys([]);
  }, []);

  const handleLoadMore = () => {
    const totalPages = data?.page?.totalPages || 0;
    if (page < totalPages) setPage((p) => p + 1);
  };

  const hasMore = accumulatedData.length < (data?.page?.totalElements || 0);

  const routes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: "", breadcrumbName: "My Job Groups" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxCardContainer header="MY JOB GROUPS">
        <NxTableNested
          idTable="user-job-group-list"
          userId={userId}
          parentColumns={parentColumns}
          childColumns={childColumns}
          dataSource={tableDataWithJobs}
          loading={loading}
          onExpand={handleExpandRow}
          actionColumn={actionColumn}
          loadingKeys={loadingKeys}
          showRefresh
          onRefresh={handleRefresh}
          useInfiniteScroll
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </NxCardContainer>
    </>
  );
};

export default UserJobGroupPage;
