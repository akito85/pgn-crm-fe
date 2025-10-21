import React, { useState, useEffect, useMemo } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Spin, Card, Statistic, Row, Col, Tag } from "antd";
import {
  FileTextOutlined,
  ThunderboltOutlined,
  PercentageOutlined,
  DashboardOutlined,
  DollarOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { getCustomerAccountDetail } from "../../../../../redux/slices/rating_billing_invoice/praBilling";

const { TabPane } = Tabs;

const AccountDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    customerNumber, 
    billPeriod, 
    inSor,
    accNumber,
    saNumber  
  } = location.state || {};
  
  const { customer_account_detail, loading_customer_detail } = useSelector(
    (state) => state.rbi_prabilling
  );

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: RBI_ROUTES.PRABILLING_DETAIL, breadcrumbName: "Prabilling" },
    { path: "", breadcrumbName: "Customer Detail" },
  ];

  useEffect(() => {
    if (!customerNumber || !billPeriod || !inSor) {
      console.error('Missing required parameters');
      return;
    }

    const params = {
      customerNumber,
      billPeriod,
      inSor,
      accNumber,  
      saNumber, 
      page: 0,
      size: 100,
    }

    dispatch(getCustomerAccountDetail(params));
  }, [dispatch, customerNumber, billPeriod, inSor, accNumber, saNumber]);

  const usageData = customer_account_detail?.usageData || [];
  const taxData = customer_account_detail?.taxData || [];
  const pricingData = customer_account_detail?.pricingData || [];
  const saData = customer_account_detail?.saData || [];
  
  const headerData = customer_account_detail?.rawContent?.[0] || {};

  const summary = useMemo(() => {
    const totalEnergy = usageData.reduce((sum, item) => 
      sum + (parseFloat(item.engMeasured) || 0), 0
    );
    const totalVolume = usageData.reduce((sum, item) => 
      sum + (parseFloat(item.volMeasured60) || 0), 0
    );
    const uniqueDates = usageData.length;
    
    return {
      totalEnergy: totalEnergy.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      totalVolume: totalVolume.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      uniqueMeasurements: uniqueDates,
      totalTaxRecords: taxData.length,
      totalPricingTiers: pricingData.length,
      avgEnergyPerMeasurement: uniqueDates > 0 ? 
        (totalEnergy / uniqueDates).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0'
    };
  }, [usageData, taxData, pricingData]);

  const renderAccountHeader = () => (
    <BaseContainer header="ACCOUNT INFORMATION">
      <div className="grid grid-cols-4 gap-4">
        <DetailText label="Customer Number">
          {headerData.customerNumber || "-"}
        </DetailText>
        <DetailText label="Account Number">
          {headerData.accountNumber || "-"}
        </DetailText>
        <DetailText label="Account Name">
          {headerData.accountName || "-"}
        </DetailText>
        <DetailText label="Account Status">
          {headerData.accountStatus || "-"}
        </DetailText>

        <DetailText label="Account Group">
          {headerData.accountGroup || "-"}
        </DetailText>
        <DetailText label="SOR">{headerData.sor || "-"}</DetailText>
        <DetailText label="Cost Center">
          {headerData.accountCostCenter || "-"}
        </DetailText>
        <DetailText label="Meter Reading Code">
          {headerData.meterReadingCode || "-"}
        </DetailText>

        <DetailText label="Account Segment">
          {headerData.accountSegment || "-"}
        </DetailText>
        <DetailText label="Account Group Type">
          {headerData.accountGroupType || "-"}
        </DetailText>
        <DetailText label="Account Type">
          {headerData.accountType || "-"}
        </DetailText>
        <DetailText label="Billing Cycle">
          {headerData.billingCycle || "-"}
        </DetailText>

        <DetailText label="Bill Period">
          {headerData.billPeriod || "-"}
        </DetailText>
        <DetailText label="Customer Type">
          {headerData.customerType || "-"}
        </DetailText>
        <DetailText label="SA Number">
          {headerData.saNumber || "-"}
        </DetailText>
        <DetailText label="Invoice Template">
          {headerData.invoiceTemplate || "-"}
        </DetailText>
      </div>
    </BaseContainer>
  );

  const renderSummary = () => (
    <BaseContainer header="SUMMARY STATISTICS">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Energy Measured"
              value={summary.totalEnergy}
              suffix="MMBTU"
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Volume"
              value={summary.totalVolume}
              suffix="m³"
              prefix={<DashboardOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Unique Measurements"
              value={summary.uniqueMeasurements}
              suffix="dates"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Energy/Measurement"
              value={summary.avgEnergyPerMeasurement}
              suffix="MMBTU"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tax Records"
              value={summary.totalTaxRecords}
              prefix={<PercentageOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pricing Tiers"
              value={summary.totalPricingTiers}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Service Agreements"
              value={saData.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </BaseContainer>
  );

  // Usage Data Columns
  const usageColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      fixed: "left",
      render: (text, object, index) => index + 1,
    },
    {
      title: "MEAS DATE",
      dataIndex: "measDate",
      width: 120,
      align: "center",
      fixed: "left",
    },
    {
      title: "ASSET SERIAL",
      dataIndex: "assetSerialNum",
      width: 130,
      align: "center",
    },
    {
      title: "ASSET TYPE",
      dataIndex: "assetType",
      width: 120,
      align: "center",
    },
    {
      title: "USAGE INIT CODE",
      dataIndex: "usageInitCode",
      width: 130,
      align: "center",
    },
    {
      title: "BEGIN STAND",
      dataIndex: "beginStand",
      width: 130,
      align: "right",
      render: (val) => val || "-",
    },
    {
      title: "END STAND",
      dataIndex: "endStand",
      width: 130,
      align: "right",
      render: (val) => val || "-",
    },
    {
      title: "ENG MEASURED",
      dataIndex: "engMeasured",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString('en-US', { maximumFractionDigits: 4 }) : "-",
    },
    {
      title: "VOL MEASURED 27",
      dataIndex: "volMeasured27",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString() : "-",
    },
    {
      title: "VOL MEASURED 60",
      dataIndex: "volMeasured60",
      width: 150,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString() : "-",
    },
    {
      title: "CALORIE",
      dataIndex: "calorie",
      width: 120,
      align: "right",
      render: (val) => val || "-",
    },
    {
      title: "STREAM",
      dataIndex: "stream",
      width: 80,
      align: "center",
    },
    {
      title: "TAXATION",
      dataIndex: "taxation",
      width: 100,
      align: "center",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 200,
    },
  ], []);

  // Tax Implementation Columns
  const taxColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 100,
      align: "center",
    },
    {
      title: "TAX NAME",
      dataIndex: "taxImpName",
      width: 300,
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      width: 120,
      align: "center",
    },
    {
      title: "IMP TYPE",
      dataIndex: "impType",
      width: 120,
      align: "center",
    },
    {
      title: "GUNGGUNG",
      dataIndex: "gunggung",
      width: 100,
      align: "center",
    },
    {
      title: "RATING CODE",
      dataIndex: "ratingCode",
      width: 150,
      render: (val) => val || "-",
    },
  ], []);

  // Pricing Tier Columns
  const pricingColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "LINE",
      dataIndex: "lineNumber",
      width: 80,
      align: "center",
    },
    {
      title: "PRICE CODE",
      dataIndex: "priceCode",
      width: 120,
      align: "center",
    },
    {
      title: "MIN",
      dataIndex: "min",
      width: 120,
      align: "right",
      render: (val) => val ? parseFloat(val).toLocaleString() : "-",
    },
    {
      title: "MAX",
      dataIndex: "max",
      width: 120,
      align: "center",
      render: (val) => {
        // Check if it's a price code (contains letters)
        if (val && isNaN(val)) {
          return val;
        }
        // If it's a number and equals 0 or very large, show Unlimited
        if (!val || val === "0" || parseFloat(val) === 0) {
          return "Unlimited";
        }
        return parseFloat(val).toLocaleString();
      },
    },
    {
      title: "VALUE",
      dataIndex: "value",
      width: 150,
      align: "right",
      render: (val, record) => 
        val ? `${record.priceCurrency} ${parseFloat(val).toLocaleString()}` : "-",
    },
    {
      title: "UOM",
      dataIndex: "uom",
      width: 80,
      align: "center",
    },
  ], []);

  // Service Agreement Columns
  const saColumns = useMemo(() => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "SA NUMBER",
      dataIndex: "saNumber",
      width: 150,
      fixed: "left",
    },
    {
      title: "SA REF NUMBER",
      dataIndex: "saReferenceNumber",
      width: 180,
    },
    {
      title: "SA DATE",
      dataIndex: "saDate",
      width: 150,
      align: "center",
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "saServiceType",
      width: 120,
      align: "center",
    },
    {
      title: "SA TYPE",
      dataIndex: "saType",
      width: 100,
      align: "center",
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productName",
      width: 150,
    },
    {
      title: "PRODUCT TYPE",
      dataIndex: "productType",
      width: 120,
      align: "center",
    },
    {
      title: "TERM OF PAYMENT",
      dataIndex: "termOfPayment",
      width: 130,
      align: "center",
    },
    {
      title: "PRICING RULE",
      dataIndex: "pricingRule",
      width: 180,
    },
    {
      title: "PRICING CODE",
      dataIndex: "mpricingCode",
      width: 120,
      align: "center",
    },
    {
      title: "FULL PRICE CODE",
      dataIndex: "fullPriceCode",
      width: 200,
    },
    {
      title: "IDR VALUE",
      dataIndex: "idrValue",
      width: 130,
      align: "right",
      render: (val) => val ? `IDR ${parseFloat(val).toLocaleString()}` : "-",
    },
    {
      title: "IDR UOM",
      dataIndex: "idrUom",
      width: 100,
      align: "center",
    },
    {
      title: "USD VALUE",
      dataIndex: "usdValue",
      width: 130,
      align: "right",
      render: (val) => val ? `$ ${parseFloat(val).toLocaleString()}` : "-",
    },
    {
      title: "USD UOM",
      dataIndex: "usdUom",
      width: 100,
      align: "center",
    },
  ], []);

  return (
    <Spin spinning={loading_customer_detail}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        {renderAccountHeader()}
        
        <BaseContainer header="DETAILED DATA">
          <Tabs defaultActiveKey="1" type="card">
            <TabPane
              tab={
                <span>
                  <ThunderboltOutlined /> Usage & Measurement ({usageData.length})
                </span>
              }
              key="1"
            >
              <TablePaginationNew
                columns={usageColumns}
                dataSource={usageData}
                totalData={usageData.length}
                current={1}
                pageSize={usageData.length}
                onChange={() => {}}
                tableScrolled={{ x: 2000, y: 500 }}
                rowKey={(record, index) => `usage-${index}`}
                pagination={false}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <PercentageOutlined /> Tax Implementation ({taxData.length})
                </span>
              }
              key="2"
            >
              <TablePaginationNew
                columns={taxColumns}
                dataSource={taxData}
                totalData={taxData.length}
                current={1}
                pageSize={taxData.length}
                onChange={() => {}}
                tableScrolled={{ x: 1000, y: 500 }}
                rowKey={(record, index) => `tax-${index}`}
                pagination={false}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <DollarOutlined /> Pricing Tiers ({pricingData.length})
                </span>
              }
              key="3"
            >
              <TablePaginationNew
                columns={pricingColumns}
                dataSource={pricingData}
                totalData={pricingData.length}
                current={1}
                pageSize={pricingData.length}
                onChange={() => {}}
                tableScrolled={{ x: 900, y: 500 }}
                rowKey={(record, index) => `pricing-${index}`}
                pagination={false}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FileTextOutlined /> Service Agreement ({saData.length})
                </span>
              }
              key="4"
            >
              <TablePaginationNew
                columns={saColumns}
                dataSource={saData}
                totalData={saData.length}
                current={1}
                pageSize={saData.length}
                onChange={() => {}}
                tableScrolled={{ x: 2200, y: 500 }}
                rowKey={(record, index) => `sa-${index}`}
                pagination={false}
              />
            </TabPane>
          </Tabs>
        </BaseContainer>
        <div className={"w-full flex justify-start my-5"}>
                  <ButtonComponent
                    type={"submit"}
                    border={false}
                    icon={
                      <LeftOutlined
                        style={{
                          color: "#fff",
                          fontSize: 16,
                          justifyItems: "left",
                        }}
                      />
                    }
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </ButtonComponent>
                </div>
      </LayoutMenu>
    </Spin>
  );
};

export default AccountDetailPage;