import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, message } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../components/RadioTabs";
import {
    getDetailRestructure,
    approveOrRejectRestructure,
    getListCategory,
    getAllApprovalList,
    getListApprovalById
} from "../../../../../redux/slices/receipt_collection/restructure";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import TableRBI from "../../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import GridLayout from "../../../../../components/GridLayout";
import DetailText from "../../../../../components/DetailText";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";

const ListDetailRestructure = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [modalApprove, setModalApprove] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const id = location?.state?.id || "RES001"; // Default for dummy
    const [dataHeader, setDataHeader] = useState({});
    const [badDebtList, setBadDebtList] = useState([]);
    const [calculationList, setCalculationList] = useState([]);
    const [listDataAttachment, setListDataAttachment] = useState([]);

    // Tabs
    const [tabData] = useState([
        { value: "Restructure" },
        { value: "Approval" },
        { value: "Attachment" },
    ]);

    const {
        loading,
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail
    } = useSelector((state) => state.restructure);

    const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);

    const handleSegmentedPage = (e) => {
        setSegmentedPage(e.target.value);
    };

    useEffect(() => {
        if (id) {
            dispatch(getDetailRestructure(id));
            dispatch(getAllApprovalList());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (data_detail && data_detail.restructure) {
            const res = data_detail.restructure;
            setDataHeader(res);
            setSelectedHierarchy(res.appHierId);
            setBadDebtList(data_detail.badDebtList || []);
            setCalculationList(data_detail.calculationList || []);

            const dataAttachment = (data_detail?.attachmentDtoList || []).map(
                (item) => ({
                    ...item,
                    createdDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "",
                    dataType: "exist",
                })
            );
            setListDataAttachment(dataAttachment);

            form.setFieldsValue({
                apphierId: res.appHierId
            });
        }
    }, [data_detail, form]);

    useEffect(() => {
        if (dataListAppHierId?.length > 0) {
            const tempAppHier = dataListAppHierId.map((appHier) => ({
                name: appHier.approvalName,
                value: appHier.appHierId,
            }));
            setAppHierOptions(tempAppHier);
        }
    }, [dataListAppHierId]);

    useEffect(() => {
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        if (dataListAppHierDetail?.length > 0) {
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

    const badDebtColumns = [
        { title: "NO", dataIndex: "key", width: 50 },
        { title: "INVOICE NO", dataIndex: "invoiceNo" },
        { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
        { title: "CURRENCY", dataIndex: "currency" },
        { title: "TOTAL AMOUNT", dataIndex: "totalAmount", align: "right", render: (v) => v?.toLocaleString("id-ID") },
    ];

    const calculationColumns = [
        { title: "NO", dataIndex: "key", width: 50 },
        { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
        { title: "TOTAL AMOUNT", dataIndex: "totalAmount", align: "right", render: (v) => v?.toLocaleString("id-ID") },
    ];

    const totalBadDebt = useMemo(() => badDebtList.reduce((acc, curr) => acc + curr.totalAmount, 0), [badDebtList]);

    const renderSection = (segmentedPage) => {
        switch (segmentedPage) {
            case "Restructure":
                return (
                    <div className="flex flex-col gap-5 mt-5">
                        <BaseContainer header={"CUSTOMER INFORMATION"}>
                            <GridLayout cols={3} className="p-4">
                                <DetailText label={"Customer Number"}>{dataHeader?.customerNumber}</DetailText>
                                <DetailText label={"Account Number"}>{dataHeader?.accountNumber}</DetailText>
                                <DetailText label={"Customer Name"}>{dataHeader?.customerName}</DetailText>
                                <DetailText label={"Area Code"}>{dataHeader?.areaCode}</DetailText>
                                <DetailText label={"Area Name"}>{dataHeader?.area}</DetailText>
                                <DetailText label={"Segment"}>{dataHeader?.segment}</DetailText>
                            </GridLayout>
                        </BaseContainer>

                        <BaseContainer header={"BAD DEBT INFORMATION"}>
                            <TableRBI
                                columns={badDebtColumns}
                                dataSource={badDebtList}
                                usePagination={false}
                            />
                            <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                                <div className="flex-[4] text-center border-r">TOTAL</div>
                                <div className="flex-1 text-right pr-4">
                                    {totalBadDebt.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </BaseContainer>

                        <BaseContainer header={"CUSTOMER INFORMATION"}> { /* Mockup shows double CUSTOMER INFORMATION header */}
                            <GridLayout cols={2} className="p-4">
                                <DetailText label={"Total Month"}>{dataHeader?.totalMonth}</DetailText>
                                <DetailText label={"Start Period"}>{dataHeader?.startPeriod ? moment(dataHeader?.startPeriod).format("MMM YYYY") : "-"}</DetailText>
                            </GridLayout>
                        </BaseContainer>

                        <BaseContainer header={"CALCULATION INFORMATION"}>
                            <TableRBI
                                columns={calculationColumns}
                                dataSource={calculationList}
                                usePagination={false}
                            />
                            <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                                <div className="flex-[2] text-center border-r">TOTAL</div>
                                <div className="flex-1 text-right pr-4">
                                    {totalBadDebt.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </BaseContainer>

                        <div className="mt-5">
                            <HistoryLog
                                recordId={dataHeader?.id}
                                createdDate={dataHeader?.createdDate && moment(dataHeader?.createdDate).format("DD MMM YYYY HH:mm")}
                                createdBy={dataHeader?.createdBy}
                                updatedDate={dataHeader?.updatedDate && moment(dataHeader?.updatedDate).format("DD MMM YYYY HH:mm")}
                                updatedBy={dataHeader?.updatedBy}
                            />
                        </div>
                    </div>
                );
            case "Approval":
                return (
                    <div className="mt-5">
                        <BaseContainer header={"RESTRUCTURE APPROVAL"}>
                            <Form form={form}>
                                <ApprovalComponentGeneral
                                    dataTable={appHierDataDetail}
                                    dataOption={appHierOptions}
                                    selectedHierarchy={selectedHierarchy}
                                    disableSelect={true}
                                    approvalName={appHierOptions.find(o => o.value === selectedHierarchy)?.name || ""}
                                />
                            </Form>
                        </BaseContainer>
                    </div>
                );
            case "Attachment":
                return (
                    <div className="mt-5">
                        <BaseContainer header={"ATTACHMENT INFORMATION"}>
                            <AttachmentComponent
                                type={"detail"}
                                data={listDataAttachment}
                                updateData={setListDataAttachment}
                                typeSelector="restructure"
                                dispatch={dispatch}
                                getAPICategory={getListCategory}
                                service={receiptCollectionHttpService}
                                configApplication={configApp.PAYMENT_SERVICE}
                            />
                        </BaseContainer>
                    </div>
                );
            default:
                return <></>;
        }
    };

    const isShowButton = data_detail?.tApprovalDto?.isApprover;

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        { path: "", breadcrumbName: "Bad Debt and Collection" },
        { path: DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE, breadcrumbName: "Restructure" },
        { path: "", breadcrumbName: "Detail Restructure" },
    ];

    const handleConfirm = (res, handleClear) => {
        const body = {
            id: id,
            remark: res.remark,
            approvalId: data_detail?.tApprovalDto?.tAppId,
            action: approveOrReject.toUpperCase(),
        };

        dispatch(approveOrRejectRestructure({ body })).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                message.success(`Successfully ${approveOrReject}ed!`);
                navigate(-1);
            }
        });
        handleClear();
        setModalApprove(false);
    };

    return (
        <>
            <BreadCrumb routes={routes} />
            <div className="mt-5">
                <RadioTabs data={tabData} onChange={handleSegmentedPage} currentPosition={segmentedPage} />
                {renderSection(segmentedPage)}
            </div>

            <ModalApproveOrReject
                isOpen={modalApprove}
                handleCloseModal={() => setModalApprove(false)}
                onFinish={handleConfirm}
                header={approveOrReject}
                approveOrReject={approveOrReject}
                menu={"Restructure"}
                named={dataHeader?.id}
            />

            <div className="flex mt-[30px] justify-between py-5">
                <ButtonComponent
                    type={"submit"}
                    onClick={() => navigate(-1)}
                    icon={<LeftOutlined style={{ color: "#fff", fontSize: 24 }} />}
                >
                    Back
                </ButtonComponent>

                {isShowButton && (
                    <div className="flex align-middle gap-5">
                        <ButtonComponent
                            type="reject"
                            onClick={() => {
                                setModalApprove(true);
                                setApproveOrReject("reject");
                            }}
                        >
                            Reject
                        </ButtonComponent>
                        <ButtonComponent
                            type="approve"
                            onClick={() => {
                                setModalApprove(true);
                                setApproveOrReject("approve");
                            }}
                        >
                            Approve
                        </ButtonComponent>
                    </div>
                )}
            </div>
        </>
    );
};

const HistoryLog = ({ recordId, createdDate, createdBy, updatedDate, updatedBy }) => {
    return (
        <BaseContainer header={"HISTORY LOG INFORMATION"}>
            <GridLayout cols={5} className="p-4">
                <DetailText label={"Record Id"}>{recordId || "-"}</DetailText>
                <DetailText label={"Created Date"}>{createdDate || "-"}</DetailText>
                <DetailText label={"Created By"}>{createdBy || "-"}</DetailText>
                <DetailText label={"Updated Date"}>{updatedDate || "-"}</DetailText>
                <DetailText label={"Updated By"}>{updatedBy || "-"}</DetailText>
            </GridLayout>
        </BaseContainer>
    );
};

export default ListDetailRestructure;
