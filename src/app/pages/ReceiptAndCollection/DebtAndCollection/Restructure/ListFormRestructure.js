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
    getAllApprovalList,
    getListApprovalById,
    getListCategory,
    getDetailRestructure,
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

// TODO: Replace with actual API response
const DUMMY_OPEN_ITEMS = [
  { key: 1, currency: "IDR", invoiceNo: "INV/2023/001", invoicePeriod: "JAN 2023", allocation: "Principal", amount: "10,000,000" },
  { key: 2, currency: "IDR", invoiceNo: "INV/2023/002", invoicePeriod: "FEB 2023", allocation: "Interest", amount: "5,000,000" },
  { key: 3, currency: "USD", invoiceNo: "INV/2023/003", invoicePeriod: "MAR 2023", allocation: "Principal", amount: "1,000.00" },
];

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

    // Mocking dataAccNumber for the slicing purpose (since Warranty uses dataAccNumber)
    const dataAccNumber = {
        data: [
            { id: 1, name: "ACC-001" },
            { id: 2, name: "ACC-002" }
        ]
    };

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
    const [openItems] = useState(DUMMY_OPEN_ITEMS);
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
        form.setFieldsValue({
            accountName: "PT MENCARI CINTA SEJATI",
            customerNumber: "CUST-1002",
            customerName: "JOHN DOE",
            accountGroupType: "Group A",
            sor: "SOR-1",
            costCenter: "CC-99",
            accountSegment: "Commercial",
            meterReadingCode: "MR-001",
            accountType: "Postpaid",
            classificationType: "Standard",
            sapCustId: "SAP-900",
            accountStatus: "Active",

            saNumber: "SA-2023-001",
            saName: "SA Commercial",
            saDate: moment("2023-01-01"),
            startDate: moment("2023-01-01"),
            endDate: moment("2024-01-01"),
            minContract: "100",
            maxContract: "1000",
            uom: "MMBTU"
        });
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

    const handleSaveDraft = async () => {
        message.success("Draft saved successfully!");
        navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE);
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

    const handleSave = () => {
        setIsModalSubmit(false);
        message.success("Successfully submitted!");
        navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE);
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
                            dataAccNumber={dataAccNumber}
                            handleAccountChange={handleAccountChange}
                            disabled={type === "update"}
                            openItems={openItems}
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
                    openItems={openItems}
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
