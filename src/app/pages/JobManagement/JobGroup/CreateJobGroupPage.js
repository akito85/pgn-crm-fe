import React, { useEffect, useState } from "react";
import { Form, Input, Select, message, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import NxTableInlineEdit from "../../../../components/Nx/NxTableInlineEdit";
import NxTable from "../../../../components/Nx/NxTable";
import useModalInfiniteData from "../../../../components/Nx/NxTable/hooks/useModalInfiniteData";
import NxModal from "../../../../components/Nx/NxModal";
import ButtonComponent from "../../../../components/ButtonComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import {
  useGetJobGroupByIdQuery,
  useCreateJobGroupMutation,
  useUpdateJobGroupMutation,
} from "../../../../redux/slices/job_management/jobGroupApiSlice";
import { getAllGroupAccessPaginate } from "../../../../redux/slices/system_setup/group_access";
import { getJobsByGroupId } from "../../../../redux/slices/job_management/jobGroupSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchJobsQuery } from "../../../../redux/slices/job_management/jobApiSlice";
const { Option } = Select;

const { TextArea } = Input;

// SVG Icon for adding jobs
const AddJobIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 10.0007H12.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99992 7.5V12.5" stroke="#0075BF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const formItemProps = { style: { marginBottom: "20px" } };
const inputStyle   = { height: "34px", padding: "4px 8px" };
const fieldStyle   = { width: '100%', height: '34px' };

// Column definitions for selected jobs table
const SELECTED_JOBS_COLUMNS = [
  { title: 'NO',           editable: false, width: 60,  align: 'center',
    render: (_, __, index) => index + 1 },
  { title: 'JOB NAME',     dataIndex: 'name',         editable: true,  inputType: 'text',   placeholder: 'Job name', width: 180 },
  { title: 'CODE',         dataIndex: 'code',         editable: true,  inputType: 'text',   placeholder: 'Job code', width: 150 },
  {
    title: 'TYPE',         dataIndex: 'type',         editable: true,  inputType: 'select', width: 120,
    selectOptions: [
      { value: 'BATCH',       label: 'Batch' },
      { value: 'SCHEDULE',    label: 'Schedule' },
      { value: 'QUEUE',       label: 'Queue' },
      { value: 'WORKFLOW',    label: 'Workflow' },
    ],
  },
  {
    title: 'EXEC TYPE',    dataIndex: 'execType',     editable: true,  inputType: 'select', width: 150,
    selectOptions: [
      { value: 'STORED_PROCEDURE', label: 'Stored Procedure' },
      { value: 'SCRIPT',           label: 'Script' },
      { value: 'CUSTOM_HANDLER',   label: 'Custom Handler' },
    ],
  },
  { title: 'CLASS HANDLER', dataIndex: 'handlerClass', editable: true, inputType: 'text', placeholder: 'Handler class', width: 200 },
];

// Column definitions for job selection table
const JOB_SELECTION_COLUMNS = (onAddJob) => [
  { title: 'NO',           dataIndex: 'no',           width: 60,  align: 'center',
    render: (_, __, index) => index + 1 },
  { title: 'JOB NAME',     dataIndex: 'name',         width: 180 },
  { title: 'CODE',         dataIndex: 'code',         width: 150 },
  { title: 'TYPE',         dataIndex: 'type',         width: 120 },
  { title: 'EXEC TYPE',    dataIndex: 'execType',     width: 150 },
  { title: 'CLASS HANDLER', dataIndex: 'handlerClass', width: 200 },
  {
    title: 'ACTION',
    key: 'action',
    width: 80,
    fixed: 'right',
    render: (_, record) => (
      <button
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
        onClick={() => onAddJob(record)}
        className="w-full flex flex-col justify-center items-center"
      >
        <AddJobIcon />
      </button>
    ),
  },
];

