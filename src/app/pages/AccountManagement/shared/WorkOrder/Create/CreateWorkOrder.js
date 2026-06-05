import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Spin } from "antd";
import { WarningOutlined } from "@ant-design/icons";

import NxBreadCrumb from "../../../../../../components/Nx/NxBreadCrumb";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import { NxFormStepper } from "../../../../../../components/Nx/NxFormStepNavigation";
import HeaderDetail from "../../../CustomerAccountDetail/HeaderDetail";
import SVGIcon from "../../../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import useWoContext from "../hooks/useWoContext";
import useWoNavigation from "../hooks/useWoNavigation";

import WoInfoStep from "./StepContents/WoInfoStep";
import WoActivityStep from "./StepContents/WoActivityStep";
import WoApprovalStep from "./StepContents/WoApprovalStep";
import WoAttachmentStep from "./StepContents/WoAttachmentStep";
import WoConfirmationModal from "./ConfirmationModal/WoConfirmationModal";

import {
  getWorkOrder,
  createWorkOrder,
  updateWorkOrder,
  getWoActivities,
  getWoDataRequirements,
  getWoCategories,
  getWoTypes,
  getWoPriorities,
  getWoGroups,
  getWoPicPositions,
  getWoActivityStatuses,
  getWoApprovalHierarchies,
  getWoDataRequirementTypes,
  clearWoActivities,
  clearWoDataRequirements,
} from "../../../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../redux/slices/account_management/accountManagement";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import NxDate from "../../../../../../components/Nx/NxDatePicker";
import moment from "moment";

