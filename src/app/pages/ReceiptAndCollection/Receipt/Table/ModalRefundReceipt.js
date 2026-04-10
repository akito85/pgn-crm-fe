
import { useEffect, useState } from "react";
import { Button, message, Input, InputNumber, DatePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { columnsReceipt } from "../ColumnReceiptView";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getReceiptCustomerList, getListCategoryReceipt, getAllApprovalListReceipt, getListApprovalByIdReceipt } from "../../../../../redux/slices/receipt_collection/receipt";
import RadioTabs from "../../../../../components/RadioTabs";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";

const ModalRefundReceipt = ({
    isOpen,
    handleCancel,
    onSubmit,
}) => {
    const dispatch = useDispatch();
    const { data_customer_list, loading, dataListAppHierId, dataListAppHierDetail } = useSelector((state) => state.receipt);

    const [currentStep, setCurrentStep] = useState(0);

    // Approval State
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [selectedAppHierId, setSelectedAppHierId] = useState(null);

    // Step 1 Selection State
    const [localSelectedData, setLocalSelectedData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Step 2 Selection State (Receipts)
    const [eligibleReceipts, setEligibleReceipts] = useState([]); // Filtered receipts
    const [selectedReceipts, setSelectedReceipts] = useState([]);
    const [selectedReceiptRowKeys, setSelectedReceiptRowKeys] = useState([]);
    const [pageReceipt, setPageReceipt] = useState(1);
    const [pageSizeReceipt, setPageSizeReceipt] = useState(10);

    // Refund Date State
    const [refundDate, setRefundDate] = useState(moment()); // Default: today

    const onReceiptSelectChange = (newSelectedRowKeys, newSelectedRows) => {
        setSelectedReceiptRowKeys(newSelectedRowKeys);
        setSelectedReceipts(newSelectedRows);
    };

    const receiptRowSelection = {
        selectedRowKeys: selectedReceiptRowKeys,
        onChange: onReceiptSelectChange,
        type: 'checkbox',
    };

    const handleReceiptChangePage = (p, ps) => {
        setPageReceipt(p);
        setPageSizeReceipt(ps);
    };

    // Step 3 State (Refund Customer Info)
    const [refundAmountData, setRefundAmountData] = useState({});
    const [remarkStep3, setRemarkStep3] = useState("");

    // Step 4 State (Refund Receipt Info)
    const [refundReceiptAmountData, setRefundReceiptAmountData] = useState({});
    const [remarkStep4, setRemarkStep4] = useState("");

    // Step 5 & 6 State
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [confirmationTab, setConfirmationTab] = useState("Customer");

    const handleTabChange = (e) => {
        setConfirmationTab(e.target.value);
    };

    // Columns for Step 2
    const columnsStep2 = columnsReceipt(
        {},
        pageReceipt,
        pageSizeReceipt,
        null,
        null,
        null,
        () => { },
        () => { },
        () => { }
    );

    // Initialize/Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setLocalSelectedData([]);
            setSelectedRowKeys([]);
            setPage(1);
            setSelectedAppHierId(null);
            setAppHierDataDetail([]);
            dispatch(getReceiptCustomerList({ page: 1, pageSize: 10, sort: "createdDate~desc" }));
            dispatch(getAllApprovalListReceipt());
        }
    }, [isOpen, dispatch]);

    // Sync approval hierarchy options
    useEffect(() => {
        if (dataListAppHierId && dataListAppHierId.length > 0) {
            setAppHierOptions(dataListAppHierId.map((a) => ({ name: a.approvalName, value: a.appHierId })));
        }
    }, [dataListAppHierId]);

    // Sync approval hierarchy detail
    useEffect(() => {
        if (selectedAppHierId) {
            dispatch(getListApprovalByIdReceipt({ id: selectedAppHierId }));
        }
    }, [selectedAppHierId, dispatch]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            setAppHierDataDetail(dataListAppHierDetail.map((a, idx) => ({ ...a, key: idx + 1, employeeDetail: a.employeeDetail?.map((b, i) => ({ ...b, key: i + 1 })) || [] })));
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    // Fetch eligible receipts when entering Step 2 (Approved & Balance > 0)
    useEffect(() => {
        if (currentStep === 1 && isOpen) {
            const fetchEligibleReceipts = async () => {
                try {
                    const url = `/v1/dbs/api/receipt/get-list?searchs=&page=0&size=9999&sort=createdDate~desc`;
                    const response = await receiptCollectionHttpService.getAll(url);

                    const content = response?.data?.result || [];
                    const eligible = content.filter(item =>
                        item.statusApproval === "Approved" &&
                        (item.unAppliedAmountReal > 0 || item.unAppliedAmount > 0)
                    );

                    setEligibleReceipts(eligible);
                } catch (error) {
                    console.error('Error fetching eligible receipts:', error);
                    setEligibleReceipts([]);
                }
            };

            fetchEligibleReceipts();
        }
    }, [currentStep, isOpen]);

    const steps = [
        {
            title: "Customer Info",
            key: "customerInfo",
        },
        {
            title: "Receipt Info",
            key: "receiptInfo",
        },
        {
            title: "Refund Customer",
            key: "refundCustomerInfo",
        },
        {
            title: "Refund Receipt",
            key: "refundReceiptInfo",
        },
        {
            title: "Approval",
            key: "approvalInfo",
        },
        {
            title: "Attachment",
            key: "attachmentInfo",
        },
        {
            title: "Confirmation",
            key: "confirmation",
        },
    ];

    const handleNext = () => {
        if (currentStep === 0 && localSelectedData.length === 0) {
            message.warning("Please select at least one record.");
            return;
        }
        
        // Validate refund date in Step 3 (Refund Customer Information)
        if (currentStep === 2) {
            if (!refundDate) {
                message.error("Refund date is required");
                return;
            }
            
            // Check if refund date is in the future
            if (refundDate.isAfter(moment(), 'day')) {
                message.error("Refund date cannot be in the future");
                return;
            }
            
            // Check if refund date is before any receipt date
            const earliestReceiptDate = selectedReceipts.reduce((earliest, receipt) => {
                const receiptDate = moment(receipt.receiptDate);
                return !earliest || receiptDate.isBefore(earliest) ? receiptDate : earliest;
            }, null);
            
            if (earliestReceiptDate && refundDate.isBefore(earliestReceiptDate, 'day')) {
                message.error(`Refund date cannot be before receipt date (${earliestReceiptDate.format('DD MMM YYYY')})`);
                return;
            }
        }

        // Validate Approval step
        if (currentStep === 4 && !selectedAppHierId) {
            message.warning("Please select an Approval Hierarchy.");
            return;
        }
        
        setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        // Validate refund amounts match
        const totalCustomerRefund = Object.values(refundAmountData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        const totalReceiptRefund = Object.values(refundReceiptAmountData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

        if (Math.abs(totalCustomerRefund - totalReceiptRefund) > 0.01) {
            message.error(`Refund amounts mismatch! Customer refund: ${totalCustomerRefund.toLocaleString('id-ID')}, Receipt refund: ${totalReceiptRefund.toLocaleString('id-ID')}`);
            return;
        }

        if (!selectedAppHierId) {
            message.warning("Please select an Approval Hierarchy.");
            return;
        }

        // Build the receipts payload from selectedReceipts and refundReceiptAmountData
        const receiptsPayload = selectedReceipts.map((r) => ({
            receiptId: r.id,
            refundAmount: refundReceiptAmountData[r.key] || refundReceiptAmountData[r.id] || 0,
            remark: remarkStep4,
        }));

        onSubmit({
            customerId: localSelectedData[0]?.customerId || localSelectedData[0]?.key,
            appHierId: selectedAppHierId,
            refundDate: refundDate?.toDate(),
            remark: remarkStep3,
            attachmentIds: listDataAttachment.map((a) => a.id).filter(Boolean),
            receipts: receiptsPayload,
        });
    };

    const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setLocalSelectedData(newSelectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        type: 'checkbox',
    };

    const handleChangePage = (p, ps) => {
        setPage(p);
        setPageSize(ps);
        dispatch(getReceiptCustomerList({ page: p, pageSize: ps, sort: "createdDate~desc" }));
    };

    // Columns for Step 1
    const columnsStep1 = [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (_, _record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "COST CENTER",
            dataIndex: "costCenter",
            key: "costCenter",
            sorter: true,
            width: 200,
            render: (val) => val || "-"
        },
        {
            title: "CUSTOMER NUMBER",
            dataIndex: "customerNumber",
            key: "customerNumber",
            width: 200,
            render: (_, record) => record.customerNumber || record.customerId
        },
        {
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            key: "customerName",
            width: 300,
        },
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            key: "accountNumber",
            width: 200,
            render: (_, record) => record.accountNumber || record.accountId || "-"
        },
        {
            title: "TOTAL UNAPPLY AMOUNT",
            dataIndex: "unAppliedAmount",
            key: "unAppliedAmount",
            align: "right",
            sorter: true,
            width: 200,
            render: (_, record) => {
                const amount = record.unAppliedAmount || record.totalUnAppliedAmount || record.totalUnapplyAmount || 0;
                return amount ? amount.toLocaleString('id-ID') : '0';
            }
        }
    ];
    const handleRefundAmountChange = (value, recordKey) => {
        setRefundAmountData(prev => ({ ...prev, [recordKey]: value }));
    };

    const columnsStep3 = [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (_, _record, index) => index + 1,
        },
        {
            title: "COST CENTER",
            dataIndex: "costCenter",
            key: "costCenter",
            width: 200,
            render: (val) => val || "-"
        },
        {
            title: "CUSTOMER NUMBER",
            dataIndex: "customerNumber",
            key: "customerNumber",
            width: 200,
            render: (_, record) => record.customerNumber || record.customerId
        },
        {
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            key: "customerName",
            width: 300,
        },
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            key: "accountNumber",
            width: 200,
            render: (_, record) => record.accountNumber || record.accountId || "-"
        },
        {
            title: "TOTAL UNAPPLY AMOUNT",
            dataIndex: "unAppliedAmount",
            key: "unAppliedAmount",
            align: "right",
            width: 200,
            render: (_, record) => {
                const amount = record.unAppliedAmount || record.totalUnAppliedAmount || record.totalUnapplyAmount || 0;
                return amount ? amount.toLocaleString('id-ID') : '0';
            }
        },
        {
            title: "REFUND AMOUNT",
            key: "refundAmount",
            width: 200,
            align: "right",
            render: (_, record) => (
                <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\$\s?|(\.*)/g, '')}
                    value={refundAmountData[record.key]}
                    onChange={(val) => handleRefundAmountChange(val, record.key)}
                    controls={false}
                />
            )
        }
    ];
    const handleRefundReceiptAmountChange = (value, recordKey) => {
        setRefundReceiptAmountData(prev => ({ ...prev, [recordKey]: value }));
    };

    const columnsStep4 = [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (_, _record, index) => index + 1,
        },
        {
            title: "RECEIPT CODE",
            dataIndex: "receiptCode",
            key: "receiptCode",
            width: 150,
            sorter: true,
        },
        {
            title: "RECEIPT DATE",
            dataIndex: "receiptDate",
            key: "receiptDate",
            width: 150,
            sorter: true,
            align: "center",
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            width: 150,
            sorter: true,
            render: (value) => value ? value.toLocaleString('id-ID') : '-'
        },
        {
            title: "AMOUNT EQUIVALENT",
            dataIndex: "equivalentAmount",
            key: "equivalentAmount",
            align: "right",
            width: 180,
            sorter: true,
            render: (value) => value ? value.toLocaleString('id-ID') : '-'
        },
        {
            title: "UNAPPLY AMOUNT",
            dataIndex: "unAppliedAmount",
            key: "unAppliedAmount",
            width: 150,
            align: "right",
            sorter: true,
            render: (value) => value ? value.toLocaleString('id-ID') : '-'
        },
        {
            title: "EQUIVALENT UNAPPLIED AMOUNT",
            dataIndex: "equivalentUnAppliedAmount",
            key: "equivalentUnAppliedAmount",
            width: 200,
            align: "right",
            sorter: true,
            render: (value) => value ? value.toLocaleString('id-ID') : '-'
        },
        {
            title: "REFUND AMOUNT",
            key: "refundAmount",
            width: 200,
            align: "right",
            render: (_, record) => (
                <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\$\s?|(\.*)/g, '')}
                    value={refundReceiptAmountData[record.key]}
                    onChange={(val) => handleRefundReceiptAmountChange(val, record.key)}
                    controls={false}
                />
            )
        }
    ];


    const columnsStep3Confirmation = [
        ...columnsStep1,
        {
            title: "REFUND AMOUNT",
            key: "refundAmount",
            width: 200,
            align: "right",
            render: (_, record) => {
                const val = refundAmountData[record.key];
                return val ? val.toLocaleString('id-ID') : '-';
            }
        }
    ];

    const columnsStep4Confirmation = [
        ...columnsStep4.filter(c => c.key !== 'refundAmount'),
        {
            title: "REFUND AMOUNT",
            key: "refundAmount",
            width: 200,
            align: "right",
            render: (_, record) => {
                const val = refundReceiptAmountData[record.key];
                return val ? val.toLocaleString('id-ID') : '-';
            }
        }
    ];

    const renderContent = () => {
        switch (currentStep) {
            case 0: // Customer Information
                const dataSourceStep1 = data_customer_list?.result?.map(item => ({
                    ...item,
                    key: item.customerId
                })) || [];

                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-blue-500 font-bold uppercase">Customer Information</h3>
                        </div>
                        <TableRBI
                            dataSource={dataSourceStep1}
                            columns={columnsStep1}
                            rowSelection={rowSelection}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChangePage}
                            onShowSizeChange={handleChangePage}
                            totalData={data_customer_list?.page?.totalElements || 0}
                            showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Records`}
                            tableScrolled={{ x: "max-content", y: 400 }}
                            loading={loading}
                        />
                    </div>
                );
            case 1:
                const receiptDataSource = eligibleReceipts?.map(item => ({
                    ...item,
                    key: item.id
                })) || [];

                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-blue-500 font-bold uppercase">Receipt Information</h3>
                        </div>
                        <TableRBI
                            dataSource={receiptDataSource}
                            columns={columnsStep2}
                            rowSelection={receiptRowSelection}
                            current={pageReceipt}
                            pageSize={pageSizeReceipt}
                            onChange={handleReceiptChangePage}
                            onShowSizeChange={handleReceiptChangePage}
                            totalData={eligibleReceipts?.length || 0}
                            showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Records`}
                            tableScrolled={{ x: "max-content", y: 400 }}
                            loading={loading}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-blue-500 font-bold uppercase">Customer Information</h3>
                        </div>
                        <TableRBI
                            dataSource={localSelectedData}
                            columns={columnsStep3}
                            // No custom pagination logic needed for selected items list for now
                            totalData={localSelectedData.length}
                            showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Records`}
                            tableScrolled={{ x: "max-content", y: 400 }}
                            usePagination={false} // Disable external pagination if just showing list
                            useSelect={false}
                        />
                        <div className="mt-4">
                            <p className="mb-2 font-bold">Refund Date <span className="text-red-500">*</span></p>
                            <DatePicker
                                style={{ width: '300px' }}
                                value={refundDate}
                                onChange={(date) => setRefundDate(date)}
                                format="DD MMM YYYY"
                                placeholder="Select Refund Date"
                            />
                        </div>
                        <div className="mt-4">
                            <p className="mb-2 font-bold">Remark</p>
                            <Input.TextArea
                                rows={4}
                                value={remarkStep3}
                                onChange={(e) => setRemarkStep3(e.target.value)}
                                placeholder="REFUND"
                                showCount
                                maxLength={255}
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-blue-500 font-bold uppercase">Refund Information</h3>
                        </div>
                        <TableRBI
                            dataSource={selectedReceipts}
                            columns={columnsStep4}
                            pagination={false}
                            usePagination={false}
                            tableScrolled={{ x: "max-content", y: 400 }}
                            totalData={selectedReceipts.length}
                            showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Records`}
                            useSelect={false}
                        />
                        <div className="mt-4">
                            <p className="mb-2 font-bold">Remark</p>
                            <Input.TextArea
                                rows={4}
                                value={remarkStep4}
                                onChange={(e) => setRemarkStep4(e.target.value)}
                                placeholder="REFUND"
                                showCount
                                maxLength={255}
                            />
                        </div>
                    </div>
                );
            case 4: // Approval Information
                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-blue-500 font-bold uppercase">Approval Information</h3>
                        </div>
                        <ApprovalSectionForm
                            dataTable={appHierDataDetail}
                            dataOption={appHierOptions}
                            selectedHierarchy={selectedAppHierId}
                            updateSelectedHierarchy={setSelectedAppHierId}
                        />
                    </div>
                );
            case 5: // Attachment Information
                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-blue-500 font-bold uppercase">Attachment Information</h3>
                        </div>
                        <AttachmentComponent
                            data={listDataAttachment}
                            updateData={setListDataAttachment}
                            dispatch={dispatch}
                            getAPICategory={getListCategoryReceipt}
                            typeSelector="receipt"
                            service={receiptCollectionHttpService}
                            configApplication={configApp.PAYMENT_SERVICE}
                            typeRBI={"data"}
                        />
                    </div>
                );
            case 6: // Confirmation
                return (
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <RadioTabs
                                data={[
                                    { value: "Customer", label: "Customer" },
                                    { value: "Refund", label: "Refund" },
                                    { value: "Approval", label: "Approval" },
                                    { value: "Attachment", label: "Attachment" },
                                ]}
                                currentPosition={confirmationTab}
                                onChange={handleTabChange}
                            />
                            <div className="mt-4">
                                {confirmationTab === "Customer" && (
                                    <>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-blue-500 font-bold uppercase">Customer Information</h3>
                                        </div>
                                        <TableRBI
                                            dataSource={localSelectedData}
                                            columns={columnsStep3Confirmation}
                                            pagination={false}
                                            usePagination={false}
                                            tableScrolled={{ x: "max-content", y: 400 }}
                                        />
                                        <div className="mt-4">
                                            <p className="mb-2 font-bold">Refund Date</p>
                                            <div className="text-gray-700">{refundDate?.format('DD MMM YYYY') || "-"}</div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="mb-2 font-bold">Remark</p>
                                            <div className="text-gray-700">{remarkStep3 || "-"}</div>
                                        </div>
                                    </>
                                )}
                                {confirmationTab === "Refund" && (
                                    <>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-blue-500 font-bold uppercase">Refund Information</h3>
                                        </div>
                                        <TableRBI
                                            dataSource={selectedReceipts}
                                            columns={columnsStep4Confirmation}
                                            pagination={false}
                                            usePagination={false}
                                            tableScrolled={{ x: "max-content", y: 400 }}
                                        />
                                        <div className="mt-4">
                                            <p className="mb-2 font-bold">Remark</p>
                                            <div className="text-gray-700">{remarkStep4 || "-"}</div>
                                        </div>
                                    </>
                                )}
                                {confirmationTab === "Approval" && (
                                    <ApprovalSectionForm
                                        showSelect={false}
                                        disableSelect={true}
                                        approvalName={appHierOptions.find((o) => o.value === selectedAppHierId)?.name}
                                        dataTable={appHierDataDetail}
                                        selectedHierarchy={selectedAppHierId}
                                    />
                                )}
                                {confirmationTab === "Attachment" && (
                                    <AttachmentComponent
                                        data={listDataAttachment}
                                        type="preview"
                                        dispatch={dispatch}
                                        typeSelector="receipt"
                                        service={receiptCollectionHttpService}
                                        configApplication={configApp.PAYMENT_SERVICE}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="RECEIPT REFUND"
            type={"confirmation"}
            width={1200}
            footer={null}
        >
            <FormStepper
                steps={steps}
                current={currentStep}
                onPrev={handlePrev}
                onNext={handleNext}
            />
            <div className="min-h-[300px] mb-6">
                {renderContent()}
            </div>

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

export default ModalRefundReceipt;
