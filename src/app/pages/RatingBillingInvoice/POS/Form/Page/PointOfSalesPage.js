import React, { Fragment, useCallback, useEffect } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import SelectComponent from "../../../../../../components/SelectComponent";
import { Form, Input, Select, Checkbox } from "antd";
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
import CardContainer from "../../../../../../components/CardContainer";

const PointOfSalesPage = ({
  data_dynamic = {},
  form,
  isCostCenterFilled,
  isAccountSegmentFilled,
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
  customerType = "customer",
  defaultData = {},
  onSorChange = () => {},
  onCostCenterChange = () => {},
  onAccountSegmentChange = () => {},
  onMeterReadingCodeChange = () => {},
  data_account_segment = [],
  data_account_group_type = [],
  data_sor_list = [],
  data_cost_center_list = [],
  data_uom_codes = [],
  mergedArrayMrc = [],
  selectedTransactionDate = null,
  setSelectedTransactionDate = () => {},
  selectedInvoiceDate = null,
  setSelectedInvoiceDate = () => {},
  data_account_type = [],
  data_classification_type = [],
}) => {
  const [selectedBilingPeriod, setSelectedBillingPeriod] = useState("");
  const [defaultPicker, setDefaultPicker] = useState("");
  const [keyPicker, setKeyPicker] = useState(0);
  const [genProInv, setGenProInv] = useState(false);

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

  const onChangeSelect = (e) => {
    setValueDdl({
      action: "change",
      value: e,
    });
  };

  const handleRangeDisableInvoiceDate = useCallback(
    (current) => {
      if (selectedTransactionDate) {
        return current < moment(selectedTransactionDate).startOf("day");
      }
      return current < moment(rangeDisableDate?.startDate);
    },
    [rangeDisableDate, selectedTransactionDate],
  );

  const handleRangeDisableTOPDate = useCallback(
    (current) => {
      if (selectedInvoiceDate) {
        return current < moment(selectedInvoiceDate).startOf("day");
      }
      return false;
    },
    [selectedInvoiceDate],
  );

  const listDetailPage = [
    { value: "Detail" },
    { value: "Promo", disabled: true },
  ];

  const [detailPage, setDetailPage] = useState(listDetailPage[0].value);

  const handleDetailPage = (e) => {
    setDetailPage(e.target.value);
  };

  // Render Customer Information berdasarkan customerType
  const renderCustomerInformation = () => {
    if (customerType === "prospective") {
      return (
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px] text-primary">
                PROSPECTIVE CUSTOMER INFORMATION
              </p>
            </div>
          }
        >
          <div className="w-full grid grid-cols-4 gap-1">
            {/* Row 1 */}
            <Form.Item label="Customer Type" style={{ marginBottom: 0 }}>
              <InputComponent
                disabled
                value={
                  customerType === "customer"
                    ? "Customer"
                    : "Prospective Customer"
                }
              />
            </Form.Item>

            <Form.Item
              name="registrationNumber"
              label="Registration Number"
              rules={[
                {
                  message: requiredMessage("Registration Number"),
                  required: true,
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <InputComponent
                placeholder="Enter Registration Number"
                maxLength={16}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="accountNumber"
              label="Account Number"
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled value={accountNumber || "-"} />
            </Form.Item>

            <Form.Item
              name="customerNumber"
              label="Customer Number"
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled value="-" />
            </Form.Item>

            {/* Row 2 */}
            <Form.Item
              name="customerName"
              label="Customer Name"
              rules={[
                { message: requiredMessage("Customer Name"), required: true },
              ]}
              style={{ marginBottom: 0 }}
            >
              <InputComponent placeholder="Enter Customer Name" />
            </Form.Item>

            <Form.Item
              name="accountName"
              label="Account Name"
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled value="-" />
            </Form.Item>

            <div>
              <Form.Item
                name="sor"
                label="SOR"
                rules={[{ message: requiredMessage("SOR"), required: true }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  onChange={onSorChange}
                  disabled={!!defaultData?.sor}
                  placeholder="Select SOR"
                  options={(data_sor_list || []).map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                />
              </Form.Item>
              {!!defaultData?.sor && (
                <Form.Item name="sor" hidden>
                  <Input />
                </Form.Item>
              )}
            </div>

            <div>
              <Form.Item
                name="costcenter"
                label="Cost Center"
                rules={[
                  { message: requiredMessage("Cost Center"), required: true },
                ]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  onChange={(value) => {
                    if (!value || value.length === 0) {
                      form.resetFields(["meterReadingCode"]);
                    }
                    onCostCenterChange(value);
                  }}
                  disabled={
                    !!defaultData?.costcenter &&
                    defaultData.costcenter.length > 0
                  }
                  placeholder="Select Cost Center"
                  options={(data_cost_center_list || []).map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                />
              </Form.Item>
              {!!defaultData?.costcenter &&
                defaultData.costcenter.length > 0 && (
                  <Form.Item name="costcenter" hidden>
                    <Input />
                  </Form.Item>
                )}
            </div>

            <Form.Item
              name="accountSegment"
              label="Account Segment"
              rules={[
                { message: requiredMessage("Account Segment"), required: true },
              ]}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent
                onChange={(value) => {
                  if (!value) {
                    form.resetFields(["accountGroupType"]);
                  }
                  onAccountSegmentChange(value);
                }}
                placeholder="Select Account Segment"
                options={(data_account_segment || []).map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="clasificationType"
              label="Classification Type"
              rules={[
                {
                  message: requiredMessage("Classification Type"),
                  required: true,
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent
                placeholder="Select Classification Type"
                options={(data_classification_type || []).map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="accountType"
              label="Account Type"
              rules={[
                { message: requiredMessage("Account Type"), required: true },
              ]}
              style={{ marginBottom: 0 }}
            >
              <SelectComponent
                placeholder="Select Account Type"
                options={(data_account_type || []).map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="accountGroupType"
              label="Account Group Type"
              style={{ marginBottom: 0 }}
            >
              <SelectComponent
                placeholder="Select Account Group Type"
                disabled={
                  !data_account_group_type ||
                  data_account_group_type.length === 0 ||
                  !isAccountSegmentFilled
                }
                options={(data_account_group_type || []).map((item) => ({
                  label: item?.glbValue || item?.name,
                  value: item?.glbTypeValId,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="meterReadingCode"
              label="Meter Reading Code"
              style={{ marginBottom: 0 }}
            >
              <SelectComponent
                onChange={onMeterReadingCodeChange}
                disabled={!mergedArrayMrc || mergedArrayMrc.length === 0}
                placeholder="Select Meter Reading Code"
                options={(mergedArrayMrc || []).map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { message: requiredMessage("Email"), required: true },
                { type: "email", message: "Please enter a valid email" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <InputComponent placeholder="Enter Email" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { message: requiredMessage("Phone Number"), required: true },
              ]}
              style={{ marginBottom: 0 }}
            >
              <InputComponent placeholder="Enter Phone Number" maxLength={15} />
            </Form.Item>
          </div>
        </CardContainer>
      );
    } else {
      return (
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px] text-primary">
                CUSTOMER INFORMATION
              </p>
            </div>
          }
        >
          <div className="w-full grid grid-cols-5 gap-1">
            <Form.Item label={"Customer Type"} style={{ marginBottom: 0 }}>
              <InputComponent
                disabled
                value={
                  customerType === "customer"
                    ? "Customer"
                    : "Prospective Customer"
                }
              />
            </Form.Item>
            <Form.Item
              name={"accountNumber"}
              label={"Account Number"}
              rules={[
                { message: requiredMessage("Account Number"), required: true },
              ]}
              style={{ marginBottom: 0 }}
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
            <Form.Item
              name={"customerNumber"}
              label={"Customer Number"}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled />
            </Form.Item>
            <Form.Item
              name={"customerName"}
              label={"Customer Name"}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled />
            </Form.Item>
            <Form.Item
              name={"accountName"}
              label={"Account Name"}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled />
            </Form.Item>
            <Form.Item
              name={"accountSegment"}
              label={"Account Segment"}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled />
            </Form.Item>

            <Form.Item
              name={"clasificationType"}
              label={"Classification Type"}
              style={{ marginBottom: 0 }}
            >
              <InputComponent disabled />
            </Form.Item>

            <Form.Item
              name={"accountType"}
              label={"Account Type"}
              style={{ marginBottom: 0 }}
            >
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
            <Form.Item name={"costcenter"} label={"Cost Center"}>
              <InputComponent disabled />
            </Form.Item>
            <Form.Item name={"meterReadingCode"} label={"Meter Reading Code"}>
              <InputComponent disabled />
            </Form.Item>
          </div>
        </CardContainer>
      );
    }
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
            dataUomCodes={data_uom_codes}
            customerType={customerType}
            data_globalCurrency={data_globalCurrency}
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
            dataUomCodes={data_uom_codes}
            customerType={customerType}
          />
        );
    }
  };

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
        return (
          <DateComponent
            width={"100%"}
            dateDisable={handleRangeDisableTOPDate}
            placeholder="Select Terms of Payment Date"
          />
        );
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

  // const handleRangeDisableInvoiceDate = useCallback(
  //   (current) => {
  //     return current < moment(rangeDisableDate?.startDate);
  //   },
  //   [rangeDisableDate],
  // );

  return (
    <Fragment>
      {renderCustomerInformation()}

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">
              BILLING DATE INFORMATION
            </p>
          </div>
        }
      >
        <div className="w-full grid grid-cols-5 gap-2">
          <Form.Item
            name={"billingCycle"}
            label={"Billing Cycle"}
            rules={[
              { message: requiredMessage("Billing Cycle"), required: true },
            ]}
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
          >
            <DateComponent
              dateDisable={handleRangeDisable}
              defaultPickerValue={defaultPicker}
              key={keyPicker}
              onChange={(date) => {
                setSelectedTransactionDate(date);
                // Reset invoice date jika lebih kecil dari transaction date baru
                const currentInvoiceDate = form.getFieldValue("invoiceDate");
                if (
                  currentInvoiceDate &&
                  date &&
                  moment(currentInvoiceDate).isBefore(moment(date), "day")
                ) {
                  form.setFieldsValue({ invoiceDate: null });
                  setSelectedInvoiceDate(null);
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name={"invoiceDate"}
            label={"Invoice Date"}
            rules={[
              { message: requiredMessage("Invoice Date"), required: true },
            ]}
            style={{ marginBottom: 0 }}
          >
            <DateComponent
              disabled={data.length > 0}
              onChange={(date) => {
                setTransactionDate(date);
                setSelectedInvoiceDate(date);
                // Reset TOP date jika lebih kecil dari invoice date baru
                const currentTOPValue = form.getFieldValue([
                  "termType",
                  "termValue",
                ]);
                if (
                  currentTOPValue &&
                  moment.isMoment(currentTOPValue) &&
                  date &&
                  moment(currentTOPValue).isBefore(moment(date), "day")
                ) {
                  form.setFieldsValue({
                    termType: {
                      ...form.getFieldValue("termType"),
                      termValue: null,
                    },
                  });
                }
              }}
              dateDisable={handleRangeDisableInvoiceDate}
              defaultPickerValue={defaultPicker}
              key={keyPicker}
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
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
          <div className="col-span-5">
            <Form.Item
              name={"remark"}
              label={"Remark"}
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                  message: requiredMessage("Remark"),
                },
              ]}
            >
              <InputComponent type="textarea" rows={3} />
            </Form.Item>
          </div>
          <div className="col-span-5">
            <Form.Item
              name={"genProInv"}
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox onChange={(e) => setGenProInv(e.target.checked)}>
                Generate Proforma Invoice
              </Checkbox>
            </Form.Item>
          </div>
        </div>
      </CardContainer>

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">
              POINT OF SALES DETAIL INFORMATION
            </p>
          </div>
        }
      >
        <RadioTabs data={listDetailPage} onChange={handleDetailPage} />
        <div className={"w-full"}>{renderSection()}</div>
      </CardContainer>
    </Fragment>
  );
};

export default PointOfSalesPage;
