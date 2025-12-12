import { Form, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import BaseContainer from "../../../../../components/BaseContainer";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../../constants/configApp";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import ModalBack from "../../../../../components/Modal/ModalBack";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  getDetailGLAccount,
  getApprovalHierarchyList,
  getApprovalHierarchyDetail,
  createGLAccount,
  updateGLAccount,
  uploadAttachment,
  getSpecialGLList,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/glAccount";
import { getAttachmentCategory } from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import ConfirmationGLAccount from "./_components/ConfirmationGLAccount";
import GLAccountSectionForm from "./_components/GLAccountSectionForm";

const GLAccountForm = ({ type }) => {
  // Selector
  const {
    data_detail,
    data_approval_hierarchy,
    data_approval_hierarchy_detail,
    loading,
  } = useSelector((state) => state.glAccount);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location?.state?.id;

  // State
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();

  const [flag, setFlag] = useState(false);
  const [valuePage, setValuePage] = useState("GL Account");
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "GL Account",
      paramValue: ["glAccount", "glAccountDesc", "specialGlValue", "reference"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [storedDataInline, setStoredDataInline] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});

  const isLoading = loading || loadingForm;

  // Use Effect
  useEffect(() => {
    dispatch(getApprovalHierarchyList());
    dispatch(getSpecialGLList());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailGLAccount(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (
      id &&
      data_detail &&
      Object.keys(data_detail).length > 0 &&
      type === "update"
    ) {
      const glAccount = data_detail?.glAccount || {};
      const approvalInfo = data_detail?.approvalInfo || {};
      const attachments = data_detail?.attachments || [];

      // Data Attachment Information
      const mappedAttachment = attachments.map((item, index) => ({
        id: item.id || index,
        size: item.size || 0,
        fileName: item.fileName || "-",
        fileSize: item.fileSize || "-",
        fileType: item.type || "-",
        fileCategoryId: item.fileCategoryId || null,
        fileCategoryName: item.fileCategoryName || "-",
        pathFile: item.pathFile || "",
        urlFile1: item.urlFile1 || "",
        urlFile2: item.urlFile2 || "",
        uploadBy: item.createdBy || "-",
        uploadDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY")
          : "-",
        dataType: "exist",
      }));

      // Set form values
      form.setFieldsValue({
        glAccount: glAccount?.glAccount || "",
        glAccountDesc: glAccount?.glAccountDesc || "",
        specialGlValue: glAccount?.specialGl || null,
        reference: glAccount?.reference || "",
        apphierId: approvalInfo?.tAppId || null,
      });

      setSelectedHierarchy(approvalInfo?.tAppId);
      setListDataAttachment(mappedAttachment);
    }
  }, [id, type, form, data_detail]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getApprovalHierarchyDetail(selectedHierarchy));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (
      data_approval_hierarchy_detail &&
      data_approval_hierarchy_detail.length > 0
    ) {
      const data = data_approval_hierarchy_detail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [data_approval_hierarchy_detail]);

  useEffect(() => {
    if (data_approval_hierarchy && data_approval_hierarchy.length > 0) {
      const tempAppHier = data_approval_hierarchy.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [data_approval_hierarchy]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RBI_ROUTES.GLACCOUNT,
      breadcrumbName: "GL Account",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.GLACCOUNT_CREATE
          : RBI_ROUTES.GLACCOUNT_UPDATE,
      breadcrumbName:
        type === "create" ? "Create GL Account" : "Update GL Account",
    },
  ];

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/gl-account/validate-create"
        : `/v1/dbs/api/gl-account/validate-update/${id}`;

    const jsonData = {
      ...(type === "update" && { glAccountId: id }),
      glAccount: formValue.glAccount,
      specialGlValue: formValue.specialGlValue,
      reference: formValue.reference,
      glAccountDesc: formValue.glAccountDesc,
      apphierId: formValue.apphierId,
      isSubmit: flag,
    };

    try {
      await ratingBillingHttpService.createData(url, jsonData);
      return true;
    } catch (error) {
      if (error?.response?.data) {
        const message = error.response.data.message || "Validation failed";
        const errorBody = {
          title: "Failed",
          description: message,
        };
        dispatch(showModalError(errorBody));
      }
      return false;
    }
  };

  // Handle Save Form
  const handleSave = async (formValue) => {
    let errorBody = {};

    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
      errorBody = {
        title: "Failed",
        description:
          "Attachment is mandatory. Please upload at least one file.",
      };
      dispatch(showModalError(errorBody));
    } else {
      handleMandatory(setListSectionInfo, listDataAttachment);

      if (storedDataInline) {
        errorBody = {
          title: "Failed",
          description: `Please save data table inline before submit. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        const isDataValid = await checkDataValidity(formValue);

        if (isDataValid) {
          setBodyData({ ...formValue });
          setModalConfirm(true);
          setListSectionInfo([
            {
              value: "GL Account",
              paramValue: [
                "glAccount",
                "glAccountDesc",
                "specialGlValue",
                "reference",
              ],
            },
            { value: "Approval", paramValue: ["apphierId"] },
            { value: "Attachment" },
          ]);
        } else {
          setModalConfirm(false);
        }
      }
    }
  };

  const handleConfirm = () => {
    setModalConfirm(false);

    const jsonData = {
      ...(type === "update" && { glAccountId: id }),
      glAccount: bodyData.glAccount,
      specialGlValue: bodyData.specialGlValue,
      reference: bodyData.reference,
      glAccountDesc: bodyData.glAccountDesc,
      apphierId: bodyData.apphierId,
      isSubmit: flag,
    };

    if (type === "create") {
      dispatch(createGLAccount({ body: jsonData }))
        .unwrap()
        .then(async (dataForm) => {
          const glAccountId = dataForm?.glAccountId;
          setLoadingForm(true);
          for (let i = 0; i < listDataAttachment.length; i++) {
            const element = listDataAttachment[i];
            const body = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: glAccountId,
            };
            await dispatch(uploadAttachment({ body }));
          }
          setLoadingForm(false);
          setModalConfirm(false);

          // Show success modal after all attachments uploaded
          const successBody = {
            title: "Successful",
            description: `Your data has been ${
              flag ? "submitted" : "created"
            }.`,
          };
          dispatch(showModalSuccess(successBody));
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateGLAccount({ body: jsonData, id }))
        .unwrap()
        .then(async (dataForm) => {
          const glAccountId = dataForm?.glAccountId;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          setLoadingForm(true);
          for (let i = 0; i < filterDataAttach.length; i++) {
            const element = filterDataAttach[i];
            const body = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: glAccountId,
            };
            await dispatch(uploadAttachment({ body }));
          }
          setLoadingForm(false);
          setModalConfirm(false);

          // Show success modal after all attachments uploaded
          const successBody = {
            title: "Successful",
            description: `Your data has been ${
              flag ? "submitted" : "updated"
            }.`,
          };
          dispatch(showModalSuccess(successBody));
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };

  const handleMandatory = (
    setListSectionInfo = () => {},
    listDataAttachment,
    errorFields
  ) => {
    setListSectionInfo((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item.paramValue.includes(next.name[0])
                    ? current + 1
                    : current,
                0
              )
            : listDataAttachment.length < 1
            ? 1
            : 0;
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  const handleError = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setListSectionInfo, listDataAttachment, errorFields);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setBodyData({});
      setStoredDataInline(false);
      setListSectionInfo([
        {
          value: "GL Account",
          paramValue: [
            "glAccount",
            "glAccountDesc",
            "specialGlValue",
            "reference",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailGLAccount(id));
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    setBodyError({});
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <RadioTabs
          data={listSectionInfo}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          {/* GL Account Section */}
          <div className={`${valuePage !== "GL Account" ? "hidden" : ""}`}>
            <GLAccountSectionForm type={type} form={form} />
          </div>

          <div className={valuePage !== "Approval" ? "hidden" : ""}>
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>

          <div className={valuePage !== "Attachment" ? "hidden" : ""}>
            <BaseContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getAttachmentCategory}
                typeSelector="billing_bucket"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </BaseContainer>
          </div>

          <div className="mt-[30px] flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
              disabled={storedDataInline}
            >
              Back
            </ButtonComponent>

            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                disabled={storedDataInline ? true : false}
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? "IconButtonReset" : "IconButtonClear"
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={() => {
                  handleClear();
                }}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                onClick={() => setFlag(false)}
                disabled={storedDataInline}
              >
                Save as Draft
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                onClick={() => setFlag(true)}
                disabled={storedDataInline}
              >
                Save & Submit
              </ButtonComponent>
            </div>
          </div>
        </Form>

        <ConfirmationGLAccount
          isOpen={modalConfirm}
          data={bodyData}
          selectedHierarchy={selectedHierarchy}
          listDataAppHierDetail={appHierDataDetail}
          listDataAttachment={listDataAttachment}
          dataOption={appHierOptions}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
        />

        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${
              flag === 1 ? "created" : "submitted"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default GLAccountForm;
