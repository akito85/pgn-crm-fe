import React, { useState, useEffect } from "react";
import { Form, Spin, Row, Col, Input, Select, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import {
  createJob,
  getJobById,
  clearError,
  resetCurrentJob,
} from "../../../../redux/slices/system_setup/jobSlice";
import { SearchOutlined, LeftOutlined, WarningOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const FormJob = ({ type }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const { currentJob, loading, error } = useSelector((state) => state.job);

  // Local state
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({});
  
  // Get ID dari location.state (sama seperti calculation)
  const jobId = location?.state?.id;
  const isView = type === "view" || type === "update";
  const isCreate = type === "create";

  console.log('Form Type:', type);
  console.log('Job ID from location.state:', jobId);

  // Fetch job data when view mode
  useEffect(() => {
    dispatch(clearError());
    dispatch(resetCurrentJob());
    
    if (jobId && isView) {
      console.log('Fetching job with ID:', jobId);
      dispatch(getJobById(jobId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(resetCurrentJob());
      dispatch(clearError());
    };
  }, [jobId, isView, dispatch]);

  // Auto-populate form
  useEffect(() => {
    if (currentJob && isView) {
      console.log('Current Job Data from API:', currentJob);
      
      const formData = {
        code: currentJob.code || '',
        procedure_name: currentJob.procedureName || '',
        listing_no: currentJob.listingNo?.toString() || '',
        is_parallel: currentJob.isParallel || 'N',
        parallel_degree: currentJob.parallelDegree?.toString() || '0',
        is_finish: currentJob.isFinish || 'N',
        p_job_type_id: currentJob.pjobTypeId?.toString() || '',
        is_cancelled_process: currentJob.isCancelledProcess || 'N',
        is_reprocess: currentJob.isReprocess || 'N',
        parent_id: currentJob.parentId?.toString() || '',
        cancel_parent_id: currentJob.cancelParentId?.toString() || '',
        control_table_name: currentJob.controlTableName || '',
        description: currentJob.description || '',
      };
      
      console.log('Form Data to Populate:', formData);
      form.setFieldsValue(formData);
    }
  }, [currentJob, isView, form]);

  // Handle error
  useEffect(() => {
    if (error) {
      console.error('Form error:', error);
      message.error(error.message || 'An error occurred');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Save action
  const saveAction = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const values = form.getFieldsValue();
      console.log('Submitting values:', values);
      
      const result = await dispatch(createJob(values)).unwrap();
      console.log('Create success:', result);
      
      handleCancel();
      
      message.success('Job created successfully');
      setTimeout(() => {
        navigate(SYSTEM_SETUP_ROUTES.JOB_VIEW_MENU);
      }, 500);
      
    } catch (error) {
      console.error('Save error:', error);
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const onFinish = async (values) => {
    if (isView) return;
    
    console.log('Form validated values:', values);
    setFormValues(values);
    setOpenModal(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
    message.error('Please check all required fields');
  };

  const handleClick = () => {
    if (isView) return;
    form.resetFields();
    message.info('Form cleared');
  };

  const handleBack = () => {
    const isDirty = form.isFieldsTouched();
    
    if (isDirty && isCreate) {
      setModalBack(true);
    } else {
      navigate(SYSTEM_SETUP_ROUTES.JOB_VIEW_MENU);
    }
  };

  const handleParentSearch = () => {
    message.info("Parent search functionality - to be implemented");
  };

  // Breadcrumb routes
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.JOB_VIEW_MENU,
      breadcrumbName: "Job Management",
    },
    {
      path: "",
      breadcrumbName: isView ? "View Job" : "Create Job",
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          disabled={isView}
          initialValues={{
            is_parallel: 'N',
            is_finish: 'N',
            is_cancelled_process: 'N',
            is_reprocess: 'N',
            parallel_degree: '0',
            listing_no: '1',
          }}
        >
          <BaseContainer
            header={isView ? "VIEW JOB DETAIL" : "CREATE JOB"}
          >
            <div className="w-full">
              <Row gutter={[24, 16]}>
                {/* Row 1 */}
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Code"
                    name="code"
                    rules={[
                      {
                        required: !isView,
                        message: "Please input code",
                      },
                      {
                        max: 64,
                        message: "Maximum 64 characters",
                      },
                      {
                        pattern: /^[A-Z0-9_-]+$/,
                        message: "Use uppercase letters, numbers, dash or underscore only",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g. CODE-TEST2"
                      size="large"
                      maxLength={64}
                      onInput={(e) => {
                        e.target.value = e.target.value.toUpperCase().trimStart();
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Procedure Name"
                    name="procedure_name"
                    rules={[
                      {
                        required: !isView,
                        message: "Please input procedure name",
                      },
                      {
                        max: 64,
                        message: "Maximum 64 characters",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g. downloadDataPrabill"
                      size="large"
                      maxLength={64}
                      onInput={(e) =>
                        (e.target.value = e.target.value.trimStart())
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Listing No"
                    name="listing_no"
                    rules={[
                      {
                        required: !isView,
                        message: "Please input listing number",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter listing number"
                      size="large"
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>

                {/* Row 2 */}
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Is Parallel"
                    name="is_parallel"
                    rules={[
                      {
                        required: !isView,
                        message: "Please select parallel status",
                      },
                    ]}
                  >
                    <Select placeholder="Select parallel status" size="large">
                      <Option value="Y">Yes</Option>
                      <Option value="N">No</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Parallel Degree"
                    name="parallel_degree"
                    rules={[
                      {
                        required: !isView,
                        message: "Please input parallel degree",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter parallel degree"
                      size="large"
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Is Finish"
                    name="is_finish"
                    rules={[
                      {
                        required: !isView,
                        message: "Please select finish status",
                      },
                    ]}
                  >
                    <Select placeholder="Select finish status" size="large">
                      <Option value="Y">Yes</Option>
                      <Option value="N">No</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* Row 3 */}
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Job Type ID"
                    name="p_job_type_id"
                    rules={[
                      {
                        required: !isView,
                        message: "Please input job type ID",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g. 1"
                      size="large"
                      type="number"
                      min={1}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Is Cancelled Process"
                    name="is_cancelled_process"
                    rules={[
                      {
                        required: !isView,
                        message: "Please select cancelled process status",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select cancelled process status"
                      size="large"
                    >
                      <Option value="Y">Yes</Option>
                      <Option value="N">No</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Is Reprocess"
                    name="is_reprocess"
                    rules={[
                      {
                        required: !isView,
                        message: "Please select reprocess status",
                      },
                    ]}
                  >
                    <Select placeholder="Select reprocess status" size="large">
                      <Option value="Y">Yes</Option>
                      <Option value="N">No</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* Row 4 */}
                <Col xs={24} sm={12} md={8}>
                  <Form.Item 
                    label="Parent ID" 
                    name="parent_id"
                  >
                    <Input.Group compact className="flex">
                      <Input
                        placeholder="Optional - e.g. 1"
                        size="large"
                        className="flex-1"
                        type="number"
                        min={0}
                      />
                      {!isView && (
                        <ButtonComponent
                          icon={<SearchOutlined />}
                          onClick={handleParentSearch}
                          style={{ marginLeft: "8px" }}
                        />
                      )}
                    </Input.Group>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item 
                    label="Cancel Parent ID" 
                    name="cancel_parent_id"
                  >
                    <Input
                      placeholder="Optional"
                      size="large"
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Control Table Name"
                    name="control_table_name"
                    rules={[
                      {
                        required: !isView,
                        message: "Please input control table name",
                      },
                      {
                        max: 38,
                        message: "Maximum 38 characters",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g. CONTROL_DOWNLOAD"
                      size="large"
                      maxLength={38}
                      onInput={(e) => {
                        e.target.value = e.target.value.toUpperCase().trimStart();
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Description - Full Width */}
                <Col xs={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: !isView,
                        message: "Please input description",
                      },
                      {
                        max: 128,
                        message: "Maximum 128 characters",
                      },
                    ]}
                  >
                    <TextArea
                      placeholder="e.g. Job for downloading billing data"
                      rows={4}
                      size="large"
                      maxLength={128}
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </BaseContainer>

          {/* Action Buttons */}
          <div className="w-full flex my-5">
            <div>
              <ButtonComponent
                type="default"
                onClick={handleBack}
                icon={
                  <LeftOutlined
                    style={{
                      color: "#fff",
                      fontSize: 24,
                      justifyItems: "center",
                    }}
                  />
                }
              >
                Back
              </ButtonComponent>
            </div>
            {!isView && (
              <div className="w-full justify-end flex gap-2">
                <ButtonComponent
                  icon={<SVGIcon name={"IconButtonClear"} width={24} />}
                  type="default"
                  border={false}
                  onClick={handleClick}
                  disabled={isSubmitting}
                >
                  Clear
                </ButtonComponent>
                <ButtonComponent 
                  type="submit" 
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Save
                </ButtonComponent>
              </div>
            )}
          </div>
        </Form>

        {/* Modal Confirmation */}
        <ModalCustom
          isOpen={openModal}
          handleCancel={handleCancel}
          header={"CONFIRMATION"}
          width={800}
          type={"confirmation"}
        >
          <div className="w-full flex flex-col gap-4">
            <span className="text-primary uppercase">Job Information</span>
            <div className="flex flex-col gap-4 pl-4">
              <DetailText label={"Code"}>{formValues?.code}</DetailText>
              <DetailText label={"Procedure Name"}>
                {formValues?.procedure_name}
              </DetailText>
              <DetailText label={"Listing No"}>
                {formValues?.listing_no}
              </DetailText>
              <DetailText label={"Is Parallel"}>
                {formValues?.is_parallel === 'Y' ? 'Yes' : 'No'}
              </DetailText>
              <DetailText label={"Parallel Degree"}>
                {formValues?.parallel_degree}
              </DetailText>
              <DetailText label={"Is Finish"}>
                {formValues?.is_finish === 'Y' ? 'Yes' : 'No'}
              </DetailText>
              <DetailText label={"Job Type ID"}>
                {formValues?.p_job_type_id}
              </DetailText>
              <DetailText label={"Is Cancelled Process"}>
                {formValues?.is_cancelled_process === 'Y' ? 'Yes' : 'No'}
              </DetailText>
              <DetailText label={"Is Reprocess"}>
                {formValues?.is_reprocess === 'Y' ? 'Yes' : 'No'}
              </DetailText>
              <DetailText label={"Parent ID"}>
                {formValues?.parent_id || '-'}
              </DetailText>
              <DetailText label={"Cancel Parent ID"}>
                {formValues?.cancel_parent_id || '-'}
              </DetailText>
              <DetailText label={"Control Table Name"}>
                {formValues?.control_table_name}
              </DetailText>
              <DetailText label={"Description"}>
                {formValues?.description}
              </DetailText>
            </div>
          </div>

          <div className="flex justify-end gap-5 mt-4">
            <ButtonComponent 
              onClick={handleCancel} 
              type="default"
              disabled={isSubmitting}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent 
              onClick={saveAction} 
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit
            </ButtonComponent>
          </div>
        </ModalCustom>

        {/* Modal Back Confirmation */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(SYSTEM_SETUP_ROUTES.JOB_VIEW_MENU)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to go back? Unsaved changes will be lost.
            </p>
          </div>
        </ModalConfirm>
      </Spin>
    </LayoutMenu>
  );
};

export default FormJob;