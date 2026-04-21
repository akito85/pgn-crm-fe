import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { getGapRatingBilling, downloadGapRatingBilling } from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";

const DetailRatingVsBilling = () => {
  const location = useLocation();
  const period = location.state?.period;
  const accountNumber = location.state?.accountNumber;
  const dispatch = useDispatch();
  const { loading, gapRatingBillingData } = useSelector(
    (state) => state.monitoring
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (period) {
      dispatch(
        getGapRatingBilling({
          period,
          page,
          pageSize,
          accountNumber,
        })
      );
    }
  }, [period, page, pageSize, accountNumber, dispatch]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_CUSTOMER_VIEW,
      breadcrumbName: "Monitoring Customer",
    },
    {
      path: "",
      breadcrumbName: "Detail Rating vs Billing",
    },
  ];

  const tableColumns = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
      fixed: "left",
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 130,
    },
    {
      title: "RATING CODE",
      dataIndex: "ratingCode",
      key: "ratingCode",
      width: 150,
    },
    {
      title: "RATING VALUE",
      dataIndex: "ratingValue",
      key: "ratingValue",
      width: 130,
      isNumber: true,
    },
    {
      title: "BILLING CODE",
      dataIndex: "billingCode",
      key: "billingCode",
      width: 150,
    },
    {
      title: "BILLING VALUE",
      dataIndex: "billingValue",
      key: "billingValue",
      width: 130,
      isNumber: true,
    },
    {
      title: "GAP",
      dataIndex: "gap",
      key: "gap",
      width: 120,
      isNumber: true,
    },
  ];

  const handleDownload = () => {
    dispatch(downloadGapRatingBilling({ period, accountNumber }));
  };

  return (
    <LayoutMenu grantPath={RBI_ROUTES.MONITORING_CUSTOMER_VIEW}>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex justify-between items-center -my-4">
              <p className="mt-[15px] font-bold">DETAIL GAP DATA : RATING VS BILLING</p>
              <ButtonComponent
                icon={<SVGIcon name="IconButtonDownload" width={24} />}
                type="submit"
                onClick={handleDownload}
              >
                Download List
              </ButtonComponent>
            </div>
          }
        >
          <TableRBI
            idTable="table-rating-vs-billing"
            dataSource={gapRatingBillingData?.result || []}
            columns={tableColumns}
            pageSize={pageSize}
            current={page}
            loading={loading}
            totalData={gapRatingBillingData?.page?.totalElements || 0}
            tableScrolled={{ x: "max-content" }}
            usePagination={true}
            useSelect={true}
            showAdvanceSearch={true}
            showSearchBar={true}
            onChange={(p) => setPage(p)}
          />
        </CardContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailRatingVsBilling;
