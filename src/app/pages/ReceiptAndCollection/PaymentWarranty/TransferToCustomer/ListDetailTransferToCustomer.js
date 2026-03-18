import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../components/RadioTabs";
import {
    getDetailTransferToCustomer,
    approveOrRejectTransferToCustomer,
    getListCategory,
    getAllApprovalList,
    getListApprovalById
} from "../../../../../redux/slices/receipt_collection/transferToCustomer";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailTransferToCustomer from "./DetailTransferToCustomer";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import TableRBI from "../../../../../components/TableRBI";
import { getCustomerListColumns } from "./CustomerListColumns";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailWarrantyInformation from "./DetailWarrantyInformation";
import GridLayout from "../../../../../components/GridLayout";
import DetailText from "../../../../../components/DetailText";

const ListDetailTransferToCustomer = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [modalApprove, setModalApprove] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const id = location?.state?.id;
    const [dataHeader, setDataHeader] = useState({});
    const [listDataAttachment, setListDataAttachment] = useState([]);

    // Tabs
    const [tabData] = useState([
        { value: "Transfer to Customer" },
        { value: "Approval" },
        { value: "Attachment" },
    ]);

    const {
        loading,
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail
    } = useSelector((state) => state.transferToCustomer);

    const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);

    // Table state 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleSegmentedPage = (e) => {
        setSegmentedPage(e.target.value);
    };

    useEffect(() => {
        if (id) {
            dispatch(getDetailTransferToCustomer(id));
            dispatch(getAllApprovalList());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (data_detail && data_detail.transferToCustomer?.appHierId) {
            setSelectedHierarchy(data_detail.transferToCustomer.appHierId);
            form.setFieldsValue({ apphierId: data_detail.transferToCustomer.appHierId });
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
            setDataHeader(data_detail.transferToCustomer);
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

    const columnsCustomer = useMemo(() => {
        return getCustomerListColumns({
            page,
            pageSize,
            actionType: "none",
        });
    }, [page, pageSize]);

    const onChangePage = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const renderSection = (segmentedPage) => {
        switch (segmentedPage) {
            case "Transfer to Customer":
                return (
                    <>
                        <DetailTransferToCustomer data_detail={dataHeader} />
                        <div className="mt-5">
                            <DetailWarrantyInformation data_detail={dataHeader} />
                        </div>
                        <div className="mt-5">
                            <BaseContainer header={"TO CUSTOMER LIST INFORMATION"}>
                                <TableRBI
                                    columns={columnsCustomer}
                                    dataSource={IndexCustomer(dataHeader?.customerList || [], page, pageSize).slice((page - 1) * pageSize, page * pageSize)}
                                    pagination={false}
                                    tableScrolled={{ x: 1000 }}
                                    current={page}
                                    pageSize={pageSize}
                                    totalData={dataHeader?.customerList?.length || 0}
                                    onChange={onChangePage}
                                    onSizeChanger={onChangePage}
                                />
                            </BaseContainer>
                        </div>
                        <div className="mt-5">
                            <HistoryLog
                                recordId={dataHeader?.id}
                                createdDate={
                                    dataHeader?.createdDate &&
                                    moment(dataHeader?.createdDate).format(
                                        "DD MMM YYYY HH:mm"
                                    )
                                }
                                createdBy={dataHeader?.createdBy}
                                updatedDate={
                                    dataHeader?.updatedDate &&
                                    moment(dataHeader?.updatedDate).format(
                                        "DD MMM YYYY HH:mm"
                                    )
                                }
                                updatedBy={dataHeader?.updatedBy}
                            />
                        </div>
                    </>
                );
            case "Approval":
                return (
                    <div className="mt-5">
                        <BaseContainer header={"TRANSFER TO CUSTOMER APPROVAL"}>
                            <Form form={form}>
                                <ApprovalComponentGeneral
                                    dataTable={appHierDataDetail}
                                    dataOption={appHierOptions}
                                    selectedHierarchy={selectedHierarchy}
                                    updateSelectedHierarchy={setSelectedHierarchy}
                                    disableSelect={true}
                                />
                            </Form>
                        </BaseContainer>
                    </div>
                );
            case "Attachment":
                return (
                    <BaseContainer header={"ATTACHMENT INFORMATION"}>
                        <AttachmentComponent
                            type={"detail"}
                            data={listDataAttachment}
                            updateData={setListDataAttachment}
                            typeSelector="transferToCustomer"
                            dispatch={dispatch}
                            getAPICategory={getListCategory}
                            service={receiptCollectionHttpService}
                            configApplication={configApp.PAYMENT_SERVICE}
                        />
                    </BaseContainer>
                );
            default:
                return <></>;
        }
    };

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
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_CUSTOMER,
            breadcrumbName: "Transfer to Customer",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_TRANSFER_TO_CUSTOMER,
            breadcrumbName: "Detail Transfer to Customer",
        },
    ];

    const handleConfirm = (res, handleClear) => {
        const data = {
            id: id,
            remark: res.remark,
            approvalId: data_detail?.tApprovalDto?.tAppId,
            action: approveOrReject.toUpperCase(),
        };

        dispatch(approveOrRejectTransferToCustomer({ body: data }));
        handleClear();
        setModalApprove(false);
    };

    const handleCancel = () => {
        setModalApprove(false);
    };

    return (
        <>
            <BreadCrumb routes={routes} />
            <div>
                <RadioTabs data={tabData} onChange={handleSegmentedPage} />
                {renderSection(segmentedPage)}
            </div>

            <ModalApproveOrReject
                isOpen={modalApprove}
                handleCloseModal={handleCancel}
                onFinish={handleConfirm}
                header={approveOrReject}
                approveOrReject={approveOrReject}
                menu={"Transfer To Customer"}
                named={dataHeader?.id}
            />

            <div className="flex mt-[30px] justify-between py-5">
                <ButtonComponent
                    type={"submit"}
                    onClick={() => navigate(-1)}
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

                {isShowButton === true ? (
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
                ) : null}
            </div>
        </>
    );
};


const HistoryLog = ({
    recordId,
    createdDate,
    createdBy,
    updatedDate,
    updatedBy
}) => {
    return (
        <BaseContainer header={"HISTORY LOG INFORMATION"}>
            <GridLayout cols={5}>
                {recordId && (
                    <DetailText label={"Record Id"}>
                        {recordId}
                    </DetailText>
                )}

                <DetailText label={"Created Date"}>
                    {createdDate || "-"}
                </DetailText>

                <DetailText label={"Created By"}>
                    {createdBy || "-"}
                </DetailText>

                <DetailText label={"Updated Date"}>
                    {updatedDate || "-"}
                </DetailText>

                <DetailText label={"Updated By"}>
                    {updatedBy || "-"}
                </DetailText>
            </GridLayout>
        </BaseContainer>
    );
};

const IndexCustomer = (data, page, pageSize) => {
    return data.map((item, index) => {
        return {
            ...item,
            key: index,
            no: (page - 1) * pageSize + index + 1
        }
    })
}

export default ListDetailTransferToCustomer;
