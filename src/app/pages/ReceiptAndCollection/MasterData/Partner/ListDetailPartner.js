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
import DetailSection from "../../../../../components/DetailSection";
import FooterDetail from "../../../../../components/FooterDetail";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrRejectV2";
import { Tabs } from "antd";
import {
  approveOrRejectPartner,
  approveOrRejectInactivePartner,
  getDetailPartner,
} from "../../../../../redux/slices/receipt_collection/partner";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailPartner from "./DetailPartner";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailPartner = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [modalApprove, setModalApprove] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const id = location?.state?.id;
  const [dataHeader, setDataHeader] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);

  const { loading, data_detail } = useSelector(
    (state) => state.partner
  );
  const [segmentedPage, setSegmentedPage] = useState("Partner");

  useEffect(() => {
    dispatch(getDetailPartner(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (
      id &&
      data_detail?.partner?.id &&
      data_detail &&
      data_detail?.partner?.id === id
    ) {
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
      setDataHeader(data_detail?.partner);
    }
  }, [id, data_detail]);

  const isShowButton = data_detail?.tApprovalDto?.isApprover;

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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER,
      breadcrumbName: "Partner",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PARTNER,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    setLoadingConfirm(true);
    if (
      data_detail?.tApprovalDto?.approvalType === "INACTIVE_PARTNER" ||
      data_detail?.tApprovalDto?.approvalType === "ACTIVE_PARTNER"
    ) {
      const data = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectInactivePartner({ body: data }))
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
        partnerId: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectPartner({ body: data }))
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
    <>
      <BreadCrumb routes={routes} />

      <div>
        <Tabs
          activeKey={segmentedPage}
          onChange={setSegmentedPage}
          items={[
            {
              label: "Partner",
              key: "Partner",
              children: (
                <DetailPartner
                  data_detail={data_detail?.partner}
                  data_req={data_detail?.request}
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
                    typeSelector="partner"
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
        menu={"Partner"}
        named={data_detail?.partner?.partnerName}
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
    </>
  );
};

export default ListDetailPartner;
