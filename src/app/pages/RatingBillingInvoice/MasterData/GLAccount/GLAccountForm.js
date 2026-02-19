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
import BaseContainer from "../../../../../components/BaseContainer";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../../constants/configApp";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  getDetailGLAccount,
  getApprovalHierarchyList,
  getApprovalHierarchyDetail,
  createGLAccount,
  updateGLAccount,
  uploadAttachment,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/glAccount";
import { getAttachmentCategory } from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import ConfirmationGLAccount from "./_components/ConfirmationGLAccount";
import GLAccountSectionForm from "./_components/GLAccountSectionForm";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";

const GLAccountForm = ({ type }) => {
  const {
    data_detail,
    data_approval_hierarchy,
    data_approval_hierarchy_detail,
    loading,
  } = useSelector((state) => state.glAccount);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location?.state?.id;

  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();

  const [flag, setFlag] = useState(false);
  const [current, setCurrent] = useState(0);
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "GL Account",
      paramValue: ["glAccount", "glAccountDesc", "remark"],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [bodyData, setBodyData] = useState({});

  const isLoading = loading || loadingForm;

  const steps = [
    { title: "GL ACCOUNT", value: "GL Account" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const valuePage = steps[current]?.value;

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: RBI_ROUTES.GLACCOUNT, breadcrumbName: "GL Account" },
    {
      path: type === "create" ? RBI_ROUTES.GLACCOUNT_CREATE : RBI_ROUTES.GLACCOUNT_UPDATE,
      breadcrumbName: type === "create" ? "Create GL Account" : "Update GL Account",
    },
  ];

  // Navigation handlers
  const next = () => {
    const fieldsToValidate = listSectionInfo[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) setCurrent(current + 1);
        })
        .catch(() => {});
    } else {
      if (current < steps.length - 1) setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  // Use Effects
  useEffect(() => {
    dispatch(getApprovalHierarchyList());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailGLAccount(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (id && data_detail && Object.keys(data_detail).length > 0 && type === "update") {
      const glAccount = data_detail?.glAccount || {};
      const approvalInfo = data_detail?.approvalInfo || {};
      const attachments = data_detail?.attachments || [];

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
        uploadDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "-",
        dataType: "exist",
      }));

      form.setFieldsValue({
        glAccount: glAccount?.glAccount || "",
        glAccountDesc: glAccount?.glAccountDesc || "",
        remark: glAccount?.remark || "",
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
    if (data_approval_hierarchy_detail && data_approval_hierarchy_detail.length > 0) {
      const data = data_approval_hierarchy_detail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({ ...b, key: index + 1 })),
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

  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/gl-account/validate-create"
        : `/v1/dbs/api/gl-account/validate-update/${id}`;

    const jsonData = {
      ...(type === "update" && { glAccountId: id }),
      glAccount: formValue.glAccount,
      remark: formValue.remark,
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
        dispatch(showModalError({ title: "Failed", description: message }));
      }
      return false;
    }
  };

  const handleMandatory = (setListSectionInfo = () => {}, listDataAttachment, errorFields) => {
    setListSectionInfo((prevState) => {
      return prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item.paramValue.includes(next.name[0]) ? current + 1 : current,
                0,
              )
            : listDataAttachment.length < 1
              ? 1
              : 0;
        return { value: item.value, paramValue: item.paramValue, errorBadge };
      });
    });
  };

  const handleSave = async (formValue) => {
    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
      dispatch(showModalError({
        title: "Failed",
        description: "Attachment is mandatory. Please upload at least one file.",
      }));
      return;
    }

    handleMandatory(setListSectionInfo, listDataAttachment);
    const isDataValid = await checkDataValidity(formValue);

    if (isDataValid) {
      setBodyData({ ...formValue });
      setModalConfirm(true);
      setListSectionInfo([
        { value: "GL Account", paramValue: ["glAccount", "glAccountDesc", "remark"] },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      setModalConfirm(false);
    }
  };

  const handleConfirm = () => {
    setModalConfirm(false);

    const jsonData = {
      ...(type === "update" && { glAccountId: id }),
      glAccount: bodyData.glAccount,
      remark: bodyData.remark,
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
            await dispatch(uploadAttachment({
              body: { files: element.file, categoryId: element.fileCategoryId, referenceId: glAccountId },
            }));
          }
          setLoadingForm(false);
          dispatch(showModalSuccess({
            title: "Successful",
            description: `Your data has been ${flag ? "submitted" : "created"}.`,
          }));
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              error.response?.data?.message || error.message || error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateGLAccount({ body: jsonData, id }))
        .unwrap()
        .then(async (dataForm) => {
          const glAccountId = dataForm?.glAccountId;
          const filterDataAttach = listDataAttachment.filter((item) => item.dataType !== "exist");
          setLoadingForm(true);
          for (let i = 0; i < filterDataAttach.length; i++) {
            const element = filterDataAttach[i];
            await dispatch(uploadAttachment({
              body: { files: element.file, categoryId: element.fileCategoryId, referenceId: glAccountId },
            }));
          }
          setLoadingForm(false);
          dispatch(showModalSuccess({
            title: "Successful",
            description: `Your data has been ${flag ? "submitted" : "updated"}.`,
          }));
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              error.response?.data?.message || error.message || error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };

  const handleError = ({ errorFields }) => {
    handleMandatory(setListSectionInfo, listDataAttachment, errorFields);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setBodyData({});
      setCurrent(0);
      setListSectionInfo([
        { value: "GL Account", paramValue: ["glAccount", "glAccountDesc", "remark"] },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailGLAccount(id));
    }
  };

  const handleSubmit = () => {
    setFlag(true);
    setTimeout(() => form.submit(), 0);
  };

  const handleSaveDraft = () => {
    setFlag(false);
    setTimeout(() => form.submit(), 0);
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

        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
          scrollToFirstError={true}
        >
          {/* GL Account Section */}
          <div style={{ display: valuePage !== "GL Account" ? "none" : undefined }}>
            <GLAccountSectionForm type={type} form={form} />
          </div>

          {/* Approval Section */}
          <div style={{ display: valuePage !== "Approval" ? "none" : undefined }}>
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>

          {/* Attachment Section */}
          <div style={{ display: valuePage !== "Attachment" ? "none" : undefined }}>
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

          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={() => navigate(-1)}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            type={type}
          />
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
            <p className="pl-[70px]">{`Your data was not ${flag ? "submitted" : "created"}. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default GLAccountForm;