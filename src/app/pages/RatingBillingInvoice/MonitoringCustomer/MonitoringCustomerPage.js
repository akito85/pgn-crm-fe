import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Row, Col, Card, Statistic, Input, Select } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import SVGIcon from "../../../../assets/Icon/index";
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

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <BaseContainer header={"Dashboard Monitoring Customer"}>
          {/* Filters */}
          <div className="w-full mb-4">
            <Row gutter={[16, 16]} align="middle">
            <Col>
              <span style={{ fontWeight: 500 }}>Periode:</span>
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
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
              Summary:
            </p>
            <Row gutter={[16, 16]}>
              {/* Card 1: Pending Transactions */}
              <Col xs={24} sm={12} lg={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    hoverable
                    onClick={() => handleCardClick("pendingTransactions")}
                    style={{
                      borderLeft: "4px solid #faad14",
                      cursor: "pointer",
                    }}
                  >
                    <Statistic
                      title="Pending Transactions"
                      value={summaryData.pendingTransactions}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Card>
                </motion.div>
              </Col>

              {/* Card 2: Pending Approvals */}
              <Col xs={24} sm={12} lg={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    hoverable
                    onClick={() => handleCardClick("pendingApprovals")}
                    style={{
                      borderLeft: "4px solid #1890ff",
                      cursor: "pointer",
                    }}
                  >
                    <Statistic
                      title="Pending Approvals"
                      value={summaryData.pendingApprovals}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </motion.div>
              </Col>

              {/* Card 3: Gap Rating vs Billing */}
              <Col xs={24} sm={12} lg={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    hoverable
                    onClick={() => handleCardClick("gapRatingBilling")}
                    style={{
                      borderLeft: "4px solid #f5222d",
                      cursor: "pointer",
                    }}
                  >
                    <Statistic
                      title="Gap Rating vs Billing"
                      value={summaryData.gapRatingBilling}
                      prefix={<WarningOutlined />}
                      valueStyle={{ color: "#f5222d" }}
                    />
                  </Card>
                </motion.div>
              </Col>

              {/* Card 4: Gap Pra-Billing vs Master */}
              <Col xs={24} sm={12} lg={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    hoverable
                    onClick={() => handleCardClick("gapPraBillingMaster")}
                    style={{
                      borderLeft: "4px solid #722ed1",
                      cursor: "pointer",
                    }}
                  >
                    <Statistic
                      title="Gap Pra-Billing vs Master"
                      value={summaryData.gapPraBillingMaster}
                      prefix={<SyncOutlined />}
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>

          {/* Trend Chart */}
          <div className="w-full mb-8">
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
              Chart: Grafik Tren Anomali
            </p>
            <Card>
              <TrendChart data={trendData} />
            </Card>
          </div>

          {/* Priority List */}
          <div className="w-full mt-8">
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
              Priority List: Top Anomalies by Account
            </p>
            <Card>
              <PriorityList
                data={priorityList}
                onItemClick={handleCardClick}
              />
            </Card>
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default MonitoringCustomerPage;