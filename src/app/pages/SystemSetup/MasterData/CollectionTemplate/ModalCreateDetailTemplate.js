import React, { useCallback, useEffect, useState } from "react";
import { Form, Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { WarningOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import CardContainer from "../../../../../components/CardContainer";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import FunctionalActivitiesCollectionTemplate from "./Form/FunctionalActivitiesCollectionTemplate";
import FunctionalCriteriaCollectionTemplate from "./Form/FunctionalCriteriaCollectionTemplate";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import {
  getAvailableApproval,
  getSelectedApproval,
  getCollectionTemplateAttachmentCategory,
  getCollectionActivityList,
  addActivityToTemplate,
  addCriteriaToTemplate,
} from "../../../../../redux/slices/system_setup/master_data/collectionTemplate";
import { getConfigFileMaster } from "../../../../../redux/slices/attachmentSlice";
import { showModalError } from "../../../../../redux/slices/general_slice";
import debtAndCollectionHttpService from "../../../../../redux/services/debtAndCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const steps = [
  { title: "CREATE", value: "Create" },
  { title: "APPROVAL", value: "Approval" },
  { title: "ATTACHMENT", value: "Attachment" },
];

const ModalCreateDetailTemplate = ({
  open,
  onClose,
  templateId,
  templateStartDate,
  templateEndDate,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const { dataListAppHierId, dataListAppHierDetail, data_activities } =
    useSelector((state) => state.collectionTemplate);

  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [loadingForm, setLoadingForm] = useState(false);

  const [listDataActivities, setListDataActivities] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [storedDataActivities, setStoredDataActivities] = useState(false);
  const [storedDataCriteria, setStoredDataCriteria] = useState(false);

  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);

  const [listDataAttachment, setListDataAttachment] = useState([]);

  const storedDataInline = storedDataActivities || storedDataCriteria;

  // Fetch reference data when modal opens
  useEffect(() => {
    if (open) {
      dispatch(getAvailableApproval());
      dispatch(getSelectedApproval({ id: undefined }));
      dispatch(getCollectionActivityList());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (dataListAppHierId?.length > 0) {
      setAppHierOptions(
        dataListAppHierId.map((a) => ({
          name: a.approvalName,
          value: a.appHierId,
        })),
      );
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (dataListAppHierDetail?.length > 0) {
      setAppHierDataDetail(
        dataListAppHierDetail.map((a, i) => ({
          ...a,
          key: i + 1,
          employeeDetail: (a.employeeDetail || []).map((b, j) => ({
            ...b,
            key: j + 1,
          })),
        })),
      );
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const handleUpdateAttachment = useCallback((updater) => {
    setListDataAttachment((prev) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
  }, []);

  const resetModal = () => {
    setCurrent(0);
    form.resetFields();
    setListDataActivities([]);
    setListDataCriteria([]);
    setStoredDataActivities(false);
    setStoredDataCriteria(false);
    setSelectedHierarchy(undefined);
    setAppHierDataDetail([]);
    setListDataAttachment([]);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleNext = () => {
    if (current === 0) {
      if (storedDataInline) {
        dispatch(
          showModalError({
            title: "Failed",
            description: "Please save data table inline before proceeding.",
          }),
        );
        return;
      }
      if (listDataActivities.length === 0 && listDataCriteria.length === 0) {
        dispatch(
          showModalError({
            title: "Failed",
            description:
              "Please add at least one activity or criteria before proceeding.",
          }),
        );
        return;
      }
      setCurrent(1);
      window.scrollTo(0, 0);
    } else if (current === 1) {
      if (!selectedHierarchy) {
        dispatch(
          showModalError({
            title: "Failed",
            description: "Please select an approval hierarchy.",
          }),
        );
        return;
      }
      setCurrent(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!selectedHierarchy) return;

    setLoadingForm(true);
    try {
      // Add each activity
      for (const item of listDataActivities) {
        await dispatch(
          addActivityToTemplate({
            id: templateId,
            body: {
              // item.activityName stores the collectionActivityId (Select value)
              collectionActivityId: item.activityName,
              sequenceNo: item.sequenceNo || null,
              isMandatory: item.isMandatory || null,
              appHierId: selectedHierarchy,
              approvalType: "APR_PAY_COLLECTION_TEMPLATE",
            },
          }),
        ).unwrap();
      }

      // Add each criteria
      for (const item of listDataCriteria) {
        await dispatch(
          addCriteriaToTemplate({
            id: templateId,
            body: {
              collectionActivityId: null,
              criteriaType: "CUSTOMER_SEGMENT",
              criteriaValueId: item.customerSegment?.value || null,
              criteriaValueDisplay: item.customerSegment?.label || null,
              criteriaGroupId: item.accountGroupType?.value || null,
              category: item.accountGroupType?.label || null,
              startDate: item.startDate
                ? moment(item.startDate).format("YYYY-MM-DD")
                : null,
              endDate: item.endDate
                ? moment(item.endDate).format("YYYY-MM-DD")
                : null,
              description: item.description || null,
              appHierId: selectedHierarchy,
              approvalType: "APR_PAY_COLLECTION_TEMPLATE",
            },
          }),
        ).unwrap();
      }

      // Upload attachments to parent template
      for (const el of listDataAttachment) {
        if (el.dataType !== "exist") {
          const attachBody = new FormData();
          attachBody.append("files", el.file);
          attachBody.append("category", el.fileCategoryId);
          attachBody.append("referenceId", String(templateId));
          await debtAndCollectionHttpService.upload(
            `/v1/dbs/api/collection-management/collection-templates/create-attachment`,
            attachBody,
          );
        }
      }

      setLoadingForm(false);
      resetModal();
      onClose();
      onRefresh?.();
    } catch (error) {
      setLoadingForm(false);
      dispatch(
        showModalError({
          title: "Failed",
          description:
            error?.response?.data?.message ||
            error?.message ||
            "An error occurred while saving. Please try again.",
        }),
      );
    }
  };

  const modalFooter = (
    <div className="flex justify-between items-center">
      <ButtonComponent onClick={handleClose}>Cancel</ButtonComponent>
      <div className="flex gap-2">
        <ButtonComponent disabled={current === 0} onClick={handlePrev}>
          Previous
        </ButtonComponent>
        {current < steps.length - 1 ? (
          <ButtonComponent
            type="submit"
            onClick={handleNext}
            disabled={storedDataInline}
          >
            Next
          </ButtonComponent>
        ) : (
          <ButtonComponent
            type="submit"
            onClick={handleSubmit}
            loading={loadingForm}
          >
            Submit
          </ButtonComponent>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="CREATE ACTIVITIES & CRITERIA INFORMATION"
      width={960}
      footer={modalFooter}
      destroyOnClose
      maskClosable={false}
    >
      <Spin spinning={loadingForm}>
        {/* Stepper */}
        <div className="mb-4">
          <FormStepper steps={steps} current={current} />
        </div>

        {/* Step 1: CREATE */}
        <div style={{ display: current !== 0 ? "none" : undefined }}>
          <CardContainer header="ACTIVITIES INFORMATION">
            <FunctionalActivitiesCollectionTemplate
              type="create"
              data={listDataActivities}
              updateData={setListDataActivities}
              storedData={storedDataActivities}
              setStoredData={setStoredDataActivities}
              validStartDate={templateStartDate}
              validEndDate={templateEndDate}
            />
          </CardContainer>
          <CardContainer header="CRITERIA INFORMATION">
            <FunctionalCriteriaCollectionTemplate
              type="create"
              data={listDataCriteria}
              updateData={setListDataCriteria}
              storedData={storedDataCriteria}
              setStoredData={setStoredDataCriteria}
              validStartDate={templateStartDate}
              validEndDate={templateEndDate}
            />
          </CardContainer>
        </div>

        {/* Step 2: APPROVAL */}
        <div style={{ display: current !== 1 ? "none" : undefined }}>
          <CardContainer header="APPROVAL INFORMATION">
            <Form form={form} layout="vertical">
              <Form.Item name="apphierId" noStyle>
                <input type="hidden" />
              </Form.Item>
            </Form>
            <ApprovalComponentGeneral
              type="create"
              dataTable={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={selectedHierarchy}
              updateSelectedHierarchy={(val) => {
                setSelectedHierarchy(val);
                form.setFieldsValue({ apphierId: val });
                if (val) {
                  dispatch(getSelectedApproval({ id: val }));
                }
              }}
            />
          </CardContainer>
        </div>

        {/* Step 3: ATTACHMENT */}
        <div style={{ display: current !== 2 ? "none" : undefined }}>
          <CardContainer header="ATTACHMENT INFORMATION">
            <AttachmentComponent
              type="create"
              data={listDataAttachment}
              updateData={handleUpdateAttachment}
              dispatch={dispatch}
              getAPICategory={getCollectionTemplateAttachmentCategory}
              typeSelector="collectionTemplate"
              service={debtAndCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
              getAPIGuard={getConfigFileMaster}
              mandatory={false}
            />
          </CardContainer>
        </div>
      </Spin>
    </Modal>
  );
};

export default ModalCreateDetailTemplate;
