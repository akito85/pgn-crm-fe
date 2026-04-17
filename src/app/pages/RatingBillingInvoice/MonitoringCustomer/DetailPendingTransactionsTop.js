import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin, Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { getPendingTransactions } from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";

const DetailPendingTransactionsTop = () => {
  const location = useLocation();
  const period = location.state?.period;
  const accountNumber = location.state?.accountNumber;
  const dispatch = useDispatch();
  const { loading, pendingTransactionsData } = useSelector(
    (state) => state.monitoring
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (period) {
      dispatch(
        getPendingTransactions({
          period,
          page: page - 1,
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
      breadcrumbName: "Detail Pending Transactions",
    },
  ];

  const handleDownload = () => {
    // Download handler — wire up when backend endpoint is ready
  };

  const handleInvestigate = (record) => {
    // Investigate handler — wire up when backend endpoint is ready
  };

  const handleInactive = (record) => {
    // Inactive handler — wire up when backend endpoint is ready
  };

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
      title: "CUSTOMER ID",
      dataIndex: "customerId",
      key: "customerId",
      width: 150,
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "ADDRESS",
      dataIndex: "address",
      key: "address",
      width: 200,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      width: 130,
    },
    {
      title: "PERIOD",
      dataIndex: "period",
      key: "period",
      width: 120,
    },
    {
      title: "VOLUME (m³)",
      dataIndex: "volume",
      key: "volume",
      width: 140,
      isNumber: true,
    },
    {
      title: "RECEIVED AT",
      dataIndex: "receivedAt",
      key: "receivedAt",
      width: 160,
    },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const menuItems = [
          {
            key: "investigate",
            label: "Investigate",
            onClick: () => handleInvestigate(record),
          },
          {
            key: "inactive",
            label: "Inactive",
            onClick: () => handleInactive(record),
          },
        ];
        const menu = <Menu items={menuItems} />;
        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <div className="cursor-pointer flex justify-center">
              <EllipsisOutlined style={{ fontSize: "18px" }} />
            </div>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <LayoutMenu grantPath={RBI_ROUTES.MONITORING_CUSTOMER_VIEW}>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex justify-between items-center -my-4">
              <p className="mt-[15px] font-bold">DETAIL PENDING TRANSACTION</p>
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
            idTable="table-detail-pending-transactions"
            dataSource={pendingTransactionsData?.result || []}
            columns={tableColumns}
            pageSize={pageSize}
            current={page}
            loading={loading}
            totalData={pendingTransactionsData?.page?.totalElements || 0}
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

export default DetailPendingTransactionsTop;
