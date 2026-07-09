import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import useFormatNumberConfig from "../../../../hooks/useFormatNumberConfig";
import { useNavigate } from "react-router-dom";
import { Tooltip, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
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
  getListBillingPeriodForBilling,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import { checkAccountingExists } from "../../../../redux/slices/rating_billing_invoice/accounting";
import { showModalError } from "../../../../redux/slices/general_slice";
import { columnsBilling } from "./Table/TableViewBilling";
import BillingDetail from "./Detail/BillingDetail";
import ModalRequestApproval from "./ModalRequestApproval";
import ModalApprovalBilling from "./ModalApprovalBilling";
import ModalCancelBilling from "./ModalCancelBilling";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import CardContainer from "../../../../components/CardContainer";
import { CloseSquareOutlined } from "@ant-design/icons";
import SelectComponent from "../../../../components/SelectComponent";

const BillingPage = () => {
  const { data, loadingList, loadingHistory, data_approval_history, filters, list_billing_period } = useSelector(
    (state) => state.billing,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useFormatNumberConfig();
  const searchInput = useRef(null);
  const dataSource = data?.result;
  const detailRef = useRef(null);

  const [page, setPage] = useState(filters?.page || 1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState(filters?.sort || "");
  const [search, setSearch] = useState(filters?.search || {});

  const [pageDetail, setPageDetail] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [billingCode, setBillingCode] = useState("");
  const [billHeaderId, setBillHeaderId] = useState("");
  const [saNumberId, setSANumberId] = useState("");
  const [calculationCodeId, setCalculationCodeId] = useState("");
  const [accountNumberId, setAccountNumberId] = useState("");
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedBillingData, setSelectedBillingData] = useState(null);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("billingFixedColumns");
      return saved ? JSON.parse(saved) : { left: ["no"], right: ["statusApproval", "action"] };
    } catch (e) {
      return { left: ["no"], right: ["statusApproval", "action"] };
    }
  });

  // Save fixedColumns to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("billingFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  // Fetch billing period saat mount
  useEffect(() => {
    dispatch(getListBillingPeriodForBilling());
  }, [dispatch]);

  // Set default billing period ke bulan & tahun sekarang
  useEffect(() => {
    if (
      list_billing_period &&
      list_billing_period.length > 0 &&
      !selectedBillingPeriod
    ) {
      const now = new Date();
      const currentMonth = now.toLocaleString("en-US", { month: "short" });
      const currentYear = now.getFullYear();
      const currentPeriodName = `${currentMonth} ${currentYear}`;

      const currentPeriod = list_billing_period.find(
        (item) => item.name === currentPeriodName,
      );

      if (currentPeriod) {
        setSelectedBillingPeriod(currentPeriod.name);
      } else {
        setSelectedBillingPeriod(list_billing_period[0].name);
      }
    }
  }, [list_billing_period, selectedBillingPeriod]);

  // Simpan filters ke Redux
  useEffect(() => {
    dispatch(setBillingFilters({ search, sort, page }));
  }, [search, sort, page, dispatch]);

  // Reset filters saat unmount (pindah halaman) agar kembali ke semula
  useEffect(() => {
    return () => {
      dispatch(setBillingFilters({ search: {}, sort: "", page: 1 }));
    };
  }, [dispatch]);

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

  const initialPageSize = 100;

  useEffect(() => {
    if (selectedBillingPeriod) {
      dispatch(
        getAllBillingPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: initialPageSize,
          sort,
          billPeriod: selectedBillingPeriod,
          isLoadMore: false,
        }),
      );
      setPage(1);
    }
  }, [dispatch, search, sort, selectedBillingPeriod]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: {
          billing: data_approval_history?.dataApprover?.BILLING || [],
          canceled_billing:
            data_approval_history?.dataApprover?.CANCELED_BILLING || [],
        },
        dataHistory: {
          billing: data_approval_history?.dataHistory?.BILLING || [],
          canceled_billing:
            data_approval_history?.dataHistory?.CANCELED_BILLING || [],
        },
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

  const handleLoadMore = async () => {
    const totalElements = data?.page?.totalElements || 0;
    const currentDataLength = dataSource?.length || 0;

    if (currentDataLength >= totalElements) return;

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    if (selectedBillingPeriod) {
      await dispatch(
        getAllBillingPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          billPeriod: selectedBillingPeriod,
          isLoadMore: true,
        }),
      );
      setPage(nextPage);
    }
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
    if (selectedBillingPeriod) {
      dispatch(
        downloadBillingList({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize: loadMoreSize,
          sort,
          billPeriod: selectedBillingPeriod,
        }),
      );
    }
  };

  const handleDetail = (record) => {
    const recordKey = record.billHeaderId;

    if (activeRowKey === recordKey && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setBillingCode("");
      setBillHeaderId("");
      setAccountNumberId("");
      setSANumberId("");
      setCalculationCodeId("");
      setSelectedBillingData(null);
    } else {
      setBillingCode(record.billCode);
      setBillHeaderId(record.billHeaderId);
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

  const handleCancelBilling = (e, record) => {
    e.stopPropagation();
    setSelectedBillingData(record);
    setModalCancel(true);
  };

  const handleRefresh = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));

    if (selectedBillingPeriod) {
      dispatch(
        getAllBillingPaginate({
          search: reqSearch,
          page: 1,
          pageSize: initialPageSize,
          sort,
          billPeriod: selectedBillingPeriod,
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

  const handleBillingPeriodChange = (value) => {
    setSelectedBillingPeriod(value);
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
        const menu = (
          <Menu>
            <Menu.Item
              key="approval-history"
              icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={16} />}
              onClick={(e) => {
                e.domEvent.stopPropagation();
                handleApprovalHistory(record);
              }}
            >
              Approval History
            </Menu.Item>
            <Menu.Item
              key="create-accounting"
              icon={<SVGIcon name="IconButtonCreate" color={"#0075bf"} width={16} />}
              onClick={(e) => {
                e.domEvent.stopPropagation();
                dispatch(checkAccountingExists(record.invoiceNumber))
                  .unwrap()
                  .then((result) => {
                    if (result?.exists) {
                      dispatch(
                        showModalError({
                          title: "Accounting Already Exists",
                          description: `An accounting journal already exists for this billing (Status: ${result.status || "-"}). Please use View Accounting to review it.`,
                        })
                      );
                    } else {
                      navigate(RBI_ROUTES.ACCOUNTING_CREATE, {
                        state: { billingData: record },
                      });
                    }
                  })
                  .catch(() => {});
              }}
            >
              Create Accounting
            </Menu.Item>
            <Menu.Item
              key="view-accounting"
              icon={<SVGIcon name="IconReport" color={"#0075bf"} width={16} />}
              onClick={(e) => {
                e.domEvent.stopPropagation();
                navigate(RBI_ROUTES.ACCOUNTING_VIEW, {
                  state: { billingData: record },
                });
              }}
            >
              View Accounting
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
            >
              <MoreOutlined className="text-xl text-[#0075bf] cursor-pointer" />
            </div>
          </Dropdown>
        );
      },
    },
    {
      action: "Cancel",
      type: "table",
      render: (record) => (
        <Tooltip title="Cancel Billing">
          <div
            onClick={(e) => {
              handleCancelBilling(e, record);
            }}
            style={{
              cursor: "pointer",
              display: "inline-block",
              lineHeight: 0,
            }}
          >
            <CloseSquareOutlined
              width={20}
              style={{ color: "#0075BF" }}
            />
          </div>
        </Tooltip>
      ),
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view", "history", "cancel"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    width: 25,
    align: "center",
  }));

  const baseColumns = useMemo(() => {
    return columnsBilling(
      0,
      0,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
    );
  }, [searchInput, searchedColumn, searchText, handleSearch, search]);

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
    () =>
      allColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [allColumns],
  );

  const dataSourceWithKeys = useMemo(
    () => dataSource?.map((item) => ({ ...item, key: item.billHeaderId })),
    [dataSource],
  );

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px]">Billing List</p>
            <Toolbar items={itemGrantAccess} />
          </div>
        }
      >
        <TableRBI
          idTable="billing-table"
          dataSource={dataSourceWithKeys}
          columns={processedColumns}
          totalData={data?.page?.totalElements || 0}
          tableScrolled={{ x: 11000, y: 525 }}
          onSort={onSort}
          handleDownload={handleDownload}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loadingList}
          showExport={false}
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          showRefresh={true}
          onRefresh={handleRefresh}
          loadMoreThreshold={15}
          enableRowClick={true}
          selectedRowKey={activeRowKey}
          onRowClick={handleDetail}
          customHeaderLeft={
            <div className="flex items-center gap-1">
              <SelectComponent
                value={selectedBillingPeriod}
                onChange={handleBillingPeriodChange}
                placeholder="Select Period"
                style={{ width: "120px" }}
                options={(list_billing_period || []).map((item) => ({
                  label: item?.name,
                  value: item?.name,
                }))}
              />
            </div>
          }
        />
      </CardContainer>

      {pageDetail && (
        <div
          ref={detailRef}
          className="mt-0 border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-0"
        >
          <BillingDetail
            billingCodeId={billingCode}
            billHeaderId={billHeaderId}
            saNumberId={saNumberId}
            accountNumberId={accountNumberId}
            calculationCodeId={calculationCodeId}
            selectedBillingData={selectedBillingData}
            onClose={() => {
              setPageDetail(false);
              setActiveRowKey(null);
              setBillingCode("");
              setBillHeaderId("");
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
        tabOptions={[
          { value: "billing", label: "Request" },
          { value: "canceled_billing", label: "Cancel" },
        ]}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
        loading={loadingHistory}
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

      <ModalCancelBilling
        isOpen={modalCancel}
        handleCancel={() => setModalCancel(false)}
        handleRefresh={handleRefresh}
        handleOpenModal={() => setModalCancel(true)}
        selectedBilling={selectedBillingData}
      />
    </>
  );
};

export default BillingPage;
