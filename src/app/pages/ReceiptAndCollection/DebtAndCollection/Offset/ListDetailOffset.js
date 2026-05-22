import { LeftOutlined } from "@ant-design/icons";
import { Spin, message, Form } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";
import { getDetailOffset, resetDetail, approveOrRejectOffset, getListCategory, getListApprovalById } from "../../../../../redux/slices/receipt_collection/offset";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import GridLayout from "../../../../../components/GridLayout";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";


const ListDetailOffset = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { id } = location?.state || {};
    const [form] = Form.useForm();

    const { data_detail, loading, dataListAppHierDetail } = useSelector((state) => state.offset);

    const [valuePage, setValuePage] = useState("Offset");
    const [modalApprove, setModalApprove] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const [listDataAttachment, setListDataAttachment] = useState([]);

    const tabData = [{ value: "Offset" }, { value: "Approval" }, { value: "Attachment" }];

    useEffect(() => {
        if (id) {
            dispatch(getDetailOffset(id));
            dispatch(getListCategory());
        }
        return () => dispatch(resetDetail());
    }, [dispatch, id]);

    useEffect(() => {
        if (data_detail?.offset?.appHierId) {
            dispatch(getListApprovalById({ id: data_detail.offset.appHierId }));
        }
        if (data_detail?.attachmentDtoList) {
            const dataAttachment = (data_detail.attachmentDtoList || []).map(
                (item) => ({
                    ...item,
                    createdDate: item.createdDate ? moment(item.createdDate).format("DD MMM YYYY") : "",
                    dataType: "exist",
                })
            );
            setListDataAttachment(dataAttachment);
        }
    }, [dispatch, data_detail]);

    const offset = data_detail?.offset || {};

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        { path: "", breadcrumbName: "Bad Debt and Collection" },
        { path: DEBT_AND_COLLECTION_ROUTES.VIEW_OFFSET, breadcrumbName: "Offset" },
        { path: "", breadcrumbName: "Detail Offset" },
    ];

    const isShowButton = data_detail?.tApprovalDto?.isApprover;

    const handleConfirm = (vals, handleClearModal) => {
        const body = {
            id: id,
            remark: vals.remark,
            approvalId: data_detail?.tApprovalDto?.tAppId,
            action: approveOrReject.toUpperCase(),
        };

        dispatch(approveOrRejectOffset({ body })).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                message.success(`Successfully ${approveOrReject}ed!`);
                navigate(-1);
            }
        });
        handleClearModal();
        setModalApprove(false);
    };

    return (
        <>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>
                <div className="mt-5">
                    <RadioTabs data={tabData} onChange={(e) => setValuePage(e.target.value)} currentPosition={valuePage} className="mb-5" />

                    <div style={{ display: valuePage !== "Offset" ? "none" : "block" }}>
                        <div className="flex flex-col gap-5">
                            <BaseContainer header={"CUSTOMER INFORMATION"}>
                                <GridLayout cols={3} className="p-4">
                                    <DetailText label="Customer Number">{offset.customerNumber}</DetailText>
                                    <DetailText label="Account Number">{offset.accountNumber}</DetailText>
                                    <DetailText label="Customer Name">{offset.customerName}</DetailText>
                                    <DetailText label="Area Code">{offset.areaCode}</DetailText>
                                    <DetailText label="Area Name">{offset.areaName}</DetailText>
                                    <DetailText label="Segment">{offset.segment}</DetailText>
                                </GridLayout>
                            </BaseContainer>

                            <BaseContainer header={"OFFSET INFORMATION"}>
                                <div className="p-4">
                                    <GridLayout cols={3} className="mb-5">
                                        <DetailText label="Customer Number">{offset.customerNumber}</DetailText>
                                        <DetailText label="Account Number">{offset.accountNumber}</DetailText>
                                        <DetailText label="Customer Name">{offset.customerName}</DetailText>
                                        <DetailText label="Area">{offset.areaName}</DetailText>
                                        <DetailText label="Segment">{offset.segment}</DetailText>
                                    </GridLayout>

                                    <GridLayout cols={3} className="mb-5">
                                        <DetailText label="Reference">{offset.reference}</DetailText>
                                        <DetailText label="Reference Currency">{offset.referenceCurrency}</DetailText>
                                        <DetailText label="Amount">{offset.amount?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</DetailText>
                                        <DetailText label="Rate">{offset.rate?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</DetailText>
                                        <DetailText label="Rate Date">{offset.rateDate ? moment(offset.rateDate).format("DD MMM YYYY") : "-"}</DetailText>
                                        <DetailText label="Rate Type">{offset.rateType}</DetailText>
                                        <DetailText label="Equivalent Amount">{offset.equivalentAmount?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</DetailText>
                                        <DetailText label="Offset Date">{offset.offsetDate ? moment(offset.offsetDate).format("DD MMM YYYY") : "-"}</DetailText>
                                    </GridLayout>

                                    <DetailText label="Description">{offset.description}</DetailText>
                                </div>
                            </BaseContainer>

                            <HistoryLog
                                recordId={offset.id}
                                createdDate={offset.createdDate && moment(offset.createdDate).format("DD MMM YYYY HH:mm")}
                                createdBy={offset.createdBy}
                                updatedDate={offset.updatedDate && moment(offset.updatedDate).format("DD MMM YYYY HH:mm")}
                                updatedBy={offset.updatedBy}
                            />
                        </div>
                    </div>

                    <div style={{ display: valuePage !== "Approval" ? "none" : "block" }}>
                        <BaseContainer header={"APPROVAL HIERARCHY"}>
                            <Form form={form}>
                                <ApprovalComponentGeneral showSelect={false} disableSelect={true} dataTable={dataListAppHierDetail || []} />
                            </Form>
                        </BaseContainer>
                    </div>

                    <div style={{ display: valuePage !== "Attachment" ? "none" : "block" }}>
                        <BaseContainer header={"ATTACHMENT LIST"}>
                            <AttachmentComponent
                                type="detail"
                                data={listDataAttachment}
                                typeSelector="offset"
                                dispatch={dispatch}
                                getAPICategory={getListCategory}
                                service={receiptCollectionHttpService}
                                configApplication={configApp.PAYMENT_SERVICE}
                            />
                        </BaseContainer>
                    </div>

                    <div className="flex justify-between mt-5 mb-10 pb-5">
                        <ButtonComponent type="primary" onClick={() => navigate(-1)} icon={<LeftOutlined />}>Back</ButtonComponent>
                        {isShowButton && (
                            <div className="flex gap-3">
                                <ButtonComponent type="reject" onClick={() => { setApproveOrReject("reject"); setModalApprove(true); }}>Reject</ButtonComponent>
                                <ButtonComponent type="approve" onClick={() => { setApproveOrReject("approve"); setModalApprove(true); }}>Approve</ButtonComponent>
                            </div>
                        )}
                    </div>
                </div>
            </Spin>

            <ModalApproveOrReject
                isOpen={modalApprove}
                handleCloseModal={() => setModalApprove(false)}
                onFinish={handleConfirm}
                header={approveOrReject}
                approveOrReject={approveOrReject}
                menu={"Offset"}
                named={offset.id}
            />
        </>
    );
};

const HistoryLog = ({ recordId, createdDate, createdBy, updatedDate, updatedBy }) => {
    return (
        <BaseContainer header={"HISTORY LOG INFORMATION"}>
            <GridLayout cols={5} className="p-4">
                <DetailText label={"Record Id"}>{recordId || ""}</DetailText>
                <DetailText label={"Created Date"}>{createdDate || ""}</DetailText>
                <DetailText label={"Created By"}>{createdBy || ""}</DetailText>
                <DetailText label={"Updated Date"}>{updatedDate || ""}</DetailText>
                <DetailText label={"Updated By"}>{updatedBy || ""}</DetailText>
            </GridLayout>
        </BaseContainer>
    );
};

export default ListDetailOffset;
