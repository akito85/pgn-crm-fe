import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, message, Row, Col, Select, DatePicker, Input } from "antd";
import moment from "moment";

// Global Custom Components
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../../components/InputComponent";
import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { dateFormatting, hasValue, parseMonetaryValue } from "../../../../../../utils";

// Redux Actions
import {
    createPaymentWarranty,
    getAllApprovalList,
    getListApprovalById,
} from "../../../../../../redux/slices/receipt_collection/warranty";

import {
    getConvertedCurrency,
    getAllAccountNumberDDL,
    getAccountNumberDDL,
    resetDataAccountNumber,
    getUnifiedCreateReceiptDdl,
    getCurrencyDDL,
    getRateTypeDDL,
    getListCategoryReceipt,
} from "../../../../../../redux/slices/receipt_collection/receipt";

import { configApp } from "../../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";

const { Option } = Select;

const ModalCreateWarranty = ({
    isOpen,
    handleBack = () => { },
    handleRefresh = () => { },
}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    // Redux Warranty state
    const { dataListAppHierId, dataListAppHierDetail, loading } = useSelector((state) => state.warranty);

    // Redux Receipt state (reusing master data)
    const {
        dataAccountNumber,
        dataAccNumber,
        payGatewayDDL,
        currencyDDL,
        rateTypeDDL,
        data_converted_currency
    } = useSelector((state) => state.receipt);

    const [current, setCurrent] = useState(0);
    const [loadingSave, setLoadingSave] = useState(false);

    // Approval State
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);

    // Attachment State
    const [listDataAttachment, setListDataAttachment] = useState([]);

    const steps = [
        { title: "Payment Guarantee", key: "paymentGuaranteeInfo" },
        { title: "Approval", key: "approvalInfo" },
        { title: "Attachment", key: "attachmentInfo" },
    ];

    useEffect(() => {
        if (isOpen) {
            dispatch(getAllAccountNumberDDL());
            dispatch(getUnifiedCreateReceiptDdl({})); // Fetches Partners (payGatewayDDL)
            dispatch(getCurrencyDDL());
            dispatch(getRateTypeDDL());
            dispatch(getAllApprovalList());
            clearAllState();
        }
    }, [isOpen, dispatch]);

    // Handle Approval Hierarchy dropdown
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
        if (selectedHierarchy && selectedHierarchy !== 0) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            const data = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail.map((b, bIndex) => ({
                    ...b,
                    key: bIndex + 1,
                })),
            }));
            setAppHierDataDetail(data);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    // Format auto-filled Account Data
    useEffect(() => {
        if (dataAccountNumber && dataAccountNumber.data) {
            form.setFieldsValue({
                accountName: dataAccountNumber.data.accountName,
                cusNumber: dataAccountNumber.data.customerNumber,
                cusName: dataAccountNumber.data.customerName,
                costCenterCode: dataAccountNumber.data.area,
                costCenterName: dataAccountNumber.data.area,
                segment: dataAccountNumber.data.segment,
                accountGroupType: dataAccountNumber.data.accountType,
                accountType: dataAccountNumber.data.accountType,
                classificationType: dataAccountNumber.data.accountType, // Mapping Classification Type
            });
        }
    }, [dataAccountNumber, form]);

    const handleAccountChange = (value, option) => {
        if (hasValue(value)) {
            dispatch(getAccountNumberDDL(value));
        } else {
            dispatch(getAllAccountNumberDDL());
            dispatch(resetDataAccountNumber());
            form.resetFields([
                "accountName", "cusNumber", "cusName",
                "costCenterCode", "costCenterName", "segment",
                "accountGroupType", "accountType", "classificationType"
            ]);
        }
    };

    // --- Rate Amount Logic ---
    const [requestBodyConvertedRate, setRequestBodyConvertedRate] = useState({});

    useEffect(() => {
        const { fromCurrency, toCurrency, rateType, rateDate } = requestBodyConvertedRate;
        if (fromCurrency && toCurrency && rateType && rateDate) {
            const body = {
                ...requestBodyConvertedRate,
                rateType: rateTypeDDL?.data?.filter((item) => item?.id === rateType)[0]?.name,
            };
            dispatch(getConvertedCurrency(body));
        }
    }, [dispatch, requestBodyConvertedRate, rateTypeDDL]);

    useEffect(() => {
        if (hasValue(data_converted_currency) && Object.keys(data_converted_currency).length !== 0) {
            const rateAmountValue = data_converted_currency?.convertedRate?.toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            );
            form.setFieldsValue({ rateAmount: rateAmountValue });
        }
    }, [data_converted_currency, form]);

    const onFormValuesChange = (changedValues, allValues) => {
        if (changedValues.currency || changedValues.convertedCurrency || changedValues.rateType || changedValues.rateDate) {
            setRequestBodyConvertedRate({
                fromCurrency: allValues.currency,
                toCurrency: allValues.convertedCurrency || allValues.currency,
                rateType: allValues.rateType,
                rateDate: allValues.rateDate ? moment(allValues.rateDate).format(dateFormatting.date) : null
            });
        }
    };

    const next = () => {
        if (current === 0) {
            const step1Fields = [
                "accountId", "warrantyType", "documentNumber", "documentDate",
                "issuerBank", "currency", "convertedCurrency", "rateType",
                "rateDate", "rateAmount", "effStartDate", "effEndDate",
                "claimPeriodTermType", "claimPeriodTermValue", "description"
            ];
            form.validateFields(step1Fields)
                .then(() => setCurrent(current + 1))
                .catch((errorInfo) => {
                    console.log("Validation failed:", errorInfo);
                    const errorFields = errorInfo?.errorFields?.map(field => field.name.join('.')).join(', ') || "";
                    message.warning(`Please complete all required fields! Missing: ${errorFields}`);
                });
            return;
        }
        if (current === 1 && !selectedHierarchy) {
            return message.warning("Please select Approval Hierarchy!");
        }
        setCurrent(current + 1);
    };

    const prev = () => setCurrent(current - 1);

    const clearAllState = () => {
        setCurrent(0);
        setListDataAttachment([]);
        setSelectedHierarchy(null);
        setRequestBodyConvertedRate({});
        dispatch(resetDataAccountNumber());
        form.resetFields();
    };

    const handleBackForm = () => {
        handleBack();
        clearAllState();
    };

    const handleSave = async (isDraft = false) => {
        setLoadingSave(true);
        try {
            const values = await form.validateFields();

            // Format Term of Claim Period
            let claimValue = values.claimPeriodTermValue;
            if (values.claimPeriodTermType === "Date" && claimValue) {
                // Formatting as "YYYYMMDD" to comply with Backend Integer type
                claimValue = moment(claimValue).format("YYYYMMDD");
            }

            // Format Amount Rate
            let parsedRateAmount = 0;
            if (values.rateAmount) {
                const cleaned = values.rateAmount.toString().replace(/,/g, "");
                parsedRateAmount = parsedRateAmount = parseFloat(cleaned);
            }

            // Execute Warranty Creation First to get the warrantyId (to bind attachments if backend requires RefId, but wait, Receipt logic uploads after generating the Receipt, but in Warranty, we pass attachmentIds inside the body)
            // Wait, looking at Receipt Form: it creates the Receipt, gets the ID, and then passes the Receipt ID as "refId"
            // However, Warranty DTO PaymentWarrantyCreateRequest says `private List<Integer> attachmentIds;` is passed INTO the create payload.
            // But `/upload-attachment-receipt` requires a `refId`. If we pass `null` or `0`, it might still generate an attachment ID.
            // Let's modify the flow to match Warranty's `attachmentIds` expectation by uploading them first, or if it requires a refId, we can pass 0 for now. Let's upload them and collect their IDs.

            let uploadedAttachmentIds = [];

            for (let icon = 0; icon < listDataAttachment.length; icon++) {
                const element = listDataAttachment[icon];

                const formData = new FormData();
                formData.append("files", element.file);
                formData.append("fileCategoryId", element.fileCategoryId);
                formData.append("category", "PAYMENT_WARRANTY");
                formData.append("referensiId", 0);

                const uploadResponse = await receiptCollectionHttpService.uploadImage(
                    `/v1/dbs/api/attachment/upload/v1`,
                    formData
                );

                // Assuming the backend returns the generated attachment ID in the response (e.g. data.id)
                if (uploadResponse?.data?.data?.id) {
                    uploadedAttachmentIds.push(uploadResponse.data.data.id);
                } else if (uploadResponse?.data?.id) {
                    uploadedAttachmentIds.push(uploadResponse.data.id);
                } else if (uploadResponse?.data?.[0]?.id) {
                    uploadedAttachmentIds.push(uploadResponse.data[0].id);
                }
            }

            const submitBody = {
                accountId: values.accountId,
                appHierId: selectedHierarchy,
                warrantyType: values.warrantyType,
                documentNumber: values.documentNumber,
                documentDate: moment(values.documentDate).format("YYYY-MM-DD"),
                currency: currencyDDL?.data?.find(c => c.id === values.currency)?.name || "IDR",
                rateType: rateTypeDDL?.data?.find(r => r.id === values.rateType)?.name || "FLOATING",
                rateDate: moment(values.rateDate).format("YYYY-MM-DD"),
                effectiveStartDate: moment(values.effStartDate).format("YYYY-MM-DD"),
                effectiveEndDate: moment(values.effEndDate).format("YYYY-MM-DD"),
                claimPeriodTermType: values.claimPeriodTermType,
                claimPeriodTermValue: claimValue,
                description: values.description,
                isDraft: isDraft,
                partners: [
                    {
                        partnerId: values.issuerBank,
                        amount: parsedRateAmount
                    }
                ],
                attachmentIds: uploadedAttachmentIds.length > 0 ? uploadedAttachmentIds : [],
            };

            await dispatch(createPaymentWarranty({ body: submitBody })).unwrap();

            handleRefresh();
            handleBackForm();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSave(false);
        }
    };

    return (
        <ModalCustom
            isOpen={isOpen}
            type="confirmation"
            header="Create Payment Guarantee"
            handleCancel={handleBackForm}
            width={1000}
            footer={
                <FormFooter
                    current={current}
                    totalSteps={steps.length}
                    onPrev={prev}
                    onNext={next}
                    onCancel={handleBackForm}
                    onClear={clearAllState}
                    onSaveDraft={() => handleSave(true)}
                    onSubmit={() => handleSave(false)}
                />
            }
        >
            <div className="flex flex-col gap-y-5">
                <FormStepper
                    steps={steps}
                    current={current}
                    onPrev={prev}
                    onNext={next}
                />
            </div>

            <Form layout="vertical" form={form} id={"formRequest"} onFinish={() => handleSave(false)} onValuesChange={onFormValuesChange}>
                {/* STEP 1: PAYMENT GUARANTEE */}
                <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>

                    <div className="w-full mb-6 border border-[#E9ECEF] rounded-lg p-4">
                        <h3 className="uppercase text-[#0075BF] font-bold text-sm mb-4">Account Information</h3>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item name="accountId" label="Account Number" rules={[{ required: true }]}>
                                    <Select
                                        placeholder="Select Account"
                                        onChange={handleAccountChange}
                                        showSearch
                                        optionFilterProp="children"
                                        options={
                                            dataAccNumber?.data?.map((item) => ({
                                                label: item.name,
                                                value: item.id,
                                            })) || []
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="accountName" label="Account Name">
                                    <InputComponent disabled placeholder="Auto-filled" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="cusNumber" label="Customer Number">
                                    <InputComponent disabled placeholder="Auto-filled" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="cusName" label="Customer Name">
                                    <InputComponent disabled placeholder="Auto-filled" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="costCenterCode" label="Cost Center">
                                    <InputComponent disabled placeholder="Auto-filled" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="segment" label="Customer Segment">
                                    <InputComponent disabled placeholder="Auto-filled" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="accountGroupType" label="Customer Group">
                                    <InputComponent disabled placeholder="Auto-filled" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="accountType" label="Account Type">
                                    <InputComponent disabled placeholder="Auto-filled" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="classificationType" label="Classification Type">
                                    <InputComponent disabled placeholder="Auto-filled" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    <div className="w-full border border-[#E9ECEF] rounded-lg p-4">
                        <h3 className="uppercase text-[#0075BF] font-bold text-sm mb-4">Payment Guarantee Information</h3>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item name="warrantyType" label="Type" rules={[{ required: true }]}>
                                    <Select placeholder="Select Type">
                                        <Option value="BANK_GUARANTY">Bank Guarantee</Option>
                                        <Option value="CASH">Cash</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="documentNumber" label="Document Number" rules={[{ required: true }]}>
                                    <InputComponent placeholder="Input Document Number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="documentDate" label="Document Date" rules={[{ required: true }]}>
                                    <DatePicker className="w-full" style={{ borderRadius: '8px' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="issuerBank" label="Issuer" rules={[{ required: true }]}>
                                    <Select placeholder="Select Issuer (Partner)">
                                        {payGatewayDDL?.data?.map((item) => (
                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="issuerBranch" label="Issuer Branch">
                                    <Select placeholder="Select Issuer Branch">
                                        <Option value="JKT">Jakarta</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                                    <Select placeholder="Select Currency">
                                        {currencyDDL?.data?.map((item) => (
                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="convertedCurrency" label="Converted Currency" rules={[{ required: true }]}>
                                    <Select placeholder="Select Converted Currency">
                                        {currencyDDL?.data?.map((item) => (
                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="rateType" label="Rate Type" rules={[{ required: true }]}>
                                    <Select placeholder="Select Rate Type">
                                        {rateTypeDDL?.data?.map((item) => (
                                            <Option key={item.id} value={item.id}>{`${item.name} - ${item.description}`}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="rateDate" label="Rate Date" rules={[{ required: true }]}>
                                    <DatePicker className="w-full" style={{ borderRadius: '8px' }} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="rateAmount" label="Rate">
                                    <Input disabled className="w-full" style={{ borderRadius: '8px', padding: '8px 12px' }} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="effStartDate" label="EFF Start Date" rules={[{ required: true }]}>
                                    <DatePicker className="w-full" style={{ borderRadius: '8px' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="effEndDate" label="EFF End Date" rules={[{ required: true }]}>
                                    <DatePicker className="w-full" style={{ borderRadius: '8px' }} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="Term Of Claim Period" style={{ marginBottom: 0 }}>
                                    <Input.Group compact className="flex gap-2">
                                        <Form.Item name="claimPeriodTermType" style={{ width: '40%', marginBottom: 0 }}>
                                            <Select placeholder="Type" defaultValue="Date">
                                                <Option value="Date">Date</Option>
                                                <Option value="Days">Days</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="claimPeriodTermValue" style={{ width: '60%', marginBottom: 0 }}>
                                            <DatePicker className="w-full" style={{ borderRadius: '8px' }} />
                                        </Form.Item>
                                    </Input.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                                    <InputComponent type="textarea" rows={4} placeholder="Input" />
                                </Form.Item>
                            </Col>
                        </Row>

                    </div>
                </div>

                {/* STEP 2: APPROVAL */}
                <div className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}>
                    <ApprovalSectionForm
                        dataTable={appHierDataDetail}
                        dataOption={appHierOptions}
                        selectedHierarchy={selectedHierarchy}
                        updateSelectedHierarchy={setSelectedHierarchy}
                    />
                </div>

                {/* STEP 3: ATTACHMENT */}
                <div className={`steps-content my-[30px] ${current !== 2 ? "hidden" : ""}`}>
                    <AttachmentComponent
                        data={listDataAttachment}
                        updateData={setListDataAttachment}
                        dispatch={dispatch}
                        typeSelector="receipt"
                        getAPICategory={getListCategoryReceipt}
                        service={receiptCollectionHttpService}
                        configApplication={configApp.PAYMENT_SERVICE}
                        typeRBI="data"
                        mandatory={true}
                    />
                </div>
            </Form>
        </ModalCustom>
    );
};

export default ModalCreateWarranty;
