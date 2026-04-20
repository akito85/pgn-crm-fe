
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import FooterDetail from "../../../../../components/FooterDetail";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { Tabs, Spin } from "antd";
import {
  approveOrRejectPartner,
  approveOrRejectInactivePartnerCa,
  getDetailPartner,
} from "../../../../../redux/slices/receipt_collection/partnerCa";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailPartnerCa from "./DetailPartnerCa";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailPartnerCa = () => {
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
    (state) => state.partnerCa
  );
  const [segmentedPage, setSegmentedPage] = useState("Partner Ca");

  useEffect(() => {
    dispatch(getDetailPartner(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (
      id &&
      data_detail?.partnerCaMapping?.id &&
      data_detail &&
      data_detail?.partnerCaMapping?.id === id
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
      setDataHeader(data_detail?.partnerCaMapping);
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER_CA,
      breadcrumbName: "Partner Collecting Agent Mapping",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PARTNER_CA,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  const handleConfirm = (res, handleClear) => {
    setLoadingConfirm(true);
    if (
      data_detail?.tApprovalDto?.approvalType === "INACTIVE_PARTNER_CA" ||
      data_detail?.tApprovalDto?.approvalType === "ACTIVE_PARTNER_CA"
    ) {
      const data = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectInactivePartnerCa({ body: data }))
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
      <Spin spinning={loading}>
        <div>
          <Tabs
            activeKey={segmentedPage}
            onChange={setSegmentedPage}
            items={[
              {
                label: "Partner Collecting Agent Mapping",
                key: "Partner Ca",
                children: (
                  <DetailPartnerCa
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
      </Spin>

      <ModalApproveOrReject
        isOpen={modalApprove}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Partner Ca Mapping"}
        named={data_detail?.partnerCaMapping?.partner?.partnerName}
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

export default ListDetailPartnerCa;
