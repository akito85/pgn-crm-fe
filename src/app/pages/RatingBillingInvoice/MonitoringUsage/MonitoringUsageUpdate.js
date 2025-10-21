import { DatePicker, Form, Input, Select, Spin, TimePicker } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import BaseContainer from "../../../../components/BaseContainer";
import TextArea from "antd/lib/input/TextArea";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import {
  addUpdatedData,
  clearUpdated,
  getAccountNumber,
  getAssetType,
  getSource,
} from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { hasValue } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";

const MonitoringUsageUpdate = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [period, setPeriod] = useState("");
  const [hour, setHour] = useState("");
  const [date, setDate] = useState("");
  const [measDate, setMeasDate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { data_asset_type, data_account_number, data_source, loading } =
    useSelector((state) => state.monitoring_usage);
  const { state } = location || {};
  const { id, record } = state || {};
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_USAGE_VIEW,
      breadcrumbName: "Monitoring Usage",
    },
    {
      path: "",
      breadcrumbName: "Detail Batch Usage",
    },
    {
      path: "",
      breadcrumbName: "Update Batch Usage",
    },
  ];

  useEffect(() => {
    dispatch(getAssetType());
    dispatch(getAccountNumber());
    dispatch(getSource());
    form.setFieldsValue({
      accountNumber: record?.accountNumber,
      accountName: record?.accountName,
      costCenter: record?.costCenter,
      billingPeriod: moment(record?.billingPeriod, "MMM YYYY"),
      assetSerialNum: record?.assetSerialNum,
      assetType: record?.assetType,
      fdate: moment(record?.fdate, "DD-MM-YYYY"),
      fhour: moment(record?.fhour, "HH:mm"),
      measDate: moment(record?.measDate, "DD-MM-YYYY"),
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
      taxationRowId: record?.taxation,
      source: record?.source,
      description: record?.description,
    });
  }, [form, dispatch, record]);
  const handleSave = (formValue) => {
    const selectedSource = data_source.find(
      (source) => source.id === formValue.source,
    );
    const sourceName = selectedSource ? selectedSource.name : "";

    const updatedData = {
      ...formValue,
      billingPeriod:
        moment(formValue.billingPeriod).format("MMM YYYY") || period,
      fdate: moment(formValue.date).format("DD-MM-yyyy") || date,
      source: formValue.source || sourceName,
      measDate: moment(formValue.measDate).format("DD-MM-YYYY") || measDate,
      engMeasured: parseFloat(formValue.engMeasured) || null,
      temperature: parseFloat(formValue.temperature) || null,
      pressure: parseFloat(formValue.pressure) || null,
      correctionFactor: parseFloat(formValue.correctionFactor) || null,
      beginStand: parseFloat(formValue.beginStand) || null,
      endStand: parseFloat(formValue.endStand) || null,
      volMeasured27: parseFloat(formValue.volMeasured27) || null,
      volMeasured60: parseFloat(formValue.volMeasured60) || null,
      calorie: parseFloat(formValue.calorie) || null,
      fhour: hasValue(formValue.fhour)
        ? moment(formValue.fhour).format("HH:mm")
        : hour,
      ...Object.keys(record).reduce((acc, key) => {
        if (!formValue.hasOwnProperty(key)) {
          acc[key] = record[key];
        }
        return acc;
      }, {}),
      status: "SUCCESS",
    };
    dispatch(addUpdatedData(updatedData));
    navigate(-1);
  };

  const handleBack = () => {
    // dispatch(clearUpdated())
    navigate(-1);
  };

  const handleAccountNumberChange = (value, option) => {
    const selectedAccount = data_account_number?.data?.find(
      (account) => account.accountNumber === value,
    );

    if (selectedAccount) {
      form.setFieldsValue({
        accountName: selectedAccount.accountName,
        costCenter: selectedAccount.costCenter,
      });
      setSelectedAccount(selectedAccount);
    }
  };
  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />
        <Form
          labelCol={{
            span: 12,
          }}
          labelAlign="left"
          form={form}
          onFinish={handleSave}
          layout="vertical"
        >
          <BaseContainer header={"Update Usage List"}>
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
                <Select onChange={handleAccountNumberChange}>
                  {data_account_number?.data?.map((account) => (
                    <Select.Option
                      key={account.accountId}
                      value={account.accountNumber}
                    >
                      {account.accountNumber}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={"Account Name"} name={"accountName"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Cost Center"} name={"costCenter"}>
                <InputComponent />
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
                {/* <InputComponent /> */}
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
                    <Select.Option key={assetType.id} value={assetType.name}>
                      {assetType.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={"F Date"} name={"fdate"}>
                <DatePicker
                  className="w-full"
                  format={"DD-MM-YYYY"}
                  onChange={(date, dateString) => setDate(dateString)}
                />
              </Form.Item>
              <Form.Item label={"F Hour"} name={"fhour"}>
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
                  format={"DD-MM-YYYY"}
                  onChange={(date, dateString) => setMeasDate(dateString)}
                />
              </Form.Item>
              <Form.Item label={"Stream Id"} name={"streamId"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Temperature"} name={"temperature"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Pressure"} name={"pressure"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Correction Factor"} name={"correctionFactor"}>
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Calorie"}
                name={"calorie"}
                rules={[{ required: true, message: "Please input calorie!" }]}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Begin Stand"}
                name={"beginStand"}
                rules={[
                  { required: true, message: "Please input begin stand!" },
                ]}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"End Stand"}
                name={"endStand"}
                rules={[{ required: true, message: "Please input end stand!" }]}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Volume 27"} name={"volMeasured27"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Volume 60"} name={"volMeasured60"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Eng Measured"} name={"engMeasured"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"GHV"} name={"ghv"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Volume MSCF"} name={"volMscf"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Uncorrected Volume"} name={"uncorrectedValue"}>
                <InputComponent />
              </Form.Item>
              <Form.Item label={"Taxation"} name={"taxationRowId"}>
                <InputComponent />
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
                <TextArea />
              </Form.Item>
            </div>
          </BaseContainer>
          <div className="mt-[30px] flex">
            <div className={"w-full flex justify-end gap-5"}>
              <Form.Item>
                <ButtonComponent className="bg-[#fff]" onClick={handleBack}>
                  Cancel
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent type="submit" htmlType={"submit"}>
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>
      </LayoutMenu>
    </Spin>
  );
};

export default MonitoringUsageUpdate;
