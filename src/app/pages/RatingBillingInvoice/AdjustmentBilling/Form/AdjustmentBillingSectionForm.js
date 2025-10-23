import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, Input, DatePicker } from "antd";
import AdjustmentBISectionForm from "./AdjustmentBISectionForm";
import BaseContainer from "../../../../../components/BaseContainer";
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
  getListItem,
  getListType,
} from "../../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import { currencyFormatting } from "../../../../../utils/formatCurrency";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting, hasValue, renderDateConverter } from "../../../../../utils";
import moment from "moment";

const AdjustmentBillingSectionForm = ({
  type,
  idAccount,
  setIdAccount,
  idInvoice,
  setIdInvoice,
  dataInvoice = {},
  setDataInvoice = () => { },
  form,
  listDataABI = [],
  setListDataABI = () => { },
  adjustmentId,
  cycleId,
  setCycleId,
  billingPeriodId,
  setBillingPeriodId,
  setRangeDisableDate = () => { },
  rangeDisableDate
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
  } = useSelector((state) => state.adjustmentBilling);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [description, setDescription] = useState("");
  const [defaultPicker, setDefaultPicker] = useState("");
  const [keyPicker, setKeyPicker] = useState(0);

  // Use Effect
  useEffect(() => {
    dispatch(getListAccount());
    dispatch(getListType());
    dispatch(getListBillingCycle());
    dispatch(getListAdjustmentReason());
    dispatch(getListCurrency());
  }, [dispatch]);

  useEffect(() => {
    if (idInvoice && idInvoice !== 0) {
      dispatch(getListInvoiceInformation({ id: idInvoice }));
    }
  }, [dispatch, idInvoice]);

  useEffect(() => {
    if (cycleId && cycleId !== 0) {
      dispatch(getListBillingPeriod({ id: cycleId }));
    } else {
      form.resetFields(["billingPeriod"]);
    }
  }, [dispatch, cycleId, form]);

  useEffect(() => {
    if (idAccount && cycleId && billingPeriodId && dataListAccount && dataListBillingCycle && dataListBillingPeriod) {
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
        billingPeriodId
      );
      const params = {
        accountNumber: dataAccount?.accountNumber,
        billingCycle: dataCycle?.period,
        billingPeriod: dataBillingPeriod?.period,
      };

      dispatch(getListInvoice({ body: params }));
    }
  }, [dispatch, idAccount, cycleId, billingPeriodId, dataListAccount, dataListBillingCycle, dataListBillingPeriod]);

  useEffect(() => {
    if (idAccount && idAccount !== 0) {
      const dataAccount = dataListAccount?.filter(
        (v) => v.accountId === idAccount
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
        (item) => item.invoiceNumber === idInvoice
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
      const findPeriod = dataListBillingPeriod?.find(item => item?.id === billingPeriodId);
      setRangeDisableDate({
        startDate: findPeriod?.startDate,
        endDate: findPeriod?.endDate
      })
    }
  }, [billingPeriodId, dataListBillingPeriod, setRangeDisableDate])

  useEffect(() => {
    if (hasValue(rangeDisableDate?.startDate)) {
      setDefaultPicker(moment(rangeDisableDate?.startDate)?.clone())
      setKeyPicker(prev => prev + 1)
    }
  }, [rangeDisableDate?.startDate]);


  const onChangeAccountNumber = (e) => {
    setIdAccount(e || undefined);
    return e;
  };

  const handleChangeInvoice = (e) => {
    setIdInvoice(e || undefined);
    return e;
  };

  const onChangeBillingCycle = (e) => {
    setCycleId(e || undefined);
    setBillingPeriodId();
    setIdInvoice();
    form.resetFields(["billingPeriod", "referenceInvoiceNumber"]);
    return e;
  };



  const onChangeBillingPeriod = (e) => {
    setBillingPeriodId(e || undefined);
    setIdInvoice();
    form.resetFields(["referenceInvoiceNumber"]);
    return e;
  };

  // Sum Total Adjustment IDR
  let dataIDR = listDataABI
    .filter((v) => v.currency === "IDR")
    .map((a) => a.adjustmentAmount);
  const sumIDR = dataIDR.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  // Sum Total Adjustment USD
  let dataUSD = listDataABI
    .filter((v) => v.currency === "USD")
    .map((a) => a.adjustmentAmount);
  const sumUSD = dataUSD.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  // Sum Total Adjustment EQV IDR
  let dataEqvIdr = sumIDR + sumUSD * dataInvoice?.rate

  // Sum Total Adjustment EQV USD
  let dataEqvUSD = sumUSD + sumIDR / dataInvoice?.rate;

  const disabledRangeDate = useCallback((current) => {
    return current < moment(rangeDisableDate?.startDate) || current > moment(rangeDisableDate?.endDate).add(1, 'days')
  }, [rangeDisableDate]);

  

  return (
    <div>
      {/* Customer Information */}
      <BaseContainer header={"Customer Information"}>
        <div className="w-full grid grid-cols-4 gap-4">
          <div className="col-span-4">
            <Form.Item
              label={"Account Number"}
              name={"accountNumberWithName"}
              rules={[
                {
                  required: true,
                  message: "Please input your Account Number!",
                },
              ]}
            >
              <SelectComponent
                onChange={onChangeAccountNumber}
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
          </div>

          <Form.Item label={"Customer Number"} name={"customerNumber"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"Customer Name"} name={"customerName"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"Account Number"} name={"accountNumber"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"Account Name"} name={"accountName"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"Account Segment"} name={"accountSegment"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"Account Group Type"} name={"accountGroupType"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"SOR"} name={"sor"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"Cost Center Code"} name={"costCenterCode"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"Cost Center Name"} name={"costCenterName"}>
            <InputComponent disabled={true} />
          </Form.Item>

          <Form.Item label={"Meter Reading Code"} name={"meterReadingCode"}>
            <InputComponent disabled={true} />
          </Form.Item>
        </div>
      </BaseContainer>

      {/* Invoice Information */}
      <InvoiceSectionForm
        data={dataInvoice}
        listDataABI={listDataABI}
        type={type}
      />

      <BaseContainer header={"ADJUSTMENT BILLING INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-4">
          <Form.Item
            label={"Type"}
            name={"adjustmentType"}
            rules={[{ required: true, message: "Please input your Type!" }]}
          >
            <SelectComponent>
              {dataListType &&
                dataListType?.map((data, index) => (
                  <Select.Option value={data.id} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Billing Cycle"}
            name={"billingCycle"}
            rules={[
              { required: true, message: "Please input your Billing Cycle!" },
            ]}
          >
            <SelectComponent
              onChange={onChangeBillingCycle}
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
            rules={[
              { required: true, message: "Please input your Billing Period!" },
            ]}
          >
            <SelectComponent
              onChange={onChangeBillingPeriod}
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
            rules={[
              { required: true, message: "Please input your Invoice Number!" },
            ]}
          >
            <SelectComponent
              onChange={handleChangeInvoice}
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
            rules={[{ required: true, message: "Please input your Currency!" }]}
          >
            <SelectComponent>
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
            rules={[
              { required: true, message: "Please input your Document Date!" },
            ]}
          >
            <DatePicker format={dateFormatting?.date} style={{
              borderRadius: "6px",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              padding: "4px 12px",
            }}
              className="w-full" />
          </Form.Item>

          <Form.Item
            label={"Transaction Date"}
            name={"transactionDate"}
            rules={[
              {
                required: true,
                message: "Please input your Transaction Date!",
              },
            ]}
          >
            <DateComponent dateDisable={disabledRangeDate} defaultPickerValue={defaultPicker} key={keyPicker} />
          </Form.Item>

          <Form.Item
            label={"Accounting Date"}
            name={"accountingDate"}
            rules={[
              { required: true, message: "Please input your Accounting Date!" },
            ]}
          >
            <DateComponent dateDisable={disabledRangeDate} defaultPickerValue={defaultPicker} key={keyPicker} />
          </Form.Item>

          <div className="col-span-2">
            <Form.Item label={"Terms Of Payment"} name={"termsOfPayment"}>
              <InputComponent disabled={true} />
            </Form.Item>
          </div>

          <div className="col-span-2">
            <Form.Item
              label={"Adjustment Reason"}
              name={"adjustmentReason"}
              rules={[
                {
                  required: true,
                  message: "Please input your Adjustment Reason!",
                },
              ]}
            >
              <SelectComponent>
                {dataListAdjustmentReason &&
                  dataListAdjustmentReason?.map((data, index) => (
                    <Select.Option value={data.Id} key={index}>
                      {data.text}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
          </div>

          <div className="col-span-4">
            <Form.Item
              label={"Remark"}
              name={"remark"}
              className={"w-full"}
              rules={[{ required: true, message: "Please input your Remark!" }]}
            >
              <InputComponent
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={1}
              />
            </Form.Item>
          </div>
        </div>
      </BaseContainer>

      {/* Adjustment Billing Item Information */}
      <BaseContainer header={"Adjustment Billing Item Information"}>
        <AdjustmentBISectionForm
          children={
            <div className="w-full grid grid-cols-4 gap-4">
              <DetailText label={"Total Adjustment IDR"}>
                {sumIDR ? currencyFormatting(sumIDR, "idr") : sumIDR}
              </DetailText>
              <DetailText label={"Total Adjustment USD"}>
                {sumUSD ? currencyFormatting(sumUSD, "idr") : sumUSD}
              </DetailText>
              <DetailText label={"Total Adjustment EQV IDR"}>
                {isNaN(dataEqvIdr) ? 0 : currencyFormatting(dataEqvIdr, "idr")}
              </DetailText>
              <DetailText label={"Total Adjustment EQV USD"}>
                {isNaN(dataEqvUSD) ? 0 : currencyFormatting(dataEqvUSD, "idr")}
              </DetailText>
            </div>
          }
          type={type}
          listDataABI={listDataABI}
          setListDataABI={setListDataABI}
          invoiceNumber={form.getFieldValue().referenceInvoiceNumber}
          dataInvoice={dataInvoice}
          adjustmentId={adjustmentId}
        />
      </BaseContainer>
    </div>
  );
};

export default AdjustmentBillingSectionForm;
