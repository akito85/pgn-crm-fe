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

const DetailEFaktur = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Get billingCode from URL query params
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

  // Fetch data on mount
  useEffect(() => {
    if (billingCode) {
      console.log("📥 Fetching detail for billing code:", billingCode);
      
      // Fetch E-Faktur detail
      dispatch(getDetailEFaktur(billingCode));
      
      // Fetch billing items
      dispatch(getAllBillingItemPaginate(billingCode));
    }

    // Cleanup on unmount
    return () => {
      dispatch(resetEFakturState());
    };
  }, [billingCode, dispatch]);

  // Fetch log activity when efakturId is available
  useEffect(() => {
    if (detail_efaktur?.efakturId && activeTab === "2") {
      console.log("📥 Fetching log activity for efakturId:", detail_efaktur.efakturId);
      dispatch(
        getLogActivity({
          efakturId: detail_efaktur.efakturId,
          page: pageLog,
          size: pageSizeLog,
        })
      );
    }
  }, [detail_efaktur?.efakturId, activeTab, pageLog, pageSizeLog, dispatch]);

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    
    // Reset pagination when switching to log tab
    if (key === "2" && detail_efaktur?.efakturId) {
      setPageLog(1);
    }
  };

  // Handle log pagination
  const handleLogPaginationChange = (page, pageSize) => {
    setPageLog(page);
    setPageSizeLog(pageSize);
  };

  const handleKirimKePelanggan = () => {
    message.info("Fitur kirim ke pelanggan akan segera tersedia");
    console.log("Kirim ke pelanggan", detail_efaktur?.efakturNo);
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
      window.open(attachment.downloadUrl, "_blank");
    } else {
      message.error("URL download tidak tersedia");
    }
  };

  // Calculate totals from items
  const calculateTotals = () => {
    if (!data_billingItem || data_billingItem.length === 0) {
      return { 
        dpp: detail_efaktur?.dpp || 0, 
        ppn: detail_efaktur?.ppn || 0, 
        total: detail_efaktur?.totalAmount || 0 
      };
    }

    const dppItems = data_billingItem.filter(
      (item) => !item.productName.toLowerCase().includes("ppn")
    );
    const ppnItems = data_billingItem.filter((item) =>
      item.productName.toLowerCase().includes("ppn")
    );

    const dpp = dppItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const ppn = ppnItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = dpp + ppn;

    return { dpp, ppn, total };
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

  const columnsLogAktivitas = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 60,
      align: "center",
      render: (_, __, index) => (pageLog - 1) * pageSizeLog + index + 1,
    },
    {
      title: "Waktu",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      render: (text) => {
        if (!text) return "-";
        return moment(text).format("DD MMM YYYY, HH:mm:ss");
      },
    },
    {
      title: "Pengguna",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
      render: (text) => text || "System",
    },
    {
      title: "Aktivitas",
      dataIndex: "action",
      key: "action",
      width: 220,
      render: (text) => {
        const actionLabels = {
          CREATE: "E-Faktur Dibuat",
          UPDATE: "E-Faktur Diperbarui",
          APPROVE: "E-Faktur Disetujui",
          REJECT: "E-Faktur Ditolak",
          UPLOAD: "Upload Dokumen",
          GENERATE_XML: "Generate XML",
          SUBMIT: "Submit untuk Approval",
        };
        return actionLabels[text] || text || "-";
      },
    },
    {
      title: "Catatan",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
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
          <div className="font-medium">{text}</div>
          {record.fileCategoryName && (
            <div className="text-xs text-gray-500">
              Kategori: {record.fileCategoryName}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tipe",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Ukuran",
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
      title: "Tanggal Upload",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 150,
      render: (text) => {
        if (!text) return "-";
        return moment(text).format("DD MMM YYYY, HH:mm");
      },
    },
    {
      title: "Aksi",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <ButtonComponent
          type="link"
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadAttachment(record)}
        >
          Download
        </ButtonComponent>
      ),
    },
  ];

  // Loading state
  if (loading_detail && !detail_efaktur) {
    return (
      <LayoutMenu>
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" tip="Memuat data E-Faktur..." />
        </div>
      </LayoutMenu>
    );
  }

  // No data state
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

  // Prepare billing data for modals
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
    <Spin spinning={loading_detail}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <BaseContainer
          header={`Detail E-Faktur: ${
            detail_efaktur?.efakturNo || detail_efaktur?.billingCode || ""
          }`}
        >
          {/* Header Section */}
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold text-base">
                    Informasi Faktur
                  </h3>
                  <div className="flex gap-2">
                    {(displayStatus === "APPROVED" || displayStatus === "PROCESSING") && (
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
                    {displayStatus === "APPROVED" && (
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

          {/* Tabs Content */}
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            {/* Tab Rincian Faktur */}
            <TabPane tab="Rincian Faktur" key="1">
              <div className="space-y-8">
                {/* Informasi Umum */}
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

                {/* Rincian Item */}
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

                {/* Ringkasan */}
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

                {/* Attachments */}
                {detail_efaktur?.attachments &&
                  detail_efaktur.attachments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-blue-700 mb-4">
                        Lampiran Dokumen
                      </h3>
                      <Table
                        dataSource={detail_efaktur.attachments || []}
                        columns={columnsAttachments}
                        pagination={false}
                        size="middle"
                        bordered
                        scroll={{ x: 800 }}
                      />
                    </div>
                  )}
              </div>
            </TabPane>

            {/* Tab Log Aktivitas */}
            <TabPane tab="Log Aktivitas" key="2">
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Riwayat Aktivitas
                </h3>
                <Table
                  dataSource={log_activity || []}
                  columns={columnsLogAktivitas}
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

          {/* Back Button */}
          <div className="w-full flex justify-start mt-6">
            <ButtonComponent
              type="submit"
              border={false}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    justifyItems: "left",
                  }}
                />
              }
              onClick={() => navigate(INVOICE_ROUTES.EFAKTUR_VIEW)}
            >
              Back
            </ButtonComponent>
          </div>
        </BaseContainer>

        {/* Modal Generate XML */}
        <ModalGenerateXML
          isOpen={modalGenerateXML}
          handleClose={() => setModalGenerateXML(false)}
          billingData={billingDataForModal}
          onSuccess={() => {
            setModalGenerateXML(false);
            message.success("XML berhasil di-generate");
          }}
        />

        {/* Modal Faktur Pengganti */}
        <ModalBuatFakturPengganti
          isOpen={modalFakturPengganti}
          handleClose={() => setModalFakturPengganti(false)}
          noFakturAsli={detail_efaktur?.efakturNo}
          billingData={billingDataForModal}
          onSuccess={handleSuccessFakturPengganti}
        />
      </LayoutMenu>
    </Spin>
  );
};

export default DetailEFaktur;