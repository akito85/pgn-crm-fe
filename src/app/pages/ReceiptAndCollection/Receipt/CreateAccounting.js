import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, notification } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import CardContainerNoBorder from "../../../../components/CardContainerNoBorder";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import { FormStepper } from "../../../../components/FormStepNavigation";
import {
    columnsAccounting,
    computeRowSpans,
    ACCOUNTING_MERGED_FIELDS,
} from "../../RatingBillingInvoice/Accounting/Table/TableAccounting";
import { separatorNumber } from "../../../../utils";
import moment from "moment";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../constants/configApp";
import { getListCategoryReceipt } from "../../../../redux/slices/receipt_collection/receipt";
import {
    getReceiptJournalRecommendation,
    saveReceiptJournalAsDraft,
    submitAccountingAllocation,
} from "../../../../redux/slices/receipt_collection/accounting";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";

const ReadOnlyField = ({ label, value }) => (
    <div className="flex flex-col mb-3">
        <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">
            {label}
        </span>
        <span className="text-[13px] text-gray-800 font-semibold border-b border-gray-200 pb-1">
            {value || "-"}
        </span>
    </div>
);

/**
 * Create Accounting Page for Receipt
 *
 * Journal data is built from M_PAY_RECEIPT + R_PAY_RECEIPT_ALLOCATION by the backend
 * (GET /v1/dbs/api/receipt/accounting/recommendation/{receiptId}).
 * Debit GL  → R_PAY_BANK_ACCOUNT_GL.cash.accountNumber (via receipt bankId)
 * Credit GL → M_GL_ACCOUNT_MAPPING where criteriaName='SEGMENT_ID'; GL 2005010000 for METERAI
 * e-Meterai rule (≤ Rp 5,000,000 → no stamp duty) is enforced on the backend.
 *
 * Table columns use the same columnsAccounting() definition as /accounting/create
 * so the look and feel is consistent across the application.
 *
 * Flow: Step 1 (CREATE) → Step 2 (ATTACHMENT) → Submit
 */
