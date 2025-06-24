import React, { useEffect, useState } from 'react';
import ModalCustom from '../../../../components/Modal/ModalCustom';
import { DatePicker, Form, Input, Select, Spin, TimePicker } from 'antd';
import SelectComponent from '../../../../components/SelectComponent';
import { useDispatch, useSelector } from 'react-redux';
import InputComponent from '../../../../components/InputComponent';
import ButtonComponent from '../../../../components/ButtonComponent';
import { getAccountNumber, getAssetType, getSource } from '../../../../redux/slices/rating_billing_invoice/monitoring_usage';
import moment from 'moment';
import { dateFormatting, formMessageRequired, hasValue } from '../../../../utils';

const ModalUpdateUsage = ({
    isOpen,
    handleCancel = () => { },
    handleOk = () => { },
    record,
    uploadType = false,
    handleSave = () => { },
    handleBack = () => { },
    
    // form
}) => {
    // console.log(uploadType, ' upload type');
    const { data_asset_type, data_account_number, data_source, loading } = useSelector((state) => state.monitoring_usage);
    const dispatch = useDispatch();
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [period, setPeriod] = useState("");
    const [hour, setHour] = useState("");
    const [date, setDate] = useState("");
    const [measDate, setMeasDate] = useState("");
    const [form] = Form.useForm();
    // console.log(record, ' record');
    // use effect
    useEffect(() => {
        if (isOpen === true) {
            dispatch(getAssetType())
            dispatch(getAccountNumber())
            dispatch(getSource())
        }
    }, [dispatch, isOpen]);
    useEffect(() => {
        if (record) {
            form.setFieldsValue({
                accountNumber: record?.accountNumber,
                accountName: record?.accountName,
                costCenter: record?.costCenter,
                billingPeriod: hasValue(record?.billingPeriod) && moment(record?.billingPeriod),
              assetSerialNum: record?.assetSerialNumber,
                assetType: record?.assetType,
                fdate: hasValue(record?.fdate) && moment(record?.fdate),
                fhour: hasValue(record?.fhour) && moment(record?.fhour, 'HH:mm'),
                measDate: hasValue(record?.measDate) && moment(record?.measDate),
                streamId: record?.streamId,
                temperature: record?.temperature,
                pressure: record?.pressure,
                correctionFactor: record?.correctionFactor,
                calorie: record?.calorie,
                beginStand: record?.beginStand,
                endStand: record?.endStand,
                volMeasured27: record?.volMeasured27,
                volMeasured60: record?.volMeasured60,
                engMeasured: record?.engMeasured,
                ghv: record?.ghv,
                volMscf: record?.volMscf,
                uncorrectedValue: record?.uncorrectedValue,
                taxationRowId: record?.taxationRowId,
                source: record?.source,
                description: record?.description
            })
        }
    }, [form, record])

    const handleAccountNumberChange = (value, option) => {
        const selectedAccount = data_account_number?.data?.find(account => account.accountNumber === value);

        if (selectedAccount) {
            form.setFieldsValue({
                accountName: selectedAccount.accountName,
                costCenter: selectedAccount.costCenter,
            });
            setSelectedAccount(selectedAccount);
        }
    };


    const save = (formValue) => {
        // console.log(formValue, ' dorm value');
    }
    return (
      <ModalCustom
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        width={1200}
        type={"confirmation"}
        header={"update usage"}
      >
        <Spin spinning={loading}>
          <Form
            labelCol={{
              span: 12,
            }}
            labelAlign="left"
            form={form}
            onFinish={handleSave}
            layout="vertical"
          >
            <div className="w-full grid grid-cols-4 gap-4">
              <Form.Item
                label={"Account Number"}
                name={"accountNumber"}
                rules={[
                  {
                    required: true,
                    message: "Please input your account number!",
                  },
                ]}
              >
                <SelectComponent
                  onChange={handleAccountNumberChange}
                  disabled={true}
                >
                  {data_account_number?.data?.map((account) => (
                    <Select.Option
                      key={account.accountId}
                      value={account.accountNumber}
                    >
                      {account.accountNumber}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item label={"Account Name"} name={"accountName"}>
                <InputComponent disabled />
              </Form.Item>
              <Form.Item label={"Cost Center"} name={"costCenter"}>
                <InputComponent disabled />
              </Form.Item>
              <Form.Item
                label={"Billing Period"}
                name={"billingPeriod"}
                rules={[
                  {
                    required: true,
                    message: "Please input your Billing Period!",
                  },
                ]}
              >
                {/* <Input/> */}
                <DatePicker
                  format={"MMM YYYY"}
                  picker="month"
                  onChange={(date, dateString) => setPeriod(dateString)}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                label={"Asset Serial No"}
                name={"assetSerialNum"}
                rules={[
                  {
                    required: true,
                    message: "Please input your asset serial number!",
                  },
                ]}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Asset Type"}
                name={"assetType"}
                rules={[
                  { required: true, message: "Please input your asset type!" },
                ]}
              >
                <Select>
                  {data_asset_type?.map((assetType) => (
                    <Select.Option
                      key={assetType.id}
                      value={assetType.name?.toUpperCase()}
                    >
                      {assetType.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={"Date"} name={"fdate"}>
                <DatePicker
                  className="w-full"
                  format={dateFormatting.date}
                  onChange={(date, dateString) => setDate(dateString)}
                />
              </Form.Item>
              <Form.Item label={"Hour"} name={"fhour"}>
                <TimePicker
                  showNow={false}
                  className="w-full"
                  format={"HH:mm"}
                  onChange={(time, timeString) => setHour(timeString)}
                />
              </Form.Item>
              <Form.Item
                label={"Measurement Date"}
                name={"measDate"}
                rules={[
                  {
                    required: true,
                    message: "Please input your measurement date",
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  format={dateFormatting.dateTime}
                  onChange={(date, dateString) => setMeasDate(dateString)}
                  showTime
                />
              </Form.Item>
              <Form.Item label={"Stream Id"} name={"streamId"}>
                <Input
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/[^\d.]/g, ""))
                  }
                />
              </Form.Item>
              <Form.Item label={"Temperature"} name={"temperature"}>
                <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                />
              </Form.Item>
              <Form.Item label={"Pressure"} name={"pressure"}>
                <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                />
              </Form.Item>
              <Form.Item label={"Correction Factor"} name={"correctionFactor"}>
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Calorie"}
                name={"calorie"}
                rules={[{ required: true, message: "Please input calorie!" }]}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                {/* <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                /> */}
                <InputComponent
                  decimalScale={4}
                  thousandSeparator={","}
                  decimalSeparator={"."}
                  type="numeric"
                  fixedDecimalScale={true}
                />
              </Form.Item>
              <Form.Item
                label={"Begin Stand"}
                name={"beginStand"}
                rules={[
                  { required: true, message: "Please input begin stand!" },
                ]}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                {/* <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                /> */}
                <InputComponent
                  decimalScale={4}
                  thousandSeparator={","}
                  decimalSeparator={"."}
                  type="numeric"
                  fixedDecimalScale={true}
                />
              </Form.Item>
              <Form.Item
                label={"End Stand"}
                name={"endStand"}
                rules={[{ required: true, message: "Please input end stand!" }]}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                {/* <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                /> */}
                <InputComponent
                  decimalScale={4}
                  thousandSeparator={","}
                  decimalSeparator={"."}
                  type="numeric"
                  fixedDecimalScale={true}
                />
              </Form.Item>
              <Form.Item
                label={"Volume 27"}
                name={"volMeasured27"}
                rules={
                  uploadType === "FINAL" && formMessageRequired("Volume 27")
                }
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                {/* <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                /> */}
                <InputComponent
                  decimalScale={4}
                  thousandSeparator={","}
                  decimalSeparator={"."}
                  type="numeric"
                  fixedDecimalScale={true}
                />
              </Form.Item>
              <Form.Item
                label={"Volume 60"}
                name={"volMeasured60"}
                rules={
                  uploadType === "FINAL" && formMessageRequired("Volume 60")
                }
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                {/* <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                /> */}
                <InputComponent
                  decimalScale={4}
                  thousandSeparator={","}
                  decimalSeparator={"."}
                  type="numeric"
                  fixedDecimalScale={true}
                />
              </Form.Item>
              <Form.Item
                label={"Eng Measured"}
                name={"engMeasured"}
                rules={
                  uploadType === "FINAL" && formMessageRequired("Eng Measured")
                }
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                {/* <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                /> */}
                <InputComponent
                  decimalScale={12}
                  thousandSeparator={","}
                  decimalSeparator={"."}
                  type="numeric"
                  fixedDecimalScale={true}
                />
              </Form.Item>
              <Form.Item
                label={"GHV"}
                name={"ghv"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                {/* <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                /> */}
                <InputComponent
                  decimalScale={7}
                  thousandSeparator={","}
                  decimalSeparator={"."}
                  type="numeric"
                  fixedDecimalScale={true}
                />
              </Form.Item>
              <Form.Item label={"Volume MSCF"} name={"volMscf"}>
                <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                />
              </Form.Item>
              <Form.Item label={"Uncorrected Volume"} name={"uncorrectedValue"}>
                <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                />
              </Form.Item>
              <Form.Item label={"Taxation"} name={"taxationRowId"}>
                <InputComponent
                  onInput={(e) =>
                    (e.target.value = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1"))
                  }
                />
              </Form.Item>
              <Form.Item
                label={"Source"}
                name={"source"}
                rules={[{ required: true, message: "Please input end stand!" }]}
              >
                <Select>
                  {data_source?.map((val) => (
                    <Select.Option key={val.id} value={val.name}>
                      {val.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div w-full grid grid-cols-1>
              <Form.Item label={"Description"} name={"description"}>
                <InputComponent type={"textarea"} />
              </Form.Item>
            </div>
            <div className="mt-[30px] flex">
              <div className={"w-full flex justify-end gap-5"}>
                <Form.Item>
                  <ButtonComponent className="bg-[#fff]" onClick={handleCancel}>
                    Cancel
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent type={"submit"} htmlType={"submit"}>
                    Save
                  </ButtonComponent>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Spin>
      </ModalCustom>
    );
}

export default ModalUpdateUsage;
