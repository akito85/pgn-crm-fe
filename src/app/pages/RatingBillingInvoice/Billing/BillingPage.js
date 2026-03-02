import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tabs, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import SVGIcon from "../../../../assets/Icon/index";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  downloadBillingList,
  getAllBillingApprovePaginate,
  getAllBillingPaginate,
  getAllBillingRequestPaginate,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import { columnsBilling } from "./Table/TableViewBilling";
import { columnsAllBilling } from "./Table/TableViewAllBilling";
import BillingDetail from "./Detail/BillingDetail";
import ModalRequestApproval from "./ModalRequestApproval";
import ModalApprovalBilling from "./ModalApprovalBilling";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import CardContainer from "../../../../components/CardContainer";

const BillingPage = () => {
  const { data, loading, data_approval_history } = useSelector(
    (state) => state.billing,
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;
  const detailRef = useRef(null);

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [valueTab, setValueTab] = useState("Billing Gas");
  const [pageDetail, setPageDetail] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [billingCode, setBillingCode] = useState("");
  const [ratingCode, setRatingCode] = useState("");
  const [saNumberId, setSANumberId] = useState("");
  const [calculationCodeId, setCalculationCodeId] = useState("");
  const [accountNumberId, setAccountNumberId] = useState("");
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedBillingData, setSelectedBillingData] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["statusApproval", "action"],
  }));

  useEffect(() => {
    if (pageDetail && activeRowKey && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [activeRowKey, pageDetail]);

  useEffect(() => {
    dispatch(
      getAllBillingPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: 100,
        sort,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, search, sort]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: data_approval_history?.dataApprover?.BILLING || [],
        dataHistory: data_approval_history?.dataHistory?.BILLING || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.BILLING_VIEW,
      breadcrumbName: "Billing",
    },
  ];

  const tabBilling = [
    {
      key: "All",
      label: "All",
    },
    {
      key: "Billing Gas",
      label: "Billing Gas",
    },
    {
      key: "Billing Non Gas",
      label: "Billing Non Gas",
      disabled: true,
    },
  ];

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

  const initialPageSize = 100;

  const handleLoadMore = async () => {
    const totalElements = data?.page?.totalElements || 0;
    const currentDataLength = dataSource?.length || 0;

    if (currentDataLength >= totalElements) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    await dispatch(
      getAllBillingPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );
    setPage(nextPage);
  };

  const hasMore = (dataSource?.length || 0) < (data?.page?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    dispatch(
      downloadBillingList({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
      }),
    );
  };

  const handleDetail = (record) => {
    const recordKey = record.billingCode || record.invoiceNumber;

    if (activeRowKey === recordKey && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setBillingCode("");
      setRatingCode("");
      setAccountNumberId("");
      setSANumberId("");
      setCalculationCodeId("");
      setSelectedBillingData(null);
    } else {
      setBillingCode(recordKey);
      setRatingCode(record.ratingCode);
      setAccountNumberId(record.accountNumber);
      setSANumberId(record.saNumber);
      setCalculationCodeId(record.calculationCode);
      setActiveRowKey(recordKey);
      setSelectedBillingData(record);
      setPageDetail(true);
    }
  };

  const handleApprovalHistory = (record) => {
    dispatch(getApprovalHistory(record.billingCode || record.invoiceNumber));
    setModalApprovalHistory(true);
  };

  const onChangeTab = (key) => {
    setValueTab(key);
    setSearch({});
    setPage(1);
  };

  const handleRefresh = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));

    if (valueTab === "Billing Gas" || valueTab === "All") {
      dispatch(
        getAllBillingPaginate({
          search: reqSearch,
          page: 1,
          pageSize: initialPageSize,
          sort,
          isLoadMore: false,
        }),
      );
    }

    dispatch(getAllBillingRequestPaginate());
    dispatch(getAllBillingApprovePaginate());
    setPage(1);
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Approval",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRequestApproval" width={20} color="#FFF" />}
          type="submit"
          onClick={() => setModalApproval(true)}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Request",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={20} />}
          type="submit"
          onClick={() => setModalRequest(true)}
        >
          Request Approval
        </ButtonComponent>
      ),
    },
    {
      action: "History",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Approval Hierarchy">
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleApprovalHistory(record);
              }}
              style={{
                cursor: "pointer",
                display: "inline-block",
                lineHeight: 0,
              }}
            >
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view", "history"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    width: valueTab === "All" ? 70 : 25,
    align: "center",
  }));

  const baseColumns = useMemo(() => {
    if (valueTab === "All") {
      return columnsAllBilling(
        0,
        0,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
      );
    }
    return columnsBilling(
      0,
      0,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
    );
  }, [valueTab, searchInput, searchedColumn, searchText, search]);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item) => ({
      ...item,
      key: item.billingCode || item.invoiceNumber,
    }));
  }, [dataSource]);

  const dataSourceForTab = useMemo(() => {
    return dataSourceWithKeys;
  }, [dataSourceWithKeys]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px]">Billing List</p>
              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <Tabs
            activeKey={valueTab}
            onChange={onChangeTab}
            type="line"
            size="small"
            className="[&_.ant-tabs-tab]:text-[12px] [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:pt-0 -mt-4"
            items={tabBilling.map((tab) => ({
              key: tab.key,
              label: tab.label,
              disabled: tab.disabled,
              children: (
                <div className="my-0">
                  <TableRBI
                    idTable="billing-table"
                    dataSource={dataSourceForTab}
                    columns={processedColumns}
                    totalData={data?.page?.totalElements || 0}
                    tableScrolled={{
                      x: valueTab === "All" ? 1000 : 11000,
                      y: 525,
                    }}
                    onSort={onSort}
                    handleDownload={handleDownload}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading}
                    showExport={false}
                    usePagination={false}
                    useInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    showRefresh={true}
                    onRefresh={handleRefresh}
                    loadMoreThreshold={20}
                    enableRowClick={true}
                    selectedRowKey={activeRowKey}
                    onRowClick={handleDetail}
                  />
                </div>
              ),
            }))}
          />
        </CardContainer>

        {pageDetail && (
          <div
            ref={detailRef}
            className="mt-0 border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-0"
          >
            <BillingDetail
              billingCodeId={billingCode}
              ratingCodeId={ratingCode}
              saNumberId={saNumberId}
              accountNumberId={accountNumberId}
              calculationCodeId={calculationCodeId}
              selectedBillingData={selectedBillingData}
              onClose={() => {
                setPageDetail(false);
                setActiveRowKey(null);
                setBillingCode("");
                setRatingCode("");
                setAccountNumberId("");
                setSANumberId("");
                setCalculationCodeId("");
                setSelectedBillingData(null);
              }}
            />
          </div>
        )}

        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        <ModalRequestApproval
          isOpen={modalRequest}
          handleCancel={() => setModalRequest(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalRequest(true)}
        />

        <ModalApprovalBilling
          isOpen={modalApproval}
          handleCancel={() => setModalApproval(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalApproval(true)}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default BillingPage;
