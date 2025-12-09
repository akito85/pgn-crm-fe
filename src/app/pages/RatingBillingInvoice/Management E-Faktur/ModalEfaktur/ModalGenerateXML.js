import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Alert, Steps, message } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  CopyOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import StatusComponent from "../../../../../components/StatusComponent";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import {
  generateXMLEFaktur,
  getAvailableRequestedList,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { Step } = Steps;

const ModalGenerateXML = ({
  isOpen = false,
  handleClose = () => {},
  onSuccess = () => {},
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // Redux state
  const {
    data_available_requested,
    loading_available_requested,
    loading_modal,
    pagination_available_requested,
  } = useSelector((state) => state.efaktur);

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [xmlContent, setXmlContent] = useState("");
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("invoiceDate");
  const [orderSort, setOrderSort] = useState("desc");
  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
  });

  // Fetch data when modal opens or pagination/sort changes
  useEffect(() => {
    if (isOpen) {
      const sortParam =
        fieldSort && orderSort
          ? `${fieldSort}~${orderSort}`
          : "invoiceDate~desc";

      dispatch(
        getAvailableRequestedList({
          page: page,
          pageSize: pageSize,
          type: "manual_upload",
          sort: sortParam,
          search: searchText,
        })
      );
    }
  }, [isOpen, page, pageSize, fieldSort, orderSort, searchText, dispatch]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setSelectedRowKeys([]);
      setSelectedRecords([]);
      setXmlContent("");
      setCopied(false);
      setPage(1);
      setPageSize(10);
      setSearchText("");
      setSearchedColumn("");
      setFieldSort("invoiceDate");
      setOrderSort("desc");
    }
  }, [isOpen]);

  const formatXML = (xmlString) => {
    try {
      let formatted = xmlString.trim();
      formatted = formatted.replace(/></g, ">\n<");

      let indent = 0;
      const lines = formatted.split("\n");

      formatted = lines
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return "";

          if (trimmed.startsWith("</")) {
            indent = Math.max(0, indent - 1);
          }

          const indentation = "  ".repeat(indent);

          if (
            trimmed.startsWith("<") &&
            !trimmed.startsWith("</") &&
            !trimmed.endsWith("/>") &&
            !trimmed.match(/<[^>]+>[^<]*<\/[^>]+>/)
          ) {
            indent++;
          }

          return indentation + trimmed;
        })
        .filter((line) => line !== "")
        .join("\n");

      return formatted;
    } catch (error) {
      return xmlString;
    }
  };

  const handleGenerateXML = async () => {
    if (selectedRecords.length === 0) {
      setErrorMessage("Tidak ada E-Faktur yang dipilih");
      setModalError(true);
      return;
    }

    try {
      const efakturIds = selectedRecords.map((record) =>
        String(record.efakturId)
      );

      const result = await dispatch(
        generateXMLEFaktur({ efakturIds })
      ).unwrap();

      const xmlString = result.xmlContent || "";

      if (!xmlString || xmlString.trim().length === 0) {
        throw new Error("XML content kosong dari backend");
      }

      const trimmedXml = xmlString.trim();
      if (!trimmedXml.startsWith("<")) {
        throw new Error("Format XML tidak valid dari backend");
      }

      const formattedXml = formatXML(xmlString);
      setXmlContent(formattedXml);

      message.success(
        `Berhasil generate XML untuk ${selectedRecords.length} E-Faktur!`
      );
      setCurrentStep(1);
    } catch (error) {
      let errorMsg = "Gagal generate XML E-Faktur";

      if (error?.message) {
        errorMsg = error.message;
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }

      setErrorMessage(errorMsg);
      setModalError(true);
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
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          message.success("XML berhasil di-copy ke clipboard");

          setTimeout(() => {
            setCopied(false);
          }, 2000);
        } else {
          throw new Error("Copy command failed");
        }
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
        type: "application/xml;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      const fileName = `E-Faktur_Manual_Upload_${selectedRecords.length}_${timestamp}.xml`;

      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success(`File ${fileName} berhasil diunduh`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error("Gagal mengunduh file XML");
    }
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setSelectedRowKeys([]);
    setSelectedRecords([]);
    setXmlContent("");
    setCopied(false);
    handleClose();
  };

  const handlePrevious = () => {
    setCurrentStep(0);
    setXmlContent("");
  };

  // Table handlers
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
    // Reset selection when page changes
    setSelectedRowKeys([]);
    setSelectedRecords([]);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("invoiceDate");
      setOrderSort("desc");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRecords(newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    fixed: true,
  };

  // Columns definition
  const baseColumns = useMemo(
    () => [
      {
        title: "NO",
        dataIndex: "no",
        key: "no",
        width: 60,
        align: "center",
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "FAKTUR CODE",
        dataIndex: "efakturNo",
        key: "efakturNo",
        width: 150,
        sorter: true,
        render: (text) => text || "-",
      },
      {
        title: "FAKTUR TYPE",
        dataIndex: "type",
        key: "type",
        width: 140,
        align: "center",
        sorter: true,
        render: (type) => {
          if (!type) return "-";

          const displayType = (type || "STANDARD").toUpperCase();
          const statusLabel = displayType.replace(/_/g, " ");

          return (
            <div className="flex justify-center">
              <StatusComponent colour={displayType.toLowerCase()}>
                {statusLabel}
              </StatusComponent>
            </div>
          );
        },
      },
      {
        title: "BILLING CODE",
        dataIndex: "billingCode",
        key: "billingCode",
        width: 150,
        sorter: true,
      },
      {
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 150,
        sorter: true,
      },
      {
        title: "INVOICE DATE",
        dataIndex: "invoiceDate",
        key: "invoiceDate",
        width: 150,
        sorter: true,
      },
      {
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        key: "accountNumber",
        width: 150,
        sorter: true,
      },
      {
        title: "ACCOUNT NAME",
        dataIndex: "accountName",
        key: "accountName",
        width: 200,
      },
      {
        title: "STATUS PJAP",
        dataIndex: "statusPjap",
        key: "statusPjap",
        width: 130,
        align: "center",
        sorter: true,
        render: (statusPjap, record) => {
          const displayStatus = statusPjap || record.status;
          if (!displayStatus) return "-";

          const upperStatus = displayStatus.toUpperCase();
          const statusLabel = upperStatus.replace(/_/g, " ");

          return (
            <div className="flex justify-center">
              <StatusComponent colour={displayStatus.toLowerCase()}>
                {statusLabel}
              </StatusComponent>
            </div>
          );
        },
      },
    ],
    [page, pageSize]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  // Data source with keys
  const dataSource = useMemo(() => {
    return data_available_requested.map((item, idx) => ({
      ...item,
      key: item.efakturId || idx,
    }));
  }, [data_available_requested]);

  const getFooter = () => {
    if (currentStep === 0) {
      return (
        <div className="flex justify-end gap-3">
          <ButtonComponent type="default" onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type="default"
            className={"bg-red-500"}
            onClick={handleGenerateXML}
            loading={loading_modal}
            icon={<FileTextOutlined />}
            disabled={selectedRowKeys.length === 0}
          >
            Next
          </ButtonComponent>
        </div>
      );
    }

    return (
      <div className="flex justify-between">
        <ButtonComponent
          type="default"
          onClick={handlePrevious}
          icon={<ArrowLeftOutlined />}
        >
          Previous
        </ButtonComponent>
        <div className="flex gap-3">
          <ButtonComponent
            type="default"
            onClick={handleCopyXML}
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            style={copied ? { borderColor: "#52c41a", color: "#52c41a" } : {}}
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
        </div>
      </div>
    );
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="GENERATE XML FOR E-FAKTUR (MANUAL UPLOAD)"
        handleCancel={handleCancel}
        width={1000}
        footer={getFooter()}
      >
        <Spin spinning={loading_available_requested || loading_modal}>
          <div className="my-6">
            {/* Steps */}
            <div className="mb-6">
              <Steps current={currentStep} className="px-12">
                <Step title="E-FAKTUR" icon={<FileTextOutlined />} />
                <Step title="CONFIRMATION" icon={<CheckOutlined />} />
              </Steps>
            </div>

            {/* Step 1: E-Faktur List */}
            {currentStep === 0 && (
              <>
                {/* Info Box */}
                <Alert
                  message="Info: Generate XML untuk Manual Upload"
                  description="Pilih E-Faktur dengan type manual_upload yang sudah tersedia untuk di-generate XML-nya."
                  type="info"
                  showIcon
                  className="mb-4"
                />

                {/* Table */}
                <TableRBI
                  dataSource={dataSource}
                  columns={processedColumns}
                  current={page}
                  pageSize={pageSize}
                  onChange={handleChange}
                  onSizeChanger={handleChange}
                  totalData={pagination_available_requested.totalElements}
                  tableScrolled={{ y: 400, x: 1200 }}
                  onSort={onSort}
                  columnDefinitions={columnDefinitions}
                  fixedColumns={fixedColumns}
                  setFixedColumns={setFixedColumns}
                  loading={loading_available_requested}
                  rowSelection={rowSelection}
                />

                {/* Info Badge */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Type:</strong> Manual Upload •
                    <strong> Total:</strong>{" "}
                    {pagination_available_requested.totalElements} entries •
                    <strong> Page:</strong> {page} of{" "}
                    {pagination_available_requested.totalPages} •
                    <strong> Selected:</strong> {selectedRowKeys.length}{" "}
                    E-Faktur
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Confirmation */}
            {currentStep === 1 && (
              <div>
                <Alert
                  message="XML berhasil di-generate"
                  description={`File XML untuk ${selectedRecords.length} E-Faktur sudah siap untuk diunduh dan digunakan di aplikasi e-Faktur DJP.`}
                  type="success"
                  showIcon
                  className="mb-6"
                />

                {/* Selected E-Faktur Summary */}
                <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
                  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                    E-Faktur yang Diproses ({selectedRecords.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedRecords.slice(0, 10).map((record, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {idx + 1}. {record.billingCode}
                        </span>
                        <span className="font-medium">
                          {record.invoiceNumber || "-"}
                        </span>
                      </div>
                    ))}
                    {selectedRecords.length > 10 && (
                      <div className="col-span-2 text-center text-sm text-gray-500">
                        ... dan {selectedRecords.length - 10} lainnya
                      </div>
                    )}
                  </div>
                </div>

                {/* XML Preview */}
                {xmlContent && (
                  <div>
                    <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                      <FileTextOutlined /> XML Generated Successfully
                    </h3>
                    <div className="rounded-lg border-2 border-green-300 bg-white shadow-md overflow-hidden">
                      <div className="flex justify-between items-center px-4 py-3 border-b-2 border-green-200 bg-green-50">
                        <p className="text-sm font-bold text-green-800">
                          XML Preview ({xmlContent.length.toLocaleString()}{" "}
                          characters)
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
              </div>
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
