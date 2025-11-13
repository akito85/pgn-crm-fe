import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Alert, Table, message } from "antd";
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
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import {
  getAllBillingItemPaginate,
  generateXMLEFaktur,
  getDetailEFaktur,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const ModalGenerateXML = ({
  isOpen = false,
  handleClose = () => {},
  billingData = null,
  onSuccess = () => {},
}) => {
  const dispatch = useDispatch();
  
  const { 
    data_billingItem, 
    loading_modal, 
    loading_detail,
    detail_efaktur 
  } = useSelector((state) => state.efaktur);

  const [xmlContent, setXmlContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [efakturDetail, setEfakturDetail] = useState(null);

  useEffect(() => {
    if (isOpen && billingData?.billingCode) {
      dispatch(getAllBillingItemPaginate(billingData.billingCode));
      
      dispatch(getDetailEFaktur(billingData.billingCode))
        .unwrap()
        .then((result) => {
          if (result) {
            setEfakturDetail(result);
          }
        })
        .catch((error) => {
          setErrorMessage("E-Faktur belum dibuat untuk billing ini");
          setModalError(true);
        });
    }
  }, [isOpen, billingData, dispatch]);

  useEffect(() => {
    if (detail_efaktur) {
      setEfakturDetail(detail_efaktur);
    }
  }, [detail_efaktur]);

  const formatXML = (xmlString) => {
    try {
      let formatted = xmlString.trim();
      formatted = formatted.replace(/></g, '>\n<');
      
      let indent = 0;
      const lines = formatted.split('\n');
      
      formatted = lines.map(line => {
        const trimmed = line.trim();
        
        if (!trimmed) return '';
        
        if (trimmed.startsWith('</')) {
          indent = Math.max(0, indent - 1);
        }
        
        const indentation = '  '.repeat(indent);
        
        if (trimmed.startsWith('<') && 
            !trimmed.startsWith('</') && 
            !trimmed.endsWith('/>') &&
            !trimmed.match(/<[^>]+>[^<]*<\/[^>]+>/)) {
          indent++;
        }
        
        return indentation + trimmed;
      }).filter(line => line !== '').join('\n');
      
      return formatted;
    } catch (error) {
      return xmlString;
    }
  };

  const handleGenerateXML = async () => {
    if (!billingData) {
      setErrorMessage("Data billing tidak ditemukan");
      setModalError(true);
      return;
    }

    if (!efakturDetail?.efakturId) {
      setErrorMessage("E-Faktur ID tidak ditemukan. Pastikan E-Faktur sudah dibuat.");
      setModalError(true);
      return;
    }

    setIsGenerating(true);

    try {
      const result = await dispatch(
        generateXMLEFaktur(efakturDetail.efakturId)
      ).unwrap();

      let xmlString = '';
      
      if (typeof result === 'string') {
        xmlString = result;
      } else if (result && typeof result === 'object') {
        xmlString = result.xml || result.data || result.content || '';
      }

      if (!xmlString || xmlString.trim().length === 0) {
        throw new Error("XML content is empty");
      }

      if (!xmlString.trim().startsWith('<')) {
        throw new Error("Invalid XML format: content does not start with '<'");
      }

      const formattedXml = formatXML(xmlString);
      setXmlContent(formattedXml);
      
      message.success("XML berhasil di-generate!");
      
      setIsGenerating(false);
    } catch (error) {
      let errorMsg = "Gagal generate XML E-Faktur";
      
      if (error?.message) {
        errorMsg = error.message;
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }
      
      setErrorMessage(errorMsg);
      setModalError(true);
      setIsGenerating(false);
    }
  };

  const handleCopyXML = async () => {
    if (!xmlContent) {
      message.error("XML belum di-generate");
      return;
    }

    try {
      await navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      message.success("XML berhasil di-copy ke clipboard");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = xmlContent;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        message.success("XML berhasil di-copy ke clipboard");
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackError) {
        message.error("Gagal copy XML ke clipboard");
      }
    }
  };

  const handleDownloadXML = () => {
    if (!xmlContent) {
      setErrorMessage("XML belum di-generate");
      setModalError(true);
      return;
    }

    try {
      const blob = new Blob([xmlContent], { 
        type: "application/xml;charset=utf-8" 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `efaktur_${billingData.billingCode}_${timestamp}.xml`;
      
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success(`File ${fileName} berhasil diunduh`);
    } catch (error) {
      message.error("Gagal mengunduh file XML");
    }
  };

  const handleCancel = () => {
    setXmlContent("");
    setIsGenerating(false);
    setCopied(false);
    setEfakturDetail(null);
    handleClose();
  };

  const columnsItems = [
    {
      title: "#",
      dataIndex: "lineNumber",
      key: "lineNumber",
      width: 50,
      align: "center",
    },
    {
      title: "Nama Barang/Jasa",
      dataIndex: "productName",
      key: "productName",
      width: 300,
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
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "right",
      render: (value) => {
        const numValue = parseFloat(value);
        return numValue.toLocaleString("id-ID");
      },
    },
    {
      title: "Harga Satuan",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 120,
      align: "right",
      render: (value, record) => {
        const symbol = record.currency === "USD" ? "$" : "Rp";
        return `${symbol} ${value?.toLocaleString("id-ID")}`;
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 150,
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

  const calculateTotals = () => {
    if (!data_billingItem || data_billingItem.length === 0) {
      return { totalDpp: 0, totalPpn: 0, total: 0 };
    }

    const totalDpp = data_billingItem
      .filter((item) => {
        const itemName = (item.productName || "").toLowerCase();
        return !itemName.includes("ppn");
      })
      .reduce((sum, item) => sum + (item.total || 0), 0);

    const totalPpn = data_billingItem
      .filter((item) => {
        const itemName = (item.productName || "").toLowerCase();
        return itemName.includes("ppn");
      })
      .reduce((sum, item) => sum + (item.total || 0), 0);

    const total = totalDpp + totalPpn;

    return { totalDpp, totalPpn, total };
  };

  const totals = calculateTotals();
  const currency = data_billingItem?.[0]?.currency || "IDR";

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Generate XML E-Faktur"
        handleCancel={handleCancel}
        width={900}
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
                disabled={!efakturDetail?.efakturId}
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
                  type="primary"
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
        <Spin spinning={loading_modal || loading_detail || isGenerating}>
          <div className="my-6">
            {!loading_detail && !efakturDetail && (
              <Alert
                message="E-Faktur Belum Dibuat"
                description="E-Faktur untuk billing ini belum dibuat. Silakan buat E-Faktur terlebih dahulu sebelum generate XML."
                type="warning"
                showIcon
                className="mb-6"
              />
            )}

            {billingData && efakturDetail && (
              <>
                <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
                  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                    Informasi Billing
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <DetailText label="Billing Code">
                      {billingData.billingCode}
                    </DetailText>
                    <DetailText label="Invoice Number">
                      {efakturDetail.invoiceNumber || billingData.invoiceNumber || "-"}
                    </DetailText>
                    <DetailText label="Customer">
                      {billingData.customerName}
                    </DetailText>
                    <DetailText label="Account Number">
                      {billingData.accountNumber}
                    </DetailText>
                    <DetailText label="Invoice Date">
                      {billingData.invoiceDate}
                    </DetailText>
                    <DetailText label="Billing Period">
                      {billingData.billingPeriod || "-"}
                    </DetailText>
                    <DetailText label="E-Faktur Status">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-100 text-orange-800 border-orange-300">
                        {efakturDetail.efakturStatus?.replace(/_/g, " ")}
                      </span>
                    </DetailText>
                    {efakturDetail.efakturNo && (
                      <DetailText label="No. E-Faktur">
                        {efakturDetail.efakturNo}
                      </DetailText>
                    )}
                  </div>
                </div>

                {efakturDetail && (
                  <div className="mb-6 p-5 bg-purple-50 border-2 border-purple-300 rounded-lg">
                    <h3 className="text-base font-bold text-purple-800 mb-4 pb-2 border-b-2 border-purple-200">
                      Informasi Customer
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <DetailText label="Customer Name">
                        {efakturDetail.customerName || "-"}
                      </DetailText>
                      <DetailText label="NPWP">
                        {efakturDetail.customerNpwp || "-"}
                      </DetailText>
                      <DetailText label="Address">
                        {efakturDetail.customerAddress || "-"}
                      </DetailText>
                      <DetailText label="Email">
                        {efakturDetail.customerEmail || "-"}
                      </DetailText>
                    </div>
                  </div>
                )}

                {data_billingItem && data_billingItem.length > 0 && (
                  <div className="mb-6 p-5 bg-white border-2 border-gray-300 rounded-lg">
                    <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                      Rincian Barang/Jasa
                    </h3>
                    <Table
                      dataSource={data_billingItem}
                      columns={columnsItems}
                      pagination={false}
                      size="small"
                      bordered
                      scroll={{ x: 700 }}
                    />
                  </div>
                )}

                {data_billingItem.length > 0 && (
                  <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-200">
                      Ringkasan ({currency})
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-medium">Total DPP (Tanpa PPN):</span>
                        <span className="font-semibold">
                          {currency === "USD" ? "$" : "Rp"}{" "}
                          {totals.totalDpp.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-medium">Total PPN:</span>
                        <span className="font-semibold">
                          {currency === "USD" ? "$" : "Rp"}{" "}
                          {totals.totalPpn.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-medium">Total PPnBM:</span>
                        <span className="font-semibold">Rp 0</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 pb-2 px-3 border-t-2 border-blue-300 bg-blue-100 rounded">
                        <span className="text-base font-bold text-blue-900">
                          Total Nilai:
                        </span>
                        <span className="text-xl font-bold text-blue-700">
                          {currency === "USD" ? "$" : "Rp"}{" "}
                          {totals.total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {xmlContent && (
                  <div className="mt-6">
                    <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                      <FileTextOutlined /> XML Generated Successfully
                    </h3>
                    <Alert
                      message="XML berhasil di-generate"
                      description="File XML sudah siap untuk diunduh dan digunakan di aplikasi e-Faktur DJP."
                      type="success"
                      showIcon
                      className="mb-4"
                    />
                    <div className="rounded-lg border-2 border-green-300 bg-white shadow-md overflow-hidden">
                      <div className="flex justify-between items-center px-4 py-3 border-b-2 border-green-200 bg-green-50">
                        <p className="text-sm font-bold text-green-800">
                          XML Preview ({xmlContent.length.toLocaleString()} characters)
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

                      <div className="p-4 bg-gray-900 text-green-400 font-mono text-xs overflow-auto max-h-96">
                        <pre className="whitespace-pre-wrap break-words">
                          {xmlContent}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {!xmlContent && efakturDetail?.efakturId && (
                  <Alert
                    message="Siap Generate XML"
                    description={
                      <div>
                        <p>E-Faktur ID: <strong>{efakturDetail.efakturId}</strong></p>
                        <p className="mt-2">Klik tombol "Generate XML" untuk membuat file XML yang dapat digunakan di aplikasi e-Faktur DJP.</p>
                      </div>
                    }
                    type="info"
                    showIcon
                    className="mt-6"
                  />
                )}
              </>
            )}
          </div>
        </Spin>
      </ModalCustom>

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