import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Empty, message, Modal, Tabs } from "antd";
import { LeftOutlined, DownloadOutlined, EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import StatusComponent from "../../../../components/StatusComponent";
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
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";

const { TabPane } = Tabs;

const DetailEFaktur = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInput = useRef(null);

  const efakturId = location?.state?.id;

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
  const [pageAttachment, setPageAttachment] = useState(1);
  const [pageSizeAttachment, setPageSizeAttachment] = useState(10);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  
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
      breadcrumbName: "E-Faktur Detail",
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
    }
  }, [efakturId, activeTab, pageLog, pageSizeLog, dispatch]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleLogPaginationChange = (page, pageSize) => {
    setPageLog(page);
    setPageSizeLog(pageSize);
  };

  const handleAttachmentPaginationChange = (page, pageSize) => {
    setPageAttachment(page);
    setPageSizeAttachment(pageSize);
  };

  // ✅ Download Handler - menggunakan downloadUrl dari backend
  const handleDownloadAttachment = async (attachment) => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE + attachment.downloadUrl,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        }
      );

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      // Create temporary link to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success("File berhasil diunduh");
    } catch (error) {
      console.error("Download error:", error);
      message.error("Gagal mengunduh file");
    }
  };

  // ✅ Preview Handler - menggunakan downloadUrl dari backend (sama dengan download, tapi buka di tab baru)
  const handlePreviewAttachment = async (attachment) => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE + attachment.downloadUrl,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        }
      );

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      // Open in new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Preview error:", error);
      message.error("Gagal preview file");
    }
  };

  // ✅ Manual Upload Download Handler - menggunakan manualUploadDoc dari backend
  const handleDownloadManualUpload = async () => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE + detail_efaktur.manualUploadDoc,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        }
      );

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Manual_Upload_Document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success("File berhasil diunduh");
    } catch (error) {
      console.error("Download error:", error);
      message.error("Gagal mengunduh dokumen manual upload");
    }
  };

  // ✅ Manual Upload Preview Handler - menggunakan manualUploadDoc dari backend
  const handlePreviewManualUpload = async () => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE + detail_efaktur.manualUploadDoc,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        }
      );

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Preview error:", error);
      message.error("Gagal preview dokumen manual upload");
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
          return (
            <div>
              <div className="font-medium text-gray-900">{text || "-"}</div>
              {record.fileCategoryName && (
                <div className="text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {record.fileCategoryName}
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "category",
        title: "CATEGORY",
        dataIndex: "fileCategoryName",
        width: 150,
        align: "center",
        sorter: true,
        render: (text) => {
          if (!text) return "-";
          const getCategoryColor = (category) => {
            if (category.toLowerCase().includes("berita acara"))
              return "bg-green-100 text-green-800";
            if (category.toLowerCase().includes("surat"))
              return "bg-blue-100 text-blue-800";
            if (category.toLowerCase().includes("sk"))
              return "bg-orange-100 text-orange-800";
            return "bg-gray-100 text-gray-800";
          };

          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                text
              )}`}
            >
              {text}
            </span>
          );
        },
      },
      {
        key: "fileType",
        title: "FILE TYPE",
        dataIndex: "type",
        width: 120,
        align: "center",
        sorter: true,
        render: (text) => {
          if (!text) return "-";
          const displayType = text.split("/").pop().toUpperCase();
          return <span className="text-xs font-medium">{displayType}</span>;
        },
      },
      {
        key: "fileSize",
        title: "FILE SIZE",
        dataIndex: "fileSize",
        width: 120,
        align: "right",
        sorter: true,
        render: (size) => {
          if (!size) return "-";
          const kb = size / 1024;
          return kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
        },
      },
      {
        key: "createdBy",
        title: "UPLOAD BY",
        dataIndex: "createdBy",
        width: 150,
        sorter: true,
        render: (text) => text || "System",
      },
      {
        key: "createdDate",
        title: "UPLOAD DATE",
        dataIndex: "createdDate",
        width: 150,
        align: "center",
        sorter: true,
        render: (text) => {
          if (!text) return "-";
          return moment(text).format("DD MMM YYYY");
        },
      },
      {
        key: "action",
        title: "ACTION",
        width: 120,
        align: "center",
        render: (_, record) => (
          <div className="flex gap-2 justify-center">
            <ButtonComponent
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreviewAttachment(record)}
            />
            <ButtonComponent
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadAttachment(record)}
            />
          </div>
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

  const dataTabs = [
    { 
      value: "Invoice Detail",
      badge: 10
    },
    { 
      value: "Document Attachment",
      badge: detail_efaktur?.attachments?.length || 0
    },
    { 
      value: "Log Activity",
      badge: pagination_log?.totalElements || 0
    },
  ];

  const displayStatus = detail_efaktur?.status || "DRAFT";
  const attachmentCount = detail_efaktur?.attachments?.length || 0;

  return (
    <LayoutMenu>
      <Spin spinning={loading_detail}>
        <BreadCrumb routes={routes} />

        {/* E-FAKTUR INFORMATION Card */}
        <CardContainer 
          header={
            <div className="flex justify-between items-center">
              <span>E-FAKTUR INFORMATION</span>
              <ButtonComponent
                type="primary"
                onClick={() => message.info("Send to Customer feature coming soon")}
              >
                Send to Customer
              </ButtonComponent>
            </div>
          }
        >
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">
                E-Faktur Status
              </div>
              <StatusComponent colour={displayStatus.toLowerCase()}>
                {displayStatus.replace(/_/g, " ")}
              </StatusComponent>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">
                Customer
              </div>
              <div className="font-semibold text-gray-900">
                {detail_efaktur?.name || "-"}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">
                Customer Number
              </div>
              <div className="font-semibold text-gray-900">
                {detail_efaktur?.accountNumber || "-"}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">
                Total Billing
              </div>
              <div className="font-bold text-xl text-blue-600">
                {(detail_efaktur?.totalAmount || 0).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </div>
            </div>
          </div>
        </CardContainer>

        {/* E-FAKTUR DETAIL Card */}
        <CardContainer 
          header={
            <div className="flex justify-between items-center">
              <span>E-FAKTUR DETAIL</span>
              <ButtonComponent
                type="default"
                icon={<FileTextOutlined />}
                onClick={() => message.info("Export List feature coming soon")}
              >
                Export List
              </ButtonComponent>
            </div>
          }
        >
          {/* Tabs */}
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
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
              <div className="space-y-6 mt-4">
                {/* GENERAL INFORMATION */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    GENERAL INFORMATION
                  </h3>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Billing Code</div>
                      <div className="text-sm font-medium">{detail_efaktur?.billingCode || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Invoice Date</div>
                      <div className="text-sm font-medium">
                        {detail_efaktur?.invoiceDate ? moment(detail_efaktur.invoiceDate).format("DD MMMM YYYY") : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Billing Period</div>
                      <div className="text-sm font-medium">{detail_efaktur?.billPeriode || "-"}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Invoice Number</div>
                      <div className="text-sm font-medium">{detail_efaktur?.invoiceNumber || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Faktur Code</div>
                      <div className="text-sm font-medium">{detail_efaktur?.efakturNo || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">E-Faktur Date</div>
                      <div className="text-sm font-medium">
                        {detail_efaktur?.efakturDate ? moment(detail_efaktur.efakturDate).format("DD MMMM YYYY") : "-"}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Account Number</div>
                      <div className="text-sm font-medium">{detail_efaktur?.accountNumber || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Account Name</div>
                      <div className="text-sm font-medium">{detail_efaktur?.accountName || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Account Segment</div>
                      <div className="text-sm font-medium">{detail_efaktur?.accountSegment || "-"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">SOR</div>
                      <div className="text-sm font-medium">{detail_efaktur?.sor || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Cost Center</div>
                      <div className="text-sm font-medium">{detail_efaktur?.costCenter || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Meter Reading Code</div>
                      <div className="text-sm font-medium">{detail_efaktur?.meterReadingCode || "-"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Type PPN</div>
                      <div className="text-sm font-medium">{detail_efaktur?.typePpn || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Transaction Code</div>
                      <div className="text-sm font-medium">{detail_efaktur?.transactionCode || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">TKU Code</div>
                      <div className="text-sm font-medium">{detail_efaktur?.tkuCode || "-"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Due Date</div>
                      <div className="text-sm font-medium">
                        {detail_efaktur?.dueDate ? moment(detail_efaktur.dueDate).format("DD MMMM YYYY") : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Type</div>
                      <div className="text-sm font-medium">{detail_efaktur?.type || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status Approval</div>
                      <div className="text-sm font-medium">{detail_efaktur?.statusApproval || "-"}</div>
                    </div>

                    <div className="col-span-3">
                      <div className="text-xs text-gray-500 mb-1">Note</div>
                      <div className="text-sm font-medium">{detail_efaktur?.remark || "-"}</div>
                    </div>
                  </div>
                </div>

                {/* CUSTOMER INFORMATION */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    CUSTOMER INFORMATION
                  </h3>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Customer Name</div>
                      <div className="text-sm font-medium">{detail_efaktur?.name || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Email</div>
                      <div className="text-sm font-medium">{detail_efaktur?.email || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Country Code</div>
                      <div className="text-sm font-medium">{detail_efaktur?.countryCode || "-"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">NPWP Customer</div>
                      <div className="text-sm font-medium">{detail_efaktur?.npwpCust || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">NIK/Passport</div>
                      <div className="text-sm font-medium">{detail_efaktur?.nikPasport || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">DJP Info User ID</div>
                      <div className="text-sm font-medium">{detail_efaktur?.djpInfoUserId || "-"}</div>
                    </div>

                    <div className="col-span-3">
                      <div className="text-xs text-gray-500 mb-1">Full Address</div>
                      <div className="text-sm font-medium">{detail_efaktur?.fullAddress || "-"}</div>
                    </div>
                  </div>
                </div>

                {/* TAX INFORMATION */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    TAX INFORMATION
                  </h3>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">DPP</div>
                      <div className="text-sm font-medium">
                        {(detail_efaktur?.dpp || 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">PPN</div>
                      <div className="text-sm font-medium">
                        {(detail_efaktur?.ppn || 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">PPNBM</div>
                      <div className="text-sm font-medium">
                        {(detail_efaktur?.ppnbm || 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Other DPP</div>
                      <div className="text-sm font-medium">
                        {(detail_efaktur?.otherDpp || 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Discount</div>
                      <div className="text-sm font-medium">
                        {(detail_efaktur?.discount || 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                      <div className="text-sm font-bold text-blue-600">
                        {(detail_efaktur?.totalAmount || 0).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Masa Pajak</div>
                      <div className="text-sm font-medium">{detail_efaktur?.masaPajak || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tahun Pajak</div>
                      <div className="text-sm font-medium">{detail_efaktur?.tahunPajak || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Referensi</div>
                      <div className="text-sm font-medium">{detail_efaktur?.referensi || "-"}</div>
                    </div>
                  </div>
                </div>

                {/* APPROVAL INFORMATION */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    APPROVAL INFORMATION
                  </h3>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Created By</div>
                      <div className="text-sm font-medium">{detail_efaktur?.createdBy || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Created Date</div>
                      <div className="text-sm font-medium">
                        {detail_efaktur?.createdDtm ? moment(detail_efaktur.createdDtm).format("DD MMMM YYYY HH:mm:ss") : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Updated By</div>
                      <div className="text-sm font-medium">{detail_efaktur?.updatedBy || "-"}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Updated Date</div>
                      <div className="text-sm font-medium">
                        {detail_efaktur?.updatedDtm ? moment(detail_efaktur.updatedDtm).format("DD MMMM YYYY HH:mm:ss") : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Approved By</div>
                      <div className="text-sm font-medium">{detail_efaktur?.approvedBy || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Approved Date</div>
                      <div className="text-sm font-medium">
                        {detail_efaktur?.approvedDtm ? moment(detail_efaktur.approvedDtm).format("DD MMMM YYYY HH:mm:ss") : "-"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Approval Hierarchy</div>
                      <div className="text-sm font-medium">{detail_efaktur?.approvalHierarchy || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status PJAP</div>
                      <div className="text-sm font-medium">{detail_efaktur?.statusPjap || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">PJAP ID</div>
                      <div className="text-sm font-medium break-all">{detail_efaktur?.pjapId || "-"}</div>
                    </div>
                  </div>
                </div>
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
              <div className="space-y-4 mt-4">
                {/* Manual Upload Document Section */}
                {detail_efaktur?.manualUploadDoc && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileTextOutlined className="text-2xl text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Manual Upload Document</div>
                          <div className="text-xs text-gray-500">E-Faktur PDF Document</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ButtonComponent
                          type="default"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={handlePreviewManualUpload}
                        >
                          Preview
                        </ButtonComponent>
                        <ButtonComponent
                          type="primary"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={handleDownloadManualUpload}
                        >
                          Download
                        </ButtonComponent>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attachments Table */}
                <TableRBI
                  dataSource={
                    detail_efaktur?.attachments?.map((item, index) => ({
                      ...item,
                      key: item.id || index,
                    })) || []
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
              </div>
            </TabPane>

            {/* Tab 3: Log Activity */}
            <TabPane
              tab={
                <span>
                  Log Activity
                  {(pagination_log?.totalElements || 0) > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                      {pagination_log?.totalElements || 0}
                    </span>
                  )}
                </span>
              }
              key="3"
            >
              <div className="mt-4">
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
              </div>
            </TabPane>
          </Tabs>
        </CardContainer>

        {/* Back Button */}
        <div className="flex justify-start my-5">
          <ButtonComponent
            type="submit"
            border={false}
            icon={<LeftOutlined style={{ color: "#fff", fontSize: 16 }} />}
            onClick={() => navigate(-1)}
          >
            Back
          </ButtonComponent>
        </div>

        {/* Preview Modal */}
        <Modal
          visible={previewVisible}
          title={previewFile?.name}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width={800}
          centered
        >
          {previewFile?.type?.includes("pdf") ? (
            <iframe
              src={previewFile.url}
              style={{ width: "100%", height: "600px" }}
              title="PDF Preview"
            />
          ) : previewFile?.type?.includes("image") ? (
            <img
              src={previewFile.url}
              alt="Preview"
              style={{ width: "100%", maxHeight: "600px", objectFit: "contain" }}
            />
          ) : null}
        </Modal>

        {/* Modals */}
        <ModalBuatFakturPengganti
          visible={modalFakturPengganti}
          onCancel={() => setModalFakturPengganti(false)}
          onSuccess={() => {
            setModalFakturPengganti(false);
            navigate(INVOICE_ROUTES.EFAKTUR_VIEW);
          }}
          billingData={detail_efaktur}
        />

        <ModalGenerateXML
          visible={modalGenerateXML}
          onCancel={() => setModalGenerateXML(false)}
          efakturId={efakturId}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default DetailEFaktur;