import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Collapse, Spin } from "antd";
import { UpOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import DetailText from "../../../../components/DetailText";
import TablePagination from "../../../../components/TablePagination";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import { FormStepper, FormFooter } from "../../../../components/FormStepNavigation";
import { columnJournal } from "./Table/ColumnJournal";
import moment from "moment";
import { dateFormatting } from "../../../../utils";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../constants/configApp";
import { getListCategoryReceipt } from "../../../../redux/slices/receipt_collection/receipt";
import {
    getAccountingAllocation,
    submitAccountingAllocation
} from "../../../../redux/slices/receipt_collection/accounting";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";

const { Panel } = Collapse;

/**
 * Create Accounting Page for Receipt
 * Displays journal information from Oracle procedure: pack_accounting.f_get_accounting_aloc
 * 
 * Flow: Step 1 (CREATE) → Step 2 (ATTACHMENT) → Submit
 */
const CreateAccounting = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const searchInput = useRef(null);

    // Get receipt data from navigation state
    const receiptData = location?.state || {};

    // Local state
    const [currentStep, setCurrentStep] = useState(0); // 0: CREATE, 1: ATTACHMENT
    const [activeKeys, setActiveKeys] = useState(['customer', 'account', 'journal']);
    const [journal1Page, setJournal1Page] = useState(1);
    const [journal1PageSize, setJournal1PageSize] = useState(10);
    const [journal2Page, setJournal2Page] = useState(1);
    const [journal2PageSize, setJournal2PageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Steps definition for stepper
    const steps = [
        { title: "CREATE", value: "create" },
        { title: "ATTACHMENT", value: "attachment" },
    ];

    // Mock data - replace with actual data from Redux/API
    const [accountingData, setAccountingData] = useState({
        customerInfo: {
            customerNumber: receiptData?.customerNumber || "",
            customerName: receiptData?.customerName || "",
            billPeriod: receiptData?.receiptDate
                ? moment(receiptData.receiptDate).format("MMM YYYY").toUpperCase()
                : "",
        },
        accountInfo: {
            accountNumber: receiptData?.accountNumber || "",
            accountName: receiptData?.accountName || "",
            accountReferenceId: receiptData?.accountReferenceId || "",
        },
        journal1: [],
        journal2: [],
    });

    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT,
            breadcrumbName: "Receipt",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_ACCOUNTING,
            breadcrumbName: "Create Accounting",
        },
    ];

    useEffect(() => {
        // Fetch accounting allocation data when component mounts
        if (receiptData?.id) {
            fetchAccountingAllocation();
        }
    }, [receiptData?.id]);

    const fetchAccountingAllocation = async () => {
        try {
            setLoading(true);

            // Extract pay period from receipt date (format: YYYYMM)
            const payPeriod = receiptData?.receiptDate
                ? moment(receiptData.receiptDate).format("YYYYMM")
                : moment().format("YYYYMM");

            // Call backend API via Redux
            const response = await dispatch(getAccountingAllocation({
                receiptId: receiptData.id,
                payPeriod: payPeriod,
            })).unwrap();

            // Set data from API response
            // response is already the 'data' object from backend ResponseObject
            console.log("API Response:", response);
            if (response) {
                setAccountingData(response);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching accounting allocation:", error);
            setLoading(false);
            // You might want to show error notification here
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleJournal1Change = (page, pageSize) => {
        setJournal1Page(pageSize !== journal1PageSize ? 1 : page);
        setJournal1PageSize(pageSize);
    };

    const handleJournal2Change = (page, pageSize) => {
        setJournal2Page(pageSize !== journal2PageSize ? 1 : page);
        setJournal2PageSize(pageSize);
    };

    const handleClearData = () => {
        setAccountingData({
            ...accountingData,
            journal1: [],
            journal2: [],
        });
    };

    const handleNext = () => {
        if (currentStep === 0) {
            setCurrentStep(1); // Move to ATTACHMENT step
        } else {
            // Submit the form
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentStep === 1) {
            setCurrentStep(0); // Back to CREATE step
        }
    };

    const handleCancel = () => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const payPeriod = receiptData?.receiptDate
                ? moment(receiptData.receiptDate).format("YYYYMM")
                : moment().format("YYYYMM");

            // Call backend API via Redux to submit accounting
            const response = await dispatch(submitAccountingAllocation({
                receiptId: receiptData.id,
                payPeriod: payPeriod,
            })).unwrap();

            console.log("Accounting submitted successfully:", response);
            setLoading(false);

            // Navigate back to receipt list after success
            navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT);
        } catch (error) {
            console.error("Error submitting accounting:", error);
            setLoading(false);
            // You might want to show error notification here
        }
    };

    const renderCreateStep = () => (
        <div className="w-full space-y-4">
            {/* Accounting Information Section */}
            <div className="text-primary text-sm font-bold uppercase py-2">
                ACCOUNTING INFORMATION
            </div>

            <Collapse
                activeKey={activeKeys}
                onChange={setActiveKeys}
                expandIconPosition="right"
                expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />}
                className="bg-white"
            >
                {/* Customer Information */}
                <Panel
                    header={
                        <span className="text-primary text-xs font-semibold uppercase">
                            Customer Information
                        </span>
                    }
                    key="customer"
                    className="border-b"
                >
                    <div className="grid grid-cols-3 gap-5 p-4">
                        <DetailText label="Customer Number">
                            {accountingData?.customerInfo?.customerNumber}
                        </DetailText>
                        <DetailText label="Customer Name">
                            {accountingData?.customerInfo?.customerName}
                        </DetailText>
                        <DetailText label="Bill Period">
                            {accountingData?.customerInfo?.billPeriod}
                        </DetailText>
                    </div>
                </Panel>

                {/* Account Information */}
                <Panel
                    header={
                        <span className="text-primary text-xs font-semibold uppercase">
                            Account Information
                        </span>
                    }
                    key="account"
                    className="border-b"
                >
                    <div className="grid grid-cols-3 gap-5 p-4">
                        <DetailText label="Account Number">
                            {accountingData?.accountInfo?.accountNumber}
                        </DetailText>
                        <DetailText label="Account Name">
                            {accountingData?.accountInfo?.accountName}
                        </DetailText>
                        <DetailText label="Account Reference ID">
                            {accountingData?.accountInfo?.accountReferenceId}
                        </DetailText>
                    </div>
                </Panel>
            </Collapse>

            {/* Journal Information Section */}
            <div className="text-primary text-sm font-bold uppercase py-2 mt-6">
                JOURNAL INFORMATION
            </div>

            <Collapse
                activeKey={activeKeys}
                onChange={setActiveKeys}
                expandIconPosition="right"
                expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />}
                className="bg-white"
            >
                {/* Journal 1 */}
                <Panel
                    header={
                        <span className="text-primary text-xs font-semibold uppercase">
                            Journal 1
                        </span>
                    }
                    key="journal1"
                    className="border-b"
                >
                    <div className="p-4">
                        <TablePagination
                            dataSource={accountingData?.journal1 || []}
                            columns={columnJournal(
                                journal1Page,
                                journal1PageSize,
                                searchInput,
                                searchedColumn,
                                searchText,
                                handleSearch
                            )}
                            tableScrolled={{ x: 1200, y: 300 }}
                            totalData={accountingData?.journal1?.length || 0}
                            pageSize={journal1PageSize}
                            current={journal1Page}
                            onChange={handleJournal1Change}
                            onSizeChanger={handleJournal1Change}
                        />
                        <div className="mt-2 text-xs text-gray-500">
                            Posting to SAP
                        </div>
                    </div>
                </Panel>

                {/* Journal 2 */}
                <Panel
                    header={
                        <span className="text-primary text-xs font-semibold uppercase">
                            Journal 2
                        </span>
                    }
                    key="journal2"
                    className="border-b"
                >
                    <div className="p-4">
                        <TablePagination
                            dataSource={accountingData?.journal2 || []}
                            columns={columnJournal(
                                journal2Page,
                                journal2PageSize,
                                searchInput,
                                searchedColumn,
                                searchText,
                                handleSearch
                            )}
                            tableScrolled={{ x: 1200, y: 300 }}
                            totalData={accountingData?.journal2?.length || 0}
                            pageSize={journal2PageSize}
                            current={journal2Page}
                            onChange={handleJournal2Change}
                            onSizeChanger={handleJournal2Change}
                        />
                        <div className="mt-2 text-xs text-gray-500">
                            Posting to SAP
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </div>
    );

    const renderAttachmentStep = () => (
        <div className="w-full">
            <p className="text-primary text-xl font-bold uppercase py-4">
                ATTACHMENT INFORMATION
            </p>
            <AttachmentComponent
                data={attachments}
                updateData={setAttachments}
                dispatch={dispatch}
                getAPICategory={getListCategoryReceipt}
                typeSelector="accounting"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
            />
        </div>
    );

    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer
                    header={
                        <div className="flex justify-between items-center -my-4">
                            <p className="mt-[15px] font-bold uppercase text-[#0075BF]">
                                CREATE ACCOUNTING
                            </p>
                        </div>
                    }
                >
                    {/* Steps Navigation */}
                    <FormStepper
                        steps={steps}
                        current={currentStep}
                        onPrev={handlePrevious}
                        onNext={handleNext}
                    />

                    {/* Content */}
                    <div className="mt-4">
                        {currentStep === 0 && renderCreateStep()}
                        {currentStep === 1 && renderAttachmentStep()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center p-4 border-t mt-4">
                        <div className="flex gap-2">
                            <ButtonComponent type="default" onClick={handleCancel}>
                                Cancel
                            </ButtonComponent>
                            {currentStep === 0 && (
                                <ButtonComponent type="default" onClick={handleClearData}>
                                    Clear Data
                                </ButtonComponent>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <ButtonComponent
                                    type="submit"
                                    onClick={handlePrevious}
                                >
                                    Previous
                                </ButtonComponent>
                            )}
                            {currentStep === 0 && (
                                <ButtonComponent type="default" onClick={() => { }}>
                                    Save as Draft
                                </ButtonComponent>
                            )}
                            <ButtonComponent type="submit" onClick={handleNext}>
                                {currentStep === 0 ? "Next" : "Submit"}
                            </ButtonComponent>
                        </div>
                    </div>
                </CardContainer>
            </Spin>
        </>
    );
};

export default CreateAccounting;
