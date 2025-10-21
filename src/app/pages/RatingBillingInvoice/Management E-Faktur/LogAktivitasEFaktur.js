import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Table } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";

const LogAktivitasEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  invoiceNumber = "",
  noFaktur = "",
}) => {
  // Selector
  const { loading } = useSelector((state) => state.billing);

  // Declaration
  const dispatch = useDispatch();

  // State
  const [logData, setLogData] = useState([]);

  // Dummy data untuk log aktivitas
  const dummyLogData = [
    {
      key: 1,
      waktu: "2025-09-28 11:00:00",
      pengguna: "supervisor01",
      aktivitas: "Menyetujui E-Faktur",
      catatan: "Data sudah sesuai.",
    },
    {
      key: 2,
      waktu: "2025-09-28 10:05:00",
      pengguna: "staff01",
      aktivitas: "Mengajukan Persetujuan",
      catatan: "-",
    },
    {
      key: 3,
      waktu: "2025-09-28 10:00:00",
      pengguna: "staff01",
      aktivitas: "Membuat E-Faktur",
      catatan: "Dibuat dari billing ID BILL-XYZ-123",
    },
  ];

  // Use Effect - Fetch log data ketika modal dibuka
  useEffect(() => {
    if (isOpen && noFaktur) {
      // TODO: Dispatch action untuk fetch log aktivitas
      // dispatch(getLogAktivitasEFaktur(noFaktur));
      
      // Sementara pakai dummy data
      setLogData(dummyLogData);
    }
  }, [isOpen, noFaktur]);

  // Columns untuk tabel log aktivitas
  const columnsLog = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Waktu",
      dataIndex: "waktu",
      key: "waktu",
      width: 180,
    },
    {
      title: "Pengguna",
      dataIndex: "pengguna",
      key: "pengguna",
      width: 150,
    },
    {
      title: "Aktivitas",
      dataIndex: "aktivitas",
      key: "aktivitas",
      width: 250,
    },
    {
      title: "Catatan",
      dataIndex: "catatan",
      key: "catatan",
      width: 300,
      render: (text) => text || "-",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] p-5">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[1000px] max-h-[90vh] flex flex-col overflow-hidden">
        <Spin spinning={loading}>
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-primary">
                Log Aktivitas E-Faktur: {noFaktur || invoiceNumber}
              </h2>
            </div>
            <ButtonComponent
              type="text"
              icon={<CloseOutlined style={{ fontSize: 20 }} />}
              onClick={handleClose}
            />
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Menampilkan riwayat semua aktivitas yang dilakukan pada E-Faktur ini
              </p>
            </div>

            {/* Tabel Log Aktivitas */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table
                dataSource={logData}
                columns={columnsLog}
                pagination={false}
                scroll={{ y: 400, x: 900 }}
                size="small"
                bordered
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-start">
            <ButtonComponent
              type="default"
              onClick={handleClose}
              icon={<SVGIcon name="IconArrowNarrowLeft" width={20} />}
            >
              Kembali ke Detail
            </ButtonComponent>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default LogAktivitasEFaktur;