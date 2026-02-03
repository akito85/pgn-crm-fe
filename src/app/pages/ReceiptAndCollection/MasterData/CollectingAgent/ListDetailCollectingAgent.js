import {
    LeftOutlined,
    CheckSquareOutlined,
    CloseSquareOutlined
} from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import FooterDetail from "../../../../../components/FooterDetail";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrRejectV2";
import { Tabs } from "antd";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
    approveOrRejectCollectingAgent,
    approveOrRejectInactiveCollectingAgent,
    getDetailCollectingAgent,
} from "../../../../../redux/slices/receipt_collection/collectingAgent";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailCollectingAgent from "./DetailCollectingAgent";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailCollectingAgent = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [modalApprove, setModalApprove] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const id = location?.state?.id;
    const [dataHeader, setDataHeader] = useState({});
    const [listDataAttachment, setListDataAttachment] = useState([]);
    // const [isShowButton, setIsShowButton] = useState(false);

    const { loading, data_detail } = useSelector(
        (state) => state.collectingAgent
    );
    const [segmentedPage, setSegmentedPage] = useState("Collecting Agent");



    useEffect(() => {
        dispatch(getDetailCollectingAgent(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (id && data_detail?.collectingAgent?.id && data_detail && data_detail?.collectingAgent?.id === id) {
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
            setDataHeader(data_detail?.collectingAgent);
            // setIsShowButton(data_detail?.tApprovalDto?.isApprover)
        }
    }, [id, data_detail]);



    const isShowButton = data_detail?.tApprovalDto?.isApprover;

    // console.log("isShowButton",isShowButton)

    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_COLLECTING_AGENT,
            breadcrumbName: "Collecting Agent",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_COLLECTING_AGENT,
            breadcrumbName: `Detail ${segmentedPage}`,
        },
    ];

    // handle Confirm
    // handle Confirm
    const handleConfirm = (res, handleClear) => {
        setLoadingConfirm(true);
        if (data_detail?.tApprovalDto?.approvalType === "INACTIVE_COLLECTING_AGENT") {
            const data = {
                id: id,
                remark: res.remark,
                approvalId: data_detail?.tApprovalDto?.tAppId,
                action: approveOrReject.toUpperCase(),
            };
            dispatch(approveOrRejectInactiveCollectingAgent({ body: data }))
                .unwrap()
                .then(() => {
                    handleClear();
                    setModalApprove(false);
                    setLoadingConfirm(false);
                })
                .catch(() => {
                    setLoadingConfirm(false);
                });
        } else {
            const data = {
                collectingAgentId: id,
                remark: res.remark,
                approvalId: data_detail?.tApprovalDto?.tAppId,
                action: approveOrReject.toUpperCase(),
            };
            dispatch(approveOrRejectCollectingAgent({ body: data }))
                .unwrap()
                .then(() => {
                    handleClear();
                    setModalApprove(false);
                    setLoadingConfirm(false);
                })
                .catch(() => {
                    setLoadingConfirm(false);
                });
        }
    };

    const handleCancel = () => {
        setModalApprove(false);
    };

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <div>
                <Tabs
                    activeKey={segmentedPage}
                    onChange={setSegmentedPage}
                    items={[
                        {
                            label: "Collecting Agent",
                            key: "Collecting Agent",
                            children: (
                                <DetailCollectingAgent
                                    key={"active"}
                                    data_detail={dataHeader}
                                    data_req={data_detail?.tApprovalDto}
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
                                        typeSelector="collectingAgent"
                                        service={receiptCollectionHttpService}
                                        configApplication={configApp.PAYMENT_SERVICE}
                                    />
                                </BaseContainer>
                            ),
                        },
                    ]}
                />
            </div>

            <ModalApproveOrReject
                isOpen={modalApprove}
                handleCloseModal={handleCancel}
                onFinish={handleConfirm}
                header={approveOrReject}
                approveOrReject={approveOrReject}
                menu={"Collecting Agent"}
                named={data_detail?.collectingAgent?.name}
                loading={loadingConfirm}
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
        </LayoutMenu>
    );
};

export default ListDetailCollectingAgent;
