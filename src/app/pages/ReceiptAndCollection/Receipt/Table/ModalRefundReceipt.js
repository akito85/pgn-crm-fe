
import React, { useEffect, useState } from "react";
import { Modal, Steps, Button, message, Input, InputNumber, Segmented } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "../../../../../components/TablePagination";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { columnsReceipt } from "../ColumnReceiptView"; // Might use parts of this or define custom
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
// import { getListCategoryReceipt } from "../../../../../redux/slices/receipt_collection/receipt"; // If needed
import { getReceiptCustomerList, getListCategoryReceipt, getPaginateReceipt } from "../../../../../redux/slices/receipt_collection/receipt";
import RadioTabs from "../../../../../components/RadioTabs";

import ModalCustom from "../../../../../components/Modal/ModalCustom";

const { Step } = Steps;

const ModalRefundReceipt = ({
    isOpen,
    handleCancel,
    dataSource,
    onSubmit,
}) => {
    const dispatch = useDispatch();
    const { data_customer_list, data, loading } = useSelector((state) => state.receipt);

    const [currentStep, setCurrentStep] = useState(0);

    // Step 1 Selection State
    const [localSelectedData, setLocalSelectedData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filter/Search State (Placeholder for now)
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    // Step 2 Selection State (Receipts)
    const [selectedReceipts, setSelectedReceipts] = useState([]);
    const [selectedReceiptRowKeys, setSelectedReceiptRowKeys] = useState([]);
    const [pageReceipt, setPageReceipt] = useState(1);
    const [pageSizeReceipt, setPageSizeReceipt] = useState(10);

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
            dispatch(getReceiptCustomerList({ page: 1, pageSize: 10, sort: "createdDate~desc" }));
        }
    }, [isOpen, dispatch]);

    // Fetch receipt list when entering Step 2
    useEffect(() => {
        if (currentStep === 1) {
            dispatch(getPaginateReceipt({ page: pageReceipt, pageSize: pageSizeReceipt, sort: "createdDate~desc" }));
        }
    }, [currentStep, pageReceipt, pageSizeReceipt, dispatch]);

    const steps = [
        {
            title: "Customer Information",
            key: "customerInfo",
        },
        {
            title: "Receipt Information",
            key: "receiptInfo",
        },
        {
            title: "Refund Customer Information",
            key: "refundCustomerInfo",
        },
        {
            title: "Refund Receipt Information",
            key: "refundReceiptInfo",
        },
        {
            title: "Attachment Information",
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
        setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
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
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
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
            render: (val) => val || "-"
        },
        {
            title: "TOTAL UNAPPLY AMOUNT",
            dataIndex: "unAppliedAmount",
            key: "unAppliedAmount",
            align: "right",
            sorter: true,
            width: 200,
            render: (value) => value ? value.toLocaleString('id-ID') : '-'
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
            render: (text, object, index) => index + 1,
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
            render: (val) => val || "-"
        },
        {
            title: "TOTAL UNAPPLY AMOUNT",
            dataIndex: "unAppliedAmount",
            key: "unAppliedAmount",
            align: "right",
            width: 200,
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
            render: (text, object, index) => index + 1,
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
                        <TablePagination
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
                const receiptDataSource = data?.result?.map(item => ({
                    ...item,
                    key: item.id
                })) || [];

                return (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-blue-500 font-bold uppercase">Receipt Information</h3>
                        </div>
                        <TablePagination
                            dataSource={receiptDataSource}
                            columns={columnsStep2}
                            rowSelection={receiptRowSelection}
                            current={pageReceipt}
                            pageSize={pageSizeReceipt}
                            onChange={handleReceiptChangePage}
                            onShowSizeChange={handleReceiptChangePage}
                            totalData={data?.page?.totalElements || 0}
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
                        <TablePagination
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
                        <TablePagination
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
            case 4: // Attachment Information
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
            case 5: // Confirmation
                return (
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <RadioTabs
                                data={[
                                    { value: "Customer", label: "Customer" },
                                    { value: "Refund", label: "Refund" },
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
                                        <TablePagination
                                            dataSource={localSelectedData}
                                            columns={columnsStep3Confirmation}
                                            pagination={false}
                                            usePagination={false}
                                            tableScrolled={{ x: "max-content", y: 400 }}
                                        />
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
                                        <TablePagination
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

    const renderFooter = () => {
        return (
            <div className="flex justify-end gap-5">
                <ButtonComponent type="default" onClick={handleCancel} className="w-[120px]">
                    Cancel
                </ButtonComponent>
                {currentStep > 0 && (
                    <ButtonComponent
                        type="submit"
                        onClick={handlePrev}
                        className="w-[120px]"
                        icon={
                            <LeftOutlined
                                style={{ color: "#fff", fontSize: 15, marginRight: 10 }}
                            />
                        }
                    >
                        Previous
                    </ButtonComponent>
                )}
                {currentStep < steps.length - 1 ? (
                    <ButtonComponent type="submit" onClick={handleNext} className="w-[120px]">
                        Next
                    </ButtonComponent>
                ) : (
                    <ButtonComponent type="submit" onClick={() => onSubmit(localSelectedData)} className="w-[120px]">
                        Confirm
                    </ButtonComponent>
                )}
            </div>
        );
    };

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="RECEIPT REFUND"
            type={"confirmation"}
            width={1200}
            footer={renderFooter()}
        >
            <div className="w-full gap-5">
                <div className="overflow-x-scroll scrollStepsCstm gap-5">
                    <Steps current={currentStep} labelPlacement="vertical">
                        {steps.map((item) => (
                            <Step key={item.key} title={item.title} />
                        ))}
                    </Steps>
                </div>
                <div className="min-h-[300px] mb-6">
                    {renderContent()}
                </div>
            </div>
        </ModalCustom>
    );
};

export default ModalRefundReceipt;
