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

const CreateUpdateRelationship = ({
  accountType = "standard",
  formType = "create",
}) => {
  //declare
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const containerRef = useRef(null);
  const id = location?.state?.id;

  const accountId = location?.state?.idAccount;
  const customerId = location?.state?.idCustomer;

  const {
    data_attachmentList,
    list_relationshipAttachmentCategory,
    list_relationshipApprovalHierarchy,
    detail_relationshipApprovalHierarchy,
    detail_relationship,
    detailDraft_relationship,
    loading_detailRelationship,
    loading_detailRelationshipApprovalHierarchy,
    loading_listRelationshipApprovalHierarchy,
    loading_detailDraftRelationship,
    loading_detailRelationshipAttachment,
  } = useSelector(
    (state) => state.relationship
  );

  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";

  const isCreate = formType === "create";
  const isUpdate = formType === "update";

  const loading =
    loading_detailRelationship ||
    loading_listRelationshipApprovalHierarchy ||
    loading_detailRelationshipApprovalHierarchy ||
    loading_detailDraftRelationship ||
    loading_detailRelationshipAttachment;

  const status = detail_relationship.status || "DRAFT";
  const statusApproval = detail_relationship.statusApproval || "DRAFT";

  const isDraft = status === "DRAFT";
  const isActive = status === "ACTIVE";

  const isDraftApproval = statusApproval === "DRAFT";
  const isRejectApproval = statusApproval === "REJECT";

  const attachmentIsRequired = true;

  const detail = (isActive && (isDraftApproval || isRejectApproval))
    ? detailDraft_relationship
    : detail_relationship;

  //state
  const [current, setCurrent] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  const [attachmentDataSource, setAttachmentDataSource] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [relatedDetails, setRelatedDetails] = useState([]);

  useEffect(() => {
    if (accountId) {
      dispatch(getRelationshipAttachmentCategories({ accountId }));
      dispatch(getRelationshipApprovalHierarchies({ accountId }));
    }
  }, [accountId]);

  useEffect(() => {
    if (formType === "update" && id) {
      dispatch(getRelationship({ accountId, idRelationship: id }));
      dispatch(getRelationshipDraft({ accountId, idRelationship: id }));
    }
  }, [formType, id]);

  useEffect(() => {
    if (
      isUpdate &&
      detail.appHierId &&
      list_relationshipApprovalHierarchy?.length
    ) {
      form.setFieldsValue({
        relationshipType: detail.relationshipType,
        relationshipCategory: detail.relationshipCategory,
        startDate: NxDate.formatForAPI(detail.startDate),
        endDate: NxDate.formatForAPI(detail.endDate),
        description: detail.description || "",
        appHierId: detail.appHierId,
      });

      if (detail.relatedDetail && detail.relatedDetail.length > 0)
        setRelatedDetails(detail.relatedDetail);
    }
  }, [detail_relationship, list_relationshipApprovalHierarchy, formType]);

  useEffect(() => {
    if (data_attachmentList && data_attachmentList.length > 0 && formType === "update") {
      const mapped = data_attachmentList.map((item) => ({
        key: item.id,
        fileId: item.fileId || item.id,
        fileCategoryId: item.fileCategoryId,
        fileCategoryName: item.fileCategoryName,
        type: item.fileCategoryName,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.fileType,
        urlFile1: item.urlFile1,
        createdBy: item.createdBy,
        createdDate: item.createdDate,
        dataType: "exist",
      }));
      setAttachmentDataSource(mapped);
    }
  }, [data_attachmentList, formType]);

  const handleSelectHierarchy = (appHierId, approvalName) => {
    if (accountId && appHierId)
      dispatch(getRelationshipApprovalHierarchy({ accountId, appHierId }));
    form.setFieldValue("appHierName", approvalName);
  };

  const handleSubmitForm = () => {
    const {
      relationshipType,
      relationshipCategory,
      accountId: relatedAccountId,
      startDate,
      endDate,
      appHierId,
      remark,
    } = form.getFieldsValue(true);

    const attachments = nxRemoveKeys([
      ...attachmentDataSource.filter((a) => ["exist", "draft"].includes(a.dataType)),
      ...deletedAttachments,
    ]);
    const newAttachments = attachmentDataSource.filter((a) => a.dataType === "new");

    const payload = {
      relationshipType,
      relationshipCategory,
      relatedAccountId,
      accountId,
      startDate: NxDate.formatForAPI(startDate),
      endDate: NxDate.formatForAPI(endDate),
      appHierId,
      action: confirmationType,
      remark,
      attachments,
    };

    const detailRoute = isStandard
      ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
      : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME;

    if (formType === "create")
      dispatch(createRelationship({
        accountId,
        payload,
        attachments: newAttachments
      }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            navigate(detailRoute, { state: { idAccount: accountId, idCustomer: customerId } });
          }, 2000);
        })
        .catch(() => {});
    else if (isUpdate)
      dispatch(updateRelationship({
        accountId,
        idRelationship: id,
        payload,
        attachments: newAttachments
      }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            navigate(detailRoute, { state: { idAccount: accountId, idCustomer: customerId } });
          }, 2000);
        })
        .catch(() => {});
  };

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
          } else {
            await form.validateFields(formFields[current]);

            const {
              relationshipType,
              relationshipCategory,
              accountId: relatedAccountId,
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
        accountId: relatedAccountId,
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
          accountId: relatedAccountId,
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

  const prev = () => {
    setCurrent(current - 1);
  };

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

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

      if (data_attachmentList && data_attachmentList.length > 0) {
        const mapped = data_attachmentList.map((item) => ({
          key: item.id,
          fileId: item.fileId || item.id,
          fileCategoryId: item.fileCategoryId,
          fileCategoryName: item.fileCategoryName,
          type: item.fileCategoryName,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          urlFile1: item.urlFile1,
          createdBy: item.createdBy,
          createdDate: item.createdDate,
          dataType: "exist",
        }));
        setAttachmentDataSource(mapped);
      } else {
        setAttachmentDataSource([]);
      }

      setDeletedAttachments([]);

      setCurrent(0);
    }
  };

  const handleButtonNext = async () => {
    await next();
    scrollRightHandler();
  };

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
              handleSelectHiararchy={handleSelectHierarchy}
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
              getAPICategory={() => getRelationshipAttachmentCategories({ accountId })}
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
