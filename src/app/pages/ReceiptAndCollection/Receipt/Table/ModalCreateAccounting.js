import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Collapse, Spin, Button } from "antd";
import { UpOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import DetailText from "../../../../../components/DetailText";
import TablePagination from "../../../../../components/TablePagination";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { columnJournal } from "./ColumnJournal";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getListCategoryReceipt } from "../../../../../redux/slices/receipt_collection/receipt";

const { Panel } = Collapse;

/**
 * Modal component for Create Accounting
 * Displays journal information from Oracle procedure: pack_accounting.f_get_accounting_aloc
 * 
 * Flow: Step 1 (CREATE) → Step 2 (ATTACHMENT) → Submit
 */
const ModalCreateAccounting = ({
    isOpen,
    handleCancel,
    receiptData = {},
    onSubmit = () => { },
}) => {
    const dispatch = useDispatch();
    const searchInput = useRef(null);

    // Redux state (adjust based on your redux structure)
    // const { loading, accountingData } = useSelector((state) => state.accounting);

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

    useEffect(() => {
        // Fetch accounting allocation data when modal opens
        if (isOpen && receiptData?.id) {
            // Reset state on open
            setCurrentStep(0);
            setAttachments([]);
            setActiveKeys(['customer', 'account', 'journal']);
            setJournal1Page(1);
            setJournal2Page(1);

            fetchAccountingAllocation();
        }
    }, [isOpen, receiptData?.id]);

    const fetchAccountingAllocation = async () => {
        try {
            setLoading(true);

            // Extract pay period from receipt date (format: YYYYMM)
            const payPeriod = receiptData?.receiptDate
                ? moment(receiptData.receiptDate).format("YYYYMM")
                : moment().format("YYYYMM");

            // TODO: Dispatch action to call backend API
            // const response = await dispatch(getAccountingAllocation({
            //   receiptId: receiptData.id,
            //   payPeriod: payPeriod,
            // })).unwrap();

            // Mock response for now
            const mockResponse = {
                customerInfo: {
                    customerNumber: receiptData?.customerNumber || "CST000000005087",
                    customerName: receiptData?.customerName || "ARGO PANTES TBK",
                    billPeriod: moment(receiptData?.receiptDate).format("MMM YYYY").toUpperCase() || "DEC 2025",
                },
                accountInfo: {
                    accountNumber: receiptData?.accountNumber || "00200837",
                    accountName: receiptData?.accountName || "ARGO PANTES TBK",
                    accountReferenceId: receiptData?.accountReferenceId || "00232966",
                },
                journal1: [
                    {
                        id: 1,
                        joinOrganizationCodeInSap: "A001",
                        year: "2025",
                        month: "10",
                        postBatchNumber: "SCRI - BIL OCT 2025",
                        transactionNumber: "01IM02561SDR",
                    },
                    {
                        id: 2,
                        joinOrganizationCodeInSap: "A002",
                        year: "2025",
                        month: "10",
                        postBatchNumber: "SCRI - BIL OCT 2025",
                        transactionNumber: "01IM02565DRDM",
                    },
                ],
                journal2: [
                    {
                        id: 1,
                        joinOrganizationCodeInSap: "A001",
                        year: "2025",
                        month: "10",
                        postBatchNumber: "SCRI - BIL OCT 2025",
                        transactionNumber: "01IM02561SDR",
                    },
                    {
                        id: 2,
                        joinOrganizationCodeInSap: "A002",
                        year: "2025",
                        month: "10",
                        postBatchNumber: "SCRI - BIL OCT 2025",
                        transactionNumber: "01IM02565DRDM",
                    },
                ],
            };

            setAccountingData(mockResponse);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching accounting allocation:", error);
            setLoading(false);
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

    const handleSubmit = () => {
        const submitData = {
            receiptId: receiptData?.id,
            journal1: accountingData.journal1,
            journal2: accountingData.journal2,
            attachments: attachments,
        };
        onSubmit(submitData);
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

    const steps = [
        { title: "CREATE" },
        { title: "ATTACHMENT" },
    ];

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="CREATE ACCOUNTING"
            width={1200}
            footer={null}
        >
            <FormStepper
                steps={steps}
                current={currentStep}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            <Spin spinning={loading}>
                <div className="mt-4">
                    {currentStep === 0 && renderCreateStep()}
                    {currentStep === 1 && renderAttachmentStep()}
                </div>
            </Spin>

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
                                key="btn-next"
                                htmlType="button"
                                onClick={handleNext}
                                type="primary"
                                style={{
                                    backgroundColor: "#0075BF",
                                    borderColor: "#0075BF",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    height: "32px",
                                    fontSize: "12px",
                                }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                key="btn-submit"
                                htmlType="button"
                                onClick={handleSubmit}
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

export default ModalCreateAccounting;
