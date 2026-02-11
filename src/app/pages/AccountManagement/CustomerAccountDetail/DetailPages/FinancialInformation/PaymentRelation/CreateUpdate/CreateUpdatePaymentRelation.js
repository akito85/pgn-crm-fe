import { useEffect,  useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Form, Spin } from "antd";

import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import StepContents from "./StepContents";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";

// you fucking nasty using bulky moment lazy as fuck
import moment from "moment";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";

import {
  getCustomerDetail,
} from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../../../redux/slices/account_management/accountManagement";
import { dateFormatting } from "../../../../../../../../utils";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  createPaymentRelation,
  getDetailPaymentRelation,
  getDetailPrApprovalHierarchy,
  getPaymentRelationAttachment,
  getPrApprovalHierarchy,
  getPrAttachmentCategory,
  updatePaymentRelation,
} from "../../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
import { showModalError, validateCreateUpdate } from "../../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../../../../constants/configApp";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import { FormStepper } from "../../../../../../../../components/FormStepNavigation";
import { NxFormStepper } from "../../../../../../../../components/Nx/NxFormStepNavigation";
import HeaderDetail from "../../../../HeaderDetail";

const CreateUpdatePaymentRelation = ({ type }) => {
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const dispatch = useDispatch();
  const {
    data_customerDetail,
  } = useSelector((state) => state.customerAccount);

  const {
    data_accountDetail,
  } = useSelector((state) => state.accountManagement);

  const {
    loading,
    data_prApprovalHierarchy,
    detail_prApprovalHierarchy,
    detail_paymentRelation,
    data_paymentRelationAttachment,
  } = useSelector((state) => state.paymentRelation);

  //declare
  const location = useLocation();
  const [formCreate] = Form.useForm();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idPr = location?.state?.id;
  const accountType = location?.state?.type; // "standard" or "onetime"

  //state
  const [dataAttachment, setDataAttachment] = useState([]);

  const [selectedApprovalName, setSelectedApprovalName] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const attachmentIsRequired = true;

  const formFields = [
    [
      "accountNumber",
      "accountName",
      "priority",
      "startDate",
      "endDate",
      "description",
    ],
    [
      "appHierId",
    ],
    []
  ];

  const validationTypes = ["DATA", "APPROVAL", "ATTACHMENT"];
 
  const { InformationForm, AttachmentForm, ApprovalForm } = StepContents;

  useEffect(() => {
    if (idCustomer)
      dispatch(getCustomerDetail(idCustomer));
  }, [idCustomer]);

  useEffect(() => {
    if (idAccount)
      dispatch(getAccountStandardDetail({idAccount, idCustomer}));
  }, [idAccount]);

  useEffect(() => {
    if (type === "update" && idPr) {
      dispatch(getDetailPaymentRelation(idPr));
      dispatch(getPaymentRelationAttachment({ id: idPr }))
    }
  }, [type, idPr]);

  useEffect(() => {
    if (
      type === "update" &&
      detail_paymentRelation?.result &&
      data_prApprovalHierarchy?.length
    ) {
      const {
        subjectId,
        objectId,
        priority,
        startDate,
        endDate,
        description,
        appHierId,
      } = detail_paymentRelation.result;

      const { relatedAccountNumber, relatedAccountName } = detail_paymentRelation.result;

      formCreate.setFieldsValue({
        subjectId,
        objectId,
        accountName: relatedAccountName,
        accountNumber: relatedAccountNumber,
        priority,
        startDate,
        endDate,
        description,
        appHierId,
      });

      const appHierOption = data_prApprovalHierarchy.find((option) => option.appHierId === appHierId)

      if (appHierOption)
        handleSelectHiararchy(appHierId, appHierOption.approvalName);
    }
  }, [detail_paymentRelation, data_prApprovalHierarchy]);

  useEffect(() => {
    if (type === "update" && data_paymentRelationAttachment?.result) {
      const result = data_paymentRelationAttachment.result?.map((item, index) => ({
        ...item,
        key: `payment-relation-attachment-${item.id}`,
        dataType: "exist"
      }));
      setDataAttachment([
        ...result,
      ])
    }
  }, [data_paymentRelationAttachment])

  useEffect(() => {
    dispatch(getPrApprovalHierarchy());
  }, []);

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard",
    },
    {
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
      state: {
        idAccount,
        idCustomer,
      }
    },
    {
      path: "",
      breadcrumbName: (type === "create") ? "Create Payment Relation" : (type === "update") ? "Update Payment Relation" : "",
    },
  ];

  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

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
              description: `Please upload at least one attachment`,
            };
            dispatch(showModalError(errorBody));
            
            throw new Error("There was no file attached");
          }
        }
        else {
          await formCreate.validateFields(formFields[current]);

          const {
            objectId,
            priority,
            description, 
            startDate,
            endDate,
            appHierId,
          } = formCreate.getFieldsValue();

          const body = {
            id: type === "update" ? idPr : undefined,
            subjectId: data_accountDetail?.accountInformation?.accountId, 
            objectId,
            priority,
            description, 
            startDate,
            endDate,
            appHierId,
            validationType: validationTypes[current],
          };

          await dispatch(validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/payment-relation/validate-${type}`,
            type,
          }))
          .unwrap();
        }
      } catch (err) {
        return;
      }

      const {
        objectId,
        priority,
        description, 
        startDate,
        endDate,
        appHierId,
      } = formCreate.getFieldsValue();

      const body = {
        id: type === "update" ? idPr : undefined,
        subjectId: data_accountDetail?.accountInformation?.accountId, 
        objectId,
        priority,
        description, 
        startDate,
        endDate,
        appHierId,
        action: submitType
      };

      dispatch(validateCreateUpdate({
        body,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/payment-relation/validate-${type}`,
        type,
      }))
      .unwrap()
      .then((data) => {
        setShowConfirmationModal(show);
        setConfirmationType(submitType);
      }).catch(() => {});
    }
    else {
      setShowConfirmationModal(show);
      setConfirmationType("");
    }
  }

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
    formCreate.setFieldValue("objectId", objectId)
    formCreate.setFieldValue("accountNumber", accountNumber);
    formCreate.setFieldValue("accountName", accountName);
  }

  const handleSelectHiararchy = (appHierId, approvalName) => {
    dispatch(getDetailPrApprovalHierarchy({id: appHierId}));
    setSelectedApprovalName(approvalName);
  }

  const steps = [
    {
      title: "Payment Relation",
      content: (
        <InformationForm
          setAccount={setAccount}
          className={`${current !== 0 ? "hidden" : ""}`}
          accountId={idAccount}
          key={`payment-relation-tab-0`}
        />
      ),
      disabled: false
    },
    {
      title: "Approval",
      content: (
        <ApprovalForm
          dataTable={(detail_prApprovalHierarchy || []).map((detail, index) => ({
            ...detail,
            employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
              ...employeeDetail,
              key: `employee-detail-${index}`
            })),
            key: `detail-detail-${index}`,
          }))}
          dataOption={data_prApprovalHierarchy}
          selectedAppHierId={formCreate.getFieldValue("appHierId")}
          handleSelectHiararchy={handleSelectHiararchy}
          className={`${current !== 1 ? "hidden" : ""}`}
          key={`payment-relation-tab-1`}
        />
      ),
      disabled: false
    },
    {
      title: "Attachment",
      content: (
        <AttachmentForm
          type={type}
          data={dataAttachment}
          updateData={setDataAttachment}
          dispatch={dispatch}
          className={`${current !== 2 ? "hidden" : ""}`}
          key={`payment-relation-tab-2`}
          getAPICategory={getPrAttachmentCategory}
          service={accountManagementService}
          configApplication={configApp.ACCOUNT_SERVICE}
          mandatory={attachmentIsRequired}
        />
      ),
      disabled: false
    },
  ];

  const navigate = useNavigate();
  
  const next = async () => {
    try {
      if (current === 2) {
        if (attachmentIsRequired && !dataAttachment.length) {
          const errorBody = {
              title: "Failed",
              description: `Please upload at least one attachment`,
            };
            dispatch(showModalError(errorBody));
            
            throw new Error("There was no file attached");
        }
      }
      else {
        await formCreate.validateFields(formFields[current]);

        const {
          objectId,
          priority,
          description, 
          startDate,
          endDate,
          appHierId,
        } = formCreate.getFieldsValue();

        const body = {
          id: type === "update" ? idPr : undefined,
          subjectId: data_accountDetail?.accountInformation?.accountId, 
          objectId,
          priority,
          description, 
          startDate,
          endDate,
          appHierId,
          validationType: validationTypes[current],
        };
        
        await dispatch(validateCreateUpdate({
          body,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/payment-relation/validate-${type}`,
          type,
        }))
        .unwrap();
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
              description: `Please upload at least one attachment`,
            };
            dispatch(showModalError(errorBody));
            
            throw new Error("There was no file attached");
          }
        }
        else {
          await formCreate.validateFields(formFields[i]);

          const {
            objectId,
            priority,
            description, 
            startDate,
            endDate,
            appHierId,
          } = formCreate.getFieldsValue();

          const body = {
            id: type === "update" ? idPr : undefined,
            subjectId: data_accountDetail?.accountInformation?.accountId, 
            objectId,
            priority,
            description, 
            startDate,
            endDate,
            appHierId,
            validationType: validationTypes[i],
          };
          
          await dispatch(validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/payment-relation/validate-${type}`,
            type,
          }))
          .unwrap();
        }
      } catch (err) {
        setCurrent(i);
        return;
      }
    }

    setCurrent(newCurrent);
  }

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const handleButtonNext = async () => {
    await next();
    scrollRightHandler()
  }

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
      remark,
    } = formCreate.getFieldsValue();

    const body = {
      id: idPr,
      subjectId: data_accountDetail?.accountInformation?.accountId, 
      objectId,
      priority,
      description, 
      startDate,
      endDate,
      appHierId,
      action: confirmationType,
      remarks: remark,
    };

    if (type === "create")
      dispatch(createPaymentRelation({ body, attachments: dataAttachment }))
      .unwrap()
      .then((data) => {
        setTimeout(() => {
          navigate(
            ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
            {
              state: {
                idAccount,
                idCustomer,
              }
            }
          );
        }, 2000)
      })
      .catch((error) => {});
    else if (type === "update")
      dispatch(updatePaymentRelation({ id: idPr, body, attachments: dataAttachment.filter((attachment => attachment.dataType !== "exist")) }))
      .unwrap()
        .then((data) => {
          setTimeout(() => {
            navigate(
              ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
              {
                state: {
                  idAccount,
                  idCustomer,
                }
              }
            );
          }, 2000)
        })
        .catch((error) => {});;
  };

  const handleClear = () => {
    if (type === "create") {
      setDataAttachment([]);
      setSelectedApprovalName();
      formCreate.resetFields();
      setCurrent(0);
    } else if (type === "update") {
      if (
        detail_paymentRelation?.result &&
        data_prApprovalHierarchy?.length
      ) {
        const {
          subjectId,
          objectId,
          priority,
          startDate,
          endDate,
          description,
          appHierId,
        } = detail_paymentRelation.result;

        const { relatedAccountNumber, relatedAccountName } = detail_paymentRelation.result;

        formCreate.setFieldsValue({
          subjectId,
          objectId,
          accountName: relatedAccountName,
          accountNumber: relatedAccountNumber,
          priority,
          startDate,
          endDate,
          description,
          appHierId,
        });

        const appHierOption = data_prApprovalHierarchy.find((option) => option.appHierId === appHierId)

        if (appHierOption)
          handleSelectHiararchy(appHierId, appHierOption.approvalName);
      }

      if (data_paymentRelationAttachment?.result) {
        const result = data_paymentRelationAttachment.result?.map((item, index) => ({
          ...item,
          key: `payment-relation-attachment-${item.id}`,
          dataType: "exist"
        }));
        setDataAttachment([
          ...result,
        ])
      }

      setCurrent(0);
    }
  }

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

        <Spin
          spinning={loading}
        >
          <Form
            id="paymentRelationForm"
            form={formCreate}
            layout={"vertical"}
            onFinish={handleSubmitForm}
            // onFinishFailed={handleErrorSubmit}
            scrollToFirstError={true}
            className="flex flex-col gap-y-4"
          >
          {/* Step Contents */}
          <NxFormStepper steps={steps} current={current} onPrev={prev} onNext={handleButtonNext} />

          {steps.map((step) => step.content)}

          {/* Section Action Steps */}
          <NxBaseContainer border>
            <div className="flex justify-between">
              <ButtonComponent
                type={"menu"}
                onClick={()=>{navigate(-1)}}
              >
                Cancel
              </ButtonComponent>
              <div className="flex w-full justify-end gap-x-2">
                <ButtonComponent
                  onClick={handleClear}
                  type={"reject"}
                  icon={<SVGIcon name="IconButtonClear" width={24} />}
                >
                  { type === "update" ? "Reset" : "Clear" }
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => handleSetShowConfirmationModal(true, "draft")}
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
                      onClick={() => handleSetShowConfirmationModal(true, "submit")}
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
            form={"paymentRelationForm"}
            isOpen={showConfirmationModal}
            handleCancel={() => handleSetShowConfirmationModal(false)}
            selectedAppHierId={formCreate.getFieldValue("appHierId")}
            selectedApprovalName={selectedApprovalName}
            hierarchyTableData={(detail_prApprovalHierarchy || []).map((detail, index) => ({
              ...detail,
              employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
                ...employeeDetail,
                key: `employee-detail-${index}`
              })),
              key: `detail-detail-${index}`,
            }))}
            hieararchyOptionData={data_prApprovalHierarchy}
            type={confirmationType}
            dataAttachment={dataAttachment}
            data={formCreate.getFieldsValue()}
            service={accountManagementService}
            configApplication={configApp.ACCOUNT_SERVICE}
            />
          </Form>
        </Spin>
      </div>
    </LayoutMenu>
  );
};

export default CreateUpdatePaymentRelation;
