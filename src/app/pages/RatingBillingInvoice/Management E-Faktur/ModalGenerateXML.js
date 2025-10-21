import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Alert, Table } from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import DetailText from "../../../../components/DetailText";
import { ModalError, ModalSuccess } from "../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../utils/Icon";

const ModalGenerateXML = ({
  isOpen = false,
  handleClose = () => {},
  noFaktur = "",
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.billing);

  // State
  const [fakturData, setFakturData] = useState(null);
  const [xmlContent, setXmlContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Dummy data E-Faktur untuk generate XML
  const getDummyFakturData = (noFaktur) => ({
    noFaktur: noFaktur,
    kodeSeriFaktur: "010.000-25",
    nomorUrut: "12345678",
    tanggalFaktur: "2025-09-28",
    
    // PKP Penjual
    pkpPenjual: {
      npwp: "01234567890100",
      nama: "PT GAS INDONESIA",
      alamat: "Jl. Gas Raya No. 100, Jakarta Pusat 10110",
      nomorUrut: "1",
    },
    
    // PKP Pembeli
    pkpPembeli: {
      npwp: "12345678901200",
      nama: "PT INDUSTRI MAJU",
      alamat: "Jl. Industri Raya No. 123, Jakarta Barat 11220",
      nomorUrut: "1",
    },
    
    // Transaksi
    transaksi: {
      jenisTransaksi: "01", // Kepada pihak yang bukan pemungut PPN
      kodeStatus: "0", // Normal
      fgPengganti: "0", // Bukan pengganti
      noFakturPengganti: "",
      
      // Detail
      items: [
        {
          nomorUrut: 1,
          namaBarangJasa: "Pemakaian Gas Industri - Oktober 2025",
          hargaSatuan: 10000,
          jumlahBarang: 500,
          hargaTotal: 5000000,
          diskon: 0,
          dpp: 5000000,
          ppn: 550000,
          tarifPPN: 11,
          ppnbm: 0,
          tarifPPNBM: 0,
        },
        {
          nomorUrut: 2,
          namaBarangJasa: "Biaya Maintenance dan Perawatan",
          hargaSatuan: 500000,
          jumlahBarang: 1,
          hargaTotal: 500000,
          diskon: 0,
          dpp: 500000,
          ppn: 55000,
          tarifPPN: 11,
          ppnbm: 0,
          tarifPPNBM: 0,
        },
      ],
      
      // Summary
      jumlahDPP: 5500000,
      jumlahPPN: 605000,
      jumlahPPNBM: 0,
      totalNilai: 6105000,
    },
    
    // Referensi
    referensi: {
      noReferensi: "BC250800009001",
      noDokumen: "SA/BULOG/218939812",
    },
  });

  // Generate XML Content
  const generateXMLContent = (data) => {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const xmlContent = `<EFAKTUR>
  <FK>
    <KD_JENIS_TRANSAKSI>${data.transaksi.jenisTransaksi}</KD_JENIS_TRANSAKSI>
    <FG_PENGGANTI>${data.transaksi.fgPengganti}</FG_PENGGANTI>
    <NOMOR_FAKTUR>${data.kodeSeriFaktur.replace(/\./g, '')}.${data.nomorUrut}</NOMOR_FAKTUR>
    <MASA_PAJAK>${new Date(data.tanggalFaktur).getMonth() + 1}</MASA_PAJAK>
    <TAHUN_PAJAK>${new Date(data.tanggalFaktur).getFullYear()}</TAHUN_PAJAK>
    <TANGGAL_FAKTUR>${data.tanggalFaktur}</TANGGAL_FAKTUR>
    <NPWP>${data.pkpPenjual.npwp}</NPWP>
    <NAMA>${data.pkpPenjual.nama}</NAMA>
    <ALAMAT_LENGKAP>${data.pkpPenjual.alamat}</ALAMAT_LENGKAP>
    <JUMLAH_DPP>${data.transaksi.jumlahDPP}</JUMLAH_DPP>
    <JUMLAH_PPN>${data.transaksi.jumlahPPN}</JUMLAH_PPN>
    <JUMLAH_PPNBM>${data.transaksi.jumlahPPNBM}</JUMLAH_PPNBM>
    <ID_KETERANGAN_TAMBAHAN>1</ID_KETERANGAN_TAMBAHAN>
    <FG_UANG_MUKA>0</FG_UANG_MUKA>
    <UANG_MUKA_DPP>0</UANG_MUKA_DPP>
    <UANG_MUKA_PPN>0</UANG_MUKA_PPN>
    <UANG_MUKA_PPNBM>0</UANG_MUKA_PPNBM>
    <REFERENSI>${data.referensi.noReferensi}</REFERENSI>
  </FK>
  <FAPR>
    <NPWP_PASANGAN>${data.pkpPembeli.npwp}</NPWP_PASANGAN>
    <NAMA_PASANGAN>${data.pkpPembeli.nama}</NAMA_PASANGAN>
    <JALAN_PASANGAN>${data.pkpPembeli.alamat}</JALAN_PASANGAN>
    <NOMOR_URUT_PASANGAN>${data.pkpPembeli.nomorUrut}</NOMOR_URUT_PASANGAN>
  </FAPR>
${data.transaksi.items.map(item => `  <OF>
    <KODE_OBJEK>BKP</KODE_OBJEK>
    <NAMA>${item.namaBarangJasa}</NAMA>
    <HARGA_SATUAN>${item.hargaSatuan}</HARGA_SATUAN>
    <JUMLAH_BARANG>${item.jumlahBarang}</JUMLAH_BARANG>
    <HARGA_TOTAL>${item.hargaTotal}</HARGA_TOTAL>
    <DISKON>${item.diskon}</DISKON>
    <DPP>${item.dpp}</DPP>
    <PPN>${item.ppn}</PPN>
    <TARIF_PPN>${item.tarifPPN}</TARIF_PPN>
    <PPNBM>${item.ppnbm}</PPNBM>
    <TARIF_PPNBM>${item.tarifPPNBM}</TARIF_PPNBM>
  </OF>`).join('\n')}
</EFAKTUR>`;

    return xmlHeader + xmlContent;
  };

  // Load data ketika modal dibuka
  useEffect(() => {
    if (isOpen && noFaktur) {
      // TODO: Dispatch action untuk fetch detail faktur
      // dispatch(getDetailEFaktur(noFaktur));
      
      // Gunakan dummy data
      const data = getDummyFakturData(noFaktur);
      setFakturData(data);
    }
  }, [isOpen, noFaktur]);

  // Handle Generate XML
  const handleGenerateXML = () => {
    if (!fakturData) {
      setErrorMessage("Data faktur tidak ditemukan");
      setModalError(true);
      return;
    }

    setIsGenerating(true);

    // Simulasi proses generate
    setTimeout(() => {
      try {
        const xml = generateXMLContent(fakturData);
        setXmlContent(xml);
        
        // TODO: Dispatch action untuk save XML ke server
        // dispatch(generateXMLEFaktur({ noFaktur, xmlContent: xml }))
        //   .unwrap()
        //   .then(() => {
        //     setModalSuccess(true);
        //   })
        //   .catch((error) => {
        //     setErrorMessage(error.message);
        //     setModalError(true);
        //   });
        
        setModalSuccess(true);
        setIsGenerating(false);
      } catch (error) {
        setErrorMessage("Gagal generate XML: " + error.message);
        setModalError(true);
        setIsGenerating(false);
      }
    }, 1500);
  };

  // Handle Download XML
  const handleDownloadXML = () => {
    if (!xmlContent) {
      setErrorMessage("XML belum di-generate");
      setModalError(true);
      return;
    }

    // Create blob dan download
    const blob = new Blob([xmlContent], { type: "text/xml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `efaktur_${noFaktur.replace(/\//g, "_")}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle Cancel
  const handleCancel = () => {
    setFakturData(null);
    setXmlContent("");
    setIsGenerating(false);
    handleClose();
  };

  // Columns untuk preview items
  const columnsItems = [
    {
      title: "No",
      dataIndex: "nomorUrut",
      key: "nomorUrut",
      width: 50,
    },
    {
      title: "Nama Barang/Jasa",
      dataIndex: "namaBarangJasa",
      key: "namaBarangJasa",
      width: 300,
    },
    {
      title: "DPP",
      dataIndex: "dpp",
      key: "dpp",
      width: 150,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
    {
      title: "PPN",
      dataIndex: "ppn",
      key: "ppn",
      width: 120,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
  ];

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Generate XML E-Faktur (Skema DJP)"
        handleCancel={handleCancel}
        width={1000}
        footer={
          <div className="flex justify-end gap-3">
            <ButtonComponent type="default" onClick={handleCancel}>
              Tutup
            </ButtonComponent>
            {!xmlContent && (
              <ButtonComponent
                type="primary"
                onClick={handleGenerateXML}
                loading={isGenerating}
                icon={<FileTextOutlined />}
              >
                Generate XML
              </ButtonComponent>
            )}
            {xmlContent && (
              <ButtonComponent
                type="submit"
                onClick={handleDownloadXML}
                icon={<DownloadOutlined />}
              >
                Download XML
              </ButtonComponent>
            )}
          </div>
        }
      >
        <Spin spinning={loading || isGenerating}>
          <div className="my-6">
            {/* Informasi E-Faktur */}
            {fakturData && (
              <>
                <Alert
                  message="Proses Manual E-Faktur (Status: FAILED)"
                  description={
                    <div>
                      <p className="font-semibold mb-2">Langkah-langkah:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Generate XML E-Faktur di sini (sesuai skema DJP CoreTax)</li>
                        <li>Download file XML yang sudah di-generate</li>
                        <li>Upload XML ke aplikasi e-Faktur DJP CoreTax secara manual</li>
                        <li>Setelah berhasil, download PDF dari DJP CoreTax</li>
                        <li>Kembali ke aplikasi dan gunakan fitur "Upload E-Faktur dari DJP" untuk mengupload PDF</li>
                        <li>Status akan otomatis berubah menjadi SUCCESS setelah upload berhasil</li>
                      </ol>
                    </div>
                  }
                  type="warning"
                  showIcon
                  className="mb-6"
                />

                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-700 mb-4">
                    Informasi E-Faktur
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailText label="No. Faktur">{fakturData.noFaktur}</DetailText>
                    <DetailText label="Tanggal Faktur">
                      {fakturData.tanggalFaktur}
                    </DetailText>
                    <DetailText label="PKP Penjual">
                      {fakturData.pkpPenjual.nama}
                    </DetailText>
                    <DetailText label="PKP Pembeli">
                      {fakturData.pkpPembeli.nama}
                    </DetailText>
                    <DetailText label="NPWP Penjual">
                      {fakturData.pkpPenjual.npwp}
                    </DetailText>
                    <DetailText label="NPWP Pembeli">
                      {fakturData.pkpPembeli.npwp}
                    </DetailText>
                  </div>
                </div>

                {/* Rincian Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-blue-700 mb-3">
                    Rincian Barang/Jasa
                  </h3>
                  <Table
                    dataSource={fakturData.transaksi.items}
                    columns={columnsItems}
                    pagination={false}
                    size="small"
                    bordered
                    scroll={{ x: 700 }}
                  />
                </div>

                {/* Summary */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <DetailText label="Total DPP">
                      Rp {fakturData.transaksi.jumlahDPP?.toLocaleString("id-ID")}
                    </DetailText>
                    <DetailText label="Total PPN">
                      Rp {fakturData.transaksi.jumlahPPN?.toLocaleString("id-ID")}
                    </DetailText>
                    <DetailText label="Total PPnBM">
                      Rp {fakturData.transaksi.jumlahPPNBM?.toLocaleString("id-ID")}
                    </DetailText>
                    <DetailText label="Total Nilai">
                      <span className="font-bold text-blue-600">
                        Rp {fakturData.transaksi.totalNilai?.toLocaleString("id-ID")}
                      </span>
                    </DetailText>
                  </div>
                </div>

                {/* XML Preview */}
                {xmlContent && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                      <FileTextOutlined /> XML Generated Successfully
                    </h3>
                    <Alert
                      message="XML berhasil di-generate"
                      description="File XML sudah siap untuk diunduh dan digunakan di aplikasi e-Faktur DJP."
                      type="success"
                      showIcon
                      className="mb-3"
                    />
                    <div className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto max-h-60 font-mono text-xs">
                      <pre>{xmlContent}</pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Spin>
      </ModalCustom>

      {/* Modal Success */}
      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={() => {
          setModalSuccess(false);
          onSuccess();
        }}
        handleCancel={() => setModalSuccess(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_success"]}
            <p className="text-[18px] font-bold">Success</p>
          </div>
          <p className="pl-[70px]">XML E-Faktur berhasil di-generate.</p>
          <p className="pl-[70px]">Silakan download file XML.</p>
        </div>
      </ModalSuccess>

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={() => setModalError(false)}
        handleCancel={() => setModalError(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-[70px]">{errorMessage}</p>
          <p className="pl-[70px]">Silakan coba lagi.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalGenerateXML;