import {
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Spin, Tabs, Collapse, Button, Checkbox, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import DetailPaymentWarrantyPartner from "./DetailPaymentWarrantyPartner";
import RatingList from "./Rating/RatingList";
import BranchList from "./Branch/BranchList";
import SectionCard from "../../../../../components/SectionCard";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import {
  getDetailPaymentWarrantyPartner,
  approveOrRejectPaymentWarrantyPartner,
  approveOrRejectInactivePaymentWarrantyPartner,
  approveOrRejectGlobal,
} from "../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import FooterDetail from "../../../../../components/FooterDetail";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrRejectV2";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { renderDateConverter } from "../../../../../utils";
import StatusComponent from "../../../../../components/StatusComponent";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";

const ListDetailPaymentWarrantyPartner = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location?.state || {};
  const { data_detail, loading_detail } = useSelector((state) => state.paymentWarrantyPartner);

  const [partnerId, setPartnerId] = useState(null);

  useEffect(() => {
    if (id) {
      setPartnerId(id);
    } else if (data_detail?.partner?.id) {
      setPartnerId(data_detail.partner.id);
    }
  }, [id, data_detail]);

  const [modalApprove, setModalApprove] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [segmentedPage, setSegmentedPage] = useState("Guarantee Partner");

  const handleFetch = React.useCallback(() => {
    if (id) {
      dispatch(getDetailPaymentWarrantyPartner(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  useEffect(() => {
    // Component logic simplified
  }, [data_detail]);


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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_WARRANTY_PARTNER,
      breadcrumbName: "Payment Guarantee Partner",
    },
    { path: "", breadcrumbName: `Detail ${segmentedPage}` },
  ];


  const handleConfirm = (res, handleClear) => {
    setLoadingConfirm(true);
    
    // Build the items array from all active approvals that the user can act on
    const items = (data_detail?.activeApprovals || [])
      .filter(a => a?.refId && a?.approvalData)
      .map((a) => ({
        id: Number(a.refId),
        category: a.approvalData?.approvalType || '',
        approvalId: a.approvalData?.tAppId || '',
      }));

    const body = {
      action: approveOrReject.toUpperCase(),
      remark: res.remark,
      items,
    };

    dispatch(approveOrRejectGlobal({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        setModalApprove(false);
        setLoadingConfirm(false);
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_WARRANTY_PARTNER);
        // dispatch(getDetailPaymentWarrantyPartner(id));
      })
      .catch(() => {
        setLoadingConfirm(false);
      });
  };

  const approverItemsCount = data_detail?.activeApprovals?.filter(a => a?.tApprovalDto?.isApprover).length || 0;

  return (
    <LayoutMenu>
        <BreadCrumb routes={routes} />
        <CardContainerNoBorder
          header="PAYMENT GUARANTEE PARTNER DETAIL"
          className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
          noPadding
        >
          <div className="flex flex-col gap-4 pb-4 px-4 pt-4">
          </div>

          <div className="full-width-tabs">
            <Tabs
              activeKey={segmentedPage}
              onChange={setSegmentedPage}
              className="custom-tabs-layout"
              items={[
                {
                  label: <span className="px-4">Detail</span>,
                  key: "Guarantee Partner",
                  children: (
                    <div className="flex flex-col gap-4 pb-4 px-4 pt-4">
                      <SectionCard title="DETAIL">
                        <Spin spinning={loading_detail}>
                          <DetailPaymentWarrantyPartner data={data_detail} />
                        </Spin>
                      </SectionCard>

                      <SectionCard title="RATING LIST">
                        <RatingList partnerId={partnerId} isApprover={data_detail?.isApprover} partnerStatus={data_detail?.partner?.status} />
                      </SectionCard>

                      <SectionCard title="BRANCH LIST">
                        <BranchList partnerId={partnerId} isApprover={data_detail?.isApprover} partnerStatus={data_detail?.partner?.status} />
                      </SectionCard>
                    </div>
                  ),
                },
                {
                  label: <span className="px-4">Attachment</span>,
                  key: "Attachment",
                  children: (
                    <div className="pb-4 px-4 pt-4">
                      <BaseContainer header={"ATTACHMENT INFORMATION"}>
                        <AttachmentComponent
                          type={"detail"}
                          data={data_detail?.attachmentDtoList || []}
                          typeSelector="paymentWarrantyPartner"
                          service={receiptCollectionHttpService}
                          configApplication={configApp.PAYMENT_SERVICE}
                        />
                      </BaseContainer>
                    </div>
                  ),
                },
              ]}
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
                padding: 12px 0 !important;
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
            recordId: data_detail?.partner?.id || "-",
            createdDate: data_detail?.partner?.createdDate ? renderDateConverter(data_detail?.partner?.createdDate) : "-",
            createdBy: data_detail?.partner?.createdBy || "-",
            updatedDate: data_detail?.partner?.updatedDate ? renderDateConverter(data_detail?.partner?.updatedDate) : "-",
            updatedBy: data_detail?.partner?.updatedBy || "-"
          }} 
        />

      <ModalApproveOrReject
        isOpen={modalApprove}
        handleCloseModal={() => setModalApprove(false)}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={data_detail?.partner?.partnerName || data_detail?.partner?.partnerGuaranteeIssuer}
        named={data_detail?.partner?.partnerCode}
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
        showApproval={!loading_detail && data_detail?.isApprover && data_detail?.activeApprovals?.length > 0}
      />
    </LayoutMenu>
  );
};

export default ListDetailPaymentWarrantyPartner;

