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
}) => {
    const { data_asset_type, data_account_number, data_source, loading } = useSelector((state) => state.monitoring_usage);
    const config = useSelector((state) => state.globalProp.globalProp);
    const dispatch = useDispatch();
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (isOpen === true) {
            dispatch(getAssetType())
            dispatch(getAccountNumber())
            dispatch(getSource())
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (record) {
            const parseDate = (dateValue) => {
                if (!dateValue || !hasValue(dateValue)) return null;
                if (moment.isMoment(dateValue)) return dateValue;
                const parsed = moment(dateValue, [
                    dateFormatting.dateFormal,
                    dateFormatting.date,
                    dateFormatting.dateTime,
                    moment.ISO_8601
                ], true);
                return parsed.isValid() ? parsed : null;
            };

            const parseTime = (timeValue) => {
                if (!timeValue || !hasValue(timeValue)) return null;
                if (moment.isMoment(timeValue)) return timeValue;
                const parsed = moment(timeValue, ['HH:mm', 'HH:mm:ss'], true);
                return parsed.isValid() ? parsed : null;
            };

            // Parse numeric value - handle both number and formatted string
            const parseNumeric = (value) => {
                if (value === null || value === undefined) return null;
                if (typeof value === 'number') return value;
                if (typeof value === 'string') {
                    // Remove thousand separator
                    const cleaned = value.replace(/,/g, '');
                    const parsed = parseFloat(cleaned);
                    return isNaN(parsed) ? null : parsed;
                }
                return null;
            };

            form.setFieldsValue({
                accountNumber: record?.accountNumber,
                accountName: record?.accountName,
                costCenter: record?.costCenter,
                assetSerialNum: record?.assetSerialNumber || record?.assetSerialNum,
                assetType: record?.assetType,
                fdate: parseDate(record?.fdate),
                fhour: parseTime(record?.fhour),
                measDate: parseDate(record?.measDate),
                streamId: parseNumeric(record?.streamId),
                temperature: parseNumeric(record?.temperature),
                pressure: parseNumeric(record?.pressure),
                correctionFactor: parseNumeric(record?.correctionFactor),
                calorie: parseNumeric(record?.calorie),
                beginStand: parseNumeric(record?.beginStand),
                endStand: parseNumeric(record?.endStand),
                volMeasured27: parseNumeric(record?.volMeasured27),
                volMeasured60: parseNumeric(record?.volMeasured60),
                engMeasured: parseNumeric(record?.engMeasured),
                ghv: parseNumeric(record?.ghv),
                volMscf: parseNumeric(record?.volMscf),
                uncorrectedValue: parseNumeric(record?.uncorrectedValue),
                sourceRowId: parseNumeric(record?.sourceRowId),
                sourceName: record?.sourceName,
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

    // Auto-fill Date & Hour from measDate
    const handleMeasDateChange = (value) => {
        if (value) {
            form.setFieldsValue({
                fdate: value,
                fhour: value,
            });
        } else {
            form.setFieldsValue({
                fdate: null,
                fhour: null,
            });
        }
    };

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
                  format={dateFormatting.meas_date_input}
                  showTime
                  onChange={handleMeasDateChange}
                />
              </Form.Item>
              <Form.Item label={"Date"} name={"fdate"}>
                <DatePicker
                  className="w-full"
                  format={dateFormatting.date}
                  disabled
                />
              </Form.Item>
              <Form.Item label={"Hour"} name={"fhour"}>
                <TimePicker
                  showNow={false}
                  className="w-full"
                  format={"HH:mm"}
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={"Stream Id"}
                name={"streamId"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  type="numeric"
                  decimalScale={0}
                  thousandSeparator={false}
                />
              </Form.Item>
              <Form.Item
                label={"Temperature"}
                name={"temperature"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  type="numeric"
                  decimalScale={config?.DECIMAL_SCALE_TEMPERATUR ?? 2}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_TEMPERATUR ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_TEMPERATUR ?? "."}
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_TEMPERATUR ?? true}
                />
              </Form.Item>
              <Form.Item
                label={"Pressure"}
                name={"pressure"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  type="numeric"
                  decimalScale={config?.DECIMAL_SCALE_TEKANAN ?? 2}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_TEKANAN ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_TEKANAN ?? "."}
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_TEKANAN ?? true}
                />
              </Form.Item>
              <Form.Item
                label={"Correction Factor"}
                name={"correctionFactor"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  type="numeric"
                  decimalScale={config?.DECIMAL_SCALE_USAGE ?? 4}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_USAGE ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_USAGE ?? "."}
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_USAGE ?? true}
                />
              </Form.Item>
              <Form.Item
                label={"Calorie"}
                name={"calorie"}
                rules={[{ required: true, message: "Please input calorie!" }]}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  decimalScale={config?.DECIMAL_SCALE_GHV ?? 4}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_GHV ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_GHV ?? "."}
                  type="numeric"
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_GHV ?? true}
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
                <InputComponent
                  decimalScale={config?.DECIMAL_SCALE_USAGE ?? 2}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_USAGE ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_USAGE ?? "."}
                  type="numeric"
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_USAGE ?? true}
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
                <InputComponent
                  decimalScale={config?.DECIMAL_SCALE_USAGE ?? 2}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_USAGE ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_USAGE ?? "."}
                  type="numeric"
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_USAGE ?? true}
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
                <InputComponent
                  decimalScale={config?.DECIMAL_SCALE_VOLUME ?? 2}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_VOLUME ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_VOLUME ?? "."}
                  type="numeric"
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_VOLUME ?? true}
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
                <InputComponent
                  decimalScale={config?.DECIMAL_SCALE_VOLUME ?? 2}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_VOLUME ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_VOLUME ?? "."}
                  type="numeric"
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_VOLUME ?? true}
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
                <InputComponent
                  decimalScale={config?.DECIMAL_SCALE_ENERGI ?? 4}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_ENERGI ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_ENERGI ?? "."}
                  type="numeric"
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_ENERGI ?? true}
                />
              </Form.Item>
              <Form.Item
                label={"GHV"}
                name={"ghv"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  decimalScale={config?.DECIMAL_SCALE_GHV ?? 4}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_GHV ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_GHV ?? "."}
                  type="numeric"
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_GHV ?? true}
                />
              </Form.Item>
              <Form.Item
                label={"Volume MSCF"}
                name={"volMscf"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  type="numeric"
                  decimalScale={config?.DECIMAL_SCALE_VOLUME ?? 2}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_VOLUME ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_VOLUME ?? "."}
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_VOLUME ?? true}
                />
              </Form.Item>
              <Form.Item
                label={"Uncorrected Volume"}
                name={"uncorrectedValue"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  type="numeric"
                  decimalScale={config?.DECIMAL_SCALE_VOLUME ?? 2}
                  thousandSeparator={config?.THOUSAND_SEPARATOR_VOLUME ?? ","}
                  decimalSeparator={config?.DECIMAL_SEPARATOR_VOLUME ?? "."}
                  fixedDecimalScale={config?.FIXED_DECIMAL_SCALE_VOLUME ?? true}
                />
              </Form.Item>
              <Form.Item
                label={"Source Row ID"}
                name={"sourceRowId"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
              >
                <InputComponent
                  type="numeric"
                  decimalScale={0}
                  thousandSeparator={false}
                />
              </Form.Item>
              <Form.Item label={"Source Name"} name={"sourceName"}>
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Source"}
                name={"source"}
                rules={[{ required: true, message: "Please input source!" }]}
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
            <div className="w-full grid grid-cols-1">
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