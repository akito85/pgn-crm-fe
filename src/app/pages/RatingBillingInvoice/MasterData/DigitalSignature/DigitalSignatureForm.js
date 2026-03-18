import { Form, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { showModalError } from "../../../../../redux/slices/general_slice";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
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
  getDetailDigitalSignature,
  getApprovalHierarchyList,
  getApprovalHierarchyDetail,
  createDigitalSignature,
  updateDigitalSignature,
  uploadAttachment,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/digitalSignature";
import { getAttachmentCategory } from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import ConfirmationDigitalSignature from "./_components/ConfirmationDigitalSignature";
import DigitalSignatureSectionForm from "./_components/DigitalSignatureSectionForm";
import { getProfile } from "../../../../../redux/slices/user_management/profile";

const DigitalSignatureForm = ({ type }) => {
  // Selector
  const {
    data_detail,
    data_approval_hierarchy,
    data_approval_hierarchy_detail,
    data_position_employee,
    loading,
  } = useSelector((state) => state.digitalSignature);

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
  const [valuePage, setValuePage] = useState("Digital Signature");
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Digital Signature",
      paramValue: ["name", "employeeCode", "signatureBase64"],
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
  const [uploadedSignatureFile, setUploadedSignatureFile] = useState(null);
  const [signatureFileId, setSignatureFileId] = useState(null);

  const isLoading = loading || loadingForm;

  // Use Effect
  useEffect(() => {
    dispatch(getApprovalHierarchyList());
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailDigitalSignature(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (
      id &&
      data_detail &&
      Object.keys(data_detail).length > 0 &&
      type === "update"
    ) {
      const signature = data_detail?.digitalSignature || {};
      const approvalInformation = data_detail?.approvalInformation || {};
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

      // Set fileId jika ada
      if (signature?.fileId) {
        setSignatureFileId(signature.fileId);
      }

      // Determine signature value based on method
      // PENTING: Harus ada value agar validasi pass
      let signatureValue = null;
      if (signature?.signatureMethod === "UPLOAD" && signature?.fileId) {
        signatureValue = `EXISTING_FILE_${signature.fileId}`; // Use placeholder for uploaded signatures
      } else if (
        signature?.signatureMethod === "DRAW" &&
        signature?.signatureBase64
      ) {
        signatureValue = signature.signatureBase64; // Use base64 for drawn signatures
      }

      // Set form values
      form.setFieldsValue({
        name: signature?.name || "",
        employeeCode: signature?.employeeCode || "",
        primaryPosition: signature?.positionName || "",
        description: signature?.description || "",
        signatureBase64: signature?.signatureBase64 || "",
        signatureMethod: signature?.signatureMethod || "DRAW",
        signature: signatureValue, // This is the main field for validation
        apphierId:
          approvalInformation?.approvalHierarchy ||
          signature?.approvalHierarchy ||
          null,
      });

      // Validate signature field to clear any errors
      setTimeout(() => {
        form.validateFields(["signature"]).catch(() => {});
      }, 100);

      setSelectedHierarchy(
        approvalInformation?.approvalHierarchy || signature?.approvalHierarchy
      );
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
      path: RBI_ROUTES.DIGITAL_SIGNATURE,
      breadcrumbName: "Digital Signature",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.DIGITAL_SIGNATURE_CREATE
          : RBI_ROUTES.DIGITAL_SIGNATURE_UPDATE,
      breadcrumbName:
        type === "create"
          ? "Create Digital Signature"
          : "Update Digital Signature",
    },
  ];

  // Helper function to clean base64 string
  const cleanBase64String = (base64Data) => {
    if (!base64Data) return "";
    return base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
  };

  // Process Data untuk Update
  const processDataUpdate = ({ bodyData, flag, id }) => {
    // Gunakan positionId dari data_position_employee jika ada, jika tidak gunakan dari data_detail
    const positionId =
      data_position_employee?.positionId ||
      data_detail?.digitalSignature?.positionId ||
      null;
    const signatureMethod = bodyData.signatureMethod || "DRAW";
    const signatureBase64Clean = cleanBase64String(bodyData.signatureBase64);

    const jsonData = {
      id: id,
      name: bodyData.name,
      employeeCode: bodyData.employeeCode,
      positionId: positionId,
      description: bodyData.description || null,
      signatureMethod: signatureMethod,
      signatureBase64: signatureBase64Clean,
      apphierId: bodyData.apphierId,
      isSubmit: flag,
    };

    // Handle fileId berdasarkan signatureMethod
    if (signatureMethod === "UPLOAD") {
      // UPLOAD method: tambahkan fileId jika ada dan tidak upload file baru
      if (signatureFileId && !uploadedSignatureFile) {
        jsonData.fileId = signatureFileId;
      }
    } else if (signatureMethod === "DRAW") {
      // DRAW method: set fileId ke null untuk menghapus file existing
      jsonData.fileId = null;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    // Add file only for UPLOAD method with new file
    if (signatureMethod === "UPLOAD" && uploadedSignatureFile) {
      formData.append("file", uploadedSignatureFile);
    }

    return formData;
  };

  // Process Data untuk Create
  const processDataCreate = ({ bodyData, flag }) => {
    const positionId = data_position_employee?.positionId || null;
    const signatureMethod = bodyData.signatureMethod || "DRAW";
    const signatureBase64Clean = cleanBase64String(bodyData.signatureBase64);

    const jsonData = {
      name: bodyData.name,
      employeeCode: bodyData.employeeCode,
      positionId: positionId,
      description: bodyData.description || null,
      signatureMethod: signatureMethod,
      signatureBase64: signatureBase64Clean,
      apphierId: bodyData.apphierId,
      isSubmit: flag,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    // Add file only for UPLOAD method
    if (signatureMethod === "UPLOAD" && uploadedSignatureFile) {
      formData.append("file", uploadedSignatureFile);
    }

    return formData;
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/signature/validate-create"
        : "/v1/dbs/api/signature/validate-update";

    // Gunakan positionId dari data_position_employee jika ada, jika tidak gunakan dari data_detail (untuk UPDATE)
    const positionId =
      data_position_employee?.positionId ||
      (type === "update" ? data_detail?.digitalSignature?.positionId : null) ||
      null;
    const signatureMethod = formValue.signatureMethod || "DRAW";
    const signatureBase64Clean = cleanBase64String(formValue.signatureBase64);

    const jsonData = {
      ...(type === "update" && { id: id }),
      name: formValue.name,
      employeeCode: formValue.employeeCode,
      positionId: positionId,
      description: formValue.description || null,
      signatureMethod: signatureMethod,
      signatureBase64: signatureBase64Clean,
      apphierId: formValue.apphierId,
      isSubmit: flag,
    };

    // Handle fileId untuk UPDATE berdasarkan signatureMethod
    if (type === "update") {
      if (signatureMethod === "UPLOAD") {
        // UPLOAD method: tambahkan fileId jika ada dan tidak upload file baru
        if (signatureFileId && !uploadedSignatureFile) {
          jsonData.fileId = signatureFileId;
        }
      } else if (signatureMethod === "DRAW") {
        // DRAW method: set fileId ke null untuk menghapus file existing
        jsonData.fileId = null;
      }
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    // Add file only for UPLOAD method with new file
    if (signatureMethod === "UPLOAD" && uploadedSignatureFile) {
      formData.append("file", uploadedSignatureFile);
    }

    try {
      await ratingBillingHttpService.createData(url, formData);

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

  // Handle signature file change
  const handleSignatureFileChange = (file) => {
    setUploadedSignatureFile(file);
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
              value: "Digital Signature",
              paramValue: ["name", "employeeCode", "signatureBase64"],
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

    if (type === "create") {
      const body = processDataCreate({ bodyData, flag });

      dispatch(createDigitalSignature({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const signatureId = dataForm?.signatureId;
          setLoadingForm(true);
          for (let i = 0; i < listDataAttachment.length; i++) {
            const element = listDataAttachment[i];
            const body = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: signatureId,
            };
            await dispatch(uploadAttachment({ body }));
          }
          setLoadingForm(false);
          setModalConfirm(false);
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
      const body = processDataUpdate({ bodyData, flag, id });

      dispatch(updateDigitalSignature({ body: body, id }))
        .unwrap()
        .then(async (dataForm) => {
          const signatureId = dataForm?.signatureId;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          setLoadingForm(true);
          for (let i = 0; i < filterDataAttach.length; i++) {
            const element = filterDataAttach[i];
            const body = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: signatureId,
            };
            await dispatch(uploadAttachment({ body }));
          }
          setLoadingForm(false);
          setModalConfirm(false);
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
      setUploadedSignatureFile(null);
      setSignatureFileId(null);
      setListSectionInfo([
        {
          value: "Digital Signature",
          paramValue: ["name", "employeeCode", "signatureBase64"],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailDigitalSignature(id));
      setUploadedSignatureFile(null);
      // FileId akan di-reset dari data detail yang di-fetch ulang
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
    <>
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
          {/* Digital Signature Section */}
          <div
            className={`${valuePage !== "Digital Signature" ? "hidden" : ""}`}
          >
            <DigitalSignatureSectionForm
              type={type}
              form={form}
              fileId={signatureFileId}
              onSignatureFileChange={handleSignatureFileChange}
            />
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

        <ConfirmationDigitalSignature
          isOpen={modalConfirm}
          data={bodyData}
          uploadedSignatureFile={uploadedSignatureFile}
          signatureFileId={signatureFileId}
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
    </>
  );
};

export default DigitalSignatureForm;
