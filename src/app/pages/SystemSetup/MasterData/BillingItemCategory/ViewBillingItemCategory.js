import { Spin, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { getDetailBillingItemCategory } from "../../../../../redux/slices/system_setup/master_data/billingItemCategory";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "green";
    case "INACTIVE":
      return "red";
    default:
      return "default";
  }
};

const ViewBillingItemCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  const { loading, data_detail } = useSelector(
    (state) => state.billingItemCategory,
  );

  // Initial Fetch
  useEffect(() => {
    if (id) {
      dispatch(getDetailBillingItemCategory(id));
    }
  }, [dispatch, id]);

  const detail = data_detail || {};

  // Breadcrumbs
  const routes = [
    {
      path: "/",
      breadcrumbName: "System Setup",
    },
    {
      path: "/system-setup",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_BILLING_ITEM_CATEGORY,
      breadcrumbName: "Transaction Mapping Category",
    },
    {
      path: "",
      breadcrumbName: "Detail Transaction Mapping Category",
    },
  ];

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <DetailSection header={"TRANSACTION MAPPING CATEGORY INFORMATION"}>
          <div className="w-full grid grid-cols-4 gap-4">
            <DetailText label="Category Code">{detail.categoryCode}</DetailText>
            <DetailText label="Category Name">{detail.categoryName}</DetailText>
            <DetailText label="Status">
              <Tag color={getStatusColor(detail.status)}>{detail.status}</Tag>
            </DetailText>
            <div className="col-span-4">
              <DetailText label="Description">{detail.description}</DetailText>
            </div>
          </div>
        </DetailSection>

        <DetailSection header={"HISTORY LOG INFORMATION"}>
          <div className="w-full grid grid-cols-4 gap-4">
            <DetailText label={"Record ID"}>{detail.id}</DetailText>
            <DetailText label={"Created Date"}>
              {detail.createdDate
                ? moment(detail.createdDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Created By"}>{detail.createdBy}</DetailText>
            <DetailText label={"Updated Date"}>
              {detail.updatedDate
                ? moment(detail.updatedDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Updated By"}>{detail.updatedBy}</DetailText>
          </div>
        </DetailSection>

        <div className="bg-white p-4 rounded-lg mt-4">
          <ButtonComponent type="default" onClick={handleBack}>
            Back
          </ButtonComponent>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default ViewBillingItemCategory;
