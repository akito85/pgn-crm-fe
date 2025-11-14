import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Table, Tabs, Empty, message } from "antd";
import { LeftOutlined, DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import ModalBuatFakturPengganti from "./ModalEfaktur/ModalBuatFakturPengganti";
import ModalGenerateXML from "./ModalEfaktur/ModalGenerateXML";
import {
  getDetailEFaktur,
  getAllBillingItemPaginate,
  getLogActivity,
  resetEFakturState,
} from "../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { TabPane } = Tabs;

// Tambahkan constant untuk base URL
const CUSTOM_BASE_URL = process.env.REACT_APP_BASE_URL_NGROK;

const DetailEFaktur = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const billingCode = searchParams.get("billingCode");

  // Redux state
  const {
    detail_efaktur,
    data_billingItem,
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

  const statusConfig = {
    APPROVED: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    PROCESSING: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
    },
    AWAITING_APPROVAL: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-300",
    },
    FAILED: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
    REJECTED: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
    SUCCESS_UPLOAD: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    NOT_GENERATED: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },
  };

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
      if (billingCode) {
        try {
          await Promise.all([
            dispatch(getDetailEFaktur(billingCode)),
            dispatch(getAllBillingItemPaginate(billingCode))
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
          message.error("Gagal memuat data E-Faktur");
        }
      }
    };

    fetchData();

    return () => {
      dispatch(resetEFakturState());
      setHasLoadedLog(false);
    };
  }, [billingCode, dispatch]);

  useEffect(() => {
    if (detail_efaktur?.efakturId && activeTab === "3") {
      dispatch(
        getLogActivity({
          efakturId: detail_efaktur.efakturId,
          page: pageLog,
          size: pageSizeLog,
        })
      );
      setHasLoadedLog(true);
    }
  }, [detail_efaktur?.efakturId, activeTab, pageLog, pageSizeLog, dispatch]);

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

  const handleKirimKePelanggan = () => {
    message.info("Fitur kirim ke pelanggan akan segera tersedia");
  };

  const handleUnduhPDF = () => {
    if (detail_efaktur?.finalUploadDoc) {
      const fullUrl = `${CUSTOM_BASE_URL || ""}${detail_efaktur.finalUploadDoc}`;
      window.open(fullUrl, "_blank");
    } else if (detail_efaktur?.manualUploadDoc) {
      const fullUrl = `${CUSTOM_BASE_URL || ""}${detail_efaktur.manualUploadDoc}`;
      window.open(fullUrl, "_blank");
    } else {
      message.warning("Dokumen PDF tidak tersedia");
    }
  };

  const handleGenerateXML = () => {
    if (!detail_efaktur?.efakturId) {
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
      const fullUrl = `${CUSTOM_BASE_URL || ""}${attachment.downloadUrl}`;
      window.open(fullUrl, "_blank");
    } else {
      message.error("URL download tidak tersedia");
    }
  };

  const calculateTotals = () => {
    return {
      dpp: detail_efaktur?.dpp || 0,
      ppn: detail_efaktur?.ppn || 0,
      total: detail_efaktur?.totalAmount || 0,
    };
  };

  const totals = calculateTotals();

  const columnsRincianFaktur = [
    {
      title: "#",
      dataIndex: "lineNumber",
      key: "lineNumber",
      width: 60,
      align: "center",
    },
    {
      title: "Nama Barang/Jasa",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.description && (
            <div className="text-xs text-gray-500">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: "Kuantitas",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "right",
      render: (value, record) => {
        const qty = parseFloat(value);
        return `${qty.toLocaleString("id-ID")} ${record.uom || ""}`;
      },
    },
    {
      title: "Harga Satuan",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 180,
      align: "right",
      render: (value, record) => {
        const symbol = record.currency === "USD" ? "$" : "Rp";
        return `${symbol} ${value?.toLocaleString("id-ID")}`;
      },
    },
    {
      title: "Jumlah",
      dataIndex: "total",
      key: "total",
      width: 180,
      align: "right",
      render: (value, record) => {
        const symbol = record.currency === "USD" ? "$" : "Rp";
        return (
          <span className="font-semibold">
            {symbol} {value?.toLocaleString("id-ID")}
          </span>
        );
      },
    },
  ];

  const columnsLog = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 60,
      align: "center",
      render: (_, __, index) => (pageLog - 1) * pageSizeLog + index + 1,
    },
    {
      title: "WAKTU",
      dataIndex: "createdDtm",
      key: "createdDtm",
      width: 180,
      render: (text) => {
        if (!text) return "-";
        return moment(text).format("DD-MM-YYYY HH:mm:ss");
      },
    },
    {
      title: "PENGGUNA",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "AKTIVITAS",
      dataIndex: "activity",
      key: "activity",
      width: 300,
      render: (text) => (
        <div className="text-sm">
          {text || "-"}
        </div>
      ),
    },
    {
      title: "PESAN / CATATAN",
      dataIndex: "message", 
      key: "message",
      width: 300,
      render: (text) => (
        <div className="text-sm text-gray-600">
          {text || "-"}
        </div>
      ),
    },
  ];

  const columnsAttachments = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Nama File",
      dataIndex: "fileName",
      key: "fileName",
      render: (text, record) => (
        <div>
          <div className="font-medium text-blue-600">{text}</div>
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
      ),
    },
    {
      title: "Tipe File",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text) => {
        if (!text) return "-";
        
        const getTypeColor = (type) => {
          if (type.includes("pdf")) return "text-red-600 bg-red-50";
          if (type.includes("image")) return "text-green-600 bg-green-50";
          if (type.includes("excel") || type.includes("spreadsheet")) return "text-green-600 bg-green-50";
          if (type.includes("word") || type.includes("document")) return "text-blue-600 bg-blue-50";
          return "text-gray-600 bg-gray-50";
        };
        
        const displayType = text.split("/").pop().toUpperCase();
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getTypeColor(text)}`}>
            {displayType}
          </span>
        );
      },
    },
    {
      title: "Ukuran File",
      dataIndex: "fileSize",
      key: "fileSize",
      width: 120,
      align: "right",
      render: (size) => {
        if (!size) return "-";
        const kb = size / 1024;
        if (kb < 1024) return `${kb.toFixed(2)} KB`;
        return `${(kb / 1024).toFixed(2)} MB`;
      },
    },
    {
      title: "Upload Oleh",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
      render: (text) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{text || "System"}</div>
        </div>
      ),
    },
    {
      title: "Tanggal Upload",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 180,
      render: (text) => {
        if (!text) return "-";
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {moment(text).format("DD MMM YYYY")}
            </div>
            <div className="text-xs text-gray-500">
              {moment(text).format("HH:mm:ss")}
            </div>
          </div>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      width: 120,
      align: "center",
      fixed: "right",
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
  ];

  if (loading_detail && !detail_efaktur) {
    return (
      <LayoutMenu>
        <div className="flex flex-col justify-center items-center h-screen">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 text-base">Memuat detail E-Faktur...</p>
          <p className="mt-2 text-gray-400 text-sm">Mohon tunggu sebentar</p>
        </div>
      </LayoutMenu>
    );
  }

  if (!loading_detail && !detail_efaktur) {
    return (
      <LayoutMenu>
        <BreadCrumb routes={routes} />
        <BaseContainer header="Detail E-Faktur">
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
        </BaseContainer>
      </LayoutMenu>
    );
  }

  const displayStatus = detail_efaktur?.efakturStatus || "NOT_GENERATED";
  const statusStyle = statusConfig[displayStatus] || statusConfig.NOT_GENERATED;

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

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      <BaseContainer
        header={`Detail E-Faktur: ${
          detail_efaktur?.efakturNo || detail_efaktur?.billingCode || ""
        }`}
      >
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold text-base">
                  Informasi Faktur
                </h3>
                <div className="flex gap-2">
                  {(displayStatus === "APPROVED" || 
                    displayStatus === "PROCESSING" || 
                    displayStatus === "SUCCESS_UPLOAD") && (
                    <>
                      <ButtonComponent
                        type="default"
                        onClick={handleGenerateXML}
                        size="small"
                      >
                        Generate XML
                      </ButtonComponent>
                      <ButtonComponent
                        type="default"
                        onClick={handleUnduhPDF}
                        size="small"
                        disabled={!detail_efaktur?.manualUploadDoc && !detail_efaktur?.finalUploadDoc}
                      >
                        Unduh PDF
                      </ButtonComponent>
                    </>
                  )}
                  {(displayStatus === "APPROVED" || displayStatus === "SUCCESS_UPLOAD") && (
                    <>
                      <ButtonComponent
                        type="primary"
                        onClick={handleKirimKePelanggan}
                        size="small"
                      >
                        Kirim ke Pelanggan
                      </ButtonComponent>
                      <ButtonComponent
                        type="default"
                        onClick={handleBuatFakturPengganti}
                        size="small"
                      >
                        Buat Faktur Pengganti
                      </ButtonComponent>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Status E-Faktur
                  </div>
                  <span
                    className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
                  >
                    {displayStatus.replace(/_/g, " ")}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Pelanggan
                  </div>
                  <div className="font-semibold text-gray-900">
                    {detail_efaktur?.customerName || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Customer Number
                  </div>
                  <div className="font-semibold text-gray-900">
                    {detail_efaktur?.customerNumber || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Total Tagihan
                  </div>
                  <div className="font-bold text-2xl text-blue-600">
                    Rp{" "}
                    {detail_efaktur?.totalAmountEqvIdr?.toLocaleString(
                      "id-ID"
                    ) || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Rincian Faktur" key="1">
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-blue-700 mb-5">
                  Informasi Umum
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Billing Code
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail_efaktur?.billingCode || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      No. E-Faktur
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail_efaktur?.efakturNo || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Invoice Number
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail_efaktur?.invoiceNumber || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Account Number
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail_efaktur?.accountNumber || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Account Name
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail_efaktur?.accountName || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Billing Period
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail_efaktur?.billingPeriod || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Invoice Date
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail_efaktur?.invoiceDate
                        ? moment(detail_efaktur.invoiceDate).format(
                            "DD MMMM YYYY"
                          )
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      E-Faktur Date
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail_efaktur?.efakturDate
                        ? moment(detail_efaktur.efakturDate).format(
                            "DD MMMM YYYY, HH:mm"
                          )
                        : "-"}
                    </div>
                  </div>
                  {detail_efaktur?.remark && (
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Catatan
                      </div>
                      <div className="font-semibold text-gray-900">
                        {detail_efaktur.remark}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Rincian Item
                </h3>
                <Table
                  dataSource={data_billingItem || []}
                  columns={columnsRincianFaktur}
                  pagination={false}
                  size="middle"
                  bordered
                  scroll={{ x: 800 }}
                  loading={loading_detail}
                  locale={{
                    emptyText: "Tidak ada data item",
                  }}
                />
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Ringkasan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">DPP:</span>
                    <span className="font-semibold text-gray-900">
                      Rp {totals.dpp?.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      PPN (11%):
                    </span>
                    <span className="font-semibold text-gray-900">
                      Rp {totals.ppn?.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t-2 border-blue-300 pt-3">
                    <span className="font-bold text-lg text-gray-900">
                      Total:
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      Rp {totals.total?.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                Lampiran Dokumen
                {detail_efaktur?.attachments && detail_efaktur.attachments.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                    {detail_efaktur.attachments.length}
                  </span>
                )}
              </span>
            } 
            key="2"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-700">
                  Daftar Lampiran Dokumen
                </h3>
                {detail_efaktur?.attachments && detail_efaktur.attachments.length > 0 && (
                  <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                    Total: {detail_efaktur.attachments.length} File
                  </span>
                )}
              </div>
              <Table
                dataSource={
                  detail_efaktur?.attachments
                    ? detail_efaktur.attachments.map((item) => ({
                        ...item,
                        key: item.id,
                      }))
                    : []
                }
                columns={columnsAttachments}
                pagination={false}
                size="middle"
                bordered
                scroll={{ x: 1000 }}
                locale={{
                  emptyText: "Tidak ada lampiran dokumen",
                }}
              />
            </div>
          </TabPane>

          <TabPane tab="Log Aktivitas" key="3">
            <div>
              <h3 className="text-lg font-bold text-blue-700 mb-4">
                Riwayat Aktivitas
              </h3>
              <Table
                dataSource={log_activity || []}
                columns={columnsLog}
                pagination={{
                  current: pageLog,
                  pageSize: pageSizeLog,
                  total: pagination_log?.totalElements || 0,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} aktivitas`,
                  onChange: handleLogPaginationChange,
                  onShowSizeChange: handleLogPaginationChange,
                }}
                size="middle"
                bordered
                scroll={{ x: 800 }}
                loading={loading_log}
                locale={{
                  emptyText: "Belum ada aktivitas",
                }}
              />
            </div>
          </TabPane>
        </Tabs>

        <div className="w-full flex justify-start mt-6">
          <ButtonComponent
            type="submit"
            border={false}
            icon={
              <LeftOutlined
                style={{
                  fontSize: "14px",
                  marginRight: "8px",
                }}
              />
            }
            onClick={() => navigate(INVOICE_ROUTES.EFAKTUR_VIEW)}
          >
            Kembali
          </ButtonComponent>
        </div>
      </BaseContainer>

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
        efakturId={detail_efaktur?.efakturId}
        billingCode={billingCode}
      />
    </LayoutMenu>
  );
};

export default DetailEFaktur;
