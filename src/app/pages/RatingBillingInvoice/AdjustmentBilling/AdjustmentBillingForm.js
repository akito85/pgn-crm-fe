import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Form } from "antd";
import moment from "moment";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import BreadCrumb from "../../../../components/BreadCrumb";
import {
  FormStepper,
  FormFooter,
} from "../../../../components/FormStepNavigation";
import SVGIcon from "../../../../assets/Icon/index";
import AdjustmentBillingSectionForm from "./Form/AdjustmentBillingSectionForm";
import {
  createAdjustmentBilling,
  getDetailAdjustmentBilling,
  getListApprovalHierarchy,
  getListApprovalHierarchyDetail,
  getListCategory,
  getSelectTOP,
  updateAdjustmentBilling,
  getListType,
} from "../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import ModalBack from "../../../../components/Modal/ModalBack";
import ConfirmationLayout from "./Modal/ConfirmationLayout";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../redux/slices/attachmentSlice";
import { showModalError } from "../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import CardContainer from "../../../../components/CardContainer";

const AdjustmentBillingForm = ({ type }) => {
  // Selector
  const {
    loading,
    dataListAppHierDetail,
    dataListAppHierId,
    dataListSelectTOP,
    dataDetail,
  } = useSelector((state) => state.adjustmentBilling);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id, adjustmentNumber } = location?.state || {};

  // State
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataABI, setListDataABI] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [dataInvoice, setDataInvoice] = useState({});
  const [idInvoice, setIdInvoice] = useState();
  const [idAccount, setIdAccount] = useState();
  const [cycleId, setCycleId] = useState();
  const [billingPeriodId, setBillingPeriodId] = useState();
  const [flag, setFlag] = useState(1);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      title: "Adjustment Billing",
      paramValue: [
        "accountNumber",
        "adjustmentType",
        "classificationAdjustment",
        "postInvoice",
        "onDemand",
        "billingCycle",
        "billingPeriod",
        "referenceInvoiceNumber",
        "currency",
        "documentDate",
        "transactionDate",
        "adjustmentReason",
        "accountingDate",
        "rateType",
        "rateDate",
        "remark",
      ],
    },
    { title: "Approval", paramValue: ["apphierId"] },
    { title: "Attachment" },
  ];
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [rangeDisableDate, setRangeDisableDate] = useState({});
  const [selectedClassification, setSelectedClassification] = useState();
  const [selectedPostInvoice, setSelectedPostInvoice] = useState();

  const isLoading = loading || loadingForm;

  // Use Effect
  useEffect(() => {
    dispatch(getSelectTOP());
    dispatch(getListApprovalHierarchy());
    dispatch(getListType());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailAdjustmentBilling(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalHierarchyDetail({ id: selectedHierarchy }));
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

  // Functional Set Data Update
  const dataUpdate = useCallback(
    (dataDetail) => {
      const apphierId = dataDetail?.apphierId || 1;

      // Determine classificationAdjustment value from saved data
      let classificationAdjustmentValue = null;
      let postInvoiceValue = null;
      let onDemandValue = null;

      if (dataDetail?.classification === "Internal") {
        classificationAdjustmentValue = "Internal";
      } else if (dataDetail?.postInvoice) {
        classificationAdjustmentValue = "Post Invoice";
        postInvoiceValue = dataDetail?.postInvoice;
        onDemandValue = dataDetail?.onDemand;
      }

      const obj = {
        accountNumberWithName:
          dataDetail?.accountNumber + "-" + dataDetail?.accountName,
        customerNumber: dataDetail?.customerNumber,
        customerName: dataDetail?.customerName,
        accountNumber: dataDetail?.accountNumber,
        accountName: dataDetail?.accountName,
        serviceAgreementClass: dataDetail?.serviceAgreementClass,
        accountSegment: dataDetail?.accountSegment,
        accountGroupType: dataDetail?.accountGroupType,
        sor: dataDetail?.sor,
        costCenterCode: dataDetail?.costCenterCode,
        costCenterName: dataDetail?.costCenterName,
        meterReadingCode: dataDetail?.meterReadingCode,
        adjustmentType: dataDetail?.adjustmentType,
        billingCycle: dataDetail?.billingCycle,
        billingPeriod: dataDetail?.billingPeriod,
        referenceInvoiceNumber: dataDetail?.referenceInvoiceNumber,
        currency: dataDetail?.currency,
        documentDate: moment(dataDetail?.documentDate),
        transactionDate: moment(dataDetail?.transactionDate),
        accountingDate: moment(dataDetail?.accountingDate),
        termsOfPayment: dataDetail?.termsOfPayment,
        adjustmentReason: dataDetail?.adjustmentReason,
        rateType: dataDetail?.rateType,
        rateDate: dataDetail?.rateDate ? moment(dataDetail?.rateDate) : null,
        remark: dataDetail?.remark,
        apphierId: apphierId,
        classificationAdjustment: classificationAdjustmentValue,
        postInvoice: postInvoiceValue,
        onDemand: onDemandValue,
      };

      form.setFieldsValue(obj);
      setCycleId(dataDetail?.billingCycle);
      setIdAccount(dataDetail?.accountId);
      setSelectedHierarchy(apphierId);
      //ADJUSTMENT ID INVOICE AND BILLING PERIOD IS EMPTY EVEN AFTER UPDATE
      setIdInvoice(dataDetail.referenceInvoiceNumber);
      setBillingPeriodId(dataDetail.billingPeriod);
      setDataInvoice(dataDetail?.invoiceInformation || null);

      // Set classification states for conditional rendering
      setSelectedClassification(classificationAdjustmentValue);
      setSelectedPostInvoice(postInvoiceValue);

      setListDataAttachment(
        (dataDetail?.mAttachmentLists || []).map((attachData) => ({
          ...attachData,
          dataType: "exist",
        })),
      );
      setListDataABI(
        (dataDetail?.tAdjustmentBillingDetail || []).map((data, index) => {
          let obj = {
            ...data,
            key: index + 1,
          };

          delete obj.createdDate;
          delete obj.createdBy;
          delete obj.entityId;
          delete obj.isDeleted;
          delete obj.updatedDate;
          delete obj.updatedBy;
          return obj;
        }),
      );
    },
    [form],
  );

  useEffect(() => {
    if (id && type === "update" && dataDetail?.id === id) {
      dataUpdate(dataDetail);
    }
  }, [id, type, dataDetail, dataUpdate]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.ADJUSTMENT_BILLING_VIEW,
      breadcrumbName: "Adjustment Billing",
    },
    {
      path:
        type === "create"
          ? RBI_ROUTES.ADJUSTMENT_BILLING_CREATE
          : RBI_ROUTES.ADJUSTMENT_BILLING_UPDATE,
      breadcrumbName:
        type === "create"
          ? "Create Adjustment Billing"
          : "Update Adjustment Billing",
    },
  ];

  // Handle Step Navigation
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  // Handle Clear
  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setAppHierOptions([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setListDataABI([]);
      setBodyData({});
      setDataInvoice({});
      setIdInvoice();
      setCycleId();
      setRangeDisableDate({});
      setSelectedClassification(undefined);
      setSelectedPostInvoice(undefined);
    } else {
      dataUpdate(dataDetail);
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

  // Handle Save Form
  const handleSave = (formValue) => {
    let errorBody = {};
    if (listDataAttachment.length === 0) {
      setCurrentStep(2); // Go to Attachment step
      return;
    }

    if (listDataABI.length === 0) {
      errorBody = {
        title: "Failed",
        description: "Adjustment Billing Item Mandatory. Please insert data.",
      };
      dispatch(showModalError(errorBody));
    } else {
      setBodyData({
        ...formValue,
      });
      setModalConfirm(true);
    }
  };

  // Handle Confirm
  const handleConfirm = () => {
    setModalConfirm(false);
    const modifiedArray = listDataABI?.map((obj) => {
      const { key, ...rest } = obj;
      return rest;
    });

    // Sum Total Adjustment IDR
    const dataIDR = modifiedArray
      .filter((v) => v.currency === "IDR")
      .map((a) => a.adjustmentAmount);
    const sumIDR = dataIDR.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    // Sum Total Adjustment USD
    const dataUSD = modifiedArray
      .filter((v) => v.currency === "USD")
      .map((a) => a.adjustmentAmount);
    const sumUSD = dataUSD.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    delete bodyData?.accountNumberWithName;

    // Build classification, postInvoice, onDemand values based on selection
    let classificationValue = null;
    let postInvoiceValue = null;
    let onDemandValue = null;

    const classificationAdjustment = bodyData?.classificationAdjustment;

    if (classificationAdjustment === "Internal") {
      // Internal selected: classification = "Internal", postInvoice = null, onDemand = null
      classificationValue = classificationAdjustment;
      postInvoiceValue = null;
      onDemandValue = null;
    } else if (classificationAdjustment === "Post Invoice") {
      // Post Invoice selected: need to check postInvoice value
      const postInvoice = bodyData?.postInvoice;

      if (postInvoice === "Carry Forward Adjustment") {
        // Carry Forward Adjustment: classification = postInvoice value, postInvoice = postInvoice value, onDemand = null
        classificationValue = postInvoice;
        postInvoiceValue = postInvoice;
        onDemandValue = null;
      } else if (postInvoice === "On Demand") {
        // On Demand: classification = classificationAdjustment, postInvoice = postInvoice, onDemand = onDemand value
        classificationValue = classificationAdjustment;
        postInvoiceValue = postInvoice;
        onDemandValue = bodyData?.onDemand || null;
      }
    }

    // Remove temporary fields
    delete bodyData?.classificationAdjustment;

    const body = {
      ...bodyData,
      id: type === "update" ? id : undefined,
      adjustmentNumber: type === "update" ? adjustmentNumber : null,
      adjustmentBillingDetails: modifiedArray,
      submit: flag === 1 ? false : true,
      documentDate: moment(bodyData?.documentDate).format(
        "YYYY-MM-DDTHH:mm:ss",
      ),
      accountingDate: moment(bodyData?.accountingDate).format(
        "YYYY-MM-DDTHH:mm:ss",
      ),
      transactionDate: moment(bodyData?.transactionDate).format(
        "YYYY-MM-DDTHH:mm:ss",
      ),
      rateType: bodyData?.rateType || dataInvoice?.rateType,
      rate: dataInvoice?.rate,
      rateDate: bodyData?.rateDate
        ? moment(bodyData?.rateDate).format("YYYY-MM-DDTHH:mm:ss")
        : dataInvoice?.rateDate,
      accountId: idAccount,
      totalAdjustmentAmountIdr: sumIDR || null,
      totalAdjustmentAmountUsd: sumUSD || null,
      classification: classificationValue,
      postInvoice: postInvoiceValue,
      onDemand: onDemandValue,
    };

    // replace if value undefined to be null
    const bodyValue = {};
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        if (typeof body[key] === "undefined") {
          bodyValue[key] = null;
        } else {
          bodyValue[key] = body[key];
        }
      }
    }

    if (type === "create") {
      dispatch(createAdjustmentBilling({ body: bodyValue }))
        .unwrap()
        .then(async (dataForm) => {
          const idAdjustment = dataForm.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/rbi/adjustment/uploadAttachment/${idAdjustment}`,
              body,
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
    } else {
      dispatch(updateAdjustmentBilling({ body: bodyValue }))
        .unwrap()
        .then(async (data) => {
          setLoadingForm(true);
          const idAdjustment = data.id;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist",
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/rbi/adjustment/uploadAttachment/${idAdjustment}`,
              body,
            );
          }
          loadingForm(false);
          setModalConfirm(false);
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
          setModalConfirm(false);
        });
    }
  };

  // Handle Error Tab Form - navigate to first step with error
  const handleError = ({ errorFields }) => {
    if (errorFields && errorFields.length > 0) {
      // Find which step has the first error
      for (let i = 0; i < steps.length; i++) {
        const stepParamValues = steps[i].paramValue || [];
        const hasError = errorFields.some((field) =>
          stepParamValues.includes(field.name[0]),
        );
        if (hasError) {
          setCurrentStep(i);
          break;
        }
      }
    }
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <FormStepper
          steps={steps}
          current={currentStep}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          <div className={`${currentStep !== 0 ? "hidden" : ""}`}>
            <AdjustmentBillingSectionForm
              type={type}
              form={form}
              listDataABI={listDataABI}
              setListDataABI={setListDataABI}
              dataInvoice={dataInvoice}
              setDataInvoice={setDataInvoice}
              idInvoice={idInvoice}
              setIdInvoice={setIdInvoice}
              idAccount={idAccount}
              setIdAccount={setIdAccount}
              dataListSelectTOP={dataListSelectTOP}
              adjustmentId={id}
              cycleId={cycleId}
              setCycleId={setCycleId}
              billingPeriodId={billingPeriodId}
              setBillingPeriodId={setBillingPeriodId}
              setRangeDisableDate={setRangeDisableDate}
              rangeDisableDate={rangeDisableDate}
              selectedClassification={selectedClassification}
              setSelectedClassification={setSelectedClassification}
              selectedPostInvoice={selectedPostInvoice}
              setSelectedPostInvoice={setSelectedPostInvoice}
            />
          </div>

          <div className={`${currentStep !== 1 ? "hidden" : ""}`}>
            <CardContainer subHeader={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>

          <div className={`${currentStep !== 2 ? "hidden" : ""}`}>
            <CardContainer subHeader={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="adjustmentBilling"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </CardContainer>
          </div>

          <FormFooter
            current={currentStep}
            totalSteps={steps.length}
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            onCancel={() => setModalBack(true)}
            onClear={handleClear}
            onSaveDraft={() => {
              setFlag(1);
              form.submit();
            }}
            type={type}
            onSubmit={() => {
              setFlag(2);
              form.submit();
            }}
          />
        </Form>

        {/* Modal Confirmation */}
        <ConfirmationLayout
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          data={bodyData}
          dataInvoice={dataInvoice}
          listDataAppHierDetail={appHierDataDetail}
          apiApproval={dataListAppHierId}
          listDataAttachment={listDataAttachment}
          listDataABI={listDataABI}
          setListDataABI={setListDataABI}
          selectedHierarchy={selectedHierarchy}
          dataOption={appHierOptions}
        />

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        {/** Modal Retry */}
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

export default AdjustmentBillingForm;
