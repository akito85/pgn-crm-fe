import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import ButtonComponent from "../../../../components/ButtonComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { useGetJobGroupByIdQuery } from "../../../../redux/slices/job_management/jobGroupApiSlice";
import { getJobsByGroupId } from "../../../../redux/slices/job_management/jobGroupSlice";
import { getJobGroupChildTableColumns } from "../jobGroupManagementColumns";

// ─── Key-Value Display Helpers ────────────────────────────────────────────────

const KvItem = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>
      {label}
    </div>
    <div style={{ fontSize: 13, color: "#222", fontWeight: 500 }}>
      {value ?? "—"}
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const ViewJobGroupDetailPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const id        = location.state?.id;

  const { data: group, isLoading } = useGetJobGroupByIdQuery(id, { skip: !id });
  const { jobsByGroupId } = useSelector((state) => state.jobGroup);
  const groupJobs = jobsByGroupId[id];

  // Redirect if no ID
  useEffect(() => {
    if (!id) navigate(JOB_MGMT_ROUTES.VIEW_JOB_GROUP);
  }, [id, navigate]);

  // Fetch jobs for this group
  useEffect(() => {
    if (id && !groupJobs?.data) {
      dispatch(getJobsByGroupId({ groupId: id, page: 0, pageSize: 50 }));
    }
  }, [id, dispatch, groupJobs]);

  const breadcrumbRoutes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: JOB_MGMT_ROUTES.VIEW_JOB_GROUP,                breadcrumbName: "Job Group List" },
    { path: "",                                             breadcrumbName: "View" },
  ];

  if (isLoading || !group) {
    return (
      <>
        <BreadCrumb routes={breadcrumbRoutes} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          <Spin size="large" />
        </div>
      </>
    );
  }

  const jobs = groupJobs?.data ?? [];
  const childColumns = getJobGroupChildTableColumns();

  return (
    <>
      <BreadCrumb routes={breadcrumbRoutes} />

      <NxCardContainer header="JOB GROUP DETAIL">

        {/* GROUP INFORMATION */}
        <NxBaseContainer border header="GROUP INFORMATION">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px 24px", padding: "12px 0" }}>
            <KvItem label="Group Name" value={group.name} />
            <KvItem label="Group Code" value={group.code} />
            <div>
              <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                Active
              </div>
              <NxSwitch size="md" checked={group.isActive === "Y"} disabled />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <KvItem label="Description" value={group.description} />
            </div>
          </div>
        </NxBaseContainer>

        {/* JOBS IN GROUP */}
        <NxBaseContainer border header={`JOBS (${group.jobCount ?? jobs.length})`} className="mt-4">
          {groupJobs?.loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
              <Spin tip="Loading jobs..." />
            </div>
          ) : jobs.length === 0 ? (
            <p style={{ color: "#999", fontSize: 13, padding: "8px 0" }}>No jobs in this group.</p>
          ) : (
            <NxTable
              idTable={`job-group-detail-${id}-jobs`}
              dataSource={jobs}
              columns={childColumns}
              pagination={false}
              usePagination={false}
              useSelect={false}
              useInfiniteScroll={false}
              tableScrolled={{ y: 350, x: "max-content" }}
              loading={false}
            />
          )}
        </NxBaseContainer>

      </NxCardContainer>

      {/* HISTORY LOG */}
      <NxCardContainer header="HISTORY LOG INFORMATION" className="mt-4">
        <div className="w-full p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "16px 24px" }}>
            <div className="flex flex-col gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Record ID</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">{group.id ?? "—"}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Created Date</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">
                {group.createdAt ? new Date(group.createdAt).toLocaleString() : "—"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Created By</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">{group.createdBy ?? "—"}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Updated Date</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">
                {group.updatedAt ? new Date(group.updatedAt).toLocaleString() : "—"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Updated By</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">{group.updatedBy ?? "—"}</div>
            </div>
          </div>
        </div>
      </NxCardContainer>

      {/* Footer */}
      <footer className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-lg border border-solid border-[#C8CDD4]">
        <ButtonComponent onClick={() => navigate(-1)}>Back</ButtonComponent>
        <ButtonComponent
          border={false}
          className="!bg-[#1976d2] !text-white !border-transparent"
          onClick={() => navigate(JOB_MGMT_ROUTES.UPDATE_JOB_GROUP, { state: { id } })}
        >
          Edit
        </ButtonComponent>
      </footer>

    </>
  );
};

export default ViewJobGroupDetailPage;
