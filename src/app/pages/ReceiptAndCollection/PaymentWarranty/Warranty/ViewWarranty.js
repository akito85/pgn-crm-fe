import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Radio, Tooltip, Dropdown, Menu } from "antd";
import { EyeOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { NavLink, Link } from "react-router-dom";

import SVGIcon from "../../../../../assets/Icon/index";
import { ReloadOutlined, DownOutlined, PauseCircleOutlined, MailOutlined } from "@ant-design/icons";

// Routes
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";

// Utils
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import TableRBI from "../../../../../components/TableRBI";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";

// Local Custom Components

// Column Configuration
import { columnWarranty } from "./ColumnConfig/WarrantyColumns";

// Redux / Service
import { 
  getAllWarrantyListPaginate,
  downloadWarrantyList
} from "../../../../../redux/slices/receipt_collection/warranty";

// Modal
import ModalRefund from "./Modal/ModalRefund";
import ModalHold from "./Modal/ModalHold";
import ModalRelease from "./Modal/ModalRelease";
import { render } from "@testing-library/react";

const BillingPage = () => {
  const { data, loading } = useSelector(
    (state) => state.warranty
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

  const [pageDetail, setPageDetail] = useState(false);
  const [modalRefund, setModalRefund] = useState(false);
  const [modalHold, setModalHold] = useState(false);
  const [modalRelease, setModalRelease] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [billingCode, setBillingCode] = useState("");
  const [ratingCode, setRatingCode] = useState("");
  const [saNumberId, setSANumberId] = useState("");
  const [calculationCodeId, setCalculationCodeId] = useState("");
  const [accountNumberId, setAccountNumberId] = useState("");
  const [activeRowKey, setActiveRowKey] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
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
      getAllWarrantyListPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Payment Warranty",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY,
      breadcrumbName: "Warranty List",
    }
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
      downloadWarrantyList({
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
    // dispatch(getApprovalHistory(record.billingCode || record.invoiceNumber));
    // setModalApprovalHistory(true);
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
      getAllWarrantyListPaginate({ search: reqSearch, page, pageSize, sort })
    );
    // dispatch(getAllBillingRequestPaginate());
    // dispatch(getAllBillingApprovePaginate());
  };

  const moreMenu = (
    <Menu>
      <Menu.Item key="Refund" onClick={() => setModalRefund(true)}>
        <div className="flex items-center gap-2">
          <SVGIcon name="IconRefund" color={"#241919ff"} width={16} />
          <span>Refund</span>
        </div>
      </Menu.Item>
      <Menu.Item key="Hold" onClick={() => setModalHold(true)}>
        <div className="flex items-center gap-2">
          <SVGIcon name="IconHold" color={"#000000"} width={16} />
          <span>Hold</span>
        </div>
      </Menu.Item>
      <Menu.Item key="Release" onClick={() => setModalRelease(true)}>
        <div className="flex items-center gap-2">
          <SVGIcon name="IconSend" color={"#000000"} width={16} />
          <span>Release</span>
        </div>
      </Menu.Item>
    </Menu>
  );
  
  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_DEDUCTION}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Deduction
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title={"Detail"}>
            <Link
              // Ensure this route exists or use a placeholder if DETAIL_DEDUCTION is not yet defined
              to={`${RECEIPT_AND_COLLECTION_ROUTES.DETAIL_WARRANTY}`}
              state={{ id: record?.id }}
            >
              <EyeOutlined style={{ color: "#1890ff", fontSize: "24px" }} />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Delete",
      action: "Hapus",
      type: "table",
      render: (record, record_length) => {
        return (
          <Tooltip title={"Delete"}>
            <div onClick={() => console.log('Delete', record)} style={{ cursor: 'pointer' }}>
              <SVGIcon name="IconDelete" width={24} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      // action: 'History',
      action: 'Hapus',
      type: 'table',
      render: (record, record_length) => {
        return (
          <Tooltip title={"History"}>
            <div onClick={() => console.log('History', record)} style={{ cursor: 'pointer' }}>
              <SVGIcon
                name="IconLogHistory"
                width={24}
                color={"#0075bf"}
              />
            </div>
          </Tooltip>
        )
      }
    }
  ];

  const actionCols = useColumnActionPermission(
    ["view", "history", "hapus"],
    itemGrantAccess
  ).map((col) => ({
    ...col,
    width: 80,
    align: "center",
  }));

  const baseColumns = useMemo(() => {
    return columnWarranty(
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search
    );
  }, [
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
    return dataSourceWithKeys;
  }, [dataSourceWithKeys]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        {/* <CardContainer header={"Warranty List"}> */}
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">Warranty List</p>
              <div className="flex gap-2">
                  <Dropdown overlay={moreMenu} trigger={['click']}>
                    <ButtonComponent
                      type="default"
                    >
                      More Actions <DownOutlined />
                    </ButtonComponent>
                  </Dropdown>
              </div>
          </div>
        }>
          <div className="my-5">
            <TableRBI
              dataSource={dataSourceForTab}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={ data?.page?.totalElements || 0 }
              tableScrolled={{ x: 5000, y: 525 }}
              onSort={onSort}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              onRow={(record) => ({
                onClick: () => handleDetail(record),
                style: {
                  cursor: "pointer",
                  backgroundColor:
                    activeRowKey ===
                    (record.billingCode || record.invoiceNumber)
                      ? "#bae7ff"
                      : "transparent",
                  transition: "background-color 0.2s ease",
                },
                onMouseEnter: (e) => {
                  if (
                    activeRowKey !==
                    (record.billingCode || record.invoiceNumber)
                  ) {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }
                },
                onMouseLeave: (e) => {
                  if (
                    activeRowKey !==
                    (record.billingCode || record.invoiceNumber)
                  ) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                },
              })}
            />
          </div>
        </CardContainer>

        <ModalRefund
          isOpen={modalRefund}
          handleBack={() => setModalRefund(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalRefund(true)}
        />

        <ModalHold
          isOpen={modalHold}
          handleBack={() => setModalHold(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalHold(true)}
        />

        <ModalRelease
          isOpen={modalRelease}
          handleBack={() => setModalRelease(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalRelease(true)}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default BillingPage;
