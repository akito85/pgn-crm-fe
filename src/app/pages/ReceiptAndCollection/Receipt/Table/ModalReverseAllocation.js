import { useState, useEffect } from "react";
import { Form, Alert, Spin, Button } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import InputComponent from "../../../../../components/InputComponent";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import { useDispatch, useSelector } from "react-redux";
import {
    getListCategoryReceipt,
    getAllApprovalListReceipt,
    getListApprovalByIdReceipt,
    reverseAllocation,
} from "../../../../../redux/slices/receipt_collection/receipt";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ModalReverseAllocation = ({ isOpen, handleCancel, record, receiptId, onSuccess }) => {
    const dispatch = useDispatch();
    const { loading, dataListAppHierId, dataListAppHierDetail } = useSelector(
        (state) => state.receipt
    );

    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [forceObj, setForceObj] = useState({});
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [confirmationTab, setConfirmationTab] = useState("Allocation");

    useEffect(() => {
        if (isOpen) {
            dispatch(getAllApprovalListReceipt());
            setCurrentStep(0);
            setForceObj({});
            setListDataAttachment([]);
            form.resetFields();
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
        if (forceObj.approvalHierarchy) {
            dispatch(getListApprovalByIdReceipt({ id: forceObj.approvalHierarchy }));
        }
    }, [forceObj.approvalHierarchy, dispatch]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            const data = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail?.map((b, idx) => ({
                    ...b,
                    key: idx + 1,
                })) || [],
            }));
            setAppHierDataDetail(data);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    const handleForceObj = (e, type) => {
        let result;
        switch (type) {
            case "remark":
                result = e.target.value;
                break;
            default:
                result = e;
                break;
        }
        setForceObj((prevState) => ({
            ...prevState,
            [type]: result,
        }));

        if (type === "approvalHierarchy") {
            form.setFieldsValue({ approvalHierarchy: result });
        }

        return result;
    };

    const steps = [
        { title: "Allocation Information" },
        { title: "Approval Information" },
        { title: "Attachment Information" },
        { title: "Confirmation" },
    ];

    const handleNext = () => {
        // Validasi sebelum next
        if (currentStep === 0 && !forceObj.remark) return;
        if (currentStep === 1 && !forceObj.approvalHierarchy) return;
        
        setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const onSubmit = async () => {
        const body = {
            receiptId: receiptId,
            allocationId: record?.id,
            reason: forceObj.remark,
            approvalHierarchyId: forceObj.approvalHierarchy,
            attachments: listDataAttachment.map((item) => ({
                attachmentId: item.id,
                category: item.category,
            })),
        };

        const result = await dispatch(reverseAllocation(body));
        if (reverseAllocation.fulfilled.match(result)) {
            onSuccess();
            handleCancel();
        }
    };

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header={"Reverse Allocation"}
            width={1000}
            footer={null}
        >
            <FormStepper
                steps={steps}
                current={currentStep}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            <div className="w-full">
                <Spin spinning={loading}>
                    <Form layout="vertical">
                        {currentStep === 0 && (
                            <div className="flex flex-col gap-4">
                                <Alert
                                    message="Information"
                                    description="You are about to reverse the following allocation. This action requires approval."
                                    type="info"
                                    showIcon
                                />
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <DetailText label="Allocation Number">{record?.allocationNumber}</DetailText>
                                    <DetailText label="Allocation Amount">{record?.allocationAmount?.toLocaleString('en-US')}</DetailText>
                                    <DetailText label="Billing Item">{record?.billingItem}</DetailText>
                                    <DetailText label="Invoice Number">{record?.invoiceNumber}</DetailText>
                                </div>
                                <Form.Item label="Reason for Reverse" required>
                                    <InputComponent
                                        type="textarea"
                                        rows={4}
                                        value={forceObj.remark}
                                        onChange={(e) => handleForceObj(e, "remark")}
                                        placeholder="Enter reason for reversal..."
                                    />
                                </Form.Item>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <ApprovalSectionForm
                                dataTable={appHierDataDetail}
                                dataOption={appHierOptions}
                                selectedHierarchy={forceObj.approvalHierarchy}
                                updateSelectedHierarchy={(e) => handleForceObj(e, "approvalHierarchy")}
                            />
                        )}

                        {currentStep === 2 && (
                            <AttachmentComponent
                                data={listDataAttachment}
                                updateData={setListDataAttachment}
                                typeSelector="receipt"
                                dispatch={dispatch}
                                getAPICategory={getListCategoryReceipt}
                                service={receiptCollectionHttpService}
                                configApplication={configApp.PAYMENT_SERVICE}
                            />
                        )}

                        {currentStep === 3 && (
                            <div className="flex flex-col gap-4">
                                <RadioTabs
                                    data={[
                                        { value: "Allocation" },
                                        { value: "Approval" },
                                        { value: "Attachment" },
                                    ]}
                                    onChange={(e) => setConfirmationTab(e.target.value)}
                                    currentPosition={confirmationTab}
                                />
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    {confirmationTab === "Allocation" && (
                                        <div className="flex flex-col gap-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <DetailText label="Allocation Number">{record?.allocationNumber}</DetailText>
                                                <DetailText label="Allocation Amount">{record?.allocationAmount?.toLocaleString('en-US')}</DetailText>
                                            </div>
                                            <DetailText label="Reason">{forceObj.remark}</DetailText>
                                        </div>
                                    )}
                                    {confirmationTab === "Approval" && (
                                        <ApprovalSectionForm
                                            showSelect={false}
                                            disableSelect={true}
                                            approvalName={
                                                appHierOptions.find((opt) => opt.value === forceObj.approvalHierarchy)?.name
                                            }
                                            dataTable={appHierDataDetail}
                                            selectedHierarchy={forceObj.approvalHierarchy}
                                        />
                                    )}
                                    {confirmationTab === "Attachment" && (
                                        <AttachmentSectionForm type="preview" data={listDataAttachment} />
                                    )}
                                </div>
                            </div>
                        )}
                    </Form>
                </Spin>
            </div>

            {/* Custom Footer without Clear Data and Save as Draft */}
            <div className="bg-white rounded-lg border border-[#D6E1F0] p-4 mt-6">
                <div className="flex w-full justify-between items-center">
                    <ButtonComponent
                        onClick={handleCancel}
                        className="!border-[#0075BF] !text-[#0075BF]"
                    >
                        Cancel
                    </ButtonComponent>
                    <div className="flex items-center gap-3">
                        <Button
                            disabled={currentStep === 0}
                            onClick={handlePrev}
                            style={{
                                backgroundColor: currentStep === 0 ? "#E0E3E9" : "#fff",
                                borderColor: currentStep === 0 ? "#E0E3E9" : "#DADDE5",
                                color: currentStep === 0 ? "#BFC4D0" : "#4B465C",
                                borderRadius: "6px",
                                height: "32px",
                                fontSize: "12px",
                                border: "1px solid #DADDE5",
                            }}
                        >
                            Previous
                        </Button>
                        {currentStep < steps.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                type="primary"
                                disabled={
                                    (currentStep === 0 && !forceObj.remark) ||
                                    (currentStep === 1 && !forceObj.approvalHierarchy)
                                }
                                style={{
                                    backgroundColor: 
                                        (currentStep === 0 && !forceObj.remark) ||
                                        (currentStep === 1 && !forceObj.approvalHierarchy)
                                            ? "#E0E3E9" : "#0075BF",
                                    borderColor: 
                                        (currentStep === 0 && !forceObj.remark) ||
                                        (currentStep === 1 && !forceObj.approvalHierarchy)
                                            ? "#E0E3E9" : "#0075BF",
                                    color: 
                                        (currentStep === 0 && !forceObj.remark) ||
                                        (currentStep === 1 && !forceObj.approvalHierarchy)
                                            ? "#BFC4D0" : "#fff",
                                    borderRadius: "6px",
                                    height: "32px",
                                    fontSize: "12px",
                                }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={onSubmit}
                                type="primary"
                                style={{
                                    backgroundColor: "#388E3C",
                                    borderColor: "#388E3C",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    height: "32px",
                                    fontSize: "12px",
                                }}
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </ModalCustom>
    );
};

export default ModalReverseAllocation;
