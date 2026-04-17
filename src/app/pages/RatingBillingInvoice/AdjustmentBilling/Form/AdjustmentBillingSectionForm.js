import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select } from "antd";
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
  getListClassification,
  getListCalculationType,
  getListPostInvoice,
  getListOnDemand,
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
  selectedPostInvoice,
  setSelectedPostInvoice = () => {},
  onRecalculate = () => {},
  loadingRecalculate = false,
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
    dataListOnDemand,
  } = useSelector((state) => state.adjustmentBilling);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");
  const [defaultPicker, setDefaultPicker] = useState("");
  const [keyPicker, setKeyPicker] = useState(0);
  const [referenceInvoiceNumber, setReferenceInvoiceNumber] = useState();
  const [transactionDate, setTransactionDate] = useState(null);

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

  // Use Effect
  useEffect(() => {
    dispatch(getListAccount());
    dispatch(getListType());
    dispatch(getListBillingCycle());
    dispatch(getListAdjustmentReason());
    dispatch(getListCurrency());
    dispatch(getListRateType());
    dispatch(getListClassification());
    dispatch(getListCalculationType());
  }, [dispatch]);

  // Fetch post invoice list when classification is "Post Invoice"
  useEffect(() => {
    if (selectedClassification === "Post Invoice") {
      dispatch(getListPostInvoice());
    }
  }, [dispatch, selectedClassification]);

  // Fetch on demand list when post invoice is "On Demand"
  useEffect(() => {
    if (selectedPostInvoice === "On Demand") {
      dispatch(getListOnDemand());
    }
  }, [dispatch, selectedPostInvoice]);

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
    if (cycleId && cycleId !== 0) {
      dispatch(getListBillingPeriod({ id: cycleId }));
      dispatch(getCurrentBillingPeriod({ cycleId }));
    } else {
      form.resetFields(["currentBillingPeriod", "correctionBillingPeriod"]);
    }
  }, [dispatch, cycleId, form]);

  useEffect(() => {
    if (currentBillingPeriodLabel) {
      form.setFieldsValue({ currentBillingPeriod: currentBillingPeriodLabel });
    }
  }, [currentBillingPeriodLabel, form]);

  useEffect(() => {
    if (
      idAccount &&
      cycleId &&
      dataListAccount &&
      dataListBillingCycle &&
      (currentBillingPeriodLabel || hasValue(billingPeriodId))
    ) {
      const getFilteredData = (dataList, id) => {
        return dataList?.find((v) => v.id === id);
      };

      const getFilteredDataCustomer = (dataList, id) => {
        return dataList?.find((v) => v.accountId === id);
      };

      const dataAccount = getFilteredDataCustomer(dataListAccount, idAccount);
      const dataCycle = getFilteredData(dataListBillingCycle, cycleId);
      const selectedBillingPeriod = dataListBillingPeriod?.find(
        (item) => String(item?.id) === String(billingPeriodId),
      );

      const params = {
        accountNumber: dataAccount?.accountNumber,
        billingCycle: dataCycle?.period,
        billingPeriod:
          selectedBillingPeriod?.period || currentBillingPeriodLabel,
      };

      dispatch(getListInvoice({ body: params }));
    }
  }, [
    dispatch,
    idAccount,
    cycleId,
    billingPeriodId,
    currentBillingPeriodLabel,
    dataListAccount,
    dataListBillingCycle,
    dataListBillingPeriod,
  ]);

  useEffect(() => {
    if (idAccount && idAccount !== 0) {
      const dataAccount = dataListAccount?.filter(
        (v) => v.accountId === idAccount,
      )[0];

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
      form.resetFields([
        "adjustmentType",
        "referenceInvoiceNumber",
        "correctionBillingPeriod",
        "billingCycle",
        "currency",
        "documentDate",
        "transactionDate",
        "accountingDate",
        "rate",
        "adjustmentReason",
        "remark",
      ]);
    } else {
      setIdInvoice();
      setBillingPeriodId();
      setCycleId();
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
    }
  }, [
    dataListAccount,
    form,
    idAccount,
    setBillingPeriodId,
    setCycleId,
    setIdInvoice,
  ]);

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

      form.setFieldsValue({
        termsOfPayment: dataTOP?.termOfPayment,
        rate: dataListInvoiceInformation?.rate,
      });
    } else {
      setDataInvoice({});
      form.resetFields(["termsOfPayment", "rate"]);
    }
  }, [
    dataListInvoice,
    dataListInvoiceInformation,
    form,
    idInvoice,
    setDataInvoice,
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
    setIdAccount(e || undefined);
    return e;
  };

  const handleChangeInvoice = (e) => {
    setIdInvoice(e || undefined);
    setReferenceInvoiceNumber(e || undefined);
    return e;
  };

  const onChangeBillingCycle = (e) => {
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
    setSelectedPostInvoice(undefined);
    form.setFieldsValue({
      postInvoice: undefined,
      onDemand: undefined,
    });
    return value;
  };

  // Handler for Post Invoice change
  const onChangePostInvoice = (value) => {
    setSelectedPostInvoice(value);
    form.setFieldsValue({
      onDemand: undefined,
    });
    return value;
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
            <SelectComponent placeholder="Choose Type">
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
            >
              {dataListClassification &&
                dataListClassification?.map((data, index) => (
                  <Select.Option value={data.name || data.text} key={index}>
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
              disabled={
                !form.getFieldValue().billingCycle ||
                !form.getFieldValue().accountNumberWithName
                  ? true
                  : false
              }
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
            >
              {dataListCalculationType &&
                dataListCalculationType?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          {selectedPostInvoice === "On Demand" && (
            <Form.Item
              label={"On Demand"}
              name={"onDemand"}
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                  message: "Please select On Demand!",
                },
              ]}
            >
              <SelectComponent placeholder="Select On Demand">
                {dataListOnDemand &&
                  dataListOnDemand?.map((data, index) => (
                    <Select.Option value={data.name || data.text} key={index}>
                      {data.name || data.text}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
          )}

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
              disabled={
                !form.getFieldValue().billingCycle ||
                !form.getFieldValue().currentBillingPeriod
                  ? true
                  : false
              }
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
            <SelectComponent placeholder="Choose currency">
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
                  if (moment(value).isAfter(moment(txnDate), "day")) {
                    return Promise.reject(
                      new Error(
                        "Accounting Date cannot be later than Transaction Date!",
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

          <Form.Item
            label={"Term of Payment"}
            name={"termsOfPayment"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder="Choose Type TOP" disabled={true} />
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
            <SelectComponent placeholder={"Input Adjustment Reason"}>
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
              disabled={
                !form.getFieldValue().referenceInvoiceNumber ? true : false
              }
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
      </CardContainer>
    </div>
  );
};

export default AdjustmentBillingSectionForm;
