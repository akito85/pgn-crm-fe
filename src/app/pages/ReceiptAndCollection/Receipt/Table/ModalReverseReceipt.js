import { useState, useEffect } from "react";
import { Input, Form, Alert, Spin, Button } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { FormStepper } from "../../../../../components/FormStepNavigation";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
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

const ModalReverseReceipt = ({
    isOpen,
    handleCancel,
    selectedData,
    dataSource,
    onSubmit,
}) => {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(0);
    const [reverseReason, setReverseReason] = useState("");
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

    // Initialize selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setReverseReason("");
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

            dispatch(getAllApprovalListReceipt());
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
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (value) => value ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'
        }
    ];

    const steps = [
        { title: "Receipt Information" },
        { title: "Reverse Information" },
        { title: "Approval Information" },
        { title: "Attachment Information" },
        { title: "Confirmation" },
    ];

    const handleNext = () => {
        // Validasi sebelum next
        if (currentStep === 0 && localSelectedData.length === 0) return;
        if (currentStep === 1 && !reverseReason) return;
        if (currentStep === 2 && !selectedAppHierId) return;
        
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
            receipts: localSelectedData,
            reason: reverseReason,
            appHierId: selectedAppHierId,
            attachments: listDataAttachment
        });
    };

    // Add unique key to prevent selection issues
    const filteredDataSource = dataSource?.filter(item =>
        item.statusApproval !== "Waiting Approval" &&
        item.status?.toUpperCase() !== "REVERSE"
    ).map(item => ({
        ...item,
        key: item.id
    })) || [];

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="RECEIPT REVERSE"
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

                    {currentStep === 1 && (
                        <div className="w-full">
                            <p className="text-primary text-xl font-bold uppercase py-4">REVERSE INFORMATION</p>

                            <div className="mb-4">
                                <TableRBI
                                    dataSource={localSelectedData}
                                    columns={columnsSimplified}
                                    pagination={false}
                                    usePagination={false}
                                />
                            </div>

                            <Form layout="vertical">
                                <Form.Item label="Remark / Reason for Reverse" required>
                                    <TextArea
                                        rows={4}
                                        value={reverseReason}
                                        onChange={(e) => setReverseReason(e.target.value)}
                                        placeholder="Input reverse remark..."
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                    )}

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

                    {currentStep === 4 && (
                        <div className="w-full">
                            <Alert
                                message="Please review your reverse details before confirming. This action cannot be undone once approved."
                                type="warning"
                                showIcon
                                className="mb-4"
                            />
                            <RadioTabs
                                data={[
                                    { value: "Receipt", label: "Receipt" },
                                    { value: "Reverse", label: "Reverse Info" },
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
                                        columns={columnsSimplified}
                                        pagination={false}
                                        usePagination={false}
                                    />
                                )}
                                {confirmationTab === "Reverse" && (
                                    <div>
                                        <strong>Reverse Reason:</strong>
                                        <div className="p-2 bg-gray-50 border rounded mt-1">
                                            {reverseReason || "-"}
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
                                disabled={
                                    (currentStep === 0 && localSelectedData.length === 0) ||
                                    (currentStep === 1 && !reverseReason) ||
                                    (currentStep === 2 && !selectedAppHierId)
                                }
                                style={{
                                    backgroundColor: 
                                        (currentStep === 0 && localSelectedData.length === 0) ||
                                        (currentStep === 1 && !reverseReason) ||
                                        (currentStep === 2 && !selectedAppHierId)
                                            ? "#E0E3E9" : "#0075BF",
                                    borderColor: 
                                        (currentStep === 0 && localSelectedData.length === 0) ||
                                        (currentStep === 1 && !reverseReason) ||
                                        (currentStep === 2 && !selectedAppHierId)
                                            ? "#E0E3E9" : "#0075BF",
                                    color: 
                                        (currentStep === 0 && localSelectedData.length === 0) ||
                                        (currentStep === 1 && !reverseReason) ||
                                        (currentStep === 2 && !selectedAppHierId)
                                            ? "#BFC4D0" : "#fff",
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

export default ModalReverseReceipt;
