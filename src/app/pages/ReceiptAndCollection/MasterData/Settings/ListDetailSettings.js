import { LeftOutlined } from "@ant-design/icons";
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
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
  approveOrRejectSetting,
  approveOrRejectInactive,
  getDetailSetting,
} from "../../../../../redux/slices/receipt_collection/setting";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailSettings from "./DetailSettings";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
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
  const [dataHeader, setDataHeader] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
    { value: "Setting" },
    { value: "Attachment" },
  ]);

  const { loading, data_detail } = useSelector(
    (state) => state.receiptSetting
  );
  const [segmentedPage, setSegmentedPage] = useState("Setting");

  useEffect(() => {
    dispatch(getDetailSetting(id));
  }, [dispatch, id]);



  useEffect(() => {
    if (
      id &&
      data_detail?.settings?.id &&
      data_detail &&
      data_detail?.settings?.id === id
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
      setDataHeader(data_detail?.settings);
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_SETTINGS,
      breadcrumbName: "Payment Channel Configuration",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_SETTINGS,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    setLoadingConfirm(true);
    if (data_detail?.tApprovalDto?.approvalType === "INACTIVE_RECEIPT_SETTING") {
      const data = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectInactive({ body: data }))
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
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectSetting({ body: data }))
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
    // setRemark("");
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
                <DetailSettings
                  data_detail={dataHeader}
                  data_req={data_detail?.tApprovalDto}
                />
              ),
            },
            {
              label: "Attachment",
              key: "Attachment",
              children: (
                <DetailSection header={"ATTACHMENT INFORMATION"}>
                  <AttachmentComponent
                    type={"detail"}
                    data={listDataAttachment}
                    updateData={setListDataAttachment}
                    typeSelector="receiptSetting"
                    service={receiptCollectionHttpService}
                    configApplication={configApp.PAYMENT_SERVICE}
                  />
                </DetailSection>
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
        menu={"Payment Channel Configuration"}
        named={data_detail?.settings?.partnerCode}
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
