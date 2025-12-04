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
import EFakturCodeSectionForm from "./EFakturCodeSectionForm";
import BaseContainer from "../../../../../components/BaseContainer";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../../constants/configApp";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import ConfirmationEFakturCode from "./ConfirmationEfakturCode";
import ModalBack from "../../../../../components/Modal/ModalBack";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  getDetailEfakturCode,
  getApprovalHierarchyList,
  getApprovalHierarchyDetail,
  getCategoryList,
  createEfakturCode,
  updateEfakturCode,
  uploadAttachment,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/efakturCode";
import { getAttachmentCategory } from "../../../../../redux/slices/rating_billing_invoice/billingItem";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";

const EFakturCodeForm = ({ type }) => {
  // Selector
  const {
    data_detail,
    data_approval_hierarchy,
    data_approval_hierarchy_detail,
    data_category_list,
    loading,
  } = useSelector((state) => state.masterEfakturCode);

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
  const [listAdditionalCode, setListAdditionalCode] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();

  const [flag, setFlag] = useState(false);
  const [valuePage, setValuePage] = useState("Efaktur Code");
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Efaktur Code",
      paramValue: ["efakturCode", "description"],
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
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailEfakturCode(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (
      id &&
      data_detail &&
      Object.keys(data_detail).length > 0 &&
      type === "update"
    ) {
      const fakturCode = data_detail?.fakturCode || {};
      const additionalCodes = data_detail?.additionalCodes || [];
      const attachments = data_detail?.attachments || [];

      // Data Additional Code Detail - mapping dari additionalCodes
      const mappedAdditionalCode = additionalCodes.map((item, index) => ({
        id: item.additionalId,
        key: index + 1,
        code: item.code || "-",
        description: item.description || "-",
        startDate: item.startDate
          ? moment(item.startDate).format(dateFormatting.dateFormal)
          : null,
        endDate: item.endDate
          ? moment(item.endDate).format(dateFormatting.dateFormal)
          : null,
        type: "exist",
        createdBy: item.createdBy || "-",
        createdDate: item.createdDate || null,
        updatedBy: item.updatedBy || "-",
        updatedDate: item.updatedDate || null,
      }));

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

      // Set form values dari fakturCode
      form.setFieldsValue({
        efakturCode: fakturCode?.einvoiceCode || "",
        description: fakturCode?.description || "",
        apphierId: fakturCode?.apphierId || null,
      });

      setSelectedHierarchy(fakturCode?.apphierId);
      setListDataAttachment(mappedAttachment);
      setListAdditionalCode(mappedAdditionalCode);
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
      path: RBI_ROUTES.EFAKTUR_CODE,
      breadcrumbName: "E-Faktur Code",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.EFAKTUR_CODE_CREATE
          : RBI_ROUTES.EFAKTUR_CODE_UPDATE,
      breadcrumbName:
        type === "create" ? "Create E-Faktur Code" : "Update E-Faktur Code",
    },
  ];

  const processData = ({
    listAdditionalCode,
    bodyData,
    id,
    type,
    dateFormatting,
    flag,
  }) => {
    // Map additionalCodes sesuai format backend
    const additionalCodes = listAdditionalCode?.map((item) => ({
      code: item.code,
      description: item.description,
      startDate: item.startDate
        ? moment(item.startDate).format(dateFormatting.dateFormal)
        : null,
      endDate: item.endDate
        ? moment(item.endDate).format(dateFormatting.dateFormal)
        : null,
    }));

    // Struktur payload sesuai backend
    const body = {
      id: type === "create" ? null : id,
      code: bodyData.efakturCode,
      description: bodyData.description || null,
      additionalCodes: additionalCodes,
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
      listAdditionalCode,
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
    const hasOverlapping = checkOverlappingData(listAdditionalCode);

    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
    } else {
      handleMandatory(setListSectionInfo, setListSectionInfo);
      if (listAdditionalCode.length === 0) {
        errorBody = {
          title: "Failed",
          description: "Additional Code is mandatory. Please insert data.",
        };
        dispatch(showModalError(errorBody));
      } else if (storedDataInline) {
        errorBody = {
          title: "Failed",
          description: `Please save data table inline before submit. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else if (hasOverlapping) {
        const errorBody = {
          title: "Failed",
          description: `You can't add Additional Code. Start date and end date can't overlap.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        const isDataValid = await checkDataValidity(formValue);

        if (isDataValid) {
          setBodyData({
            ...formValue,
          });
          setModalConfirm(true);
          setListSectionInfo([
            {
              value: "Efaktur Code",
              paramValue: ["efakturCode", "description"],
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

    const body = processData({
      listAdditionalCode,
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
      setListAdditionalCode([]);
      setStoredDataInline(false);
      setListSectionInfo([
        {
          value: "Efaktur Code",
          paramValue: ["efakturCode", "description"],
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
          <div className={`${valuePage !== "Efaktur Code" ? "hidden" : ""}`}>
            <EFakturCodeSectionForm
              type={type}
              form={form}
              listAdditionalCode={listAdditionalCode}
              setListAdditionalCode={setListAdditionalCode}
              storedDataInline={storedDataInline}
              setStoredDataInline={setStoredDataInline}
              status={status}
              statusApproval={statusApproval}
            />
          </div>

          <div className={valuePage !== "Approval" ? "hidden" : ""}>
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
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
                type={"detail"}
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
        <ConfirmationEFakturCode
          isOpen={modalConfirm}
          data={bodyData}
          selectedHierarchy={selectedHierarchy}
          listDataAppHierDetail={appHierDataDetail}
          listDataAttachment={listDataAttachment}
          listAdditionalCode={listAdditionalCode}
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

export default EFakturCodeForm;
