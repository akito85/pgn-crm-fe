import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainerNoBorder from "../../../../components/CardContainerNoBorder";
import SectionCard from "../../../../components/SectionCard";
import DetailText from "../../../../components/DetailText";
import { FormStepper, FormFooter } from "../../../../components/FormStepNavigation";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import TableRBI from "../../../../components/TableRBI";
import { hasValue } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import {
    getAccountingAllocation,
    submitAccountingAllocation
} from "../../../../redux/slices/receipt_collection/accounting";
import { getListCategoryReceipt } from "../../../../redux/slices/receipt_collection/receipt";
import { clearBodyMessage } from "../../../../redux/slices/general_slice";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../constants/configApp";

/**
 * Create Accounting Page for Receipt
 * Displays journal information from Oracle: pack_accounting.f_get_accounting_aloc
 *
 * Flow: Step 1 (CREATE) → Step 2 (ATTACHMENT) → Submit
 *
 * Table uses ROWSPAN:
 *   - Group (transaction) level columns span multiple rows per zno_pembayaran group
 *   - Line (item) level columns show per-row values (BUZEI, INV NUMBER, BILLING ITEM, etc.)
 */
const CreateAccounting = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const searchInput = useRef(null);

    const receiptData = location?.state || {};
    const { loading: accountingLoading } = useSelector((state) => state.accounting);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accountingData, setAccountingData] = useState({
        customerInfo: {
            customerNumber: receiptData?.customerNumber || "",
            customerName: receiptData?.customerName || receiptData?.customer || "",
            billPeriod: receiptData?.receiptDate
                ? moment(receiptData.receiptDate).format("MMM YYYY").toUpperCase()
                : "",
        },
        accountInfo: {
            accountNumber: receiptData?.accountNumber || "",
            accountName: receiptData?.accountName || receiptData?.account || "",
            accountReferenceId: receiptData?.accountReferenceId || "",
        },
        journal1: [],
        journal2: [],
    });

    // Table state
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchFilter1, setSearchFilter1] = useState({});
    const [searchFilter2, setSearchFilter2] = useState({});
    const [pagination1, setPagination1] = useState({ current: 1, pageSize: 10 });
    const [pagination2, setPagination2] = useState({ current: 1, pageSize: 10 });

    const steps = [{ title: "CREATE" }, { title: "ATTACHMENT" }];

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT, breadcrumbName: "Receipt" },
        { path: "", breadcrumbName: "Receipt List" },
        { path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_ACCOUNTING, breadcrumbName: "Create Accounting" },
    ];

    useEffect(() => {
        if (receiptData?.id) fetchAccountingAllocation();
        return () => { dispatch(clearBodyMessage()); };
    }, [receiptData?.id]);

    const fetchAccountingAllocation = async () => {
        try {
            setLoading(true);
            const payPeriod = receiptData?.receiptDate
                ? moment(receiptData.receiptDate).format("YYYYMM")
                : moment().format("YYYYMM");

            const response = await dispatch(getAccountingAllocation({
                receiptId: receiptData.id,
                payPeriod: payPeriod,
            })).unwrap();

            if (response) setAccountingData(response);
        } catch (error) {
            console.error("Error fetching accounting allocation:", error);
        } finally {
            setLoading(false);
        }
    };

    // =============================================
    // ROWSPAN PROCESSING
    // Group by: zno_pembayaran (Payment Number)
    // Each payment can have multiple line items (buzei)
    // =============================================
    const processDataWithRowspan = (data) => {
        if (!data || data.length === 0) return [];

        const groups = [];
        const groupMap = new Map();

        data.forEach(row => {
            // Use payment number as group key; fallback to batch number
            const key = row.zno_pembayaran || row.zbatch || `row-${JSON.stringify(row)}`;
            if (!groupMap.has(key)) {
                groupMap.set(key, []);
                groups.push(key);
            }
            groupMap.get(key).push(row);
        });

        const result = [];
        let groupIndex = 1;

        groups.forEach(key => {
            const rows = groupMap.get(key);
            rows.forEach((row, i) => {
                result.push({
                    ...row,
                    _rowSpan: i === 0 ? rows.length : 0, // rowSpan=0 hides the cell
                    _groupIndex: groupIndex,
                    _isFirstRow: i === 0,
                });
            });
            groupIndex++;
        });

        return result;
    };

    // =============================================
    // FILTERING & PAGINATION
    // Filter on raw data FIRST, then apply rowspan
    // =============================================
    const getFilteredData = (data, filter) => {
        let result = [...(data || [])];
        Object.keys(filter).forEach(key => {
            const fv = filter[key];
            if (hasValue(fv)) {
                const val = fv.toString().toLowerCase();
                result = result.filter(item =>
                    item[key]?.toString().toLowerCase().includes(val)
                );
            }
        });
        return result;
    };

    // Journal 1
    const processedJournal1 = useMemo(() => {
        const filtered = getFilteredData(accountingData?.journal1, searchFilter1);
        return processDataWithRowspan(filtered);
    }, [accountingData?.journal1, searchFilter1]);

    const paginatedJournal1 = useMemo(() => {
        const { current, pageSize } = pagination1;
        return processedJournal1.slice((current - 1) * pageSize, current * pageSize);
    }, [processedJournal1, pagination1]);

    // Journal 2
    const processedJournal2 = useMemo(() => {
        const filtered = getFilteredData(accountingData?.journal2, searchFilter2);
        return processDataWithRowspan(filtered);
    }, [accountingData?.journal2, searchFilter2]);

    const paginatedJournal2 = useMemo(() => {
        const { current, pageSize } = pagination2;
        return processedJournal2.slice((current - 1) * pageSize, current * pageSize);
    }, [processedJournal2, pagination2]);

    // =============================================
    // COLUMN HELPERS
    // =============================================
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getColSearch = (dataIndex, setFilter) =>
        getColumnSearchPropsUseFilteredValueFE(
            setFilter,
            dataIndex,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            false,
            "input"
        );

    // Group-level column (rowspan across line items)
    const grpCol = (title, dataIndex, width, setFilter, extra = {}) => ({
        title,
        dataIndex,
        width,
        onCell: (record) => ({ rowSpan: record._rowSpan ?? 1 }),
        sorter: null, // disable sorter on rowspan cols to avoid confusion
        ...getColSearch(dataIndex, setFilter),
        ...extra,
    });

    // Line-level column (per line item, no rowspan)
    const lineCol = (title, dataIndex, width, setFilter, extra = {}) => ({
        title,
        dataIndex,
        width,
        ...getColSearch(dataIndex, setFilter),
        sorter: (a, b) => (a[dataIndex] ?? "").toString().localeCompare((b[dataIndex] ?? "").toString()),
        ...extra,
    });

    // =============================================
    // COLUMN DEFINITIONS (41 columns)
    // Group cols: rowspan per transaction (zno_pembayaran group)
    // Line cols:  each row shows its own value
    // =============================================
    const buildColumns = (setFilter) => [
        // === NO: shows group index (rowspan) ===
        {
            title: "NO",
            width: 60,
            align: "center",
            fixed: "left",
            onCell: (record) => ({ rowSpan: record._rowSpan ?? 1 }),
            render: (_, record) => record._groupIndex,
        },

        // === GROUP-LEVEL columns ===
        grpCol("PGN ORGANIZATION CODE IN SAP", "bukrs", 200, setFilter),
        grpCol("YEAR", "ryear", 100, setFilter, { align: "center" }),
        grpCol("MONTH", "monat", 100, setFilter, { align: "center" }),
        grpCol("POST BATCH NUMBER", "zbatch", 180, setFilter),
        grpCol("TRANSACTION NUMBER", "zno_pembayaran", 180, setFilter),

        // === LINE-LEVEL columns ===
        lineCol("LINE NUMBER", "buzei", 130, setFilter, { align: "center" }),
        lineCol("INV NUMBER", "zno_tag", 160, setFilter),
        lineCol("TRANSACTION TYPE", "ztipe_tran", 160, setFilter),

        // === GROUP-LEVEL columns (continue) ===
        grpCol("ACCOUNT NUMBER", "zkode_cust", 160, setFilter),
        grpCol("ACC. SOR", "zsor", 120, setFilter),
        grpCol("ACC. COST CENTER/AREA", "zarea", 200, setFilter),
        grpCol("ACCOUNT SEGMENT", "zsegmen_pel", 180, setFilter),
        grpCol("ACCOUNT GROUP TYPE", "zkel_pel", 180, setFilter),
        grpCol("ACCOUNT TYPE", "zjenis_rek", 150, setFilter),

        // === LINE-LEVEL: billing item columns ===
        lineCol("BILLING ITEM CODE", "zkomp_bil", 180, setFilter),
        lineCol("BILL PERIOD", "zbilling_per", 150, setFilter),

        // === GROUP-LEVEL columns (continue) ===
        grpCol("RATE TYPE", "zkurs", 130, setFilter),
        grpCol("DUE DATE", "wwert", 160, setFilter, {
            render: (text) => text ? moment(text).format("DD MMM YYYY") : "-",
        }),
        grpCol("CUST ID SAP", "kunnr", 160, setFilter),
        grpCol("CATEGORY SAP", "blart", 150, setFilter),
        grpCol("DOCUMENT DATE", "bldat", 160, setFilter, {
            render: (text) => text ? moment(text).format("DD MMM YYYY") : "-",
        }),
        grpCol("POSTING DATE", "budat", 160, setFilter, {
            render: (text) => text ? moment(text).format("DD MMM YYYY") : "-",
        }),
        grpCol("CURRENCY", "waers", 110, setFilter, { align: "center" }),
        grpCol("EXCHANGE RATE", "kursf", 150, setFilter, {
            align: "right",
            render: (val) => val != null ? Number(val).toLocaleString("id-ID") : "-",
        }),
        grpCol("TRANSACTION GROUPS", "koart", 180, setFilter),
        grpCol("GL ACCOUNT", "hkont", 150, setFilter),
        grpCol("AMOUNT", "wrbtr", 170, setFilter, {
            align: "right",
            render: (val) => val != null ? Number(val).toLocaleString("id-ID") : "-",
        }),
        grpCol("EQV AMOUNT IDR", "dmbtr", 170, setFilter, {
            align: "right",
            render: (val) => val != null ? Number(val).toLocaleString("id-ID") : "-",
        }),
        grpCol("EQV AMOUNT USD", "dmbe2", 170, setFilter, {
            align: "right",
            render: (val) => val != null ? Number(val).toLocaleString("id-ID") : "-",
        }),
        grpCol("SPECIAL GL", "umskz", 120, setFilter, { align: "center" }),
        grpCol("PROFIT CENTER", "prctr", 160, setFilter),
        grpCol("WITHOLDING TAX TYPE", "witht", 190, setFilter),
        grpCol("WITHOLDING TAX CODE", "qsskz", 190, setFilter),
        grpCol("COST CENTER", "kostl", 150, setFilter),
        grpCol("TRANSACTION REFERENCE", "zuonr", 200, setFilter),
        grpCol("TEXT", "sgtxt", 200, setFilter, { ellipsis: true }),

        // === LINE-LEVEL: reference columns ===
        lineCol("REFERENCE 1", "xref1", 150, setFilter),
        lineCol("REFERENCE 2", "xref2", 150, setFilter),
        lineCol("REFERENCE 3", "xref3", 150, setFilter),
        lineCol("METER READING CODE", "meterReadingCode", 190, setFilter),
        lineCol("F", "f", 90, setFilter, { align: "center" }),
    ];

    const journalColumns1 = useMemo(() => buildColumns(setSearchFilter1), [searchedColumn, searchText]);
    const journalColumns2 = useMemo(() => buildColumns(setSearchFilter2), [searchedColumn, searchText]);

    // =============================================
    // NAVIGATION
    // =============================================
    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) setCurrentStepIndex(prev => prev + 1);
    };
    const handlePrev = () => {
        if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
    };
    const handleCancel = () => {
        dispatch(clearBodyMessage());
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT);
    };
    const handleClear = () => {
        setAccountingData(prev => ({ ...prev, journal1: [], journal2: [] }));
    };
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payPeriod = receiptData?.receiptDate
                ? moment(receiptData.receiptDate).format("YYYYMM")
                : moment().format("YYYYMM");
            await dispatch(submitAccountingAllocation({
                receiptId: receiptData.id,
                payPeriod: payPeriod,
            })).unwrap();
            navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT);
        } catch (error) {
            console.error("Error submitting accounting:", error);
        } finally {
            setLoading(false);
        }
    };

    // =============================================
    // RENDER TABLE SECTION
    // =============================================
    const renderJournalTable = (label, dataSource, columns, pagination, setPagination, totalData, setFilter) => (
        <SectionCard title={label} collapsible>
            <TableRBI
                idTable={`journal-${label.toLowerCase().replace(" ", "-")}-table`}
                dataSource={dataSource}
                columns={columns}
                loading={loading || accountingLoading}
                tableScrolled={{ x: 5500 }}
                useSelect={true}
                usePagination={true}
                showSearchBar={true}
                showAdvanceSearch={true}
                current={pagination.current}
                pageSize={pagination.pageSize}
                totalData={totalData}
                onSizeChanger={(_, size) => {
                    setPagination({ current: 1, pageSize: size });
                }}
                onChange={(page) => setPagination(prev => ({ ...prev, current: page }))}
                onAdvanceSearch={(data) => {
                    setFilter(prev => data ? { ...prev, ...data } : {});
                    setPagination(prev => ({ ...prev, current: 1 }));
                }}
            />
            <div className="mt-3 flex items-center gap-2">
                <input type="checkbox" disabled checked={false} />
                <label className="text-xs text-gray-500">Posting to SAP</label>
            </div>
        </SectionCard>
    );

    // =============================================
    // STEP 1: CREATE
    // =============================================
    const renderCreateStep = () => (
        <>
            <CardContainerNoBorder header="ACCOUNTING INFORMATION" noPadding>
                <div className="flex flex-col gap-1 p-5">
                    <SectionCard title="CUSTOMER INFORMATION" collapsible>
                        <div className="grid grid-cols-5 w-full gap-y-4 gap-x-4">
                            <DetailText label="Customer Number">
                                {accountingData?.customerInfo?.customerNumber || "-"}
                            </DetailText>
                            <DetailText label="Customer Name">
                                {accountingData?.customerInfo?.customerName || "-"}
                            </DetailText>
                            <DetailText label="Bill Period">
                                {accountingData?.customerInfo?.billPeriod || "-"}
                            </DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="ACCOUNT INFORMATION" collapsible>
                        <div className="grid grid-cols-5 w-full gap-y-4 gap-x-4">
                            <DetailText label="Account Number">
                                {accountingData?.accountInfo?.accountNumber || "-"}
                            </DetailText>
                            <DetailText label="Account Name">
                                {accountingData?.accountInfo?.accountName || "-"}
                            </DetailText>
                            <DetailText label="Account Reference ID">
                                {accountingData?.accountInfo?.accountReferenceId || "-"}
                            </DetailText>
                        </div>
                    </SectionCard>
                </div>
            </CardContainerNoBorder>

            <CardContainerNoBorder header="JOURNAL INFORMATION" className="mt-4" noPadding>
                <div className="flex flex-col gap-3 p-5">
                    {renderJournalTable(
                        "JOURNAL 1",
                        paginatedJournal1,
                        journalColumns1,
                        pagination1,
                        setPagination1,
                        processedJournal1.length,
                        setSearchFilter1
                    )}
                    {renderJournalTable(
                        "JOURNAL 2",
                        paginatedJournal2,
                        journalColumns2,
                        pagination2,
                        setPagination2,
                        processedJournal2.length,
                        setSearchFilter2
                    )}
                </div>
            </CardContainerNoBorder>
        </>
    );

    // =============================================
    // STEP 2: ATTACHMENT
    // =============================================
    const renderAttachmentStep = () => (
        <CardContainerNoBorder header="ATTACHMENT INFORMATION" noPadding>
            <div className="p-5">
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
        </CardContainerNoBorder>
    );

    return (
        <>
            <BreadCrumb routes={routes} />

            <div className="mb-3">
                <FormStepper
                    steps={steps}
                    current={currentStepIndex}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>

            <Spin spinning={loading || accountingLoading}>
                <div className={currentStepIndex !== 0 ? "hidden" : ""}>
                    {renderCreateStep()}
                </div>
                <div className={currentStepIndex !== 1 ? "hidden" : ""}>
                    {renderAttachmentStep()}
                </div>

                <FormFooter
                    current={currentStepIndex}
                    totalSteps={steps.length}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onCancel={handleCancel}
                    onClear={handleClear}
                    onSubmit={handleSubmit}
                    type="create"
                />
            </Spin>
        </>
    );
};

export default CreateAccounting;
