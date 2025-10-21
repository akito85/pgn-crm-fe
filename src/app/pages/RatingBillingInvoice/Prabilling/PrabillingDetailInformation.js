import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, Tabs } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { hasValue, renderColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { 
  getDetailPrabillingResult,
  downloadPrabillingResult 
} from "../../../../redux/slices/rating_billing_invoice/praBilling";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";

const { TabPane } = Tabs;

const PrabillingDetailInformation = ({ data, tabHeader }) => {
  const { detail_prabilling_result, loading } = useSelector(
    (state) => state.rbi_prabilling
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("account_group");

  // Tab States untuk pagination per tab
  const [accountGroupPage, setAccountGroupPage] = useState(1);
  const [accountSegmentPage, setAccountSegmentPage] = useState(1);
  const [costCenterPage, setCostCenterPage] = useState(1);
  const [meterReadingPage, setMeterReadingPage] = useState(1);

  useEffect(() => {
    if (tabHeader === "Prabilling Information" && data?.initCode) {
      console.log('Fetching data for initCode:', data.initCode);
      
      const searchParams = Object.keys(search).length > 0 ? search : {};
      
      dispatch(
        getDetailPrabillingResult({
          initCode: data.initCode,
          page,
          pageSize,
          sort,
          search: searchParams,
        })
      );
    }
  }, [tabHeader, dispatch, data?.initCode, page, pageSize, sort]);
  
  useEffect(() => {
    if (tabHeader === "Prabilling Information" && data?.initCode && Object.keys(search).length > 0) {
      console.log('Searching with filters:', search);
      
      dispatch(
        getDetailPrabillingResult({
          initCode: data.initCode,
          page,
          pageSize,
          sort,
          search,
        })
      );
    }
  }, [search]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleDownload = () => {
    if (!data?.initCode) {
      console.error('No initCode available for download');
      return;
    }
    
    console.log('Downloading data for:', data.initCode);
    dispatch(
      downloadPrabillingResult({
        initCode: data.initCode,
      })
    );
  };

  const resultColumns = useMemo(
  () => [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      fixed: "left",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "customerNumber",
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 150,
      sorter: true,
      fixed: "left",
      filteredValue: [search?.customerNumber] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerNumber",
          hasValue(search["customerNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "customerName",
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 200,
      sorter: true,
      filteredValue: [search?.customerName] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "customerName",
          hasValue(search["customerName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "no",
      title: "CUSTOMER TYPE ID",
      dataIndex: "customerTypeId",
      width: 150,
      align: "center",
      sorter: true,
    },
    {
      key: "billingCycle",
      title: "BILLING CYCLE",
      dataIndex: "billingCycle",
      width: 150,
      align: "center",
      sorter: true,
      filteredValue: [search?.billingCycle] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCycle",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "billingCycle",
          hasValue(search["billingCycle"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "billPeriod",
      title: "BILLING PERIOD",
      dataIndex: "billPeriod",
      width: 120,
      align: "center",
      sorter: true,
    },
    {
      key: "accountNumber",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 150,
      sorter: true,
      filteredValue: [search?.accountNumber] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountNumber",
          hasValue(search["accountNumber"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "accountName",
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 200,
      sorter: true,
      filteredValue: [search?.accountName] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "accountName",
          hasValue(search["accountName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      key: "accountGroup",
      title: "ACCOUNT GROUP",
      dataIndex: "accountGroup",
      width: 120,
      sorter: true,
    },
    {
      key: "accountType",
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      width: 100,
      align: "center",
      sorter: true,
    },
    {
      key: "costCenter",
      title: "COST CENTER",
      dataIndex: "costCenter",
      width: 200,
      sorter: true,
    },
    {
      key: "meterReadingCode",
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      width: 150,
      sorter: true,
    },
    {
      key: "sor",
      title: "SOR",
      dataIndex: "sor",
      width: 200,
      sorter: true,
    },
    {
      key: "accountGroupType",
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 150,
      sorter: true,
    },
    {
      key: "saNumber",
      title: "SA NUMBER",
      dataIndex: "saNumber",
      width: 150,
      sorter: true,
    },
    {
      key: "pjbgType",
      title: "PJBG TYPE",
      dataIndex: "pjbgType",
      width: 100,
      align: "center",
      sorter: true,
    },
    {
      key: "saServiceType",
      title: "SA SERVICE TYPE",
      dataIndex: "saServiceType",
      width: 120,
      align: "center",
      sorter: true,
    },
    {
      key: "saType",
      title: "SA TYPE",
      dataIndex: "saType",
      width: 120,
      align: "center",
      sorter: true,
    },
    {
      key: "termOfPayment",
      title: "TERM OF PAYMENT",
      dataIndex: "termOfPayment",
      width: 150,
      sorter: true,
    },
    {
      key: "fullPriceCode",
      title: "FULL PRICE CODE",
      dataIndex: "fullPriceCode",
      width: 250,
      sorter: true,
    },
    {
      key: "minUsage",
      title: "MIN USAGE",
      dataIndex: "minUsage",
      width: 120,
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString() || "-",
    },
    {
      key: "maxUsage",
      title: "MAX USAGE",
      dataIndex: "maxUsage",
      width: 120,
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString() || "-",
    },
    {
      key: "timeUnit",
      title: "TIME UNIT",
      dataIndex: "timeUnit",
      width: 100,
      align: "center",
      sorter: true,
    },
    {
      key: "unitMeasure",
      title: "UNIT MEASURE",
      dataIndex: "unitMeasure",
      width: 120,
      align: "center",
      sorter: true,
    },
    {
      key: "currency",
      title: "CURRENCY",
      dataIndex: "currency",
      width: 100,
      align: "center",
      sorter: true,
    },
    {
      key: "paymentType",
      title: "PAYMENT TYPE",
      dataIndex: "paymentType",
      width: 120,
      align: "center",
      sorter: true,
    },
    {
      key: "chargingMethod",
      title: "CHARGING METHOD",
      dataIndex: "chargingMethod",
      width: 150,
      align: "center",
      sorter: true,
    },
    {
      key: "avgCalorie",
      title: "AVG CALORIE",
      dataIndex: "avgCalorie",
      width: 120,
      align: "right",
      sorter: true,
      render: (text) => text?.toFixed(4) || "-",
    },
    {
      key: "firstMeasDate",
      title: "FIRST MEAS DATE",
      dataIndex: "firstMeasDate",
      width: 150,
      align: "center",
      sorter: true,
      render: (text) => text ? moment(text).format("DD MMM YYYY") : "-",
    },
    {
      key: "lastMeasDate",
      title: "LAST MEAS DATE",
      dataIndex: "lastMeasDate",
      width: 150,
      align: "center",
      sorter: true,
      render: (text) => text ? moment(text).format("DD MMM YYYY") : "-",
    },
    {
      key: "totalVol27",
      title: "TOTAL VOL 27",
      dataIndex: "totalVol27",
      width: 150,
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString() || "-",
    },
    {
      key: "totalVol60",
      title: "TOTAL VOL 60",
      dataIndex: "totalVol60",
      width: 150,
      align: "right",
      sorter: true,
      render: (text) => text?.toLocaleString() || "-",
    },
    {
      key: "mpricingCode",
      title: "MPRICING CODE",
      dataIndex: "mpricingCode",
      width: 150,
      sorter: true,
    },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      align: "center",
      fixed: "right",
      render: (text, record) => (
        <Link
          to={RBI_ROUTES.PRABILLING_DETAIL_CUSTOMER}
          state={{ 
            customerNumber: record?.customerNumber,
            billPeriod: record?.billPeriod,
            inSor: record?.sor || data?.sor,
            accNumber: record?.accountNumber,
            saNumber: record?.saNumber
          }}
        >
          <Tooltip title="View Account Detail">
            <div className="pt-1">
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        </Link>
      ),
    },
  ],
  [page, pageSize, search, searchText, searchedColumn]
);

  // Columns untuk Account Group Type Tab
  const accountGroupColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (accountGroupPage - 1) * pageSize + index + 1,
      },
      {
        title: "ACCOUNT GROUP TYPE ID",
        dataIndex: "accountGroupType",
        width: 200,
        sorter: true,
      },
      {
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 150,
      },
      {
        title: "CREATED DATE",
        dataIndex: "createdDate",
        width: 180,
        render: (text) => text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
      {
        title: "UPDATED BY",
        dataIndex: "updatedBy",
        width: 150,
      },
      {
        title: "UPDATED DATE",
        dataIndex: "updatedDate",
        width: 180,
        render: (text) => text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
    ],
    [accountGroupPage, pageSize]
  );

  // Columns untuk Account Segment Tab
  const accountSegmentColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (accountSegmentPage - 1) * pageSize + index + 1,
      },
      {
        title: "SEGMENT ID",
        dataIndex: "accountSegment",
        width: 200,
        sorter: true,
      },
      {
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 150,
      },
      {
        title: "CREATED DATE",
        dataIndex: "createdDate",
        width: 180,
        render: (text) => text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
      {
        title: "UPDATED BY",
        dataIndex: "updatedBy",
        width: 150,
      },
      {
        title: "UPDATED DATE",
        dataIndex: "updatedDate",
        width: 180,
        render: (text) => text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
    ],
    [accountSegmentPage, pageSize]
  );

  // Columns untuk Cost Center Tab
  const costCenterColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (costCenterPage - 1) * pageSize + index + 1,
      },
      {
        title: "COST CENTER ID",
        dataIndex: "costCenter",
        width: 200,
        sorter: true,
      },
      {
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 150,
      },
      {
        title: "CREATED DATE",
        dataIndex: "createdDate",
        width: 180,
        render: (text) => text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
      {
        title: "UPDATED BY",
        dataIndex: "updatedBy",
        width: 150,
      },
      {
        title: "UPDATED DATE",
        dataIndex: "updatedDate",
        width: 180,
        render: (text) => text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
    ],
    [costCenterPage, pageSize]
  );

  // Columns untuk Meter Reading Code Tab
  const meterReadingColumns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (meterReadingPage - 1) * pageSize + index + 1,
      },
      {
        title: "METER READING CODE",
        dataIndex: "meterReadingCode",
        width: 200,
        sorter: true,
      },
      {
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 150,
      },
      {
        title: "CREATED DATE",
        dataIndex: "createdDate",
        width: 180,
        render: (text) => text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
      {
        title: "UPDATED BY",
        dataIndex: "updatedBy",
        width: 150,
      },
      {
        title: "UPDATED DATE",
        dataIndex: "updatedDate",
        width: 180,
        render: (text) => text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
    ],
    [meterReadingPage, pageSize]
  );


  // onSort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Change table pagination
  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Handle pagination untuk setiap tab
  const handleAccountGroupPageChange = (page, pageSizeChange) => {
    setAccountGroupPage(pageSize !== pageSizeChange ? 1 : page);
    setPageSize(pageSizeChange);
  };

  const handleAccountSegmentPageChange = (page, pageSizeChange) => {
    setAccountSegmentPage(pageSize !== pageSizeChange ? 1 : page);
    setPageSize(pageSizeChange);
  };

  const handleCostCenterPageChange = (page, pageSizeChange) => {
    setCostCenterPage(pageSize !== pageSizeChange ? 1 : page);
    setPageSize(pageSizeChange);
  };

  const handleMeterReadingPageChange = (page, pageSizeChange) => {
    setMeterReadingPage(pageSize !== pageSizeChange ? 1 : page);
    setPageSize(pageSizeChange);
  };


  const renderStatus = (status) => {
    switch (status) {
      case 0:
        return "Open";
      case 1:
        return "In Progress";
      case 2:
        return "Success";
      case 3:
        return "Failed";
      default:
        return status || "-";
    }
  };

  const resultData = detail_prabilling_result?.result || [];
  const pageInfo = detail_prabilling_result?.page || {};
  
  const accountGroupData = data?.accountGroupType || [];
  const accountSegmentData = data?.accountSegment || [];
  const costCenterData = data?.costCenter || [];
  const meterReadingData = data?.meterReadingCode || [];

  return (
    <Spin spinning={loading}>
      <BaseContainer header={"Prabilling Information"}>
        <div className={"w-full grid grid-cols-4 gap-2"}>
          <DetailText label={"Init Code"}>{data?.initCode || "-"}</DetailText>
          <DetailText label={"Process Name"}>{data?.processName || "-"}</DetailText>
          <DetailText label={"Billing Cycle"}>{data?.billingCycle || "-"}</DetailText>
          <DetailText label={"Billing Period"}>{data?.billPeriod || "-"}</DetailText>

          <DetailText label={"SOR"}>{data?.sor || "-"}</DetailText>
          <DetailText label={"Total Customer"}>{data?.totalCustomer || 0}</DetailText>
          <DetailText label={"Created By"}>{data?.createdBy || "-"}</DetailText>
          <DetailText label={"Created Date"}>
            {data?.createdDtm ? moment(data.createdDtm).format("DD MMM YYYY HH:mm:ss") : "-"}
          </DetailText>

          <DetailText label={"Status"}>{renderStatus(data?.status)}</DetailText>
          <div className="col-span-3">
            <DetailText label={"Message"}>{data?.message || "-"}</DetailText>
          </div>
          
          <div className="col-span-4">
            <DetailText label={"Remark"}>{data?.remark || "-"}</DetailText>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer header={"Prabilling Detail"}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane tab={`Account Group Type (${accountGroupData.length})`} key="account_group">
            <div className="my-5">
              <TablePaginationNew
                columns={accountGroupColumns}
                dataSource={accountGroupData}
                totalData={accountGroupData.length}
                current={accountGroupPage}
                pageSize={pageSize}
                onChange={handleAccountGroupPageChange}
                tableScrolled={{ x: 1200, y: 400 }}
                onSort={onSort}
                rowKey={(record) => `account-group-${record.id}`}
              />
            </div>
          </TabPane>

          <TabPane tab={`Account Segment (${accountSegmentData.length})`} key="account_segment">
            <div className="my-5">
              <TablePaginationNew
                columns={accountSegmentColumns}
                dataSource={accountSegmentData}
                totalData={accountSegmentData.length}
                current={accountSegmentPage}
                pageSize={pageSize}
                onChange={handleAccountSegmentPageChange}
                tableScrolled={{ x: 1200, y: 400 }}
                onSort={onSort}
                rowKey={(record) => `account-segment-${record.id}`}
              />
            </div>
          </TabPane>

          <TabPane tab={`Cost Center (${costCenterData.length})`} key="cost_center">
            <div className="my-5">
              <TablePaginationNew
                columns={costCenterColumns}
                dataSource={costCenterData}
                totalData={costCenterData.length}
                current={costCenterPage}
                pageSize={pageSize}
                onChange={handleCostCenterPageChange}
                tableScrolled={{ x: 1200, y: 400 }}
                onSort={onSort}
                rowKey={(record) => `cost-center-${record.id}`}
              />
            </div>
          </TabPane>

          <TabPane tab={`Meter Reading Code (${meterReadingData.length})`} key="meter_reading">
            <div className="my-5">
              <TablePaginationNew
                columns={meterReadingColumns}
                dataSource={meterReadingData}
                totalData={meterReadingData.length}
                current={meterReadingPage}
                pageSize={pageSize}
                onChange={handleMeterReadingPageChange}
                tableScrolled={{ x: 1200, y: 400 }}
                onSort={onSort}
                rowKey={(record) => `meter-reading-${record.id}`}
              />
            </div>
          </TabPane>
        </Tabs>
      </BaseContainer>

      <BaseContainer header={"Prabilling Result"}>
        <div className={"w-full flex justify-between items-center my-2"}>
          <div className="text-sm text-gray-600">
            Total Records: {pageInfo?.totalElements || 0}
          </div>
          <ButtonComponent
            type={"submit"}
            border={false}
            icon={<SVGIcon name={"IconButtonDownload"} width={24} />}
            onClick={handleDownload}
            disabled={resultData.length === 0}
          >
            Download
          </ButtonComponent>
        </div>

        <div className="my-5">
          <TablePaginationNew
            columns={resultColumns}
            dataSource={resultData}
            totalData={pageInfo?.totalElements || 0}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            tableScrolled={{ x: 5500, y: 600 }}
            onSort={onSort}
            rowKey={(record, index) => `${record.customerNumber}-${record.accountNumber}-${index}`}
          />
        </div>
      </BaseContainer>
    </Spin>
  );
};

export default PrabillingDetailInformation;