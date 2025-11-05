import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Table, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import ModalBuatFakturPengganti from "./ModalEfaktur/ModalBuatFakturPengganti";
// import { getBillingItemsByCode, getLogAktivitasEFaktur } from "../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { TabPane } = Tabs;

const DetailEFaktur = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get billingCode from URL query params
  const searchParams = new URLSearchParams(location.search);
  const billingCode = searchParams.get('billingCode');

  const { 
    list_approved_billing, 
    billing_items_detail,
    list_log_aktivitas,
    loading,
    loading_log 
  } = useSelector((state) => state.efaktur);

  const [activeTab, setActiveTab] = useState("1");
  const [modalFakturPengganti, setModalFakturPengganti] = useState(false);

  // Find billing data from list
  const billingData = list_approved_billing?.find(
    item => item.billingCode === billingCode
  );

  const statusConfig = {
    SUCCESS: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    PROCESSING: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
    },
    FAILED: {
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

  // useEffect(() => {
  //   if (billingCode) {
  //     // Fetch billing items
  //     dispatch(getBillingItemsByCode(billingCode));
  //     // Fetch log aktivitas
  //     dispatch(getLogAktivitasEFaktur(billingCode));
  //   }
  // }, [billingCode, dispatch]);

  const handleKirimKePelanggan = () => {
    console.log("Kirim ke pelanggan", billingData?.eFakturNo);
    // TODO: Implement send to customer logic
  };

  const handleUnduhPDF = () => {
    console.log("Unduh PDF", billingData?.eFakturNo);
    // TODO: Implement download PDF logic
  };

  const handleBuatFakturPengganti = () => {
    setModalFakturPengganti(true);
  };

  const handleSuccessFakturPengganti = () => {
    console.log("Faktur pengganti berhasil dibuat");
    navigate(INVOICE_ROUTES.EFAKTUR_VIEW);
  };

  // Calculate totals from items
  const calculateTotals = () => {
    if (!billing_items_detail || billing_items_detail.length === 0) {
      return { dpp: 0, ppn: 0, total: 0 };
    }

    const dppItems = billing_items_detail.filter(
      item => !item.productName.toLowerCase().includes('ppn')
    );
    const ppnItems = billing_items_detail.filter(
      item => item.productName.toLowerCase().includes('ppn')
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
    },
    {
      title: "Kuantitas",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "right",
      render: (value, record) => `${value?.toLocaleString("id-ID")} ${record.uom || ''}`,
    },
    {
      title: "Harga Satuan",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 180,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
    {
      title: "Jumlah",
      dataIndex: "total",
      key: "total",
      width: 180,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
  ];

  const columnsLogAktivitas = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 60,
      align: "center",
    },
    {
      title: "Waktu",
      dataIndex: "waktu",
      key: "waktu",
      width: 180,
    },
    {
      title: "Pengguna",
      dataIndex: "pengguna",
      key: "pengguna",
      width: 150,
    },
    {
      title: "Aktivitas",
      dataIndex: "aktivitas",
      key: "aktivitas",
      width: 220,
    },
    {
      title: "Catatan",
      dataIndex: "catatan",
      key: "catatan",
      render: (text) => text || "-",
    },
  ];

  if (loading || !billingData) {
    return (
      <LayoutMenu>
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      </LayoutMenu>
    );
  }

  const displayStatus = billingData.eFakturStatus || "NOT_GENERATED";
  const statusStyle = statusConfig[displayStatus] || statusConfig.NOT_GENERATED;

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <BaseContainer 
          header={`Detail E-Faktur: ${billingData.eFakturNo || billingData.billingCode}`}
        >
          {/* Header Section */}
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold text-base">
                    Informasi Faktur
                  </h3>
                  {displayStatus === "SUCCESS" && (
                    <div className="flex gap-2">
                      <ButtonComponent
                        type="primary"
                        onClick={handleKirimKePelanggan}
                        size="small"
                      >
                        Kirim ke Pelanggan
                      </ButtonComponent>
                      <ButtonComponent
                        type="default"
                        onClick={handleUnduhPDF}
                        size="small"
                      >
                        Unduh PDF
                      </ButtonComponent>
                      <ButtonComponent
                        type="default"
                        onClick={handleBuatFakturPengganti}
                        size="small"
                      >
                        Buat Faktur Pengganti
                      </ButtonComponent>
                    </div>
                  )}
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
                      {billingData.customerName}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      NPWP
                    </div>
                    <div className="font-semibold text-gray-900">
                      {billingData.npwp || "-"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      Total Tagihan
                    </div>
                    <div className="font-bold text-2xl text-blue-600">
                      Rp {billingData.totalAmountEqvIdrReal?.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
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
                        {billingData.billingCode}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        No. E-Faktur
                      </div>
                      <div className="font-semibold text-gray-900">
                        {billingData.eFakturNo || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Account Number
                      </div>
                      <div className="font-semibold text-gray-900">
                        {billingData.accountNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Billing Period
                      </div>
                      <div className="font-semibold text-gray-900">
                        {billingData.billingPeriod}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Invoice Date
                      </div>
                      <div className="font-semibold text-gray-900">
                        {billingData.invoiceDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Alamat
                      </div>
                      <div className="font-semibold text-gray-900">
                        {billingData.address || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rincian Item */}
                <div>
                  <h3 className="text-lg font-bold text-blue-700 mb-4">
                    Rincian Item
                  </h3>
                  <Table
                    dataSource={billing_items_detail || []}
                    columns={columnsRincianFaktur}
                    pagination={false}
                    size="middle"
                    bordered
                    scroll={{ x: 800 }}
                    loading={loading}
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
                      <span className="font-semibold text-gray-700">PPN (11%):</span>
                      <span className="font-semibold text-gray-900">
                        Rp {totals.ppn?.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t-2 border-blue-300 pt-3">
                      <span className="font-bold text-lg text-gray-900">Total:</span>
                      <span className="font-bold text-xl text-blue-600">
                        Rp {totals.total?.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>

            {/* Tab Log Aktivitas */}
            <TabPane tab="Log Aktivitas" key="2">
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Riwayat Aktivitas
                </h3>
                <Table
                  dataSource={list_log_aktivitas || []}
                  columns={columnsLogAktivitas}
                  pagination={false}
                  size="middle"
                  bordered
                  scroll={{ x: 800 }}
                  loading={loading_log}
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

        {/* Modal Faktur Pengganti */}
        <ModalBuatFakturPengganti
          isOpen={modalFakturPengganti}
          handleClose={() => setModalFakturPengganti(false)}
          noFakturAsli={billingData?.eFakturNo}
          billingData={billingData}
          onSuccess={handleSuccessFakturPengganti}
        />
      </LayoutMenu>
    </Spin>
  );
};

export default DetailEFaktur;