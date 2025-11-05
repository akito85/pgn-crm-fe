import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Alert, Table, message } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../components/DetailText";
import {
  ModalError,
  ModalSuccess,
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
// import {
//   getBillingItemsByCode,
//   generateXMLEFaktur,
// } from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const ModalGenerateXML = ({
  isOpen = false,
  handleClose = () => {},
  billingData = null, 
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { billing_items_detail, loading_modal } = useSelector(
    (state) => state.efaktur
  );

  // State
  const [xmlContent, setXmlContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate XML Content berdasarkan data billing
  const generateXMLContent = (billing, items) => {
    const tanggalFaktur =
      billing.invoiceDate || new Date().toISOString().split("T")[0];
    const date = new Date(tanggalFaktur);

    // Hitung total DPP dan PPN dari items
    const totalDPP = items.reduce((sum, item) => {
      // Asumsikan item terakhir adalah PPN
      if (!item.productName.toLowerCase().includes("ppn")) {
        return sum + (item.total || 0);
      }
      return sum;
    }, 0);

    const totalPPN = items.reduce((sum, item) => {
      if (item.productName.toLowerCase().includes("ppn")) {
        return sum + (item.total || 0);
      }
      return sum;
    }, 0);

    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const xmlContent = `<EFAKTUR>
  <FK>
    <KD_JENIS_TRANSAKSI>01</KD_JENIS_TRANSAKSI>
    <FG_PENGGANTI>0</FG_PENGGANTI>
    <NOMOR_FAKTUR>${
      billing.eFakturNo || "01000025" + Date.now().toString().slice(-8)
    }</NOMOR_FAKTUR>
    <MASA_PAJAK>${date.getMonth() + 1}</MASA_PAJAK>
    <TAHUN_PAJAK>${date.getFullYear()}</TAHUN_PAJAK>
    <TANGGAL_FAKTUR>${tanggalFaktur}</TANGGAL_FAKTUR>
    <NPWP>${billing.npwp || "00000000000000"}</NPWP>
    <NAMA>PT GAS INDONESIA</NAMA>
    <ALAMAT_LENGKAP>Jl. Gas Raya No. 100, Jakarta Pusat 10110</ALAMAT_LENGKAP>
    <JUMLAH_DPP>${totalDPP}</JUMLAH_DPP>
    <JUMLAH_PPN>${totalPPN}</JUMLAH_PPN>
    <JUMLAH_PPNBM>0</JUMLAH_PPNBM>
    <ID_KETERANGAN_TAMBAHAN>1</ID_KETERANGAN_TAMBAHAN>
    <FG_UANG_MUKA>0</FG_UANG_MUKA>
    <UANG_MUKA_DPP>0</UANG_MUKA_DPP>
    <UANG_MUKA_PPN>0</UANG_MUKA_PPN>
    <UANG_MUKA_PPNBM>0</UANG_MUKA_PPNBM>
    <REFERENSI>${billing.billingCode}</REFERENSI>
  </FK>
  <FAPR>
    <NPWP_PASANGAN>${billing.npwp || "00000000000000"}</NPWP_PASANGAN>
    <NAMA_PASANGAN>${billing.customerName}</NAMA_PASANGAN>
    <JALAN_PASANGAN>${
      billing.address || "Alamat tidak tersedia"
    }</JALAN_PASANGAN>
    <NOMOR_URUT_PASANGAN>1</NOMOR_URUT_PASANGAN>
  </FAPR>
${items
  .filter((item) => !item.productName.toLowerCase().includes("ppn"))
  .map(
    (item, index) => `  <OF>
    <KODE_OBJEK>BKP</KODE_OBJEK>
    <NAMA>${item.productName}</NAMA>
    <HARGA_SATUAN>${item.unitPrice || 0}</HARGA_SATUAN>
    <JUMLAH_BARANG>${item.quantity || 0}</JUMLAH_BARANG>
    <HARGA_TOTAL>${item.total || 0}</HARGA_TOTAL>
    <DISKON>0</DISKON>
    <DPP>${item.total || 0}</DPP>
    <PPN>${Math.round((item.total || 0) * 0.11)}</PPN>
    <TARIF_PPN>11</TARIF_PPN>
    <PPNBM>0</PPNBM>
    <TARIF_PPNBM>0</TARIF_PPNBM>
  </OF>`
  )
  .join("\n")}
</EFAKTUR>`;

    return xmlHeader + xmlContent;
  };

  // Load data ketika modal dibuka
  // useEffect(() => {
  //   if (isOpen && billingData?.billingCode) {
  //     dispatch(getBillingItemsByCode(billingData.billingCode));
  //   }
  // }, [isOpen, billingData, dispatch]);

  // Handle Generate XML
  const handleGenerateXML = () => {
    if (
      !billingData ||
      !billing_items_detail ||
      billing_items_detail.length === 0
    ) {
      setErrorMessage("Data billing atau items tidak ditemukan");
      setModalError(true);
      return;
    }

    setIsGenerating(true);

    // Simulasi proses generate
    setTimeout(() => {
      try {
        const xml = generateXMLContent(billingData, billing_items_detail);
        setXmlContent(xml);

        dispatch(
          // generateXMLEFaktur({
          //   billingCode: billingData.billingCode,
          //   xmlContent: xml,
          // })
        )
          .unwrap()
          .then(() => {
            setModalSuccess(true);
            setIsGenerating(false);
          })
          .catch((error) => {
            setErrorMessage(error.message || "Gagal menyimpan XML");
            setModalError(true);
            setIsGenerating(false);
          });
      } catch (error) {
        setErrorMessage("Gagal generate XML: " + error.message);
        setModalError(true);
        setIsGenerating(false);
      }
    }, 1500);
  };

  // Handle Copy XML to Clipboard
  const handleCopyXML = async () => {
    if (!xmlContent) {
      message.error("XML belum di-generate");
      return;
    }

    try {
      await navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      message.success("XML berhasil di-copy ke clipboard");

      // Reset icon setelah 2 detik
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      message.error("Gagal copy XML ke clipboard");
    }
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
    const fileName = `efaktur_${
      billingData.billingCode
    }_${new Date().getTime()}.xml`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.success(`File ${fileName} berhasil diunduh`);
  };

  // Handle Cancel
  const handleCancel = () => {
    setXmlContent("");
    setIsGenerating(false);
    setCopied(false);
    handleClose();
  };

  // Columns untuk preview items
  const columnsItems = [
    {
      title: "No",
      dataIndex: "lineNumber",
      key: "lineNumber",
      width: 50,
    },
    {
      title: "Nama Barang/Jasa",
      dataIndex: "productName",
      key: "productName",
      width: 300,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "right",
    },
    {
      title: "Harga Satuan",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 120,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 150,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
  ];

  // Hitung summary
  const totalDPP =
    billing_items_detail?.reduce((sum, item) => {
      if (!item.productName.toLowerCase().includes("ppn")) {
        return sum + (item.total || 0);
      }
      return sum;
    }, 0) || 0;

  const totalPPN =
    billing_items_detail?.reduce((sum, item) => {
      if (item.productName.toLowerCase().includes("ppn")) {
        return sum + (item.total || 0);
      }
      return sum;
    }, 0) || 0;

  const totalNilai = billingData?.totalAmountEqvIdrReal || totalDPP + totalPPN;

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Generate XML E-Faktur"
        handleCancel={handleCancel}
        width={800}
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
                disabled={
                  !billing_items_detail || billing_items_detail.length === 0
                }
              >
                Generate XML
              </ButtonComponent>
            )}
            {xmlContent && (
              <>
                <ButtonComponent
                  type="default"
                  onClick={handleCopyXML}
                  icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                  style={
                    copied ? { borderColor: "#52c41a", color: "#52c41a" } : {}
                  }
                >
                  {copied ? "Copied!" : "Copy XML"}
                </ButtonComponent>
                <ButtonComponent
                  type="default"
                  onClick={handleDownloadXML}
                  icon={<DownloadOutlined />}
                >
                  Download XML
                </ButtonComponent>
              </>
            )}
          </div>
        }
      >
        <Spin spinning={loading_modal || isGenerating}>
          <div className="my-6">
            {/* Informasi E-Faktur */}
            {billingData && (
              <>
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-700 mb-4">
                    Informasi Billing
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailText label="Billing Code">
                      {billingData.billingCode}
                    </DetailText>
                    <DetailText label="Invoice Date">
                      {billingData.invoiceDate}
                    </DetailText>
                    <DetailText label="Customer">
                      {billingData.customerName}
                    </DetailText>
                    <DetailText label="Account Number">
                      {billingData.accountNumber}
                    </DetailText>
                    <DetailText label="NPWP">
                      {billingData.npwp || "-"}
                    </DetailText>
                    <DetailText label="Billing Period">
                      {billingData.billingPeriod}
                    </DetailText>
                  </div>
                </div>

                {/* Rincian Items */}
                {billing_items_detail && billing_items_detail.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-700 mb-3">
                      Rincian Barang/Jasa
                    </h3>
                    <Table
                      dataSource={billing_items_detail}
                      columns={columnsItems}
                      pagination={false}
                      size="small"
                      bordered
                      scroll={{ x: 700 }}
                    />
                  </div>
                )}

                {/* Summary */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <DetailText label="Total DPP">
                      Rp {totalDPP?.toLocaleString("id-ID")}
                    </DetailText>
                    <DetailText label="Total PPN">
                      Rp {totalPPN?.toLocaleString("id-ID")}
                    </DetailText>
                    <DetailText label="Total PPnBM">Rp 0</DetailText>
                    <DetailText label="Total Nilai">
                      <span className="font-bold text-blue-600">
                        Rp {totalNilai?.toLocaleString("id-ID")}
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
                    <div className="rounded-lg border border-gray-200 bg-white shadow-md">
                      {/* Header Copy Section */}
                      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-medium text-gray-700">
                          XML Preview
                        </p>
                        <ButtonComponent
                          type="default"
                          size="small"
                          onClick={handleCopyXML}
                          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                          className={`transition-all duration-200 ${
                            copied
                              ? "border-green-500 text-green-600 bg-green-50 hover:bg-green-100"
                              : "border-gray-300 text-gray-600 bg-white hover:bg-gray-100"
                          }`}
                        >
                          {copied ? "Copied!" : "Copy"}
                        </ButtonComponent>
                      </div>

                      {/* Isi XML */}
                      <div className="p-4 bg-gray-900 text-green-400 font-mono text-xs overflow-auto max-h-96 rounded-b-lg">
                        <pre className="whitespace-pre-wrap">{xmlContent}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Spin>
      </ModalCustom>

      {/* Modal Success
      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={() => {
          setModalSuccess(false);
          onSuccess();
          handleCancel();
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
      </ModalSuccess> */}

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
