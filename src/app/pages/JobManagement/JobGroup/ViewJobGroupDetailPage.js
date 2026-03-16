import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";

/**
 * View Job Group Detail Page
 * Displays details of a specific job group with nested jobs
 *
 * TODO: Implement full detail view with:
 * - Job group metadata (name, code, access group, description)
 * - Nested jobs table (same as in expandable list)
 * - Edit button to navigate to update page
 * - Back button to return to job group list
 */
const ViewJobGroupDetailPage = () => {
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate(JOB_MGMT_ROUTES.VIEW_JOB_GROUP);
    }
  }, [id, navigate]);

  const routes = [
    {
      path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT,
      breadcrumbName: "Job Scheduler Management",
    },
    {
      path: JOB_MGMT_ROUTES.VIEW_JOB_GROUP,
      breadcrumbName: "Job Group List",
    },
    {
      path: "",
      breadcrumbName: `Job Group Detail${id ? ` (${id})` : ""}`,
    },
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <NxCardContainer
        header={`JOB GROUP DETAIL${id ? ` - ${id}` : ""}`}
        actionElement={
          <div className="flex gap-2">
            <ButtonComponent
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(JOB_MGMT_ROUTES.VIEW_JOB_GROUP)}
              className="px-3 py-2 rounded-lg"
            >
              <span className="text-xs font-medium">Back to List</span>
            </ButtonComponent>
            <ButtonComponent
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(JOB_MGMT_ROUTES.UPDATE_JOB_GROUP, { state: { id } })
              }
              isPrimary={true}
              className="px-3 py-2 rounded-lg"
            >
              <span className="text-xs font-medium">Edit</span>
            </ButtonComponent>
          </div>
        }
      >
        <div style={{ padding: "20px" }}>
          <p style={{ color: "#999", textAlign: "center", marginTop: "60px" }}>
            📝 Job Group Detail Page - Coming Soon
          </p>
          <p style={{ color: "#ccc", textAlign: "center", fontSize: "12px" }}>
            This page will display:
          </p>
          <ul
            style={{
              color: "#ccc",
              textAlign: "center",
              fontSize: "12px",
              listStyle: "none",
            }}
          >
            <li>✓ Job group metadata (name, code, access group, description)</li>
            <li>✓ Nested jobs table</li>
            <li>✓ Edit and delete options</li>
          </ul>
        </div>
      </NxCardContainer>
    </LayoutMenu>
  );
};

export default ViewJobGroupDetailPage;
