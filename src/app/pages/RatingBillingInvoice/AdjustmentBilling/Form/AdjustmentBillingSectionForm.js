import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, DatePicker } from "antd";
import AdjustmentBISectionForm from "./AdjustmentBISectionForm";
import CardContainer from "../../../../../components/CardContainer";
import SelectComponent from "../../../../../components/SelectComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import InvoiceSectionForm from "./InvoiceSectionForm";
import {
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
  getListPostInvoice,
  getListOnDemand,
} from "../../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import { dateFormatting, hasValue } from "../../../../../utils";
import moment from "moment";

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
}) => {
  // Selector
  const {
    dataListAccount,
    dataListType,
    dataListBillingCycle,
    dataListBillingPeriod,
    dataListInvoice,
    dataListInvoiceInformation,
    dataListAdjustmentReason,
    dataCurrency,
    dataListRateType,
    dataListClassification,
    dataListPostInvoice,
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

  // Use Effect
  useEffect(() => {
    dispatch(getListAccount());
    dispatch(getListType());
    dispatch(getListBillingCycle());
    dispatch(getListAdjustmentReason());
    dispatch(getListCurrency());
    dispatch(getListRateType());
    dispatch(getListClassification());
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
    } else {
      form.resetFields(["billingPeriod"]);
    }
  }, [dispatch, cycleId, form]);

  useEffect(() => {
    if (
      idAccount &&
      cycleId &&
      billingPeriodId &&
      dataListAccount &&
      dataListBillingCycle &&
      dataListBillingPeriod
    ) {
      const getFilteredData = (dataList, id) => {
        return dataList?.find((v) => v.id === id);
      };

      const getFilteredDataCustomer = (dataList, id) => {
        return dataList?.find((v) => v.accountId === id);
      };

      const dataAccount = getFilteredDataCustomer(dataListAccount, idAccount);
      const dataCycle = getFilteredData(dataListBillingCycle, cycleId);
      const dataBillingPeriod = getFilteredData(
        dataListBillingPeriod,
        billingPeriodId,
      );
      const params = {
        accountNumber: dataAccount?.accountNumber,
        billingCycle: dataCycle?.period,
        billingPeriod: dataBillingPeriod?.period,
      };

      dispatch(getListInvoice({ body: params }));
    }
  }, [
    dispatch,
    idAccount,
    cycleId,
    billingPeriodId,
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
        "billingPeriod",
        "billingCycle",
        "currency",
        "documentDate",
        "transactionDate",
        "accountingDate",
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
        "billingPeriod",
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
  }, [idAccount]);

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
      });
    } else {
      setDataInvoice({});
      form.resetFields(["termsOfPayment"]);
    }
  }, [dataListInvoiceInformation, idInvoice]);

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
      "billingPeriod",
      "referenceInvoiceNumber",
      "transactionDate",
      "documentDate",
      "accountingDate",
      "rateDate",
    ]);
    return e;
  };

  const onChangeBillingPeriod = (e) => {
    setBillingPeriodId(e || undefined);
    setIdInvoice();
    setReferenceInvoiceNumber(undefined);
    setTransactionDate(null);
    form.resetFields([
      "referenceInvoiceNumber",
      "transactionDate",
      "documentDate",
      "accountingDate",
      "rateDate",
    ]);
    return e;
  };

  // Sum Total Adjustment IDR
  let dataIDR = listDataABI
    .filter((v) => v.currency === "IDR")
    .map((a) => a.adjustmentAmount);
  const sumIDR = dataIDR.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  // Sum Total Adjustment USD
  let dataUSD = listDataABI
    .filter((v) => v.currency === "USD")
    .map((a) => a.adjustmentAmount);
  const sumUSD = dataUSD.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  // Sum Total Adjustment EQV IDR
  let dataEqvIdr = sumIDR + sumUSD * dataInvoice?.rate;

  // Sum Total Adjustment EQV USD
  let dataEqvUSD = sumUSD + sumIDR / dataInvoice?.rate;

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

  // Disable dates for accounting date: must be within billing period AND not after transaction date
  const disabledAccountingDate = useCallback(
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
      <CardContainer subHeader={"Customer Information"}>
        {/* Hidden field untuk accountNumber agar masuk ke payload (tidak ada visible input untuk field ini) */}
        <Form.Item name="accountNumber" hidden>
          <input type="hidden" />
        </Form.Item>

        <div className="w-full grid grid-cols-4 gap-3">
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

      <CardContainer subHeader={"ADJUSTMENT BILLING INFORMATION"}>
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

          {selectedClassification === "Post Invoice" && (
            <Form.Item
              label={"Post Invoice"}
              name={"postInvoice"}
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                  message: "Please select Post Invoice!",
                },
              ]}
            >
              <SelectComponent
                onChange={onChangePostInvoice}
                placeholder="Select Post Invoice"
              >
                {dataListPostInvoice &&
                  dataListPostInvoice?.map((data, index) => (
                    <Select.Option value={data.name || data.text} key={index}>
                      {data.name || data.text}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
          )}

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
              disabled={
                !form.getFieldValue().accountNumberWithName ? true : false
              }
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
            label={"Billing Period"}
            name={"billingPeriod"}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please input your Billing Period!" },
            ]}
          >
            <SelectComponent
              onChange={onChangeBillingPeriod}
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
                !form.getFieldValue().accountNumberWithName ||
                !form.getFieldValue().billingCycle ||
                !form.getFieldValue().billingPeriod
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
            label={"Terms Of Payment"}
            name={"termsOfPayment"}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder="Choose Type TOP" disabled={true} />
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
              dateDisable={disabledRangeDate}
              defaultPickerValue={defaultPicker}
              key={keyPicker}
            />
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
          onCreateClick={(handler) => {
            const btn = document.getElementById("create-abi-button");
            if (btn) {
              btn.onclick = handler;
            }
          }}
        />
      </CardContainer>

      {/* Invoice Information */}
      <InvoiceSectionForm
        data={dataInvoice}
        listDataABI={listDataABI}
        type={type}
      />
    </div>
  );
};

export default AdjustmentBillingSectionForm;
