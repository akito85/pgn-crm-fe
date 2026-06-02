import React from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import NxTab from "../../../components/Nx/NxTab";
import { JOB_MGMT_ROUTES } from "../../../routes/job_management/job_routes";
import ExecutionsPanel from "./JobExecution/ExecutionsPanel";
import ScheduledJobsPanel from "./JobSchedule/ScheduledJobsPanel";

const JobMonitorTabsPage = () => {
  const routes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: "", breadcrumbName: "Job Monitoring" },
  ];

  const tabs = [
    { key: "executions", label: "Executions", content: <ExecutionsPanel /> },
    { key: "scheduled",  label: "Scheduled Jobs", content: <ScheduledJobsPanel /> },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <NxTab tabs={tabs} defaultActiveKey="executions" variant="underlined" animated />
    </>
  );
};

export default JobMonitorTabsPage;
