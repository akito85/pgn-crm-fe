import JobPage from "../../app/pages/JobManagement/Job/JobPage";
import JobGroupPage from "../../app/pages/JobManagement/JobGroup/JobGroupPage";
import JobExecutionPage from "../../app/pages/JobManagement/JobExecution/JobExecutionPage";
import CreateJobPage from "../../app/pages/JobManagement/Job/CreateJobPage";
import ViewJobPage from "../../app/pages/JobManagement/Job/ViewJobPage";
import ViewJobGroupDetailPage from "../../app/pages/JobManagement/JobGroup/ViewJobGroupDetailPage";
import CreateJobGroupPage from "../../app/pages/JobManagement/JobGroup/CreateJobGroupPage";

export const JOB_MGMT_ELEMENTS = {
  VIEW_JOB_PAGE:             <JobPage />,
  CREATE_JOB_PAGE:           <CreateJobPage />,
  UPDATE_JOB_PAGE:           <CreateJobPage />,   // reuse — edit mode detected via useParams
  VIEW_JOB_DETAIL_PAGE:      <ViewJobPage />,
  VIEW_JOB_GROUP_PAGE:       <JobGroupPage />,
  CREATE_JOB_GROUP_PAGE:     <CreateJobGroupPage />,
  VIEW_JOB_GROUP_DETAIL_PAGE: <ViewJobGroupDetailPage />,
  UPDATE_JOB_GROUP_PAGE:     <CreateJobGroupPage />, // reuse — edit mode detected via useParams
  VIEW_JOB_EXECUTION_PAGE:   <JobExecutionPage />,
};
