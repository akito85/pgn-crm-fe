import React, { Fragment, useCallback, useEffect } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import SelectComponent from "../../../../../../components/SelectComponent";
import { DatePicker, Form, Input, Select } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import { hasValue, requiredMessage } from "../../../../../../utils";
import DateComponent from "../../../../../../components/DateComponent";
import { useState } from "react";
import DetailText from "../../../../../../components/DetailText";
import RadioTabs from "../../../../../../components/RadioTabs";
import PointOfSalesPageDetailPOS from "./PointOfSalesPageDetailPOS";
import { currencyFormatting } from "../../../../../../utils/formatCurrency";
import { renderDate } from "../../Utils";
import moment from "moment";

const PointOfSalesPage = ({
  data_dynamic = {},
  data = [],
  setData = () => {},
  data_billingCycle,
  setDataBillingCycle = () => {},
  data_globalType = [],
  data_globalBillingCycle = [],
  data_globalBillingPeriod = [],
  data_globalCurrency = [],
  setCurrency = () => {},
  data_accountNumber = [],
  data_termsOfPayment = [],
  setAccountNumber = () => {},
  dispatch = () => {},
  valueDdl = null,
  setValueDdl = () => {},
  data_globalProduct = [],
  data_globalBilling = [],
  data_globalTermsOfPaymentValue = [],
  setTransactionDate = () => {},
  dataMissing = [],
  dataPriority = [],
  accountNumber,
  currency,
  transactionDate,
  idPos,
  setRangeDisableDate = () => {},
  rangeDisableDate,
}) => {
  const [selectedBilingPeriod, setSelectedBillingPeriod] = useState("");
  const [defaultPicker, setDefaultPicker] = useState("");
  const [keyPicker, setKeyPicker] = useState(0);

  useEffect(() => {
    if (hasValue(selectedBilingPeriod)) {
      const findRange = data_globalBillingPeriod?.find(
        (item) => item?.id === selectedBilingPeriod,
      );

      setRangeDisableDate(findRange);
    }
  }, [data_globalBillingPeriod, selectedBilingPeriod, setRangeDisableDate]);

  useEffect(() => {
    if (hasValue(rangeDisableDate?.startDate)) {
      setDefaultPicker(moment(rangeDisableDate?.startDate)?.clone());
      setKeyPicker((prev) => prev + 1);
    }
  }, [rangeDisableDate?.startDate]);

  // console.log(valueDdl, "valueDdl")
  const onChangeSelect = (e) => {
    // console.log({
    //   action: "change",
    //   value: e,
    // })
    setValueDdl({
      action: "change",
      value: e,
    });
  };

  const listDetailPage = [
    { value: "Detail" },
    { value: "Promo", disabled: true },
  ];

  const [detailPage, setDetailPage] = useState(listDetailPage[0].value);

  const handleDetailPage = (e) => {
    setDetailPage(e.target.value);
  };

  const renderSection = () => {
    switch (detailPage) {
      case listDetailPage[0].value:
        return (
          <PointOfSalesPageDetailPOS
            dispatch={dispatch}
            data={data}
            setData={setData}
            dataType={data_globalType}
            dataItemBilling={data_globalBilling}
            dataItemProduct={data_globalProduct}
            dataMissing={dataMissing}
            dataPriority={dataPriority}
            accountNumber={accountNumber}
            currency={currency}
            transactionDate={transactionDate}
            idPos={idPos}
          />
        );
      case listDetailPage[1].value:
        return <></>;
      default:
        return (
          <PointOfSalesPageDetailPOS
            dispatch={dispatch}
            data={data}
            setData={setData}
            dataType={data_globalType}
            dataItemBilling={data_globalBilling}
            dataItemProduct={data_globalProduct}
            dataMissing={dataMissing}
            dataPriority={dataPriority}
            accountNumber={accountNumber}
            currency={currency}
            transactionDate={transactionDate}
          />
        );
    }
  };

  // console.log(data_dynamic, "data_dynamic");
  const handleDdlOrDate = (e) => {
    switch (e) {
      case "TOP":
        return (
          <SelectComponent width={"100%"}>
            {(data_globalTermsOfPaymentValue || [])?.map((item) => (
              <Select.Option key={item.Id} value={item.Id}>
                {item.text}
              </Select.Option>
            ))}
          </SelectComponent>
        );
      case "DATE":
        return <DateComponent width={"100%"} />;
      default:
        return (
          <SelectComponent width={"100%"} disabled>
            {[]?.map((item) => (
              <Select.Option key={item.Id} value={item.Id}>
                {item.text}
              </Select.Option>
            ))}
          </SelectComponent>
        );
    }
  };

  const handleRangeDisable = useCallback(
    (current) => {
      return (
        current < moment(rangeDisableDate?.startDate) ||
        current > moment(rangeDisableDate?.endDate).add(1, "days")
      );
    },
    [rangeDisableDate],
  );

  const handleRangeDisableInvoiceDate = useCallback(
    (current) => {
      return current < moment(rangeDisableDate?.startDate);
    },
    [rangeDisableDate],
  );

  return (
    <Fragment>
      <BaseContainer header={"CUSTOMER INFORMATION"}>
        <Form.Item
          name={"accountNumber"}
          label={"Account Number"}
          rules={[
            { message: requiredMessage("Account Number"), required: true },
          ]}
        >
          <SelectComponent onChange={(e) => setAccountNumber(e)}>
            {(data_accountNumber || [])?.map((item) => (
              <Select.Option
                key={item.accountNumber}
                value={item.accountNumber}
              >
                {item.accountNumberWithName}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item name={"customerNumber"} label={"Customer Number"}>
            <InputComponent disabled />
          </Form.Item>
          <Form.Item name={"customerName"} label={"Customer Name"}>
            <InputComponent disabled />
          </Form.Item>
          <Form.Item name={"accountNumber"} label={"Account Number"}>
            <InputComponent disabled />
          </Form.Item>
          <Form.Item name={"accountName"} label={"Account Name"}>
            <InputComponent disabled />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item name={"accountSegment"} label={"Account Segment"}>
            <InputComponent disabled />
          </Form.Item>
          <Form.Item
            name={"accountGroupType"}
            label={"Account Group Type"}
            className="no-margin-form"
          >
            <InputComponent disabled />
          </Form.Item>
          <Form.Item name={"sor"} label={"SOR"}>
            <InputComponent disabled />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-4 gap-3">
          <Form.Item name={"costCenterCode"} label={"Cost Center Code"}>
            <InputComponent disabled />
          </Form.Item>
          <Form.Item name={"costCenterName"} label={"Cost Center Name"}>
            <InputComponent disabled />
          </Form.Item>
          <Form.Item name={"meterReadingCode"} label={"Meter Reading Code"}>
            <InputComponent disabled />
          </Form.Item>
        </div>

        <div className="text-primary text-xs font-bold uppercase pt-3 pb-5">
          BILLING DATE INFORMATION
        </div>

        <div className="w-full grid grid-cols-3 gap-3">
          <Form.Item
            name={"billingCycle"}
            label={"Billing Cycle"}
            rules={[
              { message: requiredMessage("Billing Cycle"), required: true },
            ]}
          >
            <SelectComponent onChange={(e) => setDataBillingCycle(e)}>
              {(data_globalBillingCycle || [])?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            name={"billingPeriod"}
            label={"Billing Period"}
            rules={[
              { message: requiredMessage("Billing Period"), required: true },
            ]}
          >
            <SelectComponent
              disabled={data_billingCycle ? false : true}
              onChange={(e) => setSelectedBillingPeriod(e)}
            >
              {(data_globalBillingPeriod || [])?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            name={"currency"}
            label={"Currency"}
            rules={[{ message: requiredMessage("Currency"), required: true }]}
          >
            <SelectComponent
              onChange={(e) => setCurrency(e)}
              disabled={data.length > 0}
            >
              {(data_globalCurrency || [])?.map((item) => (
                <Select.Option key={item.Id} value={item.Id}>
                  {item.text}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            name={"transactionDate"}
            label={"Transaction Date"}
            rules={[
              { message: requiredMessage("Transaction Date"), required: true },
            ]}
          >
            <DateComponent
              dateDisable={handleRangeDisable}
              defaultPickerValue={defaultPicker}
              key={keyPicker}
            />
          </Form.Item>
          <Form.Item
            name={"invoiceDate"}
            label={"Invoice Date"}
            rules={[
              { message: requiredMessage("Invoice Date"), required: true },
            ]}
          >
            <DateComponent
              disabled={data.length > 0}
              onChange={setTransactionDate}
              dateDisable={handleRangeDisableInvoiceDate}
              defaultPickerValue={defaultPicker}
              key={keyPicker}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                Terms Of Payment{" "}
                <span className={"pl-1"} style={{ color: "red" }}>
                  *
                </span>
              </>
            }
          >
            <div className="flex flex-row w-full">
              <Input.Group compact>
                <div className="w-2/3">
                  <Form.Item
                    name={["termType", "termValueDdl"]}
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: requiredMessage("Terms Of Payment Type"),
                      },
                    ]}
                  >
                    <SelectComponent onChange={(e) => onChangeSelect(e)}>
                      {(data_termsOfPayment || [])?.map((item, index) => (
                        <Select.Option key={index} value={item.code}>
                          {item.text}
                        </Select.Option>
                      ))}
                    </SelectComponent>
                  </Form.Item>
                </div>
                <div className="w-full">
                  <Form.Item
                    name={["termType", "termValue"]}
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: requiredMessage("Terms Of Payment Value"),
                      },
                    ]}
                  >
                    {handleDdlOrDate(valueDdl?.value)}
                  </Form.Item>
                </div>
              </Input.Group>
            </div>
          </Form.Item>
          <div className="col-span-3">
            <Form.Item
              name={"remark"}
              label={"Remark"}
              rules={[
                {
                  required: true,
                  message: requiredMessage("Remark"),
                },
              ]}
            >
              <InputComponent type="textarea" rows={1} />
            </Form.Item>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer header={"POINT OF SALES INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label="Total Amount IDR">
            {currencyFormatting(data_dynamic?.totalAmountIdr || 0, "idr")}
          </DetailText>
          <DetailText label="Total Amount USD">
            {currencyFormatting(data_dynamic?.totalAmountUsd || 0, "usd")}
          </DetailText>
          <DetailText label="Amount IDR">
            {currencyFormatting(data_dynamic?.amountIdr || 0, "idr")}
          </DetailText>
          <DetailText label="Amount USD">
            {currencyFormatting(data_dynamic?.amountUsd || 0, "usd")}
          </DetailText>
          <DetailText label="Discount IDR">
            {currencyFormatting(data_dynamic?.discountAmountIdr || 0, "idr")}
          </DetailText>
          <DetailText label="Discount USD">
            {currencyFormatting(data_dynamic?.discountAmountUsd || 0, "usd")}
          </DetailText>

          {/* new */}
          <DetailText label="Tax Basis IDR">
            {currencyFormatting(data_dynamic?.taxBasisIdr || 0, "idr")}
          </DetailText>
          <DetailText label="Tax Basis USD">
            {currencyFormatting(data_dynamic?.taxBasisUsd || 0, "idr")}
          </DetailText>

          {/* <DetailText label="Tax Basis">
            {currencyFormatting(data_dynamic?.taxBasis || 0, "idr")}
          </DetailText> */}

          <DetailText label="Tax Basis Eqv IDR">
            {currencyFormatting(data_dynamic?.taxBasisEqvIdr || 0, "idr")}
          </DetailText>
          <DetailText label="VAT IDR">
            {currencyFormatting(data_dynamic?.vatIdr || 0, "idr")}
          </DetailText>
          <DetailText label="VAT USD">
            {currencyFormatting(data_dynamic?.vatUsd || 0, "idr")}
          </DetailText>
          <DetailText label="VAT Eqv IDR">
            {currencyFormatting(data_dynamic?.vatEqvIdr || 0, "idr")}
          </DetailText>
          <DetailText label="Witholding Tax">
            {currencyFormatting(data_dynamic?.withholdingTax || 0, "idr")}
          </DetailText>
          <DetailText label="Rate Type">{data_dynamic?.rateType}</DetailText>
          <DetailText label="Rate Date">
            {renderDate(data_dynamic?.rateDate)}
          </DetailText>
          <DetailText label="Rate">{data_dynamic?.rate}</DetailText>
          <DetailText label="Tax Rate Type">
            {data_dynamic?.taxRateType}
          </DetailText>
          <DetailText label="Tax Rate Date">
            {renderDate(data_dynamic?.taxRateDate)}
          </DetailText>
          <DetailText label="Tax Rate">{data_dynamic?.taxRate}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer
        header={"POINT OF SALES DETAIL INFORMATION"}
        type="tabs"
        element={
          <RadioTabs data={listDetailPage} onChange={handleDetailPage} />
        }
      >
        <div className={"w-full"}>{renderSection()}</div>
      </BaseContainer>
    </Fragment>
  );
};

export default PointOfSalesPage;
