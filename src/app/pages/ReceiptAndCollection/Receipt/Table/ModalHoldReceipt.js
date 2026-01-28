import React, { useState, useEffect } from "react";
import { Modal, Steps, Input, Form, Alert, Spin, InputNumber } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import { LeftOutlined } from "@ant-design/icons";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { useDispatch } from "react-redux";
import RadioTabs from "../../../../../components/RadioTabs";
import { columnsReceipt } from "../ColumnReceiptView";
import BaseContainer from "../../../../../components/BaseContainer";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import { useSelector } from "react-redux";
import {
    getListCategoryReceipt,
    getAllApprovalListReceipt,
    getListApprovalByIdReceipt
} from "../../../../../redux/slices/receipt_collection/receipt";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

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

    // Approval State
    const { loading: loadingReceipt, dataListAppHierId, dataListAppHierDetail } = useSelector((state) => state.receipt);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [selectedAppHierId, setSelectedAppHierId] = useState(null);

    // Local Selection State
    const [localSelectedData, setLocalSelectedData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetched Receipt Data (all eligible receipts)
    const [allReceiptsData, setAllReceiptsData] = useState([]);

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
            setSelectedAppHierId(null);
            setAppHierDataDetail([]);

            dispatch(getAllApprovalListReceipt());

            // Fetch all eligible receipts directly via API (not Redux to avoid state conflict)
            const fetchAllReceipts = async () => {
                try {
                    const url = `/v1/dbs/api/receipt/get-list?searchs=&page=0&size=9999&sort=createdDate~desc`;
                    const response = await receiptCollectionHttpService.getAll(url);

                    // Try different possible structures
                    let content = null;
                    if (response?.data?.result) {
                        content = response.data.result;
                    } else if (response?.data?.data?.content) {
                        content = response.data.data.content;
                    } else if (response?.data?.content) {
                        content = response.data.content;
                    } else if (response?.content) {
                        content = response.content;
                    } else if (Array.isArray(response?.data?.data)) {
                        content = response.data.data;
                    } else if (Array.isArray(response?.data)) {
                        content = response.data;
                    }

                    if (content && Array.isArray(content)) {
                        // Filter only Unapplied & Approved
                        const eligible = content.filter(item =>
                            item.statusApproval === "Approved" &&
                            item.status?.toUpperCase() === "UNAPPLIED"
                        );

                        setAllReceiptsData(eligible);
                    } else {
                        setAllReceiptsData([]);
                    }
                } catch (error) {
                    setAllReceiptsData([]);
                }
            };

            fetchAllReceipts();

            if (selectedData && selectedData.length > 0) {
                const validSelection = selectedData.filter(item =>
                    item.statusApproval === "Approved" &&
                    item.status?.toUpperCase() === "UNAPPLIED"
                );
                setLocalSelectedData(validSelection);
                setSelectedRowKeys(validSelection.map(item => item.key || item.id));
            } else {
                setLocalSelectedData([]);
                setSelectedRowKeys([]);
            }
        }
    }, [isOpen, selectedData, dispatch]);

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
        if (selectedAppHierId) {
            dispatch(getListApprovalByIdReceipt({ id: selectedAppHierId }));
        }
    }, [selectedAppHierId, dispatch]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            const data = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail?.map((b, idx) => ({
                    ...b,
                    key: idx + 1,
                })) || [],
            }));
            setAppHierDataDetail(data);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setLocalSelectedData(newSelectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        fixed: "left",
        columnWidth: 50,
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
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0"
        },
        {
            title: "Balance",
            dataIndex: "balance",
            key: "balance",
            render: (value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0"
        },
    ];

    const handleHoldAmountChange = (value, key) => {
        const newData = localSelectedData.map(item => {
            if ((item.key || item.id) === key) {
                // Validate: Hold Amount cannot exceed Balance
                const balance = item.balance || 0;
                const validatedValue = value > balance ? balance : (value < 0 ? 0 : value);
                return { ...item, holdAmount: validatedValue };
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
                    max={record.balance || 0}
                    min={0}
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
        { label: "Approval Information" },
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
                {currentStep < 4 ? (
                    <ButtonComponent
                        type="submit"
                        onClick={handleNext}
                        disabled={
                            (currentStep === 0 && localSelectedData.length === 0) ||
                            (currentStep === 1 && !holdReason) ||
                            (currentStep === 2 && !selectedAppHierId)
                        }
                    >
                        Next
                    </ButtonComponent>
                ) : (
                    <ButtonComponent type="submit" onClick={() => onSubmit({
                        receipts: localSelectedData,
                        reason: holdReason,
                        appHierId: selectedAppHierId,
                        attachments: listDataAttachment
                    })}>
                        Confirm
                    </ButtonComponent>
                )}
            </div>
        );
    };

    // Use fetched data instead of passed dataSource
    // Add unique key to prevent selection issues
    const filteredDataSource = allReceiptsData?.map(item => ({
        ...item,
        key: item.id // Use id as unique key
    })) || [];

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

            <Spin spinning={loadingReceipt}>
                <div className="mt-4">
                    {/* Step 1: Receipt Information */}
                    {currentStep === 0 && (
                        <BaseContainer header={"RECEIPT INFORMATION"}>
                            <TableRBI
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
                                <TableRBI
                                    dataSource={localSelectedData}
                                    columns={columnsStep2}
                                    pagination={false}
                                    usePagination={false}
                                    tableScrolled={{ x: 2000 }}
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

                    {/* Step 3: Approval Information */}
                    {currentStep === 2 && (
                        <div className="w-full">
                            <p className="text-primary text-xl font-bold uppercase py-4">APPROVAL INFORMATION</p>
                            <ApprovalSectionForm
                                dataTable={appHierDataDetail}
                                dataOption={appHierOptions}
                                selectedHierarchy={selectedAppHierId}
                                updateSelectedHierarchy={setSelectedAppHierId}
                            />
                        </div>
                    )}

                    {/* Step 4: Attachment Information */}
                    {currentStep === 3 && (
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

                    {/* Step 5: Confirmation */}
                    {currentStep === 4 && (
                        <div className="w-full">
                            <Alert
                                message="Please review your hold details before confirming."
                                type="info"
                                showIcon
                                className="mb-4"
                            />

                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                                    <div className="text-sm text-gray-600">Total Receipts</div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {localSelectedData.length}
                                    </div>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded">
                                    <div className="text-sm text-gray-600">Total Hold Amount</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {localSelectedData.reduce((sum, item) => sum + (item.holdAmount || 0), 0)
                                            .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                    </div>
                                </div>
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                                    <div className="text-sm text-gray-600">Approval</div>
                                    <div className="text-lg font-bold text-orange-600">
                                        {appHierOptions.find((opt) => opt.value === selectedAppHierId)?.name || "-"}
                                    </div>
                                </div>
                            </div>
                            <RadioTabs
                                data={[
                                    { value: "Receipt", label: "Receipt" },
                                    { value: "Hold", label: "Hold Info" },
                                    { value: "Approval", label: "Approval" },
                                    { value: "Attachment", label: "Attachment" },
                                ]}
                                currentPosition={confirmationTab}
                                onChange={handleTabChange}
                            />

                            <div className="mt-4">
                                {confirmationTab === "Receipt" && (
                                    <TableRBI
                                        dataSource={localSelectedData}
                                        columns={columnsStep4}
                                        pagination={false}
                                        usePagination={false}
                                        tableScrolled={{ x: 2000 }}
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
                                {confirmationTab === "Approval" && (
                                    <ApprovalSectionForm
                                        showSelect={false}
                                        disableSelect={true}
                                        approvalName={
                                            appHierOptions.find((opt) => opt.value === selectedAppHierId)?.name
                                        }
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
                    )}
                </div>
            </Spin>
        </ModalCustom>
    );
};

export default ModalHoldReceipt;
