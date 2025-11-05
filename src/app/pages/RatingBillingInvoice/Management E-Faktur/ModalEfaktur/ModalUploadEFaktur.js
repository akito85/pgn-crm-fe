import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Upload, Alert, Progress, Table } from "antd";
import {
  InboxOutlined,
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import { ModalError, ModalSuccess } from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
// import { uploadEFakturFromDJP } from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { Dragger } = Upload;

const ModalUploadEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  billingData = null, 
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading_modal } = useSelector((state) => state.efaktur);

  // State
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // Props untuk Upload
  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".pdf,.xml",
    fileList: fileList,
    beforeUpload: (file) => {
      // Validasi ukuran file (max 10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        setErrorMessage("File tidak boleh lebih dari 10MB!");
        setModalError(true);
        return false;
      }

      // Validasi format file
      const isPDFOrXML =
        file.type === "application/pdf" || 
        file.type === "text/xml" || 
        file.type === "application/xml" ||
        file.name.endsWith(".xml") ||
        file.name.endsWith(".pdf");
      
      if (!isPDFOrXML) {
        setErrorMessage("Hanya file PDF atau XML yang diperbolehkan!");
        setModalError(true);
        return false;
      }

      setFileList([...fileList, file]);
      return false; 
    },
    onRemove: (file) => {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);
    },
  };

  // Handle Upload
  const handleUpload = () => {
    if (fileList.length === 0) {
      setErrorMessage("Silakan pilih file terlebih dahulu!");
      setModalError(true);
      return;
    }

    if (!billingData?.billingCode) {
      setErrorMessage("Data billing tidak valid!");
      setModalError(true);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Progress bar simulation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Prepare FormData
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("billingCode", billingData.billingCode);
    formData.append("keterangan", keterangan);

    // Dispatch action untuk upload
    dispatch(uploadEFakturFromDJP(formData))
      .unwrap()
      .then((response) => {
        clearInterval(interval);
        setUploadProgress(100);
        
        // Format uploaded files untuk ditampilkan
        const uploadResult = response.files.map((file, index) => ({
          key: index + 1,
          fileName: file.fileName,
          fileSize: file.fileSize,
          fileType: file.fileType,
          status: "success",
          url: file.url,
          uploadedAt: new Date(file.uploadedAt).toLocaleString("id-ID"),
        }));

        setUploadedFiles(uploadResult);
        setModalSuccess(true);
        setUploading(false);
      })
      .catch((error) => {
        clearInterval(interval);
        setErrorMessage(error?.message || "Gagal upload file");
        setModalError(true);
        setUploading(false);
        setUploadProgress(0);
      });
  };

  const handleCancel = () => {
    if (uploading) return; // Prevent closing while uploading
    
    form.resetFields();
    setFileList([]);
    setUploadedFiles([]);
    setUploadProgress(0);
    setKeterangan("");
    handleClose();
  };

  // Handle Success Modal Close
  const handleSuccessClose = () => {
    setModalSuccess(false);
    onSuccess();
    handleCancel();
  };

  // Columns untuk tabel hasil upload
  const columnsUploadResult = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "Nama File",
      dataIndex: "fileName",
      key: "fileName",
      width: 250,
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <FileOutlined style={{ color: "#1890ff" }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Tipe",
      dataIndex: "fileType",
      key: "fileType",
      width: 80,
      align: "center",
      render: (text) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            text === "PDF"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Ukuran",
      dataIndex: "fileSize",
      key: "fileSize",
      width: 100,
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status) =>
        status === "success" ? (
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />
        ) : (
          <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 20 }} />
        ),
    },
    {
      title: "Waktu Upload",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      width: 180,
    },
  ];

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Upload E-Faktur"
        handleCancel={handleCancel}
        width={800}
        footer={
          <div className="flex justify-end gap-3">
            <ButtonComponent 
              type="default" 
              onClick={handleCancel} 
              disabled={uploading}
            >
              {uploadedFiles.length > 0 ? "Tutup" : "Batal"}
            </ButtonComponent>
            {uploadedFiles.length === 0 && (
              <ButtonComponent
                type="submit"
                onClick={handleUpload}
                loading={uploading}
                disabled={fileList.length === 0 || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </ButtonComponent>
            )}
          </div>
        }
      >
        <div className="my-6">

          {/* Informasi Billing */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              Informasi Billing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Billing Code:
                </label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {billingData?.billingCode || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Customer:
                </label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {billingData?.customerName || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Status E-Faktur:
                </label>
                <p className="text-sm font-semibold text-gray-600 mt-1">
                  {billingData?.eFakturStatus || "FAILED"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Total Amount:
                </label>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  Rp {billingData?.totalAmountEqvIdrReal?.toLocaleString("id-ID") || "0"}
                </p>
              </div>
            </div>
          </div>

          <Form form={form} layout="vertical">
            {/* Upload Area */}
            <Form.Item label="Upload File E-Faktur (PDF/XML)">
              <Dragger {...uploadProps} disabled={uploading || uploadedFiles.length > 0}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: "#1890ff" }} />
                </p>
                <p className="ant-upload-text">
                  Klik atau drag file ke area ini untuk upload
                </p>
                <p className="ant-upload-hint">
                  Support untuk file PDF atau XML. Maksimal ukuran file 10MB.
                  <br />
                  Anda dapat mengupload multiple files sekaligus.
                </p>
              </Dragger>
            </Form.Item>

            {/* Keterangan */}
            <Form.Item label="Keterangan (Opsional)">
              <InputComponent
                type="textarea"
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Masukkan keterangan upload (opsional)"
                disabled={uploading || uploadedFiles.length > 0}
              />
            </Form.Item>

            {/* Progress Bar */}
            {uploading && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Upload Progress:
                </p>
                <Progress
                  percent={uploadProgress}
                  status={uploadProgress === 100 ? "success" : "active"}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#52c41a',
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Uploading {fileList.length} file(s)
                </p>
              </div>
            )}

            {/* File List Preview */}
            {fileList.length > 0 && !uploading && uploadedFiles.length === 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  File yang akan diupload ({fileList.length}):
                </p>
                <div className="space-y-2">
                  {fileList.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <FileOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          file.name.endsWith(".pdf")
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {file.name.endsWith(".pdf") ? "PDF" : "XML"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hasil Upload */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <Alert
                  message="Upload Berhasil!"
                  description={
                    <div>
                      <p className="mb-2">
                        {uploadedFiles.length} file berhasil diupload
                      </p>
                      <p className="font-semibold text-green-700">
                        Status E-Faktur akan berubah
                      </p>
                    </div>
                  }
                  type="success"
                  showIcon
                  className="mb-4"
                />
                <Table
                  dataSource={uploadedFiles}
                  columns={columnsUploadResult}
                  pagination={false}
                  size="small"
                  bordered
                  scroll={{ x: 800 }}
                />
              </div>
            )}
          </Form>

          {/* Panduan Upload */}
          {/* {uploadedFiles.length === 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-sm text-yellow-800 mb-2">
                Panduan Upload:
              </h4>
              <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                <li>
                  Download file E-Faktur (PDF/XML) dari aplikasi e-Faktur DJP CoreTax
                </li>
                <li>Pastikan file format PDF atau XML dengan ukuran maksimal 10MB</li>
                <li>
                  Anda dapat mengupload multiple files sekaligus (misal: PDF dan XML)
                </li>
                <li>File akan disimpan ke object storage (Min.io) dengan enkripsi</li>
                <li>
                  Status E-Faktur akan otomatis berubah dari FAILED → SUCCESS setelah upload berhasil
                </li>
                <li>
                  Setelah upload berhasil, file dapat diakses melalui menu detail E-Faktur
                </li>
              </ul>
            </div>
          )} */}
        </div>
      </ModalCustom>

      {/* Modal Success */}
      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={handleSuccessClose}
        handleCancel={() => setModalSuccess(false)}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_success"]}
            <p className="text-[18px] font-bold">Upload Berhasil</p>
          </div>
          <p className="pl-[70px]">
            {uploadedFiles.length} file E-Faktur berhasil diupload ke Min.io storage.
          </p>
          <p className="pl-[70px] font-semibold text-green-700">
            Status E-Faktur telah berubah menjadi SUCCESS.
          </p>
          <p className="pl-[70px] text-sm text-gray-600 mt-2">
            File dapat diakses melalui detail E-Faktur.
          </p>
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
            <p className="text-[18px] font-bold">Upload Gagal</p>
          </div>
          <p className="pl-[70px]">{errorMessage}</p>
          <p className="pl-[70px]">Silakan coba lagi.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalUploadEFaktur;