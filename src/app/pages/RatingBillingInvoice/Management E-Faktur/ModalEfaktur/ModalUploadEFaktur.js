import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Upload, Alert, DatePicker, Spin } from "antd";
import {
  InboxOutlined,
  FileOutlined,
} from "@ant-design/icons";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import DetailText from "../../../../../components/DetailText";
import { 
  ModalError, 
  ModalSuccess 
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import {
  uploadManualEFaktur,
  getDetailEFaktur,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { Dragger } = Upload;

const ModalUploadEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  billingData = null,
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  const { 
    loading_modal, 
    loading_detail,
    detail_efaktur 
  } = useSelector((state) => state.efaktur);

  // State
  const [fileList, setFileList] = useState([]);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [efakturDetail, setEfakturDetail] = useState(null);

  // Load E-Faktur detail ketika modal dibuka
  useEffect(() => {
    if (isOpen && billingData?.billingCode) {
      
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

  // Update efaktur detail dari Redux state
  useEffect(() => {
    if (detail_efaktur) {
      setEfakturDetail(detail_efaktur);
    }
  }, [detail_efaktur]);

  // Props untuk Upload
  const uploadProps = {
    name: "file",
    multiple: false, 
    accept: ".pdf",
    fileList: fileList,
    maxCount: 1,
    beforeUpload: (file) => {
  
      const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
      if (!isPDF) {
        setErrorMessage("Hanya file PDF yang diperbolehkan!");
        setErrorDetails([{ efakturFile: "Efaktur file must be pdf" }]);
        setModalError(true);
        return false;
      }

      // Validasi ukuran file (max 10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        setErrorMessage("File tidak boleh lebih dari 10MB!");
        setModalError(true);
        return false;
      }

      setFileList([file]);
      return false; 
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  // Handle Upload
  const handleUpload = async (formValues) => {
    if (fileList.length === 0) {
      setErrorMessage("Silakan pilih file terlebih dahulu!");
      setModalError(true);
      return;
    }

    if (!efakturDetail?.efakturId) {
      setErrorMessage("E-Faktur ID tidak ditemukan. Pastikan E-Faktur sudah dibuat.");
      setModalError(true);
      return;
    }


    if (!formValues.efakturDate) {
      setErrorMessage("Tanggal E-Faktur wajib diisi!");
      setModalError(true);
      return;
    }

    if (!formValues.efakturNo) {
      setErrorMessage("Nomor E-Faktur wajib diisi!");
      setModalError(true);
      return;
    }

    try {
      const payload = {
        efakturId: efakturDetail.efakturId,
        efakturFile: fileList[0], 
        efakturDate: moment(formValues.efakturDate).format("YYYY-MM-DD"),
        efakturNo: formValues.efakturNo,
      };


      await dispatch(uploadManualEFaktur(payload)).unwrap();

      setModalSuccess(true);
    } catch (error) {

      if (error?.data && Array.isArray(error.data)) {
        setErrorDetails(error.data);
        setErrorMessage(error.message || "Validation error");
      } else {
        setErrorMessage(error?.message || "Gagal upload E-Faktur");
      }
      
      setModalError(true);
    }
  };

  const handleCancel = () => {
    if (loading_modal) return; // Prevent closing while uploading

    form.resetFields();
    setFileList([]);
    setErrorDetails([]);
    setEfakturDetail(null);
    handleClose();
  };

  // Handle Success Modal Close
  const handleSuccessClose = () => {
    setModalSuccess(false);
    onSuccess();
    handleCancel();
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Upload E-Faktur Manual dari DJP"
        handleCancel={handleCancel}
        width={700}
        footer={
          <div className="flex justify-end gap-3">
            <ButtonComponent
              type="default"
              onClick={handleCancel}
              disabled={loading_modal}
            >
              Batal
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              htmlType="submit"
              form="formUploadEfaktur"
              loading={loading_modal}
              disabled={fileList.length === 0 || loading_modal || !efakturDetail?.efakturId}
            >
              {loading_modal ? "Uploading..." : "Upload"}
            </ButtonComponent>
          </div>
        }
      >
        <Spin spinning={loading_detail || loading_modal}>
          <div className="my-6">
            {/* Alert jika E-Faktur belum ada */}
            {!loading_detail && !efakturDetail && (
              <Alert
                message="E-Faktur Belum Dibuat"
                description="E-Faktur untuk billing ini belum dibuat. Silakan buat E-Faktur terlebih dahulu."
                type="warning"
                showIcon
                className="mb-6"
              />
            )}

            {/* Informasi Billing */}
            {billingData && efakturDetail && (
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
                  <DetailText label="Status E-Faktur">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-100 text-red-800 border-red-300">
                      {billingData.efakturStatus || "FAILED"}
                    </span>
                  </DetailText>
                  <DetailText label="Total Amount">
                    Rp{" "}
                    {billingData.totalAmountEqvIdr?.toLocaleString("id-ID") || "0"}
                  </DetailText>
                </div>
              </div>
            )}

            {efakturDetail?.efakturId && (
              <Form 
                form={form} 
                layout="vertical" 
                id="formUploadEfaktur"
                onFinish={handleUpload}
              >
                {/* Nomor E-Faktur */}
                <Form.Item
                  label="Nomor E-Faktur"
                  name="efakturNo"
                  rules={[
                    { required: true, message: "Nomor E-Faktur wajib diisi!" },
                    { 
                      pattern: /^[0-9]+$/, 
                      message: "Nomor E-Faktur hanya boleh berisi angka!" 
                    },
                  ]}
                >
                  <InputComponent
                    placeholder="Contoh: 00004092893220241216000270"
                    disabled={loading_modal}
                  />
                </Form.Item>

                {/* Tanggal E-Faktur */}
                <Form.Item
                  label="Tanggal E-Faktur"
                  name="efakturDate"
                  rules={[
                    { required: true, message: "Tanggal E-Faktur wajib diisi!" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    placeholder="Pilih tanggal E-Faktur"
                    disabled={loading_modal}
                  />
                </Form.Item>

                {/* Upload File */}
                <Form.Item 
                  label="Upload File E-Faktur (PDF)"
                  required
                >
                  <Dragger {...uploadProps} disabled={loading_modal}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ color: "#1890ff" }} />
                    </p>
                    <p className="ant-upload-text">
                      Klik atau drag file ke area ini untuk upload
                    </p>
                    <p className="ant-upload-hint">
                      Hanya file PDF yang diperbolehkan. Maksimal ukuran 10MB.
                    </p>
                  </Dragger>
                </Form.Item>

                {/* File Preview */}
                {fileList.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <p className="text-sm font-bold text-blue-800 mb-2">
                      File yang akan diupload:
                    </p>
                    <div className="flex items-center gap-3 p-3 bg-white border border-blue-200 rounded">
                      <FileOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{fileList[0].name}</p>
                        <p className="text-xs text-gray-500">
                          {(fileList[0].size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                        PDF
                      </span>
                    </div>
                  </div>
                )}
              </Form>
            )}

            {/* Panduan Upload */}
            {efakturDetail?.efakturId && (
              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <h4 className="font-bold text-sm text-yellow-800 mb-3">
                  📋 Panduan Upload E-Faktur Manual:
                </h4>
                <ul className="text-xs text-yellow-700 space-y-2 list-disc list-inside">
                  <li>
                    Download file E-Faktur (PDF) dari aplikasi e-Faktur DJP CoreTax
                  </li>
                  <li>
                    Pastikan format file adalah <strong>PDF</strong> dengan ukuran maksimal 10MB
                  </li>
                  <li>
                    Isi <strong>Nomor E-Faktur</strong> sesuai yang tertera di file PDF
                  </li>
                  <li>
                    Pilih <strong>Tanggal E-Faktur</strong> sesuai tanggal penerbitan
                  </li>
                  <li>
                    File akan disimpan dan status E-Faktur akan berubah dari FAILED → APPROVED
                  </li>
                  <li>
                    Setelah upload berhasil, file dapat diakses melalui menu detail E-Faktur
                  </li>
                </ul>
              </div>
            )}

            {/* Info E-Faktur ID */}
            {efakturDetail?.efakturId && (
              <Alert
                message="Ready to Upload"
                description={
                  <div>
                    <p>E-Faktur ID: <strong>{efakturDetail.efakturId}</strong></p>
                    <p className="mt-1">Silakan lengkapi form di atas dan upload file E-Faktur.</p>
                  </div>
                }
                type="info"
                showIcon
                className="mt-4"
              />
            )}
          </div>
        </Spin>
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
            E-Faktur manual berhasil diupload.
          </p>
          <p className="pl-[70px] font-semibold text-green-700 mt-2">
            Status E-Faktur telah diperbarui.
          </p>
          <p className="pl-[70px] text-sm text-gray-600 mt-1">
            File dapat diakses melalui detail E-Faktur.
          </p>
        </div>
      </ModalSuccess>

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={() => {
          setModalError(false);
          setErrorDetails([]);
        }}
        handleCancel={() => {
          setModalError(false);
          setErrorDetails([]);
        }}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">Upload Gagal</p>
          </div>
          <p className="pl-[70px]">{errorMessage}</p>
          
          {errorDetails.length > 0 && (
            <div className="pl-[70px] mt-3">
              <p className="text-sm font-semibold text-red-600 mb-2">
                Detail Error:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {errorDetails.map((error, index) => (
                  <li key={index}>
                    {Object.entries(error).map(([field, message]) => (
                      <span key={field}>
                        <strong>{field}:</strong> {message}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="pl-[70px] mt-2">Silakan coba lagi.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalUploadEFaktur;