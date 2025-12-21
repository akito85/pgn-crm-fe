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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  useEffect(() => {
    if (tabHeader === "Prabilling Information" && prabillData?.initCode) {
      dispatch(
        getDetailPrabillingResult({
          initCode: prabillData.initCode,
          page,
          pageSize,
          sort,
          search: Object.keys(search).length > 0 ? search : {},
        })
      );
    }
  }, [
    tabHeader,
    dispatch,
    prabillData?.initCode,
    page,
    pageSize,
    sort,
    search,
  ]);

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
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        isClassification:true,
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
        isClassification:true,
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
        key: "customerNumber",
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
        isClassification:true,
        width: 150,
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
        key: "sor",
        title: "SOR",
        dataIndex: "sor",
        width: 200,
        isClassification:true,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => <Tooltip title={text}>{text || ""}</Tooltip>,
      },
      {
        key: "costCenter",
        title: "COST CENTER",
        dataIndex: "costCenter",
        width: 200,
        isClassification:true,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => <Tooltip title={text}>{text || ""}</Tooltip>,
      },
      {
        key: "meterReadingCode",
        title: "METER READING CODE",
        dataIndex: "meterReadingCode",
        isClassification:true,
        width: 150,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "accountGroupType",
        title: "ACCOUNT GROUP TYPE",
        dataIndex: "accountGroupType",
        isClassification:true,
        width: 150,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "accountType",
        title: "ACCOUNT TYPE",
        dataIndex: "accountType",
        isClassification:true,
        width: 100,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "billingCycle",
        title: "BILLING CYCLE",
        dataIndex: "billingCycle",
        width: 150,
        isClassification:true,
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
        width: 120,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "accountGroup",
        title: "ACCOUNT GROUP",
        dataIndex: "accountGroup",
        width: 120,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "saNumber",
        title: "SA NUMBER",
        dataIndex: "saNumber",
        width: 150,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "pjbgType",
        title: "PJBG TYPE",
        dataIndex: "pjbgType",
        width: 100,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "saServiceType",
        title: "SA SERVICE TYPE",
        dataIndex: "saServiceType",
        width: 120,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "saType",
        title: "SA TYPE",
        dataIndex: "saType",
        width: 120,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "termOfPayment",
        title: "TERM OF PAYMENT",
        dataIndex: "termOfPayment",
        width: 150,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "minUsage",
        title: "MIN USAGE",
        dataIndex: "minUsage",
        width: 120,
        isNumber:true,
        sorter: true,
        render: (text) => (text != null ? text.toLocaleString() : ""),
      },
      {
        key: "maxUsage",
        title: "MAX USAGE",
        dataIndex: "maxUsage",
        width: 120,
        isNumber:true,
        sorter: true,
        render: (text) => (text != null ? text.toLocaleString() : ""),
      },
      {
        key: "timeUnit",
        title: "TIME UNIT",
        dataIndex: "timeUnit",
        width: 100,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "unitMeasure",
        title: "UNIT MEASURE",
        dataIndex: "unitMeasure",
        width: 120,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "currency",
        title: "CURRENCY",
        dataIndex: "currency",
        width: 100,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "paymentType",
        title: "PAYMENT TYPE",
        dataIndex: "paymentType",
        width: 120,
        isClassification:true,
        sorter: true,
        render: (text) => text || "",
      },
      {
        key: "chargingMethod",
        title: "CHARGING METHOD",
        dataIndex: "chargingMethod",
        width: 150,
        isClassification:true,
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
              <EyeOutlined style={{ fontSize: "20px" }} />
            </Tooltip>
          </Link>
        ),
      },
    ],
    [page, pageSize, search, searchText, searchedColumn, prabillData]
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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
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
        return status || "";
    }
  };

  const resultData = detail_prabilling_result?.result || [];
  const pageInfo = detail_prabilling_result?.page || {};

  // Gabungkan account numbers dan names dari details
  const accountNumbers = detailsData
    .map((detail) => detail.accountNumber)
    .filter(Boolean)
    .join(", ");
  
  const accountNames = detailsData
    .map((detail) => detail.accoutnName)
    .filter(Boolean)
    .join(", ");

  return (
    <Spin spinning={loading}>
      {/* Prabilling Information Section */}
      <CardContainer subHeader={"Prabilling Information"}>
        <div className={"w-full grid grid-cols-4 gap-2"}>
          <DetailText label={"Init Code"}>{prabillData?.initCode || ""}</DetailText>
          <DetailText label={"Process Name"}>
            {prabillData?.processName || ""}
          </DetailText>
          <DetailText label={"Billing Cycle"}>
            {prabillData?.billingCycle || ""}
          </DetailText>
          <DetailText label={"Billing Period"}>
            {prabillData?.billPeriod || ""}
          </DetailText>

          <DetailText label={"Total Customer"}>
            {prabillData?.totalCustomer || 0}
          </DetailText>
          <DetailText label={"Schedule Type"}>
            {prabillData?.shceduleType || ""}
          </DetailText>
          <DetailText label={"Status"}>{renderStatus(prabillData?.status)}</DetailText>
          <DetailText label={"Message"}>{prabillData?.message || ""}</DetailText>
        </div>
      </CardContainer>

      {/* Parameter Information Section */}
      <CardContainer subHeader={"Parameter Information"}>
        <div className={"w-full grid grid-cols-4 gap-2"}>
          <DetailText label={"SOR"}>{prabillData?.sor || ""}</DetailText>
          {detailsData && detailsData.length > 0 && (
            <>
              <DetailText label={"Cost Center"}>
                {detailsData[0]?.costCenterName || detailsData[0]?.costCenter || ""}
              </DetailText>
              <DetailText label={"Meter Reading Code"}>
                {detailsData[0]?.meterReadingCodeName || detailsData[0]?.meterReadingCode || ""}
              </DetailText>
              <DetailText label={"Account Segment"}>
                {detailsData[0]?.accountSegmentName || detailsData[0]?.accountSegment || ""}
              </DetailText>
              <DetailText label={"Account Group Type"}>
                {detailsData[0]?.accountGroupTypeName || detailsData[0]?.accountGroupType || ""}
              </DetailText>
            </>
          )}
          <div className="col-span-4">
            <DetailText label={"Specific Customer"}>
              {accountNumbers ? `${accountNumbers} - ${accountNames}` : ""}
            </DetailText>
          </div>
        </div>
      </CardContainer>

      {/* Schedule Information Section */}
      <CardContainer subHeader={"Schedule Information"}>
        <div className={"w-full grid grid-cols-4"}>
          <DetailText label={"Type"}>{prabillData?.shceduleType || ""}</DetailText>
          <div className="col-span-3">
            <DetailText label={"Remark"}>{prabillData?.remark || ""}</DetailText>
          </div>
        </div>
      </CardContainer>

      {/* History Log Information Section */}
      <CardContainer subHeader={"History Log Information"}>
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

      {/* Prabilling Result Table Section */}
      <CardContainer subHeader={"Prabilling Result"}>
        <div className="my-5">
          <TableRBI
            dataSource={resultData}
            columns={processedColumns}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            onSizeChanger={handleChangePage}
            totalData={pageInfo?.totalElements || 0}
            tableScrolled={{ x: 5500, y: 600 }}
            onSort={onSort}
            handleDownload={handleDownload}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading}
            rowKey={(record, index) =>
              `${record.customerNumber}-${record.accountNumber}-${index}`
            }
          />
        </div>
      </CardContainer>
    </Spin>
  );
};

export default PrabillingDetailInformation;
