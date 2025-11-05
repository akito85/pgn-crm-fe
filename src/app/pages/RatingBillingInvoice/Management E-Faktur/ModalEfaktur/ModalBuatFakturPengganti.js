import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Table, DatePicker, Spin } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../../assets/Icon/index";
import moment from "moment";

const ModalBuatFakturPengganti = ({
  isOpen = false,
  handleClose = () => {},
  noFakturAsli = "",
  onSuccess = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.billing);

  // Dummy data faktur asli
  const [dataFakturAsli, setDataFakturAsli] = useState(null);

  useEffect(() => {
    if (isOpen && noFakturAsli) {
      // TODO: Fetch data faktur asli
      // dispatch(getDetailEFaktur(noFakturAsli));
      
      // Dummy data
      const dummyData = {
        noFaktur: noFakturAsli,
        pelanggan: "PT Industri Maju",
        tanggalFaktur: "28 Sep 2025",
        items: [
          {
            key: 1,
            produkJasa: "Pemakaian Gas Industri",
            kuantitas: 510,
            hargaSatuan: 10000,
            total: 5100000,
          },
        ],
      };
      
      setDataFakturAsli(dummyData);
      form.setFieldsValue({
        noFakturAsli: dummyData.noFaktur,
        pelanggan: dummyData.pelanggan,
        tanggalFakturPengganti: moment(),
        alasanPenggantian: "Koreksi jumlah pemakaian gas.",
      });
    }
  }, [isOpen, noFakturAsli, form]);

  const handleCancel = () => {
    form.resetFields();
    setDataFakturAsli(null);
    handleClose();
  };

  const handleSubmit = (values) => {
    const body = {
      noFakturAsli: values.noFakturAsli,
      pelanggan: values.pelanggan,
      tanggalFakturPengganti: values.tanggalFakturPengganti.format("YYYY-MM-DD"),
      alasanPenggantian: values.alasanPenggantian,
      items: dataFakturAsli?.items || [],
    };

    console.log("Buat Faktur Pengganti:", body);

    // TODO: Dispatch action
    // dispatch(buatFakturPengganti(body))
    //   .unwrap()
    //   .then(() => {
    //     onSuccess();
    //     handleCancel();
    //   });

    // Simulasi success
    setTimeout(() => {
      alert("Faktur Pengganti berhasil dibuat!");
      onSuccess();
      handleCancel();
    }, 500);
  };

  const columnsItems = [
    {
      title: "Produk/Jasa",
      dataIndex: "produkJasa",
      key: "produkJasa",
      width: 300,
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
      width: 150,
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

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header="Buat Faktur Pengganti"
      handleCancel={handleCancel}
      width={900}
      footer={
        <div className="flex justify-end gap-3">
          <ButtonComponent type="default" onClick={handleCancel}>
            Batal
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            htmlType="submit"
            form="formFakturPengganti"
          >
            Simpan Faktur Pengganti
          </ButtonComponent>
        </div>
      }
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          id="formFakturPengganti"
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Informasi Faktur Asli */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-bold text-blue-700 mb-4">
              Informasi Faktur Asli
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Menggantikan Faktur No:" name="noFakturAsli">
                <InputComponent
                  disabled
                  suffix={
                    <span className="text-xs text-gray-500">(Read-only)</span>
                  }
                />
              </Form.Item>
              <Form.Item label="Pelanggan:" name="pelanggan">
                <InputComponent
                  disabled
                  suffix={
                    <span className="text-xs text-gray-500">(Read-only)</span>
                  }
                />
              </Form.Item>
            </div>
          </div>

          {/* Informasi Baru */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-bold text-blue-700 mb-4">
              Informasi Baru
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Tanggal Faktur Pengganti:"
                name="tanggalFakturPengganti"
                rules={[
                  {
                    required: true,
                    message: "Tanggal faktur pengganti wajib diisi",
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Pilih tanggal"
                />
              </Form.Item>
              <Form.Item
                label="Alasan Penggantian:"
                name="alasanPenggantian"
                rules={[
                  {
                    required: true,
                    message: "Alasan penggantian wajib diisi",
                  },
                ]}
              >
                <InputComponent placeholder="Koreksi jumlah pemakaian gas." />
              </Form.Item>
            </div>
          </div>

          {/* Rincian Item */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-blue-700 mb-4">
              Rincian Item (Dapat Diedit)
            </h3>
            {dataFakturAsli?.items && (
              <Table
                dataSource={dataFakturAsli.items}
                columns={columnsItems}
                pagination={false}
                size="middle"
                bordered
                scroll={{ x: 700 }}
              />
            )}
          </div>

          {/* Note */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Catatan:</strong> Faktur pengganti akan menggantikan
              faktur asli. Pastikan semua informasi sudah benar sebelum
              menyimpan.
            </p>
          </div>
        </Form>
      </Spin>
    </ModalCustom>
  );
};

export default ModalBuatFakturPengganti;