import { Checkbox, DatePicker, Form, Input, Select } from "antd";
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
  setStoredData = () => {},
  storedData,
  dataTable,
  setDataTable = () => {},
  amount,
  setAmount = () => {},
  totalAllocationAmount,
  setTotalAllocationAmount = () => {},
  dataReceiptChannelDDL,
  dataAccNumber,
  setAccNumb,
  accNumb,
  form,
  setRequestBodyConverted = () => {},
  rateAmountValues,
  formValues,
  isMisc,
  setIsMisc,
}) => {
  const dispatch = useDispatch();
  const formValue = form?.getFieldsValue();
  const [filteredConvertedDDL, setFilteredConvertedDDL] = useState([]);
  const [value, setValue] = useState(null);

  const handlePageBox = (e) => {
    setIsMisc(e.target.checked);
  };

  const handleCodeBank = (value) => {
    setCusNumb(value);
    hasValue(value) && dispatch(getAccountDDL(value));
    form.resetFields(["accNumber", "cusName", "area", "segment"]);
    // dispatch(getAccountNumberDDL(value))
  };
  const handleAccNumb = (value) => {
    setAccNumb(dataAccNumber?.data?.filter((item) => item?.id === value)[0]);
    hasValue(value) && dispatch(getAccountNumberDDL(value));
    form.resetFields(["cusName", "area", "segment"]);
  };

  // handle change amount
  const handleChangeAmount = (e) => {
    setAmount(e?.target?.value);
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

  return (
    <div className="w-full">
      <BaseContainer header={"CUSTOMER INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-5">
          <Form.Item
            label={"Customer Number"}
            name={"cusNumber"}
            // rules={formMessageRequired("Customer Number")}
            // getValueFromEvent={handleCodeBank}
          >
            <SelectComponent
              onChange={handleCodeBank}
              options={cusNumberDDL?.data?.map((item) => {
                return {
                  label: item?.name,
                  value: item?.id,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            label={"Account Number"}
            name={"accNumber"}
            // rules={formMessageRequired("Account Number")}
          >
            <SelectComponent
              disabled={!cusNumb}
              onChange={handleAccNumb}
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
            label={"Customer Name"}
            name={"cusName"}
            // rules={formMessageRequired("Customer Name")}
          >
            <InputComponent disabled={true} />
          </Form.Item>
          <Form.Item
            label={"Cost Center"}
            name={"area"}
            // rules={formMessageRequired("Cost Center")}
          >
            <InputComponent disabled={true} />
          </Form.Item>
          <Form.Item
            label={"Account Segment"}
            name={"segment"}
            // rules={formMessageRequired("Segment")}
          >
            <InputComponent disabled={true} />
          </Form.Item>
        </div>
      </BaseContainer>

      {/* base container kedua  */}
      <BaseContainer header={"RECEIPT DETAIL INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <Form.Item label={"Receipt Code"} name={"receiptCode"}>
            <InputComponent />
          </Form.Item>
          <Form.Item
            label={"Receipt Channel"}
            name={"receiptChannel"}
            rules={formMessageRequired("Receipt Channel")}
          >
            <SelectComponent>
              {dataReceiptChannelDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item
            label={"Payment Partner"}
            name={"paymentGateway"}
            rules={formMessageRequired("Payment Partner")}
          >
            <SelectComponent>
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
            <SelectComponent>
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
            <SelectComponent>
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
            rules={formMessageRequired("Receipt Method")}
          >
            <SelectComponent>
              {payMethodDDL?.data?.map((data) => (
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
            />
          </Form.Item>
          <Form.Item
            label={"Payment Type"}
            name={"paymentType"}
            rules={formMessageRequired("Payment Type")}
          >
            <SelectComponent>
              {payTypeDDL?.data?.map((data) => (
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
            <SelectComponent>
              {bankDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <Form.Item label={"Reference"} name={"refrence"}>
            <InputComponent />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-3 gap-3">
          <Form.Item>
            <div className="flex flex-col pt-[12px]">
              <Checkbox name="isMisc" checked={isMisc} onChange={handlePageBox}>
                Is Miscellaneous
              </Checkbox>
              <span className="text-[10px]">
                Click or tap this checkbox if data can be VA.
              </span>
            </div>
          </Form.Item>
        </div>
      </BaseContainer>
      {/* Base Container ke 3  */}
      <BaseContainer header={"AMOUNT DETAIL INFORMATION"}>
        <div className="w-full grid grid-cols-2 gap-5">
          <Form.Item
            label={"Currency"}
            name={"currency"}
            rules={formMessageRequired("Currency")}
          >
            <SelectComponent onChange={onChangeCurrency}>
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
            <Input
              allowClear
              maxLength={16}
              value={value}
              onChange={handleChangeAmount}
              onInput={(e) => {
                let value = e.target.value;            
                value = value.replace(/[^\d,]/g, "");
                let [integer, decimal] = value.split(",");
                integer = integer.substring(0, 12);
                integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                decimal = (decimal || "00").substring(0, 2).padEnd(2, "0");
                e.target.value = `${integer},${decimal}`;
              }}
            />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-3 gap-5">
          <Form.Item
            label={"Rate Type"}
            name={"rateType"}
            rules={formMessageRequired("rate Type")}
          >
            <SelectComponent onChange={onChangeRateType}>
              {rateTypeDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
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
            />
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
              // onChange={(e) => console.log(e, 'lalalal')}
              // onInput={(e) =>
              //   (e.target.value = e.target.value.replace(/\D/g, ""))
              // }
            />
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-2 gap-5">
          <Form.Item
            label={"Converted Currency"}
            name={"convertedCurrency"}
            rules={formMessageRequired("Converted Currency")}
          >
            {/* <InputComponent /> */}
            <SelectComponent onChange={onChangeConvertedCurrency}>
              {filteredConvertedDDL?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
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
            {/* <InputComponent disabled={true} /> */}
          </Form.Item>
        </div>
        <div className="w-full grid grid-cols-1 gap-3">
          <Form.Item
            label={"Description"}
            name={"description"}
            rules={formMessageRequired("Description")}
          >
            <InputComponent rows={5} type="textarea" />
          </Form.Item>
        </div>
      </BaseContainer>

      {/* base container ke empat */}
      <BaseContainer header={"Allocation Information"}>
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
      </BaseContainer>
    </div>
  );
};

export default CreateReceiptForm;
