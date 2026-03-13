import React, { useState } from "react";
import { Form, Input, Select, InputNumber, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import NxTableInlineEdit from "../../../../components/Nx/NxTableInlineEdit";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { createJob } from "../../../../redux/slices/job_management/jobSlice";

const { TextArea } = Input;
const { Option } = Select;

const CreateJobPage = () => {
  const [form] = Form.useForm();
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState({
    showInDrawer: false,
    showAlert: false,
    sendViaEmail: false,
    sendViaSMS: false,
    sendViaWhatsApp: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const routes = [
    {
      path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT,
      breadcrumbName: "Job Scheduler Management",
    },
    {
      path: JOB_MGMT_ROUTES.VIEW_JOB,
      breadcrumbName: "Job List",
    },
    {
      path: "",
      breadcrumbName: "Create",
    },
  ];

  const [parameters, setParameters] = useState([
    { key: 1, name: 'Customer ID', code: 'CUST_ID', type: 'String', length: 50, description: 'Unique customer identifier' },
    { key: 2, name: 'Invoice Date', code: 'INV_DATE', type: 'Date', length: 10, description: 'Date of invoice generation' },
    { key: 3, name: 'Amount', code: 'AMOUNT', type: 'Number', length: 15, description: 'Invoice amount in IDR' },
  ]);

  const handleAddParameter = () => {
    const newKey = parameters.length > 0 ? Math.max(...parameters.map(p => p.key)) + 1 : 1;
    setParameters(prev => [...prev, { key: newKey, name: '', code: '', type: '', length: null, description: '' }]);
  };

  const parameterColumns = [
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
    { title: 'Length',      dataIndex: 'length',      editable: true, inputType: 'number', placeholder: 'Length',         width: 110, min: 0 },
    { title: 'Description', dataIndex: 'description', editable: true, inputType: 'text',   placeholder: 'Description' },
  ];

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescriptionLength(value.length);
  };

  const onFinish = async (values) => {
    try {
      // Transform form values to match API expectations
      const jobData = {
        name: values.name,
        code: values.code,
        description: values.description,
        executeType: values.executeType,
        handler: values.handler,
        timeout: values.timeout || 0,
        maxRetry: values.maxRetry || 0,
        type: values.type,
        module: values.module,
        accessGroup: values.accessGroup,
        parameters: parameters.filter(p => p.name || p.code),
        notificationSettings: {
          showInDrawer: notificationSettings.showInDrawer,
          showAlert: notificationSettings.showAlert,
          sendViaEmail: notificationSettings.sendViaEmail,
          sendViaSMS: notificationSettings.sendViaSMS,
          sendViaWhatsApp: notificationSettings.sendViaWhatsApp,
        },
      };

      const result = await dispatch(createJob(jobData)).unwrap();
      message.success('Job created successfully!');

      // Navigate back to job list after successful creation
      navigate(JOB_MGMT_ROUTES.VIEW_JOB);
    } catch (error) {
      console.error('Failed to create job:', error);
      message.error(error?.message || 'Failed to create job');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
    message.error('Please check all required fields');
  };

  const handleBack = () => {
    navigate(JOB_MGMT_ROUTES.VIEW_JOB);
  };

  const handleClearData = () => {
    form.resetFields();
    setDescriptionLength(0);
    setParameters([]);
    setNotificationSettings({
      showInDrawer: false,
      showAlert: false,
      sendViaEmail: false,
      sendViaSMS: false,
      sendViaWhatsApp: false,
    });
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <NxCardContainer 
          header="JOB CONFIGURATION"
        >
          <NxBaseContainer border header="Job Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 p-4">
              {/* Row 1: Name, Code, Type */}
              <Form.Item
                label="Name"
                name="name"
                style={{ marginBottom: '20px' }}
                rules={[
                  {
                    required: true,
                    message: "Please input name",
                  },
                  {
                    max: 100,
                    message: "Maximum 100 characters",
                  },
                ]}
              >
                <Input 
                  placeholder="e.g. Generate Invoice" 
                  maxLength={100} 
                  style={{ height: '34px', padding: '4px 8px' }} 
                />
              </Form.Item>

              <Form.Item
                label="Code"
                name="code"
                style={{ marginBottom: '20px' }}
                rules={[
                  {
                    required: true,
                    message: "Please input code",
                  },
                  {
                    max: 50,
                    message: "Maximum 50 characters",
                  },
                  {
                    pattern: /^[A-Z0-9_-]+$/,
                    message: "Use uppercase letters, numbers, dash or underscore only",
                  },
                ]}
              >
                <Input 
                  placeholder="e.g. GEN_INV" 
                  maxLength={50} 
                  style={{ height: '34px', padding: '4px 8px' }} 
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                style={{ marginBottom: '20px' }}
                rules={[
                  {
                    required: true,
                    message: "Please select type",
                  },
                ]}
              >
                <Select
                  placeholder="Select type"
                  style={{ width: '100%', height: '34px' }}
                >
                  <Option value="batch">Batch</Option>
                  <Option value="realtime">Real-time</Option>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="triggered">Triggered</Option>
                </Select>
              </Form.Item>

              {/* Row 2: Execute Type, Handler, Timeout */}
              <Form.Item
                label="Execute Type"
                name="executeType"
                style={{ marginBottom: '20px' }}
                rules={[
                  {
                    required: true,
                    message: "Please select execute type",
                  },
                ]}
              >
                <Select
                  placeholder="Select execute type"
                  style={{ width: '100%', height: '34px' }}
                >
                  <Option value="generate_file">Generate File</Option>
                  <Option value="process_data">Process Data</Option>
                  <Option value="send_notification">Send Notification</Option>
                  <Option value="update_database">Update Database</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Handler"
                name="handler"
                style={{ marginBottom: '20px' }}
                rules={[
                  {
                    required: true,
                    message: "Please input handler",
                  },
                  {
                    max: 100,
                    message: "Maximum 100 characters",
                  },
                ]}
              >
                <Input 
                  placeholder="e.g. com.nxs.jobhandler.genfile" 
                  maxLength={100} 
                  style={{ height: '34px', padding: '4px 8px' }} 
                />
              </Form.Item>

              <Form.Item
                label="Timeout"
                name="timeout"
                style={{ marginBottom: '20px' }}
              >
                <InputNumber
                  placeholder="Enter timeout in seconds"
                  min={0}
                  precision={0}
                  style={{ width: '100%', height: '34px' }}
                />
              </Form.Item>

              {/* Row 3: Max Retry, Module, Access Group */}
              <Form.Item
                label="Max Retry"
                name="maxRetry"
                style={{ marginBottom: '20px' }}
              >
                <InputNumber
                  placeholder="Enter max retry attempts"
                  min={0}
                  max={100}
                  precision={0}
                  style={{ width: '100%', height: '34px' }}
                />
              </Form.Item>

              <Form.Item
                label="Module"
                name="module"
                style={{ marginBottom: '20px' }}
                rules={[
                  {
                    required: true,
                    message: "Please select module",
                  },
                ]}
              >
                <Select
                  placeholder="Select module"
                  style={{ width: '100%', height: '34px' }}
                >
                  <Option value="payment">Payment</Option>
                  <Option value="billing">Billing</Option>
                  <Option value="collection">Collection</Option>
                  <Option value="reporting">Reporting</Option>
                  <Option value="notification">Notification</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Access Group"
                name="accessGroup"
                style={{ marginBottom: '20px' }}
                rules={[
                  {
                    required: true,
                    message: "Please select access group",
                  },
                ]}
              >
                <Select
                  placeholder="Select access group"
                  style={{ width: '100%', height: '34px' }}
                >
                  <Option value="admin_sor_1">Admin SOR 1</Option>
                  <Option value="admin_sor_2">Admin SOR 2</Option>
                  <Option value="operator">Operator</Option>
                  <Option value="viewer">Viewer</Option>
                </Select>
              </Form.Item>

              {/* Row 4: Description (full width) */}
              <Form.Item
                label="Description"
                name="description"
                className="md:col-span-3 w-full"
                style={{ marginBottom: '20px' }}
                rules={[
                  {
                    required: true,
                    message: "Please input description",
                  },
                  {
                    max: 255,
                    message: "Maximum 255 characters",
                  },
                ]}
              >
                <TextArea
                  placeholder="Enter job description"
                  rows={4}
                  maxLength={255}
                  onChange={handleDescriptionChange}
                  showCount
                />
              </Form.Item>
            </div>
          </NxBaseContainer>
          
          {/* Parameter inline edit table */}
          <div className="mt-4">
            <NxBaseContainer
              border
              header="PARAMETERS"
              headerActions={
                <ButtonComponent
                  type="primary"
                  htmlType="button"
                  onClick={handleAddParameter}
                  icon={<PlusOutlined />}
                >
                  Create
                </ButtonComponent>
              }
            >
              <NxTableInlineEdit
                idTable="job-parameters-table"
                dataSource={parameters}
                onDataChange={setParameters}
                columns={parameterColumns}
                emptyText='No parameters. Click "Add" to create one.'
              />
            </NxBaseContainer>
          </div>
        </NxCardContainer>

        {/* Notification Settings Container */}
        <NxBaseContainer
          border
          header="NOTIFICATIONS"
          className="mt-4"
        >
          {/* In-App Notifications Group */}
          <div className="flex flex-col gap-3 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
            <p className="text-primary text-sm font-normal uppercase">In-App Notifications</p>
            {/* Item: Show in Notification Drawer */}
            <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px dashed #c8cdd4' }}>
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Show in Notification Drawer</span>
              <NxSwitch
                size="md"
                checked={notificationSettings.showInDrawer}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, showInDrawer: checked }))}
              />
            </div>
            {/* Item: Show as Alert */}
            <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px dashed #c8cdd4' }}>
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Show as Alert</span>
              <NxSwitch
                size="md"
                checked={notificationSettings.showAlert}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, showAlert: checked }))}
              />
            </div>
          </div>

          {/* External Notifications Group */}
          <div className="flex flex-col gap-3 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-[#c8cdd4]">
            <p className="text-primary text-sm font-normal uppercase">External Notifications</p>
            {/* Item: Send via Email */}
            <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px dashed #c8cdd4' }}>
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Send via Email</span>
              <NxSwitch
                size="md"
                checked={notificationSettings.sendViaEmail}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, sendViaEmail: checked }))}
              />
            </div>
            {/* Item: Send via SMS */}
            <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px dashed #c8cdd4' }}>
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Send via SMS</span>
              <NxSwitch
                size="md"
                checked={notificationSettings.sendViaSMS}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, sendViaSMS: checked }))}
              />
            </div>
            {/* Item: Send via WhatsApp */}
            <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px dashed #c8cdd4' }}>
              <span className="text-Semantic-Text-light-text-primary font-medium leading-[18px] tracking-tight">Send via WhatsApp</span>
              <NxSwitch
                size="md"
                checked={notificationSettings.sendViaWhatsApp}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, sendViaWhatsApp: checked }))}
              />
            </div>
          </div>
        </NxBaseContainer>
        
        <div className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-lg border-solid border-[#C8CDD4]">
          {/* Cancel - left */}
          <ButtonComponent onClick={handleBack}>
            Cancel
          </ButtonComponent>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            {/* Clear Data - danger */}
            <ButtonComponent
              border={false}
              onClick={handleClearData}
              className="!bg-[#d32f2f] !text-white !border-transparent"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.25 12.25H4.66662C4.51279 12.2504 4.36042 12.2203 4.21826 12.1616C4.0761 12.1028 3.94697 12.0165 3.83829 11.9076L1.50845 9.57488C1.28974 9.35609 1.16687 9.0594 1.16687 8.75004C1.16687 8.44068 1.28974 8.14399 1.50845 7.92521L7.34179 2.09188C7.45013 1.98349 7.57876 1.89751 7.72034 1.83885C7.86192 1.78019 8.01366 1.75 8.16691 1.75C8.32016 1.75 8.47191 1.78019 8.61349 1.83885C8.75506 1.89751 8.8837 1.98349 8.99204 2.09188L12.4915 5.59188C12.7102 5.81066 12.833 6.10735 12.833 6.41671C12.833 6.72607 12.7102 7.02276 12.4915 7.24154L7.48645 12.25M2.96445 6.46921L8.11412 11.6189" stroke="white" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            >
              Clear Data
            </ButtonComponent>

            {/* Submit - success */}
            <ButtonComponent
              border={false}
              htmlType="submit"
              className="!bg-[#388e3c] !text-white !border-transparent"
            >
              Submit
            </ButtonComponent>
          </div>
        </div>
      </Form>
    </LayoutMenu>
  );
};

export default CreateJobPage;
