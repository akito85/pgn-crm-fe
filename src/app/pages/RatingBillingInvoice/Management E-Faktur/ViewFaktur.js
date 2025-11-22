import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Spin,
  Tooltip,
  Dropdown,
  message,
} from "antd";
import {
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import ModalGenerateEFaktur from "./ModalEfaktur/ModalGenerateEFaktur";
import ModalGenerateXML from "./ModalEfaktur/ModalGenerateXML";
import ModalUploadEFaktur from "./ModalEfaktur/ModalUploadEFaktur";
import ModalApprovalEFaktur from "./ModalEfaktur/ModalApprovalEFaktur ";
import ModalReplaceEFaktur from "./ModalEfaktur/ModalReplaceEFaktur";
import ModalCancelEFaktur from "./ModalEfaktur/ModalCancelEFaktur ";
import LogAktivitasEFaktur from "./LogAktivitasEFaktur";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import {
  getListEFaktur,
  downloadEFakturList,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/efakturSlice";

const ViewFaktur = () => {
  // Selector
  const {
    list_efaktur,
    loading,
    pagination,
    data_approval_history,
    loading_approval_history,
  } = useSelector((state) => state.efaktur);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = list_efaktur || [];

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("invoiceDate~desc");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [modalGenerateEFaktur, setModalGenerateEFaktur] = useState(false);
  const [modalGenerateXML, setModalGenerateXML] = useState(false);
  const [modalUploadEFaktur, setModalUploadEFaktur] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [logAktivitasOpen, setLogAktivitasOpen] = useState(false);
  const [modalReplaceFaktur, setModalReplaceFaktur] = useState(false);
  const [modalCancelFaktur, setModalCancelFaktur] = useState(false);

  const [selectedBilling, setSelectedBilling] = useState(null);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["efakturStatus","action"],
  }));

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.EFAKTUR_VIEW,
      breadcrumbName: "Manajemen E-Faktur",
    },
  ];

  // Fetch data with filters
  useEffect(() => {
    dispatch(
      getListEFaktur({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, search, page, pageSize, sort]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: data_approval_history?.dataApprover?.EFAKTUR || [],
        dataHistory: data_approval_history?.dataHistory?.EFAKTUR || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Handle Search
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

  // Handle Change Page
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadEFakturList({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  // Handle Actions
  const handleGenerateEFaktur = (record) => {
    setSelectedBilling(record);
    setModalGenerateEFaktur(true);
  };

  const handleCancelFaktur = (record) => {
    setSelectedBilling(record);
    setModalCancelFaktur(true);
  };

  const handleReplaceFaktur = (record) => {
    setSelectedBilling(record);
    setModalReplaceFaktur(true);
  };

  const handleApprovalHistory = async (record) => {
    if (!record.efakturId) {
      message.warning("E-Faktur belum dibuat untuk billing ini");
      return;
    }

    if (loading_approval_history) {
      return;
    }
    await dispatch(getApprovalHistory(record.efakturId));
    setModalApprovalHistory(true);
  };

  const handleGenerateXML = (record) => {
    setSelectedBilling(record);
    setModalGenerateXML(true);
  };

  const handleUploadEFaktur = (record) => {
    setSelectedBilling(record);
    setModalUploadEFaktur(true);
  };

  const handleApproval = (record) => {
    setSelectedBilling(record);
    setModalApproval(true);
  };

  const handleLogAktivitas = (record) => {
    setSelectedBilling(record);
    setLogAktivitasOpen(true);
  };

  const handleRefresh = () => {
    dispatch(
      getListEFaktur({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  // Close Modal Functions
  const closeModalGenerateEFaktur = () => {
    setModalGenerateEFaktur(false);
    setSelectedBilling(null);
  };

  const closeModalGenerateXML = () => {
    setModalGenerateXML(false);
    setSelectedBilling(null);
  };

  const closeModalCancelFaktur = () => {
    setModalCancelFaktur(false);
    setSelectedBilling(null);
  };

  const closeModalUploadEFaktur = () => {
    setModalUploadEFaktur(false);
    setSelectedBilling(null);
  };

  const closeModalApproval = () => {
    setModalApproval(false);
    setSelectedBilling(null);
  };
  
  const closeModalReplaceFaktur = () => {
    setModalReplaceFaktur(false);
    setSelectedBilling(null);
  };

  const closeModalApprovalHistory = () => {
    setModalApprovalHistory(false);
  };

  const closeLogAktivitas = () => {
    setLogAktivitasOpen(false);
    setSelectedBilling(null);
  };

  // Columns Definition
  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "efakturNo",
        title: "KODE FAKTUR",
        dataIndex: "efakturNo",
        width: 180,
        align: "left",
        sorter: true,
        filteredValue: [search?.efakturNo] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "efakturNo",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "efakturNo",
            hasValue(search["efakturNo"]),
            searchText,
            text || "-",
            false,
            "input",
            search
          ),
      },
      {
        key: "invoiceNumber",
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        width: 180,
        align: "left",
        sorter: true,
        filteredValue: [search?.invoiceNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "invoiceNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "invoiceNumber",
            hasValue(search["invoiceNumber"]),
            searchText,
            text || "-",
            false,
            "input",
            search
          ),
      },
      {
        key: "billingCode",
        title: "BILLING CODE",
        dataIndex: "billingCode",
        width: 180,
        align: "left",
        sorter: true,
        filteredValue: [search?.billingCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billingCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "billingCode",
            hasValue(search["billingCode"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "typePpn",
        title: "TYPE PPN",
        dataIndex: "typePpn",
        width: 180,
        align: "left",
        sorter: true,
        filteredValue: [search?.typePpn] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "typePpn",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "typePpn",
            hasValue(search["typePpn"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "customerName",
        title: "CUSTOMER",
        dataIndex: "customerName",
        width: 250,
        align: "left",
        sorter: true,
        filteredValue: [search?.customerName] || null,
        ellipsis: { showTitle: false },
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
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 150,
        align: "left",
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
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "billingPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billingPeriod",
        width: 120,
        align: "center",
        sorter: true,
        filteredValue: [search?.billingPeriod] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billingPeriod",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datePeriod"
        ),
        render: (text) =>
          renderDateColumn(
            "billingPeriod",
            hasValue(search["billingPeriod"]),
            searchText,
            text,
            "datePeriod",
            search
          ),
      },
      {
        key: "invoiceDate",
        title: "INVOICE DATE",
        dataIndex: "invoiceDate",
        width: 120,
        align: "center",
        sorter: true,
        filteredValue: [search?.invoiceDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "invoiceDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        render: (text) => {
          const formattedDate = text ? moment(text).format("DD-MM-YYYY") : "-";
          return renderDateColumn(
            "invoiceDate",
            hasValue(search["invoiceDate"]),
            searchText,
            formattedDate,
            "date",
            search
          );
        },
      },
      {
        key: "totalAmountEqvIdr",
        title: "TOTAL AMOUNT (IDR)",
        dataIndex: "totalAmountEqvIdr",
        width: 180,
        align: "right",
        sorter: true,
        filteredValue: [search?.totalAmountEqvIdr] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "totalAmountEqvIdr",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (value) => {
          const displayText = `Rp ${value?.toLocaleString("id-ID") || 0}`;
          return renderColumn(
            "totalAmountEqvIdr",
            hasValue(search["totalAmountEqvIdr"]),
            searchText,
            displayText,
            false,
            "input",
            search
          );
        },
      },
      {
        key: "efakturStatus",
        title: "STATUS E-FAKTUR",
        dataIndex: "efakturStatus",
        width: 180,
        align: "center",
        sorter: true,
        filteredValue: [search?.efakturStatus] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "efakturStatus",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (status) => {
          const statusColors = {
            APPROVED: "bg-green-100 text-green-800 border-green-300",
            PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
            AWAITING_APPROVAL: "bg-orange-100 text-orange-800 border-orange-300",
            FAILED: "bg-red-100 text-red-800 border-red-300",
            REJECTED: "bg-red-100 text-red-800 border-red-300",
            SUCCESS_UPLOAD: "bg-green-100 text-green-800 border-green-300",
            NOT_GENERATED: "bg-gray-100 text-gray-800 border-gray-300",
          };

          const displayStatus = status || "NOT_GENERATED";
          const statusLabel = displayStatus.replace(/_/g, " ");

          return (
            <div className="flex justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  statusColors[displayStatus] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {renderColumn(
                  "efakturStatus",
                  hasValue(search["efakturStatus"]),
                  searchText,
                  statusLabel,
                  false,
                  "status",
                  search
                )}
              </span>
            </div>
          );
        },
      },
      {
        key: "replacement",
        title: "REPLACEMENT",
        dataIndex: "replacement",
        width: 120,
        align: "center",
        sorter: true,
        filteredValue: [search?.replacement] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "replacement",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (replacement) => {
          if (!replacement) {
            return <span className="text-gray-400">-</span>;
          }

          if (replacement === "Y") {
            return (
              <Tooltip title="Faktur ini sudah diganti dengan faktur baru">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300">
                  {renderColumn(
                    "replacement",
                    hasValue(search["replacement"]),
                    searchText,
                    "REPLACED",
                    false,
                    "input",
                    search
                  )}
                </span>
              </Tooltip>
            );
          }

          if (replacement === "N") {
            return (
              <Tooltip title="Faktur pengganti terbaru">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                  {renderColumn(
                    "replacement",
                    hasValue(search["replacement"]),
                    searchText,
                    "LATEST",
                    false,
                    "input",
                    search
                  )}
                </span>
              </Tooltip>
            );
          }

          return <span className="text-gray-400">-</span>;
        },
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  // Item Grant Access untuk action columns
  const itemGrantAccess = [
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

    // Column Action Table - Approval History
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Approval History">
            <div
              className="pt-1 cursor-pointer"
              onClick={() => handleApprovalHistory(record)}
            >
              <SVGIcon name="IconLogHistory" color="#0075bf" width={20} />
            </div>
          </Tooltip>
        );
      },
    },

    // Column Action Table - More Actions
    {
      action: "Update",
      type: "table",
      render: (record) => {
        const menuItems = [
          {
            key: "detail",
            label: "Detail",
            icon: <SVGIcon name="IconDetail" width={16} />,
            onClick: () => {
              window.location.href = `${INVOICE_ROUTES.EFAKTUR_VIEW_DETAIL}?efakturId=${record.efakturId}`;
            },
          },
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
            onClick: () => handleLogAktivitas(record),
          },
        ];

        if (record.replacement === "Y") {
          return (
            <Tooltip title="Faktur ini sudah diganti, tidak dapat dimodifikasi">
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottomRight"
                disabled
              >
                <div className="pt-1 cursor-not-allowed opacity-50">
                  <MoreOutlined style={{ fontSize: 20, color: "#595959" }} />
                </div>
              </Dropdown>
            </Tooltip>
          );
        }

        // Generate E-Faktur
        if (!record.efakturStatus || record.efakturStatus === "NOT_GENERATED") {
          menuItems.push(
            { type: "divider" },
            {
              key: "generate",
              label: "Generate E-Faktur",
              icon: <PlusOutlined style={{ color: "#52c41a" }} />,
              onClick: () => handleGenerateEFaktur(record),
            }
          );
        }

        // Failed status actions
        if (record.efakturStatus === "FAILED") {
          menuItems.push(
            { type: "divider" },
            {
              key: "generate-xml",
              label: "Generate XML (Manual)",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke="#fa8c16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleGenerateXML(record),
            },
            {
              key: "upload-efaktur",
              label: "Upload E-Faktur dari DJP",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    stroke="#722ed1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleUploadEFaktur(record),
            }
          );
        }
        
        if (
          record.efakturStatus === "SUCCESS" ||
          record.efakturStatus === "SUCCESS_UPLOAD" ||
          record.efakturStatus === "APPROVED"
        ) {
          menuItems.push(
            { type: "divider" },
            {
              key: "generate-xml-approved",
              label: "Generate XML",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke="#52c41a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleGenerateXML(record),
            }
          );

          if (record.replacement !== "Y") {
            menuItems.push({
              key: "replace-faktur",
              label: "Buat Faktur Pengganti",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    stroke="#1890ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleReplaceFaktur(record),
            });
          }

          if (
            record.efakturStatus !== "CANCELLED" &&
            record.replacement !== "Y"
          ) {
            menuItems.push({
              key: "cancel-faktur",
              label: "Batalkan E-Faktur",
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="#ff4d4f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              onClick: () => handleCancelFaktur(record),
              danger: true,
            });
          }
        }

        return (
          <Tooltip title="Aksi Lainnya">
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="pt-1 cursor-pointer">
                <MoreOutlined style={{ fontSize: 20, color: "#595959" }} />
              </div>
            </Dropdown>
          </Tooltip>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view", "update"],
    itemGrantAccess
  );

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

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">E-Faktur Management</p>
              <div className="mt-[15px]">
                <Toolbar items={itemGrantAccess} />
              </div>
            </div>
          }
        >
          {/* Table Section */}
          <div className="my-5">
            <TableRBI
              dataSource={dataSource}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={pagination?.totalElements || 0}
              tableScrolled={{ x: 2500, y: 525 }}
              onSort={onSort}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

        {/* Modal Generate E-Faktur */}
        <ModalGenerateEFaktur
          isOpen={modalGenerateEFaktur}
          handleClose={closeModalGenerateEFaktur}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalGenerateEFaktur();
            handleRefresh();
          }}
        />

        {/* Modal Generate XML */}
        <ModalGenerateXML
          isOpen={modalGenerateXML}
          handleClose={closeModalGenerateXML}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalGenerateXML();
            handleRefresh();
          }}
        />

        {/* Modal Upload E-Faktur */}
        <ModalUploadEFaktur
          isOpen={modalUploadEFaktur}
          handleClose={closeModalUploadEFaktur}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalUploadEFaktur();
            handleRefresh();
          }}
        />

        <ModalReplaceEFaktur
          isOpen={modalReplaceFaktur}
          handleClose={closeModalReplaceFaktur}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalReplaceFaktur();
            handleRefresh();
          }}
        />

        {/* Modal Approval */}
        <ModalApprovalEFaktur
          isOpen={modalApproval}
          handleClose={closeModalApproval}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalApproval();
            handleRefresh();
          }}
        />

        <ModalCancelEFaktur
          isOpen={modalCancelFaktur}
          handleClose={closeModalCancelFaktur}
          billingData={selectedBilling}
          onSuccess={() => {
            closeModalCancelFaktur();
            handleRefresh();
          }}
        />

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && data_approval_history}
          handleClose={closeModalApprovalHistory}
          header={"Approval History"}
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
          loading={loading_approval_history}
        />

        {/* Log Aktivitas E-Faktur */}
        <LogAktivitasEFaktur
          isOpen={logAktivitasOpen}
          handleClose={closeLogAktivitas}
          billingData={selectedBilling}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default ViewFaktur;