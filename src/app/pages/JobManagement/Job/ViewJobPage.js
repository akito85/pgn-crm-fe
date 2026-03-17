import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import ButtonComponent from "../../../../components/ButtonComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { useGetJobByIdQuery } from "../../../../redux/slices/job_management/jobApiSlice";

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

const KvGrid = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", padding: "12px 0" }}>
    {children}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const ViewJobPage = () => {
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();

  const { data: job, isLoading } = useGetJobByIdQuery(id);

  const breadcrumbRoutes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: JOB_MGMT_ROUTES.VIEW_JOB,                      breadcrumbName: "Job List" },
    { path: "",                                             breadcrumbName: "View" },
  ];

  if (isLoading || !job) {
    return (
      <LayoutMenu>
        <BreadCrumb routes={breadcrumbRoutes} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          <Spin size="large" />
        </div>
      </LayoutMenu>
    );
  }

  return (
    <LayoutMenu>
      <BreadCrumb routes={breadcrumbRoutes} />

      <NxCardContainer header="JOB DETAIL">

        {/* JOB INFORMATION */}
        <NxBaseContainer border header="JOB INFORMATION">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "16px 24px", padding: "12px 0" }}>
            {/* Row 1: METADATA */}
            <KvItem label="Name"        value={job.name} />
            <KvItem label="Code"        value={job.code} />
            <KvItem label="Type"        value={job.type} />

            {/* Row 2: EXECUTION */}
            <KvItem label="Execute Type" value={job.executeType} />
            <KvItem label="Handler"      value={job.handler} />
            <KvItem label="Task Queue"   value={job.taskQueueName ?? (job.taskQueueId ? String(job.taskQueueId) : "Default")} />
            {job.defaultInput && (() => {
              try {
                const parsed = JSON.parse(job.defaultInput);
                return (
                  <>
                    <KvItem label="Schema"    value={parsed.schema} />
                    <KvItem label="Procedure" value={parsed.procedureName} />
                  </>
                );
              } catch {
                return <KvItem label="Default Input" value={job.defaultInput} />;
              }
            })()}

            {/* Row 3: CONFIGURATION */}
            <KvItem label="Timeout (s)"        value={job.timeout} />
            <KvItem label="Max Retry"          value={job.maxRetry} />
            {job.retryPolicy && (() => {
              try {
                const policy = typeof job.retryPolicy === 'string' ? JSON.parse(job.retryPolicy) : job.retryPolicy;
                return <KvItem label="Backoff Multiplier" value={policy?.backoffMultiplier} />;
              } catch {
                return null;
              }
            })()}

            {/* Row 4: ACCESS */}
            <KvItem label="Module"      value={job.module} />
            <KvItem label="Group Access" value={job.accessGroupId ?? "—"} />

            {/* Row 5: DESCRIPTION - spans columns 3-5 */}
            <div style={{ gridColumn: "3 / -1" }}>
              <KvItem label="Description" value={job.description} />
            </div>
          </div>
        </NxBaseContainer>

        {/* PARAMETERS */}
        <NxBaseContainer border header="PARAMETERS" className="mt-4" minHeight="250px">
          {!job.parameters?.length ? (
            <p style={{ color: "#999", fontSize: 13, padding: "8px 0" }}>No parameters defined.</p>
          ) : (
            <NxTable
              idTable="jobParametersTable"
              dataSource={job.parameters}
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Code",
                  dataIndex: "code",
                  key: "code",
                },
                {
                  title: "Type",
                  dataIndex: "type",
                  key: "type",
                },
                {
                  title: "Length",
                  dataIndex: "length",
                  key: "length",
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                },
              ]}
              usePagination={false}
              showSearchBar={false}
              showAdvanceSearch={false}
              useSelect={false}
              loading={false}
              rowKey="key"
              tableScrolled={job.parameters && job.parameters.length > 10 ? { y: 380 } : {}}
            />
          )}
        </NxBaseContainer>

      </NxCardContainer>

      {/* NOTIFICATION SETTINGS */}
      <NxCardContainer header="NOTIFICATION SETTINGS" className="mt-4">
        <div className="flex flex-col gap-4">
          {/* In-App Notifications */}
          <section className="flex flex-col gap-3 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
            <h3 className="text-primary text-sm font-normal uppercase">In-App Notifications</h3>
            <div className="flex items-center justify-between py-2 border-0 border-b border-dashed border-[#c8cdd4]">
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">In App Message</span>
              <NxSwitch size="md" checked={job.notificationSettings?.showInDrawer ?? false} disabled />
            </div>
            <div className="flex items-center justify-between py-2 border-0 border-b border-dashed border-[#c8cdd4]">
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Show as Alert</span>
              <NxSwitch size="md" checked={job.notificationSettings?.showAlert ?? false} disabled />
            </div>
          </section>

          {/* External Notifications */}
          <section className="flex flex-col gap-3 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
            <h3 className="text-primary text-sm font-normal uppercase">External Notifications</h3>
            <div className="flex items-center justify-between py-2 border-0 border-b border-dashed border-[#c8cdd4]">
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Send via Email</span>
              <NxSwitch size="md" checked={job.notificationSettings?.sendViaEmail ?? false} disabled />
            </div>
            <div className="flex items-center justify-between py-2 border-0 border-b border-dashed border-[#c8cdd4]">
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Send via SMS</span>
              <NxSwitch size="md" checked={job.notificationSettings?.sendViaSMS ?? false} disabled />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Send via WhatsApp</span>
              <NxSwitch size="md" checked={job.notificationSettings?.sendViaWhatsApp ?? false} disabled />
            </div>
          </section>
        </div>
      </NxCardContainer>

      {/* HISTORY LOG INFORMATION */}
      <NxCardContainer header="HISTORY LOG INFORMATION" className="mt-4">
        <div className="w-full p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "16px 24px", padding: "0" }}>
            {/* Record ID */}
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Record ID</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">{job.jobId ?? "—"}</div>
            </div>

            {/* Created Date */}
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Created Date</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">
                {job.createdAt ? new Date(job.createdAt).toLocaleString() : "—"}
              </div>
            </div>

            {/* Created By */}
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Created By</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">{job.createdBy ?? "—"}</div>
            </div>

            {/* Updated Date */}
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Updated Date</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">
                {job.updatedAt ? new Date(job.updatedAt).toLocaleString() : "—"}
              </div>
            </div>

            {/* Updated By */}
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="text-Semantic-Text-light-text-primary text-xs font-semibold leading-[18px] tracking-tight">Updated By</div>
              <div className="text-Semantic-Text-light-text-primary text-xs font-medium leading-[18px] tracking-tight">{job.updatedBy ?? "—"}</div>
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
          onClick={() => navigate(JOB_MGMT_ROUTES.UPDATE_JOB, { state: { id } })}
        >
          Edit
        </ButtonComponent>
      </footer>

    </LayoutMenu>
  );
};

export default ViewJobPage;
