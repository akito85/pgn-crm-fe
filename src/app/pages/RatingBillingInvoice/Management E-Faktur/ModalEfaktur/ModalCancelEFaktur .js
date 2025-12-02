import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spin, Alert, Input } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import moment from "moment";
import { cancelEFaktur } from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";

const { TextArea } = Input;

const ModalCancelEFaktur = ({
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
        tanggalPembatalan: moment().format("DD-MM-YYYY"),
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
      cancelEFaktur({
        efakturId: billingData.efakturId,
        reason: values.reason,
        appHierId: 620,
      })
    ).unwrap();

    // Success
    onSuccess();
    handleCancel();
  } catch (error) {
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header="Pembatalan E-Faktur"
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
            form="formCancelFaktur"
            loading={isSubmitting || loading_modal}
            danger
          >
            Batalkan E-Faktur
          </ButtonComponent>
        </div>
      }
    >
      <Spin spinning={loading_modal}>
        <Form
          form={form}
          id="formCancelFaktur"
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Alert Warning */}
          <Alert
            message="Peringatan"
            description="E-Faktur yang sudah dibatalkan tidak dapat dikembalikan. Pastikan Anda yakin sebelum melanjutkan proses pembatalan."
            type="warning"
            showIcon
            className="mb-6"
          />

          {/* Informasi E-Faktur yang Akan Dibatalkan */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Informasi E-Faktur yang Akan Dibatalkan
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

          {/* Informasi Pembatalan */}
          <div className="mb-6 p-4 border border-red-200 rounded-lg">
            <h3 className="text-base font-semibold text-red-800 mb-4">
              Informasi Pembatalan
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Form.Item 
                label="Tanggal Pembatalan:" 
                name="tanggalPembatalan"
                tooltip="Tanggal otomatis diisi dengan tanggal hari ini"
              >
                <InputComponent
                  disabled
                  className="bg-gray-100"
                  suffix={<span className="text-xs text-gray-500">(Otomatis)</span>}
                />
              </Form.Item>
              <Form.Item
                label="Alasan Pembatalan:"
                name="reason"
                rules={[
                  {
                    required: true,
                    message: "Alasan pembatalan wajib diisi",
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
              >
                <TextArea
                  placeholder="Contoh: Pembatalan transaksi karena permintaan pelanggan"
                  rows={4}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </div>
          </div>

          {/* Critical Warning */}
          <div className="p-4 border-2 border-red-300 rounded-lg">
            <div className="flex gap-2">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </Form>
      </Spin>
    </ModalCustom>
  );
};

export default ModalCancelEFaktur;