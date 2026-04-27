import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Spin } from "antd";
import InfoGasDeposit from "./StepContents/InformationForm/InfoGasDeposit";
import GasDepositBulkTable from "./StepContents/InformationForm/GasDepositBulkTable";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../constants/configApp";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../components/Nx/NxBreadCrumb";
import { NxFormStepper } from "../../../../../components/Nx/NxFormStepNavigation";
import { nxRemoveKeys } from "../../../../../components/Nx/NxRemoveKeys";
import GasDepositDetailTable from "../GasDepositDetailTable";
import NxApprovalInput from "../../../../../components/Nx/NxApprovalInput";
import {
  getGdAttachmentCategories,
  recalculateGasDeposit,
  expireGasDeposit,
  getGasDeposit,
  getGasDepositDraft,
  getGdApprovalHierarchy,
  getGdApprovalHierarchies,
} from "../../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import NxAttachmentInput from "../../../../../components/Nx/NxAttachmentInput";
import SVGIcon from "../../../../../assets/Icon/index";
import HeaderDetail from "../../CustomerAccountDetail/HeaderDetail";

/**
 * Three-step form (Gas Deposit → Approval → Attachment) for submitting a
 * recalculate or expire request against an existing gas deposit record.
 * Supports Standard and One-Time account types. Navigates back to the
 * appropriate account detail page on success.
 *
 * @param {{ formType: "recalculate" | "expire"; accountType?: "standard" | "oneTime"; isBulk?: boolean; }} props
 */
