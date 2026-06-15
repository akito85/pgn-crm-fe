import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Spin } from "antd";
import InfoPaymentRelation from "./StepContents/InformationForm/InfoPaymentRelation";
import NxApprovalInput from "../../../../../../../../components/Nx/NxApprovalInput";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  createPaymentRelation,
  getPaymentRelationDraft,
  getPaymentRelation,
  getPrApprovalHierarchy,
  getPrApprovalHierarchies,
  getPrAttachmentCategories,
  updatePaymentRelation
} from "../../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
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

const CreateUpdatePaymentRelation = ({ formType = "create", accountType = "standard" }) => {
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const dispatch = useDispatch();

  const isCreate = formType === "create";
  const isUpdate = formType === "update";

  const {
    loading_listPrApprovalHierarchy,
    loading_detailPrApprovalHierarchy,
    loading_detailPr,
    loading_detailDraftPr,
    loading_createUpdatePr,
    list_prApprovalHierarchy,
    detail_prApprovalHierarchy,
    detail_paymentRelation,
    detailDraft_paymentRelation,
    list_prAttachmentCategory
  } = useSelector((state) => state.paymentRelation);

  const loading =
    loading_listPrApprovalHierarchy ||
    loading_detailPrApprovalHierarchy ||
    loading_detailPr ||
    loading_detailDraftPr;

  //declare
  const location = useLocation();
  const [form] = Form.useForm();
  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;
  const id = location?.state?.id;

  const status = location.state?.status || detail_paymentRelation.status || "DRAFT";
  const statusApproval = location.state?.statusApproval || detail_paymentRelation.statusApproval || "DRAFT";

  const isDraft = status?.toUpperCase() === "DRAFT";
  const isActive = status?.toUpperCase() === "ACTIVE";

  const isDraftApproval = statusApproval?.toUpperCase() === "DRAFT";
  const isRejectedApproval = statusApproval?.toUpperCase() === "REJECTED";

  //state
  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const attachmentIsRequired = true;

  const detail = (isActive && (isDraftApproval || isRejectedApproval)) ? detailDraft_paymentRelation : detail_paymentRelation;
  const attachments = detail.attachments;

  const formFields = [
    [
      "accountNumber",
      "accountName",
      "priority",
      "startDate",
      "endDate",
      "description"
    ],
    ["appHierId"],
    []
  ];

  useEffect(() => {
    if (isUpdate && id) {
      if (isActive && (isDraftApproval || isRejectedApproval))
        dispatch(getPaymentRelationDraft(id));
      else
        dispatch(getPaymentRelation(id));
    }
  }, [isUpdate, id, accountId, isActive, isDraftApproval, isRejectedApproval]);

  useEffect(() => {
    if (!isUpdate) return;
    const {
      accountId,
      priority,
      startDate,
      endDate,
      description,
      appHierId,
      accountNumber,
      accountName
    } = detail;

    if (accountId || accountNumber || priority) {
      form.setFieldsValue({
        accountId,
        accountName,
        accountNumber,
        priority,
        startDate,
        endDate,
        description,
        appHierId
      });
    }
  }, [detail]);

  useEffect(() => {
    if (!isUpdate || !list_prApprovalHierarchy.length) return;
    const { appHierId } = detail;
    const appHierOption = list_prApprovalHierarchy.find(
      (option) => option.appHierId === appHierId
    );
    if (appHierOption)
      handleSelectHierarchy(appHierId, appHierOption.approvalName);
  }, [detail, list_prApprovalHierarchy]);

  useEffect(() => {
    if (isUpdate && attachments)
      setAttachmentDataSource([...attachments.map((attachment) => ({
        ...attachment,
        key: attachment.id,
      }))]);
  }, [detail]);

  useEffect(() => {
    dispatch(getPrApprovalHierarchies());
  }, []);

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
        isCreate
          ? "Create Payment Relation"
          : isUpdate
            ? "Update Payment Relation"
            : ""
    }
  ];

  /**
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
              accountId: relatedAccountId,
              priority,
              description,
              startDate,
              endDate,
              appHierId
            } = form.getFieldsValue(true);

            const body = {
              stepNumber: current + 1,
              type: formType.toUpperCase(),
              id,
              data: {
                accountId,
                relatedAccountId,
                priority: Number.parseInt(priority),
                description,
                startDate: NxDate.formatForAPI(startDate),
                endDate: NxDate.formatForAPI(endDate),
                appHierId,
              }
            };

            await dispatch(
              validateCreateUpdate({
                body,
                services: accountManagementService,
                endPoint: `/v1/dbs/api/payment-relation/validate-step`,
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

      const { accountId: relatedAccountId, priority, description, startDate, endDate, appHierId } =
        form.getFieldsValue(true);

      const body = {
        id,
        accountId,
        relatedAccountId,
        priority: Number.parseInt(priority),
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
          endPoint: `/v1/dbs/api/payment-relation/validate-${formType}`,
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

  const setAccount = ({ accountId, accountNumber, accountName }) => {
    form.setFieldValue("accountId", accountId);
    form.setFieldValue("accountNumber", accountNumber);
    form.setFieldValue("accountName", accountName);
  };

  const handleSelectHierarchy = (appHierId, approvalName) => {
    dispatch(getPrApprovalHierarchy(appHierId));
    form.setFieldValue("appHierName", approvalName);
  };

  const steps = [
    {
      title: "Payment Relation",
      cards: [
        {
          header: "Payment Relation Information",
          content: (
            <InfoPaymentRelation
              form={form}
              setAccount={setAccount}
              accountId={accountId}
              isUpdate={isUpdate}
              isDraft={isDraft}
              key={`payment-relation-tab-0`}
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
              hierarchyDetails={detail_prApprovalHierarchy}
              options={list_prApprovalHierarchy}
              handleSelectHierarchy={handleSelectHierarchy}
              key={`payment-relation-tab-1`}
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
              key={`payment-relation-tab-2`}
              getAPICategory={getPrAttachmentCategories}
              categoryData={list_prAttachmentCategory}
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

  const navigate = useNavigate();

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
          priority,
          description,
          startDate,
          endDate,
          appHierId
        } = form.getFieldsValue(true);

        const body = {
          stepNumber: current + 1,
          type: formType.toUpperCase(),
          id: isUpdate ? id : undefined,
          data: {
            accountId,
            relatedAccountId,
            priority: Number.parseInt(priority),
            description,
            startDate: NxDate.formatForAPI(startDate),
            endDate: NxDate.formatForAPI(endDate),
            appHierId,
          }
        };

        await dispatch(
          validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/payment-relation/validate-step`,
            type: formType
          })
        ).unwrap();
      }
    } catch (err) {
      return;
    }

    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

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
            priority,
            description,
            startDate,
            endDate,
            appHierId
          } = form.getFieldsValue(true);

          const body = {
            stepNumber: i + 1,
            type: formType.toUpperCase(),
            id,
            data: {
              accountId,
              relatedAccountId,
              priority: Number.parseInt(priority),
              description,
              startDate: NxDate.formatForAPI(startDate),
              endDate: NxDate.formatForAPI(endDate),
              appHierId,
            }
          };

          await dispatch(
            validateCreateUpdate({
              body,
              services: accountManagementService,
              endPoint: `/v1/dbs/api/payment-relation/validate-step`,
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

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const handleButtonNext = async () => {
    await next();
    scrollRightHandler();
  };

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const handleSubmitForm = () => {
    const {
      accountId: relatedAccountId,
      priority,
      description,
      startDate,
      endDate,
      appHierId,
      remark
    } = form.getFieldsValue(true);

    const attachments = nxRemoveKeys([
      ...attachmentDataSource.filter(
        (attachment) => ["exist", "draft"].includes(attachment.dataType)
      ),
      ...deletedAttachments
    ]);

    const body = {
      id,
      accountId,
      relatedAccountId,
      priority: Number.parseInt(priority),
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
      dispatch(createPaymentRelation({ body, attachments: newAttachments, action: confirmationType.toUpperCase() }))
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
        updatePaymentRelation({
          id,
          body,
          attachments: newAttachments,
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

  const handleClear = () => {
    if (isCreate) {
      setAttachmentDataSource([]);
      setDeletedAttachments([]);
      form.resetFields();
      setCurrent(0);
    } else if (isUpdate) {
      if (list_prApprovalHierarchy?.length) {
        const {
          accountId,
          priority,
          startDate,
          endDate,
          description,
          appHierId,
          accountNumber,
          accountName
        } = detail;

        form.setFieldsValue({
          accountId,
          accountName,
          accountNumber,
          priority,
          startDate,
          endDate,
          description,
          appHierId
        });

        const appHierOption = list_prApprovalHierarchy.find(
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
            id="paymentRelationForm"
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
              formId={"paymentRelationForm"}
              isOpen={showConfirmationModal}
              handleCancel={() => handleSetShowConfirmationModal(false)}
              approvalData={detail_prApprovalHierarchy}
              type={confirmationType}
              attachmentDataSource={attachmentDataSource}
              service={accountManagementService}
              configApplication={configApp.ACCOUNT_SERVICE}
              loading={loading_createUpdatePr}
              handleSubmitForm={handleSubmitForm}
            />
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default CreateUpdatePaymentRelation;
