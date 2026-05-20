import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Row, Col, Select, Tabs } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import BaseContainer from "../../../../components/BaseContainer";
import StatCard from "../../../../components/StatCard";
import ComparisonCard from "../../../../components/ComparisonCard";
import DetailStatsCard from "../../../../components/DetailStatsCard";
import DonutChartCard from "../../../../components/DonutChartCard";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getSummaryData,
  getListBillingPeriod,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";

const { Option } = Select;

const MonitoringCustomerPage = () => {
  const { loading, summaryData, list_billing_period } = useSelector(
    (state) => state.monitoring
  );

  const dispatch = useDispatch();

  const [filterPeriod, setFilterPeriod] = useState(340);

  // Table columns definition for failed customers
  const tableColumns = [
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 140,
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      key: "accountName",
      width: 150,
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      key: "customerNumber",
      width: 150,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      key: "customerType",
      width: 130,
    },
    {
      title: "SOR",
      dataIndex: "sor",
      key: "sor",
      width: 100,
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      key: "costCenter",
      width: 120,
    },
    {
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      key: "meterReadingCode",
      width: 160,
    },
    {
      title: "ACCOUNT SEGMENT",
      dataIndex: "accountSegment",
      key: "accountSegment",
      width: 150,
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      key: "accountGroupType",
      width: 160,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      key: "classificationType",
      width: 160,
    },
    {
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      key: "accountType",
      width: 130,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 100,
    },
    {
      title: "MESSAGE",
      dataIndex: "message",
      key: "message",
      width: 200,
    },
  ];

  // Table columns definition for priority list
  const priorityListColumns = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 80,
      align: "center",
    },
    {
      title: "RANK",
      dataIndex: "rank",
      key: "rank",
      width: 100,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 200,
    },
    {
      title: "COUNT",
      dataIndex: "count",
      key: "count",
      width: 150,
      align: "right",
      isNumber: true,
    },
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      width: 100,
      align: "center",
      fixed: "right",
      render: () => (
        <div className="flex justify-center">
          <SVGIcon name="iconDetail" style={{ cursor: "pointer" }} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getListBillingPeriod());
    dispatch(getSummaryData());
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

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        {/* Main Card Container: Monitoring Billing Process */}
        <CardContainer header="MONITORING BILLING PROCESS">
          {/* Period Filter */}
          <div className="mb-3">
            <Select
              placeholder="Select Period"
              value={filterPeriod}
              onChange={(value) => setFilterPeriod(value)}
              style={{ width: 200 }}
              size="small"
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
          </div>

          {/* Top Stats Cards - Total Success & Total Failed */}
          <Row gutter={[12, 12]} className="mb-3">
            <Col xs={24} sm={12}>
              <StatCard
                title="TOTAL SUCCESS RATING LIST"
                value={summaryData.totalSuccessRating || 3000}
                percentage={80}
                isPositive={true}
                type="success"
              />
            </Col>
            <Col xs={24} sm={12}>
              <StatCard
                title="TOTAL FAILED RATING LIST"
                value={summaryData.totalFailedRating || 7867}
                percentage={35}
                isPositive={true}
                type="failed"
              />
            </Col>
          </Row>

          {/* Comparison Cards - PRA-BILLING VS RATING & RATING VS BILLING */}
          <Row gutter={[12, 12]} className="mb-3">
            <Col xs={24} lg={12}>
              <ComparisonCard
                title="PRA-BILLING VS RATING"
                leftColumn={{
                  title: "Pra-Billing",
                  count: summaryData.praBillingCount || 8097,
                  valueUsage: summaryData.praBillingValue || 26908,
                }}
                rightColumn={{
                  title: "Rating",
                  count: summaryData.ratingCount || 12908,
                  valueUsage: summaryData.ratingValue || 11908,
                }}
              />
            </Col>
            <Col xs={24} lg={12}>
              <ComparisonCard
                title="RATING VS BILLING"
                leftColumn={{
                  title: "Rating",
                  count: summaryData.ratingCount2 || 12908,
                  valueUsage: summaryData.ratingValue2 || 11908,
                }}
                rightColumn={{
                  title: "Billing",
                  count: summaryData.billingCount || 60678,
                  valueUsage: summaryData.billingValue || 120008,
                }}
              />
            </Col>
          </Row>

          {/* Detail Stats Cards - 4 Sections */}
          <Row gutter={[12, 12]}>
            <Col xs={24} lg={12}>
              <DetailStatsCard
                title="TOTAL CUSTOMER NEED TO PROCESSED"
                totalValue={summaryData.customerNeedProcessed || 312}
                details={[
                  { label: "Pra-Billing", value: 28 },
                  { label: "Rating", value: 12 },
                  { label: "Billing", value: 272 },
                  { label: "", value: "" },
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <DetailStatsCard
                title="TOTAL CUSTOMER IN EACH STAGE NOT APPROVED YET"
                totalValue={summaryData.customerNotApproved || 312}
                details={[
                  { label: "Master", value: 28 },
                  { label: "Pra-Billing", value: 12 },
                  { label: "Rating", value: 272 },
                  { label: "Billing", value: 272 },
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <DetailStatsCard
                title="GAP PRA-BILLING VS MASTER"
                totalValue={summaryData.gapPraBillingMaster || 3000}
                percentage={80}
                isPositive={false}
                details={[
                  { label: "Usage", value: 1800 },
                  { label: "Price", value: 870 },
                  { label: "Promo", value: 330 },
                  { label: "", value: "" },
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <DetailStatsCard
                title="TOTAL ERROR PROCESS"
                totalValue={summaryData.totalErrorProcess || 7867}
                percentage={35}
                isPositive={true}
                details={[
                  { label: "Master", value: 1578 },
                  { label: "Pra-Billing", value: 2356 },
                  { label: "Rating", value: 1879 },
                  { label: "Billing", value: 2065 },
                ]}
              />
            </Col>
          </Row>

          {/* Donut Charts - Comparison Charts */}
          <Row gutter={[12, 12]} className="mt-3">
            <Col xs={24} lg={8}>
              <DonutChartCard
                title="COMPARISON OF THE NUMBER OF SUCCESSFUL CUSTOMER"
                data={[60, 40]}
                labels={["Pra-billing, Rating, Billing, Approved", "Master"]}
                colors={["#1C8CCC", "#FF8C42"]}
              />
            </Col>
            <Col xs={24} lg={8}>
              <DonutChartCard
                title="COMPARISON OF MEASURE QUANTITIES"
                data={[25, 35, 40]}
                labels={["Billing", "Rating", "Master Usage"]}
                colors={["#1C8CCC", "#FF8C42", "#4CAF51"]}
              />
            </Col>
            <Col xs={24} lg={8}>
              <DonutChartCard
                title="COMPARISON OF DATA FOR EACH COMPONENT"
                data={[35, 65]}
                labels={["Pra-billing, Rating, Billing, Approved", "Master"]}
                colors={["#1C8CCC", "#FF8C42"]}
              />
            </Col>
          </Row>

          {/* Table Section with Tabs */}
          <div className="mt-3">
            <BaseContainer
              border={true}
              header="LIST OF CUSTOMERS WHO FAILED IN RATING AND BILLING PROCESS"
              type="tabs"
              element={
                <Tabs
                  defaultActiveKey="1"
                  size="small"
                  items={[
                    {
                      key: "1",
                      label: "Rating Failed",
                      children: (
                        <div className="pb-3">
                          <TableRBI
                            idTable="table-rating-failed"
                            dataSource={[]}
                            columns={tableColumns}
                            pageSize={10}
                            current={1}
                            loading={false}
                            totalData={0}
                            tableScrolled={{ x: "max-content" }}
                            usePagination={true}
                            useSelect={true}
                            showAdvanceSearch={true}
                            showSearchBar={true}
                          />
                        </div>
                      ),
                    },
                    {
                      key: "2",
                      label: "Billing Failed",
                      children: (
                        <div className="pb-3">
                          <TableRBI
                            idTable="table-billing-failed"
                            dataSource={[]}
                            columns={tableColumns}
                            pageSize={10}
                            current={1}
                            loading={false}
                            totalData={0}
                            tableScrolled={{ x: "max-content" }}
                            usePagination={true}
                            useSelect={true}
                            showAdvanceSearch={true}
                            showSearchBar={true}
                          />
                        </div>
                      ),
                    },
                  ]}
                />
              }
            />
          </div>
        </CardContainer>

        {/* Priority List: Top 5 Anomalies */}
        <CardContainer header="PRIORITY LIST: TOP 5 ANOMALIES">
          <Tabs
            defaultActiveKey="1"
            size="small"
            animated={false}
            items={[
              {
                key: "1",
                label: "Pending Transactions",
                children: (
                  <div className="pb-3">
                    <TableRBI
                      idTable="table-pending-transactions"
                      dataSource={[]}
                      columns={priorityListColumns}
                      pageSize={5}
                      current={1}
                      loading={false}
                      totalData={0}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={false}
                      useSelect={false}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                    />
                  </div>
                ),
              },
              {
                key: "2",
                label: "Pending Approvals",
                children: (
                  <div className="pb-3">
                    <TableRBI
                      idTable="table-pending-approvals"
                      dataSource={[]}
                      columns={priorityListColumns}
                      pageSize={5}
                      current={1}
                      loading={false}
                      totalData={0}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={false}
                      useSelect={false}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                    />
                  </div>
                ),
              },
              {
                key: "3",
                label: "Gap Rating vs Billing",
                children: (
                  <div className="pb-3">
                    <TableRBI
                      idTable="table-gap-rating-billing"
                      dataSource={[]}
                      columns={priorityListColumns}
                      pageSize={5}
                      current={1}
                      loading={false}
                      totalData={0}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={false}
                      useSelect={false}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                    />
                  </div>
                ),
              },
              {
                key: "4",
                label: "Gap Pra-Billing vs Master",
                children: (
                  <div className="pb-3">
                    <TableRBI
                      idTable="table-gap-prabilling-master"
                      dataSource={[]}
                      columns={priorityListColumns}
                      pageSize={5}
                      current={1}
                      loading={false}
                      totalData={0}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={false}
                      useSelect={false}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                    />
                  </div>
                ),
              },
            ]}
          />
        </CardContainer>
      </Spin>
    </>
  );
};

export default MonitoringCustomerPage;