const RecalculateExpireGasDeposit = ({ formType, accountType, isBulk = false }) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    loading_listGdApprovalHierarchy,
    loading_detailGdApprovalHierarchy,
    loading_detailGd,
    loading_detailDraftGd,
    loading_recalculateExpireGd,
    list_gdApprovalHierarchy,
    detail_gdApprovalHierarchy,
    detail_gasDeposit,
    detailDraft_gasDeposit,
    list_gdAttachmentCategory,
  } = useSelector((state) => state.gasDeposit);

  // --- State ---
  const [current, setCurrent] = useState(0);
  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  // Bulk-only: selection and expand tracking (needed for submission + confirmation modal)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openedMemo, setOpenedMemo] = useState({});

  // --- Derived values ---
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";
  const isRecalculate = formType === "recalculate";
  const isExpire = formType === "expire";

  const loading =
    loading_listGdApprovalHierarchy ||
    loading_detailGdApprovalHierarchy ||
    loading_detailGd ||
    loading_detailDraftGd ||
    loading_recalculateExpireGd;

  const accountId = location?.state?.accountId;
  const customerId = location?.state?.customerId;
  const id = location?.state?.id;

  const status = detail_gasDeposit.status || "DRAFT";
  const statusApproval = detail_gasDeposit.statusApproval || "DRAFT";

  const isActive = location.state?.status === "ACTIVE" || status === "ACTIVE";

  const isDraftApproval = location.state?.statusApproval === "DRAFT" || statusApproval === "DRAFT";
  const isRejectApproval = location.state?.statusApproval === "REJECT" || statusApproval === "REJECT";

  const handleType = (isDraftApproval || isRejectApproval) ? "UPDATE" : "CREATE";

  const attachmentIsRequired = false;

  const detail = (isActive && (isDraftApproval || isRejectApproval)) ? detailDraft_gasDeposit : detail_gasDeposit;
  const parentKey = (isActive && (isDraftApproval || isRejectApproval))
    ? "detailDraft_gasDeposit"
    : "detail_gasDeposit";
  const { attachments } = detail;

  const formFields = [
    [],
    ["appHierId"],
    []
  ];

  // --- Effects ---
  // Fetch gas deposit record (single mode only)
  useEffect(() => {
    if (!isBulk && id) dispatch(getGasDeposit({ id }));
  }, [id, isBulk]);

  // Fetch draft when record is active with pending approval
  useEffect(() => {
    if (id && isActive && (isDraftApproval || isRejectApproval))
      dispatch(getGasDepositDraft({ id }));
  }, [id, isActive, isDraftApproval, isRejectApproval]);

  // Pre-fill form fields when record and hierarchy are loaded
  useEffect(() => {
    if (list_gdApprovalHierarchy.length) {
      const {
        accountId,
        appHierId,
      } = detail;

      form.setFieldsValue({
        accountId,
        appHierId
      });

      const appHierOption = list_gdApprovalHierarchy.find(
        (option) => option.appHierId === appHierId
      );

      if (appHierOption)
        handleSelectHierarchy(appHierId, appHierOption.approvalName);
    }
  }, [detail, list_gdApprovalHierarchy]);

  // Sync attachment list from loaded record
  useEffect(() => {
    if (Array.isArray(attachments))
      setAttachmentDataSource([...attachments.map((attachment) => ({
        ...attachment,
        key: attachment.id,
      }))]);
  }, [attachments]);

  // Fetch approval hierarchy options
  useEffect(() => {
    dispatch(getGdApprovalHierarchies());
  }, []);

  // --- Functions / handlers ---
  /**
   * Fetches and displays the approval hierarchy for the selected option,
   * then sets `appHierName` in the form.
   *
   * @param {number} appHierId
   * @param {string} approvalName
   */
  const handleSelectHierarchy = (appHierId, approvalName) => {
    dispatch(getGdApprovalHierarchy(appHierId));
    form.setFieldValue("appHierName", approvalName);
  };

  const onExpand = (expanded, record) => {
    if (expanded) setOpenedMemo((prev) => ({ ...prev, [record.id]: true }));
  };

  /** Resets the form to its initial state based on `formType`. */
  const handleReset = () => {
    if (isRecalculate) {
      setAttachmentDataSource([]);
      setDeletedAttachments([]);
      form.resetFields();
      setCurrent(0);
    } else if (isExpire) {
      if (list_gdApprovalHierarchy?.length) {
        const { accountId, appHierId } = detail;

        form.setFieldsValue({ accountId, appHierId });

        const appHierOption = list_gdApprovalHierarchy.find(
          (option) => option.appHierId === appHierId
        );

        if (appHierOption)
          handleSelectHierarchy(appHierId, appHierOption.approvalName);
      }

      if (attachments)
        setAttachmentDataSource([...attachments.map((attachment) => ({
          ...attachment,
          key: attachment.id,
        }))]);

      setDeletedAttachments([]);
      setCurrent(0);
    }
  };

  /**
   * Validates the current step (and runs pre-submission API validation for
   * "submit" actions) before opening the confirmation modal.
   *
   * @param {boolean} show
   * @param {"draft" | "submit"} submitType
   */
  const handleSetShowConfirmationModal = async (show, submitType) => {
    if (show) {
      try {
        if (["submit", "draft"].includes(submitType)) {
          if (submitType === "submit") {
            if (current === 2) {
              if (attachmentIsRequired && !attachmentDataSource.length) {
                const errorBody = {
                  title: "Failed",
                  description: `Please upload at least one attachment`
                };
                dispatch(showModalError(errorBody));

                throw new Error("There was no file attached");
              }
            } else {
              await form.validateFields(formFields[current]);

              const {
                appHierId
              } = form.getFieldsValue(true);

              const body = {
                stepNumber: current + 1,
                type: handleType,
                id,
                data : {
                  gasDepositIds: isBulk ? selectedRowKeys : [id],
                  appHierId,
                }
              }

              await dispatch(
                validateCreateUpdate({
                  body,
                  services: accountManagementService,
                  endPoint: `/v1/dbs/api/gas-deposit/${formType}/validate-step`,
                  type: formType
                })
              ).unwrap();
            }
          }
        } else
          return;
      } catch (err) {
        return;
      }

      const { appHierId } =
        form.getFieldsValue(true);

      const body = {
        id,
        accountId,
        appHierId,
        action: submitType
      };

      try {
        await dispatch(
          validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/gas-deposit/validate-${formType}`,
            type: formType
          })
        ).unwrap()
      } catch {
        return;
      }

      setShowConfirmationModal(show);
      setConfirmationType(submitType);
    } else {
      setShowConfirmationModal(show);
      setConfirmationType("");
    }
  };

  /**
   * Validates the current step and calls `POST /v1/dbs/api/gas-deposit/validate-step`
   * before advancing to the next step.
   */
  const next = async () => {
    if (isBulk && current === 0) {
      if (!selectedRowKeys.length) {
        dispatch(showModalError({ title: "Failed", description: "Please select at least one record" }));
        return;
      }
      setCurrent(current + 1);
      return;
    }

    try {
      if (current === 2) {
        if (attachmentIsRequired && !attachmentDataSource.length) {
          const errorBody = {
            title: "Failed",
            description: `Please upload at least one attachment`
          };
          dispatch(showModalError(errorBody));

          throw new Error("There was no file attached");
        }
      } else {
        await form.validateFields(formFields[current]);

        const {
          appHierId
        } = form.getFieldsValue(true);

        const body = {
          stepNumber: current + 1,
          type: handleType,
          id,
          data : {
            gasDepositIds: isBulk ? selectedRowKeys : [id],
            appHierId,
          }
        }

        await dispatch(
          validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/gas-deposit/${formType}/validate-step`,
            type: formType
          })
        ).unwrap();
      }
    } catch (err) {
      return;
    }

    setCurrent(current + 1);
  };

  /** Moves back one step without validation. */
  const prev = () => {
    setCurrent(current - 1);
  };

  /** Async wrapper for `next()` bound to the Next button's `onClick`. */
  const handleButtonNext = async () => {
    await next();
  };

  /**
   * Builds the submission payload and dispatches `recalculateGasDeposit` or
   * `expireGasDeposit`, then uploads new attachments and navigates on success.
   */
  const handleSubmitForm = async () => {
    const {
      appHierId,
      remark
    } = form.getFieldsValue(true);

    const attachments = nxRemoveKeys([
      ...attachmentDataSource.filter(
        attachment => ["exist", "draft"].includes(attachment.dataType)
      ),
      ...deletedAttachments
    ]);

    const body = {
      appHierId,
      action: confirmationType,
      gasDepositIds: isBulk ? selectedRowKeys : [id],
      remark,
      attachments
    };

    const newAttachments = attachmentDataSource.filter((a) => a.dataType === "new");

    const navigateTarget = isStandard
      ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
      : isOneTime
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
        : ACCOUNT_MANAGEMENT_ROUTES.VIEW_GAS_DEPOSIT_SA;

    try {
      if (isRecalculate) {
        await dispatch(
          recalculateGasDeposit({
            body,
            attachments: newAttachments,
            action: confirmationType.toUpperCase()
          })
        ).unwrap();
      } else if (isExpire) {
          await dispatch(
          expireGasDeposit({
            body,
            attachments: attachmentDataSource.filter(
              (attachment) => attachment.dataType === "new"
            ),
            action: confirmationType.toUpperCase()
          })
        ).unwrap();
      } else
        return
    } catch {
      return
    }

    setTimeout(() => {
      navigate(navigateTarget, {
        state: {
          accountId,
          customerId
        }
      });
    }, 2000);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Account"
    },
    {
      path: isStandard
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
        : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
      breadcrumbName: isStandard ? "Account - Standard" : "Account - One Time"
    },
    {
      path: isStandard
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
        : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
      breadcrumbName: "Detail Account",
      state: {
        accountId,
        customerId
      }
    },
    {
      path: "",
      breadcrumbName:
        formType === "recalculate"
          ? "Recalculate Gas Deposit"
          : formType === "expire"
            ? "Expire Gas Deposit"
            : ""
    }
  ];

  const steps = [
    {
      title: "Gas Deposit",
      cards: [
        !isBulk && {
          header: "Gas Deposit Information",
          content: (
            <InfoGasDeposit
              detail={detail}
              key="tab-0-card-0"
            />
          )
        },
        !isBulk && {
          header: "Gas Deposit Detail",
          content: (
            <GasDepositDetailTable
              id={id}
              parentKey={parentKey}
              key="tab-0-card-1"
            />
          )
        },
        isBulk && {
          header: "Gas Deposit List",
          content: (
            <GasDepositBulkTable
              accountId={accountId}
              selectedRowKeys={selectedRowKeys}
              onSelectionChange={setSelectedRowKeys}
              openedMemo={openedMemo}
              onExpand={onExpand}
            />
          )
        }
      ].filter(Boolean),
      disabled: false,
      key: "tab-0",
    },
    {
      title: "Approval",
      cards: [
        {
          header: "Approval",
          content: (
            <NxApprovalInput
              form={form}
              hierarchyDetails={detail_gdApprovalHierarchy}
              options={list_gdApprovalHierarchy}
              handleSelectHierarchy={handleSelectHierarchy}
              key="tab-1-card-0"
            />
          )
        }
      ],
      disabled: false,
      key: "tab-1",
    },
    {
      title: "Attachment",
      cards: [
        {
          header: "Attachment",
          content: (
            <NxAttachmentInput
              data={attachmentDataSource}
              updateData={setAttachmentDataSource}
              setDeleted={setDeletedAttachments}
              getAPICategory={getGdAttachmentCategories}
              categoryData={list_gdAttachmentCategory}
              service={accountManagementService}
              configApplication={configApp.ACCOUNT_SERVICE}
              mandatory={attachmentIsRequired}
              key="tab-2-card-0"
            />
          )
        }
      ],
      key: "tab-2",
      disabled: false
    }
  ];

  return (
    <div>
      <div className="flex flex-col gap-y-4">
        <NxBreadCrumb routes={routes} />
        {!isBulk && accountId && customerId && (
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={accountId}
            idCustomer={customerId}
            type={accountType}
          />
        )}
        <Spin spinning={loading}>
          <Form
            id="gasDepositForm"
            form={form}
            layout={"vertical"}
            onFinish={handleSubmitForm}
            scrollToFirstError={true}
            className="flex flex-col gap-y-4"
          >
            {/* Step Contents */}
            <NxFormStepper
              steps={steps}
              current={current}
              onPrev={prev}
              onNext={handleButtonNext}
            />

            {steps.map((step, stepIndex) =>
              step.cards.map((card, cardIndex) => (
                <NxCardContainer
                  header={card.header}
                  className={`${current !== stepIndex || card.hidden ? "hidden" : ""}`}
                  key={`${stepIndex}-${cardIndex}`}
                >
                  <NxBaseContainer border>{card.content}</NxBaseContainer>
                </NxCardContainer>
              ))
            )}

            {/* Section Action Steps */}
            <NxBaseContainer border>
              <div className="flex justify-between">
                <Button
                  type={"menu"}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </Button>
                <div className="flex w-full justify-end gap-x-2">
                  <Button
                    onClick={handleReset}
                    type={"reject"}
                    icon={<SVGIcon name="IconButtonClear" width={14} />}
                  >
                    {isExpire ? "Reset" : "Clear"} Data
                  </Button>
                  <Button
                    onClick={() =>
                      handleSetShowConfirmationModal(true, "draft")
                    }
                    type={"secondary"}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => {
                      prev();
                    }}
                    type={"menu"}
                    disabled={current < 1}
                  >
                    Previous
                  </Button>
                  {current < steps.length - 1 && (
                    <Button
                      onClick={handleButtonNext}
                      type={"submit"}
                      disabled={steps[current].disabled}
                    >
                      Next
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <>
                      <Button
                        onClick={() =>
                          handleSetShowConfirmationModal(true, "submit")
                        }
                        type={"submit"}
                      >
                        Save & Submit
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </NxBaseContainer>
            <ConfirmationModal
              form={form}
              formId={"gasDepositForm"}
              isOpen={showConfirmationModal}
              handleCancel={() => handleSetShowConfirmationModal(false)}
              approvalData={detail_gdApprovalHierarchy}
              type={confirmationType}
              attachmentDataSource={attachmentDataSource}
              service={accountManagementService}
              accountId={accountId}
              configApplication={configApp.ACCOUNT_SERVICE}
              loading={loading_recalculateExpireGd}
              detail={detail}
              id={id}
              parentKey={parentKey}
              handleSubmitForm={handleSubmitForm}
              isBulk={isBulk}
              selectedRowKeys={selectedRowKeys}
              openedMemo={openedMemo}
              onExpand={onExpand}
            />
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default RecalculateExpireGasDeposit;
