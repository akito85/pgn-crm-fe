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
    updateRestructure,
    getSa,
    getPrimaryContact,
    resetBadDebt,
} from "../../../../../redux/slices/receipt_collection/restructure";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";
import RestructureForm from "./RestructureForm";
import SubSectionCard from "../../../../../components/SubSectionCard";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import BaseContainer from "../../../../../components/BaseContainer";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import ContentModalConfirmRestructure from "./ContentModalConfirmRestructure";
import { getMandatoryAttachments } from "../../../../../constants/restructure";
import { uploadAttachments } from "../../../../../utils/uploadHelper";


const ListFormRestructure = (props) => {
    const { type } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const accountSegment = Form.useWatch("accountSegment", form);
    const location = useLocation();
    const sessionId = sessionStorage.getItem("restructure_update_id");
    const id = location?.state?.id || sessionId;

    useEffect(() => {
        if (location?.state?.id) {
            sessionStorage.setItem("restructure_update_id", location.state.id);
        }
    }, [location]);

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

    // listAccount dari Redux store sudah berformat { value, label, accountName, ... }
    // sesuai response backend GET /restructure/get-list-account

    const [current, setCurrent] = useState(0);
    const [modalBack, setModalBack] = useState(false);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState();
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [isModalSubmit, setIsModalSubmit] = useState(false);
    const [formValues, setFormValues] = useState({});

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

        // Set default values for mandatory fields that might be disabled or need defaults
        form.setFieldsValue({
            requestDate: moment(),
        });

        if (type === "update" && id) {
            dispatch(getDetailRestructure(id));
        }
    }, [dispatch, type, id, form]);

    useEffect(() => {
        console.log("ListFormRestructure update check:", { type, id, data_detail });
        if (type === "update" && id && data_detail) {
            const rest = data_detail.data?.restructure || data_detail.restructure;
            console.log("Extracted restructure detail:", rest);
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
                    accountStatus: rest.accountStatus,
                    saNumber: rest.saNumber,
                    saName: rest.saName,
                    saDate: rest.saDate ? moment(rest.saDate) : null,
                    startDate: rest.startDate ? moment(rest.startDate) : null,
                    endDate: rest.endDate ? moment(rest.endDate) : null,
                    type: rest.type,
                    tenor: rest.tenor,
                    startPeriod: rest.startPeriod ? moment(rest.startPeriod) : null,
                    description: rest.remark || rest.description,
                });

                if (rest.appHierId) {
                    setSelectedHierarchy(rest.appHierId);
                }

                if (rest.contactList && rest.contactList.length > 0 && contactRef.current) {
                    const formattedContacts = rest.contactList.map((item, index) => ({
                        key: item.key || item.id || index + 1,
                        contactId: item.contactId || item.id,
                        isPrimary: item.isPrimary || false,
                        isManual: item.isManual || false,
                        cpName: item.cpName || [item.firstName, item.middleName, item.lastName].filter(Boolean).join(" "),
                        job: item.job,
                        position: item.position,
                        address: item.address || item.contactAddress || "",
                        details: item.details || item.criteria || item.contactDetails || []
                    }));
                    console.log("Formatted contacts for setting:", formattedContacts);
                    contactRef.current.setContacts(formattedContacts);
                }
            }

            const attachments = data_detail.data?.attachmentDtoList || data_detail.attachmentDtoList || [];
            if (attachments.length > 0) {
                setListDataAttachment(attachments.map(a => ({ ...a, dataType: "exist" })));
            }
        }
    }, [type, id, data_detail, form]);

    useEffect(() => {
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    const handleAccountChange = async (value) => {
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
            
            if (contactRef.current) {
                contactRef.current.resetNonManualContacts();
            }

            // Automatically fetch SA
            try {
                const action = await dispatch(getSa(value));
                if (action.meta.requestStatus === "fulfilled" && action.payload) {
                    const data = action.payload;
                    form.setFieldsValue({
                        saNumber: data.saNumber,
                        saName: data.saName,
                        saDate: data.saDate ? moment(data.saDate) : null,
                        startDate: data.startDate ? moment(data.startDate) : null,
                        endDate: data.endDate ? moment(data.endDate) : null,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch SA info", err);
            }

            // Automatically fetch Primary Contact
            try {
                const contactAction = await dispatch(getPrimaryContact(value));
                if (contactAction.meta.requestStatus === "fulfilled" && contactAction.payload) {
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
            // Validation 1: Mandatory Fields for Step 0
            form.validateFields([
                "accountNumber",
                "type",
                "tenor",
                "startPeriod",
                "description"
            ]).then(() => {
                // Validation 2: Contact Information cannot be empty
                if (contacts.length === 0) {
                    message.warning("Contact Information tidak boleh kosong.");
                    return;
                }

                // Validation 3: Payment Plan Detail amount must be valid (total matches)
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
        type: values.type !== undefined ? values.type : null,
        tenor: values.tenor !== undefined ? values.tenor : null,
        startPeriod: values.startPeriod ? moment(values.startPeriod).format("YYYY-MM-DD") : null,
        source: values.source ,
        description: values.description !== undefined ? values.description : null,
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
        const action = type === "update" && id
            ? await dispatch(updateRestructure({ id, body }))
            : await dispatch(saveRestructure({ body }));
        if (action.meta.requestStatus === "fulfilled") {
            const restructureId = action.payload?.data?.restructureId || id;
            const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
            if (newAttachments.length > 0 && restructureId) {
                uploadAttachments(newAttachments, restructureId, "RESTRUCTURE",
                    (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
                ).catch(err => console.error("Async draft upload failed", err));
            }
            message.success("Draft berhasil disimpan!");
            navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const segment = values?.accountSegment;
            const mandatory = getMandatoryAttachments(segment);
            const uploadedCategories = (listDataAttachment || []).map(a => a.fileCategoryName);
            const missing = mandatory.filter(cat => !uploadedCategories.includes(cat));
            const blockingMissing = missing.filter(cat => !cat.toLowerCase().includes("optional"));
            
            if (blockingMissing.length > 0) {
                message.warning(`Attachment mandatory kurang: ${blockingMissing.join(", ")}`);
                return;
            }

            setFormValues(values);
            setIsModalSubmit(true);
        } catch (error) {
            console.log("Validation failed", error);
        }
    };

    const handleSave = async () => {
        setIsModalSubmit(false);
        const body = buildRequestBody(formValues, false);
        const action = type === "update" && id
            ? await dispatch(updateRestructure({ id, body }))
            : await dispatch(saveRestructure({ body }));
        if (action.meta.requestStatus === "fulfilled") {
            const restructureId = action.payload?.data?.restructureId || id;
            const newAttachments = listDataAttachment.filter(item => item.dataType !== "exist");
            if (newAttachments.length > 0 && restructureId) {
                uploadAttachments(newAttachments, restructureId, "RESTRUCTURE",
                    (body) => receiptCollectionHttpService.uploadImage(`/v1/dbs/api/attachment/upload/v1`, body)
                ).catch(err => console.error("Async submit upload failed", err));
            }
            message.success("Payment Plan berhasil disubmit!");
            navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE);
        }
    };

    const routes = [
        { path: "", breadcrumbName: "Payment & Collection" },
        { path: "", breadcrumbName: "Debt & Collection" },
        { path: DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE, breadcrumbName: "Payment Plan" },
        { path: "", breadcrumbName: type === "create" ? "Create" : "Update" },
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

    return (
        <>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>
                <FormStepper steps={steps} current={current} onPrev={prev} onNext={next} />
                
                <Form 
                    layout="vertical" 
                    form={form} 
                    id="formRequest"
                    onFinish={handleSubmit}
                >
                    <div style={{ display: current !== 0 ? "none" : "block" }}>
                        <RestructureForm
                            form={form}
                            listAccount={listAccount}
                            handleAccountChange={handleAccountChange}
                            disabled={type === "update"}
                            openItems={badDebtList}
                            onContactChange={handleContactChange}
                            onPlanDetailValidation={handlePlanDetailValidation}
                            onInstallmentsChange={handleInstallmentsChange}
                            contactRef={contactRef}
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
                                    type={type}
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
                            setContacts([]);
                            dispatch(resetBadDebt());
                            if (contactRef.current) {
                                contactRef.current.setContacts([]);
                            }
                        }}
                        onSaveDraft={handleSaveDraft}
                        onSubmit={() => form.submit()}
                        type={type}
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
                <ContentModalConfirmRestructure
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

export default ListFormRestructure;
