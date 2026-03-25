import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import FooterDetail from "../../../../../components/FooterDetail";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrRejectV2";
import { Tabs } from "antd";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
  approveOrRejectPayChannelConfig,
  approveOrRejectInactivePayChannelConfig,
  getDetailPayChannelConfig,
} from "../../../../../redux/slices/receipt_collection/setting";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailSettings from "./DetailSettings";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import CardContainer from "../../../../../components/CardContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailSettings = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [modalApprove, setModalApprove] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const id = location?.state?.id;
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [segmentedPage, setSegmentedPage] = useState("Setting");

  const { data_detail } = useSelector((state) => state.receiptSetting);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        await dispatch(getDetailPayChannelConfig(id)).unwrap();
      } catch (error) {
        console.error("Failed to fetch Config detail:", error);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail?.payChannelConfig?.id && data_detail?.payChannelConfig?.id === id) {
      const dataAttachment = (data_detail?.attachmentDtoList || []).map((item) => ({
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
      }));
      setListDataAttachment(dataAttachment);
    }
  }, [id, data_detail]);

  const isShowButton = data_detail?.tApprovalDto?.isApprover;

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_SETTINGS,
      breadcrumbName: "Payment Channel Configuration",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_SETTINGS,
      breadcrumbName: `Detail ${segmentedPage === "Setting" ? "Payment Channel Configuration" : segmentedPage}`,
    },
  ];

  const handleConfirm = (res, handleClear) => {
    setLoadingConfirm(true);
    if (data_detail?.tApprovalDto?.approvalType === "INACTIVE_PAY_CHANNEL_CONFIG") {
      const data = {
        id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectInactivePayChannelConfig({ body: data }))
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
        id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectPayChannelConfig({ body: data }))
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
              label: "Payment Channel Configuration",
              key: "Setting",
              children: (
                <DetailSettings data_detail={data_detail?.payChannelConfig} />
              ),
            },
            {
              label: "Attachment",
              key: "Attachment",
              children: (
                <CardContainer header="ATTACHMENT INFORMATION">
                  <AttachmentComponent
                    type="detail"
                    data={listDataAttachment}
                    updateData={setListDataAttachment}
                    typeSelector="receiptSetting"
                    service={receiptCollectionHttpService}
                    configApplication={configApp.PAYMENT_SERVICE}
                  />
                </CardContainer>
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
        menu="Payment Channel Config"
        named={data_detail?.payChannelConfig?.mappingName}
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

export default ListDetailSettings;
