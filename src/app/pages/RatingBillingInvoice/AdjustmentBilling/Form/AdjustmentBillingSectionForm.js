import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, Input } from "antd";
import AdjustmentBISectionForm from "./AdjustmentBISectionForm";
import CardContainer from "../../../../../components/CardContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import SVGIcon from "../../../../../assets/Icon";
import {
  getCurrentBillingPeriod,
  getListAccount,
  getListAdjustmentReason,
  getListBillingCycle,
  getListBillingPeriod,
  getListCurrency,
  getListInvoice,
  getListInvoiceInformation,
  getListType,
  getListRateType,
  getRateAdjustment,
  getListClassification,
  getListCalculationType,
  getListTermsOfPayment,
  getSelectTOP,
} from "../../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import { hasValue } from "../../../../../utils";
import moment from "moment";
import InvoiceSectionForm from "./InvoiceSectionForm";

const AdjustmentBillingSectionForm = ({
  type,
  idAccount,
  setIdAccount,
  idInvoice,
  setIdInvoice,
  dataInvoice = {},
  setDataInvoice = () => {},
  form,
  listDataABI = [],
  setListDataABI = () => {},
  adjustmentId,
  cycleId,
  setCycleId,
  billingPeriodId,
  setBillingPeriodId,
  setRangeDisableDate = () => {},
  rangeDisableDate,
  selectedClassification,
  setSelectedClassification = () => {},
  onRecalculate = () => {},
  loadingRecalculate = false,
  disableRecalculate = false,
  hasSuccessfulRecalculate = false,
  canCreateBillingAdjustmentItem = true,
}) => {
  // Selector
  const {
    dataListAccount,
    dataListType,
    dataListBillingCycle,
    dataListBillingPeriod,
    dataCurrentBillingPeriod,
    dataListInvoice,
    dataListInvoiceInformation,
    dataListAdjustmentReason,
    dataCurrency,
    dataListRateType,
    dataListClassification,
    dataListCalculationType,
    dataListSelectTOP,
    dataTermsOfPayment,
  } = useSelector((state) => state.adjustmentBilling);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");
  const [defaultPicker, setDefaultPicker] = useState("");
  const [keyPicker, setKeyPicker] = useState(0);
  const [referenceInvoiceNumber, setReferenceInvoiceNumber] = useState();
  const [transactionDate, setTransactionDate] = useState(null);
  const [valueDdl, setValueDdl] = useState({ action: "init", value: null });
  const [dropdownLoading, setDropdownLoading] = useState({
    account: false,
    type: false,
    classification: false,
    billingCycle: false,
    billingPeriod: false,
    calculationType: false,
    invoice: false,
    currency: false,
    adjustmentReason: false,
    rateType: false,
    topType: false,
    topValue: false,
  });
  const fetchedRef = useRef({
    account: false,
    type: false,
    classification: false,
    billingCycle: false,
    billingPeriod: false,
    calculationType: false,
    invoice: false,
    currency: false,
    adjustmentReason: false,
    rateType: false,
    topType: false,
    topValue: false,
  });
  const previousHydratedAccountIdRef = useRef();
  const selectedRateType = Form.useWatch("rateType", form);
  const selectedRateDate = Form.useWatch("rateDate", form);
  const selectedTermType = Form.useWatch(["termType", "termValueDdl"], form);
  const selectedTermValue = Form.useWatch(["termType", "termValue"], form);
  const rawTermsOfPayment = Form.useWatch("termsOfPayment", form);

  const currentBillingPeriodSource = Array.isArray(dataCurrentBillingPeriod)
    ? dataCurrentBillingPeriod?.[0]
    : dataCurrentBillingPeriod;
  const currentBillingPeriodLabel =
    currentBillingPeriodSource?.period ||
    currentBillingPeriodSource?.name ||
    currentBillingPeriodSource?.text ||
    (typeof currentBillingPeriodSource === "string"
      ? currentBillingPeriodSource
      : undefined);

  const isDateString = useCallback((value) => {
    if (!hasValue(value) || typeof value !== "string") {
      return false;
    }

    return moment(
      value,
      [moment.ISO_8601, "YYYY-MM-DD", "DD-MM-YYYY"],
      true,
    ).isValid();
  }, []);

  const resolveTermType = useCallback(
    (value) => {
      if (!hasValue(value)) {
        return null;
      }

      return isDateString(value) || value === "DATE" ? "DATE" : "TOP";
    },
    [isDateString],
  );

  const mapTermValueToOptionId = useCallback(
    (value) => {
      if (!hasValue(value)) {
        return undefined;
      }

      const normalizedValue = String(value).trim().toLowerCase();
      const match = (dataTermsOfPayment || []).find((item) => {
        const candidates = [
          item?.Id,
          item?.id,
          item?.code,
          item?.value,
          item?.text,
          item?.name,
        ]
          .filter((candidate) => candidate !== null && candidate !== undefined)
          .map((candidate) => String(candidate).trim().toLowerCase());

        return candidates.includes(normalizedValue);
      });

      return (
        match?.Id ??
        match?.id ??
        match?.code ??
        match?.value ??
        match?.text ??
        match?.name ??
        value
      );
    },
    [dataTermsOfPayment],
  );

  const topTypeOptions =
    (dataListSelectTOP || []).length > 0
      ? dataListSelectTOP.map((item) => ({
          label: item?.text || item?.name || item?.value || item?.code,
          value: item?.code || item?.value || item?.id || item?.text,
        }))
      : [
          { label: "TOP", value: "TOP" },
          { label: "DATE", value: "DATE" },
        ];

  const runLazyFetch = useCallback(
    async (key, thunk, payload) => {
      if (fetchedRef.current[key] || dropdownLoading[key]) {
        return;
      }

      setDropdownLoading((prev) => ({ ...prev, [key]: true }));
      try {
        if (typeof payload === "undefined") {
          await dispatch(thunk()).unwrap();
        } else {
          await dispatch(thunk(payload)).unwrap();
        }
        fetchedRef.current[key] = true;
      } catch (_error) {
        // Keep it retryable by not setting fetchedRef when request fails.
      } finally {
        setDropdownLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [dispatch, dropdownLoading],
  );

  const fetchInvoiceList = useCallback(async () => {
    if (
      !idAccount ||
      !cycleId ||
      !(currentBillingPeriodLabel || hasValue(billingPeriodId))
    ) {
      return;
    }

    const dataAccount = dataListAccount?.find((v) => v.accountId === idAccount);
    const dataCycle = dataListBillingCycle?.find((v) => v.id === cycleId);
    const selectedBillingPeriod = dataListBillingPeriod?.find(
      (item) => String(item?.id) === String(billingPeriodId),
    );

    if (!dataAccount || !dataCycle) {
      return;
    }

    setDropdownLoading((prev) => ({ ...prev, invoice: true }));
    try {
      const params = {
        accountNumber: dataAccount?.accountNumber,
        billingCycle: dataCycle?.period,
        billingPeriod:
          selectedBillingPeriod?.period || currentBillingPeriodLabel,
      };

      await dispatch(getListInvoice({ body: params })).unwrap();
      fetchedRef.current.invoice = true;
    } catch (_error) {
      // Keep retryable when open again.
    } finally {
      setDropdownLoading((prev) => ({ ...prev, invoice: false }));
    }
  }, [
    billingPeriodId,
    currentBillingPeriodLabel,
    cycleId,
    dataListAccount,
    dataListBillingCycle,
    dataListBillingPeriod,
    dispatch,
    idAccount,
  ]);

  // Use Effect
  useEffect(() => {
    if (!idAccount || !dataListAccount || dataListAccount.length === 0) {
      return;
    }

    if (previousHydratedAccountIdRef.current === idAccount) {
      return;
    }

    const dataAccount = dataListAccount.find((v) => v.accountId === idAccount);
    if (!dataAccount) {
      return;
    }

    form.setFieldsValue({
      customerNumber: dataAccount?.customerNumber,
      customerName: dataAccount?.customerName,
      accountNumber: dataAccount?.accountNumber,
      accountName: dataAccount?.accountName,
      serviceAgreementClass: dataAccount?.saClass,
      accountSegment: dataAccount?.accountSegment,
      accountGroupType: dataAccount?.accountGroupType,
      sor: dataAccount?.sor,
      costCenterCode: dataAccount?.costCenterCode,
      costCenterName: dataAccount?.costCenterName,
      meterReadingCode: dataAccount?.meterReadingCode,
    });
    previousHydratedAccountIdRef.current = idAccount;
  }, [dataListAccount, form, idAccount]);

  useEffect(() => {
    const fetchTopMasterData = async () => {
      const requests = [];

      if (
        !fetchedRef.current.topType &&
        (dataListSelectTOP || []).length === 0
      ) {
        requests.push(dispatch(getSelectTOP()).unwrap());
      }

      if (
        !fetchedRef.current.topValue &&
        (dataTermsOfPayment || []).length === 0
      ) {
        requests.push(dispatch(getListTermsOfPayment()).unwrap());
      }

      if (requests.length === 0) {
        fetchedRef.current.topType = true;
        fetchedRef.current.topValue = true;
        return;
      }

      setDropdownLoading((prev) => ({
        ...prev,
        topType: true,
        topValue: true,
      }));

      try {
        await Promise.all(requests);
        fetchedRef.current.topType = true;
        fetchedRef.current.topValue = true;
      } catch (_error) {
        // Keep retryable when request fails.
      } finally {
        setDropdownLoading((prev) => ({
          ...prev,
          topType: false,
          topValue: false,
        }));
      }
    };

    fetchTopMasterData();
  }, [dataListSelectTOP, dataTermsOfPayment, dispatch]);

  useEffect(() => {
    if (idInvoice && idInvoice !== 0) {
      dispatch(getListInvoiceInformation({ id: idInvoice }));
    }
  }, [dispatch, idInvoice]);

  // Set reference invoice number from dataInvoice when available
  useEffect(() => {
    if (dataInvoice?.invoiceNumber && !referenceInvoiceNumber) {
      setReferenceInvoiceNumber(dataInvoice.invoiceNumber);
    }
  }, [dataInvoice?.invoiceNumber, referenceInvoiceNumber]);

  useEffect(() => {
    if (!cycleId || cycleId === 0) {
      form.resetFields(["currentBillingPeriod", "correctionBillingPeriod"]);
      fetchedRef.current.billingPeriod = false;
      return;
    }

    const fetchBillingPeriodData = async () => {
      setDropdownLoading((prev) => ({ ...prev, billingPeriod: true }));
      try {
        await Promise.all([
          dispatch(getListBillingPeriod({ id: cycleId })).unwrap(),
          dispatch(getCurrentBillingPeriod({ cycleId })).unwrap(),
        ]);
        fetchedRef.current.billingPeriod = true;
      } catch (_error) {
        // Keep retryable via dropdown open.
      } finally {
        setDropdownLoading((prev) => ({ ...prev, billingPeriod: false }));
      }
    };

    fetchBillingPeriodData();
  }, [cycleId, dispatch, form]);

  useEffect(() => {
    if (currentBillingPeriodLabel) {
      form.setFieldsValue({ currentBillingPeriod: currentBillingPeriodLabel });
    }
  }, [currentBillingPeriodLabel, form]);

  useEffect(() => {
    if (idAccount && idAccount !== 0) {
      return;
    }

    previousHydratedAccountIdRef.current = undefined;
    setIdInvoice();
    setBillingPeriodId();
    setCycleId();
    fetchedRef.current.invoice = false;
    fetchedRef.current.billingPeriod = false;
    form.resetFields([]);
    form.resetFields([
      "referenceInvoiceNumber",
      "correctionBillingPeriod",
      "billingCycle",
      "customerNumber",
      "customerName",
      "accountNumber",
      "accountName",
      "serviceAgreementClass",
      "accountSegment",
      "accountGroupType",
      "sor",
      "costCenterCode",
      "costCenterName",
      "meterReadingCode",
    ]);
  }, [form, idAccount, setBillingPeriodId, setCycleId, setIdInvoice]);

  //check no need because intermitten error
  // useEffect(() => {
  //   if (billingPeriodId !== 0) {
  //     setIdInvoice();
  //     form.resetFields(["referenceInvoiceNumber"]);
  //   } else if (cycleId !== 0) {
  //     setBillingPeriodId();
  //     setIdInvoice();
  //     form.resetFields(["billingPeriod", "referenceInvoiceNumber"]);
  //   }
  // }, [form, billingPeriodId, cycleId]);

  useEffect(() => {
    if (dataListInvoiceInformation && idInvoice) {
      setDataInvoice(dataListInvoiceInformation);

      const dataTOP = dataListInvoice?.find(
        (item) => item.invoiceNumber === idInvoice,
      );

      const existingTermsOfPayment = form.getFieldValue("termsOfPayment");
      const termOfPaymentValue =
        dataListInvoiceInformation?.termsOfPayment ??
        dataTOP?.termOfPayment ??
        existingTermsOfPayment;

      const termTypeValue = resolveTermType(termOfPaymentValue);
      const termOptionValue =
        termTypeValue === "TOP"
          ? mapTermValueToOptionId(termOfPaymentValue)
          : undefined;

      setValueDdl({ action: "setData", value: termTypeValue });

      form.setFieldsValue({
        termsOfPayment: termOfPaymentValue,
        termType: {
          termValueDdl: termTypeValue,
          termValue:
            termTypeValue === "DATE" && termOfPaymentValue
              ? moment(termOfPaymentValue)
              : termOptionValue,
        },
        rate: dataListInvoiceInformation?.rate,
      });
    } else if (!idInvoice) {
      setDataInvoice({});
      setValueDdl({ action: "clear", value: null });
      form.resetFields(["termsOfPayment", "termType", "rate"]);
    }
  }, [
    dataListInvoice,
    dataListInvoiceInformation,
    form,
    idInvoice,
    mapTermValueToOptionId,
    resolveTermType,
    setDataInvoice,
  ]);

  useEffect(() => {
    if (
      selectedTermType === "TOP" &&
      !selectedTermValue &&
      hasValue(rawTermsOfPayment) &&
      (dataTermsOfPayment || []).length > 0
    ) {
      const optionId = mapTermValueToOptionId(rawTermsOfPayment);
      if (hasValue(optionId)) {
        form.setFieldsValue({
          termType: {
            termValueDdl: "TOP",
            termValue: optionId,
          },
        });
      }
    }
  }, [
    dataTermsOfPayment,
    form,
    mapTermValueToOptionId,
    rawTermsOfPayment,
    selectedTermType,
    selectedTermValue,
  ]);

  useEffect(() => {
    if (hasValue(billingPeriodId)) {
      const findPeriod = dataListBillingPeriod?.find(
        (item) => item?.id === billingPeriodId,
      );
      setRangeDisableDate({
        startDate: findPeriod?.startDate,
        endDate: findPeriod?.endDate,
      });
    } else {
      setRangeDisableDate({});
      setDefaultPicker("");
    }
  }, [billingPeriodId, dataListBillingPeriod, setRangeDisableDate]);

  useEffect(() => {
    if (hasValue(rangeDisableDate?.startDate)) {
      setDefaultPicker(moment(rangeDisableDate?.startDate)?.clone());
      setKeyPicker((prev) => prev + 1);
    }
  }, [rangeDisableDate?.startDate]);

  useEffect(() => {
    const fetchRateAdjustment = async () => {
      if (!selectedRateType || !selectedRateDate) {
        form.setFieldsValue({ rate: undefined });
        return;
      }

      try {
        const response = await dispatch(
          getRateAdjustment({
            rateDate: moment(selectedRateDate).format("YYYY-MM-DD"),
            rateType: selectedRateType,
          }),
        ).unwrap();

        const resolvedRate =
          response?.convertedValue ??
          response?.data?.convertedValue ??
          response?.rate ??
          response?.data?.rate ??
          response?.value;

        form.setFieldsValue({
          rate: hasValue(resolvedRate) ? resolvedRate : undefined,
        });
      } catch (_error) {
        form.setFieldsValue({ rate: undefined });
      }
    };

    fetchRateAdjustment();
  }, [dispatch, form, selectedRateDate, selectedRateType]);

  // Sync transactionDate state from form value (for update mode)
  useEffect(() => {
    const timer = setTimeout(() => {
      const txnDate = form.getFieldValue("transactionDate");
      if (txnDate && !transactionDate) {
        setTransactionDate(txnDate);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [form, transactionDate]);

  const onChangeAccountNumber = (e) => {
    fetchedRef.current.invoice = false;
    fetchedRef.current.billingPeriod = false;
    setIdAccount(e || undefined);
    setIdInvoice();
    setBillingPeriodId();
    setCycleId();
    setReferenceInvoiceNumber(undefined);
    setTransactionDate(null);
    form.resetFields([
      "adjustmentType",
      "referenceInvoiceNumber",
      "currentBillingPeriod",
      "correctionBillingPeriod",
      "billingCycle",
      "currency",
      "documentDate",
      "transactionDate",
      "accountingDate",
      "rate",
      "rateDate",
      "adjustmentReason",
      "remark",
      "termType",
    ]);
    return e;
  };

  const handleChangeInvoice = (e) => {
    setIdInvoice(e || undefined);
    setReferenceInvoiceNumber(e || undefined);
    return e;
  };

  const onChangeBillingCycle = (e) => {
    fetchedRef.current.invoice = false;
    setCycleId(e || undefined);
    setBillingPeriodId();
    setIdInvoice();
    setReferenceInvoiceNumber(undefined);
    setTransactionDate(null);
    form.resetFields([
      "currentBillingPeriod",
      "correctionBillingPeriod",
      "referenceInvoiceNumber",
      "transactionDate",
      "documentDate",
      "accountingDate",
      "rate",
      "rateDate",
    ]);
    return e;
  };

  const onChangeCorrectionBillingPeriod = (e) => {
    fetchedRef.current.invoice = false;
    setBillingPeriodId(e || undefined);
    setIdInvoice();
    setReferenceInvoiceNumber(undefined);
    setTransactionDate(null);
    form.resetFields([
      "referenceInvoiceNumber",
      "transactionDate",
      "documentDate",
      "accountingDate",
      "rate",
      "rateDate",
    ]);
    return e;
  };

  const disabledRangeDate = useCallback(
    (current) => {
      return (
        current < moment(rangeDisableDate?.startDate) ||
        current > moment(rangeDisableDate?.endDate).add(1, "days")
      );
    },
    [rangeDisableDate],
  );

  // Disable dates for document date: must be within billing period AND not after transaction date
  const disabledDocumentDate = useCallback(
    (current) => {
      // First check billing period range
      const outsideBillingPeriod =
        current < moment(rangeDisableDate?.startDate) ||
        current > moment(rangeDisableDate?.endDate).add(1, "days");

      // Then check if after transaction date
      const afterTransactionDate = transactionDate
        ? current > moment(transactionDate).endOf("day")
        : false;

      return outsideBillingPeriod || afterTransactionDate;
    },
    [rangeDisableDate, transactionDate],
  );

  // Disable dates for accounting date: must be on or after transaction date, no end date limit
  const disabledAccountingDate = useCallback(
    (current) => {
      // Only check if before transaction date (no end date limit)
      const beforeTransactionDate = transactionDate
        ? current < moment(transactionDate).startOf("day")
        : true; // Disable all dates if no transaction date selected

      return beforeTransactionDate;
    },
    [transactionDate],
  );

  // Disable dates for rate date: must be on or after billing period start date, no end date limit
  const disabledRateDate = useCallback(
    (current) => {
      // Only check if before billing period start date (no end date limit)
      if (!rangeDisableDate?.startDate) return false;
      return current < moment(rangeDisableDate?.startDate);
    },
    [rangeDisableDate],
  );

  // Handle transaction date change
  const handleTransactionDateChange = (date) => {
    setTransactionDate(date);
    // Re-validate document date and accounting date when transaction date changes
    const currentDocDate = form.getFieldValue("documentDate");
    const currentAccDate = form.getFieldValue("accountingDate");
    if (currentDocDate || currentAccDate) {
      form.validateFields(["documentDate", "accountingDate"]);
    }
  };

  // Handler for Classification Adjustment change
  const onChangeClassification = (value) => {
    setSelectedClassification(value);
    form.setFieldsValue({
      postInvoice: undefined,
    });
    return value;
  };

  // Handler for Post Invoice change
  const onChangePostInvoice = (value) => {
    return value;
  };

  const onChangeSelectTop = (value) => {
    setValueDdl({ action: "change", value });
    form.setFieldsValue({
      termType: {
        ...(form.getFieldValue("termType") || {}),
        termValue: undefined,
      },
    });
    return value;
  };

  const handleRangeDisableTOPDate = useCallback(
    (current) => {
      if (!transactionDate) {
        return false;
      }

      return current < moment(transactionDate).startOf("day");
    },
    [transactionDate],
  );

  const handleDdlOrDate = (selectedType) => {
    switch (selectedType) {
      case "TOP":
        return (
          <SelectComponent
            width={"100%"}
            placeholder="Select Terms of Payment Value"
          >
            {(dataTermsOfPayment || []).map((item, index) => (
              <Select.Option key={index} value={item?.Id}>
                {item?.text}
              </Select.Option>
            ))}
          </SelectComponent>
        );
      case "DATE":
        return (
          <DateComponent
            width={"100%"}
            dateDisable={handleRangeDisableTOPDate}
            placeholder="Select Terms of Payment Date"
          />
        );
      default:
        return <SelectComponent width={"100%"} disabled />;
    }
  };

  return (
    <div>
      {/* Customer Information */}
      <CardContainer header={"Customer Information"}>
        {/* Hidden field untuk accountNumber agar masuk ke payload (tidak ada visible input untuk field ini) */}
        <Form.Item name="accountNumber" hidden>
          <input type="hidden" />
        </Form.Item>

        <div className="w-full grid grid-cols-5 gap-3">
          <Form.Item
            label={"Account Number"}
            name={"accountNumberWithName"}
            rules={[
              {
                required: true,
                message: "Please input your Account Number!",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <SelectComponent
              onChange={onChangeAccountNumber}
              placeholder={"Choose Account Number"}
              disabled={type === "update" ? true : false}
              loading={dropdownLoading.account}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  runLazyFetch("account", getListAccount);
                }
              }}
            >
              {dataListAccount &&
                dataListAccount?.map((data, index) => (
                  <Select.Option value={data.accountId} key={index}>
                    {data.accountNumberWithName}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Customer Number"}
            name={"customerNumber"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>

          <Form.Item
            label={"Customer Name"}
            name={"customerName"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>

          <Form.Item
            label={"Account Name"}
            name={"accountName"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>

          <Form.Item
            label={"Account Segment"}
            name={"accountSegment"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>

          <Form.Item
            label={"Account Group Type"}
            name={"accountGroupType"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>

          <Form.Item label={"SOR"} name={"sor"} style={{ marginBottom: 0 }}>
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>

          <Form.Item
            label={"Cost Center Code"}
            name={"costCenterCode"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>

          <Form.Item
            label={"Cost Center Name"}
            name={"costCenterName"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>

          <Form.Item
            label={"Meter Reading Code"}
            name={"meterReadingCode"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder={"Auto Filled"} disabled={true} />
          </Form.Item>
        </div>
      </CardContainer>

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">
              ADJUSTMENT BILLING INFORMATION
            </p>

            <ButtonComponent
              type={"primary"}
              onClick={onRecalculate}
              loading={loadingRecalculate}
              disabled={disableRecalculate}
              icon={<SVGIcon name="IconRatingReconculate" width={16} />}
            >
              Recalculate
            </ButtonComponent>
          </div>
        }
      >
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item
            label={"Type"}
            name={"adjustmentType"}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please input your Type!" }]}
          >
            <SelectComponent
              placeholder="Choose Type"
              loading={dropdownLoading.type}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  runLazyFetch("type", getListType);
                }
              }}
            >
              {dataListType &&
                dataListType?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Classification Adjustment"}
            name={"classificationAdjustment"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please select Classification Adjustment!",
              },
            ]}
          >
            <SelectComponent
              onChange={onChangeClassification}
              placeholder="Select Classification Adjustment"
              loading={dropdownLoading.classification}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  runLazyFetch("classification", getListClassification);
                }
              }}
            >
              {dataListClassification &&
                dataListClassification?.map((data, index) => (
                  <Select.Option
                    value={data.code || data.id || data.value}
                    key={index}
                  >
                    {data.name || data.text}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Billing Cycle"}
            name={"billingCycle"}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please input your Billing Cycle!" },
            ]}
          >
            <SelectComponent
              onChange={onChangeBillingCycle}
              placeholder="Choose Billing Cycle"
              disabled={!form.getFieldValue().classificationAdjustment}
              loading={dropdownLoading.billingCycle}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  runLazyFetch("billingCycle", getListBillingCycle);
                }
              }}
            >
              {dataListBillingCycle &&
                dataListBillingCycle?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.period}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Current Billing Period"}
            name={"currentBillingPeriod"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input your Current Billing Period!",
              },
            ]}
          >
            <SelectComponent
              placeholder="Current Billing Period"
              disabled={!form.getFieldValue().billingCycle}
              allowClear={false}
            >
              {currentBillingPeriodLabel ? (
                <Select.Option
                  value={currentBillingPeriodLabel}
                  key={currentBillingPeriodLabel}
                >
                  {currentBillingPeriodLabel}
                </Select.Option>
              ) : null}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Correction Billing Period"}
            name={"correctionBillingPeriod"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input your Correction Billing Period!",
              },
            ]}
          >
            <SelectComponent
              onChange={onChangeCorrectionBillingPeriod}
              placeholder="Choose Billing Period"
              loading={dropdownLoading.billingPeriod}
              disabled={
                !form.getFieldValue().billingCycle ||
                !form.getFieldValue().accountNumberWithName
                  ? true
                  : false
              }
              onDropdownVisibleChange={(open) => {
                if (
                  open &&
                  !fetchedRef.current.billingPeriod &&
                  cycleId &&
                  cycleId !== 0
                ) {
                  setDropdownLoading((prev) => ({
                    ...prev,
                    billingPeriod: true,
                  }));
                  Promise.all([
                    dispatch(getListBillingPeriod({ id: cycleId })).unwrap(),
                    dispatch(getCurrentBillingPeriod({ cycleId })).unwrap(),
                  ])
                    .then(() => {
                      fetchedRef.current.billingPeriod = true;
                    })
                    .catch(() => {})
                    .finally(() => {
                      setDropdownLoading((prev) => ({
                        ...prev,
                        billingPeriod: false,
                      }));
                    });
                }
              }}
            >
              {dataListBillingPeriod &&
                dataListBillingPeriod?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.period}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Calculation Type"}
            name={"postInvoice"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please select Calculation Type!",
              },
            ]}
          >
            <SelectComponent
              onChange={onChangePostInvoice}
              placeholder="Select Calculation Type"
              loading={dropdownLoading.calculationType}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  runLazyFetch("calculationType", getListCalculationType);
                }
              }}
            >
              {dataListCalculationType &&
                dataListCalculationType?.map((data, index) => (
                  <Select.Option
                    value={data.id || data.value || data.name || data.text}
                    key={index}
                  >
                    {data.name || data.text}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Invoice Number"}
            name={"referenceInvoiceNumber"}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please input your Invoice Number!" },
            ]}
          >
            <SelectComponent
              onChange={handleChangeInvoice}
              placeholder="Choose Invoice Number"
              loading={dropdownLoading.invoice}
              disabled={
                !form.getFieldValue().billingCycle ||
                !form.getFieldValue().currentBillingPeriod
                  ? true
                  : false
              }
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchInvoiceList();
                }
              }}
            >
              {dataListInvoice &&
                dataListInvoice?.map((data, index) => (
                  <Select.Option value={data.invoiceNumber} key={index}>
                    {data.invoiceNumber}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Currency"}
            name={"currency"}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please input your Currency!" }]}
          >
            <SelectComponent
              placeholder="Choose currency"
              loading={dropdownLoading.currency}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  runLazyFetch("currency", getListCurrency);
                }
              }}
            >
              {dataCurrency &&
                dataCurrency?.map((data, index) => (
                  <Select.Option value={data.text} key={index}>
                    {data.text}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Document Date"}
            name={"documentDate"}
            style={{ marginBottom: 0 }}
            dependencies={["transactionDate"]}
            rules={[
              { required: true, message: "Please input your Document Date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const txnDate = getFieldValue("transactionDate");
                  if (!value || !txnDate) {
                    return Promise.resolve();
                  }
                  if (moment(value).isAfter(moment(txnDate), "day")) {
                    return Promise.reject(
                      new Error(
                        "Document Date cannot be later than Transaction Date!",
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DateComponent
              dateDisable={disabledDocumentDate}
              defaultPickerValue={defaultPicker}
              key={`document-${keyPicker}-${transactionDate}`}
            />
          </Form.Item>

          <Form.Item
            label={"Transaction Date"}
            name={"transactionDate"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input your Transaction Date!",
              },
            ]}
          >
            <DateComponent
              dateDisable={disabledRangeDate}
              defaultPickerValue={defaultPicker}
              key={keyPicker}
              onChange={handleTransactionDateChange}
            />
          </Form.Item>

          <Form.Item
            label={"Accounting Date"}
            name={"accountingDate"}
            style={{ marginBottom: 0 }}
            dependencies={["transactionDate"]}
            rules={[
              { required: true, message: "Please input your Accounting Date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const txnDate = getFieldValue("transactionDate");
                  if (!value || !txnDate) {
                    return Promise.resolve();
                  }
                  if (moment(value).isBefore(moment(txnDate), "day")) {
                    return Promise.reject(
                      new Error(
                        "Accounting Date cannot be earlier than Transaction Date!",
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DateComponent
              dateDisable={disabledAccountingDate}
              defaultPickerValue={defaultPicker}
              key={`accounting-${keyPicker}-${transactionDate}`}
            />
          </Form.Item>

          <Form.Item label={"Term of Payment"} style={{ marginBottom: 0 }}>
            <Input.Group compact>
              <div className="w-1/3">
                <Form.Item
                  name={["termType", "termValueDdl"]}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Please select Terms of Payment Type!",
                    },
                  ]}
                >
                  <SelectComponent
                    onChange={onChangeSelectTop}
                    placeholder="Type"
                    loading={dropdownLoading.topType}
                  >
                    {topTypeOptions.map((item, index) => (
                      <Select.Option value={item.value} key={index}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
              </div>
              <div className="w-2/3">
                <Form.Item
                  name={["termType", "termValue"]}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Please input Terms of Payment Value!",
                    },
                  ]}
                >
                  {valueDdl?.value === "TOP" ? (
                    <SelectComponent
                      width={"100%"}
                      placeholder="Select Terms of Payment Value"
                      loading={dropdownLoading.topValue}
                    >
                      {(dataTermsOfPayment || []).map((item, index) => (
                        <Select.Option
                          key={index}
                          value={
                            item?.Id ||
                            item?.id ||
                            item?.code ||
                            item?.value ||
                            item?.text ||
                            item?.name
                          }
                        >
                          {item?.text}
                        </Select.Option>
                      ))}
                    </SelectComponent>
                  ) : (
                    handleDdlOrDate(valueDdl?.value)
                  )}
                </Form.Item>
              </div>
            </Input.Group>
          </Form.Item>

          <Form.Item
            label={"Adjustment Reason"}
            name={"adjustmentReason"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input your Adjustment Reason!",
              },
            ]}
          >
            <SelectComponent
              placeholder={"Input Adjustment Reason"}
              loading={dropdownLoading.adjustmentReason}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  runLazyFetch("adjustmentReason", getListAdjustmentReason);
                }
              }}
            >
              {dataListAdjustmentReason &&
                dataListAdjustmentReason?.map((data, index) => (
                  <Select.Option value={data.Id} key={index}>
                    {data.text}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Rate Type"}
            name={"rateType"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input your Rate Type!",
              },
            ]}
          >
            <SelectComponent
              placeholder={"Choose Rate Type"}
              loading={dropdownLoading.rateType}
              disabled={
                !form.getFieldValue().referenceInvoiceNumber ? true : false
              }
              onDropdownVisibleChange={(open) => {
                if (open) {
                  runLazyFetch("rateType", getListRateType);
                }
              }}
            >
              {dataListRateType &&
                dataListRateType?.map((data, index) => (
                  <Select.Option value={data.text} key={index}>
                    {data.text}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Rate Date"}
            name={"rateDate"}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "Please input your Rate Date!",
              },
            ]}
          >
            <DateComponent
              dateDisable={disabledRateDate}
              defaultPickerValue={defaultPicker}
              key={`rate-${keyPicker}`}
            />
          </Form.Item>

          <Form.Item label={"Rate"} name={"rate"} style={{ marginBottom: 0 }}>
            <InputComponent placeholder="Auto Filled" disabled={true} />
          </Form.Item>

          <div className="col-span-4">
            <Form.Item
              label={"Remark"}
              name={"remark"}
              className={"w-full"}
              style={{ marginBottom: 0 }}
              rules={[{ required: true, message: "Please input your Remark!" }]}
            >
              <InputComponent
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </Form.Item>
          </div>
        </div>
      </CardContainer>

      {/* Invoice Information */}
      <InvoiceSectionForm data={dataInvoice} type={type} useInformationLayout />

      {/* Adjustment Billing Item Information */}
      <CardContainer header={"BILLING ADJUSTMENT ITEM INFORMATION"}>
        <div className="relative">
          <div
            className={
              hasSuccessfulRecalculate || listDataABI.length > 0
                ? ""
                : "blur-[2px] opacity-60 pointer-events-none select-none"
            }
          >
            <AdjustmentBISectionForm
              type={type}
              listDataABI={listDataABI}
              setListDataABI={setListDataABI}
              invoiceNumber={referenceInvoiceNumber}
              dataInvoice={dataInvoice}
              adjustmentId={adjustmentId}
              showCreateButtonInHeader={false}
              canCreate={canCreateBillingAdjustmentItem}
              createBlockedMessage={
                "Create Adjustment Billing Item is available after recalculate succeeds for Carry Forward or Off Cycle classification type."
              }
              onCreateClick={(handler) => {
                const btn = document.getElementById("create-abi-button");
                if (btn) {
                  btn.onclick = handler;
                }
              }}
            />
          </div>

          {!hasSuccessfulRecalculate && listDataABI.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/95 border border-gray-200 rounded-lg px-6 py-5 text-center shadow-sm max-w-md">
                <p className="text-sm text-gray-700 mb-4">
                  Please recalculate first to display this data.
                </p>
                <ButtonComponent
                  type={"primary"}
                  onClick={onRecalculate}
                  loading={loadingRecalculate}
                  disabled={disableRecalculate}
                  icon={<SVGIcon name="IconRatingReconculate" width={16} />}
                >
                  Recalculate
                </ButtonComponent>
              </div>
            </div>
          )}
        </div>
      </CardContainer>
    </div>
  );
};

export default AdjustmentBillingSectionForm;
