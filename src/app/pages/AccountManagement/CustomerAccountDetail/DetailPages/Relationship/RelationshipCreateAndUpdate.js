import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import moment from "moment";
import RelationshipConfirm from "./RelationshipConfirm";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { useEffect, useState, useRef } from "react";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderDetail from "../../HeaderDetail";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import RelationshipApproval from "./RelationshipApproval";
import RelationshipAttachment from "./RelationshipAttachment";
import ModalAttachment from "./RelationshipAttachment/ModalAttachment";
import RelationshipInformation from "./RelationshipInformation";
import {
  createRelationship,
  downloadAttachment,
  getApprovalHierarchies,
  getApprovalHierarchyDetail,
  getAttachmentCategory,
  getAttachmentList,
  getRelationshipDetail,
  updateRelationship
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Spin, Steps } from "antd";
import { RightOutlined } from "@ant-design/icons";

const obj = {
  id: 1,
  accountInformation: {
    sorId: 1,
    sor: "SOR 3",
  },
};

const RelationshipCreateAndUpdate = ({
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

  // Debug log untuk memastikan idCustomer dan type diterima
  useEffect(() => {
    console.log("DEBUG - Location State:", location?.state);
    console.log("DEBUG - idAccount:", idAccount);
    console.log("DEBUG - idCustomer:", idCustomer);
    console.log("DEBUG - accountType:", accountType);
  }, [location, idAccount, idCustomer, accountType]);

  // Get Attachment Category and List from Store
  const {
    data_attachmentCategory,
    data_attachmentList,
    data_approvalHierarchies,
    data_approvalHierarchyDetail,
    data_relationshipType,
    data_relationshipCategory,
    data_relationshipDetail,
    loadingDetail,
    loadingApprovalHierarchies,
    loadingApprovalHierarchyDetail
  } = useSelector(
    (state) => state.relationship
  );

  // State Management
  const [current, setCurrent] = useState(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [dataConfirm, setDataConfirm] = useState();

  const [loading, setLoading] = useState(false);

  // Relationship Data States
  const [relationshipObj, setRelationshipObj] = useState({});
  const [approvalObj, setApprovalObj] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [dataDetailApproval, setDataDetailApproval] = useState([]);

  // Step State
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    console.log("relationshipObj => ", relationshipObj);
  }, [relationshipObj]);

  useEffect(() => {
    console.log("approvalObj => ", approvalObj);
  }, [approvalObj]);

  useEffect(() => {
    console.log("listDataAttachment => ", listDataAttachment);
  }, [listDataAttachment]);

  useEffect(() => {
    console.log("dataDetailApproval => ", dataDetailApproval);
  }, [dataDetailApproval]);

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
      });

      // Set relationshipObj for submit
      setRelationshipObj({
        objectId: detail.objectId,
        objectName: detail.objectName,
        objectValue: detail.objectNumber,
        relationshipType: detail.relationshipType,
        relationshipCategory: detail.relationshipCategory,
        startDate: detail.startDate,
        endDate: detail.endDate,
        description: detail.description,
      });

      // Set approvalObj
      setApprovalObj({
        appHierId: detail.appHierId,
      });

      // Load approval hierarchy detail if appHierId exists
      if (detail.appHierId) {
        dispatch(getApprovalHierarchyDetail({ idAccount, appHierId: detail.appHierId }));
      }
    }
  }, [data_relationshipDetail, type, form, idAccount, dispatch]);

  useEffect(() => {
    if (data_attachmentList && data_attachmentList.length > 0 && type === "update") {
      const mapped = data_attachmentList.map((item) => ({
        key: item.id,
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

  // Handle Relationship Object
  const handleRelationshipObj = (e, field) => {
    let result;
    switch (field) {
      case "description":
        result = e;
        break;
      case "startDate":
      case "endDate":
        result = e;
        break;
      default:
        result = e;
        break;
    }
    setRelationshipObj((prevState) => {
      const newState = {
        ...prevState,
        [field]: result,
      };
      return newState;
    });
    return result;
  };

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

  const handleSaveAsDraft = () => {
    if (listDataAttachment.length === 0) {
      alert("Please upload at least one attachment");
      return;
    }
    console.log("Current Form Values (Draft):", form.getFieldsValue());
    console.log("Relationship Obj:", relationshipObj);
    console.log("Approval Obj:", approvalObj);
    console.log("Attachment List:", listDataAttachment);

    form
      .validateFields()
      .then((values) => {
        const valueForm = {
          subjectId: idAccount,
          relationshipType: values.relationshipType || relationshipObj.relationshipType,
          relationshipCategory: values.relationshipCategory || relationshipObj.relationshipCategory,
          objectId: relationshipObj.objectId,
          objectName: relationshipObj.objectName || values.relatedName,
          objectValue: relationshipObj.objectValue || values.relatedNumber,
          startDate: (values.startDate || relationshipObj.startDate)
            ? moment(values.startDate || relationshipObj.startDate).format("YYYY-MM-DD")
            : "",
          endDate: (values.endDate || relationshipObj.endDate)
            ? moment(values.endDate || relationshipObj.endDate).format("YYYY-MM-DD")
            : "",
          description: values.description || relationshipObj.description || "",
          appHierId: values.appHierId || approvalObj.appHierId,
        };
        sendData(valueForm, true);
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        alert("Please fill all required fields");
      });
  };

  const handleSaveAndSubmit = () => {

    if (listDataAttachment.length === 0) {
      alert("Please upload at least one attachment");
      return;
    }

    console.log("Attachment validation passed");
    console.log("Current form values:", form.getFieldsValue());
    console.log("Relationship Obj:", relationshipObj);
    console.log("Approval Obj:", approvalObj);
    console.log("Attachment List:", listDataAttachment);

    form
      .validateFields()
      .then((values) => {
        // Get display names for type and category
        const typeId = values.relationshipType || relationshipObj.relationshipType;
        const categoryId = values.relationshipCategory || relationshipObj.relationshipCategory;

        const typeName = data_relationshipType?.find(t => t.id === typeId)?.text || typeId;
        const categoryName = data_relationshipCategory?.find(c => c.id === categoryId)?.text || categoryId;

        // Convert moment objects to strings
        const startDateValue = values.startDate || relationshipObj.startDate;
        const endDateValue = values.endDate || relationshipObj.endDate;

        const valueForm = {
          subjectId: idAccount,
          relationshipType: typeId,
          relationshipTypeName: typeName,
          relationshipCategory: categoryId,
          relationshipCategoryName: categoryName,
          objectId: relationshipObj.objectId,
          objectName: relationshipObj.objectName || values.relatedName,
          objectValue: relationshipObj.objectValue || values.relatedNumber,
          relatedName: relationshipObj.objectName || values.relatedName,
          relatedNumber: relationshipObj.objectValue || values.relatedNumber,
          startDate: startDateValue ? moment(startDateValue).format("YYYY-MM-DD") : "",
          startDateDisplay: startDateValue ? moment(startDateValue).format("DD MMM YYYY") : "-",
          endDate: endDateValue ? moment(endDateValue).format("YYYY-MM-DD") : "",
          endDateDisplay: endDateValue ? moment(endDateValue).format("DD MMM YYYY") : "-",
          description: values.description || relationshipObj.description || "",
          appHierId: values.appHierId || approvalObj.appHierId,
        };

        setDataConfirm(valueForm);
        setModalConfirm(true);
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        console.error("Error fields:", error.errorFields);
        alert(
          "Please fill all required fields: " +
          JSON.stringify(error.errorFields?.map((f) => f.name[0]).join(", "))
        );
      });
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
      path: "",
      breadcrumbName: "Detail Customer",
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

  // Navigation handlers
  const next = async () => {
    try {
      await form.validateFields(formFields[current]);
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

  const handleSetCurrent = async (newCurrent) => {
    for (let i = current; i < newCurrent; i++) {
      try {
        await form.validateFields(formFields[i]);
      } catch (err) {
        setCurrent(i);
        return;
      }
    }

    setCurrent(newCurrent);
  }

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const handleClear = () => {
    if (current === 0) {
      setRelationshipObj({});
      form.resetFields();
    } else if (current === 1) {
      setApprovalObj({});
      setDataDetailApproval([]);
      form.resetFields(["appHierId"]);
    } else {
      setListDataAttachment([]);
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
        <RelationshipInformation
          form={form}
          relationshipObj={relationshipObj}
          handleRelationshipObj={handleRelationshipObj}
          initialRelationshipType={data_relationshipDetail?.relationshipType}
          initialRelationshipCategory={data_relationshipDetail?.relationshipCategory}
          key={`relationship-tab-0`}
          className={`${current !== 0 ? "hidden" : ""}`}
        />
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

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  return (
    <>
      <LayoutMenu>
        <Spin spinning={loading || loadingDetail}>
          <BreadCrumb routes={routes} />
          <div className="w-full">
            <HeaderDetail
              data_detail={obj}
              data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
              idAccount={idAccount}
              idCustomer={idCustomer}
              type={accountType}
            />
          </div>

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
          >
            {/* Steps Content */}

            <div className="flex flex-row gap-x-6 justify-center my-6">
              <div onScroll={handleScroll} ref={containerRef} className="overflow-x-scroll scrollStepsCstm">
                <Steps current={current} onChange={handleSetCurrent} items={items} labelPlacement="vertical" />
              </div>
            </div>
            <div className="steps-content my-6">
              {
                steps.map((step) => step.content)
              }
            </div>

            {/* Section Action Steps */}
            <div className="steps-action my-8 flex w-full justify-between gap-x-2">
              <ButtonComponent
                type="submit"
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                onClick={() => navigate(
                  ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
                  {
                    state: {
                      idAccount,
                      idCustomer,
                    }
                  }
                )}
              >
                Back
              </ButtonComponent>
              <div className="flex w-full justify-end gap-x-4">
                <ButtonComponent
                  icon={<SVGIcon name="IconButtonClear" width={24} />}
                  type="submit"
                  onClick={handleClear}
                >
                  Clear
                </ButtonComponent>
                {current > 0 && (
                  <ButtonComponent
                    onClick={() => {
                      prev();
                      scrollLeftHandler();
                    }}
                    type="submit"
                    icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                  >
                    Previous
                  </ButtonComponent>
                )}
                {current < steps.length - 1 && (
                  <ButtonComponent
                    onClick={handleButtonNext}
                    type={"submit"}
                    disabled={steps[current].disabled}
                  >
                    <div className="flex gap-x-2 items-center">
                      <span>Next</span>
                      <RightOutlined
                        style={{
                          justifyItems: "center",
                          fontSize: "18px",
                          color: "#fff",
                        }}
                      />
                    </div>
                  </ButtonComponent>
                )}
                {current === steps.length - 1 && (
                  <>
                    <ButtonComponent
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveAsDraft();
                      }}
                      type={"submit"}
                    >
                      Save as Draft
                    </ButtonComponent>
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
          </Form>
        </Spin>

        {/* create tax relation - COMMENTED OUT: Duplicate modal causing double popup
        <ModalCustom
          isOpen={modalConfirm}
          type={"confirmation"}
          header="CONFIRMATION"
          width={1200}
          handleCancel={() => {
            setModalConfirm(false);
          }}
          footer={
            <div className={"w-full flex justify-end gap-3"}>
              <ButtonComponent
                onClick={() => {
                  setModalConfirm(false);
                }}
                type="default"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type="submit"
                onClick={() => {
                  sendData(dataConfirm);
                }}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <RelationshipConfirm data={dataConfirm} />
        </ModalCustom>
        */}
      </LayoutMenu>

      {/* Modal Confirmation */}
      <ModalCustom
        isOpen={modalConfirm}
        type="confirmation"
        header="CONFIRMATION RELATIONSHIP"
        width={1000}
        centered={false}
        style={{ top: 20 }}
        handleCancel={() => {
          setModalConfirm(false);
        }}
        footer={
          <div className="w-full flex justify-end gap-3">
            <ButtonComponent
              onClick={() => {
                setModalConfirm(false);
              }}
              type="default"
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              onClick={() => {
                sendData(dataConfirm, false);
                setModalConfirm(false);
              }}
            >
              Submit
            </ButtonComponent>
          </div>
        }
      >
        <RelationshipConfirm
          data={dataConfirm || {}}
          approvalData={dataDetailApproval}
          attachmentData={listDataAttachment}
        />
      </ModalCustom>

      {/* Modal Upload Attachment */}
      <ModalAttachment
        openUpload={modalUpload}
        updateData={setListDataAttachment}
        categoryOptions={data_attachmentCategory || []}
        handleCancel={() => setModalUpload(false)}
        idAccount={idAccount}
      />
    </>
  );
};

export default RelationshipCreateAndUpdate;
