import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import CardContainer from "../../../../components/CardContainer";
import DetailText from "../../../../components/DetailText";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import {
  getDetailPrabillingResult,
  downloadPrabillingResult,
} from "../../../../redux/slices/rating_billing_invoice/praBilling";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { EyeOutlined } from "@ant-design/icons";

const PrabillingDetailInformation = ({ data, tabHeader }) => {
  const { detail_prabilling_result, loading } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // Destructure data dengan benar
  const prabillData = data?.prabillInitPopulate || {};
  const detailsData = data?.details || [];

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

  // Initial fetch - load 100 data pertama
  useEffect(() => {
    if (tabHeader === "Prabilling Information" && prabillData?.initCode) {
      dispatch(
        getDetailPrabillingResult({
          initCode: prabillData.initCode,
          page: 0,
          pageSize: 100, // Initial load 100
          sort,
          search: Object.keys(search).length > 0 ? search : {},
          isLoadMore: false,
        })
      );
      setPage(0);
    }
  }, [tabHeader, dispatch, prabillData?.initCode, sort, search]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(0);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const pageInfo = detail_prabilling_result?.page || {};
    const totalPages = pageInfo?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage < totalPages) {
      await dispatch(
        getDetailPrabillingResult({
          initCode: prabillData.initCode,
          page: nextPage,
          pageSize: loadMoreSize, // Load 20 more
          sort,
          search: Object.keys(search).length > 0 ? search : {},
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const handleDownload = () => {
    if (!prabillData?.initCode) {
      return;
    }

    dispatch(
      downloadPrabillingResult({
        initCode: prabillData.initCode,
      })
    );
  };

  const baseResultColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        isClassification: true,
        render: (text, object, index) => index + 1,
      },
      {
        key: "customerNumber",
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
        width: 200,
        sorter: true,
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
            text || "",
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
            text || "",
            false,
            "input",
            search
          ),
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 200,
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
            text || "",
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
            text || "",
            false,
            "input",
            search
          ),
      },
      {
        key: "sor",
        title: "SOR",
        dataIndex: "sor",
        width: 200,
        sorter: true,
        isClassification: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => <Tooltip title={text}>{text || ""}</Tooltip>,
      },
      {
        key: "costCenter",
        title: "COST CENTER",
        dataIndex: "costCenter",
        width: 150,
        isClassification: true,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => <Tooltip title={text}>{text || ""}</Tooltip>,
      },
      {
        key: "accountGroupType",
        title: "ACCOUNT GROUP TYPE",
        dataIndex: "accountGroupType",
        width: 160,
        isClassification: true,
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
            text || "",
            false,
            "input",
            search
          ),
      },
      {
        key: "billPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billPeriod",
        isClassification: true,
        width: 140,
        align: "center",
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
        width: 150,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "pjbgType",
        title: "PJBG TYPE",
        dataIndex: "pjbgType",
        width: 100,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "saServiceType",
        title: "SA SERVICE TYPE",
        dataIndex: "saServiceType",
        width: 120,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "saType",
        title: "SA TYPE",
        dataIndex: "saType",
        width: 120,
        align: "center",
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "termOfPayment",
        title: "TERM OF PAYMENT",
        dataIndex: "termOfPayment",
        width: 150,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "minUsage",
        title: "MIN USAGE",
        dataIndex: "minUsage",
        width: 120,
        align: "right",
        sorter: true,
        render: (text) => (text != null ? text.toLocaleString() : ""),
      },
      {
        key: "maxUsage",
        title: "MAX USAGE",
        dataIndex: "maxUsage",
        width: 120,
        align: "right",
        sorter: true,
        render: (text) => (text != null ? text.toLocaleString() : ""),
      },
      {
        key: "timeUnit",
        title: "TIME UNIT",
        dataIndex: "timeUnit",
        width: 100,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "unitMeasure",
        title: "UNIT MEASURE",
        dataIndex: "unitMeasure",
        width: 120,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "currency",
        title: "CURRENCY",
        dataIndex: "currency",
        width: 100,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "paymentType",
        title: "PAYMENT TYPE",
        dataIndex: "paymentType",
        width: 120,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "chargingMethod",
        title: "CHARGING METHOD",
        dataIndex: "chargingMethod",
        width: 150,
        isClassification: true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "action",
        title: "ACTION",
        width: 60,
        isClassification: true,
        fixed: "right",
        render: (text, record) => (
          <Link
            to={RBI_ROUTES.PRABILLING_DETAIL_CUSTOMER}
            state={{
              customerNumber: record?.customerNumber,
              billPeriod: record?.billPeriod,
              inSor: record?.sor || prabillData?.sor,
              accNumber: record?.accountNumber,
              saNumber: record?.saNumber,
            }}
            style={{ lineHeight: 0 }}
          >
            <Tooltip title="View Account Detail">
              <SVGIcon name="IconDetail" width={20} />
            </Tooltip>
          </Link>
        ),
      },
    ],
    [search, searchText, searchedColumn, prabillData]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseResultColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
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

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
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
        return status || "";
    }
  };

  const resultData = detail_prabilling_result?.result || [];
  const pageInfo = detail_prabilling_result?.page || {};

  // Calculate if there's more data
  const hasMore = resultData.length < (pageInfo?.totalElements || 0);

  return (
    <Spin spinning={loading}>
      {/* Prabilling Information Section */}
      <div className="-mt-6">
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] ">PRABILLING INFORMATION</p>
            </div>
          }
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(5,auto)] gap-x-8 gap-y-2 sm:gap-y-1">
            <DetailText label={"Init Code"}>
              {prabillData?.initCode || ""}
            </DetailText>
            <DetailText label={"Process Name"}>
              {prabillData?.processName || ""}
            </DetailText>
            <DetailText label={"Billing Cycle"}>
              {prabillData?.billingCycle || ""}
            </DetailText>
            <DetailText label={"Billing Period"}>
              {prabillData?.billPeriod || ""}
            </DetailText>
            <DetailText label={"SOR"}>{prabillData?.sor || ""}</DetailText>
            <DetailText label={"Schedule Type"}>
              {prabillData?.shceduleType || ""}
            </DetailText>
            <DetailText label={"Total Customer"}>
              {prabillData?.totalCustomer || 0}
            </DetailText>
            <DetailText label={"Status"}>
              {renderStatus(prabillData?.status)}
            </DetailText>
            <DetailText label={"Message"}>
              {prabillData?.message || ""}
            </DetailText>

            {/* Filter Details dari details array */}
            {detailsData &&
              detailsData.length > 0 &&
              detailsData.map((detail, index) => (
                <React.Fragment key={index}>
                  <DetailText label={"Cost Center"}>
                    {detail.costCenterName || detail.costCenter || ""}
                  </DetailText>
                  <DetailText label={"Meter Reading Code"}>
                    {detail.meterReadingCodeName ||
                      detail.meterReadingCode ||
                      ""}
                  </DetailText>
                  <DetailText label={"Account Segment"}>
                    {detail.accountSegmentName || detail.accountSegment || ""}
                  </DetailText>
                  <DetailText label={"Account Group Type"}>
                    {detail.accountGroupTypeName ||
                      detail.accountGroupType ||
                      ""}
                  </DetailText>
                  <DetailText label={"Account Numbers"} className="">
                    {detail.accountNumber || ""}
                  </DetailText>
                  <DetailText label={"Account Names"} className="">
                    {detail.accoutnName || ""}
                  </DetailText>
                </React.Fragment>
              ))}
            <DetailText label={"Remark"} className="col-span-5">
              {prabillData?.remark || ""}
            </DetailText>
          </div>
        </CardContainer>

        {/* Prabilling Result Table Section */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">PRABILLING RESULT</p>
              <ButtonComponent
                type={"submit"}
                border={false}
                icon={<SVGIcon name="IconButtonDownload" width={24} />}
                onClick={() => {
                  handleDownload();
                }}
              >
                Download List
              </ButtonComponent>
            </div>
          }
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

        {/* History Log Information Section */}
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">HISTORY LOG INFORMATION</p>
            </div>
          }
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
              {prabillData?.updatedBy || ""}
            </DetailText>
          </div>
        </CardContainer>
      </div>
    </Spin>
  );
};

export default PrabillingDetailInformation;
