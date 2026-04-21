import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spin, Row, Col, Select, Tabs } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import CardContainer from "../../../../components/CardContainer";
import BaseContainer from "../../../../components/BaseContainer";
import StatCard from "../../../../components/StatCard";
import ComparisonCard from "../../../../components/ComparisonCard";
import DetailStatsCard from "../../../../components/DetailStatsCard";
import DonutChartCard from "../../../../components/DonutChartCard";
import TableRBI from "../../../../components/TableRBI";
import StatusComponent from "../../../../components/StatusComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getParameters,
  getDashboardSummary,
  getFailedCustomers,
  getPriorityList,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";

const { Option } = Select;

const MonitoringCustomerPage = () => {
  const { loading, loadingKpi, loadingDashboard, periodLov, dashboardSummary, failedCustomers, priorityList } = useSelector(
    (state) => state.monitoring
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterPeriod, setFilterPeriod] = useState(null);
  const [failedRatingPage, setFailedRatingPage] = useState(1);
  const [failedBillingPage, setFailedBillingPage] = useState(1);
  const [priorityPage, setPriorityPage] = useState({
    pendingTx: 1,
    pendingApproval: 1,
    gapRating: 1,
    gapPrabilling: 1,
  });

  // Table columns definition for failed customers
  const tableColumns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, __, index) => index + 1,
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
      dataIndex: "accountName",
      key: "accountName",
      width: 160,
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
      width: 160,
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      key: "customerType",
      width: 130,
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
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      key: "accountType",
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
      width: 170,
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
      width: 170,
    },
    {
      title: "MESSAGE",
      dataIndex: "message",
      key: "message",
      width: 220,
      ellipsis: true,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 110,
      align: "center",
      fixed: "right",
      render: (text) => (
        <StatusComponent colour={text}>{text}</StatusComponent>
      ),
    },
  ];

  // Table columns factory for priority list tabs
  const makePriorityColumns = (targetRoute) => [
    {
      title: "NO",
      dataIndex: "noUrut",
      key: "noUrut",
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
      dataIndex: "accountNum",
      key: "accountNum",
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
      render: (_, record) => (
        <div
          className="flex justify-center cursor-pointer"
          onClick={() => navigate(targetRoute, { state: { period: filterPeriod, accountNumber: record.accountNum } })}
        >
          <SVGIcon name="IconDetail" width={20} height={20} style={{ cursor: "pointer" }} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getParameters());
  }, [dispatch]);

  // Set default period to the first entry once the LOV loads
  useEffect(() => {
    if (periodLov.length > 0 && filterPeriod === null) {
      setFilterPeriod(periodLov[0].value);
    }
  }, [periodLov, filterPeriod]);

  // Fetch dashboard data whenever the selected period changes
  useEffect(() => {
    if (filterPeriod) {
      dispatch(getDashboardSummary(filterPeriod));
      dispatch(getFailedCustomers({ period: filterPeriod, page: 0, size: 200 }));
      dispatch(getPriorityList(filterPeriod));
      setFailedRatingPage(1);
      setFailedBillingPage(1);
      setPriorityPage({ pendingTx: 1, pendingApproval: 1, gapRating: 1, gapPrabilling: 1 });
    }
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

  const c1Total = dashboardSummary.totMasterCustomer ?? 0;
  const c1Success = dashboardSummary.totSuccessCustomer ?? 0;
  const c1Remaining = Math.max(0, c1Total - c1Success);
  const c1Approved = c1Total > 0 ? parseFloat(((c1Success / c1Total) * 100).toFixed(1)) : 0;
  const c1Rest = c1Total > 0 ? parseFloat(((c1Remaining / c1Total) * 100).toFixed(1)) : 0;

  const c2Billing = dashboardSummary.volBilling ?? 0;
  const c2Rating = dashboardSummary.volRating ?? 0;
  const c2Master = dashboardSummary.volMasterUsage ?? 0;
  const c2Total = c2Billing + c2Rating + c2Master;
  const c2BillingPct = c2Total > 0 ? parseFloat(((c2Billing / c2Total) * 100).toFixed(1)) : 0;
  const c2RatingPct = c2Total > 0 ? parseFloat(((c2Rating / c2Total) * 100).toFixed(1)) : 0;
  const c2MasterPct = c2Total > 0 ? parseFloat(((c2Master / c2Total) * 100).toFixed(1)) : 0;

  const c3Total = dashboardSummary.totMasterData ?? 0;
  const c3Processed = dashboardSummary.totProcessedData ?? 0;
  const c3Remaining = Math.max(0, c3Total - c3Processed);
  const c3ProcessedPct = c3Total > 0 ? parseFloat(((c3Processed / c3Total) * 100).toFixed(1)) : 0;
  const c3RestPct = c3Total > 0 ? parseFloat(((c3Remaining / c3Total) * 100).toFixed(1)) : 0;

  return (
    <LayoutMenu>
      <Spin spinning={loading || loadingKpi}>
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
              {periodLov.map((p) => (
                <Option key={p.value} value={p.value}>
                  {p.label}
                </Option>
              ))}
            </Select>
          </div>

          {/* Dashboard KPI + Charts: wrapped in its own Spin for dashboard-summary API */}
          <Spin spinning={loadingDashboard}>
            <>
            {/* Top Stats Cards - Total Success & Total Failed */}
            <Row gutter={[12, 12]} className="mb-3">
            <Col xs={24} sm={12}>
              <StatCard
                title="TOTAL SUCCESS RATING LIST"
                value={dashboardSummary.totalSuccessRating ?? 0}
                percentage={80}
                isPositive={true}
                type="success"
              />
            </Col>
            <Col xs={24} sm={12}>
              <StatCard
                title="TOTAL FAILED RATING LIST"
                value={dashboardSummary.totalFailedRating ?? 0}
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
                  count: dashboardSummary.totPraBilling ?? 0,
                  valueUsage: dashboardSummary.volMasterUsage ?? 0,
                }}
                rightColumn={{
                  title: "Rating",
                  count: dashboardSummary.totRating ?? 0,
                  valueUsage: dashboardSummary.volRating ?? 0,
                }}
                onSeeDetails={() => navigate(RBI_ROUTES.MONITORING_CUSTOMER_PRA_BILLING_VS_RATING, { state: { period: filterPeriod } })}
              />
            </Col>
            <Col xs={24} lg={12}>
              <ComparisonCard
                title="RATING VS BILLING"
                leftColumn={{
                  title: "Rating",
                  count: dashboardSummary.totRating ?? 0,
                  valueUsage: dashboardSummary.volRating ?? 0,
                }}
                rightColumn={{
                  title: "Billing",
                  count: dashboardSummary.totBilling ?? 0,
                  valueUsage: dashboardSummary.volBilling ?? 0,
                }}
                onSeeDetails={() => navigate(RBI_ROUTES.MONITORING_CUSTOMER_RATING_VS_BILLING, { state: { period: filterPeriod } })}
              />
            </Col>
          </Row>

          {/* Detail Stats Cards - 4 Sections */}
          <Row gutter={[12, 12]}>
            <Col xs={24} lg={12}>
              <DetailStatsCard
                title="TOTAL CUSTOMER NEED TO PROCESSED"
                totalValue={(dashboardSummary.totPraBilling ?? 0) + (dashboardSummary.totRating ?? 0) + (dashboardSummary.totBilling ?? 0)}
                details={[
                  { label: "Pra-Billing", value: dashboardSummary.totPraBilling ?? 0 },
                  { label: "Rating", value: dashboardSummary.totRating ?? 0 },
                  { label: "Billing", value: dashboardSummary.totBilling ?? 0 },
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <DetailStatsCard
                title="TOTAL CUSTOMER IN EACH STAGE NOT APPROVED YET"
                totalValue={dashboardSummary.stageNotApprovedTotal ?? 0}
                details={[
                  { label: "Master", value: dashboardSummary.stageNotApprovedMaster ?? 0 },
                  { label: "Pra-Billing", value: dashboardSummary.stageNotApprovedPraBilling ?? 0 },
                  { label: "Rating", value: dashboardSummary.stageNotApprovedRating ?? 0 },
                  { label: "Billing", value: dashboardSummary.stageNotApprovedBilling ?? 0 },
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <DetailStatsCard
                title="GAP PRA-BILLING VS MASTER"
                totalValue={dashboardSummary.grandTotalGap ?? 0}
                percentage={80}
                isPositive={false}
                type="warning"
                details={[
                  { label: "Usage", value: dashboardSummary.totalGapUsage ?? 0 },
                  { label: "Price", value: dashboardSummary.totalGapPrice ?? 0 },
                  { label: "Promo", value: dashboardSummary.totalGapPromo ?? 0 },
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <DetailStatsCard
                title="TOTAL ERROR PROCESS"
                totalValue={dashboardSummary.grandTotalError ?? 0}
                percentage={35}
                isPositive={true}
                type="error"
                details={[
                  { label: "Master", value: dashboardSummary.errMaster ?? 0 },
                  { label: "Pra-Billing", value: dashboardSummary.errPraBill ?? 0 },
                  { label: "Rating", value: dashboardSummary.errRating ?? 0 },
                  { label: "Billing", value: dashboardSummary.errBilling ?? 0 },
                ]}
              />
            </Col>
          </Row>

          {/* Donut Charts - Comparison Charts */}
          <Row gutter={[12, 12]} className="mt-3">
            <Col xs={24} lg={8}>
              <DonutChartCard
                title="COMPARISON OF THE NUMBER OF SUCCESSFUL CUSTOMER"
                data={[c1Approved, c1Rest]}
                labels={["Approved", "Not Yet Approved"]}
                colors={["#1C8CCC", "#FF8C42"]}
              />
            </Col>
            <Col xs={24} lg={8}>
              <DonutChartCard
                title="COMPARISON OF MEASURE QUANTITIES"
                data={[c2BillingPct, c2RatingPct, c2MasterPct]}
                labels={["Billing", "Rating", "Master Usage"]}
                colors={["#1C8CCC", "#FF8C42", "#4CAF51"]}
              />
            </Col>
            <Col xs={24} lg={8}>
              <DonutChartCard
                title="COMPARISON OF DATA FOR EACH COMPONENT"
                data={[c3ProcessedPct, c3RestPct]}
                labels={["Approved", "Not Yet Processed"]}
                colors={["#1C8CCC", "#FF8C42"]}
              />
            </Col>
          </Row>
            </>
          </Spin>

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
                            dataSource={failedCustomers.result
                              .filter((r) => r.failPhase && r.failPhase.toLowerCase().includes("rating"))
                              .slice((failedRatingPage - 1) * 10, failedRatingPage * 10)
                            }
                            columns={tableColumns}
                            pageSize={10}
                            current={failedRatingPage}
                            loading={loadingKpi}
                            totalData={failedCustomers.result.filter((r) => r.failPhase && r.failPhase.toLowerCase().includes("rating")).length}
                            tableScrolled={{ x: "max-content" }}
                            usePagination={true}
                            useSelect={true}
                            showAdvanceSearch={true}
                            showSearchBar={true}
                            onChange={(p) => setFailedRatingPage(p)}
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
                            dataSource={failedCustomers.result
                              .filter((r) => r.failPhase && r.failPhase.toLowerCase().includes("billing"))
                              .slice((failedBillingPage - 1) * 10, failedBillingPage * 10)
                            }
                            columns={tableColumns}
                            pageSize={10}
                            current={failedBillingPage}
                            loading={loadingKpi}
                            totalData={failedCustomers.result.filter((r) => r.failPhase && r.failPhase.toLowerCase().includes("billing")).length}
                            tableScrolled={{ x: "max-content" }}
                            usePagination={true}
                            useSelect={true}
                            showAdvanceSearch={true}
                            showSearchBar={true}
                            onChange={(p) => setFailedBillingPage(p)}
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
                      dataSource={priorityList.priorPendingTransactions.slice((priorityPage.pendingTx - 1) * 5, priorityPage.pendingTx * 5)}
                      columns={makePriorityColumns(RBI_ROUTES.MONITORING_CUSTOMER_DETAIL_PENDING_TRANSACTIONS)}
                      pageSize={5}
                      current={priorityPage.pendingTx}
                      loading={loading}
                      totalData={priorityList.priorPendingTransactions.length}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={true}
                      useSelect={false}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                      onChange={(p) => setPriorityPage((prev) => ({ ...prev, pendingTx: p }))}
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
                      dataSource={priorityList.priorApprovalBatches.slice((priorityPage.pendingApproval - 1) * 5, priorityPage.pendingApproval * 5)}
                      columns={makePriorityColumns(RBI_ROUTES.MONITORING_CUSTOMER_DETAIL_PENDING_APPROVALS)}
                      pageSize={5}
                      current={priorityPage.pendingApproval}
                      loading={loading}
                      totalData={priorityList.priorApprovalBatches.length}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={true}
                      useSelect={false}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                      onChange={(p) => setPriorityPage((prev) => ({ ...prev, pendingApproval: p }))}
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
                      dataSource={priorityList.priorGapRatingBilling.slice((priorityPage.gapRating - 1) * 5, priorityPage.gapRating * 5)}
                      columns={makePriorityColumns(RBI_ROUTES.MONITORING_CUSTOMER_RATING_VS_BILLING)}
                      pageSize={5}
                      current={priorityPage.gapRating}
                      loading={loading}
                      totalData={priorityList.priorGapRatingBilling.length}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={true}
                      useSelect={false}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                      onChange={(p) => setPriorityPage((prev) => ({ ...prev, gapRating: p }))}
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
                      dataSource={priorityList.priorGapPrabillingMaster.slice((priorityPage.gapPrabilling - 1) * 5, priorityPage.gapPrabilling * 5)}
                      columns={makePriorityColumns(RBI_ROUTES.MONITORING_CUSTOMER_DETAIL_GAP_PRA_BILLING_MASTER)}
                      pageSize={5}
                      current={priorityPage.gapPrabilling}
                      loading={loading}
                      totalData={priorityList.priorGapPrabillingMaster.length}
                      tableScrolled={{ x: "max-content" }}
                      usePagination={true}
                      useSelect={false}
                      showAdvanceSearch={false}
                      showSearchBar={false}
                      onChange={(p) => setPriorityPage((prev) => ({ ...prev, gapPrabilling: p }))}
                    />
                  </div>
                ),
              },
            ]}
          />
        </CardContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default MonitoringCustomerPage;
