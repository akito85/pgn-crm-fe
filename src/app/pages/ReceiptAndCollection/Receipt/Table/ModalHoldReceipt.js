import React, { useState, useEffect } from "react";
import { Modal, Steps, Input, Form, Alert, Spin, InputNumber } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
import { LeftOutlined } from "@ant-design/icons";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { useDispatch } from "react-redux";
import RadioTabs from "../../../../../components/RadioTabs";
import { columnsReceipt } from "../ColumnReceiptView";
import { getListCategoryReceipt } from "../../../../../redux/slices/receipt_collection/receipt";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import BaseContainer from "../../../../../components/BaseContainer";

const { TextArea } = Input;

const ModalHoldReceipt = ({
    isOpen,
    handleCancel,
    selectedData, // Initial selected item (single)
    dataSource,   // Full list
    onSubmit,
}) => {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(0);
    const [holdReason, setHoldReason] = useState("");
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [confirmationTab, setConfirmationTab] = useState("Receipt");

    // Local Selection State
    const [localSelectedData, setLocalSelectedData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Initialize selection when modal opens
    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setCurrentStep(0);
            setHoldReason("");
            setListDataAttachment([]);
            setConfirmationTab("Receipt");
            setPage(1);
            setPageSize(10);

            if (selectedData && selectedData.length > 0) {
                setLocalSelectedData(selectedData);
                setSelectedRowKeys(selectedData.map(item => item.key || item.id));
            } else {
                setLocalSelectedData([]);
                setSelectedRowKeys([]);
            }
        }
    }, [isOpen, selectedData]);

    const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setLocalSelectedData(newSelectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleChangePage = (p, ps) => {
        setPage(p);
        setPageSize(ps);
    }

    // Use columnsReceipt to match the main list view
    const columns = columnsReceipt(
        {}, // search
        page,
        pageSize,
        null, // searchInput
        null, // searchedColumn
        null, // searchText
        () => { }, // handleSearch
        () => { }, // handleModalApprovalHistory
        () => { }  // handleDeleteReceipt
    );

    const columnsSimplified = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "Receipt Code",
            dataIndex: "receiptCode",
            key: "receiptCode",
        },
        {
            title: "Customer Number",
            dataIndex: "customerNumber",
            key: "customerNumber",
            render: (_, record) => record.customerNumber || record.customerId
        },
        {
            title: "Customer Name",
            dataIndex: "customerName",
            key: "customerName",
        },
        {
            title: "Account Number",
            dataIndex: "accountNumber",
            key: "accountNumber",
            render: (_, record) => record.accountNumber || record.accountId
        },
        {
            title: "Receipt Date",
            dataIndex: "receiptDate",
            key: "receiptDate",
        },
    ];

    const handleHoldAmountChange = (value, key) => {
        const newData = localSelectedData.map(item => {
            if ((item.key || item.id) === key) {
                return { ...item, holdAmount: value };
            }
            return item;
        });
        setLocalSelectedData(newData);
    };

    const columnsStep2 = [
        ...columnsSimplified,
        {
            title: "Hold Amount",
            dataIndex: "holdAmount",
            key: "holdAmount",
            render: (text, record) => (
                <InputNumber
                    style={{ width: "100%" }}
                    value={record.holdAmount}
                    formatter={(value) =>
                        value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
                    }
                    parser={(value) => value?.replace(/\./g, "")}
                    onChange={(value) => handleHoldAmountChange(value, record.key || record.id)}
                    onKeyDown={(e) => {
                        // Allow: backspace, delete, tab, escape, enter
                        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Command+A, etc.
                            (e.ctrlKey === true || e.metaKey === true) ||
                            // Allow: home, end, left, right
                            (e.keyCode >= 35 && e.keyCode <= 39)) {
                            return;
                        }
                        // Ensure that it is a number and stop the keypress
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                        }
                    }}
                    placeholder="Input Amount"
                    controls={false}
                />
            )
        }
    ];
    const columnsStep4 = [
        ...columnsSimplified,
        {
            title: "Hold Amount",
            dataIndex: "holdAmount",
            key: "holdAmount",
            render: (text, record) => {
                const amount = record.holdAmount;
                return amount ? `${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
            }
        }
    ];

    const nextParams = [
        { label: "Receipt Information" },
        { label: "Hold Information" },
        { label: "Attachment Information" },
        { label: "Confirmation" },
    ];

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleTabChange = (e) => {
        setConfirmationTab(e.target.value);
    };


    const renderFooter = () => {
        return (
            <div className="flex justify-end gap-5">
                <ButtonComponent type="default" onClick={handleCancel}>
                    Cancel
                </ButtonComponent>
                {currentStep > 0 && (
                    <ButtonComponent
                        type="submit"
                        onClick={handlePrev}
                        icon={
                            <LeftOutlined
                                style={{ color: "#fff", fontSize: 15, marginRight: 10 }}
                            />
                        }
                    >
                        Previous
                    </ButtonComponent>
                )}
                {currentStep < 3 ? (
                    <ButtonComponent
                        type="submit"
                        onClick={handleNext}
                        disabled={localSelectedData.length === 0} // Disable if no selection
                    >
                        Next
                    </ButtonComponent>
                ) : (
                    <ButtonComponent type="submit" onClick={() => onSubmit({
                        receipts: localSelectedData,
                        reason: holdReason,
                        attachments: listDataAttachment
                    })}>
                        Confirm
                    </ButtonComponent>
                )}
            </div>
        );
    };

    const filteredDataSource = dataSource?.filter(item =>
        item.statusApproval !== "Waiting Approval" &&
        item.status?.toUpperCase() !== "HOLD"
    );

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="RECEIPT HOLD"
            width={1200}
            footer={renderFooter()}
        >
            <div className="overflow-x-scroll scrollStepsCstm gap-5 mb-5 p-2">
                <Steps
                    current={currentStep}
                    items={nextParams.map(item => ({ title: item.label }))}
                    labelPlacement="vertical"
                />
            </div>

            <div className="mt-4">
                {/* Step 1: Receipt Information */}
                {currentStep === 0 && (
                    <BaseContainer header={"RECEIPT INFORMATION"}>
                        <TablePagination
                            dataSource={filteredDataSource}
                            columns={columns}
                            rowSelection={rowSelection}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChangePage}
                            onSizeChanger={handleChangePage}
                            totalData={filteredDataSource?.length}
                            tableScrolled={{ x: 10000, y: 400 }}
                        />
                    </BaseContainer>
                )}

                {/* Step 2: Hold Information */}
                {currentStep === 1 && (
                    <div className="w-full">
                        <p className="text-primary text-xl font-bold uppercase py-4">HOLD INFORMATION</p>

                        <div className="mb-4">
                            <TablePagination
                                dataSource={localSelectedData}
                                columns={columnsStep2}
                                pagination={false}
                                usePagination={false}
                            />
                        </div>

                        <Form layout="vertical">
                            <Form.Item label="Remark" required>
                                <TextArea
                                    rows={4}
                                    value={holdReason}
                                    onChange={(e) => setHoldReason(e.target.value)}
                                    placeholder="Input hold remark..."
                                />
                            </Form.Item>
                        </Form>
                        <div className="text-gray-400 text-xs mt-1">
                            You have {255 - (holdReason?.length || 0)} characters remaining
                        </div>
                    </div>
                )}

                {/* Step 3: Attachment Information */}
                {currentStep === 2 && (
                    <div className="w-full">
                        <p className="text-primary text-xl font-bold uppercase py-4">ATTACHMENT INFORMATION</p>
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
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 3 && (
                    <div className="w-full">
                        <Alert
                            message="Please review your hold details before confirming."
                            type="info"
                            showIcon
                            className="mb-4"
                        />
                        <RadioTabs
                            data={[
                                { value: "Receipt", label: "Receipt" },
                                { value: "Hold", label: "Hold Info" },
                                { value: "Attachment", label: "Attachment" },
                            ]}
                            currentPosition={confirmationTab}
                            onChange={handleTabChange}
                        />

                        <div className="mt-4">
                            {confirmationTab === "Receipt" && (
                                <TablePagination
                                    dataSource={localSelectedData}
                                    columns={columnsStep4}
                                    pagination={false}
                                    usePagination={false}
                                />
                            )}
                            {confirmationTab === "Hold" && (
                                <div>
                                    <strong>Hold Reason:</strong>
                                    <div className="p-2 bg-gray-50 border rounded mt-1">
                                        {holdReason || "-"}
                                    </div>
                                </div>
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
                )}
            </div>
        </ModalCustom>
    );
};

export default ModalHoldReceipt;
