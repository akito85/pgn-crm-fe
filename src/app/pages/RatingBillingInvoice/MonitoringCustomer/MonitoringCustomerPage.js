import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Row, Col, Select } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getSummaryData,
  getTrendData,
  getPriorityList,
  asyncDataMart,
  getListBillingPeriod
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import TrendChart from "../../../../components/TrendChart";
import PriorityList from "../../../../components/PriorityList";
import DetailPendingTransactions from "./DetailPendingTransactions";
import DetailPendingApprovals from "./DetailPendingApprovals";
import DetailGapRatingBilling from "./DetailGapRatingBilling";
import DetailGapPraBillingMaster from "./DetailGapPraBillingMaster";

const { Option } = Select;

const MonitoringCustomerPage = () => {

  const { loading, summaryData, trendData, priorityList, list_billing_period } = useSelector(
    (state) => state.monitoring
  );

  const dispatch = useDispatch();

  const [filterPeriod, setFilterPeriod] = useState(340);
  const [detailView, setDetailView] = useState(null);

  useEffect(() => {
    dispatch(getListBillingPeriod());
    dispatch(getSummaryData());
    dispatch(getTrendData(filterPeriod));
    dispatch(getPriorityList());
  }, [filterPeriod, dispatch]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_CUSTOMER_VIEW,
      breadcrumbName: "Monitoring Customer",
    },
  ];

  const handleAsyncDataMart = () => {
    dispatch(asyncDataMart());
  };

  const handleCardClick = (type) => {
    setDetailView(type);
  };

  const handleBackToDashboard = () => {
    setDetailView(null);
    dispatch(getSummaryData());
    dispatch(getTrendData(filterPeriod));
    dispatch(getPriorityList());
  };

  const renderDetailView = () => {
    switch (detailView) {
      case "pendingTransactions":
        return (
          <DetailPendingTransactions
            filterPeriod={filterPeriod}
            handleBack={handleBackToDashboard}
          />
        );
      case "pendingApprovals":
        return (
          <DetailPendingApprovals
            filterPeriod={filterPeriod}
            handleBack={handleBackToDashboard}
          />
        );
      case "gapRatingBilling":
        return (
          <DetailGapRatingBilling
            filterPeriod={filterPeriod}
            handleBack={handleBackToDashboard}
          />
        );
      case "gapPraBillingMaster":
        return (
          <DetailGapPraBillingMaster
            filterPeriod={filterPeriod}
            handleBack={handleBackToDashboard}
          />
        );
      default:
        return null;
    }
  };

  if (detailView) {
    return renderDetailView();
  }

  // Card configuration dengan data dari desain
  const cardData = [
    {
      key: "pendingTransactions",
      title: "Pending Transactions",
      value: summaryData.pendingTransactions || 312,
      icon: <ClockCircleOutlined />,
      iconColor: "#FF9800",
      totalAvg: 53.3,
      percentage: 32.8,
      isPositive: true,
    },
    {
      key: "pendingApprovals",
      title: "Pending Approvals",
      value: summaryData.pendingApprovals || 240,
      icon: <CheckCircleOutlined />,
      iconColor: "#2196F3",
      totalAvg: 37.5,
      percentage: 14.78,
      isPositive: false,
    },
    {
      key: "gapRatingBilling",
      title: "Gap Rating vs Billing",
      value: summaryData.gapRatingBilling || 273,
      icon: <WarningOutlined />,
      iconColor: "#F44336",
      totalAvg: 45,
      percentage: 90,
      isPositive: false,
    },
    {
      key: "gapPraBillingMaster",
      title: "Gap Pra Billing vs Master",
      value: summaryData.gapPraBillingMaster || 228,
      icon: <SyncOutlined />,
      iconColor: "#9E9E9E",
      totalAvg: 32.5,
      percentage: 32.8,
      isPositive: true,
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        {/* Card Container Pertama: Dashboard Summary & Chart */}
        <CardContainer 
          header={
            <div className="flex justify-between items-center -my-4">
              <p className="mt-[15px] font-bold">Dashboard Monitoring Customer</p>
            </div>
          }
        >
          {/* Filters */}
          <div className="w-full mb-6 mt-4">
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <span style={{ fontWeight: 500 }}>Period:</span>
              </Col>
              <Col>
                <Select
                  placeholder="Select Period"
                  value={filterPeriod}
                  onChange={(value) => setFilterPeriod(value)}
                  style={{ width: 200 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {list_billing_period.map((period) => (
                    <Option key={period.id} value={period.id}>
                      {period.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <ButtonComponent
                  icon={<SyncOutlined />}
                  type="primary"
                  onClick={handleAsyncDataMart}
                >
                  Async Data Mart
                </ButtonComponent>
              </Col>
            </Row>
          </div>

          {/* Summary Cards */}
          <div className="w-full mb-6">
            <Row gutter={[12, 12]}>
              {cardData.map((card) => (
                <Col xs={24} sm={12} lg={6} key={card.key}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      onClick={() => handleCardClick(card.key)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#FAFAFA",
                        border: "none",
                        borderRadius: "6px",
                        padding: "14px 16px",
                        minHeight: "100px",
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                      className="hover:bg-gray-100"
                    >
                      {/* Header: Icon + Title + Arrow */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div style={{ fontSize: 18, color: card.iconColor }}>
                            {card.icon}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#595959",
                              fontWeight: 400,
                            }}
                          >
                            {card.title}
                          </div>
                        </div>
                        <div style={{ fontSize: 16, color: "#bfbfbf" }}>
                          →
                        </div>
                      </div>

                      {/* Value */}
                      <div
                        style={{
                          fontSize: 32,
                          fontWeight: 700,
                          color: "#262626",
                          marginBottom: 6,
                          lineHeight: 1.2,
                        }}
                      >
                        {card.value.toLocaleString()}
                      </div>

                      {/* Footer Info */}
                      <div className="flex justify-between items-center">
                        <div style={{ fontSize: 11, color: "#8c8c8c" }}>
                          Total Avg: {card.totalAvg}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: card.isPositive ? "#52c41a" : "#f5222d",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          {card.isPositive ? (
                            <ArrowUpOutlined style={{ fontSize: 10 }} />
                          ) : (
                            <ArrowDownOutlined style={{ fontSize: 10 }} />
                          )}
                          {card.percentage}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Trend Chart */}
          <div className="w-full">
            <TrendChart data={trendData} />
          </div>
        </CardContainer>

        {/* Card Container Kedua: Priority List */}
        <div className="mt-6">
          <CardContainer 
            header={
              <div className="flex justify-between items-center -my-4">
                <p className="mt-[15px] font-bold">Priority List: Top 5 Anomalies</p>
              </div>
            }
          >
            <div className="my-5">
              <PriorityList
                data={priorityList}
                onItemClick={handleCardClick}
              />
            </div>
          </CardContainer>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default MonitoringCustomerPage;