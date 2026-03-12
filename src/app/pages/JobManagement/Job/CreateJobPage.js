import React, { useState } from "react";
import { Form, Input, Select, InputNumber, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import { createJob } from "../../../../redux/slices/job_management/jobSlice";

const { TextArea } = Input;
const { Option } = Select;

const CreateJobPage = () => {
  const [form] = Form.useForm();
  const [descriptionLength, setDescriptionLength] = useState(0);
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
          actionElement={
            <div className="flex gap-2">
              <ButtonComponent
                type="default"
                htmlType="button"
                onClick={handleBack}
                icon={<LeftOutlined />}
              >
                Back
              </ButtonComponent>
              <ButtonComponent
                type="default"
                htmlType="button"
                onClick={() => form.resetFields()}
              >
                Clear
              </ButtonComponent>
              <ButtonComponent
                type="primary"
                htmlType="submit"
              >
                Save
              </ButtonComponent>
            </div>
          }
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
        </NxCardContainer>
      </Form>
    </LayoutMenu>
  );
};

export default CreateJobPage;