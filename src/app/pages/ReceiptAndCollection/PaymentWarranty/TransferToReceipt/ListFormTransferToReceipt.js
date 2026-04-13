import { Form, message } from "antd";
import { showModalError, showModalSuccess } from "../../../../../redux/slices/general_slice";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { 
    getAllApprovalList, 
    getListApprovalById, 
    submitTransferToReceipt 
} from "../../../../../redux/slices/receipt_collection/transferToReceipt";
import TransferToReceiptForm from "./TransferToReceiptForm";
import ReceiptInfoSection from "./ReceiptInfoSection";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getListCategory } from "../../../../../redux/slices/receipt_collection/transferToReceipt";
import { getReceiptListColumns } from "./ReceiptListColumns";
import ModalSearchReceipt from "./ModalSearchReceipt";
import ModalSearchWarranty from "./ModalSearchWarranty";
import ContentModalConfirm from "./ContentModalConfirm";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import SubSectionCard from "../../../../../components/SubSectionCard";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";

const ListFormTransferToReceipt = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const location = useLocation();
    const isEdit = location?.state?.isEdit || false;

    // Watchers
    const category = Form.useWatch("category", form);

    // Steps state
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        { title: "Create Transfer to Receipt" },
        { title: "Approval" },
        { title: "Attachment" }
    ];

    // Data states
    const [receiptList, setReceiptList] = useState([]);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [appHierOptions, setAppHierOptions] = useState([]);

    // Modal states
    const [showModalReceipt, setShowModalReceipt] = useState(false);
    const [showModalWarranty, setShowModalWarranty] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    // Table states for Section 3
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { dataListAppHierId, dataListAppHierDetail, loading, listFromCustomer } = useSelector((state) => state.transferToReceipt);

    useEffect(() => {
        dispatch(getAllApprovalList());
    }, [dispatch]);

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
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            const data = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a?.employeeDetail?.map((b, index) => ({
                    ...b,
                    key: index + 1,
                })),
            }));
            setAppHierDataDetail(data);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    // Effect to sync Amount when Category is TRANSFER_FULL_AMOUNT
    useEffect(() => {
        if (category === "TRANSFER_FULL_AMOUNT") {
            setReceiptList(prev => prev.map(item => ({
                ...item,
            })));
        }
    }, [category]);

    // HANDLERS
    const handleNext = async () => {
        if (currentStep === 0) {
            try {
                // Validate only fields in the first step
                await form.validateFields(["fromCustomerId", "category", "description"]);
                if (receiptList.length === 0) {
                    message.error("Please add at least one receipt to the list.");
                    return;
                }
                setCurrentStep(1);
            } catch (error) {
                console.log("Validation Failed:", error);
                message.warning("Please fill all required fields correctly.");
            }
        } else if (currentStep === 1) {
            if (!selectedHierarchy) {
                message.error("Please select an Approval Hierarchy.");
                return;
            }
            setCurrentStep(2);
        }
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleConfirmWarranty = (record) => {
        form.setFieldsValue({
            paymentWarrantyCode: record.warrantyCode,
            warrantyAreaCode: record.costCenter,
            accountNumber: record.accountNumber,
            accountName: record.accountName,
            customerId: record.customerNumber,
            customerName: record.customerName,
            customerSegment: record.customerSegment,
            customerGroup: record.customerGroup,
            type: record.warrantyType,
            documentNumber: record.documentNumber,
            mutationDate: record.effectiveDate ? moment(record.effectiveDate) : null,
            publisher: record.issuerBank,
            issuerBranch: record.issuerBranch,
            currency: record.currency,
            balance: record.balance,
            rateType: record.rateType,
            rateDate: record.rateDate ? moment(record.rateDate) : null,
            rate: record.rate,
            equivalent: record.currencyBalance,
            effectiveDate: record.effectiveDate ? moment(record.effectiveDate) : null,
            expiringDate: record.expiringDate ? moment(record.expiringDate) : null,
            endDateClaim: record.endDateClaim ? moment(record.endDateClaim) : null,
            accountType: record.accountType,
            classificationType: record.classificationType,
            description: record.description,
            sourcePayWarrantyId: record.warrantyId,
            fromAccountId: record.accountId
        });
    };

    const handleConfirmReceipt = (selectedRows) => {
        const existingIds = new Set(receiptList.map(item => item.receiptId));
        const newItems = selectedRows.filter(item => !existingIds.has(item.receiptId));
        setReceiptList([...receiptList, ...newItems]);
    };

    const handleDeleteReceipt = (record) => {
        setReceiptList(receiptList.filter(item => item.receiptId !== record.receiptId));
    };

    const handleAmountChange = (record, value) => {
        setReceiptList(prev => prev.map(item => 
            item.receiptId === record.receiptId ? { ...item, amount: value } : item
        ));
    };

    const columnsReceipt = useMemo(() => {
        return getReceiptListColumns({
            page,
            pageSize,
            onDelete: handleDeleteReceipt,
            onAmountChange: handleAmountChange,
            actionType: "delete",
            category: category,
            isModal: false,
        });
    }, [page, pageSize, receiptList, category]);

    const handleSubmit = () => {
        setShowConfirmSubmit(true);
    };

    const uploadFiles = async (id) => {
        const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
        );

        const failedUploads = [];

        for (let i = 0; i < filterDataAttach.length; i++) {
            const element = filterDataAttach[i];
            const body = {
                referensiId: id,
                files: element.file,
                category: "PAYMENT_WARRANTY_TRANSFER_RECEIPT",
                fileCategoryId: element.fileCategoryId,
            };

            try {
                await receiptCollectionHttpService.uploadImage(
                    `/v1/dbs/api/attachment/upload/v1`,
                    body
                );
            } catch (error) {
                console.error(`Failed to upload file ${i + 1}:`, error);
                failedUploads.push(element);
            }
        }

        if (failedUploads.length > 0) {
            dispatch(
                showModalError({
                    title: "Upload Warning",
                    description: `${failedUploads.length} file(s) failed to upload. Please try again.`,
                    return: false,
                })
            );
        }

        return failedUploads;
    };

    const confirmSubmit = async () => {
        const formData = form.getFieldsValue();
        const body = {
            ...formData,
            receiptList: receiptList.map(item => ({ 
                receiptId: item.receiptId, 
                receiptNo: item.receiptNo, 
                amount: typeof item.amount === 'string' ? parseFloat(item.amount.replace(/,/g, '')) : item.amount 
            })),
            attachmentList: listDataAttachment.map(item => ({ id: item.id })),
            appHierId: selectedHierarchy
        };
        
        try {
            const res = await dispatch(submitTransferToReceipt(body)).unwrap();
            const createdId = res?.data?.transferHdrId || res?.data?.id;

            if (createdId) {
                await uploadFiles(createdId);
            }

            dispatch(showModalSuccess({
                title: "Success",
                description: "Data submitted successfully",
                onOk: () => navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_RECEIPT)
            }));
            setShowConfirmSubmit(false);
        } catch (error) {
            console.error("Submission failed:", error);
            setShowConfirmSubmit(false);
        }
    };

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        { path: "", breadcrumbName: "Payment Warranty" },
        { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_RECEIPT, breadcrumbName: "Transfer to Receipt" },
        { path: "", breadcrumbName: isEdit ? "Edit" : "Create" }
    ];

    const tabDataConfirm = [
        { label: "Transfer to Receipt", value: "Transfer to Receipt" },
        { label: "Approval", value: "Approval" },
        { label: "Attachment", value: "Attachment" },
    ];

    return (
        <>
            <BreadCrumb routes={routes} />
            <div className="flex flex-col gap-4">
                <FormStepper
                    steps={steps}
                    current={currentStep}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />

                <Form form={form} layout="vertical">
                    <div style={{ display: currentStep !== 0 ? "none" : undefined }} className="flex flex-col gap-8">
                        <TransferToReceiptForm 
                            form={form} 
                            onSearchWarranty={() => setShowModalWarranty(true)} 
                        />
                        <ReceiptInfoSection 
                            receiptList={receiptList}
                            columnsReceipt={columnsReceipt}
                            handleSearchReceipt={() => setShowModalReceipt(true)}
                            page={page}
                            pageSize={pageSize}
                            handlePageChange={setPage}
                            handleSizeChange={(c, s) => { setPage(1); setPageSize(s); }}
                        />
                    </div>

                    <div style={{ display: currentStep !== 1 ? "none" : undefined }}>
                        <CardContainerNoBorder 
                            header="APPROVAL INFORMATION"
                            collapsible={true}
                        >
                            <div className="mx-2 mb-4 mt-2">
                                <SubSectionCard>
                                    <ApprovalComponentGeneral
                                        dataOption={appHierOptions}
                                        dataTable={appHierDataDetail}
                                        selectedHierarchy={selectedHierarchy}
                                        updateSelectedHierarchy={setSelectedHierarchy}
                                    />
                                </SubSectionCard>
                            </div>
                        </CardContainerNoBorder>
                    </div>

                    <div style={{ display: currentStep !== 2 ? "none" : undefined }}>
                        <CardContainerNoBorder 
                            header="ATTACHMENT INFORMATION"
                            collapsible={true}
                        >
                            <div className="mx-2 mb-4 mt-2">
                                <SubSectionCard>
                                    <AttachmentComponent
                                        type={"form"}
                                        data={listDataAttachment}
                                        updateData={setListDataAttachment}
                                        typeSelector="transferToReceipt"
                                        dispatch={dispatch}
                                        getAPICategory={getListCategory}
                                        service={receiptCollectionHttpService}
                                        configApplication={configApp.PAYMENT_SERVICE}
                                        mandatory={true}
                                    />
                                </SubSectionCard>
                            </div>
                        </CardContainerNoBorder>
                    </div>
                </Form>

                <FormFooter
                    current={currentStep}
                    totalSteps={steps.length}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onCancel={() => navigate(-1)}
                    onClear={() => { form.resetFields(); setReceiptList([]); setListDataAttachment([]); }}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    useSaveDraft={false}
                />
            </div>

            <ModalSearchReceipt 
                isOpen={showModalReceipt}
                category={category}
                onClose={() => setShowModalReceipt(false)}
                onConfirm={handleConfirmReceipt}
                customerNumber={form.getFieldValue("fromCustomerId")}
            />

            <ModalSearchWarranty 
                isOpen={showModalWarranty}
                onClose={() => setShowModalWarranty(false)}
                onConfirm={handleConfirmWarranty}
                customerId={form.getFieldValue("fromCustomerId") ? 
                    listFromCustomer?.find(c => c.customerNumber === form.getFieldValue("fromCustomerId"))?.customerId 
                    : null}
            />

            <ModalCustom
                isOpen={showConfirmSubmit}
                handleCancel={() => setShowConfirmSubmit(false)}
                header={"Confirmation"}
                width={1000}
                type={"confirmation"}
                hidePadding={true}
                footer={
                    <div className="w-full">
                        <div style={{ borderTop: "1px solid #C8CDD4", marginLeft: "-16px", marginRight: "-16px", marginBottom: "24px" }} />
                        <div className="flex justify-between gap-5 px-2 pb-2">
                            <ButtonComponent onClick={() => setShowConfirmSubmit(false)} type="default" className="!w-fit px-8">Cancel</ButtonComponent>
                            <ButtonComponent isPrimary onClick={() => confirmSubmit()} loading={loading} className="!w-fit px-8">Confirm</ButtonComponent>
                        </div>
                    </div>
                }
            >
                <ContentModalConfirm 
                    data={form.getFieldsValue()}
                    receiptList={receiptList}
                    listDataAppHierDetail={appHierDataDetail}
                    listDataAttachment={listDataAttachment}
                    selectedHierarchy={selectedHierarchy}
                    dataOption={appHierOptions}
                    category={category}
                />
            </ModalCustom>
        </>
    );
};

export default ListFormTransferToReceipt;
