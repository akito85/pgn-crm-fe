import React, { useEffect } from "react";
import { Form, Input, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import ButtonComponent from "../../../../components/ButtonComponent";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import {
  useGetJobGroupByIdQuery,
  useCreateJobGroupMutation,
  useUpdateJobGroupMutation,
} from "../../../../redux/slices/job_management/jobGroupApiSlice";

const { TextArea } = Input;

const formItemProps = { style: { marginBottom: "20px" } };
const inputStyle   = { height: "34px", padding: "4px 8px" };

const CreateJobGroupPage = () => {
  const [form] = Form.useForm();
  const navigate  = useNavigate();
  const location  = useLocation();

  const id         = location.state?.id;
  const isEditMode = Boolean(id);

  // RTK Query hooks
  const { data: currentGroup } = useGetJobGroupByIdQuery(id, { skip: !id });
  const [createJobGroup, { isLoading: createLoading }] = useCreateJobGroupMutation();
  const [updateJobGroup, { isLoading: updateLoading }] = useUpdateJobGroupMutation();
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
      isActive:    currentGroup.isActive === "Y",
    });
  }, [currentGroup, isEditMode, form]);

  const onFinish = async (values) => {
    const payload = {
      name:        values.name,
      code:        values.code.toUpperCase(),
      description: values.description,
      isActive:    values.isActive ? "Y" : "N",
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
    form.setFieldValue("isActive", true);
  };

  return (
    <>
      <BreadCrumb routes={breadcrumbRoutes} />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ isActive: true }}
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
                label="Active"
                name="isActive"
                valuePropName="checked"
                {...formItemProps}
              >
                <NxSwitch size="md" />
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

        </NxCardContainer>

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
