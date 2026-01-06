import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { Form, Spin, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
    getListCustomerRestructure,
    getListAccountRestructure,
    getBadDebtByAccount,
    resetBadDebt,
    getAllApprovalList,
    getListApprovalById,
    getListCategory,
    getDetailRestructure,
} from "../../../../../redux/slices/receipt_collection/restructure";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";
import RestructureForm from "./RestructureForm";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import BaseContainer from "../../../../../components/BaseContainer";
import TableRBI from "../../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import ContentModalConfirmRestructure from "./ContentModalConfirmRestructure";

const ListFormRestructure = (props) => {
    const { type } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const location = useLocation();
    const { id } = location?.state || {};

    const {
        listCustomer,
        listAccount,
        badDebtList,
        totalBadDebt,
        dataListAppHierId,
        dataListAppHierDetail,
        dataListCategory,
        loading,
        data_detail
    } = useSelector((state) => state.restructure);

    const [modalBack, setModalBack] = useState(false);
    const [valuePage, setValuePage] = useState("Restructure");
    const [filteredAccountList, setFilteredAccountList] = useState([]);
    const [calculationList, setCalculationList] = useState([]);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState();
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [isModalSubmit, setIsModalSubmit] = useState(false);
    const [formValues, setFormValues] = useState({});

    const watchTotalMonth = Form.useWatch("totalMonth", form);
    const watchStartPeriod = Form.useWatch("startPeriod", form);

    const tabData = [
        { value: "Restructure" },
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
        dispatch(getListCustomerRestructure());
        dispatch(getListAccountRestructure());
        dispatch(getAllApprovalList());
        dispatch(getListCategory());

        if (type === "update" && id) {
            dispatch(getDetailRestructure(id));
        }
    }, [dispatch, type, id]);

    useEffect(() => {
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        if (data_detail && type === "update") {
            const res = data_detail.restructure;
            form.setFieldsValue({
                customerNumber: res.customerNumber,
                accountNumber: res.accountNumber,
                customerName: res.customerName,
                area: res.area,
                segment: res.segment,
                totalMonth: res.totalMonth,
                startPeriod: res.startPeriod ? moment(res.startPeriod) : undefined,
                apphierId: res.appHierId
            });
            setSelectedHierarchy(res.appHierId);

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

    useEffect(() => {
        const customerNumber = form.getFieldValue("customerNumber");
        if (customerNumber && listAccount.length > 0) {
            const filtered = listAccount.filter(acc => acc.customerNumber === customerNumber);
            setFilteredAccountList(filtered);
        }
    }, [listAccount, form, data_detail]);

    useEffect(() => {
        if (badDebtList.length > 0 && watchTotalMonth && watchStartPeriod) {
            const list = [];

            // "Clean" rounding logic (including Quarters):
            // 1. Calculate raw average
            const rawAvg = totalBadDebt / watchTotalMonth;

            // 2. Determine magnitude (e.g., 100,000 for 666,666 or 272,727)
            const mag = rawAvg > 0 ? 10 ** Math.floor(Math.log10(rawAvg)) : 1;

            // 3. Option A: Regular magnitude step (e.g., 100k)
            const baseA = Math.floor(rawAvg / mag) * mag;

            // 4. Option B: Quarter magnitude step (e.g., 250k)
            const baseB = Math.floor(rawAvg / (mag * 2.5)) * (mag * 2.5);

            // 5. Select the largest "clean" base
            const monthBase = Math.max(baseA, baseB);

            // 6. First month absorbs the entire remainder
            const firstMonthAmount = totalBadDebt - (monthBase * (watchTotalMonth - 1));

            for (let i = 0; i < watchTotalMonth; i++) {
                list.push({
                    key: i + 1,
                    invoicePeriod: moment(watchStartPeriod).add(i, "month").format("MMM YYYY").toUpperCase(),
                    totalAmount: i === 0 ? firstMonthAmount : monthBase,
                });
            }
            setCalculationList(list);
        } else {
            setCalculationList([]);
        }
    }, [badDebtList, watchTotalMonth, watchStartPeriod, totalBadDebt]);

    const onCustomerChange = (value) => {
        const selected = listCustomer.find(c => c.value === value);
        if (selected) {
            form.setFieldsValue({
                customerName: selected.name,
                area: selected.area,
                segment: selected.segment,
                accountNumber: undefined,
            });
            const filtered = listAccount.filter(acc => acc.customerNumber === value);
            setFilteredAccountList(filtered);
            dispatch(resetBadDebt());
            setCalculationList([]);
        }
    };

    const onAccountChange = (value) => {
        dispatch(getBadDebtByAccount(value));
    };

    const onFormReset = () => {
        form.resetFields();
        setFilteredAccountList([]);
        setCalculationList([]);
        dispatch(resetBadDebt());
    };

    const onChangeTab = (e) => {
        setValuePage(e.target.value);
    };

    const handleBack = () => {
        setModalBack(true);
    };

    const handleSubmit = (values) => {
        setFormValues(values);
        setIsModalSubmit(true);
    };

    const handleCancelModalConfirm = () => {
        setIsModalSubmit(false);
    };

    const handleSave = () => {
        setIsModalSubmit(false);
        console.log("Submit Final:", formValues);
        message.success("Successfully submitted!");
        navigate(-1);
    };

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        { path: "", breadcrumbName: "Bad Debt and Collection" },
        { path: DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE, breadcrumbName: "Restructure" },
        { path: "", breadcrumbName: type === "create" ? "Create Restructure" : "Update Restructure" },
    ];

    const badDebtColumns = [
        { title: "NO", dataIndex: "key", width: 50 },
        { title: "INVOICE NO", dataIndex: "invoiceNo" },
        { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
        { title: "CURRENCY", dataIndex: "currency" },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            render: (val) => val?.toLocaleString("id-ID"),
            align: "right"
        },
    ];

    const calculationColumns = [
        { title: "NO", dataIndex: "key", width: 50 },
        { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            render: (val) => val?.toLocaleString("id-ID"),
            align: "right"
        },
    ];

    const handleClear = () => {
        if (type === "create") {
            form.resetFields();
            setSelectedHierarchy("");
            setListDataAttachment([]);
            dispatch(resetBadDebt());
            setFilteredAccountList([]);
            setCalculationList([]);
        } else {
            dispatch(getDetailRestructure(id));
        }
    };

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>
                <RadioTabs
                    data={tabData}
                    onChange={onChangeTab}
                    currentPosition={valuePage}
                    className="mb-5"
                />
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <div style={{ display: valuePage !== "Restructure" ? "none" : "block" }}>
                        <RestructureForm
                            form={form}
                            listCustomer={listCustomer}
                            listAccount={filteredAccountList}
                            onCustomerChange={onCustomerChange}
                            onAccountChange={onAccountChange}
                            showRestructureInfo={false}
                        />

                        <div className="mt-5">
                            <BaseContainer header={"BAD DEBT INFORMATION"}>
                                <TableRBI
                                    dataSource={badDebtList}
                                    columns={badDebtColumns}
                                    usePagination={false}
                                    showAdvanceSearch={false}
                                    showSearchBar={false}
                                />
                                {badDebtList.length > 0 && (
                                    <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                                        <div className="flex-[4] text-center">TOTAL</div>
                                        <div className="flex-1 text-right pr-4">
                                            {totalBadDebt.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}
                            </BaseContainer>
                        </div>

                        <div className="mt-5">
                            <RestructureForm
                                form={form}
                                showCustomerInfo={false}
                                showRestructureInfo={true}
                                disabledRestructure={!form.getFieldValue("accountNumber")}
                            />
                        </div>

                        <div className="mt-5">
                            <BaseContainer header={"CALCULATION INFORMATION"}>
                                <TableRBI
                                    dataSource={calculationList}
                                    columns={calculationColumns}
                                    usePagination={false}
                                    showAdvanceSearch={false}
                                    showSearchBar={false}
                                />
                                {calculationList.length > 0 && (
                                    <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                                        <div className="flex-[2] text-center ml-[-20px]">TOTAL</div>
                                        <div className="flex-1 text-right pr-4">
                                            {totalBadDebt.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}
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
                                typeSelector="restructure"
                                dispatch={dispatch}
                                getAPICategory={getListCategory}
                                service={receiptCollectionHttpService}
                                configApplication={configApp.PAYMENT_SERVICE}
                                typeRBI={"data"}
                            />
                        </BaseContainer>
                    </div>

                    <div className="flex justify-between mt-5 mb-10">
                        <ButtonComponent
                            type="primary"
                            onClick={handleBack}
                            icon={<LeftOutlined />}
                        >
                            Back
                        </ButtonComponent>
                        <div className="flex gap-3">
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

            <ModalConfirm
                isOpen={modalBack}
                handleCancel={() => setModalBack(false)}
                handleOk={() => navigate(-1)}
            >
                <div className="flex justify-center mt-5 gap-[20px]">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className="text-[18px] font-bold">Are you sure you want to back?</p>
                </div>
            </ModalConfirm>

            <ModalCustom
                isOpen={isModalSubmit}
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
                <ContentModalConfirmRestructure
                    data={formValues}
                    badDebtList={badDebtList}
                    totalBadDebt={totalBadDebt}
                    calculationList={calculationList}
                    listDataAttachment={listDataAttachment}
                    appHierOptions={appHierOptions}
                    appHierDataDetail={appHierDataDetail}
                    selectedHierarchy={selectedHierarchy}
                />
            </ModalCustom>
        </LayoutMenu>
    );
};

export default ListFormRestructure;
