import React from "react";
import JobPage from "../../app/pages/JobManagement/Job/JobPage";
import JobGroupPage from "../../app/pages/JobManagement/JobGroup/JobGroupPage";
import JobExecutionPage from "../../app/pages/JobManagement/JobExecution/JobExecutionPage";
import UserJobGroupPage from "../../app/pages/JobManagement/JobGroup/UserJobGroupPage";
import UserJobExecutionPage from "../../app/pages/JobManagement/JobExecution/UserJobExecutionPage";
import CreateJobPage from "../../app/pages/JobManagement/Job/CreateJobPage";
import ViewJobPage from "../../app/pages/JobManagement/Job/ViewJobPage";
import ViewJobGroupDetailPage from "../../app/pages/JobManagement/JobGroup/ViewJobGroupDetailPage";
import CreateJobGroupPage from "../../app/pages/JobManagement/JobGroup/CreateJobGroupPage";
import ViewJobExecutionPage from "../../app/pages/JobManagement/JobExecution/ViewJobExecutionPage";
import JobSchedulePage from "../../app/pages/JobManagement/JobSchedule/JobSchedulePage";
import ViewJobSchedulePage from "../../app/pages/JobManagement/JobSchedule/ViewJobSchedulePage";
import useIsSuperUser from "../../components/useIsSuperUser";

// Guard components — render the superuser or user variant depending on JWT userLevel
const JobSchedulerRootGuard = () => {
  const isSuperUser = useIsSuperUser();
  return isSuperUser ? <JobPage /> : <UserJobGroupPage />;
};

const JobGroupRouteGuard = () => {
  const isSuperUser = useIsSuperUser();
  return isSuperUser ? <JobGroupPage /> : <UserJobGroupPage />;
};

const JobExecutionRouteGuard = () => {
  const isSuperUser = useIsSuperUser();
  return isSuperUser ? <JobExecutionPage /> : <UserJobExecutionPage />;
};

export const JOB_MGMT_ELEMENTS = {
  VIEW_JOB_PAGE:                  <JobSchedulerRootGuard />,
  CREATE_JOB_PAGE:                <CreateJobPage />,
  UPDATE_JOB_PAGE:                <CreateJobPage />,
  VIEW_JOB_DETAIL_PAGE:           <ViewJobPage />,
  VIEW_JOB_GROUP_PAGE:            <JobGroupRouteGuard />,
  CREATE_JOB_GROUP_PAGE:          <CreateJobGroupPage />,
  VIEW_JOB_GROUP_DETAIL_PAGE:     <ViewJobGroupDetailPage />,
  UPDATE_JOB_GROUP_PAGE:          <CreateJobGroupPage />,
  VIEW_JOB_EXECUTION_PAGE:        <JobExecutionRouteGuard />,
  VIEW_JOB_EXECUTION_DETAIL_PAGE: <ViewJobExecutionPage />,
  VIEW_JOB_SCHEDULE_PAGE:         <JobSchedulePage />,
  VIEW_JOB_SCHEDULE_DETAIL_PAGE:  <ViewJobSchedulePage />,
};
