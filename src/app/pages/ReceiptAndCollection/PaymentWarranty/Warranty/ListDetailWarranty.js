import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Spin } from "antd";
import {
  getDetailWarranty,
  getApprovalListPaginate,
  getAllAttachmentInfoPaginate,
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
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";

const ListDetailWarranty = () => {
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("warranty");

  const {
    data_detail,
    data_approval_info,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
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
      } else {
        dispatch(getApprovalListPaginate({ page: 1, pageSize: 10 }));
      }
    } else if (activeTab === "attachment") {
      dispatch(getListCategory());
    }
  }, [activeTab, dispatch, data_detail?.appHierId]);

  const approvalName = dataListAppHierId?.find(x => x.appHierId === data_detail?.appHierId)?.approvalName || data_detail?.approvalName || "-";

  const items = [
    {
      key: "warranty",
      label: "Warranty",
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
                : (data_approval_info?.result || data_approval_info || [])
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
            data={data_detail?.attachments || []}
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
        breadcrumbName: "Payment Warranty",
    },
    {
        path: "",
        breadcrumbName: "Detail Warranty",
    },
    ];

  return (
    <LayoutMenu>
        <Spin spinning={loading}>
            <BreadCrumb routes={routes} />
            <div>
                <Tabs 
                    activeKey={activeTab} 
                    items={items} 
                    onChange={handleTabChange}
                    tabBarStyle={{ marginBottom: 24 }}
                />
            </div>

            <FooterDetail
                onCancel={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.WARRANTY)}
                showApproval={isShowButton === true}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            <ModalApproveOrReject
              isOpen={isModalOpen}
              handleCloseModal={() => setIsModalOpen(false)}
              onFinish={onFinishApproval}
              header={approvalAction === "APPROVE" ? "Approve" : "Reject"}
              approveOrReject={approvalAction === "APPROVE" ? "approve" : "reject"}
              menu="Payment Warranty"
              named={data_detail?.customerName || "-"}
            />
        </Spin>
    </LayoutMenu>
  );
};

export default ListDetailWarranty;
