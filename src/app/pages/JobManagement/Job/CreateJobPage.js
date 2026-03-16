import React, { useState, useEffect } from "react";
import { Form, Input, Select, InputNumber, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import ButtonComponent from "../../../../components/ButtonComponent";
import { PlusOutlined } from "@ant-design/icons";
import NxTableInlineEdit from "../../../../components/Nx/NxTableInlineEdit";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { fetchSchemas, fetchProcedures, fetchProcedureParameters, clearProcedures, clearParameters } from "../../../../redux/slices/job_management/oracleMetadataSlice";
import { fetchTaskQueues } from "../../../../redux/slices/job_management/taskQueueSlice";
import { getAllGroupAccessPaginate } from "../../../../redux/slices/system_setup/group_access";
import { useGetJobByIdQuery, useCreateJobMutation, useUpdateJobMutation } from "../../../../redux/slices/job_management/jobApiSlice";

const { TextArea } = Input;
const { Option } = Select;


const INITIAL_PARAMETERS = [];

/** Sample payload for quick CRUD API testing. Values must match the Select options in this form. */
const SAMPLE_JOB = {
  name:        "Daily Revenue Report",
  code:        "DAILY_REV_RPT",
  type:        "SCHEDULE",
  description: "Generates a daily revenue summary report for all active billing accounts. Used for CRUD API testing.",
  executeType: "SCRIPT",
  handler:     "com.nxs.jobrunr.handler.DailyRevenueReportHandler",
  taskQueueId: null,
  timeout:     3600,
  maxRetry:    3,
  retryPolicy: { backoffMultiplier: 2 },
  module:      "reporting",
  accessGroupId: null,
};

const MODULE_OPTIONS = [
  { value: 'payment',      label: 'Payment' },
  { value: 'billing',      label: 'Billing' },
  { value: 'collection',   label: 'Collection' },
  { value: 'reporting',    label: 'Reporting' },
  { value: 'notification', label: 'Notification' },
  { value: 'account',      label: 'Account' },
];

const INITIAL_NOTIFICATIONS = {
  showInDrawer: false,
  showAlert: false,
  sendViaEmail: false,
  sendViaSMS: false,
  sendViaWhatsApp: false,
};

const PARAMETER_COLUMNS = [
  { title: 'Name',        dataIndex: 'name',        editable: true, inputType: 'text',   placeholder: 'Parameter name', width: 180 },
  { title: 'Code',        dataIndex: 'code',        editable: true, inputType: 'text',   placeholder: 'Parameter code', width: 150 },
  {
    title: 'Type', dataIndex: 'type', editable: true, inputType: 'select', width: 140,
    selectOptions: [
      { value: 'String',  label: 'String' },
      { value: 'Number',  label: 'Number' },
      { value: 'Date',    label: 'Date' },
      { value: 'Boolean', label: 'Boolean' },
    ],
  },
  { title: 'Length',      dataIndex: 'length',      editable: true, inputType: 'number', placeholder: 'Length',      width: 110, min: 0 },
  { title: 'Description', dataIndex: 'description', editable: true, inputType: 'text',   placeholder: 'Description' },
];

const SP_PARAM_COLUMNS = [
  { title: 'Parameter', dataIndex: 'name',       editable: false, width: 200 },
  { title: 'Data Type', dataIndex: 'dataType',   editable: false, width: 140 },
  { title: 'Direction', dataIndex: 'direction',  editable: false, width: 100,
    render: (v) => v?.oracleValue ?? v },
  { title: 'Position',  dataIndex: 'position',   editable: false, width: 90  },
  { title: 'Default',   dataIndex: 'hasDefault', editable: false, width: 90,
    render: (v) => v ? 'Yes' : '—' },
];

const EraserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.25 12.25H4.66662C4.51279 12.2504 4.36042 12.2203 4.21826 12.1616C4.0761 12.1028 3.94697 12.0165 3.83829 11.9076L1.50845 9.57488C1.28974 9.35609 1.16687 9.0594 1.16687 8.75004C1.16687 8.44068 1.28974 8.14399 1.50845 7.92521L7.34179 2.09188C7.45013 1.98349 7.57876 1.89751 7.72034 1.83885C7.86192 1.78019 8.01366 1.75 8.16691 1.75C8.32016 1.75 8.47191 1.78019 8.61349 1.83885C8.75506 1.89751 8.8837 1.98349 8.99204 2.09188L12.4915 5.59188C12.7102 5.81066 12.833 6.10735 12.833 6.41671C12.833 6.72607 12.7102 7.02276 12.4915 7.24154L7.48645 12.25M2.96445 6.46921L8.11412 11.6189"
      stroke="white" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const NotificationRow = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-2 border-0 border-b border-dashed border-[#c8cdd4]">
    <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">{label}</span>
    <NxSwitch size="md" checked={checked} onChange={onChange} />
  </div>
);

const formItemProps = { style: { marginBottom: '20px' } };
const inputStyle   = { height: '34px', padding: '4px 8px' };
const fieldStyle   = { width: '100%', height: '34px' };

const CreateJobPage = () => {
  const [form] = Form.useForm();
  const [parameters, setParameters] = useState(INITIAL_PARAMETERS);
  const [notificationSettings, setNotificationSettings] = useState(INITIAL_NOTIFICATIONS);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state?.id;
  const isEditMode = Boolean(id);

  // RTK Query hooks
  const { data: currentJob } = useGetJobByIdQuery(id, { skip: !id });
  const [createJobMutation, { isLoading: createLoading }] = useCreateJobMutation();
  const [updateJobMutation, { isLoading: updateLoading }] = useUpdateJobMutation();
  const isSubmitting = createLoading || updateLoading;

  const breadcrumbRoutes = [
    { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
    { path: JOB_MGMT_ROUTES.VIEW_JOB,                      breadcrumbName: "Job List" },
    { path: "",                                             breadcrumbName: isEditMode ? "Update" : "Create" },
  ];

  const executeType = Form.useWatch("executeType", form);
  const { schemas, schemasLoading, procedures, proceduresLoading, parameters: spParametersMap, parametersLoading } =
    useSelector((state) => state.oracleMetadata);
  const { queues: taskQueues, loading: taskQueuesLoading } =
    useSelector((state) => state.taskQueue);
  const { data: groupAccessData, loading: groupAccessLoading } = useSelector((state) => state.groupAccess);
  const groupList = groupAccessData?.result ?? [];
  const [selectedSchema,    setSelectedSchema]    = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  useEffect(() => {
    dispatch(fetchTaskQueues());
    dispatch(getAllGroupAccessPaginate({ search: '', page: 0, pageSize: 200 }));
  }, [dispatch]);

  // Populate form when editing an existing job
  useEffect(() => {
    if (!isEditMode || !currentJob) return;

    form.setFieldsValue({
      name:        currentJob.name,
      code:        currentJob.code,
      type:        currentJob.type,
      description: currentJob.description,
      executeType: currentJob.executeType,
      handler:     currentJob.handler,
      taskQueueId: currentJob.taskQueueId,
      timeout:     currentJob.timeout,
      maxRetry:    currentJob.maxRetry,
      retryPolicy: { backoffMultiplier: currentJob.retryPolicy?.backoffMultiplier },
      module:      currentJob.module,
      spSchema:    currentJob.spSchema,
      spProcedure: currentJob.spProcedure,
      accessGroupId: currentJob.accessGroupId,
    });

    // Restore SP chain dropdowns
    if (currentJob.spSchema) {
      setSelectedSchema(currentJob.spSchema);
      dispatch(fetchProcedures(currentJob.spSchema));
    }
    if (currentJob.spSchema && currentJob.spProcedure) {
      setSelectedProcedure(currentJob.spProcedure);
      dispatch(fetchProcedureParameters({ schema: currentJob.spSchema, procedure: currentJob.spProcedure }));
    }

    // Restore parameters (extracted from inputSchema JSON)
    if (currentJob.parameters?.length) {
      setParameters(currentJob.parameters.map((p, i) => ({ ...p, key: p.key ?? i + 1 })));
    }

    // Restore notification toggles
    if (currentJob.notificationSettings) {
      setNotificationSettings(currentJob.notificationSettings);
    }
  }, [currentJob, isEditMode, dispatch]);

  useEffect(() => {
    if (executeType === "STORED_PROCEDURE") {
      if (schemas.length === 0) dispatch(fetchSchemas());
      form.setFieldValue('handler', 'StoredProcedureJobHandler');
    } else {
      setSelectedSchema(null);
      setSelectedProcedure(null);
      dispatch(clearProcedures());
      form.setFieldValue('handler', undefined);
    }
  }, [executeType, dispatch]);

  const handleSchemaChange = (schema) => {
    setSelectedSchema(schema);
    setSelectedProcedure(null);
    form.setFieldValue('spProcedure', null);
    dispatch(clearParameters());
    dispatch(fetchProcedures(schema));
  };

  const handleProcedureChange = (procedure) => {
    setSelectedProcedure(procedure);
    dispatch(fetchProcedureParameters({ schema: selectedSchema, procedure }));
  };

  const spParams = selectedSchema && selectedProcedure
    ? (spParametersMap[`${selectedSchema}/${selectedProcedure}`] ?? [])
    : [];

  const updateNotification = (key) => (checked) =>
    setNotificationSettings(prev => ({ ...prev, [key]: checked }));

  const handleAddParameter = () => {
    const newKey = parameters.length > 0 ? Math.max(...parameters.map(p => p.key)) + 1 : 1;
    setParameters(prev => [...prev, { key: newKey, name: '', code: '', type: '', length: null, description: '' }]);
  };

  const onFinish = async (values) => {
    try {
      // Combine form values with parameters and notification settings
      const payload = {
        ...values,
        timeout:  values.timeout  || 0,
        maxRetry: values.maxRetry || 0,
        parameters: parameters.filter(p => p.name || p.code),
        notificationSettings,
      };

      if (isEditMode) {
        await updateJobMutation({ jobId: id, data: payload }).unwrap();
        message.success('Job updated successfully!');
      } else {
        await createJobMutation(payload).unwrap();
        message.success('Job created successfully!');
      }
      navigate(JOB_MGMT_ROUTES.VIEW_JOB);
    } catch (error) {
      console.error('Failed to save job:', error);
      message.error(error?.message || 'Failed to save job');
    }
  };

  const onFinishFailed = () => message.error('Please check all required fields');

  const handleBack      = () => navigate(JOB_MGMT_ROUTES.VIEW_JOB);

  const handleClearData = () => {
    form.resetFields();
    setParameters([]);
    setNotificationSettings(INITIAL_NOTIFICATIONS);
    setSelectedSchema(null);
    setSelectedProcedure(null);
    dispatch(clearProcedures());
    dispatch(clearParameters());
  };

  const handleLoadSample = () => {
    form.setFieldsValue(SAMPLE_JOB);
    setParameters([
      { key: 1, name: 'Start Date', code: 'START_DATE', type: 'Date',   length: 10, description: 'Report start date (YYYY-MM-DD)' },
      { key: 2, name: 'End Date',   code: 'END_DATE',   type: 'Date',   length: 10, description: 'Report end date (YYYY-MM-DD)' },
      { key: 3, name: 'Region',     code: 'REGION',     type: 'String', length: 50, description: 'Target region code' },
    ]);
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={breadcrumbRoutes} />
      <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">

        <NxCardContainer
          header={isEditMode ? "UPDATE JOB" : "JOB CONFIGURATION"}
          actionElement={!isEditMode && (
            <ButtonComponent
              border={false}
              className="!bg-[#0288d1] !text-white !border-transparent text-xs"
              onClick={handleLoadSample}
            >
              Load Sample
            </ButtonComponent>
          )}
        >

          {/* METADATA */}
          <NxBaseContainer border header="METADATA">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <Form.Item label="Name" name="name" {...formItemProps} rules={[
                { required: true, message: "Please input name" },
                { max: 100,       message: "Maximum 100 characters" },
              ]}>
                <Input placeholder="e.g. Generate Invoice" maxLength={100} style={inputStyle} />
              </Form.Item>

              <Form.Item label="Code" name="code" {...formItemProps} rules={[
                { required: true,                message: "Please input code" },
                { max: 50,                       message: "Maximum 50 characters" },
                { pattern: /^[A-Z0-9_-]+$/,     message: "Use uppercase letters, numbers, dash or underscore only" },
              ]}>
                <Input placeholder="e.g. GEN_INV" maxLength={50} style={inputStyle} />
              </Form.Item>

              <Form.Item label="Type" name="type" {...formItemProps} rules={[
                { required: true, message: "Please select type" },
              ]}>
                <Select placeholder="Select type" style={fieldStyle}>
                  <Option value="BATCH">Batch</Option>
                  <Option value="SCHEDULE">Scheduled</Option>
                  <Option value="QUEUE">Queue</Option>
                  <Option value="WORKFLOW">Workflow</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Description" name="description" className="md:col-span-3 w-full" {...formItemProps} rules={[
                { required: true, message: "Please input description" },
                { max: 255,       message: "Maximum 255 characters" },
              ]}>
                <TextArea placeholder="Enter job description" rows={4} maxLength={255} showCount />
              </Form.Item>
            </div>
          </NxBaseContainer>

          {/* EXECUTION */}
          <NxBaseContainer border header="EXECUTION" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <Form.Item label="Execute Type" name="executeType" {...formItemProps} rules={[
                { required: true, message: "Please select execute type" },
              ]}>
                <Select placeholder="Select execute type" style={fieldStyle}>
                  <Option value="STORED_PROCEDURE">Stored Procedure</Option>
                  <Option value="SCRIPT">Script</Option>
                  <Option value="CUSTOM_HANDLER">Custom Handler</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Handler" name="handler" {...formItemProps} rules={[
                { required: executeType !== "STORED_PROCEDURE", message: "Please input handler" },
                { max: 100, message: "Maximum 100 characters" },
              ]}>
                <Input
                  placeholder="e.g. com.nxs.jobhandler.genfile"
                  maxLength={100}
                  style={inputStyle}
                  disabled={executeType === "STORED_PROCEDURE"}
                />
              </Form.Item>

              <Form.Item
                label="Task Queue"
                name="taskQueueId"
                tooltip="Assigns this job to a specific worker queue. Workers in that queue will exclusively pick up and process this job. Leave blank to use the default queue."
                {...formItemProps}
              >
                <Select
                  placeholder="Default queue (leave blank)"
                  style={fieldStyle}
                  loading={taskQueuesLoading}
                  allowClear
                >
                  {taskQueues.map((q) => (
                    <Option key={q.queueId} value={q.queueId}>
                      {q.queueName}
                      {q.priority != null && (
                        <span className="ml-2 text-xs text-gray-400">(priority {q.priority})</span>
                      )}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {executeType === "STORED_PROCEDURE" && (<>
                <Form.Item label="Schema" name="spSchema" {...formItemProps} rules={[
                  { required: true, message: "Please select a schema" },
                ]}>
                  <Select
                    placeholder="Select schema"
                    style={fieldStyle}
                    loading={schemasLoading}
                    onChange={handleSchemaChange}
                  >
                    {schemas.map((s) => (
                      <Option key={s} value={s}>{s}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Procedure / Function" name="spProcedure" {...formItemProps} rules={[
                  { required: true, message: "Please select a procedure" },
                ]}>
                  <Select
                    placeholder={selectedSchema ? "Select procedure" : "Select schema first"}
                    style={fieldStyle}
                    loading={proceduresLoading}
                    disabled={!selectedSchema}
                    onChange={handleProcedureChange}
                  >
                    {(procedures[selectedSchema] ?? []).map((p) => (
                      <Option key={p.name} value={p.name}>
                        {p.name}
                        <span className="ml-2 text-xs text-gray-400">({p.objectType})</span>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <div />

                {selectedProcedure && (
                  <div className="md:col-span-3">
                    <NxTableInlineEdit
                      idTable="sp-parameters-info-table"
                      dataSource={spParams.map((p, i) => ({ key: i, ...p }))}
                      onDataChange={() => {}}
                      columns={SP_PARAM_COLUMNS}
                      emptyText={parametersLoading ? "Loading parameters…" : "No parameters found for this procedure."}
                    />
                  </div>
                )}
              </>)}
            </div>
          </NxBaseContainer>

          {/* CONFIGURATION */}
          <NxBaseContainer border header="CONFIGURATION" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <Form.Item
                label="Timeout (seconds)"
                name="timeout"
                tooltip="Maximum time a job execution is allowed to run before it is automatically cancelled. Set to 0 for no limit."
                {...formItemProps}
              >
                <InputNumber placeholder="e.g. 3600 (1 hour), 0 = no limit" min={0} precision={0} style={fieldStyle} />
              </Form.Item>

              <Form.Item
                label="Max Retry"
                name="maxRetry"
                tooltip="Number of times the job will automatically retry after a failure. Once all retries are exhausted the job is marked as failed."
                {...formItemProps}
              >
                <InputNumber placeholder="e.g. 3 (default: 0 = no retry)" min={0} max={100} precision={0} style={fieldStyle} />
              </Form.Item>

              <Form.Item
                label="Backoff Multiplier"
                name={['retryPolicy', 'backoffMultiplier']}
                initialValue={2}
                tooltip="Controls how much longer the job waits between each retry attempt. A value of 2 means each retry doubles the wait time (e.g. 1s → 2s → 4s → 8s). Set to 1 for immediate retries with no delay increase."
                {...formItemProps}
              >
                <Select style={fieldStyle}>
                  <Option value={1}>1× — No delay increase (retry immediately)</Option>
                  <Option value={2}>2× — Double wait each retry (default)</Option>
                  <Option value={3}>3× — Triple wait each retry</Option>
                  <Option value={5}>5× — Aggressive backoff</Option>
                </Select>
              </Form.Item>
            </div>
          </NxBaseContainer>

          {/* ACCESS */}
          <NxBaseContainer border header="ACCESS" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <Form.Item label="Module" name="module" {...formItemProps} rules={[
                { required: true, message: "Please select module" },
              ]}>
                <Select placeholder="Select module" style={fieldStyle} allowClear>
                  {MODULE_OPTIONS.map(m => (
                    <Option key={m.value} value={m.value}>{m.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Access Group" name="accessGroupId" {...formItemProps}>
                <Select
                  placeholder="Select access group"
                  style={fieldStyle}
                  allowClear
                  loading={groupAccessLoading}
                  showSearch
                  optionFilterProp="children"
                >
                  {groupList.map(g => (
                    <Option key={g.gaId} value={g.gaId}>{g.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </NxBaseContainer>

          {/* PARAMETERS */}
          <NxBaseContainer
            border
            header="PARAMETERS"
            className="mt-4"
            headerActions={
              <ButtonComponent type="primary" htmlType="button" onClick={handleAddParameter} icon={<PlusOutlined />}>
                Create
              </ButtonComponent>
            }
          >
            <NxTableInlineEdit
              idTable="job-parameters-table"
              dataSource={parameters}
              onDataChange={setParameters}
              columns={PARAMETER_COLUMNS}
              emptyText='No parameters defined. Click Create to add one.'
            />
          </NxBaseContainer>

        </NxCardContainer>

        <NxCardContainer border header="NOTIFICATIONS" className="mt-4">
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-3 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
              <h3 className="text-primary text-sm font-normal uppercase">In-App Notifications</h3>
              <NotificationRow label="In App Message" checked={notificationSettings.showInDrawer} onChange={updateNotification('showInDrawer')} />
              <NotificationRow label="Show as Alert"               checked={notificationSettings.showAlert}    onChange={updateNotification('showAlert')} />
            </section>

            <section className="flex flex-col gap-3 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
              <h3 className="text-primary text-sm font-normal uppercase">External Notifications</h3>
              <NotificationRow label="Send via Email"    checked={notificationSettings.sendViaEmail}    onChange={updateNotification('sendViaEmail')} />
              <NotificationRow label="Send via SMS"      checked={notificationSettings.sendViaSMS}      onChange={updateNotification('sendViaSMS')} />
              <NotificationRow label="Send via WhatsApp" checked={notificationSettings.sendViaWhatsApp} onChange={updateNotification('sendViaWhatsApp')} />
            </section>
          </div>
        </NxCardContainer>

        <footer className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-lg border border-solid border-[#C8CDD4]">
          <ButtonComponent onClick={handleBack}>Cancel</ButtonComponent>
          <div className="flex items-center gap-2">
            <ButtonComponent
              border={false}
              onClick={handleClearData}
              className="!bg-[#d32f2f] !text-white !border-transparent"
              icon={<EraserIcon />}
            >
              Clear Data
            </ButtonComponent>
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
    </LayoutMenu>
  );
};

export default CreateJobPage;
