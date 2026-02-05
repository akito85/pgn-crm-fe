import { Checkbox, DatePicker, Form, Input, InputNumber, Select } from "antd";
import moment from "moment";
import React, { useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
} from "../../../../../utils";
import AllocationSection from "../Table/AllocationSection";
import {
  getAccountDDL,
  getAccountNumberDDL,
  getAllAccountNumberDDL,
  resetDataAccountNumber,
  getCusNumberDDL,
  getAccountNumberByTypeDDL,
  getUnifiedCreateReceiptDdl,
} from "../../../../../redux/slices/receipt_collection/receipt";
import { useDispatch } from "react-redux";

const CreateReceiptForm = ({
  cusNumb,
  setCusNumb,
  colAgentDDL,
  cusNumberDDL,
  payGatewayDDL,
  payTypeDDL,
  payDeliveryDDL,
  currencyDDL,
  bankDDL,
  payMethodDDL,
  rateTypeDDL,
  setStoredData = () => { },
  storedData,
  dataTable,
  setDataTable = () => { },
  amount,
  setAmount = () => { },
  totalAllocationAmount,
  setTotalAllocationAmount = () => { },
  dataReceiptChannelDDL,
  dataAccNumber,
  setAccNumb,
  accNumb,
  form,
  setRequestBodyConverted = () => { },
  rateAmountValues,
  formValues,
  accountTypeDDL,
}) => {
  const dispatch = useDispatch();
  const formValue = form?.getFieldsValue();
  const [filteredConvertedDDL, setFilteredConvertedDDL] = useState([]);
  const [value, setValue] = useState(null);


  const handleAccNumb = (value, option) => {
    setAccNumb({ id: value, name: option?.label });
    hasValue(value) && dispatch(getAccountNumberDDL(value));

    if (!hasValue(form.getFieldValue("accNumber"))) {
      dispatch(getAllAccountNumberDDL()); 
      dispatch(resetDataAccountNumber());
    }
  };

  const handleCusNumb = (value, option) => {
    setCusNumb({ id: value, name: option?.label });
    hasValue(value) && dispatch(getAccountDDL(value));
    
    if (!hasValue(form.getFieldValue("cusNumber"))) {
      form.setFieldsValue({
        accNumber: null
      })
      dispatch(getAllAccountNumberDDL()); 
      dispatch(resetDataAccountNumber());
    }
  };

  // handle change amount
  const handleChangeAmount = (value) => {
    setAmount(value);
  };

  // handleChange currency
  const onChangeCurrency = (e) => {
    form.resetFields(["convertedCurrency"]);
    setDataTable([]);
    setFilteredConvertedDDL(
      currencyDDL?.data?.filter((item) => item?.id !== e)
    );
    setRequestBodyConverted((prevState) => ({ ...prevState, fromCurrency: e }));
  };
  const onChangeConvertedCurrency = (e) => {
    setRequestBodyConverted((prevState) => ({ ...prevState, toCurrency: e }));
  };
  const onChangeRateType = (e) => {
    setRequestBodyConverted((prevState) => ({ ...prevState, rateType: e }));
  };
  const onChangeRateDate = (e) => {
    setRequestBodyConverted((prevState) => ({
      ...prevState,
      rateDate: moment(e).format(dateFormatting?.date),
    }));
  };

  const handlePaymentTypeChange = (value) => {
    dispatch(getUnifiedCreateReceiptDdl({ paymentTypeId: value }));
    form.resetFields(["paymentGateway", "collectingAgent"]);
  };

  const handlePaymentGatewayChange = (value) => {
    const paymentTypeId = form.getFieldValue("paymentType");
    dispatch(getUnifiedCreateReceiptDdl({ paymentTypeId, partnerId: value }));
    form.resetFields(["collectingAgent"]);
  };

  const handleDeliveryChannelChange = (value) => {
    const paymentTypeId = form.getFieldValue("paymentType");
    const partnerId = form.getFieldValue("paymentGateway");
    dispatch(getUnifiedCreateReceiptDdl({ paymentTypeId, partnerId, deliveryChannelId: value }));
    form.resetFields(["method", "bank"]);
  };

  const handleReceiptMethodChange = (value) => {
    const paymentTypeId = form.getFieldValue("paymentType");
    const partnerId = form.getFieldValue("paymentGateway");
    const deliveryChannelId = form.getFieldValue("deliveryChannel");
    dispatch(getUnifiedCreateReceiptDdl({ paymentTypeId, partnerId, deliveryChannelId, methodId: value }));
    form.resetFields(["bank"]);
  };

  return (
    <div className="w-full">
      <BaseContainer header={"CUSTOMER INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          {/* Row 1 */}
          <Form.Item
            label={"Miscellaneous"}
            name={"miscellaneous"}
            rules={formMessageRequired("Miscellaneous")}
            initialValue={"No"}
          >
            <SelectComponent placeholder="Select Miscellaneous">
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Account Number"}
            name={"accNumber"}
            rules={formMessageRequired("Account Number")}
          >
            <SelectComponent
              onChange={handleAccNumb}
              placeholder="Select Account Number"
              options={
                dataAccNumber
                  ? dataAccNumber?.data?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })
                  : []
              }
            />
          </Form.Item>

          <Form.Item
            label={"Customer Number"}
            name={"cusNumber"}
            rules={formMessageRequired("Customer Number")}
          >
            {/* <InputComponent disabled placeholder="Auto-filled" /> */}
            <SelectComponent
              onChange={handleCusNumb}
              placeholder="Select Customer Number"
              options={
                cusNumberDDL
                  ? cusNumberDDL?.data?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })
                  : []
              }
            />
          </Form.Item>

          <Form.Item
            label={"Customer Name"}
            name={"cusName"}
            rules={formMessageRequired("Customer Name")}
          >
            <InputComponent disabled placeholder="Auto-filled" />
          </Form.Item>

          <Form.Item
            label={"Account Name"}
            name={"accountName"}
            rules={formMessageRequired("Account Name")}
          >
            <InputComponent disabled placeholder="Auto-filled" />
          </Form.Item>

          {/* Row 2 */}
          <Form.Item
            label={"Account Segment"}
            name={"segment"}
            rules={formMessageRequired("Account Segment")}
          >
            <InputComponent disabled placeholder="Auto-filled" />
          </Form.Item>

          <Form.Item
            label={"Account Group Type"}
            name={"accountGroupType"}
            rules={formMessageRequired("Account Group Type")}
          >
            <InputComponent disabled placeholder="Auto-filled" />
          </Form.Item>

          <Form.Item
            label={"SOR"}
            name={"sor"}
            rules={formMessageRequired("SOR")}
          >
            <InputComponent disabled placeholder="Auto-filled" />
          </Form.Item>

          <Form.Item
            label={"Cost Center Code"}
            name={"costCenterCode"}
            rules={formMessageRequired("Cost Center Code")}
          >
            <InputComponent disabled placeholder="Auto-filled" />
          </Form.Item>

          <Form.Item
            label={"Cost Center Name"}
            name={"costCenterName"}
            rules={formMessageRequired("Cost Center Name")}
          >
            <InputComponent disabled placeholder="Auto-filled" />
          </Form.Item>
        </div>
      </BaseContainer>

      <BaseContainer header={"RECEIPT INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <Form.Item
            label={"Receipt Code"}
            name={"receiptCode"}
            rules={formMessageRequired("Receipt Code")}
          >
            <InputComponent placeholder="Input Receipt Code" />
          </Form.Item>
          <Form.Item
            label={"Receipt Channel"}
            name={"receiptChannel"}
            rules={formMessageRequired("Receipt Channel")}
          >
            <SelectComponent placeholder="Select Receipt Channel">
              {dataReceiptChannelDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Payment Type"}
            name={"paymentType"}
            rules={formMessageRequired("Payment Type")}
          >
            <SelectComponent onChange={handlePaymentTypeChange} placeholder="Select Payment Type">
              {payTypeDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Partner"}
            name={"paymentGateway"}
            rules={formMessageRequired("Partner")}
          >
            <SelectComponent onChange={handlePaymentGatewayChange} placeholder="Select Partner">
              {payGatewayDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Collecting Agent"}
            name={"collectingAgent"}
            rules={formMessageRequired("Collecting Agent")}
          >
            <SelectComponent placeholder="Select Collecting Agent">
              {colAgentDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Delivery Channel"}
            name={"deliveryChannel"}
            rules={formMessageRequired("Delivery Channel")}
          >
            <SelectComponent onChange={handleDeliveryChannelChange} placeholder="Select Delivery Channel">
              {payDeliveryDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Receipt Method"}
            name={"method"}
          >
            <SelectComponent onChange={handleReceiptMethodChange} placeholder="Select Receipt Method">
              {payMethodDDL?.data
                ?.filter((data) => {
                  const miscellaneous = form.getFieldValue("miscellaneous");
                  // If Miscellaneous is "Yes", exclude "From Customer"
                  if (miscellaneous === "Yes" && data.name === "From Customer") {
                    return false;
                  }
                  return true;
                })
                ?.map((data) => (
                  <Select.Option key={data.id} value={data.id}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Bank"}
            name={"bank"}
            rules={formMessageRequired("Bank")}
          >
            <SelectComponent placeholder="Select Bank">
              {bankDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Receipt Date"}
            name={"receiptDate"}
            rules={[
              {
                required: true,
                message: "Please input your Receipt Date!",
              },
            ]}
          >
            <DatePicker
              disabledDate={(current) => {
                return current && current > moment().add(0, "days");
              }}
              className={"w-full"}
              format={dateFormatting?.dateTime}
              showTime={true}
              placeholder="Select Receipt Date"
            />
          </Form.Item>
          <div></div>
        </div>
      </BaseContainer>
      {/* Base Container ke 3  */}
      <BaseContainer header={"AMOUNT INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <Form.Item
            label={"Currency"}
            name={"currency"}
            rules={formMessageRequired("Currency")}
          >
            <SelectComponent onChange={onChangeCurrency} placeholder="Select Currency">
              {currencyDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Amount"}
            name={"amount"}
            rules={formMessageRequired("Amount")}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
              }
              parser={(value) => value?.toString()?.replace(/\./g, "")}
              decimalSeparator=","
              precision={2}
              onChange={handleChangeAmount}
              placeholder="Input Amount"
              controls={false}
            />
          </Form.Item>
          <Form.Item
            label={"Rate Type"}
            name={"rateType"}
            rules={formMessageRequired("Rate Type")}
          >
            <SelectComponent onChange={onChangeRateType} placeholder="Select Rate Type">
              {rateTypeDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {`${data.name} - ${data.description}`}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Rate Date"}
            name={"rateDate"}
            rules={formMessageRequired("Rate Date")}
          >
            <DatePicker
              disabledDate={(current) => {
                return current && current > +moment().add(0, "days");
              }}
              className={"w-full"}
              format={dateFormatting?.date}
              onChange={onChangeRateDate}
              placeholder="Select Rate Date"
            />
          </Form.Item>
          <Form.Item
            label={"Converted Currency"}
            name={"convertedCurrency"}
            rules={formMessageRequired("Converted Currency")}
          >
            <SelectComponent onChange={onChangeConvertedCurrency} placeholder="Select Converted Currency">
              {filteredConvertedDDL?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item
            label={"Rate"}
            name={"rateAmount"}
            rules={formMessageRequired("Rate Amount")}
          >
            <Input
              allowClear
              maxLength={5}
              disabled
            />
          </Form.Item>
          <Form.Item
            label={"Equivalent Amount"}
            name={"eqAmount"}
            rules={formMessageRequired("Equivalent Amount")}
          >
            <Input
              allowClear
              maxLength={5}
              disabled
            />
          </Form.Item>
          <div></div>
          <div></div>
          <div></div>

          <div className="col-span-5 grid grid-cols-1 gap-3">
            <Form.Item
              label={"Remark"}
              name={"description"}
              rules={formMessageRequired("Remark")}
            >
              <InputComponent rows={5} type="textarea" placeholder="Input Remark" />
            </Form.Item>
          </div>
        </div>
      </BaseContainer>

      {/* base container ke empat */}
      < BaseContainer header={"Allocation Information"} >
        <AllocationSection
          setIsInsert={setStoredData}
          isInsert={storedData}
          dataTable={dataTable}
          setDataTable={setDataTable}
          amount={amount}
          totalAllocationAmount={totalAllocationAmount}
          setTotalAllocationAmount={setTotalAllocationAmount}
          accountNumberSelected={accNumb?.name}
          rateAmountValue={rateAmountValues}
          formValues={formValues}
          currencyId={formValue?.currency}
          form={form}
        />
      </BaseContainer >
    </div >
  );
};

export default CreateReceiptForm;
