import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Button, Form, Spin } from "antd";

import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import StepContents from "./StepContents";
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
  getMultiDestinationAttachment,
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

const CreateUpdateMultiDestination = ({ type }) => {
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const dispatch = useDispatch();

  const {
    data_accountDetail,
  } = useSelector((state) => state.accountManagement);

  const {
    loading,
    data_mdApprovalHierarchy,
    detail_mdApprovalHierarchy,
    detail_multiDestination,
    detailDraft_multiDestination,
    list_mdDetailAttachment,
  } = useSelector((state) => state.multiDestination);

  //declare
  const location = useLocation();
  const [form] = Form.useForm();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idMd = location?.state?.id;
  const accountType = location?.state?.type; // "standard" or "onetime"

  const isCreate = type === "create";
  const isUpdate = type === "update";

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
  const [dataAttachment, setDataAttachment] = useState([]);

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

  const validationTypes = ["DATA", "APPROVAL", "ATTACHMENT"];

  const { InformationForm, AttachmentForm, ApprovalForm } = StepContents;

  useEffect(() => {
    if (isUpdate && idMd) {
      dispatch(getDetailMultiDestination(idMd));
      dispatch(getDetailDraftMultiDestination(idMd));
      dispatch(getMultiDestinationAttachment({ id: idMd }));
    }
  }, [type, idMd]);

  useEffect(() => {
    if (
      isUpdate &&
      detail &&
      data_mdApprovalHierarchy?.length
    ) {
      const {
        subjectId,
        objectId,
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
        subjectId,
        objectId,
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

      const appHierOption = data_mdApprovalHierarchy.find((option) => option.appHierId === appHierId);

      if (appHierOption)
        handleSelectHiararchy(appHierId, appHierOption.approvalName);
    }
  }, [detail, data_mdApprovalHierarchy]);

  useEffect(() => {
    if (isUpdate) {
      const result = list_mdDetailAttachment?.map((item, index) => ({
        ...item,
        key: `multi-destination-attachment-${item.id}`,
        dataType: "exist"
      }));
      setDataAttachment([
        ...result,
      ]);
    }
  }, [list_mdDetailAttachment]);

  useEffect(() => {
    dispatch(getMdApprovalHierarchy());
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
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
      state: {
        idAccount,
        idCustomer,
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
          await form.validateFields(formFields[current]);

          const {
            objectId,
            description,
            startDate,
            endDate,
            appHierId,
          } = form.getFieldsValue(true);

          const body = {
            id: isUpdate ? idMd : undefined,
            subjectId: data_accountDetail?.accountInformation?.accountId,
            objectId,
            description,
            startDate: NxDate.formatForAPI(startDate),
            endDate: NxDate.formatForAPI(endDate),
            appHierId,
            validationType: validationTypes[current],
          };

          await dispatch(validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/multi-destination/validate-${type}`,
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
      } = form.getFieldsValue(true);

      const body = {
        id: isUpdate ? idMd : undefined,
        subjectId: data_accountDetail?.accountInformation?.accountId,
        objectId,
        description,
        startDate: NxDate.formatForAPI(startDate),
        endDate: NxDate.formatForAPI(endDate),
        appHierId,
        action: submitType,
      };

      dispatch(validateCreateUpdate({
        body,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/multi-destination/validate-${type}`,
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

  const setAccount = (
    {
      objectId,
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
      country,
      longitude,
      latitude,
    }
  ) => {
    form.setFieldsValue({
      objectId,
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
    });
  };

  const handleSelectHiararchy = (appHierId, approvalName) => {
    dispatch(getDetailMdApprovalHierarchy({ id: appHierId }));
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
            accountId={idAccount}
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
          <ApprovalForm
            form={form}
            dataTable={(detail_mdApprovalHierarchy || []).map((detail, index) => ({
              ...detail,
              employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
                ...employeeDetail,
                key: `employee-detail-${index}`
              })),
              key: `detail-detail-${index}`,
            }))}
            dataOption={data_mdApprovalHierarchy}
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
        directRender: true,
        content: (
          <AttachmentForm
            type={type}
            data={dataAttachment}
            updateData={setDataAttachment}
            dispatch={dispatch}
            key={`multi-destination-tab-2`}
            getAPICategory={getMdAttachmentCategory}
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
        if (attachmentIsRequired && !dataAttachment.length) {
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
          objectId,
          description,
          startDate,
          endDate,
          appHierId,
        } = form.getFieldsValue(true);

        const body = {
          id: isUpdate ? idMd : undefined,
          subjectId: data_accountDetail?.accountInformation?.accountId,
          objectId,
          description,
          startDate: NxDate.formatForAPI(startDate),
          endDate: NxDate.formatForAPI(endDate),
          appHierId,
          validationType: validationTypes[current],
        };

        await dispatch(validateCreateUpdate({
          body,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/multi-destination/validate-${type}`,
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
        } else {
          await form.validateFields(formFields[i]);

          const {
            objectId,
            description,
            startDate,
            endDate,
            appHierId,
          } = form.getFieldsValue(true);

          const body = {
            id: isUpdate ? idMd : undefined,
            subjectId: data_accountDetail?.accountInformation?.accountId,
            objectId,
            description,
            startDate: NxDate.formatForAPI(startDate),
            endDate: NxDate.formatForAPI(endDate),
            appHierId,
            validationType: validationTypes[i],
          };

          await dispatch(validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/multi-destination/validate-${type}`,
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
      remark,
    } = form.getFieldsValue(true);

    const body = {
      id: idMd,
      subjectId: data_accountDetail?.accountInformation?.accountId,
      objectId,
      priority,
      description,
      startDate: NxDate.formatForAPI(startDate),
      endDate: NxDate.formatForAPI(endDate),
      appHierId,
      action: confirmationType,
      remark,
    };

    const newAttachments = dataAttachment.filter((a) => a.dataType !== "exist");

    if (isCreate)
      dispatch(createMultiDestination({ body, attachments: newAttachments }))
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
        }, 2000);
      })
      .catch((error) => {});
    else if (isUpdate)
      dispatch(updateMultiDestination({ id: idMd, body, attachments: dataAttachment.filter((attachment) => attachment.dataType !== "exist") }))
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
      if (
        detail &&
        data_mdApprovalHierarchy?.length
      ) {
        const {
          subjectId,
          objectId,
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
          subjectId,
          objectId,
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

        const appHierOption = data_mdApprovalHierarchy.find((option) => option.appHierId === appHierId);

        if (appHierOption)
          handleSelectHiararchy(appHierId, appHierOption.approvalName);
      }

      const result = list_mdDetailAttachment?.map((item, index) => ({
        ...item,
        key: `multi-destination-attachment-${item.id}`,
        dataType: "exist"
      }));
      setDataAttachment([
        ...result,
      ]);

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
              step.cards.map((card, cardIndex) =>
                card.directRender ? (
                  <div
                    key={`${stepIndex}-${cardIndex}`}
                    className={`${current !== stepIndex || card.hidden ? "hidden" : ""}`}
                  >
                    {card.content}
                  </div>
                ) : (
                  <NxCardContainer
                    header={card.header}
                    className={`${current !== stepIndex || card.hidden ? "hidden" : ""}`}
                    key={`${stepIndex}-${cardIndex}`}
                  >
                    <NxBaseContainer border>{card.content}</NxBaseContainer>
                  </NxCardContainer>
                )
              )
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
                    { isUpdate ? "Reset" : "Clear" }
                  </Button>
                  <Button
                    onClick={() => handleSetShowConfirmationModal(true, "draft")}
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
                        onClick={() => handleSetShowConfirmationModal(true, "submit")}
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
              formId={"multiDestinationForm"}
              isOpen={showConfirmationModal}
              handleCancel={() => handleSetShowConfirmationModal(false)}
              approvalData={(detail_mdApprovalHierarchy || []).map((detail, index) => ({
                ...detail,
                employeeDetail: detail.employeeDetail.map((employeeDetail, index) => ({
                  ...employeeDetail,
                  key: `employee-detail-${index}`
                })),
                key: `detail-detail-${index}`,
              }))}
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

export default CreateUpdateMultiDestination;
