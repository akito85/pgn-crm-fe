import { DatePicker, Form, Select, Spin, TimePicker } from "antd";
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
    updateSingleUsage, // ✅ Import action baru
    getAccountNumber, 
    getAssetType, 
    getSource 
} from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { hasValue, dateFormatting } from "../../../../utils"; // ✅ Import dateFormatting jika ada
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
    
    const { data_asset_type, data_account_number, data_source, loading } = useSelector(
        (state) => state.monitoring_usage
    );
    
    const { state } = location || {};
    const { id, record } = state || {};
    const recordId = record?.recordId; // ✅ Ambil recordId dari record

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
        
        // Set initial form values
        if (record) {
            form.setFieldsValue({
                accountNumber: record?.accountNumber,
                accountName: record?.accountName,
                costCenter: record?.costCenter,
                billingPeriod: record?.billingPeriod ? moment(record?.billingPeriod, "MMM YYYY") : null,
                assetSerialNum: record?.assetSerialNum,
                assetType: record?.assetType,
                fdate: record?.fdate ? moment(record?.fdate, "DD-MM-YYYY") : null,
                fhour: record?.fhour ? moment(record?.fhour, "HH:mm") : null,
                measDate: record?.measDate ? moment(record?.measDate, "DD-MM-YYYY") : null,
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
                taxationRowId: record?.taxationRowId || record?.taxation,
                source: record?.source,
                description: record?.description,
            });
        }
    }, [form, dispatch, record]);

    // ✅ Update handleSave untuk hit API
    const handleSave = async (formValue) => {
        try {
            if (!recordId) {
                console.error("No recordId found");
                return;
            }

            // Prepare request body sesuai format backend
            const requestBody = {
                accountNumber: formValue?.accountNumber || null,
                accountName: formValue?.accountName || null,
                costCenter: formValue?.costCenter || null,
                billingPeriod: formValue?.billingPeriod
                    ? moment(formValue?.billingPeriod).format("YYYY-MM-DD") + "T00:00:00.000+00:00"
                    : null,
                assetSerialNum: formValue?.assetSerialNum || null,
                assetType: formValue?.assetType || null,
                fdate: formValue?.fdate
                    ? moment(formValue?.fdate).format("YYYY-MM-DD")
                    : null,
                fhour: hasValue(formValue?.fhour)
                    ? moment(formValue?.fhour).format("HH:mm:ss")
                    : null,
                measDate: formValue?.measDate
                    ? moment(formValue?.measDate).format("YYYY-MM-DDTHH:mm:ss")
                    : null,
                streamId: formValue?.streamId ? parseInt(formValue?.streamId) : null,
                temperature: formValue?.temperature ? parseFloat(formValue?.temperature) : null,
                pressure: formValue?.pressure ? parseFloat(formValue?.pressure) : null,
                correctionFactor: formValue?.correctionFactor ? parseFloat(formValue?.correctionFactor) : null,
                calorie: formValue?.calorie ? parseFloat(formValue?.calorie) : null,
                beginStand: formValue?.beginStand ? parseFloat(formValue?.beginStand) : null,
                endStand: formValue?.endStand ? parseFloat(formValue?.endStand) : null,
                volMeasured27: formValue?.volMeasured27 ? parseFloat(formValue?.volMeasured27) : null,
                volMeasured60: formValue?.volMeasured60 ? parseFloat(formValue?.volMeasured60) : null,
                engMeasured: formValue?.engMeasured ? parseFloat(formValue?.engMeasured) : null,
                ghv: formValue?.ghv ? parseFloat(formValue?.ghv) : null,
                volMscf: formValue?.volMscf ? parseFloat(formValue?.volMscf) : null,
                uncorrectedValue: formValue?.uncorrectedValue ? parseFloat(formValue?.uncorrectedValue) : null,
                taxationRowId: formValue?.taxationRowId || null,
                source: formValue?.source || null,
                description: formValue?.description || null,
            };

            // Dispatch update ke API
            const resultAction = await dispatch(
                updateSingleUsage({
                    recordId: recordId,
                    data: requestBody,
                })
            );

            // Jika berhasil, navigate back
            if (updateSingleUsage.fulfilled.match(resultAction)) {
                navigate(-1);
            }
        } catch (error) {
            console.error("Error updating usage:", error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleAccountNumberChange = (value, option) => {
        const selectedAccount = data_account_number?.data?.find(
            (account) => account.accountNumber === value
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
                                rules={[{ required: true, message: "Please input your account number!" }]}
                            >
                                <Select onChange={handleAccountNumberChange}>
                                    {data_account_number?.data?.map((account) => (
                                        <Select.Option key={account.accountId} value={account.accountNumber}>
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
                                rules={[{ required: true, message: "Please input your Billing Period!" }]}
                            >
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
                                rules={[{ required: true, message: "Please input your asset serial number!" }]}
                            >
                                <InputComponent />
                            </Form.Item>
                            <Form.Item
                                label={"Asset Type"}
                                name={"assetType"}
                                rules={[{ required: true, message: "Please input your asset type!" }]}
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
                                rules={[{ required: true, message: "Please input your measurement date" }]}
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
                                rules={[{ required: true, message: "Please input begin stand!" }]}
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