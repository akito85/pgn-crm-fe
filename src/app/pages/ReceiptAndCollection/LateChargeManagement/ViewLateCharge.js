import { DownloadOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TablePagination from "../../../../components/TablePagination";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import {
  dateFormatting,
  renderDateColumn,
  toTitleCase,
} from "../../../../utils";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Link, NavLink } from "react-router-dom";
import {
  downloadLateCharge,
  getPagingLateCharge,
} from "../../../../redux/slices/receipt_collection/lateCharge";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const ViewLateCharge = () => {
  // Selector
  const { data, loading } = useSelector((state) => state.late);
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  // const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LATE_CHARGE,
      breadcrumbName: "Late Charge ",
    },
  ];

  const handleFetch = useCallback(() => {
    dispatch(
      getPagingLateCharge({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const columns = (
    search,
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {},
  ) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "INVOICE NO",
      dataIndex: "invoiceNo",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "invoiceNo",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        search?.invoiceNo ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text?.split("-")[0]}>
            {text?.split("-")[0]}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "COST CENTER",
      dataIndex: "areaCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "areaCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "areaCode" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "customerNumber" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text?.split("-")[0]}>
            {text?.split("-")[0]}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "customerName" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CUSTOMER SEGMENT",
      dataIndex: "accountSegment",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountSegment",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "accountSegment" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text?.split("-")[1]}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CUSTOMER GROUP",
      dataIndex: "accountGroup",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountGroup",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "accountGroup" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text?.split("-")[1]}>
            {text?.split("-")[1]}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "BILLING CODE",
      dataIndex: "billingCode",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "billingCode" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "billingPeriod",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datePeriod",
      ),
      render: (text) =>
        searchedColumn === "billingPeriod" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={
              text ? moment(searchText).format(dateFormatting?.datePeriod) : ""
            }
          />
        ) : text ? (
          <Tooltip
            placement="topLeft"
            title={moment(text).format(dateFormatting?.datePeriod)}
          >
            {moment(text).format(dateFormatting?.datePeriod)}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "METER READING CODE",
      dataIndex: "meterReadingRoute",
      // align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "meterReadingRoute",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "meterReadingRoute" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      align: "center",
      sorter: true,
      width: 180,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "currency" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "LATE CHARGE RATE",
      dataIndex: "lateChargeRate",
      sorter: true,
      // width: 180,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "lateChargeRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "lateChargeRate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "TOTAL LATE CHARGE",
      dataIndex: "totalAmount",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "totalAmount" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "TOTAL PERIODE BILL",
      dataIndex: "totalPeriodBill",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "totalPeriodBill",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "totalPeriodBill" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "PAYMENT AMOUNT",
      dataIndex: "paymentAmount",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "paymentAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "paymentAmount" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "GAP PAYMENT WARRANTY",
      dataIndex: "gapPaymentWarranty",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "gapPaymentWarranty",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "gapPaymentWarranty" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "LATE CHARGE TIME UNIT",
      dataIndex: "timeUnit",
      sorter: true,
      align: "center",
      // width: 220,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "timeUnit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "timeUnit" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText ? searchText : ""]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text || ""
        ),
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      sorter: true,
      align: "center",
      width: 220,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "dueDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (v) =>
        renderDateColumn(
          "dueDate",
          searchedColumn,
          searchText,
          v,
          "date",
          search,
        ),
    },
    {
      title: "PAYMENT DATE",
      dataIndex: "paymentDate",
      sorter: true,
      align: "center",
      width: 220,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "paymentDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (v) =>
        renderDateColumn(
          "paymentDate",
          searchedColumn,
          searchText,
          v,
          "date",
          search,
        ),
    },
    {
      title: "EXPIRED DATE",
      dataIndex: "expiredDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "expiredDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "expiredDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
            ]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text || ""
        ),
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      key: "remark",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "remark" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      sorter: true,
      fixed: "right",
      width: 120,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "status" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <div className="flex justify-center">
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          ""
        ),
      // render: (status) => (
      //   <div className="flex justify-center">
      //     <StatusComponent colour={status}>{status}</StatusComponent>
      //   </div>
      // ),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      key: "statusApproval",
      sorter: true,
      fixed: "right",
      width: 190,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "statusApproval" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          // <Tooltip placement="topLeft" title={text}>
          //   {text}
          // </Tooltip>
          <div className="flex justify-center">
            <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
          </div>
        ) : (
          ""
        ),
    },
  ];

  const handleDownload = () => {
    dispatch(
      downloadLateCharge({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  };

  const itemActions = [
    // toolbar items
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PAYMENT_ITEM}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            disabled={true}
          >
            Create File
          </ButtonComponent>
        </NavLink>
      ),
    },
  ];

  // item columns
  const itemActionColumns = [
    {
      action: "View",
      type: "table",
      render: (record, data_length) => {
        return (
          <Link
            to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_LATE_CHARGE}
            state={{ id: record?.id }}
          >
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
    {
      action: "Recalculate",
      type: "table",
      render: (record, data_length) => {
        return data_length > 3 ? (
          <Link
          // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_ITEM}
          // state={{ id: record?.id }}
          >
            <div className="flex items-center cursor-not-allowed pt-1">
              <ButtonComponent
                icon={
                  <SVGIcon name="IconActionCreate" color="#0075bf" width={24} />
                }
                border={false}
              >
                <span className="text-black ml-3"> Adjustment Recalculate</span>
              </ButtonComponent>
            </div>
          </Link>
        ) : (
          <Tooltip title={"Adjustment Recalculate"}>
            <Link
            // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_ITEM}
            // state={{ id: record?.id }}
            >
              <div className="flex items-center cursor-not-allowed pt-1">
                <SVGIcon name="IconActionCreate" color="#ACC424" width={24} />
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Replace",
      type: "table",
      render: (record, data_length) => {
        return data_length > 3 ? (
          <Link
          // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_ITEM}
          // state={{ id: record?.id }}
          >
            <div className="flex items-center cursor-not-allowed pt-1">
              <ButtonComponent
                icon={
                  <SVGIcon name="IconActionCreate" color="#0075bf" width={24} />
                }
                border={false}
              >
                <span className="text-black ml-3"> Adjustment Replace</span>
              </ButtonComponent>
            </div>
          </Link>
        ) : (
          <Tooltip title={"Adjustment Replace"}>
            <Link
            // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_ITEM}
            // state={{ id: record?.id }}
            >
              <div className="flex items-center cursor-not-allowed pt-1">
                <SVGIcon name="IconActionCreate" color="#ACC424" width={24} />
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Reverse",
      type: "table",
      render: (record, data_length) => {
        return data_length > 3 ? (
          <Link
          // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_ITEM}
          // state={{ id: record?.id }}
          >
            <div className="flex items-center cursor-not-allowed pt-1">
              <ButtonComponent
                icon={
                  <SVGIcon name="IconActionCreate" color="#0075bf" width={24} />
                }
                border={false}
              >
                <span className="text-black ml-3"> Adjustment Reverse</span>
              </ButtonComponent>
            </div>
          </Link>
        ) : (
          <Tooltip title={"Adjustment Reverse"}>
            <Link
            // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_ITEM}
            // state={{ id: record?.id }}
            >
              <div className="flex items-center cursor-not-allowed pt-1">
                <SVGIcon name="IconActionCreate" color="#ACC424" width={24} />
                {data_length > 3 && (
                  <span className="text-black ml-3"> Adjustment Reverse</span>
                )}
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "LATE_CHARGE_DOWNLOAD") {
        handleDownload();
        handleFetch();
      }
      // else if (bodyError?.action === "GET_APPROVAL_ITEM") {
      //   dispatch(getApprovalHistory(body));
      // } else if (bodyError?.action === "DOWNLOAD_PAYMENT_METHOD") {
      //   handleDownload();
      // }
      // handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />

        <BaseContainer header={"LATE CHARGE MONITORING "}>
          <TablePagination
            dataSource={data?.result}
            columns={[
              ...columns(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
              ),
              ...useColumnActionPermission(
                ["view", "recalculate", "reverse", "replace"],
                itemActionColumns,
              ),
            ]}
            // page={page}
            current={page}
            pageSize={pageSize}
            totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{
              x: 5500,
              y: 900,
            }}
            onChange={handleChange}
          />
        </BaseContainer>
      </Spin>
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewLateCharge;
