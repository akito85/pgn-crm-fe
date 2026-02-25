import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Spin } from "antd";
import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import InfoInvoiceRelation from "./StepContents/InformationForm/InfoInvoiceRelation";
import ApprovalInvoiceRelation from "./StepContents/ApprovalForm/ApprovalInvoiceRelation";
import AttachmentInvoiceRelation from "./StepContents/AttachmentForm/AttachmentInvoiceRelation";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { getCustomerDetail } from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail
} from "../../../../../../../../redux/slices/account_management/accountManagement";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  createInvoiceRelation,
  getDetailInvoiceRelation,
  getDetailIrApprovalHierarchy,
  getInvoiceRelationAttachment,
  getIrApprovalHierarchy,
  getIrAttachmentCategory,
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

const CreateUpdateInvoiceRelation = ({ formType }) => {
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const dispatch = useDispatch();

  const isCreate = formType === "create";
  const isUpdate = formType === "update";

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );

  const {
    loading,
    data_irApprovalHierarchy,
    detail_irApprovalHierarchy,
    detail_invoiceRelation,
    list_irDetailAttachment
  } = useSelector((state) => state.invoiceRelation);

  //declare
  const location = useLocation();
  const [form] = Form.useForm();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idIr = location?.state?.id;
  const accountType = location?.state?.type; // "standard" or "onetime"

  const status = detail_invoiceRelation.status || "DRAFT";
  const isDraft = status === "DRAFT";

  //state
  const [dataAttachment, setDataAttachment] = useState([]);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const attachmentIsRequired = true;

  const formFields = [
    ["accountNumber", "accountName", "startDate", "endDate", "description"],
    ["appHierId"],
    []
  ];

  useEffect(() => {
    if (idCustomer) dispatch(getCustomerDetail(idCustomer));
  }, [idCustomer]);

  useEffect(() => {
    if (idAccount)
      dispatch(getAccountStandardDetail({ idAccount, idCustomer }));
  }, [idAccount]);

  useEffect(() => {
    if (isUpdate && idIr) {
      dispatch(getDetailInvoiceRelation(idIr));
      dispatch(getInvoiceRelationAttachment({ id: idIr }));
    }
  }, [formType, idIr]);

  useEffect(() => {
    if (isUpdate && detail_invoiceRelation && data_irApprovalHierarchy?.length) {
      const {
        subjectId,
        objectId,
        startDate,
        endDate,
        description,
        appHierId,
        relatedAccountNumber,
        relatedAccountName
      } = detail_invoiceRelation;

      form.setFieldsValue({
        subjectId,
        objectId,
        accountName: relatedAccountName,
        accountNumber: relatedAccountNumber,
        startDate,
        endDate,
        description,
        appHierId
      });

      const appHierOption = data_irApprovalHierarchy.find(
        (option) => option.appHierId === appHierId
      );

      if (appHierOption)
        handleSelectHiararchy(appHierId, appHierOption.approvalName);
    }
  }, [detail_invoiceRelation, data_irApprovalHierarchy]);

  useEffect(() => {
    if (isUpdate && list_irDetailAttachment) {
      const result = list_irDetailAttachment.map((item, index) => ({
        ...item,
        key: `invoice-relation-attachment-${item.id}`,
        dataType: "exist"
      }));
      setDataAttachment([...result]);
    }
  }, [list_irDetailAttachment]);

  useEffect(() => {
    dispatch(getIrApprovalHierarchy());
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
        formType === "create"
          ? "Create Invoice Relation"
          : formType === "update"
            ? "Update Invoice Relation"
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
            description,
            startDate,
            endDate,
            appHierId
          } = form.getFieldsValue(true);

          const body = {
            stepNumber: current + 1,
            type: formType.toUpperCase(),
            id: idIr,
            data : {
              subjectId: data_accountDetail?.accountInformation?.accountId, 
              objectId,
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

      const { objectId, description, startDate, endDate, appHierId } =
        form.getFieldsValue(true);

      const body = {
        id: isUpdate ? idIr : undefined,
        subjectId: data_accountDetail?.accountInformation?.accountId,
        objectId,
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
    dispatch(getDetailIrApprovalHierarchy({ id: appHierId }));
    form.setFieldValue("appHierName", approvalName);
  };

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
              accountId={idAccount}
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
            <ApprovalInvoiceRelation
              form={form}
              dataTable={(detail_irApprovalHierarchy || []).map(
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
              dataOption={data_irApprovalHierarchy}
              handleSelectHiararchy={handleSelectHiararchy}
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
            <AttachmentInvoiceRelation
              data={dataAttachment}
              updateData={setDataAttachment}
              dispatch={dispatch}
              key={`invoice-relation-tab-2`}
              getAPICategory={getIrAttachmentCategory}
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
          description,
          startDate,
          endDate,
          appHierId
        } = form.getFieldsValue(true);

        const body = {
          stepNumber: current + 1,
          type: formType.toUpperCase(),
          id: idIr,
          data : {
            subjectId: data_accountDetail?.accountInformation?.accountId, 
            objectId,
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
            description,
            startDate,
            endDate,
            appHierId
          } = form.getFieldsValue(true);

          const body = {
            stepNumber: current + 1,
            type: formType.toUpperCase(),
            id: idIr,
            data : {
              subjectId: data_accountDetail?.accountInformation?.accountId, 
              objectId,
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
      description,
      startDate,
      endDate,
      appHierId,
      remark
    } = form.getFieldsValue(true);

    const body = {
      id: idIr,
      subjectId: data_accountDetail?.accountInformation?.accountId,
      objectId,
      description,
      startDate: NxDate.formatForAPI(startDate),
      endDate: NxDate.formatForAPI(endDate),
      appHierId,
      action: confirmationType,
      remark
    };

    // Filter only new attachments (not existing ones)
    const newAttachments = dataAttachment.filter((a) => a.dataType !== "exist");

    if (isCreate)
      dispatch(createInvoiceRelation({ body, attachments: newAttachments }))
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
        updateInvoiceRelation({
          id: idIr,
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
      if (detail_invoiceRelation && data_irApprovalHierarchy?.length) {
        const {
          subjectId,
          objectId,
          startDate,
          endDate,
          description,
          appHierId,
          relatedAccountNumber,
          relatedAccountName
        } = detail_invoiceRelation;

        form.setFieldsValue({
          subjectId,
          objectId,
          accountName: relatedAccountName,
          accountNumber: relatedAccountNumber,
          startDate: NxDate.formatForAPI(startDate),
          endDate: NxDate.formatForAPI(endDate),
          description,
          appHierId
        });

        const appHierOption = data_irApprovalHierarchy.find(
          (option) => option.appHierId === appHierId
        );

        if (appHierOption)
          handleSelectHiararchy(appHierId, appHierOption.approvalName);
      }

      if (list_irDetailAttachment) {
        const result = list_irDetailAttachment.map((item, index) => ({
          ...item,
          key: `invoice-relation-attachment-${item.id}`,
          dataType: "exist"
        }));
        setDataAttachment([...result]);
      }

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
                <ButtonComponent
                  type={"menu"}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </ButtonComponent>
                <div className="flex w-full justify-end gap-x-2">
                  <ButtonComponent
                    onClick={handleClear}
                    type={"reject"}
                    icon={<SVGIcon name="IconButtonClear" width={24} />}
                  >
                    {isUpdate ? "Reset" : "Clear"}
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() =>
                      handleSetShowConfirmationModal(true, "draft")
                    }
                    type={"secondary"}
                    disabled={current !== steps.length - 1}
                  >
                    Save as Draft
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => {
                      prev();
                      scrollLeftHandler();
                    }}
                    type={"menu"}
                    disabled={current < 1}
                  >
                    Previous
                  </ButtonComponent>
                  {current < steps.length - 1 && (
                    <ButtonComponent
                      onClick={handleButtonNext}
                      type={"submit"}
                      disabled={steps[current].disabled}
                    >
                      Next
                    </ButtonComponent>
                  )}
                  {current === steps.length - 1 && (
                    <>
                      <ButtonComponent
                        onClick={() =>
                          handleSetShowConfirmationModal(true, "submit")
                        }
                        type={"submit"}
                      >
                        Save & Submit
                      </ButtonComponent>
                    </>
                  )}
                </div>
              </div>
            </NxBaseContainer>
            <ConfirmationModal
              form={form}
              formId={"invoiceRelationForm"}
              isOpen={showConfirmationModal}
              handleCancel={() => handleSetShowConfirmationModal(false)}
              approvalData={(detail_irApprovalHierarchy || []).map(
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
            />
          </Form>
        </Spin>
      </div>
    </LayoutMenu>
  );
};

export default CreateUpdateInvoiceRelation;
