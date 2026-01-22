import React, { useState, useEffect } from "react";
import { Steps, Input, Form, Alert, Spin, InputNumber } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
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
            dataIndex: "receiptAmount",
            key: "receiptAmount",
        }
    ];

    const nextParams = [
        { label: "Receipt Information" },
        { label: "Reverse Information" },
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
                            (currentStep === 1 && !reverseReason) ||
                            (currentStep === 2 && !selectedAppHierId)
                        }
                    >
                        Next
                    </ButtonComponent>
                ) : (
                    <ButtonComponent type="submit" onClick={() => onSubmit({
                        receipts: localSelectedData,
                        reason: reverseReason,
                        appHierId: selectedAppHierId,
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
        item.status?.toUpperCase() !== "REVERSE"
    );

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="RECEIPT REVERSE"
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

                    {currentStep === 1 && (
                        <div className="w-full">
                            <p className="text-primary text-xl font-bold uppercase py-4">REVERSE INFORMATION</p>

                            <div className="mb-4">
                                <TablePagination
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
                                    <TablePagination
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
        </ModalCustom>
    );
};

export default ModalReverseReceipt;
