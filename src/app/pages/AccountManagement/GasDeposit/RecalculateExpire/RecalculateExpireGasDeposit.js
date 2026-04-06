import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Spin } from "antd";
import InfoGasDeposit from "./StepContents/InformationForm/InfoGasDeposit";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import { getCustomerDetail } from "../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail
} from "../../../../../redux/slices/account_management/accountManagement";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  showModalError,
  validateCreateUpdate
} from "../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../constants/configApp";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../components/Nx/NxBreadCrumb";
import { NxFormStepper } from "../../../../../components/Nx/NxFormStepNavigation";
import HeaderDetail from "../HeaderDetail";
import { nxRemoveKeys } from "../../../../../components/Nx/NxRemoveKeys";
import GasDepositDetailTable from "../GasDepositDetailTable";
import GasDepositDetailMutationTable from "../GasDepositDetailMutationTable";
import NxApprovalInput from "../../../../../components/Nx/NxApprovalInput";
import {
  getGdAttachmentCategory,
  recalculateGasDeposit,
  expireGasDeposit,
  getDetailGasDeposit,
  getDetailDraftGasDeposit,
  getDetailGdApprovalHierarchy,
  getGdApprovalHierarchy,
} from "../../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import NxAttachmentInput from "../../../../../components/Nx/NxAttachmentInput";
import SVGIcon from "../../../../../assets/Icon/index";

