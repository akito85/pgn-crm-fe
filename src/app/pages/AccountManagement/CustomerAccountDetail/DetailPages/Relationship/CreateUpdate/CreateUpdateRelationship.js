import SVGIcon from "../../../../../../../assets/Icon/index";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderDetail from "../../../HeaderDetail";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import NxApprovalInput from "../../../../../../../components/Nx/NxApprovalInput";
import NxAttachmentInput from "../../../../../../../components/Nx/NxAttachmentInput";
import RelationshipInfo from "./StepContents/InformationForm/RelationshipInfo";
import RelatedDetailCard from "./StepContents/InformationForm/RelatedDetailCard";
import {
  createRelationship,
  getRelationshipApprovalHierarchies,
  getRelationshipApprovalHierarchy,
  getRelationshipAttachmentCategories,
  getRelationshipDraft,
  getRelationship,
  updateRelationship
} from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Spin } from "antd";
import { showModalError, validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import { NxFormStepper } from "../../../../../../../components/Nx/NxFormStepNavigation";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import { configApp } from "../../../../../../../constants/configApp";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import { nxRemoveKeys } from "../../../../../../../components/Nx/NxRemoveKeys";

/**
 * Three-step form (Relationship → Approval → Attachment) for creating or
 * updating a relationship record against an existing account.
 * Supports Standard and One-Time account types. Navigates back to the
 * appropriate account detail page on success.
 *
 * @param {{ formType?: "create" | "update"; accountType?: "standard" | "oneTime"; }} props
 */
const CreateUpdateRelationship = ({
  accountType = "standard",
  formType = "create",
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [form] = Form.useForm();
  const {
    list_relationshipAttachmentCategory,
    list_relationshipApprovalHierarchy,
    list_relationshipType,
    list_relationshipCategory,
    detail_relationshipApprovalHierarchy,
    detail_relationship,
    detailDraft_relationship,
    loading_detailRelationship,
    loading_detailRelationshipApprovalHierarchy,
    loading_listRelationshipApprovalHierarchy,
    loading_detailDraftRelationship,
  } = useSelector((state) => state.relationship);

  // --- State ---
  const [current, setCurrent] = useState(0);
  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");
  const [relatedDetails, setRelatedDetails] = useState([]);

  // --- Derived values ---
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";
  const isCreate = formType === "create";
  const isUpdate = formType === "update";

  const loading =
    loading_detailRelationship ||
    loading_listRelationshipApprovalHierarchy ||
    loading_detailRelationshipApprovalHierarchy ||
    loading_detailDraftRelationship;

  const id = location?.state?.id;
  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;

  const status = detail_relationship.status || "DRAFT";
  const statusApproval = detail_relationship.statusApproval || "DRAFT";

  const isDraft = status === "DRAFT";
  const isActive = status === "ACTIVE";

  const isDraftApproval = statusApproval === "DRAFT";
  const isRejectedApproval = statusApproval === "REJECTED";

  const attachmentIsRequired = true;

  const detail = (isActive && (isDraftApproval || isRejectedApproval))
    ? detailDraft_relationship
    : detail_relationship;

  const attachments = detail.attachments;

  const formFields = [
    [
      "relationshipType",
      "relationshipCategory",
      "relatedName",
      "relatedNumber",
      "startDate",
    ],
    [
      "appHierId",
    ],
    []
  ];
  
  // --- Functions / handlers ---
  /**
   * Fetches and displays the approval hierarchy for the selected option,
   * then sets `appHierName` in the form.
   *
   * @param {number} appHierId
   * @param {string} approvalName
   */
  const handleSelectHierarchy = (appHierId, approvalName) => {
    if (accountId && appHierId)
      dispatch(getRelationshipApprovalHierarchy(appHierId));
    form.setFieldValue("appHierName", approvalName);
  };

  /** Resets the form to its initial state based on `formType`. */
  const handleClear = () => {
    if (isCreate) {
      setAttachmentDataSource([]);
      setDeletedAttachments([]);
      setRelatedDetails([]);
      form.resetFields();
      setCurrent(0);
    } else if (isUpdate) {
      if (detail_relationship && detail_relationship.id) {
        form.setFieldsValue({
          relationshipType: detail.relationshipType,
          relationshipCategory: detail.relationshipCategory,
          relatedName: detail.accountName,
          relatedNumber: detail.accountNumber,
          startDate: detail.startDate,
          endDate: detail.endDate,
          description: detail.description || "",
          appHierId: detail.appHierId,
          appHierName: detail.appHierName,
        });

        const appHierOption = list_relationshipApprovalHierarchy.find(
          (option) => option.appHierId === detail.appHierId
        );
        if (appHierOption)
          handleSelectHierarchy(detail.appHierId, appHierOption.approvalName);
        
        if (detail.relatedDetail && detail.relatedDetail.length > 0) {
          setRelatedDetails(detail.relatedDetail);
        } else {
          setRelatedDetails([]);
        }
      }

      if (attachments)
        setAttachmentDataSource([...attachments]);

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
        if (submitType === "submit") {
          if (current === 2) {
            if (attachmentIsRequired && !attachmentDataSource.length) {
              const errorBody = {
                title: "Failed",
                description: `Please upload at least one attachment`,
              };
              dispatch(showModalError(errorBody));

              throw new Error("There was no file attached");
            }
          } else {
            await form.validateFields(formFields[current]);

            const {
              relationshipType,
              relationshipCategory,
              formAccountId: accountId,
              relatedId: relatedAccountId,
              startDate,
              endDate,
              description,
              appHierId,
            } = form.getFieldsValue(true);

            const body = {
              stepNumber: current + 1,
              type: formType.toUpperCase(),
              id: isUpdate ? id : undefined,
              data: {
                accountId,
                relationshipType,
                relationshipCategory,
                relatedAccountId,
                description,
                startDate: NxDate.formatForAPI(startDate),
                endDate: NxDate.formatForAPI(endDate),
                appHierId,
              }
            };

            await dispatch(validateCreateUpdate({
              body,
              services: accountManagementService,
              endPoint: `/v1/dbs/api/accounts/${accountId}/relationships/validate-step`,
              type: formType,
            })).unwrap();
          }
        } else if (submitType === "draft") {
          await form.validateFields(["relatedName"]);
        } else {
          return;
        }
      } catch (err) {
        return;
      }

      const {
        relationshipType,
        relationshipCategory,
        formAccountId: accountId,
        relatedId: relatedAccountId,
        startDate,
        endDate,
        description,
        appHierId,
      } = form.getFieldsValue(true);

      const body = {
        id: isUpdate ? id : undefined,
        action: submitType,
        accountId,
        relationshipType,
        relationshipCategory,
        relatedAccountId,
        description,
        startDate: NxDate.formatForAPI(startDate),
        endDate: NxDate.formatForAPI(endDate),
        appHierId,
      };

      dispatch(validateCreateUpdate({
        body,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/accounts/${accountId}/relationships/validate-${formType}`,
        type: formType,
      }))
        .unwrap()
        .then(() => {
          setShowConfirmationModal(show);
          setConfirmationType(submitType);
        })
        .catch(() => { });
    } else {
      setShowConfirmationModal(show);
      setConfirmationType("");
    }
  };

  /**
   * Validates the current step and calls
   * `POST /v1/dbs/api/accounts/${accountId}/relationships/validate-step`
   * before advancing to the next step.
   */
  const next = async () => {
    try {
      if (current === 2) {
        if (attachmentIsRequired && !attachmentDataSource.length) {
          const errorBody = {
            title: "Failed",
            description: `Please upload at least one attachment`,
          };
          dispatch(showModalError(errorBody));

          throw new Error("There was no file attached");
        }
      } else {
        await form.validateFields(formFields[current]);
        
        const {
          relationshipType,
          relationshipCategory,
          formAccountId: accountId,
          relatedId: relatedAccountId,
          startDate,
          endDate,
          description,
          appHierId,
        } = form.getFieldsValue(true);

        const body = {
          stepNumber: current + 1,
          type: formType.toUpperCase(),
          id: isUpdate ? id : undefined,
          data: {
            accountId,
            relationshipType,
            relationshipCategory,
            relatedAccountId,
            description,
            startDate: NxDate.formatForAPI(startDate),
            endDate: NxDate.formatForAPI(endDate),
            appHierId,
          }
        };

        await dispatch(validateCreateUpdate({
          body,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/accounts/${accountId}/relationships/validate-step`,
          type: formType,
        })).unwrap();
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

  /** Scrolls the step container right by 250 px. */
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  /** Async wrapper for `next()` bound to the Next button's `onClick`. */
  const handleButtonNext = async () => {
    await next();
    scrollRightHandler();
  };
  
  /** Scrolls the step container left by 250 px. */
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };
  
  /**
   * Builds the submission payload and dispatches `createRelationship` or
   * `updateRelationship`, then uploads new attachments and navigates on success.
  */
 const handleSubmitForm = async () => {
    const {
      relationshipType,
      relationshipCategory,
      formAccountId,
      relatedId,
      startDate,
      endDate,
      description,
      appHierId,
      remark,
    } = form.getFieldsValue(true);

    const attachments = nxRemoveKeys([
      ...attachmentDataSource.filter((a) => ["exist", "draft"].includes(a.dataType)),
      ...deletedAttachments,
    ]);
    // Filter only new attachments (not existing ones)
    const newAttachments = attachmentDataSource.filter((a) => a.dataType === "new");
    
    const payload = {
      relationshipType,
      relationshipCategory,
      relatedAccountId: relatedId,
      accountId: formAccountId,
      startDate: NxDate.formatForAPI(startDate),
      endDate: NxDate.formatForAPI(endDate),
      description,
      appHierId,
      action: confirmationType,
      remark,
      attachments,
    };

    const targetRoute = isStandard
      ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
      : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME;

    try {
      if (isCreate) {
        await dispatch(createRelationship({
          accountId,
          payload,
          attachments: newAttachments
        })).unwrap();
      } else if (isUpdate) {
        await dispatch(updateRelationship({
          accountId,
          idRelationship: id,
          payload,
          attachments: newAttachments
        })).unwrap();
      } else return;
    } catch {
      return
    }

    setTimeout(() => {
      navigate(targetRoute, { state: { idAccount: accountId, idCustomer: customerId } });
    }, 2000);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path:
        isStandard ?
          ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD :
        isOneTime ?
          ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME :
          "",
      breadcrumbName:
        isStandard ?
          "Account - Standard" :
          isOneTime ?
          "Account - One Time" :
          "",
    },
    {
      path:
        isStandard ?
          ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD :
        isOneTime ?
          ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME :
          "",
      breadcrumbName: "Detail Account",
      state: {
        idAccount: accountId,
        idCustomer: customerId,
      }
    },
    {
      path: "",
      breadcrumbName:
        isCreate ? "Create Relationship" : "Update Relationship",
    },
  ];

  const steps = [
    {
      title: "Relationship Information",
      cards: [
        {
          header: "Relationship Information",
          content: (
            <RelationshipInfo
              form={form}
              key={`relationship-tab-0`}
              setRelatedDetails={setRelatedDetails}
              isDraft={isDraft}
              isUpdate={isUpdate}
            />
          )
        },
        {
          header: "Related Detail",
          content: (
            <RelatedDetailCard
              relatedDetails={relatedDetails}
            />
          ),
          hidden: !relatedDetails.length
        }
      ],
      disabled: false,
    },
    {
      title: "Approval",
      cards: [
        {
          header: "Approval",
          content: (
            <NxApprovalInput
            form={form}
              options={list_relationshipApprovalHierarchy}
              hierarchyDetails={detail_relationshipApprovalHierarchy || []}
              handleSelectHierarchy={handleSelectHierarchy}
              loading={loading_detailRelationshipApprovalHierarchy}
              key={`relationship-tab-1`}
            />
          )
        }
      ]
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
            getAPICategory={getRelationshipAttachmentCategories}
            categoryData={list_relationshipAttachmentCategory}
            service={accountManagementService}
            configApplication={configApp.ACCOUNT_SERVICE}
              mandatory={attachmentIsRequired}
              key={`relationship-tab-2`}
              />
          )
        }
      ]
    },
  ];

  // --- Effects ---
  // Fetch approval hierarchy options
  useEffect(() => {
    dispatch(getRelationshipApprovalHierarchies());
  }, []);

  // Fetch relationship record and draft
  useEffect(() => {
    if (formType === "update" && id) {
      dispatch(getRelationship({ accountId, idRelationship: id }));
      dispatch(getRelationshipDraft({ accountId, idRelationship: id }));
    }
  }, [formType, id]);

  // Sync attachment list from loaded record
  useEffect(() => {
    if (isUpdate && attachments)
      setAttachmentDataSource([...attachments.map((attachment) => ({
        ...attachment,
        key: attachment.id,
      }))]);
  }, [attachments]);

  // Pre-fill form fields when record and hierarchy are loaded
  useEffect(() => {
    if (
      isUpdate &&
      list_relationshipApprovalHierarchy.length &&
      list_relationshipType.length &&
      list_relationshipCategory.length
    ) {
      const {
        relationshipType,
        relationshipCategory,
        accountId: formAccountId,
        relatedAccountId: relatedId,
        relatedAccountName: relatedName,
        relatedAccountNumber: relatedNumber,
        startDate,
        endDate,
        description,
        appHierId,
        relatedDetail
      } = detail;

      form.setFieldsValue({
        relationshipType,
        relationshipCategory,
        formAccountId,
        relatedId,
        relatedName,
        relatedNumber,
        startDate,
        endDate,
        description,
        appHierId,
      });

      const appHierOption = list_relationshipApprovalHierarchy.find(
        (option) => option.appHierId === appHierId
      );

      if (appHierOption)
        handleSelectHierarchy(appHierId, appHierOption.approvalName);

      if (Array.isArray(relatedDetail))
        setRelatedDetails(detail.relatedDetail);
    }
  }, [detail, list_relationshipApprovalHierarchy, formType]);

  return (
    <>
      <div>
        <div className="flex flex-col gap-y-4">
          <NxBreadCrumb routes={routes} />
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            idAccount={accountId}
            idCustomer={customerId}
            type={accountType}
          />
          <Spin spinning={loading}>
            <Form
              id="relationshipForm"
              form={form}
              layout={"vertical"}
              onFinish={handleSubmitForm}
              scrollToFirstError={true}
              className="flex flex-col gap-y-4"
            >
              {/* Step Contents */}
              <NxFormStepper steps={steps} current={current} onPrev={prev} onNext={handleButtonNext} />

              {steps.map((step, stepIndex) =>
                step.cards.map((card, cardIndex) => (
                  <NxCardContainer header={card.header} className={`${current !== stepIndex || card.hidden ? "hidden" : ""}`} key={`${stepIndex}-${cardIndex}`}>
                    <NxBaseContainer border>
                      {card.content}
                    </NxBaseContainer>
                  </NxCardContainer>
                ))
              )}

              {/* Section Action Steps */}
              <NxBaseContainer border>
                <div className="flex justify-between">
                  <Button
                    type="menu"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <div className="flex w-full justify-end gap-x-2">
                    <Button
                      icon={<SVGIcon name="IconButtonClear" width={14} />}
                      type="reject"
                      onClick={handleClear}
                    >
                      {isCreate ? "Clear" : "Reset"} Data
                    </Button>
                    <Button
                      onClick={() => handleSetShowConfirmationModal(true, "draft")}
                      type={"secondary"}
                    >
                      Save as Draft
                    </Button>
                      <Button
                        onClick={() => {
                          prev();
                          scrollLeftHandler();
                        }}
                        type="menu"
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
                          onClick={() => handleSetShowConfirmationModal(true, "submit")}
                          type={"approve"}
                        >
                          Submit
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </NxBaseContainer>
              <ConfirmationModal
                form={form}
                formId={"relationshipForm"}
                isOpen={showConfirmationModal}
                handleCancel={() => handleSetShowConfirmationModal(false)}
                approvalData={detail_relationshipApprovalHierarchy || []}
                type={confirmationType}
                attachmentDataSource={attachmentDataSource}
                configApplication={configApp.ACCOUNT_SERVICE}
                service={accountManagementService}
                relatedDetails={relatedDetails}
                handleSubmitForm={handleSubmitForm}
              />
            </Form>
          </Spin>
        </div>
      </div>
    </>
  );
};

export default CreateUpdateRelationship;
