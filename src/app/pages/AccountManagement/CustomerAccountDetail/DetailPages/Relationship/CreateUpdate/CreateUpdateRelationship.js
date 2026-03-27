import SVGIcon from "../../../../../../../assets/Icon/index";
import { useEffect, useState, useRef } from "react";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderDetail from "../../../HeaderDetail";
import BreadCrumb from "../../../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import RelationshipApproval from "./StepContents/ApprovalForm/RelationshipApproval";
import RelationshipAttachment from "./StepContents/AttachmentForm/RelationshipAttachment";
import RelationshipInfo from "./StepContents/InformationForm/RelationshipInfo";
import RelatedDetailCard from "./StepContents/InformationForm/RelatedDetailCard";
import {
  createRelationship,
  getApprovalHierarchies,
  getApprovalHierarchyDetail,
  getAttachmentCategory,
  getAttachmentList,
  getDetailDraftRelationship,
  getRelationshipDetail,
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
import { dateFormat, dateFormatting } from "../../../../../../../utils";

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

  //modal
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;

  // Get Attachment Category and List from Store
  const {
    data_attachmentList,
    data_approvalHierarchies,
    data_approvalHierarchyDetail,
    data_relationshipDetail,
    detailDraft_relationshipDetail,
    data_relationshipType,
    data_relationshipCategory,
    loading_detailRelationship,
    loading_listRelationshipApprovalHierarchyDetail,
    loading_listRelationshipApprovalOption,
    loading_detailDraftRelationship,
    loading_detailRelationshipAttachment,
  } = useSelector(
    (state) => state.relationship
  );

  const isStandard = accountType === "standard";
  const isOneTime = accountType === "oneTime";

  const isCreate = formType ==="create";
  const isUpdate = formType ==="update";

  const loading =
    loading_detailRelationship ||
    loading_listRelationshipApprovalOption ||
    loading_listRelationshipApprovalHierarchyDetail ||
    loading_detailDraftRelationship ||
    loading_detailRelationshipAttachment;

  const status = data_relationshipDetail.status || "DRAFT";
  const statusApproval = data_relationshipDetail.statusApproval || "DRAFT";

  const isDraft = status === "DRAFT";
  const isActive = status === "ACTIVE";

  const isDraftApproval = statusApproval === "DRAFT";
  const isRejectApproval = statusApproval === "REJECT";

  const detail = (isActive && statusApproval && isDraftApproval && isRejectApproval)
    ? detailDraft_relationshipDetail
    : data_relationshipDetail;

  // State Management
  const [current, setCurrent] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  // Relationship Data States
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [relatedDetails, setRelatedDetails] = useState([]);

  useEffect(() => {
    if (idAccount) {
      dispatch(getAttachmentCategory({ idAccount }));
      dispatch(getApprovalHierarchies({ idAccount }));
    }
  }, [idAccount]);

  useEffect(() => {
    if (formType === "update" && id) {
      dispatch(getAttachmentList({ idAccount, idRelationship: id }));
      dispatch(getRelationshipDetail({ idAccount, idRelationship: id }));
      dispatch(getDetailDraftRelationship({ idAccount, idRelationship: id }));
    }
  }, [formType, id]);

  // Populate form when both detail data AND approval hierarchy list are loaded (update mode)
  useEffect(() => {
    if (
      formType === "update" &&
      detail?.appHierId &&
      detail?.relationshipType &&
      data_relationshipDetail?.id &&
      data_approvalHierarchies?.length &&
      data_relationshipType?.length &&
      data_relationshipCategory?.length
    ) {
      // Set form values
      form.setFieldsValue({
        relationshipType: detail.relationshipType,
        relationshipCategory: detail.relationshipCategory,
        startDate: NxDate.formatForAPI(detail.startDate),
        endDate: NxDate.formatForAPI(detail.endDate),
        description: detail.description || "",
        appHierId: detail.appHierId,
      });

      // Find matching approval option and load hierarchy detail
      const appHierOption = data_approvalHierarchies.find(
        (option) => option.appHierId === detail.appHierId
      );

      if (appHierOption)
        form.setFieldValue("appHierName", appHierOption.approvalName);

      // Find matching relationship type option
      const relationshipTypeOption = data_relationshipType.find(
        (option) => option.id === detail.relationshipType
      );

      if (relationshipTypeOption)
        form.setFieldValue("relationshipTypeName", relationshipTypeOption.text);

      // Find matching relationship category option
      const relationshipCategoryOption = data_relationshipCategory.find(
        (option) => option.id === detail.relationshipCategory
      );

      if (relationshipCategoryOption)
        form.setFieldValue("relationshipCategoryName", relationshipCategoryOption.text);

      // Populate Related Detail data for update mode
      if (detail.relatedDetail && detail.relatedDetail.length > 0)
        setRelatedDetails(detail.relatedDetail);
    }
  }, [data_relationshipDetail, data_approvalHierarchies, formType]);

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
      setListDataAttachment(mapped);
    }
  }, [data_attachmentList, formType]);

  const handleSelectHierarchy = (appHierId, appHierOptions) => {
    if (idAccount && appHierId)
      dispatch(getApprovalHierarchyDetail({ idAccount, appHierId }));

    if (appHierOptions) {
      const appHierLabel = appHierOptions.children;
      form.setFieldsValue({ appHierLabel })
    }
  };

  const handleSubmitForm = () => {
    const {
      relationshipType,
      relationshipCategory,
      objectId,
      startDate,
      endDate,
      appHierId,
      remark,
    } = form.getFieldsValue(true);

    const payload = {
      relationshipType,
      relationshipCategory,
      objectId,
      subjectId: idAccount,
      startDate: NxDate.formatForAPI(startDate),
      endDate: NxDate.formatForAPI(endDate),
      appHierId,
      action: confirmationType,
      remark,
    };

    // Filter only new attachments (not existing ones)
    const newAttachments = listDataAttachment.filter(a => a.dataType !== "exist");

    if (formType === "create")
      dispatch(createRelationship({
        idAccount,
        payload,
        attachments: newAttachments
      }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        })
        .catch(() => {});
    else if (isUpdate)
      dispatch(updateRelationship({
        idAccount,
        idRelationship: id,
        payload,
        attachments: newAttachments
      }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        })
        .catch(() => {});
  };

  const handleSetShowConfirmationModal = async (show, submitType) => {
    if (show) {
      try {
        if (current === 2) {
          if (listDataAttachment.length === 0) {
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
            objectId,
            startDate,
            endDate,
            description,
            appHierId,
          } = form.getFieldsValue(true);

          const body = {
            id: isUpdate ? id : undefined,
            subjectId: idAccount,
            relationshipType,
            relationshipCategory,
            objectId,
            description,
            startDate,
            endDate,
            appHierId,
            validationType: validationTypes[current],
          };

          await dispatch(validateCreateUpdate({
            body,
            services: accountManagementService,
            endPoint: `/v1/dbs/api/accounts/${idAccount}/relationships/validate-${formType}`,
            type: formType,
          })).unwrap();
        }
      } catch (err) {
        return;
      }

      const {
        relationshipType,
        relationshipCategory,
        objectId,
        startDate,
        endDate,
        description,
        appHierId,
      } = form.getFieldsValue(true);

      const body = {
        id: isUpdate ? id : undefined,
        subjectId: idAccount,
        relationshipType,
        relationshipCategory,
        objectId,
        description,
        startDate,
        endDate,
        appHierId,
        action: submitType,
      };

      dispatch(validateCreateUpdate({
        body,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/accounts/${idAccount}/relationships/validate-${formType}`,
        type: formType,
      }))
        .unwrap()
        .then(() => {
          setShowConfirmModal(show);
          setConfirmationType(submitType);
        })
        .catch(() => { });
    } else {
      setShowConfirmModal(show);
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

  const validationTypes = ["DATA", "APPROVAL", "ATTACHMENT"];

  // Navigation handlers
  const next = async () => {
    try {
      if (current === 2) {
        if (listDataAttachment.length === 0) {
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
          objectId,
          startDate,
          endDate,
          description,
          appHierId,
        } = form.getFieldsValue(true);

        const body = {
          id: isUpdate ? id : undefined,
          subjectId: idAccount,
          relationshipType,
          relationshipCategory,
          objectId,
          description,
          startDate,
          endDate,
          appHierId,
          validationType: validationTypes[current],
        };

        await dispatch(validateCreateUpdate({
          body,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/accounts/${idAccount}/relationships/validate-${formType}`,
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
      setListDataAttachment([]);
      setRelatedDetails([]);
      form.resetFields();
      setCurrent(0);
    } else if (isUpdate) {
      // Update mode - restore to original API data
      if (data_relationshipDetail && data_relationshipDetail.id) {
        // Restore form values to original
        form.setFieldsValue({
          relationshipType: detail.relationshipType,
          relationshipCategory: detail.relationshipCategory,
          relatedName: detail.objectName,
          relatedNumber: detail.objectNumber,
          startDate: detail.startDate,
          endDate: detail.endDate,
          description: detail.description || "",
          appHierId: detail.appHierId,
          appHierName: detail.appHierName,
        });

        // Restore approval hierarchy detail
        if (detail.appHierId) {
          dispatch(getApprovalHierarchyDetail({ idAccount, appHierId: detail.appHierId }));
        }

        // Restore Related Detail data
        if (detail.relatedDetail && detail.relatedDetail.length > 0) {
          setRelatedDetails(detail.relatedDetail);
        } else {
          setRelatedDetails([]);
        }
      }

      // Restore attachment list to original API data
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
          dataType: "exist",
        }));
        setListDataAttachment(mapped);
      } else {
        setListDataAttachment([]);
      }

      // Reset to first step
      setCurrent(0);
    }
  };

  const handleButtonNext = async () => {
    await next();
    scrollRightHandler();
  };

  // Steps Configuration
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
            <RelationshipApproval
              form={form}
              dataApprovalList={data_approvalHierarchies}
              dataDetailApproval={(data_approvalHierarchyDetail || []).map((item, index) => ({
                ...item,
                employeeDetail: (item.employeeDetail || []).map((emp, empIndex) => ({
                  ...emp,
                  key: `employee-detail-${empIndex}`,
                })),
                key: `detail-detail-${index}`,
              }))}
              handleSelectHierarchy={handleSelectHierarchy}
              loading={loading_listRelationshipApprovalHierarchyDetail}
              key={`relationship-tab-1`}
              className={`${current !== 1 ? "hidden" : ""}`}
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
            <RelationshipAttachment
              data={listDataAttachment}
              updateData={setListDataAttachment}
              dispatch={dispatch}
              key={`relationship-tab-2`}
              className={`${current !== 2 ? "hidden" : ""}`}
              mandatory
            />
          )
        }
      ]
    },
  ];

  return (
    <>
      <LayoutMenu>
        <div className="flex flex-col gap-y-4">
          <BreadCrumb routes={routes} />
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            idAccount={idAccount}
            idCustomer={idCustomer}
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
              {/* Steps Content */}
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
                  <div className="flex w-full justify-end gap-x-4">
                    <Button
                      icon={<SVGIcon name="IconButtonClear" width={14} />}
                      type="reject"
                      onClick={handleClear}
                    >
                      {isCreate ? "Clear" : "Reset"}
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
                formId={"relationshipForm"}
                isOpen={showConfirmModal}
                handleCancel={() => {handleSetShowConfirmationModal(false)}}
                approvalData={(data_approvalHierarchyDetail || []).map((item, index) => ({
                  ...item,
                  employeeDetail: (item.employeeDetail || []).map((emp, empIndex) => ({
                    ...emp,
                    key: `employee-detail-${empIndex}`,
                  })),
                  key: `detail-detail-${index}`,
                }))}
                type={confirmationType}
                attachmentData={listDataAttachment}
                idAccount={idAccount}
                configApplication={configApp.ACCOUNT_SERVICE}
                relatedDetails={relatedDetails}
              />
            </Form>
          </Spin>
        </div>
      </LayoutMenu>
    </>
  );
};

export default CreateUpdateRelationship;
