import { LeftOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, message, Tabs, Spin } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import {
    getDetailRestructure,
    getDetailEarlyRepayment,
    approveOrRejectRestructure,
    getListCategory,
    getAllApprovalList,
    getListApprovalById,
    resetDetail
} from "../../../../../redux/slices/receipt_collection/restructure";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import TableRBI from "../../../../../components/TableRBI";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import SectionCard from "../../../../../components/SectionCard";
import SubSectionCard from "../../../../../components/SubSectionCard";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import StatusComponent from "../../../../../components/StatusComponent";
import SVGIcon from "../../../../../assets/Icon/index";

import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";
import DetailPaymentPlan from "./DetailPaymentPlan";
import DetailEarlyRepayment from "./DetailEarlyRepayment";

const ListDetailRestructure = ({ selectedId: propId, onClose, onRefresh, approvalType: propApprovalType, isApprover: propIsApprover }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [modalApprove, setModalApprove] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const id = propId || location?.state?.id || "RES001"; 
    const isEmbedded = !!propId;

    const contactColumns = [
        { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
        { 
          title: "PRIMARY", 
          dataIndex: "isPrimary", 
          width: 120,
          render: (val) => val ? <StatusComponent colour="primary">Primary</StatusComponent> : "-" 
        },
        { title: "CONTACT NAME", dataIndex: "cpName", width: 250 },
        { title: "JOB", dataIndex: "job", width: 150 },
        { title: "POSITION", dataIndex: "position", width: 150 },
        { title: "ADDRESS", dataIndex: "address" },
    ];

    const subColumns = [
        { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
        { title: "TYPE", dataIndex: "type", width: 150 },
        { title: "VALUE", dataIndex: "value", width: 150 },
    ];

    const expandable = {
        expandedRowRender: (record) => (
            <div style={{ paddingLeft: "2.5em" }}>
                <TableRBI
                    idTable={`expanded-contact-detail-${record.key}`}
                    columns={subColumns}
                    dataSource={record.details || []}
                    useSelect={false}
                    usePagination={false}
                    showAdvanceSearch={false}
                    showSearchBar={false}
                />
            </div>
        ),
        rowExpandable: (record) => !!record.details,
        expandIcon: ({ expanded, onExpand, record }) =>
            record.details ? (
                expanded ? (
                    <MinusOutlined className="cursor-pointer" onClick={(e) => onExpand(record, e)} />
                ) : (
                    <PlusOutlined className="cursor-pointer" onClick={(e) => onExpand(record, e)} />
                )
            ) : (
                <span className="ml-4" />
            ),
    };

    const {
        loading,
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail
    } = useSelector((state) => state.restructure);

    const [segmentedPage, setSegmentedPage] = useState("Payment Plan");
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);

    const [dataHeader, setDataHeader] = useState({});
    const [contacts, setContacts] = useState([]);
    const [openItems, setOpenItems] = useState([]);
    const [installmentsByCurrency, setInstallmentsByCurrency] = useState({});
    const [listDataAttachment, setListDataAttachment] = useState([]);

    const approvalName = (dataListAppHierId || []).find(x => x.appHierId === data_detail?.restructure?.appHierId)?.approvalName || dataHeader?.approvalName || dataHeader?.appHierId || "-";

    const isApprover = propIsApprover || location?.state?.isApprover || false;
    const isEarlyRepayment = (propApprovalType || location?.state?.approvalType) === "EARLY_REPAYMENT_RESTRUCTURE" && isApprover;

    useEffect(() => {
        if (id) {
            setLocalLoading(true);
            dispatch(resetDetail());
            const fetchData = async () => {
                try {
                    if (isEarlyRepayment) {
                        const response = await receiptCollectionHttpService.getDetail(`/v1/dbs/api/early-repayment/by-restructure/${id}`);
                        if (response?.data?.success && response?.data?.data && response?.data?.data.length > 0) {
                            const erId = response.data.data[0].id;
                            await dispatch(getDetailEarlyRepayment(erId));
                        }
                    } else {
                        await dispatch(getDetailRestructure(id));
                    }
                    await dispatch(getAllApprovalList());
                    await dispatch(getListCategory());
                } catch (e) {
                    console.error(e);
                } finally {
                    setLocalLoading(false);
                }
            };
            fetchData();
        }
    }, [dispatch, id, isEarlyRepayment]);

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
        if (selectedHierarchy) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        const approvalData = dataListAppHierDetail?.data || dataListAppHierDetail;
        if (approvalData && Array.isArray(approvalData) && approvalData.length > 0) {
            const mappedApproval = approvalData.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: (a.employeeDetail || []).map((b, idx) => ({
                    ...b,
                    key: idx + 1,
                })),
            }));
            setAppHierDataDetail(mappedApproval);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    useEffect(() => {
        if (data_detail) {
            if (data_detail.restructure) {
                const res = data_detail.restructure;
                setDataHeader(res);
                setSelectedHierarchy(res.appHierId);
                
                // Map data to match the UI requirements
                setOpenItems(data_detail.badDebtList || []);
                setContacts(data_detail.restructure?.contactList || []);
                
                // Map calculationList to installmentsByCurrency format
                const calc = data_detail.calculationList || [];
                const groupedCalc = calc.reduce((acc, curr) => {
                    const cur = curr.currency || "IDR";
                    if (!acc[cur]) acc[cur] = [];
                    acc[cur].push({
                        key: curr.key || curr.id,
                        periode: curr.periode,
                        amount: curr.amount
                    });
                    return acc;
                }, {});
                setInstallmentsByCurrency(groupedCalc);

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
            if (data_detail.earlyRepayment) {
                const er = data_detail.earlyRepayment;
                setSelectedHierarchy(er.appHierId);

                const dataAttachment = (data_detail?.attachmentDtoList || []).map(
                    (item) => ({
                        ...item,
                        createdDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "",
                        dataType: "exist",
                    })
                );
                setListDataAttachment(dataAttachment);

                form.setFieldsValue({
                    apphierId: er.appHierId
                });
            }
        }
    }, [data_detail, form]);

    const renderOpenItems = () => {
        const grouped = openItems.reduce((acc, item) => {
            const cur = item.currency || "IDR";
            if (!acc[cur]) acc[cur] = [];
            acc[cur].push(item);
            return acc;
        }, {});

        const currencies = Object.keys(grouped);
        if (currencies.length === 0) return <DetailText label="">No data available</DetailText>;

        return currencies.map(currency => {
            const rows = grouped[currency];
            const isIdr = currency === "IDR";
            const total = rows.reduce((sum, r) => {
                const num = parseFloat(String(r.totalAmount || r.amount).replace(/,/g, "")) || 0;
                return sum + num;
            }, 0);

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, render: (_, __, i) => i + 1 },
                { title: "INVOICE NO", dataIndex: "invoiceNo" },
                { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
                { title: "ALLOCATION", dataIndex: "allocation" },
                { 
                    title: "AMOUNT", 
                    dataIndex: "amount", 
                    align: "right",
                    render: (amount) => {
                        const num = parseFloat(String(amount).replace(/,/g, "")) || 0;
                        return num.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 });
                    }
                },
            ];

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
                            idTable={`open-item-detail-${currency}`}
                            dataSource={rows}
                            columns={columns}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                        />
                        <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                            <div className="flex-[4] text-center">TOTAL</div>
                            <div className="flex-1 text-right pr-4">
                                {total.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </SectionCard>
                </div>
            );
        });
    };

    const renderPaymentPlanDetail = () => {
        const currencies = Object.keys(installmentsByCurrency);
        if (currencies.length === 0) return <DetailText label="">No data available</DetailText>;

        return currencies.map(currency => {
            const rows = installmentsByCurrency[currency] || [];
            const isIdr = currency === "IDR";
            const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, align: "center", render: (_, __, i) => i + 1 },
                { title: "PERIODE", dataIndex: "periode" },
                {
                    title: "TOTAL AMOUNT",
                    dataIndex: "amount",
                    align: "right",
                    render: (val) => (parseFloat(val) || 0).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })
                },
            ];

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        <TableRBI
                            idTable={`plan-detail-view-${currency}`}
                            dataSource={rows}
                            columns={columns}
                            usePagination={false}
                            showAdvanceSearch={false}
                            showSearchBar={false}
                        />
                        <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                            <div className="flex-[2] text-center">TOTAL</div>
                            <div className="flex-1 text-right pr-4">
                                {currentSum.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </SectionCard>
                </div>
            );
        });
    };

    // Renderers are now imported from separate component files to keep the main file modular and highly readable.

    const isShowButton = data_detail?.tApprovalDto?.isApprover;

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        { path: "", breadcrumbName: "Bad Debt and Collection" },
        { path: DEBT_AND_COLLECTION_ROUTES.VIEW_RESTRUCTURE, breadcrumbName: "Payment Plan" },
        { path: "", breadcrumbName: "Detail Payment Plan" },
    ];

    const handleConfirm = (res, handleClear) => {
        const body = {
            id: isEarlyRepayment ? (data_detail?.earlyRepayment?.id || id) : id,
            remark: res.remark,
            approvalId: data_detail?.tApprovalDto?.tAppId,
            action: approveOrReject.toUpperCase(),
            category: isEarlyRepayment ? "EARLY_REPAYMENT_RESTRUCTURE" : "RESTRUCTURE",
        };

        dispatch(approveOrRejectRestructure({ body })).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                message.success(`Successfully ${approveOrReject}ed!`);
                if (onRefresh) onRefresh();
                if (isEmbedded) {
                    onClose();
                } else {
                    navigate(-1);
                }
            }
        });
        handleClear();
        setModalApprove(false);
    };

    return (
        <Spin spinning={localLoading || loading}>
            {!isEmbedded && <BreadCrumb routes={routes} />}
            
            {isEarlyRepayment ? (
                <DetailEarlyRepayment
                    isEmbedded={isEmbedded}
                    segmentedPage={segmentedPage}
                    setSegmentedPage={setSegmentedPage}
                    dataHeader={dataHeader}
                    data_detail={data_detail}
                    contacts={contacts}
                    contactColumns={contactColumns}
                    expandable={expandable}
                    appHierDataDetail={appHierDataDetail}
                    appHierOptions={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                    setSelectedHierarchy={setSelectedHierarchy}
                    approvalName={approvalName}
                    listDataAttachment={listDataAttachment}
                    setListDataAttachment={setListDataAttachment}
                    dispatch={dispatch}
                    renderOpenItems={renderOpenItems}
                    getListCategory={getListCategory}
                    receiptCollectionHttpService={receiptCollectionHttpService}
                    configApp={configApp}
                />
            ) : (
                <DetailPaymentPlan
                    isEmbedded={isEmbedded}
                    segmentedPage={segmentedPage}
                    setSegmentedPage={setSegmentedPage}
                    dataHeader={dataHeader}
                    contacts={contacts}
                    contactColumns={contactColumns}
                    expandable={expandable}
                    appHierDataDetail={appHierDataDetail}
                    appHierOptions={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                    setSelectedHierarchy={setSelectedHierarchy}
                    approvalName={approvalName}
                    listDataAttachment={listDataAttachment}
                    setListDataAttachment={setListDataAttachment}
                    renderOpenItems={renderOpenItems}
                    renderPaymentPlanDetail={renderPaymentPlanDetail}
                    dispatch={dispatch}
                    getListCategory={getListCategory}
                    receiptCollectionHttpService={receiptCollectionHttpService}
                    configApp={configApp}
                />
            )}

            <div className="flex justify-between items-center bg-white p-4 rounded-lg mt-5 drop-shadow-lg">
                <ButtonComponent
                    type="submit"
                    variant="outlined"
                    onClick={() => (isEmbedded ? onClose() : navigate(-1))}
                >
                    Cancel
                </ButtonComponent>

                {isShowButton && (
                    <div className="flex gap-4">
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

            <ModalApproveOrReject
                isOpen={modalApprove}
                handleCloseModal={() => setModalApprove(false)}
                onFinish={handleConfirm}
                header={approveOrReject === "approve" ? "Approve" : "Reject"}
                approveOrReject={approveOrReject}
                menu="Restructure"
                named={dataHeader?.id}
            />
        </Spin>
    );
};

export default ListDetailRestructure;
