import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { WarningOutlined } from "@ant-design/icons";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import {
  FormStepper,
  FormFooter,
} from "../../../../../components/FormStepNavigation";
import BillingItemCategorySectionForm from "./Form/BillingItemCategorySectionForm";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import { dateFormatting } from "../../../../../utils";
import { validateCreateUpdate } from "../../../../../redux/slices/general_slice";
import {
  createBillingItemCategory,
  updateBillingItemCategory,
  getAvailableApproval,
  getSelectedApproval,
  getDetailBillingItemCategory,
  getDetailDraftBillingItemCategory,
} from "../../../../../redux/slices/system_setup/master_data/billingItemCategory";
import { getAttachmentCategory } from "../../../../../redux/slices/rating_billing_invoice/MasterData/billingBucket";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import ConfirmationBillingItemCategory from "./Modal/ConfirmationBillingItemCategory";

const BillingItemCategoryForm = ({ type }) => {
  // Selector
  const {
    data_detail_draft,
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
  } = useSelector((state) => state.billingItemCategory);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location?.state?.id;
  const status = location?.state?.status;
  const statusApproval = location?.state?.statusApproval;

  // State
  const [current, setCurrent] = useState(0);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [flag, setFlag] = useState(false);
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Billing Item Category",
      paramValue: ["code", "name", "startDate"],
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

  // Steps configuration
  const steps = [
    { title: "TRANSACTION MAPPING CATEGORY", value: "Billing Item Category" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const [valuePage, setValuePage] = useState(steps[0].value);

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  // Navigation handlers
  const next = () => {
    const fieldsToValidate = listSectionInfo[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const isLoading = loading || loadingForm;

  // Use Effect
  useEffect(() => {
    dispatch(getAvailableApproval());
  }, [dispatch]);

  // Validation: Check if user can update
  useEffect(() => {
    if (type === "update" && statusApproval) {
      const canUpdate =
        statusApproval === "DRAFT" || statusApproval === "REJECTED";
      if (!canUpdate) {
        navigate(SYSTEM_SETUP_ROUTES.VIEW_BILLING_ITEM_CATEGORY, {
          replace: true,
        });
      }
    }
  }, [type, statusApproval, navigate]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailBillingItemCategory(id));
      dispatch(getDetailDraftBillingItemCategory(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (
      id &&
      data_detail_draft?.billingCategory?.id === id &&
      data_detail?.billingCategory?.id === id
    ) {
      const draftCategory = data_detail_draft?.billingCategory;

      // Data Draft Attachment Information
      const dataDraftAttachment = (data_detail?.attachments || []).map(
        (item) => {
          return {
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.type,
            fileCategoryId: item.fileCategoryId,
            fileCategoryName: item.fileCategoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            uploadBy: item.createdBy,
            uploadDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        },
      );

      form.setFieldsValue({
        code: draftCategory?.code,
        name: draftCategory?.name,
        startDate: draftCategory?.startDate
          ? moment(draftCategory.startDate)
          : undefined,
        endDate: draftCategory?.endDate
          ? moment(draftCategory.endDate)
          : undefined,
        description: draftCategory?.description,
        apphierId: draftCategory?.apphierId,
      });

      setStartDate(
        draftCategory?.startDate ? moment(draftCategory.startDate) : undefined,
      );
      setSelectedHierarchy(draftCategory?.apphierId);
      setListDataAttachment(dataDraftAttachment);
    } else if (id && data_detail?.billingCategory?.id === id) {
      const billingCategory = data_detail?.billingCategory;

      // Data Attachment Information
      const dataAttachment = (data_detail?.attachments || []).map((item) => {
        return {
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.type,
          fileCategoryId: item.fileCategoryId,
          fileCategoryName: item.fileCategoryName,
          pathFile: item.pathFile,
          urlFile1: item.urlFile1,
          urlFile2: item.urlFile2,
          uploadBy: item.createdBy,
          uploadDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        };
      });

      form.setFieldsValue({
        code: billingCategory?.code,
        name: billingCategory?.name,
        startDate: billingCategory?.startDate
          ? moment(billingCategory.startDate)
          : undefined,
        endDate: billingCategory?.endDate
          ? moment(billingCategory.endDate)
          : undefined,
        description: billingCategory?.description,
        apphierId: billingCategory?.apphierId,
      });

      setStartDate(
        billingCategory?.startDate
          ? moment(billingCategory.startDate)
          : undefined,
      );
      setSelectedHierarchy(billingCategory?.apphierId);
      setListDataAttachment(dataAttachment);
    }
  }, [id, type, form, data_detail, data_detail_draft]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getSelectedApproval({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
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
  }, [dataListAppHierDetail]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

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
      path: SYSTEM_SETUP_ROUTES.VIEW_BILLING_ITEM_CATEGORY,
      breadcrumbName: "Transaction Mapping Category",
    },
    {
      path:
        type === "create"
          ? SYSTEM_SETUP_ROUTES.CREATE_BILLING_ITEM_CATEGORY
          : SYSTEM_SETUP_ROUTES.UPDATE_BILLING_ITEM_CATEGORY,
      breadcrumbName:
        type === "create"
          ? "Create Transaction Mapping Category"
          : "Update Transaction Mapping Category",
    },
  ];

  const processData = ({ bodyData, id, type, dateFormatting, flag }) => {
    const body = {
      id: type === "create" ? undefined : id,
      code: bodyData.code,
      name: bodyData.name,
      startDate: bodyData.startDate
        ? moment(bodyData?.startDate).format(dateFormatting.dateFormal)
        : null,
      endDate: bodyData.endDate
        ? moment(bodyData?.endDate).format(dateFormatting.dateFormal)
        : null,
      description: bodyData.description ? bodyData.description : null,
      apphierId: bodyData.apphierId,
      isSubmit: flag,
      remark: bodyData.remark || null,
    };

    return body;
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/billing-item-category/validate-create"
        : `/v1/dbs/api/billing-item-category/validate-update/${id}`;

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
        }),
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = () => {
    setFlag(true);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    setFlag(false);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  // Handle Save Form
  const handleSave = async (formValue) => {
    let errorBody = {};
    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment);
    } else {
      handleMandatory(setListSectionInfo, setListSectionInfo);
      const isDataValid = await checkDataValidity(formValue);

      if (isDataValid) {
        setBodyData({
          ...formValue,
        });
        setModalConfirm(true);
        setListSectionInfo([
          {
            value: "Billing Item Category",
            paramValue: ["code", "name", "startDate"],
          },
          { value: "Approval", paramValue: ["apphierId"] },
          { value: "Attachment" },
        ]);
      } else {
        setModalConfirm(false);
      }
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
      dispatch(createBillingItemCategory(body))
        .unwrap()
        .then(async (dataForm) => {
          const billingItemCategoryId = dataForm?.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const bodyAttachment = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: billingItemCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/billing-item-category/create-attachment`,
              bodyAttachment,
            );
          }
          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
        })
        .catch((error) => {
          console.log(error);
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
      dispatch(updateBillingItemCategory({ body: body }))
        .unwrap()
        .then(async (dataForm) => {
          const billingItemCategoryId = dataForm?.id;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          setLoadingForm(true);
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const bodyAttachment = {
              files: element.file,
              categoryId: element.fileCategoryId,
              referenceId: billingItemCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/billing-item-category/create-attachment`,
              bodyAttachment,
            );
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
    errorFields,
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
                0,
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
      setListSectionInfo([
        {
          value: "Billing Item Category",
          paramValue: ["code", "name", "startDate"],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getDetailBillingItemCategory(id));
      dispatch(getDetailDraftBillingItemCategory(id));
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

  // Function Get Data StartDate
  const handleStartDate = (value) => {
    form.resetFields(["endDate"]);
    setStartDate(value);
    return value;
  };

  // Function Get Data EndDate
  const handleEndDate = (value) => {
    setEndDate(value);
    return value;
  };

  const handleBack = () => {
    setModalBack(true);
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />

        {/* FormStepper menggantikan RadioTabs */}
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
        >
          {/* Billing Item Category Section */}
          <div
            style={{
              display:
                valuePage !== listSectionInfo[0].value ? "none" : undefined,
            }}
          >
            <BillingItemCategorySectionForm
              type={type}
              form={form}
              status={status}
              statusApproval={statusApproval}
              startDate={startDate}
              endDate={endDate}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
            />
          </div>

          <div
            style={{
              display:
                valuePage !== listSectionInfo[1].value ? "none" : undefined,
            }}
          >
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

          <div
            style={{
              display:
                valuePage !== listSectionInfo[2].value ? "none" : undefined,
            }}
          >
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

          {/* FormFooter menggantikan manual footer buttons */}
          <FormFooter
            current={current}
            totalSteps={steps.length}
            onPrev={prev}
            onNext={next}
            onCancel={handleBack}
            onClear={handleClear}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            type={type}
            disabled={false}
          />
        </Form>

        {/* Modal Confirmation */}
        <ConfirmationBillingItemCategory
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
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>

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

export default BillingItemCategoryForm;
