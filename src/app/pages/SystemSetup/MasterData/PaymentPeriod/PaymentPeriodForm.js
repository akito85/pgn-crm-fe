import { Form, Spin } from "antd";
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
import ConfirmModalPaymentPeriod from "./Modal/ConfirmModalPaymentPeriod";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import {
    createPaymentPeriod,
    getDetailPaymentPeriod,
    getAllApprovalListPeriod,
    getListApprovalByIdPeriod,
    getListCategoryPeriod,
    createValidasiPaymentPeriod,
    uploadAttachmentPaymentPeriod,
    saveDraftPaymentPeriod,
} from "../../../../../redux/slices/receipt_collection/paymentPeriod";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { showModalSuccess, showModalError } from "../../../../../redux/slices/general_slice";




const steps = [
    { title: "CREATE", value: "Payment Period" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
];

const PaymentPeriodForm = ({ type }) => {
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
            value: "Payment Period",
            paramValue: ["periodName", "startDate", "endDate", "description"],
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
            periodName: values.periodName,
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
            description: values.description,
            appHierId: values.apphierId || selectedHierarchy,
        };

        dispatch(saveDraftPaymentPeriod(dataValue))
            .unwrap()
            .then(() => {
                dispatch(showModalSuccess({
                    title: "Success",
                    description: "Draft saved successfully",
                    return: false
                }));
                navigate("/system-setup/payment-period");
            })
            .catch((error) => {
                const message = error?.message || "Failed to save draft";
                dispatch(showModalError({ title: "Error", description: message }));
            });
    };

    const handleClear = () => {
        if (isEdit) {
            if (id) dispatch(getDetailPaymentPeriod(id));
        } else {
            form.resetFields();
            setSelectedHierarchy(null);
            setFiles([]);
        }
    };

    const {
        loading,
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail,
    } = useSelector((state) => state.paymentPeriod);

    // Initial Fetch
    useEffect(() => {
        dispatch(getAllApprovalListPeriod());
        if (isEdit && id) {
            dispatch(getDetailPaymentPeriod(id));
        }
    }, [dispatch, isEdit, id]);

    // Populate Form & Details
    useEffect(() => {
        if (isEdit && data_detail?.paymentPeriodDetail) {
            const detail = data_detail.paymentPeriodDetail;
            form.setFieldsValue({
                periodName: detail.periodName,
                startDate: detail.startDate ? moment(detail.startDate) : null,
                endDate: detail.endDate ? moment(detail.endDate) : null,
                description: detail.description,
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
            dispatch(getListApprovalByIdPeriod({ id: selectedHierarchy }));
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
        // Validasi attachment
        if (!files || files.length === 0) {
            dispatch(showModalError({
                title: "Validation Failed",
                description: "Please upload at least one attachment before submitting."
            }));
            return;
        }

        if (values.startDate && values.endDate) {
            if (values.endDate.isBefore(values.startDate)) {
                dispatch(showModalError({
                    title: "Validation Failed",
                    description: "End date must be after start date."
                }));
                return;
            }

            const diffMonths = values.endDate.diff(values.startDate, 'months');
            if (diffMonths > 12) {
                dispatch(showModalError({
                    title: "Validation Failed",
                    description: "Period cannot exceed 12 months."
                }));
                return;
            }
        }

        if (values.periodName && !/^[a-zA-Z0-9\s\-_]+$/.test(values.periodName)) {
            dispatch(showModalError({
                title: "Validation Failed",
                description: "Period name can only contain letters, numbers, spaces, hyphens, and underscores."
            }));
            return;
        }

        // Prepare JSON Data
        const data = {
            id: isEdit ? id : null,
            periodName: values.periodName,
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
            description: values.description,
            appHierId: values.apphierId,
        };

        dispatch(createValidasiPaymentPeriod(data))
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

    const rollbackAttachments = async (attachmentIds) => {
        for (const attId of attachmentIds) {
            try {
                await receiptCollectionHttpService.deleteData(`/v1/dbs/api/attachment/delete/${attId}`);
            } catch (rollbackErr) {
                console.error(`Failed to rollback attachment ${attId}:`, rollbackErr);
            }
        }
    };

    const onConfirmSubmit = async () => {
        setModalConfirm(false);
        const uploadedAttachmentIds = [];

        try {
            const response = await dispatch(createPaymentPeriod(submitData)).unwrap();
            const newId = response?.data?.id;

            if (files && files.length > 0) {
                for (const file of files) {
                    if (file.dataType !== 'exist' && file.file) {
                        try {
                            const formData = new FormData();
                            formData.append("files", file.file);
                            formData.append("fileCategoryId", file.fileCategoryId);
                            formData.append("referensiId", newId);
                            formData.append("category", "PAYMENT_PERIOD");

                            const uploadResult = await dispatch(uploadAttachmentPaymentPeriod(formData)).unwrap();
                            uploadedAttachmentIds.push(uploadResult?.data?.id);
                        } catch (attError) {
                            // Rollback: hapus semua attachment yang sudah ter-upload
                            await rollbackAttachments(uploadedAttachmentIds);
                            throw new Error('Attachment upload failed. All data has been rolled back.');
                        }
                    }
                }
            }

            dispatch(showModalSuccess({
                title: "Success",
                description: isEdit ? "Payment Period updated successfully" : "Payment Period created successfully",
                return: false
            }));

            navigate("/system-setup/payment-period");

        } catch (error) {
            if (uploadedAttachmentIds.length > 0) {
                await rollbackAttachments(uploadedAttachmentIds);
            }
            console.error("Submission failed:", error);
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
        { path: "/system-setup/payment-period", breadcrumbName: "Payment Period" },
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
                        {/* Tab 1: Payment Period Information */}
                        <div style={{ display: valuePage === "Payment Period" ? "block" : "none" }}>
                            <CardContainer header="PAYMENT PERIOD INFORMATION">
                             <div className="grid grid-cols-5 gap-4">
                                 <Form.Item
                                     label="Period Name"
                                     name="periodName"
                                     rules={[{ required: true, message: "Please input period name!" }]}
                                 >
                                     <InputComponent placeholder="Enter Period Name" />
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
                                     label="Description"
                                     name="description"
                                     className="col-span-2"
                                 >
                                     <InputComponent type="textarea" rows={4} placeholder="Enter description" showCount maxLength={255} />
                                 </Form.Item>
                             </div></CardContainer>
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
                                detailData={data_detail?.paymentPeriodDetail}
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
                                typeSelector="paymentPeriod"
                                dispatch={dispatch}
                                getAPICategory={getListCategoryPeriod}
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
                            onCancel={() => navigate("/system-setup/payment-period")}
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
                    <ConfirmModalPaymentPeriod
                        data={submitData}
                        dataOption={appHierOptions}
                        selectedHierarchy={submitData?.appHierId}
                        listDataAppHierDetail={appHierDataDetail}
                        listDataAttachment={files}
                        tabData={[
                            { value: "Payment Period", paramValue: [] },
                            ...tabData.slice(1)
                        ]}
                    />
                </ModalCustom>
            </Spin>
        </LayoutMenu>
    );
};

PaymentPeriodForm.propTypes = {
    type: PropTypes.string,
};

export default PaymentPeriodForm;
