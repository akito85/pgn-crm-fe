import JobPage from "../../app/pages/JobManagement/Job/JobPage";
import JobGroupPage from "../../app/pages/JobManagement/JobGroup/JobGroupPage";
import JobExecutionPage from "../../app/pages/JobManagement/JobExecution/JobExecutionPage";
import CreateJobPage from "../../app/pages/JobManagement/Job/CreateJobPage";

export const JOB_MGMT_ELEMENTS = {
  VIEW_JOB_PAGE:           <JobPage />,
  CREATE_JOB_PAGE:         <CreateJobPage />,
  VIEW_JOB_GROUP_PAGE:     <JobGroupPage />,
  VIEW_JOB_EXECUTION_PAGE: <JobExecutionPage />,
};
