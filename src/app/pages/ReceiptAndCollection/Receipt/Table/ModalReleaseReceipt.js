import { useState, useEffect } from "react";
import { Input, Form, Spin, InputNumber, Button } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { useDispatch, useSelector } from "react-redux";
import RadioTabs from "../../../../../components/RadioTabs";
import { columnsReceipt } from "../ColumnReceiptView";
import BaseContainer from "../../../../../components/BaseContainer";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import {
    getListCategoryReceipt,
    getAllApprovalListReceipt,
    getListApprovalByIdReceipt
} from "../../../../../redux/slices/receipt_collection/receipt";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const { TextArea } = Input;

const ModalReleaseReceipt = ({
    isOpen,
    handleCancel,
    selectedData,
    dataSource,
    onSubmit
}) => {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [localSelectedData, setLocalSelectedData] = useState([]);
    const [releaseReason, setReleaseReason] = useState("");
    const [releaseAmountData, setReleaseAmountData] = useState({});
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [confirmationTab, setConfirmationTab] = useState("Release");

    // Approval State
    const { loading: loadingReceipt, dataListAppHierId, dataListAppHierDetail } = useSelector((state) => state.receipt);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [selectedAppHierId, setSelectedAppHierId] = useState(null);

    const steps = [
        { title: "Receipt Information" },
        { title: "Release Information" },
        { title: "Approval Information" },
        { title: "Attachment Information" },
        { title: "Confirmation" }
    ];

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setCurrentStep(0);
            setReleaseReason("");
            setListDataAttachment([]);
            setConfirmationTab("Receipt");
            setReleaseAmountData({});
            setPage(1);
            setPageSize(10);
            setSelectedAppHierId(null);
            setAppHierDataDetail([]);

            dispatch(getAllApprovalListReceipt());

            // Fetch receipt list (filtered/unfiltered?)
            // Usage seems to imply selecting FROM list.
            // If selectedData is passed (from single row action), pre-select it?
            if (selectedData && selectedData.length > 0) {
                const keys = selectedData.map(item => item.key || item.id);
                setSelectedRowKeys(keys);
                setLocalSelectedData(selectedData);
            } else {
                setSelectedRowKeys([]);
                setLocalSelectedData([]);
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
        // Dispatch fetch logic if needed, or rely on parent?
        // ViewReceipt passes handleFetch? No, ViewReceipt manages main list.
        // Modal might need its own fetch if it shows ALL receipts.
        // Assuming it uses the main state 'receipt' data for now.
    };

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
            render: (_, _record, index) => (page - 1) * pageSize + index + 1,
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

    const handleReleaseAmountChange = (value, key) => {
        setReleaseAmountData(prev => ({ ...prev, [key]: value }));
    };

    const columnsStep2 = [
        ...columnsSimplified,
        {
            title: "Release Amount",
            dataIndex: "releaseAmount",
            key: "releaseAmount",
            render: (_, record) => {
                const maxReleaseAmount = parseFloat(record.holdAmount) || parseFloat(record.holdAmountReal) || 0;
                return (
                    <InputNumber
                        style={{ width: "100%" }}
                        value={releaseAmountData[record.key || record.id]}
                        max={maxReleaseAmount}
                        formatter={(value) =>
                            value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
                        }
                        parser={(value) => value?.replace(/\./g, "")}
                        onChange={(value) => handleReleaseAmountChange(value, record.key || record.id)}
                        onKeyDown={(e) => {
                            // Allow: backspace, delete, tab, escape, enter
                            if (['Delete', 'Backspace', 'Tab', 'Escape', 'Enter'].includes(e.key) ||
                                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Command+A, etc.
                                (e.ctrlKey === true || e.metaKey === true) ||
                                // Allow: home, end, left, right, arrow keys
                                ['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                                return;
                            }
                            // Ensure that it is a number and stop the keypress
                            if (e.shiftKey || !/^[0-9]$/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        placeholder="Input Amount"
                        controls={false}
                    />
                );
            }
        }
    ];

    const columnsStep4 = [
        ...columnsSimplified,
        {
            title: "Release Amount",
            dataIndex: "releaseAmount",
            key: "releaseAmount",
            render: (_, record) => {
                const amount = releaseAmountData[record.key || record.id];
                return amount ? `${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
            }
        }
    ];

    // Validation for Step 2
    const isStep2Valid = () => {
        if (currentStep !== 1) return true;
        // Check if all selected receipts have release amount
        const allAmountsFilled = localSelectedData.every(item => {
            const amount = releaseAmountData[item.key || item.id];
            return amount !== undefined && amount !== null && amount !== '';
        });
        // Check if remark is filled
        const remarkFilled = releaseReason && releaseReason.trim().length > 0;
        return allAmountsFilled && remarkFilled;
    };

    // Get disabled state for Next button
    const isNextDisabled = () => {
        if (currentStep === 0) return localSelectedData.length === 0;
        if (currentStep === 1) return !isStep2Valid();
        if (currentStep === 2) return !selectedAppHierId;
        return false;
    };

    const handleNext = () => {
        // Validasi sebelum next
        if (isNextDisabled()) return;
        setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleTabChange = (e) => {
        setConfirmationTab(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit({
            receipts: localSelectedData.map(item => ({
                ...item,
                releaseAmount: releaseAmountData[item.key || item.id]
            })),
            reason: releaseReason,
            appHierId: selectedAppHierId,
            attachments: listDataAttachment
        });
    };

    // Add unique key to prevent selection issues
    const filteredDataSource = dataSource?.filter(item =>
        item.status?.toUpperCase() === "HOLD" &&
        item.statusApproval === "Approved"
    ).map(item => ({
        ...item,
        key: item.id
    })) || [];

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="RECEIPT RELEASE"
            width={1200}
            footer={null}
        >
            <FormStepper
                steps={steps}
                current={currentStep}
                onPrev={handlePrev}
                onNext={handleNext}
            />

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

                    {/* Step 2: Release Information */}
                    {currentStep === 1 && (
                        <div className="w-full">
                            <p className="text-primary text-xl font-bold uppercase py-4">RELEASE INFORMATION</p>

                            <div className="mb-4">
                                <TableRBI
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
                                        value={releaseReason}
                                        onChange={(e) => setReleaseReason(e.target.value)}
                                        placeholder="Input release remark..."
                                    />
                                </Form.Item>
                            </Form>
                            <div className="text-gray-400 text-xs mt-1">
                                You have {255 - (releaseReason?.length || 0)} characters remaining
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
                            <RadioTabs
                                data={[
                                    { value: "Release", label: "Release" },
                                    { value: "Approval", label: "Approval" },
                                    { value: "Attachment", label: "Attachment" },
                                ]}
                                currentPosition={confirmationTab}
                                onChange={handleTabChange}
                            />

                            <div className="mt-4">
                                {confirmationTab === "Release" && (
                                    <>
                                        <p className="text-primary text-xl font-bold uppercase py-4">RELEASE INFORMATION</p>
                                        <TableRBI
                                            dataSource={localSelectedData}
                                            columns={columnsStep4}
                                            pagination={false}
                                            usePagination={false}
                                        />
                                        <div className="mt-4">
                                            <p className="font-bold">Remark</p>
                                            <div className="text-gray-700">{releaseReason || "-"}</div>
                                        </div>
                                    </>
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
                                onClick={handleNext}
                                type="primary"
                                disabled={isNextDisabled()}
                                style={{
                                    backgroundColor: isNextDisabled() ? "#E0E3E9" : "#0075BF",
                                    borderColor: isNextDisabled() ? "#E0E3E9" : "#0075BF",
                                    color: isNextDisabled() ? "#BFC4D0" : "#fff",
                                    borderRadius: "6px",
                                    height: "32px",
                                    fontSize: "12px",
                                }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
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

export default ModalReleaseReceipt;

