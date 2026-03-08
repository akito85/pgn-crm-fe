import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Spin } from "antd";
import moment from "moment";
import {
  getDetailWarranty,
  getListCategory,
  getListApprovalById,
  getAllApprovalList,
  submitApproval,
} from "../../../../../redux/slices/receipt_collection/warranty";
import DetailWarranty from "./DetailWarranty";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import FooterDetail from "../../../../../components/FooterDetail";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";

const ListDetailWarranty = ({ id: propId, isEmbedded = false }) => {
  const location = useLocation();
  const id = propId || location.state?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("warranty");

  const {
    data_detail,
    data_approval_info,
    dataListAppHierId,
    dataListAppHierDetail,
    loadingDetail,
    loadingApproval,
  } = useSelector((state) => state.warranty);

  useEffect(() => {
    if (id) {
      dispatch(getDetailWarranty({ id }));
    }
    dispatch(getAllApprovalList());
  }, [id, dispatch]);

  useEffect(() => {
    if (activeTab === "approval") {
      if (data_detail?.appHierId) {
        dispatch(getListApprovalById({ id: data_detail?.appHierId }));
      }
    } else if (activeTab === "attachment") {
      dispatch(getListCategory());
    }
  }, [activeTab, dispatch, data_detail?.appHierId]);

  const approvalName = dataListAppHierId?.find(x => x.appHierId === data_detail?.appHierId)?.approvalName || data_detail?.approvalName || "-";

  const items = [
    {
      key: "warranty",
      label: "Guarantee",
      children: <DetailWarranty data_detail={data_detail} />,
    },
    {
      key: "approval",
      label: "Approval",
      children: (
        <BaseContainer header={"APPROVAL INFORMATION"}>
          <ApprovalComponentGeneral
            dataTable={
              dataListAppHierDetail?.length > 0
                ? dataListAppHierDetail.map((a, index) => ({
                  ...a,
                  key: index + 1,
                  employeeDetail: a.employeeDetail.map((b, index) => ({
                    ...b,
                    key: index + 1,
                  })),
                }))
                : (data_approval_info?.result || [])
            }
            approvalName={approvalName}
            showSelect={false}
            disableSelect={true}
            selectedHierarchy={data_detail?.appHierId}
          />
        </BaseContainer>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <BaseContainer header={"ATTACHMENT INFORMATION"}>
          <AttachmentComponent
            data={
              data_detail?.attachmentDtoList
                ? data_detail.attachmentDtoList.map((item) => ({
                  id: item.id,
                  uid: item.uid || item.id,
                  fileName: item.fileName,
                  fileSize: item.fileSize,
                  fileCategoryName: item.fileCategoryName,
                  urlFile1: item.urlFile1,
                  urlFile2: item.urlFile2,
                  createdBy: item.createdBy,
                  createdDate: item.createdDate ? moment(item.createdDate).format("YYYY-MM-DD HH:mm:ss") : null,
                  dataType: "exist",
                  fileType: item.fileType || "application/pdf"
                }))
                : []
            }
            type="detail"
            typeSelector="warranty"
            service={receiptCollectionHttpService}
            configApplication={configApp.PAYMENT_SERVICE}
          />
        </BaseContainer>
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const isShowButton = data_detail?.isApprover || false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");

  const handleApprove = () => {
    setApprovalAction("APPROVE");
    setIsModalOpen(true);
  };

  const handleReject = () => {
    setApprovalAction("REJECT");
    setIsModalOpen(true);
  };

  const onFinishApproval = async (values, clearForm) => {
    const body = {
      approvalId: data_detail?.approvalId,
      id: data_detail?.id,
      action: approvalAction,
      remark: values.remark,
    };

    dispatch(submitApproval({ body }))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        clearForm();
        dispatch(getDetailWarranty({ id }));
      })
      .catch(() => {
        // Error is handled in thunk with showModalError
      });
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY,
      breadcrumbName: "Payment Guarantee",
    },
    {
      path: "",
      breadcrumbName: "Detail Guarantee",
    },
  ];

  const content = (
    <Spin spinning={loadingDetail || loadingApproval}>
      {!isEmbedded && <BreadCrumb routes={routes} />}
      
      <CardContainerNoBorder
        header="GUARANTEE DETAIL"
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
        <style>
          {`
            .full-width-tabs .ant-tabs-nav {
              margin-bottom: 0 !important;
              padding: 0 !important;
            }
            .full-width-tabs .ant-tabs-nav::before {
              border-bottom: 1px solid #BDBDBD !important;
            }
            .full-width-tabs .ant-tabs-tab {
              margin: 0 !important;
              padding: 12px 16px !important;
            }
            .full-width-tabs .ant-tabs-ink-bar {
              height: 2px !important;
              background: #0075bf !important;
            }
          `}
        </style>
      </CardContainerNoBorder>

      <LogHistoryInfo 
        data={{
          recordId: data_detail?.recordId || data_detail?.id || "-",
          createdDate: data_detail?.createdDate ? moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss") : "-",
          createdBy: data_detail?.createdBy || "-",
          updatedDate: data_detail?.updatedDate ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss") : "-",
          updatedBy: data_detail?.updatedBy || "-"
        }} 
      />

      {!isEmbedded && (
        <FooterDetail
          onCancel={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.WARRANTY)}
          showApproval={isShowButton === true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      <ModalApproveOrReject
        isOpen={isModalOpen}
        handleCloseModal={() => setIsModalOpen(false)}
        onFinish={onFinishApproval}
        header={approvalAction === "APPROVE" ? "Approve" : "Reject"}
        approveOrReject={approvalAction === "APPROVE" ? "approve" : "reject"}
        menu="Payment Guarantee"
        named={data_detail?.customerName || "-"}
      />
    </Spin>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <LayoutMenu>
      {content}
    </LayoutMenu>
  );
};

export default ListDetailWarranty;
