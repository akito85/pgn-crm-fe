import { Tabs, Spin, Form } from "antd";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import {
  getDetailTransferToReceipt,
  approveOrRejectTransferToReceipt,
  getListCategory,
  getAllApprovalList,
  getListApprovalById
} from "../../../../../redux/slices/receipt_collection/transferToReceipt";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailTransferToReceipt from "./DetailTransferToReceipt";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import TableRBI from "../../../../../components/TableRBI";
import { getReceiptListColumns } from "./ReceiptListColumns";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailWarrantyInformation from "./DetailWarrantyInformation";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import FooterDetail from "../../../../../components/FooterDetail";
import SubSectionCard from "../../../../../components/SubSectionCard";

const ListDetailTransferToReceipt = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const id = location?.state?.id;
    const {
        loading,
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail
    } = useSelector((state) => state.transferToReceipt);

    const [activeTab, setActiveTab] = useState("transfer");
    const [modalApprove, setModalApprove] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);

    // Table state 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    useEffect(() => {
        if (id) {
            dispatch(getDetailTransferToReceipt(id));
            dispatch(getAllApprovalList());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (data_detail && data_detail.transferToReceipt?.appHierId) {
            setSelectedHierarchy(data_detail.transferToReceipt.appHierId);
            form.setFieldsValue({ apphierId: data_detail.transferToReceipt.appHierId });
        }

        if (data_detail) {
            const dataAttachment = (data_detail?.attachmentDtoList || []).map(
                (item) => {
                    return {
                        id: item.id,
                        size: item.size,
                        fileName: item.fileName,
                        fileSize: item.fileSize,
                        fileType: item.fileType,
                        fileCategoryId: item.fileCategoryId,
                        fileCategoryName: item.fileCategoryName,
                        pathFile: item.pathFile,
                        urlFile1: item.urlFile1,
                        urlFile2: item.urlFile2,
                        createdBy: item.createdBy,
                        createdDate: item.createdDate
                            ? moment(item.createdDate).format("DD MMM YYYY")
                            : "",
                        dataType: "exist",
                    };
                }
            );
            setListDataAttachment(dataAttachment);
        }
    }, [data_detail, form]);

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

    const columnsReceipt = useMemo(() => {
        return getReceiptListColumns({
            page,
            pageSize,
            actionType: "none",
        });
    }, [page, pageSize]);

    const onChangePage = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const items = [
        {
            key: "transfer",
            label: "Transfer to Receipt",
            children: (
                <div className="p-5">
                    <DetailTransferToReceipt data_detail={data_detail?.transferToReceipt} />
                </div>
            ),
        },
        {
            key: "attachment",
            label: "Attachment",
            children: (
                <div className="p-5">
                    <SubSectionCard title="ATTACHMENT INFORMATION">
                        <AttachmentComponent
                            type={"detail"}
                            data={listDataAttachment}
                            updateData={setListDataAttachment}
                            typeSelector="transferToReceipt"
                            dispatch={dispatch}
                            getAPICategory={getListCategory}
                            service={receiptCollectionHttpService}
                            configApplication={configApp.PAYMENT_SERVICE}
                        />
                    </SubSectionCard>
                </div>
            ),
        },
    ];

    const isShowButton = data_detail?.tApprovalDto?.isApprover;

    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: "",
            breadcrumbName: "Payment Warranty",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_RECEIPT,
            breadcrumbName: "Transfer to Receipt",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_TRANSFER_TO_RECEIPT,
            breadcrumbName: "Detail Transfer to Receipt",
        },
    ];

    const handleConfirm = (res, handleClear) => {
        const data = {
            id: id,
            remark: res.remark,
            approvalId: data_detail?.tApprovalDto?.tAppId,
            action: approveOrReject.toUpperCase(),
        };

        dispatch(approveOrRejectTransferToReceipt({ body: data }));
        handleClear();
        setModalApprove(false);
    };

    const handleCancel = () => {
        setModalApprove(false);
    };

    return (
        <Spin spinning={loading}>
            <BreadCrumb routes={routes} />
            
            <CardContainerNoBorder
                header="TRANSFER TO RECEIPT DETAIL"
                className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                noPadding
                collapsible={true}
                defaultExpanded={true}
            >
                <div className="full-width-tabs">
                    <Tabs
                        activeKey={activeTab}
                        items={items}
                        onChange={handleTabChange}
                        className="custom-tabs-layout"
                    />
                </div>
            </CardContainerNoBorder>

            <CardContainerNoBorder
                header="GUARANTEE DETAIL"
                className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                noPadding
                collapsible={true}
                defaultExpanded={true}
            >
               <div className="p-5">
                    <DetailWarrantyInformation data_detail={data_detail?.transferToReceipt} />
               </div>
            </CardContainerNoBorder>

            <CardContainerNoBorder
                header="RECEIPT INFORMATION"
                className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
                noPadding
                collapsible={true}
                defaultExpanded={true}
            >
                <div className="p-5">
                    <SubSectionCard>
                        <TableRBI
                            columns={columnsReceipt}
                            dataSource={IndexReceipt(data_detail?.transferToReceipt?.receiptList || [], page, pageSize).slice((page - 1) * pageSize, page * pageSize)}
                            pagination={false}
                            tableScrolled={{ x: 1000 }}
                            current={page}
                            pageSize={pageSize}
                            totalData={data_detail?.transferToReceipt?.receiptList?.length || 0}
                            onChange={onChangePage}
                            onSizeChanger={onChangePage}
                        />
                    </SubSectionCard>
                </div>
            </CardContainerNoBorder>

            <LogHistoryInfo
                data={{
                    recordId: data_detail?.transferToReceipt?.id || "-",
                    createdDate: data_detail?.transferToReceipt?.createdDate ? moment(data_detail?.transferToReceipt?.createdDate).format("DD MMM YYYY HH:mm:ss") : "-",
                    createdBy: data_detail?.transferToReceipt?.createdBy || "-",
                    updatedDate: data_detail?.transferToReceipt?.updatedDate ? moment(data_detail?.transferToReceipt?.updatedDate).format("DD MMM YYYY HH:mm:ss") : "-",
                    updatedBy: data_detail?.transferToReceipt?.updatedBy || "-"
                }}
            />

            <FooterDetail
                onCancel={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_RECEIPT)}
                showApproval={isShowButton === true}
                onApprove={() => {
                    setApproveOrReject("approve");
                    setModalApprove(true);
                }}
                onReject={() => {
                    setApproveOrReject("reject");
                    setModalApprove(true);
                }}
            />

            <ModalApproveOrReject
                isOpen={modalApprove}
                handleCloseModal={handleCancel}
                onFinish={handleConfirm}
                header={approveOrReject === "approve" ? "Approve" : "Reject"}
                approveOrReject={approveOrReject}
                menu={"Transfer To Receipt"}
                named={data_detail?.transferToReceipt?.id}
            />
        </Spin>
    );
};

const IndexReceipt = (data, page, pageSize) => {
    return data.map((item, index) => {
        return {
            ...item,
            key: index,
            no: (page - 1) * pageSize + index + 1
        }
    })
}

export default ListDetailTransferToReceipt;