const RecalculateExpireGasDeposit = ({ formType, accountType }) => {
  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";
  const [current, setCurrent] = useState(0);

  const dispatch = useDispatch();

  const isRecalculate = formType === "recalculate";
  const isExpire = formType === "expire";

  const {
    loading_listGdApprovalHierarchy,
    loading_detailGdApprovalHierarchy,
    loading_detailGd,
    loading_detailDraftGd,
    loading_recalculateExpireGd,
    list_gdApprovalOptions,
    detail_gdApprovalHierarchy,
    detail_gasDeposit,
    detailDraft_gasDeposit,
    list_gdAttachmentCategory,
  } = useSelector((state) => state.gasDeposit);
  
  const loading =
    loading_listGdApprovalHierarchy ||
    loading_detailGdApprovalHierarchy ||
    loading_detailGd ||
    loading_detailDraftGd ||
    loading_recalculateExpireGd;
    
  //declare
  const location = useLocation();
  const [form] = Form.useForm();
  const accountId = location?.state?.accountId;
  const customerId = location?.state?.customerId;
  const idGd = location?.state?.id;
  
  const status = detail_gasDeposit.status || "DRAFT";
  const statusApproval = detail_gasDeposit.statusApproval || "DRAFT";

  const isDraft = location.state?.status === "DRAFT" || status === "DRAFT";
  const isActive = location.state?.status === "ACTIVE" || status === "ACTIVE";
  
  const isDraftApproval = location.state?.statusApproval === "DRAFT" || statusApproval === "DRAFT";
  const isRejectApproval = location.state?.statusApproval === "REJECT" || statusApproval === "REJECT";

  //state
  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");
  
  const attachmentIsRequired = true;
  
  const detail = (isActive && (isDraftApproval || isRejectApproval)) ? detailDraft_gasDeposit : detail_gasDeposit;
  const { details, attachments } = detail;

  const [selectedDetailId, setSelectedDetailId] = useState();

  const formFields = [
    [],
    ["appHierId"],
    []
  ];

  useEffect(() => {
    if (customerId) dispatch(getCustomerDetail(customerId));
  }, [customerId]);

  useEffect(() => {
    if (idGd) {
      if (isActive && (isDraftApproval || isRejectApproval))
        dispatch(getDetailDraftGasDeposit(idGd));
      else  
        dispatch(getDetailGasDeposit(idGd));
    }
  }, [idGd]);

  useEffect(() => {
    if (list_gdApprovalOptions.length) {
      const {
        accountId,
        appHierId,
      } = detail;

      form.setFieldsValue({
        accountId,
        appHierId
      });

      const appHierOption = list_gdApprovalOptions.find(
        (option) => option.appHierId === appHierId
      );

      if (appHierOption)
        handleSelectHiararchy(appHierId, appHierOption.approvalName);
    }
  }, [detail, list_gdApprovalOptions]);

  useEffect(() => {
    if (Array.isArray(attachments))
      setAttachmentDataSource([...attachments.map((attachment) => ({
        ...attachment,
        key: attachment.id,
      }))]);
  }, [attachments]);

  useEffect(() => {
    dispatch(getGdApprovalHierarchy());
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

  /**
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
                type: formType.toUpperCase(),
                id: idGd,
                data : {
                  accountId, 
                  appHierId,
                }
              }
    
              await dispatch(
                validateCreateUpdate({
                  body,
                  services: accountManagementService,
                  endPoint: `/v1/dbs/api/gas-deposit/validate-step`,
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
        id: idGd,
        accountId,
        appHierId,
        action: submitType
      };

      dispatch(
        validateCreateUpdate({
          body,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/gas-deposit/validate-${formType}`,
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
    if (accountId && customerId && accountType) {
      if (accountType === "standard") {
        dispatch(getAccountStandardDetail({ customerId, accountId }));
      } else {
        dispatch(getAccountOneTimeDetail({ customerId, accountId }));
      }
    }
  }, [dispatch, accountId, customerId, accountType]);

  const setAccount = (accountId, accountNumber, accountName) => {
    form.setFieldValue("accountId", accountId);
    form.setFieldValue("accountNumber", accountNumber);
    form.setFieldValue("accountName", accountName);
  };

  const handleSelectHiararchy = (appHierId, approvalName) => {
    dispatch(getDetailGdApprovalHierarchy(appHierId));
    form.setFieldValue("appHierName", approvalName);
  };

  const handleReset = () => {
    if (isRecalculate) {
      setAttachmentDataSource([]);
      setDeletedAttachments([]);
      form.resetFields();
      setCurrent(0);
    } else if (isExpire) {
      if (list_gdApprovalOptions?.length) {
        const { accountId, appHierId } = detail;

        form.setFieldsValue({ accountId, appHierId });

        const appHierOption = list_gdApprovalOptions.find(
          (option) => option.appHierId === appHierId
        );

        if (appHierOption)
          handleSelectHiararchy(appHierId, appHierOption.approvalName);
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

  const steps = [
    {
      title: "Gas Deposit",
      cards: [
        {
          header: "Gas Deposit Information",
          content: (
            <InfoGasDeposit
              detail={detail}
              key="tab-0-card-0"
            />
          )
        },
        {
          header: "Gas Deposit Detail",
          content: (
            <GasDepositDetailTable
              dataSource={details}
              handleView={({ id }) => setSelectedDetailId(id)}
              key="tab-0-card-1"
            />
          )
        },
        selectedDetailId &&
        {
          header: "Gas Deposit Detail Mutation",
          content: (
            <GasDepositDetailMutationTable
              detailId={selectedDetailId}
              key="tab-0-card-2"
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
              options={list_gdApprovalOptions}
              handleSelectHiararchy={handleSelectHiararchy}
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
              getAPICategory={getGdAttachmentCategory}
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
          appHierId
        } = form.getFieldsValue(true);

        const body = {
          stepNumber: current + 1,
          type: formType.toUpperCase(),
          id: idGd,
          data : {
            accountId, 
            appHierId,
          }
        }

        await dispatch(
          validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/gas-deposit/validate-step`,
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

  const handleButtonNext = async () => {
    await next();
  };

  const handleSubmitForm = () => {
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
      accountId,
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

    if (isRecalculate)
      dispatch(recalculateGasDeposit({ id: idGd, body, attachments: newAttachments, action: confirmationType.toUpperCase() }))
        .unwrap()
        .then((data) => {
          setTimeout(() => {
            navigate(navigateTarget, {
              state: {
                accountId,
                customerId
              }
            });
          }, 2000);
        })
        .catch((error) => {});
    else if (isExpire)
      dispatch(
        expireGasDeposit({
          id: idGd,
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
                accountId,
                customerId
              }
            });
          }, 2000);
        })
        .catch((error) => {});
  };

  return (
    <div>
      <div className="flex flex-col gap-y-4">
        <NxBreadCrumb routes={routes} />
        <HeaderDetail
          data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          dispatch={dispatch}
          accountId={accountId}
          customerId={customerId}
          type={accountType}
        />
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
              configApplication={configApp.ACCOUNT_SERVICE}
              loading={loading_recalculateExpireGd}
              detail={detail}
              details={details}
              handleSubmitForm={handleSubmitForm}
            />
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default RecalculateExpireGasDeposit;
