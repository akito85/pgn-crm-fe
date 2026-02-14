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
} from "../../../../../redux/slices/receipt_collection/warranty";
import DetailWarranty from "./DetailWarranty";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import FooterDetail from "../../../../../components/FooterDetail";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import BaseContainer from "../../../../../components/BaseContainer";

const ListDetailWarranty = () => {
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("warranty");

  const {
    data_detail,
    data_approval_info,
    data_attachment_info,
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
      dispatch(getAllAttachmentInfoPaginate({ page: 1, pageSize: 10 }));
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
            data={data_attachment_info?.result || data_attachment_info || []}
            type="detail"
            typeSelector="warranty"
            dispatch={dispatch}
            getAPICategory={getListCategory}
          />
        </BaseContainer>
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const isShowButton = data_detail?.isApprover || false;

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
            />
        </Spin>
    </LayoutMenu>
  );
};

export default ListDetailWarranty;
