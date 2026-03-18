import {
    LeftOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Form, Spin, Popconfirm, Table, Input, InputNumber } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import {
    submitTransferToCustomer,
    getAllApprovalList,
    getDetailTransferToCustomer,
    getListApprovalById,
    getListCategory,
} from "../../../../../redux/slices/receipt_collection/transferToCustomer";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import TransferToCustomerForm from "./TransferToCustomerForm";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../../components/BaseContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
    showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import TableRBI from "../../../../../components/TableRBI";

import ModalSearchWarranty from "./ModalSearchWarranty";
import { getCustomerListColumns } from "./CustomerListColumns";
import EditableCell from "./EditableCell";

const ListFormTransferToCustomer = (props) => {
    const { type } = props;
    const {
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail,
    } = useSelector((state) => state.transferToCustomer);

    const loading = useSelector((state) => state.transferToCustomer.loading);

    // Declaration
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const formValue = form.getFieldsValue();
    const location = useLocation();
    const { id } = location?.state || {};
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState();
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalBack, setModalBack] = useState(false);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [loadingForm, setLoadingForm] = useState(loading);
    const [customerList, setCustomerList] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showSearchWarrantyModal, setShowSearchWarrantyModal] = useState(false);
    const [editingKey, setEditingKey] = useState("");

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            customer: "",
            areaCode: "",
            fromCustomerName: "",
            currency: "",
            amount: "",
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...customerList];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setCustomerList(newData);
                setEditingKey("");
            } else {
                newData.push(row);
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
            areaCode: "BEK001", // Default/Dummy
            fromCustomerName: "PLN", // Default/Dummy
            currency: "IDR",
            amount: 0,
        };
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
            areaName: record.areaName,
            customerId: record.customerId,
            customerName: record.customerName,
            customerSegment: record.customerSegment,
            customerGroup: record.customerGroup,
            type: record.type,
            publisher: record.publisher,
            currency: record.currency,
            balance: record.balance?.toLocaleString(),
            rate: record.rate?.toLocaleString(),
            rateDate: record.rateDate,
            equivalent: record.equivalent?.toLocaleString(),
            documentNumber: record.documentNumber,
            mutationDate: record.mutationDate,
            effectiveDate: record.effectiveDate,
            expiringDate: record.expiringDate,
            endDateClaim: record.endDateClaim,
        });
    }

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleSizeChange = (current, size) => {
        setPage(1);
        setPageSize(size);
    };


    useEffect(() => {
        if (id && type === "update") {
            dispatch(getDetailTransferToCustomer(id));
        }
    }, [dispatch, id, type]);

    useEffect(() => {
        dispatch(getAllApprovalList());
    }, [dispatch]);

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
        if (selectedHierarchy && selectedHierarchy !== 0) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            const data = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail.map((b, index) => ({
                    ...b,
                    key: index + 1,
                })),
            }));
            setAppHierDataDetail(data);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    useEffect(() => {
        if (
            formValue.approvalHierarchy &&
            !appHierOptions
                .map((item) => item.value)
                .includes(formValue.approvalHierarchy)
        ) {
            form.setFieldsValue({ approvalHierarchy: null });
            setSelectedHierarchy(null);
        }
    }, [formValue, appHierOptions, form]);

    useEffect(() => {
        if (id && data_detail) {
            // Mapping detail data to form if needed.
        }
    }, [data_detail, id]);

    const [tabData, setTabData] = useState([
        {
            value: "Transfer to Customer",
            paramValue: ["deductionPeriod", "type", "deductionDate"],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
    ]);

    const [valuePage, setValuePage] = useState(tabData[0].value);
    const [sendBody, setSendBody] = useState();
    const onChange = (e) => {
        setValuePage(e.target.value);
    };

    const handleSubmitForm = (values) => {
        const formattedBody = {
            ...values,
            rateDate: values.rateDate ? moment(values.rateDate).format("DD MMM YYYY") : "-",
            mutationDate: values.mutationDate ? moment(values.mutationDate).format("DD MMM YYYY") : "-",
            effectiveDate: values.effectiveDate ? moment(values.effectiveDate).format("DD MMM YYYY") : "-",
            expiringDate: values.expiringDate ? moment(values.expiringDate).format("DD MMM YYYY") : "-",
            endDateClaim: values.endDateClaim ? moment(values.endDateClaim).format("DD MMM YYYY") : "-",
        };
        setSendBody(formattedBody);
        setModalConfirm(true);
    };

    const handleCancelModalConfirm = () => {
        setModalConfirm(false);
    };

    // Validation Button Back
    const handleBack = () => {
        if (
            form.getFieldValue() === null ||
            Object.keys(form.getFieldValue()).length === 0
        ) {
            navigate(-1);
        } else {
            setModalBack(true);
        }
    };

    const handleClear = () => {
        if (type === "create") {
            form.resetFields();
            setSelectedHierarchy("");
            setListDataAttachment([]);
            setCustomerList([]);
        } else {
            dispatch(getDetailTransferToCustomer(id));
            setCustomerList([]);
        }
    };

    //handle Error
    const handleError = ({ values, errorFields, outOfDate }) => {
        console.log("Validation Failed:", errorFields);
    };

    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "Payment & Collection",
        },
        {
            path: "",
            breadcrumbName: "Payment Warranty",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_CUSTOMER,
            breadcrumbName: "Transfer to Customer",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_TRANSFER_TO_CUSTOMER,
            breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
        },
    ];

    const handleSave = async () => {
        setModalConfirm(false);
        const payload = {
            ...sendBody,
            customerList: customerList,
        };

        dispatch(submitTransferToCustomer(payload))
            .unwrap()
            .then((response) => {
                dispatch(
                    showModalSuccess({
                        title: "Success",
                        description: "Success Submit Data",
                        onOk: () => {
                            navigate(-1);
                        }
                    })
                );
            })
            .catch((error) => {
                // Error handling is managed by slice
            });
    };

    const handleDeleteCustomer = (record) => {
        // Assuming 'no' is key, or use a unique ID
        const updatedList = customerList.filter((item) => item.no !== record.no);
        setCustomerList(updatedList);
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
        form
    });

    return (
        <>
            <BreadCrumb routes={routes} />
            <Spin spinning={loadingForm}>
                <RadioTabs
                    data={tabData}
                    onChange={onChange}
                    currentPosition={valuePage}
                />
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmitForm}
                    onFinishFailed={handleError}
                >
                    <div
                        style={{
                            display: valuePage !== tabData[0].value ? "none" : undefined,
                        }}
                    >
                        <TransferToCustomerForm form={form} onSearchWarranty={handleSearchWarranty} />
                        <div className="mt-5">
                            <BaseContainer header={"TO CUSTOMER LIST INFORMATION"}>
                                <div className="flex justify-end p-2">
                                    <ButtonComponent
                                        type="primary"
                                        onClick={handleAddCustomer}
                                    >
                                        + Create
                                    </ButtonComponent>
                                </div>
                                <TableRBI
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    columns={columnsCustomer}
                                    dataSource={customerList}
                                    pagination={false}
                                    tableScrolled={{ x: 1000 }}
                                    totalData={customerList?.length || 0}
                                    current={page}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    onSizeChanger={handleSizeChange}
                                />
                            </BaseContainer>
                        </div>
                    </div>
                    <div
                        style={{
                            display: valuePage !== tabData[1].value ? "none" : undefined,
                        }}
                    >
                        <BaseContainer header={"APPROVAL INFORMATION"}>
                            <ApprovalComponentGeneral
                                dataTable={appHierDataDetail}
                                dataOption={appHierOptions}
                                selectedHierarchy={selectedHierarchy}
                                updateSelectedHierarchy={setSelectedHierarchy}
                            />
                        </BaseContainer>
                    </div>
                    <div
                        style={{
                            display: valuePage !== tabData[2].value ? "none" : undefined,
                        }}
                    >
                        <BaseContainer header={"ATTACHMENT INFORMATION"}>
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
                            />
                        </BaseContainer>
                    </div>
                    <div className="flex w-full justify-between align-middle my-3">
                        <ButtonComponent
                            type="primary"
                            onClick={() => handleBack()}
                            icon={
                                <LeftOutlined
                                    style={{
                                        color: "#fff",
                                        fontSize: 24,
                                        justifyItems: "center",
                                    }}
                                />
                            }
                        >
                            Back
                        </ButtonComponent>
                        <div className="flex align-middle gap-3">
                            <ButtonComponent
                                icon={
                                    <SVGIcon
                                        name={
                                            type === "update" ? `IconButtonReset` : `IconButtonClear`
                                        }
                                        width={24}
                                    />
                                }
                                type="submit"
                                onClick={handleClear}
                            >
                                {type === "update" ? "Reset" : "Clear"}
                            </ButtonComponent>
                            <ButtonComponent htmlType="submit" type="submit">
                                Save & Submit
                            </ButtonComponent>
                        </div>
                    </div>
                </Form>
            </Spin>
            <ModalCustom
                isOpen={modalConfirm}
                handleCancel={handleCancelModalConfirm}
                header={"Confirmation"}
                width={1000}
                type={"confirmation"}
                footer={
                    <div className="w-full flex justify-end gap-5 p-4">
                        <ButtonComponent onClick={handleCancelModalConfirm} type="default">
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent type="submit" onClick={handleSave}>
                            Confirm
                        </ButtonComponent>
                    </div>
                }
            >
                <ContentModalConfirm
                    data={sendBody}
                    tabData={tabData}
                    listDataAttachment={listDataAttachment}
                    listDataAppHierDetail={appHierDataDetail}
                    dataOption={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                    customerList={customerList}
                    type="transferToCustomer"
                />
            </ModalCustom>

            {/* Modal Back*/}
            <ModalConfirm
                isOpen={modalBack}
                handleCancel={() => setModalBack(false)}
                handleOk={() => navigate(-1)}
                width={600}
            >
                <div className="flex justify-center mt-5 gap-[20px]">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className="text-[18px] font-bold">
                        Are you sure you want to back?
                    </p>
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
