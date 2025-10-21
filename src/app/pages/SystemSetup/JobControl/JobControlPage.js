import React, { useMemo, useState, useEffect, useRef } from "react";
import { Spin, Tabs, Modal, message } from "antd";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import JobBatch from "./JobBatch";
import JobProcess from "./JobProcess";

const { TabPane } = Tabs;

const dummyBatchProcess = [
  {
    key: "batch-prabil-1",
    batchType: "PRABILL",
    batchName: "PACK_PRABILL.POPULATEDATA",
    status: "IN PROCESS",
    createdDtm: "2013-05-14T03:37:19",
    transactionCode: "POPULATE20250909_001",
  },
  {
    key: "batch-billing-2",
    batchType: "BILLING",
    batchName: "PACK_BILLING.GENERATEINVOICE",
    status: "COMPLETED",
    createdDtm: "2013-05-14T02:15:30",
    transactionCode: "BILLING20250909_002",
  },
  {
    key: "batch-payment-3",
    batchType: "PAYMENT",
    batchName: "PACK_PAYMENT.PROCESSDATA",
    status: "FAILED",
    createdDtm: "2013-05-14T01:20:45",
    transactionCode: "PAYMENT20250909_003",
  },
];

const dummyProcess = [
  {
    key: "process-prabil-1",
    procedureName: "PACK_PRABILL.POPULATEDATA",
    status: "IN PROCESS",
    percentageProgress: "10%",
    startProcessTime: "2013-05-14T03:37:19",
    endProcessTime: "-",
    user: "admin",
    totalRecord: 100,
    totalRecordProcessed: 10,
  },
  {
    key: "process-billing-2",
    procedureName: "PACK_BILLING.GENERATEINVOICE",
    status: "COMPLETED",
    percentageProgress: "100%",
    startProcessTime: "2013-05-14T02:15:30",
    endProcessTime: "2013-05-14T02:45:20",
    user: "admin",
    totalRecord: 250,
    totalRecordProcessed: 250,
  },
  {
    key: "process-payment-3",
    procedureName: "PACK_PAYMENT.PROCESSDATA",
    status: "FAILED",
    percentageProgress: "45%",
    startProcessTime: "2013-05-14T01:20:45",
    endProcessTime: "2013-05-14T01:35:12",
    user: "system",
    totalRecord: 150,
    totalRecordProcessed: 67,
  },
];

const dummyLogDetails = {
  "process-prabil-1": [
    {
      jobControlId: "process-prabil-1",
      counter: 1,
      logDate: "2015-05-09T07:33:00",
      logMessage: "Mulai proses charging data pada 07:33:00",
    },
    {
      jobControlId: "process-prabil-1",
      counter: 2,
      logDate: "2015-05-05T07:33:00",
      logMessage: "Load Parameter pada 07:33:00",
    },
  ],
  "process-billing-2": [
    {
      jobControlId: "process-billing-2",
      counter: 1,
      logDate: "2015-05-14T02:15:30",
      logMessage: "Start generating invoices",
    },
    {
      jobControlId: "process-billing-2",
      counter: 2,
      logDate: "2015-05-14T02:45:20",
      logMessage: "Invoice generation completed successfully",
    },
  ],
  "process-payment-3": [
    {
      jobControlId: "process-payment-3",
      counter: 1,
      logDate: "2015-05-14T01:20:45",
      logMessage: "Start payment processing",
    },
    {
      jobControlId: "process-payment-3",
      counter: 2,
      logDate: "2015-05-14T01:35:12",
      logMessage: "Error: Database connection timeout",
    },
  ],
};

const JobControlPage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const logSectionRef = useRef(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);

  const [showLogProcess, setShowLogProcess] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [logProcessData, setLogProcessData] = useState([]);

  const [activeTab, setActiveTab] = useState("batch");

  const dataBatch = useMemo(
    () => ({ result: dummyBatchProcess, page: { totalElements: dummyBatchProcess.length } }),
    []
  );
  const dataProcess = useMemo(
    () => ({ result: dummyProcess, page: { totalElements: dummyProcess.length } }),
    []
  );

 const handleLogProcessJob = (record) => {
  setSelectedJobId(record.key);
  setLogProcessData(dummyLogDetails[record.key] || []);
  setShowLogProcess(true);

  setTimeout(() => {
    if (logSectionRef.current) {
      const targetTop = logSectionRef.current.getBoundingClientRect().top + window.pageYOffset - 80; 
      smoothScrollTo(targetTop, 700);
    }
  }, 400);
};

