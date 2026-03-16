import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
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
  const { id } = useParams();
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

        {/* METADATA */}
        <NxBaseContainer border header="METADATA">
          <KvGrid>
            <KvItem label="Name"        value={job.name} />
            <KvItem label="Code"        value={job.code} />
            <KvItem label="Type"        value={job.type} />
            <KvItem label="Status"      value={job.status} />
            <KvItem label="Description" value={job.description} />
          </KvGrid>
        </NxBaseContainer>

        {/* EXECUTION */}
        <NxBaseContainer border header="EXECUTION" className="mt-4">
          <KvGrid>
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
          </KvGrid>
        </NxBaseContainer>

        {/* CONFIGURATION */}
        <NxBaseContainer border header="CONFIGURATION" className="mt-4">
          <KvGrid>
            <KvItem label="Timeout (s)"        value={job.timeout} />
            <KvItem label="Max Retry"          value={job.maxRetry} />
            <KvItem label="Backoff Multiplier" value={job.retryPolicy?.backoffMultiplier} />
            <KvItem label="Version"            value={job.version} />
          </KvGrid>
        </NxBaseContainer>

        {/* ACCESS */}
        <NxBaseContainer border header="ACCESS" className="mt-4">
          <KvGrid>
            <KvItem label="Module"     value={job.module} />
            <KvItem label="Created By" value={job.createdBy} />
            <KvItem label="Created At" value={job.createdAt} />
            <KvItem label="Updated By" value={job.updatedBy} />
            <KvItem label="Updated At" value={job.updatedAt} />
          </KvGrid>
        </NxBaseContainer>

        {/* PARAMETERS */}
        <NxBaseContainer border header="PARAMETERS" className="mt-4">
          {!job.parameters?.length ? (
            <p style={{ color: "#999", fontSize: 13, padding: "8px 0" }}>No parameters defined.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  {["Name", "Code", "Type", "Length", "Description"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", border: "1px solid #e0e0e0", color: "#666", fontWeight: 500, fontSize: 11, textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {job.parameters.map((p, i) => (
                  <tr key={p.key ?? i}>
                    <td style={{ padding: "8px 12px", border: "1px solid #e0e0e0" }}>{p.name ?? "—"}</td>
                    <td style={{ padding: "8px 12px", border: "1px solid #e0e0e0" }}>{p.code ?? "—"}</td>
                    <td style={{ padding: "8px 12px", border: "1px solid #e0e0e0" }}>{p.type ?? "—"}</td>
                    <td style={{ padding: "8px 12px", border: "1px solid #e0e0e0" }}>{p.length ?? "—"}</td>
                    <td style={{ padding: "8px 12px", border: "1px solid #e0e0e0" }}>{p.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </NxBaseContainer>

      </NxCardContainer>

      {/* Footer */}
      <footer className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-lg border border-solid border-[#C8CDD4]">
        <ButtonComponent onClick={() => navigate(-1)}>Back</ButtonComponent>
        <ButtonComponent
          border={false}
          className="!bg-[#1976d2] !text-white !border-transparent"
          onClick={() => navigate(JOB_MGMT_ROUTES.UPDATE_JOB.replace(":id", id))}
        >
          Edit
        </ButtonComponent>
      </footer>

    </LayoutMenu>
  );
};

export default ViewJobPage;
