import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Alert, Input } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import moment from "moment";
import { replaceEFaktur } from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { TextArea } = Input;

const ModalReplaceEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  billingData = null,
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading_modal } = useSelector((state) => state.efaktur);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && billingData) {
      // Set initial values
      form.setFieldsValue({
        efakturNo: billingData.efakturNo || "-",
        invoiceNumber: billingData.invoiceNumber || "-",
        billingCode: billingData.billingCode || "-",
        customerName: billingData.customerName || "-",
        tanggalPengganti: moment().format("DD-MM-YYYY"),
        reason: "",
      });
    }
  }, [isOpen, billingData, form]);

  const handleCancel = () => {
    form.resetFields();
    setIsSubmitting(false);
    handleClose();
  };

  const handleSubmit = async (values) => {
    if (!billingData?.efakturId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(
        replaceEFaktur({
          efakturId: billingData.efakturId,
          reason: values.reason,
        })
      ).unwrap();

      // Success
      onSuccess();
      handleCancel();
    } catch (error) {
      console.error("Replace error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header="Buat Faktur Pengganti"
      handleCancel={handleCancel}
      width={700}
      footer={
        <div className="flex justify-end gap-3">
          <ButtonComponent 
            type="default" 
            onClick={handleCancel}
            disabled={isSubmitting || loading_modal}
          >
            Batal
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            htmlType="submit"
            form="formReplaceFaktur"
            loading={isSubmitting || loading_modal}
          >
            Buat Faktur Pengganti
          </ButtonComponent>
        </div>
      }
    >
      <Spin spinning={loading_modal}>
        <Form
          form={form}
          id="formReplaceFaktur"
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Alert Info */}
          <Alert
            message="Informasi"
            description="Faktur pengganti akan dibuat untuk menggantikan faktur yang ada. Proses ini bersifat asynchronous dan akan memakan waktu beberapa saat."
            type="info"
            showIcon
            className="mb-6"
          />

          {/* Informasi Faktur yang Akan Diganti */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Informasi Faktur yang Akan Diganti
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="No. E-Faktur:" name="efakturNo">
                <InputComponent
                  disabled
                  className="bg-gray-100"
                />
              </Form.Item>
              <Form.Item label="Invoice Number:" name="invoiceNumber">
                <InputComponent
                  disabled
                  className="bg-gray-100"
                />
              </Form.Item>
              <Form.Item label="Billing Code:" name="billingCode">
                <InputComponent
                  disabled
                  className="bg-gray-100"
                />
              </Form.Item>
              <Form.Item label="Pelanggan:" name="customerName">
                <InputComponent
                  disabled
                  className="bg-gray-100"
                />
              </Form.Item>
            </div>
          </div>

          {/* Informasi Faktur Pengganti */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-base font-semibold text-blue-800 mb-4">
              Informasi Faktur Pengganti
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item 
                label="Tanggal Faktur Pengganti:" 
                name="tanggalPengganti"
                tooltip="Tanggal otomatis diisi dengan tanggal hari ini"
              >
                <InputComponent
                  disabled
                  className="bg-gray-100"
                  suffix={<span className="text-xs text-gray-500">(Otomatis)</span>}
                />
              </Form.Item>
              <Form.Item
                label="Alasan Penggantian:"
                name="reason"
                rules={[
                  {
                    required: true,
                    message: "Alasan penggantian wajib diisi",
                  },
                  {
                    min: 10,
                    message: "Alasan minimal 10 karakter",
                  },
                  {
                    max: 500,
                    message: "Alasan maksimal 500 karakter",
                  },
                ]}
                className="col-span-2"
              >
                <TextArea
                  placeholder="Contoh: Koreksi jumlah pemakaian gas karena kesalahan pencatatan"
                  rows={4}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </div>
          </div>

          {/* Warning Note */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-1">
                  Perhatian:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Faktur asli akan ditandai sebagai "Replaced" dan tidak dapat digunakan lagi</li>
                  <li>Faktur pengganti akan dibuat dengan status "PROCESSING"</li>
                  <li>Proses pembuatan akan berjalan di background, mohon tunggu hingga selesai</li>
                  <li>Pastikan alasan penggantian sudah benar sebelum submit</li>
                </ul>
              </div>
            </div>
          </div>
        </Form>
      </Spin>
    </ModalCustom>
  );
};

export default ModalReplaceEFaktur;