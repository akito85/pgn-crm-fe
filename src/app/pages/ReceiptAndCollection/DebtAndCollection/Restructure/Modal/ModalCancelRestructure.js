import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { FormStepper } from "../../../../../../components/FormStepNavigation";
import SectionCard from "../../../../../../components/SectionCard";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { 
    getAllApprovalList, 
    getListApprovalById, 
    getListCategory,
    cancelRestructure,
    getCancelReasons
} from "../../../../../../redux/slices/receipt_collection/restructure";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../../constants/configApp";
import { uploadAttachments } from "../../../../../../utils/uploadHelper";

const ModalCancelRestructure = ({
    isOpen,
    handleCancel,
    record,
    onSuccess
}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Approval & Attachment states
    const [selectedHierarchy, setSelectedHierarchy] = useState();
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [listDataAttachment, setListDataAttachment] = useState([]);

    const { 
        dataListAppHierId, 
        dataListAppHierDetail,
        dataListCategory,
        cancelReasons,
        loadingCancelReasons,
        loading_approval_detail,
        loading 
    } = useSelector((state) => state.restructure);

    const steps = [
        { title: "CREATE", value: "Create" },
        { title: "APPROVAL", value: "Approval" },
        { title: "ATTACHMENT", value: "Attachment" },
    ];

    useEffect(() => {
        if (isOpen) {
            dispatch(getAllApprovalList());
            dispatch(getListCategory());
            dispatch(getCancelReasons());
            setCurrent(0);
            form.resetFields();
            setSelectedHierarchy(null);
            setListDataAttachment([]);
        }
    }, [isOpen, dispatch, form]);

    useEffect(() => {
        if (dataListAppHierId && dataListAppHierId.length > 0) {
            const tempAppHier = dataListAppHierId.map((appHier) => ({
                name: appHier.approvalName,
                value: appHier.appHierId,
            }));
            setAppHierOptions(tempAppHier);
        }
    }, [dataListAppHierId]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            const data = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail.map((b, index) => ({
                    ...b,
                    key: index + 1,
                })),
            }));
            setAppHierDataDetail(data);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    useEffect(() => {
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    const next = () => {
        if (current === 0) {
            form.validateFields(["reason", "cancelDate", "remark"]).then(() => {
                setCurrent(current + 1);
            }).catch((errorInfo) => {
                console.log("Validation failed:", errorInfo);
                message.warning("Mohon lengkapi field mandatory");
            });
            return;
        }
        if (current === 1) {
            if (!selectedHierarchy) {
                message.warning("Approval Hierarchy is mandatory");
                return;
            }
            setCurrent(current + 1);
            return;
        }
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleSave = async () => {
        const values = form.getFieldsValue(true);
        setIsSubmitting(true);
        
        const body = {
            id: record?.id,
            reason: values.reason,
            cancelDate: values.cancelDate?.format("YYYY-MM-DD"),
            remark: values.remark,
            appHierId: selectedHierarchy,
            attachmentIds: listDataAttachment.map(a => a.id).filter(Boolean)
        };

        // Note: For now using existing cancelRestructure, but in real case might need a body-based one
        dispatch(cancelRestructure({ id: record?.id, body })).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
                if (newAttachments.length > 0) {
                    uploadAttachments(newAttachments, record?.id, "CANCEL_RESTRUCTURE",
                        (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
                    ).catch(err => console.error("Attachment upload failed", err));
                }
                message.success("Request Cancel Payment Plan berhasil disubmit!");
                onSuccess();
                handleCancel();
            }
            setIsSubmitting(false);
        }).catch(() => {
            setIsSubmitting(false);
        });
    };

    const footer = (
        <div className="w-full flex justify-between p-4 bg-white border-t">
            <ButtonComponent onClick={handleCancel} variant="outlined">
                Cancel
            </ButtonComponent>
            <div className="flex gap-4">
                {current > 0 && (
                    <ButtonComponent onClick={prev} variant="outlined">
                        Previous
                    </ButtonComponent>
                )}
                {current < steps.length - 1 ? (
                    <ButtonComponent type="primary" onClick={next}>
                        Next
                    </ButtonComponent>
                ) : (
                    <ButtonComponent type="primary" onClick={handleSave} loading={isSubmitting}>
                        Submit
                    </ButtonComponent>
                )}
            </div>
        </div>
    );

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="CANCEL PAYMENT PLAN"
            width={1000}
            footer={footer}
        >
            <div className="p-5">
                <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />

                <Form layout="vertical" form={form} className="mt-8">
                    <div className={current !== 0 ? "hidden" : ""}>
                        <SectionCard title="CANCEL PAYMENT PLAN INFORMATION">
                            <div className="grid grid-cols-2 gap-x-8">
                                <Form.Item 
                                    name="reason" 
                                    label="Reason" 
                                    rules={[{ required: true, message: "Reason is required" }]}
                                >
                                    <Select 
                                        placeholder="Select Reason"
                                        loading={loadingCancelReasons}
                                    >
                                        {cancelReasons?.map(reason => (
                                            <Select.Option key={reason.key || reason.value} value={reason.key || reason.value}>
                                                {reason.value}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item 
                                    name="cancelDate" 
                                    label="Cancel Date" 
                                    rules={[{ required: true, message: "Cancel Date is required" }]}
                                >
                                    <DatePicker className="w-full" placeholder="Select Date" />
                                </Form.Item>
                                <Form.Item 
                                    name="remark" 
                                    label="Remark" 
                                    rules={[{ required: true, message: "Remark is required" }]}
                                    className="col-span-2"
                                >
                                    <Input.TextArea rows={4} placeholder="Input Remark" />
                                </Form.Item>
                            </div>
                        </SectionCard>
                    </div>

                    <div className={current !== 1 ? "hidden" : ""}>
                        <SectionCard title="APPROVAL INFORMATION">
                            <SubSectionCard>
                                <ApprovalComponentGeneral
                                    dataTable={appHierDataDetail || []}
                                    dataOption={appHierOptions || []}
                                    selectedHierarchy={selectedHierarchy}
                                    updateSelectedHierarchy={setSelectedHierarchy}
                                    loading={loading_approval_detail}
                                />
                            </SubSectionCard>
                        </SectionCard>
                    </div>

                    <div className={current !== 2 ? "hidden" : ""}>
                        <SectionCard title="ATTACHMENT INFORMATION">
                            <SubSectionCard>
                                <AttachmentComponent
                                    type={"create"}
                                    data={listDataAttachment || []}
                                    dataListCategory={dataListCategory || []}
                                    updateData={setListDataAttachment}
                                    typeSelector="restructure"
                                    dispatch={dispatch}
                                    getAPICategory={getListCategory}
                                    service={receiptCollectionHttpService}
                                    configApplication={configApp.PAYMENT_SERVICE}
                                    typeRBI={"data"}
                                />
                            </SubSectionCard>
                        </SectionCard>
                    </div>
                </Form>
            </div>
        </ModalCustom>
    );
};

export default ModalCancelRestructure;
