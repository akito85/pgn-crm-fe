import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { Tabs } from "antd";
import {
    approveOrRejectCaPaymentChannel,
    approveOrRejectInactiveCaPaymentChannel,
    getDetailCaPaymentChannel,
} from "../../../../../redux/slices/receipt_collection/caPaymentChannel";
import FooterDetail from "../../../../../components/FooterDetail";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailCaPaymentChannel from "./DetailCaPaymentChannel";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailCaPaymentChannel = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [modalApprove, setModalApprove] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const id = location?.state?.id;
    const [dataHeader, setDataHeader] = useState({});
    const [listDataAttachment, setListDataAttachment] = useState([]);
    // const [isShowButton, setIsShowButton] = useState(false);

    // const [isShowButton, setIsShowButton] = useState(false);

    // const { loading, data_detail } = useSelector(
    //     (state) => state.caPaymentChannel
    // );
    const { loading, data_detail } = useSelector(
        (state) => state.caPaymentChannel
    );
    const [segmentedPage, setSegmentedPage] = useState("Ca Payment Channel");

    useEffect(() => {
        dispatch(getDetailCaPaymentChannel(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (id && data_detail?.peOpCaCi?.id && data_detail && data_detail?.peOpCaCi?.id === id) {
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
            setDataHeader(data_detail?.peOpCaCi);
            // setIsShowButton(data_detail?.tapprovalDto?.isApprover)
        }
    }, [id, data_detail]);



    const isShowButton = data_detail?.tapprovalDto?.isApprover;

    // console.log("isShowButton",isShowButton)

    // Breadcrumbs
    const routes = [
      {
        path: "",
        breadcrumbName: "System Setup",
      },
      {
        path: "",
        breadcrumbName: "Master Data",
      },
      {
        path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_CA_PAYMENT_CHANNEL,
        breadcrumbName: "Payment Channel Mapping",
      },
      {
        path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_CA_PAYMENT_CHANNEL,
        breadcrumbName: `Detail ${segmentedPage}`,
      },
    ];

    // handle Confirm
    const handleConfirm = (res, handleClear) => {
        const data = {
            id: id,
            remark: res.remark,
            approvalId: data_detail?.tapprovalDto?.tAppId,
            action: approveOrReject.toUpperCase(),
        };
        if (data_detail?.tapprovalDto?.approvalType === "INACTIVE_CA_PAYMENT_CHANNEL") {
            dispatch(approveOrRejectInactiveCaPaymentChannel({ body: data }));
        } else {
            dispatch(approveOrRejectCaPaymentChannel({ body: data }));
        }
        handleClear();
        setModalApprove(false);
    };

    const handleCancel = () => {
        setModalApprove(false);
    };

    return (
        <div>
            <BreadCrumb routes={routes} />
            <Tabs
                activeKey={segmentedPage}
                onChange={setSegmentedPage}
                items={[
                    {
                        label: "Payment Channel Mapping",
                        key: "Ca Payment Channel",
                        children: (
                            <DetailCaPaymentChannel
                                key={"active"}
                                data_detail={dataHeader}
                                data_req={data_detail?.tapprovalDto}
                            />
                        ),
                    },
                    {
                        label: "Attachment",
                        key: "Attachment",
                        children: (
                            <BaseContainer header={"ATTACHMENT INFORMATION"}>
                                <AttachmentComponent
                                    type={"detail"}
                                    data={listDataAttachment}
                                    updateData={setListDataAttachment}
                                    typeSelector="caPaymentChannel"
                                    service={receiptCollectionHttpService}
                                    configApplication={configApp.PAYMENT_SERVICE}
                                />
                            </BaseContainer>
                        ),
                    },
                ]}
            />

            <ModalApproveOrReject
                isOpen={modalApprove}
                handleCloseModal={handleCancel}
                onFinish={handleConfirm}
                header={approveOrReject}
                approveOrReject={approveOrReject}
                menu={"Payment Channel Mapping"}
                named={data_detail?.name}
            />

            <FooterDetail
                onCancel={() => navigate(-1)}
                onApprove={() => {
                    setModalApprove(true);
                    setApproveOrReject("approve");
                }}
                onReject={() => {
                    setModalApprove(true);
                    setApproveOrReject("reject");
                }}
                showApproval={isShowButton === true}
            />
        </div>
    );
};

export default ListDetailCaPaymentChannel;
