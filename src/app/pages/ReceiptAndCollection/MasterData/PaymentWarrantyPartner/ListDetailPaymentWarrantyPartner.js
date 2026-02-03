import { Spin } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { getDetailPaymentWarrantyPartner } from "../../../../../redux/slices/receipt_collection/paymentWarrantyPartner";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailPaymentWarrantyPartner from "./DetailPaymentWarrantyPartner";

const ListDetailPaymentWarrantyPartner = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = location?.state || {};
  const { data_detail, loading } = useSelector((state) => state.paymentWarrantyPartner);

  useEffect(() => {
    if (id) {
      dispatch(getDetailPaymentWarrantyPartner(id));
    }
  }, [dispatch, id]);

  const routes = [
    { path: "", breadcrumbName: "Receipt & Collection" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_WARRANTY_PARTNER, breadcrumbName: "Payment Warranty Partner" },
    { path: "", breadcrumbName: "Detail" },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <DetailPaymentWarrantyPartner data={data_detail} />
      </Spin>
    </LayoutMenu>
  );
};

export default ListDetailPaymentWarrantyPartner;
