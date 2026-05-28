import { LeftOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, message, Tabs, Spin, Table } from "antd";
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
    resetDetail,
    getOpenItemDetail,
    resetOpenItemDetail,
    getPaymentPlanDetail,
    resetPaymentPlanDetail
} from "../../../../../redux/slices/receipt_collection/restructure";
import ModalOpenItemDetail from "./Modal/ModalOpenItemDetail";
import ModalPaymentPlanDetail from "./Modal/ModalPaymentPlanDetail";
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
import DetailRePlan from "./DetailRePlan";
import DetailCancel from "./DetailCancel";

const ListDetailRestructure = ({ selectedId: propId, onClose, onRefresh, approvalType: propApprovalType, isApprover: propIsApprover }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [modalApprove, setModalApprove] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const [modalOpenItem, setModalOpenItem] = useState(false);
    const [modalPaymentPlan, setModalPaymentPlan] = useState(false);
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
        dataListAppHierDetail,
        openItemDetail,
        loadingOpenItemDetail,
        paymentPlanDetail,
        loadingPaymentPlanDetail
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
    const [refreshedOpenItems, setRefreshedOpenItems] = useState(null);
    const [isUpdateActive, setIsUpdateActive] = useState(false);
    const [evaluationData, setEvaluationData] = useState(null);

    const approvalName = (dataListAppHierId || []).find(x => x.appHierId === data_detail?.restructure?.appHierId)?.approvalName || dataHeader?.approvalName || dataHeader?.appHierId || "";

    const isApprover = propIsApprover || location?.state?.isApprover || false;
    const approvalType = propApprovalType || location?.state?.approvalType || data_detail?.tApprovalDto?.category;
    const isEarlyRepayment = (approvalType === "EARLY_REPAYMENT_RESTRUCTURE");
    const isRePlan = (approvalType === "REPLAN_RESTRUCTURE");
    const isCancel = (approvalType === "CANCEL_RESTRUCTURE");

    const handleBack = () => {
        if (isEmbedded && onClose) {
            onClose();
        } else {
            navigate(-1);
        }
    };

    const handleOpenItemDetail = (record) => {
        if (!record.key && !record.id) {
            message.error('Invalid record');
            return;
        }
        setModalOpenItem(true);
        dispatch(getOpenItemDetail(record.key || record.id));
    };

    const handleCloseOpenItemModal = () => {
        setModalOpenItem(false);
        dispatch(resetOpenItemDetail());
    };

    const handlePaymentPlanDetail = (record) => {
        if (!record.key && !record.id) {
            message.error('Invalid record');
            return;
        }
        setModalPaymentPlan(true);
        dispatch(getPaymentPlanDetail(record.key || record.id));
    };

    const handleClosePaymentPlanModal = () => {
        setModalPaymentPlan(false);
        dispatch(resetPaymentPlanDetail());
    };

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
                        amount: curr.amount,
                        dueDate: curr.dueDate,
                        balance: curr.balance,
                        detailCode: curr.detailCode,
                        status: curr.status
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

        const groupedRefreshed = refreshedOpenItems ? refreshedOpenItems.reduce((acc, item) => {
            const cur = item.currency || "IDR";
            if (!acc[cur]) acc[cur] = [];
            acc[cur].push(item);
            return acc;
        }, {}) : null;

        const currencies = Array.from(new Set([
            ...Object.keys(grouped),
            ...(groupedRefreshed ? Object.keys(groupedRefreshed) : [])
        ]));

        if (currencies.length === 0) return <DetailText label="">No data available</DetailText>;

        return currencies.map(currency => {
            const rows = grouped[currency] || [];
            const refreshedRows = groupedRefreshed ? (groupedRefreshed[currency] || []) : null;
            const isIdr = currency === "IDR";
            
            const total = rows.reduce((sum, r) => {
                const num = parseFloat(String(r.totalAmount || r.amount).replace(/,/g, "")) || 0;
                return sum + num;
            }, 0);

            const columns = [
                { title: "NO", dataIndex: "key", width: 50, render: (_, __, i) => i + 1 },
                { title: "INVOICE NO", dataIndex: "invoiceNo" },
                { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
                { title: "BILLING ITEM", dataIndex: "allocation" },
                { 
                    title: "AMOUNT", 
                    dataIndex: "amount", 
                    align: "right",
                    render: (amount) => {
                        const num = parseFloat(String(amount).replace(/,/g, "")) || 0;
                        return num.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 });
                    }
                },
                ...(!data_detail?.tApprovalDto?.isApprover ? [{
                    title: "ACTION",
                    dataIndex: "action",
                    width: 100,
                    align: "center",
                    render: (_, record) => (
                        <div className="flex justify-center items-center cursor-pointer" onClick={() => handleOpenItemDetail(record)}>
                            <SVGIcon name="IconDetail" width="20px" height="20px" color="#0075bf" />
                        </div>
                    )
                }] : [])
            ];

            const originalTable = (
                <TableRBI
                    idTable={`open-item-detail-${currency}`}
                    dataSource={rows}
                    columns={columns}
                    usePagination={false}
                    showAdvanceSearch={false}
                    showSearchBar={false}
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                                <Table.Summary.Cell index={0} colSpan={4} className="text-center font-bold">
                                    TOTAL
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                                    {total.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                </Table.Summary.Cell>
                                {!data_detail?.tApprovalDto?.isApprover && <Table.Summary.Cell index={2} />}
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            );

            let refreshedTable = null;
            if (refreshedRows) {
                const refreshedTotal = refreshedRows.reduce((sum, r) => {
                    const num = parseFloat(String(r.totalAmount || r.amount).replace(/,/g, "")) || 0;
                    return sum + num;
                }, 0);

                refreshedTable = (
                    <TableRBI
                        idTable={`open-item-refreshed-${currency}`}
                        dataSource={refreshedRows}
                        columns={columns}
                        usePagination={false}
                        showAdvanceSearch={false}
                        showSearchBar={false}
                        summary={() => (
                            <Table.Summary fixed>
                                <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                                    <Table.Summary.Cell index={0} colSpan={4} className="text-center font-bold">
                                        TOTAL
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                                        {refreshedTotal.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                    </Table.Summary.Cell>
                                    {!data_detail?.tApprovalDto?.isApprover && <Table.Summary.Cell index={2} />}
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                    />
                );
            }

            return (
                <div key={currency} className="mb-4">
                    <SectionCard title={`CURRENCY ${currency}`}>
                        {refreshedTable ? (
                            <div className="grid grid-cols-2 gap-6 w-full">
                                <SubSectionCard title="OPEN ITEM INFORMATION">
                                    {originalTable}
                                </SubSectionCard>
                                <SubSectionCard title="UPDATE OPEN ITEM INFORMATION">
                                    {refreshedTable}
                                </SubSectionCard>
                            </div>
                        ) : (
                            <SubSectionCard title="OPEN ITEM INFORMATION">
                                {originalTable}
                            </SubSectionCard>
                        )}
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
                { title: "DUE DATE", dataIndex: "dueDate", render: (val) => val ? moment(val).format("DD MMM YYYY") : "-" },
                { 
                    title: "BALANCE", 
                    dataIndex: "balance", 
                    align: "right",
                    render: (val) => (parseFloat(val) || 0).toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })
                },
                { title: "DETAIL CODE", dataIndex: "detailCode" },
                { 
                    title: "STATUS", 
                    dataIndex: "status",
                    render: (status) => <StatusComponent colour={status || "Draft"}>{status || "Draft"}</StatusComponent>
                },
                {
                    title: "ACTION",
                    dataIndex: "action",
                    width: 100,
                    align: "center",
                    render: (_, record) => (
                        <div className="flex justify-center items-center cursor-pointer" onClick={() => handlePaymentPlanDetail(record)}>
                            <SVGIcon name="IconDetail" width="20px" height="20px" color="#0075bf" />
                        </div>
                    )
                }
            ];

            const totalBalance = rows.reduce((sum, r) => sum + (parseFloat(r.balance) || 0), 0);

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
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                                        <Table.Summary.Cell index={0} colSpan={2} className="text-center font-bold">
                                            TOTAL
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                                            {currentSum.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2} />
                                        <Table.Summary.Cell index={3} className="text-right font-bold pr-4 text-gray-500">
                                            {totalBalance.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={4} colSpan={3} />
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
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
            ...(evaluationData || {})
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

    const handleRefreshOpenItem = () => {
        setLocalLoading(true);
        receiptCollectionHttpService.getDetail(`/v1/dbs/api/restructure/refresh-open-item/${id}`)
            .then((response) => {
                setLocalLoading(false);
                if (response?.success && response?.data) {
                    setRefreshedOpenItems(response.data);
                    setIsUpdateActive(true);
                    message.success("Open items refreshed successfully from ERP! Gap detected, Update Open Item is now enabled.");
                } else {
                    message.error("Failed to refresh open items.");
                }
            })
            .catch((err) => {
                setLocalLoading(false);
                console.error(err);
                message.error("Error refreshing open items.");
            });
    };

    const handleUpdateOpenItem = () => {
        if (refreshedOpenItems) {
            setOpenItems(refreshedOpenItems);
            setRefreshedOpenItems(null);
            setIsUpdateActive(false);
            message.success("Open items successfully updated to the latest refreshed list!");
        }
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
            ) : isRePlan ? (
                <DetailRePlan
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
                    renderPaymentPlanDetail={renderPaymentPlanDetail}
                    getListCategory={getListCategory}
                    receiptCollectionHttpService={receiptCollectionHttpService}
                    configApp={configApp}
                />
            ) : isCancel ? (
                <DetailCancel
                    isEmbedded={isEmbedded}
                    segmentedPage={segmentedPage}
                    setSegmentedPage={setSegmentedPage}
                    dataHeader={dataHeader}
                    data_detail={data_detail}
                    appHierDataDetail={appHierDataDetail}
                    appHierOptions={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                    setSelectedHierarchy={setSelectedHierarchy}
                    approvalName={approvalName}
                    listDataAttachment={listDataAttachment}
                    setListDataAttachment={setListDataAttachment}
                    dispatch={dispatch}
                    renderPaymentPlanDetail={renderPaymentPlanDetail}
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
                    data_detail={data_detail}
                    onRefreshOpenItem={handleRefreshOpenItem}
                    isUpdateActive={isUpdateActive}
                    onUpdateOpenItem={handleUpdateOpenItem}
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
                    openItems={openItems}
                    onEvaluationChange={setEvaluationData}
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

            <ModalOpenItemDetail
                isOpen={modalOpenItem}
                handleCancel={handleCloseOpenItemModal}
                data={openItemDetail}
                loading={loadingOpenItemDetail}
            />

            <ModalPaymentPlanDetail
                isOpen={modalPaymentPlan}
                handleCancel={handleClosePaymentPlanModal}
                data={paymentPlanDetail}
                loading={loadingPaymentPlanDetail}
            />
        </Spin>
    );
};

export default ListDetailRestructure;