const CreateJobGroupPage = () => {
  const [form] = Form.useForm();
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch = useDispatch();

  const id         = location.state?.id;
  const isEditMode = Boolean(id);

  // State for selected jobs
  const [selectedJobs, setSelectedJobs] = useState([]);
  const hasPopulatedJobs = React.useRef(false);

  // Runnable type. CHAINED makes the selected-jobs order significant (it becomes
  // the linear chain order); UNRELATED runs them in parallel, order irrelevant.
  const [groupType, setGroupType] = useState("UNRELATED");

  // Reorder a selected job up (dir=-1) or down (dir=+1) — CHAINED ordering.
  const moveJob = (index, dir) => {
    const target = index + dir;
    setSelectedJobs((prev) => {
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  // State for job selection modal
  const [modalVisible, setModalVisible] = useState(false);
  const [ready, setReady] = useState(false);

  // Encapsulated infinite-scroll data management with RTK Query cache-busting.
  // Replaces manual currentPage/allJobs/hasMore/isResetRef/pendingResolveRef state.
  // Only fetches when modalVisible is true (no wasteful pre-fetch on page mount).
  const jobs = useModalInfiniteData({
    queryHook: useSearchJobsQuery,
    pageSize: 20,
    enabled: modalVisible,
  });

  // Deferred mount via setTimeout: NxTable only renders after the AntD 4.x
  // modal animation settles (~300ms), preventing dimension measurement during
  // the CSS transform transition that causes the visible "glitch".
  const readyTimerRef = React.useRef(null);

  // Function to open the job selection modal
  const handleOpenModal = () => {
    setModalVisible(true);
    jobs.open();
    readyTimerRef.current = setTimeout(() => setReady(true), 300);
  };

  // Shared close logic — used by Cancel button and handleAddSelectedJobs
  const handleCloseModal = () => {
    if (readyTimerRef.current) { clearTimeout(readyTimerRef.current); readyTimerRef.current = null; }
    setModalVisible(false);
    jobs.close();
    setReady(false);
  };

  // Function to add a single job to the table
  const handleAddJobToTable = (job) => {
    const jobId = job.id || job.jobId;
    // Prevent duplicate selection
    if (selectedJobs.some((j) => j.jobId === jobId)) {
      message.warning("Job already selected");
      return;
    }
    const newJob = {
      key: Date.now() + Math.random(),
      jobId: jobId,
      name: job.name || job.jobName,
      code: job.code || job.jobCode,
      type: job.type || job.jobType,
      execType: job.execType || job.executeType || job.exec_type,
      handlerClass: job.handlerClass || job.handler || job.handler_class,
    };
    setSelectedJobs(prev => [...prev, newJob]);
  };

  // Function to add selected jobs from modal to the table
  const handleAddSelectedJobs = (jobsToAdd) => {
    const newJobs = jobsToAdd
      .filter((job) => !selectedJobs.some((j) => j.jobId === (job.id || job.jobId)))
      .map(job => ({
        key: Date.now() + Math.random(),
        jobId: job.id || job.jobId,
        name: job.name,
        code: job.code,
        type: job.type,
        execType: job.executeType || job.execType,
        handlerClass: job.handler || job.handlerClass,
      }));

    setSelectedJobs(prev => [...prev, ...newJobs]);
    handleCloseModal();
  };

  // RTK Query hooks
  const { data: currentGroup } = useGetJobGroupByIdQuery(id, { skip: !id });
  const [createJobGroup, { isLoading: createLoading }] = useCreateJobGroupMutation();
  const [updateJobGroup, { isLoading: updateLoading }] = useUpdateJobGroupMutation();
  const { data: groupAccessData, loading: groupAccessLoading } = useSelector((state) => state.groupAccess);
  const groupAccessList = groupAccessData?.result ?? [];
  const isSubmitting = createLoading || updateLoading;

  const breadcrumbRoutes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: JOB_MGMT_ROUTES.VIEW_JOB_GROUP,                breadcrumbName: "Job Group List" },
    { path: "",                                             breadcrumbName: isEditMode ? "Update" : "Create" },
  ];

  const jobsByGroupId = useSelector((state) => state.jobGroup.jobsByGroupId);

  // Populate form in edit mode
  useEffect(() => {
    if (!isEditMode || !currentGroup) return;
    form.setFieldsValue({
      name:        currentGroup.name,
      code:        currentGroup.code,
      description: currentGroup.description,
      accessGroupId: currentGroup.accessGroupId,
      groupType:   currentGroup.groupType ?? "UNRELATED",
    });
    setGroupType(currentGroup.groupType ?? "UNRELATED");
    // Fetch associated jobs for this group
    dispatch(getJobsByGroupId({ groupId: id, page: 0, pageSize: 200 }));
  }, [currentGroup, isEditMode, form, dispatch, id]);

  // Populate selectedJobs when group's jobs are loaded (edit mode) — once only
  useEffect(() => {
    if (!isEditMode || !id || hasPopulatedJobs.current) return;
    const cached = jobsByGroupId[id];
    if (cached && cached.data && cached.data.length > 0) {
      hasPopulatedJobs.current = true;
      setSelectedJobs(
        cached.data.map((job) => ({
          key: Date.now() + Math.random(),
          jobId: job.id,
          name: job.name,
          code: job.code,
          type: job.type,
          execType: job.execType,
          handlerClass: job.handlerClass,
        }))
      );
    }
  }, [jobsByGroupId, id, isEditMode]);

  // Fetch group access data
  useEffect(() => {
    dispatch(getAllGroupAccessPaginate({ search: '', page: 0, pageSize: 200 }));
  }, [dispatch]);

  const onFinish = async (values) => {
    const jobIds = selectedJobs
      .map((j) => j.jobId)
      .filter(Boolean);

    const payload = {
      name:        values.name,
      code:        values.code.toUpperCase(),
      description: values.description,
      accessGroupId: values.accessGroupId,
      groupType:   values.groupType ?? "UNRELATED",
      jobIds,
    };

    try {
      if (isEditMode) {
        await updateJobGroup({ id, data: payload }).unwrap();
        message.success("Job group updated successfully!");
      } else {
        await createJobGroup(payload).unwrap();
        message.success("Job group created successfully!");
      }
      navigate(JOB_MGMT_ROUTES.VIEW_JOB_GROUP);
    } catch (error) {
      message.error(error?.data?.message || error?.message || "Failed to save job group");
    }
  };

  const onFinishFailed = () => message.error("Please check all required fields");

  const handleCancel = () => navigate(JOB_MGMT_ROUTES.VIEW_JOB_GROUP);

  const handleClear = () => {
    form.resetFields();
    setGroupType("UNRELATED");
  };

  // CHAINED groups expose an ORDER column with move up/down controls so the
  // sequence (= chain order) is explicit. UNRELATED hides it.
  const orderColumn = {
    title: "ORDER", editable: false, width: 96, align: "center",
    render: (_, __, index) => (
      <div style={{ display: "flex", gap: 4, justifyContent: "center", alignItems: "center" }}>
        <span style={{ fontWeight: 600, minWidth: 16 }}>{index + 1}</span>
        <button type="button" onClick={() => moveJob(index, -1)} disabled={index === 0}
          style={{ border: "1px solid #d9d9d9", background: "#fff", borderRadius: 4, cursor: index === 0 ? "not-allowed" : "pointer", lineHeight: 1, padding: "0 4px" }}>↑</button>
        <button type="button" onClick={() => moveJob(index, 1)} disabled={index === selectedJobs.length - 1}
          style={{ border: "1px solid #d9d9d9", background: "#fff", borderRadius: 4, cursor: index === selectedJobs.length - 1 ? "not-allowed" : "pointer", lineHeight: 1, padding: "0 4px" }}>↓</button>
      </div>
    ),
  };

  const selectedJobColumns = groupType === "CHAINED"
    ? [orderColumn, ...SELECTED_JOBS_COLUMNS.filter((c) => c.title !== "NO")]
    : SELECTED_JOBS_COLUMNS;

  return (
    <>
      <BreadCrumb routes={breadcrumbRoutes} />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <NxCardContainer header={isEditMode ? "UPDATE JOB GROUP" : "JOB GROUP CONFIGURATION"}>

          <NxBaseContainer border header="INFORMATION">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">

              <Form.Item
                label="Group Name"
                name="name"
                {...formItemProps}
                rules={[
                  { required: true, message: "Please input group name" },
                  { max: 100,       message: "Maximum 100 characters" },
                ]}
              >
                <Input
                  placeholder="e.g. Billing Jobs"
                  maxLength={100}
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                label="Group Code"
                name="code"
                {...formItemProps}
                rules={[
                  { required: true, message: "Please input group code" },
                  { max: 100,       message: "Maximum 100 characters" },
                  { pattern: /^[A-Z0-9_-]+$/, message: "Uppercase letters, numbers, dash or underscore only" },
                ]}
                normalize={(v) => v?.toUpperCase()}
              >
                <Input
                  placeholder="e.g. JG-BILLING"
                  maxLength={100}
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                label="Group Access"
                name="accessGroupId"
                {...formItemProps}
              >
                <Select
                  placeholder="Select access group"
                  style={fieldStyle}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  loading={groupAccessLoading}
                >
                  {groupAccessList.map(g => (
                    <Option key={g.gaId} value={g.gaId}>{g.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Group Type"
                name="groupType"
                {...formItemProps}
                initialValue="UNRELATED"
              >
                <Select
                  style={fieldStyle}
                  onChange={(v) => setGroupType(v)}
                  options={[
                    { value: "UNRELATED", label: "Unrelated (parallel)" },
                    { value: "CHAINED",   label: "Chained (in order)" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                className="md:col-span-3 w-full"
                {...formItemProps}
                rules={[
                  { max: 500, message: "Maximum 500 characters" },
                ]}
              >
                <TextArea
                  placeholder="Enter job group description"
                  rows={4}
                  maxLength={500}
                  showCount
                />
              </Form.Item>

            </div>
          </NxBaseContainer>

          <NxBaseContainer
            border
            header="SELECTED JOB"
            className="mt-4"
            headerActions={
              <ButtonComponent type="primary" htmlType="button" onClick={handleOpenModal} icon={<PlusOutlined />}>
                Choose
              </ButtonComponent>
            }
            minHeight="250px"
          >
            <NxTableInlineEdit
              idTable="selected-jobs-table"
              dataSource={selectedJobs}
              onDataChange={setSelectedJobs}
              columns={selectedJobColumns}
              emptyText='No jobs selected. Add jobs to this group.'
              editMode="deleteOnly"
              autoEditOnAppend={false}
            />
          </NxBaseContainer>
        </NxCardContainer>

        {/* Job Selection Modal */}
        <NxModal
          isOpen={modalVisible}
          className="[&_.ant-modal-footer]:flex [&_.ant-modal-footer]:justify-between [&_.ant-modal-footer]:items-center"
          title="Select Jobs"
          handleCancel={handleCloseModal}
          width={1100}
          footer={
            <>
              <Button
                onClick={handleCloseModal}
                style={{ minWidth:88, height:38, borderRadius:7, border:"1px solid #d9d9d9", background:"#fff", color:"#555", fontWeight:500, fontSize:13 }}
              >
                Cancel
              </Button>
              <div />
            </>
          }
        >
          {ready && <div className="p-4">
            <NxTable
              idTable="job-selection-table"
              dataSource={jobs.data}
              columns={JOB_SELECTION_COLUMNS(handleAddJobToTable)}
              loading={jobs.loading}
              useInfiniteScroll={true}
              useSearch={true}
              useAdvanceSearch={true}
              useColumnSettings={true}
              autoHeight={false}
              tableScrolled={{ y: 400, x: "max-content" }}
              rowKey="id"
              onLoadMore={jobs.loadMore}
              hasMore={jobs.hasMore}
            />
          </div>}
        </NxModal>

        <footer className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-lg border border-solid border-[#C8CDD4]">
          <ButtonComponent onClick={handleCancel}>Cancel</ButtonComponent>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <ButtonComponent
                border={false}
                onClick={handleClear}
                className="!bg-[#d32f2f] !text-white !border-transparent"
              >
                Clear
              </ButtonComponent>
            )}
            <ButtonComponent
              border={false}
              htmlType="submit"
              className="!bg-[#388e3c] !text-white !border-transparent"
              loading={isSubmitting}
            >
              {isEditMode ? "Save Changes" : "Submit"}
            </ButtonComponent>
          </div>
        </footer>

      </Form>
    </>
  );
};

export default CreateJobGroupPage;