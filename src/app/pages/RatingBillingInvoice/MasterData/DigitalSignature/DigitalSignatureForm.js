import { Form, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import {
  showModalError,
  validateCreateUpdate,
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
  getDetailDigitalSignature,
  getApprovalHierarchyList,
  getApprovalHierarchyDetail,
  getCategoryList,
  createDigitalSignature,
  updateDigitalSignature,
  uploadAttachment,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/digitalSignature";
import { getAttachmentCategory } from "../../../../../redux/slices/rating_billing_invoice/billingItem";
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
    loading,
  } = useSelector((state) => state.digitalSignature);

  const { data: profileData } = useSelector((state) => state.profile);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location?.state?.id;
  const status = location?.state?.status;
  const statusApproval = location?.state?.statusApproval;

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
      paramValue: ["digitalSignature", "description"],
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
    dispatch(getCategoryList());
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
      const signature = data_detail?.["Digital signature"] || {};
      const approvalInformation = data_detail?.["approval information"] || {};
      const attachments = data_detail?.attachments || [];

      // Data Attachment Information - mapping dari attachments
      const mappedAttachment = attachments.map((item, index) => ({
        id: item.id || index,
        size: item.size || 0,
        fileName: item.fileName || "-",
        fileSize: item.fileSize || "-",
        fileType: item.fileType || "-",
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

      // Set form values dari digital signature
      form.setFieldsValue({
        name: signature?.name || "",
        employee: signature?.employee || "",
        primaryPosition: signature?.primaryPosition || "",
        description: signature?.description || "",
        signatureBase64: signature?.signatureBase64 || "",
        apphierId: approvalInformation?.approvalHierarchy || null,
      });

      setSelectedHierarchy(approvalInformation?.approvalHierarchy);
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

  const processData = ({ bodyData, id, type, dateFormatting, flag }) => {
    // Struktur payload sesuai backend
    const body = {
      name: bodyData.name,
      employeeCode: bodyData.employeeCode,
      description: bodyData.description || null,
      apphierId: bodyData.apphierId,
      isSubmit: flag,
    };

    return body;
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/faktur-code/validate-create"
        : "/v1/dbs/api/faktur-code/validate-update";

    const body = processData({
      bodyData: formValue,
      id,
      type,
      dateFormatting,
      flag,
    });

    try {
      await dispatch(
        validateCreateUpdate({
          body: body,
          services: ratingBillingHttpService,
          endPoint: url,
          type: type,
        })
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  // check has overlapping data
  const checkOverlappingData = useCallback((dataTable) => {
    const dataOverlap = [];

    for (let i = 0; i < dataTable.length; i++) {
      for (let j = i + 1; j < dataTable.length; j++) {
        const item1 = dataTable[i];
        const item2 = dataTable[j];

        const start1 = moment(item1.startDate);
        const end1 = item1.endDate ? moment(item1.endDate) : null;
        const start2 = moment(item2.startDate);
        const end2 = item2.endDate ? moment(item2.endDate) : null;

        // Check for overlap
        const hasOverlap =
          (start1.isSameOrBefore(start2) &&
            (!end1 || end1.isSameOrAfter(start2))) ||
          (start2.isSameOrBefore(start1) &&
            (!end2 || end2.isSameOrAfter(start1)));

        if (hasOverlap) {
          dataOverlap.push({ item1, item2 });
        }
      }
    }

    return dataOverlap.length > 0;
  }, []);

  // Handle Save Form
  const handleSave = async (formValue) => {
    let errorBody = {};

    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
    } else {
      handleMandatory(setListSectionInfo, setListSectionInfo);
    }
  };

  const handleConfirm = () => {
    setModalConfirm(false);

    const body = processData({
      bodyData,
      id,
      type,
      dateFormatting,
      flag,
    });

    if (type === "create") {
      dispatch(createEfakturCode({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const efakturCode = dataForm?.einvoiceCodeId;
          setLoadingForm(true);
          for (let i = 0; i < listDataAttachment.length; i++) {
            const element = listDataAttachment[i];
            const body = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: efakturCode,
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
      dispatch(updateEfakturCode({ body: body, id }))
        .unwrap()
        .then(async (dataForm) => {
          const efakturCode = dataForm?.einvoiceCodeId;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          setLoadingForm(true);
          for (let i = 0; i < filterDataAttach.length; i++) {
            const element = filterDataAttach[i];
            const body = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: efakturCode,
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

  // Handle Error Tab Form
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
          value: "Digital Signature",
          paramValue: ["digitalSignature", "description"],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailEfakturCode(id));
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
          {/* E-Faktur Code Section */}
          <div
            className={`${valuePage !== "Digital Signature" ? "hidden" : ""}`}
          >
            <DigitalSignatureSectionForm type={type} />
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
                type={"create"}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getAttachmentCategory}
                typeSelector="masterEfakturCode"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"masterEfakturCode"}
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

        {/* Modal Confirmation */}
        <ConfirmationDigitalSignature
          isOpen={modalConfirm}
          data={bodyData}
          selectedHierarchy={selectedHierarchy}
          listDataAppHierDetail={appHierDataDetail}
          listDataAttachment={listDataAttachment}
          dataOption={appHierOptions}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
        />

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        {/* Modal Retry */}
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

export default DigitalSignatureForm;
