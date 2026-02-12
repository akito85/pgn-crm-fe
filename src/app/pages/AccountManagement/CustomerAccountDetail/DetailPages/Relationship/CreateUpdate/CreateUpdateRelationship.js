import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import moment from "moment";
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
  getRelationshipDetail,
  updateRelationship
} from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin } from "antd";
import { showModalError, validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import { NxFormStepper } from "../../../../../../../components/Nx/NxFormStepNavigation";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import { configApp } from "../../../../../../../constants/configApp";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";

const CreateUpdateRelationship = ({
  type = {},
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
  const accountType = location?.state?.type;

  // Get Attachment Category and List from Store
  const {
    data_attachmentList,
    data_approvalHierarchies,
    data_approvalHierarchyDetail,
    data_relationshipDetail,
    loadingDetail,
    loadingApprovalHierarchyDetail
  } = useSelector(
    (state) => state.relationship
  );

  // State Management
  const [current, setCurrent] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");

  // Relationship Data States
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [relatedDetailData, setRelatedDetailData] = useState([]);

  useEffect(() => {
    if (idAccount) {
      dispatch(getAttachmentCategory({ idAccount }));
      dispatch(getApprovalHierarchies({ idAccount }));
    }
  }, [idAccount]);

  useEffect(() => {
    if (type === "update" && id) {
      dispatch(getAttachmentList({ idAccount, idRelationship: id }));
      dispatch(getRelationshipDetail({ idAccount, idRelationship: id }));
    }
  }, [type, id]);

  // Populate form when both detail data AND approval hierarchy list are loaded (update mode)
  useEffect(() => {
    if (
      type === "update" &&
      data_relationshipDetail?.id &&
      data_approvalHierarchies?.length
    ) {
      const detail = data_relationshipDetail;

      // Set form values
      form.setFieldsValue({
        relationshipType: detail.relationshipType,
        relationshipCategory: detail.relationshipCategory,
        relatedName: detail.objectName,
        relatedNumber: detail.objectNumber,
        startDate: detail.startDate ? moment(detail.startDate) : null,
        endDate: detail.endDate ? moment(detail.endDate) : null,
        description: detail.description || "",
        appHierId: detail.appHierId,
        appHierName: detail.appHierName,
      });

      // Find matching approval option and load hierarchy detail
      if (detail.appHierId) {
        const appHierOption = data_approvalHierarchies.find(
          (option) => option.appHierId === detail.appHierId
        );

        if (appHierOption) {
          handleSelectHierarchy(detail.appHierId);
        }
      }

      // Populate Related Detail data for update mode
      if (detail.relatedDetail && detail.relatedDetail.length > 0) {
        setRelatedDetailData(detail.relatedDetail);
      }
    }
  }, [data_relationshipDetail, data_approvalHierarchies, type]);

  useEffect(() => {
    if (data_attachmentList && data_attachmentList.length > 0 && type === "update") {
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
        createdDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "-",
        dataType: "exist",
      }));
      setListDataAttachment(mapped);
    }
  }, [data_attachmentList, type]);

  const handleSelectHierarchy = (appHierId, appHierOptions) => {
    if (idAccount && appHierId)
      dispatch(getApprovalHierarchyDetail({ idAccount, appHierId }));

    const appHierLabel = appHierOptions.children;
    form.setFieldsValue({ appHierLabel })
  };

  const handleSubmitForm = () => {
    const {
      relationshipType,
      relationshipCategory,
      objectId,
      startDate,
      endDate,
    } = form.getFieldsValue();

    const payload = {
      relationshipType,
      relationshipCategory,
      objectId,
      subjectId: idAccount,
      startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
      action: confirmationType,
      remark: form.getFieldValue("remark"),
    };

    // Filter only new attachments (not existing ones)
    const newAttachments = listDataAttachment.filter(a => a.dataType !== "exist");

    if (type === "create")
      dispatch(createRelationship({
        idAccount,
        payload,
        attachments: newAttachments
      }))
        .unwrap()
        .then(() => {
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
        .catch(() => {});
    else if (type === "update")
      dispatch(updateRelationship({
        idAccount,
        idRelationship: id,
        payload,
        attachments: newAttachments
      }))
        .unwrap()
        .then(() => {
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
          } = form.getFieldsValue();

          const body = {
            id: type === "update" ? id : undefined,
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
            endPoint: `/v1/dbs/api/accounts/${idAccount}/relationships/validate-${type}`,
            type,
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
      } = form.getFieldsValue();

      const body = {
        id: type === "update" ? id : undefined,
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
        endPoint: `/v1/dbs/api/accounts/${idAccount}/relationships/validate-${type}`,
        type,
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
      breadcrumbName: "Account Management",
    },
    {
      path: "",
      breadcrumbName: "Customer/Account",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
    },
    {
      path:
        type === "create"
          ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP
          : ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP,
      breadcrumbName:
        type === "create" ? "Create Relationship" : "Update Relationship",
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
        } = form.getFieldsValue();

        const body = {
          id: type === "update" ? id : undefined,
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
          endPoint: `/v1/dbs/api/accounts/${idAccount}/relationships/validate-${type}`,
          type,
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
    if (type === "create") {
      setListDataAttachment([]);
      setRelatedDetailData([]);
      form.resetFields();
      setCurrent(0);
    } else if (type === "update") {
      // Update mode - restore to original API data
      if (data_relationshipDetail && data_relationshipDetail.id) {
        const detail = data_relationshipDetail;

        // Restore form values to original
        form.setFieldsValue({
          relationshipType: detail.relationshipType,
          relationshipCategory: detail.relationshipCategory,
          relatedName: detail.objectName,
          relatedNumber: detail.objectNumber,
          startDate: detail.startDate ? moment(detail.startDate) : null,
          endDate: detail.endDate ? moment(detail.endDate) : null,
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
          setRelatedDetailData(detail.relatedDetail);
        } else {
          setRelatedDetailData([]);
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
          createdDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "-",
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
              initialRelationshipType={data_relationshipDetail?.relationshipType}
              initialRelationshipCategory={data_relationshipDetail?.relationshipCategory}
              key={`relationship-tab-0`}
              onRelatedDetailChange={(data) => setRelatedDetailData(data)}
            />
          )
        },
        {
          header: "Related Detail",
          content: (
            <RelatedDetailCard
              data={relatedDetailData}
            />
          ),
          hidden: !relatedDetailData.length
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
              values={form.getFieldsValue()}
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
              loading={loadingApprovalHierarchyDetail}
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
              type={type}
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
          <Spin spinning={loadingDetail}>
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
                  <ButtonComponent
                    type="menu"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </ButtonComponent>
                  <div className="flex w-full justify-end gap-x-4">
                    <ButtonComponent
                      icon={<SVGIcon name="IconButtonClear" width={24} />}
                      type="reject"
                      onClick={handleClear}
                    >
                      {type === "create" ? "Clear" : "Reset"}
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
                        type="menu"
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
                form={"relationshipForm"}
                isOpen={showConfirmModal}
                handleCancel={() => {handleSetShowConfirmationModal(false)}}
                values={form.getFieldsValue()}
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
              />
            </Form>
          </Spin>
        </div>
      </LayoutMenu>
    </>
  );
};

export default CreateUpdateRelationship;