function smoothScrollTo(target, duration) {
  const start = window.pageYOffset;
  const distance = target - start;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo && sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleSubmitJob = () => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({ title: "Warning", content: "Please select at least one job to submit." });
      return;
    }
    Modal.confirm({
      title: "Confirm Submit Job",
      content: `Are you sure you want to submit ${selectedRowKeys.length} job(s)?`,
      okText: "Submit",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          message.success("Job(s) submitted successfully!");
          setSelectedRowKeys([]);
          setDataTableSelect([]);
          setLoading(false);
        }, 1000);
      },
    });
  };

  const handleForceSubmit = () => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({ title: "Warning", content: "Please select at least one job to force submit." });
      return;
    }
    Modal.confirm({
      title: "Confirm Force Submit",
      content: `Are you sure you want to force submit ${selectedRowKeys.length} job(s)? This will override any existing process.`,
      okText: "Force Submit",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          message.success("Job(s) force submitted successfully!");
          setSelectedRowKeys([]);
          setDataTableSelect([]);
          setLoading(false);
        }, 1000);
      },
    });
  };

  const handleCancelLastJob = () => {
    Modal.confirm({
      title: "Confirm Cancel Last Job",
      content: `Are you sure you want to cancel Last jobs? This action cannot be undone and will Last Job running processes.`,
      okText: "Cancel Job",
      cancelText: "Close",
      okButtonProps: { danger: true },
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          message.success("Last job(s) cancelled successfully!");
          setSelectedRowKeys([]);
          setDataTableSelect([]);
          setLoading(false);
        }, 1000);
      },
    });
  };

  const handleCancelAllJob = () => {
    Modal.confirm({
      title: "Confirm Cancel All Jobs",
      content:
        "Are you sure you want to cancel ALL jobs? This action cannot be undone and will stop all running processes.",
      okText: "Cancel All",
      cancelText: "Close",
      okButtonProps: { danger: true },
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          message.success("All jobs cancelled successfully!");
          setSelectedRowKeys([]);
          setDataTableSelect([]);
          setLoading(false);
        }, 1500);
      },
    });
  };

  const onTabChange = (key) => {
    if (key !== activeTab) {
      // reset per-tab states
      setPage(1);
      setPageSize(10);
      setSort("");
      setSelectedRowKeys([]);
      setDataTableSelect([]);
      setShowLogProcess(false);
      setSelectedJobId(null);
      setLogProcessData([]);
    }
    setActiveTab(key);
  };

  const routes = [
    { path: "", breadcrumbName: "Job" },
    { path: "", breadcrumbName: "Job Control" },
  ];

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />
        <BaseContainer header={"JOB CONTROL"}>
          <Tabs
            activeKey={activeTab}
            onChange={onTabChange}
            items={[
              {
                key: "batch",
                label: "Batch Process",
                children: (
                  <JobBatch
                    data={dataBatch}
                    page={page}
                    pageSize={pageSize}
                    onChangePage={handleChangePage}
                    onSort={onSort}
                  />
                ),
              },
              {
                key: "process",
                label: "Process",
                children: (
                  <JobProcess
                    logSectionRef={logSectionRef}
                    data={dataProcess}
                    page={page}
                    pageSize={pageSize}
                    onChangePage={handleChangePage}
                    onSort={onSort}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    dataTableSelect={dataTableSelect}
                    setDataTableSelect={setDataTableSelect}
                    handleForceSubmit={handleForceSubmit}
                    handleSubmitJob={handleSubmitJob}
                    handleCancelLastJob={handleCancelLastJob}
                    handleCancelAllJob={handleCancelAllJob}
                    handleLogProcessJob={handleLogProcessJob}
                    showLogProcess={showLogProcess}
                    logProcessData={logProcessData}
                    selectedJobId={selectedJobId}
                    setShowLogProcess={setShowLogProcess}
                    setSelectedJobId={setSelectedJobId}
                    setLogProcessData={setLogProcessData}
                  />
                ),
              },
            ]}
          />
        </BaseContainer>
      </LayoutMenu>
    </Spin>
  );
};

export default JobControlPage;