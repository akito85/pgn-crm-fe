import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Spin } from "antd";
import InfoInvoiceRelation from "./StepContents/InformationForm/InfoInvoiceRelation";
import NxApprovalInput from "../../../../../../../../components/Nx/NxApprovalInput";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  createInvoiceRelation,
  getInvoiceRelationDraft,
  getInvoiceRelation,
  getIrApprovalHierarchy,
  getIrApprovalHierarchies,
  getIrAttachmentCategories,
  updateInvoiceRelation
} from "../../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import {
  showModalError,
  validateCreateUpdate
} from "../../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../../../../constants/configApp";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../../components/Nx/NxBreadCrumb";
import { NxFormStepper } from "../../../../../../../../components/Nx/NxFormStepNavigation";
import HeaderDetail from "../../../../HeaderDetail";
import NxDate from "../../../../../../../../components/Nx/NxDatePicker";
import { nxRemoveKeys } from "../../../../../../../../components/Nx/NxRemoveKeys";

/**
 * Three-step form (Invoice Relation → Approval → Attachment) for creating or
 * updating an invoice relation record. Supports Standard and One-Time account
 * types. Navigates back to the appropriate account detail page on success.
 *
 * @param {{ formType?: "create" | "update"; accountType?: "standard" | "oneTime"; }} props
 */
