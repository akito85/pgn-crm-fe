import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import {
  FormStepper,
  FormFooter,
} from "../../../../../../components/FormStepNavigation";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import DailyRateCreate from "./DailyRateCreate";
import SVGIcon from "../../../../../../assets/Icon/index";
import ModalConfirmDailyRate from "./ModalConfirmDailyRate";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import {
  createMasterDailyRates,
  getAllApprovalList,
  getCurrencyDDL,
  getDetailDR,
  getDetailDraftDR,
  getListApprovalById,
  getListCategory,
  getRateTypeDDL,
  updateMasterDailyRates,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/dailyrate";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../../redux/slices/general_slice";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { getConfigFileRBIData } from "../../../../../../redux/slices/attachmentSlice";
import { configApp } from "../../../../../../constants/configApp";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../components/Modal/ModalPopUp";

const DailyRateForm = ({ type }) => {
  const {
    data_cur,
    dataListAppHierId,
    dataListAppHierDetail,
    data_rate,
    loading,
    data_detail,
    data_detail_draft,
  } = useSelector((state) => state.daily_rate);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const listTypeSubmit = [true, false];
  const { id, status, statusApproval } = location?.state || {};

  // State untuk Stepper
  const [current, setCurrent] = useState(0);

  const steps = [
    { title: "DAILY RATE", value: "Daily Rate" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  const [tabData, setTabData] = useState([
    {
      value: "Daily Rate",
      paramValue: [
        "rateType",
        "fCurrency",
        "tCurrency",
        "rateDate",
        "convertedRate",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(steps[0].value);

  // State lainnya
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [kirimBody, setKirimBody] = useState({});
  const [bodyError, setBodyError] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [ratesId, setRatesId] = useState();
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [convertedRate, setConvertedRate] = useState();
  const [typeSubmit, setTypeSubmit] = useState(listTypeSubmit[0]);

  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);

  const isLoading = loading || loadingForm;

  // Stepper navigation handlers
  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

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

  // useEffect
  useEffect(() => {
    dispatch(getCurrencyDDL());
    dispatch(getAllApprovalList());
    dispatch(getRateTypeDDL());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailDR(id));
      dispatch(getDetailDraftDR(id));
    }
  }, [dispatch, id, type, status, statusApproval]);

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
      dispatch(getListApprovalById({ id: selectedHierarchy }));
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

  // filter to currency from and to
  const fCurrencyName = data_cur
    ?.filter((a) => a.Id === formValue?.fCurrency)
    ?.find((b) => b.text)?.text;
  const tCurrencyName = data_cur
    ?.filter((a) => a.Id === formValue?.tCurrency)
    ?.find((b) => b.text)?.text;
  const rTypeName = data_rate
    ?.filter((a) => a.code === formValue?.rateType)
    ?.find((b) => b.text)?.text;

  const asserDataDetail = useCallback(
    (data_detail) => {
      const appHier = data_detail?.appHierId || [];
      const dataAttachment = (data_detail?.mattachments || []).map((item) => {
        return {
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
          createdBy: item.createdBy,
          createdDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        };
      });
      setSelectedHierarchy(appHier);
      setListDataAttachment(dataAttachment);
      form.setFieldsValue({
        id: data_detail?.ratesId,
        rateType: data_detail?.rateType,
        fCurrency: data_detail?.fromCurrency,
        tCurrency: data_detail?.toCurrency,
        rateDate:
          data_detail?.rateDate === null
            ? moment()
            : moment(data_detail?.rateDate).clone(),
        convertedRate: data_detail?.convertedRate,
        description: data_detail?.description,
        apphierId: appHier,
      });
    },
    [form],
  );

  const asserDataDetailDraft = useCallback(
    (data_detail_draft, data_detail) => {
      const appHier = data_detail_draft?.appHierId || [];
      setSelectedHierarchy(appHier);
      const dataAttachment = (data_detail?.mattachments || []).map((item) => {
        return {
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
          createdBy: item.createdBy,
          createdDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        };
      });
      setListDataAttachment(dataAttachment);
      form.setFieldsValue({
        id: data_detail_draft?.ratesId,
        rateType: data_detail_draft?.rateType,
        fCurrency: data_detail_draft?.fromCurrency,
        tCurrency: data_detail_draft?.toCurrency,
        rateDate:
          data_detail_draft?.rateDate === null
            ? moment()
            : moment(data_detail_draft?.rateDate).clone(),
        convertedRate: data_detail_draft?.convertedRate,
        apphierId: appHier,
        description: data_detail_draft?.description,
      });
    },
    [form],
  );

  useEffect(() => {
    if (
      id &&
      type === "update" &&
      data_detail_draft?.ratesId === id &&
      data_detail?.ratesId === id
    ) {
      asserDataDetailDraft(data_detail_draft, data_detail);
    } else if (
      id &&
      type === "update" &&
      !data_detail_draft?.ratesId &&
      data_detail?.ratesId === id
    ) {
      asserDataDetail(data_detail);
    }
  }, [
    id,
    type,
    data_detail,
    data_detail_draft,
    asserDataDetail,
    asserDataDetailDraft,
  ]);

  useEffect(() => {
    if (
      formValue.approvalHierarchy &&
      !appHierOptions
        .map((item) => item.value)
        .includes(formValue.approvalHierarchy)
    ) {
      form.setFieldsValue({ approvalHierarchy: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

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
      path: RBI_ROUTES.DAILY_RATE_VIEW,
      breadcrumbName: "Daily Rate",
    },
    {
      path: RBI_ROUTES.DAILY_RATE_CREATE,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];

  const handleBack = () => {
    setModalBack(true);
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

  const handleError = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setTabData, listDataAttachment, errorFields);
  };

  const processData = ({
    type,
    kirimBody,
    data_detail,
    fCurrencyName,
    tCurrencyName,
    rTypeName,
  }) => {
    const body = {
      ...kirimBody,
      convertedRateName: kirimBody?.convertedRate,
      fromCurrencyName: type === "update" ? fCurrencyName : undefined,
      toCurrencyName: type === "update" ? tCurrencyName : undefined,
      rateTypeName: type === "update" ? rTypeName : undefined,
      ratesId: type === "update" ? data_detail?.ratesId : undefined,
    };

    return body;
  };

  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/daily-rate/validate-create"
        : "/v1/dbs/api/daily-rate/validate-update";

    const body = processData({
      kirimBody: formValue,
      data_detail,
      fCurrencyName,
      rTypeName,
      tCurrencyName,
      type,
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

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setSelectedHierarchy("");
      setKirimBody({});
      setListDataAttachment([]);
      setTabData([
        {
          value: "Daily Rate",
          paramValue: [
            "rateType",
            "fCurrency",
            "tCurrency",
            "rateDate",
            "convertedRate",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    } else {
      if (id && data_detail_draft?.ratesId === id) {
        asserDataDetailDraft(data_detail_draft, data_detail);
      } else if (
        id &&
        !data_detail_draft?.ratesId &&
        data_detail?.ratesId === id
      ) {
        asserDataDetail(data_detail);
      }
    }
  };

  const handleSubmitForm = async (formValue) => {
    const allFormValues = { ...formValue, ...form.getFieldsValue(true) };
    if (listDataAttachment.length === 0) {
      handleMandatory(setTabData, listDataAttachment);
    } else {
      handleMandatory(setTabData, listDataAttachment);
      if (allFormValues?.tCurrency === allFormValues?.fCurrency) {
        const errorBody = {
          title: "Failed",
          description: "From currency cannot be the same as to currency!",
        };
        dispatch(showModalError(errorBody));
      } else {
        const dataValue = {
          rateType: allFormValues?.rateType,
          fromCurrency: allFormValues?.fCurrency,
          toCurrency: allFormValues?.tCurrency,
          rateDate: moment(allFormValues?.rateDate).format(
            dateFormatting.dateCapital,
          ),
          convertedRate: allFormValues?.convertedRate,
          description: allFormValues?.description,
          appHierId: allFormValues?.apphierId,
          submit: typeSubmit,
        };
        const isDataValid = await checkDataValidity(dataValue);

        if (isDataValid) {
          setModalConfirm(true);
          setKirimBody(dataValue);
          setTabData([
            {
              value: "Daily Rate",
              paramValue: [
                "rateType",
                "fCurrency",
                "tCurrency",
                "rateDate",
                "convertedRate",
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

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  const handleProcessModalConfirm = async () => {
    setLoadingSave(true);
    const body = processData({
      kirimBody,
      data_detail,
      fCurrencyName,
      rTypeName,
      tCurrencyName,
      type,
    });

    if (type !== "update") {
      dispatch(createMasterDailyRates(body))
        .unwrap()
        .then(async (data) => {
          let dailyRate = data?.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              refId: dailyRate,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/daily-rate/upload-attachment`,
              body,
            );
          }
          setLoadingForm(false);
          setLoadingSave(false);
          setRatesId(dailyRate);
          handleCancelModalConfirm();
          handleClear();
        })
        .catch((error) => {
          setLoadingSave(false);
          if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
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
      dispatch(updateMasterDailyRates(body))
        .unwrap()
        .then(async () => {
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              refId: data_detail?.ratesId,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/daily-rate/upload-attachment`,
              body,
            );
          }
          setLoadingForm(false);
          setLoadingSave(false);
          setRatesId(ratesId);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy("");
          setListDataAttachment([]);
        })
        .catch((error) => {
          setLoadingSave(false);
          if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
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

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleProcessModalConfirm();
    setModalError(false);
    setBodyError({});
  };

  const handleSubmit = () => {
    setTypeSubmit(listTypeSubmit[0]);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  const handleSaveDraft = () => {
    setTypeSubmit(listTypeSubmit[1]);
    setTimeout(() => {
      form.submit();
    }, 0);
  };

  return (
    <>
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
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          {/* Step 1: Daily Rate - Conditional Rendering */}
          {valuePage === tabData[0].value && (
            <DailyRateCreate
              dataCurrency={data_cur}
              dataRateType={data_rate}
              setConvertedRate={setConvertedRate}
              convertedRate={convertedRate}
              status={status}
            />
          )}

          {/* Step 2: Approval - Conditional Rendering */}
          {valuePage === tabData[1].value && (
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          )}

          {/* Step 3: Attachment - Conditional Rendering */}
          {valuePage === tabData[2].value && (
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector={"daily_rate"}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </BaseContainer>
          )}

          {/* FormFooter menggantikan tombol manual */}
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
          />
        </Form>

        {/* Modal Confirmation */}
        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={handleCancelModalConfirm}
          header={"Confirmation"}
          width={1000}
          type={"confirmation"}
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent
                onClick={handleCancelModalConfirm}
                type="default"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type="submit"
                onClick={handleProcessModalConfirm}
                loading={loadingSave}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ModalConfirmDailyRate
            data={kirimBody}
            data_cur={data_cur}
            data_rate={data_rate}
            tabData={tabData}
            listDataAttachment={listDataAttachment}
            listDataAppHierDetail={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
          />
        </ModalCustom>

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
              typeSubmit ? "submitted" : "created"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default DailyRateForm;
