import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import SVGIcon from "../../../../../../assets/Icon";
import BillingCycleSectionForm from "../Form/BillingCycleSectionForm";
import CardContainer from "../../../../../../components/CardContainer";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../../constants/configApp";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import {
  getTimeUnit,
  getApprovalHierarchy,
  getDetailApproval,
  getListCategoryFile,
  getInfoDetail,
  getInfoDetailDraft,
  createBillingCycle,
  updateBillingCycle,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { getConfigFileRBIData } from "../../../../../../redux/slices/attachmentSlice";
import ModalConfirmationBillingCycle from "../Modal/ModalConfirmationBillingCycle";
import { dateFormatting } from "../../../../../../utils";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import { validateCreateUpdate } from "../../../../../../redux/slices/general_slice";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { WarningOutlined } from "@ant-design/icons";
import { ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";

const BillingCycleForm = ({ type }) => {
  const {
    loading,
    dataListAppHierId,
    dataListAppHierDetail,
    dataInfoDetail,
    dataInfoDetailDraft,
    list_time_unit,
  } = useSelector((state) => state.billingCycle);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { id, status, statusApproval } = location?.state || {};

  const [current, setCurrent] = useState(0);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [bodyData, setBodyData] = useState({});
  const [bodyError, setBodyError] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalIncomplete, setModalIncomplete] = useState({
    isOpen: false,
    stepName: "",
    stepIndex: 0,
  });
  const flagRef = React.useRef(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [startDate, setStartDate] = useState();

  const isLoading = loading || loadingForm;

  const handleUpdateAttachment = React.useCallback((updater) => {
    setListDataAttachment((prevState) => {
      const newState =
        typeof updater === "function" ? updater(prevState) : updater;
      const removedItems = prevState.filter(
        (item) => !newState.some((newItem) => newItem.key === item.key),
      );
      const removedExistingIds = removedItems
        .filter((item) => item.dataType === "exist" && item.id)
        .map((item) => item.id);
      if (removedExistingIds.length > 0) {
        setDeletedAttachmentIds((prev) => [...prev, ...removedExistingIds]);
      }
      return newState;
    });
  }, []);

  const steps = [
    { title: "BILLING CYCLE", value: "Billing Cycle" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const [tabData, setTabData] = useState([
    {
      value: "Billing Cycle",
      paramValue: [
        "beginCycle",
        "endCycle",
        "timeUnit",
        "invoiceDate",
        "startDate",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(steps[0].value);

  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

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
      path: RBI_ROUTES.BILLING_CYCLE_VIEW,
      breadcrumbName: "Billing Cycle",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.BILLING_CYCLE_CREATE
          : RBI_ROUTES.BILLING_CYCLE_UPDATE,
      breadcrumbName:
        type === "create" ? "Create Billing Cycle" : "Update Billing Cycle",
    },
  ];

  useEffect(() => {
    dispatch(getTimeUnit());
    dispatch(getApprovalHierarchy());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getInfoDetail(id));
      dispatch(getInfoDetailDraft(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (
      id &&
      dataInfoDetailDraft?.billingCycleId === id &&
      dataInfoDetail?.billingCycleId === id
    ) {
      const datadraftAttachment = (dataInfoDetail?.attachmentDtoList || []).map(
        (item, index) => {
          return {
            key: index + 1,
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
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
        }
      );
      form.setFieldsValue({
        beginCycle: dataInfoDetailDraft.beginCycle,
        endCycle: dataInfoDetailDraft.endCycle,
        timeUnit: dataInfoDetailDraft.timeUnit.id,
        invoiceDate: dataInfoDetailDraft.invoiceDate,
        startDate: moment(dataInfoDetailDraft?.startDate),
        endDate: dataInfoDetailDraft?.endDate
          ? moment(dataInfoDetailDraft?.endDate)
          : undefined,
        description: dataInfoDetailDraft.description,
        apphierId: dataInfoDetailDraft?.approvalHierarchy,
      });

      setStartDate(moment(dataInfoDetailDraft?.startDate));
      setSelectedHierarchy(dataInfoDetailDraft?.approvalHierarchy);
      setListDataAttachment(datadraftAttachment);
    } else if (
      id &&
      !dataInfoDetailDraft?.billingCycleId &&
      dataInfoDetail?.billingCycleId === id
    ) {
      const dataAttachment = (dataInfoDetail?.attachmentDtoList || []).map(
        (item, index) => {
          return {
            key: index + 1,
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
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
        }
      );
      form.setFieldsValue({
        beginCycle: dataInfoDetail.beginCycle,
        endCycle: dataInfoDetail.endCycle,
        timeUnit: dataInfoDetail.timeUnit.id,
        invoiceDate: dataInfoDetail.invoiceDate,
        startDate: moment(dataInfoDetail?.startDate),
        endDate: dataInfoDetail?.endDate
          ? moment(dataInfoDetail?.endDate)
          : undefined,
        description: dataInfoDetail.description,
        apphierId: dataInfoDetail?.approvalHierarchy,
      });

      setStartDate(moment(dataInfoDetail?.startDate));
      setSelectedHierarchy(dataInfoDetail?.approvalHierarchy);
      setListDataAttachment(dataAttachment);
    }
  }, [id, type, form, dataInfoDetail, dataInfoDetailDraft]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getDetailApproval({ id: selectedHierarchy }));
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

  const next = () => {
    const fieldsToValidate = tabData[current]?.paramValue;
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

  const handleError = ({ values, errorFields, outOfDate }) => {
    setTabData((prevState) => {
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

    if (errorFields?.length > 0) {
      const firstError = errorFields[0].name[0];
      const stepIndex = tabData.findIndex((page) =>
        page.paramValue?.includes(firstError)
      );

      if (stepIndex !== -1) {
        setModalIncomplete({
          isOpen: true,
          stepName: steps[stepIndex].title,
          stepIndex: stepIndex,
        });
      }
    }
  };

  const processData = ({ bodyData, id, type, dateFormatting, flag }) => {
    const body = {
      isSubmit: flag,
      startDate: moment(bodyData?.startDate).format(dateFormatting.date),
      endDate: bodyData?.endDate
        ? moment(bodyData?.endDate).format(dateFormatting.date)
        : null,
      billingCycleId: type === "update" ? id : null,
      beginCycle: bodyData.beginCycle,
      endCycle: bodyData.endCycle,
      timeUnit: bodyData.timeUnit,
      invoiceDate: bodyData.invoiceDate,
      description: bodyData.description || null,
      appHierId: bodyData.apphierId || bodyData.appHierId,
    };

    return body;
  };

  // Helper to build processData with the current flag ref value
  const buildProcessData = (bodyDataArg) =>
    processData({
      bodyData: bodyDataArg,
      id,
      type,
      dateFormatting,
      flag: flagRef.current,
    });

  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/billingcycle/validate-create"
        : "/v1/dbs/api/billingcycle/validate-update";

    const body = buildProcessData(formValue);

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

  const handleSubmitForm = async (formValue) => {
    if (listDataAttachment.length === 0) {
      setTabData((prevState) => {
        return prevState.map((item) => {
          if (item.value === "Attachment") {
            return { ...item, errorBadge: 1 };
          }
          return item;
        });
      });
      setModalIncomplete({
        isOpen: true,
        stepName: steps[2].title,
        stepIndex: 2,
      });
    } else {
      const isDataValid = await checkDataValidity(formValue);

      if (isDataValid) {
        setBodyData({
          beginCycle: formValue.beginCycle,
          endCycle: formValue.endCycle,
          timeUnit: formValue.timeUnit,
          invoiceDate: formValue.invoiceDate,
          startDate: moment(formValue?.startDate).format(dateFormatting.date),
          endDate: formValue?.endDate
            ? moment(formValue?.endDate).format(dateFormatting.date)
            : null,
          description: formValue.description || null,
          apphierId: formValue.apphierId,
        });
        setModalConfirm(true);
        setTabData([
          {
            value: "Billing Cycle",
            paramValue: [
              "beginCycle",
              "endCycle",
              "timeUnit",
              "invoiceDate",
              "startDate",
            ],
          },
          { value: "Approval", paramValue: ["apphierId"] },
          { value: "Attachment" },
        ]);
      } else {
        setModalConfirm(false);
      }
    }
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setDeletedAttachmentIds([]);
      setBodyData({});
      setCurrent(0);
      setTabData([
        {
          value: "Billing Cycle",
          paramValue: [
            "beginCycle",
            "endCycle",
            "timeUnit",
            "invoiceDate",
            "startDate",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      dispatch(getInfoDetail(id));
      dispatch(getInfoDetailDraft(id));
      setCurrent(0);
    }
  };

  const handleSave = async () => {
    setLoadingSave(true);

    const payload = buildProcessData(bodyData);

    if (type === "create") {
      dispatch(createBillingCycle(payload))
        .unwrap()
        .then(async (dataForm) => {
          let billingCycleId = dataForm.billingCycleId;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referensiId: billingCycleId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/billingcycle/attachment-upload`,
              body
            );
          }
          setLoadingForm(false);
          handleClear();
          setLoadingSave(false);
          setModalConfirm(false);
        })
        .catch((error) => {
          setLoadingSave(false);
          setModalConfirm(false);
          if (Math.floor((error?.response?.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error?.response?.data &&
                error?.response?.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateBillingCycle(payload))
        .unwrap()
        .then(async (dataForm) => {
          let billingCycleId = dataForm.billingCycleId;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          setLoadingForm(true);
          if (deletedAttachmentIds.length > 0) {
            await ratingBillingHttpService.deleteDataWithBody(
              `/v1/dbs/api/attachment/delete-attachment`,
              { fileId: deletedAttachmentIds },
            );
          }
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referensiId: billingCycleId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/billingcycle/attachment-upload`,
              body
            );
          }
          setLoadingForm(false);
          handleClear();
          setLoadingSave(false);
          setModalConfirm(false);
        })
        .catch((error) => {
          setLoadingSave(false);
          setModalConfirm(false);
          if (Math.floor((error?.response?.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error?.response?.data &&
                error?.response?.data.message) ||
              error.message ||
              error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave();
    setModalError(false);
    setBodyError({});
  };

  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleSubmit = () => {
    flagRef.current = true;
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    flagRef.current = false;
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleStartDate = (value) => {
    form.resetFields(["endDate"]);
    setStartDate(value);
    return value;
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          <div
            style={{
              display:
                valuePage !== tabData[0].value ? "none" : undefined,
            }}
          >
              <BillingCycleSectionForm
                type={type}
                dataTimeUnit={list_time_unit}
                startDate={startDate}
                status={status}
                handleStartDate={handleStartDate}
              />
          </div>

          <div
            style={{
              display:
                valuePage !== tabData[1].value ? "none" : undefined,
            }}
          >
              <CardContainer header={"Approval Information"}>
                <ApprovalComponentGeneral
                  type={type}
                  dataTable={appHierDataDetail}
                  dataOption={appHierOptions}
                  selectedHierarchy={selectedHierarchy}
                  updateSelectedHierarchy={setSelectedHierarchy}
                />
                </CardContainer>
          </div>

          <div
            style={{
              display:
                valuePage !== tabData[2].value ? "none" : undefined,
            }}
          >
              <CardContainer header={"Attachment Information"}>
                <AttachmentComponent
                  type={type}
                  data={listDataAttachment}
                  updateData={handleUpdateAttachment}
                  dispatch={dispatch}
                  typeSelector="billingCycle"
                  getAPICategory={getListCategoryFile}
                  service={ratingBillingHttpService}
                  configApplication={configApp.RATING_BILLING_SERVICE}
                  getAPIGuard={getConfigFileRBIData}
                  typeRBI={"data"}
                  mandatory={true}
                />
                </CardContainer>
          </div>

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
            isLoading={loadingSave || loadingForm}
          />
        </Form>

        <ModalConfirmationBillingCycle
            isOpen={modalConfirm}
            handleCancel={() => setModalConfirm(false)}
            handleConfirm={handleSave}
            data={bodyData}
            listDataAppHierDetail={appHierDataDetail}
            apiApproval={dataListAppHierId}
            listDataAttachment={listDataAttachment}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            apiTimeUnit={list_time_unit}
            isLoading={loadingSave || loadingForm}
          />

        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={600}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>

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
              flagRef.current ? "submitted" : "created"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        {/* Modal Incomplete */}
        <ModalError
          isOpen={modalIncomplete.isOpen}
          handleOk={() => {
            setCurrent(modalIncomplete.stepIndex);
            setModalIncomplete({ isOpen: false, stepName: "", stepIndex: 0 });
          }}
          handleCancel={() => setModalIncomplete({ isOpen: false, stepName: "", stepIndex: 0 })}
          customText="Go to Step"
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Incomplete Data"}</p>
            </div>
            <p className="pl-[70px]">Please complete the mandatory fields in the <b>{modalIncomplete.stepName}</b> section before proceeding.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default BillingCycleForm;