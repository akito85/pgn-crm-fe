import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
  approveOrRejectPaymentChannel,
  approveOrRejectInactivePaymentChannel,
  getDetailPaymentChannel,
} from "../../../../../redux/slices/receipt_collection/paymentChannel";
import FooterDetail from "../../../../../components/FooterDetail";
import { Tabs } from "antd";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailPaymentChannel from "./DetailPaymentChannel";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailPaymentChannel = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [modalApprove, setModalApprove] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const id = location?.state?.id;
  const [dataHeader, setDataHeader] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);

  const { loading, data_detail } = useSelector(
    (state) => state.paymentChannel
  );
  const [segmentedPage, setSegmentedPage] = useState("Payment Channel");

  useEffect(() => {
    dispatch(getDetailPaymentChannel(id));
  }, [dispatch, id]);



  useEffect(() => {
    if (
      id &&
      data_detail?.peOpCi?.id &&
      data_detail &&
      data_detail?.peOpCi?.id === id
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
      setDataHeader(data_detail?.peOpCi);
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_CHANNEL,
      breadcrumbName: "Delivery Channel",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_CHANNEL,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    if (data_detail?.tApprovalDto?.approvalType === "INACTIVE_PAYMENT_CHANNEL") {
      const data = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectInactivePaymentChannel({ body: data }))
        .unwrap()
        .then(() => {
          handleClear();
          setModalApprove(false);
        });
    } else {
      const data = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectPaymentChannel({ body: data }))
        .unwrap()
        .then(() => {
          handleClear();
          setModalApprove(false);
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
              label: "Delivery Channel",
              key: "Payment Channel",
              children: (
                <DetailPaymentChannel
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
                    typeSelector="paymentChannel"
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
        menu={"Delivery Channel"}
        named={data_detail?.peOpCi?.name
        }
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

export default ListDetailPaymentChannel;
