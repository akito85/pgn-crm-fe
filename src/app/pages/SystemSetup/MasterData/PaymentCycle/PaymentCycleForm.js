import { Form, Spin, Select } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ConfirmModalPaymentCycle from "./Modal/ConfirmModalPaymentCycle";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import DateComponent from "../../../../../components/DateComponent";
import {
    createPaymentCycle,
    getDetailPaymentCycle,
    getTimeUnit,
    getAllApprovalList,
    getListApprovalById,
    getListCategory,
    getAllBeginEnd,
    createValidasiPaymentCycle,
    uploadAttachmentPaymentCycle,

    saveDraftPaymentCycle,
    getPaymentPeriods,
} from "../../../../../redux/slices/receipt_collection/paymentCycle";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { showModalSuccess, showModalError } from "../../../../../redux/slices/general_slice";




const steps = [
    { title: "CREATE", value: "Payment Cycle" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
];

const PaymentCycleForm = ({ type }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const [form] = Form.useForm();
    const isEdit = type === "update" || !!id;

    // State
    const [files, setFiles] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [submitData, setSubmitData] = useState(null);

    // Stepper State
    const [current, setCurrent] = useState(0);

    const [tabData] = useState([
        {
            value: "Payment Cycle",
            paramValue: ["period", "beginCycle", "endCycle", "timeUnit", "startDate", "endDate", "description"],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
    ]);

    const [valuePage, setValuePage] = useState(steps[0].value);

    useEffect(() => {
        setValuePage(steps[current].value);
    }, [current]);

    const next = () => {
        const fieldsToValidate = tabData[current]?.paramValue;

        if (current === steps.length - 1) {
            if (!files || files.length === 0) {
                dispatch(showModalError({
                    title: "Validation Failed",
                    description: "Please upload at least one attachment before proceeding."
                }));
                return;
            }
        }

        if (fieldsToValidate) {
            form.validateFields(fieldsToValidate)
                .then(() => {
                    if (current < steps.length - 1) {
                        setCurrent(current + 1);
                    }
                })
                .catch((error) => {
                    console.log("Validation failed:", error);
                });
        } else if (current < steps.length - 1) {
            setCurrent(current + 1);
        }
    };

    const prev = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    const handleSaveDraft = () => {
        const values = form.getFieldsValue();
        const dataValue = {
            id: isEdit ? id : null,
            periodId: values.period,
            beginCycle: values.beginCycle,
            endCycle: values.endCycle,
            timeUnit: values.timeUnit,
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
            description: values.description,
            statusOpen: values.statusOpen,
            appHierId: values.apphierId || selectedHierarchy,
        };

        dispatch(saveDraftPaymentCycle(dataValue))
            .unwrap()
            .then(() => {
                dispatch(showModalSuccess({
                    title: "Success",
                    description: "Draft saved successfully",
                    return: false
                }));
                navigate("/system-setup/payment-cycle");
            })
            .catch((error) => {
                const message = error?.message || "Failed to save draft";
                dispatch(showModalError({ title: "Error", description: message }));
            });
    };

    const handleClear = () => {
        if (isEdit) {
            if (id) dispatch(getDetailPaymentCycle(id));
        } else {
            form.resetFields();
            setSelectedHierarchy(null);
            setFiles([]);
        }
    };

    const {
        loading,
        data_detail,
        data_time_unit,
        dataListAppHierId,
        dataListAppHierDetail,

        dataEndBegin,
        dataPaymentPeriods,
    } = useSelector((state) => state.paymentCycle);

    // Initial Fetch
    useEffect(() => {
        dispatch(getTimeUnit());
        dispatch(getAllApprovalList());
        dispatch(getAllBeginEnd());
        dispatch(getPaymentPeriods());
        if (isEdit && id) {
            dispatch(getDetailPaymentCycle(id));
        }
    }, [dispatch, isEdit, id]);

    // Populate Form & Details
    useEffect(() => {
        if (isEdit && data_detail?.paymentCycleDetail) {
            const detail = data_detail.paymentCycleDetail;
            form.setFieldsValue({
                period: detail.periodId,
                beginCycle: detail.beginCycle,
                endCycle: detail.endCycle,
                timeUnit: detail.timeUnitId || detail.timeUnit,
                startDate: detail.startDate ? moment(detail.startDate) : null,
                endDate: detail.endDate ? moment(detail.endDate) : null,
                description: detail.description,
                statusOpen: detail.statusOpen,
                apphierId: detail.appHierId,
            });
            setSelectedHierarchy(detail.appHierId);

            // Handle Attachments
            if (data_detail?.attachmentList) {
                const mappedFiles = data_detail.attachmentList.map(item => ({
                    ...item,
                    fileName: item.fileName,
                    fileSize: item.fileSize,
                    dataType: "exist"
                }));
                setFiles(mappedFiles);
            }
        }
    }, [data_detail, isEdit, form]);

    useEffect(() => {
        if (dataListAppHierId?.length > 0) {
            const options = dataListAppHierId.map((item) => ({
                name: item.approvalName,
                value: item.appHierId,
            }));
            setAppHierOptions(options);
        }
    }, [dataListAppHierId]);

    const handleHierarchyChange = (value) => {
        setSelectedHierarchy(value);
        form.setFieldsValue({ apphierId: value });
    };

    useEffect(() => {
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
            form.setFieldsValue({ apphierId: selectedHierarchy });
        } else {
            setAppHierDataDetail([]);
        }
    }, [dispatch, selectedHierarchy, form]);

    useEffect(() => {
        if (dataListAppHierDetail?.length > 0) {
            const mappedDetail = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail.map((b, idx) => ({
                    ...b,
                    key: idx + 1,
                })),
            }));
            setAppHierDataDetail(mappedDetail);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    const handleSubmit = async (values) => {
        if (!files || files.length === 0) {
            dispatch(showModalError({
                title: "Validation Failed",
                description: "Please upload at least one attachment before submitting."
            }));
            return;
        }

        // Prepare JSON Data
        const data = {
            id: isEdit ? id : null,
            periodId: values.period,
            beginCycle: values.beginCycle,
            endCycle: values.endCycle,
            timeUnit: values.timeUnit,
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
            description: values.description,
            statusOpen: values.statusOpen,
            appHierId: values.apphierId,
        };

        dispatch(createValidasiPaymentCycle(data))
            .unwrap()
            .then((res) => {
                const sukses = res?.success;
                if (sukses === false) {
                    setModalConfirm(false);
                } else {
                    setSubmitData(data);
                    setModalConfirm(true);
                }
            })
            .catch((error) => {
                console.log("Validation failed:", error);
            });
    };

    const onConfirmSubmit = async () => {
        setModalConfirm(false);

        try {
            const response = await dispatch(createPaymentCycle(submitData)).unwrap();
            const newId = response?.data?.id;

            if (files && files.length > 0) {
                try {
                    for (const file of files) {
                        if (file.dataType !== 'exist' && file.file) {
                            const formData = new FormData();
                            formData.append("files", file.file);
                            formData.append("fileCategoryId", file.fileCategoryId);
                            formData.append("referensiId", newId);
                            formData.append("category", "PAYMENT_CYCLE");

                            await dispatch(uploadAttachmentPaymentCycle(formData)).unwrap();
                        }
                    }
                } catch (attError) {
                    console.error("Attachment upload failed:", attError);
                }
            }

            dispatch(showModalSuccess({
                title: "Success",
                description: isEdit ? "Payment Cycle updated successfully" : "Payment Cycle created successfully",
                return: false
            }));

            navigate("/system-setup/payment-cycle");

        } catch (error) {
            console.error("Creation failed:", error);
            const message = error?.message || "An error occurred";
            dispatch(showModalError({ title: "Failed", description: message }));
        }
    };

    const onFinishFailed = ({ errorFields }) => {
        if (errorFields.length > 0) {
            const firstErrorField = errorFields[0].name[0];
            const foundTab = tabData.find((tab) =>
                tab.paramValue?.includes(firstErrorField)
            );
            if (foundTab && foundTab.value !== valuePage) {
                // Find step index for foundTab
                const stepIndex = steps.findIndex(s => s.value === foundTab.value);
                if (stepIndex !== -1) setCurrent(stepIndex);
            }
        }
    };

    const disabledEndDate = (current) => {
        const startDate = form.getFieldValue("startDate");
        if (!startDate) {
            return false;
        }
        return current && current < startDate;
    };

    const routes = [
        { path: "", breadcrumbName: "System Setup" },
        { path: "", breadcrumbName: "Master Data" },
        { path: "/system-setup/payment-cycle", breadcrumbName: "Payment Cycle" },
        { path: "", breadcrumbName: isEdit ? "Update" : "Create" },
    ];

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>
                <FormStepper
                    steps={steps}
                    current={current}
                    onPrev={prev}
                    onNext={next}
                />
                <div className="w-full flex flex-col justify-start pb-5">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        onFinishFailed={onFinishFailed}
                    >
                        {/* Tab 1: Payment Cycle Information */}
                        <div style={{ display: valuePage === "Payment Cycle" ? "block" : "none" }}>
                            <CardContainer header="PAYMENT CYCLE INFORMATION">
                            <div className="grid grid-cols-5 gap-4">
                                <Form.Item
                                    label="Period"
                                    name="period"
                                    rules={[{ required: true, message: "Please select period!" }]}
                                >
                                    <SelectComponent placeholder="Select Period">
                                        {dataPaymentPeriods?.map(item => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.periodName}
                                            </Select.Option>
                                        ))}
                                    </SelectComponent>
                                </Form.Item>

                                <Form.Item
                                    label="Time Unit"
                                    name="timeUnit"
                                    rules={[{ required: true, message: "Please select time unit!" }]}
                                >
                                    <SelectComponent placeholder="Select Time Unit">
                                        {data_time_unit?.map(item => (
                                            <Select.Option key={item.id} value={item.code}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </SelectComponent>
                                </Form.Item>

                                <Form.Item
                                    label="Begin Cycle"
                                    name="beginCycle"
                                    rules={[{ required: true, message: "Please input begin cycle!" }]}
                                >
                                    <SelectComponent placeholder="Select Begin Cycle">
                                        {dataEndBegin?.map(item => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </SelectComponent>
                                </Form.Item>

                                <Form.Item
                                    label="End Cycle"
                                    name="endCycle"
                                    rules={[{ required: true, message: "Please input end cycle!" }]}
                                >
                                    <SelectComponent placeholder="Select End Cycle">
                                        {dataEndBegin?.map(item => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </SelectComponent>
                                </Form.Item>

                                <Form.Item
                                    label="Start Date"
                                    name="startDate"
                                    rules={[{ required: true, message: "Please select start date!" }]}
                                >
                                    <DateComponent
                                        placeholder="Select Start Date"
                                        onChange={(date) => {
                                            const endDate = form.getFieldValue("endDate");
                                            if (date && endDate && endDate < date) {
                                                form.setFieldsValue({
                                                    endDate: null,
                                                });
                                            }
                                        }}
                                        dateDisable={() => false}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="End Date"
                                    name="endDate"
                                    rules={[{ required: true, message: "Please select end date!" }]}
                                >
                                    <DateComponent
                                        placeholder="Select End Date"
                                        dateDisable={disabledEndDate}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Status Open"
                                    name="statusOpen"
                                >
                                    <SelectComponent placeholder="Select Status">
                                        <Select.Option value="OPEN">OPEN</Select.Option>
                                        <Select.Option value="CLOSE">CLOSE</Select.Option>
                                    </SelectComponent>
                                </Form.Item>

                                <Form.Item
                                    label="Description"
                                    name="description"
                                    className="col-span-3"
                                >
                                    <InputComponent type="textarea" rows={4} placeholder="Enter description" showCount maxLength={255} />
                                </Form.Item>
                            </div>
                            </CardContainer>
                        </div>

                        {/* Tab 2: Approval */}
                        <div style={{ display: valuePage === "Approval" ? "block" : "none" }}>
                            <CardContainer header="APPROVAL INFORMATION">
                            <ApprovalComponentGeneral
                                parentForm={form}
                                dataOption={appHierOptions}
                                dataTable={appHierDataDetail}
                                selectedHierarchy={selectedHierarchy}
                                updateSelectedHierarchy={handleHierarchyChange}
                                detailData={data_detail?.paymentCycleDetail}
                                isEditing={isEdit}
                            />
                            </CardContainer>
                        </div>

                        {/* Tab 3: Attachment */}
                        <div style={{ display: valuePage === "Attachment" ? "block" : "none" }}>
                            <CardContainer header="ATTACHMENT INFORMATION">
                            <AttachmentComponent
                                type="create"
                                data={files}
                                updateData={setFiles}
                                typeSelector="paymentCycle"
                                dispatch={dispatch}
                                getAPICategory={getListCategory}
                                service={receiptCollectionHttpService}
                                configApplication={configApp.PAYMENT_SERVICE}
                            />
                            </CardContainer>
                        </div>

                        <FormFooter
                            current={current}
                            totalSteps={steps.length}
                            onPrev={prev}
                            onNext={next}
                            onCancel={() => navigate("/system-setup/payment-cycle")}
                            onClear={handleClear}
                            onSaveDraft={handleSaveDraft}
                            type={isEdit ? "update" : "create"}
                            onSubmit={() => form.submit()}
                        />
                    </Form>
                    </div>
                {/* Confirmation Modal */}
                <ModalCustom
                    title="Confirmation"
                    isOpen={modalConfirm}
                    handleCancel={() => setModalConfirm(false)}
                    width={800}
                    type="confirmation"
                    header="Confirmation"
                    footer={
                        <div className="w-full flex justify-between gap-5 p-4">
                            <ButtonComponent
                                type="default"
                                onClick={() => setModalConfirm(false)}
                            >
                                Cancel
                            </ButtonComponent>
                            <ButtonComponent
                                type="primary"
                                onClick={onConfirmSubmit}
                            >
                                Confirm
                            </ButtonComponent>
                        </div>
                    }
                    destroyOnClose={true}
                >
                    <ConfirmModalPaymentCycle
                        data={submitData}
                        dataTimeUnit={data_time_unit}
                        dataOption={appHierOptions}
                        dataPaymentPeriods={dataPaymentPeriods}
                        selectedHierarchy={submitData?.appHierId}
                        listDataAppHierDetail={appHierDataDetail}
                        listDataAttachment={files}
                        tabData={[
                            { value: "Payment Cycle", paramValue: [] },
                            ...tabData.slice(1)
                        ]}
                    />
                </ModalCustom>
            </Spin>
        </LayoutMenu>
    );
};

PaymentCycleForm.propTypes = {
    type: PropTypes.string,
};

export default PaymentCycleForm;
