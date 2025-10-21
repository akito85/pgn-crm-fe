import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Table, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import SVGIcon from "../../../../assets/Icon/index";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import ModalBuatFakturPengganti from "./ModalBuatFakturPengganti"; // Import modal

const { TabPane } = Tabs;

const getDummyDetailData = (noFaktur) => ({
  noFaktur: noFaktur || "010.000-25.12345678",
  status: "SUCCESS",
  pelanggan: "PT Industri Maju",
  npwp: "12.345.678.9-012.000",
  alamat: "Jl. Industri Raya No. 123, Jakarta Barat",
  tanggalFaktur: "28 Sep 2025",
  tanggalJatuhTempo: "28 Oct 2025",
  calculationCode: "CLC250800000001",
  ratingCode: "RC250800009001",
  billingCode: "BC250800009001",
  saNumber: "SA/BULOG/218939812",
  totalTagihan: 5500000,
  items: [
    {
      key: 1,
      namaBarangJasa: "Pemakaian Gas Industri",
      kuantitas: 500,
      hargaSatuan: 10000,
      jumlah: 5000000,
    },
    {
      key: 2,
      namaBarangJasa: "Biaya Maintenance",
      kuantitas: 1,
      hargaSatuan: 500000,
      jumlah: 500000,
    },
  ],
  dpp: 5500000,
  ppn: 605000,
  total: 6105000,
  lampiran: [
    {
      key: 1,
      namaFile: "Surat_Kontrak_2025.pdf",
      ukuran: "2.3 MB",
      tanggalUpload: "28 Sep 2025 10:00",
    },
  ],
  logAktivitas: [
    {
      key: 1,
      waktu: "2025-09-28 11:00:00",
      pengguna: "supervisor01",
      aktivitas: "Menyetujui E-Faktur",
      catatan: "Data sudah sesuai.",
    },
  ],
});

