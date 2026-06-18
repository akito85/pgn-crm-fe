import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Form, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { WarningOutlined } from "@ant-design/icons";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";
import CardContainer from "../../../../../components/CardContainer";
import CollectionTemplateSectionForm from "./Form/CollectionTemplateSectionForm";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { getConfigFileMaster } from "../../../../../redux/slices/attachmentSlice";
import debtAndCollectionHttpService from "../../../../../redux/services/debtAndCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  createCollectionTemplate,
  updateCollectionTemplate,
  getDetailCollectionTemplate,
  getAvailableApproval,
  getSelectedApproval,
  getCollectionTemplateAttachmentCategory,
} from "../../../../../redux/slices/system_setup/master_data/collectionTemplate";
import { showModalError } from "../../../../../redux/slices/general_slice";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";

const CollectionTemplateForm = ({ type }) => {
  const { dataListAppHierId, dataListAppHierDetail, loading, data_detail } =
    useSelector((state) => state.collectionTemplate);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location?.state?.id;
  const status = location?.state?.status;
  const statusApproval = location?.state?.statusApproval;

  const [current, setCurrent] = useState(0);
  const [appHierOptions, setAppHierOptions] = useState([]);

  // An approver has no approval hierarchies where they are a submitter.
  // Only meaningful after the approval API has loaded (loading = false).
  const isApproverUser = useMemo(
    () => !loading && appHierOptions.length === 0,
    [loading, appHierOptions],
  );

  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);
  const [listDataActivities, setListDataActivities] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [storedDataActivities, setStoredDataActivities] = useState(false);
  const [storedDataCriteria, setStoredDataCriteria] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Collection Template",
      paramValue: ["templateName", "startDate", "description"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const steps = [
    { title: "CREATE", value: "Collection Template" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const [valuePage, setValuePage] = useState(steps[0].value);

  const storedDataInline = storedDataActivities || storedDataCriteria;

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  const next = () => {
    const fieldsToValidate = listSectionInfo[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            if (storedDataInline) {
              dispatch(
                showModalError({
                  title: "Failed",
                  description:
                    "Please save data table inline before proceeding.",
                }),
              );
              return;
            }
            setCurrent(current + 1);
            window.scrollTo(0, 0);
          }
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleUpdateAttachment = useCallback((updater) => {
    setListDataAttachment((prevState) => {
      const newState =
        typeof updater === "function" ? updater(prevState) : updater;
      const removedItems = prevState.filter(
        (item) => !newState.some((newItem) => newItem.key === item.key),
      );
      const removedExistingIds = removedItems
        .filter((item) => item.dataType === "exist" && item.id)
        .map((item) => item.id);
      if (removedExistingIds.length > 0) {
        setDeletedAttachmentIds((prev) => [...prev, ...removedExistingIds]);
      }
      return newState;
    });
  }, []);

  const isLoading = loading || loadingForm;

  useEffect(() => {
    dispatch(getAvailableApproval());
    dispatch(getSelectedApproval({ id: undefined }));
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailCollectionTemplate(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (id && type === "update" && data_detail?.collectionTemplateId) {
      form.setFieldsValue({
        templateName: data_detail?.templateName,
        startDate: data_detail?.startDate
          ? moment(data_detail.startDate)
          : undefined,
        endDate: data_detail?.endDate ? moment(data_detail.endDate) : undefined,
        description: data_detail?.description,
        apphierId: data_detail?.appHierId,
      });
      setStartDate(
        data_detail?.startDate ? moment(data_detail.startDate) : undefined,
      );
      setEndDate(
        data_detail?.endDate ? moment(data_detail.endDate) : undefined,
      );
      setSelectedHierarchy(data_detail?.appHierId);

      // Map activities from details (sourceType === "ACTIVITY")
      const activityDetails = (data_detail?.details || []).filter(
        (d) => d.sourceType === "ACTIVITY",
      );
      const activities = activityDetails.map((item, index) => ({
        key: String(index + 1),
        activityName: item.collectionActivityId,
        activityCode: item.activity?.activityCode,
        category: item.activity?.category,
        media: item.activity?.media,
        sequenceNo: item.sequenceNo,
        isMandatory: item.isMandatory,
        type: "exist",
      }));
      setListDataActivities(activities);

      // Map criteria from details (sourceType === "CRITERIA")
      const criteriaDetails = (data_detail?.details || []).filter(
        (d) => d.sourceType === "CRITERIA",
      );
      const criteria = criteriaDetails.map((item, index) => ({
        key: String(index + 1),
        startDate: item.criteria?.startDate,
        endDate: item.criteria?.endDate,
        description: item.criteria?.description,
        type: "exist",
      }));
      setListDataCriteria(criteria);

      // Restore criteria multi-select values
      const savedCriteriaValues = (data_detail?.criteria || []).map(
        (item) => item.criteriaId ?? item.criteria ?? item,
      );
      setCriteriaValues(savedCriteriaValues);
      form.setFieldsValue({ criteria: savedCriteriaValues });

      // Map attachments from data_detail.attachments
      const attachments = (data_detail?.attachments || []).map(
        (item, index) => ({
          key: index + 1,
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          fileCategoryId: item.fileCategoryId,
          fileCategoryName: item.fileCategoryName,
          pathFile: item.pathFile,
          urlFile1: item.urlFile1,
          urlFile2: item.urlFile2,
          uploadBy: item.createdBy,
          uploadDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        }),
      );
      setListDataAttachment(attachments);
    }
  }, [id, type, form, data_detail]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getSelectedApproval({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: (a.employeeDetail || []).map((b, i) => ({
          ...b,
          key: i + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_COLLECTION_TEMPLATE,
      breadcrumbName: "Collection Template",
    },
    {
      path:
        type === "create"
          ? SYSTEM_SETUP_ROUTES.CREATE_COLLECTION_TEMPLATE
          : SYSTEM_SETUP_ROUTES.UPDATE_COLLECTION_TEMPLATE,
      breadcrumbName:
        type === "create"
          ? "Create Collection Template"
          : "Update Collection Template",
    },
  ];

  const buildBody = (formValue, isSubmit) => {
    const activities = listDataActivities.map((item) => ({
      collectionActivityId: item.activityName,
      sequenceNo: item.sequenceNo,
      isMandatory: item.isMandatory,
      startDate: item.startDate
        ? moment(item.startDate).format("YYYY-MM-DD")
        : null,
      endDate: item.endDate ? moment(item.endDate).format("YYYY-MM-DD") : null,
      description: item.description || null,
    }));

    const criteria = listDataCriteria.map((item) => ({
      customerSegmentId: item.customerSegment?.value || null,
      accountGroupTypeId: item.accountGroupType?.value || null,
      startDate: item.startDate
        ? moment(item.startDate).format("YYYY-MM-DD")
        : null,
      endDate: item.endDate ? moment(item.endDate).format("YYYY-MM-DD") : null,
      description: item.description || null,
    }));

    return {
      id: type === "create" ? undefined : id,
      templateName: formValue.templateName,
      description: formValue.description,
      startDate: formValue.startDate
        ? moment(formValue.startDate).format("YYYY-MM-DD")
        : null,
      endDate: formValue.endDate
        ? moment(formValue.endDate).format("YYYY-MM-DD")
        : null,
      appHierId: formValue.apphierId || selectedHierarchy,
      approvalType: "APR_PAY_COLLECTION_TEMPLATE",
      isSubmit,
      activities,
      criteria,
    };
  };

  const isSubmitRef = useRef(false);

  const handleSubmit = () => {
    isSubmitRef.current = true;
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    if (isApproverUser) {
      dispatch(
        showModalError({
          title: "Failed",
          description:
            "You don't have permission to create or update this data. Only submitters are allowed.",
        }),
      );
      return;
    }
    isSubmitRef.current = false;
    setTimeout(() => {
      const formValue = form.getFieldsValue();
      handleSave(formValue);
    }, 0);
  };

  const handleSave = async (formValue) => {
    if (isApproverUser) {
      dispatch(
        showModalError({
          title: "Failed",
          description:
            "You don't have permission to create or update this data. Only submitters are allowed.",
        }),
      );
      return;
    }

    if (!isSubmitRef.current) {
      try {
        await form.validateFields(["templateName"]);
      } catch {
        setCurrent(0);
        return;
      }
      setBodyData(formValue);
      return dispatchSave(formValue, false);
    }

    if (listDataAttachment.length === 0) {
      dispatch(
        showModalError({
          title: "Failed",
          description:
            "Attachment is mandatory. Please upload at least one file.",
        }),
      );
      setCurrent(2);
      return;
    }
    if (storedDataInline) {
      dispatch(
        showModalError({
          title: "Failed",
          description: "Please save data table inline before submit.",
        }),
      );
      return;
    }
    setBodyData(formValue);
    dispatchSave(formValue, true);
  };

  const dispatchSave = async (formValue, isSubmit) => {
    const body = buildBody(formValue, isSubmit);

    const action =
      type === "create"
        ? createCollectionTemplate(body)
        : updateCollectionTemplate({ id, body });

    setLoadingForm(true);
    dispatch(action)
      .unwrap()
      .then(async (dataForm) => {
        const templateId = dataForm?.collectionTemplateId;
        // Upload attachments
        const newAttachments = listDataAttachment.filter(
          (item) => item.dataType !== "exist",
        );
        if (deletedAttachmentIds.length > 0) {
          await debtAndCollectionHttpService.createData(
            `/v1/dbs/api/attachment/delete-attachment`,
            { fileId: deletedAttachmentIds },
          );
        }
        for (let i = 0; i < newAttachments.length; i++) {
          const el = newAttachments[i];
          const attachBody = new FormData();
          attachBody.append("files", el.file);
          attachBody.append("category", el.fileCategoryId);
          attachBody.append("referenceId", templateId);
          await debtAndCollectionHttpService.upload(
            `/v1/dbs/api/collection-management/collection-templates/create-attachment`,
            attachBody,
          );
        }
        setLoadingForm(false);
        handleClear();
      })
      .catch((error) => {
        setLoadingForm(false);
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
        setBodyError({ message });
        setModalError(true);
      });
  };

  const handleError = ({ errorFields }) => {
    if (errorFields?.length > 0) {
      const firstError = errorFields[0].name[0];
      const stepIndex = listSectionInfo.findIndex((page) =>
        page.paramValue?.includes(firstError),
      );
      if (stepIndex !== -1) {
        setCurrent(stepIndex);
      }
    }
  };

  const handleClear = () => {
    setCurrent(0);
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy(undefined);
      setListDataAttachment([]);
      setDeletedAttachmentIds([]);
      setBodyData({});
      setListDataActivities([]);
      setListDataCriteria([]);
      setCriteriaValues([]);
      setStoredDataActivities(false);
      setStoredDataCriteria(false);
      setStartDate(undefined);
      setEndDate(undefined);
    } else {
      dispatch(getDetailCollectionTemplate(id));
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleStartDate = (value) => {
    form.resetFields(["endDate"]);
    setStartDate(value);
    return value;
  };

  const handleEndDate = (value) => {
    setEndDate(value);
    return value;
  };

  const handleBack = () => {
    setModalBack(true);
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
          disabled={storedDataInline}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          {/* Step 1 - Collection Template Information */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[0].value ? "none" : undefined,
            }}
          >
            <CollectionTemplateSectionForm
              type={type}
              form={form}
              listDataActivities={listDataActivities}
              setListDataActivities={setListDataActivities}
              listDataCriteria={listDataCriteria}
              setListDataCriteria={setListDataCriteria}
              storedDataActivities={storedDataActivities}
              setStoredDataActivities={setStoredDataActivities}
              storedDataCriteria={storedDataCriteria}
              setStoredDataCriteria={setStoredDataCriteria}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              startDate={startDate}
              endDate={endDate}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              status={status}
              statusApproval={statusApproval}
            />
          </div>

          {/* Step 2 - Approval */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[1].value ? "none" : undefined,
            }}
          >
            <CardContainer header="Approval Information">
              <Form.Item name="apphierId" noStyle>
                <input type="hidden" />
              </Form.Item>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                showSelect={!isApproverUser}
                updateSelectedHierarchy={(val) => {
                  setSelectedHierarchy(val);
                  form.setFieldsValue({ apphierId: val });
                }}
              />
            </CardContainer>
          </div>

          {/* Step 3 - Attachment */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[2].value ? "none" : undefined,
            }}
          >
            <CardContainer header="Attachment Information">
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={handleUpdateAttachment}
                dispatch={dispatch}
                getAPICategory={getCollectionTemplateAttachmentCategory}
                typeSelector="collectionTemplate"
                service={debtAndCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                getAPIGuard={getConfigFileMaster}
                mandatory={true}
              />
            </CardContainer>
          </div>

          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={handleBack}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            type={type}
            disabled={storedDataInline}
            isLoading={loadingForm}
            isApprover={isApproverUser}
          />
        </Form>

        {/* Modal Back */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to go back?
            </p>
          </div>
        </ModalConfirm>

        {/* Modal Error */}
        <ModalError
          isOpen={modalError}
          handleCancel={handleCloseModalError}
          handleOk={handleCloseModalError}
          width={400}
        >
          <div className="flex flex-col items-center mt-5 gap-[12px]">
            <p className="text-[18px] font-bold text-red-500">Error</p>
            <p className="text-center">{bodyError?.message}</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default CollectionTemplateForm;
