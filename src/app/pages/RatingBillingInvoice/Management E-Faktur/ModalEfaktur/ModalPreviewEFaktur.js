import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Divider, Table } from "antd";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";

const ModalPreviewEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  noFaktur = "",
}) => {
  // Selector
  const { loadingDetail } = useSelector((state) => state.billing);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [previewData, setPreviewData] = useState(null);

  // Dummy data untuk preview E-Faktur
  const getDummyPreviewData = (noFaktur) => ({
    // Header Faktur
    kodeSeriFaktur: "010.000-25",
    nomorUrut: "12345678",
    noFaktur: noFaktur,
    tanggalFaktur: "28 September 2025",

    // PKP Penjual
    pkpPenjual: {
      nama: "PT GAS INDONESIA",
      npwp: "01.234.567.8-901.000",
      alamat: "Jl. Gas Raya No. 100, Jakarta Pusat 10110",
      telepon: "(021) 1234-5678",
    },

    // PKP Pembeli
    pkpPembeli: {
      nama: "PT INDUSTRI MAJU",
      npwp: "12.345.678.9-012.000",
      alamat: "Jl. Industri Raya No. 123, Jakarta Barat 11220",
      telepon: "(021) 9876-5432",
    },

    // Rincian Barang/Jasa
    items: [
      {
        key: 1,
        nomorUrut: 1,
        namaBarangJasa: "Pemakaian Gas Industri - Oktober 2025",
        hargaJual: 5000000,
        diskon: 0,
        dpp: 5000000,
        ppn: 550000,
        tarifPPN: 11,
        ppnbm: 0,
        tarifPPNBM: 0,
      },
      {
        key: 2,
        nomorUrut: 2,
        namaBarangJasa: "Biaya Maintenance dan Perawatan",
        hargaJual: 500000,
        diskon: 0,
        dpp: 500000,
        ppn: 55000,
        tarifPPN: 11,
        ppnbm: 0,
        tarifPPNBM: 0,
      },
    ],

    // Total
    totalHargaJual: 5500000,
    totalDiskon: 0,
    totalDPP: 5500000,
    totalPPN: 605000,
    totalPPNBM: 0,
    jumlahYangHarusDibayar: 6105000,

    // Informasi Tambahan
    referensi: {
      billingCode: "BC250800009001",
      ratingCode: "RC250800009001",
      calculationCode: "CLC250800000001",
      saNumber: "SA/BULOG/218939812",
    },
  });

  // Fetch data ketika modal dibuka
  useEffect(() => {
    if (isOpen && noFaktur) {
      // TODO: Dispatch action untuk fetch preview data
      // dispatch(getPreviewEFaktur(noFaktur));

      // Sementara gunakan dummy data
      setPreviewData(getDummyPreviewData(noFaktur));
    }
  }, [isOpen, noFaktur]);

  // Columns untuk tabel rincian barang/jasa
  const columnsItems = [
    {
      title: "No",
      dataIndex: "nomorUrut",
      key: "nomorUrut",
      width: 50,
      align: "center",
    },
    {
      title: "Nama Barang/Jasa",
      dataIndex: "namaBarangJasa",
      key: "namaBarangJasa",
      width: 300,
    },
    {
      title: "Harga Jual",
      dataIndex: "hargaJual",
      key: "hargaJual",
      width: 150,
      align: "right",
      render: (value) => value?.toLocaleString("id-ID"),
    },
    {
      title: "Diskon",
      dataIndex: "diskon",
      key: "diskon",
      width: 120,
      align: "right",
      render: (value) => value?.toLocaleString("id-ID"),
    },
    {
      title: "DPP",
      dataIndex: "dpp",
      key: "dpp",
      width: 150,
      align: "right",
      render: (value) => value?.toLocaleString("id-ID"),
    },
    {
      title: "PPN",
      dataIndex: "ppn",
      key: "ppn",
      width: 120,
      align: "right",
      render: (value) => value?.toLocaleString("id-ID"),
    },
  ];

  // Handle Print
  const handlePrint = () => {

    // TODO: Implement print functionality
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] p-5">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[1100px] max-h-[90vh] flex flex-col overflow-hidden">
        <Spin spinning={loadingDetail}>
          {/* Header Modal */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-blue-600">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">
                Preview E-Faktur
              </h2>
            </div>
            <div className="flex gap-2">
              <ButtonComponent
                type="default"
                icon={<PrinterOutlined style={{ fontSize: 18 }} />}
                onClick={handlePrint}
              >
                Print
              </ButtonComponent>
              <ButtonComponent
                type="text"
                icon={<CloseOutlined style={{ fontSize: 20, color: "#fff" }} />}
                onClick={handleClose}
              />
            </div>
          </div>

          {/* Content - Preview Faktur */}
          <div className="flex-1 px-8 py-6 overflow-y-auto bg-gray-50">
            {previewData && (
              <div className="bg-white border-2 border-gray-300 p-8 rounded-lg shadow-sm">
                {/* Header E-Faktur */}
                <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    FAKTUR PAJAK
                  </h1>
                  <p className="text-sm text-gray-600">
                    Kode dan Nomor Seri Faktur Pajak:
                  </p>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {previewData.kodeSeriFaktur}.{previewData.nomorUrut}
                  </p>
                </div>

                {/* Informasi PKP */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* PKP Penjual */}
                  <div className="border border-gray-300 p-4 rounded bg-blue-50">
                    <h3 className="font-bold text-sm text-blue-700 mb-3 uppercase">
                      Pengusaha Kena Pajak (Penjual)
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Nama:</span>
                        <p className="mt-1">{previewData.pkpPenjual.nama}</p>
                      </div>
                      <div>
                        <span className="font-semibold">NPWP:</span>
                        <p className="mt-1">{previewData.pkpPenjual.npwp}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Alamat:</span>
                        <p className="mt-1">{previewData.pkpPenjual.alamat}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Telepon:</span>
                        <p className="mt-1">{previewData.pkpPenjual.telepon}</p>
                      </div>
                    </div>
                  </div>

                  {/* PKP Pembeli */}
                  <div className="border border-gray-300 p-4 rounded bg-green-50">
                    <h3 className="font-bold text-sm text-green-700 mb-3 uppercase">
                      Pengusaha Kena Pajak (Pembeli)
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Nama:</span>
                        <p className="mt-1">{previewData.pkpPembeli.nama}</p>
                      </div>
                      <div>
                        <span className="font-semibold">NPWP:</span>
                        <p className="mt-1">{previewData.pkpPembeli.npwp}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Alamat:</span>
                        <p className="mt-1">{previewData.pkpPembeli.alamat}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Telepon:</span>
                        <p className="mt-1">{previewData.pkpPembeli.telepon}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tanggal Faktur */}
                <div className="mb-4 text-right">
                  <span className="text-sm font-semibold">Tanggal Faktur: </span>
                  <span className="text-sm">{previewData.tanggalFaktur}</span>
                </div>

                <Divider className="my-4" />

                {/* Tabel Rincian Barang/Jasa */}
                <div className="mb-6">
                  <h3 className="font-bold text-base text-gray-900 mb-3">
                    Rincian Barang Kena Pajak / Jasa Kena Pajak
                  </h3>
                  <Table
                    dataSource={previewData.items}
                    columns={columnsItems}
                    pagination={false}
                    size="small"
                    bordered
                    scroll={{ x: 900 }}
                  />
                </div>

                {/* Summary */}
                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-end">
                    <div className="w-1/2">
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-semibold">Total Harga Jual:</span>
                          <span>
                            Rp {previewData.totalHargaJual?.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-semibold">Total Diskon:</span>
                          <span>
                            Rp {previewData.totalDiskon?.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-semibold">
                            Dasar Pengenaan Pajak (DPP):
                          </span>
                          <span>
                            Rp {previewData.totalDPP?.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-semibold">PPN (11%):</span>
                          <span>
                            Rp {previewData.totalPPN?.toLocaleString("id-ID")}
                          </span>
                        </div>
                        {previewData.totalPPNBM > 0 && (
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-semibold">PPnBM:</span>
                            <span>
                              Rp {previewData.totalPPNBM?.toLocaleString("id-ID")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between py-3 bg-blue-100 px-3 rounded mt-3">
                          <span className="font-bold text-lg">
                            Jumlah yang Harus Dibayar:
                          </span>
                          <span className="font-bold text-lg text-blue-600">
                            Rp{" "}
                            {previewData.jumlahYangHarusDibayar?.toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Informasi Referensi */}
                <div className="bg-gray-100 p-4 rounded border border-gray-300">
                  <h3 className="font-bold text-sm text-gray-700 mb-3">
                    Informasi Referensi
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold">Billing Code:</span>
                      <span className="ml-2">{previewData.referensi.billingCode}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Rating Code:</span>
                      <span className="ml-2">{previewData.referensi.ratingCode}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Calculation Code:</span>
                      <span className="ml-2">
                        {previewData.referensi.calculationCode}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">SA Number:</span>
                      <span className="ml-2">{previewData.referensi.saNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center text-xs text-gray-500 italic">
                  <p>
                    Faktur Pajak ini merupakan Faktur Pajak Pengganti dari Faktur
                    Pajak Nomor: ................ Tanggal: ................
                  </p>
                  <p className="mt-2">
                    * Dokumen ini adalah preview dan belum memiliki tanda tangan
                    digital
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <ButtonComponent type="default" onClick={handleClose}>
              Tutup
            </ButtonComponent>
            <ButtonComponent
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
              Print Preview
            </ButtonComponent>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default ModalPreviewEFaktur