const DetailEFaktur = () => {
  const { loading } = useSelector((state) => state.billing);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const noFaktur = location?.state?.noFaktur;
  const billingCode = location?.state?.billingCode;
  const ratingCode = location?.state?.ratingCode;
  const calculationCode = location?.state?.calculationCode;
  const saNumber = location?.state?.saNumber;
  const accountNumber = location?.state?.accountNumber;

  const [detailData, setDetailData] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  
  // State untuk Modal Faktur Pengganti
  const [modalFakturPengganti, setModalFakturPengganti] = useState(false);

  const statusConfig = {
    SUCCESS: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    "AWAITING APPROVAL": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    DRAFT: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },
    FAILED: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
    PENGGANTI: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-300",
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
    if (noFaktur) {
      // TODO: dispatch(getDetailEFaktur(noFaktur));
      setDetailData(getDummyDetailData(noFaktur));
    }
  }, [noFaktur, dispatch]);

  const handleKirimKePelanggan = () => {
    console.log("Kirim ke pelanggan", noFaktur);
    // TODO: Implement logic
  };

  const handleUnduhPDF = () => {
    console.log("Unduh PDF", noFaktur);
    // TODO: Implement logic
  };

  const handleBuatFakturPengganti = () => {
    setModalFakturPengganti(true);
  };

  // Handler ketika faktur pengganti berhasil dibuat
  const handleSuccessFakturPengganti = () => {
    console.log("Faktur pengganti berhasil dibuat");
    // TODO: Refresh data atau redirect
    // dispatch(getDetailEFaktur(noFaktur));
    // atau
    // navigate(INVOICE_ROUTES.EFAKTUR_VIEW);
  };

  const columnsRincianFaktur = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 60,
    },
    {
      title: "Nama Barang/Jasa",
      dataIndex: "namaBarangJasa",
      key: "namaBarangJasa",
    },
    {
      title: "Kuantitas",
      dataIndex: "kuantitas",
      key: "kuantitas",
      width: 120,
      align: "right",
    },
    {
      title: "Harga Satuan",
      dataIndex: "hargaSatuan",
      key: "hargaSatuan",
      width: 180,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      key: "jumlah",
      width: 180,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
  ];

  const columnsLampiran = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 60,
    },
    {
      title: "Nama File",
      dataIndex: "namaFile",
      key: "namaFile",
    },
    {
      title: "Ukuran",
      dataIndex: "ukuran",
      key: "ukuran",
      width: 120,
    },
    {
      title: "Tanggal Upload",
      dataIndex: "tanggalUpload",
      key: "tanggalUpload",
      width: 180,
    },
    {
      title: "Aksi",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <ButtonComponent
          type="link"
          size="small"
          onClick={() => console.log("Download", record.namaFile)}
        >
          Unduh
        </ButtonComponent>
      ),
    },
  ];

  const columnsLogAktivitas = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 60,
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

  if (loading || !detailData) {
    return (
      <LayoutMenu>
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      </LayoutMenu>
    );
  }

  const statusStyle = statusConfig[detailData.status] || statusConfig.DRAFT;

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <BaseContainer header={`Detail E-Faktur: ${detailData.noFaktur}`}>
        {/* Header Section */}
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-white   px-6 py-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold text-base">Informasi Faktur</h3>
                  {detailData.status === "SUCCESS" && (
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
                    <div className="text-xs font-medium text-gray-500 mb-2">Status</div>
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
                    >
                      {detailData.status}
                    </span>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Pelanggan</div>
                    <div className="font-semibold text-gray-900">{detailData.pelanggan}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">NPWP</div>
                    <div className="font-semibold text-gray-900">{detailData.npwp}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Total Tagihan</div>
                    <div className="font-bold text-2xl text-blue-600">
                      Rp {detailData.totalTagihan?.toLocaleString("id-ID")}
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
                      <div className="text-sm font-medium text-gray-600 mb-1">Calculation Code</div>
                      <div className="font-semibold text-gray-900">{detailData.calculationCode}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Rating Code</div>
                      <div className="font-semibold text-gray-900">{detailData.ratingCode}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Billing Code</div>
                      <div className="font-semibold text-gray-900">{detailData.billingCode}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">SA Number</div>
                      <div className="font-semibold text-gray-900">{detailData.saNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Tanggal Faktur</div>
                      <div className="font-semibold text-gray-900">{detailData.tanggalFaktur}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Tanggal Jatuh Tempo</div>
                      <div className="font-semibold text-gray-900">{detailData.tanggalJatuhTempo}</div>
                    </div>
                  </div>
                </div>

                {/* Rincian Item */}
                <div>
                  <h3 className="text-lg font-bold text-blue-700 mb-4">
                    Rincian Item
                  </h3>
                  <Table
                    dataSource={detailData.items}
                    columns={columnsRincianFaktur}
                    pagination={false}
                    size="middle"
                    bordered
                    scroll={{ x: 800 }}
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
                        Rp {detailData.dpp?.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">PPN (11%):</span>
                      <span className="font-semibold text-gray-900">
                        Rp {detailData.ppn?.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t-2 border-blue-300 pt-3">
                      <span className="font-bold text-lg text-gray-900">Total:</span>
                      <span className="font-bold text-xl text-blue-600">
                        Rp {detailData.total?.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>

            {/* Tab Lampiran */}
            <TabPane tab="Lampiran" key="2">
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Lampiran Dokumen
                </h3>
                <Table
                  dataSource={detailData.lampiran}
                  columns={columnsLampiran}
                  pagination={false}
                  size="middle"
                  bordered
                  scroll={{ x: 800 }}
                />
              </div>
            </TabPane>

            {/* Tab Log Aktivitas */}
            <TabPane tab="Log Aktivitas" key="3">
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-4">
                  Riwayat Aktivitas
                </h3>
                <Table
                  dataSource={detailData.logAktivitas}
                  columns={columnsLogAktivitas}
                  pagination={false}
                  size="middle"
                  bordered
                  scroll={{ x: 800 }}
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
              onClick={() => navigate(-1)}
            >
              Back
            </ButtonComponent>
          </div>
        </BaseContainer>

        {/* Modal Faktur Pengganti */}
        <ModalBuatFakturPengganti
          isOpen={modalFakturPengganti}
          handleClose={() => setModalFakturPengganti(false)}
          noFakturAsli={detailData?.noFaktur}
          onSuccess={handleSuccessFakturPengganti}
        />
      </LayoutMenu>
    </Spin>
  );
};

export default DetailEFaktur;