const CreateUpdateInvoiceRelation = ({ formType = "create", accountType = "standard" }) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const containerRef = useRef(null);
  const {
    loading_listIrApprovalHierarchy,
    loading_detailIrApprovalHierarchy,
    loading_detailIr,
    loading_detailDraftIr,
    loading_createUpdateIr,
    list_irApprovalHierarchy,
    detail_irApprovalHierarchy,
    detail_invoiceRelation,
    detailDraft_invoiceRelation,
    list_irAttachmentCategory,
  } = useSelector((state) => state.invoiceRelation);

  // --- State ---
  const [current, setCurrent] = useState(0);
  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  // --- Derived values ---
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";
  const isCreate = formType === "create";
  const isUpdate = formType === "update";

  const loading =
    loading_listIrApprovalHierarchy ||
    loading_detailIrApprovalHierarchy ||
    loading_detailIr ||
    loading_detailDraftIr;

  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;
  const id = location?.state?.id;

  const status = location.state?.status || detail_invoiceRelation.status || "DRAFT";
  const statusApproval = location.state?.statusApproval || detail_invoiceRelation.statusApproval || "DRAFT";

  const isDraft = status === "DRAFT";
  const isActive = status === "ACTIVE";

  const isDraftApproval = statusApproval === "DRAFT";
  const isRejectedApproval = statusApproval === "REJECTED";

  const attachmentIsRequired = true;

  const detail = (isActive && (isDraftApproval || isRejectedApproval)) ? detailDraft_invoiceRelation : detail_invoiceRelation;
  const attachments = detail.attachments;

  const formFields = [
    ["accountNumber", "accountName", "startDate", "endDate", "description"],
    ["appHierId"],
    []
  ];

  // --- Effects ---
  // Fetch invoice relation record and draft on update
  useEffect(() => {
    if (isUpdate && id) {
      if (isActive && (isDraftApproval || isRejectedApproval))
        dispatch(getInvoiceRelationDraft(id));
      else
        dispatch(getInvoiceRelation(id));
    }
  }, [isUpdate, id, accountId, isActive, isDraftApproval, isRejectedApproval]);

  // Pre-fill form fields when record and hierarchy are loaded
  useEffect(() => {
    if (isUpdate && list_irApprovalHierarchy.length) {
      const {
        accountId,
        accountNumber,
        accountName,
        startDate,
        endDate,
        description,
        appHierId,
      } = detail;

      form.setFieldsValue({
        accountId,
        accountName,
        accountNumber,
        startDate,
        endDate,
        description,
        appHierId
      });

      const appHierOption = list_irApprovalHierarchy.find(
        (option) => option.appHierId === appHierId
      );

      if (appHierOption)
        handleSelectHierarchy(appHierId, appHierOption.approvalName);
    }
  }, [detail, list_irApprovalHierarchy]);

  // Sync attachment list from loaded record
  useEffect(() => {
    if (isUpdate && attachments)
      setAttachmentDataSource([...attachments.map((attachment) => ({
        ...attachment,
        key: attachment.id,
      }))]);
  }, [detail]);

  // Fetch approval hierarchy options
  useEffect(() => {
    dispatch(getIrApprovalHierarchies());
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
    dispatch(getIrApprovalHierarchy(appHierId));
    form.setFieldValue("appHierName", approvalName);
  };

  /**
   * Sets the related account fields (`accountId`, `accountNumber`, `accountName`)
   * in the form after the user selects an account.
   *
   * @param {string} accountId
   * @param {string} accountNumber
   * @param {string} accountName
   */
  const setAccount = (accountId, accountNumber, accountName) => {
    form.setFieldValue("accountId", accountId);
    form.setFieldValue("accountNumber", accountNumber);
    form.setFieldValue("accountName", accountName);
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
              accountId : relatedAccountId,
              description,
              startDate,
              endDate,
              appHierId
            } = form.getFieldsValue(true);

            const body = {
              stepNumber: current + 1,
              type: formType.toUpperCase(),
              id,
              data : {
                accountId,
                relatedAccountId,
                description,
                startDate: NxDate.formatForAPI(startDate),
                endDate: NxDate.formatForAPI(endDate),
                appHierId,
              }
            }

            await dispatch(
              validateCreateUpdate({
                body,
                services: accountManagementService,
                endPoint: `/v1/dbs/api/invoice-relation/validate-step`,
                type: formType
              })
            ).unwrap();
          }
        } else if (submitType === "draft")
          await form.validateFields(["accountNumber", "accountName"]);
        else
          return;
      } catch (err) {
        return;
      }

      const { accountId: relatedAccountId, description, startDate, endDate, appHierId } =
        form.getFieldsValue(true);

      const body = {
        id,
        accountId,
        relatedAccountId,
        description,
        startDate: NxDate.formatForAPI(startDate),
        endDate: NxDate.formatForAPI(endDate),
        appHierId,
        action: submitType
      };

      dispatch(
        validateCreateUpdate({
          body,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/invoice-relation/validate-${formType}`,
          type: formType
        })
      )
        .unwrap()
        .then((data) => {
          setShowConfirmationModal(show);
          setConfirmationType(submitType);
        })
        .catch(() => {});
    } else {
      setShowConfirmationModal(show);
      setConfirmationType("");
    }
  };

  /**
   * Validates the current step and calls `POST /v1/dbs/api/invoice-relation/validate-step`
   * before advancing to the next step.
   */
  const next = async () => {
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
          accountId: relatedAccountId,
          description,
          startDate,
          endDate,
          appHierId
        } = form.getFieldsValue(true);

        const body = {
          stepNumber: current + 1,
          type: formType.toUpperCase(),
          id,
          data : {
            accountId,
            relatedAccountId,
            description,
            startDate: NxDate.formatForAPI(startDate),
            endDate: NxDate.formatForAPI(endDate),
            appHierId,
          }
        }

        await dispatch(
          validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/invoice-relation/validate-step`,
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

  /**
   * Validates all intermediate steps sequentially before jumping directly to
   * `newCurrent`. Stops and focuses the first failing step.
   *
   * @param {number} newCurrent
   */
  const handleSetCurrent = async (newCurrent) => {
    for (let i = current; i < newCurrent; i++) {
      try {
        if (i === 2) {
          if (attachmentIsRequired && !attachmentDataSource.length) {
            const errorBody = {
              title: "Failed",
              description: `Please upload at least one attachment`
            };
            dispatch(showModalError(errorBody));

            throw new Error("There was no file attached");
          }
        } else {
          await form.validateFields(formFields[i]);

          const {
            accountId: relatedAccountId,
            description,
            startDate,
            endDate,
            appHierId
          } = form.getFieldsValue(true);

          const body = {
            stepNumber: current + 1,
            type: formType.toUpperCase(),
            id,
            data : {
              accountId,
              relatedAccountId,
              description,
              startDate: NxDate.formatForAPI(startDate),
              endDate: NxDate.formatForAPI(endDate),
              appHierId,
            }
          }

          await dispatch(
            validateCreateUpdate({
              body,
              services: accountManagementService,
              endPoint: `/v1/dbs/api/invoice-relation/validate-step`,
              type: formType
            })
          ).unwrap();
        }
      } catch (err) {
        setCurrent(i);
        return;
      }
    }

    setCurrent(newCurrent);
  };

  /** Scrolls the step header container to the right by 250 px. */
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  /** Scrolls the step header container to the left by 250 px. */
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  /** Async wrapper for `next()` bound to the Next button's `onClick`, also scrolls right. */
  const handleButtonNext = async () => {
    await next();
    scrollRightHandler();
  };

  /**
   * Builds the submission payload and dispatches `createInvoiceRelation` or
   * `updateInvoiceRelation`, then uploads new attachments and navigates on success.
   */
  const handleSubmitForm = () => {
    const {
      accountId: relatedAccountId,
      description,
      startDate,
      endDate,
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
      accountId,
      relatedAccountId,
      description,
      startDate: NxDate.formatForAPI(startDate),
      endDate: NxDate.formatForAPI(endDate),
      appHierId,
      action: confirmationType,
      remark,
      attachments
    };

    // Filter only new attachments (not existing ones)
    const newAttachments = attachmentDataSource.filter((a) => a.dataType === "new");

    const navigateTarget = isStandard
      ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
      : isOneTime
        ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
        : "";

    if (isCreate)
      dispatch(createInvoiceRelation({ body, attachments: newAttachments, action: confirmationType.toUpperCase() }))
        .unwrap()
        .then((data) => {
          setTimeout(() => {
            navigate(navigateTarget, {
              state: {
                idAccount: accountId,
                idCustomer: customerId
              }
            });
          }, 2000);
        })
        .catch((error) => {});
    else if (isUpdate)
      dispatch(
        updateInvoiceRelation({
          id,
          body,
          attachments: attachmentDataSource.filter(
            (attachment) => attachment.dataType === "new"
          ),
          action: confirmationType.toUpperCase()
        })
      )
        .unwrap()
        .then((data) => {
          setTimeout(() => {
            navigate(navigateTarget, {
              state: {
                idAccount: accountId,
                idCustomer: customerId
              }
            });
          }, 2000);
        })
        .catch((error) => {});
  };

  /** Resets the form to its initial state based on `formType`. */
  const handleClear = () => {
    if (isCreate) {
      setAttachmentDataSource([]);
      setDeletedAttachments([]);
      form.resetFields();
      setCurrent(0);
    } else if (isUpdate) {
      if (list_irApprovalHierarchy?.length) {
        const {
          accountId,
          startDate,
          endDate,
          description,
          appHierId,
          accountName,
          accountNumber,
        } = detail;

        form.setFieldsValue({
          accountId,
          accountName,
          accountNumber,
          startDate: NxDate.formatForAPI(startDate),
          endDate: NxDate.formatForAPI(endDate),
          description,
          appHierId
        });

        const appHierOption = list_irApprovalHierarchy.find(
          (option) => option.appHierId === appHierId
        );

        if (appHierOption)
          handleSelectHierarchy(appHierId, appHierOption.approvalName);
      }

      if (attachments)
        setAttachmentDataSource([...attachments]);

      setDeletedAttachments([]);

      setCurrent(0);
    }
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
        idAccount: accountId,
        idCustomer: customerId
      }
    },
    {
      path: "",
      breadcrumbName:
        formType === "create"
          ? "Create Invoice Relation"
          : formType === "update"
            ? "Update Invoice Relation"
            : ""
    }
  ];

  const steps = [
    {
      title: "Invoice Relation",
      cards: [
        {
          header: "Invoice Relation Information",
          content: (
            <InfoInvoiceRelation
              form={form}
              setAccount={setAccount}
              accountId={accountId}
              isUpdate={isUpdate}
              isDraft={isDraft}
              key={`invoice-relation-tab-0`}
            />
          )
        }
      ],
      disabled: false
    },
    {
      title: "Approval",
      cards: [
        {
          header: "Approval",
          content: (
            <NxApprovalInput
              form={form}
              hierarchyDetails={detail_irApprovalHierarchy}
              options={list_irApprovalHierarchy}
              handleSelectHierarchy={handleSelectHierarchy}
              key={`invoice-relation-tab-1`}
            />
          )
        }
      ],
      disabled: false
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
              key={`invoice-relation-tab-2`}
              getAPICategory={getIrAttachmentCategories}
              categoryData={list_irAttachmentCategory}
              service={accountManagementService}
              configApplication={configApp.ACCOUNT_SERVICE}
              mandatory={attachmentIsRequired}
            />
          )
        }
      ],
      disabled: false
    }
  ];

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <NxBreadCrumb routes={routes} />
        <HeaderDetail
          data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          dispatch={dispatch}
          idAccount={accountId}
          idCustomer={customerId}
          type={accountType}
          collapsible
        />
        <Spin spinning={loading}>
          <Form
            id="invoiceRelationForm"
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
                    onClick={handleClear}
                    type={"reject"}
                    icon={<SVGIcon name="IconButtonClear" width={14} />}
                  >
                    {isUpdate ? "Reset" : "Clear"} Data
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
                      scrollLeftHandler();
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
                    <Button
                      onClick={() =>
                        handleSetShowConfirmationModal(true, "submit")
                      }
                      type={"approve"}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </NxBaseContainer>
            <ConfirmationModal
              form={form}
              formId={"invoiceRelationForm"}
              isOpen={showConfirmationModal}
              handleCancel={() => handleSetShowConfirmationModal(false)}
              approvalData={detail_irApprovalHierarchy}
              type={confirmationType}
              attachmentDataSource={attachmentDataSource}
              service={accountManagementService}
              configApplication={configApp.ACCOUNT_SERVICE}
              loading={loading_createUpdateIr}
              handleSubmitForm={handleSubmitForm}
            />
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default CreateUpdateInvoiceRelation;