const CreateAccounting = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const searchInput = useRef(null);

    // Receipt data passed via navigation state from the receipt list
    const receiptData = location?.state || {};

    // UI state
    const [currentStep, setCurrentStep] = useState(0); // 0: CREATE, 1: ATTACHMENT
    const [loading, setLoading] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Search state for per-column client-side filtering
    const [search, setSearch] = useState({});
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    // Journal recommendation received from backend
    const [recommendation, setRecommendation] = useState({
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
        },
        details: [],
        balanced: null,
    });

    // Steps definition for stepper
    const steps = [
        { title: "CREATE", value: "create" },
        { title: "ATTACHMENT", value: "attachment" },
    ];

    // Breadcrumbs
    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT, breadcrumbName: "Receipt" },
        { path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_ACCOUNTING, breadcrumbName: "Create Accounting" },
    ];

    useEffect(() => {
        if (receiptData?.id) {
            fetchJournalRecommendation();
        }
    }, [receiptData?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchJournalRecommendation = async () => {
        try {
            setLoading(true);
            const response = await dispatch(
                getReceiptJournalRecommendation({ receiptId: receiptData.id })
            ).unwrap();
            if (response) {
                setRecommendation(response);
            }
        } catch (error) {
            console.error("Error fetching journal recommendation:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        const value = selectedKeys[0] ?? "";
        setSearchText(value);
        setSearchedColumn(dataIndex);
        setSearch((prev) => ({ ...prev, [dataIndex]: value || undefined }));
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearch((prev) => {
            const next = { ...prev };
            delete next[dataIndex];
            return next;
        });
        setSearchText("");
    };

    // Flatten recommendation details to keyed rows
    const journalData = useMemo(
        () => (recommendation?.details || []).map((item, idx) => ({ ...item, key: idx })),
        [recommendation]
    );

    const NUMERIC_JOURNAL_COLS = ["exchangeRate", "amount", "equivAmountIdr", "equivAmountUsd"];

    const filteredJournalData = useMemo(() => {
        const activeFilters = Object.entries(search).filter(([, val]) => val);
        if (!activeFilters.length) return journalData;
        return journalData.filter((record) =>
            activeFilters.every(([col, val]) => {
                const cellValue = NUMERIC_JOURNAL_COLS.includes(col)
                    ? separatorNumber(record[col])
                    : record[col];
                return cellValue?.toString()?.toLowerCase()?.includes(val.toLowerCase());
            })
        );
    }, [journalData, search]); // eslint-disable-line react-hooks/exhaustive-deps

    // Group rows by transactionNumber — one table per group
    const groupedJournals = useMemo(() => {
        const groups = {};
        filteredJournalData.forEach((item) => {
            const key = item.transactionNumber || `_row_${item.key}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });
        return Object.values(groups);
    }, [filteredJournalData]);

    // Pre-compute column definitions per group (rowSpans included)
    const groupedJournalColumns = useMemo(
        () =>
            groupedJournals.map((groupRows, idx) => {
                const rowSpans = computeRowSpans(groupRows, ACCOUNTING_MERGED_FIELDS);
                return columnsAccounting(
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    search,
                    rowSpans,
                    idx + 1,
                    groupRows.length,
                    handleReset
                );
            }),
        [groupedJournals, search, searchText, searchedColumn]
    );

    // -------------------------------------------------------------------------
    // Event handlers
    // -------------------------------------------------------------------------

    const handleNext = () => {
        if (currentStep === 0) {
            setCurrentStep(1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentStep === 1) {
            setCurrentStep(0);
        }
    };

    const handleCancel = () => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT);
    };

    const handleSaveDraft = async () => {
        try {
            setLoading(true);
            await dispatch(
                saveReceiptJournalAsDraft({ receiptId: receiptData.id })
            ).unwrap();
        } catch (error) {
            console.error("Error saving journal draft:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payPeriod = receiptData?.receiptDate
                ? moment(receiptData.receiptDate).format("YYYYMM")
                : moment().format("YYYYMM");
            const submitResult = await dispatch(
                submitAccountingAllocation({ receiptId: receiptData.id, payPeriod })
            ).unwrap();

            // Upload attachments to M_ATTACHMENT using the accounting journal entryId
            const entryId = submitResult?.entryId;
            if (attachments.length > 0 && entryId) {
                for (const element of attachments) {
                    const formData = new FormData();
                    formData.append("files", element.file);
                    formData.append("fileCategoryId", element.fileCategoryId);
                    const uploadResult = await receiptCollectionHttpService.uploadAttachment(
                        `/v1/dbs/api/receipt/accounting/upload-attachment/${entryId}`,
                        formData
                    );
                    if (uploadResult && uploadResult.success === false) {
                        notification.error({
                            message: "Upload Failed",
                            description: uploadResult.message || "Failed to upload attachment",
                        });
                        return;
                    }
                }
            }

            navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT);
        } catch (error) {
            console.error("Error submitting accounting:", error);
            notification.error({
                message: "Error",
                description: error?.response?.data?.message || error?.message || "An error occurred",
            });
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------------------------
    // Render helpers
    // -------------------------------------------------------------------------

    const renderCreateStep = () => {
        const transactionDateFormatted = receiptData?.receiptDate
            ? new Date(receiptData.receiptDate).toLocaleDateString("id-ID")
            : "-";
        const billingPeriodFormatted = receiptData?.paymentPeriod
            ? new Date(receiptData.paymentPeriod).toLocaleDateString("id-ID")
            : (receiptData?.paymentPeriod || "-");

        return (
            <div className="w-full">
                {/* Accounting Information */}
                <CardContainer subHeader="Accounting Information">
                    <CardContainerNoBorder
                        header="Customer Information"
                        collapsible={true}
                        defaultExpanded={true}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6">
                            <ReadOnlyField
                                label="Account Number"
                                value={receiptData?.accountNumber}
                            />
                            <ReadOnlyField
                                label="Account Name"
                                value={receiptData?.account}
                            />
                            <ReadOnlyField
                                label="Customer Number"
                                value={recommendation?.customerInfo?.customerNumber}
                            />
                            <ReadOnlyField
                                label="Customer Name"
                                value={receiptData?.customer}
                            />
                            <ReadOnlyField
                                label="Cost Center"
                                value={receiptData?.costCenter}
                            />
                            <ReadOnlyField
                                label="Customer Segment"
                                value={receiptData?.accountSegment}
                            />
                            <ReadOnlyField
                                label="Customer Group"
                                value={receiptData?.accountGroup}
                            />
                            <ReadOnlyField
                                label="Account Type"
                                value={receiptData?.accountType}
                            />
                            <ReadOnlyField
                                label="Classification Type"
                                value="-"
                            />
                        </div>
                    </CardContainerNoBorder>

                    <CardContainerNoBorder
                        header="Billing Information"
                        collapsible={true}
                        defaultExpanded={true}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6">
                            <ReadOnlyField
                                label="Billing Code"
                                value="-"
                            />
                            <ReadOnlyField
                                label="Billing Period"
                                value={billingPeriodFormatted}
                            />
                            <ReadOnlyField
                                label="Billing Cycle"
                                value={receiptData?.paymentCycle}
                            />
                            <ReadOnlyField
                                label="Transaction Date"
                                value={null}
                            />
                        </div>
                    </CardContainerNoBorder>
                </CardContainer>

                {/* Journal Information */}
                <CardContainer subHeader="Journal Information">
                    {groupedJournals.length === 0 ? (
                        <CardContainerNoBorder
                            header="Journal 1"
                            collapsible={true}
                            defaultExpanded={true}
                        >
                            <TableRBI
                                idTable="receipt-accounting-journal-table-empty"
                                dataSource={[]}
                                columns={columnsAccounting(searchInput, searchedColumn, searchText, handleSearch, search, {}, 1, 0, handleReset)}
                                totalData={0}
                                tableScrolled={{ x: 11000, y: 400 }}
                                loading={loading}
                                showExport={false}
                                usePagination={false}
                                useInfiniteScroll={false}
                                showRefresh={false}
                                tableSize="small"
                            />
                        </CardContainerNoBorder>
                    ) : (
                        groupedJournals.map((groupRows, idx) => (
                            <CardContainerNoBorder
                                key={idx}
                                header={`Journal ${idx + 1}`}
                                collapsible={true}
                                defaultExpanded={true}
                            >
                                <TableRBI
                                    idTable={`receipt-accounting-journal-table-${idx}`}
                                    dataSource={groupRows}
                                    columns={groupedJournalColumns[idx]}
                                    totalData={groupRows.length}
                                    tableScrolled={{ x: 11000, y: 400 }}
                                    loading={loading}
                                    showExport={false}
                                    usePagination={false}
                                    useInfiniteScroll={false}
                                    showRefresh={false}
                                    tableSize="small"
                                    rowClassName={(record) =>
                                        record.transactionGroups === "C" ? "accounting-counterpart-row" : ""
                                    }
                                />
                            </CardContainerNoBorder>
                        ))
                    )}
                </CardContainer>
            </div>
        );
    };

    const renderAttachmentStep = () => (
        <div className="w-full">
            <CardContainer subHeader="Attachment Information">
                <AttachmentComponent
                    type="create"
                    data={attachments}
                    updateData={setAttachments}
                    dispatch={dispatch}
                    getAPICategory={getListCategoryReceipt}
                    typeSelector="receipt"
                    service={receiptCollectionHttpService}
                    configApplication={configApp.PAYMENT_SERVICE}
                    typeRBI={"data"}
                    mandatory={false}
                />
            </CardContainer>
        </div>
    );

    // -------------------------------------------------------------------------
    // Main render
    // -------------------------------------------------------------------------

    return (
        <>
            <style>{`
                .accounting-counterpart-row > td {
                    background-color: #f5f5f5 !important;
                }
            `}</style>
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

                    {/* Step Content */}
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
                        </div>
                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <ButtonComponent type="submit" onClick={handlePrevious}>
                                    Previous
                                </ButtonComponent>
                            )}
                            {currentStep === 0 && (
                                <ButtonComponent type="default" onClick={handleSaveDraft}>
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