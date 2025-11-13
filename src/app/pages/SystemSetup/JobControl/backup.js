import React, { useState, useRef, useMemo } from "react";
import { Spin, Tooltip, Modal, message } from "antd";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import RadioTabs from "../../../../components/RadioTabs";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";

// Dummy Data - GUNAKAN 'key' bukan 'id'
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
  // Declaration
  const searchInput = useRef(null);

  // State
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [tabHeader, setTabHeader] = useState("Batch Process");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);

  // State for Log Process Job
  const [showLogProcess, setShowLogProcess] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [logProcessData, setLogProcessData] = useState([]);

  // Dummy data based on tab
  const data_job_control = useMemo(() => {
    const data =
      tabHeader === "Batch Process" ? dummyBatchProcess : dummyProcess;
    return {
      result: data,
      page: {
        totalElements: data.length,
      },
    };
  }, [tabHeader]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Columns for Batch Process Tab
  const batchProcessColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "ID",
        dataIndex: "key",
        sorter: true,
        align: "center",
        width: 150,
        filteredValue: [search?.key] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "key",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "key",
            hasValue(search["key"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "BATCH TYPE",
        dataIndex: "batchType",
        sorter: true,
        align: "left",
        width: 150,
        filteredValue: [search?.batchType] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "batchType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "batchType",
            hasValue(search["batchType"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "BATCH NAME",
        dataIndex: "batchName",
        sorter: true,
        align: "left",
        filteredValue: [search?.batchName] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "batchName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "batchName",
            hasValue(search["batchName"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        align: "center",
        width: 150,
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          ),
      },
      {
        title: "CREATED DTM",
        dataIndex: "createdDtm",
        sorter: true,
        align: "center",
        width: 200,
        filteredValue: [search?.createdDtm] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdDtm",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) =>
          renderDateColumn(
            "createdDtm",
            hasValue(search["createdDtm"]),
            searchText,
            text,
            "datetime",
            search
          ),
      },
      {
        title: "TRANSACTION CODE",
        dataIndex: "transactionCode",
        sorter: true,
        align: "left",
        filteredValue: [search?.transactionCode] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "transactionCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "transactionCode",
            hasValue(search["transactionCode"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  // Handle Log Process Job
  const handleLogProcessJob = (record) => {
    setSelectedJobId(record.key);
    setLogProcessData(dummyLogDetails[record.key] || []);
    setShowLogProcess(true);
  };

  // Columns for Process Tab
  const processColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "ID",
        dataIndex: "key",
        sorter: true,
        align: "center",
        width: 150,
        filteredValue: [search?.key] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "key",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "key",
            hasValue(search["key"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "PROCEDURE NAME",
        dataIndex: "procedureName",
        sorter: true,
        align: "left",
        filteredValue: [search?.procedureName] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "procedureName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "procedureName",
            hasValue(search["procedureName"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        align: "center",
        width: 150,
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          ),
      },
      {
        title: "PERCENTAGE PROGRESS",
        dataIndex: "percentageProgress",
        sorter: true,
        align: "right",
        width: 180,
        filteredValue: [search?.percentageProgress] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "percentageProgress",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "percentageProgress",
            hasValue(search["percentageProgress"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "START PROCESS TIME",
        dataIndex: "startProcessTime",
        sorter: true,
        align: "center",
        width: 200,
        filteredValue: [search?.startProcessTime] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "startProcessTime",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) =>
          renderDateColumn(
            "startProcessTime",
            hasValue(search["startProcessTime"]),
            searchText,
            text,
            "datetime",
            search
          ),
      },
      {
        title: "END PROCESS TIME",
        dataIndex: "endProcessTime",
        sorter: true,
        align: "center",
        width: 200,
        filteredValue: [search?.endProcessTime] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "endProcessTime",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) =>
          text === "-"
            ? text
            : renderDateColumn(
                "endProcessTime",
                hasValue(search["endProcessTime"]),
                searchText,
                text,
                "datetime",
                search
              ),
      },
      {
        title: "USER",
        dataIndex: "user",
        sorter: true,
        align: "left",
        width: 120,
        filteredValue: [search?.user] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "user",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "user",
            hasValue(search["user"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "TOTAL RECORD",
        dataIndex: "totalRecord",
        sorter: true,
        align: "right",
        width: 150,
        filteredValue: [search?.totalRecord] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "totalRecord",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "totalRecord",
            hasValue(search["totalRecord"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "TOTAL RECORD PROCESSED",
        dataIndex: "totalRecordProcessed",
        sorter: true,
        align: "right",
        width: 200,
        filteredValue: [search?.totalRecordProcessed] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "totalRecordProcessed",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "totalRecordProcessed",
            hasValue(search["totalRecordProcessed"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "ACTION",
        align: "center",
        fixed: "right",
        key: "action",
        width: 100,
        render: (v, r) => {
          return (
            <Tooltip title="Log Process Job">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => handleLogProcessJob(r)}
                />
              </div>
            </Tooltip>
          );
        },
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  // Columns for Log Process Job Table
  const logProcessColumns = [
    {
      title: "JOB CONTROL ID",
      dataIndex: "jobControlId",
      align: "center",
      width: 150,
    },
    {
      title: "COUNTER",
      dataIndex: "counter",
      align: "center",
      width: 100,
    },
    {
      title: "LOG DATE",
      dataIndex: "logDate",
      align: "center",
      width: 200,
      render: (text) =>
        renderDateColumn("logDate", false, "", text, "datetime", {}),
    },
    {
      title: "LOG MESSAGE",
      dataIndex: "logMessage",
      align: "left",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
  ];

  // onSort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Job",
    },
    {
      path: "",
      breadcrumbName: "Job Control",
    },
  ];

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // data tabs
  const tabs = [{ value: "Batch Process" }, { value: "Process" }];

  // onchange tabs
  const changeTab = (e) => {
    setTabHeader((prevState) => {
      const tempTab = e.target.value;
      if (prevState !== tempTab) {
        setPage(1);
        setPageSize(10);
        setSearch({});
        setSort("");
        setSearchText("");
        setSearchedColumn("");
        setSelectedRowKeys([]);
        setDataTableSelect([]);
        setShowLogProcess(false);
        setSelectedJobId(null);
        setLogProcessData([]);
      }
      return tempTab;
    });
  };

  // Row Selection - SAMA PERSIS dengan ModalApprovalEFaktur
  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    setDataTableSelect(newSelectedRow);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Action Handlers
  const handleSubmitJob = () => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: "Warning",
        content: "Please select at least one job to submit.",
      });
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
      Modal.warning({
        title: "Warning",
        content: "Please select at least one job to force submit.",
      });
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
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: "Warning",
        content: "Please select at least one job to cancel.",
      });
      return;
    }
    Modal.confirm({
      title: "Confirm Cancel Last Job",
      content: `Are you sure you want to cancel the last job of ${selectedRowKeys.length} selected job(s)?`,
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

  // Get current columns based on active tab
  const getCurrentColumns = () => {
    switch (tabHeader) {
      case "Batch Process":
        return batchProcessColumns;
      case "Process":
        return processColumns;
      default:
        return batchProcessColumns;
    }
  };

  // Action buttons for Process tab
  const processActionButtons = tabHeader === "Process" && (
    <div className="flex gap-3 mb-4 mt-4">
      <ButtonComponent
        onClick={handleForceSubmit}
        disabled={selectedRowKeys.length === 0}
        fontSizeClassname="text-[14px]"
        style={{
          backgroundColor: selectedRowKeys.length === 0 ? "#d9d9d9" : "#1890ff",
          color: "#fff",
          border: "none",
          opacity: selectedRowKeys.length === 0 ? 0.6 : 1,
          cursor: selectedRowKeys.length === 0 ? "not-allowed" : "pointer",
          height: "36px",
          minWidth: "110px",
        }}
      >
        Force Submit
      </ButtonComponent>
      <ButtonComponent
        onClick={handleSubmitJob}
        disabled={selectedRowKeys.length === 0}
        fontSizeClassname="text-[14px]"
        style={{
          backgroundColor: selectedRowKeys.length === 0 ? "#d9d9d9" : "#1890ff",
          color: "#fff",
          border: "none",
          opacity: selectedRowKeys.length === 0 ? 0.6 : 1,
          cursor: selectedRowKeys.length === 0 ? "not-allowed" : "pointer",
          height: "36px",
          minWidth: "110px",
        }}
      >
        Submit Job
      </ButtonComponent>
      <ButtonComponent
        onClick={handleCancelLastJob}
        disabled={selectedRowKeys.length === 0}
        fontSizeClassname="text-[14px]"
        style={{
          backgroundColor: selectedRowKeys.length === 0 ? "#d9d9d9" : "#1890ff",
          color: "#fff",
          border: "none",
          opacity: selectedRowKeys.length === 0 ? 0.6 : 1,
          cursor: selectedRowKeys.length === 0 ? "not-allowed" : "pointer",
          height: "36px",
          minWidth: "130px",
        }}
      >
        Cancel Last Job
      </ButtonComponent>
      <ButtonComponent
        onClick={handleCancelAllJob}
        fontSizeClassname="text-[14px]"
        style={{
          backgroundColor: "#ff4d4f",
          color: "#fff",
          border: "none",
          height: "36px",
          minWidth: "130px",
        }}
      >
        Cancel All Job
      </ButtonComponent>
    </div>
  );

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <BaseContainer header={"JOB CONTROL"}>
          <RadioTabs
            data={tabs}
            onChange={changeTab}
            currentPosition={tabHeader}
          />

          {processActionButtons}

          <div className="my-5">
            <TablePaginationNew
              columns={getCurrentColumns()}
              dataSource={data_job_control.result || []}
              totalData={data_job_control?.page?.totalElements || 0}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              tableScrolled={{ x: 2000, y: 600 }}
              onSort={onSort}
              rowSelection={tabHeader === "Process" ? rowSelection : null}
            />
          </div>

          {/* Log Process Job Table - Tampil di bawah saat tombol detail diklik */}
          {showLogProcess && tabHeader === "Process" && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Log Process Job - ID: {selectedJobId}
                </h3>
                <ButtonComponent
                  onClick={() => {
                    setShowLogProcess(false);
                    setSelectedJobId(null);
                    setLogProcessData([]);
                  }}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Close Log
                </ButtonComponent>
              </div>
              <TablePaginationNew
                columns={logProcessColumns}
                dataSource={logProcessData}
                pagination={false}
                tableScrolled={{ x: 1000 }}
                rowKey={(record) => `${record.jobControlId}-${record.counter}`}
              />
            </div>
          )}
        </BaseContainer>
      </LayoutMenu>
    </Spin>
  );
};

export default JobControlPage;
