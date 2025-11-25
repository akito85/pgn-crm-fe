import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Radio, Tooltip } from "antd";
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
    (state) => state.billing
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;
  const detailRef = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

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
      label: "Billing Gas",
      value: "Billing Gas",
    },
    {
      label: "Billing Non Gas",
      value: "Billing Non Gas",
      disabled: true,
    },
    {
      label: "All",
      value: "All",
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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      downloadBillingList({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
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
    } else {
      setBillingCode(recordKey);
      setRatingCode(record.ratingCode);
      setAccountNumberId(record.accountNumber);
      setSANumberId(record.saNumber);
      setCalculationCodeId(record.calculationCode);
      setActiveRowKey(recordKey);
      setPageDetail(true);
    }
  };

  const handleApprovalHistory = (record) => {
    dispatch(getApprovalHistory(record.billingCode || record.invoiceNumber));
    setModalApprovalHistory(true);
  };

  const onChangeTab = ({ target: { value } }) => {
    setValueTab(value);
    setSearch({});
    setPage(1);
  };

  const handleRefresh = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getAllBillingPaginate({ search: reqSearch, page, pageSize, sort })
    );
    dispatch(getAllBillingRequestPaginate());
    dispatch(getAllBillingApprovePaginate());
  };

  const itemGrantAccess = [
    // {
    //   action: "Download",
    //   render: (
    //     <ButtonComponent
    //       icon={<SVGIcon name="IconButtonDownload" width={24} />}
    //       type="submit"
    //       onClick={handleDownload}
    //     >
    //       Download List
    //     </ButtonComponent>
    //   ),
    // },
    {
      action: "Approval",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRequestApproval" width={24} color="#FFF" />}
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
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
          onClick={() => setModalRequest(true)}
        >
          Request Approval
        </ButtonComponent>
      ),
    },
    // {
    //   action: "View",
    //   type: "table",
    //   render: (record) => {
    //     return (
    //       <Tooltip title="Detail">
    //         <div className="pt-1">
    //           <SVGIcon
    //             name="IconDetail"
    //             width={24}
    //             onClick={() => handleDetail(record)}
    //           />
    //         </div>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      action: "History",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Approval Hierarchy">
            <div className="pt-1">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={24}
                onClick={() => handleApprovalHistory(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view", "history"],
    itemGrantAccess
  );

  const baseColumns = useMemo(() => {
    if (valueTab === "All") {
      return columnsAllBilling(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      );
    }
    return columnsBilling(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search
    );
  }, [
    valueTab,
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    search,
  ]);

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
    if (valueTab === "All") {
      return [
        {
          key: "INV-2024-001",
          invoiceNumber: "INV-2024-001",
          billingType: "Gas",
          quantity: 1500,
          totalAmountIdr: 75000000,
          transactionDate: "2024-01-15",
          remark: "Regular monthly billing for gas supply",
        },
        {
          key: "INV-2024-002",
          invoiceNumber: "INV-2024-002",
          billingType: "Non Gas",
          quantity: 500,
          totalAmountIdr: 25000000,
          transactionDate: "2024-01-20",
          remark: "Additional service charges",
        },
        {
          key: "INV-2024-003",
          invoiceNumber: "INV-2024-003",
          billingType: "Gas",
          quantity: 2000,
          totalAmountIdr: 100000000,
          transactionDate: "2024-02-01",
          remark: "Peak season billing",
        },
      ];
    }
    return dataSourceWithKeys;
  }, [valueTab, dataSourceWithKeys]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">Billing List</p>
              <div className="mt-[15px] flex gap-[20px]">
                <Toolbar items={itemGrantAccess} />
              </div>
            </div>
          }
          type="tabs"
          element={
            <Radio.Group
              options={tabBilling}
              onChange={onChangeTab}
              value={valueTab}
              optionType="button"
              buttonStyle="solid"
              style={{ gap: 12, display: "flex" }}
            />
          }
        >
          <div className="my-5">
            <TableRBI
              dataSource={dataSourceForTab}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={
                valueTab === "All" ? 3 : data?.page?.totalElements || 0
              }
              tableScrolled={{ x: valueTab === "All" ? 1500 : 3500, y: 525 }}
              onSort={onSort}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              onRow={(record) => ({
                onClick: () => handleDetail(record),
                style: {
                  cursor: 'pointer',
                  backgroundColor: activeRowKey === (record.billingCode || record.invoiceNumber)
                    ? '#bae7ff'
                    : 'transparent',
                  transition: 'background-color 0.2s ease',
                },
                onMouseEnter: (e) => {
                  if (activeRowKey !== (record.billingCode || record.invoiceNumber)) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                },
                onMouseLeave: (e) => {
                  if (activeRowKey !== (record.billingCode || record.invoiceNumber)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                },
              })}
            />
          </div>
        </CardContainer>

        {pageDetail && (
          <div
            ref={detailRef}
            className="mt-6 border-t-4 border-blue-500 pt-4 bg-blue-50/30 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-blue-700">
                  Billing Detail: {billingCode}
                </h3>
              </div>
              <button
                onClick={() => {
                  setPageDetail(false);
                  setActiveRowKey(null);
                  setBillingCode("");
                  setRatingCode("");
                  setAccountNumberId("");
                  setSANumberId("");
                  setCalculationCodeId("");
                }}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                title="Close Detail"
              >
                ✕
              </button>
            </div>

            <BillingDetail
              billingCodeId={billingCode}
              ratingCodeId={ratingCode}
              saNumberId={saNumberId}
              accountNumberId={accountNumberId}
              calculationCodeId={calculationCodeId}
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