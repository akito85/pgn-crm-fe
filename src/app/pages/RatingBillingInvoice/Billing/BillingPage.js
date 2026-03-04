import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tooltip } from "antd";
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
  setBillingFilters,
  resetBillingData,
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
  const { data, loading, data_approval_history, filters } = useSelector(
    (state) => state.billing,
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;
  const detailRef = useRef(null);

  // fetchId: counter unik per-fetch untuk deteksi fetch yang sudah kadaluarsa
  const fetchIdRef = useRef(0);

  const [page, setPage] = useState(filters?.page || 1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState(filters?.sort || "");
  const [search, setSearch] = useState(filters?.search || {});

  const [valueTab, setValueTab] = useState("Billing Gas");
  const [pageDetail, setPageDetail] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [billingCode, setBillingCode] = useState("");
  const [sourceNumber, setSourceNumber] = useState("");
  const [saNumberId, setSANumberId] = useState("");
  const [calculationCodeId, setCalculationCodeId] = useState("");
  const [accountNumberId, setAccountNumberId] = useState("");
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedBillingData, setSelectedBillingData] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["statusApproval", "action"],
  }));

  // Simpan filters ke Redux
  useEffect(() => {
    dispatch(setBillingFilters({ search, sort, page }));
  }, [search, sort, page, dispatch]);

  // Scroll ke detail saat row dipilih
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

  // Fetch utama dengan triple-protection (debounce + fetchId + Redux requestId)
  useEffect(() => {
    dispatch(resetBillingData());
    const currentFetchId = ++fetchIdRef.current;

    const timer = setTimeout(() => {
      if (currentFetchId !== fetchIdRef.current) return;

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
    }, 400);

    return () => clearTimeout(timer);
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
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.BILLING_VIEW, breadcrumbName: "Billing" },
  ];

  const tabBilling = [
    { key: "All", label: "All" },
    { key: "Billing Gas", label: "Billing Gas" },
    { key: "Billing Non Gas", label: "Billing Non Gas", disabled: true },
  ];

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] === selectedKeys[0]) return prevState;
      setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  }, []);

  const initialPageSize = 100;

  const handleLoadMore = async () => {
    const totalElements = data?.page?.totalElements || 0;
    const currentDataLength = dataSource?.length || 0;

    if (currentDataLength >= totalElements) return;

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

  const handleDetail = (record, rowKey) => {
    const recordKey = rowKey || record.billCode;

    if (activeRowKey === recordKey && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setBillingCode("");
      setSourceNumber("");
      setAccountNumberId("");
      setSANumberId("");
      setCalculationCodeId("");
      setSelectedBillingData(null);
    } else {
      setBillingCode(record.billCode);
      setSourceNumber(record.sourceNumber);
      setAccountNumberId(record.accountNumber);
      setSANumberId(record.saNumber);
      setCalculationCodeId(record.calculationCode);
      setActiveRowKey(recordKey); 
      setSelectedBillingData(record);
      setPageDetail(true);
    }
  };

  const handleApprovalHistory = (record) => {
    dispatch(getApprovalHistory(record.billCode));
    setModalApprovalHistory(true);
  };

  const onChangeTab = (key) => {
    fetchIdRef.current = 0;
    dispatch(resetBillingData());
    setValueTab(key);
    setSearch({});
    setSearchText("");
    setSearchedColumn("");
    setPage(1);
    setPageDetail(false);
    setActiveRowKey(null);
    setBillingCode("");
    setSourceNumber("");
    setAccountNumberId("");
    setSANumberId("");
    setCalculationCodeId("");
    setSelectedBillingData(null);
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

    dispatch(
      getAllBillingRequestPaginate({
        search: encodeURIComponent(JSON.stringify({})),
        page: 1,
        pageSize: initialPageSize,
        sort: "",
      }),
    );
    dispatch(
      getAllBillingApprovePaginate({
        search: encodeURIComponent(JSON.stringify({})),
        page: 1,
        pageSize: initialPageSize,
        sort: "",
        isLoadMore: false,
      }),
    );
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
      render: (record) => (
        <Tooltip title="Approval Hierarchy">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleApprovalHistory(record);
            }}
            style={{ cursor: "pointer", display: "inline-block", lineHeight: 0 }}
          >
            <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
          </div>
        </Tooltip>
      ),
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
      return columnsAllBilling(0, 0, searchInput, searchedColumn, searchText, handleSearch, search);
    }
    return columnsBilling(0, 0, searchInput, searchedColumn, searchText, handleSearch, search);
  }, [valueTab, searchInput, searchedColumn, searchText, handleSearch, search]);

  const allColumns = useMemo(() => {
    return [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(
    () => applyFixedColumns(allColumns, fixedColumns),
    [allColumns, fixedColumns],
  );

  const columnDefinitions = useMemo(
    () => allColumns.map((col) => ({ key: col.key || col.dataIndex || col.title, title: col.title })),
    [allColumns],
  );

  const dataSourceWithKeys = useMemo(
    () => dataSource?.map((item) => ({ ...item, key: item.billCode })),
    [dataSource],
  );

  return (
    <LayoutMenu>
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
                  dataSource={dataSourceWithKeys}
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
            sourceNumber={sourceNumber}
            saNumberId={saNumberId}
            accountNumberId={accountNumberId}
            calculationCodeId={calculationCodeId}
            selectedBillingData={selectedBillingData}
            onClose={() => {
              setPageDetail(false);
              setActiveRowKey(null);
              setBillingCode("");
              setSourceNumber("");
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
    </LayoutMenu>
  );
};

export default BillingPage;