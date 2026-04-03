import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import moment from "moment";
import React, { useState } from "react";
// Sesuaikan path import CardContainer dengan struktur project lo, 
// asumsi satu folder dengan BaseContainer/InputComponent
import CardContainer from "../../../../../components/CardContainer"; 
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
} from "../../../../../utils";
import { sanitizeNumericInput } from "../../../../../utils/sanitizeInput";
import AllocationSection from "../Table/AllocationSection";
import {
  getAccountDDL,
  getAccountNumberDDL,
  getAllAccountNumberDDL,
  resetDataAccountNumber,
  getPayGetwayDDL,
  getCollectionAgentDDL,
  getPayMethodDDL,
  getBankDDL,
  getAllPosRegistrationNumbersDDL,
} from "../../../../../redux/slices/receipt_collection/receipt";
import { useDispatch } from "react-redux";

const CreateReceiptForm = ({
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
  allPosRegistrationNumbersDDL,
}) => {
  const dispatch = useDispatch();
  const formValue = form?.getFieldsValue();
  const [filteredConvertedDDL, setFilteredConvertedDDL] = useState([]);

  const [customerType, setCustomerType] = useState("Customer");
  const [miscType, setMiscType] = useState("No");
  const selectedCurrencyId = Form.useWatch("currency", form);
  const selectedCurrencyName = currencyDDL?.data?.find(
    (c) => c.id === selectedCurrencyId
  )?.name?.toUpperCase();
  const isIDR = selectedCurrencyName === "IDR";

  // Sinkronisasi state saat form pertama kali dimuat
  React.useEffect(() => {
    const currentMisc = form.getFieldValue("miscellaneous");
    const currentCustType = form.getFieldValue("custType");

    if (currentMisc) {
      setMiscType(currentMisc);
    }
    if (currentCustType) {
      setCustomerType(currentCustType);
    }
    
    const currentAccId = form.getFieldValue("accNumber");
    const currentAccName = form.getFieldValue("accountName");
    if(currentAccId) {
        setAccNumb({ id: currentAccId, name: currentAccName });
    }
    
    // Trigger dependent dropdowns for update
    const paymentType = form.getFieldValue("paymentType");
    const partner = form.getFieldValue("paymentGateway");
    const deliveryChannel = form.getFieldValue("deliveryChannel");
    const method = form.getFieldValue("method");

    if (paymentType) {
        dispatch(getPayGetwayDDL(paymentType));
        dispatch(getCollectionAgentDDL({ paymentTypeId: paymentType, partnerId: partner }));
    }
    if (deliveryChannel) {
        dispatch(getPayMethodDDL(deliveryChannel));
    }
    if (method) {
        dispatch(getBankDDL(method));
    }

  }, [form, dispatch, setAccNumb]);

  // Debug: Log POS registration numbers data
  React.useEffect(() => {
    console.log("allPosRegistrationNumbersDDL:", allPosRegistrationNumbersDDL);
  }, [allPosRegistrationNumbersDDL]);

  const handleMiscChange = (value) => {
    setMiscType(value);
    
    setAccNumb(null);
    setCusNumb({ id: null, name: null });

    if (value === "Yes") {
      form.setFieldsValue({
        custType: "Customer", 
        accNumber: null,
        cusNumber: null,
        cusName: null,
        accountName: null,
        segment: null,
        accountGroupType: null,
        accountType: null,
        classificationType: null,
        sor: null,
        costCenterCode: null,
        meterReadingCode: null,
        registrationNumber: null,
      });
      
      setCustomerType("Customer");
    } else {
      dispatch(getAllAccountNumberDDL());
      dispatch(resetDataAccountNumber());
    }
  };

  const handleCustomerTypeChange = (value) => {
    setCustomerType(value);
    
    setAccNumb(null);
    setCusNumb({ id: null, name: null });

    if (value === "Prospective") {
      // Fetch all POS registration numbers when switching to Prospective Customer
      console.log("Fetching POS registration numbers...");
      dispatch(getAllPosRegistrationNumbersDDL());
      
      form.setFieldsValue({
        accNumber: null,
        cusNumber: null,
        cusName: null,
        accountName: null,
        segment: null,
        accountGroupType: null,
        accountType: null,
        classificationType: null,
        sor: null,
        costCenterCode: null,
        meterReadingCode: null,
        registrationNumber: null
      });
    } else {
      form.setFieldsValue({ 
        registrationNumber: null 
      });
    }
  };

  const handleAccNumb = (value, option) => {
    setAccNumb({ id: value, name: option?.label });
    
    const selectedAccount = dataAccNumber?.data?.find((item) => item.id === value);

    if (selectedAccount) {
        const isFirstPartNaN = isNaN(selectedAccount?.name?.split(" - ")?.[0]);
        const extractedAccountName = isFirstPartNaN 
          ? selectedAccount?.name?.split(" - ")?.[0] 
          : selectedAccount?.name?.split(" - ")?.[1];

        form.setFieldsValue({
            cusNumber: selectedAccount.customerId,
            accountName: extractedAccountName || selectedAccount?.name
        });
        
        setCusNumb({ 
            id: selectedAccount.customerId, 
            name: selectedAccount.customerName
        });
        
        if (selectedAccount.customerId) {
            dispatch(getAccountDDL(selectedAccount.customerId));
        }
    }

    hasValue(value) && dispatch(getAccountNumberDDL(value));

    if (!hasValue(form.getFieldValue("accNumber"))) {
      dispatch(getAllAccountNumberDDL()); 
      dispatch(resetDataAccountNumber());
    }
  };

  const handleCusNumb = (value, option) => {
    setCusNumb({ id: value, name: option?.label });
    hasValue(value) && dispatch(getAccountDDL(value));
    
    if (!hasValue(value)) {
      form.setFieldsValue({
        accNumber: null
      });
      setAccNumb(null);
      dispatch(getAllAccountNumberDDL()); 
      dispatch(resetDataAccountNumber());
    }
  };

  const handleChangeAmount = (value) => {
    setAmount(value);
  };

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
    dispatch(getPayGetwayDDL(value));
    dispatch(getCollectionAgentDDL({ paymentTypeId: value }));
    form.resetFields(["paymentGateway", "collectingAgent"]);
  };

  const handlePaymentGatewayChange = (value) => {
    const paymentTypeId = form.getFieldValue("paymentType");
    dispatch(getCollectionAgentDDL({ paymentTypeId, partnerId: value }));
    form.resetFields(["collectingAgent"]);
  };

  const handleDeliveryChannelChange = (value) => {
    dispatch(getPayMethodDDL(value));
    dispatch(getBankDDL()); // Fetch default list of banks when switching delivery channel
    form.resetFields(["bank"]);
  };

  const handleReceiptMethodChange = (value) => {
    dispatch(getBankDDL(value));
    form.resetFields(["bank"]);
  };

  // Helper untuk Header CardContainer
  const renderHeader = (title) => (
    <div className="flex -my-4 justify-between items-center">
      <p className="w-full mt-[15px] text-primary">
        {title.toUpperCase()}
      </p>
    </div>
  );

  return (
    <div className="w-full">
      <CardContainer header={renderHeader("Customer Information")}>
        <div className="w-full grid grid-cols-5 gap-2">
          {/* Row 1 */}
          <Form.Item
            label={"Miscellaneous"}
            name={"miscellaneous"}
            rules={formMessageRequired("Miscellaneous")}
            initialValue={"No"}
            style={{ marginBottom: 0 }}
          >
            <SelectComponent placeholder="Select Miscellaneous" onChange={handleMiscChange}>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </SelectComponent>
          </Form.Item>
          
          {miscType === "No" && (
            <>
              <Form.Item
                label={"Customer Type"}
                name={"custType"}
                rules={formMessageRequired("Customer Type")}
                initialValue={"Customer"}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent placeholder="Select Customer Type" onChange={handleCustomerTypeChange}>
                  <Select.Option value="Customer">Customer</Select.Option>
                  <Select.Option value="Prospective">Prospective Customer</Select.Option>
                </SelectComponent>
              </Form.Item>

              <Form.Item
                label={"Registration Number"}
                name={"registrationNumber"}
                rules={customerType === "Prospective" ? formMessageRequired("Registration Number") : []}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  disabled={customerType !== "Prospective"}
                  placeholder="Select Registration Number"
                  options={
                    (() => {
                      const options = allPosRegistrationNumbersDDL && customerType === "Prospective"
                        ? allPosRegistrationNumbersDDL?.data?.map((item) => ({
                            label: item?.name,
                            value: item?.id,
                          }))
                        : [];
                      console.log("Registration Number options:", options);
                      console.log("customerType:", customerType);
                      console.log("allPosRegistrationNumbersDDL:", allPosRegistrationNumbersDDL);
                      return options;
                    })()
                  }
                />
              </Form.Item>

              <Form.Item
                label={"Account Number"}
                name={"accNumber"}
                rules={customerType === "Customer" ? formMessageRequired("Account Number") : []}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  onChange={handleAccNumb}
                  disabled={customerType !== "Customer"}
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
                rules={customerType === "Customer" ? formMessageRequired("Customer Number") : []}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  onChange={handleCusNumb}
                  disabled={customerType !== "Customer" || !!accNumb?.id || !!form.getFieldValue("accNumber")}
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
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>

                  <Form.Item
                    label={"Account Name"}
                    name={"accountName"}
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>

                  <Form.Item
                    label={"Account Segment"}
                    name={"segment"}
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>

                  <Form.Item
                    label={"Account Group Type"}
                    name={"accountGroupType"}
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>

                  <Form.Item
                    label={"Account Type"}
                    name={"accountType"}
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>

                  <Form.Item
                    label={"Classification Type"}
                    name={"classificationType"}
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>

                  <Form.Item
                    label={"SOR"}
                    name={"sor"}
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>

                  <Form.Item
                    label={"Cost Center"}
                    name={"costCenterCode"}
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>

                  <Form.Item
                    label={"Meter Reading Code"}
                    name={"meterReadingCode"}
                    style={{ marginBottom: 0 }}
                  >
                    <InputComponent disabled placeholder="Auto-filled" />
                  </Form.Item>
            </>
          )}
        </div>
      </CardContainer>

      <CardContainer header={renderHeader("Receipt Information")}>
        <div className="w-full grid grid-cols-5 gap-2">
          <Form.Item
            label={"Receipt Method"}
            rules={formMessageRequired("Receipt Method")}
            name={"method"}
            style={{ marginBottom: 0 }}
          >
            <SelectComponent onChange={handleReceiptMethodChange} placeholder="Select Receipt Method">
              {payMethodDDL?.data
                ?.filter((data) => {
                  const miscellaneous = form.getFieldValue("miscellaneous");
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
            label={"Receipt Code"}
            name={"receiptCode"}
            rules={formMessageRequired("Receipt Code")}
            style={{ marginBottom: 0 }}
          >
            <InputComponent placeholder="Input Receipt Code" />
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
            style={{ marginBottom: 0 }}
          >
            <DatePicker
              disabledDate={(current) => {
                const isFuture = current > moment().endOf('day');
                const isWrongMonth = !current.isSame(moment(), 'month');
                return current && (isFuture || isWrongMonth);
              }}
              className={"w-full"}
              format={dateFormatting?.dateTime}
              showTime={true}
              placeholder="Select Receipt Date"
            />
          </Form.Item>
          <Form.Item
            label={"Receipt Channel"}
            name={"receiptChannel"}
            rules={formMessageRequired("Receipt Channel")}
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
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
            label={"Bank"}
            name={"bank"}
            rules={formMessageRequired("Bank")}
            style={{ marginBottom: 0 }}
          >
            <SelectComponent placeholder="Select Bank">
              {bankDDL?.data?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          <div></div>
          <div className="col-span-5 grid grid-cols-1 gap-2">
            <Form.Item
              label={"Remark"}
              name={"remark"}
              rules={formMessageRequired("Remark")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent rows={5} type="textarea" placeholder="Input Remark" />
            </Form.Item>
          </div>
        </div>
      </CardContainer>
      
      <CardContainer header={renderHeader("Amount Information")}>
        <div className="w-full grid grid-cols-5 gap-2">
          <Form.Item
            label={"Currency"}
            name={"currency"}
            rules={formMessageRequired("Currency")}
            style={{ marginBottom: 0 }}
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
            rules={[
              ...formMessageRequired("Amount"), // Asumsi ini balikin array of rules
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  const sanitizedValue = sanitizeNumericInput(value);
                  
                  // Validasi umum: gak boleh 0 atau minus
                  if (Number(sanitizedValue) <= 0) {
                    return Promise.reject(new Error("Amount harus lebih dari 0"));
                  }

                  // Validasi khusus IDR: gak boleh ada angka di belakang koma
                  if (isIDR && !Number.isInteger(Number(sanitizedValue))) {
                    return Promise.reject(new Error("Input IDR tidak boleh menggunakan desimal/koma"));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              style={{ width: "100%" }}
              stringMode
              maxLength={28}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace", "Delete", "Tab", "Escape", "Enter",
                  "ArrowLeft", "ArrowRight", "Home", "End"
                ];
                if (e.ctrlKey || e.metaKey) return;
                // Kalau IDR, cegah user ngetik koma (,) di keyboard
                const blockCommaForIDR = isIDR && e.key === ",";
                
                if ((!/[0-9,]/.test(e.key) && !allowedKeys.includes(e.key)) || blockCommaForIDR) {
                  e.preventDefault();
                }
              }}
              formatter={(value) =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
              }
              parser={(value) => (value ? value.replace(/\./g, "") : "")}
              decimalSeparator=","
              // Kunci utamanya di sini: 0 untuk IDR, 2 untuk yang lain (termasuk USD)
              precision={isIDR ? 0 : 2} 
              onChange={handleChangeAmount}
              placeholder="Input Amount"
              controls={false}
            />
          </Form.Item>
          <Form.Item
            label={"Converted Currency"}
            name={"convertedCurrency"}
            rules={formMessageRequired("Converted Currency")}
            style={{ marginBottom: 0 }}
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
            label={"Rate Type"}
            name={"rateType"}
            rules={formMessageRequired("Rate Type")}
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
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
            label={"Rate"}
            name={"rateAmount"}
            style={{ marginBottom: 0 }}
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
            style={{ marginBottom: 0 }}
          >
            <Input
              allowClear
              maxLength={5}
              disabled
            />
          </Form.Item>
          <Form.Item
            label={"Unapplied Amount / Balance"}
            name={"unappliedAmount"}
            style={{ marginBottom: 0 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Applied Amount"}
            name={"appliedAmount"}
            style={{ marginBottom: 0 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Applied Eqv Amount"}
            name={"appliedEqvAmount"}
            style={{ marginBottom: 0 }}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label={"Unapplied Eqv Amount"}
            name={"unappliedEqvAmount"}
            style={{ marginBottom: 0 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Unidentified Amount"}
            name={"unidentifiedAmount"}
            style={{ marginBottom: 0 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Hold Amount"}
            name={"holdAmount"}
            style={{ marginBottom: 0 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Refund Amount"}
            name={"refundAmount"}
            style={{ marginBottom: 0 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Transfer Amount"}
            name={"transferAmount"}
            style={{ marginBottom: 0 }}
          >
            <Input disabled />
          </Form.Item>

          <div className="col-span-5 grid grid-cols-1 gap-2">
            <Form.Item
              label={"Remark"}
              name={"description"}
              rules={formMessageRequired("Remark")}
              style={{ marginBottom: 0 }}
            >
              <InputComponent rows={5} type="textarea" placeholder="Input Remark" />
            </Form.Item>
          </div>
        </div>
      </CardContainer>

      <CardContainer header={renderHeader("Allocation Item Information")}>
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
      </CardContainer>
    </div >
  );
};

export default CreateReceiptForm;