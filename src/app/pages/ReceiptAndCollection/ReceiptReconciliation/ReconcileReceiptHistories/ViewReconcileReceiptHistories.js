import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { Spin, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import CardContainer from "../../../../../components/CardContainer";
import TablePagination from "../../../../../components/TablePagination";
import TableRBI from "../../../../../components/TableRBI";
import {
  downloadReconcileReceiptHistories,
  getReceiptReconcileHistoriesPaging,
} from "../../../../../redux/slices/receipt_collection/receiptHistories";
import {
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../utils/getColumnSearchProps";
import { dateFormatting } from "../../../../../utils";
import ButtonComponent from "../../../../../components/ButtonComponent";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { }
) => [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "RECEIPT CODE",
      dataIndex: "receiptCode",
      key: "receiptCode",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "receiptCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        search?.receiptCode ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.receiptCode]}
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
      title: "SOR",
      dataIndex: "sor",
      key: "sor",
      align: "",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        search?.sor ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.sor]}
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
      title: "COST CENTER",
      dataIndex: "costCenter",
      key: "costCenter",
      align: "",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        search?.costCenter ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.costCenter]}
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
      title: "CUSTOMER",
      dataIndex: "customerName",
      key: "customerName",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        search?.customerName ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.customerName]}
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
      title: "ACCOUNT",
      dataIndex: "accountNumber",
      key: "accountNumber",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        search?.accountNumber ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.accountNumber]}
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
      title: "RECEIPT NUMBER",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "receiptNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        search?.receiptNumber ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.receiptNumber]}
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
      title: "RECEIPT DATE",
      dataIndex: "receiptDate",
      key: "receiptDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "receiptDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        search?.receiptDate ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              search?.receiptDate

                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
            ]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          moment(text).format(dateFormatting.dateCapital)
        ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      key: "currency",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        search?.currency ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.currency]}
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
      title: "RECEIPT AMOUNT",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        search?.amount ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.amount]}
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
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        search?.type ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[search?.type]}
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
  ];

const ViewReconcileReceiptHistories = () => {
  // Selector
  const { data_reconcile, loading } = useSelector(
    (state) => state.receiptHistories
  );
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

  //dispatch
  const handleFetch = useCallback(() => {
    dispatch(
      getReceiptReconcileHistoriesPaging({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Receipt Reconciliation",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECONCILE_RECEIPT_HISTORIES,
      breadcrumbName: "Reconcile Receipt Histories",
    },
  ];

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

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    dispatch(
      downloadReconcileReceiptHistories({
        search: encodeURIComponent(JSON.stringify(search)),
        // search: tempSearch,
        page: page,
        pageSize: pageSize,
        sort: sort,
      })
    );
  };

  const itemActions = [
    // toolbar items
    {
      action: "Download"
    }
    // {
    //   action: "Create",
    //   render: (
    //     <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PAYMENT_ITEM}>
    //       <ButtonComponent
    //         icon={<SVGIcon name="IconButtonCreate" width={24} />}
    //         type="submit"
    //       >
    //         Create Payment Method
    //       </ButtonComponent>
    //     </NavLink>
    //   ),
    // },
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "RECEIPT_RECONCILE_HISTORY_DOWNLOAD") {
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
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <CardContainer header={"RECONCILE RECEIPT HISTORIES LIST"}>
          <div className="w-full">
            <TableRBI
              dataSource={data_reconcile?.result}
              columns={columns(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              )}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              totalData={data_reconcile?.page?.totalElements}
              onSort={onSort}
              handleDownload={handleDownload}
              tableScrolled={{
                x: "max-content",
                y: 300,
              }}
            />
          </div>
        </CardContainer>
      </Spin>
      {renderModal()}
    </div>
  );
};

export default ViewReconcileReceiptHistories;
