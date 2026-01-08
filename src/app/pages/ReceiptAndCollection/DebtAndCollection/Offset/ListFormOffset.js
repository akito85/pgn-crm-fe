import { LeftOutlined, WarningOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import { Form, Spin, message, Input, InputNumber, Select, Tooltip, DatePicker } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
    getAllApprovalList,
    getListApprovalById,
    getListCategory,
    getDetailOffset,
    resetDetail
} from "../../../../../redux/slices/receipt_collection/offset";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";
import OffsetForm from "./OffsetForm";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import BaseContainer from "../../../../../components/BaseContainer";
import TableRBI from "../../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import ContentModalConfirmOffset from "./ContentModalConfirmOffset";
import ModalSearchCustomer from "./ModalSearchCustomer";

const ListFormOffset = (props) => {
    const { type } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const location = useLocation();
    const { id } = location?.state || {};

    const {
        loading,
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail,
        dataListCategory,
    } = useSelector((state) => state.offset);

    const [modalBack, setModalBack] = useState(false);
    const [valuePage, setValuePage] = useState("Offset");
    const [offsetEntries, setOffsetEntries] = useState([]);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState();
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [isModalSubmit, setIsModalSubmit] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [isModalSearchCustomer, setIsModalSearchCustomer] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    // Editable Row State
    const [editingKey, setEditingKey] = useState('');
    const [editForm] = Form.useForm();

    const tabData = [
        { value: "Offset" },
        { value: "Approval" },
        { value: "Attachment" },
    ];

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
        dispatch(getAllApprovalList());
        dispatch(getListCategory());

        if (type === "update" && id) {
            dispatch(getDetailOffset(id));
        } else {
            dispatch(resetDetail());
        }
    }, [dispatch, type, id]);

    useEffect(() => {
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        if (data_detail && type === "update") {
            const res = data_detail.offset;
            form.setFieldsValue({
                apphierId: res.appHierId
            });
            setSelectedHierarchy(res.appHierId);
            setSelectedCustomers([{
                id: 1,
                accountNumber: res.accountNumber,
                accountName: res.accountName,
                customerNumber: res.customerNumber,
                customerName: res.customerName,
                segment: res.segment
            }]);

            // Mocking offset entries for update
            setOffsetEntries([{
                key: '1',
                reference: res.reference,
                currency: res.referenceCurrency,
                amount: res.amount,
                rate: res.rate,
                rateDate: moment(res.rateDate),
                rateType: res.rateType,
                equivalentAmount: res.equivalentAmount,
                offsetDate: moment(res.offsetDate),
                description: res.description
            }]);

            const dataAttachment = (data_detail?.attachmentDtoList || []).map(
                (item) => ({
                    ...item,
                    createdDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "",
                    dataType: "exist",
                })
            );
            setListDataAttachment(dataAttachment);
        }
    }, [data_detail, type, form]);

    const handleBack = () => {
        setModalBack(true);
    };

    const handleSubmit = (values) => {
        setFormValues({ ...values, offsetEntries, selectedCustomers });
        setIsModalSubmit(true);
    };

    const handleSaveFinal = () => {
        setIsModalSubmit(false);
        message.success("Successfully submitted!");
        navigate(-1);
    };

    const handleClear = () => {
        if (type === "create") {
            form.resetFields();
            setSelectedHierarchy("");
            setListDataAttachment([]);
            setOffsetEntries([]);
            setSelectedCustomers([]);
        } else {
            dispatch(getDetailOffset(id));
        }
    };

    // Editable Table Logic
    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        editForm.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        const record = offsetEntries.find(item => item.key === editingKey);
        if (record?.isNew) {
            setOffsetEntries(offsetEntries.filter(item => item.key !== editingKey));
        }
        setEditingKey('');
    };

    const saveRow = async (key) => {
        try {
            const row = await editForm.validateFields();
            const newData = [...offsetEntries];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                const { isNew, ...rest } = item;
                newData.splice(index, 1, { ...rest, ...row });
                setOffsetEntries(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setOffsetEntries(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const deleteRow = (key) => {
        const newData = offsetEntries.filter(item => item.key !== key);
        setOffsetEntries(newData);
    };

    const addRow = () => {
        const newKey = Date.now().toString();
        const newRow = {
            key: newKey,
            reference: "",
            currency: "IDR",
            amount: 0,
            rate: 0,
            rateDate: moment(),
            isNew: true
        };
        setOffsetEntries([...offsetEntries, newRow]);
        edit(newRow);
    };

    const columns = [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (text, record, index) => index + 1
        },
        {
            title: "REFERENCE",
            dataIndex: "reference",
            render: (text, record) => isEditing(record) ? (
                <Form.Item name="reference" style={{ margin: 0 }} rules={[{ required: true }]}>
                    <Input size="middle" placeholder="Type here" />
                </Form.Item>
            ) : text
        },
        {
            title: "REFERENCY CURRENCY",
            dataIndex: "currency",
            render: (text, record) => isEditing(record) ? (
                <Form.Item name="currency" style={{ margin: 0 }}>
                    <Select size="middle">
                        <Select.Option value="IDR">IDR</Select.Option>
                        <Select.Option value="USD">USD</Select.Option>
                    </Select>
                </Form.Item>
            ) : text
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            align: "right",
            render: (text, record) => isEditing(record) ? (
                <Form.Item name="amount" style={{ margin: 0 }}>
                    <InputNumber
                        style={{ width: "100%" }}
                        size="middle"
                        placeholder="0"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={value => value.replace(/\./g, '').replace(',', '.')}
                        controls={false}
                    />
                </Form.Item>
            ) : text?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        },
        {
            title: "RATE",
            dataIndex: "rate",
            align: "right",
            render: (text, record) => isEditing(record) ? (
                <Form.Item name="rate" style={{ margin: 0 }}>
                    <InputNumber
                        style={{ width: "100%" }}
                        size="middle"
                        placeholder="0"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={value => value.replace(/\./g, '').replace(',', '.')}
                        controls={false}
                    />
                </Form.Item>
            ) : text?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        },
        {
            title: "RATE DATE",
            dataIndex: "rateDate",
            align: "center",
            render: (text, record) => isEditing(record) ? (
                <Form.Item name="rateDate" style={{ margin: 0 }}>
                    <DatePicker size="middle" format="DD MMM YYYY" className="w-full" suffixIcon={<CalendarOutlined />} />
                </Form.Item>
            ) : text ? moment(text).format("DD MMM YYYY") : ""
        },
        {
            title: "ACTION",
            dataIndex: "action",
            width: 150,
            align: "center",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div className="flex gap-2 justify-center">
                        <ButtonComponent type="default" size="small" onClick={cancel} className="border-primary text-primary">Cancel</ButtonComponent>
                        <ButtonComponent type="primary" size="small" onClick={() => saveRow(record.key)}>Save</ButtonComponent>
                    </div>
                ) : (
                    <div className="flex gap-2 justify-center">
                        <Tooltip title="Edit">
                            <div onClick={() => edit(record)} style={{ cursor: 'pointer' }}>
                                <SVGIcon name="IconEdit" width={24} color={"#ACC424"} />
                            </div>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <div onClick={() => deleteRow(record.key)} style={{ cursor: 'pointer' }}>
                                <SVGIcon name="IconDelete" width={24} />
                            </div>
                        </Tooltip>
                    </div>
                );
            }
        }
    ];

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        { path: "", breadcrumbName: "Bad Debt and Collection" },
        { path: DEBT_AND_COLLECTION_ROUTES.VIEW_OFFSET, breadcrumbName: "Offset" },
        { path: "", breadcrumbName: type === "create" ? "Create Offset" : "Update Offset" },
    ];

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>
                <RadioTabs
                    data={tabData}
                    onChange={(e) => setValuePage(e.target.value)}
                    currentPosition={valuePage}
                    className="mb-5"
                />
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <div style={{ display: valuePage !== "Offset" ? "none" : "block" }}>
                        <OffsetForm
                            onChooseCustomer={() => setIsModalSearchCustomer(true)}
                            showOffsetInfo={false}
                            disabled={type === "update"}
                            selectedCustomers={selectedCustomers}
                        />

                        <div className="mt-5">
                            <BaseContainer header={
                                <div className="flex justify-between items-center w-full -my-2.5">
                                    <span>OFFSET INFORMATION</span>
                                    {/* The image doesn't explicitly show an Add button but implies new rows can be added */}
                                    <ButtonComponent type="primary" onClick={addRow} disabled={editingKey !== ""}>
                                        Add Entry
                                    </ButtonComponent>
                                </div>
                            }>
                                <div className="p-4">
                                    <Form form={editForm} component={false}>
                                        <TableRBI
                                            dataSource={offsetEntries}
                                            columns={columns}
                                            usePagination={false}
                                            showAdvanceSearch={false}
                                            showSearchBar={false}
                                            tableScrolled={{ x: 1200 }}
                                        />
                                    </Form>
                                </div>
                            </BaseContainer>
                        </div>
                    </div>

                    <div style={{ display: valuePage !== "Approval" ? "none" : "block" }}>
                        <BaseContainer header={"APPROVAL INFORMATION"}>
                            <ApprovalComponentGeneral
                                dataTable={appHierDataDetail || []}
                                dataOption={appHierOptions || []}
                                selectedHierarchy={selectedHierarchy}
                                updateSelectedHierarchy={setSelectedHierarchy}
                            />
                        </BaseContainer>
                    </div>

                    <div style={{ display: valuePage !== "Attachment" ? "none" : "block" }}>
                        <BaseContainer header={"ATTACHMENT INFORMATION"}>
                            <AttachmentComponent
                                type={type}
                                data={listDataAttachment || []}
                                dataListCategory={dataListCategory || []}
                                updateData={setListDataAttachment}
                                typeSelector="offset"
                                dispatch={dispatch}
                                getAPICategory={getListCategory}
                                service={receiptCollectionHttpService}
                                configApplication={configApp.PAYMENT_SERVICE}
                                typeRBI={"data"}
                            />
                        </BaseContainer>
                    </div>

                    <div className="flex justify-between mt-5 mb-10">
                        <ButtonComponent type="primary" onClick={handleBack} icon={<LeftOutlined />} className="bg-[#0075BF] border-[#0075BF]">Back</ButtonComponent>
                        <div className="flex gap-3">
                            <ButtonComponent onClick={handleClear} className="bg-white border-[#0075BF] text-[#0075BF] min-w-[120px]">
                                {type === "update" ? "Reset" : "Clear"}
                            </ButtonComponent>
                            <ButtonComponent htmlType="submit" type="primary" className="bg-[#0075BF] border-[#0075BF] min-w-[120px]">Save</ButtonComponent>
                        </div>
                    </div>
                </Form>
            </Spin>

            <ModalConfirm isOpen={modalBack} handleCancel={() => setModalBack(false)} handleOk={() => navigate(-1)}>
                <div className="flex justify-center mt-5 gap-[20px]">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className="text-[18px] font-bold">Are you sure you want to back?</p>
                </div>
            </ModalConfirm>

            <ModalSearchCustomer
                isOpen={isModalSearchCustomer}
                onClose={() => setIsModalSearchCustomer(false)}
                onConfirm={(customers) => {
                    setSelectedCustomers(customers);
                    setIsModalSearchCustomer(false);
                }}
            />

            <ModalCustom
                isOpen={isModalSubmit}
                handleCancel={() => setIsModalSubmit(false)}
                header={"Confirmation"}
                width={1000}
                type={"confirmation"}
                footer={
                    <div className="w-full flex justify-end gap-5 p-4">
                        <ButtonComponent onClick={() => setIsModalSubmit(false)} type="default">Cancel</ButtonComponent>
                        <ButtonComponent type="submit" onClick={handleSaveFinal}>Confirm</ButtonComponent>
                    </div>
                }
            >
                <ContentModalConfirmOffset
                    data={formValues}
                    offsetEntries={offsetEntries}
                    listDataAttachment={listDataAttachment}
                    appHierOptions={appHierOptions}
                    appHierDataDetail={appHierDataDetail}
                    selectedHierarchy={selectedHierarchy}
                />
            </ModalCustom>
        </LayoutMenu>
    );
};

export default ListFormOffset;
