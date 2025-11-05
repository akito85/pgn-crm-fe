import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Table } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
// import { getLogAktivitasEFaktur } from "../../../../redux/slices/rating_billing_invoice/efakturSlice";

const LogAktivitasEFaktur = ({
  isOpen = false,
  handleClose = () => {},
  billingCode = "", // ✅ Sesuaikan dengan props dari ViewFaktur
}) => {
  // Selector - ambil dari efaktur slice
  const { list_log_aktivitas, loading_log } = useSelector((state) => state.efaktur);

  // Declaration
  const dispatch = useDispatch();

  // Use Effect - Fetch log data ketika modal dibuka
  // useEffect(() => {
  //   if (isOpen && billingCode) {
  //     // Dispatch action untuk fetch log aktivitas
  //     dispatch(getLogAktivitasEFaktur(billingCode));
  //   }
  // }, [isOpen, billingCode, dispatch]);

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
        <Spin spinning={loading_log}>
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-primary">
                Log Aktivitas E-Faktur: {billingCode}
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
                dataSource={list_log_aktivitas}
                columns={columnsLog}
                pagination={false}
                scroll={{ y: 400, x: 900 }}
                size="small"
                bordered
                locale={{
                  emptyText: "Belum ada log aktivitas untuk billing ini"
                }}
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
              Tutup
            </ButtonComponent>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default LogAktivitasEFaktur;