const CreateWorkOrder = () => {
  const dispatch = useDispatch();

  const woContext = useWoContext();
  const { goBack, goToView } = useWoNavigation(woContext);
  const isUpdate = woContext.isUpdate === true;
  const isSrContext = woContext.source === "SERVICE_REQUEST";
  const isStandalone = woContext.accountId === null;

  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [confirmationType, setConfirmationType] = useState("submit");
  const [dataSend, setDataSend] = useState({});
  const [modalBack, setModalBack] = useState(false);

  const [activityData, setActivityData] = useState([]);
  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  const [selectedAccountId, setSelectedAccountId] = useState(woContext.accountId || null);
  const [selectedAccountType, setSelectedAccountType] = useState(woContext.accountType || null);

  const accountId = isSrContext ? woContext.accountId : (selectedAccountId || woContext.accountId);

  const {
    detail_workOrder,
    loading_detailWo,
    loading_createUpdateWo,
    list_woCategories,
    list_woTypes,
    list_woPriorities,
    list_woGroups,
    list_woPicPositions,
    list_woPicUsers,
    list_woActivityStatuses,
    list_woApprovalHierarchy,
    detail_woApprovalHierarchy,
    list_woDataRequirementTypes,
    detail_woDataRequirementValues,
    list_woActivities,
    pagination_woActivities,
  } = useSelector((state) => state.workOrder);

  const { data_accountDetail, loading: loadingAccount } = useSelector(
    (state) => state.accountManagement
  );

  const isLoading = loading_detailWo || loadingForm || loadingAccount;

  const dropdowns = {
    list_woCategories,
    list_woTypes,
    list_woPriorities,
    list_woGroups,
    list_woPicPositions,
    list_woPicUsers,
    list_woActivityStatuses,
    woDataRequirements: list_woDataRequirementTypes,
    detail_woDataRequirementValues,
  };

  // ─── Load dropdowns on mount ─────────────────────────────────────────────
  useEffect(() => {
    dispatch(getWoCategories());
    dispatch(getWoTypes());
    dispatch(getWoPriorities());
    dispatch(getWoGroups());
    dispatch(getWoPicPositions());
    dispatch(getWoActivityStatuses());
    dispatch(getWoApprovalHierarchies());
    dispatch(getWoDataRequirementTypes());
  }, [dispatch]);

  // ─── Load account detail ──────────────────────────────────────────────────
  useEffect(() => {
    const idAccount = woContext.accountId || selectedAccountId;
    const idCustomer = woContext.idCustomer;
    const accType = woContext.accountType || selectedAccountType;
    if (idAccount && accType) {
      if (accType === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer, idAccount }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer, idAccount }));
      }
    }
  }, [dispatch, woContext.accountId, woContext.idCustomer, woContext.accountType, selectedAccountId, selectedAccountType]);

  // ─── Load WO detail in update mode ───────────────────────────────────────
  useEffect(() => {
    if (isUpdate && woContext.woId && accountId) {
      dispatch(getWorkOrder({ woId: woContext.woId, accountId }));
      dispatch(clearWoActivities());
      dispatch(clearWoDataRequirements());
      dispatch(getWoActivities({ woId: woContext.woId, body: { page: 1, size: 20, filters: [], filterRules: [] }, isLoadMore: false }));
      dispatch(getWoDataRequirements({ woId: woContext.woId, body: { page: 1, size: 20, filters: [], filterRules: [] }, isLoadMore: false }));
    }
  }, [dispatch, isUpdate, woContext.woId, accountId]);

  // ─── Populate form from detail in update mode ─────────────────────────────
  useEffect(() => {
    if (!isUpdate || !detail_workOrder) return;
    form.setFieldsValue({
      workOrderReference: detail_workOrder.woRefNumber,
      workOrderReferenceId: detail_workOrder.woRefId,
      source: detail_workOrder.source,
      sourceReference: detail_workOrder.sourceNumber,
      category: detail_workOrder.woCategoryGlbId?.toString(),
      type: detail_workOrder.woTypeGlbId?.toString(),
      priority: detail_workOrder.woPriorityGlbId?.toString(),
      group: detail_workOrder.groupGlbId?.toString(),
      requestDate: detail_workOrder.requestDate ? moment(detail_workOrder.requestDate) : null,
      completionPlanDate: detail_workOrder.planCompletionDate ? moment(detail_workOrder.planCompletionDate) : null,
      dueDate: detail_workOrder.dueDate ? moment(detail_workOrder.dueDate) : null,
      description: detail_workOrder.description,
      appHierId: detail_workOrder.apphierId,
    });
    if (detail_workOrder.attachments) {
      setAttachmentDataSource(detail_workOrder.attachments);
    }
  }, [isUpdate, detail_workOrder, form]);

  // ─── Standalone account selection callback ────────────────────────────────
  const handleAccountSelect = useCallback(
    (accId, accType) => {
      setSelectedAccountId(accId);
      setSelectedAccountType(accType);
    },
    []
  );

  // ─── Steps ────────────────────────────────────────────────────────────────
  const steps = [
    {
      title: "Work Order",
      content: (
        <WoInfoStep
          form={form}
          woContext={woContext}
          dropdowns={dropdowns}
          onAccountSelect={handleAccountSelect}
        />
      ),
    },
    {
      title: "Activity & Data",
      content: (
        <WoActivityStep
          form={form}
          woContext={woContext}
          dropdowns={dropdowns}
          activityData={activityData}
          setActivityData={setActivityData}
          isUpdateMode={isUpdate}
          accountId={accountId}
        />
      ),
    },
    {
      title: "Approval",
      content: <WoApprovalStep form={form} />,
    },
    {
      title: "Attachment",
      content: (
        <WoAttachmentStep
          data={attachmentDataSource}
          updateData={setAttachmentDataSource}
          setDeleted={setDeletedAttachments}
        />
      ),
    },
  ];

  const stepFieldMap = [
    ["category", "type", "priority", "group", "requestDate", "completionPlanDate", "dueDate"],
    [],
    ["appHierId"],
    [],
  ];
  const stepFieldMapDraft = [
    ["category", "type", "priority", "group", "requestDate", "completionPlanDate", "dueDate"],
    [],
    [],
    [],
  ];

  const validateActivityTable = () => {
    const invalidRows = activityData.filter(
      (row) => !row.picPositionId || !row.picUserId
    );

    // validation empty activity list
    if(activityData.length < 1)
    {
      dispatch(
        showModalError({
          title: "Activity Validation Failed",
          description: `Activity List Cannot Empty`,
        })
      );
      return false;
    }

    if (invalidRows.length > 0) {
      const names = invalidRows
        .map((row, i) => `Row ${i + 1}: ${row.woActName || "(unnamed)"}`)
        .join(", ");
      dispatch(
        showModalError({
          title: "Activity Validation Failed",
          description: `Each activity must have PIC Position and PIC User. Invalid rows: ${names}`,
        })
      );
      return false;
    }
    return true;
  };

  const validateStep = async (stepIndex, action = "SUBMIT") => {
    const isDraft = action === "DRAFT";
    const fieldMap = isDraft ? stepFieldMapDraft : stepFieldMap;
    const fields = fieldMap[stepIndex] || [];
    if (fields.length > 0) {
      await form.validateFields(fields);
    }
    if (stepIndex === 1 && !isDraft) {
      if (!validateActivityTable()) {
        throw new Error("Activity validation failed");
      }
    }
  };

  const handleButtonNext = async () => {
    try {
      await validateStep(current);
      setCurrent((prev) => prev + 1);
    } catch (_) {}
  };

  const prev = () => setCurrent((prev) => prev - 1);

  const buildPayload = (action = "SUBMIT") => {
    const values = form.getFieldsValue(true);
    return {
      ...(isUpdate && { id: parseInt(woContext.woId) }),
      woRefId: values.workOrderReferenceId || null,
      woReference: values.workOrderReference || null,
      source: isSrContext ? "SERVICE_REQUEST" : (values.source || null),
      sourceId: isSrContext ? (woContext.srId || null) : null,
      sourceNumber: values.sourceReference || null,
      woTypeGlbId: values.type ? parseInt(values.type) : null,
      woCategoryGlbId: values.category ? parseInt(values.category) : null,
      woPriorityGlbId: values.priority ? parseInt(values.priority) : null,
      groupGlbId: values.group ? parseInt(values.group) : null,
      description: values.description || null,
      requestDate: values.requestDate ? NxDate.formatForAPI(values.requestDate) : null,
      planCompletionDate: values.completionPlanDate ? NxDate.formatForAPI(values.completionPlanDate) : null,
      dueDate: values.dueDate ? NxDate.formatForAPI(values.dueDate) : null,
      apphierId: values.appHierId ? parseInt(values.appHierId) : null,
      action,
      activities: activityData.map((row, idx) => ({
        woActName: row.woActName || "",
        woActDesc: row.description || null,
        picPositionId: row.picPositionId ? parseInt(row.picPositionId) : null,
        picUserId: row.picUserId ? parseInt(row.picUserId) : null,
        planDate: row.planDate || null,
        activityStatus: row.activityStatus || "PENDING",
        sequenceOrder: row.sequenceOrder || (idx + 1),
        durationDays: row.durationDays ? parseInt(row.durationDays) : null,
        activityTemplDtlId: row.activityTemplDtlId || null,
        isTemplate: row.isTemplate ? "Y" : "N",
      })),
      dataRequirements: (values.woFormDataRequirements || []).map((dr) => ({
        type: dr.typeId ? parseInt(dr.typeId) : null,
        value: dr.value || null,
      })),
    };
  };

  const handleOpenConfirmation = async (submitType) => {
    try {
      const action = submitType === "draft" ? "DRAFT" : "SUBMIT";
      if (submitType === "draft") {
        await form.validateFields(stepFieldMapDraft[0]);
        if (current !== 0) await validateStep(current, "DRAFT");
      } else {
        await validateStep(current, "SUBMIT");
      }
      const payload = buildPayload(action);
      setDataSend(payload);
      setConfirmationType(submitType);
      setModalConfirm(true);
    } catch (_) {}
  };

  const handleConfirmSubmit = async () => {
    setModalConfirm(false);
    setLoadingForm(true);
    const newWoAttachments = attachmentDataSource.filter((a) => a.dataType === "new");
    const newActivityAttachments = activityData.flatMap((row) =>
      (row.attachments || []).filter((a) => a.dataType === "new")
    );
    const allNewAttachments = [...newWoAttachments, ...newActivityAttachments];
    const action = confirmationType === "draft" ? "DRAFT" : "SUBMIT";
    try {
      if (isUpdate && woContext.woId) {
        await dispatch(
          updateWorkOrder({
            accountId,
            woId: woContext.woId,
            body: dataSend,
            attachments: allNewAttachments,
            action,
            successBodyExtra: { return: false },
          })
        ).unwrap();
        goToView(woContext.woId);
      } else {
        const result = await dispatch(
          createWorkOrder({
            accountId,
            body: dataSend,
            attachments: allNewAttachments,
            action,
            successBodyExtra: { return: false },
          })
        ).unwrap();
        goToView(result.id);
      }
    } catch (_) {
    } finally {
      setLoadingForm(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setActivityData([]);
    setAttachmentDataSource([]);
    setDeletedAttachments([]);
  };

  const routes = isSrContext
    ? [
        { path: "", breadcrumbName: "Account" },
        {
          path: woContext.accountType === "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
          breadcrumbName: woContext.accountType === "standard" ? "Account Standard" : "Account One-time",
        },
        { path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD, breadcrumbName: "Detail Account" },
        { path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST,  breadcrumbName: "Service Requests" },
        { path: "", breadcrumbName: isUpdate ? "Update WO" : "Create WO" },
      ]
    : [
        { path: "", breadcrumbName: "Account Management" },
        { path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_WORK_ORDERS, breadcrumbName: "Work Orders" },
        { path: "", breadcrumbName: isUpdate ? "Update" : "Create" },
      ];

  const showHeaderDetail = isSrContext || (!isStandalone) || !!selectedAccountId;

  return (
    <>
      <Spin spinning={isLoading}>
        <Form
          id="woForm"
          form={form}
          layout="vertical"
          preserve={true}
          scrollToFirstError={true}
          className="flex flex-col gap-y-4"
        >
          <NxBreadCrumb routes={routes} />

          {showHeaderDetail && (isSrContext || selectedAccountId) && (
            <HeaderDetail
              data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
              dispatch={dispatch}
              idAccount={isSrContext ? woContext.accountId : selectedAccountId}
              idCustomer={isSrContext ? woContext.idCustomer : null}
              type={isSrContext ? woContext.accountType : selectedAccountType}
              collapsible={true}
            />
          )}

          <NxFormStepper
            steps={steps}
            current={current}
            onPrev={prev}
            onNext={handleButtonNext}
          />

          <div className="steps-content flex flex-col gap-y-4">{steps[current].content}</div>

          {/* Footer */}
          <NxBaseContainer border>
            <div className="flex justify-between">
              <Button type="menu" onClick={() => setModalBack(true)}>
                Cancel
              </Button>
              <div className="flex w-full justify-end gap-x-2">
                <Button
                  onClick={handleClear}
                  type="reject"
                  icon={<SVGIcon name="IconButtonClear" width={14} />}
                >
                  {isUpdate ? "Reset" : "Clear"}
                </Button>
                <Button
                  onClick={() => handleOpenConfirmation("draft")}
                  type="secondary"
                >
                  Save as Draft
                </Button>
                <Button onClick={prev} type="menu" disabled={current < 1}>
                  Previous
                </Button>
                {current < steps.length - 1 && (
                  <Button onClick={handleButtonNext} type="submit">
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    onClick={() => handleOpenConfirmation("submit")}
                    type="submit"
                    loading={loadingForm || loading_createUpdateWo}
                  >
                    Save & Submit
                  </Button>
                )}
              </div>
            </div>
          </NxBaseContainer>
        </Form>
      </Spin>

      <WoConfirmationModal
        isOpen={modalConfirm}
        type={confirmationType}
        formValues={form.getFieldsValue(true)}
        activityData={activityData}
        approvalData={detail_woApprovalHierarchy}
        attachments={attachmentDataSource}
        loading={loadingForm || loading_createUpdateWo}
        handleCancel={() => setModalConfirm(false)}
        handleConfirm={handleConfirmSubmit}
      />

      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => goBack()}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">Are you sure you want to go back?</p>
        </div>
      </ModalConfirm>
    </>
  );
};

export default CreateWorkOrder;
