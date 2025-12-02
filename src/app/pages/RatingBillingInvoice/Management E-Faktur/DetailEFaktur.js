import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Tabs, Empty, message } from "antd";
import { LeftOutlined, DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import ModalBuatFakturPengganti from "./ModalEfaktur/ModalBuatFakturPengganti";
import ModalGenerateXML from "./ModalEfaktur/ModalGenerateXML";
import {
  getDetailEFaktur,
  getLogActivity,
  resetEFakturState,
} from "../../../../redux/slices/rating_billing_invoice/efakturSlice";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const { TabPane } = Tabs;

const DetailEFaktur = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInput = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  const efakturId = searchParams.get("efakturId");

  // Redux state
  const {
    detail_efaktur,
    log_activity,
    loading_detail,
    loading_log,
    pagination_log,
  } = useSelector((state) => state.efaktur);

  // Local state
  const [activeTab, setActiveTab] = useState("1");
  const [modalFakturPengganti, setModalFakturPengganti] = useState(false);
  const [modalGenerateXML, setModalGenerateXML] = useState(false);
  const [pageLog, setPageLog] = useState(1);
  const [pageSizeLog, setPageSizeLog] = useState(10);
  const [hasLoadedLog, setHasLoadedLog] = useState(false);
  const [pageAttachment, setPageAttachment] = useState(1);
  const [pageSizeAttachment, setPageSizeAttachment] = useState(10);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fixedColumnsAttachment, setFixedColumnsAttachment] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));
  const [fixedColumnsLog, setFixedColumnsLog] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.EFAKTUR_VIEW,
      breadcrumbName: "Manajemen E-Faktur",
    },
    {
      path: INVOICE_ROUTES.EFAKTUR_VIEW_DETAIL,
      breadcrumbName: "Detail E-Faktur",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (efakturId) {
        try {
          await dispatch(getDetailEFaktur(efakturId));
        } catch (error) {
          message.error("Gagal memuat data E-Faktur");
        }
      }
    };

    fetchData();

    return () => {
      dispatch(resetEFakturState());
      setHasLoadedLog(false);
    };
  }, [efakturId, dispatch]);

  useEffect(() => {
    if (efakturId && activeTab === "3") {
      dispatch(
        getLogActivity({
          efakturId: efakturId,
          page: pageLog,
          size: pageSizeLog,
        })
      );
      setHasLoadedLog(true);
    }
  }, [efakturId, activeTab, pageLog, pageSizeLog, dispatch]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "3" && !hasLoadedLog) {
      setPageLog(1);
    }
  };

  const handleLogPaginationChange = (page, pageSize) => {
    setPageLog(page);
    setPageSizeLog(pageSize);
  };

  const handleAttachmentPaginationChange = (page, pageSize) => {
    setPageAttachment(page);
    setPageSizeAttachment(pageSize);
  };

  const handleKirimKePelanggan = () => {
    message.info("Fitur kirim ke pelanggan akan segera tersedia");
  };

  const handleUnduhPDF = () => {
    if (detail_efaktur?.finalUploadDoc) {
      window.open(detail_efaktur.finalUploadDoc, "_blank");
    } else if (detail_efaktur?.manualUploadDoc) {
      window.open(detail_efaktur.manualUploadDoc, "_blank");
    } else {
      message.warning("Dokumen PDF tidak tersedia");
    }
  };

  const handleGenerateXML = () => {
    if (!efakturId) {
      message.error("E-Faktur ID tidak ditemukan");
      return;
    }
    setModalGenerateXML(true);
  };

  const handleBuatFakturPengganti = () => {
    setModalFakturPengganti(true);
  };

  const handleSuccessFakturPengganti = () => {
    message.success("Faktur pengganti berhasil dibuat!");
    navigate(INVOICE_ROUTES.EFAKTUR_VIEW);
  };

  const handleDownloadAttachment = (attachment) => {
    if (attachment.downloadUrl) {
      const fullUrl = `${process.env.REACT_APP_BASE_URL || ""}${
        attachment.downloadUrl
      }`;
      window.open(fullUrl, "_blank");
    } else {
      message.error("URL download tidak tersedia");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  // Columns for Log Activity
  const baseColumnsLog = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (_, __, index) => (pageLog - 1) * pageSizeLog + index + 1,
      },
      {
        key: "createdDtm",
        title: "TIME",
        dataIndex: "createdDtm",
        width: 180,
        sorter: true,
        filteredValue: [search?.createdDtm] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdDtm",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        render: (text) => {
          if (!text) return "-";
          const formatted = moment(text).format("DD-MM-YYYY HH:mm:ss");
          return renderDateColumn(
            "createdDtm",
            hasValue(search["createdDtm"]),
            searchText,
            formatted,
            "date",
            search
          );
        },
      },
      {
        key: "createdBy",
        title: "USERS",
        dataIndex: "createdBy",
        width: 150,
        sorter: true,
        filteredValue: [search?.createdBy] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdBy",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "createdBy",
            hasValue(search["createdBy"]),
            searchText,
            text || "-",
            false,
            "input",
            search
          ),
      },
      {
        key: "activity",
        title: "ACTIVITY",
        dataIndex: "activity",
        width: 300,
        sorter: true,
        filteredValue: [search?.activity] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "activity",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "activity",
            hasValue(search["activity"]),
            searchText,
            text || "-",
            false,
            "input",
            search
          ),
      },
      {
        key: "message",
        title: "MESSAGE / NOTE",
        dataIndex: "message",
        width: 300,
        sorter: true,
        filteredValue: [search?.message] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "message",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "message",
            hasValue(search["message"]),
            searchText,
            text || "-",
            false,
            "input",
            search
          ),
      },
    ],
    [pageLog, pageSizeLog, search, searchText, searchedColumn]
  );

  const processedColumnsLog = useMemo(() => {
    return applyFixedColumns(baseColumnsLog, fixedColumnsLog);
  }, [baseColumnsLog, fixedColumnsLog]);

  const columnDefinitionsLog = useMemo(() => {
    return baseColumnsLog.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumnsLog]);

  // Columns for Attachments
  const baseColumnsAttachments = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (_, __, index) =>
          (pageAttachment - 1) * pageSizeAttachment + index + 1,
      },
      {
        key: "fileName",
        title: "FILE NAME",
        dataIndex: "fileName",
        width: 300,
        sorter: true,
        filteredValue: [search?.fileName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "fileName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text, record) => {
          const fileName = renderColumn(
            "fileName",
            hasValue(search["fileName"]),
            searchText,
            text,
            false,
            "input",
            search
          );

          return (
            <div>
              <div className="font-medium text-blue-600">{fileName}</div>
              {record.fileCategoryName && (
                <div className="text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {record.fileCategoryName}
                  </span>
                </div>
              )}
              {record.description && (
                <div className="text-xs text-gray-400 mt-1">
                  {record.description}
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "type",
        title: "CATEGORY",
        dataIndex: "fileCategoryName",
        width: 150,
        sorter: true,
        filteredValue: [search?.fileCategoryName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "fileCategoryName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => {
          if (!text) return "-";

          const getCategoryColor = (category) => {
            if (category.toLowerCase().includes("berita acara"))
              return "bg-green-100 text-green-800 border-green-300";
            if (category.toLowerCase().includes("surat"))
              return "bg-blue-100 text-blue-800 border-blue-300";
            if (category.toLowerCase().includes("sk1"))
              return "bg-orange-100 text-orange-800 border-orange-300";
            return "bg-gray-100 text-gray-800 border-gray-300";
          };

          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(
                text
              )}`}
            >
              {renderColumn(
                "fileCategoryName",
                hasValue(search["fileCategoryName"]),
                searchText,
                text,
                false,
                "input",
                search
              )}
            </span>
          );
        },
      },
      {
        key: "fileType",
        title: "FILE TYPE",
        dataIndex: "type",
        width: 150,
        sorter: true,
        filteredValue: [search?.type] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "type",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => {
          if (!text) return "-";

          const getTypeColor = (type) => {
            if (type.includes("pdf")) return "text-red-600 bg-red-50";
            if (type.includes("image")) return "text-green-600 bg-green-50";
            if (type.includes("excel") || type.includes("spreadsheet"))
              return "text-green-600 bg-green-50";
            if (type.includes("word") || type.includes("document"))
              return "text-blue-600 bg-blue-50";
            return "text-gray-600 bg-gray-50";
          };

          const displayType = text.split("/").pop().toUpperCase();

          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                text
              )}`}
            >
              {renderColumn(
                "type",
                hasValue(search["type"]),
                searchText,
                displayType,
                false,
                "input",
                search
              )}
            </span>
          );
        },
      },
      {
        key: "fileSize",
        title: "FILE SIZE",
        dataIndex: "fileSize",
        width: 120,
        align: "right",
        sorter: true,
        filteredValue: [search?.fileSize] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "fileSize",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (size) => {
          if (!size) return "-";
          const kb = size / 1024;
          const formatted =
            kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
          return renderColumn(
            "fileSize",
            hasValue(search["fileSize"]),
            searchText,
            formatted,
            false,
            "input",
            search
          );
        },
      },
      {
        key: "createdBy",
        title: "UPLOAD BY",
        dataIndex: "createdBy",
        width: 150,
        sorter: true,
        filteredValue: [search?.createdBy] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdBy",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => {
          const displayText = text || "System";
          return (
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {renderColumn(
                  "createdBy",
                  hasValue(search["createdBy"]),
                  searchText,
                  displayText,
                  false,
                  "input",
                  search
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: "createdDate",
        title: "UPLOAD DATE",
        dataIndex: "createdDate",
        width: 180,
        sorter: true,
        filteredValue: [search?.createdDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        render: (text) => {
          if (!text) return "-";
          return (
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {renderDateColumn(
                  "createdDate",
                  hasValue(search["createdDate"]),
                  searchText,
                  moment(text).format("DD MMM YYYY"),
                  "date",
                  search
                )}
              </div>
              <div className="text-xs text-gray-500">
                {moment(text).format("HH:mm:ss")}
              </div>
            </div>
          );
        },
      },
      {
        key: "action",
        title: "ACTION",
        width: 120,
        align: "center",
        render: (_, record) => (
          <ButtonComponent
            type="primary"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadAttachment(record)}
            className="w-full"
          >
            Download
          </ButtonComponent>
        ),
      },
    ],
    [pageAttachment, pageSizeAttachment, search, searchText, searchedColumn]
  );

  const processedColumnsAttachment = useMemo(() => {
    return applyFixedColumns(baseColumnsAttachments, fixedColumnsAttachment);
  }, [baseColumnsAttachments, fixedColumnsAttachment]);

  const columnDefinitionsAttachment = useMemo(() => {
    return baseColumnsAttachments.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumnsAttachments]);

  if (loading_detail && !detail_efaktur) {
    return (
      <LayoutMenu>
        <div className="flex flex-col justify-center items-center h-screen">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 text-base">
            Memuat detail E-Faktur...
          </p>
          <p className="mt-2 text-gray-400 text-sm">Mohon tunggu sebentar</p>
        </div>
      </LayoutMenu>
    );
  }

  if (!loading_detail && !detail_efaktur) {
    return (
      <LayoutMenu>
        <BreadCrumb routes={routes} />
        <CardContainer header="Detail E-Faktur">
          <Empty
            description="Data E-Faktur tidak ditemukan"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <ButtonComponent
              type="primary"
              onClick={() => navigate(INVOICE_ROUTES.EFAKTUR_VIEW)}
            >
              Kembali ke List
            </ButtonComponent>
          </Empty>
        </CardContainer>
      </LayoutMenu>
    );
  }

  const displayStatus = detail_efaktur?.efakturStatus || "NOT_GENERATED";

  const billingDataForModal = detail_efaktur
    ? {
        billingCode: detail_efaktur.billingCode,
        invoiceNumber: detail_efaktur.invoiceNumber,
        customerName: detail_efaktur.customerName,
        accountNumber: detail_efaktur.accountNumber,
        invoiceDate: moment(detail_efaktur.invoiceDate).format("DD-MM-YYYY"),
        billingPeriod: detail_efaktur.billingPeriod,
        totalAmountEqvIdr: detail_efaktur.totalAmountEqvIdr,
        efakturNo: detail_efaktur.efakturNo,
        efakturId: detail_efaktur.efakturId,
        efakturStatus: detail_efaktur.efakturStatus,
      }
    : null;

  const attachmentCount = detail_efaktur?.attachments?.length || 0;
  const logCount = pagination_log?.totalElements || 0;

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      <CardContainer header="E-FAKTUR INFORMATION">
        {/* Header Info Section */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">
              E-Faktur Status
            </div>
            <div>
              <span className="inline-block px-3 py-1.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                {displayStatus.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">
              Customer
            </div>
            <div className="font-semibold text-gray-900 text-sm">
              {detail_efaktur?.customerName || "-"}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">
              Account Number
            </div>
            <div className="font-semibold text-gray-900 text-sm">
              {detail_efaktur?.accountNumber || "-"}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">
              Total Billing
            </div>
            <div className="font-bold text-xl text-blue-600">
              {detail_efaktur?.totalAmountEqvIdr?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              }) || "Rp 0"}
            </div>
          </div>
        </div>
      </CardContainer>

      <CardContainer header="E-FAKTUR DETAIL">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          tabBarExtraContent={
            <ButtonComponent
              type="default"
              border={false}
              icon={<LeftOutlined style={{ fontSize: "12px" }} />}
              onClick={() => navigate(INVOICE_ROUTES.EFAKTUR_VIEW)}
              size="small"
            >
              Back
            </ButtonComponent>
          }
        >
          {/* Tab 1: Invoice Detail */}
          <TabPane
            tab={
              <span>
                Invoice Detail
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                  10
                </span>
              </span>
            }
            key="1"
          >
            <div className="space-y-6">
              {/* General Info Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b">
                  GENERAL INFORMATION
                </h3>
                <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Invoice Number
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.invoiceNumber || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      E-Faktur Number
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.efakturNo || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Billing Code
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.billingCode || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Type PPN
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.typePpn || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Invoice Date
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.invoiceDate
                        ? moment(detail_efaktur.invoiceDate).format(
                            "DD MMMM YYYY"
                          )
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      E-Faktur Date
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.efakturDate
                        ? moment(detail_efaktur.efakturDate).format(
                            "DD MMMM YYYY, HH:mm"
                          )
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Billing Period
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.billingPeriod || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      E-Faktur Type
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.efakturType || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b">
                  CUSTOMER INFORMATION
                </h3>
                <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Customer Name
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.customerName || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Account Number
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.accountNumber || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Account Name
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.accountName || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      NPWP
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.npwp || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      NIK/Passport
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.nikPasp || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Email
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.email || "-"}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Address
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {detail_efaktur?.alamat || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b">
                  SUMMARY
                </h3>
                <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      DPP
                    </div>
                    <div className="font-bold text-gray-900 text-sm">
                      {detail_efaktur?.dpp?.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }) || "Rp 0"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      PPN
                    </div>
                    <div className="font-bold text-gray-900 text-sm">
                      {detail_efaktur?.ppn?.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }) || "Rp 0"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Total
                    </div>
                    <div className="font-bold text-gray-900 text-sm">
                      {detail_efaktur?.totalAmountEqvIdr?.toLocaleString(
                        "id-ID",
                        {
                          style: "currency",
                          currency: "IDR",
                        }
                      ) || "Rp 0"}
                    </div>
                  </div>
                </div>
              </div>

              {detail_efaktur?.remark && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b">
                    NOTES
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="text-sm text-gray-900">
                      {detail_efaktur.remark}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabPane>

          {/* Tab 2: Document Attachment */}
          <TabPane
            tab={
              <span>
                Document Attachment
                {attachmentCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                    {attachmentCount}
                  </span>
                )}
              </span>
            }
            key="2"
          >
            <TableRBI
              dataSource={
                detail_efaktur?.attachments
                  ? detail_efaktur.attachments.map((item) => ({
                      ...item,
                      key: item.id,
                    }))
                  : []
              }
              columns={processedColumnsAttachment}
              current={pageAttachment}
              pageSize={pageSizeAttachment}
              onChange={handleAttachmentPaginationChange}
              onSizeChanger={handleAttachmentPaginationChange}
              totalData={attachmentCount}
              tableScrolled={{ x: 1200, y: 400 }}
              loading={loading_detail}
              columnDefinitions={columnDefinitionsAttachment}
              fixedColumns={fixedColumnsAttachment}
              setFixedColumns={setFixedColumnsAttachment}
            />
          </TabPane>

          {/* Tab 3: Log Activity */}
          <TabPane
            tab={
              <span>
                Log Activity
                {logCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                    {logCount}
                  </span>
                )}
              </span>
            }
            key="3"
          >
            <TableRBI
              dataSource={log_activity || []}
              columns={processedColumnsLog}
              current={pageLog}
              pageSize={pageSizeLog}
              onChange={handleLogPaginationChange}
              onSizeChanger={handleLogPaginationChange}
              totalData={pagination_log?.totalElements || 0}
              tableScrolled={{ x: 1000, y: 400 }}
              loading={loading_log}
              columnDefinitions={columnDefinitionsLog}
              fixedColumns={fixedColumnsLog}
              setFixedColumns={setFixedColumnsLog}
            />
          </TabPane>
        </Tabs>
      </CardContainer>

      {/* Modals */}
      <ModalBuatFakturPengganti
        visible={modalFakturPengganti}
        onCancel={() => setModalFakturPengganti(false)}
        onSuccess={handleSuccessFakturPengganti}
        billingData={billingDataForModal}
      />

      <ModalGenerateXML
        visible={modalGenerateXML}
        onCancel={() => setModalGenerateXML(false)}
        efakturId={efakturId}
      />
    </LayoutMenu>
  );
};

export default DetailEFaktur;
