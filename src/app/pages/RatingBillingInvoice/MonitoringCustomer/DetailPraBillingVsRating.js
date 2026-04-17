import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";

const DetailPraBillingVsRating = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const period = location.state?.period;

  const [page, setPage] = useState(1);

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
      breadcrumbName: "Detail Pra-Billing vs Rating",
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
      render: (_, __, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
      fixed: "left",
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "INIT CODE",
      dataIndex: "initCode",
      key: "initCode",
      width: 150,
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
      title: "GAP",
      dataIndex: "gap",
      key: "gap",
      width: 120,
      isNumber: true,
    },
  ];

  const handleDownload = () => {
    // Download handler — wire up when backend endpoint is ready
  };

  return (
    <LayoutMenu grantPath={RBI_ROUTES.MONITORING_CUSTOMER_VIEW}>
      <Spin spinning={false}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex justify-between items-center -my-4">
              <p className="mt-[15px] font-bold">PRA-BILLING VS RATING</p>
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
            idTable="table-pra-billing-vs-rating"
            dataSource={[]}
            columns={tableColumns}
            pageSize={10}
            current={page}
            loading={false}
            totalData={0}
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

export default DetailPraBillingVsRating;
