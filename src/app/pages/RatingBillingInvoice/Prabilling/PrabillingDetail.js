import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tabs, Tooltip } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainer from "../../../../components/CardContainer";
import DetailText from "../../../../components/DetailText";
import ButtonComponent from "../../../../components/ButtonComponent";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import PrabillingDetailInformation from "./PrabillingDetailInformation";
import PrabillingDetailLog from "./PrabillingDetailLog";
import PrabillingAccountLog from "./PrabillingAccountLog";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { hasValue, renderColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import {
  getDetailPrabillingInit,
  getDetailPrabillingResult,
  downloadPrabillingResult,
} from "../../../../redux/slices/rating_billing_invoice/praBilling";

const PrabillingDetail = () => {
  // Selector
  const {
    detail_prabilling_init,
    detail_prabilling_result,
    loading,
    loading_detail_prabilling,
  } = useSelector((state) => state.rbi_prabilling);

  // Declaration
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInput = useRef(null);
  const initId = location?.state?.id;

  const prabillData = detail_prabilling_init?.prabillInitPopulate || {};

  // State
  const [activeTab, setActiveTab] = useState("information");
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  // Fetch init detail
  useEffect(() => {
    if (!initId) {
      navigate(RBI_ROUTES.PRABILLING_VIEW, { replace: true });
      return;
    }
    dispatch(getDetailPrabillingInit(initId));
  }, [dispatch, initId, navigate]);

  // Fetch prabilling result whenever initCode tersedia
  useEffect(() => {
    if (prabillData?.initCode) {
      dispatch(
        getDetailPrabillingResult({
          initCode: prabillData.initCode,
          page: 0,
          pageSize: 100,
          sort,
          search: Object.keys(search).length > 0 ? search : {},
          isLoadMore: false,
        })
      );
      setPage(0);
    }
  }, [dispatch, prabillData?.initCode, sort, search]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(0);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = detail_prabilling_result?.page?.totalPages || 0;
    if (nextPage < totalPages) {
      await dispatch(
        getDetailPrabillingResult({
          initCode: prabillData.initCode,
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          search: Object.keys(search).length > 0 ? search : {},
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const handleDownload = () => {
    if (!prabillData?.initCode) return;
    dispatch(downloadPrabillingResult({ initCode: prabillData.initCode }));
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleViewDetail = (record) => {
    navigate(RBI_ROUTES.PRABILLING_DETAIL_CUSTOMER, {
      state: {
        customerNumber: record?.customerNumber,
        billPeriod: record?.billPeriod,
        inSor: record?.sor || prabillData?.sor,
        accNumber: record?.accountNumber,
        saNumber: record?.saNumber,
        id: initId,
      },
    });
  };

  const baseResultColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "customerNumber",
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
        isNumber: true,
        width: 200,
        sorter: true,
        filteredValue: [search?.customerNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "customerNumber", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("customerNumber", hasValue(search["customerNumber"]),
            searchText, text || "", false, "input", search),
      },
      {
        key: "customerName",
        title: "CUSTOMER NAME",
        dataIndex: "customerName",
        width: 200,
        sorter: true,
        filteredValue: [search?.customerName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "customerName", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("customerName", hasValue(search["customerName"]),
            searchText, text || "", false, "input", search),
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        isNumber: true,
        width: 200,
        sorter: true,
        filteredValue: [search?.accountNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "accountNumber", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("accountNumber", hasValue(search["accountNumber"]),
            searchText, text || "", false, "input", search),
      },
      {
        key: "accountName",
        title: "ACCOUNT NAME",
        dataIndex: "accountName",
        width: 200,
        sorter: true,
        filteredValue: [search?.accountName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "accountName", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("accountName", hasValue(search["accountName"]),
            searchText, text || "", false, "input", search),
      },
      {
        key: "sor",
        title: "SOR",
        dataIndex: "sor",
        isClassification: true,
        width: 200,
        sorter: true,
        ellipsis: { showTitle: false },
        render: (text) => <Tooltip title={text}>{text || ""}</Tooltip>,
      },
      {
        key: "costCenter",
        title: "COST CENTER",
        dataIndex: "costCenter",
        isClassification: true,
        width: 150,
        sorter: true,
        ellipsis: { showTitle: false },
        render: (text) => <Tooltip title={text}>{text || ""}</Tooltip>,
      },
      {
        key: "accountGroupType",
        title: "ACCOUNT GROUP TYPE",
        dataIndex: "accountGroupType",
        isClassification: true,
        width: 160,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "meterReadingCode",
        title: "METER READING CODE",
        dataIndex: "meterReadingCode",
        isClassification: true,
        width: 160,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "accountType",
        title: "ACCOUNT TYPE",
        dataIndex: "accountType",
        isClassification: true,
        width: 150,
        align: "center",
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "billingCycle",
        title: "BILLING CYCLE",
        dataIndex: "billingCycle",
        isClassification: true,
        width: 150,
        sorter: true,
        filteredValue: [search?.billingCycle] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "billingCycle", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("billingCycle", hasValue(search["billingCycle"]),
            searchText, text || "", false, "input", search),
      },
      {
        key: "billPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billPeriod",
        width: 140,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "accountGroup",
        title: "ACCOUNT GROUP",
        dataIndex: "accountGroup",
        isClassification: true,
        width: 140,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "saNumber",
        title: "SA NUMBER",
        dataIndex: "saNumber",
        isNumber: true,
        width: 150,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "pjbgType",
        title: "PJBG TYPE",
        dataIndex: "pjbgType",
        isClassification: true,
        width: 100,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "saServiceType",
        title: "SA SERVICE TYPE",
        dataIndex: "saServiceType",
        isClassification: true,
        width: 120,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "saType",
        title: "SA TYPE",
        dataIndex: "saType",
        isClassification: true,
        width: 120,
        align: "center",
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "termOfPayment",
        title: "TERM OF PAYMENT",
        dataIndex: "termOfPayment",
        isClassification: true,
        width: 150,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "action",
        title: "ACTION",
        width: 60,
        align: "center",
        render: (text, record) => (
          <Tooltip title="View Account Detail">
            <div
              onClick={() => handleViewDetail(record)}
              style={{ cursor: "pointer", display: "flex", justifyContent: "center" }}
            >
              <SVGIcon name="IconDetail" color="#0075BF" width={20} />
            </div>
          </Tooltip>
        ),
      },
    ],
    [search, searchText, searchedColumn, prabillData, handleViewDetail]
  );

  const allColumns = useMemo(() => {
    return baseResultColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseResultColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const resultData = detail_prabilling_result?.result || [];
  const pageInfo = detail_prabilling_result?.page || {};
  const hasMore = resultData.length < (pageInfo?.totalElements || 0);

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: RBI_ROUTES.PRABILLING_VIEW, breadcrumbName: "Prabilling" },
    { path: "", breadcrumbName: "Detail Prabilling" },
  ];

  const tabItems = [
    {
      key: "information",
      label: "Information",
      children: (
        <PrabillingDetailInformation
          data={detail_prabilling_init}
          tabHeader="Prabilling Information"
        />
      ),
    },
    {
      key: "log",
      label: "Log",
      children: (
        <PrabillingDetailLog
          data={detail_prabilling_init}
          tabHeader="Prabilling Log"
        />
      ),
    },
    {
      key: "logAccount",
      label: "Account Log",
      children: (
        <PrabillingAccountLog
          data={detail_prabilling_init}
          tabHeader="Prabilling Account Log"
        />
      ),
    },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading_detail_prabilling}>

        {/* 1. PRABILLING DETAIL - Tab ada di sini */}
        <CardContainer
          header={
            <div className="flex justify-between items-center -my-4">
              <p className="mt-[15px] text-primary">PRABILLING DETAIL</p>
            </div>
          }
        >
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={setActiveTab}
            type="line"
            size="small"
            className="tabs-compact"
            style={{ marginBottom: 0 }}
            destroyInactiveTabPane={true}
          />
        </CardContainer>

        {/* 2. PRABILLING RESULT - di luar CardContainer tab */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">PRABILLING RESULT</p>
              <ButtonComponent
                type={"submit"}
                border={false}
                icon={<SVGIcon name="IconButtonDownload" width={24} />}
                onClick={handleDownload}
              >
                Download List
              </ButtonComponent>
            </div>
          }
          className="mt-1"
        >
          <div className="my-0">
            <TableRBI
              idTable="prabilling-result-table"
              dataSource={resultData}
              columns={processedColumns}
              totalData={pageInfo?.totalElements || 0}
              tableScrolled={{ x: 3000, y: 600 }}
              onSort={onSort}
              showExport={false}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadMoreThreshold={20}
              rowKey={(record, index) =>
                `${record.customerNumber}-${record.accountNumber}-${index}`
              }
            />
          </div>
        </CardContainer>

        {/* 3. HISTORY LOG INFORMATION - di luar CardContainer tab */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] text-primary">HISTORY LOG INFORMATION</p>
            </div>
          }
          className="mt-1"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-2 sm:gap-y-1">
            <DetailText label={"Record ID"}>
              {prabillData?.initId || ""}
            </DetailText>
            <DetailText label={"Created Date"}>
              {prabillData?.createdDtm
                ? moment(prabillData.createdDtm).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Created By"}>
              {prabillData?.createdBy || ""}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {prabillData?.updateDtm
                ? moment(prabillData.updateDtm).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Updated By"}>
              {prabillData?.updateBy || ""}
            </DetailText>
          </div>
        </CardContainer>

        {/* 4. Back Button */}
        <div className="bg-white rounded-md w-full flex justify-start mb-4 p-3">
          <ButtonComponent
            type="submit"
            border={false}
            icon={<LeftOutlined style={{ color: "#fff", fontSize: 16 }} />}
            onClick={() => navigate(-1)}
          >
            Back
          </ButtonComponent>
        </div>

      </Spin>
    </>
  );
};

export default PrabillingDetail;