import React, { useState, useEffect } from "react";
import { Form, Input, Select, InputNumber, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import ButtonComponent from "../../../../components/ButtonComponent";
import { PlusOutlined } from "@ant-design/icons";
import NxTableInlineEdit from "../../../../components/Nx/NxTableInlineEdit";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { createJob } from "../../../../redux/slices/job_management/jobSlice";
import { fetchSchemas, fetchProcedures, fetchProcedureParameters, clearProcedures, clearParameters } from "../../../../redux/slices/job_management/oracleMetadataSlice";

const { TextArea } = Input;
const { Option } = Select;

const BREADCRUMB_ROUTES = [
  { path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT, breadcrumbName: "Job Scheduler Management" },
  { path: JOB_MGMT_ROUTES.VIEW_JOB,                      breadcrumbName: "Job List" },
  { path: "",                                             breadcrumbName: "Create" },
];

const INITIAL_PARAMETERS = [
  { key: 1, name: 'Customer ID',  code: 'CUST_ID',  type: 'String', length: 50, description: 'Unique customer identifier' },
  { key: 2, name: 'Invoice Date', code: 'INV_DATE', type: 'Date',   length: 10, description: 'Date of invoice generation' },
  { key: 3, name: 'Amount',       code: 'AMOUNT',   type: 'Number', length: 15, description: 'Invoice amount in IDR' },
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

  const executeType = Form.useWatch("executeType", form);
  const { schemas, schemasLoading, procedures, proceduresLoading, parameters: spParametersMap, parametersLoading } =
    useSelector((state) => state.oracleMetadata);
  const [selectedSchema,    setSelectedSchema]    = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  useEffect(() => {
    if (executeType === "stored_procedure" && schemas.length === 0) {
      dispatch(fetchSchemas());
    }
    if (executeType !== "stored_procedure") {
      setSelectedSchema(null);
      setSelectedProcedure(null);
      dispatch(clearProcedures());
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
      const isStoredProcedure = values.executeType === "stored_procedure";
      await dispatch(createJob({
        ...values,
        handler: isStoredProcedure ? "StoredProcedureJobHandler" : values.handler,
        timeout:  values.timeout  || 0,
        maxRetry: values.maxRetry || 0,
        parameters: parameters.filter(p => p.name || p.code),
        notificationSettings,
        ...(isStoredProcedure && selectedSchema && selectedProcedure && {
          defaultInput: JSON.stringify({
            schema: values.spSchema,
            procedureName: values.spProcedure,
          }),
        }),
      })).unwrap();
      message.success('Job created successfully!');
      navigate(JOB_MGMT_ROUTES.VIEW_JOB);
    } catch (error) {
      console.error('Failed to create job:', error);
      message.error(error?.message || 'Failed to create job');
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

  return (
    <LayoutMenu>
      <BreadCrumb routes={BREADCRUMB_ROUTES} />
      <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">

        <NxCardContainer header="JOB CONFIGURATION">
          <NxBaseContainer border header="Job Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">

              <Form.Item label="Name" name="name" {...formItemProps} rules={[
                { required: true, message: "Please input name" },
                { max: 100,       message: "Maximum 100 characters" },
              ]}>
                <Input placeholder="e.g. Generate Invoice" maxLength={100} style={inputStyle} />
              </Form.Item>

              <Form.Item label="Code" name="code" {...formItemProps} rules={[
                { required: true,                   message: "Please input code" },
                { max: 50,                          message: "Maximum 50 characters" },
                { pattern: /^[A-Z0-9_-]+$/,        message: "Use uppercase letters, numbers, dash or underscore only" },
              ]}>
                <Input placeholder="e.g. GEN_INV" maxLength={50} style={inputStyle} />
              </Form.Item>

              <Form.Item label="Type" name="type" {...formItemProps} rules={[
                { required: true, message: "Please select type" },
              ]}>
                <Select placeholder="Select type" style={fieldStyle}>
                  <Option value="batch">Batch</Option>
                  <Option value="realtime">Real-time</Option>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="triggered">Triggered</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Execute Type" name="executeType" {...formItemProps} rules={[
                { required: true, message: "Please select execute type" },
              ]}>
                <Select placeholder="Select execute type" style={fieldStyle}>
                  <Option value="generate_file">Generate File</Option>
                  <Option value="process_data">Process Data</Option>
                  <Option value="send_notification">Send Notification</Option>
                  <Option value="update_database">Update Database</Option>
                  <Option value="stored_procedure">Stored Procedure</Option>
                </Select>
              </Form.Item>

              {executeType !== "stored_procedure" && (
                <Form.Item label="Handler" name="handler" {...formItemProps} rules={[
                  { required: true, message: "Please input handler" },
                  { max: 100,       message: "Maximum 100 characters" },
                ]}>
                  <Input placeholder="e.g. com.nxs.jobhandler.genfile" maxLength={100} style={inputStyle} />
                </Form.Item>
              )}
              {executeType === "stored_procedure" && <div />}

              <Form.Item label="Timeout" name="timeout" {...formItemProps}>
                <InputNumber placeholder="Enter timeout in seconds" min={0} precision={0} style={fieldStyle} />
              </Form.Item>

              <Form.Item label="Max Retry" name="maxRetry" {...formItemProps}>
                <InputNumber placeholder="Enter max retry attempts" min={0} max={100} precision={0} style={fieldStyle} />
              </Form.Item>

              <Form.Item label="Module" name="module" {...formItemProps} rules={[
                { required: true, message: "Please select module" },
              ]}>
                <Select placeholder="Select module" style={fieldStyle}>
                  <Option value="payment">Payment</Option>
                  <Option value="billing">Billing</Option>
                  <Option value="collection">Collection</Option>
                  <Option value="reporting">Reporting</Option>
                  <Option value="notification">Notification</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Access Group" name="accessGroup" {...formItemProps} rules={[
                { required: true, message: "Please select access group" },
              ]}>
                <Select placeholder="Select access group" style={fieldStyle}>
                  <Option value="admin_sor_1">Admin SOR 1</Option>
                  <Option value="admin_sor_2">Admin SOR 2</Option>
                  <Option value="operator">Operator</Option>
                  <Option value="viewer">Viewer</Option>
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

          {executeType === "stored_procedure" && (
            <NxBaseContainer border header="STORED PROCEDURE" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">

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

              </div>
            </NxBaseContainer>
          )}

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
              emptyText='No parameters. Click "Add" to create one.'
            />
          </NxBaseContainer>
        </NxCardContainer>

        <NxCardContainer border header="NOTIFICATIONS" className="mt-4">
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-3 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
              <h3 className="text-primary text-sm font-normal uppercase">In-App Notifications</h3>
              <NotificationRow label="Show in Notification Drawer" checked={notificationSettings.showInDrawer} onChange={updateNotification('showInDrawer')} />
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
            >
              Submit
            </ButtonComponent>
          </div>
        </footer>

      </Form>
    </LayoutMenu>
  );
};

export default CreateJobPage;
