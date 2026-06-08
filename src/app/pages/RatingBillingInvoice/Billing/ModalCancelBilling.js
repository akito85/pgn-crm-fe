import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Table, Select, message } from "antd";
import InputComponent from "../../../../components/InputComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import DateComponent from "../../../../components/DateComponent";
import SelectComponent from "../../../../components/SelectComponent";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../utils/Icon";
import TableRBI from "../../../../components/TableRBI";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../redux/slices/attachmentSlice";
import {
    columnsApproval,
    columnsExpandApproval,
} from "./Detail/Table/TableApproval";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import {
    cancelBilling,
    resetCancelBillingData,
    getAllApprovalList,
    getListApprovalById,
    getAttachmentCategoryBilling,
} from "../../../../redux/slices/rating_billing_invoice/billing";

const ModalCancelBilling = ({
    isOpen,
    handleCancel = () => { },
    handleRefresh = () => { },
    handleOpenModal = () => { },
    selectedBilling = null,
}) => {
    // Selector
    const { loadingCancel, data_approval, data_approval_list, loadingApproval } = useSelector((state) => state.billing);

    // Declaration
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    // State
    const [current, setCurrent] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [reason, setReason] = useState("");
    const [remark, setRemark] = useState("");
    const [cancelDate, setCancelDate] = useState(null);
    const [accountingDate, setAccountingDate] = useState(null);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [approvalHierarchy, setApprovalHierarchy] = useState("");
    const [boolean, setBoolean] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [modalError, setModalError] = useState(false);
    const [bodyError, setBodyError] = useState({});

    const handleSearch = () => { };

    // Step
    const steps = [
        {
            title: "CANCEL BILLING",
            disabled: !cancelDate || !accountingDate || !reason || !remark,
        },
        {
            title: "APPROVAL",
            disabled: !approvalHierarchy,
        },
        {
            title: "ATTACHMENT",
            disabled: false,
        },
    ];

    // Fetch approval hierarchies on modal open
    useEffect(() => {
        if (isOpen) {
            dispatch(getAllApprovalList());
        }
    }, [isOpen, dispatch]);

    // Build approval table data when detail loaded
    useEffect(() => {
        if (boolean === true) {
            if (data_approval_list && data_approval_list.length > 0) {
                const data = data_approval_list?.map((a, index) => ({
                    ...a,
                    key: index + 1,
                    employeeDetail: (a.employeeDetail || []).map((b, i) => ({
                        ...b,
                        key: i + 1,
                    })),
                }));
                setDataTable(data);
            }
        }
    }, [data_approval_list, boolean]);

    const handleSelect = (e) => {
        setApprovalHierarchy(e);
        dispatch(getListApprovalById(e));
        setBoolean(true);
    };

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);

    const scrollLeftHandler = () => {
        if (containerRef.current) containerRef.current.scrollLeft -= 250;
    };

    const scrollRightHandler = () => {
        if (containerRef.current) containerRef.current.scrollLeft += 250;
    };

    const handleScroll = () => {
        if (containerRef.current) setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleButtonNext = () => {
        if (current === 0) {
            // Validate Step 1 from React state (not form internal)
            if (!cancelDate || !accountingDate || !reason || !remark) {
                message.error("Please fill in all required fields!");
                return;
            }
            next();
            scrollRightHandler();
        } else if (current === 1) {
            // Validate Step 2 - Approval Hierarchy must be selected
            if (!approvalHierarchy) {
                message.error("Please select approval hierarchy!");
                return;
            }
            next();
            scrollRightHandler();
        } else {
            next();
            scrollRightHandler();
        }
    };

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    // Handle Cancel Form
    const handleCancelForm = () => {
        handleCancel();
        setCurrent(0);
        setReason("");
        setRemark("");
        setCancelDate(null);
        setAccountingDate(null);
        setApprovalHierarchy("");
        setBoolean(false);
        setDataTable([]);
        setListDataAttachment([]);
        form.resetFields();
    };

    // Handle attachment update from AttachmentComponent
    const handleUpdateAttachment = (updater) => {
        setListDataAttachment((prev) =>
            typeof updater === "function" ? updater(prev) : updater,
        );
    };

    // Upload attachments via /create-attachment
    const uploadAttachments = async (referenceId) => {
        if (!listDataAttachment || listDataAttachment.length === 0) {
            return Promise.resolve();
        }
        try {
            for (let i = 0; i < listDataAttachment.length; i++) {
                const element = listDataAttachment[i];
                if (element.dataType === "exist") continue;
                const body = {
                    files: element.file,
                    category: element.fileCategoryId,
                    referenceId: referenceId,
                };
                await ratingBillingHttpService.uploadAttachment(
                    `/v1/dbs/api/billing/create-attachment`,
                    body,
                );
            }
            return Promise.resolve();
        } catch (error) {
            console.error("Error uploading attachments:", error);
            return Promise.resolve();
        }
    };

    // Handle Save for Modal Confirmation
    const handleSave = async () => {
        const body = {
            billHeaderId: selectedBilling?.billHeaderId,
            cancelDate: cancelDate?.format("YYYY-MM-DD"),
            reasonCode: reason,
            accountingDate: accountingDate?.format("YYYY-MM-DD"),
            remark: remark,
            apphierId: approvalHierarchy,
        };

        try {
            // First, cancel the billing
            const response = await dispatch(cancelBilling({ body })).unwrap();

            // Then, upload attachments if any. Use billCode if available else billHeaderId
            const referenceId =
                response?.billCode ||
                selectedBilling?.billCode ||
                selectedBilling?.billHeaderId;
            if (listDataAttachment.length > 0 && referenceId) {
                await uploadAttachments(referenceId);
            }

            // Clean up and close
            handleRefresh();
            setCurrent(0);
            form.resetFields();
            setReason("");
            setRemark("");
            setCancelDate(null);
            setAccountingDate(null);
            setApprovalHierarchy("");
            setListDataAttachment([]);
            handleCancel();
            dispatch(resetCancelBillingData());
        } catch (error) {
            console.error("Error in handleSave:", error);
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                error?.toString() ||
                "An error occurred while cancelling billing";
            setBodyError({ message: errorMessage });
            setModalError(true);
        }
    };

    const handleCloseModalError = () => {
        setModalError(false);
        handleOpenModal();
        setBodyError({});
    };

    const handleRetry = () => {
        handleSave();
        setModalError(false);
        setBodyError({});
    };

    const reasonOptions = [
        { value: "Billing Error", label: "Billing Error" },
        { value: "Customer Request", label: "Customer Request" },
        { value: "Contract Termination", label: "Contract Termination" },
        { value: "System Error", label: "System Error" },
        { value: "Other", label: "Other" },
    ];

    return (
        <div>
            <ModalCustom
                isOpen={isOpen}
                type={"confirmation"}
                header="Cancel Billing"
                handleCancel={handleCancelForm}
                onFinish={handleSave}
                width={1000}
                footer={
                    <div className="flex w-full justify-between items-center">
                        {/* Kiri: Tombol Cancel */}
                        <div>
                            {current < steps.length - 1 && (
                                <ButtonComponent type={"default"} onClick={handleCancelForm}>
                                    Cancel
                                </ButtonComponent>
                            )}
                        </div>

                        {/* Kanan: Tombol Previous, Next, Submit */}
                        <div className="flex gap-x-3">
                            {current > 0 && (
                                <ButtonComponent
                                    onClick={() => {
                                        prev();
                                        scrollLeftHandler();
                                    }}
                                    type={"default"}
                                >
                                    Previous
                                </ButtonComponent>
                            )}
                            {current < steps.length - 1 && (
                                <ButtonComponent
                                    onClick={handleButtonNext}
                                    type={"submit"}
                                >
                                    Next
                                </ButtonComponent>
                            )}
                            {current === steps.length - 1 && (
                                <ButtonComponent
                                    type={"primary"}
                                    htmlType={"button"}
                                    onClick={handleSave}
                                    loading={loadingCancel}
                                >
                                    Submit
                                </ButtonComponent>
                            )}
                        </div>
                    </div>
                }
            >
                <div className="flex flex-row justify-center">
                    <div
                        onScroll={handleScroll}
                        ref={containerRef}
                        className="overflow-x-scroll scrollStepsCstm"
                    >
                        <Steps current={current} items={items} labelPlacement="vertical" />
                    </div>
                </div>

                {/* STEP 1: CANCEL BILLING */}
                <div
                    className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}
                >
                    <Form
                        layout="vertical"
                        form={form}
                        id={"formCancel"}
                    >
                        <div className="w-full pt-[30px]">
                            <div className="grid grid-cols-3 gap-4">
                                <Form.Item
                                    label={"Cancel Date"}
                                    required
                                >
                                    <DateComponent
                                        value={cancelDate}
                                        onChange={setCancelDate}
                                        placeholder="Select Date"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Accounting Date"}
                                    required
                                >
                                    <DateComponent
                                        value={accountingDate}
                                        onChange={setAccountingDate}
                                        placeholder="Select Date"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"Reason"}
                                    required
                                >
                                    <SelectComponent
                                        options={reasonOptions}
                                        value={reason || undefined}
                                        onChange={setReason}
                                        placeholder="Select"
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label={"Remark"}
                                required
                            >
                                <InputComponent
                                    rows={3}
                                    type="textarea"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    placeholder={"Remark..."}
                                    maxLength={255}
                                />
                            </Form.Item>
                        </div>
                    </Form>
                </div>

                {/* STEP 2: APPROVAL */}
                <div
                    className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
                >
                    <div className="w-full grid grid-cols-1 gap-x-4">
                        <p className="text-primary uppercase font-bold mb-4">
                            Approval Information
                        </p>

                        {/* Dropdown Approval Hierarchy */}
                        <div className="w-1/3 mb-6">
                            <Form layout="vertical" form={form} id={"formApprovalCancel"}>
                                <Form.Item
                                    label="Approval Hierarchy"
                                    name="apphierId"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select Approval Hierarchy!",
                                        },
                                    ]}
                                >
                                    <Select
                                        onChange={(value) => handleSelect(value)}
                                        placeholder="Select approval hierarchy"
                                        loading={loadingApproval}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.children ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    >
                                        {data_approval?.map((data) => (
                                            <Select.Option
                                                value={data.appHierId}
                                                key={data.appHierId}
                                            >
                                                {data.approvalName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>

                        {/* Tabel Approval muncul setelah hierarchy dipilih */}
                        {boolean && dataTable.length > 0 && (
                            <TableRBI
                                dataSource={dataTable}
                                columns={columnsApproval(
                                    1,
                                    dataTable.length,
                                    searchInput,
                                    searchedColumn,
                                    searchText,
                                    handleSearch,
                                )}
                                expandable={{
                                    expandedRowRender: (record) => (
                                        <div>
                                            <p className="text-primary text-xs font-bold uppercase pt-4">
                                                EMPLOYEE INFORMATION
                                            </p>
                                            <TableRBI
                                                dataSource={record?.employeeDetail || []}
                                                columns={columnsExpandApproval(
                                                    1,
                                                    record?.employeeDetail?.length || 0,
                                                    searchInput,
                                                    searchedColumn,
                                                    searchText,
                                                    handleSearch,
                                                )}
                                                className={"mb-4"}
                                                useSelect={false}
                                                usePagination={false}
                                            />
                                        </div>
                                    ),
                                }}
                                useSelect={false}
                                usePagination={false}
                                loading={loadingApproval}
                            />
                        )}
                    </div>
                </div>

                {/* STEP 3: ATTACHMENT */}
                <div
                    className={`steps-content my-[30px] ${current !== 2 ? "hidden" : ""}`}
                >
                    <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
                        <p className="text-primary uppercase font-bold mb-4">
                            Attachment Information
                        </p>
                        <AttachmentComponent
                            type={"create"}
                            data={listDataAttachment}
                            updateData={handleUpdateAttachment}
                            dispatch={dispatch}
                            getAPICategory={getAttachmentCategoryBilling}
                            typeSelector="billing"
                            service={ratingBillingHttpService}
                            configApplication={configApp.RATING_BILLING_SERVICE}
                            getAPIGuard={getConfigFileRBIData}
                            typeRBI={"data"}
                            mandatory={false}
                        />
                    </div>
                </div>
            </ModalCustom>

            {/** Modal Error */}
            <ModalError
                isOpen={modalError}
                handleOk={() => handleRetry()}
                handleCancel={() => handleCloseModalError()}
                customText={"Try Again"}
            >
                <div className="px-5 pt-5 pb-[10px] justify-center">
                    <div className="w-full flex gap-[20px]">
                        {bodyError.type === "inactivate"
                            ? IconModal["icon_error_inactivate"]
                            : IconModal["icon_error_default"]}
                        <p className="text-[18px] font-bold">{"Failed"}</p>
                    </div>
                    <p className="pl-[70px]">
                        Your billing was not cancelled. {bodyError.message}.
                    </p>
                    <p className="pl-[70px]">Please try again.</p>
                </div>
            </ModalError>
        </div>
    );
};

export default ModalCancelBilling;
