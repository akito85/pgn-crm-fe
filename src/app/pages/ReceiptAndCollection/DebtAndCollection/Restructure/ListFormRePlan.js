import { WarningOutlined, InfoCircleFilled } from "@ant-design/icons";
import { Form, Spin, message } from "antd";
import moment from "moment";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import {
    getListCustomerRestructure,
    getListAccountRestructure,
    getBadDebtByAccount,
    getAllApprovalList,
    getListApprovalById,
    getListCategory,
    getDetailRestructure,
    saveRestructure,
    getSa,
    getPrimaryContact,
    resetBadDebt,
} from "../../../../../redux/slices/receipt_collection/restructure";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";
import RePlanForm from "./RePlanForm";
import SubSectionCard from "../../../../../components/SubSectionCard";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import BaseContainer from "../../../../../components/BaseContainer";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import ContentModalConfirmRePlan from "./ContentModalConfirmRePlan";
import { getMandatoryAttachments } from "../../../../../constants/restructure";
import { uploadAttachments } from "../../../../../utils/uploadHelper";

const ListFormRePlan = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const accountSegment = Form.useWatch("accountSegment", form);
    const location = useLocation();
    const id = location?.state?.id;

    const {
        listCustomer,
        listAccount,
        badDebtList,
        totalBadDebt,
        dataListAppHierId,
        dataListAppHierDetail,
        dataListCategory,
        loading,
        data_detail
    } = useSelector((state) => state.restructure);

    const [current, setCurrent] = useState(0);
    const [modalBack, setModalBack] = useState(false);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState();
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [isModalSubmit, setIsModalSubmit] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    // Validation states for step 0
    const [isPlanDetailValid, setIsPlanDetailValid] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [installmentsByCurrency, setInstallmentsByCurrency] = useState({});
    const contactRef = useRef(null);

    const steps = [
        { title: "CREATE", value: "Create" },
        { title: "APPROVAL", value: "Approval" },
        { title: "ATTACHMENT", value: "Attachment" },
    ];

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
        dispatch(getListCustomerRestructure());
        dispatch(getListAccountRestructure());
        dispatch(getAllApprovalList());
        dispatch(getListCategory());

        form.setFieldsValue({
            requestDate: moment(),
        });

        if (id) {
            dispatch(getDetailRestructure(id));
        }
    }, [dispatch, id, form]);

    useEffect(() => {
        if (id && data_detail) {
            const rest = data_detail.data?.restructure || data_detail.restructure;
            if (rest) {
                form.setFieldsValue({
                    accountNumber: rest.accountNumber,
                    accountName: rest.accountName,
                    customerNumber: rest.customerNumber,
                    customerName: rest.customerName,
                    accountGroupType: rest.accountGroupType,
                    sor: rest.sor,
                    costCenter: rest.costCenter,
                    accountSegment: rest.accountSegment,
                    meterReadingCode: rest.meterReadingCode,
                    accountType: rest.accountType,
                    classificationType: rest.classificationType,
                    sapCustId: rest.sapCustId,
                    accountStatus: rest.accountStatus,
                    saNumber: rest.saNumber,
                    restructureCode: rest.restructureNumber || rest.restructureCode,
                    saName: rest.saName,
                    saDate: rest.saDate ? moment(rest.saDate) : null,
                    saStartDate: rest.saStartDate ? moment(rest.saStartDate) : null,
                    saEndDate: rest.saEndDate ? moment(rest.saEndDate) : null,
                    minContract: rest.minContract,
                    maxContract: rest.maxContract,
                    uom: rest.uom,
                });

                if (rest.contactList) {
                    setContacts(rest.contactList);
                }

                if (rest.accountNumber) {
                    dispatch(getBadDebtByAccount(rest.accountNumber));
                }
            }
        }
    }, [data_detail, id, dispatch, form]);

    useEffect(() => {
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    const handleAccountChange = (value) => {
        const selected = listAccount.find((acc) => acc.value === value);
        if (selected) {
            form.setFieldsValue({
                accountName: selected.accountName,
                customerNumber: selected.customerNumber,
                customerName: selected.customerName,
                accountGroupType: selected.accountGroupType,
                sor: selected.sor,
                costCenter: selected.costCenter,
                accountSegment: selected.accountSegment,
                meterReadingCode: selected.meterReadingCode,
                accountType: selected.accountType,
                classificationType: selected.classificationType,
                accountStatus: selected.accountStatus,
            });

            dispatch(getBadDebtByAccount(value));
            fetchPrimaryContact(value);
            fetchSaInfo(value);
        } else {
            form.resetFields([
                "accountName",
                "customerNumber",
                "customerName",
                "accountGroupType",
                "sor",
                "costCenter",
                "accountSegment",
                "meterReadingCode",
                "accountType",
                "classificationType",
                "accountStatus",
                "saNumber",
                "saName",
                "saDate",
                "saStartDate",
                "saEndDate",
                "minContract",
                "maxContract",
                "uom",
            ]);
            dispatch(resetBadDebt());
        }
    };

    const fetchSaInfo = async (accountNumber) => {
        if (accountNumber) {
            try {
                const saAction = await dispatch(getSa(accountNumber));
                if (saAction.payload) {
                    const sa = saAction.payload;
                    form.setFieldsValue({
                        saNumber: sa.saNumber,
                        saName: sa.saName,
                        saDate: sa.saDate ? moment(sa.saDate) : null,
                        saStartDate: sa.saStartDate ? moment(sa.saStartDate) : null,
                        saEndDate: sa.saEndDate ? moment(sa.saEndDate) : null,
                        minContract: sa.minContract,
                        maxContract: sa.maxContract,
                        uom: sa.uom,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch SA info", err);
            }
        }
    };

    const fetchPrimaryContact = async (accountNumber) => {
        if (accountNumber) {
            try {
                const contactAction = await dispatch(getPrimaryContact(accountNumber));
                if (contactAction.payload) {
                    const primaryContact = contactAction.payload;
                    if (primaryContact && contactRef.current) {
                        contactRef.current.addContact(primaryContact);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch primary contact", err);
            }
        }
    };

    const next = () => {
        if (current === 0) {
            form.validateFields([
                "accountNumber",
                "type",
                "tenor",
                "startPeriod",
                "description"
            ]).then(() => {
                if (contacts.length === 0) {
                    message.warning("Contact Information tidak boleh kosong.");
                    return;
                }

                if (!isPlanDetailValid) {
                    message.warning("Total amount pada Payment Plan Detail harus sesuai dengan Open Item.");
                    return;
                }

                setCurrent(current + 1);
                window.scrollTo(0, 0);
            }).catch((errorInfo) => {
                const missingFields = errorInfo.errorFields?.map(f => f.name[0]).join(", ");
                message.warning(`Mohon lengkapi field mandatory: ${missingFields}`);
            });
            return;
        }
        if (current === 1) {
            if (!selectedHierarchy) {
                message.warning("Approval Hierarchy is mandatory");
                return;
            }
            setCurrent(current + 1);
            window.scrollTo(0, 0);
            return;
        }
        setCurrent(current + 1);
        window.scrollTo(0, 0);
    };

    const prev = () => {
        if (current > 0) {
            setCurrent(current - 1);
            window.scrollTo(0, 0);
        }
    };

    const onBack = () => {
        if (Object.keys(form.getFieldsValue(true)).length === 0) {
            navigate(-1);
        } else {
            setModalBack(true);
        }
    };

    const buildRequestBody = (values, isDraft) => ({
        accountNumber: values.accountNumber !== undefined ? values.accountNumber : null,
        accountName: values.accountName !== undefined ? values.accountName : null,
        customerNumber: values.customerNumber !== undefined ? values.customerNumber : null,
        customerName: values.customerName !== undefined ? values.customerName : null,
        accountGroupType: values.accountGroupType !== undefined ? values.accountGroupType : null,
        sor: values.sor !== undefined ? values.sor : null,
        costCenter: values.costCenter !== undefined ? values.costCenter : null,
        accountSegment: values.accountSegment !== undefined ? values.accountSegment : null,
        meterReadingCode: values.meterReadingCode !== undefined ? values.meterReadingCode : null,
        accountType: values.accountType !== undefined ? values.accountType : null,
        classificationType: values.classificationType !== undefined ? values.classificationType : null,
        sapCustId: values.sapCustId !== undefined ? values.sapCustId : null,
        accountStatus: values.accountStatus !== undefined ? values.accountStatus : null,
        saNumber: values.saNumber !== undefined ? values.saNumber : null,
        parentRestructureNumber: values.restructureCode !== undefined ? values.restructureCode : null,
        type: values.type !== undefined ? values.type : null,
        tenor: values.tenor !== undefined ? values.tenor : null,
        startPeriod: values.startPeriod ? moment(values.startPeriod).format("YYYY-MM-DD") : null,
        source: values.source,
        description: values.description !== undefined ? values.description : null,
        reason: values.reason !== undefined ? values.reason : null,
        contactIds: contacts.map((c) => c.id || c.contactId).filter(Boolean),
        appHierId: selectedHierarchy !== undefined && selectedHierarchy !== null ? selectedHierarchy : null,
        attachmentIds: listDataAttachment.map((a) => a.id).filter(Boolean),
        badDebtList: badDebtList.map((item) => ({
            invoiceNumber: item.invoiceNo,
            invoicePeriod: item.invoicePeriod,
            currency: item.currency,
            allocation: item.allocation,
            amount: item.amount,
        })),
        calculationList: Object.values(installmentsByCurrency).flat().map((item) => ({
            periode: item.periode,
            currency: item.currency,
            amount: parseFloat(String(item.amount).replace(/,/g, "")) || 0,
            dueDate: item.dueDate,
        })),
        isDraft,
    });

    const handleSaveDraft = async () => {
        const values = form.getFieldsValue(true);
        if (!values.accountNumber) {
            message.warning("Account Number wajib diisi untuk menyimpan draft");
            return;
        }

        const body = buildRequestBody(values, true);
        const action = await dispatch(saveRestructure({ body }));
        if (action.meta.requestStatus === "fulfilled") {
            const restructureId = action.payload?.restructureId || action.payload?.data?.restructureId;
            const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
            if (newAttachments.length > 0 && restructureId) {
                try {
                    setIsUploading(true);
                    await uploadAttachments(newAttachments, restructureId, "RESTRUCTURE",
                        (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
                    );
                } catch (err) {
                    console.error("Async draft upload failed", err);
                } finally {
                    setIsUploading(false);
                }
            }
            message.success("Draft berhasil disimpan!");
            navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const uploadedCategories = listDataAttachment.map(a => a.fileCategoryName);
            const mandatory = getMandatoryAttachments(values.accountSegment);
            const missing = mandatory.filter(cat => !uploadedCategories.includes(cat));
            const blockingMissing = missing.filter(cat => !cat.toLowerCase().includes("optional"));

            if (blockingMissing.length > 0) {
                message.warning(`Attachment mandatory kurang: ${blockingMissing.join(", ")}`);
                return;
            }

            const allValues = form.getFieldsValue(true);
            setFormValues(allValues);
            setIsModalSubmit(true);
        } catch (error) {
            console.log("Validation failed", error);
        }
    };

    const handleSave = async () => {
        setIsModalSubmit(false);
        const body = buildRequestBody(formValues, false);
        const action = await dispatch(saveRestructure({ body }));
        if (action.meta.requestStatus === "fulfilled") {
            const restructureId = action.payload?.restructureId || action.payload?.data?.restructureId;
            const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
            if (newAttachments.length > 0 && restructureId) {
                try {
                    setIsUploading(true);
                    await uploadAttachments(newAttachments, restructureId, "RESTRUCTURE",
                        (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
                    );
                } catch (err) {
                    console.error("Async submit upload failed", err);
                } finally {
                    setIsUploading(false);
                }
            }
            message.success("Payment Plan berhasil disubmit!");
            navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE);
        }
    };

    const routes = [
        { path: "", breadcrumbName: "Payment & Collection" },
        { path: "", breadcrumbName: "Debt & Collection" },
        { path: DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE, breadcrumbName: "Payment Plan" },
        { path: "", breadcrumbName: "Re-Plan" },
        { path: "", breadcrumbName: "Create" },
    ];

    const handlePlanDetailValidation = useCallback((isValid) => {
        setIsPlanDetailValid(isValid);
    }, []);

    const handleContactChange = useCallback((newContacts) => {
        setContacts(newContacts);
    }, []);

    const handleInstallmentsChange = useCallback((installments) => {
        setInstallmentsByCurrency(installments);
    }, []);

    // Warn box for missing attachments
    const uploadedCategories = listDataAttachment.map(a => a.fileCategoryName);
    const mandatory = getMandatoryAttachments(accountSegment);
    const missingCategories = mandatory.filter(cat => !uploadedCategories.includes(cat));
    const strictlyMandatoryMissing = missingCategories.filter(cat => !cat.toLowerCase().includes("optional"));

    return (
        <>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading || isUploading}>
                <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />

                <Form
                    layout="vertical"
                    form={form}
                    id="formRequest"
                    onFinish={handleSubmit}
                >
                    <div style={{ display: current !== 0 ? "none" : "block" }}>
                        <RePlanForm
                            form={form}
                            listAccount={listAccount}
                            handleAccountChange={handleAccountChange}
                            disabled={true} // pre-populated from old skema
                            openItems={badDebtList}
                            onContactChange={handleContactChange}
                            onPlanDetailValidation={handlePlanDetailValidation}
                            onInstallmentsChange={handleInstallmentsChange}
                            contacts={contacts}
                            ref={contactRef}
                        />
                    </div>

                    <div style={{ display: current !== 1 ? "none" : "block" }} className="mt-8">
                        <BaseContainer header={"APPROVAL INFORMATION"}>
                            <SubSectionCard>
                                <ApprovalComponentGeneral
                                    dataTable={appHierDataDetail || []}
                                    dataOption={appHierOptions || []}
                                    selectedHierarchy={selectedHierarchy}
                                    updateSelectedHierarchy={setSelectedHierarchy}
                                />
                            </SubSectionCard>
                        </BaseContainer>
                    </div>

                    <div style={{ display: current !== 2 ? "none" : "block" }} className="mt-8">
                        <BaseContainer header={"ATTACHMENT INFORMATION"}>
                            <SubSectionCard>
                                {(() => {
                                    const mandatory = getMandatoryAttachments(accountSegment);
                                    const uploadedCategories = (listDataAttachment || []).map(a => a.fileCategoryName);
                                    const missingCategories = mandatory.filter(cat => !uploadedCategories.includes(cat));
                                    const mandatoryMissing = missingCategories.filter(cat => !cat.toLowerCase().includes("optional"));

                                    if (mandatoryMissing.length === 0) return null;

                                    return (
                                        <div
                                            className="flex items-start gap-3 p-4 border mb-4"
                                            style={{
                                                backgroundColor: "#FFF3E6",
                                                borderColor: "#FFE0B2",
                                                borderRadius: "8px",
                                                color: "#B36214"
                                            }}
                                        >
                                            <InfoCircleFilled style={{ fontSize: "18px", marginTop: "2px", color: "#D97706" }} />
                                            <div className="flex flex-col gap-1 text-[14px]">
                                                <span style={{ color: "#B36214", fontWeight: "600" }}>
                                                    Please upload the required documents below to continue the process.
                                                </span>
                                                <span style={{ color: "#B36214", fontWeight: "500" }}>
                                                    {missingCategories.join(", ")}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}
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
                                    mandatory={true}
                                />
                            </SubSectionCard>
                        </BaseContainer>
                    </div>

                    <FormFooter
                        current={current}
                        totalSteps={steps.length}
                        onPrev={prev}
                        onNext={next}
                        onCancel={onBack}
                        onClear={() => {
                            form.resetFields();
                            setCurrent(0);
                            setSelectedHierarchy(null);
                            setListDataAttachment([]);
                        }}
                        onSaveDraft={handleSaveDraft}
                        onSubmit={() => form.submit()}
                        type={"create"}
                        isLoading={false}
                    />
                </Form>
            </Spin>

            <ModalConfirm
                isOpen={modalBack}
                handleCancel={() => setModalBack(false)}
                handleOk={() => navigate(-1)}
                width={600}
            >
                <div className="flex justify-center mt-5 gap-[20px]">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className="text-[18px] font-bold">Are you sure you want to back?</p>
                </div>
            </ModalConfirm>

            <ModalCustom
                isOpen={isModalSubmit}
                handleCancel={() => setIsModalSubmit(false)}
                header={"Confirmation"}
                width={1200}
                type={"confirmation"}
                footer={
                    <div className="w-full flex justify-between gap-5 p-4 bg-white border-t border-gray-200">
                        <ButtonComponent onClick={() => setIsModalSubmit(false)} type="default">
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent type="primary" onClick={handleSave}>
                            Confirm
                        </ButtonComponent>
                    </div>
                }
            >
                <ContentModalConfirmRePlan
                    formValues={formValues}
                    contacts={contacts}
                    openItems={badDebtList}
                    installmentsByCurrency={installmentsByCurrency}
                    listDataAttachment={listDataAttachment}
                    appHierOptions={appHierOptions}
                    appHierDataDetail={appHierDataDetail}
                    selectedHierarchy={selectedHierarchy}
                />
            </ModalCustom>
        </>
    );
};

export default ListFormRePlan;
