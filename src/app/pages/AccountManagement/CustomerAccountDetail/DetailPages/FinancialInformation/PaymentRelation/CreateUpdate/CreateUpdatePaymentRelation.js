import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Spin } from "antd";
import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import InfoPaymentRelation from "./StepContents/InformationForm/InfoPaymentRelation";
import ApprovalSectionForm from "./StepContents/ApprovalForm/ApprovalPaymentRelation";
import AttachmentSectionForm from "./StepContents/AttachmentForm/AttachmentPaymentRelation";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { getCustomerDetail } from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail
} from "../../../../../../../../redux/slices/account_management/accountManagement";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  createPaymentRelation,
  getDetailDraftPaymentRelation,
  getDetailPaymentRelation,
  getDetailPrApprovalHierarchy,
  getPaymentRelationAttachment,
  getPrApprovalHierarchy,
  getPrAttachmentCategory,
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

const CreateUpdatePaymentRelation = ({ formType }) => {
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const dispatch = useDispatch();

  const isCreate = formType === "create";
  const isUpdate = formType === "update";

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );

  const {
    loading_listPrApprovalOption,
    loading_detailPrApprovalHierarchyDetails,
    loading_detailPr,
    loading_detailDraftPr,
    loading_detailPrDetailAttachment,
    loading_createUpdatePr,
    list_prApprovalOptions,
    list_prApprovalHierarchyDetail,
    detail_paymentRelation,
    detailDraft_paymentRelation,
    list_prDetailAttachment
  } = useSelector((state) => state.paymentRelation);

  const loading =
    loading_listPrApprovalOption ||
    loading_detailPrApprovalHierarchyDetails ||
    loading_detailPr ||
    loading_detailDraftPr ||
    loading_detailPrDetailAttachment;

  //declare
  const location = useLocation();
  const [form] = Form.useForm();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idPr = location?.state?.id;
  const accountType = location?.state?.type; // "standard" or "onetime"

  const status = detail_paymentRelation.status || "DRAFT";
  const statusApproval = detail_paymentRelation.statusApproval || "DRAFT";

  const isDraft = status === "DRAFT";
  const isActive = status === "ACTIVE";

  const isDraftApproval = statusApproval === "DRAFT";
  const isRejectApproval = statusApproval === "REJECT";

  //state
  const [dataAttachment, setDataAttachment] = useState([]);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const attachmentIsRequired = true;

  const detail = (isActive && (isDraftApproval || isRejectApproval)) ? detailDraft_paymentRelation : detail_paymentRelation;

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

  const validationTypes = ["DATA", "APPROVAL", "ATTACHMENT"];

  useEffect(() => {
    if (idCustomer) dispatch(getCustomerDetail(idCustomer));
  }, [idCustomer]);

  useEffect(() => {
    if (idAccount)
      dispatch(getAccountStandardDetail({ idAccount, idCustomer }));
  }, [idAccount]);

  useEffect(() => {
    if (isUpdate && idPr) {
      dispatch(getDetailPaymentRelation(idPr));
      dispatch(getDetailDraftPaymentRelation(idPr));
      dispatch(getPaymentRelationAttachment({ id: idPr }));
    }
  }, [formType, idPr]);

  useEffect(() => {
    if (isUpdate && list_prApprovalOptions.length) {
      const {
        subjectId,
        objectId,
        priority,
        startDate,
        endDate,
        description,
        appHierId,
        relatedAccountNumber,
        relatedAccountName
      } = detail;

      form.setFieldsValue({
        subjectId,
        objectId,
        accountName: relatedAccountName,
        accountNumber: relatedAccountNumber,
        priority,
        startDate,
        endDate,
        description,
        appHierId
      });

      const appHierOption = list_prApprovalOptions.find(
        (option) => option.appHierId === appHierId
      );

      if (appHierOption)
        handleSelectHiararchy(appHierId, appHierOption.approvalName);
    }
  }, [detail, list_prApprovalOptions]);

  useEffect(() => {
    if (isUpdate && list_prDetailAttachment) {
      const result = list_prDetailAttachment.map((item, index) => ({
        ...item,
        key: `payment-relation-attachment-${item.id}`,
        dataType: "exist"
      }));
      setDataAttachment([...result]);
    }
  }, [list_prDetailAttachment]);

  useEffect(() => {
    dispatch(getPrApprovalHierarchy());
  }, []);

  const routes = [
    {
      path: "",
      breadcrumbName: "Account"
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard"
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
      state: {
        idAccount,
        idCustomer
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
        if (current === 2) {
          if (attachmentIsRequired && !dataAttachment.length) {
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
            objectId,
            priority,
            description,
            startDate,
            endDate,
            appHierId
          } = form.getFieldsValue(true);

          const body = {
            id: isUpdate ? idPr : undefined,
            subjectId: data_accountDetail?.accountInformation?.accountId,
            objectId,
            priority,
            description,
            startDate: NxDate.formatForAPI(startDate, false),
            endDate: NxDate.formatForAPI(endDate, false),
            appHierId,
            validationType: validationTypes[current]
          };

          await dispatch(
            validateCreateUpdate({
              body,
              services: accountManagementService,
              endPoint: `/v1/dbs/api/payment-relation/validate-${formType}`,
              type: formType
            })
          ).unwrap();
        }
      } catch (err) {
        return;
      }

      const { objectId, priority, description, startDate, endDate, appHierId } =
        form.getFieldsValue(true);

      const body = {
        id: isUpdate ? idPr : undefined,
        subjectId: data_accountDetail?.accountInformation?.accountId,
        objectId,
        priority,
        description,
        startDate: NxDate.formatForAPI(startDate, false),
        endDate: NxDate.formatForAPI(endDate, false),
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

  // Fetch Account Standard/OneTime Detail
  useEffect(() => {
    if (idAccount && idCustomer && accountType) {
      if (accountType === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer, idAccount }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer, idAccount }));
      }
    }
  }, [dispatch, idAccount, idCustomer, accountType]);

  const setAccount = (objectId, accountNumber, accountName) => {
    form.setFieldValue("objectId", objectId);
    form.setFieldValue("accountNumber", accountNumber);
    form.setFieldValue("accountName", accountName);
  };

  const handleSelectHiararchy = (appHierId, approvalName) => {
    dispatch(getDetailPrApprovalHierarchy(appHierId));
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
              accountId={idAccount}
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
            <ApprovalSectionForm
              form={form}
              dataTable={(list_prApprovalHierarchyDetail || []).map(
                (detail, index) => ({
                  ...detail,
                  employeeDetail: detail.employeeDetail.map(
                    (employeeDetail, index) => ({
                      ...employeeDetail,
                      key: `employee-detail-${index}`
                    })
                  ),
                  key: `detail-detail-${index}`
                })
              )}
              dataOption={list_prApprovalOptions}
              handleSelectHiararchy={handleSelectHiararchy}
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
            <AttachmentSectionForm
              data={dataAttachment}
              updateData={setDataAttachment}
              key={`payment-relation-tab-2`}
              getAPICategory={getPrAttachmentCategory}
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
        if (attachmentIsRequired && !dataAttachment.length) {
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
          objectId,
          priority,
          description,
          startDate,
          endDate,
          appHierId
        } = form.getFieldsValue(true);

        const body = {
          id: isUpdate ? idPr : undefined,
          subjectId: data_accountDetail?.accountInformation?.accountId,
          objectId,
          priority,
          description,
          startDate: NxDate.formatForAPI(startDate, false),
          endDate: NxDate.formatForAPI(endDate, false),
          appHierId,
          validationType: validationTypes[current]
        };

        await dispatch(
          validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/payment-relation/validate-${formType}`,
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
          if (attachmentIsRequired && !dataAttachment.length) {
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
            objectId,
            priority,
            description,
            startDate,
            endDate,
            appHierId
          } = form.getFieldsValue(true);

          const body = {
            id: isUpdate ? idPr : undefined,
            subjectId: data_accountDetail?.accountInformation?.accountId,
            objectId,
            priority,
            description,
            startDate: NxDate.formatForAPI(startDate, false),
            endDate: NxDate.formatForAPI(endDate, false),
            appHierId,
            validationType: validationTypes[i]
          };

          await dispatch(
            validateCreateUpdate({
              body,
              services: accountManagementService,
              endPoint: `/v1/dbs/api/payment-relation/validate-${formType}`,
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
      objectId,
      priority,
      description,
      startDate,
      endDate,
      appHierId,
      remark
    } = form.getFieldsValue(true);

    const body = {
      id: idPr,
      subjectId: data_accountDetail?.accountInformation?.accountId,
      objectId,
      priority,
      description,
      startDate: NxDate.formatForAPI(startDate, false),
      endDate: NxDate.formatForAPI(endDate, false),
      appHierId,
      action: confirmationType,
      remark
    };

    // Filter only new attachments (not existing ones)
    const newAttachments = dataAttachment.filter((a) => a.dataType !== "exist");

    if (isCreate)
      dispatch(createPaymentRelation({ body, attachments: newAttachments }))
        .unwrap()
        .then((data) => {
          setTimeout(() => {
            navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD, {
              state: {
                idAccount,
                idCustomer
              }
            });
          }, 2000);
        })
        .catch((error) => {});
    else if (isUpdate)
      dispatch(
        updatePaymentRelation({
          id: idPr,
          body,
          attachments: dataAttachment.filter(
            (attachment) => attachment.dataType !== "exist"
          )
        })
      )
        .unwrap()
        .then((data) => {
          setTimeout(() => {
            navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD, {
              state: {
                idAccount,
                idCustomer
              }
            });
          }, 2000);
        })
        .catch((error) => {});
  };

  const handleClear = () => {
    if (isCreate) {
      setDataAttachment([]);
      form.resetFields();
      setCurrent(0);
    } else if (isUpdate) {
      if (list_prApprovalOptions?.length) {
        const {
          subjectId,
          objectId,
          priority,
          startDate,
          endDate,
          description,
          appHierId,
          relatedAccountNumber,
          relatedAccountName
        } = detail;

        form.setFieldsValue({
          subjectId,
          objectId,
          accountName: relatedAccountName,
          accountNumber: relatedAccountNumber,
          priority,
          startDate,
          endDate,
          description,
          appHierId
        });

        const appHierOption = list_prApprovalOptions.find(
          (option) => option.appHierId === appHierId
        );

        if (appHierOption)
          handleSelectHiararchy(appHierId, appHierOption.approvalName);
      }

      const result = list_prDetailAttachment.map((item, index) => ({
        ...item,
        key: `payment-relation-attachment-${item.id}`,
        dataType: "exist"
      }));
      setDataAttachment([...result]);

      setCurrent(0);
    }
  };

  return (
    <LayoutMenu>
      <div className="flex flex-col gap-y-4">
        <NxBreadCrumb routes={routes} />
        <HeaderDetail
          data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          dispatch={dispatch}
          idAccount={idAccount}
          idCustomer={idCustomer}
          type={"standard"}
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
                    {isUpdate ? "Reset" : "Clear"}
                  </Button>
                  <Button
                    onClick={() =>
                      handleSetShowConfirmationModal(true, "draft")
                    }
                    type={"secondary"}
                    disabled={current !== steps.length - 1}
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
              formId={"paymentRelationForm"}
              isOpen={showConfirmationModal}
              handleCancel={() => handleSetShowConfirmationModal(false)}
              approvalData={(list_prApprovalHierarchyDetail || []).map(
                (detail, index) => ({
                  ...detail,
                  employeeDetail: detail.employeeDetail.map(
                    (employeeDetail, index) => ({
                      ...employeeDetail,
                      key: `employee-detail-${index}`
                    })
                  ),
                  key: `detail-detail-${index}`
                })
              )}
              type={confirmationType}
              dataAttachment={dataAttachment}
              service={accountManagementService}
              configApplication={configApp.ACCOUNT_SERVICE}
              loading={loading_createUpdatePr}
            />
          </Form>
        </Spin>
      </div>
    </LayoutMenu>
  );
};

export default CreateUpdatePaymentRelation;
