import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
    approveOrRejectCaPaymentChannel,
    getDetailCaPaymentChannel,
} from "../../../../../redux/slices/receipt_collection/caPaymentChannel";
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

    // Define tabData before using it in useState
    const [tabData, setTabData] = useState([
        { value: "Ca Payment Channel" },
        { value: "Attachment" },
    ]);

    const { loading, data_detail } = useSelector(
        (state) => state.caPaymentChannel
    );
    const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);

    const handleSegmentedPage = (e) => {
        setSegmentedPage(e.target.value);
    };

    useEffect(() => {
        dispatch(getDetailCaPaymentChannel(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (id && data_detail?.id && data_detail && data_detail?.id === id) {
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
            setDataHeader(data_detail);
        }
    }, [id, data_detail]);

    const renderSection = (segmentedPage) => {
        switch (segmentedPage) {
            case "Ca Payment Channel":
                return (
                    <DetailCaPaymentChannel
                        key={"active"}
                        data_detail={dataHeader}
                        data_req={data_detail?.tApprovalDto}
                    />
                );
            case "Attachment":
                return (
                    <BaseContainer header={"ATTACHMENT INFORMATION"}>
                        <AttachmentComponent
                            type={"detail"}
                            data={listDataAttachment}
                            updateData={setListDataAttachment}
                            typeSelector="item"
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

    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_CA_PAYMENT_CHANNEL,
            breadcrumbName: "Ca Payment Channel",
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
            statusApproval: approveOrReject.toUpperCase(),
            remarks: res.remark,
        };
        dispatch(approveOrRejectCaPaymentChannel({ body: data }));
        handleClear();
        setModalApprove(false);
    };

    const handleCancel = () => {
        setModalApprove(false);
    };

    return (
        <LayoutMenu>
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
                menu={"Ca Payment Channel"}
                named={data_detail?.name}
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
        </LayoutMenu>
    );
};

export default ListDetailCaPaymentChannel;
