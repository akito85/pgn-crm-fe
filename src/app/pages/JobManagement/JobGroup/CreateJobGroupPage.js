import React, { useEffect, useState, useCallback, useRef } from "react";
import { Form, Input, Select, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import NxTableInlineEdit from "../../../../components/Nx/NxTableInlineEdit";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import ButtonComponent from "../../../../components/ButtonComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import {
  useGetJobGroupByIdQuery,
  useCreateJobGroupMutation,
  useUpdateJobGroupMutation,
} from "../../../../redux/slices/job_management/jobGroupApiSlice";
import { getAllGroupAccessPaginate } from "../../../../redux/slices/system_setup/group_access";
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

  // State for job selection modal
  const [modalVisible, setModalVisible] = useState(false);

  // State for infinite scrolling
  const [currentPage, setCurrentPage] = useState(0);
  const [allJobs, setAllJobs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  // Tracks whether the next allJobsData result should replace (reset) vs append
  const isResetRef = React.useRef(false);

  // Fetch all jobs for the modal
  const { data: allJobsData, isLoading: allJobsLoading } = useSearchJobsQuery({
    page: currentPage,
    size: 20,
  });

  // Accumulate pages; replace the list when a modal-open reset was requested
  useEffect(() => {
    if (!allJobsData) return;
    if (isResetRef.current) {
      isResetRef.current = false;
      setAllJobs(allJobsData.result);
    } else {
      setAllJobs(prev => [...prev, ...allJobsData.result]);
    }
    setHasMore(allJobsData.currentPage < allJobsData.totalPages - 1);
  }, [allJobsData]);

  // Returns a Promise so NxTable's IntersectionObserver can await completion
  const loadMoreData = useCallback(() => {
    return new Promise((resolve) => {
      if (!hasMore || allJobsLoading) { resolve(); return; }
      setCurrentPage(prev => prev + 1);
      // Resolve after a tick — actual data arrival is handled by the effect above
      setTimeout(resolve, 0);
    });
  }, [hasMore, allJobsLoading]);

  // Function to open the job selection modal
  const handleOpenModal = () => {
    isResetRef.current = true; // next data arrival replaces the list
    setCurrentPage(0);
    setHasMore(true);
    setModalVisible(true);
  };

  // Function to add a single job to the table
  const handleAddJobToTable = (job) => {
    const newJob = {
      key: Date.now() + Math.random(),
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
    const newJobs = jobsToAdd.map(job => ({
      key: Date.now() + Math.random(), // Unique key
      name: job.name,
      code: job.code,
      type: job.type,
      execType: job.executeType || job.execType,
      handlerClass: job.handler || job.handlerClass
    }));

    setSelectedJobs(prev => [...prev, ...newJobs]);
    setModalVisible(false);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
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

  // Populate form in edit mode
  useEffect(() => {
    if (!isEditMode || !currentGroup) return;
    form.setFieldsValue({
      name:        currentGroup.name,
      code:        currentGroup.code,
      description: currentGroup.description,
      accessGroupId: currentGroup.accessGroupId,
    });
  }, [currentGroup, isEditMode, form]);

  // Fetch group access data
  useEffect(() => {
    dispatch(getAllGroupAccessPaginate({ search: '', page: 0, pageSize: 200 }));
  }, [dispatch]);

  const onFinish = async (values) => {
    const payload = {
      name:        values.name,
      code:        values.code.toUpperCase(),
      description: values.description,
      accessGroupId: values.accessGroupId,
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
  };

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
              columns={SELECTED_JOBS_COLUMNS}
              emptyText='No jobs selected. Add jobs to this group.'
              editMode="deleteOnly"
              autoEditOnAppend={false}
            />
          </NxBaseContainer>
        </NxCardContainer>

        {/* Job Selection Modal */}
        <NxModal
          isOpen={modalVisible}
          className="p-4"
          title="Select Jobs"
          handleCancel={handleCloseModal}
          width={1100}
          footer={[
            <button
              key="cancel"
              style={{
                border: "1px solid #C8CDD4",
                background: "#fff",
                cursor: "pointer",
                padding: "2px 10px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "500",
                color: "#374151",
                height: "28px",
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "inherit",
              }}
              onClick={handleCloseModal}
            >
              Cancel
            </button>,
          ]}
        >
          <div className="p-4">
            <NxTable
              idTable="job-selection-table"
              dataSource={allJobs}
              columns={JOB_SELECTION_COLUMNS(handleAddJobToTable)}
              loading={allJobsLoading}
              useInfiniteScroll={true}
              useSearch={true}
              useAdvanceSearch={true}
              useColumnSettings={true}
              tableScrolled={{ y: 400, x: "max-content" }}
              rowKey="id"
              onLoadMore={loadMoreData}
              hasMore={hasMore}
            />
          </div>
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