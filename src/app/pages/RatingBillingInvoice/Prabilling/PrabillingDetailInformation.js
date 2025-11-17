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

const PrabillingDetailInformation = ({ data, tabHeader }) => {
  const { detail_prabilling_result, loading } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    customerNumber: "left",
    action: "right",
  });

  // Fetch data
  useEffect(() => {
    if (tabHeader === "Prabilling Information" && data?.initCode) {
      dispatch(
        getDetailPrabillingResult({
          initCode: data.initCode,
          page,
          pageSize,
          sort,
          search: Object.keys(search).length > 0 ? search : {},
        })
      );
    }
  }, [tabHeader, dispatch, data?.initCode, page, pageSize, sort, search]);

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
      return;
    }

    dispatch(
      downloadPrabillingResult({
        initCode: data.initCode,
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
        key: "customerNumber",
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
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
        key: "customerTypeId",
        title: "CUSTOMER TYPE ID",
        dataIndex: "customerTypeId",
        width: 150,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
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
        align: "center",
        sorter: true,
        render: (text) => text || "-",
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
        key: "accountGroup",
        title: "ACCOUNT GROUP",
        dataIndex: "accountGroup",
        width: 120,
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "accountType",
        title: "ACCOUNT TYPE",
        dataIndex: "accountType",
        width: 100,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "costCenter",
        title: "COST CENTER",
        dataIndex: "costCenter",
        width: 200,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip title={text}>
            {text || "-"}
          </Tooltip>
        ),
      },
      {
        key: "meterReadingCode",
        title: "METER READING CODE",
        dataIndex: "meterReadingCode",
        width: 150,
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "sor",
        title: "SOR",
        dataIndex: "sor",
        width: 200,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip title={text}>
            {text || "-"}
          </Tooltip>
        ),
      },
      {
        key: "accountGroupType",
        title: "ACCOUNT GROUP TYPE",
        dataIndex: "accountGroupType",
        width: 150,
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "saNumber",
        title: "SA NUMBER",
        dataIndex: "saNumber",
        width: 150,
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "pjbgType",
        title: "PJBG TYPE",
        dataIndex: "pjbgType",
        width: 100,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "saServiceType",
        title: "SA SERVICE TYPE",
        dataIndex: "saServiceType",
        width: 120,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "saType",
        title: "SA TYPE",
        dataIndex: "saType",
        width: 120,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "termOfPayment",
        title: "TERM OF PAYMENT",
        dataIndex: "termOfPayment",
        width: 150,
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "fullPriceCode",
        title: "FULL PRICE CODE",
        dataIndex: "fullPriceCode",
        width: 250,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip title={text}>
            {text || "-"}
          </Tooltip>
        ),
      },
      {
        key: "minUsage",
        title: "MIN USAGE",
        dataIndex: "minUsage",
        width: 120,
        align: "right",
        sorter: true,
        render: (text) => (text != null ? text.toLocaleString() : "-"),
      },
      {
        key: "maxUsage",
        title: "MAX USAGE",
        dataIndex: "maxUsage",
        width: 120,
        align: "right",
        sorter: true,
        render: (text) => (text != null ? text.toLocaleString() : "-"),
      },
      {
        key: "timeUnit",
        title: "TIME UNIT",
        dataIndex: "timeUnit",
        width: 100,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "unitMeasure",
        title: "UNIT MEASURE",
        dataIndex: "unitMeasure",
        width: 120,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "currency",
        title: "CURRENCY",
        dataIndex: "currency",
        width: 100,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "paymentType",
        title: "PAYMENT TYPE",
        dataIndex: "paymentType",
        width: 120,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "chargingMethod",
        title: "CHARGING METHOD",
        dataIndex: "chargingMethod",
        width: 150,
        align: "center",
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "avgCalorie",
        title: "AVG CALORIE",
        dataIndex: "avgCalorie",
        width: 120,
        align: "right",
        sorter: true,
        render: (text) => (text != null ? text.toFixed(4) : "-"),
      },
      {
        key: "firstMeasDate",
        title: "FIRST MEAS DATE",
        dataIndex: "firstMeasDate",
        width: 150,
        align: "center",
        sorter: true,
        render: (text) => (text ? moment(text).format("DD MMM YYYY") : "-"),
      },
      {
        key: "lastMeasDate",
        title: "LAST MEAS DATE",
        dataIndex: "lastMeasDate",
        width: 150,
        align: "center",
        sorter: true,
        render: (text) => (text ? moment(text).format("DD MMM YYYY") : "-"),
      },
      {
        key: "totalVol27",
        title: "TOTAL VOL 27",
        dataIndex: "totalVol27",
        width: 150,
        align: "right",
        sorter: true,
        render: (text) => (text != null ? text.toLocaleString() : "-"),
      },
      {
        key: "totalVol60",
        title: "TOTAL VOL 60",
        dataIndex: "totalVol60",
        width: 150,
        align: "right",
        sorter: true,
        render: (text) => (text != null ? text.toLocaleString() : "-"),
      },
      {
        key: "mpricingCode",
        title: "MPRICING CODE",
        dataIndex: "mpricingCode",
        width: 150,
        sorter: true,
        render: (text) => text || "-",
      },
      {
        key: "action",
        title: "ACTION",
        width: 80,
        align: "center",
        render: (text, record) => (
          <Link
            to={RBI_ROUTES.PRABILLING_DETAIL_CUSTOMER}
            state={{
              customerNumber: record?.customerNumber,
              billPeriod: record?.billPeriod,
              inSor: record?.sor || data?.sor,
              accNumber: record?.accountNumber,
              saNumber: record?.saNumber,
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
    [page, pageSize, search, searchText, searchedColumn, data]
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
        return status || "-";
    }
  };

  // Extract data dengan struktur baru
  const resultData = detail_prabilling_result?.result || [];
  const pageInfo = detail_prabilling_result?.page || {};

  return (
    <Spin spinning={loading}>
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">PRABILLING INFORMATION</p>
          </div>
        }
      >
        <div className={"w-full grid grid-cols-4 gap-2"}>
          <DetailText label={"Init Code"}>{data?.initCode || "-"}</DetailText>
          <DetailText label={"Process Name"}>
            {data?.processName || "-"}
          </DetailText>
          <DetailText label={"Billing Cycle"}>
            {data?.billingCycle || "-"}
          </DetailText>
          <DetailText label={"Billing Period"}>
            {data?.billPeriod || "-"}
          </DetailText>

          <DetailText label={"SOR"}>{data?.sor || "-"}</DetailText>
          <DetailText label={"Total Customer"}>
            {data?.totalCustomer || 0}
          </DetailText>
          <DetailText label={"Created By"}>{data?.createdBy || "-"}</DetailText>
          <DetailText label={"Created Date"}>
            {data?.createdDtm
              ? moment(data.createdDtm).format("DD MMM YYYY HH:mm:ss")
              : "-"}
          </DetailText>

          <DetailText label={"Status"}>{renderStatus(data?.status)}</DetailText>
          <div className="col-span-3">
            <DetailText label={"Message"}>{data?.message || "-"}</DetailText>
          </div>

          <div className="col-span-4">
            <DetailText label={"Remark"}>{data?.remark || "-"}</DetailText>
          </div>
        </div>
      </CardContainer>

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">PRABILLING RESULT</p>
          </div>
        }
      >
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