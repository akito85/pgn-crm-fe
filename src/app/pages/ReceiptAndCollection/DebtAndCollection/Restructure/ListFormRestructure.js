import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin, message } from "antd";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
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


const ListFormRestructure = (props) => {
    const { type } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const location = useLocation();
    const { id } = location?.state || {};

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
            source: "SAP FSCD",
            requestDate: moment(),
        });

        if (type === "update" && id) {
            dispatch(getDetailRestructure(id));
        }
    }, [dispatch, type, id, form]);

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
        accountNumber: values.accountNumber,
        accountName: values.accountName,
        customerNumber: values.customerNumber,
        customerName: values.customerName,
        accountGroupType: values.accountGroupType,
        sor: values.sor,
        costCenter: values.costCenter,
        accountSegment: values.accountSegment,
        meterReadingCode: values.meterReadingCode,
        accountType: values.accountType,
        classificationType: values.classificationType,
        sapCustId: values.sapCustId,
        accountStatus: values.accountStatus,
        saNumber: values.saNumber,
        type: values.type,
        tenor: values.tenor,
        startPeriod: values.startPeriod ? moment(values.startPeriod).format("YYYY-MM-DD") : null,
        source: values.source || "SAP FSCD",
        description: values.description,
        contactIds: contacts.map((c) => c.id || c.contactId).filter(Boolean),
        appHierId: selectedHierarchy,
        attachmentIds: listDataAttachment.map((a) => a.id).filter(Boolean),
        badDebtList: badDebtList.map((item) => ({
            invoiceNumber: item.invoiceNo,
            invoicePeriod: item.invoicePeriod,
            currency: item.currency,
            allocation: item.allocation,
            totalAmount: item.totalAmount,
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
            message.success("Draft berhasil disimpan!");
            navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
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
