import { WarningOutlined } from "@ant-design/icons";
import { Form, Spin, message } from "antd";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import CardContainer from "../../../../../components/CardContainer";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { showModalSuccess } from "../../../../../redux/slices/general_slice";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import {
    submitTransferToCustomer,
    getAllApprovalList,
    getDetailTransferToCustomer,
    getListApprovalById,
    getListCategory,
    getListCustomer,
} from "../../../../../redux/slices/receipt_collection/transferToCustomer";

import TransferToCustomerForm from "./TransferToCustomerForm";
import CustomerInfoSection from "./CustomerInfoSection";
import ContentModalConfirm from "./ContentModalConfirm";
import ModalSearchWarranty from "./ModalSearchWarranty";
import { getCustomerListColumns } from "./CustomerListColumns";
import { debounce } from "lodash";

const ListFormTransferToCustomer = (props) => {
    const { type } = props;
    const {
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail,
        loading,
        listCustomer
    } = useSelector((state) => state.transferToCustomer);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const location = useLocation();
    const { id } = location?.state || {};

    const [current, setCurrent] = useState(0);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState();
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalBack, setModalBack] = useState(false);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showSearchWarrantyModal, setShowSearchWarrantyModal] = useState(false);
    const [editingKey, setEditingKey] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendBody, setSendBody] = useState(null);

    const steps = [
        { title: "CREATE TRANSFER TO CUSTOMER", value: "Partner" },
        { title: "APPROVAL", value: "Approval" },
        { title: "ATTACHMENT", value: "Attachment" },
    ];

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        setEditingKey(record.key);
        // Use setTimeout to ensure the row is in edit mode and Form.Items are mounted
        setTimeout(() => {
            form.setFieldsValue({
                itemCustomer: record.customer || record.customerId || "",
                itemAreaCode: record.areaCode || "",
                itemToCustomerName: record.toCustomerName || "",
                itemCurrency: record.currency || "",
                itemAmount: record.amount || 0,
            });
        }, 0);
    };

    const cancel = () => {
        const row = customerList.find((item) => item.key === editingKey);
        if (row && !row.customer) {
            setCustomerList(customerList.filter((item) => item.key !== editingKey));
        }
        setEditingKey("");
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields([
                "itemCustomer",
                "itemAreaCode",
                "itemToCustomerName",
                "itemCurrency",
                "itemAmount",
            ]);
            
            const mappedRow = {
                customer: row.itemCustomer,
                areaCode: row.itemAreaCode,
                toCustomerName: row.itemToCustomerName,
                currency: row.itemCurrency,
                amount: row.itemAmount,
            };

            const newData = [...customerList];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...mappedRow });
                setCustomerList(newData);
                setEditingKey("");
            } else {
                newData.push(mappedRow);
                setCustomerList(newData);
                setEditingKey("");
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const handleAddCustomer = () => {
        const newData = {
            key: customerList.length + 1,
            no: customerList.length + 1,
            customer: "",
            areaCode: "",
            toCustomerName: "",
            currency: "IDR",
            amount: 0,
        };
        form.setFieldsValue({
            itemCustomer: "",
            itemAreaCode: "",
            itemToCustomerName: "",
            itemCurrency: "IDR",
            itemAmount: 0,
        });
        setCustomerList([...customerList, newData]);
        setEditingKey(newData.key);
    };

    const handleSearchWarranty = () => {
        setShowSearchWarrantyModal(true);
    }

    const handleConfirmWarranty = (record) => {
        form.setFieldsValue({
            paymentWarrantyCode: record.paymentWarrantyCode,
            warrantyAreaCode: record.areaCode,
            accountNumber: record.accountNumber || "-",
            accountName: record.accountName || "-",
            areaName: record.areaName,
            customerId: record.customerId,
            customerName: record.customerName,
            customerSegment: record.customerSegment,
            customerGroup: record.customerGroup,
            type: record.type,
            publisher: record.publisher,
            issuerBranch: record.issuerBranch || "-",
            currency: record.currency,
            balance: record.balance,
            rateType: record.rateType || "-",
            rate: record.rate,
            rateDate: record.rateDate ? moment(record.rateDate) : null,
            equivalent: record.equivalent,
            documentNumber: record.documentNumber,
            mutationDate: record.mutationDate ? moment(record.mutationDate) : null,
            effectiveDate: record.effectiveDate ? moment(record.effectiveDate) : null,
            expiringDate: record.expiringDate ? moment(record.expiringDate) : null,
            endDateClaim: record.endDateClaim ? moment(record.endDateClaim) : null,
            accountType: record.accountType || "-",
            classificationType: record.classificationType || "-",
        });
    }

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleSizeChange = (current, size) => {
        setPage(1);
        setPageSize(size);
    };

    const handleCustomerChange = (customerId) => {
        const selectedCustomer = listCustomer.find(item => item.customerId === customerId);
        if (selectedCustomer) {
            form.setFieldsValue({
                itemAreaCode: selectedCustomer.areaCode,
                itemToCustomerName: selectedCustomer.customerName,
            });
        }
    };

    const handleGlobalSearch = useCallback(
        debounce((value) => {
            // Implement local search for customerList if needed
            console.log("Search table content:", value);
        }, 500),
        []
    );

    useEffect(() => {
        dispatch(getAllApprovalList());
        dispatch(getListCustomer());
        if (id && type === "update") {
            dispatch(getDetailTransferToCustomer(id));
        }
    }, [dispatch, id, type]);

    useEffect(() => {
        if (dataListAppHierId && dataListAppHierId.length > 0) {
            setAppHierOptions(dataListAppHierId.map((appHier) => ({
                name: appHier.approvalName,
                value: appHier.appHierId,
            })));
        }
    }, [dataListAppHierId]);

    useEffect(() => {
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            setAppHierDataDetail(dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail.map((b, i) => ({ ...b, key: i + 1 })),
            })));
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    useEffect(() => {
        if (id && type === "update" && data_detail?.transferToCustomer) {
            const detail = data_detail.transferToCustomer;
            form.setFieldsValue({
                ...detail,
                rateDate: detail.rateDate ? moment(detail.rateDate) : null,
                mutationDate: detail.mutationDate ? moment(detail.mutationDate) : null,
                effectiveDate: detail.effectiveDate ? moment(detail.effectiveDate) : null,
                expiringDate: detail.expiringDate ? moment(detail.expiringDate) : null,
                endDateClaim: detail.endDateClaim ? moment(detail.endDateClaim) : null,
            });
            setSelectedHierarchy(detail.appHierId);
            setCustomerList(detail.customerList || []);
        }
    }, [data_detail, id, type, form]);

    const next = () => {
        if (current === 0) {
            const fieldsToValidate = [
                "fromCustomerId", "fromCustomerName", "areaCode", "category", "description",
                "paymentWarrantyCode", "warrantyAreaCode", "accountNumber", "accountName",
                "customerId", "customerName", "customerSegment", "customerGroup",
                "type", "documentNumber", "mutationDate", "publisher", "issuerBranch",
                "currency", "balance", "rateType", "rateDate", "rate", "equivalent",
                "effectiveDate", "expiringDate", "endDateClaim", "accountType", "classificationType"
            ];

            form.validateFields(fieldsToValidate)
                .then(() => {
                    if (customerList.length === 0) {
                        message.warning("Please add at least one customer to the list");
                        return;
                    }
                    setCurrent(current + 1);
                })
                .catch(() => {
                    message.error("Please fill all required fields in the form and guarantee information");
                });
            return;
        }
        if (current === 1) {
            if (!selectedHierarchy) {
                message.warning("Approval Hierarchy is mandatory");
                return;
            }
            setCurrent(current + 1);
            return;
        }
        setCurrent(current + 1);
    };

    const prev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const onBack = () => {
        if (Object.keys(form.getFieldsValue(true)).length === 0) {
            navigate(-1);
        } else {
            setModalBack(true);
        }
    };

    const processSubmit = async (isDraft = false) => {
        if (isSubmitting) return;

        try {
            if (!isDraft && listDataAttachment.length === 0) {
                message.warning("Attachment is mandatory. Please upload at least one file.");
                return;
            }

            const values = isDraft ? form.getFieldsValue(true) : await form.validateFields();
            
            const payload = {
                ...values,
                isDraft,
                appHierId: selectedHierarchy,
                customerList: customerList,
                id: id,
                rateDate: values.rateDate?.format("YYYY-MM-DD"),
                mutationDate: values.mutationDate?.format("YYYY-MM-DD"),
                effectiveDate: values.effectiveDate?.format("YYYY-MM-DD"),
                expiringDate: values.expiringDate?.format("YYYY-MM-DD"),
                endDateClaim: values.endDateClaim?.format("YYYY-MM-DD"),
            };

            setSendBody(payload);
            
            if (isDraft) {
                handleSave(payload);
            } else {
                setModalConfirm(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = (payloadToSave) => {
        setIsSubmitting(true);
        dispatch(submitTransferToCustomer(payloadToSave || sendBody))
            .unwrap()
            .then(() => {
                dispatch(showModalSuccess({
                    title: "Success",
                    description: "Data submitted successfully",
                    onOk: () => navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_CUSTOMER)
                }));
            })
            .catch(() => {
                setIsSubmitting(false);
            });
    };

    const handleDeleteCustomer = (record) => {
        setCustomerList(customerList.filter((item) => item.key !== record.key));
    };

    const columnsCustomer = getCustomerListColumns({
        page,
        pageSize,
        onDelete: handleDeleteCustomer,
        actionType: "delete",
        onEdit: edit,
        editingKey,
        isEditing,
        save,
        cancel,
        form,
        listCustomer,
        handleCustomerChange
    });

    const routesBread = [
        { path: "", breadcrumbName: "Payment & Collection" },
        { path: "", breadcrumbName: "Payment Warranty" },
        { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_CUSTOMER, breadcrumbName: "Transfer to Customer" },
        { path: "", breadcrumbName: type === "update" ? "Update" : "Create" }
    ];

    return (
        <>
            <BreadCrumb routes={routesBread} />
            <Spin spinning={loading || isSubmitting}>
                <FormStepper steps={steps} current={current} />
                
                <Form 
                    layout="vertical" 
                    form={form} 
                    onFinish={() => processSubmit(false)} 
                    preserve={false}
                    onFinishFailed={() => message.error("Please check all required fields")}
                >
                    <div className="mt-8 flex flex-col gap-8">
                        <div style={{ display: current !== 0 ? "none" : undefined }}>
                            <TransferToCustomerForm 
                                form={form} 
                                onSearchWarranty={handleSearchWarranty} 
                            />
                            <div className="mt-8">
                                <CustomerInfoSection 
                                    customerList={customerList}
                                    columnsCustomer={columnsCustomer}
                                    handleAddCustomer={handleAddCustomer}
                                    page={page}
                                    pageSize={pageSize}
                                    handlePageChange={handlePageChange}
                                    handleSizeChange={handleSizeChange}
                                    handleGlobalSearch={handleGlobalSearch}
                                />
                            </div>
                        </div>

                        <div style={{ display: current !== 1 ? "none" : undefined }}>
                            <CardContainer 
                                header={"APPROVAL INFORMATION"}
                                collapsible={true}
                            >
                                <ApprovalComponentGeneral
                                    dataTable={appHierDataDetail}
                                    dataOption={appHierOptions}
                                    selectedHierarchy={selectedHierarchy}
                                    updateSelectedHierarchy={setSelectedHierarchy}
                                />
                            </CardContainer>
                        </div>

                        <div style={{ display: current !== 2 ? "none" : undefined }}>
                            <CardContainer
                                header={"ATTACHMENT INFORMATION"}
                                collapsible={true}
                            >
                                <AttachmentComponent
                                    type={type}
                                    data={listDataAttachment}
                                    updateData={setListDataAttachment}
                                    typeSelector="transferToCustomer"
                                    dispatch={dispatch}
                                    getAPICategory={getListCategory}
                                    service={receiptCollectionHttpService}
                                    configApplication={configApp.PAYMENT_SERVICE}
                                    typeRBI={"data"}
                                    mandatory={true}
                                />
                            </CardContainer>
                        </div>
                    </div>

                    <FormFooter
                        current={current}
                        totalSteps={steps.length}
                        onPrev={prev}
                        onNext={next}
                        onCancel={onBack}
                        onClear={() => { form.resetFields(); setCustomerList([]); setListDataAttachment([]); setSelectedHierarchy(null); }}
                        onSaveDraft={() => processSubmit(true)}
                        onSubmit={() => form.submit()}
                        type={type}
                        isLoading={isSubmitting}
                    />
                </Form>
            </Spin>

            <ModalCustom
                isOpen={modalConfirm}
                handleCancel={() => setModalConfirm(false)}
                header={"Confirmation"}
                width={1000}
                type={"confirmation"}
                hidePadding={true}
                footer={
                    <div className="w-full">
                        <div style={{ borderTop: "1px solid #C8CDD4", marginLeft: "-16px", marginRight: "-16px", marginBottom: "24px" }} />
                        <div className="flex justify-between gap-5 px-2 pb-2">
                            <ButtonComponent onClick={() => setModalConfirm(false)} type="default" className="!w-fit px-8">Cancel</ButtonComponent>
                            <ButtonComponent isPrimary onClick={() => handleSave()} loading={isSubmitting} className="!w-fit px-8">Confirm</ButtonComponent>
                        </div>
                    </div>
                }
            >
                <ContentModalConfirm
                    data={sendBody}
                    listDataAttachment={listDataAttachment}
                    listDataAppHierDetail={appHierDataDetail}
                    dataOption={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                    customerList={customerList}
                    type="transferToCustomer"
                />
            </ModalCustom>

            <ModalConfirm
                isOpen={modalBack}
                handleCancel={() => setModalBack(false)}
                handleOk={() => navigate(-1)}
                width={600}
            >
                <div className="flex justify-center mt-5 gap-[20px]">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className="text-[18px] font-bold text-center">Are you sure you want to go back? All unsaved changes will be lost.</p>
                </div>
            </ModalConfirm>

            <ModalSearchWarranty
                isOpen={showSearchWarrantyModal}
                onClose={() => setShowSearchWarrantyModal(false)}
                onConfirm={handleConfirmWarranty}
            />
        </>
    );
};

export default ListFormTransferToCustomer;
