import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

/**
 * Create/Update Job Group Page
 * Displays form to create or update a job group
 *
 * Edit mode is detected via useParams() - if :id is present, it's update mode
 *
 * TODO: Implement full form with:
 * - Job group name input
 * - Job group code input
 * - Access group dropdown
 * - Description textarea
 * - Save button to create/update
 * - Cancel button to return to list
 * - Validation and error handling
 */
const CreateJobGroupPage = () => {
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();

  const isEditMode = !!id;
  const pageTitle = isEditMode ? `Update Job Group (${id})` : "Create Job Group";

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
      breadcrumbName: isEditMode ? "Update Job Group" : "Create Job Group",
    },
  ];

  const handleSave = () => {
    // TODO: Implement save logic
    console.log(isEditMode ? "Update job group" : "Create job group");
  };

  const handleCancel = () => {
    navigate(JOB_MGMT_ROUTES.VIEW_JOB_GROUP);
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <NxCardContainer
        header={pageTitle}
        actionElement={
          <div className="flex gap-2">
            <ButtonComponent
              type="default"
              onClick={handleCancel}
              className="px-3 py-2 rounded-lg"
            >
              <span className="text-xs font-medium">Cancel</span>
            </ButtonComponent>
            <ButtonComponent
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              isPrimary={true}
              className="px-3 py-2 rounded-lg"
            >
              <span className="text-xs font-medium">Save</span>
            </ButtonComponent>
          </div>
        }
      >
        <div style={{ padding: "20px" }}>
          <p style={{ color: "#999", textAlign: "center", marginTop: "60px" }}>
            📝 {pageTitle} - Coming Soon
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
            <li>✓ Job group name input</li>
            <li>✓ Job group code input</li>
            <li>✓ Access group dropdown</li>
            <li>✓ Description textarea</li>
            <li>✓ Form validation</li>
            <li>✓ {isEditMode ? "Update" : "Create"} functionality</li>
          </ul>
        </div>
      </NxCardContainer>
    </LayoutMenu>
  );
};

export default CreateJobGroupPage;
