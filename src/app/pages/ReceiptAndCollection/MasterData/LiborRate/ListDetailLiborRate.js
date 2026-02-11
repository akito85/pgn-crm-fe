import { Spin, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import DetailLiborRate from "./DetailLiborRate";
import {
  getDetailRateIndex,
  approveOrRejectRateIndex,
  approveOrRejectInactiveRateIndex,
} from "../../../../../redux/slices/receipt_collection/liborRate";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import FooterDetail from "../../../../../components/FooterDetail";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrRejectV2";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailLiborRate = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location?.state || {};
  const { data_detail, loading } = useSelector((state) => state.liborRate);

  const [modalApprove, setModalApprove] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [segmentedPage, setSegmentedPage] = useState("Libor Rate");

  useEffect(() => {
    if (id) {
      dispatch(getDetailRateIndex(id));
    }
  }, [dispatch, id]);

  const isShowButton = data_detail?.tApprovalDto?.isApprover;

  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LIBOR_RATE, breadcrumbName: "Libor Rate" },
    { path: "", breadcrumbName: `Detail Libor Rate` },
  ];

  const handleConfirm = (res, handleClear) => {
    setLoadingConfirm(true);
    const isInactiveApproval = data_detail?.tApprovalDto?.approvalType === "INACTIVE_RATE_INDEX";
    const action = isInactiveApproval ? approveOrRejectInactiveRateIndex : approveOrRejectRateIndex;

    const body = {
      id: id,
      remark: res.remark,
      approvalId: data_detail?.tApprovalDto?.tAppId,
      action: approveOrReject.toUpperCase(),
    };

    dispatch(action({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        setModalApprove(false);
        setLoadingConfirm(false);
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_LIBOR_RATE);
      })
      .catch(() => {
        setLoadingConfirm(false);
      });
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <div className="mt-5">
          <Tabs
            activeKey={segmentedPage}
            onChange={setSegmentedPage}
            items={[
              {
                label: "Libor Rate",
                key: "Libor Rate",
                children: <DetailLiborRate data={data_detail} />,
              },
              {
                label: "Attachment",
                key: "Attachment",
                children: (
                  <BaseContainer header={"ATTACHMENT INFORMATION"}>
                    <AttachmentComponent
                      type={"detail"}
                      data={data_detail?.attachmentDtoList || []}
                      typeSelector="liborRate"
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
        handleCloseModal={() => setModalApprove(false)}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Libor Rate"}
        named={data_detail?.rateIndex?.indexName}
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

export default ListDetailLiborRate;
