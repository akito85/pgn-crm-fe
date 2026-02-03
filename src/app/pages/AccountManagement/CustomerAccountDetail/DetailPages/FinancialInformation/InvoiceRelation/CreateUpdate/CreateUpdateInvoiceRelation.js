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
  createInvoiceRelation,
  getDetailInvoiceRelation,
  getDetailIrApprovalHierarchy,
  getInvoiceRelationAttachment,
  getIrApprovalHierarchy,
  getIrAttachmentCategory,
  updateInvoiceRelation,
} from "../../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import { showModalError, validateCreateUpdate } from "../../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../../../../constants/configApp";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import { NxFormStepper } from "../../../../../../../../components/Nx/NxFormStepNavigation";

const CreateUpdateInvoiceRelation = ({ type }) => {
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
    data_irApprovalHierarchy,
    detail_irApprovalHierarchy,
    detail_invoiceRelation,
    list_irDetailAttachment,
  } = useSelector((state) => state.invoiceRelation);

  //declare
  const location = useLocation();
  const [formCreate] = Form.useForm();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idIr = location?.state?.idIr;
  const accountType = location?.state?.type; // "standard" or "onetime"

  //state
  const [dataAttachment, setDataAttachment] = useState([]);

  const [selectedAppHierId, setSelectedAppHierId] = useState();
  const [selectedApprovalName, setSelectedApprovalName] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const attachmentIsRequired = true;

  const formFields = [
    [
      "accountNumber",
      "accountName",
      "startDate",
      "endDate",
      "description",
    ],
    [
      "appHierId",
    ],
    []
  ];
 
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
    if (type === "update" && idIr) {
      dispatch(getDetailInvoiceRelation(idIr));
      dispatch(getInvoiceRelationAttachment({ id: idIr }))
    }
  }, [type, idIr]);

  useEffect(() => {
    if (
      type === "update" &&
      detail_invoiceRelation &&
      data_irApprovalHierarchy?.length
    ) {
      const {
        subjectId,
        objectId,
        startDate,
        endDate,
        description,
        appHierId,
      } = detail_invoiceRelation;

      const { relatedAccountNumber, relatedAccountName } = detail_invoiceRelation;

      formCreate.setFieldsValue({
        subjectId,
        objectId,
        accountName: relatedAccountName,
        accountNumber: relatedAccountNumber,
        startDate,
        endDate,
        description,
        appHierId,
      });

      const appHierOption = data_irApprovalHierarchy.find((option) => option.appHierId === appHierId)

      if (appHierOption)
        handleSelectHiararchy(appHierId, appHierOption.approvalName);
    }
  }, [detail_invoiceRelation, data_irApprovalHierarchy]);

  useEffect(() => {
    if (type === "update" && list_irDetailAttachment) {
      const result = list_irDetailAttachment.map((item, index) => ({
        ...item,
        key: `invoice-relation-attachment-${item.id}`,
        dataType: "exist"
      }));
      setDataAttachment(prev => ([
        ...result,
      ]))
    }
  }, [list_irDetailAttachment])

  useEffect(() => {
    dispatch(getIrApprovalHierarchy());
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
      breadcrumbName: (type === "create") ? "Create Invoice Relation" : (type === "update") ? "Update Invoice Relation" : "",
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
            description, 
            startDate,
            endDate,
            appHierId,
          } = formCreate.getFieldsValue();

          const body = {
            stepNumber: current + 1,
            type: type.toUpperCase(),
            data : {
              subjectId: data_accountDetail?.accountInformation?.accountId, 
              objectId,
              description, 
              startDate,
              endDate,
              appHierId,
              id: idIr,
            }
          };

          await dispatch(validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/invoice-relation/validate-step`,
            type,
          }))
          .unwrap();
        }  
      } catch (err) {
        return;
      }

      const {
        objectId,
        description, 
        startDate,
        endDate,
        appHierId,
      } = formCreate.getFieldsValue();

      const body = {
        id: type === "update" ? idIr : undefined,
        subjectId: data_accountDetail?.accountInformation?.accountId, 
        objectId,
        description, 
        startDate,
        endDate,
        appHierId,
        action: submitType
      };

      dispatch(validateCreateUpdate({
        body,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/invoice-relation/validate-${type}`,
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
    dispatch(getDetailIrApprovalHierarchy({id: appHierId}));
    setSelectedAppHierId(appHierId);
    setSelectedApprovalName(approvalName);
  }

  const steps = [
    {
      title: "Invoice Relation",
      content: (
        <InformationForm
          setAccount={setAccount}
          className={`${current !== 0 ? "hidden" : ""}`}
          key={`invoice-relation-tab-0`}
          accountId={idAccount}
        />
      ),
      disabled: false
    },
    {
      title: "Approval",
      content: (
        <ApprovalForm
          dataTable={detail_irApprovalHierarchy.map((detail, index) => ({
            ...detail,
            employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
              ...employeeDetail,
              key: `employee-detail-${index}`
            })),
            key: `detail-detail-${index}`,
          }))}
          dataOption={data_irApprovalHierarchy}
          selectedAppHierId={selectedAppHierId}
          handleSelectHiararchy={handleSelectHiararchy}
          className={`${current !== 1 ? "hidden" : ""}`}
          key={`invoice-relation-tab-1`}
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
          key={`invoice-relation-tab-2`}
          getAPICategory={getIrAttachmentCategory}
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
          description, 
          startDate,
          endDate,
          appHierId,
        } = formCreate.getFieldsValue();

        const body = {
          stepNumber: current + 1,
          type: type.toUpperCase(),
          data : {
            subjectId: data_accountDetail?.accountInformation?.accountId, 
            objectId,
            description, 
            startDate,
            endDate,
            appHierId,
            id: idIr,
          }
        };

        await dispatch(validateCreateUpdate({
          body,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/invoice-relation/validate-step`,
          type,
        }))
        .unwrap()
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
            description, 
            startDate,
            endDate,
            appHierId,
          } = formCreate.getFieldsValue();

          const body = {
            stepNumber: i + 1,
            type: type.toUpperCase(),
            data : {
              subjectId: data_accountDetail?.accountInformation?.accountId, 
              objectId,
              description, 
              startDate,
              endDate,
              appHierId,
              id: idIr,
            }
          };

          await dispatch(validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/invoice-relation/validate-step`,
            type,
          }))
          .unwrap()
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
      description, 
      startDate,
      endDate,
      appHierId,
      remark,
    } = formCreate.getFieldsValue();

    const body = {
      id: idIr,
      subjectId: data_accountDetail?.accountInformation?.accountId, 
      objectId,
      description, 
      startDate,
      endDate,
      appHierId,
      action: confirmationType,
      remark,
    };

    if (type === "create")
      dispatch(createInvoiceRelation({ body, attachments: dataAttachment }))
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
      dispatch(updateInvoiceRelation({ id: idIr, body, attachments: dataAttachment.filter((attachment => attachment.dataType !== "exist")) }))
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
      setSelectedAppHierId();
      setSelectedApprovalName();
      formCreate.resetFields();
      setCurrent(0);
    } else if (type === "update") {
      if (
        detail_invoiceRelation &&
        data_irApprovalHierarchy?.length
      ) {
        const {
          subjectId,
          objectId,
          startDate,
          endDate,
          description,
          appHierId,
        } = detail_invoiceRelation;

        const { relatedAccountNumber, relatedAccountName } = detail_invoiceRelation;

        formCreate.setFieldsValue({
          subjectId,
          objectId,
          accountName: relatedAccountName,
          accountNumber: relatedAccountNumber,
          startDate,
          endDate,
          description,
          appHierId,
        });

        const appHierOption = data_irApprovalHierarchy.find((option) => option.appHierId === appHierId)

        if (appHierOption)
          handleSelectHiararchy(appHierId, appHierOption.approvalName);
      }

      if (list_irDetailAttachment) {
        const result = list_irDetailAttachment?.map((item, index) => ({
          ...item,
          key: `invoice-relation-attachment-${item.id}`,
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
        <NxCardContainer header={"CUSTOMER & ACCOUNT INFORMATION"}>
          <div className="flex flex-col gap-4">
            <NxBaseContainer border header={"CUSTOMER INFORMATION"}>
              <div className="w-full grid grid-cols-4 gap-4">
                <NxDetailText className="flex flex-col gap-y-2" label="Customer Number">{data_customerDetail?.customerNumber}</NxDetailText>
                <NxDetailText label="Identification Type">{data_customerDetail?.identificationType}</NxDetailText>
                <NxDetailText label="Customer Identification Number">{data_customerDetail?.customerIdentificationNumber}</NxDetailText>
                <NxDetailText label="Customer Name">{data_customerDetail?.customerName}</NxDetailText>
                <NxDetailText label="Customer Type">{data_customerDetail?.customerType}</NxDetailText>
                <NxDetailText label="Description">{data_customerDetail?.description}</NxDetailText>
                <NxDetailText label="Birth/Founded Date">{renderDate(data_customerDetail?.birthFoundedDate)}</NxDetailText>
                <NxDetailText label="Birth/Founded Place">{data_customerDetail?.birthFoundedPlace}</NxDetailText>
                <NxDetailText label="Sex">{data_customerDetail?.sex}</NxDetailText>
                <NxDetailText label="Maritial Status">{data_customerDetail?.maritialStatus}</NxDetailText>
                <NxDetailText label="Search Key">{data_customerDetail?.searchKey}</NxDetailText>
              </div>
            </NxBaseContainer>
            <NxBaseContainer border header={"ACCOUNT INFORMATION"}>
              <div className="w-full grid grid-cols-4 gap-4">
                <NxDetailText label="Account Number">{data_accountDetail?.accountSummary?.accountNumber}</NxDetailText>
                <NxDetailText label="Registration Number">{data_accountDetail?.accountSummary?.registrationNumber}</NxDetailText>
                <NxDetailText label="Account Name">{data_accountDetail?.accountSummary?.accountName}</NxDetailText>
                <NxDetailText label="Category">{data_accountDetail?.accountSummary?.category}</NxDetailText>
                <NxDetailText label="SOR">{data_accountDetail?.accountSummary?.sor}</NxDetailText>
                <NxDetailText label="Cost Center">{data_accountDetail?.accountSummary?.costCenter}</NxDetailText>
                <NxDetailText label="Meter Reading Codes">{renderDate(data_accountDetail?.accountSummary?.meterReadingCodes || "")}</NxDetailText>
                <NxDetailText label="Customer Management">{data_accountDetail?.accountSummary?.customerManagement}</NxDetailText>
                <NxDetailText label="Classification Type">{data_accountDetail?.accountSummary?.classificationType}</NxDetailText>
                <NxDetailText label="Segment">{data_accountDetail?.accountSummary?.segment}</NxDetailText>
                <NxDetailText label="Account Group Type">{data_accountDetail?.accountSummary?.accountGroupType}</NxDetailText>
                <NxDetailText label="Premise Address">{data_accountDetail?.accountSummary?.premiseAddress}</NxDetailText>
                <NxDetailText label="Subdistrict">{data_accountDetail?.accountSummary?.subdistrict}</NxDetailText>
                <NxDetailText label="District">{data_accountDetail?.accountSummary?.district}</NxDetailText>
                <NxDetailText label="City">{data_accountDetail?.accountSummary?.city}</NxDetailText>
                <NxDetailText label="Country">{data_accountDetail?.accountSummary?.country}</NxDetailText>
                <NxDetailText label="Longitude">{data_accountDetail?.accountSummary?.longitude}</NxDetailText>
                <NxDetailText label="Latitude">{data_accountDetail?.accountSummary?.latitude}</NxDetailText>
                <NxDetailText label="Status">{data_accountDetail?.accountSummary?.status}</NxDetailText>    
              </div>
            </NxBaseContainer>
          </div>
        </NxCardContainer>

        <Spin
          spinning={loading}
        >
          <Form
            id="invoiceRelationForm"
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
              <div className="flex w-full justify-end gap-x-4">
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
              form={"invoiceRelationForm"}
              isOpen={showConfirmationModal}
              handleCancel={() => handleSetShowConfirmationModal(false)}
              selectedAppHierId={selectedAppHierId}
              selectedApprovalName={selectedApprovalName}
              hierarchyTableData={detail_irApprovalHierarchy.map((detail, index) => ({
                ...detail,
                employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
                  ...employeeDetail,
                  key: `employee-detail-${index}`
                })),
                key: `detail-detail-${index}`,
              }))}
              hieararchyOptionData={data_irApprovalHierarchy}
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

export default CreateUpdateInvoiceRelation;
