import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Spin } from "antd";
import InformationForm from "./StepContents/InformationForm/InfoMultiDestination";
import NxApprovalInput from "../../../../../../../components/Nx/NxApprovalInput";
import NxAttachmentInput from "../../../../../../../components/Nx/NxAttachmentInput";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import {
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../../redux/slices/account_management/accountManagement";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import {
  createMultiDestination,
  getDetailMultiDestination,
  getDetailDraftMultiDestination,
  getDetailMdApprovalHierarchy,
  getMdApprovalHierarchy,
  getMdAttachmentCategory,
  updateMultiDestination,
} from "../../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { showModalError, validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../../../constants/configApp";
import HeaderDetail from "../../../HeaderDetail";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";
import { NxFormStepper } from "../../../../../../../components/Nx/NxFormStepNavigation";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import { nxRemoveKeys } from "../../../../../../../components/Nx/NxRemoveKeys";

const CreateUpdateMultiDestination = ({ accountType = "standard", formType = "create" }) => {
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const dispatch = useDispatch();

  const isCreate = formType === "create";
  const isUpdate = formType === "update";

  const {
    loading_listMdApprovalOption,
    list_mdApprovalOptions,
    loading_listMdApprovalHierarchyDetail,
    list_mdApprovalHierarchyDetail,
    loading_detailMd,
    detail_multiDestination,
    loading_detailDraftMd,
    detailDraft_multiDestination,
    loading_createUpdateMd,
    list_mdAttachmentCategory,
  } = useSelector((state) => state.multiDestination);

  const loading =
    loading_listMdApprovalOption ||
    loading_listMdApprovalHierarchyDetail ||
    loading_detailMd ||
    loading_detailDraftMd;

  //declare
  const location = useLocation();
  const [form] = Form.useForm();
  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;
  const idMd = location?.state?.id;

  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";

  const status = detail_multiDestination.status || "DRAFT";
  const statusApproval = detail_multiDestination.statusApproval || "DRAFT";

  const isDraft = status === "DRAFT";
  const isActive = status === "ACTIVE";
  const isDraftApproval = statusApproval === "DRAFT";
  const isRejectApproval = statusApproval === "REJECT";

  const detail = (isActive && (isDraftApproval || isRejectApproval))
    ? detailDraft_multiDestination
    : detail_multiDestination;

  //state
  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const attachmentIsRequired = true;

  const formFields = [
    [
      "account",
      "accountSor",
      "accountCostCenter",
      "meterReadingCode",
      "accountSegment",
      "accountGroupType",
      "accountType",
      "premiseAddress",
      "subDistrict",
      "district",
      "city",
      "country",
      "longitude",
      "latitude",
      "startDate",
      "endDate",
      "description",
    ],
    [
      "appHierId",
    ],
    []
  ];

  useEffect(() => {
    if (isUpdate && idMd) {
      dispatch(getDetailMultiDestination(idMd));
      dispatch(getDetailDraftMultiDestination(idMd));
    }
  }, [formType, idMd]);

  useEffect(() => {
    if (
      isUpdate &&
      detail &&
      list_mdApprovalOptions?.length
    ) {
      const {
        accountId,
        accountName,
        accountNumber,
        sor: accountSor,
        costCenter: accountCostCenter,
        meterReadingCodes: meterReadingCode,
        segment: accountSegment,
        accountGroupType,
        accountType,
        premiseAddress,
        subDistrict,
        district,
        city,
        country,
        longitude,
        latitude,
        startDate,
        endDate,
        description,
        appHierId,
      } = detail;

      form.setFieldsValue({
        accountId,
        account: `${accountNumber}-${accountName}`,
        accountSor,
        accountCostCenter,
        meterReadingCode,
        accountSegment,
        accountGroupType,
        accountType,
        premiseAddress,
        subDistrict,
        district,
        city,
        country,
        longitude,
        latitude,
        startDate,
        endDate,
        description,
        appHierId,
      });

      const appHierOption = list_mdApprovalOptions.find((option) => option.appHierId === appHierId);

      if (appHierOption)
        handleSelectHiararchy(appHierId, appHierOption.approvalName);
    }
  }, [detail, list_mdApprovalOptions]);

  useEffect(() => {
    if (isUpdate && detail?.attachments)
      setAttachmentDataSource([...detail.attachments.map((attachment) => ({
        ...attachment,
        key: attachment.id,
      }))]);
  }, [detail]);

  useEffect(() => {
    dispatch(getMdApprovalHierarchy());
  }, []);

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
      breadcrumbName: isCreate ? "Create Multi Destination" : isUpdate ? "Update Multi Destination" : "",
    },
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
                description: `Please upload at least one attachment`,
              };

              dispatch(showModalError(errorBody));

              throw new Error("There was no file attached");
            }
          }
          else {
            await form.validateFields(formFields[current]);

            const {
              accountId: relatedAccountId,
              description,
              startDate,
              endDate,
              appHierId,
            } = form.getFieldsValue(true);

            const body = {
              stepNumber: current + 1,
              type: formType.toUpperCase(),
              id: idMd,
              data: {
                accountId,
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
              endPoint: `/v1/dbs/api/multi-destination/validate-step`,
              type: formType,
            }))
            .unwrap();
          }
        } else if (submitType === "draft") {
          await form.validateFields(["account"]);
        } else {
          return;
        }
      } catch (err) {
        return;
      }

      const {
        accountId: relatedAccountId,
        description,
        startDate,
        endDate,
        appHierId,
      } = form.getFieldsValue(true);

      const body = {
        id: idMd,
        accountId,
        relatedAccountId,
        description,
        startDate: NxDate.formatForAPI(startDate),
        endDate: NxDate.formatForAPI(endDate),
        appHierId,
        action: submitType,
      };

      dispatch(validateCreateUpdate({
        body,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/multi-destination/validate-${formType}`,
        type: formType,
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
  };

  // Fetch Account Standard/OneTime Detail
  useEffect(() => {
    if (accountId && customerId && accountType) {
      if (isStandard) {
        dispatch(getAccountStandardDetail({ idCustomer: customerId, idAccount: accountId }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer: customerId, idAccount: accountId }));
      }
    }
  }, [dispatch, accountId, customerId, accountType]);

  const setAccount = (
    {
      accountId,
      accountNumber,
      accountName,
      accountSor,
      accountCostCenter,
      meterReadingCode,
      accountSegment,
      accountGroupType,
      accountType,
      premiseAddress,
      subDistrict,
      district,
      city,
      province,
      country,
      longitude,
      latitude,
    }
  ) => {
    form.setFieldsValue({
      accountId,
      account: `${accountNumber}-${accountName}`,
      accountSor,
      accountCostCenter,
      meterReadingCode,
      accountSegment,
      accountGroupType,
      accountType,
      premiseAddress,
      subDistrict,
      district,
      city,
      province,
      country,
      longitude,
      latitude,
    });
  };

  const handleSelectHiararchy = (appHierId, approvalName) => {
    dispatch(getDetailMdApprovalHierarchy(appHierId));
    form.setFieldValue("appHierName", approvalName);
  };

  const steps = [
    {
      title: "Multi Destination",
      cards: [{
        header: "Multi Destination Information",
        content: (
          <InformationForm
            form={form}
            isUpdate={isUpdate}
            isDraft={isDraft}
            setAccount={setAccount}
            accountId={accountId}
            key={`multi-destination-tab-0`}
          />
        )
      }],
      disabled: false
    },
    {
      title: "Approval",
      cards: [{
        header: "Approval",
        content: (
          <NxApprovalInput
            form={form}
            hierarchyDetails={list_mdApprovalHierarchyDetail || []}
            options={list_mdApprovalOptions}
            handleSelectHiararchy={handleSelectHiararchy}
            key={`multi-destination-tab-1`}
          />
        )
      }],
      disabled: false
    },
    {
      title: "Attachment",
      cards: [{
        header: "Attachment",
        content: (
          <NxAttachmentInput
            data={attachmentDataSource}
            updateData={setAttachmentDataSource}
            setDeleted={setDeletedAttachments}
            key={`multi-destination-tab-2`}
            getAPICategory={getMdAttachmentCategory}
            categoryData={list_mdAttachmentCategory}
            service={accountManagementService}
            configApplication={configApp.ACCOUNT_SERVICE}
            mandatory={attachmentIsRequired}
          />
        )
      }],
      disabled: false
    },
  ];

  const navigate = useNavigate();

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
          accountId: relatedAccountId,
          description,
          startDate,
          endDate,
          appHierId,
        } = form.getFieldsValue(true);

        const body = {
          stepNumber: current + 1,
          type: formType.toUpperCase(),
          id: idMd,
          data: {
            accountId,
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
          endPoint: `/v1/dbs/api/multi-destination/validate-step`,
          type: formType,
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
          if (attachmentIsRequired && !attachmentDataSource.length) {
            const errorBody = {
              title: "Failed",
              description: `Please upload at least one attachment`,
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
            appHierId,
          } = form.getFieldsValue(true);

          const body = {
            stepNumber: current + 1,
            type: formType.toUpperCase(),
            id: idMd,
            data: {
              accountId,
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
            endPoint: `/v1/dbs/api/multi-destination/validate-step`,
            type: formType,
          }))
          .unwrap();
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
      description,
      startDate,
      endDate,
      appHierId,
      remark,
    } = form.getFieldsValue(true);

    const attachments = nxRemoveKeys([
      ...attachmentDataSource.filter((a) => ["exist", "draft"].includes(a.dataType)),
      ...deletedAttachments,
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
      attachments,
    };

    const newAttachments = attachmentDataSource.filter((a) => a.dataType === "new");

    const detailRoute = isStandard
      ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
      : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME;

    if (isCreate)
      dispatch(createMultiDestination({ body, attachments: newAttachments, action: confirmationType }))
      .unwrap()
      .then((data) => {
        setTimeout(() => {
          navigate(
            detailRoute,
            {
              state: {
                idAccount: accountId,
                idCustomer: customerId,
              }
            }
          );
        }, 2000);
      })
      .catch((error) => {});
    else if (isUpdate)
      dispatch(updateMultiDestination({ id: idMd, body, attachments: attachmentDataSource.filter((attachment) => attachment.dataType === "new"), action: confirmationType }))
      .unwrap()
        .then((data) => {
          setTimeout(() => {
            navigate(
              detailRoute,
              {
                state: {
                  idAccount: accountId,
                  idCustomer: customerId,
                }
              }
            );
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
      if (
        detail &&
        list_mdApprovalOptions?.length
      ) {
        const {
          accountId: relatedAccountId,
          accountName,
          accountNumber,
          sor: accountSor,
          costCenter: accountCostCenter,
          meterReadingCodes: meterReadingCode,
          segment: accountSegment,
          accountGroupType,
          accountType,
          premiseAddress,
          subDistrict,
          district,
          city,
          country,
          longitude,
          latitude,
          startDate,
          endDate,
          description,
          appHierId,
        } = detail;

        form.setFieldsValue({
          accountId,
          relatedAccountId,
          account: `${accountNumber}-${accountName}`,
          accountSor,
          accountCostCenter,
          meterReadingCode,
          accountSegment,
          accountGroupType,
          accountType,
          premiseAddress,
          subDistrict,
          district,
          city,
          country,
          longitude,
          latitude,
          startDate,
          endDate,
          description,
          appHierId,
        });

        const appHierOption = list_mdApprovalOptions.find((option) => option.appHierId === appHierId);

        if (appHierOption)
          handleSelectHiararchy(appHierId, appHierOption.approvalName);
      }

      if (detail?.attachments)
        setAttachmentDataSource([...detail.attachments]);
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
        />
        <Spin
          spinning={loading}
        >
          <Form
            id="multiDestinationForm"
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
                  onClick={() => { navigate(-1); }}
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
              formId={"multiDestinationForm"}
              isOpen={showConfirmationModal}
              handleCancel={() => handleSetShowConfirmationModal(false)}
              approvalData={list_mdApprovalHierarchyDetail || []}
              type={confirmationType}
              attachmentDataSource={attachmentDataSource}
              service={accountManagementService}
              configApplication={configApp.ACCOUNT_SERVICE}
              loading={loading_createUpdateMd}
              handleSubmitForm={handleSubmitForm}
            />
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default CreateUpdateMultiDestination;
