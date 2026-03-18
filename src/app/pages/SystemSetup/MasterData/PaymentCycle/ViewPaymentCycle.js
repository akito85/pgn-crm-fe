
import { Spin, Tag, Tabs } from "antd";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import {
    getDetailPaymentCycle,
    approveOrRejectPaymentCycle,
    getListApprovalById,
    getAllApprovalList
} from "../../../../../redux/slices/receipt_collection/paymentCycle";
import { dateFormatting } from "../../../../../utils";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { showModalSuccess, showModalError } from "../../../../../redux/slices/general_slice";

const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
        case "ACTIVE": return "green";
        case "INACTIVE": return "red";
        default: return "default";
    }
};

const getApprovalStatusColor = (status) => {
    const s = status?.toUpperCase();
    if (s === "APPROVED") return "green";
    if (s === "REJECTED") return "red";
    if (s?.includes("WAITING")) return "orange";
    return "blue";
};

const ViewPaymentCycle = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const items = [
        { label: "Detail", key: "Payment Cycle" },
        { label: "Approval", key: "Approval" },
        { label: "Attachment", key: "Attachment" }
    ];

    const {
        loading,
        data_detail,
        dataListAppHierDetail,
        dataListAppHierId
    } = useSelector((state) => state.paymentCycle);

    const showButtonApproval = !!data_detail?.tApprovalDto?.isApprover;

    const [setActiveTab] = useState("Payment Cycle");
    const [modalAction, setModalAction] = useState({ open: false, type: "" });
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [approvalName, setApprovalName] = useState("");

    // Initial Fetch
    useEffect(() => {
        if (id) {
            dispatch(getDetailPaymentCycle(id));
            dispatch(getAllApprovalList());
        }
    }, [dispatch, id]);

    const detail = data_detail?.paymentCycleDetail || {};
    const attachments = data_detail?.attachmentList || [];

    // Fetch Approval Hierarchy Detail
    useEffect(() => {
        if (detail.appHierId) {
            dispatch(getListApprovalById({ id: detail.appHierId }));
        }
    }, [dispatch, detail.appHierId]);

    // Format Approval Data
    useEffect(() => {
        if (dataListAppHierDetail?.length > 0) {
            const mappedDetail = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail.map((b, idx) => ({
                    ...b,
                    key: idx + 1,
                })),
            }));
            setAppHierDataDetail(mappedDetail);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    // Get Approval Name
    useEffect(() => {
        if (dataListAppHierId?.length > 0 && detail.appHierId) {
            const found = dataListAppHierId.find(item => item.appHierId === detail.appHierId);
            if (found) {
                setApprovalName(found.approvalName);
            }
        }
    }, [dataListAppHierId, detail.appHierId]);


    // Breadcrumbs
    const routes = [
        {
            path: "/",
            breadcrumbName: "System Setup",
        },
        {
            path: "/system-setup",
            breadcrumbName: "Master Data",
        },
        {
            path: "/system-setup/payment-cycle",
            breadcrumbName: "Payment Cycle",
        },
        {
            path: "",
            breadcrumbName: "Detail Payment Cycle",
        },
    ];

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handleApprove = () => setModalAction({ open: true, type: "Approve" });
    const handleReject = () => setModalAction({ open: true, type: "Reject" });
    const handleCloseModal = () => setModalAction({ ...modalAction, open: false });

    const handleSubmitDecision = (values, handleClear) => {
        const body = {
            id: id,
            action: modalAction.type.toUpperCase(),
            remark: values.remark,
            approvalId: detail.approvalId
        };

        dispatch(approveOrRejectPaymentCycle(body))
            .unwrap()
            .then(() => {
                handleClear();
                handleCloseModal();
                dispatch(showModalSuccess({
                    title: "Success",
                    description: `Payment Cycle ${modalAction.type}d successfully`
                }));
                navigate("/system-setup/payment-cycle");
            })
            .catch((err) => {
                handleCloseModal();
                dispatch(showModalError({ title: "Failed", description: err.message || "An error occurred" }));
            });
    };

    const renderPaymentCycleInfo = () => (
        <div>
            <DetailSection header={"PAYMENT CYCLE INFORMATION"}>
                <div className="w-full grid grid-cols-4 gap-4">
                    <DetailText label="Period">{detail.periodName}</DetailText>
                    <DetailText label="Time Unit">{detail.timeUnit}</DetailText>
                    <DetailText label="Begin Cycle">{detail.beginCycle}</DetailText>
                    <DetailText label="End Cycle">{detail.endCycle}</DetailText>
                    <DetailText label="Start Date">
                        {detail.startDate
                            ? moment(detail.startDate).format(dateFormatting.dateCapital)
                            : ""}
                    </DetailText>
                    <DetailText label="End Date">
                        {detail.endDate
                            ? moment(detail.endDate).format(dateFormatting.dateCapital)
                            : ""}
                    </DetailText>
                    <DetailText label="Status">
                        <Tag color={getStatusColor(detail.status)}>
                            {detail.status}
                        </Tag>
                    </DetailText>
                    <DetailText label="Status Approval">
                        <Tag color={getApprovalStatusColor(detail.statusApproval)}>
                            {detail.statusApproval}
                        </Tag>
                    </DetailText>
                    <DetailText label="Status Open">
                        {detail.statusOpen}
                    </DetailText>
                    <div className="col-span-4">
                        <DetailText label="Description">
                            {detail.description}
                        </DetailText>
                    </div>
                </div>
            </DetailSection>

            <DetailSection header={"HISTORY LOG INFORMATION"}>
                <div className="w-full grid grid-cols-4 gap-4">
                    <DetailText label={"Record ID"}>{detail.id}</DetailText>
                    <DetailText label={"Created Date"}>
                        {detail.createdDate
                            ? moment(detail.createdDate).format("DD MMM YYYY HH:mm:ss")
                            : ""}
                    </DetailText>
                    <DetailText label={"Created By"}>{detail.createdBy}</DetailText>
                    <DetailText label={"Updated Date"}>
                        {detail.updatedDate
                            ? moment(detail.updatedDate).format("DD MMM YYYY HH:mm:ss")
                            : ""}
                    </DetailText>
                    <DetailText label={"Updated By"}>{detail.updatedBy}</DetailText>
                </div>
            </DetailSection>
        </div>
    );

    const renderApprovalInfo = () => (
        <DetailSection header={"APPROVAL INFORMATION"}>
            <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                selectedHierarchy={detail.appHierId}
                showSelect={false}
                disableSelect={true}
                approvalName={approvalName}
            />
        </DetailSection>
    );

    const renderAttachmentInfo = () => (
        <DetailSection header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
                type={"detail"}
                data={attachments}
                updateData={() => { }}
                typeSelector="paymentCycle"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
            />
        </DetailSection>
    );

    const renderSection = (key) => {
        switch (key) {
            case "Payment Cycle":
                return renderPaymentCycleInfo();
            case "Approval":
                return renderApprovalInfo();
            case "Attachment":
                return renderAttachmentInfo();
            default:
                return <></>;
        }
    };

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>
                <div>
                    <Tabs
                        defaultActiveKey="Payment Cycle"
                        onChange={handleTabChange}
                        items={items.map(item => ({
                            label: item.label,
                            key: item.key,
                            children: renderSection(item.key)
                        }))}
                    />
                </div>

                <div className="bg-white p-4 rounded-lg mt-4">
                    {showButtonApproval ? (
                        <div className="flex justify-between">
                            <ButtonComponent
                                type="default"
                                onClick={handleBack}
                            >
                                Cancel
                            </ButtonComponent>
                            <div className="flex gap-4">
                                <ButtonComponent
                                    className="!bg-[#d32f2f] !border-[#d32f2f] hover:!bg-[#b71c1c] !text-white"
                                    onClick={handleReject}
                                >
                                    Reject
                                </ButtonComponent>
                                <ButtonComponent
                                    className="!bg-[#388e3c] !border-[#388e3c] hover:!bg-[#2e7d32] !text-white"
                                    onClick={handleApprove}
                                >
                                    Approve
                                </ButtonComponent>
                            </div>
                        </div>
                    ) : (
                        <ButtonComponent
                            type="default"
                            onClick={handleBack}
                        >
                            Cancel
                        </ButtonComponent>
                    )}
                </div>

                <ModalApproveOrReject
                    isOpen={modalAction.open}
                    handleCloseModal={handleCloseModal}
                    onFinish={handleSubmitDecision}
                    approveOrReject={modalAction.type}
                    header={modalAction.type}
                    menu="Payment Cycle"
                    named={detail.periodName}
                />
            </Spin>
        </LayoutMenu>
    );
};

export default ViewPaymentCycle;
