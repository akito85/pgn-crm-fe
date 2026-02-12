import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import moment from "moment";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
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
import ConfirmationModal from "./ConfirmModal";

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
  const [modalConfirm, setModalConfirm] = useState(false);
  const [dataConfirm, setDataConfirm] = useState();
  const [isDraftSubmission, setIsDraftSubmission] = useState(false);

  const [loading, setLoading] = useState(false);

  // Relationship Data States
  const [approvalObj, setApprovalObj] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [dataDetailApproval, setDataDetailApproval] = useState([]);
  const [relatedDetailData, setRelatedDetailData] = useState([]);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (idAccount) {
      dispatch(getAttachmentCategory({ idAccount }));
      dispatch(getApprovalHierarchies({ idAccount }));
    }
    if (type === "update" && id) {
      dispatch(getAttachmentList({ idAccount, idRelationship: id }));
      dispatch(getRelationshipDetail({ idAccount, idRelationship: id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, idAccount, id]);

  // Populate form and relationshipObj when data_relationshipDetail is loaded (update mode)
  useEffect(() => {
    if (data_relationshipDetail && data_relationshipDetail.id && type === "update") {
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

      // Set approvalObj
      setApprovalObj({
        appHierId: detail.appHierId,
      });

      // Load approval hierarchy detail if appHierId exists
      if (detail.appHierId) {
        dispatch(getApprovalHierarchyDetail({ idAccount, appHierId: detail.appHierId }));
      }

      // Populate Related Detail data for update mode
      if (detail.relatedDetail && detail.relatedDetail.length > 0) {
        setRelatedDetailData(detail.relatedDetail);
      }
    }
  }, [data_relationshipDetail, type, form, idAccount, dispatch]);

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

  // Map approval hierarchy detail data from Redux to local state
  useEffect(() => {
    if (data_approvalHierarchyDetail && data_approvalHierarchyDetail.length > 0) {
      const mapped = data_approvalHierarchyDetail.map((item, index) => ({
        key: index + 1,
        approvalLevel: item.approvalLevel,
        position: item.position,
        employeeDetail: (item.employeeDetail || []).map((emp, empIndex) => ({
          key: empIndex + 1,
          employeeName: emp.employeeName,
          employeeId: emp.employeeId,
          apphierId: emp.apphierId,
        })),
      }));
      setDataDetailApproval(mapped);
    }
  }, [data_approvalHierarchyDetail]);

  useEffect(() => {
    if (!modalConfirm)
      setActiveTab(0);
  }, [modalConfirm]);

  // Handle Approval Object
  const handleApprovalObj = (e, field) => {
    let result = e;
    setApprovalObj((prevState) => {
      const newState = {
        ...prevState,
        [field]: result,
      };
      return newState;
    });
    return result;
  };

  // Handle Detail Approval - Fetch from API
  const handleDetailApproval = (appHierId) => {
    if (idAccount && appHierId) {
      dispatch(getApprovalHierarchyDetail({ idAccount, appHierId }));
    }
  };

  const sendData = async (value, isDraft = false) => {
    try {
      setLoading(true);

      const payload = {
        ...value,
        relationshipCategory: value?.relationshipCategory?.toString(),
        relationshipType: value?.relationshipType?.toString(),
        action: isDraft ? "DRAFT" : "SUBMIT",
        remark: form.getFieldValue("remark"),
      };

      // Filter only new attachments (not existing ones)
      const newAttachments = listDataAttachment.filter(a => a.dataType !== "exist");

      if (type === "create") {
        await dispatch(createRelationship({
          idAccount,
          payload,
          attachments: newAttachments
        })).unwrap();
      } else {
        await dispatch(
          updateRelationship({
            idAccount,
            idRelationship: id,
            payload,
            attachments: newAttachments
          })
        ).unwrap();
      }

      setLoading(false);
      // Navigate back to Account Detail page after success
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
    } catch (error) {
      console.error("Error submitting data:", error);
      setLoading(false);
    }
  };

  // Reusable validation and confirmation handler
  const handleValidateAndConfirm = (action) => {
    if (listDataAttachment.length === 0) {
      const errorBody = {
        title: "Failed",
        description: `Please upload at least one attachment`,
      };
      dispatch(showModalError(errorBody));
      return;
    }

    const isDraft = action === "DRAFT";

    const values = form.getFieldsValue();

    const valueForm = {
      ...values,
      subjectId: idAccount,
      startDate: values.startDate ? moment(values.startDate).format("YYYY-MM-DD") : "",
      endDate: values.endDate ? moment(values.endDate).format("YYYY-MM-DD") : "",
    };

    // Validate before showing confirmation modal
    const validateBody = {
      ...values,
      id: type === "update" ? id : undefined,
      subjectId: idAccount,
      action,
    };

    dispatch(validateCreateUpdate({
      body: validateBody,
      services: accountManagementService,
      endPoint: `/v1/dbs/api/accounts/${idAccount}/relationships/validate-${type}`,
      type,
    }))
      .unwrap()
      .then(() => {
        setDataConfirm(valueForm);
        setIsDraftSubmission(isDraft);
        setModalConfirm(true);
      })
      .catch(() => { });
  };

  const handleSaveAsDraft = () => {
    handleValidateAndConfirm("DRAFT");
  };

  const handleSaveAndSubmit = () => {
    handleValidateAndConfirm("SUBMIT");
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
      await form.validateFields(formFields[current]);

      const values = form.getFieldsValue()

      console.log("values", values);

      const validateBody = {
        ...values,
        id: type === "update" ? id : undefined,
        subjectId: idAccount,
        startDate: values.startDate ? moment(values.startDate).format("YYYY-MM-DD") : "",
        endDate: values.endDate ? moment(values.endDate).format("YYYY-MM-DD") : "",
        validationType: validationTypes[current],
      };

      await dispatch(validateCreateUpdate({
        body: validateBody,
        services: accountManagementService,
        endPoint: `/v1/dbs/api/accounts/${idAccount}/relationships/validate-${type}`,
        type,
      })).unwrap();

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
      // Create mode - clear all data based on current step
      if (current === 0) {
        setRelatedDetailData([]);
        form.resetFields(["relationshipType", "relationshipCategory", "relatedName", "relatedNumber", "startDate", "endDate", "description"]);
      } else if (current === 1) {
        setApprovalObj({});
        setDataDetailApproval([]);
        form.resetFields(["appHierId"]);
      } else {
        setListDataAttachment([]);
      }
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

        // Restore approvalObj
        setApprovalObj({
          appHierId: detail.appHierId,
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
      content: (
        <>
          <RelationshipInfo
            form={form}
            initialRelationshipType={data_relationshipDetail?.relationshipType}
            initialRelationshipCategory={data_relationshipDetail?.relationshipCategory}
            key={`relationship-tab-0`}
            className={`${current !== 0 ? "hidden" : ""}`}
            onRelatedDetailChange={(data) => setRelatedDetailData(data)}
          />
          <RelatedDetailCard
            data={relatedDetailData}
            className={`${current !== 0 ? "hidden" : ""} mt-4`}
          />
        </>
      ),
      disabled: false,
    },
    {
      title: "Approval",
      content: (
        <RelationshipApproval
          form={form}
          approvalObj={approvalObj}
          handleApprovalObj={handleApprovalObj}
          dataApprovalList={data_approvalHierarchies || []}
          dataDetailApproval={dataDetailApproval}
          handleDetailApproval={handleDetailApproval}
          loading={loadingApprovalHierarchyDetail}
          key={`relationship-tab-1`}
          className={`${current !== 1 ? "hidden" : ""}`}
        />
      ),
      disabled: false,
    },
    {
      title: "Attachment",
      content: (
        <RelationshipAttachment
          data={listDataAttachment}
          updateData={setListDataAttachment}
          type={type}
          dispatch={dispatch}
          key={`relationship-tab-2`}
          className={`${current !== 2 ? "hidden" : ""}`}
        />
      ),
      disabled: false,
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
          <Spin spinning={loading || loadingDetail}>
            <Form
              id="formRelationship"
              form={form}
              layout="vertical"
              scrollToFirstError={true}
              preserve={true}
              onSubmit={(e) => {
                e.preventDefault();
                return false;
              }}
              className="flex flex-col gap-y-4"
            >
              {/* Steps Content */}
              <NxFormStepper steps={steps} current={current} onPrev={prev} onNext={handleButtonNext} />

              {steps.map((step) => step.content)}
              
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveAsDraft();
                      }}
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveAndSubmit();
                          }}
                          type={"submit"}
                        >
                          Save & Submit
                        </ButtonComponent>
                      </>
                    )}
                  </div>
                </div>
              </NxBaseContainer>
              {/* Modal Confirmation */}
              <ModalCustom
                isOpen={modalConfirm}
                type="confirmation"
                header={isDraftSubmission ? "CONFIRMATION SAVE AS DRAFT" : "CONFIRMATION RELATIONSHIP"}
                width={1000}
                centered={false}
                style={{ top: 20 }}
                handleCancel={() => setModalConfirm(false)}
                footer={[
                  <div className={"w-full justify-end flex gap-[20px]"} key={`footer-1`}>
                    {activeTab > 0 ? (
                      <ButtonComponent type={"default"} onClick={() => setActiveTab(prev => prev - 1)}>
                        Previous
                      </ButtonComponent>
                    ) : (
                      <ButtonComponent type={"default"} onClick={() => setModalConfirm(false)}>
                        Cancel
                      </ButtonComponent>
                    )}
                    {(activeTab < (isDraftSubmission ? 2 : 3))  && (
                      <ButtonComponent type={"submit"} onClick={() => setActiveTab(prev => prev + 1)}>
                        Next
                      </ButtonComponent>
                    )}
                    {(activeTab === (isDraftSubmission ? 2 : 3)) && (
                      <ButtonComponent
                        type={"submit"}
                        onClick={() => {
                          sendData(dataConfirm, isDraftSubmission);
                          setModalConfirm(false);
                        }}
                      >
                        {isDraftSubmission ? "Save as Draft" : "Submit"}
                      </ButtonComponent>
                    )}
                  </div>,
                ]}
              >
                <ConfirmationModal
                  data={dataConfirm || {}}
                  approvalData={dataDetailApproval}
                  attachmentData={listDataAttachment}
                  idAccount={idAccount}
                  dispatch={dispatch}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isDraftSubmission={isDraftSubmission}
                />
              </ModalCustom>
            </Form>
          </Spin>
        </div>
      </LayoutMenu>
    </>
  );
};

export default CreateUpdateRelationship;
