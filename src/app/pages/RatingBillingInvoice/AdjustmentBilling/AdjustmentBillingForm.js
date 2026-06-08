import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Form } from "antd";
import moment from "moment";
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
  getListCalculationType,
  recalculateAdjustmentBilling,
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

const normalizeSelectionText = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isCalculationInProgress = (value) => {
  const normalizedValue = normalizeSelectionText(value);
  return normalizedValue === "open" || normalizedValue === "in progress";
};

const isCarryForwardOrOffCycleSelection = ({
  classificationAdjustment,
  postInvoice,
  onDemand,
} = {}) => {
  const candidates = [classificationAdjustment, postInvoice, onDemand]
    .filter(Boolean)
    .map((v) => {
      const normalized = normalizeSelectionText(v);
      return (
        normalized === "carry_forward" ||
        normalized === "off_cycle" ||
        normalized.includes("carry forward") ||
        normalized.includes("off cycle")
      );
    });

  return candidates.some((v) => v === true);
};

const AdjustmentBillingForm = ({ type }) => {
  // Selector
  const {
    loading,
    dataListAppHierDetail,
    dataListAppHierId,
    dataCurrentBillingPeriod,
    dataListBillingPeriod,
    dataListCalculationType,
    dataListSelectTOP,
    dataTermsOfPayment,
    dataDetail,
    dataListClassification,
  } = useSelector((state) => state.adjustmentBilling);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const idFromState = location?.state?.id;
  const adjustmentNumberFromState = location?.state?.adjustmentNumber;
  const searchParams = new URLSearchParams(location?.search || "");
  const idFromQuery = searchParams.get("id");
  const parsedIdFromQuery =
    idFromQuery !== null && idFromQuery !== "" ? Number(idFromQuery) : null;
  const id =
    typeof idFromState !== "undefined"
      ? idFromState
      : Number.isNaN(parsedIdFromQuery)
        ? idFromQuery
        : parsedIdFromQuery;
  const adjustmentNumber =
    adjustmentNumberFromState || searchParams.get("adjustmentNumber") || null;

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
        "currentBillingPeriod",
        "correctionBillingPeriod",
        "referenceInvoiceNumber",
        "currency",
        "documentDate",
        "transactionDate",
        "adjustmentReason",
        "accountingDate",
        "rate",
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
  const [loadingRecalculate, setLoadingRecalculate] = useState(false);
  const [hasSuccessfulRecalculate, setHasSuccessfulRecalculate] =
    useState(false);
  const [recalculateId, setRecalculateId] = useState();
  const [calculationStatus, setCalculationStatus] = useState();

  const isLoading =
    loadingForm || (type === "update" && loading && !dataDetail?.id);

  // Use Effect
  useEffect(() => {
    dispatch(getListApprovalHierarchy());
    dispatch(getListType());
    dispatch(getListCalculationType());
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

  const applyAdjustmentBillingDetail = useCallback(
    (
      dataDetail,
      { preserveAttachments = false, preserveHierarchy = false } = {},
    ) => {
      const apphierId =
        type === "update" ? dataDetail?.apphierId : dataDetail?.apphierId || 1;

      // Determine classificationAdjustment value from saved data
      let classificationAdjustmentValue = null;
      let classificationLabelValue = null;
      let postInvoiceValue = null;
      let onDemandValue = null;

      if (dataDetail?.classification) {
        // Backend sends classification as code; store as-is
        classificationAdjustmentValue = dataDetail?.classification;

        // For UI logic, store label by finding matching classification in list
        if (dataListClassification && dataListClassification.length > 0) {
          const matchedClassification = dataListClassification.find(
            (item) =>
              item.code === dataDetail?.classification ||
              item.id === dataDetail?.classification,
          );
          classificationLabelValue =
            matchedClassification?.name || matchedClassification?.text || null;
        }

        if (dataDetail?.postInvoice || dataDetail?.calculationType) {
          const matchedCalculationType = (dataListCalculationType || []).find(
            (item) => {
              const candidates = [
                item?.id,
                item?.value,
                item?.name,
                item?.text,
                item?.label,
              ]
                .filter(
                  (candidate) => candidate !== null && candidate !== undefined,
                )
                .map((candidate) => String(candidate));

              return candidates.includes(String(dataDetail?.calculationType));
            },
          );

          postInvoiceValue =
            matchedCalculationType?.name ||
            matchedCalculationType?.text ||
            dataDetail?.postInvoice;
          onDemandValue = dataDetail?.onDemand;
        }
      }

      const matchedCalculationTypeId = (dataListCalculationType || []).find(
        (item) => {
          const candidates = [
            item?.id,
            item?.value,
            item?.name,
            item?.text,
            item?.label,
          ]
            .filter(
              (candidate) => candidate !== null && candidate !== undefined,
            )
            .map((candidate) => String(candidate));

          return candidates.includes(String(dataDetail?.calculationType));
        },
      )?.id;

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
        currentBillingPeriod:
          dataDetail?.currentBillingPeriod ??
          dataDetail?.currentBillingPeriodName ??
          dataDetail?.billingPeriodName ??
          null,
        correctionBillingPeriod:
          dataDetail?.correctionBillingPeriodId ??
          dataDetail?.correctionBillPeriodId ??
          dataDetail?.billingPeriod,
        referenceInvoiceNumber: dataDetail?.referenceInvoiceNumber,
        currency: dataDetail?.currency,
        documentDate: moment(dataDetail?.documentDate),
        transactionDate: moment(dataDetail?.transactionDate),
        accountingDate: moment(dataDetail?.accountingDate),
        termsOfPayment: dataDetail?.termsOfPayment,
        adjustmentReason: dataDetail?.adjustmentReason,
        rate: dataDetail?.rate,
        rateType: dataDetail?.rateType,
        rateDate: dataDetail?.rateDate ? moment(dataDetail?.rateDate) : null,
        remark: dataDetail?.remark,
        apphierId: apphierId,
        classificationAdjustment: classificationAdjustmentValue,
        postInvoice:
          matchedCalculationTypeId ?? dataDetail?.calculationType ?? null,
        onDemand: onDemandValue,
      };

      form.setFieldsValue(obj);
      setRecalculateId(dataDetail?.id);
      setCalculationStatus(dataDetail?.calculationStatus);
      setCycleId(dataDetail?.billingCycle);
      setIdAccount(dataDetail?.accountId);
      if (!preserveHierarchy) {
        setSelectedHierarchy(apphierId);
      }
      //ADJUSTMENT ID INVOICE AND BILLING PERIOD IS EMPTY EVEN AFTER UPDATE
      setIdInvoice(dataDetail.referenceInvoiceNumber);
      setBillingPeriodId(
        dataDetail?.correctionBillingPeriodId ??
        dataDetail?.correctionBillPeriodId ??
        dataDetail?.billingPeriod,
      );
      setDataInvoice(dataDetail?.invoiceInformation || null);

      // Set classification states for conditional rendering (use label for compatibility)
      setSelectedClassification(classificationLabelValue);
      setSelectedPostInvoice(postInvoiceValue);

      if (!preserveAttachments) {
        setListDataAttachment(
          (dataDetail?.mAttachmentLists || []).map((attachData) => ({
            ...attachData,
            dataType: "exist",
          })),
        );
      }
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
      setHasSuccessfulRecalculate(
        (dataDetail?.tAdjustmentBillingDetail || []).length > 0,
      );
    },
    [form, dataListCalculationType, dataListClassification, type],
  );

  const resolveBillingPeriodId = useCallback(
    (value, fallbackId) => {
      if (value !== null && typeof value !== "undefined" && value !== "") {
        const normalizedValue = String(value).trim().toLowerCase();
        const matchedBillingPeriod = (dataListBillingPeriod || []).find(
          (item) => {
            const candidates = [
              item?.id,
              item?.value,
              item?.period,
              item?.name,
              item?.text,
            ]
              .filter(
                (candidate) => candidate !== null && candidate !== undefined,
              )
              .map((candidate) => String(candidate).trim().toLowerCase());

            return candidates.includes(normalizedValue);
          },
        );

        if (matchedBillingPeriod?.id) {
          return matchedBillingPeriod.id;
        }

        if (/^\d+$/.test(String(value).trim())) {
          return Number(value);
        }
      }

      if (
        fallbackId !== null &&
        typeof fallbackId !== "undefined" &&
        fallbackId !== ""
      ) {
        return fallbackId;
      }

      return null;
    },
    [dataListBillingPeriod],
  );

  const buildAdjustmentRequestBody = useCallback(
    (formValue, { submit = false } = {}) => {
      const modifiedArray = listDataABI?.map((obj) => {
        const { key, ...rest } = obj;
        return {
          ...rest,
          adjustmentAmount:
            typeof rest.adjustmentAmount === "string"
              ? parseFloat(rest.adjustmentAmount.replace(/,/g, "")) || 0
              : rest.adjustmentAmount,
        };
      });

      const dataIDR = modifiedArray
        .filter((v) => v.currency === "IDR")
        .map((a) => a.adjustmentAmount);
      const sumIDR = dataIDR.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      const dataUSD = modifiedArray
        .filter((v) => v.currency === "USD")
        .map((a) => a.adjustmentAmount);
      const sumUSD = dataUSD.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      const {
        accountNumberWithName,
        classificationAdjustment: _classificationAdjustment,
        termsOfPayment: _termsOfPayment,
        termType,
        currentBillingPeriod,
        correctionBillingPeriod,
        postInvoice: calculationTypeFormValue,
        onDemand: onDemandFormValue,
        ...restFormValue
      } = formValue;

      const classificationAdjustment = formValue?.classificationAdjustment;
      const resolvedCurrentBillingPeriodId = resolveBillingPeriodId(
        currentBillingPeriod,
        dataCurrentBillingPeriod?.id ??
        dataCurrentBillingPeriod?.[0]?.id ??
        dataDetail?.billingPeriod,
      );
      // For correction billing period: if form value is empty/unchanged, use detail ID directly
      // Otherwise, resolve the selected value to ID via resolveBillingPeriodId
      const resolvedCorrectionBillingPeriodId =
        !correctionBillingPeriod && type === "update"
          ? dataDetail?.correctionBillingPeriodId
          : resolveBillingPeriodId(
            correctionBillingPeriod,
            billingPeriodId ?? dataDetail?.correctionBillingPeriodId,
          );

      const calculationTypeValue =
        dataListCalculationType?.find((item) => {
          const candidates = [
            item?.id,
            item?.value,
            item?.name,
            item?.text,
            item?.label,
          ]
            .filter(
              (candidate) => candidate !== null && candidate !== undefined,
            )
            .map((candidate) => String(candidate));

          return candidates.includes(String(calculationTypeFormValue));
        })?.id ?? calculationTypeFormValue;

      const termsOfPaymentValue = (() => {
        if (moment.isMoment(termType?.termValue)) {
          return moment(termType.termValue).format("YYYY-MM-DD");
        }

        if (
          termType?.termValue !== null &&
          typeof termType?.termValue !== "undefined"
        ) {
          const matchedTop = (dataTermsOfPayment || []).find((item) => {
            const candidates = [
              item?.Id,
              item?.id,
              item?.value,
              item?.text,
              item?.name,
            ]
              .filter(
                (candidate) => candidate !== null && candidate !== undefined,
              )
              .map((candidate) => String(candidate));

            return candidates.includes(String(termType?.termValue));
          });

          return (
            matchedTop?.text || matchedTop?.name || termType?.termValue || null
          );
        }

        return formValue?.termsOfPayment || null;
      })();

      const {
        tAdjustmentBillingDetail: _tAdjustmentBillingDetail,
        correctionBillingPeriod: _correctionBillingPeriod,
        correctionBillingPeriodId: _correctionBillingPeriodId,
        adjustmentBillingDetails: _existingAdjustmentBillingDetails,
        totalAdjustmentAmount: _totalAdjustmentAmount,
        totalAdjustmentAmountIdr: _totalAdjustmentAmountIdr,
        totalAdjustmentAmountUsd: _totalAdjustmentAmountUsd,
        totalAmountEqvIdr: _totalAmountEqvIdr,
        totalAmountEqvUsd: _totalAmountEqvUsd,
        ...updateBasePayload
      } = type === "update" ? dataDetail || {} : {};

      const body = {
        ...updateBasePayload,
        ...restFormValue,
        id: type === "update" ? id : undefined,
        adjustmentNumber: type === "update" ? adjustmentNumber : null,
        adjustmentBillingDetails: modifiedArray,
        submit,
        documentDate: formValue?.documentDate
          ? moment(formValue?.documentDate).format("YYYY-MM-DD")
          : null,
        accountingDate: formValue?.accountingDate
          ? moment(formValue?.accountingDate).format("YYYY-MM-DD")
          : null,
        transactionDate: formValue?.transactionDate
          ? moment(formValue?.transactionDate).format("YYYY-MM-DDTHH:mm:ss")
          : null,
        // On update mode, only use recalculated rate when rateType/rateDate has changed.
        // Otherwise, keep original detail rateReal as requested by backend contract.
        rateType: formValue?.rateType || dataInvoice?.rateType,
        rate: (() => {
          const currentRateType = formValue?.rateType || dataInvoice?.rateType;
          const currentRateDate = formValue?.rateDate
            ? moment(formValue?.rateDate).format("YYYY-MM-DD")
            : null;

          const originalRateType = dataDetail?.rateType || null;
          const originalRateDate = dataDetail?.rateDate
            ? moment(dataDetail?.rateDate).format("YYYY-MM-DD")
            : null;

          const isRateCriteriaChanged =
            type !== "update" ||
            String(currentRateType || "") !== String(originalRateType || "") ||
            String(currentRateDate || "") !== String(originalRateDate || "");

          if (!isRateCriteriaChanged) {
            return (
              dataDetail?.rateReal ??
              formValue?.rate ??
              dataInvoice?.rate ??
              dataInvoice?.convertedValue ??
              null
            );
          }

          return (
            formValue?.rate ??
            dataInvoice?.convertedValue ??
            dataInvoice?.rate ??
            null
          );
        })(),
        rateDate: formValue?.rateDate
          ? moment(formValue?.rateDate).format("YYYY-MM-DDTHH:mm:ss")
          : dataInvoice?.rateDate,
        billingPeriod: resolvedCurrentBillingPeriodId,
        correctionBillPeriod: resolvedCorrectionBillingPeriodId,
        accountId: idAccount,
        totalAdjustmentAmountIdr: sumIDR || null,
        totalAdjustmentAmountUsd: sumUSD || null,
        classification: classificationAdjustment || null,
        billingCode: dataInvoice?.billingCode || null,
        termsOfPayment: termsOfPaymentValue,
        calculationType: calculationTypeValue || null,
        postInvoice: calculationTypeFormValue || null,
        onDemand: onDemandFormValue || null,
      };

      const bodyValue = {};
      for (const key in body) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          bodyValue[key] = typeof body[key] === "undefined" ? null : body[key];
        }
      }

      return bodyValue;
    },
    [
      adjustmentNumber,
      billingPeriodId,
      dataCurrentBillingPeriod,
      dataDetail,
      dataInvoice,
      dataListCalculationType,
      dataTermsOfPayment,
      id,
      idAccount,
      listDataABI,
      resolveBillingPeriodId,
      type,
    ],
  );

  useEffect(() => {
    if (id && type === "update" && dataDetail?.id === id) {
      applyAdjustmentBillingDetail(dataDetail);
    }
  }, [id, type, dataDetail, applyAdjustmentBillingDetail]);

  useEffect(() => {
    if (!recalculateId || !isCalculationInProgress(calculationStatus)) {
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const detailResult = await dispatch(
          getDetailAdjustmentBilling(recalculateId),
        ).unwrap();

        if (detailResult) {
          applyAdjustmentBillingDetail(detailResult, {
            preserveAttachments: true,
            preserveHierarchy: true,
          });
        }
      } catch (_error) {
        // Keep current state; explicit error handling is done in thunk.
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [
    applyAdjustmentBillingDetail,
    calculationStatus,
    dispatch,
    recalculateId,
  ]);

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
      setHasSuccessfulRecalculate(false);
      setRecalculateId(undefined);
      setCalculationStatus(undefined);
    } else {
      applyAdjustmentBillingDetail(dataDetail);
    }
  };

  const handleRecalculate = async () => {
    const formValue = form.getFieldsValue(true);

    try {
      setLoadingRecalculate(true);
      const body = buildAdjustmentRequestBody(formValue, { submit: false });
      const recalculateResult = await dispatch(
        recalculateAdjustmentBilling({
          body,
          // If detail has provided recalculateId, always continue via /recalculate/{id}
          id: recalculateId || undefined,
        }),
      ).unwrap();

      const latestRecalculateId = recalculateResult?.id || recalculateId;

      if (latestRecalculateId) {
        setRecalculateId(latestRecalculateId);
        const detailResult = await dispatch(
          getDetailAdjustmentBilling(latestRecalculateId),
        ).unwrap();

        if (detailResult) {
          applyAdjustmentBillingDetail(detailResult, {
            preserveAttachments: true,
            preserveHierarchy: true,
          });
          setHasSuccessfulRecalculate(true);
        }
      }
    } catch (error) {
      // Error handling is managed in thunk to prevent cascading detail calls.
    } finally {
      setLoadingRecalculate(false);
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

    if (type === "create" && flag === 2 && !hasSuccessfulRecalculate) {
      setCurrentStep(0);
      dispatch(
        showModalError({
          title: "Failed",
          description: "You must recalculate before submitting.",
        }),
      );
      return;
    }

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
    const bodyValue = buildAdjustmentRequestBody(bodyData, {
      submit: flag === 1 ? false : true,
    });

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

  const handleFormValuesChange = (changedValues) => {
    const recalculateSensitiveFields = [
      "classificationAdjustment",
      "postInvoice",
      "onDemand",
      "billingCycle",
      "correctionBillingPeriod",
      "referenceInvoiceNumber",
      "currency",
      "documentDate",
      "transactionDate",
      "accountingDate",
      "adjustmentReason",
      "rateType",
      "rateDate",
      "remark",
    ];

    const shouldResetRecalculate = Object.keys(changedValues || {}).some(
      (key) => recalculateSensitiveFields.includes(key),
    );

    if (shouldResetRecalculate && hasSuccessfulRecalculate) {
      setHasSuccessfulRecalculate(false);
    }
  };

  const canCreateBillingAdjustmentItem = useCallback(() => {
    const formValue = form.getFieldsValue(true);
    const restrictedSelection = isCarryForwardOrOffCycleSelection({
      classificationAdjustment:
        formValue?.classificationAdjustment || selectedClassification,
      postInvoice: formValue?.postInvoice || selectedPostInvoice,
      onDemand: formValue?.onDemand,
    });

    if (!restrictedSelection) {
      return true;
    }

    return hasSuccessfulRecalculate;
  }, [
    form,
    hasSuccessfulRecalculate,
    selectedClassification,
    selectedPostInvoice,
  ]);

  return (
    <>
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
          onValuesChange={handleFormValuesChange}
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
              onRecalculate={handleRecalculate}
              loadingRecalculate={loadingRecalculate}
              disableRecalculate={isCalculationInProgress(calculationStatus)}
              hasSuccessfulRecalculate={hasSuccessfulRecalculate}
              canCreateBillingAdjustmentItem={canCreateBillingAdjustmentItem()}
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
            <p className="pl-[70px]">{`Your data was not ${flag === 1 ? "created" : "submitted"
              }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default AdjustmentBillingForm;
