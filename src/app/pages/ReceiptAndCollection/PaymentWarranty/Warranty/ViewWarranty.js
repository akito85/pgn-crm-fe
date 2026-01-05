import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Radio, Tooltip, Dropdown } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";

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

  const itemGrantAccess = [
    {
      action: "View",
      render: (
        <ButtonComponent
        icon={<ReloadOutlined />}  
        type="submit"
          onClick={() => setModalRefund(true)}
        >
          Refund
        </ButtonComponent>
      ),
    },
    {
      action: "View",
      render: (
        <ButtonComponent
        icon={<PauseCircleOutlined />}  
        type="submit"
          onClick={() => setModalHold(true)}
        >
          Hold
        </ButtonComponent>
      ),
    },
    {
      action: "View",
      render: (
        <ButtonComponent
        icon={<MailOutlined />}  
        type="submit"
          onClick={() => setModalRelease(true)}
        >
          Release
        </ButtonComponent>
      ),
    },
    {
      action: "Hapus",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Aksi Lainnya">
            <Dropdown
              menu={{ items: [
                {
                  key: "log",
                  label: "Log Aktivitas",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 12H15M9 8H15M9 16H12M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                        stroke="#52c41a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                  onClick: () => null,
                },
              ]}}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="cursor-pointer">
                <MoreOutlined style={{ fontSize: 20, color: "#595959" }} />
              </div>
            </Dropdown>
          </Tooltip>
        )
      }
    },
    {
      action: "Hapus",
      type: "table",
      render: (record) => {
        const status = record.approvalStatus?.toUpperCase(); // Menggunakan 's' dan optional chaining
        const isDelete = status === "DRAFT" || status === "REJECTED";
        return (
          <Tooltip title="Delete">
            <SVGIcon
              name="IconDelete"
              width={24}
              color={isDelete ? "#D90000" : "#8D91A0"}
              className={isDelete ? undefined : "disabled cursor-not-allowed"}
              onClick={isDelete ? () => undefined : undefined}
            />
          </Tooltip>
        );
      },
    },
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
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">Warranty List</p>
              <div className="mt-[15px] flex gap-[20px]">
                <Toolbar items={itemGrantAccess} />
              </div>
            </div>
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
          handleCancel={() => setModalRefund(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalRefund(true)}
        />

        <ModalHold
          isOpen={modalHold}
          handleCancel={() => setModalHold(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalHold(true)}
        />

        <ModalRelease
          isOpen={modalRelease}
          handleCancel={() => setModalRelease(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalRelease(true)}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default BillingPage;
