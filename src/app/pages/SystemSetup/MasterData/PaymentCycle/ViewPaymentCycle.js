
import { Spin, Tag, Tabs } from "antd";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";
import BreadCrumb from "../../../../../components/BreadCrumb";
import CardContainer from "../../../../../components/CardContainer";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import FooterDetail from "../../../../../components/FooterDetail";
import {
    getDetailPaymentCycle,
    approveOrRejectPaymentCycle,
    approveOrRejectInactivePaymentCycle,
} from "../../../../../redux/slices/receipt_collection/paymentCycle";
import { dateFormatting } from "../../../../../utils";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrRejectV2";
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
        { label: "Payment Cycle", key: "Payment Cycle" },
        { label: "Attachment", key: "Attachment" }
    ];

    const {
        loading,
        data_detail,
    } = useSelector((state) => state.paymentCycle);

    const showButtonApproval = !!data_detail?.tApprovalDto?.isApprover;

    const [activeTab, setActiveTab] = useState("Payment Cycle");
    const [modalAction, setModalAction] = useState({ open: false, type: "" });
    const [loadingConfirm, setLoadingConfirm] = useState(false);

    // Initial Fetch
    useEffect(() => {
        if (id) {
            dispatch(getDetailPaymentCycle(id));
        }
    }, [dispatch, id]);

    const detail = data_detail?.paymentCycleDetail || {};
    const attachments = (data_detail?.attachmentList || []).map((item) => ({
        ...item,
        dataType: "exist",
    }));


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
        setLoadingConfirm(true);
        const body = {
            id: id,
            action: modalAction.type.toUpperCase(),
            remark: values.remark,
            approvalId: detail.approvalId
        };

        const isInactive = detail.status?.toUpperCase() === "ACTIVE";
        const thunk = isInactive ? approveOrRejectInactivePaymentCycle : approveOrRejectPaymentCycle;

        dispatch(thunk(body))
            .unwrap()
            .then(() => {
                handleClear();
                handleCloseModal();
                setLoadingConfirm(false);
                dispatch(showModalSuccess({
                    title: "Success",
                    description: `Payment Cycle ${modalAction.type}d successfully`,
                    return: false,
                }));
                navigate("/system-setup/payment-cycle");
            })
            .catch((err) => {
                handleCloseModal();
                setLoadingConfirm(false);
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

    const renderAttachmentInfo = () => (
        <CardContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
                type={"detail"}
                data={attachments}
                updateData={() => { }}
                typeSelector="paymentCycle"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
            />
        </CardContainer>
    );

    const renderSection = (key) => {
        switch (key) {
            case "Payment Cycle":
                return renderPaymentCycleInfo();
            case "Attachment":
                return renderAttachmentInfo();
            default:
                return <></>;
        }
    };

    return (
        <>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    items={items.map(item => ({
                        label: item.label,
                        key: item.key,
                        children: renderSection(item.key)
                    }))}
                />

                <FooterDetail
                    onCancel={handleBack}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    showApproval={showButtonApproval}
                />

                <ModalApproveOrReject
                    isOpen={modalAction.open}
                    handleCloseModal={handleCloseModal}
                    onFinish={handleSubmitDecision}
                    approveOrReject={modalAction.type}
                    header={modalAction.type}
                    menu="Payment Cycle"
                    named={detail.periodName}
                    loading={loadingConfirm}
                />
            </Spin>
        </>
    );
};

export default ViewPaymentCycle;
